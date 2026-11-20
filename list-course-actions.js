/* 목록 카드의 마지막 줄에서 실제 코스로 바로 연결합니다. 카드 본래 선택은 유지합니다. */
(() => {
 'use strict';
 const page=location.pathname.split('/').pop(),selectors={
  'mountains.html':'#cards>.card','islands.html':'#island-cards>.ux-island-card',
  'other-hikes.html':'#list a.card','yeongnam-alps.html':'#alps-records>.record',
  'overseas-trekking.html':'#overseas-list>.trek-card'
 },selector=selectors[page];if(!selector)return;
 const style=document.createElement('style');style.textContent=`
 html body .jk-list-course-row{display:flex!important;align-items:center;flex-wrap:wrap;gap:5px 7px;min-width:0;width:100%;box-sizing:border-box;margin:6px 0 0!important;text-align:left}
 html body .jk-list-course-row .jk-season-tags{display:contents!important;margin:0!important}
 html body .jk-list-course-action{display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 auto;box-sizing:border-box;min-height:28px;padding:4px 9px;border:1px solid #8c784d;border-radius:8px;background:#f4e8cc;color:#254b39;font-size:12px!important;line-height:1.5!important;font-weight:700;white-space:nowrap;text-decoration:none;cursor:pointer}
 html body .jk-list-course-action[aria-disabled=true]{color:#746d60;background:#eee9df;border-color:#c5bdac;cursor:default;font-weight:400}
 html body .jk-list-course-action:focus-visible{outline:3px solid #88602d;outline-offset:3px}
 html body #alps-records .jk-alps-heading{display:flex;align-items:baseline;flex-wrap:wrap;gap:3px 8px;margin:0 0 6px;min-width:0}
 html body #alps-records .jk-alps-heading h3{display:inline;margin:0!important;flex:0 1 auto;line-height:1.45!important}
 html body #alps-records .jk-alps-heading :is(small,p){display:inline;margin:0!important;line-height:1.5!important}
 html body #alps-records .jk-list-extra{margin:5px 0!important;line-height:1.5!important}
 html body #overseas-list .jk-overseas-heading{display:flex;align-items:baseline;flex-wrap:wrap;gap:3px 8px;margin:0 0 5px;min-width:0}
 html body #overseas-list .jk-overseas-heading :is(h2,small){display:inline;margin:0!important;line-height:1.5!important}
 html body .jk-alps-photo-action{font-size:14px!important;line-height:21px!important;padding:7px 12px!important;min-height:36px!important}
 html body #alps-records>.record{padding:10px!important;display:flex;flex-direction:column;gap:0}
 html body #alps-records .jk-alps-heading{margin-bottom:3px!important;gap:2px 7px}
 html body #alps-records .jk-alps-intro{margin:4px 0 5px!important;line-height:1.5!important}
 html body #alps-records .jk-list-extra{margin:3px 0!important}
 html body #alps-records .jk-alps-duplicate-record{display:none!important}
 html body #alps-records .jk-list-course-row{gap:4px 6px;margin-top:5px!important}
 html body #alps-records .jk-alps-source-action{font-size:12px!important;line-height:18px!important;padding:4px 9px!important;min-height:28px!important;margin:0!important;border-radius:8px}
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
  if(page==='yeongnam-alps.html'&&!card.querySelector(':scope>.jk-alps-heading')){const title=card.querySelector(':scope>h3'),date=card.querySelector(':scope>small'),region=card.querySelector(':scope>p');if(title&&date){const heading=document.createElement('span');heading.className='jk-alps-heading';card.prepend(heading);heading.append(title,date);if(region&&!region.classList.contains('jk-list-extra'))heading.append(region);}}
  if(page==='overseas-trekking.html'){const copy=card.querySelector('.trek-copy');if(copy&&!copy.querySelector('.jk-overseas-heading')){const title=copy.querySelector(':scope>h2'),meta=copy.querySelector(':scope>small');if(title&&meta){const heading=document.createElement('span');heading.className='jk-overseas-heading';copy.prepend(heading);heading.append(title,meta);}}}
  let row=card.querySelector(':scope>.jk-list-course-row');if(!row){row=document.createElement('span');row.className='jk-list-course-row';card.append(row);}
  let action=row.querySelector('.jk-list-course-action');if(!action){action=document.createElement('span');action.className='jk-list-course-action';action.setAttribute('role','link');action.tabIndex=0;row.prepend(action);}
  const href=destination(card),text=href?'산행 실제코스 →':'산행 실제코스 · 미등록';
  if(action.textContent!==text)action.textContent=text;
  action.dataset.courseHref=href||'';action.setAttribute('aria-disabled',String(!href));
  action.title=href?'이 산행의 코스와 GPS 경로 보기':'연결된 실제 코스 자료가 아직 없습니다.';
  if(page==='yeongnam-alps.html'){
   // Keep the canonical link for asynchronous GPS recovery; expose only the course action.
   const detail=card.querySelector(':scope>a.btn');if(detail)detail.classList.toggle('jk-alps-duplicate-record',!!href);
   const source=[...card.querySelectorAll('a.btn[href]')].find(a=>{const u=new URL(a.href,location.href);return u.origin!==location.origin&&u.hostname==='www.ramblr.com';});
   if(source){source.classList.add('jk-alps-source-action');if(source.parentElement!==row||action.nextElementSibling!==source)action.after(source);}
  }
  const tags=card.querySelector('.jk-season-tags');if(tags&&tags.parentElement!==row)row.append(tags);
  if(card.lastElementChild!==row)card.append(row);
 }}
 function activate(e){const action=e.target.closest('.jk-list-course-action');if(!action)return; e.preventDefault();e.stopImmediatePropagation();const href=action.dataset.courseHref;if(href)location.href=href;}
 document.addEventListener('click',activate,true);
 document.addEventListener('keydown',e=>{if(e.target.matches('.jk-list-course-action')&&(e.key==='Enter'||e.key===' '))activate(e);},true);
 document.addEventListener('keyup',e=>{if(e.target.matches('.jk-list-course-action')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopImmediatePropagation();}},true);
 let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});scan();
})();
