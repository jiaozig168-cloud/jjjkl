(() => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const storageKey = 'loveQuizAmbientMusic';
  const step = 0.56;
  const phrase = [
    { note: 523.25, length: 1.5 },
    { note: 659.25, length: 1 },
    { note: 783.99, length: 2 },
    { note: null, length: 1 },
    { note: 698.46, length: 1.5 },
    { note: 659.25, length: 1 },
    { note: 587.33, length: 2 },
    { note: null, length: 1 },
    { note: 493.88, length: 1.5 },
    { note: 587.33, length: 1 },
    { note: 659.25, length: 2 },
    { note: null, length: 1 },
    { note: 523.25, length: 1 },
    { note: 587.33, length: 1 },
    { note: 523.25, length: 2.5 },
    { note: null, length: 1.5 }
  ];
  let context;
  let master;
  let timer;
  let nextTime = 0;
  let phraseIndex = 0;
  let started = false;

  function softTone(frequency, time, duration, volume, type = 'sine') {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1250, time);
    filter.Q.value = 0.25;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(volume * 0.45, time + duration * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.08);
  }

  function schedule() {
    while (nextTime < context.currentTime + 0.3) {
      const item = phrase[phraseIndex % phrase.length];

      if (item.note) {
        softTone(item.note, nextTime, step * item.length * 0.88, 0.095, 'triangle');
        softTone(item.note * 2, nextTime + 0.035, step * 0.7, 0.012, 'sine');
      }

      nextTime += step * item.length;
      phraseIndex = (phraseIndex + 1) % phrase.length;
    }
  }

  async function startMusic() {
    if (started) {
      if (context.state === 'suspended') await context.resume();
      return;
    }

    context = new AudioContextClass();
    master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.075, context.currentTime + 1.8);
    master.connect(context.destination);

    nextTime = context.currentTime + 0.08;
    schedule();
    timer = window.setInterval(schedule, 100);
    started = true;
    sessionStorage.setItem(storageKey, 'on');
    await context.resume();
  }

  const activate = () => startMusic().catch(() => {});

  window.addEventListener('pointerdown', activate, { passive: true, once: true });
  window.addEventListener('keydown', activate, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && sessionStorage.getItem(storageKey) === 'on') activate();
  });
  window.addEventListener('pagehide', () => {
    if (timer) window.clearInterval(timer);
  });

  if (sessionStorage.getItem(storageKey) === 'on') activate();
})();
