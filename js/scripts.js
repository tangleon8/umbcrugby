// script.js
// Enhanced UMBC Rugby JavaScript with Advanced Animations
// =====================================================

// Global Animation Controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.rafId = null;
    }

    register(name, animation) {
        this.animations.set(name, animation);
    }

    start() {
        const animate = (timestamp) => {
            this.animations.forEach(animation => {
                if (animation.active !== false) {
                    // Some animations expect no args, some expect timestamp
                    if (animation.update.length === 0) animation.update();
                    else animation.update(timestamp);
                }
            });
            this.rafId = requestAnimationFrame(animate);
        };
        this.rafId = requestAnimationFrame(animate);
    }

    stop() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }
}

const animationController = new AnimationController();

// Smooth Scroll with Parallax Effects
class ParallaxScroll {
    constructor() {
        this.elements = [];
        this.active = true;
        this.lastScrollY = 0;
        this.ticking = false;
    }

    addElement(element, options = {}) {
        this.elements.push({
            element,
            speed: options.speed || 0.5,
            offset: options.offset || 0,
            transform: options.transform || 'translateY'
        });
    }

    update() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateElements();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateElements() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;

        this.elements.forEach(({ element, speed, offset, transform }) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;
            const elementBottom = elementTop + elementHeight;

            if (elementBottom >= scrollY && elementTop <= scrollY + windowHeight) {
                const yPos = -(scrollY - elementTop + offset) * speed;

                if (transform === 'translateY') {
                    element.style.transform = `translateY(${yPos}px)`;
                } else if (transform === 'scale') {
                    const scale = 1 + (yPos * 0.001);
                    element.style.transform = `scale(${scale})`;
                } else if (transform === 'rotate') {
                    element.style.transform = `rotate(${yPos * 0.1}deg)`;
                }
            }
        });

        this.lastScrollY = scrollY;
    }
}


// Enhanced Carousel with 3D Effects
class EnhancedCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.prevBtn = container.querySelector('.carousel-btn.prev');
        this.nextBtn = container.querySelector('.carousel-btn.next');
        this.indicators = container.querySelectorAll('.indicator');
        this.modal = document.querySelector('.modal');
        this.modalImg = document.querySelector('.modal-content');
        this.closeModal = document.querySelector('.close-modal');

        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoPlay();
        this.add3DEffects();
    }

    add3DEffects() {
        this.slides.forEach((slide, index) => {
            slide.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            if (index !== this.currentIndex) {
                slide.style.transform = 'scale(0.9) rotateY(25deg)';
                slide.style.opacity = '0.5';
            }
        });
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.navigate('prev'));
        this.nextBtn.addEventListener('click', () => this.navigate('next'));

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        this.slides.forEach((slide) => {
            slide.addEventListener('click', () => this.openModal(slide));
        });

        this.closeModal.addEventListener('click', () => this.closeModalHandler());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModalHandler();
        });

        // Touch support
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.track.addEventListener('touchend', () => this.handleTouchEnd());

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    navigate(direction) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        const previousIndex = this.currentIndex;

        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        }

        this.animateTransition(previousIndex);
        this.resetAutoPlay();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;

        this.isAnimating = true;
        const previousIndex = this.currentIndex;
        this.currentIndex = index;

        this.animateTransition(previousIndex);
        this.resetAutoPlay();
    }

    animateTransition(previousIndex) {
        // 3D transition effect
        this.slides[previousIndex].style.transform = 'scale(0.9) rotateY(-25deg)';
        this.slides[previousIndex].style.opacity = '0.5';

        this.slides[this.currentIndex].style.transform = 'scale(1) rotateY(0deg)';
        this.slides[this.currentIndex].style.opacity = '1';

        // Update track position
        const slideWidth = this.slides[0].getBoundingClientRect().width;
        this.track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;

        // Update indicators with animation
        this.indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
            if (index === this.currentIndex) {
                dot.style.animation = 'indicatorPulse 0.6s ease';
            }
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.pauseAutoPlay();
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
        const diff = this.touchStartX - this.touchEndX;

        // Add swipe preview effect
        if (Math.abs(diff) > 10) {
            const slideWidth = this.slides[0].getBoundingClientRect().width;
            const currentTransform = -this.currentIndex * slideWidth;
            this.track.style.transform = `translateX(${currentTransform - diff * 0.3}px)`;
        }
    }

    handleTouchEnd() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) this.navigate('next');
            else this.navigate('prev');
        } else {
            // Snap back if swipe wasn't strong enough
            const slideWidth = this.slides[0].getBoundingClientRect().width;
            this.track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
        }

        this.startAutoPlay();
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                if (e.key === 'Escape') this.closeModalHandler();
                return;
            }
            if (e.key === 'ArrowLeft') this.navigate('prev');
            if (e.key === 'ArrowRight') this.navigate('next');
        });
    }

    openModal(slide) {
        this.modal.style.display = 'flex';
        this.modalImg.src = slide.src;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
            this.modalImg.style.animation = 'modalZoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    }

    closeModalHandler() {
        this.modal.classList.remove('show');
        this.modalImg.style.animation = 'modalZoomOut 0.3s ease';
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.navigate('next'), 5000);
    }

    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}

// Advanced Navigation with Hide/Show and Progress Bar
class AdvancedNavigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScrollY = 0;
        this.scrollThreshold = 100;
        this.hideThreshold = 500;
        this.createProgressBar();
        this.init();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        this.navbar.appendChild(progressBar);
        this.progressFill = progressBar.querySelector('.scroll-progress-fill');

        const style = document.createElement('style');
        style.textContent = `
            .scroll-progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                overflow: hidden;
            }
            .scroll-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--umbc-gold), #ffd85c);
                width: 0;
                transition: width 0.3s ease;
                box-shadow: 0 0 10px rgba(255, 184, 28, 0.5);
            }
        `;
        document.head.appendChild(style);
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.navbar.style.transition =
            'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), ' +
            'box-shadow 0.3s ease, background 0.3s ease';
    }

    handleScroll() {
        const currentScrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (currentScrollY / docHeight) * 100;
        this.progressFill.style.width = `${scrollProgress}%`;

        if (currentScrollY > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        if (currentScrollY > this.lastScrollY && currentScrollY > this.hideThreshold) {
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            this.navbar.style.transform = 'translateY(0)';
        }

        this.lastScrollY = currentScrollY;
    }
}

// Animated Counter for Statistics
class AnimatedCounter {
    constructor(element, target, options = {}) {
        this.element = element;
        this.target = target;
        this.duration = options.duration || 2000;
        this.start = options.start || 0;
        this.prefix = options.prefix || '';
        this.suffix = options.suffix || '';
        this.decimals = options.decimals || 0;
        this.startTimestamp = null;
        this.started = false;
    }

    animate(timestamp) {
        if (!this.startTimestamp) this.startTimestamp = timestamp;
        const progress = Math.min((timestamp - this.startTimestamp) / this.duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * (this.target - this.start) + this.start);
        this.element.textContent = this.prefix + current.toFixed(this.decimals) + this.suffix;
        if (progress < 1) {
            requestAnimationFrame(ts => this.animate(ts));
        } else {
            this.element.textContent = this.prefix + this.target.toFixed(this.decimals) + this.suffix;
        }
    }

    startCounting() {
        if (!this.started) {
            this.started = true;
            requestAnimationFrame(ts => this.animate(ts));
        }
    }
}

// Enhanced Schedule Popup with Animations
class SchedulePopup {
    constructor() {
        this.popup = document.getElementById('schedule-popup');
        this.overlay = document.getElementById('schedule-popup-overlay');
        this.closeBtn = document.getElementById('schedule-popup-close');
        this.downloadBtn = document.getElementById('download-ics-btn');
        this.init();
    }

    init() {
        const shown = localStorage.getItem('spring2025popupShown');
        if (!shown) setTimeout(() => this.show(), 2000);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.hide());
        this.overlay.addEventListener('click', () => this.hide());
        this.downloadBtn.addEventListener('click', () => { this.generateICS(); this.hide(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isVisible()) this.hide();
        });
    }

    show() {
        this.overlay.style.display = 'block';
        this.popup.style.display = 'block';
        requestAnimationFrame(() => {
            this.overlay.classList.add('show');
            this.popup.classList.add('show');
            const elems = this.popup.querySelectorAll('h2, img, p, button');
            elems.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.5s ease';
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100 * (i + 1));
            });
        });
        localStorage.setItem('spring2025popupShown', 'true');
    }

    hide() {
        this.overlay.classList.remove('show');
        this.popup.classList.remove('show');
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.popup.style.display = 'none';
        }, 300);
    }

    isVisible() {
        return this.overlay.style.display === 'block';
    }

    generateICS() {
        const events = [
            { date: '20250301', summary: 'Frostbite 7s (CRC Qualifiers)', location: 'TBD' },
            { date: '20250308', summary: 'UMBC vs Rutgers University', location: 'Home Field' },
            { date: '20250322', summary: 'UMBC vs American University', location: 'Away' },
            { date: '20250329', summary: 'Bucknell 7s (CRC Qualifiers)', location: 'Bucknell' },
            { date: '20250405', summary: 'UMBC vs Virginia Commonwealth', location: 'Home Field' },
            { date: '20250412', summary: 'UMBC vs George Washington', location: 'Away' },
            { date: '20250426', summary: 'UMBC vs William & Mary', location: 'Home Field' },
            { date: '20250503', summary: 'Alumni Game', location: 'Walker Avenue Field' }
        ];

        let ics = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//UMBC Rugby//Spring 2025//EN
X-WR-CALNAME:UMBC Rugby Spring 2025
X-WR-TIMEZONE:America/New_York
`;
        events.forEach(ev => {
            ics += this.createVEVENT(ev.date, ev.summary, ev.location);
        });
        ics += 'END:VCALENDAR';

        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'UMBC-Rugby-Spring-2025.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    createVEVENT(date, summary, location) {
        const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const uid = `${date}-${Math.random().toString(36).substr(2)}@umbcrugby.com`;
        return `BEGIN:VEVENT
DTSTAMP:${dtstamp}
UID:${uid}
DTSTART;VALUE=DATE:${date}
DTEND;VALUE=DATE:${this.incrementDate(date)}
SUMMARY:${summary}
LOCATION:${location}
DESCRIPTION:UMBC Rugby Spring 2025 Season
END:VEVENT
`;
    }

    incrementDate(ds) {
        const y = +ds.slice(0, 4), m = +ds.slice(4, 6) - 1, d = +ds.slice(6);
        const dt = new Date(y, m, d);
        dt.setDate(dt.getDate() + 1);
        const ny = dt.getFullYear();
        const nm = String(dt.getMonth() + 1).padStart(2, '0');
        const nd = String(dt.getDate()).padStart(2, '0');
        return `${ny}${nm}${nd}`;
    }
}

// Scrolling Player Animation
class ScrollingPlayer {
    constructor() {
        this.player = document.querySelector('.player-image');
        this.section = document.getElementById('scrolling-player-section');
        if (this.player && this.section) this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.animate());
        this.animate();
    }

    animate() {
        const scrollY = window.pageYOffset;
        const top = this.section.offsetTop;
        const height = this.section.offsetHeight;
        const winH = window.innerHeight;
        if (scrollY + winH >= top && scrollY <= top + height) {
            const prog = (scrollY + winH - top) / (winH + height);
            const tx = prog * window.innerWidth * 1.5;
            const ty = Math.sin(prog * Math.PI) * 50;
            const rot = prog * 720;
            const sc = 0.8 + prog * 0.4;
            this.player.style.transform =
                `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${sc})`;
            this.player.style.opacity = Math.min(1, prog * 2);
            if (prog > 0.3 && prog < 0.7) {
                this.player.style.filter = `blur(${(prog - 0.3) * 5}px)`;
            } else {
                this.player.style.filter = 'blur(0)';
            }
        }
    }
}


// Mobile Navigation Toggle
class MobileNavigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.init();
    }

    init() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => {
                this.navbar.classList.toggle('mobile-open');
                this.mobileToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target) && !this.mobileToggle.contains(e.target)) {
                    this.navbar.classList.remove('mobile-open');
                    this.mobileToggle.classList.remove('active');
                }
            });
        }
    }
}

// UMBC Rugby Loading Screen
class UMBCLoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('umbc-loading-screen');
        this.progressBall = document.querySelector('.rugby-ball');
        this.progressPercentage = document.querySelector('.progress-percentage');
        this.loadingStatus = document.querySelector('.loading-status');
        this.currentProgress = 0;
        this.targetProgress = 0;
        
        this.statusMessages = [
            'Initializing...',
            'Loading rugby spirit...',
            'Preparing the pitch...',
            'Gathering the team...',
            'Building brotherhood...',
            'Ready for kickoff!'
        ];
        
        this.init();
    }
    
    init() {
        // Only show loading screen on first visit or page refresh
        const hasSeenLoading = sessionStorage.getItem('umbcLoadingShown');
        
        if (hasSeenLoading) {
            this.hideLoadingScreen();
            return;
        }
        
        // Mark as shown for this session
        sessionStorage.setItem('umbcLoadingShown', 'true');
        
        // Prevent scrolling during loading
        document.body.classList.add('loading');
        
        // Start loading sequence
        this.startLoadingSequence();
    }
    
    startLoadingSequence() {
        const loadingPhases = [
            { progress: 20, duration: 600, status: 1 },
            { progress: 45, duration: 800, status: 2 },
            { progress: 70, duration: 700, status: 3 },
            { progress: 85, duration: 500, status: 4 },
            { progress: 100, duration: 600, status: 5 }
        ];
        
        let currentPhase = 0;
        
        const executePhase = () => {
            if (currentPhase < loadingPhases.length) {
                const phase = loadingPhases[currentPhase];
                this.animateToProgress(phase.progress, phase.status);
                
                setTimeout(() => {
                    currentPhase++;
                    executePhase();
                }, phase.duration);
            } else {
                // Loading complete
                setTimeout(() => this.hideLoadingScreen(), 800);
            }
        };
        
        executePhase();
    }
    
    animateToProgress(targetProgress, statusIndex) {
        this.targetProgress = targetProgress;
        
        // Update status message
        if (statusIndex < this.statusMessages.length) {
            this.loadingStatus.textContent = this.statusMessages[statusIndex];
        }
        
        // Animate progress
        const animateProgress = () => {
            const diff = this.targetProgress - this.currentProgress;
            if (Math.abs(diff) > 0.5) {
                this.currentProgress += diff * 0.1;
                this.updateVisuals();
                requestAnimationFrame(animateProgress);
            } else {
                this.currentProgress = this.targetProgress;
                this.updateVisuals();
            }
        };
        
        animateProgress();
    }
    
    updateVisuals() {
        // Update percentage
        this.progressPercentage.textContent = Math.round(this.currentProgress) + '%';
        
        // Move rugby ball across field (adjusted for field container width)
        const fieldContainer = document.querySelector('.rugby-field-progress');
        const ballPosition = (this.currentProgress / 100) * (fieldContainer.offsetWidth - 60) + 20;
        this.progressBall.style.left = ballPosition + 'px';
    }
    
    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1000);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen first
    new UMBCLoadingScreen();
    
    // Initialize mobile navigation
    new MobileNavigation();
    
    animationController.start();

    new AdvancedNavigation();
    new SchedulePopup();
    new ScrollingPlayer();

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) new EnhancedCarousel(carouselContainer);

    const parallax = new ParallaxScroll();
    animationController.register('parallax', parallax);
    document.querySelectorAll('section').forEach((sec, i) => {
        parallax.addElement(sec, { speed: 0.1 + i * 0.05, transform: 'translateY' });
    });

    const counters = document.querySelectorAll('[data-counter]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const c = new AnimatedCounter(
                    entry.target,
                    +entry.target.getAttribute('data-counter'),
                    {
                        duration: 2500,
                        prefix: entry.target.getAttribute('data-prefix') || '',
                        suffix: entry.target.getAttribute('data-suffix') || ''
                    }
                );
                c.startCounting();
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const tgt = document.querySelector(this.getAttribute('href'));
            if (tgt) {
                const off = tgt.offsetTop - 100;
                window.scrollTo({ top: off, behavior: 'smooth' });
                tgt.style.animation = 'highlightSection 1s ease';
                setTimeout(() => tgt.style.animation = '', 1000);
            }
        });
    });

    const animStyle = document.createElement('style');
    animStyle.textContent = `
        @keyframes indicatorPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        @keyframes modalZoomIn {
            from { opacity: 0; transform: scale(0.5); }
            to   { opacity: 1; transform: scale(1); }
        }
        @keyframes modalZoomOut {
            from { opacity: 1; transform: scale(1); }
            to   { opacity: 0; transform: scale(0.5); }
        }
        @keyframes highlightSection {
            0%   { background-color: rgba(255, 184, 28, 0); }
            50%  { background-color: rgba(255, 184, 28, 0.4); }
            100% { background-color: rgba(255, 184, 28, 0); }
        }
    `;
    document.head.appendChild(animStyle);
});
