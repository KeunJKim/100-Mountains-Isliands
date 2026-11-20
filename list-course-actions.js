/* 목록 카드의 마지막 줄에서 실제 코스로 바로 연결합니다. 카드 본래 선택은 유지합니다. */
(() => {
 'use strict';
 const page=location.pathname.split('/').pop(),selectors={
  'mountains.html':'#cards>.card','islands.html':'#island-cards>.ux-island-card',
  'other-hikes.html':'#list a.card','yeongnam-alps.html':'#alps-records>.record',
  'overseas-trekking.html':'#overseas-list>.trek-card'
 },selector=selectors[page];if(!selector)return;
 const style=document.createElement('style');style.textContent=`
 html body .jk-list-course-row{display:flex!important;align-items:center;flex-wrap:wrap;gap:6px 8px;min-width:0;width:100%;box-sizing:border-box;margin:8px 0 0!important;text-align:left}
 html body .jk-list-course-row .jk-season-tags{display:contents!important;margin:0!important}
 html body .jk-list-course-action{display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 auto;box-sizing:border-box;min-height:34px;padding:5px 11px;border:1px solid #8c784d;border-radius:8px;background:#f4e8cc;color:#254b39;font-size:15px!important;line-height:1.5!important;font-weight:700;white-space:nowrap;text-decoration:none;cursor:pointer}
 html body .jk-list-course-action[aria-disabled=true]{color:#746d60;background:#eee9df;border-color:#c5bdac;cursor:default;font-weight:400}
 html body .jk-list-course-action:focus-visible{outline:3px solid #88602d;outline-offset:3px}
 `;document.head.append(style);
 function destination(card){
  let url;
  if(page==='mountains.html'||page==='islands.html')url=(page==='mountains.html'?'mountains.html?mountain=':'islands.html?island=')+encodeURIComponent(card.dataset.no);
  else url=page==='yeongnam-alps.html'?card.querySelector(':scope>a.btn:not(.jk-list-course-action)')?.href:card.href;
  if(!url)return null;const u=new URL(url,location.href);
  if(u.origin!==location.origin||!/(?:mountains|islands|tranggle-records|gpx-[\w-]+|yeongchuksan-\d{8})\.html$/.test(u.pathname))return null;
  u.searchParams.set('section','course');if(page==='yeongnam-alps.html')u.searchParams.set('returnTo','alps');return u.pathname.split('/').pop()+u.search+u.hash;
 }
 function scan(){for(const card of document.querySelectorAll(selector)){
  let row=card.querySelector(':scope>.jk-list-course-row');if(!row){row=document.createElement('span');row.className='jk-list-course-row';card.append(row);}
  let action=row.querySelector('.jk-list-course-action');if(!action){action=document.createElement('span');action.className='jk-list-course-action';action.setAttribute('role','link');action.tabIndex=0;row.prepend(action);}
  const href=destination(card),text=href?'산행 실제코스 →':'산행 실제코스 · 미등록';
  if(action.textContent!==text)action.textContent=text;
  action.dataset.courseHref=href||'';action.setAttribute('aria-disabled',String(!href));
  action.title=href?'이 산행의 코스와 GPS 경로 보기':'연결된 실제 코스 자료가 아직 없습니다.';
  const tags=card.querySelector('.jk-season-tags');if(tags&&tags.parentElement!==row)row.append(tags);
  if(card.lastElementChild!==row)card.append(row);
 }}
 function activate(e){const action=e.target.closest('.jk-list-course-action');if(!action)return; e.preventDefault();e.stopImmediatePropagation();const href=action.dataset.courseHref;if(href)location.href=href;}
 document.addEventListener('click',activate,true);
 document.addEventListener('keydown',e=>{if(e.target.matches('.jk-list-course-action')&&(e.key==='Enter'||e.key===' '))activate(e);},true);
 document.addEventListener('keyup',e=>{if(e.target.matches('.jk-list-course-action')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopImmediatePropagation();}},true);
 let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});scan();
})();
