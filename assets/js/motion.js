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
  if (!window.gsap) { root.classList.remove('motion-ok'); return; }

  // ScrollTrigger et SplitText ne sont chargés que sur grand écran (voir index.html) :
  // ils servent à l'entrée du hero, au parallaxe et au fil de la page, absents sur mobile.
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  window.__motion = true;

  gsap.defaults({ ease: 'power3.out' });
  if (ScrollTrigger) ScrollTrigger.config({ ignoreMobileResize: true });

  var splits = [];

  /* Déclenchement « une seule fois, à l'entrée dans l'écran ».
     Un IntersectionObserver partagé par marge, au lieu d'un ScrollTrigger par
     élément : le navigateur fait le calcul, sans relire la mise en page au chargement.
     ScrollTrigger reste réservé à ce qui suit le scroll en continu (fil, parallaxe).
     bottom : la ligne de déclenchement, en % depuis le bas (10 = « top 90% »). */
  var onceObservers = {};
  function onceVisible(el, fn, bottom) {
    var key = bottom || 10;
    var entry = onceObservers[key];
    if (!entry) {
      var map = new Map();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          var cb = map.get(e.target);
          map.delete(e.target);
          if (cb) cb();
        });
      }, { rootMargin: '0px 0px -' + key + '% 0px' });
      entry = onceObservers[key] = { io: io, map: map };
    }
    entry.map.set(el, fn);
    entry.io.observe(el);
  }

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
     Avec mouvement, chaque visite est un court film monté « sur l'action » :
     un curseur fait le parcours d'un vrai client et chaque clic produit
     l'écran suivant (coupe franche, comme une vraie navigation). La caméra
     cadre ce qui compte pendant le geste, revient au plan large, puis le
     film reprend au début en fondu (lecture en boucle, en pause hors écran).
     Les boutons permettent d'aller où l'on veut, et de rejouer.
     Sans mouvement : mêmes boutons, changement instantané, aucun curseur.
     --------------------------------------------------------------- */

  /* Scripts, en % de l'écran capturé (x, y depuis le coin haut gauche).
     cam     : cadrage au moment de la coupe [échelle, x, y du point fixe]
     patches : [x, y, l, h, couleur du fond, rond?] : une pièce de la couleur
               exacte du fond masque un élément de la capture (ligne de panier,
               pastille…) jusqu'à l'action qui le fait apparaître.
     acts    : in · wait s · move x y [cam] · cam s x y durée · click
               · reveal n · print n durée · fly x y [cam] */
  var SCRIPTS = {
    tchakeda: [
      { // Tableau de bord → on ouvre le point de vente (« Feere kɛ yɔrɔ »)
        acts: [['in'], ['wait', 0.7], ['move', 66.8, 24.5, [1.4, 67, 25]],
          ['wait', 0.5], ['click']]
      },
      { // Caisse : deux articles, le panier et le total se remplissent
        patches: [
          [72.8, 12.9, 26.6, 4.9, '#f5f7fb'], [72.8, 17.8, 26.6, 5, '#f5f7fb'],
          [15.9, 37.6, 2.5, 4.3, '#fff', 1], [44.3, 37.6, 2.5, 4.3, '#fff', 1],
          [88, 50.1, 11.4, 3.7, '#f1f5f9'], [73, 8.1, 7, 3.6, '#f5f7fb']
        ],
        acts: [['wait', 0.45], ['move', 22.5, 46], ['click'], ['reveal', 2], ['reveal', 0],
          ['wait', 0.3], ['move', 50.8, 46], ['click'], ['reveal', 3], ['reveal', 1], ['reveal', 5], ['reveal', 4],
          ['wait', 0.5], ['move', 86.1, 94.6, [1.35, 86, 92]],
          ['wait', 0.45], ['click']]
      },
      { // Paiement : espèces, montant saisi, rien à rendre → valider
        acts: [['wait', 0.3], ['move', 69.2, 18.8, [1.25, 62, 30]], ['wait', 0.2], ['click'],
          ['wait', 1.4],
          ['move', 74.8, 77, [1.3, 74, 78]], ['wait', 0.4], ['click']]
      },
      { // Reçu : il s'imprime, puis le curseur s'arrête sur l'envoi WhatsApp
        patches: [[62.3, 11.2, 25.4, 84, '#ececec']],
        acts: [['wait', 0.2], ['print', 0, 1.5], ['wait', 1.55],
          ['move', 14.3, 62.2], ['wait', 0.7]]
      }
    ],
    prochemarket: [
      { // Accueil : on lit la promesse, puis on clique sur la montre mise en avant
        acts: [['in'], ['wait', 0.9], ['move', 85.3, 38.2, [1.35, 82, 38]],
          ['wait', 0.5], ['click']]
      },
      { // Fiche produit : Vue 360°, ajout au panier, la requête rejoint le compteur
        patches: [[85.15, 2.35, 1.9, 2.9, '#fff', 1]],
        acts: [['wait', 0.95],
          ['move', 78.3, 52.8, [1.25, 72, 45]], ['wait', 0.4], ['click'],
          ['fly', 86.1, 3.8, [1.25, 86, 6]], ['reveal', 0], ['wait', 0.35],
          ['move', 87.8, 5.2], ['wait', 0.4], ['click']]
      },
      { // Panier : les règles rappelées, puis « Passer la commande »
        acts: [['wait', 1.6],
          ['move', 80.7, 58.6, [1.3, 80, 57]], ['wait', 0.45], ['click']]
      },
      { // Commande : autres régions → le trajet et la date s'affichent → confirmer
        cam: [1.6, 0, 30],
        patches: [[38.9, 93, 8.4, 4.2, '#b44a23']],
        acts: [['wait', 0.3], ['move', 48.8, 29.3], ['wait', 0.2], ['click'],
          ['wait', 1.45],
          ['move', 36, 95, [1.6, 0, 95]], ['wait', 0.4], ['click']]
      },
      { // Confirmation : merci, puis « la suite » (appel, délai, paiement)
        cam: [1.2, 50, 20],
        acts: [['wait', 1.2],
          ['cam', 1.2, 50, 88, 1.2], ['wait', 1.05]]
      }
    ]
  };

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

    var onChip = function () {}, onReplay = function () {};
    var chips = steps.map(function (s, i) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'reel-chip';
      b.addEventListener('click', function () { onChip(i); });
      chipsWrap.appendChild(b);
      return b;
    });
    replay.addEventListener('click', function () { onReplay(); });
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
    // Légende : l'ancienne s'efface vers le haut, la nouvelle monte (texte puis détail)
    function show(i) {
      if (i === cur && meta.firstChild) { mark(i); return; }
      cur = i;
      mark(i);
      render(i);
      if (animated) {
        gsap.fromTo(meta.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out', overwrite: true });
      }
    }

    doc.addEventListener('langchange', labels);
    mark(0);
    labels();

    var script = animated && SCRIPTS[el.getAttribute('data-tour')];
    if (script && script.length === steps.length) {
      film(el, list, steps, script, { show: show, chips: chips, setChip: function (fn) { onChip = fn; }, setReplay: function (fn) { onReplay = fn; } });
      return;
    }

    /* Version simple (sans script, ou mouvement réduit) */
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
    onChip = function (i) { stop(); go(i); };
    onReplay = function () { stop(); play(); };

    if (animated) {
      steps.slice(1).forEach(function (s) { gsap.set(s, { autoAlpha: 0 }); });
      onceVisible(el, play, 35);
    }
  }

  /* Le film : une seule timeline GSAP, donc rejouable, et chaque chapitre
     est un label sur lequel on peut sauter (les états se recalculent). */
  function film(el, list, steps, script, ui) {
    el.classList.add('is-film');

    // Fenêtre fixe ; la liste des écrans devient la « caméra » qu'on déplace dedans.
    var view = doc.createElement('div');
    view.className = 'tour-view';
    list.parentNode.insertBefore(view, list);
    view.appendChild(list);

    function add(cls, parent, html) {
      var n = doc.createElement('span');
      n.className = cls;
      n.setAttribute('aria-hidden', 'true');
      if (html) n.innerHTML = html;
      parent.appendChild(n);
      return n;
    }
    function box(n, r) {
      n.style.left = r[0] + '%'; n.style.top = r[1] + '%';
      n.style.width = r[2] + '%'; n.style.height = r[3] + '%';
      if (r[4] === 1) n.classList.add('is-round');
      return n;
    }

    var cursor = add('tour-cursor', view, '<svg viewBox="0 0 18 24" width="18" height="24"><path d="M1.5 1.5v17.7l4.7-4.4 3 7 3.2-1.4-3-6.9h6.5z"/></svg>');
    var ripple = add('tour-ripple', view);
    var dot = add('tour-dot', view);

    // Tout ce qui bouge est un objet de valeurs ; paint() les traduit en pixels.
    // Caméra : point fixe (x, y) en % et échelle s. Curseur, onde et requête : en % de la fenêtre.
    var cam = { s: 1, x: 50, y: 50 };
    var ptr = { x: 78, y: 84, o: 0, p: 1 };
    var rip = { x: 0, y: 0, o: 0, s: 0.3 };
    var fly = { x: 0, y: 0, o: 0, s: 1 };
    var W = 1, H = 1;

    function px(v, size) { return (v * size / 100).toFixed(2) + 'px'; }
    function paint() {
      list.style.transform = 'translate3d(' + px(cam.x * (1 - cam.s), W) + ',' + px(cam.y * (1 - cam.s), H) + ',0) scale(' + cam.s + ')';
      cursor.style.transform = 'translate3d(' + px(ptr.x, W) + ',' + px(ptr.y, H) + ',0) scale(' + ptr.p + ')';
      cursor.style.opacity = ptr.o;
      ripple.style.transform = 'translate3d(' + px(rip.x, W) + ',' + px(rip.y, H) + ',0) scale(' + rip.s + ')';
      ripple.style.opacity = rip.o;
      dot.style.transform = 'translate3d(' + px(fly.x, W) + ',' + px(fly.y, H) + ',0) scale(' + fly.s + ')';
      dot.style.opacity = fly.o;
    }
    function measure() { W = view.clientWidth || 1; H = view.clientHeight || 1; paint(); }

    // Au montage, on suit où seront la caméra et le curseur (cs, pos) pour viser juste.
    var cs = { s: 1, x: 50, y: 50 };
    var pos = { x: ptr.x, y: ptr.y };
    function onScreen(p, c) { return { x: c.x + (p[0] - c.x) * c.s, y: c.y + (p[1] - c.y) * c.s }; }
    function inShot(p, c) { return { x: c.x + (p.x - c.x) / c.s, y: c.y + (p.y - c.y) / c.s }; }
    function camOf(a) { return { s: a[0], x: a[1], y: a[2] }; }

    // En boucle : à la fin, le premier écran revient en fondu et tout recommence.
    var tl = gsap.timeline({ paused: true, repeat: -1, onUpdate: paint, onRepeat: function () { ui.show(0); } });
    var t = 0, starts = [];
    tl.set(cam, { s: 1, x: 50, y: 50 }, 0).set(ptr, { x: ptr.x, y: ptr.y, o: 0, p: 1 }, 0);
    steps.slice(1).forEach(function (s) { gsap.set(s, { autoAlpha: 0 }); });

    steps.forEach(function (step, i) {
      var sc = script[i];
      var patches = (sc.patches || []).map(function (p) {
        var n = box(add('tour-patch', step), p[5] ? p.slice(0, 4).concat(1) : p.slice(0, 4));
        n.style.background = p[4];
        return { el: n };
      });

      starts.push(t);
      tl.addLabel('s' + i, t);
      tl.call(ui.show, [i], t);

      if (i > 0) {
        // Coupe franche au clic : l'écran change d'un coup (comme la vraie page),
        // puis se pose depuis le point cliqué. Le curseur, lui, ne bouge pas.
        var c0 = camOf(sc.cam || [1, 50, 50]);
        var o = inShot(pos, c0);
        tl.set(steps[i - 1], { autoAlpha: 0 }, t)
          .set(step, { autoAlpha: 1 }, t)
          .set(cam, { s: c0.s, x: c0.x, y: c0.y }, t)
          .fromTo(step, { scale: 1.02, transformOrigin: o.x + '% ' + o.y + '%' },
            { scale: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, t);
        cs = c0;
        t += 0.25;
      }

      sc.acts.forEach(function (a) {
        var k = a[0], to, d;
        if (k === 'in') {
          tl.to(ptr, { o: 1, duration: 0.3, ease: 'power1.out' }, t);
        } else if (k === 'wait') {
          t += a[1];
        } else if (k === 'cam') {
          tl.to(cam, { s: a[1], x: a[2], y: a[3], duration: a[4], ease: 'power3.inOut' }, t);
          cs = { s: a[1], x: a[2], y: a[3] };
          t += a[4] * 0.6;
        } else if (k === 'move') {
          // La caméra part un peu avant la main et arrive un peu après : on la sent guider.
          var target = a[3] ? camOf(a[3]) : cs;
          to = onScreen([a[1], a[2]], target);
          var dx = to.x - pos.x, dy = to.y - pos.y;
          d = Math.min(1.05, Math.max(0.5, 0.4 + Math.sqrt(dx * dx + dy * dy) / 100 * 0.85));
          if (a[3]) tl.to(cam, { s: target.s, x: target.x, y: target.y, duration: d + 0.25, ease: 'power3.inOut' }, t - 0.05);
          // Deux courbes différentes sur x et y : la trajectoire s'arrondit, comme une vraie main.
          tl.to(ptr, { x: to.x, duration: d, ease: 'power2.inOut' }, t)
            .to(ptr, { y: to.y, duration: d, ease: 'power1.inOut' }, t);
          cs = target;
          pos = to;
          t += d + (a[3] ? 0.2 : 0);
        } else if (k === 'click') {
          // Appui (0,09 s), onde à la couleur de la requête, relâché (0,22 s).
          tl.to(ptr, { p: 0.8, duration: 0.09, ease: 'power2.out' }, t)
            .set(rip, { x: pos.x, y: pos.y }, t + 0.05)
            .fromTo(rip, { o: 0.6, s: 0.3 }, { o: 0, s: 1, duration: 0.55, ease: 'power2.out', immediateRender: false }, t + 0.05)
            .to(ptr, { p: 1, duration: 0.22, ease: 'power2.out' }, t + 0.11);
          t += 0.16;
        } else if (k === 'reveal') {
          // L'élément apparaît : la pièce qui le masquait s'efface.
          tl.to(patches[a[1]].el, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, t);
          t += 0.12;
        } else if (k === 'print') {
          // Le reçu sort de l'imprimante : révélé de haut en bas.
          tl.fromTo(patches[a[1]].el, { scaleY: 1 }, { scaleY: 0, transformOrigin: '50% 100%', duration: a[2], ease: 'power1.inOut', immediateRender: false }, t);
          t += a[2] * 0.5;
        } else if (k === 'fly') {
          // La requête quitte le bouton et rejoint le panier, en arc.
          var tc = a[3] ? camOf(a[3]) : cs;
          to = onScreen([a[1], a[2]], tc);
          d = 0.7;
          if (a[3]) tl.to(cam, { s: tc.s, x: tc.x, y: tc.y, duration: d + 0.2, ease: 'power3.inOut' }, t);
          tl.set(fly, { x: pos.x, y: pos.y, o: 1, s: 1 }, t)
            .to(fly, { x: to.x, duration: d, ease: 'power1.inOut' }, t)
            .to(fly, { y: to.y, duration: d, ease: 'power3.in' }, t)
            .to(fly, { s: 0.4, o: 0, duration: 0.15, ease: 'power1.in' }, t + d - 0.05);
          // Le curseur reste où il a cliqué : à l'écran, il suit la caméra
          var held = inShot(pos, cs);
          pos = onScreen([held.x, held.y], tc);
          tl.to(ptr, { x: pos.x, y: pos.y, duration: d + 0.2, ease: 'power3.inOut' }, t);
          cs = tc;
          t += d;
        }
      });
    });

    // Dernière image : plan large et lisible, la main se retire.
    t += 0.5;
    tl.to(cam, { s: 1, x: 50, y: 50, duration: 1.1, ease: 'power3.inOut' }, t)
      .to(ptr, { o: 0, duration: 0.4, ease: 'power1.in' }, t + 0.5);
    t += 1.1 + 1.2;
    // Retour au premier écran : il réapparaît sous le dernier, qui s'efface.
    tl.set(steps[0], { autoAlpha: 1 }, t)
      .to(steps[steps.length - 1], { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, t);
    t += 0.5;

    // État de départ posé explicitement au temps 0 : au retour de boucle, GSAP
    // ne rejoue pas à l'envers toutes les bascules instantanées (set).
    tl.set(steps[0], { autoAlpha: 1, scale: 1 }, 0)
      .set(steps.slice(1), { autoAlpha: 0 }, 0)
      .set($$('.tour-patch', list), { autoAlpha: 1, scaleY: 1 }, 0)
      .set(fly, { o: 0 }, 0)
      .set(rip, { o: 0 }, 0);

    // Progression de chaque chapitre, sous son bouton.
    starts.forEach(function (s, i) {
      var end = i + 1 < starts.length ? starts[i + 1] : t;
      tl.fromTo(ui.chips[i], { '--p': 0 }, { '--p': 1, duration: end - s, ease: 'none', immediateRender: false }, s);
    });

    var started = false;
    function start(at) {
      started = true;
      ui.show(at);
      tl.play('s' + at);
    }
    ui.setChip(function (i) { tl.seek('s' + i); start(i); });
    ui.setReplay(function () { tl.seek(0); start(0); });

    measure();
    if (window.ResizeObserver) new ResizeObserver(measure).observe(view);
    else window.addEventListener('resize', measure);

    // Le film ne tourne que s'il est à l'écran (entre 15 % du haut et 30 % du bas).
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!started) start(0);
        else tl.resume();
      } else {
        tl.pause();
      }
    }, { rootMargin: '-15% 0px -30% 0px' }).observe(view);
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
        Promise.all([doc.fonts.load('600 48px Poppins'), doc.fonts.load('400 20px Inter')])
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
      if (!c.parallax || !ScrollTrigger) { root.classList.remove('motion-ok'); return; }

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

    /* Entrées au scroll (blocs, listes, visuels de projets, titres) : en CSS,
       déclenchées par main.js. Voir « Entrées au scroll » dans style.css. */

    /* ---------------------------------------------------------------
       Fil de la page (écran large) : la requête du hero devient le
       compteur de lecture. Un point suit le scroll le long d'un rail,
       avec un repère par section. Décoratif : masqué aux lecteurs d'écran.
       --------------------------------------------------------------- */
    var cleanSpine = null;
    if (c.spine && ScrollTrigger) {
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
