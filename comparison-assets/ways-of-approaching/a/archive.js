(() => {
  'use strict';
  const chapters = [...document.querySelectorAll('main > section[data-section]')];
  const links = [...document.querySelectorAll('[data-toc]')];
  const mobileCurrent = document.getElementById('mobile-current');
  const labels = chapters.map(chapter => links.find(link => link.dataset.toc === chapter.dataset.section)?.querySelector('span:last-child')?.textContent || chapter.querySelector('h1,h2')?.textContent || '项目概况');
  let active = '1';
  function updateCurrent() {
    let next = chapters[0];
    for (const chapter of chapters) {
      if (chapter.getBoundingClientRect().top <= 140) next = chapter;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) next = chapters[chapters.length - 1];
    if (!next) return;
    active = next.dataset.section;
    links.forEach(link => {
      if (link.dataset.toc === active) link.setAttribute('aria-current','true');
      else link.removeAttribute('aria-current');
    });
    if (mobileCurrent) mobileCurrent.textContent = active.padStart(2, '0') + ' / ' + labels[Number(active)-1];
  }
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { updateCurrent(); queued=false; });
  }, {passive:true});
  window.addEventListener('resize',updateCurrent);
  updateCurrent();

  const viewer = document.getElementById('image-viewer');
  const viewerImage = document.getElementById('viewer-image');
  const viewerTitle = document.getElementById('viewer-title');
  const viewerCaption = document.getElementById('viewer-caption');
  let focused = null;
  if (viewer) document.querySelectorAll('[data-image]').forEach(link => {
    link.addEventListener('click',event => {
      event.preventDefault();
      focused=link;
      viewerTitle.textContent=link.dataset.title;
      viewerCaption.textContent=link.dataset.caption;
      viewerImage.src=link.href;
      viewerImage.alt=link.dataset.title;
      viewer.showModal();
    });
  });
  document.getElementById('viewer-close')?.addEventListener('click',()=>viewer.close());
  viewer?.addEventListener('click',event=>{if(event.target===viewer) viewer.close();});
  viewer?.addEventListener('close',()=>{viewerImage.removeAttribute('src');if(focused) focused.focus({preventScroll:true});});

  const index = document.getElementById('mobile-index');
  const indexButton = document.getElementById('mobile-contents');
  indexButton?.addEventListener('click',()=>{index.showModal();indexButton.setAttribute('aria-expanded','true');});
  document.querySelector('[data-close-index]')?.addEventListener('click',()=>index.close());
  index?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>index.close()));
  index?.addEventListener('close',()=>indexButton.setAttribute('aria-expanded','false'));
  index?.addEventListener('click',event=>{if(event.target===index) index.close();});

  const sources = document.getElementById('source-dialog');
  document.getElementById('open-sources')?.addEventListener('click',()=>sources.showModal());
  document.querySelector('[data-open-sources]')?.addEventListener('click',()=>sources.showModal());
  document.querySelector('[data-close-sources]')?.addEventListener('click',()=>sources.close());
  sources?.addEventListener('click',event=>{if(event.target===sources) sources.close();});

  window.__archiveAudit = () => ({
    sections:chapters.map(e=>({id:e.id,title:e.querySelector('h1,h2')?.textContent})),
    active,
    width:innerWidth,
    scrollWidth:document.documentElement.scrollWidth,
    images:[...document.querySelectorAll('main img')].map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0,natural:[e.naturalWidth,e.naturalHeight],rendered:[e.getBoundingClientRect().width,e.getBoundingClientRect().height]})),
    dialogs:[...document.querySelectorAll('dialog')].filter(e=>e.open).map(e=>e.id)
  });
})();
