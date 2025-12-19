// Performance utilities
const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
const caf = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

// Snow Particle System
class SnowCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.isDestroyed = false;
        
        try {
            this.resize();
            this.init();
            this.setupEventListeners();
            this.animate();
        } catch (error) {
            console.warn('SnowCanvas initialization failed:', error);
        }
    }

    setupEventListeners() {
        const resizeHandler = this.debounce(() => this.resize(), 250);
        window.addEventListener('resize', resizeHandler);
        
        // Store cleanup function
        this.cleanup = () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }

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

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = Math.floor(window.innerWidth / 15);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                r: Math.random() * 1.5 + 0.5,
                d: Math.random() * particleCount,
                speed: Math.random() * 0.5 + 0.2,
                drift: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(127, 183, 255, ${p.opacity})`;
            this.ctx.fill();
        }
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.y += p.speed;
            p.x += p.drift;
            
            if (p.y > this.canvas.height) {
                p.y = -10;
                p.x = Math.random() * this.canvas.width;
            }
        }
    }

    animate() {
        if (this.isDestroyed) return;
        
        this.draw();
        this.update();
        this.animationId = raf(() => this.animate());
    }

    destroy() {
        this.isDestroyed = true;
        if (this.animationId) {
            caf(this.animationId);
        }
        if (this.cleanup) {
            this.cleanup();
        }
    }
}

// Intersection Observer for scroll animations
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        try {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
            this.observeElements();
        } catch (error) {
            console.warn('IntersectionObserver not supported:', error);
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                this.handleRingAnimation(entry.target);
            }
        });
    }

    handleRingAnimation(target) {
        const ring = target.querySelector('.progress-ring');
        if (!ring) return;
        
        const text = target.querySelector('.ring-text');
        const desc = target.querySelector('.ring-desc');
        
        const timers = [];
        
        timers.push(setTimeout(() => ring.classList.add('active'), 300));
        timers.push(setTimeout(() => text.classList.add('visible'), 1500));
        
        if (desc) {
            timers.push(setTimeout(() => desc.classList.add('visible'), 1800));
        }
        
        // Store timers for potential cleanup
        target._animationTimers = timers;
    }

    observeElements() {
        const elements = [
            '.timeline-item',
            'blockquote',
            '.card',
            '.step',
            '.perspective-item',
            '.compare-card'
        ];
        
        elements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                this.observer.observe(el);
            });
        });

        // Observe circle container separately
        const circleContainer = document.querySelector('.circle-container');
        if (circleContainer) {
            this.observer.observe(circleContainer);
        }
    }
}

// Smooth scroll for better UX
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Parallax effect for hero
class HeroParallax {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.heroContent = document.querySelector('.hero-content');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (this.hero && this.heroContent) {
            window.addEventListener('scroll', this.handleScroll.bind(this));
        }
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const heroHeight = this.hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const progress = scrolled / heroHeight;
            this.heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            this.heroContent.style.opacity = 1 - (progress * 1.2);
            
            if (this.scrollIndicator) {
                this.scrollIndicator.style.opacity = Math.max(0, 1 - progress * 3);
            }
        }
    }
}

// Card interaction enhancement
class CardInteraction {
    constructor() {
        this.cards = document.querySelectorAll('.card');
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleEnter.bind(this));
            card.addEventListener('mouseleave', this.handleLeave.bind(this));
        });
    }

    handleEnter(e) {
        const card = e.currentTarget;
        card.style.borderColor = 'var(--accent-gold)';
        card.style.boxShadow = '0 10px 40px rgba(207, 169, 107, 0.2)';
    }

    handleLeave(e) {
        const card = e.currentTarget;
        card.style.borderColor = 'var(--border)';
        card.style.boxShadow = 'none';
    }
}

// Perspective item stagger animation
class PerspectiveStagger {
    constructor() {
        this.items = document.querySelectorAll('.perspective-item');
        if (this.items.length === 0) return;

        try {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 100);
                    }
                });
            }, { threshold: 0.1 });

            this.items.forEach(item => this.observer.observe(item));
        } catch (error) {
            console.warn('PerspectiveStagger failed:', error);
            // Fallback: make all items visible immediately
            this.items.forEach(item => item.classList.add('visible'));
        }
    }
}

// Quote hover effect
class QuoteHover {
    constructor() {
        const quotes = document.querySelectorAll('blockquote');
        quotes.forEach(quote => {
            quote.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.borderColor = 'var(--accent-cold)';
            });
            quote.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
                this.style.borderColor = 'var(--accent-gold)';
            });
        });
    }
}

// Step animation for action section
class StepAnimation {
    constructor() {
        this.steps = document.querySelectorAll('.step');
        if (this.steps.length === 0) return;

        try {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 150);
                    }
                });
            }, { threshold: 0.15 });

            this.steps.forEach(step => this.observer.observe(step));
        } catch (error) {
            console.warn('StepAnimation failed:', error);
            // Fallback: make all steps visible immediately
            this.steps.forEach(step => step.classList.add('visible'));
        }
    }
}

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.checkPerformance();
    }

    checkPerformance() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduced-motion');
        }

        // Initialize performance observer if available
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'layout-shift') {
                            if (!entry.hadRecentInput) {
                                this.metrics.cumulativeLayoutShift = 
                                    (this.metrics.cumulativeLayoutShift || 0) + entry.value;
                            }
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('PerformanceObserver not supported');
            }
        }
    }
}

// Loading management
class LoadingManager {
    constructor() {
        this.loadedElements = new Set();
        this.checkAllLoaded();
    }

    markAsLoaded(element) {
        if (element) {
            element.classList.add('loaded');
            this.loadedElements.add(element);
            this.checkAllLoaded();
        }
    }

    checkAllLoaded() {
        const criticalElements = document.querySelectorAll('.hero-content, .module');
        const allLoaded = Array.from(criticalElements).every(el => 
            el.classList.contains('loaded') || this.loadedElements.has(el)
        );
        
        if (allLoaded) {
            document.body.classList.add('page-loaded');
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize loading management
        const loadingManager = new LoadingManager();
        
        // Mark initial elements as loaded
        setTimeout(() => {
            loadingManager.markAsLoaded(document.querySelector('.hero-content'));
            document.querySelectorAll('.module').forEach(module => {
                loadingManager.markAsLoaded(module);
            });
        }, 100);
        
        // Performance monitoring first
        new PerformanceMonitor();
        
        // Initialize all components
        const components = [
            () => new SnowCanvas('snowCanvas'),
            () => new ScrollAnimator(),
            () => new SmoothScroll(),
            () => new HeroParallax(),
            () => new CardInteraction(),
            () => new PerspectiveStagger(),
            () => new QuoteHover(),
            () => new StepAnimation()
        ];

        // Initialize components with error handling
        components.forEach(init => {
            try {
                init();
            } catch (error) {
                console.warn('Component initialization failed:', error);
            }
        });

        // Add global error handler
        window.addEventListener('error', (e) => {
            console.warn('Global error caught:', e.error);
        });

        // Keyboard navigation enhancement
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

    } catch (error) {
        console.warn('App initialization failed:', error);
        // Fallback: make content visible even if JS fails
        document.body.classList.add('page-loaded');
    }
});