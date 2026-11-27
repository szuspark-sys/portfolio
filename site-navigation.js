(() => {
  const section = new URLSearchParams(location.search).get('from');
  if (!section) return;
  const choices = [...document.querySelectorAll('[data-project-category]')];
  const selected = choices.find(choice => choice.dataset.projectCategory === section);
  if (!selected) return;

  for (const choice of choices) {
    choice.hidden = choice !== selected;
  }
  for (const link of document.querySelectorAll('[data-site-section]')) {
    if (link.dataset.siteSection === section) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
})();
