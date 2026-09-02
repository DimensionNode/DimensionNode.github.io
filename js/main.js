/**
 * DimensionNode — Dark & Serene Art Gallery Interactions
 * - Interactive Ambient Studio Spotlight (Smooth cursor follower)
 * - Mobile Navigation Menu Toggle
 * - Smooth Anchor Scrolling
 * - Museum Catalogue Fade-in Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    initStudioSpotlight();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initEmailCopy();
});

/* ========================================
   Studio Ambient Spotlight (Mouse Follower)
   ======================================== */
function initStudioSpotlight() {
    const spotlight = document.getElementById('spotlight');
    if (!spotlight) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;
    let isMoving = false;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(updateSpotlightPosition);
        }
    });

    // Smooth Lerp animation loop
    function updateSpotlightPosition() {
        const ease = 0.08; // Smooth inertia
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        spotlight.style.setProperty('--mouse-x', `${currentX}px`);
        spotlight.style.setProperty('--mouse-y', `${currentY}px`);

        const diff = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
        if (diff > 0.5) {
            requestAnimationFrame(updateSpotlightPosition);
        } else {
            isMoving = false;
        }
    }

    // Set initial position
    spotlight.style.setProperty('--mouse-x', `${currentX}px`);
    spotlight.style.setProperty('--mouse-y', `${currentY}px`);
}

/* ========================================
   Mobile Navigation Menu
   ======================================== */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.toggle('active');
        menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', String(isActive));
    });

    // Close when a link is clicked
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ========================================
   Smooth Anchor Scrolling
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ========================================
   Museum Catalogue Fade-in Reveal
   ======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (elements.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    elements.forEach(el => observer.observe(el));
}

/* ========================================
   Email Clipboard Copy Interaction
   ======================================== */
function initEmailCopy() {
    const copyBtn = document.getElementById('email-copy-btn');
    const copyHint = document.getElementById('copy-hint');
    if (!copyBtn) return;

    let resetTimeout;
    copyBtn.addEventListener('click', async () => {
        const email = copyBtn.getAttribute('data-email') || 'dimensionnode@gmail.com';
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = email;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            // Visual copied feedback
            copyBtn.classList.add('copied');
            if (copyHint) copyHint.textContent = 'Copied to clipboard!';

            clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
                copyBtn.classList.remove('copied');
                if (copyHint) copyHint.textContent = 'Click to copy';
            }, 2500);
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    });
}
