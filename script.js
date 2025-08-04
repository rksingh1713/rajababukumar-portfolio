// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('header');
const scrollToTopBtn = document.getElementById('scrollToTop');
const themeToggle = document.getElementById('themeToggle');
const tagline = document.querySelector('.tagline');

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    
    // Prevent body scrolling when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Reset body overflow
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            // Smooth scroll with easing
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Add a visual feedback
            target.style.animation = 'none';
            setTimeout(() => {
                target.style.animation = 'fadeInUp 0.6s ease';
            }, 100);
        }
    });
});

// Scroll-to-top button functionality
function toggleScrollToTopButton() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Dark mode toggle functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Update button icon
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

themeToggle.addEventListener('click', toggleTheme);

// Header scroll effects
function handleScroll() {
    const scrollY = window.pageYOffset;
    
    // Header shadow effect
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Toggle scroll-to-top button
    toggleScrollToTopButton();

    // Update active navigation link
    updateActiveNavLink();

    // Subtle parallax effect for hero
    const parallax = document.querySelector('.hero');
    if (parallax && scrollY < window.innerHeight) {
        parallax.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const headerHeight = header.offsetHeight;
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Enhanced scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.skill-category, .project-card, .about-content > div').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Staggered animation for skill tags
function animateSkillTags() {
    document.querySelectorAll('.skill-category').forEach((category, categoryIndex) => {
        const tags = category.querySelectorAll('.skill-tag');
        tags.forEach((tag, tagIndex) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = `opacity 0.3s ease ${(tagIndex * 0.1)}s, transform 0.3s ease ${(tagIndex * 0.1)}s`;
            
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, categoryIndex * 200 + tagIndex * 100);
        });
    });
}

// Typing effect for hero tagline
function typeWriter() {
    if (!tagline) return;
    
    const taglineText = "Full Stack Developer | Problem Solver | Tech Enthusiast";
    tagline.textContent = '';
    let i = 0;
    
    function type() {
        if (i < taglineText.length) {
            tagline.textContent += taglineText.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    
    type();
}

// Keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        // Alt + T for theme toggle
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Home/End keys for quick navigation
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
}

// Performance optimized scroll handler
let ticking = false;
function optimizedScrollHandler() {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeScrollAnimations();
    initializeKeyboardNavigation();
    initializeDeviceFeatures();
    initializeLazyLoading();
    optimizeForMobile();
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
    
    // Animate skill tags
    setTimeout(animateSkillTags, 500);
});

// Event listeners
window.addEventListener('scroll', optimizedScrollHandler);
window.addEventListener('load', () => {
    // Ensure all animations work after page load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    // Debounce resize events for performance
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to larger screens
        if (window.innerWidth > 767) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Reset body overflow
        }
        
        // Reset any transform effects on window resize
        const parallax = document.querySelector('.hero');
        if (parallax && window.innerWidth <= 768) {
            parallax.style.transform = 'none';
        }
        
        // Recalculate scroll positions for active nav links
        updateActiveNavLink();
    }, 250);
});

// Prefers-color-scheme change detection
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }
    }
});

// Add smooth hover effects for interactive elements
document.querySelectorAll('.project-link, .email-link, .social-link').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = this.style.transform.replace('translateY(-2px)', '') + ' translateY(-2px)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = this.style.transform.replace(' translateY(-2px)', '');
    });
});

// Touch-friendly enhancements for mobile devices
function initializeTouchSupport() {
    // Add touch feedback for buttons
    const touchElements = document.querySelectorAll('.project-link, .email-link, .social-link, .skill-tag, .mobile-menu-toggle, .scroll-to-top, .theme-toggle');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '';
        });
        
        element.addEventListener('touchcancel', function() {
            this.style.opacity = '';
        });
    });
    
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Initialize device-specific features
function initializeDeviceFeatures() {
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        initializeTouchSupport();
        
        // Disable parallax on touch devices for better performance
        const parallax = document.querySelector('.hero');
        if (parallax) {
            parallax.style.transform = 'none';
        }
    }
    
    // Add class for small screens
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-device');
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Force a resize event to recalculate layout
            window.dispatchEvent(new Event('resize'));
            
            // Close mobile menu on orientation change
            if (navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }, 100);
    });
}

// Optimize scroll performance for mobile
function optimizeForMobile() {
    // Reduce scroll animations on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || window.devicePixelRatio <= 1;
    
    if (isLowEndDevice) {
        document.body.classList.add('reduced-motion');
        
        // Disable complex animations
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .reduced-motion * {
                transition-duration: 0.1s !important;
                animation-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// Lazy loading for performance
function initializeLazyLoading() {
    const lazyElements = document.querySelectorAll('.project-card, .skill-category');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}
