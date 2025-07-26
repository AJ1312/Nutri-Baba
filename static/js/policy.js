class LegalPageManager {
    constructor() {
        this.termsTab = document.getElementById('termsTab');
        this.privacyTab = document.getElementById('privacyTab');
        this.termsSection = document.getElementById('termsSection');
        this.privacySection = document.getElementById('privacySection');
        this.backToTopBtn = document.getElementById('backToTop');
        
        this.init();
    }
    
    init() {
        this.setupTabNavigation();
        this.setupSmoothScrolling();
        this.setupBackToTop();
        this.setupFooterLinks();
        this.updateLastModified();
        this.handleURLHash();
    }
    
    setupTabNavigation() {
        this.termsTab.addEventListener('click', () => {
            this.showSection('terms');
        });
        
        this.privacyTab.addEventListener('click', () => {
            this.showSection('privacy');
        });
    }
    
    showSection(section) {
        // Update tabs
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Update sections
        const sections = document.querySelectorAll('.legal-section');
        sections.forEach(sec => sec.classList.remove('active'));
        
        if (section === 'terms') {
            this.termsTab.classList.add('active');
            this.termsSection.classList.add('active');
            window.history.pushState(null, null, '#terms');
        } else if (section === 'privacy') {
            this.privacyTab.classList.add('active');
            this.privacySection.classList.add('active');
            window.history.pushState(null, null, '#privacy');
        }
        
        // Scroll to top of content
        this.scrollToTop();
    }
    
    setupSmoothScrolling() {
        // Handle table of contents links
        const tocLinks = document.querySelectorAll('.toc-link');
        
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 120;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash
                    window.history.pushState(null, null, `#${targetId}`);
                    
                    // Highlight the target section briefly
                    this.highlightSection(targetElement);
                }
            });
        });
    }
    
    highlightSection(element) {
        element.style.background = 'rgba(14, 165, 233, 0.05)';
        element.style.borderRadius = 'var(--radius-lg)';
        element.style.padding = 'var(--space-4)';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.style.background = 'transparent';
            element.style.padding = '0';
        }, 2000);
    }
    
    setupBackToTop() {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTopBtn.classList.remove('hidden');
            } else {
                this.backToTopBtn.classList.add('hidden');
            }
        });
        
        // Handle back to top click
        this.backToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    setupFooterLinks() {
        const footerLinks = document.querySelectorAll('.footer-link[data-section]');
        
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }
    
    updateLastModified() {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const termsDate = document.getElementById('termsDate');
        const privacyDate = document.getElementById('privacyDate');
        
        if (termsDate) termsDate.textContent = formattedDate;
        if (privacyDate) privacyDate.textContent = formattedDate;
    }
    
    handleURLHash() {
        const hash = window.location.hash.substring(1);
        
        if (hash === 'privacy') {
            this.showSection('privacy');
        } else if (hash === 'terms') {
            this.showSection('terms');
        } else if (hash) {
            // Check if it's a section within terms or privacy
            const element = document.getElementById(hash);
            if (element) {
                // Determine which section contains this element
                const termsSection = document.getElementById('termsSection');
                const privacySection = document.getElementById('privacySection');
                
                if (termsSection.contains(element)) {
                    this.showSection('terms');
                } else if (privacySection.contains(element)) {
                    this.showSection('privacy');
                }
                
                // Scroll to the specific section after a brief delay
                setTimeout(() => {
                    const headerOffset = 120;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    this.highlightSection(element);
                }, 300);
            }
        }
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleURLHash();
        });
    }
    
    // Utility method to show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const bgColor = type === 'error' ? 'var(--red-500)' : 'var(--primary-500)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: var(--space-4) var(--space-6);
            border-radius: var(--radius-lg);
            font-size: var(--font-size-sm);
            font-weight: 500;
            z-index: 1001;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 4000);
    }
    
    // Method to handle print functionality
    setupPrintFunction() {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 6,2 18,2 18,9"/>
                <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"/>
                <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
        `;
        printBtn.className = 'print-btn';
        printBtn.style.cssText = `
            position: fixed;
            bottom: var(--space-8);
            left: var(--space-8);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-3) var(--space-4);
            background: white;
            border: 2px solid var(--primary-600);
            color: var(--primary-600);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: 500;
            font-size: var(--font-size-sm);
            box-shadow: var(--shadow-lg);
            transition: all var(--transition-normal);
            z-index: 1000;
        `;
        
        printBtn.addEventListener('mouseenter', () => {
            printBtn.style.background = 'var(--primary-600)';
            printBtn.style.color = 'white';
        });
        
        printBtn.addEventListener('mouseleave', () => {
            printBtn.style.background = 'white';
            printBtn.style.color = 'var(--primary-600)';
        });
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        document.body.appendChild(printBtn);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.legalPageManager = new LegalPageManager();
});

// Add print styles
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .header, .legal-nav, .back-to-top, .footer, .print-btn {
            display: none !important;
        }
        
        .legal-section {
            display: block !important;
        }
        
        .legal-card {
            box-shadow: none;
            border: 1px solid #ccc;
        }
        
        body {
            background: white !important;
        }
        
        .page-title {
            color: black !important;
        }
        
        .section-title {
            color: black !important;
        }
        
        .legal-article h3 {
            border-bottom: 1px solid #ccc;
            color: black !important;
        }
        
        .disclaimer-box {
            border: 2px solid #333;
            background: #f9f9f9;
        }
        
        .toc-link {
            color: #0066cc !important;
        }
    }
`;
document.head.appendChild(printStyles);