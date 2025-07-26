class ModernNutriGuru {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = null;
        this.isLoading = false;
        this.modules = {};
        this.apiBase = '';
        this.wsConnection = null;
        
        // Debounce utility
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        this.init();
    }

    async init() {
        try {
            this.setLoading(true);
            
            // Initialize core functionality
            await this.initializeAuth();
            this.setupEventListeners();
            this.setupMobileResponsiveness();
            this.initializeModules();
            await this.loadInitialData();
            this.startAutoUpdates();
            
            // Initialize interactive elements
            this.setupInteractiveCharacter();
            this.setupFunFacts();
            
            this.setLoading(false);
            this.showToast('Welcome back! Dashboard loaded successfully.', 'success');
        } catch (error) {
            console.error('Initialization error:', error);
            this.setLoading(false);
            this.showToast('Failed to load dashboard. Please refresh the page.', 'error');
        }
    }

    async initializeAuth() {
        try {
            const userData = await this.getCurrentUser();
            this.currentUser = userData;
            this.updateUserDisplay(userData);
        } catch (error) {
            console.error('Auth initialization failed:', error);
            window.location.href = '/login';
        }
    }

    async getCurrentUser() {
        try {
            const response = await fetch('/api/user-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch user data');
            }

            if (!data.success) {
                throw new Error(data.message || 'User data not available');
            }

            return data.user;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    async getUserProfile() {
        try {
            const response = await fetch('/api/get-profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });

            const data = await response.json();
            
            if (data.success) {
                return data.profile;
            } else {
                throw new Error(data.message || 'Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    }

    updateUserDisplay(userData) {
        // Update all user name displays
        const fullName = `${userData.firstName} ${userData.lastName}`;
        document.querySelectorAll('#user-name, #user-name-header, #dropdown-name').forEach(el => {
            if (el) el.textContent = fullName;
        });
        
        // Update email display
        const emailEl = document.getElementById('dropdown-email');
        if (emailEl) emailEl.textContent = userData.email;
        
        // Update greeting with time-based message
        const greetingEl = document.getElementById('greeting-title');
        if (greetingEl) {
            const hour = new Date().getHours();
            let greeting;
            if (hour < 12) greeting = 'Good morning';
            else if (hour < 17) greeting = 'Good afternoon';
            else greeting = 'Good evening';
            
            greetingEl.textContent = `${greeting}, ${userData.firstName}! 👋`;
        }
        
        // Update avatars (using default avatar or user uploaded one)
        document.querySelectorAll('#user-avatar, .header-avatar').forEach(el => {
            if (el) el.src = '../public/assets/bitmojis/user-avatar.gif';
        });
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Quick actions
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                if (action) {
                    this.showSection(action);
                }
            });
        });

        // User menu toggle
        const userMenuToggle = document.getElementById('user-menu-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuToggle && userDropdown) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }

        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Notification button
        const notificationBtn = document.getElementById('notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Water intake tracker
        const addWaterBtn = document.querySelector('.add-water-btn');
        if (addWaterBtn) {
            addWaterBtn.addEventListener('click', () => this.addWater());
        }
    }

    setupMobileResponsiveness() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarClose = document.getElementById('sidebar-close');

        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.add('show');
            });
        }

        if (sidebarClose && sidebar) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('show');
            });
        }

        // Close sidebar when clicking nav items on mobile
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('show');
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 1024) {
                sidebar.classList.remove('show');
            }
        }, 250));
    }

    initializeModules() {
        // Initialize section-specific modules
        if (window.DashboardSection) {
            this.modules.dashboard = new window.DashboardSection(this);
        }
        if (window.PhotoAnalysis) {
            this.modules.photoAnalysis = new window.PhotoAnalysis(this);
        }
        if (window.MealPlan) {
            this.modules.mealPlan = new window.MealPlan(this);
        }
        if (window.ExpertChat) {
            this.modules.expertChat = new window.ExpertChat(this);
        }
        if (window.Progress) {
            this.modules.progress = new window.Progress(this);
        }
    }

    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (navItem) navItem.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('active');

        // Update page title and subtitle
        this.updatePageTitle(sectionId);
        
        this.currentSection = sectionId;

        // Load section-specific data
        this.loadSectionData(sectionId);

        // Trigger section-specific initialization
        if (this.modules[this.camelCase(sectionId)]) {
            this.modules[this.camelCase(sectionId)].onSectionShow();
        }
    }

    updatePageTitle(sectionId) {
        const titles = {
            'dashboard': { title: 'Dashboard', subtitle: 'Welcome back! Here\'s your nutrition overview' },
            'photo-analysis': { title: 'Scan Food', subtitle: 'Upload a photo to get instant nutrition information' },
            'meal-plan': { title: 'Meal Planner', subtitle: 'Create personalized meal plans based on your goals' },
            'expert-chat': { title: 'Expert Chat', subtitle: 'Connect with certified nutrition professionals' },
            'progress': { title: 'Progress Tracking', subtitle: 'Monitor your nutrition journey over time' }
        };

        const titleData = titles[sectionId] || { title: 'Dashboard', subtitle: 'Welcome back!' };
        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');
        
        if (titleEl) titleEl.textContent = titleData.title;
        if (subtitleEl) subtitleEl.textContent = titleData.subtitle;
    }

    async loadSectionData(sectionId) {
        try {
            switch(sectionId) {
                case 'dashboard':
                    await this.loadDashboardData();
                    break;
                case 'meal-plan':
                    if (this.modules.mealPlan) {
                        await this.modules.mealPlan.loadMealPlan();
                    }
                    break;
                case 'expert-chat':
                    if (this.modules.expertChat) {
                        await this.modules.expertChat.loadExperts();
                    }
                    break;
                case 'progress':
                    if (this.modules.progress) {
                        await this.modules.progress.loadProgressCharts();
                    }
                    break;
            }
        } catch (error) {
            console.error(`Failed to load ${sectionId} data:`, error);
            this.showToast(`Failed to load ${sectionId} data`, 'error');
        }
    }

    async loadDashboardData() {
        try {
            // Load user profile and nutrition data
            const [profileData, nutritionData] = await Promise.all([
                this.getUserProfile(),
                this.getNutritionData()
            ]);
            
            if (profileData) {
                this.updateProfileDisplay(profileData);
            }
            
            if (nutritionData) {
                this.updateNutritionDisplay(nutritionData);
            }
            
            // Update progress visualization
            this.updateProgressVisualization();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showToast('Some dashboard data may not be up to date', 'warning');
        }
    }

    async getNutritionData() {
        try {
            // For now, we'll use mock data that could come from user's daily tracking
            // In a real app, this would be an API call to get today's nutrition data
            const profile = await this.getUserProfile();
            
            return {
                calories: { 
                    current: 1847, 
                    target: profile?.daily_calories || 2200 
                },
                protein: { 
                    current: 68, 
                    target: Math.round((profile?.daily_calories || 2200) * 0.2 / 4) 
                },
                carbs: { 
                    current: 185, 
                    target: Math.round((profile?.daily_calories || 2200) * 0.5 / 4) 
                },
                fat: { 
                    current: 45, 
                    target: Math.round((profile?.daily_calories || 2200) * 0.3 / 9) 
                },
                water: { current: 2.1, target: 3.5 }
            };
        } catch (error) {
            console.error('Error getting nutrition data:', error);
            return null;
        }
    }

    updateProfileDisplay(profileData) {
        // Update BMI display if exists
        const bmiElements = document.querySelectorAll('.bmi-value');
        bmiElements.forEach(el => {
            if (el && profileData.bmi) {
                el.textContent = profileData.bmi;
            }
        });

        // Update daily calories target
        const calorieTargets = document.querySelectorAll('.calorie-target');
        calorieTargets.forEach(el => {
            if (el && profileData.daily_calories) {
                el.textContent = profileData.daily_calories;
            }
        });
    }

    updateNutritionDisplay(data) {
        // Update progress ring
        const progressRing = document.querySelector('.progress-ring-circle');
        if (progressRing && data.calories) {
            const percentage = (data.calories.current / data.calories.target) * 100;
            const circumference = 2 * Math.PI * 54; // radius = 54
            const offset = circumference - (percentage / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
            progressRing.dataset.progress = percentage;
        }

        // Update calorie text
        const currentCaloriesEl = document.querySelector('.progress-text .current');
        const targetCaloriesEl = document.querySelector('.progress-text .target');
        if (currentCaloriesEl && data.calories) {
            currentCaloriesEl.textContent = data.calories.current.toLocaleString();
        }
        if (targetCaloriesEl && data.calories) {
            targetCaloriesEl.textContent = `/ ${data.calories.target.toLocaleString()}`;
        }

        // Update macro bars
        const macros = ['protein', 'carbs', 'fat'];
        macros.forEach((macro, index) => {
            const progressBar = document.querySelector(`.macro-item:nth-child(${index + 1}) .macro-progress`);
            const macroValue = document.querySelector(`.macro-item:nth-child(${index + 1}) .macro-value`);
            
            if (progressBar && data[macro]) {
                const percentage = (data[macro].current / data[macro].target) * 100;
                progressBar.style.width = `${Math.min(percentage, 100)}%`;
            }
            
            if (macroValue && data[macro]) {
                macroValue.textContent = `${data[macro].current}g / ${data[macro].target}g`;
            }
        });

        // Update water glasses
        if (data.water) {
            const glasses = document.querySelectorAll('.glass');
            const waterPercentage = data.water.current / data.water.target;
            const totalGlasses = glasses.length;
            const filledGlasses = Math.floor(waterPercentage * totalGlasses);
            const partialGlass = waterPercentage * totalGlasses - filledGlasses;

            glasses.forEach((glass, index) => {
                glass.className = 'glass';
                if (index < filledGlasses) {
                    glass.classList.add('filled');
                } else if (index === filledGlasses && partialGlass > 0.3) {
                    glass.classList.add('half');
                } else {
                    glass.classList.add('empty');
                }
            });

            // Update water stats
            const waterStats = document.querySelector('.water-stats span');
            if (waterStats) {
                waterStats.textContent = `${data.water.current}L / ${data.water.target}L`;
            }
        }
    }

    updateProgressVisualization() {
        // Animate progress elements with staggered timing
        const progressElements = document.querySelectorAll('.macro-progress, .progress-ring-circle');
        progressElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transition = 'all 1s ease-in-out';
            }, index * 200);
        });
    }

    async loadInitialData() {
        // Load initial dashboard data
        if (this.currentSection === 'dashboard') {
            await this.loadDashboardData();
        }
    }

    startAutoUpdates() {
        // Update time-sensitive data every 5 minutes
        setInterval(async () => {
            if (this.currentSection === 'dashboard') {
                await this.loadDashboardData();
            }
        }, 5 * 60 * 1000);

        // Update fun facts every 30 seconds
        setInterval(() => {
            this.updateFunFacts();
        }, 30000);
    }

    setupInteractiveCharacter() {
        const character = document.querySelector('.character-emoji');
        if (!character) return;

        const emojis = [
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f44b.svg', // waving
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f60a.svg', // smiling
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f60d.svg', // heart eyes
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f973.svg', // party
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f44d.svg'  // thumbs up
        ];

        let currentIndex = 0;

        character.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % emojis.length;
            character.src = emojis[currentIndex];
            
            // Create flowing emoji effect
            this.createFlowingEmoji(emojis[currentIndex]);
        });

        // Auto-cycle emojis every 10 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % emojis.length;
            character.src = emojis[currentIndex];
        }, 10000);
    }

    createFlowingEmoji(emojiSrc) {
        const emoji = document.createElement('img');
        emoji.src = emojiSrc;
        emoji.className = 'flowing-emoji';
        emoji.style.position = 'fixed';
        emoji.style.left = Math.random() * window.innerWidth + 'px';
        emoji.style.top = '100%';
        emoji.style.width = '30px';
        emoji.style.height = '30px';
        emoji.style.zIndex = '9999';
        emoji.style.pointerEvents = 'none';
        emoji.style.transition = 'all 3s ease-out';

        document.body.appendChild(emoji);

        // Animate upward
        setTimeout(() => {
            emoji.style.top = '-50px';
            emoji.style.transform = `translateX(${(Math.random() - 0.5) * 200}px)`;
            emoji.style.opacity = '0';
        }, 100);

        // Remove after animation
        setTimeout(() => {
            emoji.remove();
        }, 3100);
    }

    setupFunFacts() {
        const factsContainer = document.getElementById('fun-facts');
        const factsToggle = document.getElementById('facts-toggle');
        const factsSidebar = document.getElementById('fun-facts-sidebar');

        if (!factsContainer) return;

        const facts = [
            {
                icon: 'fas fa-apple-alt',
                title: 'Did you know?',
                text: 'Apples float in water because they are 25% air!',
                color: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))'
            },
            {
                icon: 'fas fa-carrot',
                title: 'Amazing Fact!',
                text: 'Carrots were originally purple, not orange!',
                color: 'linear-gradient(135deg, #10b981, #059669)'
            },
            {
                icon: 'fas fa-cheese',
                title: 'Dairy Delight!',
                text: 'It takes 10 pounds of milk to make 1 pound of cheese!',
                color: 'linear-gradient(135deg, #f59e0b, #d97706)'
            },
            {
                icon: 'fas fa-seedling',
                title: 'Green Power!',
                text: 'Broccoli contains more protein per calorie than steak!',
                color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            },
            {
                icon: 'fas fa-pepper-hot',
                title: 'Spicy Science!',
                text: 'Spicy foods can boost your metabolism by up to 8%!',
                color: 'linear-gradient(135deg, #ef4444, #dc2626)'
            },
            {
                icon: 'fas fa-fish',
                title: 'Ocean Wisdom!',
                text: 'Salmon can improve brain function and memory!',
                color: 'linear-gradient(135deg, #06b6d4, #0891b2)'
            },
            {
                icon: 'fas fa-lemon',
                title: 'Citrus Power!',
                text: 'Lemons contain more sugar than strawberries!',
                color: 'linear-gradient(135deg, #eab308, #ca8a04)'
            }
        ];

        let currentFactIndex = 0;

        const updateFacts = () => {
            factsContainer.innerHTML = '';
            
            // Show 5 facts at a time
            for (let i = 0; i < 5; i++) {
                const factIndex = (currentFactIndex + i) % facts.length;
                const fact = facts[factIndex];
                
                const factCard = document.createElement('div');
                factCard.className = 'fact-card';
                factCard.style.background = fact.color;
                
                factCard.innerHTML = `
                    <div class="fact-icon">
                        <i class="${fact.icon}"></i>
                    </div>
                    <div class="fact-content">
                        <h4>${fact.title}</h4>
                        <p>${fact.text}</p>
                    </div>
                `;
                
                factsContainer.appendChild(factCard);
            }
        };

        // Initialize facts
        updateFacts();

        // Toggle sidebar
        if (factsToggle && factsSidebar) {
            factsToggle.addEventListener('click', () => {
                factsSidebar.classList.toggle('show');
            });
        }

        // Update facts periodically
        this.updateFunFacts = () => {
            currentFactIndex = (currentFactIndex + 1) % facts.length;
            updateFacts();
        };
    }

    async addWater() {
        try {
            // Simulate adding water - in real app, this would be an API call
            const waterStats = document.querySelector('.water-stats span');
            if (waterStats) {
                const currentText = waterStats.textContent;
                const match = currentText.match(/(\d+\.?\d*)L/);
                if (match) {
                    const current = parseFloat(match[1]);
                    const newAmount = Math.min(current + 0.25, 3.5);
                    waterStats.textContent = waterStats.textContent.replace(/(\d+\.?\d*)L/, `${newAmount}L`);
                    
                    // Update glasses
                    const data = await this.getNutritionData();
                    if (data) {
                        data.water.current = newAmount;
                        this.updateNutritionDisplay(data);
                    }
                    
                    this.showToast('Great! 250ml added to your water intake 💧', 'success');
                }
            }
        } catch (error) {
            console.error('Error adding water:', error);
            this.showToast('Failed to update water intake', 'error');
        }
    }

    async handleLogout() {
        try {
            this.setLoading(true);
            
            // Clear any local data
            this.currentUser = null;
            this.modules = {};
            
            // Redirect to logout endpoint
            window.location.href = '/logout';
        } catch (error) {
            console.error('Logout error:', error);
            this.setLoading(false);
            this.showToast('Logout failed. Please try again.', 'error');
        }
    }

    showNotifications() {
        // Mock notification system
        const notifications = [
            { type: 'info', message: 'Remember to log your lunch!', time: '5 mins ago' },
            { type: 'success', message: 'Daily goal achieved yesterday!', time: '1 hour ago' },
            { type: 'warning', message: 'Low water intake detected', time: '2 hours ago' }
        ];

        notifications.forEach((notif, index) => {
            setTimeout(() => {
                this.showToast(notif.message, notif.type);
            }, index * 1000);
        });
    }

    setLoading(loading) {
        this.isLoading = loading;
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            if (loading) {
                loadingOverlay.classList.add('show');
            } else {
                loadingOverlay.classList.remove('show');
            }
        }
    }

    showToast(message, type = 'info', description = '') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
                ${description ? `<div class="toast-description">${description}</div>` : ''}
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Utility functions
    camelCase(str) {
        return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    }

    // API call helper
    async apiCall(endpoint, options = {}) {
        try {
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            };

            const response = await fetch(endpoint, { ...defaultOptions, ...options });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            throw error;
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nutriGuru = new ModernNutriGuru();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.nutriGuru) {
        // Refresh data when user returns to tab
        window.nutriGuru.loadInitialData();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.nutriGuru) {
        window.nutriGuru.showToast('Connection restored', 'success');
        window.nutriGuru.loadInitialData();
    }
});

window.addEventListener('offline', () => {
    if (window.nutriGuru) {
        window.nutriGuru.showToast('Connection lost. Some features may not work.', 'warning');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernNutriGuru;
}
