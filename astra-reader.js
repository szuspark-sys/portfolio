(() => {
  const reader = document.querySelector('[data-astra-reader]');
  if (!reader) return;

  const links = [...reader.querySelectorAll('[data-astra-link]')];
  const topics = [...reader.querySelectorAll('[data-astra-topic]')];

  function update({ fromIndex = false, preferTop = false } = {}) {
    const id = location.hash.slice(1);
    const exact = document.getElementById(id);
    const topic = exact?.closest('[data-astra-topic]') ?? topics[0];
    topics.forEach((panel) => { panel.hidden = panel !== topic; });
    links.forEach((link) => {
      if (link.dataset.astraLink === topic.dataset.astraTopic) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    if (fromIndex) {
      const heading = topic.querySelector('.astra-folio-reading h1, .astra-folio-reading h2');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
    if (preferTop || (fromIndex && exact?.id === topic.dataset.astraTopic)) {
      window.scrollTo(0, 0);
    } else if (exact && topic.contains(exact)) {
      for (let parent = exact.parentElement; parent && parent !== topic; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
      exact.scrollIntoView({ block: 'start' });
    }
  }

  for (const link of links) {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      update({ fromIndex: true });
    });
  }
  window.addEventListener('popstate', () => update());
  window.addEventListener('hashchange', () => update());
  update({ preferTop: !location.hash || links.some((link) => link.hash === location.hash) });
})();
