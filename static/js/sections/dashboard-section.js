class DashboardSection {
    constructor(mainApp) {
        this.app = mainApp;
        this.isInitialized = false;
    }

    async onSectionShow() {
        if (!this.isInitialized) {
            await this.initialize();
            this.isInitialized = true;
        }
        await this.refreshData();
    }

    async initialize() {
        // Initialize dashboard-specific functionality
        this.setupQuickActions();
        this.setupAdviceInteractions();
    }

    setupQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupAdviceInteractions() {
        const saveBtn = document.querySelector('.advice-btn:not(.secondary)');
        const shareBtn = document.querySelector('.advice-btn.secondary');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAdvice());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareAdvice());
        }
    }

    async saveAdvice() {
        try {
            const advice = document.querySelector('.main-advice').textContent;
            // In real app, save to user's saved tips
            this.app.showToast('Advice saved to your collection!', 'success');
        } catch (error) {
            this.app.showToast('Failed to save advice', 'error');
        }
    }

    shareAdvice() {
        const advice = document.querySelector('.main-advice').textContent;
        if (navigator.share) {
            navigator.share({
                title: 'NutriBaba Health Tip',
                text: advice,
                url: window.location.href
            });
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(advice).then(() => {
                this.app.showToast('Advice copied to clipboard!', 'success');
            });
        }
    }

    async refreshData() {
        // Refresh dashboard data
        await this.app.loadDashboardData();
    }
}

// Make it globally available
window.DashboardSection = DashboardSection;
