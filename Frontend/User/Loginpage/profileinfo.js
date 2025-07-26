class ProfileFormManager {
    constructor() {
        this.form = document.getElementById('profileForm');
        this.successModal = document.getElementById('successModal');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.submitBtn = document.getElementById('submitBtn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupBMICalculation();
        this.setupExclusiveCheckboxes();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    setupFormValidation() {
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(field, this.getValidationMessage(field));
            });
        });
    }
    
    setupBMICalculation() {
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const bmiDisplay = document.getElementById('bmiDisplay');
        const bmiValue = document.getElementById('bmiValue');
        const bmiCategory = document.getElementById('bmiCategory');
        
        const calculateBMI = () => {
            const height = parseFloat(heightInput.value);
            const weight = parseFloat(weightInput.value);
            
            if (height && weight && height > 0 && weight > 0) {
                const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
                const category = this.getBMICategory(parseFloat(bmi));
                
                bmiValue.textContent = bmi;
                bmiCategory.textContent = category.text;
                bmiCategory.className = `bmi-category ${category.class}`;
                bmiDisplay.classList.remove('hidden');
            } else {
                bmiDisplay.classList.add('hidden');
            }
        };
        
        heightInput?.addEventListener('input', calculateBMI);
        weightInput?.addEventListener('input', calculateBMI);
    }
    
    setupExclusiveCheckboxes() {
        // Health conditions
        this.setupExclusiveGroup('healthConditions', 'none');
        // Allergies
        this.setupExclusiveGroup('allergies', 'none');
    }
    
    setupExclusiveGroup(groupName, exclusiveValue) {
        const exclusiveCheckbox = document.querySelector(`input[name="${groupName}"][value="${exclusiveValue}"]`);
        const otherCheckboxes = document.querySelectorAll(`input[name="${groupName}"]:not([value="${exclusiveValue}"])`);
        
        if (exclusiveCheckbox) {
            exclusiveCheckbox.addEventListener('change', () => {
                if (exclusiveCheckbox.checked) {
                    otherCheckboxes.forEach(cb => cb.checked = false);
                }
            });
        }
        
        otherCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked && exclusiveCheckbox) {
                    exclusiveCheckbox.checked = false;
                }
            });
        });
    }
    
    getBMICategory(bmi) {
        if (bmi < 18.5) return { text: 'Underweight', class: 'underweight' };
        if (bmi < 25) return { text: 'Normal', class: 'normal' };
        if (bmi < 30) return { text: 'Overweight', class: 'overweight' };
        return { text: 'Obese', class: 'obese' };
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
    
    getValidationMessage(field) {
        if (field.validity.valueMissing) {
            return 'This field is required';
        }
        if (field.validity.typeMismatch) {
            if (field.type === 'email') return 'Please enter a valid email address';
            if (field.type === 'tel') return 'Please enter a valid phone number';
            if (field.type === 'number') return 'Please enter a valid number';
        }
        if (field.validity.rangeUnderflow) {
            return `Value must be at least ${field.min}`;
        }
        if (field.validity.rangeOverflow) {
            return `Value must be no more than ${field.max}`;
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
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Handle regular form fields
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Ensure checkbox arrays are always arrays
        ['healthConditions', 'allergies'].forEach(field => {
            if (data[field] && !Array.isArray(data[field])) {
                data[field] = [data[field]];
            }
        });
        
        return data;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        if (!allValid) {
            this.showNotification('Please fill in all required fields correctly!', 'error');
            return;
        }
        
        // Collect form data
        const profileData = this.collectFormData();
        
        try {
            await this.submitProfile(profileData);
            this.showSuccessModal();
        } catch (error) {
            console.error('Error submitting profile:', error);
            this.showNotification('Error creating profile. Please try again!', 'error');
        }
    }
    
    async submitProfile(data) {
        // Show loading state
        this.showLoading(true);
        this.setSubmitButtonState(true, 'Creating Profile...');
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Here you would make the actual API call to your Flask backend
            console.log('Profile data to submit:', data);
            
            // Store in localStorage for demo purposes
            localStorage.setItem('nutribabaProfile', JSON.stringify(data));
            
            return { success: true };
        } finally {
            this.showLoading(false);
            this.setSubmitButtonState(false, 'Complete My Profile');
        }
    }
    
    setSubmitButtonState(loading, text) {
        this.submitBtn.disabled = loading;
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnIcon = this.submitBtn.querySelector('.btn-icon');
        
        if (loading) {
            btnIcon.textContent = '⏳';
            btnText.textContent = text;
        } else {
            btnIcon.textContent = '🚀';
            btnText.textContent = text;
        }
    }
    
    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }
    
    showSuccessModal() {
        this.successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    hideSuccessModal() {
        this.successModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
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
            max-width: 300px;
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
    const manager = window.profileFormManager;
    if (manager) {
        manager.hideSuccessModal();
    }
    // Optionally redirect to dashboard
    // window.location.href = '/dashboard';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileFormManager = new ProfileFormManager();
});
