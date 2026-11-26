/* A's whole-figure fit, including the actual caption and optional video cues. */
(() => {
  const figures = [...document.querySelectorAll('body.a-site .a-main .a-figure')];
  const pairs = [...document.querySelectorAll('[data-a-balance-pair]')];
  let queued = false;
  const update = () => {
    queued = false;
    for (const figure of figures) {
      let reserve = 0;
      for (const element of figure.querySelectorAll(':scope > figcaption, :scope > .cues')) {
        if (getComputedStyle(element).display === 'none') continue;
        reserve += element.getBoundingClientRect().height + parseFloat(getComputedStyle(element).marginTop || 0);
      }
      const value = `${Math.ceil(reserve)}px`;
      if (figure.style.getPropertyValue('--a-caption-reserve') !== value)
        figure.style.setProperty('--a-caption-reserve', value);
    }
    for (const pair of pairs) {
      const pictures = [...pair.querySelectorAll('[data-a-ratio]')];
      const height = Math.min(...pictures.map(image =>
        image.closest('figure').clientWidth / Number(image.dataset.aRatio)));
      const value = `${Math.floor(height)}px`;
      if (pair.style.getPropertyValue('--a-pair-height') !== value)
        pair.style.setProperty('--a-pair-height', value);
    }
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  const observer = new ResizeObserver(schedule);
  pairs.forEach(pair => observer.observe(pair));
  for (const figure of figures) {
    for (const caption of figure.querySelectorAll('figcaption, .cues')) observer.observe(caption);
  }
  window.addEventListener('resize', schedule, {passive:true});
  document.addEventListener('click', schedule);
  document.addEventListener('toggle', schedule, true);
  document.fonts.ready.then(schedule);
  schedule();
})();
