document.documentElement.classList.add('js');
document.body.id='top';
document.querySelectorAll('[data-tabs]').forEach((el,index)=>{
 const buttons=[...el.querySelectorAll(':scope > .tab-buttons > button')],panels=[...el.querySelectorAll(':scope > .tab-panel')];
 function show(n,focus=false){buttons.forEach((b,i)=>{b.setAttribute('aria-selected',i===n);b.tabIndex=i===n?0:-1;panels[i].hidden=i!==n});if(focus)buttons[n].focus()}
 buttons.forEach((b,i)=>{b.id=`tab-${index}-${i}`;b.setAttribute('aria-controls',`panel-${index}-${i}`);panels[i].id=`panel-${index}-${i}`;panels[i].setAttribute('aria-labelledby',b.id);b.addEventListener('click',()=>show(i));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%buttons.length;if(e.key==='ArrowLeft')n=(i-1+buttons.length)%buttons.length;if(e.key==='Home')n=0;if(e.key==='End')n=buttons.length-1;if(n!==undefined){e.preventDefault();show(n,true)}})});show(0);
});
const box=document.querySelector('.lightbox');let opener;
document.querySelectorAll('.zoom').forEach(b=>b.addEventListener('click',()=>{opener=b;box.querySelector('img').src=b.querySelector('img').src;box.querySelector('img').alt=b.querySelector('img').alt;box.querySelector('p').textContent=b.closest('figure').querySelector('figcaption')?.textContent||'';box.showModal()}));
box?.querySelector('.close').addEventListener('click',()=>box.close());box?.addEventListener('click',e=>{if(e.target===box){const r=box.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)box.close()}});box?.addEventListener('close',()=>opener?.focus());
document.querySelectorAll('[data-seek]').forEach(b=>b.addEventListener('click',()=>{const v=b.closest('figure').querySelector('video');v.currentTime=Number(b.dataset.seek);v.play().catch(()=>{});}));
document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(o=>{if(o!==v)o.pause()})));
const sectionList=[...document.querySelectorAll('.chapter')],tocLinks=[...document.querySelectorAll('.contents a')];let scrollTick=false;function updateToc(){let active=sectionList[0];for(const section of sectionList){if(section.getBoundingClientRect().top<210)active=section}tocLinks.forEach(a=>a.classList.toggle('active',a.hash==='#'+active?.id));scrollTick=false}addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(updateToc)}},{passive:true});updateToc();
document.querySelectorAll('.proof-widget').forEach(el=>el.querySelectorAll('[data-feedback]').forEach(b=>b.addEventListener('click',()=>{el.querySelectorAll('button').forEach(o=>o.setAttribute('aria-pressed',o===b));el.querySelector('output').textContent=b.dataset.feedback})));
document.querySelectorAll('[data-rule-demo]').forEach(el=>{
 const vals=[2,1,1],range=el.querySelector('input[type=range]'),from=el.querySelector('[data-from]'),target=el.querySelector('[data-to]'),toggle=el.querySelector('[data-link]'),reset=el.querySelector('[data-reset]');let linked=false;
 const names=['A','B','C'];function paint(message){if(linked)vals[+target.value]=vals[+from.value];el.querySelectorAll('.rule-bar').forEach((b,i)=>{b.style.height=(vals[i]*33)+'px';el.querySelectorAll('[data-value]')[i].textContent=vals[i]});toggle.textContent=linked?'断开连接':'建立连接';toggle.setAttribute('aria-pressed',linked);el.querySelector('output').textContent=message||(linked?names[+from.value]+' 正在把高度传给 '+names[+target.value]+'。':'连接已断开，各物件保留当前高度。')}
 function adjust(){if(from.value===target.value)target.value=String((+from.value+1)%3);range.value=vals[+from.value];linked=false;paint('已更换参照物。已有高度保留；可重新建立一条连接。')}
 from.addEventListener('change',adjust);target.addEventListener('change',adjust);range.addEventListener('input',()=>{vals[+from.value]=+range.value;paint()});toggle.addEventListener('click',()=>{linked=!linked;paint()});reset.addEventListener('click',()=>{vals.splice(0,3,2,1,1);linked=false;from.value='0';target.value='1';range.value='2';paint('调整 A 的高度，再建立 A 到 B 的连接。')});paint('调整 A 的高度，再建立 A 到 B 的连接。');
});

box?.querySelector('img').addEventListener('click',e=>e.target.classList.toggle('expanded'));box?.addEventListener('close',()=>box.querySelector('img').classList.remove('expanded'));
