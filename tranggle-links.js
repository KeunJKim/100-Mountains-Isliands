/* 기존 앨범·산행 목록을 같은 날짜의 복구 GPX 상세와 연결합니다. */
(() => {'use strict';
 fetch('tranggle-supplements.json?v=20261114-gps6').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
 const records=data.records.filter(r=>r.gps),album=r=>r.albumId||'m-'+r.mountainNo;
 const detail=r=>'tranggle-records.html?album='+encodeURIComponent(album(r))+'&date='+encodeURIComponent(r.date);
 let signature='';
 function scan(){
  const title=document.getElementById('album-title'),desc=document.getElementById('album-desc');
  if(title&&desc){const selected=document.querySelector('#album-list .alb-btn[aria-current="true"] .alb-name');const name=selected?.textContent.trim(),matched=name?records.filter(r=>r.place===name):[],key=matched.map(r=>album(r)+'|'+r.date).join(',');
   if(key!==signature||!document.getElementById('tranggle-album-links')){signature=key;let box=document.getElementById('tranggle-album-links');if(!box){box=document.createElement('div');box.id='tranggle-album-links';desc.after(box);}box.replaceChildren();box.hidden=!matched.length;for(const r of matched){const a=document.createElement('a');a.className='btn';a.textContent=r.date+' GPS 지도·산행 통계';a.href=detail(r);a.style.cssText='display:inline-block;margin:5px 6px 5px 0;background:#e8efd9;color:#253e29;border:1px solid #8a9b6d;padding:6px 10px;border-radius:15px;font-weight:650';box.append(a);}}}
  for(const a of document.querySelectorAll('#list a[href*="gallery.html"],#alps-records a[href*="gallery.html"]')){let target;try{target=new URL(a.href);}catch{continue;}const id=target.searchParams.get('album');if(!id)continue;const host=a.closest('.record')||a;const date=host.textContent.match(/\b20\d{2}-\d{2}-\d{2}\b/)?.[0];const r=records.find(r=>album(r)===id&&r.date===date);if(!r)continue;a.href=detail(r);if(a.classList.contains('btn'))a.textContent='GPS 지도·통계·사진';for(const p of host.querySelectorAll('p'))if(p.textContent.includes('GPS 원본 미보충'))p.textContent=p.textContent.replace('GPS 원본 미보충','트랭글 GPS·통계 보충됨');}
 }
 let queued=false;new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;scan();});}}).observe(document.body,{childList:true,subtree:true});scan();
 }).catch(()=>{});
})();
