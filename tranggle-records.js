/* 트랭글 공유 이미지의 표시 통계. GPX 좌표·인증 기록은 만들거나 변경하지 않습니다. */
(() => {
 'use strict';
 const dialog=document.getElementById('details');if(!dialog)return;
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 const style=el('style');style.textContent='.tranggle-reference{border-top:1px solid #cbb99a;padding-top:14px;margin-top:16px}.tranggle-reference img{display:block;max-width:100%;width:620px;height:auto;border-radius:10px;margin:12px auto}.tranggle-reference dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;border:1px solid #cbb99a;border-radius:9px;padding:12px}.tranggle-reference dl>div{min-width:0}.tranggle-reference dt{font-size:12px;color:#695439}.tranggle-reference dd{margin:4px 0 0;font-weight:700;color:#30482e}.tranggle-reference p{font-size:13px;line-height:1.6}.tranggle-reference a{color:#30482e;text-decoration:underline}@media(max-width:560px){.tranggle-reference dl{grid-template-columns:1fr}.tranggle-reference dl>div{padding-bottom:7px;border-bottom:1px solid #ded2be}}';document.head.append(style);
 fetch('tranggle-supplements.json?v=20261113-tranggle1').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
  const records=Array.isArray(data.records)?data.records:[];
  const scan=()=>{const name=document.getElementById('dialogTitle')?.textContent.trim();for(const record of records){if(name!==record.place||!/^photos\/[A-Za-z0-9_-]+\.jpg$/.test(record.image))continue;for(const visit of dialog.querySelectorAll('.visit')){const heading=visit.querySelector('h3');if(!heading?.textContent.startsWith(record.date.replaceAll('-','.'))||visit.querySelector('.tranggle-reference'))continue;
   for(const p of visit.querySelectorAll(':scope>p'))if(p.textContent.includes('산행 날짜 기록만 입력되어'))p.remove();
   const section=el('section');section.className='tranggle-reference';section.setAttribute('aria-label',record.place+' '+record.date+' 트랭글 기록');section.append(el('h4','트랭글 산행 기록 · 이미지 참고'));
   const dl=el('dl');for(const [label,value]of [['트랭글 표시 거리',record.distanceKm+' km'],['트랭글 표시 시간',record.duration],['트랭글 누적고도',record.cumulativeElevationM+' m']]){const item=el('div');item.append(el('dt',label),el('dd',value));dl.append(item);}section.append(dl);
   const a=el('a');a.href=record.image;a.target='_blank';a.rel='noopener';const image=el('img');image.src=record.image;image.alt=record.place+' '+record.date+' 트랭글 경로 및 통계 공유 이미지';image.loading='lazy';a.append(image);section.append(a,el('p',record.notes),el('p','첨부된 원본은 JPG 공유 이미지입니다. 이미지 제목의 .gpx 파일은 아직 받지 않았으며, 위 그림은 확대·이동 가능한 GPS 경로 지도가 아닙니다.'));
   const gallery=el('a','가지산 사진 앨범 보기 →');gallery.href='gallery.html?album=m-5';section.append(gallery);visit.append(section);
  }}};
  let queued=false;new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;scan();});}}).observe(dialog,{childList:true,subtree:true});scan();
 }).catch(()=>{});
})();
