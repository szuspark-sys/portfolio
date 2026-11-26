(() => {
  const figures=[...document.querySelectorAll('body.xu-aidkit-page[data-project-id="ways-of-approaching"] main .ak-figure')];
  const update=()=>figures.forEach(figure=>{
    const caption=figure.querySelector('figcaption');
    const reserve=caption?caption.getBoundingClientRect().height+parseFloat(getComputedStyle(caption).marginTop):0;
    figure.style.setProperty('--ak-caption-reserve',`${Math.ceil(reserve)}px`);
  });
  const observer=new ResizeObserver(update);
  figures.forEach(f=>{const cap=f.querySelector('figcaption');if(cap)observer.observe(cap)});
  window.addEventListener('resize',update,{passive:true});document.fonts.ready.then(update);update();
})();
