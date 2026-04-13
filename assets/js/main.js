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

    /* ---------- SPLASH SCREEN (once per session) ---------- */
    const splash = document.getElementById('splash');
    const splashShown = sessionStorage.getItem('splashShown');

    if (splash && splashShown) {
        // Already shown this session — remove immediately
        splash.remove();
        document.body.classList.remove('loading');
    }

    if (splash && !splashShown) {
        sessionStorage.setItem('splashShown', '1');
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
            drops = Array.from({ length: columns }, () => Math.random() * (h / fontSize));
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

    /* ---------- GITHUB ACTIVITY ---------- */
    const GH_USER = 'Chittaranjan127';
    const ghHeatmap = document.getElementById('ghHeatmap');
    const ghMonths = document.getElementById('ghMonths');
    const ghReposList = document.getElementById('ghReposList');

    // Language colors
    const langColors = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Java: '#b07219',
        Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c',
        Dart: '#00B4AB', Shell: '#89e051', Kotlin: '#A97BFF',
        null: '#8b949e'
    };

    // Fetch user profile
    fetch('https://api.github.com/users/' + GH_USER)
        .then(r => r.json())
        .then(data => {
            const el = (id, val) => {
                const e = document.getElementById(id);
                if (e) e.textContent = val;
            };
            el('ghRepos', data.public_repos || 0);
            el('ghFollowers', data.followers || 0);
            el('ghFollowing', data.following || 0);
        })
        .catch(() => {});

    // Fetch events to build a contribution-like heatmap
    if (ghHeatmap) {
        // Build 52 weeks of cells (364 days)
        const today = new Date();
        const totalDays = 364;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - totalDays);
        // Align to Sunday
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const dayMap = {};
        const cells = [];

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            const key = d.toISOString().split('T')[0];
            dayMap[key] = 0;
            const cell = document.createElement('div');
            cell.className = 'gh-cell';
            cell.dataset.date = key;
            cell.title = key;
            ghHeatmap.appendChild(cell);
            cells.push(cell);
        }

        // Month labels
        if (ghMonths) {
            const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let lastMonth = -1;
            const weeks = Math.ceil(cells.length / 7);
            for (let w = 0; w < weeks; w++) {
                const idx = w * 7;
                if (idx < cells.length) {
                    const dt = new Date(cells[idx].dataset.date);
                    const m = dt.getMonth();
                    if (m !== lastMonth) {
                        const span = document.createElement('span');
                        span.textContent = monthNames[m];
                        span.style.minWidth = '14px';
                        ghMonths.appendChild(span);
                        lastMonth = m;
                    } else {
                        const span = document.createElement('span');
                        span.style.minWidth = '14px';
                        ghMonths.appendChild(span);
                    }
                }
            }
        }

        // Fetch recent events (public, up to 300)
        const eventPages = [1, 2, 3].map(p =>
            fetch('https://api.github.com/users/' + GH_USER + '/events/public?per_page=100&page=' + p)
                .then(r => r.json())
                .catch(() => [])
        );

        Promise.all(eventPages).then(pages => {
            const events = pages.flat();
            let totalContribs = 0;

            events.forEach(ev => {
                const date = ev.created_at ? ev.created_at.split('T')[0] : null;
                if (date && dayMap[date] !== undefined) {
                    dayMap[date]++;
                    totalContribs++;
                }
            });

            const el = document.getElementById('ghContribs');
            if (el) el.textContent = totalContribs;

            // Assign levels
            cells.forEach(cell => {
                const count = dayMap[cell.dataset.date] || 0;
                let level = 0;
                if (count >= 8) level = 4;
                else if (count >= 5) level = 3;
                else if (count >= 2) level = 2;
                else if (count >= 1) level = 1;
                cell.dataset.level = level;
                cell.title = cell.dataset.date + ': ' + count + ' contribution' + (count !== 1 ? 's' : '');
            });
        });
    }

    // Fetch recent repos
    if (ghReposList) {
        fetch('https://api.github.com/users/' + GH_USER + '/repos?sort=updated&per_page=4')
            .then(r => r.json())
            .then(repos => {
                ghReposList.innerHTML = repos.map(repo => {
                    const lang = repo.language || null;
                    const color = langColors[lang] || langColors[null];
                    const desc = repo.description || 'No description';
                    return '<a href="' + repo.html_url + '" target="_blank" rel="noopener" class="gh-repo">' +
                        '<span class="gh-repo-name">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>' +
                            repo.name +
                        '</span>' +
                        '<span class="gh-repo-desc">' + desc + '</span>' +
                        '<span class="gh-repo-meta">' +
                            (lang ? '<span><span class="gh-lang-dot" style="background:' + color + '"></span>' + lang + '</span>' : '') +
                            '<span>' +
                                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
                                repo.stargazers_count +
                            '</span>' +
                        '</span>' +
                    '</a>';
                }).join('');
            })
            .catch(() => {
                ghReposList.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;">Failed to load repos</p>';
            });
    }

})();
