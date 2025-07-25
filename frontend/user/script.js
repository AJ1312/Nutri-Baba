// User Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('User Dashboard loaded');
    
    // Initialize dashboard
    initializeDashboard();
    
    // Load user data
    loadUserData();
});

function initializeDashboard() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
}

function loadUserData() {
    // Simulate loading user data
    console.log('Loading user nutrition data...');
    
    // This would typically fetch data from the backend
    fetch('/api/user/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User data loaded:', data);
            updateDashboard(data);
        })
        .catch(error => {
            console.log('Demo mode - using mock data');
            // Use mock data for demo
            const mockData = {
                calories: 1800,
                protein: 120,
                carbs: 180,
                fat: 60
            };
            updateDashboard(mockData);
        });
}

function updateDashboard(data) {
    // Update dashboard with user data
    console.log('Updating dashboard with:', data);
    
    // Add interactive features here
    addInteractivity();
}

function addInteractivity() {
    // Add hover effects and click handlers
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Card clicked:', this.querySelector('h3').textContent);
        });
    });
}
