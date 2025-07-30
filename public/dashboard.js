// Dashboard functionality
let userProfile = null;
let courses = [];
let assignments = [];
let filteredAssignments = [];

// DOM elements
const loadingEl = document.getElementById('loading');
const mainContentEl = document.getElementById('main-content');
const coursesGridEl = document.getElementById('courses-grid');
const assignmentsListEl = document.getElementById('assignments-list');
const courseFilterEl = document.getElementById('course-filter');
const sortFilterEl = document.getElementById('sort-filter');
const statusFilterEl = document.getElementById('status-filter');
const priorityFilterEl = document.getElementById('priority-filter');
const userNameEl = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const userProfileIcon = document.querySelector('.user-profile-icon');

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    // Profile navigation
    if (userProfileIcon) {
        userProfileIcon.addEventListener('click', function() {
            window.location.href = '/profile';
        });
    }
    
    // Handle hash navigation
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => {
            switchTab(hash);
        }, 100);
    }
});

async function checkAuthentication() {
    try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
            const userProfile = await response.json();
            // User is authenticated, initialize dashboard
            initDashboard(userProfile);
        } else {
            // No authentication, redirect to login
            console.log('No authentication, redirecting to login');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        // Authentication failed, redirect to login
        console.log('Authentication failed, redirecting to login');
        window.location.href = '/';
    }
}

function showDemoDashboard() {
    // Show demo data for testing
    const demoProfile = {
        name: 'Demo User (Ohio State Akorn)',
        email: 'demo@osu.edu',
        canvas_email: 'demo@osu.edu',
        id: 1,
        institution: 'Ohio State University',
        login_method: 'canvas'
    };
    
    const demoCourses = [
        { id: 1, name: 'Introduction to Computer Science', course_code: 'CS101' },
        { id: 2, name: 'Web Development Fundamentals', course_code: 'WEB101' },
        { id: 3, name: 'Data Structures and Algorithms', course_code: 'CS201' },
        { id: 4, name: 'Calculus I', course_code: 'MATH1151' },
        { id: 5, name: 'Physics I', course_code: 'PHYS1250' }
    ];
    
    const demoAssignments = [
        {
            id: 1,
            name: 'Assignment 1: Hello World',
            course_id: 1,
            due_at: '2024-01-15T23:59:00Z',
            status: 'not_started',
            points_possible: 50,
            description: 'Create your first Python program that prints "Hello, World!"'
        },
        {
            id: 2,
            name: 'Assignment 2: Variables and Functions',
            course_id: 1,
            due_at: '2024-01-22T23:59:00Z',
            status: 'in_progress',
            points_possible: 75,
            description: 'Practice using variables and creating functions in Python'
        },
        {
            id: 3,
            name: 'Final Project: Web Application',
            course_id: 2,
            due_at: '2024-01-30T23:59:00Z',
            status: 'not_started',
            points_possible: 200,
            description: 'Build a complete web application using HTML, CSS, and JavaScript'
        },
        {
            id: 4,
            name: 'Homework 1: Limits and Continuity',
            course_id: 4,
            due_at: '2024-01-18T23:59:00Z',
            status: 'completed',
            points_possible: 100,
            description: 'Solve problems involving limits and continuity'
        },
        {
            id: 5,
            name: 'Lab Report: Motion and Forces',
            course_id: 5,
            due_at: '2024-01-25T23:59:00Z',
            status: 'not_started',
            points_possible: 80,
            description: 'Write a lab report analyzing motion and forces experiments'
        },
        {
            id: 6,
            name: 'Midterm Exam: Data Structures',
            course_id: 3,
            due_at: '2024-02-01T23:59:00Z',
            status: 'not_started',
            points_possible: 150,
            description: 'Comprehensive exam covering arrays, linked lists, and trees'
        },
        {
            id: 7,
            name: 'Programming Assignment: Sorting Algorithms',
            course_id: 3,
            due_at: '2024-01-28T23:59:00Z',
            status: 'not_started',
            points_possible: 120,
            description: 'Implement and compare different sorting algorithms'
        }
    ];
    
    // Initialize with demo data
    userProfile = demoProfile;
    courses = demoCourses;
    assignments = demoAssignments;
    
    // Add priority analysis and time estimates to demo assignments
    assignments.forEach(assignment => {
        assignment.priority = analyzeAssignmentPriority(assignment);
        assignment.estimatedTime = predictCompletionTime(assignment);
    });
    
    // Render demo data
    renderProfile(demoProfile);
    userNameEl.textContent = `${demoProfile.name} (${demoProfile.canvas_email || demoProfile.email})`;
    renderCourses(demoCourses);
    renderAssignments(demoAssignments);
    
    // Initialize tabs
    initializeTabs();
    initializeSyllabusUpload();
    
    // Hide loading and show content
    hideLoading();
    
    // Show a helpful message about authentication
    console.log('Demo mode: To connect to your real Ohio State Canvas account, you need to:');
    console.log('1. Get your Canvas access token from canvas.osu.edu');
    console.log('2. Use the real authentication instead of demo mode');
}

async function refreshDemoAssignments() {
    // Simulate a small delay to show the refresh is working
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate fresh demo assignments with some randomization
    const demoAssignments = [
        {
            id: 1,
            name: 'Assignment 1: Hello World',
            course_id: 1,
            due_at: '2024-01-15T23:59:00Z',
            status: 'not_started',
            points_possible: 50,
            description: 'Create your first Python program that prints "Hello, World!"'
        },
        {
            id: 2,
            name: 'Assignment 2: Variables and Functions',
            course_id: 1,
            due_at: '2024-01-22T23:59:00Z',
            status: 'in_progress',
            points_possible: 75,
            description: 'Practice using variables and creating functions in Python'
        },
        {
            id: 3,
            name: 'Final Project: Web Application',
            course_id: 2,
            due_at: '2024-01-30T23:59:00Z',
            status: 'not_started',
            points_possible: 200,
            description: 'Build a complete web application using HTML, CSS, and JavaScript'
        },
        {
            id: 4,
            name: 'Homework 1: Limits and Continuity',
            course_id: 4,
            due_at: '2024-01-18T23:59:00Z',
            status: 'completed',
            points_possible: 100,
            description: 'Solve problems involving limits and continuity'
        },
        {
            id: 5,
            name: 'Lab Report: Motion and Forces',
            course_id: 5,
            due_at: '2024-01-25T23:59:00Z',
            status: 'not_started',
            points_possible: 80,
            description: 'Write a lab report analyzing motion and forces experiments'
        },
        {
            id: 6,
            name: 'Midterm Exam: Data Structures',
            course_id: 3,
            due_at: '2024-02-01T23:59:00Z',
            status: 'not_started',
            points_possible: 150,
            description: 'Comprehensive exam covering arrays, linked lists, and trees'
        },
        {
            id: 7,
            name: 'Programming Assignment: Sorting Algorithms',
            course_id: 3,
            due_at: '2024-01-28T23:59:00Z',
            status: 'not_started',
            points_possible: 120,
            description: 'Implement and compare different sorting algorithms'
        }
    ];
    
    // Update assignments with fresh data
    assignments = demoAssignments;
    
    // Add priority analysis and time estimates
    assignments.forEach(assignment => {
        assignment.priority = analyzeAssignmentPriority(assignment);
        assignment.estimatedTime = predictCompletionTime(assignment);
    });
    
    console.log('Demo assignments refreshed successfully!');
}

async function refreshDemoCourses() {
    // Simulate a small delay to show the refresh is working
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate fresh demo courses
    const demoCourses = [
        { id: 1, name: 'Introduction to Computer Science', course_code: 'CS101', workflow_state: 'available' },
        { id: 2, name: 'Web Development Fundamentals', course_code: 'WEB101', workflow_state: 'available' },
        { id: 3, name: 'Data Structures and Algorithms', course_code: 'CS201', workflow_state: 'available' },
        { id: 4, name: 'Calculus I', course_code: 'MATH1151', workflow_state: 'available' },
        { id: 5, name: 'Physics I', course_code: 'PHYS1250', workflow_state: 'available' },
        { id: 6, name: 'English Composition', course_code: 'ENG1100', workflow_state: 'available' },
        { id: 7, name: 'Introduction to Psychology', course_code: 'PSYCH1100', workflow_state: 'available' }
    ];
    
    // Update courses with fresh data
    courses = demoCourses;
    
    console.log('Demo courses refreshed successfully!');
}

function initDashboard(profile) {
    // Store user profile
    userProfile = profile;
    
    // Always load real data - no demo mode
    console.log('Loading real Canvas data for user:', profile.email);
    loadDashboardData();
    
    // Update mascot navigation button with institution info
    updateMascotNavButton();
    
    // Check for URL parameters to switch tabs
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const successParam = urlParams.get('success');
    
    // If we have a tab parameter, switch to that tab
    if (tabParam) {
        // Small delay to ensure tabs are initialized
        setTimeout(() => {
            switchTab(tabParam);
        }, 100);
    }
    
    // If Google Calendar was successfully connected, show success message
    if (successParam === 'google_connected') {
        setTimeout(() => {
            showSuccess('Google Calendar connected successfully!');
        }, 500);
        
        // Check if we should auto-sync assignments
        const autoSyncParam = urlParams.get('auto_sync');
        if (autoSyncParam === 'true') {
            console.log('Auto-syncing assignments after Google OAuth...');
            setTimeout(() => {
                syncAssignmentsToCalendar();
            }, 2000); // Wait 2 seconds for page to load
        }
    }
}

// Update mascot navigation button with institution info
async function updateMascotNavButton() {
    try {
        const mascotNavBtn = document.getElementById('mascot-nav-btn');
        if (!mascotNavBtn) {
            console.log('Mascot nav button not found');
            return;
        }
        
        // Fetch institution info from server
        const response = await fetch('/api/institution-info');
        if (response.ok) {
            const institutionData = await response.json();
            console.log('🎓 Updating mascot nav button with:', institutionData);
            
            // Update the button text with the mascot name
            if (institutionData.mascot_name) {
                mascotNavBtn.innerHTML = `<i class="fas fa-magic"></i> ${institutionData.mascot_name}`;
                console.log('✅ Updated mascot nav button to:', institutionData.mascot_name);
            }
        } else {
            console.log('⚠️ Could not fetch institution info for nav button');
        }
    } catch (error) {
        console.error('Error updating mascot nav button:', error);
    }
}

async function loadDashboardData() {
    try {
        showLoading();
        
        // User profile is already loaded from authentication check
        renderProfile(userProfile);
        userNameEl.textContent = `${userProfile.name || 'User'} (${userProfile.canvas_email || userProfile.email || 'No email'})`;
        
        // Fetch courses
        courses = await fetchCourses();
        renderCourses(courses);
        updateCourseFilter();
        
        // Fetch assignments for all courses with submission data
        assignments = [];
        for (const course of courses) {
            try {
                const courseAssignments = await fetchAssignments(course.id);
                
                // Fetch submission data for each assignment
                for (const assignment of courseAssignments) {
                    assignment.course_id = course.id;
                    try {
                        const submission = await fetchAssignmentSubmission(course.id, assignment.id);
                        assignment.submission = submission;
                        assignment.status = determineAssignmentStatus(assignment, submission);
                    } catch (error) {
                        console.warn(`Failed to fetch submission for assignment ${assignment.id}:`, error);
                        assignment.submission = null;
                        assignment.status = 'not_started';
                    }
                }
                assignments.push(...courseAssignments);
            } catch (error) {
                console.warn(`Failed to fetch assignments for course ${course.id}:`, error);
            }
        }
        renderAssignments(assignments);
        
        // Initialize tabs and syllabus upload functionality
        initializeTabs();
        initializeSyllabusUpload();
        
        hideLoading();
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        showError(`Failed to load data: ${error.message}`);
        hideLoading();
    }
}

// API functions
async function makeAPIRequest(endpoint, params = {}) {
    const url = new URL(`/api${endpoint}`, window.location.origin);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies for session
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Session expired
                window.location.href = '/';
                throw new Error('Session expired. Please log in again.');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

async function fetchUserProfile() {
    return await makeAPIRequest('/users/self/profile');
}

async function fetchCourses() {
    return await makeAPIRequest('/courses');
}

async function fetchAssignments(courseId) {
    return await makeAPIRequest(`/courses/${courseId}/assignments`);
}

async function fetchAssignmentSubmission(courseId, assignmentId) {
    return await makeAPIRequest(`/courses/${courseId}/assignments/${assignmentId}/submissions/self`);
}

function determineAssignmentStatus(assignment, submission) {
    if (!assignment) return 'not_started';
    
    // Check if assignment is past due
    const now = new Date();
    const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
    const isPastDue = dueDate && now > dueDate;
    
    // If no submission exists
    if (!submission || !submission.workflow_state) {
        return isPastDue ? 'missing' : 'not_started';
    }
    
    // Check submission status
    switch (submission.workflow_state) {
        case 'submitted':
            return 'completed';
        case 'graded':
            return 'completed';
        case 'pending_review':
            return 'in_progress';
        case 'unsubmitted':
            return isPastDue ? 'missing' : 'not_started';
        default:
            return isPastDue ? 'missing' : 'not_started';
    }
}

// UI functions
function showError(message) {
    console.error('Error:', message);
    alert(message); // Simple alert for now
}

function showLoading() {
    loadingEl.style.display = 'flex';
    mainContentEl.style.display = 'none';
}

function hideLoading() {
    loadingEl.style.display = 'none';
    mainContentEl.style.display = 'grid';
}

function formatDate(dateString) {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderProfile(profile) {
    // Profile rendering is now handled by the separate profile page
    // This function is kept for compatibility but doesn't render anything
    console.log('Profile data loaded:', profile);
}

function renderCourses(coursesList) {
    if (coursesList.length === 0) {
        coursesGridEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book"></i>
                <p>No courses found</p>
            </div>
        `;
        return;
    }

    coursesGridEl.innerHTML = coursesList.map(course => `
        <div class="course-card">
            <div class="course-name">${course.name || 'Unnamed Course'}</div>
            <div class="course-details">
                <span><i class="fas fa-hashtag"></i> ID: ${course.id}</span>
                <span><i class="fas fa-code"></i> Code: ${course.course_code || 'No code'}</span>
                <span><i class="fas fa-circle status-${course.workflow_state || 'unknown'}"></i> Status: ${course.workflow_state || 'Unknown'}</span>
                ${course.start_at ? `<span><i class="fas fa-calendar-alt"></i> Start: ${formatDate(course.start_at)}</span>` : ''}
                ${course.end_at ? `<span><i class="fas fa-calendar-check"></i> End: ${formatDate(course.end_at)}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function renderAssignments(assignmentsList) {
    // Store the original assignments list
    assignments = assignmentsList;
    
    // Apply filters and sorting
    filteredAssignments = applyFiltersAndSorting(assignmentsList);
    
    if (filteredAssignments.length === 0) {
        assignmentsListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No assignments found matching your filters</p>
            </div>
        `;
        return;
    }

    // Generate AI recommendations
    const recommendations = generateAIRecommendations(filteredAssignments);
    
    // Add priority analysis to assignments
    filteredAssignments.forEach(assignment => {
        assignment.priority = analyzeAssignmentPriority(assignment);
        assignment.estimatedTime = predictCompletionTime(assignment);
    });

    // Group assignments by status
    const completed = filteredAssignments.filter(a => a.status === 'completed');
    const missing = filteredAssignments.filter(a => a.status === 'missing');
    const inProgress = filteredAssignments.filter(a => a.status === 'in_progress');
    const notStarted = filteredAssignments.filter(a => a.status === 'not_started');

    assignmentsListEl.innerHTML = `
        ${renderAIRecommendations(recommendations)}
        ${renderAssignmentSection('Missing', missing, 'missing', 'exclamation-triangle')}
        ${renderAssignmentSection('In Progress', inProgress, 'in-progress', 'clock')}
        ${renderAssignmentSection('Not Started', notStarted, 'not-started', 'circle')}
        ${renderAssignmentSection('Completed', completed, 'completed', 'check-circle')}
    `;
}

function renderAssignmentSection(title, assignments, statusClass, icon) {
    if (assignments.length === 0) return '';
    
    return `
        <div class="assignment-section">
            <div class="section-header ${statusClass}">
                <i class="fas fa-${icon}"></i>
                <h3>${title} (${assignments.length})</h3>
            </div>
            <div class="section-assignments">
                ${assignments.map(assignment => renderAssignmentItem(assignment)).join('')}
            </div>
        </div>
    `;
}

function renderAssignmentItem(assignment) {
    const course = courses.find(c => c.id === assignment.course_id);
    const courseName = course ? course.name : 'Unknown Course';
    const statusClass = assignment.status || 'unknown';
    const priorityClass = assignment.priority ? assignment.priority.priority : 'low';
    
    return `
        <div class="assignment-item ${statusClass} priority-${priorityClass}">
            <div class="assignment-header">
                <div class="assignment-name">${assignment.name}</div>
                <div class="assignment-course">${courseName}</div>
                <div class="assignment-status-badge ${statusClass}">
                    ${getStatusText(assignment.status)}
                </div>
            </div>
            <div class="assignment-details">
                <div class="assignment-detail">
                    <i class="fas fa-hashtag"></i>
                    <span>ID: ${assignment.id}</span>
                </div>
                <div class="assignment-detail">
                    <i class="fas fa-calendar"></i>
                    <span>Due: ${formatDate(assignment.due_at)}</span>
                </div>
                <div class="assignment-detail">
                    <i class="fas fa-star"></i>
                    <span>Points: ${assignment.points_possible || 'N/A'}</span>
                </div>
                <div class="assignment-detail">
                    <i class="fas fa-flag"></i>
                    <span>Priority: ${assignment.priority ? assignment.priority.priority.toUpperCase() : 'LOW'}</span>
                </div>
                <div class="assignment-detail">
                    <i class="fas fa-clock"></i>
                    <span>Estimated Time: ${assignment.estimatedTime || '60'} minutes</span>
                </div>
                <div class="assignment-detail">
                    <i class="fas fa-upload"></i>
                    <span>Submission: ${assignment.submission ? assignment.submission.workflow_state : 'not_submitted'}</span>
                </div>
            </div>
        </div>
    `;
}

function getStatusText(status) {
    switch (status) {
        case 'completed': return 'Completed';
        case 'missing': return 'Missing';
        case 'in_progress': return 'In Progress';
        case 'not_started': return 'Not Started';
        default: return 'Unknown';
    }
}

function renderAIRecommendations(recommendations) {
    if (recommendations.length === 0) return '';
    
    return `
        <div class="ai-recommendations">
            <div class="ai-header">
                <i class="fas fa-robot"></i>
                <h3>AI Assistant Recommendations</h3>
            </div>
            <div class="recommendations-list">
                ${recommendations.map(rec => `
                    <div class="recommendation-item ${rec.priority}">
                        <div class="recommendation-icon">
                            ${getRecommendationIcon(rec.type)}
                        </div>
                        <div class="recommendation-content">
                            <p>${rec.message}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function getRecommendationIcon(type) {
    switch (type) {
        case 'workload': return '<i class="fas fa-calendar-alt"></i>';
        case 'priority': return '<i class="fas fa-star"></i>';
        case 'urgent': return '<i class="fas fa-exclamation-triangle"></i>';
        case 'wellness': return '<i class="fas fa-heart"></i>';
        default: return '<i class="fas fa-lightbulb"></i>';
    }
}

function updateCourseFilter() {
    courseFilterEl.innerHTML = '<option value="">All Courses</option>';
    
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name || 'Unnamed Course';
        courseFilterEl.appendChild(option);
    });
}

function applyFiltersAndSorting(assignmentsList) {
    let filtered = [...assignmentsList];
    
    // Apply course filter
    const selectedCourse = courseFilterEl.value;
    if (selectedCourse) {
        filtered = filtered.filter(a => a.course_id.toString() === selectedCourse);
    }
    
    // Apply status filter
    const selectedStatus = statusFilterEl.value;
    if (selectedStatus) {
        filtered = filtered.filter(a => a.status === selectedStatus);
    }
    
    // Apply priority filter
    const selectedPriority = priorityFilterEl.value;
    if (selectedPriority) {
        filtered = filtered.filter(a => {
            const priority = analyzeAssignmentPriority(a);
            return priority && priority.priority === selectedPriority;
        });
    }
    
    // Apply sorting
    const sortBy = sortFilterEl.value;
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'ai-recommended':
                return sortByAIRecommendation(a, b);
            case 'newest-first':
                return new Date(b.created_at || b.due_at) - new Date(a.created_at || a.due_at);
            case 'oldest-first':
                return new Date(a.created_at || a.due_at) - new Date(b.created_at || b.due_at);
            case 'due-date':
                return new Date(a.due_at || '9999-12-31') - new Date(b.due_at || '9999-12-31');
            case 'priority':
                return sortByPriority(a, b);
            case 'course':
                const courseA = courses.find(c => c.id === a.course_id)?.name || '';
                const courseB = courses.find(c => c.id === b.course_id)?.name || '';
                return courseA.localeCompare(courseB);
            default:
                return 0;
        }
    });
    
    return filtered;
}

function sortByAIRecommendation(a, b) {
    // AI recommendation sorting based on multiple factors
    const priorityA = analyzeAssignmentPriority(a);
    const priorityB = analyzeAssignmentPriority(b);
    
    // Priority weights
    const priorityWeights = { critical: 5, urgent: 4, high: 3, medium: 2, low: 1 };
    const weightA = priorityWeights[priorityA.priority] || 0;
    const weightB = priorityWeights[priorityB.priority] || 0;
    
    if (weightA !== weightB) {
        return weightB - weightA; // Higher priority first
    }
    
    // If same priority, sort by due date (earlier first)
    const dueDateA = new Date(a.due_at || '9999-12-31');
    const dueDateB = new Date(b.due_at || '9999-12-31');
    
    if (dueDateA.getTime() !== dueDateB.getTime()) {
        return dueDateA - dueDateB;
    }
    
    // If same due date, sort by points (higher first)
    return (b.points_possible || 0) - (a.points_possible || 0);
}

function sortByPriority(a, b) {
    const priorityA = analyzeAssignmentPriority(a);
    const priorityB = analyzeAssignmentPriority(b);
    
    const priorityWeights = { critical: 5, urgent: 4, high: 3, medium: 2, low: 1 };
    const weightA = priorityWeights[priorityA.priority] || 0;
    const weightB = priorityWeights[priorityB.priority] || 0;
    
    if (weightA !== weightB) {
        return weightB - weightA; // Higher priority first
    }
    
    // If same priority, sort by due date
    return new Date(a.due_at || '9999-12-31') - new Date(b.due_at || '9999-12-31');
}

function filterAssignments() {
    // Re-render assignments with current filters
    renderAssignments(assignments);
}

async function logout() {
    try {
        // Call logout endpoint to clear server session
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Redirect to login page
    window.location.href = '/';
}

// Event listeners
document.getElementById('refresh-courses').addEventListener('click', async () => {
    try {
        // Show loading state
        const refreshBtn = document.getElementById('refresh-courses');
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        
        // Check if we're in demo mode
        if (!userProfile || userProfile.name === 'Demo User (Ohio State Canvas)') {
            // Refresh with demo data
            await refreshDemoCourses();
        } else {
            // Refresh with real API data
            courses = await fetchCourses();
        }
        
        renderCourses(courses);
        updateCourseFilter();
        showSuccess('Courses refreshed successfully!');
        
    } catch (error) {
        console.error('Refresh courses error:', error);
        showError(`Failed to refresh courses: ${error.message}`);
    } finally {
        // Restore button state
        const refreshBtn = document.getElementById('refresh-courses');
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    }
});

document.getElementById('refresh-assignments').addEventListener('click', async () => {
    try {
        // Show loading state
        const refreshBtn = document.getElementById('refresh-assignments');
        const originalText = refreshBtn.innerHTML;
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        
        // Check if we're in demo mode
        if (!userProfile || userProfile.name === 'Demo User (Ohio State Canvas)') {
            // Refresh with demo data
            await refreshDemoAssignments();
        } else {
            // Refresh with real API data
            assignments = [];
            for (const course of courses) {
                try {
                    const courseAssignments = await fetchAssignments(course.id);
                    
                    // Fetch submission data for each assignment
                    for (const assignment of courseAssignments) {
                        assignment.course_id = course.id;
                        try {
                            const submission = await fetchAssignmentSubmission(course.id, assignment.id);
                            assignment.submission = submission;
                            assignment.status = determineAssignmentStatus(assignment, submission);
                        } catch (error) {
                            console.warn(`Failed to fetch submission for assignment ${assignment.id}:`, error);
                            assignment.submission = null;
                            assignment.status = 'not_started';
                        }
                    }
                    assignments.push(...courseAssignments);
                } catch (error) {
                    console.warn(`Failed to fetch assignments for course ${course.id}:`, error);
                }
            }
        }
        
        renderAssignments(assignments);
        showSuccess('Assignments refreshed successfully!');
        
    } catch (error) {
        console.error('Refresh assignments error:', error);
        showError(`Failed to refresh assignments: ${error.message}`);
    } finally {
        // Restore button state
        const refreshBtn = document.getElementById('refresh-assignments');
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    }
});

// Add event listeners for filters
courseFilterEl.addEventListener('change', filterAssignments);
sortFilterEl.addEventListener('change', filterAssignments);
statusFilterEl.addEventListener('change', filterAssignments);
priorityFilterEl.addEventListener('change', filterAssignments);
logoutBtn.addEventListener('click', logout); 

// AI-powered features
function analyzeAssignmentPriority(assignment) {
    const now = new Date();
    const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
    const points = assignment.points_possible || 0;
    
    if (!dueDate) return { priority: 'low', score: 0, reason: 'No due date' };
    
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    const hoursUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60));
    
    let priority = 'low';
    let score = 0;
    let reason = '';
    
    // Calculate priority score based on multiple factors
    if (daysUntilDue < 0) {
        priority = 'critical';
        score = 100;
        reason = 'Overdue';
    } else if (hoursUntilDue <= 24) {
        priority = 'urgent';
        score = 90 - hoursUntilDue;
        reason = `Due in ${hoursUntilDue} hours`;
    } else if (daysUntilDue <= 3) {
        priority = 'high';
        score = 80 - (daysUntilDue * 10);
        reason = `Due in ${daysUntilDue} days`;
    } else if (daysUntilDue <= 7) {
        priority = 'medium';
        score = 60 - (daysUntilDue * 5);
        reason = `Due in ${daysUntilDue} days`;
    } else {
        priority = 'low';
        score = Math.max(10, 40 - daysUntilDue);
        reason = `Due in ${daysUntilDue} days`;
    }
    
    // Adjust score based on points value
    if (points > 100) score += 20;
    else if (points > 50) score += 10;
    
    return { priority, score, reason };
}

function generateAIRecommendations(assignments) {
    const recommendations = [];
    
    // Analyze workload distribution
    const upcomingAssignments = assignments.filter(a => {
        const dueDate = a.due_at ? new Date(a.due_at) : null;
        return dueDate && dueDate > new Date() && a.status !== 'completed';
    });
    
    const nextWeekAssignments = upcomingAssignments.filter(a => {
        const dueDate = new Date(a.due_at);
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return dueDate <= nextWeek;
    });
    
    if (nextWeekAssignments.length > 5) {
        recommendations.push({
            type: 'workload',
            message: `You have ${nextWeekAssignments.length} assignments due this week. Consider starting early!`,
            priority: 'high'
        });
    }
    
    // Find high-value assignments
    const highValueAssignments = upcomingAssignments.filter(a => (a.points_possible || 0) > 50);
    if (highValueAssignments.length > 0) {
        const highestValue = highValueAssignments.reduce((max, a) => 
            (a.points_possible || 0) > (max.points_possible || 0) ? a : max
        );
        recommendations.push({
            type: 'priority',
            message: `Focus on "${highestValue.name}" - it's worth ${highestValue.points_possible} points!`,
            priority: 'medium'
        });
    }
    
    // Check for overdue assignments
    const overdueAssignments = assignments.filter(a => {
        const dueDate = a.due_at ? new Date(a.due_at) : null;
        return dueDate && dueDate < new Date() && a.status !== 'completed';
    });
    
    if (overdueAssignments.length > 0) {
        recommendations.push({
            type: 'urgent',
            message: `You have ${overdueAssignments.length} overdue assignment(s). Contact your instructors immediately!`,
            priority: 'critical'
        });
    }
    
    // Suggest study breaks
    const completedToday = assignments.filter(a => {
        if (a.status !== 'completed' || !a.submission) return false;
        const submittedDate = new Date(a.submission.submitted_at);
        const today = new Date();
        return submittedDate.toDateString() === today.toDateString();
    });
    
    if (completedToday.length >= 3) {
        recommendations.push({
            type: 'wellness',
            message: `Great work! You've completed ${completedToday.length} assignments today. Take a well-deserved break!`,
            priority: 'low'
        });
    }
    
    return recommendations;
}

function predictCompletionTime(assignment) {
    const points = assignment.points_possible || 0;
    const complexity = assignment.description ? assignment.description.length : 0;
    
    // Simple AI model for time prediction
    let baseTime = 30; // 30 minutes base
    
    if (points > 100) baseTime += 120; // 2 hours for high-point assignments
    else if (points > 50) baseTime += 60; // 1 hour for medium-point assignments
    
    if (complexity > 500) baseTime += 45; // 45 minutes for complex descriptions
    else if (complexity > 200) baseTime += 30; // 30 minutes for medium descriptions
    
    // Adjust based on assignment type
    if (assignment.submission_types && assignment.submission_types.includes('online_text_entry')) {
        baseTime += 30; // Writing takes longer
    }
    
    return Math.round(baseTime);
}

// Tab Management
function initializeTabs() {
    const navTabs = document.querySelectorAll('.dashboard-nav-tab[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    navTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all nav tabs and panes
            navTabs.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Load tab-specific content
            loadTabContent(targetTab);
        });
    });
}

function loadTabContent(tabName) {
    switch(tabName) {
        case 'calendar':
            initializeCalendar();
            break;
        case 'assignments':
            // Assignments are already loaded
            break;
        case 'courses':
            // Courses are already loaded
            break;
    }
}

function switchTab(tabName) {
    const navTabs = document.querySelectorAll('.dashboard-nav-tab[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all nav tabs and panes
    navTabs.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    
    // Find the correct tab button and activate it
    const targetTab = document.querySelector(`.dashboard-nav-tab[data-tab="${tabName}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        loadTabContent(tabName);
    }
}

// Calendar Functionality
let currentDate = new Date();
let calendarEvents = [];

function initializeCalendar() {
    const setupBtn = document.getElementById('setup-google-calendar');
    const connectBtn = document.getElementById('connect-google-calendar');
    const syncBtn = document.getElementById('sync-assignments');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (setupBtn) {
        setupBtn.addEventListener('click', connectGoogleCalendar);
    }
    
    if (connectBtn) {
        connectBtn.addEventListener('click', connectGoogleCalendar);
    }
    
    if (syncBtn) {
        syncBtn.addEventListener('click', syncAssignmentsToCalendar);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // Check if Google Calendar is already connected
    checkGoogleCalendarStatus();
    
    // Show fallback calendar by default
    showFallbackCalendar();
    
    // Render initial calendar
    renderCalendar();
    
    // Load upcoming assignments
    renderUpcomingAssignments();
    
    // Add test copy URL button functionality
    const testCopyBtn = document.getElementById('test-copy-url');
    if (testCopyBtn) {
        testCopyBtn.onclick = () => {
            console.log('Test copy button clicked!');
            const testUrl = 'https://calendar.google.com/calendar/ical/test@group.calendar.google.com/public/basic.ics';
            
            navigator.clipboard.writeText(testUrl).then(() => {
                showSuccess('Test URL copied! Check your clipboard.');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = testUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showSuccess('Test URL copied! Check your clipboard.');
            });
        };
    }
    
    // Add all assignments to Google Calendar functionality
    const addAllAssignmentsBtn = document.getElementById('add-all-assignments');
    if (addAllAssignmentsBtn) {
        addAllAssignmentsBtn.onclick = async () => {
            console.log('Add all assignments button clicked!');
            
            // Show loading state
            addAllAssignmentsBtn.disabled = true;
            addAllAssignmentsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Assignments...';
            
            const statusDiv = document.getElementById('sync-status');
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Adding all assignments to Google Calendar...</div>';
            }
            
            try {
                // First, connect to Google Calendar if not already connected
                const connectResponse = await fetch('/api/auth/google');
                const { authUrl } = await connectResponse.json();
                
                if (authUrl) {
                    // Redirect to Google OAuth
                    window.location.href = authUrl;
                } else {
                    throw new Error('Failed to get Google OAuth URL');
                }
                
            } catch (error) {
                console.error('Error adding assignments to Google Calendar:', error);
                
                // Reset button state
                addAllAssignmentsBtn.disabled = false;
                addAllAssignmentsBtn.innerHTML = '<i class="fas fa-plus"></i> Add All Assignments to Google Calendar';
                
                if (statusDiv) {
                    statusDiv.innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> Failed to add assignments. Please try again.</div>';
                }
            }
        };
    }
}

async function connectGoogleCalendar() {
    try {
        console.log('Initiating Google Calendar OAuth...');
        
        // Redirect to Google OAuth
        const response = await fetch('/api/auth/google');
        const { authUrl } = await response.json();
        
        if (authUrl) {
            // Redirect to Google OAuth
            window.location.href = authUrl;
        } else {
            throw new Error('Failed to get Google OAuth URL');
        }
        
    } catch (error) {
        console.error('Google Calendar connection error:', error);
        showError('Failed to connect to Google Calendar. Please try again.');
    }
}

async function checkGoogleCalendarStatus() {
    try {
        console.log('Checking Google Calendar connection status...');
        
        const response = await fetch('/api/google/status');
        const { connected } = await response.json();
        
        console.log('Google Calendar status response:', { connected });
        
        if (connected) {
            console.log('Google Calendar is connected');
            showGoogleCalendarConnected();
        } else {
            console.log('Google Calendar is not connected');
            // Show connect button
            const connectBtn = document.getElementById('connect-google-calendar');
            if (connectBtn) {
                connectBtn.style.display = 'inline-block';
            }
        }
    } catch (error) {
        console.error('Error checking Google Calendar status:', error);
        // On error, show connect button
        const connectBtn = document.getElementById('connect-google-calendar');
        if (connectBtn) {
            connectBtn.style.display = 'inline-block';
        }
    }
}

function showGoogleCalendarConnected() {
    console.log('Showing Google Calendar connected state...');
    
    const statusDiv = document.getElementById('google-calendar-status');
    const googleCalendarEmbed = document.getElementById('google-calendar-embed');
    const fallbackCalendarView = document.getElementById('fallback-calendar-view');
    const syncBtn = document.getElementById('sync-assignments');
    const copyBtn = document.getElementById('copy-calendar-link');
    
    console.log('Status div:', statusDiv);
    console.log('Google Calendar embed:', googleCalendarEmbed);
    console.log('Copy button:', copyBtn);
    
    if (statusDiv) {
        statusDiv.style.display = 'flex';
    }
    
    if (googleCalendarEmbed) {
        googleCalendarEmbed.style.display = 'block';
    }
    
    if (fallbackCalendarView) {
        fallbackCalendarView.style.display = 'none';
    }
    
    if (syncBtn) {
        syncBtn.style.display = 'inline-block';
    }
    
    // Load Google Calendar embed
    loadGoogleCalendarEmbed();
}

async function loadGoogleCalendarEmbed() {
    try {
        console.log('Loading Google Calendar embed...');
        
        const response = await fetch('/api/google/embed-url');
        const { embedUrl, calendarUrl, calendarId } = await response.json();
        
        console.log('Embed URL response:', { embedUrl, calendarUrl, calendarId });
        
        const iframe = document.getElementById('calendar-iframe');
        const openLink = document.getElementById('open-google-calendar');
        const copyLinkBtn = document.getElementById('copy-calendar-link');
        
        console.log('Found elements:', { iframe, openLink, copyLinkBtn });
        
        if (iframe && embedUrl) {
            iframe.src = embedUrl;
        }
        
        if (openLink && calendarUrl) {
            openLink.href = calendarUrl;
            openLink.target = '_blank';
            openLink.rel = 'noopener noreferrer';
        }
        
        // Set up the copy calendar link functionality
        if (copyLinkBtn) {
            console.log('Setting up copy button click handler...');
            copyLinkBtn.onclick = () => {
                console.log('Copy button clicked!');
                // Generate a proper Google Calendar subscription URL
                const calendarUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
                
                console.log('Copying URL:', calendarUrl);
                
                navigator.clipboard.writeText(calendarUrl).then(() => {
                    showSuccess('Calendar URL copied! To add to Google Calendar:\n1. Open Google Calendar\n2. Click + next to "Other calendars"\n3. Click "Subscribe to calendar"\n4. Paste the URL\n5. Click "Add calendar"');
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = calendarUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showSuccess('Calendar URL copied! To add to Google Calendar:\n1. Open Google Calendar\n2. Click + next to "Other calendars"\n3. Click "Subscribe to calendar"\n4. Paste the URL\n5. Click "Add calendar"');
                });
            };
        } else {
            console.error('Copy button not found!');
        }
        
    } catch (error) {
        console.error('Error loading Google Calendar embed:', error);
        // Fall back to demo calendar
        showFallbackCalendar();
    }
}

function showFallbackCalendar() {
    const googleCalendarEmbed = document.getElementById('google-calendar-embed');
    const fallbackCalendarView = document.getElementById('fallback-calendar-view');
    
    if (googleCalendarEmbed) {
        googleCalendarEmbed.style.display = 'none';
    }
    
    if (fallbackCalendarView) {
        fallbackCalendarView.style.display = 'block';
    }
}

async function syncAssignmentsToCalendar() {
    try {
        const syncBtn = document.getElementById('sync-assignments');
        const addAllBtn = document.getElementById('add-all-assignments');
        const statusDiv = document.getElementById('sync-status');
        
        // Update button states
        if (syncBtn) {
            syncBtn.disabled = true;
            syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
        }
        if (addAllBtn) {
            addAllBtn.disabled = true;
            addAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Assignments...';
        }
        
        // Update status
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Adding assignments to Google Calendar...</div>';
        }
        
        // Check if we have assignments to sync
        if (!assignments || assignments.length === 0) {
            showError('No assignments available to sync. Please refresh your assignments first.');
            return;
        }
        
        console.log(`Syncing ${assignments.length} assignments to Google Calendar...`);
        
        // Try real sync first
        try {
            const response = await fetch('/api/google/sync-assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ assignments }),
                credentials: 'include'
            });
            
            if (response.ok) {
                const result = await response.json();
                const successMessage = `Successfully added ${result.syncedCount} assignments to Google Calendar!`;
                showSuccess(successMessage);
                
                // Update status
                if (statusDiv) {
                    statusDiv.innerHTML = `<div class="alert alert-success"><i class="fas fa-check"></i> ${successMessage}</div>`;
                }
                
                console.log('Assignments synced successfully:', result);
                
                // Refresh calendar display
                renderCalendar();
                renderUpcomingAssignments();
                return;
            } else {
                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to sync assignments');
                } else {
                    // Server returned HTML instead of JSON (likely an error page)
                    const errorText = await response.text();
                    console.error('Server returned HTML instead of JSON:', errorText.substring(0, 200));
                    throw new Error('Server error - please try again');
                }
            }
        } catch (error) {
            console.error('Real sync failed:', error);
            const errorMessage = `Failed to add assignments: ${error.message}`;
            showError(errorMessage);
            
            if (statusDiv) {
                statusDiv.innerHTML = `<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> ${errorMessage}</div>`;
            }
        }
        
    } catch (error) {
        console.error('Sync error:', error);
        const errorMessage = `Sync failed: ${error.message}`;
        showError(errorMessage);
        
        const statusDiv = document.getElementById('sync-status');
        if (statusDiv) {
            statusDiv.innerHTML = `<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> ${errorMessage}</div>`;
        }
    } finally {
        // Reset button states
        const syncBtn = document.getElementById('sync-assignments');
        if (syncBtn) {
            syncBtn.disabled = false;
            syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Assignments';
        }
        
        const addAllBtn = document.getElementById('add-all-assignments');
        if (addAllBtn) {
            addAllBtn.disabled = false;
            addAllBtn.innerHTML = '<i class="fas fa-plus"></i> Add All Assignments to Google Calendar';
        }
    }
}

async function loadCalendarEvents() {
    try {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const response = await fetch(`/api/google/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            calendarEvents = await response.json();
            renderCalendar();
        }
    } catch (error) {
        console.error('Failed to load calendar events:', error);
    }
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    
    if (!calendarGrid || !currentMonthEl) return;
    
    // Update month display
    currentMonthEl.textContent = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Generate calendar HTML
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let calendarHTML = `
        <div class="calendar-day-header">Sun</div>
        <div class="calendar-day-header">Mon</div>
        <div class="calendar-day-header">Tue</div>
        <div class="calendar-day-header">Wed</div>
        <div class="calendar-day-header">Thu</div>
        <div class="calendar-day-header">Fri</div>
        <div class="calendar-day-header">Sat</div>
    `;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = currentDate.getMonth() === month;
        const isToday = currentDate.getTime() === today.getTime();
        const dayNumber = currentDate.getDate();
        
        const dayEvents = getEventsForDate(currentDate);
        
        const dayClass = `calendar-day${!isCurrentMonth ? ' other-month' : ''}${isToday ? ' today' : ''}`;
        
        let eventsHTML = '';
        dayEvents.forEach(event => {
            const eventClass = getEventClass(event);
            eventsHTML += `<div class="calendar-event ${eventClass}" title="${event.summary}">${event.summary.substring(0, 15)}...</div>`;
        });
        
        calendarHTML += `
            <div class="${dayClass}">
                <div class="calendar-day-number">${dayNumber}</div>
                <div class="calendar-events">${eventsHTML}</div>
            </div>
        `;
    }
    
    calendarGrid.innerHTML = calendarHTML;
}

function getEventsForDate(date) {
    return calendarEvents.filter(event => {
        const eventDate = new Date(event.start.dateTime || event.start.date);
        return eventDate.toDateString() === date.toDateString();
    });
}

function getEventClass(event) {
    const summary = event.summary.toLowerCase();
    if (summary.includes('exam') || summary.includes('test')) return 'exam';
    if (summary.includes('project')) return 'project';
    return 'assignment';
}

function getAssignmentColor(status) {
    switch (status) {
        case 'missing': return '11'; // Red
        case 'in_progress': return '5'; // Orange
        case 'completed': return '10'; // Green
        case 'not_started': return '1'; // Blue
        default: return '1'; // Blue
    }
}

function updateEmbeddedCalendar(events) {
    // Update the embedded Google Calendar to show the synced events
    const iframe = document.getElementById('calendar-iframe');
    const copyLinkBtn = document.getElementById('copy-calendar-link');
    
    if (iframe) {
        // Reload the embed URL to show the newly synced events
        loadGoogleCalendarEmbed();
        
        // Show a message that events have been synced
        console.log(`Synced ${events.length} events to Google Calendar`);
        
        // The copy link functionality is now handled in loadGoogleCalendarEmbed()
    }
}

function createDemoCalendarEvents() {
    const events = [
        {
            summary: '📚 Assignment 1: Hello World - CS101',
            start: { dateTime: '2024-01-15T23:59:00Z' },
            end: { dateTime: '2024-01-16T00:59:00Z' }
        },
        {
            summary: '📚 Assignment 2: Variables and Functions - CS101',
            start: { dateTime: '2024-01-22T23:59:00Z' },
            end: { dateTime: '2024-01-23T00:59:00Z' }
        },
        {
            summary: '📚 Final Project - WEB101',
            start: { dateTime: '2024-01-30T23:59:00Z' },
            end: { dateTime: '2024-01-31T00:59:00Z' }
        },
        {
            summary: '📚 Homework 1: Limits - MATH1151',
            start: { dateTime: '2024-01-18T23:59:00Z' },
            end: { dateTime: '2024-01-19T00:59:00Z' }
        },
        {
            summary: '📚 Lab Report: Motion - PHYS1250',
            start: { dateTime: '2024-01-25T23:59:00Z' },
            end: { dateTime: '2024-01-26T00:59:00Z' }
        }
    ];
    return events;
}

function loadDemoCalendarEvents() {
    // Use actual assignments to create calendar events
    const calendarEvents = assignments
        .filter(assignment => assignment.due_at)
        .map(assignment => {
            const course = courses.find(c => c.id === assignment.course_id);
            const dueDate = new Date(assignment.due_at);
            const endDate = new Date(dueDate.getTime() + 60 * 60 * 1000); // 1 hour duration
            
            return {
                summary: `📚 ${assignment.name} - ${course ? course.name : 'Unknown Course'}`,
                description: assignment.description || 'Assignment due',
                start: { dateTime: dueDate.toISOString() },
                end: { dateTime: endDate.toISOString() },
                colorId: getAssignmentColor(assignment.status)
            };
        });
    
    window.calendarEvents = calendarEvents;
    renderCalendar();
}

function renderUpcomingAssignments() {
    const upcomingListEl = document.getElementById('upcoming-assignments-list');
    if (!upcomingListEl) return;
    
    // Get upcoming assignments (next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingAssignments = assignments.filter(assignment => {
        if (!assignment.due_at) return false;
        const dueDate = new Date(assignment.due_at);
        return dueDate >= now && dueDate <= nextWeek;
    }).sort((a, b) => new Date(a.due_at) - new Date(b.due_at)).slice(0, 5);
    
    if (upcomingAssignments.length === 0) {
        upcomingListEl.innerHTML = `
            <div class="upcoming-assignment-item">
                <div class="upcoming-assignment-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="upcoming-assignment-content">
                    <div class="upcoming-assignment-title">No upcoming assignments</div>
                    <div class="upcoming-assignment-due">You're all caught up!</div>
                </div>
            </div>
        `;
        return;
    }
    
    upcomingListEl.innerHTML = upcomingAssignments.map(assignment => {
        const course = courses.find(c => c.id === assignment.course_id);
        const dueDate = new Date(assignment.due_at);
        const formattedDate = dueDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Choose icon based on assignment type
        let icon = 'fas fa-file-alt';
        if (assignment.name.toLowerCase().includes('homework')) {
            icon = 'fas fa-pencil-alt';
        } else if (assignment.name.toLowerCase().includes('essay') || assignment.name.toLowerCase().includes('paper')) {
            icon = 'fas fa-book-open';
        } else if (assignment.name.toLowerCase().includes('project')) {
            icon = 'fas fa-project-diagram';
        } else if (assignment.name.toLowerCase().includes('exam') || assignment.name.toLowerCase().includes('test')) {
            icon = 'fas fa-graduation-cap';
        }
        
        return `
            <div class="upcoming-assignment-item">
                <div class="upcoming-assignment-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="upcoming-assignment-content">
                    <div class="upcoming-assignment-title">${assignment.name}</div>
                    <div class="upcoming-assignment-due">Due ${formattedDate}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Syllabus Upload Functionality
function initializeSyllabusUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const syllabusFile = document.getElementById('syllabus-file');
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.querySelector('.progress-fill');
    const uploadStatus = document.getElementById('upload-status');
    
    if (!uploadZone || !syllabusFile) return;
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        syllabusFile.click();
    });
    
    // Drag and drop functionality
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    // File input change
    syllabusFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

async function handleFileUpload(file) {
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.querySelector('.progress-fill');
    const uploadStatus = document.getElementById('upload-status');
    
    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        showError('Please upload a PDF, DOCX, or TXT file.');
        return;
    }
    
    // Show progress
    uploadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    uploadStatus.textContent = 'Reading file...';
    
    try {
        // Read file content
        const text = await readFileContent(file);
        progressFill.style.width = '30%';
        uploadStatus.textContent = 'Analyzing with AI...';
        
        // Get course name from user
        const courseName = prompt('Please enter the course name for this syllabus:');
        if (!courseName) {
            uploadProgress.style.display = 'none';
            return;
        }
        
        progressFill.style.width = '60%';
        uploadStatus.textContent = 'Extracting assignments...';
        
        // Send to AI analysis
        const response = await fetch('/api/syllabus/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                syllabusText: text,
                courseName: courseName
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to process syllabus');
        }
        
        const result = await response.json();
        progressFill.style.width = '100%';
        uploadStatus.textContent = 'Adding assignments to tracker...';
        
        // Add extracted assignments to the current list
        const extractedAssignments = result.assignments.map(assignment => ({
            ...assignment,
            id: `syllabus_${Date.now()}_${Math.random()}`,
            course_id: courseName,
            status: 'not_started',
            submission: null
        }));
        
        assignments.push(...extractedAssignments);
        renderAssignments(assignments);
        
        // Show success message
        setTimeout(() => {
            uploadProgress.style.display = 'none';
            showSuccess(`Successfully extracted ${extractedAssignments.length} assignments from ${courseName} syllabus!`);
        }, 1000);
        
    } catch (error) {
        console.error('File upload error:', error);
        uploadProgress.style.display = 'none';
        showError('Failed to process syllabus. Please try again.');
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        
        reader.onerror = (e) => {
            reject(new Error('Failed to read file'));
        };
        
        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            // For PDF and DOCX, we'll simulate text extraction
            // In a real implementation, you'd use libraries like pdf.js or mammoth.js
            reader.readAsText(file);
        }
    });
}

function showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
} 