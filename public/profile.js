// Profile page functionality
let userProfile = null;

// DOM elements
const loadingEl = document.getElementById('loading');
const mainContentEl = document.getElementById('main-content');
const userNameEl = document.getElementById('user-name');
const profileNameEl = document.getElementById('profile-name');
const profileEmailEl = document.getElementById('profile-email');
const personalInfoEl = document.getElementById('personal-info');
const academicInfoEl = document.getElementById('academic-info');
const backToDashboardBtn = document.getElementById('back-to-dashboard');
const logoutBtn = document.getElementById('logout-btn');

// Edit profile modal elements
const editProfileBtn = document.getElementById('edit-profile-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const cancelEditBtn = document.getElementById('cancel-edit');
const editProfileForm = document.getElementById('edit-profile-form');

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    // Event listeners
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', function() {
            window.location.href = '/dashboard';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Edit profile modal event listeners
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditModal);
    }
    
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', closeEditModal);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    }
    
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleEditProfileSubmit);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === editProfileModal) {
            closeEditModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && editProfileModal.style.display === 'block') {
            closeEditModal();
        }
    });
});

async function checkAuthentication() {
    try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
            const userProfile = await response.json();
            initProfile(userProfile);
        } else {
            // For testing, show demo data instead of redirecting
            console.log('No authentication, showing demo data');
            showDemoProfile();
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        // For testing, show demo data instead of redirecting
        console.log('Authentication failed, showing demo data');
        showDemoProfile();
    }
}

function initProfile(profile) {
    // Store user profile
    userProfile = profile;
    
    // Render profile data
    renderProfile(profile);
    
    // Update mascot navigation button with institution info
    updateMascotNavButton();
    
    // Hide loading and show content
    hideLoading();
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

function showDemoProfile() {
    // Show demo data for testing
    const demoProfile = {
        name: 'Viona Shah',
        email: 'viona.shah@osu.edu',
        canvas_email: 'viona.shah@osu.edu',
        id: '85970000001528830',
        created_at: '2023-08-15T10:30:00Z',
        institution: 'Ohio State University',
        major: 'Computer Science',
        year: 'Junior',
        gpa: '3.8',
        total_courses: 15,
        completed_assignments: 127,
        login_method: 'canvas',
        connected_at: new Date().toISOString()
    };
    
    // Initialize with demo data
    userProfile = demoProfile;
    
    // Render demo data
    renderProfile(demoProfile);
    
    // Hide loading and show content
    hideLoading();
}

function renderProfile(profile) {
    // Update header elements
    userNameEl.textContent = profile.name || 'User';
    profileNameEl.textContent = profile.name || 'User';
    profileEmailEl.textContent = profile.email || 'No email available';
    
    // Render personal information
    personalInfoEl.innerHTML = `
        <div class="profile-info">
            <div class="profile-item">
                <i class="fas fa-user"></i>
                <div>
                    <strong>Full Name:</strong> ${profile.name || 'N/A'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <strong>Canvas Email:</strong> ${profile.canvas_email || profile.email || 'No email available'}
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
                    <strong>Account Created:</strong> ${formatDate(profile.created_at)}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-link"></i>
                <div>
                    <strong>Connected:</strong> ${formatDate(profile.connected_at)}
                </div>
            </div>
        </div>
    `;
    
    // Render academic information
    academicInfoEl.innerHTML = `
        <div class="profile-info">
            <div class="profile-item">
                <i class="fas fa-university"></i>
                <div>
                    <strong>Institution:</strong> ${profile.institution || 'Ohio State University'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-chalkboard"></i>
                <div>
                    <strong>LMS Platform:</strong> ${profile.login_method ? profile.login_method.toUpperCase() : 'Canvas'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-graduation-cap"></i>
                <div>
                    <strong>Major:</strong> ${profile.major || 'Computer Science'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-calendar-alt"></i>
                <div>
                    <strong>Year:</strong> ${profile.year || 'Junior'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-star"></i>
                <div>
                    <strong>GPA:</strong> ${profile.gpa || '3.8'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-book"></i>
                <div>
                    <strong>Total Courses:</strong> ${profile.total_courses || '15'}
                </div>
            </div>
            <div class="profile-item">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Completed Assignments:</strong> ${profile.completed_assignments || '127'}
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return 'No date available';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showLoading() {
    loadingEl.style.display = 'flex';
    mainContentEl.style.display = 'none';
}

function hideLoading() {
    loadingEl.style.display = 'none';
    mainContentEl.style.display = 'block';
}

// Edit Profile Modal Functions
function openEditModal() {
    if (!userProfile) return;
    
    // Populate form fields with current profile data
    document.getElementById('edit-name').value = userProfile.name || '';
    document.getElementById('edit-email').value = userProfile.email || '';
    document.getElementById('edit-major').value = userProfile.major || '';
    document.getElementById('edit-year').value = userProfile.year || 'Junior';
    document.getElementById('edit-gpa').value = userProfile.gpa || '';
    document.getElementById('edit-institution').value = userProfile.institution || '';
    
    // Show modal
    editProfileModal.style.display = 'block';
}

function closeEditModal() {
    editProfileModal.style.display = 'none';
}

async function handleEditProfileSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(editProfileForm);
    const updatedProfile = {
        name: formData.get('name'),
        email: formData.get('email'),
        major: formData.get('major'),
        year: formData.get('year'),
        gpa: formData.get('gpa'),
        institution: formData.get('institution')
    };
    
    try {
        // Show loading state
        const submitBtn = editProfileForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        // Update profile (in demo mode, just update local data)
        if (userProfile.email === 'demo@osu.edu') {
            // Demo mode - update local profile
            userProfile = { ...userProfile, ...updatedProfile };
            renderProfile(userProfile);
            showSuccess('Profile updated successfully!');
        } else {
            // Real mode - send to server
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProfile),
                credentials: 'include'
            });
            
            if (response.ok) {
                const updatedUserProfile = await response.json();
                userProfile = updatedUserProfile;
                renderProfile(userProfile);
                showSuccess('Profile updated successfully!');
            } else {
                throw new Error('Failed to update profile');
            }
        }
        
        // Close modal
        closeEditModal();
        
    } catch (error) {
        console.error('Profile update error:', error);
        showError('Failed to update profile. Please try again.');
    } finally {
        // Reset button state
        const submitBtn = editProfileForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        submitBtn.disabled = false;
    }
}

function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-success show';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-error show';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            // For demo purposes, just redirect to login
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout error:', error);
        // For demo purposes, just redirect to login
        window.location.href = '/';
    }
} 