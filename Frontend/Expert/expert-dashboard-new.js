class ExpertDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.setupProfileTabs();
        this.setupToastNotifications();
        this.loadDashboardData();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.switchSection(section);
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    switchSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
        
        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Update page title
            this.updatePageTitle(sectionName);
            
            // Load section-specific data
            this.loadSectionData(sectionName);
        }
    }

    updatePageTitle(sectionName) {
        const titleElement = document.querySelector('.page-title');
        const subtitleElement = document.querySelector('.page-subtitle');
        
        const titles = {
            dashboard: {
                title: 'Expert Dashboard',
                subtitle: 'Welcome back! Manage your practice and help your patients'
            },
            earnings: {
                title: 'Earnings & Analytics',
                subtitle: 'Track your income and performance metrics'
            },
            patients: {
                title: 'My Patients',
                subtitle: 'Manage and monitor your patient\'s progress'
            },
            queries: {
                title: 'Patient Queries',
                subtitle: 'Review and respond to patient questions'
            },
            consultation: {
                title: 'Video Consultations',
                subtitle: 'Manage your consultation schedule and conduct sessions'
            },
            profile: {
                title: 'Expert Profile',
                subtitle: 'Manage your professional profile and credentials'
            }
        };
        
        if (titles[sectionName]) {
            titleElement.textContent = titles[sectionName].title;
            subtitleElement.textContent = titles[sectionName].subtitle;
        }
    }

    setupEventListeners() {
        // Quick action buttons
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Profile form submissions
        document.querySelectorAll('.profile-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate(form);
            });
        });

        // Avatar upload
        const avatarEditBtn = document.getElementById('avatar-edit-btn');
        const avatarInput = document.getElementById('avatar-input');
        
        if (avatarEditBtn && avatarInput) {
            avatarEditBtn.addEventListener('click', () => {
                avatarInput.click();
            });

            avatarInput.addEventListener('change', (e) => {
                this.handleAvatarUpload(e.target.files[0]);
            });
        }

        // Search functionality
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        });

        // Filter functionality
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleFilter(e.target.value);
            });
        });

        // Daily health advice form
        const adviceForm = document.getElementById('daily-advice-form');
        if (adviceForm) {
            adviceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDailyAdviceSubmit();
            });
        }

        // Diet plan view buttons
        document.querySelectorAll('[data-action="view-diet-plan"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const patientCard = btn.closest('.patient-card');
                this.showDietPlan(patientCard);
            });
        });

        // Chat functionality
        const sendBtn = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');
        
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Chat tab functionality
        this.setupConsultationTabs();
    }

    setupConsultationActions() {
        const joinButtons = document.querySelectorAll('.consultation-card .btn-primary');
        joinButtons.forEach(btn => {
            if (btn.textContent.includes('Join Call')) {
                btn.addEventListener('click', () => {
                    this.startVideoCall();
                });
            }
        });

        const quickStartBtn = document.querySelector('.quick-start-consultation .btn-primary');
        if (quickStartBtn) {
            quickStartBtn.addEventListener('click', () => {
                this.showPatientSelector();
            });
        }
    }

    setupQueryActions() {
        const respondButtons = document.querySelectorAll('.query-card .btn-primary');
        respondButtons.forEach(btn => {
            if (btn.textContent.includes('Respond')) {
                btn.addEventListener('click', (e) => {
                    const queryCard = e.target.closest('.query-card');
                    this.openQueryResponse(queryCard);
                });
            }
        });
    }

    setupProfileTabs() {
        const tabButtons = document.querySelectorAll('.profile-tabs .tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active panel
                tabPanels.forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById(`${targetTab}-tab`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    setupToastNotifications() {
        this.toastContainer = document.getElementById('toast-container');
    }

    handleQuickAction(action) {
        switch (action) {
            case 'new-consultation':
                this.startVideoCall();
                break;
            case 'answer-queries':
                this.switchSection('queries');
                break;
            case 'view-patients':
                this.switchSection('patients');
                break;
            default:
                this.showToast(`Quick action: ${action}`, 'info');
        }
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const profilePicture = document.getElementById('profile-picture');
                if (profilePicture) {
                    profilePicture.src = e.target.result;
                    this.showToast('Profile picture updated successfully!', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            this.showToast('Profile updated successfully!', 'success');
        }, 1000);
    }

    filterQueries(filter) {
        const queryCards = document.querySelectorAll('.query-card');
        
        queryCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const hasClass = card.classList.contains(filter);
                card.style.display = hasClass ? 'block' : 'none';
            }
        });
    }

    searchPatients(searchTerm) {
        const patientCards = document.querySelectorAll('.patient-card');
        
        patientCards.forEach(card => {
            const patientName = card.querySelector('h4').textContent.toLowerCase();
            const matches = patientName.includes(searchTerm.toLowerCase());
            card.style.display = matches ? 'block' : 'none';
        });
    }

    startVideoCall() {
        this.showToast('Starting video consultation...', 'info');
        
        // Simulate video call initialization
        setTimeout(() => {
            this.showToast('Video call connected!', 'success');
        }, 2000);
    }

    showPatientSelector() {
        this.showToast('Opening patient selector...', 'info');
        // Here you would typically show a modal with patient list
    }

    openQueryResponse(queryCard) {
        const patientName = queryCard.querySelector('h4').textContent;
        this.showToast(`Opening response form for ${patientName}...`, 'info');
        // Here you would typically open a response modal or form
    }

    loadDashboardData() {
        // Simulate loading dashboard statistics
        this.updateStats();
        this.loadRecentActivity();
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'earnings':
                this.loadEarningsData();
                break;
            case 'patients':
                this.loadPatientsData();
                break;
            case 'queries':
                this.loadQueriesData();
                break;
            case 'consultation':
                this.loadConsultationData();
                break;
        }
    }

    updateStats() {
        // Animate stats numbers (simple implementation)
        const statValues = document.querySelectorAll('.stat-content h3');
        statValues.forEach(stat => {
            const finalValue = stat.textContent;
            stat.textContent = '0';
            
            setTimeout(() => {
                stat.textContent = finalValue;
                stat.style.transition = 'all 0.5s ease';
            }, 100);
        });
    }

    loadRecentActivity() {
        // Activity data would typically come from an API
        const activities = [
            {
                icon: 'fas fa-video',
                text: 'Video consultation with John Smith completed',
                time: '2 hours ago',
                type: 'success'
            },
            {
                icon: 'fas fa-reply',
                text: 'Answered query from Emma Davis about weight loss',
                time: '4 hours ago',
                type: 'info'
            },
            {
                icon: 'fas fa-user-plus',
                text: 'New patient Michael Brown registered',
                time: '6 hours ago',
                type: 'primary'
            }
        ];

        // Activities are already in HTML, but you could dynamically update them here
    }

    loadEarningsData() {
        // Simulate loading earnings chart data
        const bars = document.querySelectorAll('.chart-bars .bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
                bar.style.transition = 'transform 0.5s ease';
            }, index * 100);
        });
    }

    loadPatientsData() {
        // Patients data would be loaded from API
        this.showToast('Loading patient data...', 'info');
    }

    loadQueriesData() {
        // Queries data would be loaded from API
        this.showToast('Loading patient queries...', 'info');
    }

    loadConsultationData() {
        // Consultation schedule would be loaded from API
        this.showToast('Loading consultation schedule...', 'info');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
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

    // Utility methods for API calls (placeholder implementations)
    async fetchDashboardStats() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    monthlyEarnings: 2450,
                    activePatients: 127,
                    pendingQueries: 34,
                    todaySessions: 8
                });
            }, 1000);
        });
    }

    async fetchPatients(filter = 'all') {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: 'John Smith', program: 'Weight Loss', lastVisit: '2 days ago', active: true },
                    { id: 2, name: 'Emma Davis', program: 'Muscle Gain', lastVisit: '1 week ago', active: true },
                    { id: 3, name: 'Michael Brown', program: 'General Nutrition', lastVisit: '3 weeks ago', active: false }
                ]);
            }, 500);
        });
    }

    async fetchQueries(filter = 'all') {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, patient: 'Sarah Wilson', type: 'Weight Loss', priority: 'urgent', time: '2 hours ago' },
                    { id: 2, patient: 'David Lee', type: 'Supplements', priority: 'medium', time: '1 day ago' },
                    { id: 3, patient: 'Lisa Garcia', type: 'Diet Plan', priority: 'low', time: '2 days ago' }
                ]);
            }, 500);
        });
    }

    async fetchConsultations() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, patient: 'John Smith', time: '2:00 PM', duration: '30 min', type: 'Follow-up', status: 'upcoming' },
                    { id: 2, patient: 'Emma Davis', time: '3:30 PM', duration: '45 min', type: 'Initial', status: 'upcoming' },
                    { id: 3, patient: 'Michael Brown', time: '10:00 AM', duration: '30 min', type: 'Progress Review', status: 'completed' }
                ]);
            }, 500);
        });
    }

    // Daily Health Advice functionality
    async handleDailyAdviceSubmit() {
        const title = document.getElementById('advice-title').value;
        const content = document.getElementById('advice-content').value;
        const category = document.getElementById('advice-category').value;

        if (!title || !content || !category) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            const adviceData = {
                title,
                content,
                category,
                date: new Date().toISOString(),
                author: 'Dr. Sarah Johnson'
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showToast('Daily health advice posted successfully!', 'success');
            
            // Reset form
            document.getElementById('daily-advice-form').reset();
            
            // Add animation to the form
            const adviceCard = document.querySelector('.advice-card');
            adviceCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
                adviceCard.style.transform = 'scale(1)';
            }, 200);

        } catch (error) {
            this.showToast('Failed to post advice. Please try again.', 'error');
        }
    }

    // Diet Plan Modal functionality
    showDietPlan(patientCard) {
        const patientName = patientCard.querySelector('h4').textContent;
        const patientPlan = patientCard.querySelector('p').textContent;
        const patientAvatar = patientCard.querySelector('img').src;

        // Update modal content
        document.getElementById('diet-patient-name').textContent = patientName;
        document.getElementById('diet-patient-plan').textContent = patientPlan;
        document.getElementById('diet-patient-avatar').src = patientAvatar;

        // Show modal
        const modal = document.getElementById('diet-plan-modal');
        modal.classList.add('active');
        
        // Add entrance animation
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 100);
    }

    // Chat functionality
    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();

        if (!message) return;

        // Add message to chat
        const messagesContainer = document.querySelector('.chat-messages');
        const messageElement = this.createMessageElement(message, 'expert');
        messagesContainer.appendChild(messageElement);

        // Clear input
        chatInput.value = '';

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate patient response after a delay
        setTimeout(() => {
            const responses = [
                "Thank you for the advice!",
                "That's very helpful, doctor.",
                "I'll follow your recommendations.",
                "When should I schedule my next check-up?",
                "Should I continue with the current plan?"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const responseElement = this.createMessageElement(randomResponse, 'patient');
            messagesContainer.appendChild(responseElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 2000);

        this.showToast('Message sent!', 'success');
    }

    createMessageElement(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message slide-in`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;

        return messageDiv;
    }

    // Consultation tabs functionality
    setupConsultationTabs() {
        const consultationTabs = document.querySelectorAll('.consultation-tabs .tab-btn');
        
        consultationTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                consultationTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Handle chat tab
                const chatContent = document.getElementById('chat-tab-content');
                if (tab.getAttribute('data-tab') === 'chat') {
                    if (chatContent) {
                        chatContent.style.display = 'block';
                        // Hide schedule content
                        const scheduleContent = document.querySelector('.schedule-content');
                        const quickStart = document.querySelector('.quick-start-consultation');
                        if (scheduleContent) scheduleContent.style.display = 'none';
                        if (quickStart) quickStart.style.display = 'none';
                    }
                } else {
                    if (chatContent) chatContent.style.display = 'none';
                    // Show schedule content
                    const scheduleContent = document.querySelector('.schedule-content');
                    const quickStart = document.querySelector('.quick-start-consultation');
                    if (scheduleContent) scheduleContent.style.display = 'block';
                    if (quickStart) quickStart.style.display = 'block';
                }
            });
        });
    }

    // Enhanced animations for interactions
    addBouncyAnimation(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 150);
        }, 100);
    }

    // Enhanced patient card interactions
    enhancePatientCards() {
        const patientCards = document.querySelectorAll('.patient-card');
        
        patientCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            });
        });
    }

    // Call enhanced animations on load
    loadSectionData(section) {
        if (section === 'patients') {
            this.enhancePatientCards();
        }
        
        // Add entrance animations to elements
        const elements = document.querySelectorAll(`#${section}-section .fade-in, #${section}-section .slide-in`);
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// Global function to close diet plan modal
function closeDietPlanModal() {
    const modal = document.getElementById('diet-plan-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('active');
    }, 200);
}

// Click outside modal to close
document.addEventListener('click', (e) => {
    const modal = document.getElementById('diet-plan-modal');
    if (e.target === modal) {
        closeDietPlanModal();
    }
});

// Add slideOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new ExpertDashboard();
    
    // Make dashboard globally available for debugging
    window.expertDashboard = dashboard;
});

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function formatTime(time) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(new Date(time));
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpertDashboard;
}
