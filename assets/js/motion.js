/* Portfolio — Hady Fofana. Système de mouvement (GSAP).
   Principe : le site fonctionne sans ce fichier. GSAP n'ajoute que du mouvement
   (transform, opacity, clip-path), jamais de contenu, et rien ne bloque le scroll. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  // Sans GSAP : le CSS et main.js assurent l'expérience de base.
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('motion-ok'); return; }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  window.__motion = true;

  gsap.defaults({ ease: 'power3.out' });
  ScrollTrigger.config({ ignoreMobileResize: true });

  var splits = [];

  /* ---------------------------------------------------------------
     Titres : une seule fois, par lignes. Au changement de langue le
     texte est remplacé : on défait les découpages et on laisse le texte brut.
     --------------------------------------------------------------- */
  doc.addEventListener('langchange', function () {
    splits.forEach(function (s) { s.revert(); });
    splits = [];
  });

  /* ---------------------------------------------------------------
     Visite guidée des écrans réels (Tchakeda, ProcheMarket).
     Un écran à la fois ; chaque étape zoome sur la zone qui compte
     (data-focus="x,y,échelle" en % de l'image). La lecture automatique
     passe une seule fois par toutes les étapes, puis s'arrête : les
     boutons permettent d'aller où l'on veut, et de rejouer.
     Sans mouvement : mêmes boutons, changement instantané.
     --------------------------------------------------------------- */
  var STEP_MS = 3000;

  function tour(el, animated) {
    if (el.getAttribute('data-live')) return;
    var list = $('.tour-steps', el);
    var steps = list ? $$('.tour-step', list) : [];
    if (steps.length < 2) return;
    el.setAttribute('data-live', '1');
    el.classList.add('is-live');

    var meta = doc.createElement('div');
    meta.className = 'tour-meta';
    meta.setAttribute('aria-live', 'polite');
    var bar = doc.createElement('div');
    bar.className = 'tour-bar';
    var chipsWrap = doc.createElement('div');
    chipsWrap.className = 'reel-chapters';
    var ref = $('.scene-replay[aria-label]');
    var replay = doc.createElement('button');
    replay.type = 'button';
    replay.className = 'reel-toggle';
    replay.setAttribute('data-i18n-aria', 'scene.replay');
    replay.setAttribute('aria-label', ref ? ref.getAttribute('aria-label') : 'Rejouer');
    replay.innerHTML = '<i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>';

    var chips = steps.map(function (s, i) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'reel-chip';
      b.addEventListener('click', function () { stop(); go(i); });
      chipsWrap.appendChild(b);
      return b;
    });
    bar.appendChild(chipsWrap);
    bar.appendChild(replay);
    list.insertAdjacentElement('afterend', bar);
    list.insertAdjacentElement('afterend', meta);

    var cur = 0, timer = 0;

    function textOf(sel, ctx) { var n = $(sel, ctx); return n ? n.textContent : ''; }
    function render(i) {
      var cap = $('.tour-cap', steps[i]);
      meta.innerHTML = '<span class="tour-count"></span><b></b><span class="tour-text"></span>';
      $('.tour-count', meta).textContent = '0' + (i + 1) + ' / 0' + steps.length;
      $('b', meta).textContent = textOf('b', cap);
      $('.tour-text', meta).textContent = textOf('span', cap);
    }
    function labels() {
      steps.forEach(function (s, i) { chips[i].textContent = textOf('.tour-name', s); });
      render(cur);
    }
    function mark(i) {
      steps.forEach(function (s, k) {
        s.classList.toggle('is-on', k === i);
        chips[k].classList.toggle('is-active', k === i);
        chips[k].setAttribute('aria-pressed', k === i ? 'true' : 'false');
      });
    }
    function go(i) {
      var prev = steps[cur], next = steps[i];
      if (i === cur && !animated) return;
      mark(i);
      render(i);
      var img = $('img', next);
      var f = (next.getAttribute('data-focus') || '50,50,1').split(',');
      img.style.setProperty('--fx', f[0] + '%');
      img.style.setProperty('--fy', f[1] + '%');
      if (animated) {
        if (prev && prev !== next) {
          gsap.to(prev, { autoAlpha: 0, duration: 0.35, overwrite: true, onComplete: function () {
            gsap.set($('img', prev), { scale: 1 });
          } });
        }
        gsap.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, overwrite: true });
        gsap.fromTo(img, { scale: 1 }, { scale: parseFloat(f[2]) || 1, duration: 1.6, delay: 0.55, ease: 'power2.inOut', overwrite: true });
        gsap.fromTo(meta, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
      }
      cur = i;
    }
    function stop() { clearTimeout(timer); }
    function play() {
      stop();
      go(0);
      (function tick() {
        timer = setTimeout(function () {
          if (cur < steps.length - 1) { go(cur + 1); tick(); }
        }, STEP_MS);
      })();
    }

    replay.addEventListener('click', function () { stop(); play(); });
    doc.addEventListener('langchange', labels);
    mark(0);
    labels();

    if (animated) {
      steps.slice(1).forEach(function (s) { gsap.set(s, { autoAlpha: 0 }); });
      ScrollTrigger.create({ trigger: el, start: 'top 65%', once: true, onEnter: function () { play(); } });
    }
  }

  var mm = gsap.matchMedia();

  mm.add({
    motion: '(prefers-reduced-motion: no-preference)',
    parallax: '(min-width: 900px)',
    spine: '(min-width: 1360px)'
  }, function (ctx) {
    var c = ctx.conditions;

    /* ---- Mouvement réduit : tout est visible et à son état final ---- */
    if (!c.motion) {
      root.classList.remove('motion-ok');
      $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
      $$('[data-tour]').forEach(function (el) { tour(el, false); });
      return;
    }

    root.classList.add('has-motion');
    $$('[data-tour]').forEach(function (el) { tour(el, true); });

    /* ---------------------------------------------------------------
       Hero : une entrée, environ 1,6 s, puis plus rien ne bouge seul.
       Le titre (une phrase) apparaît mot par mot (masque), le trait relie
       ensuite les quatre secteurs et la requête le parcourt une fois.
       --------------------------------------------------------------- */
    // Le découpage en lignes dépend des polices : on attend Inter (1,5 s maximum).
    function whenFonts(fn) {
      var done = false;
      function go() { if (!done) { done = true; fn(); } }
      if (doc.fonts && doc.fonts.load) {
        Promise.all([doc.fonts.load('700 48px Inter'), doc.fonts.load('400 20px Inter')])
          .then(function () { return doc.fonts.ready; }).then(go, go);
        setTimeout(go, 700);
      } else { go(); }
    }

    function hero() {
      var eyebrow = $('.hero-eyebrow');
      var title = $('.hero-title');
      var lead = $('.hero-lead');
      var line = $('.hm-line');
      var nodes = $$('.hm-node');
      var packet = $('.hm-packet');
      var ctas = $$('.hero-ctas .btn');
      var photo = $('.hero-photo img');
      if (!title) { root.classList.remove('motion-ok'); return; }
      // Sur mobile (souvent en 4G), le texte est affiché immédiatement : pas d'attente des polices.
      if (!c.parallax) { root.classList.remove('motion-ok'); return; }

      var titleSplit = SplitText ? SplitText.create(title, { type: 'words', mask: 'words', aria: 'none' }) : null;

      // États de départ posés en inline, puis on retire la pré-masque du CSS (pas de flash).
      gsap.set([eyebrow, ctas], { opacity: 0 });
      if (eyebrow) gsap.set(eyebrow, { x: -14 });
      if (ctas.length) gsap.set(ctas, { y: 10 });
      if (line) gsap.set(line, { scaleX: 0 });
      if (nodes.length) gsap.set(nodes, { opacity: 0, y: 6 });
      if (packet) gsap.set(packet, { opacity: 0, x: 0 });
      if (photo) gsap.set(photo, { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.08 });
      if (titleSplit) gsap.set(titleSplit.words, { yPercent: 110 });
      root.classList.remove('motion-ok');

      var tl = gsap.timeline({
        delay: 0.05,
        onComplete: function () {
          // On rend le texte à son état natif : plus de masques ni de découpage résiduel.
          if (titleSplit) titleSplit.revert();
          gsap.set([eyebrow, ctas, line, nodes, photo], { clearProps: 'transform,opacity' });
          if (photo) photo.style.clipPath = '';
        }
      });

      if (photo) tl.to(photo, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.25, ease: 'power4.inOut' }, 0);
      if (eyebrow) tl.to(eyebrow, { opacity: 1, x: 0, duration: 0.7 }, 0.15);
      if (titleSplit) tl.to(titleSplit.words, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.045 }, 0.2);
      if (line) tl.to(line, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.95);
      if (nodes.length) tl.to(nodes, { opacity: 1, y: 0, duration: 0.45, stagger: 0.18 }, 1.0);
      if (packet && line) {
        tl.fromTo(packet,
          { opacity: 0, x: 0 },
          { opacity: 1, x: function () { return line.offsetWidth - 18; }, duration: 1.0, ease: 'power2.inOut' },
          1.45);
        tl.to(packet, { opacity: 0, duration: 0.2 }, '>-0.15');
      }
      if (ctas.length) tl.to(ctas, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.3);

      // Profondeur : la photo remonte un peu moins vite que la page (écran large seulement).
      if (c.parallax && photo) {
        gsap.to(photo, {
          yPercent: -5, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      }
    }
    whenFonts(hero);

    /* ---------------------------------------------------------------
       Révélations : une fois, quand le bloc entre dans la vue.
       Remplace l'IntersectionObserver de main.js.
       --------------------------------------------------------------- */
    $$('.reveal').forEach(function (el) {
      gsap.set(el, { opacity: 0, y: 22 });
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          el.classList.add('is-in');
          el.dispatchEvent(new CustomEvent('reveal-in', { bubbles: true }));
          gsap.to(el, { opacity: 1, y: 0, duration: 0.75, clearProps: 'transform,opacity' });
        }
      });
    });

    /* ---------------------------------------------------------------
       Écrans mobiles de ProcheMarket : les trois téléphones arrivent,
       puis le cadre bleu montre, écran après écran, ce que dit le texte
       (promesse à l'accueil, « Commander » fixé en bas, délais en gros).
       Environ 3 s, une seule fois ; l'état final reste lisible.
       --------------------------------------------------------------- */
    $$('.pm-phones').forEach(function (band) {
      var phones = $$('.pm-phone', band);
      var marks = $$('.pj-hl', band);
      var caps = $$('.pj-cap', band);
      gsap.set(phones, { opacity: 0, y: 36 });
      gsap.set(marks, { opacity: 0, scale: 1.08 });
      gsap.set(caps, { opacity: 0.35 });
      ScrollTrigger.create({
        trigger: band, start: 'top 80%', once: true,
        onEnter: function () {
          var tl = gsap.timeline({ onComplete: function () { gsap.set(phones, { clearProps: 'transform' }); } });
          tl.to(phones, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 });
          marks.forEach(function (m, i) {
            var at = 0.75 + i * 0.7;
            tl.to(m, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, at);
            if (caps[i]) tl.to(caps[i], { opacity: 1, color: '#0e1116', duration: 0.35 }, at);
            if (caps[i]) tl.to(caps[i], { color: '#697282', duration: 0.4 }, at + 0.65);
          });
        }
      });
    });

    /* ---------------------------------------------------------------
       Titres de section : révélés par ligne, une seule fois.
       --------------------------------------------------------------- */
    function titles() {
      $$('.sec-head h2 > [data-i18n]').forEach(function (span) {
        var s = SplitText.create(span, {
          type: 'lines', mask: 'lines', autoSplit: true, aria: 'none',
          onSplit: function (self) {
            return gsap.from(self.lines, {
              yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.08,
              scrollTrigger: { trigger: span, start: 'top 92%', once: true }
            });
          }
        });
        splits.push(s);
      });
      $$('.sec-head .sec-num').forEach(function (n) {
        gsap.from(n, { opacity: 0, x: -8, duration: 0.6,
          scrollTrigger: { trigger: n, start: 'top 92%', once: true } });
      });
    }
    if (SplitText) whenFonts(titles);

    /* ---------------------------------------------------------------
       Fil de la page (écran large) : la requête du hero devient le
       compteur de lecture. Un point suit le scroll le long d'un rail,
       avec un repère par section. Décoratif : masqué aux lecteurs d'écran.
       --------------------------------------------------------------- */
    var cleanSpine = null;
    if (c.spine) {
      var sections = [
        { id: 'hero', key: null, fallback: 'Hady Fofana' },
        { id: 'about', key: 'nav.about' },
        { id: 'portfolio', key: 'nav.portfolio' },
        { id: 'resume', key: 'nav.resume' },
        { id: 'contact', key: 'nav.contact' }
      ].filter(function (s) { return $('#' + s.id); });

      var spine = doc.createElement('div');
      spine.className = 'spine';
      spine.setAttribute('aria-hidden', 'true');
      spine.innerHTML = '<span class="spine-track"></span><span class="spine-packet"></span><ul class="spine-ticks"></ul>';
      doc.body.appendChild(spine);

      var packet = $('.spine-packet', spine);
      var ticksEl = $('.spine-ticks', spine);
      function labelOf(s) {
        var el = s.key ? $('.site-nav [data-i18n="' + s.key + '"]') : null;
        return (el && el.textContent) || s.fallback || s.id;
      }
      var ticks = sections.map(function (s) {
        var li = doc.createElement('li');
        li.innerHTML = '<span class="spine-label"></span>';
        ticksEl.appendChild(li);
        return li;
      });
      function labels() { sections.forEach(function (s, i) { ticks[i].firstChild.textContent = labelOf(s); }); }
      labels();
      doc.addEventListener('langchange', labels);

      var railH = 0;
      function layout() {
        railH = ticksEl.clientHeight;
        var max = ScrollTrigger.maxScroll(window) || 1;
        sections.forEach(function (s, i) {
          var top = $('#' + s.id).getBoundingClientRect().top + window.scrollY;
          ticks[i].style.top = Math.min(100, Math.max(0, (top / max) * 100)) + '%';
        });
      }

      var y = gsap.quickSetter(packet, 'y', 'px');
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) { y(self.progress * Math.max(0, railH - 18)); }
      });

      // Section active : le repère s'allume
      sections.forEach(function (s, i) {
        ScrollTrigger.create({
          trigger: '#' + s.id, start: 'top 55%', end: 'bottom 55%',
          onToggle: function (self) { ticks[i].classList.toggle('is-on', self.isActive); }
        });
      });

      layout();
      ScrollTrigger.addEventListener('refresh', layout);
      gsap.from(spine, { opacity: 0, duration: 0.8, delay: 1.6 });

      cleanSpine = function () { ScrollTrigger.removeEventListener('refresh', layout); doc.removeEventListener('langchange', labels); spine.remove(); };
    }

    return function () { root.classList.remove('has-motion'); if (cleanSpine) cleanSpine(); };
  });
})();
