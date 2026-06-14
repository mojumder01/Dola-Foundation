// ═══════════════════════════════════════════
// PORTFOLIO JAVASCRIPT
// Muntasir Mamun — muntasir077@gmail.com
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────
  // 1. THEME TOGGLE — dark ↔ light
  // localStorage এ save করা থাকে, refresh করলেও মনে থাকে
  // ─────────────────────────────────────────
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');

  // আগে save করা theme load করো, নাহলে dark default
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
    // canvas is initialized by now, safe to re-render particles
    resizeParticles();
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    // resizeParticles() NOT called here — canvas hasn't been initialized yet on first load
  }

  // ─────────────────────────────────────────
  // 2. NAVBAR — scroll করলে shadow আসে
  // ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // 50px এর বেশি scroll হলে navbar তে shadow দাও
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    // Back to top button দেখাও
    backTop.classList.toggle('visible', window.scrollY > 400);
    // Active nav link update করো
    updateActiveNav();
  }, { passive: true });

  // ─────────────────────────────────────────
  // 3. MOBILE HAMBURGER MENU
  // ─────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Mobile menu এর link click করলে menu বন্ধ হবে
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ─────────────────────────────────────────
  // 4. ACTIVE NAV LINK — scroll position দেখে
  // ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
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
  // 5. TYPING ANIMATION
  // roles গুলো একে একে type করে → erase করে
  // ─────────────────────────────────────────
  const typedEl = document.getElementById('typed');

  const roles = [
    'beautiful websites',
    'Android apps',
    'Flutter experiences',
    'clean UI/UX',
    'your next project'
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let typingDelay = 120;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // টাইপ করছে — একটা character যোগ করো
      typedEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // সম্পূর্ণ হয়ে গেলে একটু wait করো তারপর delete শুরু
        isDeleting = true;
        typingDelay = 1800; // pause করো পড়ার জন্য
      } else {
        typingDelay = 100;
      }
    } else {
      // Delete করছে — একটা character সরাও
      typedEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // সব মুছে গেলে পরের role এ যাও
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 400; // নতুন word শুরু করার আগে pause
      } else {
        typingDelay = 55; // Delete দ্রুত হয়
      }
    }

    setTimeout(typeLoop, typingDelay);
  }

  // 1 সেকেন্ড পরে typing শুরু করো — page load হওয়ার সময় দাও
  setTimeout(typeLoop, 1000);

  // ─────────────────────────────────────────
  // 6. SCROLL REVEAL — elements দেখা গেলে animate করো
  // ─────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Skill bar animate করো
        const bar = entry.target.querySelector('.skill-bar');
        if (bar) bar.style.width = bar.style.getPropertyValue('--w') || getComputedStyle(bar).getPropertyValue('--w');
        // একবার animate হলে আর observe করার দরকার নেই
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // Skill cards এর জন্য আলাদা observer — skill bar animate করতে
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => skillObserver.observe(card));

  // ─────────────────────────────────────────
  // 7. CUSTOM CURSOR — desktop only
  // ─────────────────────────────────────────
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  // Dot সরাসরি mouse কে follow করে
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Ring একটু lag করে follow করে — smooth feel
  function animateRing() {
    const speed = 0.15;
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;

    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';

    requestAnimationFrame(animateRing);
  }

  animateRing();

  // Interactive elements এ hover করলে ring বড় হয়
  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ─────────────────────────────────────────
  // 8. PARTICLE CANVAS — dark mode background
  // ─────────────────────────────────────────
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let animFrame;

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
        r:     Math.random() * 1.5 + 0.5,  // radius
        dx:    (Math.random() - 0.5) * 0.4, // speed x
        dy:    (Math.random() - 0.5) * 0.4, // speed y
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = html.getAttribute('data-theme') === 'dark';

    particles.forEach((p, i) => {
      // Particle আঁকো
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(124, 77, 255, ${p.alpha})`
        : `rgba(108, 61, 230, ${p.alpha * 0.3})`;
      ctx.fill();

      // Nearby particles এর মধ্যে line আঁকো
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          const opacity = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = isDark
            ? `rgba(124, 77, 255, ${opacity})`
            : `rgba(108, 61, 230, ${opacity * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Move করো
      p.x += p.dx;
      p.y += p.dy;

      // Border এ পৌঁছালে bounce করো
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    animFrame = requestAnimationFrame(drawParticles);
  }

  // Initial setup
  resizeParticles();
  drawParticles();

  // Window resize এ canvas resize করো
  window.addEventListener('resize', resizeParticles, { passive: true });

  // ─────────────────────────────────────────
  // 9. BACK TO TOP BUTTON
  // ─────────────────────────────────────────
  const backTop = document.getElementById('backTop');

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─────────────────────────────────────────
  // 10. CONTACT FORM — Gmail link দিয়ে খোলে
  // Backend নেই, তাই mailto: দিয়ে email খুলি
  // ─────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    // mailto: link তৈরি করো
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:muntasir077@gmail.com?subject=${subject}&body=${body}`;

    // Form reset করো
    contactForm.reset();
  });

  // ─────────────────────────────────────────
  // 11. SMOOTH SCROLL — nav link click করলে
  // ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        // Navbar height বাদ দিয়ে scroll করো
        const offset = target.offsetTop - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

});
