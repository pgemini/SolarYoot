/* ============================================
   SolarYoot - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.innerWidth <= 768;

  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile Navigation ----
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    navLinks.classList.add('active');
    mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    navLinks.classList.remove('active');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when any link is tapped
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });
  }

  // ---- Scroll Reveal Animations ----
  // On mobile: alternate left/right slide-in for cards for visual interest
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Add alternating slide animations to service cards on mobile
  if (isMobile) {
    document.querySelectorAll('.service-card').forEach((card, i) => {
      card.classList.remove('reveal');
      card.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      revealObserver.observe(card);
    });

    document.querySelectorAll('.why-card').forEach((card, i) => {
      card.classList.remove('reveal');
      card.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      revealObserver.observe(card);
    });

    document.querySelectorAll('.stat-card').forEach((card) => {
      card.classList.remove('reveal');
      card.classList.add('reveal-scale');
      revealObserver.observe(card);
    });

    // Reduce particles on mobile for performance
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
      }
    }
  } else {
    // Desktop: more particles
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
      }
    }
  }

  // ---- Animated Counter ----
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = isMobile ? 1500 : 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => counterObserver.observe(el));

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if it was closed)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---- Enquiry Form ----
  const form = document.getElementById('enquiry-form');
  const formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#ef4444';
          // Shake animation for invalid fields on mobile
          input.style.animation = 'shake 0.4s ease';
          setTimeout(() => {
            input.style.borderColor = '';
            input.style.animation = '';
          }, 2000);
        }
      });

      if (!valid) {
        // Scroll to first invalid field on mobile
        if (isMobile) {
          const firstInvalid = form.querySelector('[required]:invalid, [style*="border-color: rgb(239, 68, 68)"]');
          if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          form.style.display = 'none';
          formSuccess.classList.add('active');
          // Scroll to success message on mobile
          if (isMobile) formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          btn.textContent = 'Error - Try Again';
          btn.disabled = false;
        }
      }).catch(() => {
        btn.textContent = 'Error - Try Again';
        btn.disabled = false;
      });
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Gallery Lightbox ----
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img || !img.src) return;

        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox', 'active');
        lightbox.innerHTML = `
          <button class="lightbox-close" aria-label="Close">&times;</button>
          <img src="${img.src}" alt="${img.alt || ''}">
          <div class="lightbox-caption">${img.alt || ''}</div>
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        const closeLightbox = () => {
          lightbox.remove();
          document.body.style.overflow = '';
        };

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeLightbox();
        });
      });
    });
  }

  // ---- Mobile: Swipe-to-scroll partners ----
  const partnersTrack = document.querySelector('.partners-track');
  if (partnersTrack && isMobile) {
    partnersTrack.style.overflowX = 'auto';
    partnersTrack.style.flexWrap = 'nowrap';
    partnersTrack.style.scrollSnapType = 'x mandatory';
    partnersTrack.style.WebkitOverflowScrolling = 'touch';
    partnersTrack.style.paddingBottom = '0.5rem';
    partnersTrack.querySelectorAll('.partner-logo').forEach(logo => {
      logo.style.scrollSnapAlign = 'center';
      logo.style.flexShrink = '0';
    });
  }

  // ---- 7. Scroll Progress Indicator ----
  const scrollProgress = document.createElement('div');
  scrollProgress.classList.add('scroll-progress');
  document.body.appendChild(scrollProgress);

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---- 8. Partner Logos Marquee (desktop only) ----
  if (partnersTrack && !isMobile) {
    const logos = Array.from(partnersTrack.querySelectorAll('.partner-logo'));
    if (logos.length > 0) {
      // Clone logos to create seamless loop
      logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        partnersTrack.appendChild(clone);
      });
      partnersTrack.classList.add('marquee-active');
    }
  }

  // ---- 9. Section Entrance - Gold Left Border ----
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-in-view');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => sectionObserver.observe(section));

  // ---- 10. Button Ripple Effect ----
  const rippleButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-submit, .nav-cta');

  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      this.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

});

/* Shake animation for form validation */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);
