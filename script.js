/* ============================================================
   script.js – Portfolio interactivity
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Sticky header — add "scrolled" class on scroll
  ---------------------------------------------------------- */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ----------------------------------------------------------
     Mobile hamburger menu
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open');
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        hamburger.focus();
      }
    });
  }

  /* ----------------------------------------------------------
     Active nav link — highlight current section
  ---------------------------------------------------------- */
  const sections   = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');

  if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navAnchors.forEach(a => {
              a.classList.toggle(
                'active',
                a.getAttribute('href') === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: '-64px 0px 0px 0px' }
    );
    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ----------------------------------------------------------
     Scroll-reveal — animate elements into view
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.skill-card, .project-card, .about__grid, .contact__form, .contact__intro'
  );

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger within the same parent
            const siblings = Array.from(
              entry.target.parentElement.children
            ).filter(el => revealEls.includes ? Array.from(revealEls).includes(el) : true);
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 60}ms`;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealEls.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     Contact form — client-side validation & submission
  ---------------------------------------------------------- */
  const form       = document.getElementById('contact-form');
  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput   = document.getElementById('message');
  const successMsg = document.getElementById('form-success');

  function setError(input, errorId, message) {
    const errEl = document.getElementById(errorId);
    if (!errEl) return;
    errEl.textContent = message;
    if (message) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorId);
    } else {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    let valid = true;

    if (!nameInput.value.trim()) {
      setError(nameInput, 'name-error', 'Please enter your name.');
      valid = false;
    } else {
      setError(nameInput, 'name-error', '');
    }

    if (!emailInput.value.trim()) {
      setError(emailInput, 'email-error', 'Please enter your email.');
      valid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, 'email-error', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailInput, 'email-error', '');
    }

    if (!msgInput.value.trim()) {
      setError(msgInput, 'message-error', 'Please enter a message.');
      valid = false;
    } else {
      setError(msgInput, 'message-error', '');
    }

    return valid;
  }

  // Clear error on input
  [nameInput, emailInput, msgInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        const errorId = `${input.id}-error`;
        setError(input, errorId, '');
      }
    });
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm()) return;

      // Simulate a successful submission (replace with real endpoint)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        if (successMsg) {
          successMsg.textContent = '✓ Message sent! I\'ll get back to you shortly.';
          setTimeout(() => { successMsg.textContent = ''; }, 5000);
        }
      }, 1000);
    });
  }

  /* ----------------------------------------------------------
     Footer year — keep copyright current
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
