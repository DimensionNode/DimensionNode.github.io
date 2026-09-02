/**
 * main.js — DimensionNode Site Interactions
 * - Particle background system (Canvas)
 * - Smooth scroll for navigation links
 * - Mobile hamburger menu toggle
 * - Scroll-based fade-in animations (Intersection Observer)
 * - Button ripple effect
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initRippleEffect();
});

/* ========================================
   Particle Background System
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    const PARTICLE_COUNT = 70;
    const CONNECTION_DISTANCE = 120;
    const PARTICLE_COLOR = { r: 0, g: 255, b: 255 }; // Neon cyan

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initParticleArray() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR.r}, ${PARTICLE_COLOR.g}, ${PARTICLE_COLOR.b}, ${p.opacity})`;
        ctx.fill();
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${PARTICLE_COLOR.r}, ${PARTICLE_COLOR.g}, ${PARTICLE_COLOR.b}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function updateParticle(p) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            updateParticle(p);
            drawParticle(p);
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    initParticleArray();
    animate();

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticleArray();
        }, 200);
    });
}

/* ========================================
   Mobile Hamburger Menu
   ======================================== */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.toggle('active');
        menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isActive);
    });

    // Close menu when a nav link is clicked
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ========================================
   Scroll-based Fade-in Animations
   ======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (elements.length === 0) return;

    // Fallback: if IntersectionObserver is not supported, show all
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
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    elements.forEach(el => observer.observe(el));
}

/* ========================================
   Button Ripple Effect
   ======================================== */
function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Remove existing ripples
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) existingRipple.remove();

            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            // Remove ripple after animation
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}
