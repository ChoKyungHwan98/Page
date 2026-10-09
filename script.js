(() => {
  'use strict';

  const routes = ['home', 'work', 'resume', 'about'];
  const views = Object.fromEntries(routes.map(id => [id, document.getElementById(id)]));
  const transition = document.getElementById('page-transition');
  const status = document.getElementById('screen-status');
  const flash = document.getElementById('impact-flash');
  const modal = document.getElementById('rhythm-modal');
  const pads = { left: document.getElementById('pad-left'), right: document.getElementById('pad-right') };
  const instruction = document.getElementById('rhythm-instruction');
  const feedback = document.getElementById('rhythm-feedback');
  const startButton = document.getElementById('rhythm-start');
  const closeButton = document.getElementById('rhythm-close');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const displayNames = { home: '홈', work: '포트폴리오', resume: '이력서', about: '자기소개서' };

  let current = 'home';
  let busy = false;
  let soundEnabled = false;
  let audioContext = null;
  let previousFocus = null;
  let rhythmTimers = [];
  let beatState = 'idle';
  let expectedBeat = 0;
  let listenStart = 0;
  let hits = [];
  const pattern = ['left', 'right', 'left', 'right'];
  const beatLength = 625; // Four audible quarter notes at 96 BPM.

  function sleep(ms) { return new Promise(resolve => window.setTimeout(resolve, ms)); }
  function getHashRoute() { const route = location.hash.replace(/^#\/?/, '').trim(); return routes.includes(route) ? route : 'home'; }
  function updateUrl(route) { if (location.origin === 'null') return; history.replaceState(null, '', route === 'home' ? location.pathname + location.search : `#${route}`); }
  function openView(route) {
    routes.forEach(id => {
      const active = id === route;
      views[id].hidden = !active;
      views[id].classList.toggle('is-active', active);
      if (active) views[id].removeAttribute('aria-hidden');
      else views[id].setAttribute('aria-hidden', 'true');
    });
    current = route;
    updateUrl(route);
    document.title = `CKH — ${displayNames[route]} / Game Design`;
    document.querySelectorAll('.inner-rail__links button').forEach(button => {
      const active = button.dataset.route === route;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
    status.textContent = `${displayNames[route]} 화면으로 이동했습니다.`;
  }

  async function navigate(route) {
    if (!routes.includes(route) || route === current || busy) return;
    if (!modal.hidden) closeRhythm();
    if (reducedMotion.matches) { openView(route); return; }
    busy = true;
    const comingFromHome = current === 'home';
    document.querySelectorAll('[data-route]').forEach(button => { button.disabled = true; });
    if (comingFromHome) {
      document.body.classList.add('is-anticipating');
      await sleep(330);
      document.body.classList.remove('is-anticipating');
      document.body.classList.add('is-striking');
      soundImpact();
      flash.classList.add('is-flashing');
    }
    transition.className = 'page-transition is-cutting';
    await sleep(730);
    openView(route);
    transition.className = 'page-transition is-opening';
    await sleep(660);
    transition.className = 'page-transition';
    flash.classList.remove('is-flashing');
    document.body.classList.remove('is-striking', 'is-anticipating');
    document.querySelectorAll('[data-route]').forEach(button => { button.disabled = false; });
    busy = false;
  }

  document.querySelectorAll('[data-route]').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.route));
  });

  function getAudio() {
    if (!soundEnabled) return null;
    try {
      if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      return audioContext;
    } catch { return null; }
  }

  function playTone(type = 'left', quiet = false) {
    const ctx = getAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    osc.type = type === 'left' ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(type === 'left' ? 180 : 280, t);
    osc.frequency.exponentialRampToValueAtTime(type === 'left' ? 67 : 115, t + .095);
    gain.gain.setValueAtTime(quiet ? .07 : .16, t);
    gain.gain.exponentialRampToValueAtTime(.0001, t + .17);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + .18);
  }

  function soundImpact() {
    const ctx = getAudio();
    if (!ctx) return;
    playTone('left');
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + .3);
    gain.gain.setValueAtTime(.13, t);
    gain.gain.exponentialRampToValueAtTime(.001, t + .3);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + .3);
  }

  document.querySelectorAll('[data-sound-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      button.setAttribute('aria-pressed', String(soundEnabled));
      button.textContent = soundEnabled ? '[♪] SOUND ON' : '[×] SOUND OFF';
      if (soundEnabled) playTone('left', true);
    });
  });

  function setRhythmMessage(text, response = '') {
    instruction.textContent = text;
    if (response) feedback.textContent = response;
  }
  function schedule(callback, ms) { const id = window.setTimeout(callback, ms); rhythmTimers.push(id); return id; }
  function clearRhythmTimers() { rhythmTimers.forEach(clearTimeout); rhythmTimers = []; }
  function pulsePad(which, quick = false) {
    const pad = pads[which];
    if (!pad) return;
    pad.classList.remove('is-hit');
    void pad.offsetWidth;
    pad.classList.add('is-hit');
    playTone(which, quick);
    schedule(() => pad.classList.remove('is-hit'), 165);
  }
  function openRhythm() {
    if (busy || !modal.hidden) return;
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    clearRhythmTimers();
    beatState = 'idle'; expectedBeat = 0; hits = [];
    startButton.hidden = false;
    startButton.disabled = false;
    startButton.textContent = 'START THE PATTERN ↗';
    setRhythmMessage('층간소음에 대응해볼 거예요.', '두 버튼을 눌러 장구를 쳐 보세요.');
    closeButton.focus();
  }
  function closeRhythm() {
    clearRhythmTimers();
    beatState = 'idle';
    modal.hidden = true;
    document.body.style.overflow = '';
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
  }
  document.getElementById('play-trigger').addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    if (!reducedMotion.matches) {
      document.body.classList.add('is-anticipating');
      await sleep(285);
      document.body.classList.remove('is-anticipating');
      document.body.classList.add('is-striking');
      soundImpact();
      await sleep(215);
      document.body.classList.remove('is-striking');
    }
    busy = false;
    openRhythm();
  });
  document.getElementById('how-to-trigger').addEventListener('click', openRhythm);
  closeButton.addEventListener('click', closeRhythm);
  modal.addEventListener('click', e => { if (e.target === modal) closeRhythm(); });

  function startRhythm() {
    clearRhythmTimers();
    beatState = 'demo'; expectedBeat = 0; hits = [];
    startButton.hidden = true;
    setRhythmMessage('먼저 들려줄게요. 잘 따라와 보세요.', 'LISTEN / 덩 — 따 — 덩 — 따');
    pattern.forEach((note, i) => {
      schedule(() => { pulsePad(note, true); feedback.textContent = `LISTEN / ${i + 1} OF ${pattern.length}`; }, 550 + beatLength * i);
    });
    const responseDelay = 550 + beatLength * pattern.length + 270;
    schedule(() => {
      beatState = 'listen';
      expectedBeat = 0;
      listenStart = performance.now() + 400;
      setRhythmMessage('이제 똑같이 쳐 보세요!', 'YOUR TURN / SPACE → SPACE →');
      schedule(() => { if (beatState === 'listen') finishRhythm(true); }, 5100);
    }, responseDelay);
  }
  function finishRhythm(timedOut = false) {
    if (beatState !== 'listen') return;
    beatState = 'done';
    const right = hits.filter(h => h.correct).length;
    const accurate = hits.filter(h => h.grade === 'PERFECT').length;
    setRhythmMessage(right === 4 ? '좋아요. 이제 리듬을 알겠죠?' : '다시 도전해도 괜찮아요.', `${right} / 4 CORRECT · ${accurate} PERFECT${timedOut ? ' · TIME UP' : ''}`);
    startButton.hidden = false;
    startButton.textContent = 'TRY AGAIN ↗';
  }
  function pressPad(which) {
    pulsePad(which);
    if (beatState !== 'listen') {
      if (beatState === 'idle') feedback.textContent = which === 'left' ? '덩!  SPACE' : '따!  RIGHT ARROW';
      return;
    }
    const correct = pattern[expectedBeat] === which;
    const drift = Math.abs(performance.now() - (listenStart + expectedBeat * beatLength));
    const grade = !correct ? 'WRONG KEY' : drift <= 180 ? 'PERFECT' : drift <= 340 ? 'GOOD' : 'OK';
    hits.push({ correct, grade });
    expectedBeat++;
    feedback.textContent = `${grade} / ${expectedBeat} OF ${pattern.length}`;
    if (expectedBeat >= pattern.length) {
      clearRhythmTimers();
      schedule(() => finishRhythm(), 380);
    }
  }
  startButton.addEventListener('click', startRhythm);
  Object.entries(pads).forEach(([which, pad]) => pad.addEventListener('click', () => pressPad(which)));
  window.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeRhythm(); return; }
    if (event.key === 'Tab') {
      const controls = Array.from(modal.querySelectorAll('button:not([hidden]):not([disabled])'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (event.key === ' ' || event.code === 'Space') { event.preventDefault(); if (!event.repeat) pressPad('left'); }
    if (event.key === 'ArrowRight') { event.preventDefault(); if (!event.repeat) pressPad('right'); }
  });
  window.addEventListener('hashchange', () => { const target = getHashRoute(); if (target !== current && !busy) navigate(target); });
  openView(getHashRoute());
})();
