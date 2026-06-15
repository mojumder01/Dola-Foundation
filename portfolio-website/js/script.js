// ═══════════════════════════════════════════
// PORTFOLIO JAVASCRIPT
// CHANGE: Search for "CHANGE:" comments to find
// all the things you need to customize.
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────
  // 1. PRELOADER
  // ─────────────────────────────────────────
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('done');
    }, 1200);
  });

  // ─────────────────────────────────────────
  // 2. THEME TOGGLE — dark ↔ light
  // Saved to localStorage so it persists on refresh
  // ─────────────────────────────────────────
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
    resizeParticles();
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    themeIcon.textContent  = theme === 'dark' ? '🌙' : '☀️';
    themeLabel.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }

  // ─────────────────────────────────────────
  // 3. COLOR SCHEME SWITCHER
  // Saves chosen color to localStorage
  // ─────────────────────────────────────────
  const switcherHandle = document.getElementById('switcherHandle');
  const colorSwitcher  = document.getElementById('colorSwitcher');
  const colorDots      = document.querySelectorAll('.cdot');

  switcherHandle.addEventListener('click', () => {
    colorSwitcher.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!colorSwitcher.contains(e.target)) {
      colorSwitcher.classList.remove('open');
    }
  });

  // Load saved color scheme
  const savedColor = localStorage.getItem('portfolio-color') || 'purple';
  setColor(savedColor);

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      setColor(dot.dataset.color);
      resizeParticles();
    });
  });

  function setColor(color) {
    html.setAttribute('data-color', color);
    localStorage.setItem('portfolio-color', color);
    colorDots.forEach(d => d.classList.toggle('active', d.dataset.color === color));
  }

  // ─────────────────────────────────────────
  // 4. NAVBAR — shadow on scroll
  // ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backTop.classList.toggle('visible', window.scrollY > 400);
    updateActiveNav();
    triggerCounters();
  }, { passive: true });

  // ─────────────────────────────────────────
  // 5. HAMBURGER MOBILE MENU
  // ─────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // ─────────────────────────────────────────
  // 6. ACTIVE NAV LINK — updates based on scroll position
  // ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  // ─────────────────────────────────────────
  // 7. TYPING ANIMATION
  // CHANGE: Edit the roles array to change what gets typed
  // ─────────────────────────────────────────
  const typedEl = document.getElementById('typed');

  // CHANGE: Update these strings with your own skills/services
  const roles = [
    'beautiful websites',
    'Flutter mobile apps',
    'React applications',
    'clean UI/UX',
    'full-stack solutions',
    'your next project'
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let typingDelay = 120;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typedEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        typingDelay = 2000;
      } else {
        typingDelay = 100;
      }
    } else {
      typedEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 400;
      } else {
        typingDelay = 55;
      }
    }

    setTimeout(typeLoop, typingDelay);
  }

  setTimeout(typeLoop, 1400);

  // ─────────────────────────────────────────
  // 8. SCROLL REVEAL — fade in on scroll
  // ─────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const bar = entry.target.querySelector('.skill-bar');
        if (bar) {
          bar.style.width = getComputedStyle(bar).getPropertyValue('--w');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ─────────────────────────────────────────
  // 9. COUNT-UP ANIMATION for stats
  // Triggers once when the about section scrolls into view
  // ─────────────────────────────────────────
  const counters   = document.querySelectorAll('.count-up');
  let   countersRan = false;

  function triggerCounters() {
    if (countersRan) return;
    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        countersRan = true;
        runCounters();
      }
    });
  }

  function runCounters() {
    counters.forEach(counter => {
      const target   = parseInt(counter.dataset.target);
      const duration = 1800;
      const step     = target / (duration / 16);
      let   current  = 0;

      const tick = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current) + '+';
          requestAnimationFrame(tick);
        } else {
          counter.textContent = target + '+';
        }
      };

      tick();
    });
  }

  // ─────────────────────────────────────────
  // 10. EXPERIENCE TABS — Work / Education
  // ─────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.timeline').forEach(tl => {
        tl.classList.toggle('hidden', tl.id !== `tab-${target}`);
      });

      // Re-trigger reveal for newly shown items
      document.querySelectorAll(`#tab-${target} .reveal`).forEach(el => {
        el.classList.add('visible');
      });
    });
  });

  // ─────────────────────────────────────────
  // 11. PROJECT FILTER
  // ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ─────────────────────────────────────────
  // 12. TESTIMONIALS SLIDER
  // ─────────────────────────────────────────
  const track     = document.getElementById('testimonialsTrack');
  const dots      = document.querySelectorAll('.slider-dot');
  const prevBtn   = document.getElementById('sliderPrev');
  const nextBtn   = document.getElementById('sliderNext');
  let   current   = 0;
  const total     = dots.length;
  let   autoSlide = null;

  function goToSlide(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => { goToSlide(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goToSlide(current + 1); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(+dot.dataset.index); resetAuto(); });
  });

  function startAuto() {
    autoSlide = setInterval(() => goToSlide(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(autoSlide);
    startAuto();
  }

  startAuto();

  // ─────────────────────────────────────────
  // 13. CUSTOM CURSOR — desktop only
  // ─────────────────────────────────────────
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    const speed = 0.15;
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }

  animateRing();

  document.querySelectorAll('a, button, .skill-card, .project-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ─────────────────────────────────────────
  // 14. PARTICLE CANVAS — animated background
  // ─────────────────────────────────────────
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];

  function resizeParticles() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.5 + 0.5,
        dx:    (Math.random() - 0.5) * 0.4,
        dy:    (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function getParticleColor() {
    // Reads --particle CSS variable (set per color scheme)
    const raw = getComputedStyle(html).getPropertyValue('--particle').trim();
    return raw || '124, 77, 255';
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = html.getAttribute('data-theme') === 'dark';
    const rgb    = getParticleColor();
    const mult   = isDark ? 1 : 0.25;

    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.alpha * mult})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / 120) * 0.12 * mult})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(drawParticles);
  }

  resizeParticles();
  drawParticles();

  window.addEventListener('resize', resizeParticles, { passive: true });

  // ─────────────────────────────────────────
  // 15. BACK TO TOP BUTTON
  // ─────────────────────────────────────────
  const backTop = document.getElementById('backTop');

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─────────────────────────────────────────
  // 16. CONTACT FORM
  // CHANGE: Update email address below
  // ─────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || `Portfolio Contact from ${name}`;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    // CHANGE: Replace with your email address
    window.location.href = `mailto:hello@alexmorgan.dev?subject=${encodedSubject}&body=${encodedBody}`;

    contactForm.reset();
  });

  // ─────────────────────────────────────────
  // 17. SMOOTH SCROLL for all anchor links
  // ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

});
