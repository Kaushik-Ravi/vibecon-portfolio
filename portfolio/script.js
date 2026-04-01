(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');

  if (!savedTheme || savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (!savedTheme) {
      localStorage.setItem('theme', 'dark');
    }
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  const rotators = document.querySelectorAll('.hero-rotator[data-rotate]');
  rotators.forEach((rotator) => {
    const words = (rotator.getAttribute('data-rotate') || '')
      .split('|')
      .map((w) => w.trim())
      .filter(Boolean);
    if (!words.length) {
      return;
    }

    rotator.innerHTML = words.map((word, i) => `<span class="hero-rotator-word${i === 0 ? ' active' : ''}">${word}</span>`).join('');
    if (prefersReducedMotion || isCoarsePointer || words.length < 2) {
      return;
    }

    const nodes = rotator.querySelectorAll('.hero-rotator-word');
    let idx = 0;
    window.setInterval(() => {
      nodes[idx].classList.remove('active');
      idx = (idx + 1) % nodes.length;
      nodes[idx].classList.add('active');
    }, 2800);
  });

  const revealItems = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || isCoarsePointer) {
    revealItems.forEach((item) => {
      item.classList.add('in-view');
      item.style.transitionDelay = '0ms';
    });
  }

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 260)}ms`;
  });

  if (!(prefersReducedMotion || isCoarsePointer)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const el = entry.target;
        const target = Number(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1100;
        const start = performance.now();
        const decimals = Number(el.getAttribute('data-decimals') || 0);

        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = target * eased;
          el.textContent = `${value.toFixed(decimals)}${suffix}`;
          if (p < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        metricObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('[data-count]').forEach((item) => metricObserver.observe(item));

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer && !prefersReducedMotion) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    document.body.classList.add('cursor-ready');

    window.addEventListener('mousemove', (event) => {
      cursorDot.style.left = `${event.clientX}px`;
      cursorDot.style.top = `${event.clientY}px`;
    });

    const hoverables = document.querySelectorAll('a, button, .project-card');
    hoverables.forEach((item) => {
      item.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
      item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
  }

  if (!prefersReducedMotion && !isCoarsePointer) {
    const parallaxItems = document.querySelectorAll('[data-parallax="soft"]');
    let ticking = false;
    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        const offsetY = window.scrollY;
        parallaxItems.forEach((item) => {
          const speed = Number(item.getAttribute('data-speed') || 0.08);
          item.style.transform = `translate3d(0, ${offsetY * speed}px, 0)`;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const internalLinks = document.querySelectorAll('a[href]');
  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || link.target === '_blank') {
        return;
      }

      if (prefersReducedMotion || isCoarsePointer) {
        return;
      }

      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });

  const parseYoutubeId = (urlText) => {
    try {
      const parsed = new URL(urlText, window.location.href);
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.replace('/', '');
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1].split(/[?&#]/)[0];
      }
      return parsed.searchParams.get('v') || '';
    } catch {
      return '';
    }
  };

  const buildVideoFacade = (wrap, id, title) => {
    if (!id || !wrap) {
      return;
    }

    const safeTitle = title || 'Play video';
    const facade = document.createElement('button');
    facade.type = 'button';
    facade.className = 'video-facade';
    facade.setAttribute('aria-label', `Play video: ${safeTitle}`);
    facade.style.backgroundImage = `url("https://i.ytimg.com/vi_webp/${id}/hqdefault.webp")`;
    facade.innerHTML = `<span class="video-play" aria-hidden="true"></span><span class="video-title">${safeTitle}</span>`;

    facade.addEventListener('click', () => {
      const liveIframe = document.createElement('iframe');
      liveIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
      liveIframe.title = safeTitle;
      liveIframe.loading = 'eager';
      liveIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      liveIframe.referrerPolicy = 'strict-origin-when-cross-origin';
      liveIframe.allowFullscreen = true;
      wrap.replaceChildren(liveIframe);
    });

    wrap.replaceChildren(facade);
  };

  document.querySelectorAll('.video-embed[data-video-id]').forEach((wrap) => {
    const id = (wrap.getAttribute('data-video-id') || '').trim();
    const title = (wrap.getAttribute('data-video-title') || 'Embedded video').trim();
    buildVideoFacade(wrap, id, title);
  });

  document.querySelectorAll('.video-embed iframe').forEach((iframe) => {
    const src = iframe.getAttribute('src') || '';
    const id = parseYoutubeId(src);
    const wrap = iframe.parentElement;
    const title = iframe.getAttribute('title') || 'Embedded video';
    buildVideoFacade(wrap, id, title);
  });

  const galleryImages = [...document.querySelectorAll('.media-grid img, .architecture-visual img')];
  if (galleryImages.length) {
    const modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.innerHTML = `
      <div class="media-modal-inner" role="dialog" aria-modal="true" aria-label="Image preview gallery">
        <div class="media-modal-toolbar">
          <button type="button" class="media-modal-close" aria-label="Close image gallery">Close</button>
        </div>
        <div class="media-modal-stage">
          <button type="button" class="media-modal-nav" data-dir="prev" aria-label="Previous image">&#10094;</button>
          <img src="" alt="" />
          <button type="button" class="media-modal-nav" data-dir="next" aria-label="Next image">&#10095;</button>
        </div>
        <p class="media-modal-caption"></p>
      </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const modalCap = modal.querySelector('.media-modal-caption');
    const closeBtn = modal.querySelector('.media-modal-close');
    const navButtons = modal.querySelectorAll('.media-modal-nav');
    let idx = 0;

    const showAt = (i) => {
      idx = (i + galleryImages.length) % galleryImages.length;
      const target = galleryImages[idx];
      modalImg.src = target.src;
      modalImg.alt = target.alt;
      const captionNode = target.closest('figure')?.querySelector('figcaption');
      modalCap.textContent = captionNode ? captionNode.textContent : target.alt;
    };

    const openAt = (i) => {
      showAt(i);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    galleryImages.forEach((img, i) => {
      img.addEventListener('click', () => openAt(i));
    });

    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        showAt(idx + (btn.getAttribute('data-dir') === 'next' ? 1 : -1));
      });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) {
        return;
      }
      if (e.key === 'Escape') {
        closeModal();
      }
      if (e.key === 'ArrowRight') {
        showAt(idx + 1);
      }
      if (e.key === 'ArrowLeft') {
        showAt(idx - 1);
      }
    });
  }
})();
