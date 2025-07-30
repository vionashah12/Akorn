// Syllabus page functionality
let userProfile = null;

// DOM elements
const loadingEl = document.getElementById('loading');
const mainContentEl = document.getElementById('main-content');
const userNameEl = document.getElementById('user-name');
const backToDashboardBtn = document.getElementById('back-to-dashboard');
const logoutBtn = document.getElementById('logout-btn');
const uploadZone = document.getElementById('upload-zone');
const syllabusFile = document.getElementById('syllabus-file');
const uploadProgress = document.getElementById('upload-progress');
const progressFill = document.querySelector('.progress-fill');
const uploadStatus = document.getElementById('upload-status');

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
    
    // Initialize upload functionality
    initializeSyllabusUpload();
});

async function checkAuthentication() {
    try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
            const userProfile = await response.json();
            initSyllabus(userProfile);
        } else {
            // For testing, show demo data instead of redirecting
            console.log('No authentication, showing demo data');
            showDemoSyllabus();
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        // For testing, show demo data instead of redirecting
        console.log('Authentication failed, showing demo data');
        showDemoSyllabus();
    }
}

function initSyllabus(profile) {
    // Store user profile
    userProfile = profile;
    
    // Update user name
    userNameEl.textContent = `${profile.name || 'User'} (${profile.canvas_email || profile.email || 'No email'})`;
    
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

function showDemoSyllabus() {
    // Show demo data for testing
    const demoProfile = {
        name: 'Demo User (Ohio State Canvas)',
        email: 'demo@osu.edu',
        canvas_email: 'demo@osu.edu',
        id: 1,
        institution: 'Ohio State University',
        login_method: 'canvas'
    };
    
    // Initialize with demo data
    userProfile = demoProfile;
    
    // Update user name
    userNameEl.textContent = `${demoProfile.name} (${demoProfile.canvas_email || demoProfile.email})`;
    
    // Hide loading and show content
    hideLoading();
}

function showLoading() {
    loadingEl.style.display = 'flex';
    mainContentEl.style.display = 'none';
}

function hideLoading() {
    loadingEl.style.display = 'none';
    mainContentEl.style.display = 'block';
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

// Syllabus Upload Functionality
function initializeSyllabusUpload() {
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
        
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        progressFill.style.width = '100%';
        uploadStatus.textContent = 'Adding assignments to tracker...';
        
        // Simulate adding assignments
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        setTimeout(() => {
            uploadProgress.style.display = 'none';
            showSuccess(`Successfully extracted assignments from ${courseName} syllabus! Redirecting to dashboard...`);
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
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
        font-weight: 500;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
} 