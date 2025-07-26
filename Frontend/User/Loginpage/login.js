class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.loginToggle = document.getElementById('loginToggle');
        this.signupToggle = document.getElementById('signupToggle');
        this.successModal = document.getElementById('successModal');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        this.init();
    }
    
    init() {
        this.setupToggleButtons();
        this.setupPasswordToggles();
        this.setupFormSubmissions();
        this.setupFormValidation();
    }
    
    setupToggleButtons() {
        this.loginToggle.addEventListener('click', () => {
            this.showLogin();
        });
        
        this.signupToggle.addEventListener('click', () => {
            this.showSignup();
        });
    }
    
    showLogin() {
        // Update toggle buttons
        this.loginToggle.classList.add('active');
        this.signupToggle.classList.remove('active');
        
        // Show login form, hide signup form
        this.loginForm.classList.add('active');
        this.signupForm.classList.remove('active');
    }
    
    showSignup() {
        // Update toggle buttons
        this.signupToggle.classList.add('active');
        this.loginToggle.classList.remove('active');
        
        // Show signup form, hide login form
        this.signupForm.classList.add('active');
        this.loginForm.classList.remove('active');
    }
    
    setupPasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const eyeIcon = e.currentTarget.querySelector('.eye-icon');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.innerHTML = `
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                    `;
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.innerHTML = `
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    `;
                }
            });
        });
    }
    
    setupFormSubmissions() {
        const loginFormElement = document.getElementById('loginFormElement');
        const signupFormElement = document.getElementById('signupFormElement');
        
        loginFormElement.addEventListener('submit', (e) => {
            this.handleLogin(e);
        });
        
        signupFormElement.addEventListener('submit', (e) => {
            this.handleSignup(e);
        });
    }
    
    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Password confirmation validation
        const signupPassword = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('signupConfirmPassword');
        
        if (signupPassword && confirmPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch(signupPassword, confirmPassword);
            });
        }
    }
    
    validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            this.showFieldError(field, this.getValidationMessage(field));
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    validatePasswordMatch(password, confirmPassword) {
        if (password.value !== confirmPassword.value && confirmPassword.value !== '') {
            this.showFieldError(confirmPassword, 'Passwords do not match');
            return false;
        } else {
            this.clearFieldError(confirmPassword);
            return true;
        }
    }
    
    getValidationMessage(field) {
        if (field.validity.valueMissing) {
            return 'This field is required';
        }
        if (field.validity.typeMismatch) {
            if (field.type === 'email') return 'Please enter a valid email address';
        }
        if (field.validity.tooShort) {
            return Password must be at least ${field.minLength} characters;
        }
        return field.validationMessage;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--red-500)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: var(--red-500);
            font-size: var(--font-size-xs);
            margin-top: var(--space-1);
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (field.style.borderColor === 'var(--red-500)') {
            field.style.borderColor = '';
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = Object.fromEntries(formData.entries());
        
        // Validate form
        const inputs = e.target.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }
        
        try {
            await this.submitLogin(loginData);
            this.showSuccessModal('Login successful! Redirecting to dashboard...');
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
            
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Invalid email or password', 'error');
        }
    }
    
    async handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const signupData = Object.fromEntries(formData.entries());
        
        // Validate form
        const inputs = e.target.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // Validate password match
        const password = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('signupConfirmPassword');
        if (!this.validatePasswordMatch(password, confirmPassword)) {
            isValid = false;
        }
        
        // Check terms agreement
        const termsCheckbox = document.querySelector('input[name="terms"]');
        if (!termsCheckbox.checked) {
            this.showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }
        
        try {
            await this.submitSignup(signupData);
            this.showSuccessModal('Account created successfully! Please check your email to verify your account.');
            
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('Error creating account. Please try again.', 'error');
        }
    }
    
    async submitLogin(data) {
        this.showLoading(true);
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Here you would make the actual API call to your Flask backend
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify(data)
            // });
            
            console.log('Login data:', data);
            
            // Store login state for demo
            localStorage.setItem('nutribabaUser', JSON.stringify({
                email: data.email,
                loggedIn: true,
                loginTime: new Date().toISOString()
            }));
            
            return { success: true };
        } finally {
            this.showLoading(false);
        }
    }
    
    async submitSignup(data) {
        this.showLoading(true);
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Here you would make the actual API call to your Flask backend
            // const response = await fetch('/api/signup', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify(data)
            // });
            
            console.log('Signup data:', data);
            
            // Store user data for demo
            localStorage.setItem('nutribabaUser', JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                signupTime: new Date().toISOString()
            }));
            
            return { success: true };
        } finally {
            this.showLoading(false);
        }
    }
    
    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }
    
    showSuccessModal(message) {
        document.getElementById('successMessage').textContent = message;
        this.successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    hideSuccessModal() {
        this.successModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = notification notification-${type};
        
        const bgColor = type === 'error' ? 'var(--red-500)' : 'var(--primary-500)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: var(--space-4) var(--space-6);
            border-radius: var(--radius-lg);
            font-size: var(--font-size-sm);
            font-weight: 500;
            z-index: 1001;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 4000);
    }
}

// Global functions for modal
function closeSuccessModal() {
    const manager = window.authManager;
    if (manager) {
        manager.hideSuccessModal();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});