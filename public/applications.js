// Applications Page JavaScript

// Demo applications data
let applications = [
    {
        id: 1,
        programName: "Computer Science Master's",
        institution: "Stanford University",
        type: "graduate",
        deadline: "2024-12-15",
        status: "in-progress",
        priority: "high",
        notes: "Need to complete GRE and get recommendation letters",
        createdAt: "2024-10-01"
    },
    {
        id: 2,
        programName: "Data Science Internship",
        institution: "Google",
        type: "internship",
        deadline: "2024-11-30",
        status: "submitted",
        priority: "high",
        notes: "Application submitted, waiting for interview",
        createdAt: "2024-09-15"
    },
    {
        id: 3,
        programName: "Merit Scholarship",
        institution: "Ohio State University",
        type: "scholarship",
        deadline: "2024-12-01",
        status: "planning",
        priority: "medium",
        notes: "Need to gather financial documents",
        createdAt: "2024-10-10"
    },
    {
        id: 4,
        programName: "Research Assistant Position",
        institution: "MIT",
        type: "research",
        deadline: "2024-11-15",
        status: "accepted",
        priority: "high",
        notes: "Position accepted! Starting in January",
        createdAt: "2024-08-20"
    },
    {
        id: 5,
        programName: "Business Administration",
        institution: "Harvard University",
        type: "graduate",
        deadline: "2024-12-10",
        status: "rejected",
        priority: "medium",
        notes: "Application was rejected due to low GMAT score",
        createdAt: "2024-09-01"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadUserInfo();
    renderApplications();
    renderDeadlines();
    setupEventListeners();
});

// Check if user is authenticated
function checkAuthentication() {
    // For demo purposes, we'll assume user is authenticated
    // In a real app, you'd check session/token here
    console.log('User authenticated');
}

// Load user information
function loadUserInfo() {
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        userNameEl.textContent = 'Demo User (Ohio State Akorn)';
    }
    
    // Update mascot navigation button with institution info
    updateMascotNavButton();
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

// Setup event listeners
function setupEventListeners() {
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplicationSubmit);
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Handle application form submission
function handleApplicationSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newApplication = {
        id: Date.now(), // Simple ID generation
        programName: formData.get('program-name') || document.getElementById('program-name').value,
        institution: formData.get('institution') || document.getElementById('institution').value,
        type: document.getElementById('application-type').value,
        deadline: document.getElementById('deadline').value,
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        notes: document.getElementById('notes').value,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Add to applications array
    applications.push(newApplication);
    
    // Reset form
    event.target.reset();
    
    // Re-render applications
    renderApplications();
    renderDeadlines();
    updateStatusOverview();
    
    // Show success message
    showNotification('Application added successfully!', 'success');
}

// Render applications list
function renderApplications() {
    const applicationsListEl = document.getElementById('applications-list');
    if (!applicationsListEl) return;
    
    if (applications.length === 0) {
        applicationsListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-rocket"></i>
                <h3>No applications yet</h3>
                <p>Add your first application to get started!</p>
            </div>
        `;
        return;
    }
    
    applicationsListEl.innerHTML = applications.map(app => {
        const daysUntilDeadline = getDaysUntilDeadline(app.deadline);
        const statusClass = getStatusClass(app.status);
        const priorityClass = getPriorityClass(app.priority);
        
        return `
            <div class="application-card ${statusClass} ${priorityClass}" data-id="${app.id}">
                <div class="application-header">
                    <div class="application-title">
                        <h4>${app.programName}</h4>
                        <p class="institution">${app.institution}</p>
                    </div>
                    <div class="application-actions">
                        <span class="status-badge ${statusClass}">${formatStatus(app.status)}</span>
                        <span class="priority-badge ${priorityClass}">${app.priority}</span>
                        <button class="btn btn-sm btn-secondary" onclick="editApplication(${app.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteApplication(${app.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="application-details">
                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${formatType(app.type)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Deadline: ${formatDate(app.deadline)}</span>
                        ${daysUntilDeadline > 0 ? `<span class="days-left">(${daysUntilDeadline} days left)</span>` : ''}
                    </div>
                    ${app.notes ? `
                        <div class="detail-item">
                            <i class="fas fa-sticky-note"></i>
                            <span>${app.notes}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Render deadlines timeline
function renderDeadlines() {
    const deadlinesEl = document.getElementById('deadlines-timeline');
    if (!deadlinesEl) return;
    
    const upcomingDeadlines = applications
        .filter(app => app.status !== 'accepted' && app.status !== 'rejected')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    if (upcomingDeadlines.length === 0) {
        deadlinesEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <h3>No upcoming deadlines</h3>
                <p>All your applications are up to date!</p>
            </div>
        `;
        return;
    }
    
    deadlinesEl.innerHTML = upcomingDeadlines.map(app => {
        const daysUntilDeadline = getDaysUntilDeadline(app.deadline);
        const urgencyClass = daysUntilDeadline <= 7 ? 'urgent' : daysUntilDeadline <= 30 ? 'warning' : 'normal';
        
        return `
            <div class="deadline-item ${urgencyClass}">
                <div class="deadline-date">
                    <div class="date-number">${new Date(app.deadline).getDate()}</div>
                    <div class="date-month">${new Date(app.deadline).toLocaleDateString('en-US', { month: 'short' })}</div>
                </div>
                <div class="deadline-content">
                    <h4>${app.programName}</h4>
                    <p>${app.institution}</p>
                    <span class="deadline-status">${formatStatus(app.status)}</span>
                </div>
                <div class="deadline-countdown">
                    <span class="days-left ${urgencyClass}">${daysUntilDeadline} days</span>
                </div>
            </div>
        `;
    }).join('');
}

// Update status overview
function updateStatusOverview() {
    const statusCounts = {
        pending: applications.filter(app => ['planning', 'in-progress'].includes(app.status)).length,
        submitted: applications.filter(app => ['submitted', 'under-review'].includes(app.status)).length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
    };
    
    // Update the status cards
    const statusCards = document.querySelectorAll('.status-count');
    statusCards[0].textContent = `${statusCounts.pending} Applications`;
    statusCards[1].textContent = `${statusCounts.submitted} Applications`;
    statusCards[2].textContent = `${statusCounts.accepted} Applications`;
    statusCards[3].textContent = `${statusCounts.rejected} Application${statusCounts.rejected !== 1 ? 's' : ''}`;
}

// Filter applications
function filterApplications(filter) {
    const applicationCards = document.querySelectorAll('.application-card');
    
    applicationCards.forEach(card => {
        const status = card.querySelector('.status-badge').textContent.toLowerCase();
        
        if (filter === 'all' || 
            (filter === 'pending' && ['planning', 'in progress'].includes(status)) ||
            (filter === 'submitted' && ['submitted', 'under review'].includes(status))) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Edit application
function editApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    // Populate form with application data
    document.getElementById('program-name').value = app.programName;
    document.getElementById('institution').value = app.institution;
    document.getElementById('application-type').value = app.type;
    document.getElementById('deadline').value = app.deadline;
    document.getElementById('status').value = app.status;
    document.getElementById('priority').value = app.priority;
    document.getElementById('notes').value = app.notes;
    
    // Remove the old application
    applications = applications.filter(a => a.id !== id);
    
    // Update the form submit button
    const submitBtn = document.querySelector('#application-form button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Application';
    submitBtn.onclick = () => handleApplicationUpdate(id);
    
    // Scroll to form
    document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
}

// Handle application update
function handleApplicationUpdate(id) {
    const form = document.getElementById('application-form');
    const formData = new FormData(form);
    
    const updatedApplication = {
        id: id,
        programName: document.getElementById('program-name').value,
        institution: document.getElementById('institution').value,
        type: document.getElementById('application-type').value,
        deadline: document.getElementById('deadline').value,
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        notes: document.getElementById('notes').value,
        createdAt: applications.find(a => a.id === id)?.createdAt || new Date().toISOString().split('T')[0]
    };
    
    // Add back to applications
    applications.push(updatedApplication);
    
    // Reset form
    form.reset();
    
    // Reset submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Application';
    submitBtn.onclick = null;
    
    // Re-render
    renderApplications();
    renderDeadlines();
    updateStatusOverview();
    
    showNotification('Application updated successfully!', 'success');
}

// Delete application
function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        applications = applications.filter(a => a.id !== id);
        renderApplications();
        renderDeadlines();
        updateStatusOverview();
        showNotification('Application deleted successfully!', 'success');
    }
}

// Helper functions
function getDaysUntilDeadline(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getStatusClass(status) {
    const statusMap = {
        'planning': 'status-planning',
        'in-progress': 'status-progress',
        'submitted': 'status-submitted',
        'under-review': 'status-review',
        'accepted': 'status-accepted',
        'rejected': 'status-rejected',
        'waitlisted': 'status-waitlisted'
    };
    return statusMap[status] || 'status-default';
}

function getPriorityClass(priority) {
    return `priority-${priority}`;
}

function formatStatus(status) {
    const statusMap = {
        'planning': 'Planning',
        'in-progress': 'In Progress',
        'submitted': 'Submitted',
        'under-review': 'Under Review',
        'accepted': 'Accepted',
        'rejected': 'Rejected',
        'waitlisted': 'Waitlisted'
    };
    return statusMap[status] || status;
}

function formatType(type) {
    const typeMap = {
        'graduate': 'Graduate School',
        'undergraduate': 'Undergraduate',
        'internship': 'Internship',
        'scholarship': 'Scholarship',
        'research': 'Research Position',
        'other': 'Other'
    };
    return typeMap[type] || type;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize status overview
updateStatusOverview();

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/';
    }
} 