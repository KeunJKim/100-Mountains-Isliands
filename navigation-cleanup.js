/* 공통 머리말과 중복 이동 단추만 정리합니다. 산행·사진·관리 작업은 유지합니다. */
(() => {
 'use strict';const bar=document.querySelector('.jk-header-grid'),menu=bar?.querySelector('.jk-compact-menu'),brand=bar?.querySelector('.jk-header-title'),crumb=bar?.querySelector('.jk-header-breadcrumb');if(!menu||!brand||!crumb)return;
 const page=location.pathname.split('/').pop(),labels={'mountains.html':'BAC 100대명산 목록','islands.html':'BAC 섬&산100 목록','mountains-map.html':'BAC 100대명산 지도','islands-map.html':'BAC 섬&산100 지도','yeongnam-alps.html':'영남알프스 산행 목록','yeongnam-alps-map.html':'영남알프스 지도','other-hikes.html':'명산외 산행 목록','overseas-trekking.html':'해외트래킹','gallery.html':'사진 갤러리','blog.html':'산행 블로그','records-to-complete.html':'기록 보충 목록','gpx-import.html':'GPS 기록 보충'};
 const oldCurrent=crumb.querySelector('[aria-current="page"],strong')?.textContent.trim(),current=labels[page]||(page.startsWith('gpx-')||page.startsWith('yeongchuksan-')||page==='tranggle-records.html'?'산행 기록':oldCurrent||'산행 기록');
 const span=(text,cls)=>{const n=document.createElement('span');n.textContent=text;n.className=cls;return n;};
 brand.replaceChildren(span('산길 바다길','jk-site-name'),span('·','jk-site-divider'),span(current,'jk-site-page'));brand.setAttribute('aria-label','산길 바다길 산행 홈');
 crumb.replaceChildren(span('BAC 100대명산과 섬&산100','jk-site-description'),span('(JK의 산하정복)','jk-site-signature'));crumb.setAttribute('aria-label','사이트 소개');bar.classList.add('jk-navigation-clean');
 const style=document.createElement('style');style.id='jk-navigation-cleanup-style';style.textContent=`
 html body .jk-navigation-clean .jk-header-title{display:flex!important;align-items:baseline;flex-wrap:wrap;gap:3px 7px;min-width:0;max-width:100%;line-height:1.5!important;transform:none!important}
 html body .jk-navigation-clean .jk-header-breadcrumb{display:flex!important;align-items:baseline;flex-wrap:wrap;gap:2px 5px;padding:0!important;min-width:0;line-height:1.5!important}
 html body .jk-site-name{font-size:16px!important;line-height:24px!important;color:#2a493b;font-weight:800;white-space:nowrap}
 html body .jk-site-page{font-size:13px!important;line-height:19.5px!important;color:#594c37;font-weight:650}
 html body :is(.jk-site-description,.jk-site-signature){font-size:12px!important;line-height:18px!important;color:#675840}
 html body .jk-site-divider{color:#a18c6e;font-size:12px!important}
 html body .stats .stat>span{display:block;white-space:normal!important;font-size:12px!important;line-height:18px!important;margin-top:4px;overflow-wrap:anywhere}
 html body .stats .stat{height:auto!important}
 html body .jk-header-grid.jk-record-header-stacked .jk-compact-menu{grid-column:1/-1!important;grid-row:3!important;justify-content:flex-start!important}
 html body .jk-header-grid.jk-record-header-stacked .jk-header-title{grid-column:2!important;grid-row:1!important}
 html body .jk-header-grid.jk-record-header-stacked .jk-header-breadcrumb{grid-column:2!important;grid-row:2!important}
 html body .jk-header-grid.jk-record-header-stacked .jk-profile-trigger{grid-column:1!important;grid-row:1/3!important}
 html body .jk-record-header :is(.jk-site-name,.jk-site-page){white-space:nowrap!important}
 html body dialog.jk-owner-dialog{width:min(850px,calc(100vw - 32px))!important;max-width:calc(100vw - 32px)!important;max-height:90dvh!important;padding:20px!important;overflow:auto;box-sizing:border-box}
 html body .jk-owner-dialog h2{font-size:20px!important;line-height:1.5!important;margin:0 0 12px!important}
 html body .jk-owner-dialog .jk-management-group{margin:12px 0!important;padding:10px 12px 12px!important}
 html body .jk-owner-dialog legend{font-size:16px!important;line-height:1.5!important}
 html body .jk-owner-dialog :is(p,label){font-size:14px!important;line-height:1.6!important}
 html body .jk-owner-dialog .jk-management-grid{gap:8px!important}
 html body .jk-owner-dialog :is(button,.jk-management-grid>a){font-size:14px!important;line-height:1.5!important;min-height:40px!important;padding:8px 12px!important}
 html body .jk-owner-dialog input{font-size:15px!important;line-height:1.5!important;min-height:42px!important}
 @media(max-width:520px){html body dialog.jk-owner-dialog{padding:15px!important}html body .jk-owner-dialog .jk-management-grid{grid-template-columns:1fr!important}}
 `;document.head.append(style);
 const key=href=>{try{const u=new URL(href,location.href);if(u.hash||!/^https?:$/.test(u.protocol))return '';u.pathname=u.pathname.replace(/\/index\.html$/,'/');return u.origin+u.pathname+u.search;}catch{return '';}};
 function cleanup(){const destinations=new Set([...menu.querySelectorAll('a[href]')].map(a=>key(a.href)).filter(Boolean));for(const box of document.querySelectorAll('body>.ux-context-links,.quick-nav,main>.jk-return-links,body>header .actions,body>.banner .actions')){
  if(box.closest('dialog,.mapinfo,#photo-cards,#album-list,#alps-records,#cards,#island-cards,#overseas-list,form')||box.querySelector('button,input,select,textarea,details'))continue;
  const links=[...box.querySelectorAll('a[href]')];if(!links.length)continue;
  const duplicates=links.filter(a=>!a.hasAttribute('download')&&destinations.has(key(a.href)));
  if(duplicates.length===links.length){box.remove();continue;}
  for(const a of duplicates){a.hidden=true;a.style.setProperty('display','none','important');}
 }}
 if(page.startsWith('gpx-')){bar.classList.add('jk-record-header');const fit=()=>bar.classList.toggle('jk-record-header-stacked',bar.getBoundingClientRect().width<1200);new ResizeObserver(fit).observe(bar);fit();}
 let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;cleanup();});}).observe(document.body,{subtree:true,childList:true});cleanup();
})();
