/* ============================================
   SolarYoot - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.innerWidth <= 768;

  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('scrolled', currentScroll > 50);

    // Auto-hide navbar on scroll down (mobile), show on scroll up
    if (isMobile && currentScroll > 300) {
      if (currentScroll > lastScroll + 10) {
        navbar.style.transform = 'translateY(-100%)';
      } else if (currentScroll < lastScroll - 5) {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile Navigation ----
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
      // Always show navbar when menu is open
      navbar.style.transform = 'translateY(0)';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
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

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('active');
        // Scroll to success message on mobile
        if (isMobile) formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
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
