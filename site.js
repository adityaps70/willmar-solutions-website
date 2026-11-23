
(function(){
  var COMBINED = false;
  var CONTACT_EMAIL = "services@willmarsolutions.com"; // enquiry form hands off to this inbox via the visitor's email app
  var header = document.getElementById('header');
  var drawer = document.getElementById('drawer');
  var svcLi = document.querySelector('.has-menu');
  var svcBtn = document.getElementById('svc-toggle');

  // header state
  function updateHeader(){
    var hero = document.getElementById('hero');
    var dark = false;
    if (hero && !hero.closest('.page[hidden]')){ dark = window.scrollY < hero.offsetHeight - 70; }
    header.classList.toggle('on-dark', dark);
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', updateHeader, {passive:true});

  // services dropdown
  if (svcBtn && svcLi){
    svcBtn.addEventListener('click', function(ev){ ev.stopPropagation(); var open = svcLi.getAttribute('aria-expanded') === 'true'; svcLi.setAttribute('aria-expanded', open ? 'false' : 'true'); });
    document.addEventListener('click', function(){ svcLi.setAttribute('aria-expanded','false'); });
  }
  document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape'){ if (svcLi) svcLi.setAttribute('aria-expanded','false'); closeDrawer(); } });

  // mobile drawer
  function closeDrawer(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  document.getElementById('burger').addEventListener('click', function(){ drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; });
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function(ev){ if (ev.target.closest('a')) closeDrawer(); });

  // services rail
  document.querySelectorAll('.carousel').forEach(function(c){
    var rail = c.querySelector('.rail'); var head = c.parentElement.querySelector('.arrows'); if(!rail||!head) return;
    var step = function(){ var first = rail.firstElementChild; return first ? first.getBoundingClientRect().width + 18 : 300; };
    head.querySelector('.prev').addEventListener('click', function(){ rail.scrollBy({left:-step(), behavior:'smooth'}); });
    head.querySelector('.next').addEventListener('click', function(){ rail.scrollBy({left: step(), behavior:'smooth'}); });
  });

  // reveal: only elements below the fold start hidden; everything at rest is visible
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.remove('pre'); io.unobserve(en.target); } }); }, {rootMargin:'0px 0px -8% 0px'}) : null;
  function armReveal(scope){
    if(!io) return;
    scope.querySelectorAll('.rv').forEach(function(el){
      el.classList.remove('pre');
      if (el.getBoundingClientRect().top > window.innerHeight){ el.classList.add('pre'); io.observe(el); }
    });
  }

  // count-up stats (35+, 1,000+, 6 …); non-numeric labels stay as written
  var cio = ('IntersectionObserver' in window) ? new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(!en.isIntersecting) return; cio.unobserve(en.target); var el=en.target, raw=el.dataset.count||'', m=/^([\d,]+)(.*)$/.exec(raw); if(!m) return; var target=parseInt(m[1].replace(/,/g,''),10), suffix=m[2], t0=null; if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; function step(ts){ if(!t0) t0=ts; var p=Math.min(1,(ts-t0)/1400); var v=Math.round(target*(1-Math.pow(1-p,3))); el.textContent=v.toLocaleString('en-US')+suffix; if(p<1) requestAnimationFrame(step); } el.textContent='0'+suffix; requestAnimationFrame(step); }); }, {threshold:.6}) : null;
  function armCounters(scope){ if(!cio) return; scope.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); }); }

  // contact form
  function initForm(scope){
    var form = scope.querySelector('#enquiry'); if(!form) return;
    var sel = form.querySelector('#f-service');
    var q = COMBINED ? (location.hash.split('?')[1] || '') : location.search.slice(1);
    var m = /(?:^|&)service=([^&]+)/.exec(q);
    if (m && sel){ var v = decodeURIComponent(m[1]); if ([].some.call(sel.options, function(o){return o.value===v;})) sel.value = v; }
    var msg = form.querySelector('#form-msg');
    var nextField = form.querySelector('#f-next');
    var back = location.origin + location.pathname + '?sent=1' + (COMBINED ? '#/contact' : '');
    if (nextField) nextField.value = back;
    var sentQ = COMBINED ? location.search : location.search;
    if (/(?:\?|&)sent=1(?:&|$)/.test(sentQ)){
      msg.innerHTML = '<strong>Thank you — your enquiry has been received.</strong> Willmar Solutions will review the details and reply to the email address you provided.';
      msg.classList.add('show','ok');
      form.querySelectorAll('input:not([type=hidden]),select,textarea').forEach(function(f){ if (f.type !== 'submit') f.value = ''; });
      setTimeout(function(){ msg.scrollIntoView({behavior:'smooth', block:'center'}); }, 300);
      try { history.replaceState(null, '', location.pathname + (COMBINED ? '#/contact' : '')); } catch(e){}
    }
    form.addEventListener('submit', function(ev){
      var name = form.querySelector('#f-name').value.trim(), email = form.querySelector('#f-email').value.trim();
      var ok = name && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if(!ok){ ev.preventDefault(); msg.textContent = 'Please add your name and a valid email address so we can reply.'; msg.classList.remove('ok'); msg.classList.add('show'); return; }
      var btn = form.querySelector('button[type=submit] span'); if (btn) btn.textContent = 'Sending…';
      form.querySelector('button[type=submit]').disabled = true;
    });
  }

  // hero: word-by-word reveal, cursor + scroll parallax, magnetic button
  function initHero(scope){
    var hero = scope.querySelector('.hero2'); if(!hero || hero.dataset.ready) return; hero.dataset.ready = '1';
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    [].forEach.call([], function(el){
      var base = parseInt(el.dataset.delay||'0',10), idx = 0;
      function walk(node){
        [].slice.call(node.childNodes).forEach(function(n){
          if (n.nodeType === 3){
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function(part){
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w'; var i = document.createElement('span'); i.textContent = part; i.style.animationDelay = ((base + idx++) * 55) + 'ms'; w.appendChild(i); frag.appendChild(w);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1) walk(n);
        });
      }
      if (!rm) walk(el); el.classList.add('is-words');
    });
    var vis = hero.querySelector('#hero-visual'); if(!vis || rm) return;
    var mx = 0, my = 0, tx = 0, ty = 0, sy = 0, raf = null;
    function tick(){ tx += (mx - tx) * .08; ty += (my - ty) * .08; vis.style.setProperty('--mx', tx.toFixed(3)); vis.style.setProperty('--my', ty.toFixed(3)); vis.style.setProperty('--sy', sy.toFixed(1)); raf = (Math.abs(mx-tx) > .001 || Math.abs(my-ty) > .001) ? requestAnimationFrame(tick) : null; }
    function kick(){ if(!raf) raf = requestAnimationFrame(tick); }
    hero.addEventListener('mousemove', function(ev){ var r = hero.getBoundingClientRect(); mx = (ev.clientX - r.left) / r.width - .5; my = (ev.clientY - r.top) / r.height - .5; kick(); });
    hero.addEventListener('mouseleave', function(){ mx = 0; my = 0; kick(); });
    window.addEventListener('scroll', function(){ sy = Math.min(window.scrollY, 900); vis.style.setProperty('--sy', sy.toFixed(1)); }, {passive:true});
    hero.querySelectorAll('.magnetic').forEach(function(btn){
      btn.addEventListener('mousemove', function(ev){ var r = btn.getBoundingClientRect(); var dx = ev.clientX - (r.left + r.width/2), dy = ev.clientY - (r.top + r.height/2); btn.style.transform = 'translate(' + (dx*.18).toFixed(1) + 'px,' + (dy*.28).toFixed(1) + 'px)'; });
      btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
    });
  }

  // combined-file router
  function route(){
    if(!COMBINED){ updateHeader(); armReveal(document); armCounters(document); initForm(document); initHero(document); return; }
    var h = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
    var pages = document.querySelectorAll('.page'); var found = null;
    pages.forEach(function(p){ var on = p.dataset.page === h; p.hidden = !on; if(on) found = p; });
    var anchor = null;
    if(!found){ pages.forEach(function(p){ p.hidden = p.dataset.page !== 'home'; if(p.dataset.page==='home') found=p; }); anchor = document.getElementById(h); }
    document.title = (found.dataset.title ? found.dataset.title + ' — ' : '') + 'Willmar Solutions';
    document.querySelectorAll('.nav a[data-page]').forEach(function(a){ a.classList.toggle('active', a.dataset.page === h); });
    closeDrawer(); if (svcLi) svcLi.setAttribute('aria-expanded','false');
    if (anchor){ anchor.scrollIntoView({behavior:'smooth',block:'start'}); } else { window.scrollTo(0,0); }
    updateHeader(); armReveal(found); armCounters(found); initForm(found); initHero(found);
  }
  // rev2: back-to-top button and the Services jump bar
  var toTop = document.getElementById('to-top');
  if (toTop){
    window.addEventListener('scroll', function(){ toTop.classList.toggle('show', window.scrollY > 700); }, {passive:true});
    toTop.addEventListener('click', function(ev){ ev.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); });
  }
  var jump = document.getElementById('jump');
  if (jump && 'IntersectionObserver' in window){
    var links = {}, current = null;
    jump.querySelectorAll('a').forEach(function(a){ links[a.getAttribute('href').slice(1)] = a; });
    var mark = function(id){
      if (id === current) return; current = id;
      Object.keys(links).forEach(function(k){ links[k].classList.toggle('on', k === id); });
      var a = links[id], box = jump.querySelector('.jump-links');
      if (a && box) box.scrollTo({left: a.offsetLeft - box.offsetLeft - 16, behavior:'smooth'});
    };
    var jio = new IntersectionObserver(function(entries){ entries.forEach(function(en){ if (en.isIntersecting) mark(en.target.id); }); }, {rootMargin:'-30% 0px -60% 0px'});
    Object.keys(links).forEach(function(id){ var el = document.getElementById(id); if (el) jio.observe(el); });
  }

  window.addEventListener('hashchange', route);
  route();
})();
