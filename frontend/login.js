console.log('EduQuery login Script Loaded');
// login.js - Handles login authentication for EduQuery SG with Toast notifications
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');

    // Server endpoint - update this with your actual server URL
    const LOGIN_ENDPOINT = '/login';

    // Create toast container if it doesn't exist
    function createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    }

    // Toast notification function
    function showToast(message, type = 'error') {
        createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        const container = document.getElementById('toast-container');
        container.appendChild(toast);

        // Add show class for animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, type === 'success' ? 3000 : 5000);
    }

    // Function to set loading state
    function setLoadingState(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            loginBtn.style.opacity = '0.7';
        } else {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
            loginBtn.style.opacity = '1';
        }
    }

    // Function to validate form inputs
    function validateForm(username, password) {
        if (!username.trim()) {
            showToast('Username is required', 'error');
            usernameInput.focus();
            return false;
        }

        if (!password.trim()) {
            showToast('Password is required', 'error');
            passwordInput.focus();
            return false;
        }
        return true;
    }

    // Function to send login request to server
    async function sendLoginRequest(username, password) {
        try {
            // Send as JSON instead of FormData
            const response = await fetch(LOGIN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            });

            // Log the request details for debugging
            console.log('Login request sent:', {
            timestamp: new Date().toISOString(),
            username: username,
            endpoint: LOGIN_ENDPOINT,
            method: 'POST',
            contentType: 'application/json'
            });

            if (!response.ok) {
            let errorMsg = `Server responded with status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch (e) {
                errorMsg = response.statusText || errorMsg;
            }
            throw new Error(errorMsg);
            }

            const data = await response.json();
            
            console.log('Login response received:', {
            timestamp: new Date().toISOString(),
            username: username,
            status: response.status,
            response: data
            });

            return data;

        } catch (error) {
            console.error('Login request failed:', {
            timestamp: new Date().toISOString(),
            username: username,
            error: error.message
            });
            throw error;
        }
    }


    // Function to handle login success
    function handleLoginSuccess(responseData) {
        showToast('Login successful! Redirecting...', 'success');
        
        // Log successful authentication
        console.log('User authentication successful:', {
            timestamp: new Date().toISOString(),
            username: usernameInput.value,
            sessionData: responseData
        });

        // Store authentication token if provided
        if (responseData.token) {
            localStorage.setItem('authToken', responseData.token);
            localStorage.setItem('username', usernameInput.value);
        }

        // Store user data if provided
        if (responseData.user) {
            localStorage.setItem('userData', JSON.stringify(responseData.user));
        }

        // Redirect to home.html
        setTimeout(() => {
            // Use the redirectUrl from server response, or default to home.html
            const redirectUrl = responseData.redirectUrl || '/home.html';
            console.log('Redirecting to:', redirectUrl);
            window.location.href = redirectUrl;
        }, 1500);
    }

    // Function to handle login failure
    function handleLoginFailure(error) {
        let errorMsg = 'Login failed. Please try again.';
        
        if (error.message.includes('401') || error.message.toLowerCase().includes('invalid')) {
            errorMsg = 'Invalid username or password';
        } else if (error.message.includes('404')) {
            errorMsg = 'Login service unavailable';
        } else if (error.message.includes('500')) {
            errorMsg = 'Server error. Please try again later.';
        } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
            errorMsg = 'Network error. Please check your connection.';
        } else if (error.message.includes('timeout')) {
            errorMsg = 'Request timeout. Please try again.';
        } else {
            // Use the actual error message from server if available
            errorMsg = error.message;
        }

        showToast(errorMsg, 'error');

        // Log the failed login attempt
        console.warn('Login attempt failed:', {
            timestamp: new Date().toISOString(),
            username: usernameInput.value,
            error: error.message,
            userMessage: errorMsg
        });
    }

    // Main login form submission handler
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Hide any existing error message
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }

        // Validate form inputs
        if (!validateForm(username, password)) {
            return;
        }

        // Set loading state
        setLoadingState(true);

        try {
            // Send login request to server
            const responseData = await sendLoginRequest(username, password);
            
            // Handle successful login
            handleLoginSuccess(responseData);

        } catch (error) {
            // Handle login failure
            handleLoginFailure(error);
        } finally {
            // Reset loading state
            setLoadingState(false);
        }
    });

    // Enter key support
    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
/*
    // Check if user is already logged in (optional)
    function checkExistingSession() {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            console.log('Existing session found for user:', localStorage.getItem('username'));
            // Optional: show welcome back message
            // showToast(`Welcome back, ${localStorage.getItem('username')}!`, 'info');
        }
    }

    // Initialize session check
    checkExistingSession();

    // Log page load
    console.log('EduQuery SG Login page loaded:', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
});

// Global logout function
function logout() {
    const username = localStorage.getItem('username') || 'Unknown';
    
    // Clear stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
    
    console.log('User logged out:', {
        timestamp: new Date().toISOString(),
        username: username
    });

    // Show logout confirmation
    if (typeof showToast === 'function') {
        showToast('You have been logged out successfully', 'info');
    }

    // Redirect to login page after a brief delay
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 1000);
}

// Global function to show toast from anywhere
function showGlobalToast(message, type = 'info') {
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        // Fallback to alert if toast system not loaded
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { logout, showGlobalToast };
}
    */