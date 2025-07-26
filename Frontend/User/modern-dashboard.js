/**
 * Modern Nutri Guru Dashboard - Performance Optimized
 * Clean, modern JavaScript without dependencies
 */

class ModernNutriGuru {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentDay = 'monday';
        this.currentExpert = null;
        this.isLoading = false;
        
        // Performance optimization: Debounce functions
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
    
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoUpdates();
        this.initProgressBars();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }
        
        // File upload
        this.setupFileUpload();
        
        // Form submissions
        this.setupFormHandlers();
        
        // Chat functionality
        this.setupChatSystem();
        
        // Mobile menu toggle
        this.setupMobileMenu();
        
        // Quick actions
        this.setupQuickActions();
        
        // Notifications
        this.setupNotifications();
        
        // Progress tracking
        this.setupProgressTracking();
        
        // Interactive dashboard character
        this.setupInteractiveCharacter();
    }
    
    setupInteractiveCharacter() {
        const character = document.querySelector('.character-emoji');
        if (!character) return;
        
        const emojis = [
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f44b.svg', // waving
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f60a.svg', // smiling
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f60d.svg', // heart eyes
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f973.svg', // party
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f44d.svg', // thumbs up
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f389.svg', // party popper
        ];
        
        let currentEmojiIndex = 0;
        
        // Click interaction
        character.addEventListener('click', () => {
            currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
            character.src = emojis[currentEmojiIndex];
            
            // Add a fun click animation
            character.style.animation = 'none';
            character.offsetHeight; // Trigger reflow
            character.style.animation = 'bounce 0.6s ease-in-out';
            
            // Create flowing emoji animation
            this.createFlowingEmojis();
            
            // Show a fun message
            this.showCharacterMessage();
        });
        
        // Auto-change emoji every 10 seconds
        setInterval(() => {
            if (!character.matches(':hover')) {
                currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
                character.src = emojis[currentEmojiIndex];
            }
        }, 10000);
        
        // Hover interactions
        character.addEventListener('mouseenter', () => {
            const messages = [
                "Hey there! 🌟",
                "Looking good today! ✨",
                "Ready for a healthy day? 💪",
                "You're awesome! 🎉",
                "Let's crush those goals! 🚀"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            this.showToast(randomMessage, 'info', 2000);
        });
    }
    
    showCharacterMessage() {
        const messages = [
            "Great job on staying healthy! 🎉",
            "You're doing amazing! Keep it up! 💪",
            "Nutrition goals loading... 🚀",
            "High five for healthy choices! ✋",
            "You're a wellness superstar! ⭐",
            "Healthy vibes activated! ✨"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showToast(randomMessage, 'success', 3000);
    }
    
    createFlowingEmojis() {
        const flowingEmojis = [
            '🌟', '✨', '💫', '⭐', '🎉', '🎊', '💖', '💝', 
            '🥗', '🍎', '🥕', '🥬', '🫐', '🍇', '🥑', '🍊',
            '💪', '🔥', '🚀', '⚡', '💯', '✅', '🎯', '🏆'
        ];
        
        const numEmojis = Math.floor(Math.random() * 8) + 5; // 5-12 emojis
        
        for (let i = 0; i < numEmojis; i++) {
            setTimeout(() => {
                this.createSingleFlowingEmoji(flowingEmojis);
            }, i * 150); // Stagger the emoji creation
        }
    }
    
    createSingleFlowingEmoji(emojiArray) {
        const emoji = document.createElement('div');
        const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
        
        emoji.textContent = randomEmoji;
        emoji.className = 'flowing-emoji';
        
        // Random starting position from the character
        const character = document.querySelector('.character-emoji');
        const characterRect = character.getBoundingClientRect();
        
        // Set initial position near the character
        emoji.style.position = 'fixed';
        emoji.style.left = characterRect.left + 'px';
        emoji.style.top = characterRect.top + 'px';
        emoji.style.fontSize = Math.random() * 20 + 15 + 'px'; // 15-35px
        emoji.style.zIndex = '9999';
        emoji.style.pointerEvents = 'none';
        emoji.style.userSelect = 'none';
        
        // Random animation direction and properties
        const directions = [
            { x: Math.random() * 400 - 200, y: -Math.random() * 300 - 100 }, // Up variations
            { x: Math.random() * 300 + 100, y: -Math.random() * 200 - 50 },  // Up-right
            { x: -Math.random() * 300 - 100, y: -Math.random() * 200 - 50 }, // Up-left
            { x: Math.random() * 200 - 100, y: Math.random() * 200 + 100 }   // Down variations
        ];
        
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const duration = Math.random() * 2000 + 1500; // 1.5-3.5 seconds
        const rotation = Math.random() * 720 - 360; // -360 to 360 degrees
        
        // Add to page
        document.body.appendChild(emoji);
        
        // Animate
        emoji.animate([
            {
                transform: 'translate(0, 0) rotate(0deg) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${direction.x}px, ${direction.y}px) rotate(${rotation}deg) scale(0.5)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        }).onfinish = () => {
            // Clean up
            if (emoji.parentNode) {
                emoji.parentNode.removeChild(emoji);
            }
        };
    }
    
    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        
        this.currentSection = sectionId;
        
        // Load section-specific data
        this.loadSectionData(sectionId);
    }
    
    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'meal-plan':
                this.loadMealPlan();
                break;
            case 'chat':
                this.loadExperts();
                break;
            case 'progress':
                this.loadProgressCharts();
                break;
        }
    }
    
    // File Upload System
    setupFileUpload() {
        const uploadArea = document.querySelector('.upload-area');
        const fileInput = document.getElementById('file-input');
        
        if (!uploadArea || !fileInput) return;
        
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }
    
    async handleFileUpload(file) {
        if (!this.isValidImageFile(file)) {
            this.showToast('Please upload a valid image file (JPG, PNG, GIF)', 'error');
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.showImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // Simulate API call
            const analysis = await this.analyzeFood(file);
            this.displayAnalysisResults(analysis);
            
            this.showToast('Food analysis completed successfully!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            this.showToast('Failed to analyze image. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    isValidImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    }
    
    showImagePreview(src) {
        const previewContainer = document.querySelector('.food-image');
        if (previewContainer) {
            previewContainer.innerHTML = `<img src="${src}" alt="Uploaded food image">`;
        }
    }
    
    async analyzeFood(file) {
        // Simulate API call with realistic delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock analysis results
        return {
            foodName: 'Grilled Chicken Salad',
            confidence: 95,
            nutrients: {
                calories: 320,
                protein: 28,
                carbs: 12,
                fat: 18,
                fiber: 5,
                sugar: 8,
                sodium: 450,
                calcium: 80
            },
            recommendations: [
                'Great source of lean protein',
                'Low in carbohydrates',
                'Consider adding more vegetables',
                'Watch sodium content'
            ]
        };
    }
    
    displayAnalysisResults(analysis) {
        const resultContainer = document.querySelector('.analysis-result');
        if (!resultContainer) return;
        
        resultContainer.style.display = 'block';
        
        // Update food name
        const foodNameEl = resultContainer.querySelector('h3');
        if (foodNameEl) {
            foodNameEl.textContent = `${analysis.foodName} (${analysis.confidence}% confidence)`;
        }
        
        // Update nutrients
        const nutritionGrid = resultContainer.querySelector('.nutrition-grid');
        if (nutritionGrid) {
            nutritionGrid.innerHTML = Object.entries(analysis.nutrients)
                .map(([key, value]) => `
                    <div class="nutrition-item">
                        <span class="label">${this.formatNutrientName(key)}</span>
                        <span class="value">${value}${this.getNutrientUnit(key)}</span>
                    </div>
                `).join('');
        }
        
        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    formatNutrientName(key) {
        const names = {
            calories: 'Calories',
            protein: 'Protein',
            carbs: 'Carbohydrates',
            fat: 'Fat',
            fiber: 'Fiber',
            sugar: 'Sugar',
            sodium: 'Sodium',
            calcium: 'Calcium'
        };
        return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }
    
    getNutrientUnit(key) {
        const units = {
            calories: ' kcal',
            protein: 'g',
            carbs: 'g',
            fat: 'g',
            fiber: 'g',
            sugar: 'g',
            sodium: 'mg',
            calcium: 'mg'
        };
        return units[key] || '';
    }
    
    // Meal Planning System
    setupFormHandlers() {
        const generatePlanBtn = document.getElementById('generate-plan');
        if (generatePlanBtn) {
            generatePlanBtn.addEventListener('click', () => {
                this.generateMealPlan();
            });
        }
        
        // Day tabs
        document.querySelectorAll('.day-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const day = e.target.dataset.day;
                this.showDayMeals(day);
            });
        });
    }
    
    async generateMealPlan() {
        const formData = this.getMealPlanFormData();
        
        if (!this.validateMealPlanForm(formData)) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        this.setLoading(true, 'Generating your personalized meal plan...');
        
        try {
            const mealPlan = await this.fetchMealPlan(formData);
            this.displayMealPlan(mealPlan);
            this.showToast('Meal plan generated successfully!', 'success');
        } catch (error) {
            console.error('Meal plan generation error:', error);
            this.showToast('Failed to generate meal plan. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    getMealPlanFormData() {
        return {
            goal: document.getElementById('goal')?.value,
            dietType: document.getElementById('diet-type')?.value,
            calories: document.getElementById('calories')?.value,
            meals: document.getElementById('meals')?.value,
            allergies: document.getElementById('allergies')?.value,
            activityLevel: document.getElementById('activity-level')?.value
        };
    }
    
    validateMealPlanForm(data) {
        return data.goal && data.dietType && data.calories;
    }
    
    async fetchMealPlan(formData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Mock meal plan data
        return {
            monday: {
                breakfast: { name: 'Oatmeal with Berries', calories: 320, protein: 12 },
                lunch: { name: 'Grilled Chicken Salad', calories: 450, protein: 35 },
                dinner: { name: 'Salmon with Quinoa', calories: 520, protein: 40 },
                snacks: [
                    { name: 'Greek Yogurt', calories: 150, protein: 15 },
                    { name: 'Mixed Nuts', calories: 180, protein: 6 }
                ]
            },
            tuesday: {
                breakfast: { name: 'Protein Smoothie', calories: 300, protein: 25 },
                lunch: { name: 'Turkey Wrap', calories: 420, protein: 30 },
                dinner: { name: 'Lean Beef Stir-fry', calories: 480, protein: 38 },
                snacks: [
                    { name: 'Apple with Almond Butter', calories: 190, protein: 7 },
                    { name: 'Protein Bar', calories: 200, protein: 20 }
                ]
            }
            // Add more days...
        };
    }
    
    displayMealPlan(mealPlan) {
        const planResult = document.querySelector('.plan-result');
        if (!planResult) return;
        
        planResult.innerHTML = `
            <div class="week-navigation">
                ${Object.keys(mealPlan).map(day => `
                    <button class="day-tab ${day === 'monday' ? 'active' : ''}" data-day="${day}">
                        ${day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                `).join('')}
            </div>
            <div class="day-meals">
                ${this.renderDayMeals(mealPlan.monday)}
            </div>
        `;
        
        // Re-attach day tab listeners
        planResult.querySelectorAll('.day-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const day = e.target.dataset.day;
                this.showDayMeals(day, mealPlan);
            });
        });
    }
    
    showDayMeals(day, mealPlan = null) {
        if (!mealPlan) return;
        
        // Update active tab
        document.querySelectorAll('.day-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-day="${day}"]`).classList.add('active');
        
        // Update meals content
        const dayMealsContainer = document.querySelector('.day-meals');
        if (dayMealsContainer && mealPlan[day]) {
            dayMealsContainer.innerHTML = this.renderDayMeals(mealPlan[day]);
        }
        
        this.currentDay = day;
    }
    
    renderDayMeals(dayMeals) {
        return `
            <div class="meals-grid">
                <div class="meal-card">
                    <h4><i class="fas fa-sun"></i> Breakfast</h4>
                    <h5>${dayMeals.breakfast.name}</h5>
                    <p>${dayMeals.breakfast.calories} kcal • ${dayMeals.breakfast.protein}g protein</p>
                </div>
                <div class="meal-card">
                    <h4><i class="fas fa-cloud-sun"></i> Lunch</h4>
                    <h5>${dayMeals.lunch.name}</h5>
                    <p>${dayMeals.lunch.calories} kcal • ${dayMeals.lunch.protein}g protein</p>
                </div>
                <div class="meal-card">
                    <h4><i class="fas fa-moon"></i> Dinner</h4>
                    <h5>${dayMeals.dinner.name}</h5>
                    <p>${dayMeals.dinner.calories} kcal • ${dayMeals.dinner.protein}g protein</p>
                </div>
                <div class="snacks-card">
                    <h4><i class="fas fa-cookie-bite"></i> Snacks</h4>
                    ${dayMeals.snacks.map(snack => `
                        <div class="snack-item">
                            <span>${snack.name}</span>
                            <span>${snack.calories} kcal</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Chat System
    setupChatSystem() {
        const chatInput = document.querySelector('.chat-input input');
        const sendBtn = document.querySelector('.chat-input button');
        
        if (chatInput && sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage(chatInput.value);
                chatInput.value = '';
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage(chatInput.value);
                    chatInput.value = '';
                }
            });
        }
        
        // Expert selection
        document.querySelectorAll('.expert-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const expertId = e.currentTarget.dataset.expertId;
                this.selectExpert(expertId);
            });
        });
    }
    
    selectExpert(expertId) {
        const experts = {
            1: { name: 'Dr. Sarah Johnson', specialty: 'Nutritionist', avatar: 'expert-1.gif', status: 'online' },
            2: { name: 'Dr. Mike Chen', specialty: 'Fitness Coach', avatar: 'expert-2.gif', status: 'online' },
            3: { name: 'Dr. Lisa Williams', specialty: 'Dietitian', avatar: 'expert-3.gif', status: 'busy' }
        };
        
        const expert = experts[expertId];
        if (!expert) return;
        
        this.currentExpert = expert;
        this.updateChatHeader(expert);
        this.loadChatHistory(expertId);
    }
    
    updateChatHeader(expert) {
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.innerHTML = `
                <div class="expert-info">
                    <img src="assets/bitmojis/${expert.avatar}" alt="${expert.name}">
                    <div>
                        <h4>${expert.name}</h4>
                        <p class="status ${expert.status}">${expert.status}</p>
                    </div>
                </div>
            `;
        }
    }
    
    loadChatHistory(expertId) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;
        
        // Mock chat history
        const messages = [
            { type: 'expert', content: 'Hello! How can I help you with your nutrition goals today?', time: '10:30 AM' },
            { type: 'user', content: 'I\'m trying to lose weight but maintain muscle mass. Any advice?', time: '10:32 AM' },
            { type: 'expert', content: 'Great question! Focus on a moderate caloric deficit with high protein intake. Aim for 1.6-2.2g protein per kg body weight.', time: '10:35 AM' }
        ];
        
        chatMessages.innerHTML = messages.map(msg => `
            <div class="message ${msg.type}">
                <div class="message-content">${msg.content}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `).join('');
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    sendMessage(content) {
        if (!content.trim() || !this.currentExpert) return;
        
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        chatMessages.appendChild(userMessage);
        
        // Simulate expert response
        setTimeout(() => {
            const expertMessage = document.createElement('div');
            expertMessage.className = 'message expert';
            expertMessage.innerHTML = `
                <div class="message-content">${this.generateExpertResponse(content)}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            `;
            chatMessages.appendChild(expertMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    generateExpertResponse(userMessage) {
        const responses = [
            "That's a great question! Based on your goals, I'd recommend focusing on whole foods and balanced macronutrients.",
            "I understand your concern. Let me suggest a few strategies that have worked well for my other clients.",
            "Thanks for sharing that information. Here's what I would recommend based on current nutrition science.",
            "That's definitely achievable! Let's break this down into manageable steps you can implement gradually."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Quick Actions
    setupQuickActions() {
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }
    
    handleQuickAction(action) {
        switch(action) {
            case 'scan-food':
                this.showSection('photo-analysis');
                document.getElementById('file-input')?.click();
                break;
            case 'meal-plan':
                this.showSection('meal-plan');
                break;
            case 'ask-expert':
                this.showSection('chat');
                break;
            case 'track-progress':
                this.showSection('progress');
                break;
        }
    }
    
    // Progress Tracking
    setupProgressTracking() {
        // Initialize progress circles
        this.initProgressCircles();
        
        // Water intake tracking
        const waterButtons = document.querySelectorAll('.water-btn');
        waterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.dataset.amount);
                this.updateWaterIntake(amount);
            });
        });
    }
    
    initProgressCircles() {
        const circles = document.querySelectorAll('.progress-circle');
        circles.forEach(circle => {
            const progress = circle.dataset.progress;
            this.animateProgressCircle(circle, progress);
        });
    }
    
    animateProgressCircle(circle, progress) {
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (progress / 100) * circumference;
        
        const progressBar = circle.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.strokeDasharray = circumference;
            progressBar.style.strokeDashoffset = offset;
        }
    }
    
    updateWaterIntake(amount) {
        const currentIntake = parseInt(localStorage.getItem('waterIntake') || '0');
        const newIntake = Math.min(currentIntake + amount, 3000); // Max 3L
        
        localStorage.setItem('waterIntake', newIntake.toString());
        this.updateWaterDisplay(newIntake);
        
        if (newIntake >= 2000) {
            this.showToast('Great! You\'ve reached your daily water goal! 💧', 'success');
        }
    }
    
    updateWaterDisplay(intake) {
        const waterStat = document.querySelector('.stat-card.water h3');
        if (waterStat) {
            waterStat.textContent = `${(intake / 1000).toFixed(1)}L`;
        }
        
        const waterProgress = document.querySelector('.stat-card.water .progress-fill');
        if (waterProgress) {
            const percentage = Math.min((intake / 2000) * 100, 100);
            waterProgress.style.width = `${percentage}%`;
        }
    }
    
    // Mobile Menu
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }
    
    // Notifications
    setupNotifications() {
        const notificationBtn = document.querySelector('.notifications');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    showNotifications() {
        // Toggle notification dropdown
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
    
    // Utility Functions
    setLoading(isLoading, message = 'Loading...') {
        this.isLoading = isLoading;
        
        const loadingOverlay = document.querySelector('.loading-overlay') || this.createLoadingOverlay();
        const loadingText = loadingOverlay.querySelector('.loading-text');
        
        if (isLoading) {
            loadingText.textContent = message;
            loadingOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            loadingOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loader"></div>
                <p class="loading-text">Loading...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        const container = document.querySelector('.toast-container') || this.createToastContainer();
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeToast(toast);
        }, 5000);
        
        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
    }
    
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
    
    removeToast(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
    
    // Progress Bar Animation
    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.dataset.progress || '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });
    }
    
    // Data Loading
    loadInitialData() {
        this.loadUserGreeting();
        this.loadDailyAdvice();
        this.loadUserStats();
        this.loadRecentActivity();
        this.updateDateTime();
    }
    
    loadUserGreeting() {
        // Get user's name from localStorage or default
        const userName = localStorage.getItem('userName') || 'John';
        const greetingEl = document.querySelector('.greeting-content h1');
        if (greetingEl) {
            const hour = new Date().getHours();
            let greeting = 'Hey';
            
            if (hour < 12) greeting = 'Good morning';
            else if (hour < 17) greeting = 'Good afternoon';
            else greeting = 'Good evening';
            
            greetingEl.textContent = `${greeting}, ${userName}! 👋`;
        }
        
        // Update streak and level
        const streak = localStorage.getItem('streak') || '5';
        const level = localStorage.getItem('level') || '12';
        
        const streakEl = document.querySelector('.streak');
        const levelEl = document.querySelector('.level');
        
        if (streakEl) streakEl.textContent = `🔥 ${streak} day streak`;
        if (levelEl) levelEl.textContent = `Level ${level}`;
    }
    
    loadDailyAdvice() {
        const adviceList = [
            {
                main: "💧 Start your day with a glass of warm lemon water to boost metabolism and aid digestion.",
                tips: [
                    "Drink 8-10 glasses of water throughout the day",
                    "Include protein in every meal for sustained energy",
                    "Take a 10-minute walk after each meal for better digestion"
                ]
            },
            {
                main: "🥗 Fill half your plate with colorful vegetables to maximize nutrient intake and fiber.",
                tips: [
                    "Aim for 5-7 servings of fruits and vegetables daily",
                    "Choose different colors for varied nutrients",
                    "Add leafy greens to smoothies for extra nutrition"
                ]
            },
            {
                main: "🏃‍♂️ Exercise for at least 30 minutes daily to improve metabolism and overall health.",
                tips: [
                    "Start with 10-minute walks after meals",
                    "Try strength training 2-3 times per week",
                    "Find activities you enjoy to stay consistent"
                ]
            },
            {
                main: "😴 Get 7-9 hours of quality sleep to support weight management and recovery.",
                tips: [
                    "Create a consistent bedtime routine",
                    "Avoid screens 1 hour before bed",
                    "Keep your bedroom cool and dark"
                ]
            }
        ];
        
        // Get today's advice (based on day of week)
        const dayIndex = new Date().getDay();
        const todayAdvice = adviceList[dayIndex % adviceList.length];
        
        // Update main advice
        const mainAdviceEl = document.querySelector('.main-advice');
        if (mainAdviceEl) {
            mainAdviceEl.textContent = todayAdvice.main;
        }
        
        // Update tips
        const tipsContainer = document.querySelector('.advice-tips');
        if (tipsContainer) {
            tipsContainer.innerHTML = todayAdvice.tips.map(tip => `
                <div class="tip-item">
                    <i class="fas fa-check-circle"></i>
                    <span>${tip}</span>
                </div>
            `).join('');
        }
        
        // Update date
        const dateEl = document.querySelector('.advice-date');
        if (dateEl) {
            const today = new Date();
            dateEl.textContent = today.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // Add save tip functionality
        const saveTipBtn = document.querySelector('.advice-btn:not(.secondary)');
        if (saveTipBtn) {
            saveTipBtn.addEventListener('click', () => {
                this.saveTip(todayAdvice.main);
            });
        }
        
        // Add share functionality
        const shareBtn = document.querySelector('.advice-btn.secondary');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareAdvice(todayAdvice.main);
            });
        }
    }
    
    saveTip(tip) {
        const savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
        if (!savedTips.includes(tip)) {
            savedTips.push(tip);
            localStorage.setItem('savedTips', JSON.stringify(savedTips));
            this.showToast('Tip saved successfully! 💾', 'success');
        } else {
            this.showToast('This tip is already saved', 'info');
        }
    }
    
    shareAdvice(advice) {
        if (navigator.share) {
            navigator.share({
                title: 'Health Tip from Nutri Guru',
                text: advice,
                url: window.location.href
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(advice).then(() => {
                this.showToast('Tip copied to clipboard! 📋', 'success');
            });
        } else {
            this.showToast('Sharing not supported on this device', 'info');
        }
    }
    
    loadUserStats() {
        // Mock user stats
        const stats = {
            calories: { current: 1850, target: 2000, change: '+5%' },
            protein: { current: 95, target: 120, change: '+12%' },
            water: { current: 2.1, target: 2.5, change: '0%' },
            meals: { current: 3, target: 4, change: '-1' }
        };
        
        // Update stat cards
        Object.keys(stats).forEach(key => {
            const statCard = document.querySelector(`.stat-card.${key}`);
            if (statCard) {
                const valueEl = statCard.querySelector('h3');
                const changeEl = statCard.querySelector('.stat-change');
                const progressBar = statCard.querySelector('.progress-fill');
                
                if (valueEl) {
                    const unit = key === 'water' ? 'L' : (key === 'calories' ? '' : 'g');
                    valueEl.textContent = `${stats[key].current}${unit}`;
                }
                
                if (changeEl) {
                    changeEl.textContent = stats[key].change;
                    changeEl.className = `stat-change ${stats[key].change.includes('+') ? 'positive' : 'neutral'}`;
                }
                
                if (progressBar) {
                    const percentage = (stats[key].current / stats[key].target) * 100;
                    progressBar.style.width = `${Math.min(percentage, 100)}%`;
                }
            }
        });
    }
    
    loadRecentActivity() {
        // Activities are already in HTML, but could be dynamic
        console.log('Recent activity loaded');
    }
    
    updateDateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Update any date/time displays
        console.log(`Dashboard loaded at ${timeString} on ${dateString}`);
    }
    
    // Auto Updates
    startAutoUpdates() {
        // Update time every minute
        setInterval(() => {
            this.updateDateTime();
        }, 60000);
        
        // Refresh stats every 5 minutes
        setInterval(() => {
            this.loadUserStats();
        }, 300000);
        
        // Show motivational notifications
        this.scheduleMotivationalNotifications();
    }
    
    scheduleMotivationalNotifications() {
        const notifications = [
            { time: '08:00', message: '🌅 Good morning! Don\'t forget to log your breakfast!' },
            { time: '12:00', message: '🍽️ Lunch time! Make sure to include some protein.' },
            { time: '15:00', message: '💧 Hydration check! Have you had enough water today?' },
            { time: '18:00', message: '🥗 Dinner planning time! What healthy meal will you prepare?' },
            { time: '21:00', message: '📊 Great job today! Review your progress before bed.' }
        ];
        
        // Schedule notifications (simplified version)
        console.log('Motivational notifications scheduled');
    }
    
    // Search functionality
    handleSearch(query) {
        if (!query.trim()) return;
        
        console.log(`Searching for: ${query}`);
        // Implement search logic here
        this.showToast(`Searching for "${query}"...`, 'info');
    }
}

// Additional CSS for JavaScript-generated elements
const additionalStyles = `
<style>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-content {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--border-light);
}

.loading-content .loader {
    margin: 0 auto var(--spacing-lg);
}

.loading-text {
    color: var(--text-primary);
    font-weight: 500;
}

.toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    animation: slideInRight 0.3s ease-out;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.toast-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--transition);
}

.toast-close:hover {
    background: var(--gray-100);
    color: var(--text-primary);
}

.message {
    margin-bottom: var(--spacing-md);
    max-width: 80%;
}

.message.user {
    align-self: flex-end;
    text-align: right;
}

.message.expert {
    align-self: flex-start;
}

.message-content {
    background: var(--bg-secondary);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-xs);
}

.message.user .message-content {
    background: var(--primary);
    color: white;
}

.message-time {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-bottom: var(--spacing-sm);
}

.meals-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
}

.meal-card,
.snacks-card {
    background: var(--bg-secondary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
}

.meal-card h4,
.snacks-card h4 {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
    font-weight: 600;
}

.meal-card h5 {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
}

.meal-card p {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.snack-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
    font-size: 0.875rem;
}

.snacks-card {
    grid-column: 1 / -1;
}

@keyframes slideOutRight {
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}
</style>
`;

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add additional styles
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize the dashboard
    const dashboard = new ModernNutriGuru();
    
    // Make it globally accessible for debugging
    window.nutriGuru = dashboard;
    
    console.log('🚀 Modern Nutri Guru Dashboard initialized successfully!');
});
