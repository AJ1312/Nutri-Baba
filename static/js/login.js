// NutriBaba Login & Signup JavaScript

// DOM Elements
const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const loadingOverlay = document.getElementById('loadingOverlay');

let currentUserId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setActiveForm('login');
});

// Form Toggle Functions
loginToggle.addEventListener('click', () => setActiveForm('login'));
signupToggle.addEventListener('click', () => setActiveForm('signup'));

function setActiveForm(type) {
    if (type === 'login') {
        loginToggle.classList.add('active');
        signupToggle.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupToggle.classList.add('active');
        loginToggle.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = this.querySelector('.eye-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            `;
        } else {
            input.type = 'password';
            icon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        }
    });
});

// Login Form Handler
loginFormElement.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    showLoadingOverlay(true);
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.message, 'success');
            setTimeout(() => {
                if (data.redirect === 'profile') {
                    window.location.href = '/profile';
                } else {
                    window.location.href = '/dashboard';
                }
            }, 1500);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        showLoadingOverlay(false);
    }
});

// Signup Form Handler
signupFormElement.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const terms = document.querySelector('input[name="terms"]').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (!terms) {
        showMessage('Please accept the terms and conditions', 'error');
        return;
    }
    
    showLoadingOverlay(true);
    
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUserId = data.user_id;
            showOTPModal();
            showMessage(data.message, 'success');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        showLoadingOverlay(false);
    }
});

// OTP Modal Functions
function showOTPModal() {
    const existingModal = document.getElementById('otpModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'otpModal';
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Verify Your Email</h3>
            </div>
            <div class="modal-body">
                <p>We've sent a 6-digit OTP to your email address. Please enter it below:</p>
                <div style="margin: 20px 0;">
                    <input type="text" id="otpInput" placeholder="Enter 6-digit OTP" maxlength="6"
                           style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; font-size: 18px; letter-spacing: 2px;">
                </div>
                <div id="otpError" style="color: #ef4444; font-size: 14px; margin-top: 10px;"></div>
            </div>
            <div class="modal-footer">
                <button onclick="verifyOTP()" class="btn btn-primary" style="margin-right: 10px;">Verify</button>
                <button onclick="resendOTP()" class="btn" style="background: #f3f4f6; color: #374151;">Resend OTP</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on OTP input
    setTimeout(() => {
        document.getElementById('otpInput').focus();
    }, 100);
    
    // Close modal on overlay click
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
    });
}

async function verifyOTP() {
    const otp = document.getElementById('otpInput').value.trim();
    const errorDiv = document.getElementById('otpError');
    
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        errorDiv.textContent = 'Please enter a valid 6-digit OTP';
        return;
    }
    
    showLoadingOverlay(true);
    
    try {
        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUserId,
                otp: otp
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('otpModal').remove();
            showMessage(data.message, 'success');
            setTimeout(() => {
                setActiveForm('login');
            }, 2000);
        } else {
            errorDiv.textContent = data.message;
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
    } finally {
        showLoadingOverlay(false);
    }
}

async function resendOTP() {
    if (!currentUserId) return;
    
    showLoadingOverlay(true);
    
    try {
        const response = await fetch('/api/resend-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUserId
            })
        });
        
        const data = await response.json();
        showMessage(data.message, data.success ? 'success' : 'error');
        
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        showLoadingOverlay(false);
    }
}

// Utility Functions
function showLoadingOverlay(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.flash-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flash-message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Social login handlers (placeholder)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showMessage('Social login coming soon!', 'info');
    });
});
