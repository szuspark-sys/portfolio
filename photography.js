(() => {
  for (const card of document.querySelectorAll('.photo-cover')) {
    const alternate = card.querySelector('[data-cover-src]');
    if (!alternate) continue;
    const reveal = () => {
      if (alternate.getAttribute('src') === alternate.dataset.coverSrc) return;
      alternate.addEventListener('load', () => { alternate.dataset.loaded = ''; }, { once: true });
      alternate.src = alternate.dataset.coverSrc;
    };
    if (matchMedia('(hover: hover)').matches) card.addEventListener('pointerenter', reveal, { once: true });
    card.addEventListener('focus', reveal, { once: true });
  }

  const gallery = document.querySelector('[data-photo-gallery]');
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll('[data-photo-slide]'));
  const stage = gallery.querySelector('[data-photo-stage]');
  const prev = gallery.querySelector('[data-photo-prev]');
  const next = gallery.querySelector('[data-photo-next]');
  const count = gallery.querySelector('[data-photo-count]');
  const number = value => String(value).padStart(2, '0');
  let current = 0;
  let gesture = null;

  function show(index, updateURL = false) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    current = target;
    for (const [i, slide] of slides.entries()) slide.hidden = i !== current;
    for (const i of [current, current - 1, current + 1]) {
      if (slides[i]) slides[i].querySelector('img').loading = 'eager';
    }
    count.textContent = `${number(current + 1)} / ${number(slides.length)}`;
    prev.setAttribute('aria-disabled', String(current === 0));
    next.setAttribute('aria-disabled', String(current === slides.length - 1));
    if (updateURL) history.replaceState(null, '', `#${slides[current].id}`);
  }

  function fromHash() {
    const index = slides.findIndex(slide => `#${slide.id}` === location.hash);
    show(index === -1 ? 0 : index);
  }

  prev.addEventListener('click', () => show(current - 1, true));
  next.addEventListener('click', () => show(current + 1, true));
  stage.addEventListener('click', event => {
    if (event.pointerType !== 'mouse' || event.target.tagName !== 'IMG') return;
    const bounds = event.target.getBoundingClientRect();
    show(current + (event.clientX < bounds.left + bounds.width / 2 ? -1 : 1), true);
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowLeft' ? -1 : 1), true);
  });

  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointercancel', () => { gesture = null; });
  stage.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) >= 42 && Math.abs(dx) > 1.35 * Math.abs(dy)) {
      show(current + (dx < 0 ? 1 : -1), true);
    }
  });

  window.addEventListener('hashchange', fromHash);
  fromHash();
  gallery.dataset.ready = '';
  gallery.querySelector('[data-photo-controls]').hidden = false;
})();
