/**
 * Dola Foundation — Main JavaScript
 * Clean vanilla JS, no dependencies
 */

'use strict';

/* =========================================================
   1. MOBILE NAV TOGGLE
   ========================================================= */
(function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      body.style.overflow = '';
    }
  });
})();

/* =========================================================
   2. STICKY NAV ON SCROLL
   ========================================================= */
(function initStickyNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 50;

  function updateNavbar() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run on load
})();

/* =========================================================
   3. ACTIVE NAV LINK
   ========================================================= */
(function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* =========================================================
   4. SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================= */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* =========================================================
   5. ANIMATED NUMBER COUNTERS (IntersectionObserver)
   ========================================================= */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* =========================================================
   6. ANIMATE ON SCROLL (IntersectionObserver)
   ========================================================= */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* =========================================================
   7. DONATION AMOUNT SELECTOR
   ========================================================= */
(function initDonationSelector() {
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customWrap = document.querySelector('.custom-amount-wrap');
  const customInput = document.querySelector('#custom-amount');

  if (!amountBtns.length) return;

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.value === 'custom') {
        if (customWrap) customWrap.classList.add('show');
        if (customInput) customInput.focus();
      } else {
        if (customWrap) customWrap.classList.remove('show');
      }
    });
  });
})();

/* =========================================================
   8. DONATION FREQUENCY TOGGLE
   ========================================================= */
(function initFrequencyToggle() {
  const freqBtns = document.querySelectorAll('.freq-btn');
  if (!freqBtns.length) return;

  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

/* =========================================================
   9. FORM VALIDATION
   ========================================================= */
(function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  function showError(field, message) {
    field.classList.add('error');
    let errorEl = field.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }

  function clearError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.classList.remove('show');
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    let valid = true;

    if (field.required && !value) {
      showError(field, 'This field is required.');
      valid = false;
    } else if (type === 'email' && value) {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(value)) {
        showError(field, 'Please enter a valid email address.');
        valid = false;
      }
    } else if (type === 'tel' && value) {
      const telReg = /^[\d\s\+\-\(\)]{7,15}$/;
      if (!telReg.test(value)) {
        showError(field, 'Please enter a valid phone number.');
        valid = false;
      }
    } else {
      clearError(field);
    }

    if (valid) clearError(field);
    return valid;
  }

  forms.forEach(form => {
    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      fields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (allValid) {
        const successEl = form.querySelector('.form-success');
        if (successEl) {
          form.reset();
          successEl.style.display = 'flex';
          setTimeout(() => { successEl.style.display = 'none'; }, 5000);
        } else {
          // Generic success feedback
          const btn = form.querySelector('[type="submit"]');
          if (btn) {
            const orig = btn.textContent;
            btn.textContent = 'Sent Successfully!';
            btn.disabled = true;
            setTimeout(() => {
              btn.textContent = orig;
              btn.disabled = false;
              form.reset();
            }, 3000);
          }
        }
      }
    });
  });
})();

/* =========================================================
   10. NEWSLETTER FORM
   ========================================================= */
(function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const successEl = form.closest('.newsletter-section')?.querySelector('.newsletter-success');

      if (!input || !input.value.trim()) return;

      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(input.value.trim())) {
        input.style.borderColor = '#e53e3e';
        return;
      }

      input.style.borderColor = '';

      if (successEl) {
        form.style.display = 'none';
        successEl.style.display = 'flex';
      } else {
        const btn = form.querySelector('button');
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = 'Subscribed!';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = orig;
            btn.disabled = false;
            input.value = '';
          }, 3000);
        }
      }
    });
  });
})();

/* =========================================================
   11. FAQ ACCORDION
   ========================================================= */
(function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = trigger.classList.contains('open');

      // Close all in same accordion
      const accordion = trigger.closest('.accordion');
      accordion.querySelectorAll('.accordion-trigger.open').forEach(t => {
        if (t !== trigger) {
          t.classList.remove('open');
          const b = t.closest('.accordion-item').querySelector('.accordion-body');
          if (b) b.style.maxHeight = '0';
        }
      });

      // Toggle current
      trigger.classList.toggle('open', !isOpen);
      if (body) {
        body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
      }
    });
  });
})();

/* =========================================================
   12. SCROLL TO TOP
   ========================================================= */
(function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* =========================================================
   13. TAB FUNCTIONALITY
   ========================================================= */
(function initTabs() {
  const tabNavs = document.querySelectorAll('.tabs-nav');
  if (!tabNavs.length) return;

  tabNavs.forEach(nav => {
    const btns = nav.querySelectorAll('.tab-btn');
    const container = nav.closest('.tabs-container') || nav.parentElement;
    const panels = container.querySelectorAll('.tab-panel');

    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });
})();

/* =========================================================
   14. PAYMENT METHOD SELECTOR
   ========================================================= */
(function initPaymentMethods() {
  const methods = document.querySelectorAll('.payment-method');
  if (!methods.length) return;

  methods.forEach(method => {
    method.addEventListener('click', () => {
      const parent = method.closest('.payment-methods');
      parent.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      method.classList.add('active');

      // Show relevant details
      const target = method.dataset.target;
      if (target) {
        document.querySelectorAll('.payment-detail').forEach(d => d.style.display = 'none');
        const detail = document.querySelector(`#${target}`);
        if (detail) detail.style.display = 'block';
      }
    });
  });
})();

/* =========================================================
   15. HERO PARALLAX (subtle)
   ========================================================= */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
})();
