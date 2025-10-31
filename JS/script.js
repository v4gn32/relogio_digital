  /* Variáveis e Elementos DOM */
  const modeButtons = document.querySelectorAll('.mode-btn');
  const label = document.getElementById('label');
  const timeEl = document.getElementById('time');
  const extraEl = document.getElementById('extra');

  // Sections
  const clockSection = document.getElementById('clockSection');
  const stopwatchSection = document.getElementById('stopwatchSection');
  const timerSection = document.getElementById('timerSection');

  // Theme
  const toggleThemeBtn = document.getElementById('toggleTheme');
  let dark = false;

  /* MODO: Alternar entre Relógio / Cronômetro / Temporizador */
  function setMode(mode){
    // Atualiza classes e aria-selected
    modeButtons.forEach(btn => {
      const is = btn.dataset.mode === mode;
      btn.classList.toggle('active', is);
      btn.setAttribute('aria-selected', is ? 'true' : 'false');
    });

    // Esconder/mostrar seções
    clockSection.hidden = mode !== 'clock';
    stopwatchSection.hidden = mode !== 'stopwatch';
    timerSection.hidden = mode !== 'timer';

    // Atualiza o label e o aria-live
    if(mode === 'clock'){ label.textContent = 'Relógio Digital'; extraEl.style.display = 'block'; }
    if(mode === 'stopwatch'){ label.textContent = 'Cronômetro'; extraEl.style.display = 'none'; }
    if(mode === 'timer'){ label.textContent = 'Temporizador'; extraEl.style.display = 'none'; }
  }

  modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));

  /* RELÓGIO DIGITAL - atualiza a cada segundo */
  function pad(n, width = 2){ return String(n).padStart(width, '0'); }

  function updateClock(){
    const now = new Date();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    timeEl.textContent = `${hh}:${mm}:${ss}`;
    extraEl.textContent = `Data: ${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
  }
  // Roda imediatamente e depois a cada segundo
  updateClock();
  setInterval(updateClock, 1000);

  /* CRONÔMETRO (Stopwatch) 
    - Usa performance.now() para precisão
     - start / stop / lap / reset
  */
  const swStartBtn = document.getElementById('swStart');
  const swStopBtn  = document.getElementById('swStop');
  const swLapBtn   = document.getElementById('swLap');
  const swResetBtn = document.getElementById('swReset');
  const lapsEl     = document.getElementById('laps');

  let swRunning = false;
  let swStartTime = 0;        // timestamp quando iniciado
  let swElapsed = 0;          // tempo acumulado em ms quando pausado
  let swRafId = null;
  let lapCounter = 0;

  function formatTime(ms){
    const total = Math.floor(ms);
    const cs = Math.floor((total % 1000) / 10); // centésimos
    const s = Math.floor(total / 1000) % 60;
    const m = Math.floor(total / 60000) % 60;
    const h = Math.floor(total / 3600000);
    return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs,2)}`;
  }

  function swTick(){
    const now = performance.now();
    const diff = now - swStartTime + swElapsed; // tempo total corrido em ms
    timeEl.textContent = formatTime(diff);
    swRafId = requestAnimationFrame(swTick);
  }

  swStartBtn.addEventListener('click', () => {
    if(!swRunning){
      swRunning = true;
      swStartTime = performance.now();
      swRafId = requestAnimationFrame(swTick);
      // atualizar botões
      swStartBtn.disabled = true;
      swStopBtn.disabled = false;
      swLapBtn.disabled = false;
      swResetBtn.disabled = false;
    }
  });

  swStopBtn.addEventListener('click', () => {
    if(swRunning){
      swRunning = false;
      cancelAnimationFrame(swRafId);
      // acumula o tempo
      swElapsed = (performance.now() - swStartTime) + swElapsed;
      // atualizar botões
      swStartBtn.disabled = false;
      swStopBtn.disabled = true;
      swLapBtn.disabled = true;
    }
  });

  swLapBtn.addEventListener('click', () => {
    if(!swRunning) return;
    lapCounter++;
    const nowElapsed = (performance.now() - swStartTime) + swElapsed;
    const div = document.createElement('div');
    div.className = 'lap';
    div.innerHTML = `<span>LAP ${lapCounter}</span><span>${formatTime(nowElapsed)}</span>`;
    // inserir no topo
    lapsEl.prepend(div);
  });

  swResetBtn.addEventListener('click', () => {
    // reset a tudo
    swRunning = false;
    cancelAnimationFrame(swRafId);
    swStartTime = 0; swElapsed = 0; lapCounter = 0;
    lapsEl.innerHTML = '';
    timeEl.textContent = '00:00:00.00';
    // botões
    swStartBtn.disabled = false;
    swStopBtn.disabled = true;
    swLapBtn.disabled = true;
    swResetBtn.disabled = true;
  });

  /* TEMPORIZADOR (Timer)
     - Converter input -> ms
     - start / pause / reset
     - quando chega em zero toca som
  */
  const tHours = document.getElementById('tHours');
  const tMinutes = document.getElementById('tMinutes');
  const tSeconds = document.getElementById('tSeconds');
  const tStart = document.getElementById('tStart');
  const tPause = document.getElementById('tPause');
  const tReset = document.getElementById('tReset');

  let timerDuration = 0; // ms
  let timerEndAt = 0;    // timestamp quando terminará (performance.now based)
  let timerRaf = null;
  let timerRunning = false;
  let timerRemaining = 0;

  function getInputDurationMs(){
    const h = Math.max(0, Number(tHours.value) || 0);
    const m = Math.max(0, Number(tMinutes.value) || 0);
    const s = Math.max(0, Number(tSeconds.value) || 0);
    return (h*3600 + m*60 + s) * 1000;
  }

  function updateTimerDisplay(ms){
    if(ms < 0) ms = 0;
    const total = Math.floor(ms);
    const s = Math.floor(total / 1000) % 60;
    const m = Math.floor(total / 60000) % 60;
    const h = Math.floor(total / 3600000);
    timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function playBeep(){
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 600);
    } catch (e) {
      // fallback: alerta visual
      alert('Temporizador finalizado!');
    }
  }

  function timerTick(){
    const now = performance.now();
    const rem = Math.round(timerEndAt - now);
    timerRemaining = rem;
    updateTimerDisplay(rem);
    if(rem <= 0){
      timerRunning = false;
      cancelAnimationFrame(timerRaf);
      tPause.disabled = true;
      tReset.disabled = false;
      tStart.disabled = false;
      playBeep();
      return;
    }
    timerRaf = requestAnimationFrame(timerTick);
  }

  tStart.addEventListener('click', () => {
    // se já está rodando, não fazer nada
    if(timerRunning) return;

    // Se já existe um timer pausado (timerRemaining), retoma
    if(timerRemaining > 0){
      timerEndAt = performance.now() + timerRemaining;
      timerRunning = true;
      timerRaf = requestAnimationFrame(timerTick);
      tStart.disabled = true; tPause.disabled = false; tReset.disabled = false;
      return;
    }

    // Senão, pega os valores dos inputs
    const ms = getInputDurationMs();
    if(ms <= 0){
      alert('Defina um tempo válido (horas, minutos ou segundos).');
      return;
    }
    timerDuration = ms;
    timerEndAt = performance.now() + ms;
    timerRunning = true;
    timerRaf = requestAnimationFrame(timerTick);
    tStart.disabled = true; tPause.disabled = false; tReset.disabled = false;
  });

  tPause.addEventListener('click', () => {
    if(!timerRunning) return;
    timerRunning = false;
    cancelAnimationFrame(timerRaf);
    // timerRemaining já é atualizado no tick
    tStart.disabled = false; tPause.disabled = true; tReset.disabled = false;
  });

  tReset.addEventListener('click', () => {
    timerRunning = false;
    cancelAnimationFrame(timerRaf);
    timerDuration = 0;
    timerRemaining = 0;
    tHours.value = tMinutes.value = tSeconds.value = '';
    updateClock(); // volta a mostrar horário atual no display
    tStart.disabled = false; tPause.disabled = true; tReset.disabled = true;
  });

  /* Tema simples (claro / escuro) */
  toggleThemeBtn.addEventListener('click', () => {
    dark = !dark;
    if(dark){
      document.documentElement.style.background = '#0b1220';
      document.body.style.background = '#0b1220';
      document.querySelector('.card').style.background = '#0f1724';
      document.querySelector('.card').style.color = '#e6eef8';
    } else {
      document.documentElement.style.background = '';
      document.body.style.background = '';
      document.querySelector('.card').style.background = '';
      document.querySelector('.card').style.color = '';
    }
  });

  /* Inicialização */
  // Define modo inicial
  setMode('clock');

  // Accessibility: permitir teclado para trocar modos com 1/2/3
  window.addEventListener('keydown', (e) => {
    if(e.key === '1') setMode('clock');
    if(e.key === '2') setMode('stopwatch');
    if(e.key === '3') setMode('timer');
  });
