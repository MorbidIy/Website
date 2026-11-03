/**
 * Morbidly Mods — Main JavaScript
 * Handles: Mobile sidebar, search, view transitions, navigation, animations
 */

(function() {
  'use strict';

  // =========================================================================
  // UTILITIES
  // =========================================================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // =========================================================================
  // STATE
  // =========================================================================
  const state = {
    sidebarOpen: false,
    searchOpen: false,
    currentPage: 'home',
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================
  const elements = {
    sidebar: $('#sidebar'),
    sidebarOverlay: $('.sidebar-overlay'),
    mobileMenuToggle: $('.mobile-menu-toggle'),
    sidebarClose: $('.sidebar-close'),
    searchInput: $('#site-search'),
    searchResults: $('#searchResults'),
    navLinks: $$('.nav-link[data-page]'),
    sidebarLinks: $$('.sidebar-link[data-page]'),
    heroStats: $$('.stat-value[data-count]'),
    cards: $$('.card'),
    retroNavBtns: $$('.retro-nav-btn[data-transition]'),
  };

  // =========================================================================
  // SEARCH DATA (populate with your actual content)
  // =========================================================================
  const searchIndex = [
    { title: 'Welcome', url: 'index.html', category: 'Home', icon: 'home' },
    { title: 'Getting Started', url: 'pages/getting-started.html', category: 'Bully SE', icon: 'guide' },
    { title: 'Mod Downloads', url: 'pages/releases.html', category: 'Downloads', icon: 'download' },
    { title: 'Terms of Service', url: 'pages/tos.html', category: 'Legal', icon: 'file' },
    { title: 'GTA Account Services', url: 'pages/gta-services.html', category: 'GTA V', icon: 'user' },
    { title: 'Account Showcase', url: 'pages/gta-show.html', category: 'GTA V', icon: 'eye' },
    { title: 'Account Security', url: 'pages/account-security.html', category: 'GTA V', icon: 'shield' },
    { title: 'Purchase Accounts', url: 'pages/purchase.html', category: 'GTA V', icon: 'cart' },
    { title: 'Standalone Tools', url: 'pages/tools.html', category: 'Utilities', icon: 'tool' },
    { title: 'Endorsed Mods', url: 'pages/favorites.html', category: 'Community', icon: 'star' },
    { title: 'Troubleshooting', url: 'pages/troubleshooting.html', category: 'Support', icon: 'wrench' },
    { title: 'Contact', url: 'pages/contact.html', category: 'Support', icon: 'mail' },
  ];

  const iconSVGs = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    guide: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  };

  // =========================================================================
  // SIDEBAR TOGGLE (Mobile)
  // =========================================================================
  function initSidebar() {
    if (!elements.sidebar || !elements.mobileMenuToggle) return;

    const toggleSidebar = (open) => {
      state.sidebarOpen = open;
      elements.sidebar.classList.toggle('active', open);
      elements.sidebarOverlay.classList.toggle('active', open);
      elements.mobileMenuToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    elements.mobileMenuToggle.addEventListener('click', () => toggleSidebar(!state.sidebarOpen));
    elements.sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
    elements.sidebarClose?.addEventListener('click', () => toggleSidebar(false));

    // Close on link click
    elements.sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) toggleSidebar(false);
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.sidebarOpen) toggleSidebar(false);
    });

    // Handle resize
    window.addEventListener('resize', throttle(() => {
      if (window.innerWidth > 900 && state.sidebarOpen) toggleSidebar(false);
    }, 100));
  }

  // =========================================================================
  // SEARCH FUNCTIONALITY
  // =========================================================================
  function initSearch() {
    if (!elements.searchInput || !elements.searchResults) return;

    let selectedIndex = -1;
    let filteredResults = [];

    const renderResults = (results) => {
      if (results.length === 0) {
        elements.searchResults.innerHTML = `
          <div class="search-result-item" style="justify-content:center;color:var(--color-fg-subtle);">
            No results found
          </div>
        `;
        elements.searchResults.hidden = false;
        return;
      }

      elements.searchResults.innerHTML = results.map((item, index) => `
        <div class="search-result-item" role="option" data-index="${index}" tabindex="-1">
          <svg class="search-result-icon" viewBox="0 0 24 24" aria-hidden="true">
            ${iconSVGs[item.icon] || iconSVGs.file}
          </svg>
          <div class="search-result-text">
            <div class="search-result-title">${escapeHtml(item.title)}</div>
            <div class="search-result-category">${escapeHtml(item.category)}</div>
          </div>
        </div>
      `).join('');

      elements.searchResults.hidden = false;
      selectedIndex = -1;
    };

    const highlightSelection = () => {
      $$('.search-result-item', elements.searchResults).forEach((item, index) => {
        item.setAttribute('aria-selected', index === selectedIndex);
      });
    };

    const navigateResults = (direction) => {
      const items = $$('.search-result-item', elements.searchResults);
      if (items.length === 0) return;

      selectedIndex = (selectedIndex + direction + items.length) % items.length;
      highlightSelection();
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    };

    const selectResult = (index) => {
      const items = $$('.search-result-item', elements.searchResults);
      if (items[index]) {
        const url = filteredResults[index].url;
        window.location.href = url;
      }
    };

    const handleInput = debounce((e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) {
        elements.searchResults.hidden = true;
        return;
      }

      filteredResults = searchIndex.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );

      renderResults(filteredResults);
    }, 150);

    const handleKeydown = (e) => {
      if (elements.searchResults.hidden) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          navigateResults(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigateResults(-1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) selectResult(selectedIndex);
          break;
        case 'Escape':
          elements.searchResults.hidden = true;
          elements.searchInput.blur();
          break;
      }
    };

    const handleClick = (e) => {
      const item = e.target.closest('.search-result-item');
      if (item) {
        const index = parseInt(item.dataset.index, 10);
        selectResult(index);
      }
    };

    const handleBlur = () => {
      // Delay to allow click to register
      setTimeout(() => {
        elements.searchResults.hidden = true;
      }, 200);
    };

    elements.searchInput.addEventListener('input', handleInput);
    elements.searchInput.addEventListener('keydown', handleKeydown);
    elements.searchInput.addEventListener('focus', () => {
      if (elements.searchInput.value.trim().length >= 2) {
        handleInput({ target: elements.searchInput });
      }
    });
    elements.searchInput.addEventListener('blur', handleBlur);
    elements.searchResults.addEventListener('click', handleClick);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // =========================================================================
  // ACTIVE NAVIGATION HIGHLIGHTING
  // =========================================================================
  function initActiveNavigation() {
    const currentPath = window.location.pathname;
    let currentPage = 'home';

    // Determine current page from URL
    if (currentPath.includes('getting-started')) currentPage = 'getting-started';
    else if (currentPath.includes('releases') || currentPath.includes('downloads')) currentPage = 'releases';
    else if (currentPath.includes('gta-services')) currentPage = 'gta-services';
    else if (currentPath.includes('gta-show')) currentPage = 'gta-show';
    else if (currentPath.includes('account-security')) currentPage = 'account-security';
    else if (currentPath.includes('purchase')) currentPage = 'purchase';
    else if (currentPath.includes('tools')) currentPage = 'tools';
    else if (currentPath.includes('favorites')) currentPage = 'favorites';
    else if (currentPath.includes('troubleshooting')) currentPage = 'troubleshooting';
    else if (currentPath.includes('contact')) currentPage = 'contact';
    else if (currentPath.includes('tos')) currentPage = 'tos';
    else if (currentPath === '/' || currentPath.endsWith('index.html')) currentPage = 'home';

    state.currentPage = currentPage;

    // Update header nav
    elements.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === currentPage);
    });

    // Update sidebar nav
    elements.sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === currentPage);
    });
  }

  // =========================================================================
  // VIEW TRANSITIONS (for page navigation)
  // =========================================================================
  function initViewTransitions() {
    if (!document.startViewTransition || state.prefersReducedMotion) return;

    // Handle internal links with data-transition
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-transition]');
      if (!link) return;

      const url = link.href;
      if (!url || url.startsWith('#') || link.target === '_blank') return;

      // Only for same-origin links
      try {
        new URL(url);
        if (new URL(url).origin !== window.location.origin) return;
      } catch {
        return;
      }

      e.preventDefault();

      document.startViewTransition(() => {
        window.location.href = url;
      });
    });
  }

  // =========================================================================
  // INSTAGRAM FOLLOWERS FETCH
  // =========================================================================
  async function fetchInstagramFollowers() {
    try {
      // Call the Vercel serverless function
      const response = await fetch('/api/instagram-followers');

      if (!response.ok) {
        const error = await response.json();
        console.warn('[Instagram] API error:', error.message || 'Failed to fetch');
        return null;
      }

      const data = await response.json();
      return data.followers_count;
    } catch (error) {
      console.warn('[Instagram] Fetch failed:', error.message);
      return null;
    }
  }

  function updateCommunityMembersStat(followersCount) {
    // Find the "Community Members" stat element
    const communityStat = Array.from(elements.heroStats).find(stat => {
      const label = stat.parentElement?.querySelector('.stat-label');
      return label && label.textContent.includes('Community Members');
    });

    if (communityStat) {
      // Update the data-count attribute for the counter animation
      communityStat.dataset.count = followersCount.toLocaleString();
      // Reset text content so counter animation picks up the new value
      communityStat.textContent = '0';
      // Trigger the counter animation
      animateCounter(communityStat);
    }
  }

  async function initInstagramFollowers() {
    // Only fetch if we're on the home page (where the hero stats are)
    if (state.currentPage !== 'home') return;

    const followersCount = await fetchInstagramFollowers();

    if (followersCount !== null) {
      updateCommunityMembersStat(followersCount);
    } else {
      // Fallback: use the existing data-count value (1200)
      // The counter animation will use the original value
      const communityStat = Array.from(elements.heroStats).find(stat => {
        const label = stat.parentElement?.querySelector('.stat-label');
        return label && label.textContent.includes('Community Members');
      });
      if (communityStat) {
        communityStat.dataset.count = communityStat.dataset.count || '1200';
      }
    }
  }

  // =========================================================================
  // COUNTER ANIMATION (Hero Stats)
  // =========================================================================
  function initCounterAnimation() {
    if (state.prefersReducedMotion) {
      elements.heroStats.forEach(stat => {
        stat.textContent = stat.dataset.count;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    elements.heroStats.forEach(stat => observer.observe(stat));
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const duration = 1500;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  // =========================================================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // =========================================================================
  function initScrollAnimations() {
    if (state.prefersReducedMotion) return;

    const animatedElements = $$('.card, .section-header, .hero-content, .hero-visual');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${index * 80}ms`;
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => observer.observe(el));
  }

  // =========================================================================
  // IMAGE ERROR HANDLING (Fallbacks)
  // =========================================================================
  function initImageFallbacks() {
    $$('img').forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        const fallback = this.nextElementSibling;
        if (fallback && fallback.classList.contains('card-media-fallback')) {
          fallback.style.display = 'flex';
        } else if (fallback && fallback.classList.contains('hero-image-fallback')) {
          fallback.style.display = 'flex';
        } else if (fallback && fallback.classList.contains('logo-fallback')) {
          fallback.style.display = 'block';
        }
      });
    });
  }

  // =========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================================================
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = 64;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: state.prefersReducedMotion ? 'auto' : 'smooth'
      });

      target.focus({ preventScroll: true });
    });
  }

  // =========================================================================
  // LAZY LOADING FOR IMAGES
  // =========================================================================
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = $$('img[loading="lazy"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => observer.observe(img));
  }

  // =========================================================================
  // KEYBOARD NAVIGATION ENHANCEMENTS
  // =========================================================================
  function initKeyboardNavigation() {
    // Trap focus in sidebar when open (mobile)
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !state.sidebarOpen) return;

      const focusableElements = $$(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        elements.sidebar
      );

      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // =========================================================================
  // PERFORMANCE: Passive Event Listeners
  // =========================================================================
  function initPassiveListeners() {
    // Scroll events for header shadow
    let lastScroll = 0;
    const header = $('.morbid-header');

    const handleScroll = throttle(() => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.style.boxShadow = 'var(--shadow-md)';
        header.style.background = 'rgba(0, 0, 0, 0.98)';
      } else {
        header.style.boxShadow = 'none';
        header.style.background = 'rgba(0, 0, 0, 0.95)';
      }

      lastScroll = currentScroll;
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all modules
    initSidebar();
    initSearch();
    initActiveNavigation();
    initViewTransitions();
    initCounterAnimation();
    initInstagramFollowers(); // Fetch Instagram followers for Community Members stat
    initScrollAnimations();
    initImageFallbacks();
    initSmoothScroll();
    initLazyLoading();
    initKeyboardNavigation();
    initPassiveListeners();

    // Mark as loaded for CSS transitions
    document.body.classList.add('loaded');

    // Log initialization
    console.log('[Morbidly Mods] Initialized');
  }

  // Start
  init();

  // Expose for debugging
  window.MorbidlyMods = {
    state,
    elements,
    searchIndex,
  };
})();