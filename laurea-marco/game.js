'use strict';

const intro = document.querySelector('#intro');
const arena = document.querySelector('#arena');
const finale = document.querySelector('#finale');
const start = document.querySelector('#start');
const action = document.querySelector('#action');
const gameTitle = document.querySelector('#game-title');
const gameStep = document.querySelector('#game-step');
const instructions = document.querySelector('#instructions');
const playfield = document.querySelector('#playfield');
const feedback = document.querySelector('#feedback');
const rounds = [...document.querySelectorAll('.round')];
const bars = [...document.querySelectorAll('.progress-bars i')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const stages = [
  { title: 'Pressione', setup: playPressure },
  { title: 'Prelievo', setup: playSample },
  { title: 'Vaccino', setup: playVaccine }
];

let stageIndex = -1;
let completed = 0;

start.addEventListener('click', () => openStage(0));
document.querySelector('#restart').addEventListener('click', () => {
  stageIndex = -1;
  completed = 0;
  finale.hidden = true;
  finale.querySelector('.confetti').replaceChildren();
  intro.hidden = false;
  updateProgress();
  start.focus();
});

function updateProgress() {
  document.querySelector('#progress-label').textContent = `${completed}/${stages.length} prove`;
  bars.forEach((bar, index) => bar.classList.toggle('filled', index < completed));
  rounds.forEach((round, index) => {
    const passed = index < completed;
    const current = index === stageIndex && !passed;
    round.dataset.state = passed ? 'passed' : current ? 'current' : 'pending';
    round.querySelector('.round-state').textContent = passed ? '✓' : '';
    if (current) round.setAttribute('aria-current', 'step');
    else round.removeAttribute('aria-current');
  });
}

function openStage(index) {
  stageIndex = index;
  const stage = stages[index];
  intro.hidden = true;
  arena.hidden = false;
  gameStep.textContent = `Prova ${index + 1} di ${stages.length}`;
  gameTitle.textContent = stage.title;
  playfield.replaceChildren();
  setFeedback('');
  setAction('', null);
  stage.setup();
  updateProgress();
  gameTitle.focus();
}

function setFeedback(message, tone = '') {
  feedback.textContent = message;
  feedback.dataset.tone = tone;
}

function setAction(label, handler) {
  action.textContent = label;
  action.onclick = handler;
  action.hidden = !label;
}

function passStage(message) {
  completed = stageIndex + 1;
  updateProgress();
  setFeedback(message, 'success');
  if (completed === stages.length) setAction('Vai al brindisi', showFinale);
  else setAction('Prossima prova', () => openStage(completed));
  action.focus();
}

function playPressure() {
  playfield.innerHTML = `
    <div class="gauge" aria-hidden="true"><div class="target"></div><div class="marker"></div></div>
    <input class="gauge-range" type="range" min="0" max="100" step="1" value="0" aria-label="Posizione dell’indicatore" aria-describedby="gauge-caption" hidden>
    <p class="gauge-caption" id="gauge-caption"></p>
    <button class="mode-button" type="button"></button>`;

  const marker = playfield.querySelector('.marker');
  const slider = playfield.querySelector('.gauge-range');
  const caption = playfield.querySelector('.gauge-caption');
  const modeButton = playfield.querySelector('.mode-button');
  const targetStart = 41;
  const targetEnd = 63;
  let untimed = reducedMotion.matches;
  let frame = 0;
  let position = 0;

  function moveMarker(value) {
    position = value;
    marker.style.left = `${value}%`;
  }

  function prepare() {
    cancelAnimationFrame(frame);
    moveMarker(0);
    slider.value = '0';
    slider.hidden = !untimed;
    slider.disabled = false;
    modeButton.textContent = untimed ? 'Usa il timer' : 'Gioca senza timer';
    instructions.textContent = untimed
      ? 'Sposta il cursore nella zona verde e conferma la lettura.'
      : 'Avvia il misuratore e ferma l’indicatore quando passa nella zona verde.';
    caption.textContent = untimed ? `Zona verde · da ${targetStart} a ${targetEnd}` : 'Ferma l’indicatore nella zona verde';
    setAction(untimed ? 'Conferma lettura' : 'Avvia misuratore', untimed ? checkReading : startGauge);
  }

  function startGauge() {
    moveMarker(0);
    setFeedback('');
    setAction('Ferma indicatore', checkReading);
    modeButton.hidden = true;
    const begin = performance.now();
    function animate(now) {
      const cycle = ((now - begin) / 1400) % 2;
      moveMarker((cycle <= 1 ? cycle : 2 - cycle) * 100);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
  }

  function checkReading() {
    cancelAnimationFrame(frame);
    if (position >= targetStart && position <= targetEnd) {
      slider.disabled = true;
      modeButton.hidden = true;
      caption.textContent = 'Lettura registrata';
      passStage('Pressione presa! Il primo paziente ti ringrazia.');
      return;
    }

    setFeedback('Fuori dalla zona verde. Riprova!', 'retry');
    modeButton.hidden = false;
    if (!untimed) setAction('Riprova la misurazione', startGauge);
  }

  slider.addEventListener('input', () => moveMarker(Number(slider.value)));
  modeButton.addEventListener('click', () => {
    untimed = !untimed;
    setFeedback('');
    prepare();
    if (untimed) slider.focus();
  });
  prepare();
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

const tubes = [
  { name: 'Rosa', color: '#ff8da4' },
  { name: 'Verde', color: '#8af1c6' },
  { name: 'Viola', color: '#bba6ff' },
  { name: 'Gialla', color: '#ffd78f' }
];

function showTube(container, tube) {
  const icon = document.createElement('span');
  icon.className = 'vial-icon';
  icon.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.textContent = tube.name;
  container.style.setProperty('--tube-color', tube.color);
  container.replaceChildren(icon, label);
}

function playSample() {
  const order = shuffled(tubes).slice(0, 3);
  let selected = [];
  playfield.innerHTML = '<div class="sequence" role="group" aria-label="Sequenza delle provette"></div><div class="tube-grid" hidden></div>';
  const sequence = playfield.querySelector('.sequence');
  const options = playfield.querySelector('.tube-grid');
  const slots = order.map(() => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    sequence.append(slot);
    return slot;
  });
  const tiles = tubes.map((tube) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'tile';
    showTube(tile, tube);
    tile.addEventListener('click', () => choose(tube));
    options.append(tile);
    return tile;
  });

  function reveal() {
    selected = [];
    instructions.textContent = 'Memorizza l’ordine delle tre provette, da sinistra a destra.';
    setFeedback('');
    options.hidden = true;
    slots.forEach((slot, index) => showTube(slot, order[index]));
    setAction('Ho memorizzato', guess);
  }

  function guess() {
    instructions.textContent = 'Tocca le provette nello stesso ordine in cui le hai viste.';
    setFeedback('');
    slots.forEach((slot, index) => { slot.textContent = index + 1; });
    options.hidden = false;
    tiles.forEach((tile) => { tile.disabled = false; });
    setAction('Rivedi la sequenza', reveal);
    tiles[0].focus();
  }

  function choose(tube) {
    showTube(slots[selected.length], tube);
    selected.push(tube);
    if (selected.length < order.length) {
      setFeedback(`${tube.name} aggiunta. Provette scelte ${selected.length} di ${order.length}.`);
      return;
    }

    tiles.forEach((tile) => { tile.disabled = true; });
    if (order.every((expected, index) => expected === selected[index])) {
      passStage('Sequenza perfetta! Le provette sono pronte.');
    } else {
      setFeedback('L’ordine è diverso. Rivedi la sequenza e riprova.', 'retry');
      action.focus();
    }
  }

  reveal();
}

function playVaccine() {
  instructions.textContent = 'Gira due tessere alla volta e trova le tre coppie sul vassoio.';
  const supplies = [
    { name: 'Cerotto', symbol: '✚' },
    { name: 'Fiala', symbol: '◆' },
    { name: 'Batuffolo', symbol: '✿' }
  ];
  const deck = shuffled([...supplies, ...supplies]);
  let open = [];
  let pairs = 0;
  const grid = document.createElement('div');
  grid.className = 'pair-grid';
  playfield.append(grid);

  function cover(card) {
    card.symbol.textContent = '?';
    card.label.textContent = `Tessera ${card.number}`;
    card.button.setAttribute('aria-pressed', 'false');
  }

  deck.forEach((supply, index) => {
    const button = document.createElement('button');
    button.className = 'tile';
    button.type = 'button';
    const symbol = document.createElement('span');
    symbol.className = 'pair-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    const card = { button, symbol, label, supply, number: index + 1 };
    button.append(symbol, label);
    grid.append(button);
    cover(card);
    button.addEventListener('click', () => flip(card));
  });

  function flip(card) {
    if (card.button.hasAttribute('data-matched') || (open.length === 1 && open[0] === card)) return;
    if (open.length === 2) {
      open.forEach(cover);
      open = [];
    }

    card.symbol.textContent = card.supply.symbol;
    card.label.textContent = card.supply.name;
    card.button.setAttribute('aria-pressed', 'true');
    open.push(card);
    if (open.length < 2) {
      setFeedback(`${card.supply.name}. Gira un’altra tessera.`);
      return;
    }

    if (open[0].supply !== card.supply) {
      setFeedback(`${open[0].supply.name} e ${card.supply.name}. Tocca una tessera per riprovare.`, 'retry');
      return;
    }

    open.forEach(({ button }) => {
      button.dataset.matched = '';
      button.setAttribute('aria-disabled', 'true');
    });
    open = [];
    pairs++;
    if (pairs === supplies.length) passStage('Tutte le coppie trovate. Il turno è finito!');
    else setFeedback(`Coppia trovata! ${pairs} di ${supplies.length}.`, 'success');
  }
}

function showFinale() {
  arena.hidden = true;
  finale.hidden = false;
  if (!reducedMotion.matches) {
    const holder = finale.querySelector('.confetti');
    const colors = ['#8af1c6', '#ff7487', '#bba6ff', '#ffd78f'];
    for (let index = 0; index < 44; index++) {
      const piece = document.createElement('i');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty('--piece-color', colors[index % colors.length]);
      piece.style.setProperty('--duration', `${2 + Math.random() * 2}s`);
      piece.style.setProperty('--delay', `${Math.random() * .8}s`);
      piece.style.setProperty('--drift', `${Math.random() * 130 - 65}px`);
      holder.append(piece);
    }
  }
  document.querySelector('#final-title').focus();
}
