/* ============================================================
   VARTIKA RAWAT — PORTFOLIO JAVASCRIPT
   - Navbar scroll behaviour
   - Mobile nav toggle
   - Active nav link tracking
   - IntersectionObserver fade-in with stagger
   - Contact form (client-side demo)
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   Navbar: transparent → frosted glass on scroll
   ---------------------------------------------------------- */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

function handleNavScroll() {
  if (window.scrollY > 24) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load


/* ----------------------------------------------------------
   Mobile nav toggle (hamburger)
   ---------------------------------------------------------- */
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  // Prevent body scroll when drawer is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav drawer when any link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close nav on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});


/* ----------------------------------------------------------
   Active nav link — highlight the section currently in view
   ---------------------------------------------------------- */
const sections   = Array.from(document.querySelectorAll('section[id]'));
const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));

function updateActiveLink() {
  let current = '';

  sections.forEach(section => {
    const top    = section.offsetTop - Math.max(window.innerHeight * 0.4, 120);
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.id;
    }
  });

  navAnchors.forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ----------------------------------------------------------
   Fade-in on scroll — IntersectionObserver with stagger
   ---------------------------------------------------------- */
const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  /* Stagger siblings that share the same parent container */
  fadeEls.forEach(el => {
    // Find siblings that are also fade-in elements
    const siblings = Array.from(el.parentElement.querySelectorAll('.fade-in'));
    const idx      = siblings.indexOf(el);
    // Each sibling gets a slightly later delay (80 ms apart, max 640 ms)
    const delay    = Math.min(idx * 80, 640);
    el.style.transitionDelay = `${delay}ms`;
    io.observe(el);
  });
} else {
  // Fallback: show everything immediately for older browsers
  fadeEls.forEach(el => el.classList.add('visible'));
}


/* ----------------------------------------------------------
   Contact form — client-side demo
   Replace the setTimeout block with a real fetch() call to
   your backend / form service (Formspree, EmailJS, etc.)
   ---------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', function handleSubmit(e) {
  e.preventDefault();

  const submitBtn = this.querySelector('button[type="submit"]');

  // Basic validation
  const name    = this.name.value.trim();
  const email   = this.email.value.trim();
  const message = this.message.value.trim();

  if (!name || !email || !message) {
    showNote('Please fill in your name, email, and message.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showNote('Please enter a valid email address.', 'error');
    return;
  }

  // Disable button + show loading state
  submitBtn.disabled  = true;
  submitBtn.textContent = 'Sending…';
  formNote.className    = 'form-note';
  formNote.textContent  = '';

  /*
   * TODO: replace this simulated delay with your real submission logic, e.g.:
   *
   * fetch('https://formspree.io/f/YOUR_ID', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ name, email, message })
   * })
   * .then(r => r.ok ? onSuccess() : onError())
   * .catch(onError);
   */
  setTimeout(() => {
    onSuccess();
  }, 1100);

  function onSuccess() {
    showNote('Thanks for reaching out! I\'ll get back to you soon. ✨', 'success');
    contactForm.reset();
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }

  function onError() {
    showNote('Something went wrong. Please try emailing me directly.', 'error');
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }
});

function showNote(message, type) {
  formNote.textContent = message;
  formNote.className   = `form-note ${type}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ----------------------------------------------------------
   Smooth scroll for all internal anchor links
   (CSS scroll-behavior handles most cases; this is a
   progressive-enhancement fallback for older browsers.)
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function smoothScroll(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
