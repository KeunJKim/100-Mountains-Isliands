/* 공통 상단 메뉴: 여러 하위 메뉴가 동시에 열리지 않도록 정리 */
(() => {
'use strict';
const nav=document.getElementById('ux-navigation');if(!nav)return;
const groups=[...nav.querySelectorAll('details.ux-group')];
for(const group of groups)group.addEventListener('toggle',()=>{
 if(group.open)for(const other of groups)if(other!==group)other.open=false;
});
document.addEventListener('click',e=>{
 if(!nav.contains(e.target))for(const group of groups)group.open=false;
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape')for(const group of groups)group.open=false;
});
})();

/* 산행 홈·블로그 방문 조회수 */
(() => {
'use strict';
const filename=location.pathname.split('/').pop();
const pages={
 '':{key:'index.html',name:'산행 홈'},
 'index.html':{key:'index.html',name:'산행 홈'},
 'blog.html':{key:'blog.html',name:'산행 블로그'}
};
const page=pages[filename];
const navigation=document.querySelector('#ux-navigation nav');
if(!page||!navigation)return;
const style=document.createElement('style');
style.textContent=`
.visit-counter{max-width:1320px;margin:0 auto;padding:10px 20px 14px;color:#d4e5ef;font:13px/1.6 'Malgun Gothic',sans-serif}
.visit-counter-inner{display:inline-grid;gap:7px;padding:12px 15px;border:1px solid #718fa3;border-radius:10px;background:#163247}
.visit-counter strong{color:#ffe0a4;font-size:14px}
.visit-counter a{color:#d4e5ef;text-decoration:underline;text-underline-offset:3px}
.visit-counter img{display:block;max-width:100%;height:auto;min-height:20px}
.visit-counter .counter-badge{height:22px;width:auto;min-height:22px}
.visit-counter .counter-periods{font-size:13px;padding:6px 0;border-top:1px solid #45677b;border-bottom:1px solid #45677b}
.visit-counter .counter-periods b{color:#ffe0a4;font-weight:700}
.visit-counter small{font-size:11px;color:#bdd1de}
@media(max-width:500px){.visit-counter{padding:8px 13px 12px}}
`;
document.head.append(style);
const section=document.createElement('section');
section.className='visit-counter';
section.setAttribute('aria-label',page.name+' 방문 현황');
const box=document.createElement('div');
box.className='visit-counter-inner';
const heading=document.createElement('strong');
heading.textContent=page.name+' 방문 현황';
const endpoint='https://hits.sh/keunjkim.github.io/100-Mountains-Isliands/'+page.key;
const link=document.createElement('a');
link.href=endpoint+'/';
link.target='_blank';
link.rel='noopener noreferrer';
link.textContent='방문 통계 확인 ↗';
const hint=document.createElement('small');
hint.textContent='조회수 기준 · Hits 집계';
if(location.protocol==='https:'&&location.hostname==='keunjkim.github.io'){
 const badge=document.createElement('img');
 badge.className='counter-badge';
 badge.alt='오늘·누적 방문 조회수 불러오는 중';
 badge.referrerPolicy='no-referrer';
 badge.src=endpoint+'.svg?view=today-total&label='+encodeURIComponent('오늘 / 누적')+'&color=ffe0a4&labelColor=234d64';
 badge.addEventListener('load',()=>{
   badge.alt='오늘·누적 방문 조회수';
 });
 badge.addEventListener('error',()=>{
   const notice=document.createElement('span');
   notice.textContent='조회수를 불러오지 못했습니다. 통계 링크에서 확인해 주세요.';
   badge.replaceWith(notice);
 });
 const periods=document.createElement('div');
 periods.className='counter-periods';
 periods.textContent='주간 / 월간 조회수 불러오는 중';
 box.append(heading,badge,periods,link,hint);
 fetch('visit-stats.json?v='+Date.now(),{cache:'no-store'})
   .then(response=>{
     if(!response.ok)throw Error('통계 파일 연결 실패');
     return response.json();
   })
   .then(data=>{
     const values=data.pages?.[page.key];
     if(!values||![values.weekly,values.monthly].every(value=>Number.isSafeInteger(value)&&value>=0))throw Error('통계 값 확인 필요');
     periods.replaceChildren();
     [['최근 7일',values.weekly],['최근 1개월',values.monthly]].forEach(([label,value],index)=>{
       if(index)periods.append(document.createTextNode(' / '));
       periods.append(document.createTextNode(label+' '));
       const number=document.createElement('b');
       number.textContent=value.toLocaleString('ko-KR');
       periods.append(number);
     });
     const date=new Date(values.updatedAt||data.updatedAt);
     if(Number.isFinite(date.getTime())){const stale=Date.now()-date.getTime()>3*60*60*1000;hint.textContent=(stale?'최근 저장값 · ':'')+'주·월 '+date.toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})+' 갱신';hint.title='조회수 기준 · 최근 7일 / 최근 1개월 · 약 1시간마다 갱신';}
   })
   .catch(()=>{periods.textContent='주간 — / 월간 —';hint.textContent='주·월 통계 갱신 대기 · Hits 집계'});
}else{
 const notice=document.createElement('span');
 notice.textContent='게시된 홈페이지에서 집계가 시작됩니다.';
 box.append(heading,notice,link,hint);
}
section.append(box);
navigation.append(section);
})();

/* 공통 홈페이지 이름 */
(()=>{const old="100개의 산과 100개의 섬",name="BAC 100대명산 과 BAC 섬&산100",suffix="(JK 의 산하정복)";for(const brand of document.querySelectorAll(".ux-brand,.brand")){if(brand.textContent.includes(old)){brand.replaceChildren(document.createTextNode(name));const tag=document.createElement('span');tag.className='jk-brand-tag';tag.textContent=suffix;brand.append(tag);}}if(document.title.includes(old))document.title=document.title.replace(old,name);if(document.title.includes(name)&&!document.title.includes(suffix))document.title+=suffix;})();
 /* 지도·산행 상세를 끝까지 본 뒤에도 목록으로 복귀 */
(() => {
 'use strict';
 const style=document.createElement('style');
 style.textContent='.jk-bottom-close{display:flex;justify-content:flex-end;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid #d9cdbb}.jk-bottom-close button,.jk-bottom-close a{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 18px;border:1px solid #405b37;border-radius:22px;background:#405b37!important;color:#fffdf8!important;font-family:inherit;font-size:14px;font-weight:700;line-height:1.4;text-decoration:none;cursor:pointer}.jk-bottom-close button:focus-visible,.jk-bottom-close a:focus-visible{outline:3px solid #9c682d;outline-offset:3px}';
 document.head.append(style);
 for(const panel of document.querySelectorAll('dialog#details,#detail.detail')){
  const close=panel.querySelector('#close');if(!close)continue;
  let opener=null;
  document.addEventListener('click',event=>{const card=event.target.closest('#cards>.card,#island-cards>.ux-island-card');if(card)opener=card;});
  const footer=document.createElement('div');footer.className='jk-bottom-close';
  const button=document.createElement('button');button.type='button';button.textContent='닫기 · 목록으로';button.setAttribute('aria-label','산행 상세 닫고 목록으로 돌아가기');
  button.addEventListener('click',()=>{close.click();if(opener?.isConnected){opener.focus({preventScroll:true});opener.scrollIntoView({block:'nearest'});}});
  footer.append(button);panel.append(footer);
  new MutationObserver(()=>{if(panel.lastElementChild!==footer)panel.append(footer);}).observe(panel,{childList:true});
 }
 const page=location.pathname.split('/').pop();
 const back={'mountains-map.html':'mountains.html','islands-map.html':'islands.html'}[page];
 const main=document.querySelector('main');
 if(back&&main){
  const footer=document.createElement('div');footer.className='jk-bottom-close';
  const link=document.createElement('a');link.href=back;link.textContent='닫기 · 목록으로';link.setAttribute('aria-label','지도 닫고 목록으로 돌아가기');
  footer.append(link);main.append(footer);
 }
})();
