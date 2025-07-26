class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
    }

    show(message, type = 'info', description = '', duration = 5000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            description,
            timestamp: new Date()
        };

        this.notifications.unshift(notification);
        
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        this.render(notification, duration);
    }

    render(notification, duration) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${notification.type}`;
        toast.setAttribute('data-id', notification.id);
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[notification.type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${notification.message}</div>
                ${notification.description ? `<div class="toast-description">${notification.description}</div>` : ''}
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(notification.id));

        container.appendChild(toast);

        // Show toast with animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(notification.id), duration);
        }
    }

    remove(id) {
        const toast = document.querySelector(`[data-id="${id}"]`);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    clear() {
        this.notifications.forEach(n => this.remove(n.id));
        this.notifications = [];
    }
}

window.NotificationManager = NotificationManager;
