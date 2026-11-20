/* 지도 코스 연결과 산행 상세창의 공통 닫기. 기존 기록·검색·관리 기능은 보존합니다. */
(() => {
 'use strict';if(document.getElementById('jk-map-record-controls-style'))return;
 const page=location.pathname.split('/').pop(),isMap=['mountains-map.html','islands-map.html','yeongnam-alps-map.html'].includes(page),params=new URLSearchParams(location.search);
 const returns={alps:'yeongnam-alps.html','alps-map':'yeongnam-alps-map.html'},returnUrl=returns[params.get('returnTo')];
 const style=document.createElement('style');style.id='jk-map-record-controls-style';style.textContent=`
 html body dialog#details #close,html body #detail.detail #close{position:sticky!important;float:right!important;top:0!important;right:0!important;z-index:40;width:auto!important;min-width:72px!important;white-space:nowrap;max-width:none!important;margin-left:12px!important;margin-bottom:4px!important}
 html body .jk-map-course-link[aria-disabled=true]{opacity:.55;cursor:default}
 html body .jk-record-top-close{display:inline-flex;align-items:center;justify-content:center;position:absolute;right:0;top:0;min-height:36px;padding:7px 12px;border:1px solid #a48a61;border-radius:9px;background:#f4e8cd;color:#29462a;font:700 14px/1.5 'Malgun Gothic',sans-serif;white-space:nowrap;text-decoration:none}
 html body .jk-record-return-host{position:relative!important}
 html body .jk-record-return-host #title,html body .jk-record-return-host #dialogTitle{padding-right:102px!important}
 html body .jk-course-target{outline:3px solid #a06e2d;outline-offset:3px;border-radius:6px}
 html body .jk-course-empty{margin:8px 0;padding:9px 11px;border:1px solid #d6c09a;border-radius:6px;background:#fff6e4;color:#665236;font-size:14px;line-height:1.6}
 `;document.head.append(style);
 const make=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 function closes(){for(const close of document.querySelectorAll('dialog#details #close,#detail.detail #close')){
  const dialog=close.closest('dialog');if(dialog&&(close.parentElement!==dialog||dialog.firstElementChild!==close))dialog.prepend(close);
  if(close.textContent!=='닫기 ×')close.textContent='닫기 ×';close.setAttribute('aria-label','산행 상세 닫기');
  if(returnUrl&&!close.dataset.jkReturnBound){close.dataset.jkReturnBound='1';close.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();location.href=returnUrl;},true);}
 }}
 function alpsLinks(){for(const a of document.querySelectorAll('#alps-records .record>a.btn')){const u=new URL(a.href,location.href);if(u.origin!==location.origin)continue;if(u.searchParams.get('returnTo')!=='alps'){u.searchParams.set('returnTo','alps');a.href=u.pathname.split('/').pop()+u.search+u.hash;}}}
 if(returnUrl&&!document.querySelector('dialog#details,#detail.detail')){const title=document.querySelector('#title,#dialogTitle');if(title){const host=title.parentElement;host.classList.add('jk-record-return-host');const close=make('a','닫기 ×');close.className='jk-record-top-close';close.href=returnUrl;close.setAttribute('aria-label','산행 상세 닫고 영남알프스로 돌아가기');host.prepend(close);}}
 if(isMap){
  const root=document.getElementById('entries'),actions=document.querySelector('.mapinfo .actions'),data=JSON.parse(document.getElementById('data').textContent);
  if(root&&actions){const course=make('a','산행 코스 보기 →');course.id='map-course-link';course.className='action primary jk-map-course-link';course.href='#';course.setAttribute('aria-disabled','true');course.addEventListener('click',e=>{if(course.getAttribute('aria-disabled')==='true')e.preventDefault();});actions.append(course);
   root.addEventListener('click',e=>{const row=e.target.closest('.entry');if(!row)return;const d=data[Number(row.dataset.index)];if(!d)return;const target=page==='yeongnam-alps-map.html'?d.recordUrl:(page==='islands-map.html'?'islands.html?island=':'mountains.html?mountain=')+encodeURIComponent(d.no);if(!target)return;const u=new URL(target,location.href);u.searchParams.set('section','course');if(page==='yeongnam-alps-map.html')u.searchParams.set('returnTo','alps-map');course.href=u.pathname.split('/').pop()+u.search+u.hash;course.textContent='산행 코스 보기 →';course.setAttribute('aria-label',d.name+' 산행 코스 보기');course.removeAttribute('aria-disabled');
   if(page==='yeongnam-alps-map.html'){const record=document.getElementById('alps-record-link');if(record){const r=new URL(d.recordUrl,location.href);r.searchParams.set('returnTo','alps-map');record.href=r.pathname.split('/').pop()+r.search+r.hash;}}});
  }
 }
 let courseFocused=false;
 function focusCourse(){
  if(params.get('section')!=='course'||courseFocused)return;
  const panel=document.querySelector('dialog[open] .ux-record-panel,.jk-summary-section');if(!panel?.querySelector('dl.jk-detail-info-grid'))return;
  const recordId=params.get('record');let target=null;
  if(/^\d+$/.test(recordId||'')){const a=[...document.querySelectorAll('.visit a[href]')].find(a=>new URL(a.href,location.href).pathname.endsWith('/'+recordId));target=a?.closest('.visit')?.querySelector('.course-steps,.hike-map,.tranggle-gps-map');}
  if(!target)target=[...panel.querySelectorAll('dt')].find(dt=>dt.textContent.trim()==='산행 코스')?.closest('.jk-detail-info-cell');
  if(!target)target=document.querySelector('.ux-reference-route')||document.querySelector('.ux-reference-info')||document.querySelector('.visit .hike-map,.visit .tranggle-gps-map');
  if(!target){target=make('p','등록된 산행 코스가 없습니다. 관리자 메뉴에서 코스를 추가할 수 있습니다.');target.className='jk-course-empty';panel.append(target);}
  courseFocused=true;requestAnimationFrame(()=>{target.classList.add('jk-course-target');target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({block:'center'});setTimeout(()=>target.classList.remove('jk-course-target'),3000);});
 }
 let queued=false;function scan(){closes();alpsLinks();focusCourse();}new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.body,{subtree:true,childList:true});scan();
})();
