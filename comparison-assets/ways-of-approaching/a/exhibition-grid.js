/* Reserve actual caption height so a complete figure fits in one viewport. */
(() => {
  const figures=[...document.querySelectorAll('.order-exhibition .exhibit-figure')];
  const update=()=>figures.forEach(figure=>{
    const caption=figure.querySelector('figcaption');
    const space=caption?caption.getBoundingClientRect().height+parseFloat(getComputedStyle(caption).marginTop):0;
    figure.style.setProperty('--caption-reserve',`${Math.ceil(space)}px`);
  });
  const observer=new ResizeObserver(update);
  figures.forEach(figure=>{const caption=figure.querySelector('figcaption');if(caption)observer.observe(caption)});
  window.addEventListener('resize',update,{passive:true});
  document.fonts.ready.then(update);update();
})();
