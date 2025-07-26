// 🚀 Nutri Baba Landing Page - Interactive Features & Animations

class LandingPageController {
    constructor() {
        this.isLoaded = false;
        this.currentTestimonial = 0;
        this.testimonials = [];
        this.floatingEmojis = [];
        this.particles = [];
        this.customCursor = null;
        this.isMouseDown = false;
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCustomCursor();
            this.setupFloatingBackground();
            this.setupNavbarEffects();
            this.setupHeroAnimations();
            this.setupFeatureInteractions();
            this.setupTestimonialCarousel();
            this.setupCTAEffects();
            this.setupScrollEffects();
            this.setupClickEffects();
            this.setupParticleSystem();
            this.setupTypingAnimation();
            this.isLoaded = true;
        });
    }

    // Custom Cursor System
    setupCustomCursor() {
        this.customCursor = document.createElement('div');
        this.customCursor.className = 'cursor-follow';
        document.body.appendChild(this.customCursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mousedown', () => {
            this.customCursor.classList.add('clicked');
            this.isMouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            this.customCursor.classList.remove('clicked');
            this.isMouseDown = false;
        });

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            this.customCursor.style.left = cursorX + 'px';
            this.customCursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();
    }

    // Floating Background Emojis
    setupFloatingBackground() {
        const bgAnimation = document.querySelector('.bg-animation');
        const emojis = ['🥗', '🍎', '🥕', '🥑', '🍊', '🫐', '🥒', '🍅', '🥦', '🌽', '🍓', '🥝', '🍌', '🥬', '🫑'];
        
        // Create 15 floating emojis scattered everywhere
        for (let i = 0; i < 15; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            bgAnimation.appendChild(emoji);
        }

        // Add interactive hover effects
        document.querySelectorAll('.floating-emoji').forEach(emoji => {
            emoji.addEventListener('mouseenter', () => {
                emoji.style.fontSize = '3rem';
                emoji.style.opacity = '0.3';
                emoji.style.animation = 'spin 1s ease-in-out';
                emoji.style.pointerEvents = 'auto';
            });

            emoji.addEventListener('mouseleave', () => {
                emoji.style.fontSize = '2rem';
                emoji.style.opacity = '0.1';
                emoji.style.pointerEvents = 'none';
            });

            emoji.addEventListener('click', () => {
                this.createEmojiExplosion(emoji, [emoji.textContent]);
            });
        });
    }

    // Navbar Effects
    setupNavbarEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.9)';
                navbar.style.boxShadow = 'none';
            }

            // Hide/show navbar on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });

        // Logo interactions
        const logoIcon = document.querySelector('.logo-icon');
        const logoSparkle = document.querySelector('.logo-sparkle');
        
        logoIcon.addEventListener('click', () => {
            this.createEmojiExplosion(logoIcon, ['✨', '⭐', '🌟', '💫']);
        });

        // Animated nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Hero Section Animations
    setupHeroAnimations() {
        // Typing animation
        this.setupTypingAnimation();
        
        // Fitness bowl interactions
        this.setupFitnessBowl();
        
        // CTA button effects
        this.setupCTAButtons();
    }

    setupTypingAnimation() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;

        const words = ['Nutrition', 'Wellness', 'Health', 'Fitness'];
        let currentWord = 0;
        let currentChar = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const word = words[currentWord];
            
            if (isDeleting) {
                typingText.textContent = word.substring(0, currentChar - 1);
                currentChar--;
            } else {
                typingText.textContent = word.substring(0, currentChar + 1);
                currentChar++;
            }

            let typeSpeed = isDeleting ? 100 : 200;

            if (!isDeleting && currentChar === word.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentWord = (currentWord + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        };

        typeWriter();
    }

    setupFitnessBowl() {
        const fitnessContainer = document.querySelector('.fitness-bowl-container');
        if (!fitnessContainer) return;

        // Add interactive effects to the bowl
        const bowlBase = document.querySelector('.bowl-base');
        if (bowlBase) {
            bowlBase.addEventListener('click', () => {
                this.createEmojiExplosion(bowlBase, ['🥗', '💪', '⚡', '🏆']);
                bowlBase.style.animation = 'bowl-bounce 0.5s ease-out';
            });
        }

        // Add click effects to ingredients
        document.querySelectorAll('.ingredient').forEach(ingredient => {
            ingredient.addEventListener('click', () => {
                this.createEmojiExplosion(ingredient, [ingredient.textContent]);
                ingredient.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    ingredient.style.transform = 'scale(1)';
                }, 300);
            });
        });

        // Add click effects to fitness icons
        document.querySelectorAll('.fitness-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                this.createEmojiExplosion(icon, [icon.textContent]);
                icon.style.animation = 'fitness-orbit 2s ease-in-out';
            });
        });
    }

    setupCTAButtons() {
        const primaryBtn = document.querySelector('.primary-btn');
        
        if (primaryBtn) {
            primaryBtn.addEventListener('click', (e) => {
                this.createRippleEffect(e, primaryBtn);
                this.createParticleExplosion(primaryBtn);
            });
        }
    }

    // Feature Interactions
    setupFeatureInteractions() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach((card, index) => {
            // Intersection Observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(() => {
                        card.style.animation = 'slide-in-up 0.6s ease-out forwards';
                    }, index * 100);
                    observer.disconnect();
                }
            });
            
            observer.observe(card);
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                this.activateFeatureDemo(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.deactivateFeatureDemo(card);
            });
            
            // Click effects
            card.addEventListener('click', () => {
                this.showFeatureDetails(card);
            });
        });
    }

    activateFeatureDemo(card) {
        const demo = card.querySelector('.feature-demo');
        if (!demo) return;
        
        const cardType = this.getFeatureType(card);
        
        switch (cardType) {
            case 'scan':
                this.animateFoodScan(demo);
                break;
            case 'plan':
                this.animateMealPlan(demo);
                break;
            case 'expert':
                this.animateExpertChat(demo);
                break;
            case 'progress':
                this.animateProgress(demo);
                break;
        }
    }

    getFeatureType(card) {
        if (card.querySelector('.camera-icon')) return 'scan';
        if (card.querySelector('.plan-icon')) return 'plan';
        if (card.querySelector('.expert-icon')) return 'expert';
        if (card.querySelector('.progress-icon')) return 'progress';
        return 'default';
    }

    animateFoodScan(demo) {
        demo.innerHTML = `
            <div class="scan-animation-container">
                <div class="scan-target">📸</div>
                <div class="scan-line"></div>
                <div class="scan-result">
                    <div class="food-item">🍎 Apple - 95 cal</div>
                    <div class="nutrition-bar">
                        <div class="bar-fill" style="width: 80%"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Add scan line animation
        setTimeout(() => {
            const scanLine = demo.querySelector('.scan-line');
            if (scanLine) {
                scanLine.style.animation = 'scan-sweep 2s ease-in-out';
            }
        }, 100);
    }

    animateMealPlan(demo) {
        const meals = [
            '🍳 Breakfast: Oatmeal Bowl',
            '🥗 Lunch: Power Salad',
            '🍽️ Dinner: Grilled Salmon'
        ];
        
        demo.innerHTML = '<div class="meal-plan-preview"></div>';
        const container = demo.querySelector('.meal-plan-preview');
        
        meals.forEach((meal, index) => {
            setTimeout(() => {
                const mealCard = document.createElement('div');
                mealCard.className = 'meal-card';
                mealCard.textContent = meal;
                container.appendChild(mealCard);
            }, index * 300);
        });
    }

    animateExpertChat(demo) {
        demo.innerHTML = `
            <div class="chat-preview">
                <div class="chat-bubble">
                    <div class="avatar">👨‍⚕️</div>
                    <div class="message">How can I help you today?</div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const newMessage = document.createElement('div');
            newMessage.className = 'chat-bubble';
            newMessage.innerHTML = `
                <div class="avatar">👤</div>
                <div class="message">I need a meal plan!</div>
            `;
            demo.querySelector('.chat-preview').appendChild(newMessage);
        }, 1000);
    }

    animateProgress(demo) {
        demo.innerHTML = `
            <div class="progress-preview">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="achievement-badge">🏆</div>
            </div>
        `;
    }

    deactivateFeatureDemo(card) {
        const demo = card.querySelector('.feature-demo');
        if (!demo) return;
        
        setTimeout(() => {
            demo.innerHTML = `
                <div class="demo-placeholder">
                    <i class="fas fa-play-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <span>Hover to see demo</span>
                </div>
            `;
        }, 2000);
    }

    showFeatureDetails(card) {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        
        // Create feature modal (simplified)
        const modal = document.createElement('div');
        modal.className = 'feature-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="feature-details">
                    <h4>Key Benefits:</h4>
                    <ul>
                        <li>✅ Real-time analysis</li>
                        <li>✅ Personalized recommendations</li>
                        <li>✅ Expert guidance</li>
                        <li>✅ Progress tracking</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Project Builders Interactions
    setupTestimonialCarousel() {
        const builderCards = document.querySelectorAll('.builder-card');
        
        if (builderCards.length === 0) return;
        
        // Add hover effects to builder cards
        builderCards.forEach((card, index) => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(() => {
                        card.style.animation = 'slide-in-up 0.6s ease-out forwards';
                    }, index * 200);
                    observer.disconnect();
                }
            });
            
            observer.observe(card);
            
            // Add click interactions
            card.addEventListener('click', () => {
                this.showBuilderInfo(card, index);
            });

            // Add avatar click effects
            const avatar = card.querySelector('.builder-avatar');
            if (avatar) {
                avatar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.createEmojiExplosion(avatar, ['💻', '🚀', '⚡', '🎯']);
                });
            }
        });
    }

    showBuilderInfo(card, index) {
        const builderNames = ['Ajitesh Sharma', 'Pranav Rayban', 'Satvik Jambadi'];
        const builderDetails = [
            'Lead developer passionate about AI and full-stack development. Loves creating intuitive user experiences.',
            'Backend wizard who ensures our APIs are lightning fast and secure. Coffee enthusiast and problem solver.',
            'Data scientist who makes sense of complex nutrition data. ML expert and research enthusiast.'
        ];
        
        // Create a fun notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--gradient-primary);
                color: white;
                padding: 1rem 2rem;
                border-radius: 1rem;
                box-shadow: var(--shadow-xl);
                z-index: 10000;
                animation: slide-in-right 0.5s ease-out;
            ">
                <h4>👋 Hey from ${builderNames[index]}!</h4>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">${builderDetails[index]}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // CTA Section Effects
    setupCTAEffects() {
        const ctaBtn = document.querySelector('.mega-cta-btn');
        const emojiElements = document.querySelectorAll('.burst-emoji');
        
        if (ctaBtn) {
            ctaBtn.addEventListener('mouseenter', () => {
                this.createCTAParticles(ctaBtn);
            });
            
            ctaBtn.addEventListener('click', (e) => {
                this.createMegaExplosion(e.target);
                this.redirectToDashboard();
            });
        }
        
        // Animate burst emojis
        emojiElements.forEach((emoji, index) => {
            emoji.addEventListener('click', () => {
                this.createEmojiExplosion(emoji, [emoji.textContent]);
            });
        });
    }

    createCTAParticles(button) {
        const particles = button.querySelector('.btn-particles-container');
        if (!particles) return;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particles.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
    }

    createMegaExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const emojis = ['🎉', '✨', '🎊', '🌟', '💥', '🚀'];
        
        for (let i = 0; i < 20; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = centerX + 'px';
            emoji.style.top = centerY + 'px';
            emoji.style.fontSize = '2rem';
            emoji.style.pointerEvents = 'none';
            emoji.style.zIndex = '10000';
            
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            document.body.appendChild(emoji);
            
            emoji.animate([
                { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0) rotate(360deg)`, opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).onfinish = () => emoji.remove();
        }
    }

    redirectToDashboard() {
        setTimeout(() => {
            window.location.href = '../modern-dashboard.html';
        }, 1000);
    }

    // Scroll Effects
    setupScrollEffects() {
        // Parallax effects
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
        
        // Reveal animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Click Effects
    setupClickEffects() {
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
    }

    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 600);
    }

    createRippleEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createParticleExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#0ea5e9';
            particle.style.borderRadius = '50%';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }

    createEmojiExplosion(element, emojis) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 6; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = centerX + 'px';
            emoji.style.top = centerY + 'px';
            emoji.style.fontSize = '1.5rem';
            emoji.style.pointerEvents = 'none';
            emoji.style.zIndex = '9999';
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 40 + Math.random() * 40;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            document.body.appendChild(emoji);
            
            emoji.animate([
                { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(${endX - centerX - 50}px, ${endY - centerY - 50}px) scale(0) rotate(180deg)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => emoji.remove();
        }
    }

    // Particle System
    setupParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const particles = [];
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Initialize Easter Eggs
    setupEasterEggs() {
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.activateEasterEgg();
                konamiCode = [];
            }
        });
        
        // Secret click sequence on logo
        let logoClicks = 0;
        const logo = document.querySelector('.logo');
        
        logo.addEventListener('click', () => {
            logoClicks++;
            if (logoClicks === 5) {
                this.activateSecretMode();
                logoClicks = 0;
            }
            
            setTimeout(() => {
                logoClicks = 0;
            }, 2000);
        });
    }

    activateEasterEgg() {
        document.body.style.animation = 'rainbow-bg 3s infinite';
        
        const message = document.createElement('div');
        message.innerHTML = '🎉 KONAMI CODE ACTIVATED! 🎉';
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.fontSize = '3rem';
        message.style.fontWeight = 'bold';
        message.style.color = '#ff6b6b';
        message.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        message.style.zIndex = '10000';
        message.style.animation = 'bounce-gentle 1s infinite';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
            document.body.style.animation = '';
        }, 3000);
    }

    activateSecretMode() {
        const allEmojis = document.querySelectorAll('*');
        allEmojis.forEach(element => {
            if (element.textContent.includes('🥗')) {
                element.textContent = element.textContent.replace(/🥗/g, '🍕');
            }
            if (element.textContent.includes('🍎')) {
                element.textContent = element.textContent.replace(/🍎/g, '🍩');
            }
        });
        
        setTimeout(() => {
            location.reload();
        }, 5000);
    }
}

// CSS Animations (added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes rainbow-bg {
        0% { background: #ff6b6b; }
        16% { background: #4ecdc4; }
        32% { background: #45b7d1; }
        48% { background: #96ceb4; }
        64% { background: #ffeaa7; }
        80% { background: #dda0dd; }
        100% { background: #ff6b6b; }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: slide-in-up 0.6s ease-out forwards;
    }
    
    .play-demo-btn {
        background: linear-gradient(135deg, #0ea5e9, #0284c7);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1rem;
    }
    
    .play-demo-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
    }
`;
document.head.appendChild(style);

// Initialize the landing page
const landingPage = new LandingPageController();

// Add some performance monitoring
window.addEventListener('load', () => {
    console.log('🚀 Nutri Baba Landing Page loaded successfully!');
    console.log('✨ All animations and interactions are ready!');
    
    // Performance logging
    if (performance.getEntriesByType) {
        const loadTime = performance.getEntriesByType('navigation')[0].loadEventEnd;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    }
});

// Export for potential external use
window.NutriBabaLanding = landingPage;
