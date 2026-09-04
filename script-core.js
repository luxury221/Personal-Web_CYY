const intro = document.getElementById('intro');
const introSkip = document.getElementById('introSkip');
const introVisualStage = document.getElementById('introVisualStage');
const introArchiveCard = document.getElementById('introArchiveCard');
const homeVisual = document.getElementById('homeVisual');
const homeArchiveCard = document.getElementById('homeArchiveCard');
const transition = document.getElementById('pageTransition');
const transitionTitle = document.getElementById('transitionTitle');
const langToggle = document.getElementById('langToggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
let currentLang = localStorage.getItem('preferred-language') || 'zh';

const hasGsap = () => typeof window.gsap !== 'undefined';
let coverHandoff = false;
let activeSplits = [];
let activeTriggers = [];

/* ------------------------------ Language ------------------------------ */

function applyLanguage(lang, animate = false) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  document.querySelectorAll('[data-zh][data-en]').forEach((el) => {
    /* Normalize literal "\n" written inside attributes into real line breaks. */
    const text = (el.dataset[lang] || '').replace(/\\n/g, '\n');
    if (!text) return;
    if (text.includes('\n')) {
      el.innerHTML = text.split('\n').map((line) => line.trim()).join('<br />');
    } else {
      el.textContent = text;
    }
  });

  if (langToggle) langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
  localStorage.setItem('preferred-language', lang);

  if (animate && hasGsap() && !reduceMotion) {
    gsap.from(document.querySelectorAll('[data-zh][data-en]:not(.split-managed)'), {
      opacity: 0,
      y: 8,
      duration: .38,
      stagger: .012,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  }
}

applyLanguage(currentLang);
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const next = currentLang === 'zh' ? 'en' : 'zh';
    teardownScrollNarrative();
    applyLanguage(next, true);
    initScrollNarrative();
  });
}

/* ------------------------------ Home intro ------------------------------ */

function revealHome(immediate = false) {
  const homeReveal = document.querySelector('[data-home-reveal]');

  if (!hasGsap() || reduceMotion || immediate) {
    if (homeVisual) homeVisual.style.opacity = '1';
    if (homeReveal) {
      homeReveal.style.opacity = '1';
      homeReveal.style.transform = 'none';
    }
    return;
  }

  if (homeVisual) gsap.to(homeVisual, { opacity: 1, duration: .25, ease: 'power2.out' });
  if (homeReveal) {
    gsap.to(homeReveal, {
      opacity: 1,
      y: 0,
      duration: .72,
      ease: 'power3.out'
    });
  }
}

function removeIntro() {
  if (!intro) return;
  intro.remove();
  document.body.style.overflow = '';
}

function finishIntroImmediately() {
  if (hasGsap()) {
    if (homeVisual) gsap.set(homeVisual, { opacity: 1 });
    const homeReveal = document.querySelector('[data-home-reveal]');
    if (homeReveal) gsap.set(homeReveal, { opacity: 1, y: 0 });
  }
  removeIntro();
}

function flyArchiveCardHome() {
  if (!intro || !introArchiveCard || !homeArchiveCard || !hasGsap()) {
    finishIntroImmediately();
    return;
  }

  const from = introArchiveCard.getBoundingClientRect();
  const to = homeArchiveCard.getBoundingClientRect();

  const flying = introArchiveCard.cloneNode(true);
  flying.removeAttribute('id');
  flying.classList.remove('archive-card-intro');
  flying.classList.add('flying-archive-card');
  Object.assign(flying.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    margin: '0',
    zIndex: '1200',
    pointerEvents: 'none',
    transformOrigin: 'top left'
  });
  document.body.appendChild(flying);

  gsap.set(introArchiveCard, { opacity: 0 });
  gsap.set(homeVisual, { opacity: 0 });

  const homeReveal = document.querySelector('[data-home-reveal]');
  const tl = gsap.timeline({
    defaults: { ease: 'power4.inOut' },
    onComplete: () => {
      if (homeVisual) gsap.set(homeVisual, { opacity: 1 });
      flying.remove();
      removeIntro();
      initHomeParallax();
    }
  });

  tl.to('.intro-topline, .intro-footer, .intro-skip, .intro-axis-line, .intro-law', {
      opacity: 0,
      duration: .26,
      ease: 'power2.out'
    }, 0)
    .to('.intro-grid, .intro-paper-noise', {
      opacity: 0,
      duration: .48,
      ease: 'power2.out'
    }, 0)
    .to(flying, {
      left: to.left,
      top: to.top,
      width: to.width,
      height: to.height,
      duration: .88
    }, 0)
    .to(homeReveal, {
      opacity: 1,
      y: 0,
      duration: .64,
      ease: 'power3.out'
    }, .28)
    .to(intro, {
      opacity: 0,
      duration: .18,
      ease: 'none'
    }, .73);
}

function playIntro() {
  if (!intro) {
    revealHome(false);
    initHomeParallax();
    return;
  }

  /* Every visit to index.html intentionally replays the intro. */
  if (reduceMotion || !hasGsap()) {
    finishIntroImmediately();
    initHomeParallax();
    return;
  }

  document.body.style.overflow = 'hidden';

  const homeReveal = document.querySelector('[data-home-reveal]');
  if (homeVisual) gsap.set(homeVisual, { opacity: 0 });
  if (homeReveal) gsap.set(homeReveal, { opacity: 0, y: 24 });

  /* In image-card mode the card assembles as a single wipe of the picture
     instead of the built-in paper/ink/seal pieces. */
  const cardImage = document.body.classList.contains('card-image-mode');

  gsap.set('.intro-topline, .intro-footer, .intro-skip', { opacity: 0 });
  gsap.set('.intro-axis-line', { scaleY: 0, opacity: 0 });
  gsap.set('.intro-law', { opacity: 0, scale: .96 });
  gsap.set('.intro-name-mask span', { yPercent: 118 });
  gsap.set('.intro-word', { opacity: 0, y: 18 });
  gsap.set(introVisualStage, { opacity: 0, scale: .96 });

  if (cardImage) {
    gsap.set('.archive-card-intro .archive-card-img', { clipPath: 'inset(0 100% 0 0)' });
  } else {
    gsap.set('.archive-card-intro .archive-paper-one', { clipPath: 'inset(0 100% 0 0)' });
    gsap.set('.archive-card-intro .archive-paper-two', { opacity: 0, xPercent: 12 });
    gsap.set('.archive-card-intro .archive-ink-block', { opacity: 0, xPercent: 16 });
    gsap.set('.archive-card-intro .archive-grid, .archive-card-intro .archive-noise', { opacity: 0 });
    gsap.set('.archive-card-intro .archive-cys', { yPercent: 118, rotate: 1.4 });
    /* The seal is stamped separately, so it starts pressed away instead of rising in. */
    gsap.set('.archive-card-intro .archive-seal', { opacity: 0, scale: 1.24, transformOrigin: '50% 50%' });
    gsap.set('.archive-card-intro .archive-document, .archive-card-intro .archive-case, .archive-card-intro .archive-axis, .archive-card-intro .archive-label, .archive-card-intro .archive-corner', { opacity: 0, y: 8 });
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to('.intro-topline, .intro-footer, .intro-skip', {
      opacity: 1,
      duration: .34,
      stagger: .04
    }, 0)
    .to('.intro-axis-line', {
      scaleY: 1,
      opacity: 1,
      duration: .48,
      ease: 'power2.out'
    }, .02)
    .to('.intro-law', {
      opacity: 1,
      scale: 1,
      duration: .62,
      ease: 'power2.out'
    }, .22)
    .to('.intro-name-mask span', {
      yPercent: 0,
      duration: .62,
      stagger: .08,
      ease: 'power4.out'
    }, .60)
    .to('.intro-word', {
      opacity: 1,
      y: 0,
      duration: .42,
      stagger: .1
    }, 1.00)
    .to('.intro-name, .intro-words', {
      opacity: 0,
      duration: .18,
      ease: 'power2.in'
    }, 1.28)
    .to('.intro-law', {
      opacity: .22,
      scale: 1.015,
      duration: .26
    }, 1.30)
    .to(introVisualStage, {
      opacity: 1,
      scale: 1,
      duration: .24,
      ease: 'power2.out'
    }, 1.50);

  if (cardImage) {
    tl.to('.archive-card-intro .archive-card-img', {
      clipPath: 'inset(0 0% 0 0)',
      duration: .52,
      ease: 'expo.out'
    }, 1.51);
  } else {
    tl
      .to('.archive-card-intro .archive-paper-one', {
        clipPath: 'inset(0 0% 0 0)',
        duration: .52,
        ease: 'expo.out'
      }, 1.51)
      .to('.archive-card-intro .archive-paper-two', {
        opacity: 1,
        xPercent: 0,
        duration: .48,
        ease: 'power3.out'
      }, 1.61)
      .to('.archive-card-intro .archive-ink-block', {
        opacity: .88,
        xPercent: 0,
        duration: .48,
        ease: 'power3.out'
      }, 1.70)
      .to('.archive-card-intro .archive-grid, .archive-card-intro .archive-noise', {
        opacity: 1,
        duration: .35
      }, 1.75)
      .to('.archive-card-intro .archive-cys', {
        yPercent: 0,
        rotate: 0,
        duration: .52,
        ease: 'power4.out'
      }, 1.84)
      .to('.archive-card-intro .archive-document, .archive-card-intro .archive-case, .archive-card-intro .archive-axis, .archive-card-intro .archive-label, .archive-card-intro .archive-corner', {
        opacity: 1,
        y: 0,
        duration: .34,
        stagger: .035
      }, 1.98)
      .to('.archive-card-intro .archive-seal', {
        opacity: 1,
        scale: 1,
        duration: .28,
        ease: 'power4.in'
      }, 2.08);
  }

  tl.call(flyArchiveCardHome, null, 2.32);
}

if (introSkip) introSkip.addEventListener('click', finishIntroImmediately);

/* ------------------------------ Cover handoff ------------------------------
   The teal cover that slides in on exit continues on the next subpage and
   slides away, so internal navigation reads as one continuous motion. */

function initCoverContinue() {
  if (!transition || !hasGsap() || reduceMotion) return;
  if (intro) {
    /* index.html replays its own intro, so the intro is the entrance. */
    try { sessionStorage.removeItem('cyy-cover-label'); } catch (error) {}
    document.documentElement.classList.remove('cover-hold');
    return;
  }

  let label = null;
  try { label = sessionStorage.getItem('cyy-cover-label'); } catch (error) {}
  if (!label) return;
  try { sessionStorage.removeItem('cyy-cover-label'); } catch (error) {}

  coverHandoff = true;
  if (transitionTitle) transitionTitle.textContent = label;
  /* The stylesheet's translateY(100%) bakes into GSAP's pixel `y` on first
     touch, so every cover operation must also normalize `y` back to 0. */
  gsap.set(transition, { yPercent: 0, y: 0 });
  /* Hold the opaque cover until the page has painted (window load, or a
     550ms cap) so the reveal never exposes half-loaded content mid-slide. */
  const reveal = () => {
    gsap.to(transition, { yPercent: -100, y: 0, duration: .72, ease: 'power4.inOut' });
    document.documentElement.classList.remove('cover-hold');
  };
  const ready = (document.readyState === 'complete')
    ? Promise.resolve()
    : new Promise((resolve) => {
        window.addEventListener('load', () => resolve(), { once: true });
        setTimeout(resolve, 550);
      });
  ready.then(reveal);
}

/* ------------------------------ Scroll narrative ------------------------------ */

function teardownScrollNarrative() {
  if (hasGsap() && typeof window.ScrollTrigger !== 'undefined') {
    activeTriggers.forEach((trigger) => trigger.kill());
  }
  activeTriggers = [];
  if (typeof window.SplitText !== 'undefined') {
    activeSplits.forEach((split) => split.revert());
  }
  activeSplits = [];
}

function initScrollNarrative() {
  if (!hasGsap() || reduceMotion) return;
  if (document.querySelector('.home-cover')) return;
  if (typeof window.ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  const canSplit = typeof window.SplitText !== 'undefined';
  if (canSplit) gsap.registerPlugin(SplitText);

  const baseDelay = coverHandoff ? .5 : .12;
  const heroTl = gsap.timeline({ delay: baseDelay });

  const title = document.querySelector('.sub-title') || document.querySelector('.contact-panel h1');
  if (title && canSplit) {
    title.classList.add('split-managed');
    const split = new SplitText(title, { type: 'chars', mask: 'chars' });
    activeSplits.push(split);
    heroTl.from(split.chars, { yPercent: 118, duration: .68, stagger: .045, ease: 'power4.out' }, 0);
  }

  const lead = document.querySelector('.sub-lead');
  if (lead && canSplit) {
    lead.classList.add('split-managed');
    const split = new SplitText(lead, { type: 'lines', mask: 'lines' });
    activeSplits.push(split);
    heroTl.from(split.lines, { yPercent: 108, duration: .8, stagger: .09, ease: 'power3.out' }, .08);
  }

  const heroBits = document.querySelectorAll('.sub-index, .subpage-hero .sub-kicker');
  if (heroBits.length) {
    heroTl.from(heroBits, { opacity: 0, y: 16, duration: .6, stagger: .08, ease: 'power3.out' }, 0);
  }

  const contactItems = document.querySelectorAll('.contact-panel > :not(.contact-grid):not(.contact-watermark):not(.contact-marquee):not(h1)');
  if (contactItems.length) {
    heroTl.from(contactItems, { opacity: 0, y: 24, duration: .72, stagger: .09, ease: 'power3.out' }, .12);
  }

  /* The first deck panel enters with the hero; later panels enter on switch. */
  const firstPanel = document.querySelector('.slide-track > .slide-panel:first-child');
  if (firstPanel) {
    heroTl.from(Array.from(firstPanel.children), {
      opacity: 0,
      y: 24,
      duration: .7,
      stagger: .09,
      ease: 'power3.out'
    }, .18);
  }

  gsap.utils.toArray('.content-block:not(.slide-panel), .sub-rail, .course-list > div').forEach((el) => {
    const tween = gsap.from(el, {
      opacity: 0,
      y: 26,
      duration: .78,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
    activeTriggers.push(tween.scrollTrigger);
  });

  /* Rule lines draw in like ink strokes as blocks enter the viewport. */
  gsap.utils.toArray('.content-block:not(:first-child):not(.slide-panel)').forEach((el) => {
    gsap.set(el, { '--rule': 0 });
    const tween = gsap.to(el, {
      '--rule': 1,
      duration: .9,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
    activeTriggers.push(tween.scrollTrigger);
  });

  const metricNum = document.querySelector('.metric-num');
  if (metricNum) {
    const raw = metricNum.textContent.trim();
    const target = parseFloat(raw);
    if (!Number.isNaN(target)) {
      const decimals = (raw.split('.')[1] || '').length;
      const format = (value) => {
        let text = value.toFixed(decimals);
        if (decimals === 0 && raw.length > text.length) text = text.padStart(raw.length, '0');
        return text;
      };
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: metricNum, start: 'top 92%', once: true },
        onUpdate: () => { metricNum.textContent = format(counter.value); }
      });
    }
  }

  ScrollTrigger.refresh();
}

/* Wait for the real webfonts before measuring splits. document.fonts.ready can
   resolve before lazily-queued webfont faces have even started loading, so
   SplitText would measure fallback metrics and clip text once the real faces
   swap in. Explicit face loads fix the early-resolve race; the hard timeout
   covers hanging font requests on restricted networks. */
function whenFontsSettled() {
  if (!document.fonts) return Promise.resolve();
  const faces = [
    '500 1em "Noto Serif SC"',
    '600 1em "Noto Serif SC"',
    '500 1em "Playfair Display"',
    '400 1em "DM Mono"',
    '400 1em "Inter"'
  ].map((face) => document.fonts.load(face).catch(() => {}));
  const timeout = new Promise((resolve) => { setTimeout(resolve, 1800); });
  return Promise.race([Promise.all([document.fonts.ready, ...faces]), timeout]);
}

whenFontsSettled().then(() => initScrollNarrative());

/* Failsafe: shortly after load, force-reveal any reveal target that is still
   hidden inside the viewport (e.g. a trigger whose start moved after a late
   layout change). Elements below the fold keep their scroll reveals. */
function failsafeReveal() {
  if (!hasGsap()) return;
  let revealed = false;
  document.querySelectorAll('.content-block:not(.slide-panel), .sub-rail, .course-list > div, .slide-panel > *').forEach((el) => {
    const rect = el.getBoundingClientRect();
    const clearlyInView = rect.top < window.innerHeight * .92 && rect.bottom > 0;
    /* Only elements stuck at their hidden start state, not ones mid-animation. */
    if (clearlyInView && parseFloat(getComputedStyle(el).opacity) < 0.05) {
      gsap.to(el, { opacity: 1, y: 0, duration: .5, ease: 'power2.out', overwrite: 'auto' });
      revealed = true;
    }
  });
  if (revealed && typeof window.ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

window.addEventListener('load', () => { setTimeout(failsafeReveal, 1500); });

/* ------------------------------ Mono metadata decode ------------------------------ */

function decodeText(el, baseDelay) {
  const original = el.textContent;
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—';
  const duration = 640;
  let start = null;

  function frame(now) {
    if (start === null) start = now;
    const progress = Math.min((now - start) / duration, 1);
    const resolved = Math.floor(progress * original.length);
    let output = original.slice(0, resolved);
    for (let i = resolved; i < original.length; i += 1) {
      const ch = original[i];
      output += (ch === ' ' || ch === '·') ? ch : pool[Math.floor(Math.random() * pool.length)];
    }
    el.textContent = output;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = original;
  }

  setTimeout(() => requestAnimationFrame(frame), baseDelay);
}

function initScramble() {
  if (reduceMotion) return;
  document.querySelectorAll('.decode').forEach((el, index) => {
    decodeText(el, (coverHandoff ? 620 : 180) + index * 140);
  });
}

/* ------------------------------ Slide decks (cases / focus) ------------------------------ */

function initSlideDecks() {
  document.querySelectorAll('[data-deck]').forEach((slider) => {
    if (slider.dataset.deckReady === 'true') return;
    slider.dataset.deckReady = 'true';

    const track = slider.querySelector('.slide-track');
    const panels = track ? Array.from(track.children) : [];
    const scope = slider.closest('.content-main') || document;
    const tabs = Array.from(scope.querySelectorAll('.slide-tab'));
    const progressCurrent = scope.querySelector('.slide-progress b');
    const count = panels.length;
    if (!track || count < 2) return;

    let index = 0;
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    const offsetFor = (i) => -i * slider.clientWidth;
    const render = (x) => { track.style.transform = `translateX(${x}px)`; };

    function setIndex(next, entrance) {
      index = Math.max(0, Math.min(count - 1, next));
      render(offsetFor(index));
      tabs.forEach((tab, ti) => tab.classList.toggle('active', ti === index));
      if (progressCurrent) progressCurrent.textContent = String(index + 1).padStart(2, '0');
      if (entrance && hasGsap() && !reduceMotion) {
        gsap.fromTo(panels[index].children, {
          opacity: 0,
          y: 18
        }, {
          opacity: 1,
          y: 0,
          duration: .5,
          stagger: .07,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'opacity,transform'
        });
      }
    }

    tabs.forEach((tab, ti) => tab.addEventListener('click', () => {
      if (ti !== index) setIndex(ti, true);
    }));

    slider.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('a, button')) return;
      dragging = true;
      startX = event.clientX;
      deltaX = 0;
      slider.classList.add('dragging');
      if (slider.setPointerCapture) {
        try { slider.setPointerCapture(event.pointerId); } catch (error) {}
      }
    });

    slider.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      deltaX = event.clientX - startX;
      let offset = offsetFor(index) + deltaX;
      const min = offsetFor(count - 1);
      /* Rubber-band resistance beyond the first and last slides. */
      if (offset > 0) offset *= .35;
      else if (offset < min) offset = min + (offset - min) * .35;
      render(offset);
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      slider.classList.remove('dragging');
      const threshold = Math.min(90, slider.clientWidth * .18);
      if (deltaX <= -threshold) setIndex(index + 1, true);
      else if (deltaX >= threshold) setIndex(index - 1, true);
      else setIndex(index, false);
      deltaX = 0;
    }
    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', () => render(offsetFor(index)));
  });
}

/* ------------------------------ Ambient effects ------------------------------ */

/* Water ripple: a low-resolution two-buffer wave simulation (the classic
   Hugo Elias 2D water algorithm familiar from p5.js and canvas ripple demos
   on GitHub) rendered as faint wet-ink shading. Moving the pointer stirs the
   paper; clicking drops a bigger pebble. Skipped under reduced motion. */
let lastStir = { x: -1, y: -1 };

function stirWater(clientX, clientY, radius, strength) {
  if (typeof stirWater.sim !== 'undefined') {
    stirWater.sim(clientX, clientY, radius, strength);
  }
}

function initWaterRipple() {
  if (reduceMotion) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'water-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const cardHost = document.getElementById('homeArchiveCard');
  const cardCanvas = cardHost ? document.createElement('canvas') : null;
  const cardCtx = cardCanvas ? cardCanvas.getContext('2d') : null;
  let cardW = 0;
  let cardH = 0;
  if (cardCanvas) {
    cardCanvas.className = 'water-canvas-card';
    cardHost.appendChild(cardCanvas);
  }
  const sim = document.createElement('canvas');
  const simCtx = sim.getContext('2d');
  const CELL = 4;
  const DAMPING = .955;
  const light = document.body.classList.contains('contact-page');
  const RGB = light ? [236, 242, 238] : [31, 58, 60];
  const MAX_ALPHA = light ? 15 : 19;

  let cols = 0;
  let rows = 0;
  let width = 0;
  let height = 0;
  let previous = new Float32Array(0);
  let current = new Float32Array(0);
  let image = null;
  let rafId = 0;
  let lastTime = 0;
  let asleep = false;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
    canvas.width = width;
    canvas.height = height;
    sim.width = cols;
    sim.height = rows;
    previous = new Float32Array(cols * rows);
    current = new Float32Array(cols * rows);
    image = simCtx.createImageData(cols, rows);

    if (cardCanvas) {
      const cr = cardHost.getBoundingClientRect();
      cardW = Math.max(1, Math.round(cr.width));
      cardH = Math.max(1, Math.round(cr.height));
      cardCanvas.width = cardW;
      cardCanvas.height = cardH;
    }
  }

  function disturb(clientX, clientY, radius, strength) {
    const cx = Math.round(clientX / CELL);
    const cy = Math.round(clientY / CELL);
    for (let y = cy - radius; y <= cy + radius; y += 1) {
      for (let x = cx - radius; x <= cx + radius; x += 1) {
        if (x < 1 || y < 1 || x >= cols - 1 || y >= rows - 1) continue;
        const d = Math.hypot(x - cx, y - cy);
        if (d <= radius) current[y * cols + x] += strength * (1 - d / radius);
      }
    }
    if (asleep) {
      asleep = false;
      lastTime = performance.now();
    }
  }

  stirWater.sim = disturb;
  stirWater.isAsleep = () => asleep;

  function step() {
    rafId = requestAnimationFrame(step);
    if (asleep) return;
    const dt = Math.min((performance.now() - lastTime) / 16.7 || 1, 3);
    lastTime = performance.now();

    for (let k = 0; k < dt; k += 1) {
      for (let i = cols; i < current.length - cols; i += 1) {
        const v = (previous[i - 1] + previous[i + 1] + previous[i - cols] + previous[i + cols]) / 2 - current[i];
        current[i] = v * DAMPING;
      }
      const swap = previous;
      previous = current;
      current = swap;
    }

    const data = image.data;
    for (let i = 0, j = 0; i < previous.length; i += 1, j += 4) {
      data[j] = RGB[0];
      data[j + 1] = RGB[1];
      data[j + 2] = RGB[2];
      data[j + 3] = Math.min(Math.abs(previous[i]) * 4, MAX_ALPHA);
    }
    simCtx.putImageData(image, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(sim, 0, 0, width, height);

    if (cardCtx && cardW > 1) {
      const cr = cardHost.getBoundingClientRect();
      if (cr.width > 1) {
        cardCtx.clearRect(0, 0, cardW, cardH);
        cardCtx.imageSmoothingEnabled = true;
        cardCtx.drawImage(sim, cr.left / CELL, cr.top / CELL, cr.width / CELL, cr.height / CELL, 0, 0, cardW, cardH);
      }
    }

    /* When the field settles, stop simulating and painting until stirred. */
    let energy = 0;
    for (let i = 0; i < previous.length; i += 1) energy += Math.abs(previous[i]);
    if (energy < 10) {
      asleep = true;
      ctx.clearRect(0, 0, width, height);
      if (cardCtx) cardCtx.clearRect(0, 0, cardW, cardH);
    }
  }

  function start() {
    cancelAnimationFrame(rafId);
    lastTime = performance.now();
    rafId = requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('click', (event) => {
    if (event.clientX === 0 && event.clientY === 0) return;
    disturb(event.clientX, event.clientY, 3, 60);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else start();
  });
  start();
}



/* Petal drift: blossoms fall through the DOCUMENT, not the viewport — they
   scroll with the page content, steer horizontally away from the pointer
   (never upward), keep their falling shape when they land, and pile up along
   a ground line set just above the page footer. Falls pause when the tab is
   hidden; the whole effect is skipped under prefers-reduced-motion. */
function initPetalDrift() {
  if (reduceMotion) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'petal-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const COLORS = ['#d9a7ad', '#e3bfc3', '#c98d96', '#eecfd2'];
  const RESTING_CAP = 150;
  const pointer = { x: -999, y: -999 };
  let width = 0;
  let height = 0;
  let docHeight = 0;
  let groundY = 0;
  let petals = [];
  const resting = [];
  let rafId = 0;
  let lastTime = 0;

  function measure() {
    docHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    const footerPad = document.querySelector('.home-bottom') ? 92
      : document.querySelector('.contact-marquee') ? 68 : 84;
    groundY = docHeight - footerPad;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    measure();
  }

  function makePetal(anywhere) {
    const scale = width < 720 ? .8 : 1;
    return {
      x: Math.random() * width,
      /* Spawn inside the current viewport or just above it, in document space. */
      y: anywhere
        ? window.scrollY + Math.random() * height * .9
        : window.scrollY - 20 - Math.random() * height * .4,
      size: (6 + Math.random() * 5) * scale,
      speedY: (18 + Math.random() * 16) * scale,
      swayAmp: 14 + Math.random() * 18,
      swayFreq: .4 + Math.random() * .7,
      phase: Math.random() * Math.PI * 2,
      flipFreq: .5 + Math.random() * 1.2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - .5) * 1.6,
      vx: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: .42 + Math.random() * .3,
      state: 'fall',
      settle: 0
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y - window.scrollY);
    ctx.rotate(p.rot);
    ctx.scale(.55 + .45 * Math.abs(Math.sin(p.phase * p.flipFreq)), 1);
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * .8, -p.size * .5, p.size * .6, p.size * .55, 0, p.size);
    ctx.bezierCurveTo(-p.size * .6, p.size * .55, -p.size * .8, -p.size * .5, 0, -p.size);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  function step(now) {
    rafId = requestAnimationFrame(step);
    const dt = Math.min((now - lastTime) / 1000 || 0, .05);
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    const scrollY = window.scrollY;

    /* Resting petals first (culled to the viewport). */
    resting.forEach((p) => {
      const sy = p.y - scrollY;
      if (sy > -30 && sy < height + 30) drawPetal(p);
    });

    for (let i = petals.length - 1; i >= 0; i -= 1) {
      const p = petals[i];
      p.phase += p.swayFreq * dt;
      p.x += Math.sin(p.phase) * p.swayAmp * dt;
      p.y += p.speedY * dt;
      p.x += p.vx * dt;
      p.vx *= .94;
      p.rot += p.rotSpeed * dt;

      /* Horizontal-only avoidance in document space: petals steer sideways
         but never stop falling or drift upward. */
      const dx = p.x - pointer.x;
      const pdy = p.y - (pointer.y + scrollY);
      if (Math.abs(pdy) < 70 && Math.abs(dx) < 100) {
        p.vx += (dx / (Math.abs(dx) || 1)) * 150 * dt * 10;
      }

      if (p.state === 'settle') {
        p.settle += dt;
        p.y = Math.min(p.y + p.speedY * dt * .3, groundY);
        p.rotSpeed *= .9;
        if (p.settle > .45) {
          resting.push(p);
          if (resting.length > RESTING_CAP) resting.shift();
          petals[i] = makePetal(false);
          continue;
        }
      } else if (p.y >= groundY - 2) {
        p.state = 'settle';
        p.settle = 0;
      }

      if (p.x < -30) p.x = width + 24;
      else if (p.x > width + 30) p.x = -24;

      const sy = p.y - scrollY;
      if (sy > -40 && sy < height + 40) drawPetal(p);
    }
  }

  function start() {
    cancelAnimationFrame(rafId);
    lastTime = performance.now();
    rafId = requestAnimationFrame(step);
  }

  resize();
  petals = Array.from({ length: width < 720 ? 12 : 26 }, () => makePetal(true));
  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else start();
  });
  start();
}

/* Scroll progress ink line on scrolling subpages. */
function initScrollInk() {
  if (document.querySelector('.home-cover') || document.querySelector('.contact-panel')) return;
  const line = document.createElement('div');
  line.className = 'scroll-ink';
  document.body.appendChild(line);
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    line.style.transform = `scaleX(${progress})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* Ghost numerals drift a few pixels with the pointer (Drift pattern). */
function initGhostDrift() {
  const slider = document.querySelector('[data-deck]');
  const ghosts = document.querySelectorAll('.panel-ghost');
  if (!slider || !ghosts.length || reduceMotion || !hasGsap() || !finePointer) return;
  slider.addEventListener('mousemove', (event) => {
    const nx = event.clientX / window.innerWidth - .5;
    const ny = event.clientY / window.innerHeight - .5;
    ghosts.forEach((ghost, i) => {
      gsap.to(ghost, { x: nx * (5 + i * 2), y: ny * 4, duration: 1, ease: 'power2.out' });
    });
  });
}

/* Ink splash: every click anywhere presses teal-ink droplets and an
   expanding ring into a fixed overlay at the pointer. */
function initInkSplash() {
  if (reduceMotion || !hasGsap()) return;

  let layer = document.querySelector('.ink-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'ink-layer';
    document.body.appendChild(layer);
  }

  document.addEventListener('click', (event) => {
    /* Ignore synthetic clicks (keyboard activation reports 0,0). */
    if (event.clientX === 0 && event.clientY === 0) return;
    const x = event.clientX;
    const y = event.clientY;

    const ring = document.createElement('span');
    ring.className = 'ink-ring';
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
    layer.appendChild(ring);
    gsap.fromTo(ring, { scale: .15, opacity: .9 }, {
      scale: 1,
      opacity: 0,
      duration: .85,
      ease: 'power2.out',
      onComplete: () => ring.remove()
    });

    for (let i = 0; i < 10; i += 1) {
      const drop = document.createElement('span');
      drop.className = 'ink-drop';
      const size = 4 + Math.random() * 7;
      drop.style.width = size + 'px';
      drop.style.height = size + 'px';
      drop.style.left = x + 'px';
      drop.style.top = y + 'px';
      layer.appendChild(drop);
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 40;
      gsap.to(drop, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * .6 + 10,
        opacity: 0,
        scale: .3,
        duration: .6 + Math.random() * .4,
        ease: 'power2.out',
        onComplete: () => drop.remove()
      });
    }
  });
}

/* ------------------------------ Contact extras ------------------------------ */

function initContactExtras() {
  const panel = document.querySelector('.contact-panel');
  const watermark = document.querySelector('.contact-watermark');
  if (panel && watermark && hasGsap() && !reduceMotion && finePointer) {
    panel.addEventListener('mousemove', (event) => {
      const nx = event.clientX / window.innerWidth - .5;
      const ny = event.clientY / window.innerHeight - .5;
      gsap.to(watermark, { x: nx * 8, y: ny * 6, duration: 1.1, ease: 'power2.out' });
    });
  }

  const copyButton = document.getElementById('copyEmail');
  const emailLink = document.querySelector('.contact-email');
  if (copyButton && emailLink) {
    copyButton.addEventListener('click', async () => {
      const address = (emailLink.getAttribute('href') || '').replace('mailto:', '');
      if (!address) return;
      try {
        await navigator.clipboard.writeText(address);
      } catch (error) {
        const helper = document.createElement('textarea');
        helper.value = address;
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        helper.remove();
      }
      window.clearTimeout(copyButton._resetTimer);
      copyButton.classList.add('copied');
      copyButton.textContent = 'COPIED ✓';
      copyButton._resetTimer = window.setTimeout(() => {
        copyButton.classList.remove('copied');
        copyButton.textContent = currentLang === 'zh' ? '复制' : 'COPY';
      }, 1600);
    });
  }
}

/* ------------------------------ Custom cursor ------------------------------ */

/* A quiet ink dot follows the pointer; hovering interactive elements shoots
   crop-mark corners out of the dot to frame the target. */
function initCursor() {
  if (reduceMotion || !finePointer || !hasGsap()) return;

  const frame = document.createElement('div');
  frame.className = 'cursor-frame';
  frame.innerHTML = '<i></i><i></i><i></i><i></i>';
  document.body.append(frame);

  let hovered = null;
  let frameBusy = false;
  window.addEventListener('mousemove', (event) => {
    /* Stir the water along the pointer path. */
    if (typeof stirWater === 'function' && Math.hypot(event.clientX - lastStir.x, event.clientY - lastStir.y) > 6) {
      lastStir.x = event.clientX;
      lastStir.y = event.clientY;
      stirWater(event.clientX, event.clientY, 1, 14);
    }
  });

  gsap.ticker.add(() => {
    /* Track the framed element while it moves (magnetic nav, scroll). */
    if (hovered && !frameBusy) {
      const r = hovered.getBoundingClientRect();
      gsap.set(frame, { left: r.left, top: r.top, width: r.width, height: r.height });
    }
  });

  function clearHover() {
    if (!hovered) return;
    hovered = null;
    frameBusy = false;
    gsap.to(frame, { opacity: 0, duration: .16, ease: 'power1.out' });
  }

  document.addEventListener('mouseover', (event) => {
    const target = event.target.closest('a, button');
    if (target === hovered) return;
    if (!target) { clearHover(); return; }
    hovered = target;
    frameBusy = true;
    const r = target.getBoundingClientRect();
    /* Brackets shoot out from the dot, then lock onto the element. */
    gsap.set(frame, { left: dotX, top: dotY, width: 0, height: 0 });
    gsap.to(frame, {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
      opacity: 1,
      duration: .3,
      ease: 'power3.out',
      onComplete: () => { frameBusy = false; }
    });
  });

  document.documentElement.addEventListener('mouseleave', clearHover);
}

/* ------------------------------ Magnetic nav ------------------------------ */

function initMagneticNav() {
  if (reduceMotion || !finePointer || !hasGsap()) return;
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('mousemove', (event) => {
      const rect = link.getBoundingClientRect();
      const dx = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (event.clientY - rect.top - rect.height / 2) / rect.height;
      gsap.to(link, { x: dx * 6, y: dy * 4, duration: .4, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { x: 0, y: 0, duration: .55, ease: 'power3.out' });
    });
  });
}

/* ------------------------------ Page transitions ------------------------------ */

function initHomeParallax() {
  const card = document.getElementById('homeArchiveCard');
  if (!card || reduceMotion || !hasGsap() || card.dataset.parallaxReady === 'true') return;
  /* In image mode the picture fills the whole frame, so drift would visibly
     shift the landed card — keep it perfectly static there. The built-in CSS
     card keeps its layered drift because only inner pieces move. */
  if (document.body.classList.contains('card-image-mode')) return;
  card.dataset.parallaxReady = 'true';

  const cys = card.querySelector('.archive-cys');
  const seal = card.querySelector('.archive-seal');
  const paperTwo = card.querySelector('.archive-paper-two');
  const ink = card.querySelector('.archive-ink-block');

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - .5;
    const ny = (event.clientY - rect.top) / rect.height - .5;

    gsap.to(cys, { x: nx * 5, y: ny * 3, duration: .9, ease: 'power2.out' });
    gsap.to(seal, { x: nx * 3, y: ny * 2, duration: 1.0, ease: 'power2.out' });
    gsap.to(paperTwo, { x: nx * 2, y: ny * 1.5, duration: 1.1, ease: 'power2.out' });
    gsap.to(ink, { x: nx * 1.5, y: ny, duration: 1.15, ease: 'power2.out' });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to([cys, seal, paperTwo, ink], { x: 0, y: 0, duration: .9, ease: 'power2.out' });
  });
}

function getTransitionLabel(link) {
  return link.dataset.transitionLabel || link.textContent.trim().toUpperCase() || 'ARCHIVE';
}

function runExitTransition(label, href) {
  if (!transition || reduceMotion || !hasGsap()) {
    window.location.href = href;
    return;
  }

  try { sessionStorage.setItem('cyy-cover-label', label); } catch (error) {}
  if (transitionTitle) transitionTitle.textContent = label;
  gsap.set(transition, { yPercent: 100, y: 0 });
  gsap.to(transition, {
    yPercent: 0,
    y: 0,
    duration: .68,
    ease: 'power4.inOut',
    onComplete: () => { window.location.href = href; }
  });
}

document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    const target = link.getAttribute('target');
    if (!href || target === '_blank' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    runExitTransition(getTransitionLabel(link), href);
  });
});

window.addEventListener('pageshow', () => {
  if (!transition || !hasGsap()) return;
  if (!coverHandoff) gsap.set(transition, { yPercent: 100, y: 0 });
});

/* ------------------------------ Boot ------------------------------ */

/* Optional image card: drop assets/archive-card.webp (or .png), 1.2:1 —
   loader card, flying clone and homepage card all render that picture
   instead of the built-in CSS card. Remove the file(s) to fall back. */
const CARD_IMAGE_CANDIDATES = ['assets/archive-card.webp', 'assets/archive-card.png'];

function initCardImageMode() {
  return new Promise((resolve) => {
    let settled = false;
    const deadline = setTimeout(() => done(null), 800);
    const done = (src) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      if (src) {
        document.body.classList.add('card-image-mode');
        document.querySelectorAll('.archive-card').forEach((card) => {
          if (card.querySelector('.archive-card-img')) return;
          const img = document.createElement('img');
          img.className = 'archive-card-img';
          img.alt = '';
          img.draggable = false;
          img.src = src;
          card.prepend(img);
        });
      }
      resolve(!!src);
    };

    const candidates = CARD_IMAGE_CANDIDATES.slice();
    (function tryNext() {
      const src = candidates.shift();
      if (!src) { done(null); return; }
      const probe = new Image();
      probe.onload = () => done(src);
      probe.onerror = () => tryNext();
      probe.src = src;
    })();
  });
}

initCoverContinue();
initScramble();
initSlideDecks();
initContactExtras();
initCursor();
initMagneticNav();
initPetalDrift();
initWaterRipple();
initScrollInk();
initGhostDrift();
initInkSplash();
initCardImageMode().then(() => playIntro());
