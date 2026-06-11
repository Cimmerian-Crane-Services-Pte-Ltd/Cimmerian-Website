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
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Mobile Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        // Only intercept on mobile to allow expansion
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = toggle.parentElement;
          // Close other open dropdowns
          document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
            if (item !== parent) {
              item.classList.remove('active');
            }
          });
          parent.classList.toggle('active');
        }
      });
    });

    // Close menu when clicking a link (including dropdown links)
    document.querySelectorAll('.nav-link, .dropdown-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        // Also close any open dropdowns
        document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
          item.classList.remove('active');
        });
      });
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

  // Handle Contact Form Submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.innerHTML = `
        <h3>Thank You!</h3>
        <p>Your enquiry has been submitted. Our team will respond shortly.</p>
      `;
      successMessage.style.cssText = `
        background-color: var(--color-bg-steel);
        border: 1px solid var(--color-accent);
        border-radius: 4px;
        padding: 2rem;
        text-align: center;
        margin-top: 2rem;
      `;

      contactForm.innerHTML = '';
      contactForm.appendChild(successMessage);

      // Scroll to the message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
