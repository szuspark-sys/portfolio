(() => {
  'use strict';
  const root=document.querySelector('[data-publication-reader]');
  if(!root || !window.St?.PageFlip)return;
  const mount=root.querySelector('[data-book-mount]');
  const sheets=[...mount.querySelectorAll('.book-page')];
  const count=sheets.length,prev=root.querySelector('[data-book-prev]'),next=root.querySelector('[data-book-next]');
  const input=root.querySelector('[data-book-page]'),status=root.querySelector('[data-book-status]');
  const captions=root.querySelector('[data-book-captions]');
  const images=sheets.map(el=>el.querySelector('img'));
  const first=images[0],ratio=Number(first.getAttribute('height'))/Number(first.getAttribute('width'));
  const book=new St.PageFlip(mount,{width:496,height:Math.round(496*ratio),size:'stretch',minWidth:240,maxWidth:620,minHeight:238,maxHeight:922,showCover:true,usePortrait:true,autoSize:true,drawShadow:true,maxShadowOpacity:.25,flippingTime:window.matchMedia('(prefers-reduced-motion: reduce)').matches?100:650,mobileScrollSupport:false,swipeDistance:30});
  function update(){
    const i=book.getCurrentPageIndex(),landscape=book.getOrientation()==='landscape';
    const cover=i===0||i===count-1;
    status.textContent=(landscape&&!cover?`${i+1}–${Math.min(count,i+2)}`:String(i+1))+` / ${count}`;
    if(captions){
      const visiblePages=landscape&&!cover?[i,i+1]:[i];
      captions.replaceChildren(...visiblePages.filter(n=>n<count).map(n=>{
        const label=document.createElement('span');
        label.textContent=`第 ${n+1} 页 · ${images[n].dataset.bookCaption}`;
        return label;
      }));
    }
    root.dataset.currentPage=String(i+1);root.dataset.orientation=book.getOrientation();
    input.value=String(i+1);prev.disabled=i===0;next.disabled=i>=count-1;
    for(let n=Math.max(0,i-2);n<Math.min(count,i+5);n++)images[n].loading='eager';
  }
  book.on('init',update);book.on('flip',update);book.on('changeOrientation',update);
  book.loadFromHTML(sheets);
  prev.addEventListener('click',()=>book.flipPrev());next.addEventListener('click',()=>book.flipNext());
  input.addEventListener('change',()=>{const n=Math.min(count,Math.max(1,Number(input.value)||1));book.turnToPage(n-1);update();});
  root.addEventListener('keydown',event=>{
    if(event.target.tagName==='INPUT')return;
    if(event.key==='ArrowRight'){event.preventDefault();book.flipNext();}
    if(event.key==='ArrowLeft'){event.preventDefault();book.flipPrev();}
  });
  root.querySelector('[data-book-zoom]').addEventListener('click',()=>{
    const n=book.getCurrentPageIndex(),viewer=document.getElementById('image-viewer');
    viewer.classList.add('book-zoom-dialog');document.getElementById('viewer-image').src=images[n].src;
    document.getElementById('viewer-image').alt=images[n].alt;
    document.getElementById('viewer-title').textContent=images[n].alt;
    document.getElementById('viewer-caption').textContent=images[n].dataset.bookCaption||'';viewer.showModal();
  });
  root.__book=book;
})();
