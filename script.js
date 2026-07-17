// ─── Language Switching ───────────────────────────────────────────────────────

let currentLang = localStorage.getItem('wcito-lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('wcito-lang', lang);

  // Update all elements with data-en / data-fr
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });

  // Update placeholder attributes (inputs & textareas)
  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });

  // Update tel: links to the per-language phone number
  document.querySelectorAll('[data-tel-en]').forEach(el => {
    el.href = 'tel:' + el.getAttribute('data-tel-' + lang);
  });

  // Update the toggle button label to show the OTHER language
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.querySelector('.lang-label').textContent = lang === 'en' ? 'FR' : 'EN';
    btn.setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');
  }

  // Update <html lang> attribute
  document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
}

function initLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'fr' : 'en');
  });
  // Apply stored / default language on load
  applyLanguage(currentLang);
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (!el) return;
  el.textContent = new Date().getFullYear();
}

// ─── Hero Slideshow ───────────────────────────────────────────────────────────

function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
}

// ─── Mobile Nav Toggle ──────────────────────────────────────────────────────

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ─── Sticky Nav ───────────────────────────────────────────────────────────────

function initStickyNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(0,0,0,0.88)'
      : 'rgba(0,0,0,0.55)';
  });
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('.form-submit');
  submitBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const name    = contactForm.querySelector('input[type="text"]').value.trim();
    const email   = contactForm.querySelector('input[type="email"]').value.trim();
    const phone   = contactForm.querySelector('input[type="tel"]').value.trim();
    const message = contactForm.querySelector('textarea').value.trim();

    const errorMsg = currentLang === 'fr'
      ? 'Veuillez remplir tous les champs obligatoires.'
      : 'Please fill in all required fields.';
    const successMsg = currentLang === 'fr'
      ? 'Merci ! Votre message a été envoyé.'
      : 'Thank you! Your submission has been received!';
    const sendErrorMsg = currentLang === 'fr'
      ? "Une erreur s'est produite. Veuillez réessayer plus tard."
      : 'Something went wrong. Please try again later.';

    if (!name || !email || !message) {
      showFormMessage(contactForm, errorMsg, false);
      return;
    }

    submitBtn.disabled = true;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactForm.querySelector('input[name="access_key"]').value,
          subject: contactForm.querySelector('input[name="subject"]').value,
          botcheck: contactForm.querySelector('input[name="botcheck"]').checked,
          name, email, phone, message
        })
      });
      const result = await res.json();

      if (result.success) {
        showFormMessage(contactForm, successMsg, true);
        contactForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(el => el.value = '');
      } else {
        showFormMessage(contactForm, sendErrorMsg, false);
      }
    } catch (err) {
      showFormMessage(contactForm, sendErrorMsg, false);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function initNewsletter() {
  const newsletterBtn = document.querySelector('.footer-newsletter button');
  if (!newsletterBtn) return;

  newsletterBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const wrap  = document.querySelector('.footer-newsletter');
    const input = wrap.querySelector('input[type="email"]');
    const email = input.value.trim();

    if (!email) {
      alert(currentLang === 'fr'
        ? 'Veuillez entrer votre adresse courriel.'
        : 'Please enter your email address.');
      return;
    }

    const originalText = newsletterBtn.getAttribute('data-' + currentLang) || newsletterBtn.textContent;
    newsletterBtn.disabled = true;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: wrap.querySelector('input[name="access_key"]').value,
          subject: wrap.querySelector('input[name="subject"]').value,
          email
        })
      });
      const result = await res.json();

      if (result.success) {
        input.value = '';
        const confirmedText = currentLang === 'fr' ? 'Abonné !' : 'Subscribed!';
        newsletterBtn.textContent = confirmedText;
        newsletterBtn.style.opacity = '0.7';
        setTimeout(() => {
          newsletterBtn.textContent = originalText;
          newsletterBtn.style.opacity = '1';
          newsletterBtn.disabled = false;
        }, 3000);
      } else {
        alert(currentLang === 'fr'
          ? "Une erreur s'est produite. Veuillez réessayer plus tard."
          : 'Something went wrong. Please try again later.');
        newsletterBtn.disabled = false;
      }
    } catch (err) {
      alert(currentLang === 'fr'
        ? "Une erreur s'est produite. Veuillez réessayer plus tard."
        : 'Something went wrong. Please try again later.');
      newsletterBtn.disabled = false;
    }
  });
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function showFormMessage(form, text, success) {
  let msg = form.querySelector('.form-message');
  if (!msg) {
    msg = document.createElement('p');
    msg.className = 'form-message';
    msg.style.cssText = 'margin-top:14px;font-size:13px;font-weight:600;';
    form.appendChild(msg);
  }
  msg.textContent = text;
  msg.style.color = success ? '#2a7a2a' : '#c0392b';
  setTimeout(() => { msg.textContent = ''; }, 5000);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

// script.js is injected only after header/body/footer partials are already
// in the DOM (see index.html), so DOMContentLoaded has already fired by the
// time this runs — call the inits directly instead of waiting for it.
initLangToggle();
initMobileNav();
initHeroSlideshow();
initStickyNav();
initContactForm();
initNewsletter();
initFooterYear();
