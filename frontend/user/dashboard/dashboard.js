// Nutri Guru Dashboard JavaScript

class NutriGuruDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.userData = {
            calories: 0,
            protein: 0,
            water: 0,
            meals: 0
        };
        this.experts = [
            {
                id: 1,
                name: "Dr. Sarah Johnson",
                specialty: "Weight Management",
                avatar: "../public/assets/bitmojis/expert-1.gif",
                status: "online",
                rating: 4.9
            },
            {
                id: 2,
                name: "Dr. Mike Chen",
                specialty: "Sports Nutrition",
                avatar: "../public/assets/bitmojis/expert-2.gif",
                status: "busy",
                rating: 4.8
            },
            {
                id: 3,
                name: "Dr. Emily Rodriguez",
                specialty: "Clinical Nutrition",
                avatar: "../public/assets/bitmojis/expert-3.gif",
                status: "online",
                rating: 4.9
            }
        ];
        this.dailyTips = [
            {
                icon: "fas fa-apple-alt",
                title: "Fiber Power",
                content: "Include 25-30g of fiber daily for better digestion and sustained energy.",
                category: "nutrition"
            },
            {
                icon: "fas fa-tint",
                title: "Hydration Tip",
                content: "Drink a glass of water before each meal to aid digestion and control portions.",
                category: "hydration"
            },
            {
                icon: "fas fa-clock",
                title: "Meal Timing",
                content: "Eat your largest meal earlier in the day when your metabolism is most active.",
                category: "timing"
            },
            {
                icon: "fas fa-moon",
                title: "Sleep & Nutrition",
                content: "7-9 hours of quality sleep helps regulate hunger hormones and metabolism.",
                category: "wellness"
            }
        ];
        this.weeklyPlan = {
            monday: {
                breakfast: { name: "Greek Yogurt Bowl", calories: 320, protein: 20 },
                lunch: { name: "Quinoa Salad", calories: 450, protein: 15 },
                dinner: { name: "Grilled Salmon", calories: 380, protein: 35 },
                snacks: [{ name: "Apple & Almonds", calories: 180, protein: 6 }]
            },
            tuesday: {
                breakfast: { name: "Oatmeal with Berries", calories: 280, protein: 8 },
                lunch: { name: "Chicken Wrap", calories: 420, protein: 25 },
                dinner: { name: "Vegetable Stir-fry", calories: 340, protein: 12 },
                snacks: [{ name: "Greek Yogurt", calories: 150, protein: 15 }]
            },
            // Add more days as needed
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.renderExperts();
        this.renderDailyTips();
        this.startAnimations();
        console.log('🌱 Nutri Guru Dashboard initialized!');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                this.handleActionCard(action);
            });
        });

        // Photo upload
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('upload-btn');

        uploadBtn?.addEventListener('click', () => fileInput?.click());
        
        fileInput?.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // Drag and drop
        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            this.handleFileUpload(e.dataTransfer.files[0]);
        });

        // Diet plan generation
        document.getElementById('generate-plan')?.addEventListener('click', () => {
            this.generateDietPlan();
        });

        // Calorie range slider
        const calorieRange = document.getElementById('calorie-range');
        const calorieDisplay = document.getElementById('calorie-display');
        
        calorieRange?.addEventListener('input', (e) => {
            calorieDisplay.textContent = e.target.value;
        });

        // Allergy tags
        document.querySelectorAll('.allergy-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });

        // Week tabs
        document.querySelectorAll('.week-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchDay(tab.dataset.day);
            });
        });

        // Chat functionality
        document.getElementById('send-message')?.addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('message-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // New analysis button
        document.getElementById('new-analysis')?.addEventListener('click', () => {
            this.resetPhotoAnalysis();
        });

        // Floating action button
        document.getElementById('quick-add-fab')?.addEventListener('click', () => {
            this.showQuickAddModal();
        });

        // Add to diary
        document.getElementById('add-to-diary')?.addEventListener('click', () => {
            this.addToDiary();
        });
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Switch content
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-content`).classList.add('active');

        this.currentSection = sectionName;
        
        // Section-specific initialization
        if (sectionName === 'expert-chat') {
            this.initializeChat();
        }
    }

    handleActionCard(action) {
        const actionMap = {
            'photo-analysis': 'photo-analysis',
            'diet-plan': 'diet-plan',
            'expert-chat': 'expert-chat',
            'track-meal': 'dashboard'
        };

        const targetSection = actionMap[action];
        if (targetSection) {
            this.switchSection(targetSection);
        }

        // Add some visual feedback
        this.showNotification(`Opening ${action.replace('-', ' ')}...`, 'info');
    }

    loadDashboardData() {
        // Simulate loading data with animations
        this.animateCounter('calories-count', 1340, 2000);
        this.animateCounter('water-count', 3, 1500);
        this.animateCounter('protein-count', 90, 1800);
        this.animateCounter('meals-count', 2, 1200);

        // Update user data
        this.userData = {
            calories: 1340,
            protein: 90,
            water: 3,
            meals: 2
        };
    }

    animateCounter(elementId, target, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    handleFileUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            return;
        }

        this.showLoadingOverlay('Analyzing your food photo...');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview-image').src = e.target.result;
            
            // Show analysis result section
            document.querySelector('.upload-area').style.display = 'none';
            document.getElementById('analysis-result').classList.remove('hidden');
            
            // Simulate AI analysis
            this.simulatePhotoAnalysis();
        };
        reader.readAsDataURL(file);
    }

    simulatePhotoAnalysis() {
        // Mock nutrition data - in real app, this would come from AI service
        const mockResults = [
            { name: "Grilled Chicken Breast", calories: 284, protein: 53, carbs: 0, fat: 6, fiber: 0, sugar: 0 },
            { name: "Caesar Salad", calories: 470, protein: 13, carbs: 7, fat: 43, fiber: 3, sugar: 4 },
            { name: "Avocado Toast", calories: 320, protein: 8, carbs: 35, fat: 18, fiber: 12, sugar: 3 },
            { name: "Smoothie Bowl", calories: 380, protein: 12, carbs: 65, fat: 8, fiber: 15, sugar: 45 }
        ];

        const result = mockResults[Math.floor(Math.random() * mockResults.length)];

        setTimeout(() => {
            this.hideLoadingOverlay();
            this.displayAnalysisResult(result);
        }, 3000);
    }

    displayAnalysisResult(result) {
        document.getElementById('food-name').textContent = result.name;
        document.getElementById('analyzed-calories').textContent = `${result.calories} kcal`;
        document.getElementById('analyzed-protein').textContent = `${result.protein}g`;
        document.getElementById('analyzed-carbs').textContent = `${result.carbs}g`;
        document.getElementById('analyzed-fat').textContent = `${result.fat}g`;
        document.getElementById('analyzed-fiber').textContent = `${result.fiber}g`;
        document.getElementById('analyzed-sugar').textContent = `${result.sugar}g`;

        // Store result for adding to diary
        this.currentAnalysis = result;

        this.showNotification('Food analysis complete!', 'success');
    }

    generateDietPlan() {
        const goal = document.getElementById('diet-goal').value;
        const dietType = document.getElementById('diet-type').value;
        const calories = document.getElementById('calorie-range').value;

        this.showLoadingOverlay('Creating your personalized diet plan...');
        
        // Show loading state
        document.getElementById('plan-loading').style.display = 'block';
        document.getElementById('plan-result').classList.add('hidden');

        setTimeout(() => {
            this.hideLoadingOverlay();
            document.getElementById('plan-loading').style.display = 'none';
            document.getElementById('plan-result').classList.remove('hidden');
            
            this.renderWeeklyPlan();
            this.showNotification('Your personalized diet plan is ready!', 'success');
        }, 4000);
    }

    renderWeeklyPlan() {
        // Default to Monday
        this.switchDay('monday');
    }

    switchDay(day) {
        // Update active tab
        document.querySelectorAll('.week-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-day="${day}"]`).classList.add('active');

        // Render day content
        const dayData = this.weeklyPlan[day];
        if (dayData) {
            this.renderDayContent(dayData);
        }
    }

    renderDayContent(dayData) {
        const dayContent = document.getElementById('day-content');
        dayContent.innerHTML = `
            <div class="space-y-6">
                <div class="meal-section">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-sun text-yellow-500 mr-2"></i>Breakfast
                    </h4>
                    <div class="meal-card">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium text-gray-800">${dayData.breakfast.name}</p>
                                <p class="text-sm text-gray-600">${dayData.breakfast.calories} kcal • ${dayData.breakfast.protein}g protein</p>
                            </div>
                            <button class="btn-secondary text-sm">
                                <i class="fas fa-plus mr-1"></i>Add
                            </button>
                        </div>
                    </div>
                </div>

                <div class="meal-section">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-sun text-orange-500 mr-2"></i>Lunch
                    </h4>
                    <div class="meal-card">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium text-gray-800">${dayData.lunch.name}</p>
                                <p class="text-sm text-gray-600">${dayData.lunch.calories} kcal • ${dayData.lunch.protein}g protein</p>
                            </div>
                            <button class="btn-secondary text-sm">
                                <i class="fas fa-plus mr-1"></i>Add
                            </button>
                        </div>
                    </div>
                </div>

                <div class="meal-section">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-moon text-blue-600 mr-2"></i>Dinner
                    </h4>
                    <div class="meal-card">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium text-gray-800">${dayData.dinner.name}</p>
                                <p class="text-sm text-gray-600">${dayData.dinner.calories} kcal • ${dayData.dinner.protein}g protein</p>
                            </div>
                            <button class="btn-secondary text-sm">
                                <i class="fas fa-plus mr-1"></i>Add
                            </button>
                        </div>
                    </div>
                </div>

                <div class="meal-section">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-cookie-bite text-green-500 mr-2"></i>Snacks
                    </h4>
                    ${dayData.snacks.map(snack => `
                        <div class="meal-card mb-2">
                            <div class="flex justify-between items-center">
                                <div>
                                    <p class="font-medium text-gray-800">${snack.name}</p>
                                    <p class="text-sm text-gray-600">${snack.calories} kcal • ${snack.protein}g protein</p>
                                </div>
                                <button class="btn-secondary text-sm">
                                    <i class="fas fa-plus mr-1"></i>Add
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderExperts() {
        const expertList = document.getElementById('expert-list');
        if (!expertList) return;

        expertList.innerHTML = this.experts.map(expert => `
            <div class="expert-card" data-expert-id="${expert.id}">
                <div class="flex items-center space-x-3 mb-2">
                    <img src="${expert.avatar}" alt="${expert.name}" class="w-12 h-12 rounded-full">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${expert.name}</h4>
                        <p class="text-sm text-gray-600">${expert.specialty}</p>
                    </div>
                </div>
                <div class="expert-status">
                    <i class="fas fa-circle text-xs status-${expert.status}"></i>
                    <span class="text-sm text-gray-600 capitalize">${expert.status}</span>
                    <div class="ml-auto flex items-center">
                        <i class="fas fa-star text-yellow-400 text-xs"></i>
                        <span class="text-sm text-gray-600 ml-1">${expert.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.expert-card').forEach(card => {
            card.addEventListener('click', () => {
                const expertId = parseInt(card.dataset.expertId);
                this.selectExpert(expertId);
            });
        });
    }

    selectExpert(expertId) {
        const expert = this.experts.find(e => e.id === expertId);
        if (expert) {
            this.initializeChat(expert);
            this.showNotification(`Starting chat with ${expert.name}`, 'success');
        }
    }

    initializeChat(expert = this.experts[0]) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const welcomeMessages = [
            `Hello! I'm ${expert.name}, your nutrition expert. How can I help you today?`,
            "I'm here to answer any questions about your diet, nutrition goals, or health concerns.",
            "Feel free to ask me anything! 🌱"
        ];

        chatMessages.innerHTML = welcomeMessages.map((message, index) => `
            <div class="message received animate-fade-in" style="animation-delay: ${index * 0.5}s">
                ${message}
            </div>
        `).join('');
    }

    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const chatMessages = document.getElementById('chat-messages');
        
        if (!messageInput || !chatMessages || !messageInput.value.trim()) return;

        const message = messageInput.value.trim();
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message sent animate-fade-in';
        userMessage.textContent = message;
        chatMessages.appendChild(userMessage);
        
        messageInput.value = '';
        
        // Simulate expert response
        setTimeout(() => {
            const responses = [
                "That's a great question! Based on your profile, I'd recommend...",
                "I understand your concern. Here's what I suggest...",
                "Excellent! Let me provide you with some personalized advice...",
                "That's definitely achievable with the right approach. Here's my recommendation..."
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            const expertMessage = document.createElement('div');
            expertMessage.className = 'message received animate-fade-in';
            expertMessage.textContent = response;
            chatMessages.appendChild(expertMessage);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    renderDailyTips() {
        const tipsContainer = document.getElementById('daily-tips');
        if (!tipsContainer) return;

        tipsContainer.innerHTML = this.dailyTips.map((tip, index) => `
            <div class="tip-card animate-fade-in" style="animation-delay: ${index * 0.2}s">
                <div class="tip-icon">
                    <i class="${tip.icon}"></i>
                </div>
                <h4 class="font-semibold text-gray-800 mb-2">${tip.title}</h4>
                <p class="text-sm text-gray-600">${tip.content}</p>
                <span class="inline-block mt-2 px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs text-gray-600">
                    ${tip.category}
                </span>
            </div>
        `).join('');
    }

    startAnimations() {
        // Animate stat cards on load
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'slideInLeft 0.6s ease-out';
            }, index * 200);
        });

        // Animate action cards
        document.querySelectorAll('.action-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
            }, index * 100 + 800);
        });
    }

    resetPhotoAnalysis() {
        document.querySelector('.upload-area').style.display = 'flex';
        document.getElementById('analysis-result').classList.add('hidden');
        document.getElementById('preview-image').src = '';
        this.currentAnalysis = null;
    }

    addToDiary() {
        if (!this.currentAnalysis) return;

        this.userData.calories += this.currentAnalysis.calories;
        this.userData.protein += this.currentAnalysis.protein;
        this.userData.meals += 1;

        this.updateDashboardStats();
        this.showNotification('Food added to your diary!', 'success');
        
        // Switch back to dashboard
        this.switchSection('dashboard');
    }

    updateDashboardStats() {
        document.getElementById('calories-count').textContent = this.userData.calories;
        document.getElementById('protein-count').textContent = this.userData.protein;
        document.getElementById('meals-count').textContent = this.userData.meals;
    }

    showQuickAddModal() {
        // In a real app, this would show a modal for quick food logging
        this.showNotification('Quick add feature coming soon!', 'info');
    }

    showLoadingOverlay(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.querySelector('p').textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Additional utility functions
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nutriGuruDashboard = new NutriGuruDashboard();
});

// Add some global event listeners for enhanced UX
document.addEventListener('keydown', (e) => {
    // ESC key to close modals or overlays
    if (e.key === 'Escape') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay && !overlay.classList.contains('hidden')) {
            overlay.classList.add('hidden');
        }
    }
});

// Add service worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
