/**
 * Landing Page JavaScript
 * Handles mobile navigation, scroll animations, form submission, and smooth interactions
 */

(function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const contactForm = document.getElementById('contactForm');
    const hero = document.getElementById('hero');

    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    function initMobileNav() {
        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    function initNavbarScroll() {
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavbar() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 50) {
                navbar.style.boxShadow = 'var(--shadow-md)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }

            // Hide/show navbar on scroll (optional)
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===================================
    // Scroll Reveal Animations
    // ===================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.feature-card, .testimonial-card, .about-text, .about-visual, .section-header, .hero-content, .hero-visual'
        );

        // Add reveal class to elements
        revealElements.forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${index * 100}ms`;
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // ===================================
    // Form Handling
    // ===================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Basic validation
            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();

            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Simulate form submission (replace with actual endpoint)
                await simulateFormSubmit({ name, email, message });

                showFormMessage('Thanks for reaching out! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                showFormMessage('Something went wrong. Please try again later.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });

        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
        }

        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid && value);

        return isValid;
    }

    function showFormMessage(message, type) {
        // Remove existing message
        const existing = contactForm.querySelector('.form-message');
        if (existing) existing.remove();

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', 'alert');
        messageEl.style.cssText = `
            padding: var(--space-3) var(--space-4);
            margin-top: var(--space-4);
            border-radius: var(--radius-lg);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            ${type === 'success'
                ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;'
                : 'background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;'
            }
        `;

        contactForm.appendChild(messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.opacity = '0';
                messageEl.style.transform = 'translateY(-10px)';
                messageEl.style.transition = 'opacity 0.3s, transform 0.3s';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, 5000);
    }

    // Simulate form submission
    function simulateFormSubmit(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1000);
        });
    }

    // ===================================
    // Active Navigation Highlight
    // ===================================
    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // ===================================
    // Parallax Effect for Hero
    // ===================================
    function initHeroParallax() {
        if (!hero) return;

        const floatingCards = hero.querySelectorAll('.floating-card');
        if (!floatingCards.length) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY < heroHeight) {
                const progress = scrollY / heroHeight;
                floatingCards.forEach((card, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const y = progress * 50 * speed;
                    card.style.transform = `translateY(${y}px)`;
                });
            }

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        // Only enable parallax on larger screens and if user prefers motion
        const mediaQuery = window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)');
        if (mediaQuery.matches) {
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                window.addEventListener('scroll', onScroll, { passive: true });
            } else {
                window.removeEventListener('scroll', onScroll);
                floatingCards.forEach(card => {
                    card.style.transform = '';
                });
            }
        });
    }

    // ===================================
    // Keyboard Navigation Enhancement
    // ===================================
    function initKeyboardNav() {
        // Trap focus in mobile menu when open
        const focusableElements = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && navLinks.classList.contains('active')) {
                const focusable = navLinks.querySelectorAll(focusableElements);
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    // ===================================
    // Performance: Lazy Load Images
    // ===================================
    function initLazyLoad() {
        if (!('IntersectionObserver' in window)) return;

        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // Initialize All
    // ===================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initMobileNav();
        initNavbarScroll();
        initSmoothScroll();
        initScrollReveal();
        initContactForm();
        initActiveNavHighlight();
        initHeroParallax();
        initKeyboardNav();
        initLazyLoad();

        // Add loaded class to body for any CSS transitions
        document.body.classList.add('loaded');
    }

    // Start initialization
    init();

})();