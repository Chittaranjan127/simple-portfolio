/* ============================================================
   CHITTARANJAN DAS — PORTFOLIO JS
   Scroll reveals, navbar, cursor glow, stats counter, etc.
   ============================================================ */

(function () {
    'use strict';

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    /* ---------- SPLASH SCREEN ---------- */
    const splash = document.getElementById('splash');
    if (splash) {
        const statusText = document.getElementById('hudStatusText');
        const statusMessages = [
            'Initializing...',
            'Loading modules...',
            'Compiling assets...',
            'Connecting...',
            'Ready.'
        ];

        /* -- Matrix rain (instant) -- */
        const sCanvas = document.getElementById('splashMatrix');
        var splashRaf = null;
        if (sCanvas) {
            const sCtx = sCanvas.getContext('2d');
            const fs = 15;
            const chars = '01{}[]<>$#@=+-*&|~ABCDEFabcdef'.split('');
            sCanvas.width = window.innerWidth;
            sCanvas.height = window.innerHeight;
            const cols = Math.floor(sCanvas.width / fs);
            const drops = Array.from({ length: cols }, () => Math.random() * (sCanvas.height / fs));

            function drawMatrix() {
                sCtx.fillStyle = 'rgba(3, 3, 8, 0.1)';
                sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
                sCtx.font = fs + 'px monospace';
                for (let i = 0; i < drops.length; i++) {
                    const c = chars[Math.floor(Math.random() * chars.length)];
                    const b = Math.random();
                    sCtx.fillStyle = b > 0.85 ? '#4ade80' : b > 0.5 ? '#22c55e' : '#14532d';
                    sCtx.fillText(c, i * fs, drops[i] * fs);
                    if (drops[i] * fs > sCanvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i] += 0.6 + Math.random() * 0.3;
                }
                splashRaf = requestAnimationFrame(drawMatrix);
            }
            splashRaf = requestAnimationFrame(drawMatrix);
        }

        /* -- Cycle status messages -- */
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            msgIndex++;
            if (statusText && msgIndex < statusMessages.length) {
                statusText.textContent = statusMessages[msgIndex];
            }
        }, 450);

        /* -- Dismiss at 2.5s -- */
        setTimeout(() => {
            clearInterval(msgInterval);
            if (statusText) statusText.textContent = 'Ready.';

            // Blue flash
            const flash = document.createElement('div');
            flash.className = 'splash-flash';
            splash.appendChild(flash);

            // Stop matrix
            if (splashRaf) cancelAnimationFrame(splashRaf);

            setTimeout(() => {
                splash.classList.add('done');
                document.body.classList.remove('loading');
            }, 150);

            setTimeout(() => { splash.remove(); }, 800);
        }, 2500);
    }

    /* ---------- SCROLL REVEAL (Intersection Observer) ---------- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    /* ---------- NAVBAR SCROLL EFFECT ---------- */
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    /* ---------- MOBILE NAV TOGGLE ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---------- CUSTOM CURSOR (Terminal Block) ---------- */
    const block = document.querySelector('.cursor-block');

    if (block && window.matchMedia('(pointer: fine)').matches) {
        document.body.classList.add('custom-cursor');

        let mouseX = 0, mouseY = 0;
        let bx = 0, by = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function animateCursor() {
            bx += (mouseX - bx) * 0.18;
            by += (mouseY - by) * 0.18;
            block.style.left = bx + 'px';
            block.style.top = by + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverTargets = 'a, button, .btn, .project-card, .social-link, .contact-link-item, .skill-chip, .tlink, .nav-toggle, input, textarea';
        const textTargets = 'p, h1, h2, h3, h4, h5, h6, span, li, .about-paragraph, .timeline-description, .testimonial-text';

        document.addEventListener('mouseover', (e) => {
            const el = e.target;
            if (el.closest(hoverTargets)) {
                block.classList.add('hovering');
                block.classList.remove('text-hover');
            } else if (el.closest(textTargets) && !el.closest(hoverTargets)) {
                block.classList.add('text-hover');
                block.classList.remove('hovering');
            }
        }, { passive: true });

        document.addEventListener('mouseout', (e) => {
            const el = e.target;
            if (el.closest(hoverTargets) || el.closest(textTargets)) {
                block.classList.remove('hovering', 'text-hover');
            }
        }, { passive: true });

        document.addEventListener('mousedown', () => block.classList.add('clicking'));
        document.addEventListener('mouseup', () => block.classList.remove('clicking'));
    }

    /* ---------- MATRIX RAIN CANVAS ---------- */
    const canvas = document.getElementById('matrixRain');
    if (canvas && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const ctx = canvas.getContext('2d');
        let w, h, columns, drops;

        const chars = '01{}[]()<>/:;$#@!?=+-*&|~^_.ABCDEFabcdef'.split('');
        const fontSize = 14;

        function initMatrix() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
            columns = Math.floor(w / fontSize);
            drops = Array.from({ length: columns }, () => Math.random() * -100);
        }

        initMatrix();

        function drawMatrix() {
            ctx.fillStyle = 'rgba(6, 6, 11, 0.15)';
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = '#22c55e';
            ctx.font = fontSize + 'px JetBrains Mono, monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > h && Math.random() > 0.985) {
                    drops[i] = 0;
                }
                drops[i] += 0.4 + Math.random() * 0.2;
            }
        }

        let matrixInterval = setInterval(drawMatrix, 60);

        window.addEventListener('resize', () => {
            clearInterval(matrixInterval);
            initMatrix();
            matrixInterval = setInterval(drawMatrix, 60);
        });
    }

    /* ---------- BACK TO TOP BUTTON ---------- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
    }

    /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---------- ACTIVE NAV LINK HIGHLIGHTING ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinksAll.forEach((link) => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));


})();
