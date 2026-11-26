const documents = {
  repair: {
    title: '维修流程原图',
    description: '从设备修复委托到硬件、软件维修。可直接定位到寻找佩内洛普的分支。',
    file: 'repair-flow.svg',
    width: 5446.7783,
    height: 12746,
  },
  incident: {
    title: '事故调查原图',
    description: '维修后的调查分支，包含证据核实和结局信息。',
    file: 'incident-flow.svg',
    width: 1774.5972,
    height: 11094,
  },
};

const overview = document.querySelector('[data-section="case"]');
const source = document.querySelector('[data-section="source"]');
const sourceTitle = document.getElementById('source-title');
const sourceDescription = document.getElementById('source-description');
const directLink = document.getElementById('open-svg');
const viewport = document.getElementById('diagram-viewport');
const image = document.getElementById('source-diagram');
const readout = document.getElementById('scale-readout');
const focusButton = document.querySelector('[data-action="focus"]');
const navigation = document.querySelectorAll('[data-section-link]');

let active = '';
let diagram;
let scale = 1;
let mode = 'fit';
let caseScroll = 0;
let caseTrigger;
let drag;

history.scrollRestoration = 'manual';

function fitScale() {
  return Math.min(viewport.clientWidth / diagram.width, viewport.clientHeight / diagram.height, 1);
}

function centerPoint() {
  return {
    x: (viewport.scrollLeft + viewport.clientWidth / 2 - image.offsetLeft) / scale,
    y: (viewport.scrollTop + viewport.clientHeight / 2 - image.offsetTop) / scale,
  };
}

function sizeDiagram(next, point) {
  scale = Math.max(fitScale() * 0.7, Math.min(next, 2.5));
  image.style.width = `${diagram.width * scale}px`;
  image.style.height = `${diagram.height * scale}px`;
  readout.value = `${Math.round(scale * 100)}%`;
  viewport.scrollLeft = point ? image.offsetLeft + point.x * scale - viewport.clientWidth / 2 : 0;
  viewport.scrollTop = point ? image.offsetTop + point.y * scale - viewport.clientHeight / 2 : 0;
}

function showFit() {
  mode = 'fit';
  sizeDiagram(fitScale());
}

function showWidth() {
  mode = 'width';
  sizeDiagram(viewport.clientWidth / diagram.width);
}

function showPenelope() {
  mode = 'manual';
  const targetScale = Math.max(0.72, viewport.clientWidth / 1650);
  sizeDiagram(targetScale, {
    x: 4700,
    y: 6470 + (viewport.clientHeight * 0.37) / targetScale,
  });
}

function zoom(factor) {
  mode = 'manual';
  sizeDiagram(scale * factor, centerPoint());
}

function selectSection(moveFocus) {
  const hash = location.hash.slice(1);
  if (hash === 'reader' && active) return;
  const next = hash === 'repair-focus' ? 'repair' : Object.hasOwn(documents, hash) ? hash : 'case';
  const previous = active;
  if (previous === 'case' && next !== 'case') {
    caseScroll = window.scrollY;
    caseTrigger = document.activeElement;
  }
  active = next;

  navigation.forEach((link) => {
    if (link.dataset.sectionLink === next) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  overview.hidden = next !== 'case';
  source.hidden = next === 'case';

  if (next === 'case') {
    if (moveFocus) {
      const target = overview.contains(caseTrigger) ? caseTrigger : document.getElementById('case-title');
      target.focus({ preventScroll: true });
      window.scrollTo(0, caseScroll);
    }
    return;
  }

  diagram = documents[next];
  sourceTitle.textContent = diagram.title;
  sourceDescription.textContent = diagram.description;
  if (image.getAttribute('src') !== diagram.file) image.src = diagram.file;
  image.alt = diagram.title;
  directLink.href = diagram.file;
  focusButton.hidden = next !== 'repair';

  if (hash === 'repair-focus') showPenelope();
  else showFit();

  if (moveFocus) sourceTitle.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

document.querySelector('.viewer-toolbar').addEventListener('click', (event) => {
  const action = event.target.closest('button')?.dataset.action;
  if (action === 'fit') showFit();
  if (action === 'width') showWidth();
  if (action === 'focus') showPenelope();
  if (action === 'in') zoom(1.35);
  if (action === 'out') zoom(1 / 1.35);
});

viewport.addEventListener('keydown', (event) => {
  if (event.key === '+' || event.key === '=') zoom(1.35);
  else if (event.key === '-') zoom(1 / 1.35);
  else return;
  event.preventDefault();
});

viewport.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  viewport.focus({ preventScroll: true });
  viewport.setPointerCapture(event.pointerId);
  drag = { x: event.clientX + viewport.scrollLeft, y: event.clientY + viewport.scrollTop };
  viewport.classList.add('is-dragging');
  event.preventDefault();
});

viewport.addEventListener('pointermove', (event) => {
  if (!drag) return;
  viewport.scrollLeft = drag.x - event.clientX;
  viewport.scrollTop = drag.y - event.clientY;
});

viewport.addEventListener('lostpointercapture', () => {
  drag = undefined;
  viewport.classList.remove('is-dragging');
});

new ResizeObserver(() => {
  if (source.hidden) return;
  if (mode === 'fit') showFit();
  if (mode === 'width') showWidth();
}).observe(viewport);

window.addEventListener('hashchange', () => selectSection(true));
selectSection(false);
