(() => {
  const reader = document.querySelector('[data-astra-reader]');
  if (!reader) return;

  const links = [...reader.querySelectorAll('[data-astra-link]')];
  const topics = [...reader.querySelectorAll('[data-astra-topic]')];
  const desktopQuery = window.matchMedia('(min-width: 1100px)');

  function openHashDetails() {
    const id = location.hash.slice(1);
    if (!id) return;
    const exact = document.getElementById(id);
    if (!exact) return;
    for (let parent = exact.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
  }

  function topicFromHash() {
    const id = location.hash.slice(1);
    const exact = id ? document.getElementById(id) : null;
    return exact?.closest('[data-astra-topic]') ?? topics[0];
  }

  function showTopic(topic) {
    topics.forEach((panel) => { panel.hidden = panel !== topic; });
    links.forEach((link) => {
      if (link.dataset.astraLink === topic.dataset.astraTopic) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function markVisible() {
    let active = topics[0];
    for (const topic of topics) {
      if (topic.getBoundingClientRect().top <= 148) active = topic;
    }
    links.forEach((link) => {
      if (link.dataset.astraLink === active.dataset.astraTopic) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function scrollToHash() {
    const id = location.hash.slice(1);
    const exact = id && document.getElementById(id);
    if (exact) exact.scrollIntoView();
  }

  function applyDesktop() {
    topics.forEach((panel) => { panel.hidden = false; });
    reader.querySelectorAll('details.astra-reading-detail').forEach((detail) => { detail.open = true; });
    openHashDetails();
    if (location.hash) scrollToHash();
    markVisible();
  }

  function applyCompact(fromIndex) {
    const id = location.hash.slice(1);
    const exact = id ? document.getElementById(id) : null;
    const topic = topicFromHash();
    showTopic(topic);
    openHashDetails();
    if (!fromIndex) return;
    const heading = topic.querySelector('.astra-folio-reading h1, .astra-folio-reading h2');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    if (!exact || exact.id === topic.dataset.astraTopic) window.scrollTo(0, 0);
    else if (topic.contains(exact)) exact.scrollIntoView({ block: 'start' });
  }

  for (const link of links) {
    link.addEventListener('click', (event) => {
      if (desktopQuery.matches) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      applyCompact(true);
    });
  }

  window.addEventListener('popstate', () => {
    if (desktopQuery.matches) {
      openHashDetails();
      scrollToHash();
    } else applyCompact(false);
  });
  window.addEventListener('hashchange', () => {
    if (desktopQuery.matches) {
      openHashDetails();
    } else applyCompact(false);
  });

  let queued = false;
  window.addEventListener('scroll', () => {
    if (!desktopQuery.matches || queued) return;
    queued = true;
    requestAnimationFrame(() => { markVisible(); queued = false; });
  }, { passive: true });

  const onMode = () => {
    if (desktopQuery.matches) applyDesktop();
    else applyCompact(false);
  };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onMode);
  else desktopQuery.addListener(onMode);

  if (desktopQuery.matches) applyDesktop();
  else applyCompact(!location.hash);
})();
