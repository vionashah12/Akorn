const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Store user sessions (in production, use Redis or database)
const userSessions = new Map();

// Google Calendar OAuth Configuration
// For development, you can use these test credentials or set your own via environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '123456789-abcdefghijklmnop.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'GOCSPX-your-secret-here';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:2025/api/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

// Google Calendar API scopes
const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
];

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'Akorn-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/syllabus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'syllabus.html'));
});

app.get('/applications', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'applications.html'));
});

app.get('/mascot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mascot.html'));
});

// Google Calendar OAuth Routes
app.get('/api/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    res.json({ authUrl });
});

app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.redirect('/dashboard?error=no_auth_code');
    }
    
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // Store tokens in session
        req.session.googleTokens = tokens;
        req.session.googleConnected = true;
        
        res.redirect('/dashboard?success=google_connected&tab=calendar&auto_sync=true');
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.redirect('/dashboard?error=oauth_failed');
    }
});

app.get('/api/google/status', (req, res) => {
    try {
        const isConnected = !!req.session.googleTokens;
        
        res.json({
            connected: isConnected,
            calendarId: req.session.assignmentsCalendarId || null
        });
    } catch (error) {
        console.error('Error checking Google Calendar status:', error);
        res.status(500).json({ error: 'Failed to check Google Calendar status' });
    }
});

app.get('/api/google/embed-url', (req, res) => {
    try {
        if (!req.session.googleTokens) {
            return res.status(400).json({ error: 'Google Calendar not connected' });
        }
        
        // Use the assignments calendar if available, otherwise use primary
        const calendarId = req.session.assignmentsCalendarId || 'primary';
        
        // Generate Google Calendar embed URL
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        
        // Google Calendar embed URL format
        const embedUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America%2FNew_York&mode=MONTH&year=${year}&month=${month}`;
        const calendarUrl = `https://calendar.google.com/calendar/u/0/r?tab=rc`;
        
        res.json({
            embedUrl,
            calendarUrl,
            calendarId
        });
    } catch (error) {
        console.error('Error generating embed URL:', error);
        res.status(500).json({ error: 'Failed to generate embed URL' });
    }
});

app.post('/api/google/sync-assignments', async (req, res) => {
    try {
        if (!req.session.googleTokens) {
            return res.status(400).json({ error: 'Google Calendar not connected' });
        }
        
        // Set credentials
        oauth2Client.setCredentials(req.session.googleTokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        // Get assignments from the request body
        const { assignments } = req.body;
        
        if (!assignments || !Array.isArray(assignments)) {
            return res.status(400).json({ error: 'Assignments array required' });
        }
        
        // First, try to find or create a dedicated "Canvas Assignments" calendar
        let assignmentsCalendarId = 'primary'; // Default to primary calendar
        
        try {
            // List calendars to find if we already have an assignments calendar
            const calendarsResponse = await calendar.calendarList.list();
            const assignmentsCalendar = calendarsResponse.data.items.find(
                cal => cal.summary === 'Canvas Assignments' || cal.summary === 'Akorn Assignments'
            );
            
            if (assignmentsCalendar) {
                assignmentsCalendarId = assignmentsCalendar.id;
            } else {
                // Create a new calendar for assignments
                const newCalendar = {
                    summary: 'Akorn Assignments',
                    description: 'Canvas assignments synced from Akorn app',
                    timeZone: 'America/New_York'
                };
                
                const createdCalendar = await calendar.calendars.insert({
                    resource: newCalendar
                });
                
                assignmentsCalendarId = createdCalendar.data.id;
                
                                    // Make the calendar public so it can be embedded and shared
                    await calendar.acl.insert({
                        calendarId: assignmentsCalendarId,
                        resource: {
                            scope: {
                                type: 'default'
                            },
                            role: 'reader'
                        }
                    });
                    
                    // Also set the calendar to be publicly accessible
                    await calendar.calendars.update({
                        calendarId: assignmentsCalendarId,
                        resource: {
                            summary: 'Akorn Assignments',
                            description: 'Canvas assignments synced from Akorn app',
                            timeZone: 'America/New_York',
                            accessRole: 'reader'
                        }
                    });
                    
                    // Make sure the calendar is publicly accessible for subscription
                    try {
                        await calendar.acl.insert({
                            calendarId: assignmentsCalendarId,
                            resource: {
                                scope: {
                                    type: 'default'
                                },
                                role: 'reader'
                            }
                        });
                    } catch (aclError) {
                        console.log('ACL already set or error:', aclError.message);
                    }
                
                // Make sure the calendar is publicly accessible for subscription
                try {
                    await calendar.acl.insert({
                        calendarId: assignmentsCalendarId,
                        resource: {
                            scope: {
                                type: 'default'
                            },
                            role: 'reader'
                        }
                    });
                } catch (aclError) {
                    console.log('ACL already set or error:', aclError.message);
                }
            }
        } catch (calendarError) {
            console.error('Error with calendar setup:', calendarError);
            // Fall back to primary calendar
            assignmentsCalendarId = 'primary';
        }
        
        const syncedEvents = [];
        
        for (const assignment of assignments) {
            if (!assignment.due_at) continue;
            
            const event = {
                summary: `📚 ${assignment.name} - ${assignment.course_name || 'Course'}`,
                description: `Assignment: ${assignment.name}\nCourse: ${assignment.course_name || 'Course'}\nPoints: ${assignment.points_possible || 'N/A'}\nStatus: ${assignment.status || 'Not Started'}`,
                start: {
                    dateTime: new Date(assignment.due_at).toISOString(),
                    timeZone: 'America/New_York',
                },
                end: {
                    dateTime: new Date(new Date(assignment.due_at).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
                    timeZone: 'America/New_York',
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 }, // 1 day before
                        { method: 'popup', minutes: 60 }, // 1 hour before
                    ],
                },
                colorId: getAssignmentColorId(assignment.status),
            };
            
            try {
                const response = await calendar.events.insert({
                    calendarId: assignmentsCalendarId,
                    resource: event,
                });
                
                syncedEvents.push({
                    assignment: assignment.name,
                    eventId: response.data.id,
                    status: 'success'
                });
            } catch (eventError) {
                console.error('Error creating calendar event:', eventError);
                syncedEvents.push({
                    assignment: assignment.name,
                    status: 'error',
                    error: eventError.message
                });
            }
        }
        
        // Store the calendar ID in session for future use
        req.session.assignmentsCalendarId = assignmentsCalendarId;
        
        res.json({ 
            success: true, 
            syncedEvents,
            calendarId: assignmentsCalendarId,
            message: `Successfully synced ${syncedEvents.filter(e => e.status === 'success').length} assignments to Google Calendar`
        });
        
    } catch (error) {
        console.error('Google Calendar sync error:', error);
        res.status(500).json({ error: 'Failed to sync assignments to Google Calendar' });
    }
});

// Helper function to get color ID based on assignment status
function getAssignmentColorId(status) {
    const colorMap = {
        'completed': '2', // Green
        'in_progress': '5', // Orange
        'missing': '11', // Red
        'not_started': '1' // Blue
    };
    return colorMap[status] || '1';
}

// Static files (after specific routes to avoid conflicts)
app.use(express.static('public'));

// Function to identify institution and mascot based on domain
function identifyInstitutionAndMascot(domain, lms) {
    const domainLower = domain.toLowerCase();
    
    // Institution and mascot database
    const institutionDatabase = {
        'canvas.instructure.com': {
            institution: 'Canvas LMS',
            mascot: 'Canvas Cat',
            mascot_name: 'Canvas Cat AI'
        },
        'osu.instructure.com': {
            institution: 'Ohio State University',
            mascot: 'Brutus the Buckeye',
            mascot_name: 'Brutus AI'
        },
        'umich.instructure.com': {
            institution: 'University of Michigan',
            mascot: 'Wolverine',
            mascot_name: 'Wolverine AI'
        },
        'berkeley.instructure.com': {
            institution: 'University of California, Berkeley',
            mascot: 'Oski the Bear',
            mascot_name: 'Oski AI'
        },
        'stanford.instructure.com': {
            institution: 'Stanford University',
            mascot: 'Tree',
            mascot_name: 'Tree AI'
        },
        'mit.instructure.com': {
            institution: 'Massachusetts Institute of Technology',
            mascot: 'Tim the Beaver',
            mascot_name: 'Tim AI'
        },
        'harvard.instructure.com': {
            institution: 'Harvard University',
            mascot: 'John Harvard',
            mascot_name: 'John AI'
        },
        'yale.instructure.com': {
            institution: 'Yale University',
            mascot: 'Handsome Dan',
            mascot_name: 'Dan AI'
        },
        'princeton.instructure.com': {
            institution: 'Princeton University',
            mascot: 'Tiger',
            mascot_name: 'Tiger AI'
        },
        'columbia.instructure.com': {
            institution: 'Columbia University',
            mascot: 'Roar-ee the Lion',
            mascot_name: 'Roar-ee AI'
        }
    };
    
    // Check for exact domain match
    if (institutionDatabase[domainLower]) {
        console.log('✅ Exact match found for domain:', domainLower);
        return institutionDatabase[domainLower];
    }
    
    // Check for partial domain matches (for subdomains)
    for (const [key, value] of Object.entries(institutionDatabase)) {
        const schoolCode = key.replace('.instructure.com', '');
        if (domainLower.includes(schoolCode)) {
            console.log('✅ Partial match found for domain:', domainLower, 'school code:', schoolCode);
            return value;
        }
    }
    
    // Check for common variations
    if (domainLower.includes('osu') || domainLower.includes('ohio') || domainLower.includes('buckeye')) {
        console.log('✅ Ohio State detected from domain:', domainLower);
        return {
            institution: 'Ohio State University',
            mascot: 'Brutus the Buckeye',
            mascot_name: 'Brutus AI'
        };
    }
    
    if (domainLower.includes('umich') || domainLower.includes('michigan')) {
        console.log('✅ Michigan detected from domain:', domainLower);
        return {
            institution: 'University of Michigan',
            mascot: 'Wolverine',
            mascot_name: 'Wolverine AI'
        };
    }
    
    // Default fallback
    return {
        institution: 'Your Institution',
        mascot: 'Academic Eagle',
        mascot_name: 'Academic AI'
    };
}

// LMS API Token Login Routes
app.post('/api/login', async (req, res) => {
    const { lms, domain, accessToken } = req.body;

    if (!lms || !domain || !accessToken) {
        return res.status(400).json({ error: 'LMS platform, domain, and access token are required' });
    }
    
    try {
        // Test the token by fetching user profile based on LMS
        let profileResponse;
        let apiEndpoint;
        
        switch (lms) {
            case 'canvas':
                apiEndpoint = `https://${domain}/api/v1/users/self/profile`;
                break;
            case 'blackboard':
                apiEndpoint = `https://${domain}/learn/api/public/v1/users/me`;
                break;
            case 'd2l':
                apiEndpoint = `https://${domain}/d2l/api/lp/1.0/users/whoami`;
                break;
            default:
                return res.status(400).json({ error: 'Unsupported LMS platform' });
        }
        
        profileResponse = await axios.get(apiEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const userProfile = profileResponse.data;
        
        // Extract email from Canvas profile
        let userEmail = 'No email available';
        if (lms === 'canvas' && userProfile.primary_email) {
            userEmail = userProfile.primary_email;
        } else if (userProfile.email) {
            userEmail = userProfile.email;
        } else if (userProfile.login_id && userProfile.login_id.includes('@')) {
            userEmail = userProfile.login_id;
        }
        
        // Identify institution and mascot based on domain
        console.log('🔍 Detecting institution for domain:', domain, 'LMS:', lms);
        const institutionInfo = identifyInstitutionAndMascot(domain, lms);
        console.log('🎓 Detected institution:', institutionInfo);
        
        // Enhance user profile with extracted email and institution info
        const enhancedProfile = {
            ...userProfile,
            email: userEmail,
            canvas_email: userEmail, // Store Canvas email specifically
            institution: institutionInfo.institution,
            mascot: institutionInfo.mascot,
            mascot_name: institutionInfo.mascot_name,
            domain: domain,
            login_method: lms,
            connected_at: new Date().toISOString()
        };
        
        // Create session
        const sessionId = generateSessionId();
        userSessions.set(sessionId, {
            lms,
            domain,
            accessToken: accessToken,
            userProfile: enhancedProfile,
            loginTime: Date.now()
        });
        
        // Set session cookie
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({ success: true, message: 'Login successful', user: userProfile });
        
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        
        // Check if it's a demo token or if we should allow demo mode
        if (accessToken.toLowerCase().includes('demo') || accessToken.toLowerCase().includes('test')) {
            // Create a demo session
            const demoProfile = {
                id: 1,
                name: 'Demo User',
                email: 'demo@osu.edu',
                primary_email: 'demo@osu.edu',
                login_id: 'demo@osu.edu',
                institution: 'Ohio State University',
                login_method: lms,
                connected_at: new Date().toISOString()
            };
            
            const sessionId = generateSessionId();
            userSessions.set(sessionId, {
                lms,
                domain,
                accessToken: accessToken,
                userProfile: demoProfile,
                loginTime: Date.now(),
                isDemo: true
            });
            
            res.cookie('sessionId', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });
            
            res.json({ success: true, message: 'Demo login successful', user: demoProfile });
            return;
        }
        
        // For real tokens, provide more specific error messages
        if (error.response?.status === 401) {
            res.status(401).json({ error: 'Invalid access token. Please check your token and try again.' });
        } else if (error.response?.status === 403) {
            res.status(401).json({ error: 'Access denied. Please check your token permissions.' });
        } else if (error.code === 'ENOTFOUND') {
            res.status(401).json({ error: 'Invalid domain. Please check your institution domain.' });
        } else {
            res.status(401).json({ error: 'Login failed. Please check your access token and domain.' });
        }
    }
});

// Middleware to check authentication
function requireAuth(req, res, next) {
    const sessionId = req.cookies?.sessionId;
    const session = userSessions.get(sessionId);
    
    if (!session) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if session is still valid (24 hours)
    if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
        userSessions.delete(sessionId);
        res.clearCookie('sessionId');
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    
    req.userSession = session;
    next();
}

// API Routes (now protected with session authentication)
app.get('/api/user/profile', requireAuth, async (req, res) => {
    try {
        res.json(req.userSession.userProfile);
    } catch (error) {
        console.error('Profile API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

app.get('/api/institution-info', requireAuth, async (req, res) => {
    try {
        const { institution, mascot, mascot_name, domain } = req.userSession.userProfile;
        
        console.log('📊 Institution info requested:', { institution, mascot, mascot_name, domain });
        
        res.json({
            institution,
            mascot,
            mascot_name,
            domain,
            detected: true
        });
    } catch (error) {
        console.error('Institution info error:', error);
        res.status(500).json({ error: 'Failed to fetch institution info' });
    }
});

app.get('/api/courses', requireAuth, async (req, res) => {
    try {
        const response = await axios.get(`https://${req.userSession.domain}/api/v1/courses`, {
            headers: {
                'Authorization': `Bearer ${req.userSession.accessToken}`
            },
            params: {
                enrollment_state: 'active',
                per_page: 100
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Courses API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

app.get('/api/courses/:courseId/assignments', requireAuth, async (req, res) => {
    try {
        const response = await axios.get(`https://${req.userSession.domain}/api/v1/courses/${req.params.courseId}/assignments`, {
            headers: {
                'Authorization': `Bearer ${req.userSession.accessToken}`
            },
            params: {
                per_page: 100
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Assignments API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
});

app.get('/api/courses/:courseId/assignments/:assignmentId/submissions/self', requireAuth, async (req, res) => {
    try {
        const response = await axios.get(`https://${req.userSession.domain}/api/v1/courses/${req.params.courseId}/assignments/${req.params.assignmentId}/submissions/self`, {
            headers: {
                'Authorization': `Bearer ${req.userSession.accessToken}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Submission API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch submission' });
    }
});

// Syllabus Upload and AI Analysis
app.post('/api/syllabus/upload', requireAuth, async (req, res) => {
    try {
        // For now, we'll simulate AI processing
        // In a real implementation, you'd use a file upload library like multer
        // and integrate with an AI service like OpenAI or a document parsing service
        
        const { syllabusText, courseName } = req.body;
        
        if (!syllabusText || !courseName) {
            return res.status(400).json({ error: 'Syllabus text and course name are required' });
        }
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // AI Analysis - Extract assignments from syllabus text
        const extractedAssignments = analyzeSyllabusWithAI(syllabusText, courseName);
        
        res.json({
            success: true,
            message: 'Syllabus processed successfully',
            assignments: extractedAssignments,
            courseName: courseName
        });
        
    } catch (error) {
        console.error('Syllabus upload error:', error);
        res.status(500).json({ error: 'Failed to process syllabus' });
    }
});

// AI function to analyze syllabus and extract assignments
function analyzeSyllabusWithAI(syllabusText, courseName) {
    // This is a simplified AI analysis
    // In production, you'd use a more sophisticated AI model
    
    const assignments = [];
    const lines = syllabusText.split('\n');
    
    // Common assignment keywords
    const assignmentKeywords = [
        'assignment', 'homework', 'project', 'paper', 'essay', 'report',
        'quiz', 'exam', 'test', 'presentation', 'lab', 'discussion',
        'response', 'reflection', 'analysis', 'review'
    ];
    
    // Date patterns
    const datePatterns = [
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,  // MM/DD/YYYY
        /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g,    // MM-DD-YYYY
        /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/gi, // Month DD, YYYY
        /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi // Full month
    ];
    
    let currentAssignment = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Check if line contains assignment keywords
        const hasAssignmentKeyword = assignmentKeywords.some(keyword => 
            line.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (hasAssignmentKeyword) {
            // Extract assignment name
            let assignmentName = line;
            
            // Try to extract a cleaner name
            const nameMatch = line.match(/^[^:]*/);
            if (nameMatch) {
                assignmentName = nameMatch[0].trim();
            }
            
            // Extract due date
            let dueDate = null;
            for (const pattern of datePatterns) {
                const dateMatch = line.match(pattern);
                if (dateMatch) {
                    dueDate = dateMatch[0];
                    break;
                }
            }
            
            // Look ahead for more details
            let description = '';
            for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                const nextLine = lines[j].trim();
                if (nextLine && !assignmentKeywords.some(keyword => 
                    nextLine.toLowerCase().includes(keyword.toLowerCase())
                )) {
                    description += nextLine + ' ';
                }
            }
            
            // Estimate points based on assignment type
            let points = 100; // Default
            if (line.toLowerCase().includes('quiz')) points = 20;
            else if (line.toLowerCase().includes('exam') || line.toLowerCase().includes('test')) points = 100;
            else if (line.toLowerCase().includes('project')) points = 150;
            else if (line.toLowerCase().includes('paper') || line.toLowerCase().includes('essay')) points = 80;
            
            // Create assignment object
            const assignment = {
                name: assignmentName,
                description: description.trim() || `${assignmentName} for ${courseName}`,
                due_at: dueDate ? new Date(dueDate).toISOString() : null,
                points_possible: points,
                course_name: courseName,
                submission_types: ['online_text_entry'],
                workflow_state: 'published'
            };
            
            assignments.push(assignment);
        }
    }
    
    // If no assignments found, create some sample ones
    if (assignments.length === 0) {
        assignments.push({
            name: `${courseName} Final Project`,
            description: `Final project for ${courseName}`,
            due_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            points_possible: 150,
            course_name: courseName,
            submission_types: ['online_text_entry'],
            workflow_state: 'published'
        });
    }
    
    return assignments;
}

// Google Calendar OAuth Routes
app.get('/api/google/auth', requireAuth, (req, res) => {
    // Check if Google OAuth is properly configured
    if (GOOGLE_CLIENT_ID === '123456789-abcdefghijklmnop.apps.googleusercontent.com' || GOOGLE_CLIENT_SECRET === 'GOCSPX-your-secret-here') {
        return res.status(400).json({ 
            error: 'Google Calendar integration not configured',
            message: 'To enable Google Calendar sync, you need to set up Google OAuth credentials. Please set the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables with your Google Cloud Console credentials.'
        });
    }
    
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    res.json({ authUrl });
});

app.get('/api/google/callback', requireAuth, async (req, res) => {
    const { code } = req.query;
    const sessionId = req.cookies?.sessionId;
    
    if (!code) {
        return res.redirect('/dashboard?error=google_auth_failed');
    }
    
    try {
        const { tokens } = await oauth2Client.getToken(code);
        
        // Store tokens in user session
        const session = userSessions.get(sessionId);
        if (session) {
            session.googleTokens = tokens;
            userSessions.set(sessionId, session);
        }
        
        res.redirect('/dashboard?google_connected=true');
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.redirect('/dashboard?error=google_auth_failed');
    }
});



// Get Google Calendar events
app.get('/api/google/events', requireAuth, async (req, res) => {
    try {
        const session = req.userSession;
        
        if (!session.googleTokens) {
            return res.status(400).json({ error: 'Google Calendar not connected' });
        }
        
        oauth2Client.setCredentials(session.googleTokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        const { startDate, endDate } = req.query;
        const timeMin = startDate ? new Date(startDate).toISOString() : new Date().toISOString();
        const timeMax = endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin,
            timeMax: timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        });
        
        res.json(response.data.items || []);
        
    } catch (error) {
        console.error('Google Calendar events error:', error);
        res.status(500).json({ error: 'Failed to fetch Google Calendar events' });
    }
});

app.post('/api/logout', (req, res) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
        userSessions.delete(sessionId);
    }
    res.clearCookie('sessionId');
    res.json({ message: 'Logged out successfully' });
});



// Utility function
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.listen(PORT, () => {
    console.log('🎓 Akorn Web App');
    console.log('🌐 Server running at: http://localhost:' + PORT);
    console.log('📱 Open your browser and navigate to the URL above');
    console.log('🔄 Press Ctrl+C to stop the server');
}); 