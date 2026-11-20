/* 목록 읽기 크기·3열 배치·선택 위치 유지와 사진 저장 억제. */
(() => {
 'use strict';
 if(document.getElementById('jk-list-refinements'))return;
 const page=location.pathname.split('/').pop(),listPages=['mountains.html','islands.html','yeongnam-alps.html','other-hikes.html','overseas-trekking.html'];
 if(listPages.includes(page))document.body.classList.add('jk-readable-lists');
 const style=document.createElement('style');style.id='jk-list-refinements';
 style.textContent=`
 html body.jk-readable-lists :is(#cards,#island-cards,#alps-records,#list.grid,#overseas-list){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important;overflow-anchor:none}
 html body.jk-readable-lists :is(#cards>.card,#island-cards>.ux-island-card,#alps-records>.record,#list>.card,#overseas-list>.trek-card){min-width:0!important;min-height:0!important;height:auto!important;padding:12px!important;white-space:normal!important;overflow-wrap:anywhere;text-align:left}
 html body.jk-readable-lists :is(.card h2,.card h3,.ux-island-card strong,.record h3){line-height:1.45!important}
 .jk-list-extra{margin:6px 0 0;color:#62523f;line-height:1.5}
 html body #detail.detail[open]{display:block!important;position:fixed;inset:0;width:min(980px,94vw);max-width:94vw;max-height:88dvh;overflow:auto;margin:auto!important;box-sizing:border-box;padding:16px!important;overscroll-behavior:contain}
 #detail::backdrop{background:#0009}
 #album-list,.side,.photo-card,.photo-wrap{overflow-anchor:none}
 .jk-home-list-group{position:relative;flex:0 0 auto;min-width:0}
 .jk-home-list-group>summary{list-style:none;cursor:pointer;display:inline-flex!important;align-items:center}
 .jk-home-list-group>summary::-webkit-details-marker{display:none}
 .jk-home-list-drop{position:absolute;bottom:calc(100% + 6px);right:0;width:170px;padding:6px;background:#fffdf7;border:1px solid #b59b71;border-radius:9px;box-shadow:0 5px 20px #0003;z-index:25;display:grid;gap:3px}
 .jk-home-list-drop a{display:block;padding:7px 9px;color:#29462a!important;text-decoration:none;border-radius:5px;line-height:1.45;white-space:normal}
 .jk-home-list-drop a:hover,.jk-home-list-drop a:focus-visible{background:#eee3cc}
 .jk-photo-protected{-webkit-user-drag:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
 .photo-card .frame,.lb-image-stage,.jk-source-grid a,.local-photo-grid a{position:relative}
 .photo-card .frame::after,.lb-image-stage::after,.jk-source-grid a::after,.local-photo-grid a::after{content:'© 김종근 · JK 의 산하정복';position:absolute;right:8px;bottom:8px;pointer-events:none;padding:2px 5px;border-radius:3px;background:#0007;color:#fff;font:10px/1.4 sans-serif;text-shadow:0 1px 2px #000;z-index:2}
 .jk-protected-viewer{width:min(1200px,96vw);height:92dvh;max-width:96vw;max-height:94dvh;padding:12px;border:1px solid #ae9770;border-radius:12px;background:#fffdf7}
 .jk-protected-viewer[open]{display:flex;flex-direction:column;gap:8px}.jk-protected-viewer::backdrop{background:#000b}
 .jk-protected-viewer .jk-photo-stage{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
 .jk-protected-viewer img{width:100%;height:100%;object-fit:contain;min-height:0}
 .jk-protected-viewer .jk-photo-credit{position:absolute;right:12px;bottom:10px;padding:3px 6px;background:#0008;color:white;font:12px/1.4 sans-serif;pointer-events:none}
 .jk-protected-viewer button{align-self:flex-end}
 @media(max-width:760px){html body.jk-readable-lists :is(#cards,#island-cards,#alps-records,#list.grid,#overseas-list){grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}}
 @media(max-width:480px){html body.jk-readable-lists :is(#cards,#island-cards,#alps-records,#list.grid,#overseas-list){grid-template-columns:1fr!important}}
 `;document.head.append(style);
 // Home layout and photo-grid columns remain unchanged; only related submenus are added.
 const menus=[['mountains.html',[['명산 목록','mountains.html'],['명산 지도','mountains-map.html'],['명산 사진','gallery.html?group=mountain']]],['islands.html',[['섬&산 목록','islands.html'],['섬&산 지도','islands-map.html'],['섬&산 사진','gallery.html?group=island']]],['yeongnam-alps.html',[['영남알프스 산행','yeongnam-alps.html'],['영남알프스 지도','yeongnam-alps-map.html'],['영남알프스 사진','gallery.html?group=alps']]],['other-hikes.html',[['명산외산행 목록','other-hikes.html'],['명산외산행 사진','gallery.html?group=other'],['기록 보충 목록','records-to-complete.html']]],['overseas-trekking.html',[['해외트래킹 기록','overseas-trekking.html'],['해외트래킹 글쓰기','blog.html?compose=overseas']]],['gallery.html',[['전체 사진','gallery.html'],['명산 사진','gallery.html?group=mountain'],['섬&산 사진','gallery.html?group=island'],['영남알프스 사진','gallery.html?group=alps']]]];
 for(const a of document.querySelectorAll('body.jk-hiking-home .hero-copy .buttons>a.button')){
  const items=menus.find(([path])=>new URL(a.href).pathname.endsWith('/'+path))?.[1];if(!items)continue;
  const group=document.createElement('details');group.className='jk-home-list-group';const summary=document.createElement('summary');summary.className=a.className;summary.textContent=a.textContent;summary.setAttribute('aria-label',a.textContent+' 관련 메뉴');const drop=document.createElement('div');drop.className='jk-home-list-drop';
  for(const [text,path]of items){const link=document.createElement('a');link.textContent=text;link.href=new URL(path,a.href);drop.append(link);}group.append(summary,drop);a.replaceWith(group);
  group.addEventListener('toggle',()=>{if(group.open)for(const other of document.querySelectorAll('.jk-home-list-group'))if(other!==group)other.open=false;});
 }
 document.addEventListener('click',event=>{if(!event.target.closest('.jk-home-list-group'))for(const group of document.querySelectorAll('.jk-home-list-group'))group.open=false;});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')for(const group of document.querySelectorAll('.jk-home-list-group'))group.open=false;});
 // The current image-based home retains its composition and exact hotspot positions.
 const homeStage=document.querySelector('.stage[aria-label="산길 바닷길 홈페이지 첫 화면"]');
 if(homeStage){
  const options=new Map(menus);options.set('blog.html',[['산행·여행 이야기','blog.html'],['새 산행 글 작성','blog.html?compose=1'],['네이버 산행 블로그','https://blog.naver.com/kunjkim']]);options.set('other-hikes.html',[['명산외산행 목록','other-hikes.html'],['영남알프스 목록','yeongnam-alps.html'],['영남알프스 지도','yeongnam-alps-map.html'],['해외트래킹','overseas-trekking.html'],['기록 보충 목록','records-to-complete.html']]);
  const popup=document.createElement('div');popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','관련 하위메뉴');popup.style.cssText='position:fixed;z-index:40;box-sizing:border-box;width:240px;max-width:calc(100vw - 24px);padding:10px;border:1px solid #8eaabd;border-radius:12px;background:#fff;box-shadow:0 8px 24px #06243d55;color:#123d59';document.body.append(popup);let active=null;
  function close(){popup.hidden=true;if(active)active.setAttribute('aria-expanded','false');}
  for(const a of document.querySelectorAll('.stage a.hotspot,.mobile-links a')){
   const items=options.get(new URL(a.href).pathname.split('/').pop());if(!items)continue;a.setAttribute('aria-haspopup','dialog');a.setAttribute('aria-expanded','false');
   a.addEventListener('click',event=>{event.preventDefault();if(active===a&&!popup.hidden){close();return;}close();active=a;popup.replaceChildren();const title=document.createElement('strong');title.textContent=a.getAttribute('aria-label')||a.textContent;title.style.cssText='display:block;padding:6px 8px;font:700 15px/1.4 sans-serif';popup.append(title);for(const[text,path]of items){const link=document.createElement('a');link.href=path;link.textContent=text;link.style.cssText='display:block;padding:10px 9px;border-top:1px solid #d9e5ed;font:14px/1.4 sans-serif;color:#123d59;text-decoration:none';popup.append(link);}const dismiss=document.createElement('button');dismiss.textContent='닫기';dismiss.type='button';dismiss.style.cssText='margin:6px 0 0;padding:6px 10px;border:1px solid #a7bac7;border-radius:6px;background:#edf4f7;color:#123d59';dismiss.onclick=close;popup.append(dismiss);popup.hidden=false;a.setAttribute('aria-expanded','true');const r=a.getBoundingClientRect();popup.style.left=Math.max(12,Math.min(innerWidth-popup.offsetWidth-12,r.left))+'px';popup.style.top=Math.max(12,Math.min(innerHeight-popup.offsetHeight-12,r.bottom+6))+'px';});
  }
  document.addEventListener('click',event=>{if(!popup.contains(event.target)&&!event.target.closest('.stage a.hotspot,.mobile-links a'))close();});document.addEventListener('keydown',event=>{if(event.key==='Escape'){close();active?.focus({preventScroll:true});}});window.addEventListener('resize',close);
 }
 // Keep gallery selection and the outer page at the same position after list redraws.
 document.addEventListener('click',event=>{
  const button=event.target.closest('#album-list .alb-btn');if(!button)return;
  const list=document.getElementById('album-list'),top=list.scrollTop,x=scrollX,y=scrollY;
  requestAnimationFrame(()=>{list.scrollTop=top;window.scrollTo({left:x,top:y,behavior:'instant'});});
 },true);
 const photoSelector='.photo-card,.jk-source-grid,.local-photo-grid,#article-photos,.jk-protected-viewer,.lb-image-stage';
 const isPhoto=target=>target instanceof Element&&(target.matches('img.jk-photo-protected')||!!target.closest(photoSelector));
 for(const type of ['contextmenu','dragstart','copy','cut'])document.addEventListener(type,event=>{if(isPhoto(event.target))event.preventDefault();},true);
 document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s'&&document.querySelector('#lightbox.open,.jk-protected-viewer[open]'))event.preventDefault();},true);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link?.querySelector('img')||!link.closest('.jk-source-grid,.local-photo-grid,#article-photos'))return;
  const url=new URL(link.href,location.href);if(!/\.(?:jpe?g|png|webp)(?:$|\?)/i.test(url.href))return;
  event.preventDefault();event.stopImmediatePropagation();const dialog=document.createElement('dialog');dialog.className='jk-protected-viewer';dialog.setAttribute('aria-label','산행 사진 전체 보기');const close=document.createElement('button');close.textContent='사진 닫기 ×';close.type='button';const stage=document.createElement('div');stage.className='jk-photo-stage';const img=document.createElement('img');img.src=url.href;img.alt=link.querySelector('img').alt;img.className='jk-photo-protected';img.draggable=false;const credit=document.createElement('span');credit.className='jk-photo-credit';credit.textContent='© 김종근 · JK 의 산하정복';stage.append(img,credit);dialog.append(close,stage);document.body.append(dialog);close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{dialog.remove();link.focus({preventScroll:true});},{once:true});dialog.showModal();
 },true);
 let queued=false;
 function scan(){for(const img of document.querySelectorAll('main img,#lb-image,.jk-source-grid img,.local-photo-grid img,.hero img')){if(img.closest('.jk-profile-avatar'))continue;img.classList.add('jk-photo-protected');img.draggable=false;}}
 new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.body,{subtree:true,childList:true});scan();
 // Supplement record cards only with already saved GPS distance/time metadata.
 if(['yeongnam-alps.html','other-hikes.html'].includes(page))fetch('gpx-hikes.json',{cache:'no-cache'}).then(r=>r.json()).then(records=>{
  const byFile=new Map(records.map(r=>[r.filename,r]));let pending=false;
  const enrich=()=>{for(const card of document.querySelectorAll('#alps-records>.record,#list>.card')){if(card.querySelector('.jk-list-extra'))continue;const link=[...card.querySelectorAll('a[href]')].find(a=>byFile.has(new URL(a.href).pathname.split('/').pop())),r=link&&byFile.get(new URL(link.href).pathname.split('/').pop());if(!r)continue;const parts=[Number.isFinite(r.distanceKm)?'거리 '+r.distanceKm+'km':'',r.duration?'소요 '+r.duration:''].filter(Boolean);if(parts.length){const p=document.createElement('p');p.className='jk-list-extra';p.textContent=parts.join(' · ');card.append(p);}}};
  new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enrich();});}).observe(document.querySelector('#alps-records,#list'),{childList:true,subtree:true});enrich();
 }).catch(e=>console.warn('목록 보충 정보 연결 실패',e));
})();
