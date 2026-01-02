/**
 * UMBC Rugby - Main JavaScript
 * Simplified, performant, minimal
 */

(function() {
  'use strict';

  // ============================================
  // Navigation
  // ============================================
  const Navigation = {
    nav: null,
    toggle: null,
    mobileMenu: null,
    scrollThreshold: 50,

    init() {
      this.nav = document.getElementById('nav');
      this.toggle = document.getElementById('nav-toggle');
      this.mobileMenu = document.getElementById('mobile-menu');

      if (!this.nav || !this.toggle || !this.mobileMenu) return;

      this.bindEvents();
      this.handleScroll();
    },

    bindEvents() {
      // Toggle mobile menu
      this.toggle.addEventListener('click', () => this.toggleMenu());

      // Close menu when clicking a link
      this.mobileMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeMenu();
      });

      // Handle scroll for nav background
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

      // Close menu on resize to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) this.closeMenu();
      });
    },

    toggleMenu() {
      const isOpen = this.mobileMenu.classList.contains('open');

      if (isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    },

    openMenu() {
      this.mobileMenu.classList.add('open');
      this.toggle.classList.add('active');
      this.toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    },

    closeMenu() {
      this.mobileMenu.classList.remove('open');
      this.toggle.classList.remove('active');
      this.toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    },

    handleScroll() {
      if (window.scrollY > this.scrollThreshold) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }
  };

  // ============================================
  // Gallery Modal
  // ============================================
  const Gallery = {
    modal: null,
    modalImage: null,
    closeBtn: null,
    items: null,

    init() {
      this.modal = document.getElementById('gallery-modal');
      this.modalImage = document.getElementById('modal-image');
      this.closeBtn = document.getElementById('modal-close');
      this.items = document.querySelectorAll('.gallery__item');

      if (!this.modal || !this.modalImage || this.items.length === 0) return;

      this.bindEvents();
    },

    bindEvents() {
      // Open modal on image click
      this.items.forEach(item => {
        item.addEventListener('click', () => {
          const img = item.querySelector('img');
          if (img) this.openModal(img.src, img.alt);
        });
      });

      // Close modal
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.closeModal());
      }

      // Close on backdrop click
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('open')) {
          this.closeModal();
        }
      });
    },

    openModal(src, alt) {
      this.modalImage.src = src;
      this.modalImage.alt = alt || 'Gallery image';
      this.modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    closeModal() {
      this.modal.classList.remove('open');
      document.body.style.overflow = '';
      this.modalImage.src = '';
    }
  };

  // ============================================
  // Back to Top Button
  // ============================================
  const BackToTop = {
    button: null,
    scrollThreshold: 300,

    init() {
      this.button = document.getElementById('back-to-top');
      if (!this.button) return;

      this.bindEvents();
      this.handleScroll();
    },

    bindEvents() {
      // Show/hide on scroll
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

      // Scroll to top on click
      this.button.addEventListener('click', () => this.scrollToTop());
    },

    handleScroll() {
      if (window.scrollY > this.scrollThreshold) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#' || href === '#main') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  // ============================================
  // Scroll Animations (Intersection Observer)
  // ============================================
  const ScrollAnimations = {
    init() {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Show all elements immediately without animation
        document.querySelectorAll('[data-animate]').forEach(el => {
          el.classList.add('animated');
        });
        return;
      }

      const animatedElements = document.querySelectorAll('[data-animate]');
      if (animatedElements.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(el => observer.observe(el));
    }
  };

  // ============================================
  // FAQ Accordion
  // ============================================
  const FAQAccordion = {
    init() {
      const faqItems = document.querySelectorAll('.faq-item');
      if (faqItems.length === 0) return;

      faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        if (!question) return;

        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('faq-item--open');

          // Close all other items (optional - remove for multiple open)
          faqItems.forEach(other => {
            if (other !== item) other.classList.remove('faq-item--open');
          });

          // Toggle current item
          item.classList.toggle('faq-item--open', !isOpen);
        });
      });
    }
  };

  // ============================================
  // Roster View Toggle
  // ============================================
  const RosterView = {
    init() {
      const viewButtons = document.querySelectorAll('.roster-controls__btn[data-view]');
      const rosterGrid = document.querySelector('.roster-grid');

      if (viewButtons.length === 0 || !rosterGrid) return;

      viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const view = btn.dataset.view;

          // Update active button
          viewButtons.forEach(b => b.classList.remove('roster-controls__btn--active'));
          btn.classList.add('roster-controls__btn--active');

          // Update grid view
          rosterGrid.classList.remove('roster-grid--list', 'roster-grid--cards');
          rosterGrid.classList.add(`roster-grid--${view}`);
        });
      });
    }
  };

  // ============================================
  // Initialize All Modules
  // ============================================
  function init() {
    Navigation.init();
    Gallery.init();
    BackToTop.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    FAQAccordion.init();
    RosterView.init();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
