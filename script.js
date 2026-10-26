// =========================================
// Cimmerian Industrial - Shared Scripts
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Navigation
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    // Rebuild the hamburger DOM: wrap bars in .hamburger-icon and add MENU/CLOSE labels
    hamburger.innerHTML = `
      <span class="hamburger-icon">
        <span></span><span></span><span></span>
      </span>
      <span class="hamburger-label">MENU</span>
      <span class="hamburger-label-active">CLOSE</span>
    `;

    // Create a backdrop overlay for the mobile panel
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    navOverlay.setAttribute('aria-hidden', 'true');
    document.querySelector('.nav-container').appendChild(navOverlay);

    const navClose = document.querySelector('.nav-close');

    // Central close function: collapses menu, overlay, all dropdowns, and restores scroll
    const closeMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      if (navClose) {
        navClose.style.display = 'none';
      }
      document.querySelectorAll('.nav-item.has-dropdown').forEach(item => item.classList.remove('active'));
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburger.classList.toggle('active', isOpen);
      navOverlay.classList.toggle('active', isOpen);
      if (navClose) {
        navClose.style.display = isOpen ? 'flex' : 'none';
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navOverlay.addEventListener('click', closeMenu);

    if (navClose) {
      navClose.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Mobile Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          const parent = toggle.parentElement;
          document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
            if (item !== parent) item.classList.remove('active');
          });
          parent.classList.toggle('active');
        }
      });
    });

    // Close menu when clicking a destination link (excluding dropdown toggles)
    document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-menu a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Hero Carousel
  const carouselSlides = document.querySelectorAll('.hero-carousel .hero-bg');
  const indicators = document.querySelectorAll('.hero-carousel-indicators .indicator');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    // Remove active class from all slides and indicators
    carouselSlides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    carouselSlides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % carouselSlides.length;
    showSlide(nextIndex);
  };

  // Start auto-play
  const startCarousel = () => {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  };

  // Stop auto-play
  const stopCarousel = () => {
    clearInterval(slideInterval);
  };

  // Add click handlers to indicators
  if (indicators.length > 0) {
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        stopCarousel();
        showSlide(index);
        startCarousel();
      });
    });
  }

  // Start the carousel if slides exist
  if (carouselSlides.length > 0) {
    startCarousel();
  }

  // Number Counter Animation for Stats
  const stats = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = 20;
    const steps = Math.ceil(duration / stepTime);
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + (el.getAttribute('data-suffix') || '');
    }, stepTime);
  };

  // Contact form posts to Web3Forms; report the outcome in-page and keep the input on failure
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formSuccess');
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = contactForm.querySelector('button[type="submit"]');
      const label = button.textContent;
      button.textContent = 'Sending...';
      button.disabled = true;

      let sent = false;
      try {
        const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm) });
        sent = res.ok;
      } catch {
        sent = false;
      }

      // Unhide first so the live region announces the text change
      formStatus.hidden = false;
      formStatus.querySelector('h3').textContent = sent ? 'Thank You!' : 'Message Not Sent';
      formStatus.querySelector('p').textContent = sent
        ? 'Your inquiry has been sent to our team. We will respond within one business day.'
        : 'We could not send your inquiry. Please try again, or email us at Enquiries@cimmeriancrane.com.';
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (sent) {
        contactForm.remove();
      } else {
        button.textContent = label;
        button.disabled = false;
      }
    });
  }

  // Initialize AOS Animation Library globally
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // Number Counter Animation for Stats
  if (stats.length > 0) {
    // Trigger counter animation when stats section is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => animateCounter(stat));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }
});
