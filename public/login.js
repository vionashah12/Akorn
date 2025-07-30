// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const lmsSelect = document.getElementById('lms-select');
    const domainInput = document.getElementById('domain');
    const accessTokenInput = document.getElementById('access-token');
    const tokenHelpLink = document.getElementById('token-help-link');
    const tokenHelpModal = document.getElementById('token-help-modal');
    const closeModal = document.getElementById('close-modal');
    const demoModeLink = document.getElementById('demo-mode-link');

    // LMS selection change handler
    lmsSelect.addEventListener('change', function() {
        const selectedLMS = lmsSelect.value;
        updateDomainPlaceholder(selectedLMS);
    });

    // Update domain placeholder based on selected LMS
    function updateDomainPlaceholder(lms) {
        const placeholders = {
            'canvas': 'e.g., canvas.instructure.com',
            'blackboard': 'e.g., your-institution.edu/blackboard',
            'd2l': 'e.g., your-institution.edu/d2l'
        };
        
        domainInput.placeholder = placeholders[lms] || 'Enter your institution domain';
    }

    // Form submission handler
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const lms = lmsSelect.value;
        const domain = domainInput.value.trim();
        const accessToken = accessTokenInput.value.trim();
        
        console.log('Form data:', { lms, domain, accessToken: accessToken ? '***' : 'empty' });
        
        // Validation
        if (!lms) {
            showError('Please select your Learning Management System');
            return;
        }
        
        if (!domain) {
            showError('Please enter your institution domain');
            return;
        }
        
        if (!accessToken) {
            showError('Please enter your access token');
            return;
        }
        
        // Validate domain format based on LMS
        if (!validateDomain(domain, lms)) {
            showError(`Please enter a valid ${lms.toUpperCase()} domain`);
            return;
        }
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        submitBtn.disabled = true;
        
        try {
            console.log('Sending request to /api/login...');
            
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lms: lms,
                    domain: domain,
                    accessToken: accessToken
                })
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                // Success - redirect to dashboard
                console.log('Login successful, redirecting to dashboard...');
                window.location.href = '/dashboard';
            } else {
                // Error from server
                showError(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Connection failed. Please check your internet connection and try again.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Domain validation based on LMS
    function validateDomain(domain, lms) {
        // For Canvas, accept instructure.com domains and custom institutional domains
        if (lms === 'canvas') {
            // Allow instructure.com domains
            if (domain.includes('instructure.com')) {
                return true;
            }
            // Allow custom institutional domains (like osu.edu, etc.)
            const customDomainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return customDomainPattern.test(domain);
        }
        
        // For other LMS, use basic domain validation
        const basicDomainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return basicDomainPattern.test(domain);
    }

    // Error display function
    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and display new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        // Insert error message after the header
        const loginHeader = document.querySelector('.login-header');
        loginHeader.parentNode.insertBefore(errorDiv, loginHeader.nextSibling);
        
        // Auto-remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Success display function
    function showSuccess(message) {
        // Remove any existing messages
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        // Create and display success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
            margin-bottom: 20px;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Insert success message after the header
        const loginHeader = document.querySelector('.login-header');
        loginHeader.parentNode.insertBefore(successDiv, loginHeader.nextSibling);
        
        // Auto-remove success after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    // Modal functionality
    tokenHelpLink.addEventListener('click', function(e) {
        e.preventDefault();
        tokenHelpModal.style.display = 'block';
    });

    // Test button click
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.addEventListener('click', function(e) {
        console.log('Button clicked!');
    });

    closeModal.addEventListener('click', function() {
        tokenHelpModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === tokenHelpModal) {
            tokenHelpModal.style.display = 'none';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && tokenHelpModal.style.display === 'block') {
            tokenHelpModal.style.display = 'none';
        }
    });

    // Demo mode functionality
    demoModeLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Fill in demo credentials
        lmsSelect.value = 'canvas';
        domainInput.value = 'canvas.instructure.com';
        accessTokenInput.value = 'demo_token_for_testing';
        
        // Show a message
        showSuccess('Demo mode activated! Click "Connect" to try the app with demo data.');
    });
}); 