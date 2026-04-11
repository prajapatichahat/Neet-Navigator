/* ========================================
   NEET Navigator - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Initialize all modules ----
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initScrollToTop();
  initVideoTabs();
  initFilterPills();
  initSearchInteraction();
  initCounterAnimation();
  initSmoothScrollLinks();
});

/* ========================================
   STICKY HEADER
   ======================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.mobile-overlay');

  if (!toggle || !navMenu) return;

  const toggleMenu = () => {
    toggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  };

  toggle.addEventListener('click', toggleMenu);

  if (overlay) {
    overlay.addEventListener('click', toggleMenu);
  }

  // Close on nav link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
}

/* ========================================
   SCROLL REVEAL ANIMATION
   ======================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ========================================
   SCROLL TO TOP
   ======================================== */
function initScrollToTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================================
   VIDEO TABS
   ======================================== */
function initVideoTabs() {
  const tabs = document.querySelectorAll('.video-tab');
  const cards = document.querySelectorAll('.video-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      // Filter cards with animation
      cards.forEach(card => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ========================================
   FILTER PILLS (College section)
   ======================================== */
function initFilterPills() {
  const pills = document.querySelectorAll('.filter-pill');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

/* ========================================
   SEARCH INTERACTION
   ======================================== */
function initSearchInteraction() {
  // Hero search
  const heroSearch = document.getElementById('heroSearchInput');
  const predictBtn = document.getElementById('predictBtn');

  if (heroSearch && predictBtn) {
    predictBtn.addEventListener('click', () => {
      const rank = heroSearch.value.trim();
      if (rank) {
        // Show a brief animation / feedback
        predictBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          Analyzing...
        `;
        predictBtn.style.pointerEvents = 'none';

        setTimeout(() => {
          predictBtn.innerHTML = '🎯 Predict Now';
          predictBtn.style.pointerEvents = '';
          showNotification(`Results for NEET Rank ${rank} — Feature coming soon!`, 'info');
        }, 2000);
      } else {
        heroSearch.focus();
        heroSearch.style.animation = 'shake 0.4s ease';
        setTimeout(() => heroSearch.style.animation = '', 400);
      }
    });

    heroSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        predictBtn.click();
      }
    });
  }

  // College search
  const collegeSearch = document.getElementById('collegeSearchInput');
  if (collegeSearch) {
    collegeSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.college-card');

      cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.college-meta-item').textContent.toLowerCase();

        if (name.includes(query) || location.includes(query)) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 200);
        }
      });
    });
  }
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ========================================
   SMOOTH SCROLL LINKS
   ======================================== */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ========================================
   NOTIFICATION TOAST
   ======================================== */
function showNotification(message, type = 'info') {
  // Remove existing
  const existing = document.querySelector('.notification-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'info' ? '#1A73E8' : type === 'success' ? '#22C55E' : '#EF4444'};
    color: white;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    z-index: 10000;
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Inter', sans-serif;
    max-width: 350px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Animate out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ========================================
   SHAKE ANIMATION (for validation)
   ======================================== */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
