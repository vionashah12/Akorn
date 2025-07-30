// Canvas API Configuration
const CANVAS_CONFIG = {
    domain: 'osu.instructure.com',
    token: '8597~3y8YBt9WzVcrkTDaEBKJxaY4naVc6uv3DhFYU9WKmhDfQV9h6eh2zYUtZht44N2G',
    baseURL: 'https://osu.instructure.com/api/v1'
};

// Global state
let userProfile = null;
let courses = [];
let assignments = [];

// DOM elements
const loadingEl = document.getElementById('loading');
const mainContentEl = document.getElementById('main-content');
const profileInfoEl = document.getElementById('profile-info');
const coursesGridEl = document.getElementById('courses-grid');
const assignmentsListEl = document.getElementById('assignments-list');
const courseFilterEl = document.getElementById('course-filter');
const errorModalEl = document.getElementById('error-modal');
const errorMessageEl = document.getElementById('error-message');

// API functions
async function makeAPIRequest(endpoint, params = {}) {
    const url = new URL(`${CANVAS_CONFIG.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${CANVAS_CONFIG.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
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

// UI functions
function showError(message) {
    errorMessageEl.textContent = message;
    errorModalEl.style.display = 'flex';
}

function closeErrorModal() {
    errorModalEl.style.display = 'none';
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
    profileInfoEl.innerHTML = `
        <div class="profile-info">
            <div class="profile-item">
                <i class="fas fa-user"></i>
                <div>
                    <strong>Name:</strong> ${profile.name || 'N/A'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <strong>Email:</strong> ${profile.email || 'No email available'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-id-card"></i>
                <div>
                    <strong>User ID:</strong> ${profile.id || 'N/A'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-calendar"></i>
                <div>
                    <strong>Created:</strong> ${formatDate(profile.created_at)}
                </div>
            </div>
        </div>
    `;
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
    if (assignmentsList.length === 0) {
        assignmentsListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No assignments found</p>
            </div>
        `;
        return;
    }

    assignmentsListEl.innerHTML = assignmentsList.map(assignment => {
        const course = courses.find(c => c.id === assignment.course_id);
        const courseName = course ? course.name : 'Unknown Course';
        
        return `
            <div class="assignment-item">
                <div class="assignment-header">
                    <div class="assignment-name">${assignment.name}</div>
                    <div class="assignment-course">${courseName}</div>
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
                        <i class="fas fa-circle status-${assignment.workflow_state || 'unknown'}"></i>
                        <span>Status: ${assignment.workflow_state || 'Unknown'}</span>
                    </div>
                    ${assignment.description ? `
                        <div class="assignment-detail">
                            <i class="fas fa-file-alt"></i>
                            <span>Description: ${assignment.description.substring(0, 100)}${assignment.description.length > 100 ? '...' : ''}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
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

function filterAssignments() {
    const selectedCourseId = courseFilterEl.value;
    
    if (!selectedCourseId) {
        renderAssignments(assignments);
    } else {
        const filteredAssignments = assignments.filter(assignment => 
            assignment.course_id == selectedCourseId
        );
        renderAssignments(filteredAssignments);
    }
}

// Event listeners
document.getElementById('refresh-courses').addEventListener('click', async () => {
    try {
        courses = await fetchCourses();
        renderCourses(courses);
        updateCourseFilter();
    } catch (error) {
        showError(`Failed to refresh courses: ${error.message}`);
    }
});

document.getElementById('refresh-assignments').addEventListener('click', async () => {
    try {
        assignments = [];
        for (const course of courses) {
            try {
                const courseAssignments = await fetchAssignments(course.id);
                courseAssignments.forEach(assignment => {
                    assignment.course_id = course.id;
                });
                assignments.push(...courseAssignments);
            } catch (error) {
                console.warn(`Failed to fetch assignments for course ${course.id}:`, error);
            }
        }
        renderAssignments(assignments);
    } catch (error) {
        showError(`Failed to refresh assignments: ${error.message}`);
    }
});

courseFilterEl.addEventListener('change', filterAssignments);

// Initialize application
async function init() {
    try {
        showLoading();
        
        // Fetch user profile
        userProfile = await fetchUserProfile();
        renderProfile(userProfile);
        
        // Fetch courses
        courses = await fetchCourses();
        renderCourses(courses);
        updateCourseFilter();
        
        // Fetch assignments for all courses
        assignments = [];
        for (const course of courses) {
            try {
                const courseAssignments = await fetchAssignments(course.id);
                courseAssignments.forEach(assignment => {
                    assignment.course_id = course.id;
                });
                assignments.push(...courseAssignments);
            } catch (error) {
                console.warn(`Failed to fetch assignments for course ${course.id}:`, error);
            }
        }
        renderAssignments(assignments);
        
        hideLoading();
    } catch (error) {
        console.error('Initialization failed:', error);
        showError(`Failed to load data: ${error.message}`);
        hideLoading();
    }
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', init); 