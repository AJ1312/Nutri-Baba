const profileForm = document.getElementById('profileForm');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const bmiDisplay = document.getElementById('bmiDisplay');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const submitBtn = document.getElementById('submitBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const successModal = document.getElementById('successModal');

let currentProfileData = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function () {
    loadUserData();
    setupEventListeners();
    createProfileDisplaySection();
});

function createProfileDisplaySection() {
    if (!document.getElementById('profileDisplay')) {
        const profileDisplay = document.createElement('div');
        profileDisplay.id = 'profileDisplay';
        profileDisplay.className = 'profile-display hidden';
        profileDisplay.innerHTML = `
            <div class="profile-header">
                <h2>Your Profile</h2>
                <button type="button" id="editProfileBtn" class="edit-btn">
                    <i class="fas fa-edit"></i>
                    Edit Profile
                </button>
            </div>
            <div id="profileContent" class="profile-content">
            </div>
        `;

        profileForm.parentNode.insertBefore(profileDisplay, profileForm.nextSibling);
        document.getElementById('editProfileBtn').addEventListener('click', toggleEditMode);
    }
}

function loadUserData() {
    checkExistingProfile();
}

async function checkExistingProfile() {
    try {
        const response = await fetch('/api/get-profile');
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.profile) {
                currentProfileData = data.profile;
                updateHeroForExistingUser();
                displayProfile(currentProfileData);
                hideForm();
            }
        }
    } catch (error) {
        console.log('No existing profile found');
    }
}

function updateHeroForExistingUser() {
    document.querySelector('.hero-title').textContent = 'Your Profile Overview';
    document.querySelector('.hero-subtitle').textContent = 'Review and update your information for personalized diet planning.';
}

function updateHeroForNewUser() {
    document.querySelector('.hero-title').textContent = 'Complete Your Profile';
    document.querySelector('.hero-subtitle').textContent = 'Help us personalize your nutrition journey with some basic information about you.';
}


function setupEventListeners() {
    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
    setupHealthConditionsLogic();
    setupAllergiesLogic();
    profileForm.addEventListener('submit', handleSubmit);
}

function calculateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (height && weight && height > 0 && weight > 0) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const bmiRounded = bmi.toFixed(1);

        bmiValue.textContent = bmiRounded;

        let category = '';
        let categoryClass = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'underweight';
        } else if (bmi < 25) {
            category = 'Normal';
            categoryClass = 'normal';
        } else if (bmi < 30) {
            category = 'Overweight';
            categoryClass = 'overweight';
        } else {
            category = 'Obese';
            categoryClass = 'obese';
        }

        bmiCategory.textContent = category;
        bmiCategory.className = `bmi-category ${categoryClass}`;
        bmiDisplay.classList.remove('hidden');
    } else {
        bmiDisplay.classList.add('hidden');
    }
}

function setupHealthConditionsLogic() {
    const healthConditions = document.querySelectorAll('input[name="healthConditions"]');
    const noneOption = document.querySelector('input[name="healthConditions"][value="none"]');

    healthConditions.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.value === 'none' && this.checked) {
                healthConditions.forEach(cb => {
                    if (cb.value !== 'none') cb.checked = false;
                });
            } else if (this.checked && this.value !== 'none') {
                noneOption.checked = false;
            }
        });
    });
}

function setupAllergiesLogic() {
    const allergies = document.querySelectorAll('input[name="allergies"]');
    const noneOption = document.querySelector('input[name="allergies"][value="none"]');

    allergies.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.value === 'none' && this.checked) {
                allergies.forEach(cb => {
                    if (cb.value !== 'none') cb.checked = false;
                });
            } else if (this.checked && this.value !== 'none') {
                noneOption.checked = false;
            }
        });
    });
}

async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = gatherFormData();
    showLoadingOverlay(true);

    try {
        const endpoint = isEditMode ? '/api/update-profile' : '/api/complete-profile';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            currentProfileData = formData;
            displayProfile(currentProfileData);
            hideForm();
            showMessage(isEditMode ? 'Profile updated successfully!' : 'Profile created successfully!', 'success');
            isEditMode = false;
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        showLoadingOverlay(false);
    }
}

function displayProfile(profileData) {
    const profileContent = document.getElementById('profileContent');
    const bmi = profileData.bmi || calculateBMIFromData(profileData);
    const bmiCategory = getBMICategory(bmi);

    profileContent.innerHTML = `
        <div class="profile-grid">
            <div class="profile-section">
                <h3><i class="fas fa-user"></i> Personal Information</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Name:</span>
                        <span class="value">${profileData.firstName} ${profileData.lastName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">${profileData.email}</span>
                    </div>
                    ${profileData.phone ? `
                    <div class="detail-row">
                        <span class="label">Phone:</span>
                        <span class="value">${profileData.phone}</span>
                    </div>` : ''}
                    <div class="detail-row">
                        <span class="label">Age:</span>
                        <span class="value">${profileData.age} years</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Gender:</span>
                        <span class="value">${capitalizeFirst(profileData.gender)}</span>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3><i class="fas fa-weight"></i> Physical Measurements</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Height:</span>
                        <span class="value">${profileData.height} cm</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Weight:</span>
                        <span class="value">${profileData.weight} kg</span>
                    </div>
                    ${profileData.targetWeight ? `
                    <div class="detail-row">
                        <span class="label">Target Weight:</span>
                        <span class="value">${profileData.targetWeight} kg</span>
                    </div>` : ''}
                    <div class="detail-row">
                        <span class="label">BMI:</span>
                        <span class="value bmi-${bmiCategory.class}">${bmi} (${bmiCategory.category})</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Activity Level:</span>
                        <span class="value">${formatActivityLevel(profileData.activityLevel)}</span>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3><i class="fas fa-heartbeat"></i> Health Information</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Health Conditions:</span>
                        <span class="value">${formatArray(profileData.healthConditions)}</span>
                    </div>
                    ${profileData.medications ? `
                    <div class="detail-row">
                        <span class="label">Medications:</span>
                        <span class="value">${profileData.medications}</span>
                    </div>` : ''}
                </div>
            </div>

            <div class="profile-section">
                <h3><i class="fas fa-utensils"></i> Dietary Preferences</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Diet Type:</span>
                        <span class="value">${capitalizeFirst(profileData.dietType)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Meals Per Day:</span>
                        <span class="value">${profileData.mealsPerDay}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Food Allergies:</span>
                        <span class="value">${formatArray(profileData.allergies)}</span>
                    </div>
                    ${profileData.foodDislikes ? `
                    <div class="detail-row">
                        <span class="label">Food Dislikes:</span>
                        <span class="value">${profileData.foodDislikes}</span>
                    </div>` : ''}
                </div>
            </div>

            <div class="profile-section">
                <h3><i class="fas fa-target"></i> Goals & Lifestyle</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Primary Goal:</span>
                        <span class="value">${formatGoal(profileData.primaryGoal)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Water Intake:</span>
                        <span class="value">${profileData.waterIntake} glasses/day</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Sleep Hours:</span>
                        <span class="value">${profileData.sleepHours} hours/night</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Stress Level:</span>
                        <span class="value">${capitalizeFirst(profileData.stressLevel)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('profileDisplay').classList.remove('hidden');
}

function toggleEditMode() {
    if (currentProfileData) {
        populateFormWithData(currentProfileData);
        showForm();
        hideProfileDisplay();
        isEditMode = true;
        submitBtn.innerHTML = '<i class="fas fa-save"></i><span class="btn-text">Update Profile</span>';
        showMessage('You can now edit your profile information.', 'info');
    }
}

function populateFormWithData(data) {
    document.getElementById('firstName').value = data.firstName || '';
    document.getElementById('lastName').value = data.lastName || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('age').value = data.age || '';
    document.getElementById('gender').value = data.gender || '';

    document.getElementById('height').value = data.height || '';
    document.getElementById('weight').value = data.weight || '';
    document.getElementById('targetWeight').value = data.targetWeight || '';
    document.getElementById('activityLevel').value = data.activityLevel || '';

    if (data.healthConditions) {
        data.healthConditions.forEach(condition => {
            const checkbox = document.querySelector(`input[name="healthConditions"][value="${condition}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    document.getElementById('medications').value = data.medications || '';

    document.getElementById('dietType').value = data.dietType || '';
    document.getElementById('mealsPerDay').value = data.mealsPerDay || '';
    if (data.allergies) {
        data.allergies.forEach(allergy => {
            const checkbox = document.querySelector(`input[name="allergies"][value="${allergy}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    document.getElementById('foodDislikes').value = data.foodDislikes || '';

    document.getElementById('primaryGoal').value = data.primaryGoal || '';
    document.getElementById('waterIntake').value = data.waterIntake || '';
    document.getElementById('sleepHours').value = data.sleepHours || '';
    document.getElementById('stressLevel').value = data.stressLevel || '';

    calculateBMI();
}

function showForm() {
    profileForm.classList.remove('hidden');
}

function hideForm() {
    profileForm.classList.add('hidden');
}

function hideProfileDisplay() {
    document.getElementById('profileDisplay').classList.add('hidden');
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

function formatArray(arr) {
    if (!arr || arr.length === 0) return 'None specified';
    return arr.map(item => capitalizeFirst(item)).join(', ');
}

function formatActivityLevel(level) {
    const levels = {
        'sedentary': 'Sedentary (Little to no exercise)',
        'lightly_active': 'Lightly Active (Light exercise 1-3 days/week)',
        'moderately_active': 'Moderately Active (Moderate exercise 3-5 days/week)',
        'very_active': 'Very Active (Hard exercise 6-7 days/week)',
        'extremely_active': 'Extremely Active (Physical job + exercise)'
    };
    return levels[level] || capitalizeFirst(level);
}

function formatGoal(goal) {
    const goals = {
        'weight_loss': 'Weight Loss',
        'weight_gain': 'Weight Gain',
        'muscle_gain': 'Muscle Gain',
        'maintenance': 'Weight Maintenance',
        'general_health': 'General Health',
        'athletic_performance': 'Athletic Performance',
        'medical_condition': 'Managing Medical Condition'
    };
    return goals[goal] || capitalizeFirst(goal);
}

function calculateBMIFromData(data) {
    if (data.height && data.weight) {
        const heightInMeters = data.height / 100;
        return parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return null;
}

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return { category: 'Underweight', class: 'underweight' };
    } else if (bmi < 25) {
        return { category: 'Normal', class: 'normal' };
    } else if (bmi < 30) {
        return { category: 'Overweight', class: 'overweight' };
    } else {
        return { category: 'Obese', class: 'obese' };
    }
}

function validateForm() {
    const requiredFields = [
        'firstName', 'lastName', 'email', 'age', 'gender',
        'height', 'weight', 'activityLevel', 'dietType', 'primaryGoal'
    ];

    for (const fieldName of requiredFields) {
        const field = document.getElementById(fieldName);
        if (!field.value.trim()) {
            showMessage(`Please fill in the ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            field.focus();
            return false;
        }
    }

    const age = parseInt(document.getElementById('age').value);
    if (age < 13 || age > 120) {
        showMessage('Please enter a valid age between 13 and 120.', 'error');
        return false;
    }

    const height = parseFloat(document.getElementById('height').value);
    if (height < 100 || height > 250) {
        showMessage('Please enter a valid height between 100 and 250 cm.', 'error');
        return false;
    }

    const weight = parseFloat(document.getElementById('weight').value);
    if (weight < 30 || weight > 300) {
        showMessage('Please enter a valid weight between 30 and 300 kg.', 'error');
        return false;
    }

    const allergiesChecked = document.querySelectorAll('input[name="allergies"]:checked');
    if (allergiesChecked.length === 0) {
        showMessage('Please select at least one option for food allergies.', 'error');
        return false;
    }

    return true;
}

function gatherFormData() {
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,

        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        targetWeight: document.getElementById('targetWeight').value ? parseFloat(document.getElementById('targetWeight').value) : null,
        activityLevel: document.getElementById('activityLevel').value,

        healthConditions: Array.from(document.querySelectorAll('input[name="healthConditions"]:checked')).map(cb => cb.value),
        medications: document.getElementById('medications').value.trim(),

        dietType: document.getElementById('dietType').value,
        mealsPerDay: document.getElementById('mealsPerDay').value,
        allergies: Array.from(document.querySelectorAll('input[name="allergies"]:checked')).map(cb => cb.value),
        foodDislikes: document.getElementById('foodDislikes').value.trim(),

        primaryGoal: document.getElementById('primaryGoal').value,
        waterIntake: document.getElementById('waterIntake').value,
        sleepHours: document.getElementById('sleepHours').value,
        stressLevel: document.getElementById('stressLevel').value,

        bmi: calculateBMIValue()
    };

    return formData;
}

function calculateBMIValue() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (height && weight) {
        const heightInMeters = height / 100;
        return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return null;
}

function showLoadingOverlay(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        loadingOverlay.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function showSuccessModal() {
    successModal.classList.remove('hidden');
}

function closeSuccessModal() {
    successModal.classList.add('hidden');
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 500);
}

function showMessage(message, type) {
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
        font-weight: 600;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;

    messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

window.closeSuccessModal = closeSuccessModal;
