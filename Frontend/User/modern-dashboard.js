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
        
        // Setup form handlers
        this.setupFormHandlers();
        
        // Enhanced food scanning
        this.setupFoodScanning();
        
        // Enhanced diet plan generator
        this.setupDietPlanGenerator();
        
        // Enhanced expert chat
        this.setupExpertChat();
        
        // Post query functionality
        this.setupPostQuery();
        
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
        // Update section name for expert chat
        let targetSectionId = sectionId;
        if (sectionId === 'expert-chat') {
            targetSectionId = 'expert-chat-section';
        }
        
        // Update section name for profile
        if (sectionId === 'profile') {
            targetSectionId = 'profile-section';
        }
        
        // Update section name for photo analysis
        if (sectionId === 'photo-analysis') {
            targetSectionId = 'photo-analysis-section';
        }
        
        // Update section name for meal plan
        if (sectionId === 'meal-plan') {
            targetSectionId = 'meal-plan-section';
        }
        
        document.getElementById(targetSectionId).classList.add('active');
        
        this.currentSection = sectionId;
        
        // Load section-specific data
        this.loadSectionData(sectionId);
    }
    
    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'meal-plan':
                this.loadMealPlan();
                break;
            case 'expert-chat':
                this.loadExperts();
                break;
            case 'profile':
                this.setupProfileTabs();
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
                // Auto-trigger file input after a short delay
                setTimeout(() => {
                    document.getElementById('file-input')?.click();
                }, 500);
                break;
            case 'meal-plan':
                this.showSection('meal-plan');
                break;
            case 'ask-expert':
                this.showSection('expert-chat');
                break;
            case 'post-query':
                this.showSection('post-query');
                break;
            case 'profile':
                this.showSection('profile');
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
    
    // Profile Management
    setupProfileTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update active tab panel
                tabPanels.forEach(panel => panel.classList.remove('active'));
                document.getElementById(targetTab + '-tab').classList.add('active');
            });
        });
        
        // Setup avatar upload
        const avatarEditBtn = document.getElementById('avatar-edit-btn');
        const avatarInput = document.getElementById('avatar-input');
        
        if (avatarEditBtn && avatarInput) {
            avatarEditBtn.addEventListener('click', () => {
                avatarInput.click();
            });
            
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('profile-picture').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Setup form submissions
        const forms = document.querySelectorAll('.profile-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileFormSubmit(e);
            });
        });
    }
    
    handleProfileFormSubmit(e) {
        const formData = new FormData(e.target);
        const formType = e.target.closest('.tab-panel').id;
        
        // Simulate form submission
        this.showToast('Profile updated successfully!', 'success');
        
        // Update profile display
        if (formType === 'personal-tab') {
            const fullName = formData.get('full-name') || document.getElementById('full-name').value;
            document.getElementById('profile-name').textContent = fullName;
        }
    }

    // Complete Post Query System - Bug-free Implementation
    setupPostQuery() {
        this.initializeQuerySystem();
        this.setupQueryTypeToggle();
        this.setupDetailedForm();
        this.setupQuickAsk();
        this.setupQueryFeed();
        this.setupFloatingHelp();
        this.loadQueryData();
    }

    initializeQuerySystem() {
        // Initialize storage if not exists
        if (!localStorage.getItem('communityQueries')) {
            localStorage.setItem('communityQueries', JSON.stringify([]));
        }
        if (!localStorage.getItem('userQueries')) {
            localStorage.setItem('userQueries', JSON.stringify([]));
        }
        if (!localStorage.getItem('queryDrafts')) {
            localStorage.setItem('queryDrafts', JSON.stringify({}));
        }

        // Sample data for demonstration
        this.initializeSampleData();
    }

    initializeSampleData() {
        const communityQueries = JSON.parse(localStorage.getItem('communityQueries') || '[]');
        
        if (communityQueries.length === 0) {
            const sampleQueries = [
                {
                    id: 'sample-1',
                    title: 'Best protein sources for vegetarian muscle building?',
                    category: 'muscle-building',
                    description: 'I\'m trying to build muscle but I\'m vegetarian. What are the best complete protein sources I should focus on?',
                    tags: 'protein, vegetarian, muscle-building',
                    urgency: 'medium',
                    author: 'Sarah M.',
                    anonymous: false,
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    responses: 8,
                    views: 145,
                    likes: 23,
                    status: 'answered',
                    audience: 'everyone'
                },
                {
                    id: 'sample-2',
                    title: 'How many calories should I eat for sustainable weight loss?',
                    category: 'weight-management',
                    description: 'I\'m 28F, 5\'6", 160lbs, moderately active. Looking to lose 15lbs in a healthy way. How should I calculate my daily calorie needs?',
                    tags: 'calories, weight-loss, TDEE',
                    urgency: 'low',
                    author: 'Anonymous',
                    anonymous: true,
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    responses: 12,
                    views: 203,
                    likes: 34,
                    status: 'answered',
                    audience: 'experts-only'
                },
                {
                    id: 'sample-3',
                    title: 'Intermittent fasting - good or bad for women?',
                    category: 'meal-planning',
                    description: 'I\'ve heard mixed things about IF for women, especially regarding hormones. What does the current research say?',
                    tags: 'intermittent-fasting, women, hormones',
                    urgency: 'low',
                    author: 'Jennifer K.',
                    anonymous: false,
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    responses: 6,
                    views: 89,
                    likes: 15,
                    status: 'pending',
                    audience: 'everyone'
                }
            ];
            
            localStorage.setItem('communityQueries', JSON.stringify(sampleQueries));
        }
    }

    setupQueryTypeToggle() {
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const formContainers = document.querySelectorAll('.query-form-container');

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                
                // Update active toggle
                toggleBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show corresponding form
                formContainers.forEach(container => {
                    container.classList.remove('active');
                });
                
                const targetForm = type === 'detailed' ? 'detailed-form' : 'quick-form';
                document.getElementById(targetForm).classList.add('active');
            });
        });
    }

    setupDetailedForm() {
        const form = document.getElementById('detailed-query-form');
        if (!form) return;

        // Character counters
        this.setupCharacterCounter('query-title', 100);
        this.setupCharacterCounter('query-description', 1000);

        // Tag suggestions
        this.setupTagSystem();

        // Save draft functionality
        const saveDraftBtn = document.getElementById('save-draft');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => this.saveDraft());
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDetailedSubmission(e);
        });

        // Auto-save draft
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', this.debounce(() => {
                this.autoSaveDraft();
            }, 2000));
        });

        // Load existing draft
        this.loadDraft();
    }

    setupCharacterCounter(inputId, maxLength) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const counter = input.parentNode.querySelector('.char-counter .current');
        if (!counter) return;

        input.addEventListener('input', (e) => {
            const length = e.target.value.length;
            counter.textContent = length;
            
            // Color coding
            const percentage = (length / maxLength) * 100;
            if (percentage > 90) {
                counter.style.color = 'var(--danger)';
            } else if (percentage > 75) {
                counter.style.color = 'var(--warning)';
            } else {
                counter.style.color = 'var(--text-tertiary)';
            }
        });
    }

    setupTagSystem() {
        const tagInput = document.getElementById('query-tags');
        const suggestionsContainer = document.getElementById('tag-suggestions');
        
        if (!tagInput || !suggestionsContainer) return;

        const popularTags = [
            'weight-loss', 'muscle-building', 'protein', 'calories', 'meal-prep',
            'supplements', 'vitamins', 'hydration', 'metabolism', 'keto',
            'vegetarian', 'vegan', 'intermittent-fasting', 'sports-nutrition',
            'pregnancy', 'diabetes', 'heart-health', 'gut-health'
        ];

        let isShowingSuggestions = false;

        tagInput.addEventListener('focus', () => {
            if (!isShowingSuggestions) {
                this.showTagSuggestions(popularTags, suggestionsContainer, tagInput);
                isShowingSuggestions = true;
            }
        });

        tagInput.addEventListener('input', () => {
            if (isShowingSuggestions) {
                this.updateTagSuggestions(popularTags, suggestionsContainer, tagInput);
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!tagInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.innerHTML = '';
                isShowingSuggestions = false;
            }
        });
    }

    showTagSuggestions(allTags, container, input) {
        const currentTags = input.value.toLowerCase().split(',').map(t => t.trim()).filter(t => t);
        const availableTags = allTags.filter(tag => !currentTags.includes(tag));
        
        const html = availableTags.slice(0, 10).map(tag => 
            `<div class="tag-suggestion" data-tag="${tag}">${tag}</div>`
        ).join('');
        
        container.innerHTML = html;
        
        // Add click listeners
        container.querySelectorAll('.tag-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const tag = e.target.dataset.tag;
                const currentValue = input.value.trim();
                const newValue = currentValue ? `${currentValue}, ${tag}` : tag;
                input.value = newValue;
                
                // Update suggestions
                this.updateTagSuggestions(allTags, container, input);
            });
        });
    }

    updateTagSuggestions(allTags, container, input) {
        const currentTags = input.value.toLowerCase().split(',').map(t => t.trim()).filter(t => t);
        const availableTags = allTags.filter(tag => !currentTags.includes(tag));
        
        const html = availableTags.slice(0, 10).map(tag => 
            `<div class="tag-suggestion" data-tag="${tag}">${tag}</div>`
        ).join('');
        
        container.innerHTML = html;
        
        // Re-add click listeners
        container.querySelectorAll('.tag-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const tag = e.target.dataset.tag;
                const currentValue = input.value.trim();
                const newValue = currentValue ? `${currentValue}, ${tag}` : tag;
                input.value = newValue;
                
                this.updateTagSuggestions(allTags, container, input);
            });
        });
    }

    saveDraft() {
        const formData = this.getFormData('detailed-query-form');
        const drafts = JSON.parse(localStorage.getItem('queryDrafts') || '{}');
        drafts.detailed = {
            ...formData,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('queryDrafts', JSON.stringify(drafts));
        this.showToast('Draft saved successfully!', 'success');
    }

    autoSaveDraft() {
        const formData = this.getFormData('detailed-query-form');
        const hasContent = formData.title || formData.description;
        
        if (hasContent) {
            const drafts = JSON.parse(localStorage.getItem('queryDrafts') || '{}');
            drafts.detailed = {
                ...formData,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('queryDrafts', JSON.stringify(drafts));
        }
    }

    loadDraft() {
        const drafts = JSON.parse(localStorage.getItem('queryDrafts') || '{}');
        const detailedDraft = drafts.detailed;
        
        if (detailedDraft) {
            this.populateForm('detailed-query-form', detailedDraft);
            // Update character counters
            document.getElementById('query-title')?.dispatchEvent(new Event('input'));
            document.getElementById('query-description')?.dispatchEvent(new Event('input'));
        }
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Get checkbox values
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name] = checkbox.checked;
        });
        
        return data;
    }

    populateForm(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key];
                } else {
                    field.value = data[key];
                }
            }
        });
    }
    
    handleQuerySubmit(e) {
        const formData = new FormData(e.target);
        const priority = document.querySelector('input[name="priority"]:checked')?.value || 'low';
        
        const queryData = {
            id: Date.now().toString(),
            title: formData.get('title') || document.getElementById('query-title').value,
            category: formData.get('category') || document.getElementById('query-category').value,
            description: formData.get('description') || document.getElementById('query-description').value,
            tags: formData.get('tags') || document.getElementById('query-tags').value,
            priority: priority,
            anonymous: document.getElementById('anonymous-query').checked,
            notifyResponses: document.getElementById('notify-responses').checked,
            sharePublic: document.getElementById('share-public').checked,
            timestamp: new Date().toISOString(),
            status: 'pending',
            responses: [],
            views: 0,
            likes: 0
        };
        
        // Validate form
        if (!queryData.title || !queryData.category || !queryData.description) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        if (queryData.description.length > 500) {
            this.showToast('Description must be under 500 characters', 'warning');
            return;
        }
        
        // Save to localStorage
        const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
        userQueries.unshift(queryData);
        localStorage.setItem('userQueries', JSON.stringify(userQueries));
        
        // Add to public queries if shared
        if (queryData.sharePublic) {
            const publicQueries = JSON.parse(localStorage.getItem('publicQueries') || '[]');
            publicQueries.unshift({...queryData, author: queryData.anonymous ? 'Anonymous' : 'John Doe'});
            localStorage.setItem('publicQueries', JSON.stringify(publicQueries));
        }
        
        // Show success message with priority-based feedback
        const priorityMessages = {
            low: 'Your question has been posted! Experts will respond within 24-48 hours.',
            medium: 'Your question has been posted with medium priority! Experts will respond within 12-24 hours.',
            high: 'Your urgent question has been posted! Experts will prioritize your response.'
        };
        
        this.showToast(priorityMessages[priority], 'success');
        
        // Reset form
        e.target.reset();
        document.querySelector('input[name="priority"][value="low"]').checked = true;
        document.getElementById('char-count').textContent = '0';
        
        // Reload data
        this.loadMyQueries();
        this.updateQueryStats();
        this.createFlowingEmojis();
    }
    
    handleQuickAskSubmit(question, category) {
        const quickQuery = {
            id: Date.now().toString(),
            title: question.substring(0, 60) + (question.length > 60 ? '...' : ''),
            category: category,
            description: question,
            tags: category,
            priority: 'low',
            anonymous: false,
            notifyResponses: true,
            sharePublic: true,
            timestamp: new Date().toISOString(),
            status: 'pending',
            responses: [],
            views: 0,
            likes: 0,
            type: 'quick'
        };
        
        // Save to localStorage
        const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
        userQueries.unshift(quickQuery);
        localStorage.setItem('userQueries', JSON.stringify(userQueries));
        
        // Add to public queries
        const publicQueries = JSON.parse(localStorage.getItem('publicQueries') || '[]');
        publicQueries.unshift({...quickQuery, author: 'John Doe'});
        localStorage.setItem('publicQueries', JSON.stringify(publicQueries));
        
        // Show success message
        this.showToast('Quick question posted! You\'ll get a fast response.', 'success');
        
        // Reset form
        document.getElementById('quick-question').value = '';
        document.getElementById('quick-char-count').textContent = '0';
        document.querySelectorAll('.quick-category').forEach(c => c.classList.remove('selected'));
        
        // Reload data
        this.loadMyQueries();
        this.updateQueryStats();
        this.createFlowingEmojis();
    }
    
    updateQueryStats() {
        const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
        const totalQueries = userQueries.length;
        const answeredQueries = userQueries.filter(q => q.status === 'answered').length;
        
        const totalElement = document.getElementById('total-queries');
        const answeredElement = document.getElementById('answered-queries');
        
        if (totalElement) totalElement.textContent = totalQueries;
        if (answeredElement) answeredElement.textContent = answeredQueries;
    }
    
    loadMyQueries() {
        const queriesList = document.getElementById('my-queries-list');
        if (!queriesList) return;
        
        const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
        
        if (userQueries.length === 0) {
            queriesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-question-circle"></i>
                    <p>You haven't posted any queries yet</p>
                    <span>Ask your first nutrition question above!</span>
                </div>
            `;
            return;
        }
        
        const queriesHtml = userQueries.map(query => `
            <div class="query-item" data-query-id="${query.id}">
                <div class="query-priority ${query.priority}"></div>
                <h4>${query.title}</h4>
                <p>${query.description}</p>
                <div class="query-meta">
                    <span class="query-category">${this.formatCategoryName(query.category)}</span>
                    <div class="query-status ${query.status}">
                        <i class="fas fa-${query.status === 'answered' ? 'check-circle' : 'clock'}"></i>
                        ${query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                    </div>
                </div>
                ${query.type === 'quick' ? '<div class="query-badge">Quick Ask</div>' : ''}
            </div>
        `).join('');
        
        queriesList.innerHTML = queriesHtml;
        
        // Add click event listeners
        queriesList.querySelectorAll('.query-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const queryId = e.currentTarget.dataset.queryId;
                this.showQueryDetail(queryId);
            });
        });
    }
    
    loadTrendingQueries() {
        const trendingList = document.getElementById('trending-list');
        if (!trendingList) return;
        
        // Simulate trending queries (in real app, this would come from API)
        const trendingQueries = [
            {
                id: 'trending-1',
                title: 'Best protein sources for vegetarians?',
                description: 'I\'m looking for complete protein sources that don\'t come from meat...',
                category: 'protein',
                views: 234,
                responses: 12,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'trending-2',
                title: 'How to calculate daily calorie needs?',
                description: 'I want to lose weight but not sure how many calories I should eat...',
                category: 'weight-loss',
                views: 189,
                responses: 8,
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'trending-3',
                title: 'Intermittent fasting for beginners',
                description: 'Can someone explain the different types of intermittent fasting...',
                category: 'diet-plans',
                views: 156,
                responses: 15,
                timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
            }
        ];
        
        const trendingHtml = trendingQueries.map(query => `
            <div class="trending-item" data-query-id="${query.id}">
                <h5>${query.title}</h5>
                <p>${query.description}</p>
                <div class="item-stats">
                    <span><i class="fas fa-eye"></i> ${query.views}</span>
                    <span><i class="fas fa-comments"></i> ${query.responses}</span>
                </div>
            </div>
        `).join('');
        
        trendingList.innerHTML = trendingHtml;
    }
    
    loadRecentQueries() {
        const recentList = document.getElementById('recent-list');
        if (!recentList) return;
        
        // Get recent public queries
        const publicQueries = JSON.parse(localStorage.getItem('publicQueries') || '[]');
        
        if (publicQueries.length === 0) {
            recentList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <p>No recent community questions</p>
                    <span>Be the first to share a public question!</span>
                </div>
            `;
            return;
        }
        
        const recentHtml = publicQueries.slice(0, 10).map(query => `
            <div class="recent-item" data-query-id="${query.id}">
                <h5>${query.title}</h5>
                <p>${query.description}</p>
                <div class="item-stats">
                    <span><i class="fas fa-user"></i> ${query.author}</span>
                    <span><i class="fas fa-clock"></i> ${this.formatTimeAgo(query.timestamp)}</span>
                </div>
            </div>
        `).join('');
        
        recentList.innerHTML = recentHtml;
    }
    
    formatCategoryName(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks}w ago`;
    }
    
    showQueryDetail(queryId) {
        const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
        const query = userQueries.find(q => q.id === queryId);
        
        if (!query) return;
        
        // Create detailed query modal
        const modal = document.createElement('div');
        modal.className = 'query-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${query.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="query-info">
                        <div class="query-meta-detail">
                            <span class="category-badge">${this.formatCategoryName(query.category)}</span>
                            <span class="priority-badge ${query.priority}">${query.priority.toUpperCase()}</span>
                            <span class="time-badge">${this.formatTimeAgo(query.timestamp)}</span>
                        </div>
                        <div class="query-description">
                            <p>${query.description}</p>
                        </div>
                        ${query.tags ? `<div class="query-tags">${query.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}</div>` : ''}
                    </div>
                    <div class="query-responses">
                        <h4>Responses (${query.responses.length})</h4>
                        ${query.responses.length === 0 ? 
                            '<p class="no-responses">No responses yet. Our experts will answer soon!</p>' : 
                            query.responses.map(response => `
                                <div class="response-item">
                                    <div class="response-author">${response.author}</div>
                                    <div class="response-content">${response.content}</div>
                                    <div class="response-time">${this.formatTimeAgo(response.timestamp)}</div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    // Enhanced Food Scanning
    setupFoodScanning() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('upload-btn');
        
        if (uploadArea && fileInput) {
            // Click to upload
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadBtn?.addEventListener('click', () => fileInput.click());
            
            // Drag and drop
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
                    this.analyzeFood(files[0]);
                }
            });
            
            // File input change
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.analyzeFood(e.target.files[0]);
                }
            });
        }
        
        // New analysis button
        const newAnalysisBtn = document.getElementById('new-analysis');
        if (newAnalysisBtn) {
            newAnalysisBtn.addEventListener('click', () => {
                document.getElementById('analysis-result').style.display = 'none';
                document.getElementById('upload-area').style.display = 'block';
            });
        }
    }
    
    async analyzeFood(file) {
        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size must be less than 5MB', 'error');
            return;
        }
        
        // Show loading
        this.setLoading(true, 'Analyzing your food...');
        
        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('preview-image').src = e.target.result;
            };
            reader.readAsDataURL(file);
            
            // Simulate AI analysis (replace with actual API call)
            await this.simulateFoodAnalysis(file);
            
            // Show results
            document.getElementById('upload-area').style.display = 'none';
            document.getElementById('analysis-result').style.display = 'block';
            
        } catch (error) {
            this.showToast('Failed to analyze food. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    async simulateFoodAnalysis(file) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Mock food database
        const foodDatabase = [
            { name: 'Grilled Chicken Salad', calories: 320, protein: '35g', carbs: '12g', fat: '18g' },
            { name: 'Avocado Toast', calories: 280, protein: '8g', carbs: '24g', fat: '20g' },
            { name: 'Quinoa Bowl', calories: 420, protein: '15g', carbs: '58g', fat: '14g' },
            { name: 'Greek Yogurt Parfait', calories: 180, protein: '12g', carbs: '28g', fat: '3g' },
            { name: 'Salmon Fillet', calories: 350, protein: '39g', carbs: '0g', fat: '20g' },
            { name: 'Mixed Berry Smoothie', calories: 220, protein: '6g', carbs: '45g', fat: '4g' }
        ];
        
        // Random food selection for demo
        const randomFood = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
        
        // Update UI with results
        document.getElementById('food-name').textContent = randomFood.name;
        document.getElementById('analyzed-calories').textContent = randomFood.calories;
        document.getElementById('analyzed-protein').textContent = randomFood.protein;
        document.getElementById('analyzed-carbs').textContent = randomFood.carbs;
        document.getElementById('analyzed-fat').textContent = randomFood.fat;
        
        // Setup add to diary button
        const addToDiaryBtn = document.getElementById('add-to-diary');
        if (addToDiaryBtn) {
            addToDiaryBtn.onclick = () => {
                this.addFoodToDiary(randomFood);
            };
        }
    }
    
    addFoodToDiary(food) {
        // Add to localStorage diary
        const diary = JSON.parse(localStorage.getItem('foodDiary') || '[]');
        const today = new Date().toISOString().split('T')[0];
        
        diary.push({
            ...food,
            date: today,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('foodDiary', JSON.stringify(diary));
        
        this.showToast(`${food.name} added to your diary!`, 'success');
        this.updateDailyStats();
    }
    
    // Enhanced Diet Plan Generation
    setupDietPlanGenerator() {
        const generateBtn = document.getElementById('generate-plan');
        const calorieRange = document.getElementById('calorie-range');
        const calorieDisplay = document.getElementById('calorie-display');
        
        // Update calorie display
        if (calorieRange && calorieDisplay) {
            calorieRange.addEventListener('input', (e) => {
                calorieDisplay.textContent = e.target.value;
            });
        }
        
        // Generate plan button
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generatePersonalizedMealPlan();
            });
        }
        
        // Day tab switching
        const dayTabs = document.querySelectorAll('.day-tab');
        dayTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const day = e.target.dataset.day;
                this.showDayMeals(day);
                
                // Update active tab
                dayTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    async generatePersonalizedMealPlan() {
        const goal = document.getElementById('diet-goal').value;
        const dietType = document.getElementById('diet-type').value;
        const calories = document.getElementById('calorie-range').value;
        
        // Show loading
        document.getElementById('plan-loading').style.display = 'block';
        document.getElementById('plan-content').style.display = 'none';
        
        try {
            // Simulate plan generation
            await this.simulatePlanGeneration(goal, dietType, calories);
            
            // Show results
            document.getElementById('plan-loading').style.display = 'none';
            document.getElementById('plan-content').style.display = 'block';
            
            this.showToast('Meal plan generated successfully!', 'success');
            
        } catch (error) {
            this.showToast('Failed to generate meal plan. Please try again.', 'error');
            document.getElementById('plan-loading').style.display = 'none';
        }
    }
    
    async simulatePlanGeneration(goal, dietType, calories) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate meal plan based on preferences
        const mealPlans = {
            'weight-loss': {
                breakfast: ['Overnight Oats with Berries', 'Green Smoothie Bowl', 'Egg White Omelet'],
                lunch: ['Quinoa Salad', 'Grilled Chicken Wrap', 'Vegetable Soup'],
                dinner: ['Baked Salmon', 'Turkey Meatballs', 'Stuffed Bell Peppers'],
                snacks: ['Apple with Almond Butter', 'Greek Yogurt', 'Mixed Nuts']
            },
            'muscle-gain': {
                breakfast: ['Protein Pancakes', 'Oatmeal with Banana', 'Scrambled Eggs with Toast'],
                lunch: ['Chicken Rice Bowl', 'Quinoa Power Bowl', 'Turkey Sandwich'],
                dinner: ['Grilled Steak', 'Baked Chicken Thighs', 'Salmon with Sweet Potato'],
                snacks: ['Protein Shake', 'Cottage Cheese', 'Trail Mix']
            },
            'maintenance': {
                breakfast: ['Avocado Toast', 'Yogurt Parfait', 'Whole Grain Cereal'],
                lunch: ['Mediterranean Bowl', 'Chicken Caesar Salad', 'Veggie Burger'],
                dinner: ['Pasta Primavera', 'Fish Tacos', 'Stir-fry with Rice'],
                snacks: ['Fruit Smoothie', 'Hummus with Veggies', 'Dark Chocolate']
            }
        };
        
        const plan = mealPlans[goal] || mealPlans['maintenance'];
        this.currentMealPlan = plan;
        
        // Show Monday's meals by default
        this.showDayMeals('monday');
    }
    
    showDayMeals(day) {
        if (!this.currentMealPlan) return;
        
        const dayMealsContainer = document.getElementById('day-meals');
        const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day);
        
        const mealsHtml = `
            <div class="day-header">
                <h3>${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                <p>Balanced nutrition for your goals</p>
            </div>
            <div class="meals-grid">
                <div class="meal-card breakfast">
                    <div class="meal-icon">🌅</div>
                    <h4>Breakfast</h4>
                    <p>${this.currentMealPlan.breakfast[dayIndex % 3]}</p>
                    <span class="meal-calories">~400 cal</span>
                </div>
                <div class="meal-card lunch">
                    <div class="meal-icon">☀️</div>
                    <h4>Lunch</h4>
                    <p>${this.currentMealPlan.lunch[dayIndex % 3]}</p>
                    <span class="meal-calories">~500 cal</span>
                </div>
                <div class="meal-card dinner">
                    <div class="meal-icon">🌙</div>
                    <h4>Dinner</h4>
                    <p>${this.currentMealPlan.dinner[dayIndex % 3]}</p>
                    <span class="meal-calories">~600 cal</span>
                </div>
                <div class="meal-card snack">
                    <div class="meal-icon">🍎</div>
                    <h4>Snacks</h4>
                    <p>${this.currentMealPlan.snacks[dayIndex % 4]}</p>
                    <span class="meal-calories">~200 cal</span>
                </div>
            </div>
        `;
        
        dayMealsContainer.innerHTML = mealsHtml;
    }
    
    // Enhanced Expert Chat System
    setupExpertChat() {
        this.setupChatInput();
        this.setupChatPostQuery();
        this.setupPublicQuery();
        this.setupSidebarTabs();
        this.setupCallExpert();
        this.loadExperts();
        this.loadChatMessages();
        this.loadPublicQueries();
    }
    
    setupChatInput() {
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-message');
        
        if (messageInput && sendBtn) {
            const sendMessage = () => {
                const message = messageInput.value.trim();
                if (message) {
                    this.sendChatMessage(message);
                    messageInput.value = '';
                }
            };
            
            sendBtn.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
    
    setupChatPostQuery() {
        // Add post query button to chat header (for private queries)
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader && !document.getElementById('post-query-btn')) {
            const postQueryBtn = document.createElement('button');
            postQueryBtn.id = 'post-query-btn';
            postQueryBtn.className = 'call-btn';
            postQueryBtn.innerHTML = '<i class="fas fa-question-circle"></i> Private Query';
            
            const chatActions = chatHeader.querySelector('.chat-actions');
            if (chatActions) {
                chatActions.insertBefore(postQueryBtn, chatActions.firstChild);
            }
            
            postQueryBtn.addEventListener('click', () => {
                this.showPostQueryModal(false); // false = private query
            });
        }
    }
    
    setupPublicQuery() {
        const publicQueryBtn = document.getElementById('post-public-query-btn');
        if (publicQueryBtn) {
            publicQueryBtn.addEventListener('click', () => {
                this.showPostQueryModal(true); // true = public query
            });
        }
    }
    
    setupSidebarTabs() {
        const sidebarTabs = document.querySelectorAll('.sidebar-tab');
        const tabPanels = document.querySelectorAll('.sidebar-content .tab-panel');
        
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                
                // Update active tab
                sidebarTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update active panel
                tabPanels.forEach(panel => panel.classList.remove('active'));
                document.getElementById(targetTab + '-panel').classList.add('active');
                
                // Load data if needed
                if (targetTab === 'public-queries') {
                    this.loadPublicQueries();
                }
            });
        });
    }
    
    setupCallExpert() {
        const videoCallBtn = document.getElementById('video-call-btn');
        const audioCallBtn = document.getElementById('audio-call-btn');
        
        if (videoCallBtn) {
            videoCallBtn.addEventListener('click', () => {
                this.showToast('Connecting to expert for video call...', 'info');
                // In a real app, this would initiate WebRTC connection
                setTimeout(() => {
                    this.showToast('Expert is currently unavailable. Try again later.', 'warning');
                }, 2000);
            });
        }
        
        if (audioCallBtn) {
            audioCallBtn.addEventListener('click', () => {
                this.showToast('Connecting to expert for audio call...', 'info');
                setTimeout(() => {
                    this.showToast('Expert will call you back within 5 minutes.', 'success');
                }, 2000);
            });
        }
    }
    
    showPostQueryModal(isPublic = false) {
        const modal = document.createElement('div');
        modal.className = 'query-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isPublic ? 'Post Public Query' : 'Post Private Query'}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${isPublic ? '<div class="public-query-notice"><i class="fas fa-info-circle"></i> This query will be visible to all users and experts in the community</div>' : ''}
                    <form id="query-form">
                        <div class="form-group">
                            <label>Category</label>
                            <select id="query-category" required>
                                <option value="">Select a category</option>
                                <option value="nutrition">Nutrition Advice</option>
                                <option value="diet-plan">Diet Planning</option>
                                <option value="weight-loss">Weight Loss</option>
                                <option value="weight-gain">Weight Gain</option>
                                <option value="supplements">Supplements</option>
                                <option value="exercise">Exercise & Fitness</option>
                                <option value="medical">Medical Concerns</option>
                                <option value="recipes">Healthy Recipes</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Priority Level</label>
                            <select id="query-priority" required>
                                <option value="low">Low - General question</option>
                                <option value="medium">Medium - Need advice soon</option>
                                <option value="high">High - Urgent concern</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Your Question</label>
                            <textarea id="query-text" rows="4" placeholder="Describe your question in detail..." required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" id="cancel-query">Cancel</button>
                            <button type="submit" class="btn-primary">${isPublic ? 'Post Public Query' : 'Post Private Query'}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('#cancel-query').addEventListener('click', () => modal.remove());
        modal.querySelector('#query-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitQuery(modal, isPublic);
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    submitQuery(modal, isPublic = false) {
        const category = document.getElementById('query-category').value;
        const priority = document.getElementById('query-priority').value;
        const text = document.getElementById('query-text').value;
        
        // Create query object
        const query = {
            id: Date.now(),
            category,
            priority,
            text,
            timestamp: new Date().toISOString(),
            status: 'pending',
            isPublic: isPublic,
            author: 'John Doe', // In real app, get from auth
            responses: []
        };
        
        if (isPublic) {
            // Save to public queries
            const publicQueries = JSON.parse(localStorage.getItem('publicQueries') || '[]');
            publicQueries.unshift(query); // Add to beginning
            localStorage.setItem('publicQueries', JSON.stringify(publicQueries));
            
            // Refresh public queries list
            this.loadPublicQueries();
            
            this.showToast('Public query posted successfully! The community will see it.', 'success');
        } else {
            // Save to private queries
            const queries = JSON.parse(localStorage.getItem('userQueries') || '[]');
            queries.push(query);
            localStorage.setItem('userQueries', JSON.stringify(queries));
            
            // Add query to chat
            this.addQueryToChat(query);
            
            this.showToast('Private query sent to expert! You\'ll get a response soon.', 'success');
        }
        
        modal.remove();
    }
    
    addQueryToChat(query) {
        const chatMessages = document.getElementById('chat-messages');
        const queryHtml = `
            <div class="message user query">
                <div class="message-content">
                    <div class="query-header">
                        <span class="query-category">${query.category}</span>
                        <span class="query-priority priority-${query.priority}">${query.priority}</span>
                    </div>
                    <p>${query.text}</p>
                    <span class="message-time">${new Date(query.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', queryHtml);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    sendChatMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageHtml = `
            <div class="message user">
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHtml);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate expert response
        setTimeout(() => {
            this.simulateExpertResponse(message);
        }, 2000);
    }
    
    simulateExpertResponse(userMessage) {
        const responses = [
            "That's a great question! Let me help you with that.",
            "Based on your query, I'd recommend focusing on balanced nutrition.",
            "Thanks for sharing your concern. Here's what I suggest...",
            "I understand your goal. Let's work on a personalized approach.",
            "That's very common. Here's some professional advice..."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const chatMessages = document.getElementById('chat-messages');
        const responseHtml = `
            <div class="message expert">
                <div class="message-avatar">
                    <img src="../public/assets/bitmojis/expert-1.gif" alt="Expert">
                </div>
                <div class="message-content">
                    <span class="expert-name">Dr. Sarah Johnson</span>
                    <p>${randomResponse}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', responseHtml);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    loadChatMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        // Load previous messages
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        
        if (savedMessages.length === 0) {
            // Add welcome message
            const welcomeHtml = `
                <div class="message expert">
                    <div class="message-avatar">
                        <img src="../public/assets/bitmojis/expert-1.gif" alt="Expert">
                    </div>
                    <div class="message-content">
                        <span class="expert-name">Dr. Sarah Johnson</span>
                        <p>Hello! I'm here to help you with your nutrition and health goals. Feel free to ask me anything or post a detailed query.</p>
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            `;
            chatMessages.innerHTML = welcomeHtml;
        }
    }
    
    loadPublicQueries() {
        const publicQueriesList = document.getElementById('public-queries-list');
        if (!publicQueriesList) return;
        
        // Get public queries from localStorage
        let publicQueries = JSON.parse(localStorage.getItem('publicQueries') || '[]');
        
        // If no queries, add some sample ones
        if (publicQueries.length === 0) {
            publicQueries = [
                {
                    id: 1,
                    category: 'weight-loss',
                    priority: 'medium',
                    text: 'What are the best foods to eat for sustainable weight loss? I\'ve tried many diets but always gain the weight back.',
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    author: 'Sarah M.',
                    responses: [
                        {
                            expert: 'Dr. Sarah Johnson',
                            text: 'Focus on whole foods, lean proteins, and fiber-rich vegetables. Avoid restrictive diets and aim for a 500-calorie deficit per day.',
                            timestamp: new Date(Date.now() - 1800000).toISOString()
                        }
                    ]
                },
                {
                    id: 2,
                    category: 'nutrition',
                    priority: 'low',
                    text: 'Is it true that eating late at night causes weight gain? I work night shifts and often eat dinner around 11 PM.',
                    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    author: 'Mike R.',
                    responses: [
                        {
                            expert: 'Dr. Emily Chen',
                            text: 'Timing matters less than total calories. Focus on portion control and avoid heavy, hard-to-digest foods before sleep.',
                            timestamp: new Date(Date.now() - 3600000).toISOString()
                        }
                    ]
                },
                {
                    id: 3,
                    category: 'supplements',
                    priority: 'high',
                    text: 'I\'m vegetarian and my doctor said my B12 levels are low. What supplements should I take and how much?',
                    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
                    author: 'Lisa K.',
                    responses: []
                }
            ];
            localStorage.setItem('publicQueries', JSON.stringify(publicQueries));
        }
        
        // Render queries
        publicQueriesList.innerHTML = publicQueries.map(query => `
            <div class="public-query-item ${query.responses.length > 0 ? 'has-response' : ''}" onclick="window.nutriGuru.showPublicQueryDetail(${query.id})">
                <div class="query-item-header">
                    <span class="query-item-category">${this.formatCategory(query.category)}</span>
                    <span class="query-item-time">${this.formatTimeAgo(query.timestamp)}</span>
                </div>
                <div class="query-item-text">${query.text.length > 100 ? query.text.substring(0, 100) + '...' : query.text}</div>
                <div class="query-item-stats">
                    <span><i class="fas fa-user"></i> ${query.author}</span>
                    <span><i class="fas fa-reply"></i> ${query.responses.length} responses</span>
                    <span class="priority-${query.priority}"><i class="fas fa-flag"></i> ${query.priority}</span>
                </div>
            </div>
        `).join('');
    }
    
    formatCategory(category) {
        const categories = {
            'nutrition': 'Nutrition',
            'diet-plan': 'Diet Plan',
            'weight-loss': 'Weight Loss',
            'weight-gain': 'Weight Gain',
            'supplements': 'Supplements',
            'exercise': 'Exercise',
            'medical': 'Medical',
            'recipes': 'Recipes',
            'other': 'Other'
        };
        return categories[category] || category;
    }
    
    formatTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm ago';
        if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h ago';
        return Math.floor(diffInSeconds / 86400) + 'd ago';
    }
    
    showPublicQueryDetail(queryId) {
        const publicQueries = JSON.parse(localStorage.getItem('publicQueries') || '[]');
        const query = publicQueries.find(q => q.id === queryId);
        
        if (!query) return;
        
        const modal = document.createElement('div');
        modal.className = 'query-modal large';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Public Query - ${this.formatCategory(query.category)}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="query-detail">
                        <div class="query-meta">
                            <span class="query-author"><i class="fas fa-user"></i> ${query.author}</span>
                            <span class="query-time"><i class="fas fa-clock"></i> ${this.formatTimeAgo(query.timestamp)}</span>
                            <span class="query-priority priority-${query.priority}"><i class="fas fa-flag"></i> ${query.priority}</span>
                        </div>
                        <div class="query-text">${query.text}</div>
                        
                        <div class="responses-section">
                            <h4>Expert Responses (${query.responses.length})</h4>
                            ${query.responses.length === 0 ? 
                                '<p class="no-responses">No responses yet. Be the first expert to answer!</p>' :
                                query.responses.map(response => `
                                    <div class="response-item">
                                        <div class="response-header">
                                            <strong>${response.expert}</strong>
                                            <span class="response-time">${this.formatTimeAgo(response.timestamp)}</span>
                                        </div>
                                        <div class="response-text">${response.text}</div>
                                    </div>
                                `).join('')
                            }
                        </div>
                        
                        <div class="query-actions">
                            <button class="btn-primary" onclick="window.nutriGuru.showAddResponseForm(${query.id})">
                                <i class="fas fa-reply"></i> Add Response
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    showAddResponseForm(queryId) {
        // Close existing modal
        document.querySelector('.query-modal')?.remove();
        
        const modal = document.createElement('div');
        modal.className = 'query-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Response to Query</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="response-form">
                        <div class="form-group">
                            <label>Your Response</label>
                            <textarea id="response-text" rows="6" placeholder="Provide your professional advice..." required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.query-modal').remove()">Cancel</button>
                            <button type="submit" class="btn-primary">Post Response</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#response-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const responseText = document.getElementById('response-text').value;
            this.addResponseToQuery(queryId, responseText);
            modal.remove();
        });
        
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    }
    
    addResponseToQuery(queryId, responseText) {
        const publicQueries = JSON.parse(localStorage.getItem('publicQueries') || '[]');
        const queryIndex = publicQueries.findIndex(q => q.id === queryId);
        
        if (queryIndex !== -1) {
            publicQueries[queryIndex].responses.push({
                expert: 'You', // In real app, get from current user/expert
                text: responseText,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('publicQueries', JSON.stringify(publicQueries));
            this.loadPublicQueries();
            this.showToast('Response added successfully!', 'success');
        }
    }
    
    updateDailyStats() {
        // Update calories from food diary
        const diary = JSON.parse(localStorage.getItem('foodDiary') || '[]');
        const today = new Date().toISOString().split('T')[0];
        const todayEntries = diary.filter(entry => entry.date === today);
        
        const totalCalories = todayEntries.reduce((sum, entry) => sum + (parseInt(entry.calories) || 0), 0);
        
        // Update UI
        const caloriesStat = document.querySelector('.stat-card.calories h3');
        if (caloriesStat) {
            caloriesStat.textContent = totalCalories;
        }
        
        const caloriesProgress = document.querySelector('.stat-card.calories .progress-fill');
        if (caloriesProgress) {
            const target = 2000; // Daily target
            const percentage = Math.min((totalCalories / target) * 100, 100);
            caloriesProgress.style.width = `${percentage}%`;
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
        this.updateDailyStats();
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
