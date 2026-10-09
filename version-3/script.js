(function ($) {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 800px)').matches;
  let lenis;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  if (window.gsap && window.ScrollTrigger && !reduced) gsap.registerPlugin(ScrollTrigger);

  // Intro loader — number fills, line finishes exactly at 100%.
  const loader = document.querySelector('.loader');
  if (loader && !reduced) {
    const pct = loader.querySelector('.loader__percent');
    const number = loader.querySelector('.loader__number');
    gsap.to({ value: 0 }, { value: 100, duration: 2.05, ease: 'power2.inOut', onUpdate: function () {
      const value = Math.round(this.targets()[0].value);
      pct.textContent = String(value).padStart(2, '0') + '%';
      number.style.setProperty('--fill', value + '%');
      loader.querySelector('.loader__line i').style.width = value + '%';
    }, onComplete: function () {
      gsap.timeline().to(loader.querySelector('.loader__number'), { scale: 1.2, duration: .28, ease: 'power2.in' }).to(loader, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'power4.inOut' }).set(loader, { display: 'none' });
      gsap.from('.hero__copy > *', { y: 70, opacity: 0, stagger: .12, duration: 1.1, ease: 'power4.out', delay: .25 });
      gsap.from('.hero__core', { scale: .45, opacity: 0, rotate: -30, duration: 1.5, ease: 'expo.out', delay: .2 });
    }});
  } else if (loader) loader.style.display = 'none';

  // Mouse-follow cursor and magnetic feel.
  const cursor = document.querySelector('.cursor');
  if (cursor && !mobile) {
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function cursorLoop() { cx += (tx - cx) * .18; cy += (ty - cy) * .18; cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; requestAnimationFrame(cursorLoop); }
    cursorLoop();
    document.querySelectorAll('a,button,.journey-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  // Full-screen radial menu.
  let menuOpen = false;
  const menu = document.querySelector('.menu-overlay');
  const menuToggle = document.querySelector('.menu-toggle');
  function setMenu(open) {
    menuOpen = open; menuToggle.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
    if (window.gsap) gsap.to(menu, { autoAlpha: open ? 1 : 0, clipPath: open ? 'circle(150% at calc(100% - 60px) 45px)' : 'circle(0% at calc(100% - 60px) 45px)', duration: .85, ease: 'power4.inOut', onStart: () => { if (open) menu.style.visibility = 'visible'; }, onComplete: () => { if (!open) menu.style.visibility = 'hidden'; } });
    else menu.style.visibility = open ? 'visible' : 'hidden';
  }
  menuToggle.addEventListener('click', () => setMenu(!menuOpen));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Particle field: 3D-ish projected points, repelled by pointer and gently orbiting.
  function createParticleField(canvasId, count, accent) {
    const canvas = document.getElementById(canvasId); if (!canvas) return;
    const ctx = canvas.getContext('2d'); let w, h, dpr, particles = [], mouse = { x: -9999, y: -9999 }, scroll = 0;
    function resize() { dpr = Math.min(devicePixelRatio || 1, 2); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); particles = Array.from({ length: count }, () => ({ x: (Math.random() - .5) * w * 1.4, y: (Math.random() - .5) * h * 1.4, z: Math.random() * 1.5 + .2, r: Math.random() * 1.6 + .3, a: Math.random() * .65 + .15, phase: Math.random() * Math.PI * 2, speed: (Math.random() - .5) * .006 })); }
    window.addEventListener('resize', resize); window.addEventListener('mousemove', e => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left - w / 2; mouse.y = e.clientY - rect.top - h / 2; });
    window.addEventListener('scroll', () => { scroll = window.scrollY; }, { passive: true }); resize();
    function draw(t) {
      ctx.clearRect(0, 0, w, h); const cx = w / 2, cy = h / 2; const points = [];
      for (const p of particles) {
        p.phase += p.speed; let px = p.x + Math.sin(p.phase + t * .00015) * 18; let py = p.y + Math.cos(p.phase + t * .00013) * 18;
        const dx = px - mouse.x, dy = py - mouse.y, dist = Math.hypot(dx, dy);
        if (dist < 125) { const force = (125 - dist) / 125; px += (dx / (dist || 1)) * force * 48; py += (dy / (dist || 1)) * force * 48; }
        const perspective = 1 / p.z; const x = cx + px * perspective * .68; const y = cy + py * perspective * .68 + Math.sin(t * .00035 + p.phase) * 4;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
        const radius = Math.max(.25, p.r * perspective * .7); ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = accent && Math.sin(p.phase) > .6 ? `rgba(239,48,40,${p.a})` : `rgba(232,231,225,${p.a * .75})`; ctx.fill();
        points.push({ x, y, a: p.a });
      }
      // Connect close neighbours: fine constellation threads, deliberately sparse.
      const limit = canvasId === 'particle-field' ? 92 : 72;
      for (let i = 0; i < points.length; i += 3) for (let j = i + 1; j < Math.min(i + 9, points.length); j++) { const dx = points[i].x - points[j].x, dy = points[i].y - points[j].y, dist = Math.hypot(dx, dy); if (dist < limit) { ctx.strokeStyle = `rgba(${accent ? '239,48,40' : '220,255,90'},${(1 - dist / limit) * .11})`; ctx.lineWidth = .55; ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y); ctx.stroke(); } }
      if (!reduced) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
  createParticleField('particle-field', mobile ? 260 : 540, true);
  createParticleField('final-particles', mobile ? 150 : 300, false);

  // Scroll choreography: each new scene physically takes over; outgoing scene zooms away.
  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.utils.toArray('.scene').forEach((scene, i, scenes) => {
      const next = scenes[i + 1];
      if (next) {
        ScrollTrigger.create({ trigger: scene, start: 'top top', end: 'bottom top', scrub: true, onUpdate: self => {
          const p = self.progress;
          if (scene.id === 'home') { gsap.set(scene.querySelector('.hero__core'), { scale: 1 + p * .48, rotation: p * 22, opacity: 1 - p * .72 }); gsap.set(scene.querySelector('.hero__copy'), { y: -p * 100, opacity: 1 - p * .55 }); gsap.set(scene.querySelector('#particle-field'), { opacity: 1 - p * .8 }); }
          if (scene.id === 'origin') { gsap.set(scene.querySelector('.origin__orb'), { scale: 1 - p * .78, x: p * 100, y: -p * 150, opacity: 1 - p * .65 }); gsap.set(scene.querySelector('.origin__layout'), { scale: 1 - p * .08, y: -p * 70 }); }
          if (scene.id === 'journey') { gsap.set(scene.querySelector('.journey__image'), { scale: 1.08 + p * .2, x: -p * 50 }); gsap.set(scene.querySelector('.journey__headline'), { x: -p * 100, opacity: 1 - p * .45 }); gsap.set(scene.querySelector('.journey-slider'), { y: -p * 100, scale: 1 - p * .1 }); }
          if (scene.id === 'worlds') { gsap.set(scene.querySelector('.world-stage__frame'), { scale: 1 + p * .16, rotation: p * -3, x: p * 45 }); gsap.set(scene.querySelector('.worlds__left'), { x: -p * 75, opacity: 1 - p * .3 }); }
          if (scene.id === 'impact') { gsap.set(scene.querySelector('.impact__video-wrap'), { clipPath: `inset(${p * 48}% ${p * 30}% ${p * 48}% ${p * 30}% round ${p * 50}px)` }); gsap.set(scene.querySelector('.impact__content'), { scale: 1 - p * .18, y: -p * 60 }); }
          if (scene.id === 'values') { gsap.set(scene.querySelector('.values__orbit'), { scale: 1 + p * 1.5, x: p * 140, y: -p * 100, opacity: 1 - p * .7 }); gsap.set(scene.querySelector('.value-list'), { y: -p * 100, scale: 1 - p * .1 }); }
        }});
      }
      // THE WHOLE NEXT SECTION TAKES OVER THE PREVIOUS ONE.
      // It rises from below, scales into the viewport and uncovers through a hard mask.
      // This is deliberately applied to the scene itself, not just its inner text.
      if (i > 0) {
        const maskStart = i % 3 === 1 ? 'inset(0 0 100% 0)' : (i % 3 === 2 ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)');
        const transformOrigin = i % 3 === 2 ? 'left center' : 'center bottom';
        gsap.fromTo(scene,
          { clipPath: maskStart, scale: 0.88, y: 70, transformOrigin },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, y: 0, ease: 'none',
            scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top top', scrub: 0.65, invalidateOnRefresh: true } }
        );
        const content = scene.querySelector('.origin__layout, .journey__headline, .journey-slider, .worlds__left, .world-stage__frame, .impact__content, .values__top, .value-list, .together__content');
        if (content) gsap.fromTo(content, { y: 95, scale: .88, clipPath: 'inset(12% 0 12% 0)', opacity: .4 }, { y: 0, scale: 1, clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: scene, start: 'top 78%', end: 'top 28%', scrub: .6 } });
      }
    });
    // Kinetic headings reveal each line from a hard clipping window.
    gsap.utils.toArray('.origin__copy h2, .journey__headline h2, .worlds__left h2, .impact__content h2, .values__top h2, .together__content h2').forEach(h => {
      const words = h.innerHTML.split(/<br\s*\/?\s*>/i); h.innerHTML = words.map(word => `<span class="heading-mask"><span>${word}</span></span>`).join('<br>');
      gsap.from(h.querySelectorAll('.heading-mask > span'), { yPercent: 120, rotate: 3, stagger: .1, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 82%' } });
    });
    gsap.utils.toArray('.origin__year strong,.values__kinetic-mark,.impact-stats').forEach(el => gsap.from(el, { scale: .65, rotate: -8, opacity: 0, duration: 1.2, ease: 'back.out(1.3)', scrollTrigger: { trigger: el, start: 'top 85%' } }));
    gsap.utils.toArray('.value-item').forEach((item, i) => gsap.from(item, { x: i % 2 ? 70 : -70, opacity: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 92%' } }));
    // Recount the impact figures whenever the visitor scrolls into this section, in either direction.
    function animateImpactCounters() {
      gsap.utils.toArray('.impact-stats strong').forEach(el => {
        const end = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        gsap.killTweensOf(el);
        el.textContent = '0' + suffix;
        gsap.to({ n: 0 }, { n: end, duration: 1.8, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(this.targets()[0].n) + suffix; } });
      });
    }
    ScrollTrigger.create({ trigger: '#impact', start: 'top 72%', onEnter: animateImpactCounters, onEnterBack: animateImpactCounters });
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: self => { document.querySelector('.scroll-progress i').style.width = (self.progress * 100) + '%'; } });
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { document.querySelector('.scroll-progress i').style.width = (self.progress * 100) + '%'; } });
    gsap.to('.journey__image', { backgroundPosition: '50% 100%', ease: 'none', scrollTrigger: { trigger: '.journey', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // Journey slider: tactile drag + arrows + keyboard.
  const track = document.querySelector('.journey-slider__track'); const cards = Array.from(document.querySelectorAll('.journey-card')); let activeSlide = 0, dragStart = null, dragDelta = 0;
  function setSlide(index) {
    activeSlide = Math.max(0, Math.min(cards.length - 1, index)); cards.forEach((card, i) => card.classList.toggle('is-active', i === activeSlide));
    const card = cards[activeSlide]; const x = card.offsetLeft - cards[0].offsetLeft; if (window.gsap) gsap.set(track, { x: -x }); else track.style.transform = `translateX(${-x}px)`;
    document.querySelector('.slider-current').textContent = String(activeSlide + 1).padStart(2, '0'); document.querySelector('.slider-progress i').style.width = ((activeSlide + 1) / cards.length * 100) + '%';
  }
  document.querySelector('.slider-prev').addEventListener('click', () => setSlide(activeSlide - 1)); document.querySelector('.slider-next').addEventListener('click', () => setSlide(activeSlide + 1));
  track.addEventListener('pointerdown', e => { dragStart = e.clientX; dragDelta = 0; track.setPointerCapture(e.pointerId); track.style.transition = 'none'; });
  track.addEventListener('pointermove', e => { if (dragStart !== null) { dragDelta = e.clientX - dragStart; track.style.transform = `translateX(${-(cards[activeSlide].offsetLeft - cards[0].offsetLeft) + dragDelta}px)`; } });
  function endDrag() { if (dragStart !== null) { track.style.transition = ''; if (Math.abs(dragDelta) > 55) setSlide(activeSlide + (dragDelta < 0 ? 1 : -1)); else setSlide(activeSlide); dragStart = null; dragDelta = 0; } }
  track.addEventListener('pointerup', endDrag); track.addEventListener('pointercancel', endDrag); window.addEventListener('resize', () => setSlide(activeSlide));

  // Many Worlds slider: the active world follows page scroll; dots remain clickable.
  const worldNames = ['MOBILITY', 'AGRICULTURE', 'TECHNOLOGY', 'ENERGY'];
  const worldDots = Array.from(document.querySelectorAll('.worlds__dots button'));
  const worldVisuals = Array.from(document.querySelectorAll('.world-visual'));
  function setWorld(index) {
    index = Math.max(0, Math.min(worldNames.length - 1, index));
    worldDots.forEach((btn, i) => btn.classList.toggle('is-active', i === index));
    worldVisuals.forEach((visual, i) => visual.classList.toggle('is-active', i === index));
    document.querySelector('.worlds__current').textContent = String(index + 1).padStart(2, '0');
    document.querySelector('.world-stage__index span').textContent = String(index + 1).padStart(2, '0');
    document.querySelector('.world-stage__caption span').textContent = String(index + 1).padStart(2, '0') + ' — ' + worldNames[index];
  }
  worldDots.forEach(btn => btn.addEventListener('click', () => setWorld(Number(btn.dataset.world))));

  // Scroll-driven horizontal journey: vertical page scroll scrubs through the timeline.
  // The existing section layout and all other scenes remain unchanged.
  if (window.gsap && window.ScrollTrigger && !reduced) {
    ScrollTrigger.create({
      trigger: '#journey', start: 'top top', end: 'bottom top', scrub: true,
      invalidateOnRefresh: true,
      onEnter: () => track.classList.add('is-scroll-controlled'),
      onEnterBack: () => track.classList.add('is-scroll-controlled'),
      onLeave: () => track.classList.remove('is-scroll-controlled'),
      onLeaveBack: () => track.classList.remove('is-scroll-controlled'),
      onUpdate: self => {
        const maxX = Math.max(0, track.scrollWidth - document.querySelector('.journey-slider').clientWidth);
        gsap.set(track, { x: -maxX * self.progress });
        const index = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
        cards.forEach((card, i) => card.classList.toggle('is-active', i === index));
        document.querySelector('.slider-current').textContent = String(index + 1).padStart(2, '0');
        document.querySelector('.slider-progress i').style.width = ((index + 1) / cards.length * 100) + '%';
      }
    });
    // The four world visuals advance in sequence as the visitor scrolls through this section.
    ScrollTrigger.create({
      trigger: '#worlds', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: self => setWorld(Math.min(worldNames.length - 1, Math.floor(self.progress * worldNames.length)))
    });
  }
  document.querySelectorAll('.world-visual').forEach(visual => { visual.addEventListener('mousemove', e => { const r = visual.getBoundingClientRect(); const rx = (e.clientX - r.left) / r.width - .5; const ry = (e.clientY - r.top) / r.height - .5; const shape = visual.querySelector('.world-visual__shape'); if (shape) shape.style.transform = `translate(${rx * 25}px,${ry * 25}px) rotate(${rx * 20}deg)`; }); });

  // Expandable value rows.
  document.querySelectorAll('.value-item').forEach(item => item.addEventListener('click', () => { document.querySelectorAll('.value-item').forEach(other => other.classList.toggle('is-open', other === item)); }));

  // Hover parallax on hero object; reduced motion leaves a calm static scene.
  if (!reduced && !mobile) {
    const hero = document.querySelector('.hero'); const core = document.querySelector('.hero__core');
    hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5; const y = (e.clientY - r.top) / r.height - .5; core.style.marginLeft = (x * 25) + 'px'; core.style.marginTop = (y * 25) + 'px'; });
    hero.addEventListener('mouseleave', () => { core.style.marginLeft = ''; core.style.marginTop = ''; });
  }
  // Keep in-page links working with Lenis if enabled.
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => { const target = document.querySelector(link.getAttribute('href')); if (target && lenis && !menuOpen) { e.preventDefault(); lenis.scrollTo(target, { offset: 0, duration: 1.25 }); } }));
})(jQuery);
