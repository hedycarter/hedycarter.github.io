/* Portfolio — Hady Fofana. JavaScript vanilla, sans dépendance. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var I18N = window.I18N || { fr: {}, en: {} };
  var lang = 'fr';

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function t(key) { return (I18N[lang] && I18N[lang][key]) || (I18N.fr && I18N.fr[key]) || ''; }

  /* ---------------------------------------------------------------
     Langue
     --------------------------------------------------------------- */
  function applyLang(next) {
    var dict = I18N[next];
    if (!dict) return;
    lang = next;
    root.lang = next;
    $$('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v !== undefined) el.innerHTML = v;
    });
    $$('[data-i18n-ph]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n-ph')];
      if (v !== undefined) el.placeholder = v;
    });
    $$('[data-wa]').forEach(function (el) {
      var msg = dict['contact.wa.text'];
      if (msg) el.href = 'https://wa.me/22372303157?text=' + encodeURIComponent(msg);
    });
    $$('[data-i18n-aria]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n-aria')];
      if (v !== undefined) el.setAttribute('aria-label', v);
    });
    $$('.lang-btn').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === next;
      btn.classList.toggle('lang-btn--active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem('lang', next); } catch (e) {}
    doc.dispatchEvent(new CustomEvent('langchange'));
  }

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (saved && saved !== 'fr') applyLang(saved);
  $$('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang')); });
  });

  /* ---------------------------------------------------------------
     Header : fond plein une fois le hero dépassé
     --------------------------------------------------------------- */
  var header = $('#header');
  var hero = $('#hero');
  if (header && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-solid', !entries[0].isIntersecting);
    }, { rootMargin: '-64px 0px 0px 0px' }).observe(hero);
  } else if (header) {
    header.classList.add('is-solid');
  }

  /* ---------------------------------------------------------------
     Menu mobile
     --------------------------------------------------------------- */
  var menuBtn = $('#menu-btn');
  var nav = $('#site-nav');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var label = $('.visually-hidden', menuBtn);
    if (label) label.textContent = open ? t('nav.close') : t('nav.menu');
    doc.body.classList.toggle('is-locked', open);
    if (open) { var first = $('a', nav); if (first) first.focus(); }
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () { setMenu(!header.classList.contains('is-open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });
  }

  /* ---------------------------------------------------------------
     Lien actif dans la navigation
     --------------------------------------------------------------- */
  var navLinks = $$('.site-nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------------
     Révélations (une seule fois) et compteurs
     --------------------------------------------------------------- */
  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (!end || reduceMotion.matches) return;
    var dur = 900;
    var start = null;
    el.textContent = '0';
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * end));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Quand motion.js (GSAP) est actif, c'est lui qui révèle les blocs ; il prévient ici.
  doc.addEventListener('reveal-in', function (e) { $$('[data-count]', e.target).forEach(countUp); });

  if (!window.__motion && 'IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        $$('[data-count]', entry.target).forEach(countUp);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { revealer.observe(el); });
  } else if (!window.__motion) {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------------
     Case studies (modales accessibles)
     --------------------------------------------------------------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
  var openModal = null;
  var lastTrigger = null;

  function showModal(modal, trigger) {
    lastTrigger = trigger || doc.activeElement;
    openModal = modal;
    modal.inert = false;
    modal.classList.add('is-open');
    doc.body.classList.add('is-locked');
    var inner = $('.cs-inner', modal);
    if (inner) inner.scrollTop = 0;
    var close = $('.cs-close', modal);
    if (close) close.focus();
  }

  function hideModal() {
    if (!openModal) return;
    var modal = openModal;
    openModal = null;
    modal.classList.remove('is-open');
    modal.inert = true;
    doc.body.classList.remove('is-locked');
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  $$('[data-cs-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = doc.getElementById(btn.getAttribute('data-cs-open'));
      if (modal) showModal(modal, btn);
    });
  });
  $$('[data-cs-close]').forEach(function (el) { el.addEventListener('click', hideModal); });

  doc.addEventListener('keydown', function (e) {
    if (!openModal) return;
    if (e.key === 'Escape') { hideModal(); return; }
    if (e.key !== 'Tab') return;
    var items = $$(FOCUSABLE, openModal).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------------------------------------------------------------
     Copier l'email
     --------------------------------------------------------------- */
  var copyBtn = $('#copy-email-btn');
  if (copyBtn && navigator.clipboard) {
    var icon = $('#copy-email-icon');
    var status = $('#copy-status');
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('hadyfofana72@gmail.com').then(function () {
        icon.className = 'bi bi-clipboard-check';
        copyBtn.classList.add('copy-email-btn--done');
        status.textContent = t('copy.done');
        setTimeout(function () {
          icon.className = 'bi bi-clipboard';
          copyBtn.classList.remove('copy-email-btn--done');
          status.textContent = '';
        }, 2000);
      });
    });
  }

  /* ---------------------------------------------------------------
     Démonstration : isolation multi-tenant
     Une vente porte un tenant_id ; seule l'entreprise ciblée la voit.
     Le tableau de bord reprend la carte « En direct » de la landing Tchakeda :
     VENTE → STOCK → VENTES → CHIFFRE D'AFFAIRES → COURBE.
     --------------------------------------------------------------- */
  var demo = $('#tenant-demo');
  if (demo) {
    var TENANTS = 300;
    var COLS = 20;
    var grid = $('#td-grid', demo);
    var sendBtn = $('#td-send', demo);
    var steps = $$('.td-node, .td-link', demo);
    var lines = $$('.td-line', demo);
    var card = $('#tk-card', demo);
    var ui = {
      store: $('#tk-store', demo), revenue: $('#tk-revenue', demo), stock: $('#tk-stock', demo),
      sales: $('#tk-sales', demo), line: $('#tk-line', demo), area: $('#tk-area', demo), events: $('#tk-events', demo)
    };
    var STORES = ['Boutique Bamako Centre', 'Quincaillerie Kalaban', 'Pharmacie du Fleuve', 'Superette Hamdallaye',
      'Librairie Badalabougou', 'Boulangerie ACI 2000', 'Électro Sikasso', 'Pagnes de Ségou'];
    var PRODUCTS = [['Casque Bluetooth X2', 18500], ['Enceinte Mini', 24000], ['Chargeur rapide', 7500], ['Écouteurs Pro', 12000]];
    var cells = [];
    var timers = [];
    var cancels = [];
    var states = {};
    var shown = null;
    var focusIndex = 86;
    var paper = $('#rc-paper', demo);
    var CASHIERS = ['Awa', 'Moussa', 'Fatoumata', 'Ibrahim', 'Mariam', 'Seydou'];
    var lastReceipt = null;

    function fmt(v) { return Math.round(v).toLocaleString('fr-FR').replace(/\s/g, ' '); }

    /* Chaque entreprise a ses propres données, stables : changer de tenant change tout le tableau de bord. */
    function stateOf(id) {
      if (!states[id]) {
        var seed = id * 9301 + 49297;
        var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
        var series = [];
        for (var i = 0; i < 9; i++) series.push(36 + rnd() * 30 + i * 2);
        states[id] = {
          store: STORES[id % STORES.length],
          revenue: Math.round((300 + rnd() * 1400) * 1000 / 500) * 500,
          stock: 300 + Math.floor(rnd() * 1500),
          sales: 20 + Math.floor(rnd() * 90),
          series: series,
          last: null,
          n: id
        };
      }
      return states[id];
    }

    function sparkPath(values) {
      var w = 240, h = 56, pad = 4;
      var min = Math.min.apply(null, values), max = Math.max.apply(null, values), range = max - min || 1;
      var step = w / (values.length - 1);
      var pts = values.map(function (v, i) { return [i * step, pad + (1 - (v - min) / range) * (h - pad * 2)]; });
      var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var cx = ((pts[i - 1][0] + pts[i][0]) / 2).toFixed(1);
        d += ' C' + cx + ' ' + pts[i - 1][1].toFixed(1) + ' ' + cx + ' ' + pts[i][1].toFixed(1) + ' ' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
      }
      return { line: d, area: d + ' L' + w + ' ' + h + ' L0 ' + h + ' Z' };
    }

    function drawChart(values) {
      var p = sparkPath(values);
      ui.line.setAttribute('d', p.line);
      ui.area.setAttribute('d', p.area);
    }

    function tween(from, to, dur, onUpdate) {
      if (reduceMotion.matches || dur <= 0) { onUpdate(to); return function () {}; }
      var frame = 0, start = performance.now();
      function tick(now) {
        var k = Math.min((now - start) / dur, 1);
        onUpdate(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
      return function () { cancelAnimationFrame(frame); };
    }

    function flash(el) {
      if (reduceMotion.matches || !el.animate) return;
      el.animate([{ color: '#0672e4', transform: 'translateY(-2px)' }, { color: '#0f172a', transform: 'none' }],
        { duration: 1200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }

    function eventHTML(sale) {
      if (!sale) return '<div class="tk-event tk-event--idle">' + t('tk.idle') + '</div>';
      return '<div class="tk-event"><i class="bi bi-cart-check" aria-hidden="true"></i><span><b>' + t('tk.sale') +
        '</b><small>' + sale[0] + '</small></span><em>+' + fmt(sale[1]) + '&nbsp;F</em></div>';
    }

    function render(id) {
      var st = stateOf(id);
      shown = id;
      $$('.td-id', demo).forEach(function (el) { el.textContent = id; });
      ui.store.textContent = st.store;
      ui.revenue.textContent = fmt(st.revenue);
      ui.stock.textContent = fmt(st.stock);
      ui.sales.textContent = fmt(st.sales);
      ui.events.innerHTML = eventHTML(st.last);
      drawChart(st.series);
    }

    function pushEvent(sale) {
      var old = $('.tk-event', ui.events);
      if (old && !reduceMotion.matches) {
        old.classList.add('is-leaving');
        timers.push(setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 260));
      } else if (old) {
        old.parentNode.removeChild(old);
      }
      ui.events.insertAdjacentHTML('beforeend', eventHTML(sale));
    }

    /* ---- Le reçu : même structure que le vrai reçu Tchakeda ---- */
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function barcode(seed) {
      var x = 0, bars = '', v = seed;
      while (x < 196) {
        v = (v * 9301 + 49297) % 233280;
        var w = 1 + (v % 3);
        if ((v >> 3) % 2) bars += '<rect x="' + x + '" y="0" width="' + w + '" height="32"/>';
        x += w + 1;
      }
      return '<svg class="rc-bars" viewBox="0 0 200 32" preserveAspectRatio="none" aria-hidden="true">' + bars + '</svg>';
    }
    function receiptHTML(r) {
      var d = r.date;
      var when = pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
      return '<div class="rc">' +
        '<p class="rc-shop" lang="bm">Feere kɛ yɔrɔ</p>' +
        '<p class="rc-store">' + r.store + '</p>' +
        '<p class="rc-meta">' + t('rc.ticket') + ' : ' + r.num + '<br>' + when + '<br>' + t('rc.by') + ' : ' + r.cashier + ' · ' + t('rc.tenant') + ' ' + r.id + '</p>' +
        '<p class="rc-row"><span>' + r.item + ' &nbsp;1<small>' + fmt(r.price) + ' F / ' + t('rc.unit') + '</small></span><span>' + fmt(r.price) + ' F</span></p>' +
        '<p class="rc-row rc-total"><span>' + t('rc.total') + '</span><span>' + fmt(r.price) + ' F</span></p>' +
        '<p class="rc-row"><span>' + t('rc.cash') + '</span><span>' + fmt(r.cash) + ' F</span></p>' +
        '<p class="rc-row"><span>' + t('rc.change') + '</span><span>' + fmt(r.cash - r.price) + ' F</span></p>' +
        barcode(+r.num.slice(-6)) +
        '<p class="rc-gen">' + t('rc.gen') + '</p>' +
        '<p class="rc-only">' + t('rc.only').replace('{id}', r.id) + '</p>' +
      '</div>';
    }
    function idleReceipt() { paper.innerHTML = '<p class="rc-idle">' + t('rc.idle') + '</p>'; }

    // L'ancien reçu est arraché, le nouveau sort de la fente par à-coups, comme une imprimante thermique
    function printReceipt(r) {
      lastReceipt = r;
      var old = paper.firstElementChild;
      var wrap = doc.createElement('div');
      wrap.innerHTML = receiptHTML(r);
      var next = wrap.firstChild;
      var still = reduceMotion.matches || !next.animate;
      function show() {
        paper.innerHTML = '';
        paper.appendChild(next);
        if (!still) next.animate([{ transform: 'translateY(-101%)' }, { transform: 'none' }], { duration: 1050, easing: 'steps(14, end)' });
      }
      if (old && old.classList.contains('rc') && !still) {
        old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(28px) rotate(4deg)', opacity: 0 }],
          { duration: 260, easing: 'cubic-bezier(0.55, 0, 1, 0.45)', fill: 'forwards' }).onfinish = show;
      } else show();
    }

    for (var i = 0; i < TENANTS; i++) {
      var cell = doc.createElement('button');
      cell.type = 'button';
      cell.className = 'td-cell';
      cell.tabIndex = i === focusIndex ? 0 : -1;
      cell.setAttribute('data-id', String(i + 1));
      // Vague de filtrage : délai selon la distance au coin supérieur gauche
      cell.style.setProperty('--d', ((i % COLS) + Math.floor(i / COLS)) * 8 + 'ms');
      grid.appendChild(cell);
      cells.push(cell);
    }

    function labelCells() {
      var word = t('demo.cell');
      cells.forEach(function (c) { c.setAttribute('aria-label', word + ' ' + c.getAttribute('data-id')); });
      if (shown) ui.events.innerHTML = eventHTML(stateOf(shown).last);
      // Le reçu affiché suit la langue, sans se réimprimer
      if (lastReceipt) paper.innerHTML = receiptHTML(lastReceipt); else idleReceipt();
    }
    labelCells();
    $$('.lang-btn').forEach(function (btn) { btn.addEventListener('click', labelCells); });
    render(87);

    function clearRun() {
      timers.forEach(clearTimeout);
      timers = [];
      cancels.forEach(function (c) { c(); });
      cancels = [];
      steps.forEach(function (el) { el.classList.remove('is-on'); });
      lines.forEach(function (el) { el.classList.remove('is-on'); });
      grid.classList.remove('is-filtered');
      cells.forEach(function (c) { c.classList.remove('is-target', 'is-landed'); });
      card.classList.remove('is-switching');
      sendBtn.classList.remove('is-running');
      // Une vente interrompue est appliquée tout de suite : les chiffres restent justes
      if (shown) render(shown);
    }

    function at(ms, fn) { timers.push(setTimeout(fn, reduceMotion.matches ? 0 : ms)); }
    function stepOn(n) {
      steps.forEach(function (el) { if (el.getAttribute('data-step') === String(n)) el.classList.add('is-on'); });
    }

    function run(id) {
      clearRun();
      var st = stateOf(id);
      var sale = PRODUCTS[st.n % PRODUCTS.length];
      st.n++;
      var before = { revenue: st.revenue, series: st.series.slice() };
      // L'état est mis à jour d'emblée ; l'animation ne fait que le montrer
      var lastV = st.series[st.series.length - 1];
      st.series = st.series.slice(1).concat([Math.max(30, lastV + (sale[1] > 15000 ? 6 : -4) + (st.n * 7) % 5)]);
      st.revenue += sale[1];
      st.stock -= 1;
      st.sales += 1;
      st.last = sale;
      var target = cells[id - 1];
      var switching = shown !== id;

      // 1. La requête traverse le système (côté architecture)
      sendBtn.classList.add('is-running');
      $$('.td-log .td-id', demo).forEach(function (el) { el.textContent = id; });
      stepOn(0); lines[0].classList.add('is-on');
      at(130, function () { stepOn(1); });
      at(390, function () { stepOn(2); });
      at(650, function () {
        lines[1].classList.add('is-on');
        target.classList.add('is-target');
        grid.classList.add('is-filtered');
        if (switching) card.classList.add('is-switching');
      });

      // 2. Seule l'entreprise ciblée voit la vente (côté produit)
      at(830, function () {
        if (switching) {
          shown = id;
          $$('.tk-badge .td-id', demo).forEach(function (el) { el.textContent = id; });
          ui.store.textContent = st.store;
          ui.revenue.textContent = fmt(before.revenue);
          ui.stock.textContent = fmt(st.stock + 1);
          ui.sales.textContent = fmt(st.sales - 1);
          drawChart(before.series);
          ui.events.innerHTML = eventHTML(null);
          card.classList.remove('is-switching');
        }
        target.classList.add('is-landed');
        pushEvent(sale);
        printReceipt({
          id: id, store: st.store, item: sale[0], price: sale[1],
          cash: Math.ceil((sale[1] + 1) / 5000) * 5000,
          num: String(Date.now()).slice(-12), date: new Date(),
          cashier: CASHIERS[(id + st.n) % CASHIERS.length]
        });
      });
      at(1180, function () { ui.stock.textContent = fmt(st.stock); flash(ui.stock); });
      at(1340, function () { ui.sales.textContent = fmt(st.sales); flash(ui.sales); });
      at(1500, function () {
        cancels.push(tween(before.revenue, st.revenue, 900, function (v) { ui.revenue.textContent = fmt(v); }));
        lines[2].classList.add('is-on');
        sendBtn.classList.remove('is-running');
      });
      at(1640, function () {
        cancels.push(tween(0, 1, 800, function (k) {
          drawChart(before.series.map(function (v, i) { return v + (st.series[i] - v) * k; }));
        }));
      });
      if (reduceMotion.matches) at(0, function () { render(id); });
    }

    function randomTenant() { return 1 + Math.floor(Math.random() * TENANTS); }

    grid.addEventListener('click', function (e) {
      var c = e.target.closest('.td-cell');
      if (c) run(parseInt(c.getAttribute('data-id'), 10));
    });
    sendBtn.addEventListener('click', function () { run(randomTenant()); });

    // Navigation clavier dans la grille (un seul arrêt de tabulation)
    grid.addEventListener('keydown', function (e) {
      var moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS };
      var next = focusIndex;
      if (e.key in moves) next = focusIndex + moves[e.key];
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = TENANTS - 1;
      else return;
      e.preventDefault();
      if (next < 0 || next >= TENANTS) return;
      cells[focusIndex].tabIndex = -1;
      focusIndex = next;
      cells[focusIndex].tabIndex = 0;
      cells[focusIndex].focus();
    });

    // Première vente jouée une seule fois, quand la démo devient visible
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, obs) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        setTimeout(function () { run(87); }, reduceMotion.matches ? 0 : 400);
      }, { threshold: 0.45 }).observe(demo);
    } else {
      run(87);
    }
  }

  /* ---------------------------------------------------------------
     Bobines : extraits vidéo des projets (landing Tchakeda, site Groupe ATC)
     Rien n'est téléchargé avant que la bobine soit visible ; lecture
     automatique seulement si le visiteur accepte le mouvement.
     --------------------------------------------------------------- */
  $$('.reel').forEach(function (reel) {
    var video = $('video', reel);
    var chips = $$('.reel-chip', reel);
    var toggle = $('.reel-toggle', reel);
    var current = chips[0].getAttribute('data-clip');
    var loaded = null;
    var visible = false;
    var userPaused = reduceMotion.matches;

    function setSources(name) {
      video.poster = 'assets/video/' + name + '.webp';
      video.innerHTML =
        '<source src="assets/video/' + name + '.webm" type="video/webm">' +
        '<source src="assets/video/' + name + '.mp4" type="video/mp4">';
      video.load();
      loaded = name;
    }

    function syncToggle() {
      var paused = video.paused;
      toggle.innerHTML = '<i class="bi ' + (paused ? 'bi-play-fill' : 'bi-pause-fill') + '" aria-hidden="true"></i>';
      toggle.setAttribute('aria-label', t(paused ? 'reel.play' : 'reel.pause'));
    }

    function syncLabel() {
      var chip = $('.reel-chip.is-active', reel);
      if (chip) video.setAttribute('aria-label', t(chip.getAttribute('data-label')));
    }

    function maybePlay() {
      if (!visible || userPaused) return;
      if (loaded !== current) setSources(current);
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }

    video.addEventListener('play', syncToggle);
    video.addEventListener('pause', syncToggle);

    toggle.addEventListener('click', function () {
      if (video.paused) {
        userPaused = false;
        visible = true;
        maybePlay();
      } else {
        userPaused = true;
        video.pause();
      }
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var name = chip.getAttribute('data-clip');
        if (name === current) return;
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        current = name;
        syncLabel();
        // Fondu court entre deux extraits ; un choix explicite relance la lecture
        reel.classList.add('is-switching');
        setTimeout(function () {
          reel.style.setProperty('--reel-bg', chip.getAttribute('data-bg') || '#f8fafc');
          setSources(name);
          reel.classList.remove('is-switching');
          userPaused = false;
          visible = true;
          maybePlay();
        }, reduceMotion.matches ? 0 : 200);
      });
    });

    $$('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { syncLabel(); syncToggle(); });
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) maybePlay();
        else if (!video.paused) video.pause();
      }, { threshold: 0.4 }).observe(reel);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) video.pause();
      else maybePlay();
    });
    syncToggle();
  });

  /* ---------------------------------------------------------------
     Scènes codées : chacune raconte l'architecture réelle de son projet.
     Jouées une fois quand elles deviennent visibles, puis à la demande.
     --------------------------------------------------------------- */
  function sceneClock() {
    var timers = [];
    var cancels = [];
    var clock = {
      speed: 1,
      at: function (ms, fn) { timers.push(setTimeout(fn, reduceMotion.matches ? 0 : ms * clock.speed)); },
      tween: function (el, from, to, ms) {
        var fmt = function (v) { return Math.round(v).toLocaleString('fr-FR').replace(/\s/g, ' '); };
        if (reduceMotion.matches) { el.textContent = fmt(to); return; }
        var start = performance.now(), frame = 0;
        var step = function (now) {
          var k = Math.min((now - start) / ms, 1);
          el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 3)));
          if (k < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        cancels.push(function () { cancelAnimationFrame(frame); });
      },
      clear: function () {
        timers.forEach(clearTimeout); timers = [];
        cancels.forEach(function (c) { c(); }); cancels = [];
      }
    };
    return clock;
  }

  function playWhenVisible(el, run) {
    if (!('IntersectionObserver' in window)) { run(); return; }
    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      setTimeout(run, reduceMotion.matches ? 0 : 300);
    }, { threshold: 0.5 }).observe(el);
  }

  function restartClass(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // AfriCred — l'accueil de l'app : Orange Money → épargne → échéance → carte virtuelle → assistance
  var wallet = $('#scene-wallet');
  if (wallet) {
    var wc = sceneClock();
    var wWal = $('[data-sw="wal"]', wallet);
    var wBal = $('[data-sw="bal"]', wallet);
    var wPaid = $('[data-sw="paid"]', wallet);
    var wArc = $('[data-sw="bar"]', wallet);
    var wToast = $('[data-sw="toast"]', wallet);
    var toastState = null;
    var STATES = ['is-drawn', 'is-om', 'is-sending', 'is-saving', 'is-saved', 'is-repay', 'is-card', 'is-toast', 'is-notified', 'is-chat', 'is-q', 'is-typing', 'is-a'];

    function renderToast() {
      if (!toastState) { wToast.innerHTML = ''; return; }
      var amount = toastState.a || '✓';
      var cls = toastState.a && toastState.a.charAt(0) === '+' ? ' class="is-in"' : '';
      wToast.innerHTML = '<span>' + t(toastState.k) + (toastState.n ? ' ' + toastState.n : '') + '</span><b' + cls + '>' + amount + '</b>';
    }
    function toast(k, n, a) {
      wallet.classList.remove('is-toast');
      wc.at(200, function () {
        toastState = { k: k, n: n, a: a };
        renderToast();
        wallet.classList.add('is-toast', 'is-notified');
      });
    }
    function setPaid(n) {
      wPaid.textContent = n;
      wArc.style.strokeDasharray = (n / 6 * 100).toFixed(1) + ' 100';
    }

    function runWallet(full) {
      full = full === true;
      wc.clear();
      wc.speed = full ? 1 : 0.62;
      STATES.forEach(function (c) { wallet.classList.remove(c); });
      toastState = null; renderToast();
      wBal.textContent = '1\u202f240';
      wWal.textContent = '0';
      wPaid.textContent = '2';
      wArc.style.strokeDasharray = '0 100';
      // Les anneaux de l'écran d'accueil se dessinent
      wc.at(150, function () { wallet.classList.add('is-drawn'); setPaid(2); });
      // Orange Money crédite le wallet
      wc.at(900, function () { wallet.classList.add('is-om'); });
      wc.at(1100, function () { restartClass(wallet, 'is-sending'); });
      wc.at(1750, function () {
        wallet.classList.remove('is-om');
        wc.tween(wWal, 0, 25000, 700);
        toast('sw.tx.topup', '', '+25 000');
      });
      // Épargne : une partie du wallet rejoint l'épargne, l'anneau des statistiques grandit
      wc.at(3000, function () {
        restartClass(wallet, 'is-saving');
        wc.tween(wWal, 25000, 15000, 600);
      });
      wc.at(3650, function () {
        wallet.classList.add('is-saved');
        wc.tween(wBal, 1240, 11240, 700);
        toast('sw.tx.save', '', '+10 000');
      });
      if (full) {
        // L'échéance du prêt est payée depuis le wallet : l'anneau Finance avance
        wc.at(4900, function () {
          wallet.classList.add('is-repay');
          wc.tween(wWal, 15000, 0, 600);
          setPaid(3);
          toast('sw.tx.repay', '3/6', '−15 000');
        });
      }
      // La carte virtuelle sort du téléphone
      wc.at(full ? 6200 : 4300, function () {
        wallet.classList.remove('is-repay');
        wallet.classList.add('is-card');
        toast('sw.tx.card', '', '');
      });
      if (!full) { wc.at(5600, function () { wallet.classList.remove('is-toast'); }); return; }
      // Assistance : le client écrit, l'agent répond
      wc.at(7200, function () { wallet.classList.remove('is-toast'); wallet.classList.add('is-chat', 'is-q'); });
      wc.at(7900, function () { wallet.classList.add('is-typing'); });
      wc.at(9000, function () { wallet.classList.remove('is-typing'); wallet.classList.add('is-a'); });
    }

    $('.scene-replay', wallet).addEventListener('click', function () { runWallet(true); });
    $$('.lang-btn').forEach(function (b) { b.addEventListener('click', renderToast); });
    playWhenVisible(wallet, function () { runWallet(false); });
  }

  // GesCabinet — comme Smart Agro : le mobile du patient et le site de la clinique, reliés par la même API.
  // 1) le rendez-vous pris sur l'app arrive dans l'agenda ; 2) le patient écrit au support, la clinique répond.
  var gcScene = $('#scene-gc');
  if (gcScene) {
    var gcc = sceneClock();
    var gcCount = $('[data-gc="count"]', gcScene);
    var GC = ['is-pick', 'is-press', 'is-booked', 'is-chat', 'is-q', 'is-qweb', 'is-typing', 'is-a', 'is-aphone',
      'is-up', 'is-down', 'is-up-rev', 'is-down-rev', 'is-api'];
    // Sans JS, la scène montre son état final ; avec JS, elle part du début
    gcScene.classList.add('is-run');
    gcCount.textContent = '12';

    function runGc() {
      gcc.clear();
      gcc.speed = 0.8;
      GC.forEach(function (c) { gcScene.classList.remove(c); });
      gcCount.textContent = '12';
      // 1. Rendez-vous : mobile → API → agenda du site
      gcc.at(350, function () { gcScene.classList.add('is-pick'); });
      gcc.at(950, function () { gcScene.classList.add('is-press'); });
      gcc.at(1050, function () { restartClass(gcScene, 'is-up'); });
      gcc.at(1600, function () { gcScene.classList.add('is-api'); restartClass(gcScene, 'is-down'); });
      gcc.at(2150, function () {
        gcScene.classList.remove('is-api');
        gcScene.classList.add('is-booked');
        gcc.tween(gcCount, 12, 13, 450);
      });
      // 2. Support médical : la question monte, la réponse redescend
      gcc.at(3000, function () { gcScene.classList.add('is-chat'); });
      gcc.at(3450, function () { gcScene.classList.add('is-q'); });
      gcc.at(3600, function () { restartClass(gcScene, 'is-up'); });
      gcc.at(4150, function () { gcScene.classList.add('is-api'); restartClass(gcScene, 'is-down'); });
      gcc.at(4700, function () { gcScene.classList.remove('is-api'); gcScene.classList.add('is-qweb', 'is-typing'); });
      gcc.at(5600, function () { gcScene.classList.remove('is-typing'); gcScene.classList.add('is-a'); });
      gcc.at(5750, function () { gcScene.classList.add('is-api'); restartClass(gcScene, 'is-down-rev'); });
      gcc.at(6300, function () { restartClass(gcScene, 'is-up-rev'); });
      gcc.at(6850, function () { gcScene.classList.remove('is-api'); gcScene.classList.add('is-aphone'); });
    }

    $('.scene-replay', gcScene).addEventListener('click', runGc);
    playWhenVisible(gcScene, runGc);
  }

  // Smart Agro — un réseau social agricole : une publication part du mobile,
  // passe par l'API et arrive sur le web, puis la communauté réagit
  var agro = $('#scene-agro');
  if (agro) {
    var ac = sceneClock();
    var feedM = $('[data-sa="feed-m"]', agro);
    var feedW = $('[data-sa="feed-w"]', agro);
    var typed = $('[data-sa="typed"]', agro);
    var thumb = $('.sa-thumb', agro);
    var chatTyped = $('[data-sa="chat-typed"]', agro);
    var alertsBox = $('[data-sa="alerts"]', agro);
    var countEl = $('[data-sa="count"]', agro);
    var hit = $('[data-sa="hit"]', agro);
    var cacheLabel = $('[data-sa="cache"]', agro);

    // Prénoms et contenus fictifs
    var NEW_POSTS = [
      { who: 'Awa', role: 'sa.role.f', k: 'sa.p1.x', tag: '#agriculture', theme: 1, img: 'papaye' },
      { who: 'Issa', role: 'sa.role.p', k: 'sa.p2.x', tag: '#gestiondeleau', theme: 0, img: 'mais' }
    ];
    var ALERTS = [['sa.a1', 'Mopti', 'critical'], ['sa.a2', 'Ségou', 'info'], ['sa.a3', 'Sikasso', 'critical']];
    var posts = [{ id: 0, who: 'Smart Agro Coach', org: true, role: 'sa.coach', k: 'sa.p0.x', tag: '#information', img: '', likes: 8, cm: 2, comment: false, old: true }];
    var alerts = [{ k: 'sa.a2', place: 'Ségou', sev: 'info' }];
    var chips = $$('[data-sa="chips"] span', agro);
    var counter = $('[data-sa="counter"]', agro);
    var round = 0;
    var nextId = 1;
    var cacheWarm = false;

    function postHTML(p, compact) {
      var initial = p.org ? 'S' : p.who.charAt(0);
      var meta = p.old ? t('sa.ago') : t('sa.now');
      var html = '<article class="sa-post' + (p.fresh ? ' is-new' : '') + '" data-pid="' + p.id + '">' +
        '<div class="sa-post-head"><span class="sa-avatar' + (p.org ? ' sa-avatar--org' : '') + '">' + initial + '</span>' +
        '<p><b>' + p.who + ' · <span class="sa-follow">' + t('sa.follow') + '</span></b><small>' + t(p.role) + ' • ' + meta + '</small></p>' +
        '<i class="bi bi-three-dots-vertical sa-dots"></i></div>' +
        '<p class="sa-post-text">' + t(p.k) + ' <span class="sa-hash">' + p.tag + '</span></p>' +
        (p.img ? '<img class="sa-photo" src="assets/img/scenes/sa-' + p.img + '.webp" alt="" loading="lazy">' : '') +
        '<p class="sa-counts"><span class="sa-likes"><i class="bi bi-hand-thumbs-up-fill"></i><span data-likes>' + p.likes + '</span></span><span><span data-cm>' + p.cm + '</span> ' + t('sa.comments') + ' • 0 ' + t('sa.shares') + '</span></p>';
      if (!compact) {
        html += '<p class="sa-actions"><span><i class="bi bi-hand-thumbs-up"></i> ' + t('sa.like') + '</span><span><i class="bi bi-chat"></i> ' + t('sa.comment') + '</span><span><i class="bi bi-send"></i> ' + t('sa.share') + '</span></p>' +
          '<p class="sa-comment' + (p.comment ? ' is-on' : '') + '"><span class="sa-avatar sa-avatar--org">S</span><span><b>Smart Agro Coach</b>' + t('sa.cm') + '</span></p>';
      }
      return html + '</article>';
    }
    function renderFeeds() {
      var list = posts.slice(0, 2);
      feedW.innerHTML = list.map(function (p) { return postHTML(p, false); }).join('');
      feedM.innerHTML = list.map(function (p) { return postHTML(p, true); }).join('');
      posts.forEach(function (p) { p.fresh = false; });
    }
    function renderAlerts(freshFirst) {
      alertsBox.innerHTML = alerts.slice(0, 2).map(function (a, i) {
        return '<div class="sa-alert' + (freshFirst && i === 0 ? ' is-new' : '') + '">' +
          '<p class="sa-alert-top"><b>' + t(a.k + '.t') + '</b><span class="sa-sev sa-sev--' + a.sev + '">' + a.sev.toUpperCase() + '</span></p>' +
          '<p class="sa-alert-foot"><span><i class="bi bi-geo-alt-fill"></i> ' + a.place + '</span><span class="sa-unv">' + t('sa.unverified') + '</span></p></div>';
      }).join('');
      countEl.textContent = alerts.length;
    }
    function setCache(warm) {
      hit.classList.toggle('is-miss', !warm);
      hit.textContent = warm ? 'Redis · HIT' : 'OpenWeatherMap → Redis';
      cacheLabel.textContent = warm ? 'Redis · météo 30 min' : 'OpenWeatherMap…';
    }
    function eachPost(id, sel, fn) {
      $$('[data-pid="' + id + '"] ' + sel, agro).forEach(fn);
    }

    function publish(full) {
      full = full === true;
      ac.clear();
      ac.speed = full ? 1 : 0.62;
      ['is-writing', 'is-photo', 'is-send', 'is-up', 'is-down', 'is-api', 'is-chatview', 'is-m1', 'is-mtyping', 'is-m2', 'is-msg', 'is-down-rev', 'is-up-rev'].forEach(function (c) { agro.classList.remove(c); });
      chatTyped.textContent = '';
      var src = NEW_POSTS[round % NEW_POSTS.length];
      var alert = ALERTS[round % ALERTS.length];
      round++;
      var text = t(src.k);
      typed.textContent = '';
      counter.textContent = '0';
      chips.forEach(function (c) { c.classList.remove('is-on'); });
      thumb.src = 'assets/img/scenes/sa-' + src.img + '.webp';

      // 1. L'agricultrice écrit sa publication et joint une photo
      agro.classList.add('is-writing');
      var steps = Math.min(text.length, 40);
      for (var i = 1; i <= steps; i++) {
        (function (n) { ac.at(350 + n * 20, function () { var part = text.slice(0, Math.round(n / steps * text.length)); typed.textContent = part; counter.textContent = part.length; }); })(i);
      }
      ac.at(1250, function () { chips[src.theme].classList.add('is-on'); });
      ac.at(1450, function () { agro.classList.add('is-photo'); });
      // 2. Publier : la publication remonte vers l'API, puis redescend vers le web
      ac.at(1700, function () { agro.classList.add('is-send'); });
      ac.at(1850, function () { restartClass(agro, 'is-up'); });
      ac.at(2400, function () { agro.classList.add('is-api'); restartClass(agro, 'is-down'); });
      ac.at(3000, function () {
        var post = { id: nextId++, who: src.who, role: src.role, k: src.k, tag: src.tag, img: src.img, likes: 0, cm: 0, comment: false, fresh: true };
        posts.unshift(post);
        renderFeeds();
        agro.classList.remove('is-writing', 'is-photo', 'is-send', 'is-api');
        typed.textContent = '';
        // 3. La communauté réagit : les J'aime montent, un coach commente
        ac.at(500, function () {
          eachPost(post.id, '[data-likes]', function (el) { ac.tween(el, 0, 12, 900); });
          eachPost(post.id, '.sa-likes', function (el) { restartClass(el, 'is-pop'); });
          post.likes = 12;
        });
        if (full) {
          ac.at(1300, function () {
            post.cm = 1; post.comment = true;
            eachPost(post.id, '[data-cm]', function (el) { el.textContent = '1'; });
            eachPost(post.id, '.sa-comment', function (el) { el.classList.add('is-on'); });
          });
          // 4. Une alerte de coach arrive dans le panneau ; la météo vient du cache
          ac.at(2000, function () {
            alerts.unshift({ k: alert[0], place: alert[1], sev: alert[2] });
            renderAlerts(true);
            setCache(cacheWarm);
          });
          ac.at(2700, function () { cacheWarm = true; setCache(true); });
          // 5. Messagerie : l'agricultrice écrit au coach avec une photo, le coach répond depuis le web
          ac.at(3400, chat);
        } else {
          ac.at(1300, chat);
        }
      });
    }

    function chat() {
      agro.classList.add('is-chatview');
      var msg = t('sa.chat.q');
      var n = 26;
      for (var i = 1; i <= n; i++) {
        (function (k) { ac.at(500 + k * 25, function () { chatTyped.textContent = msg.slice(0, Math.round(k / n * msg.length)); }); })(i);
      }
      // Envoi : la bulle (texte + photo) part du mobile, passe par l'API et arrive chez le coach sur le web
      ac.at(1250, function () { chatTyped.textContent = ''; agro.classList.add('is-m1'); });
      ac.at(1400, function () { restartClass(agro, 'is-up'); });
      ac.at(1950, function () { agro.classList.add('is-api'); restartClass(agro, 'is-down'); });
      ac.at(2500, function () { agro.classList.remove('is-api'); agro.classList.add('is-msg'); });
      // Réponse du coach : le chemin inverse, du web vers le mobile
      ac.at(3100, function () { agro.classList.add('is-api'); restartClass(agro, 'is-down-rev'); });
      ac.at(3650, function () { restartClass(agro, 'is-up-rev'); });
      ac.at(4150, function () { agro.classList.remove('is-api'); agro.classList.add('is-mtyping'); });
      ac.at(5000, function () { agro.classList.remove('is-mtyping'); agro.classList.add('is-m2'); });
    }

    renderFeeds();
    renderAlerts(false);
    setCache(true);
    $('[data-sa="next"]', agro).addEventListener('click', function () { publish(true); });
    $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { renderFeeds(); renderAlerts(false); }); });
    playWhenVisible(agro, function () { cacheWarm = false; publish(false); });
  }

  /* ---------------------------------------------------------------
     Pour les développeurs qui ouvrent la console
     --------------------------------------------------------------- */
  if (window.console && console.log) console.log(t('console'));
})();
