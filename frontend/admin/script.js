// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard loaded');
    
    // Initialize admin dashboard
    initializeAdminDashboard();
    
    // Load admin statistics
    loadAdminStats();
    
    // Setup event listeners
    setupEventListeners();
});

function initializeAdminDashboard() {
    // Add admin-specific styling
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
        card.classList.add('admin-card');
    });

    // Add button styling
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('admin-button');
    });

    console.log('Admin dashboard initialized');
}

function loadAdminStats() {
    console.log('Loading admin statistics...');
    
    // Simulate loading statistics
    const stats = {
        totalUsers: 0,
        activeSessions: 0,
        mealPlans: 0,
        apiCalls: 0
    };

    // Animate counters
    animateCounter('totalUsers', 1247, 2000);
    animateCounter('activeSessions', 83, 1500);
    animateCounter('mealPlans', 564, 1800);
    animateCounter('apiCalls', 12847, 2500);
}

function animateCounter(elementId, target, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

function setupEventListeners() {
    // User Management buttons
    const userButtons = document.querySelectorAll('button');
    userButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            handleAdminAction(action);
        });
    });
}

function handleAdminAction(action) {
    console.log('Admin action triggered:', action);
    
    // Show loading state
    showNotification(`Executing: ${action}`, 'info');
    
    // Simulate API call
    setTimeout(() => {
        showNotification(`${action} completed successfully!`, 'success');
    }, 1500);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${getNotificationClass(type)}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getNotificationClass(type) {
    switch(type) {
        case 'success':
            return 'bg-green-500 text-white';
        case 'error':
            return 'bg-red-500 text-white';
        case 'warning':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-blue-500 text-white';
    }
}

// Real-time updates simulation
setInterval(() => {
    // Simulate real-time data updates
    const activeSessions = document.getElementById('activeSessions');
    if (activeSessions) {
        const currentValue = parseInt(activeSessions.textContent.replace(/,/g, ''));
        const newValue = currentValue + Math.floor(Math.random() * 10) - 5;
        if (newValue >= 0) {
            activeSessions.textContent = newValue.toLocaleString();
        }
    }
}, 10000); // Update every 10 seconds
