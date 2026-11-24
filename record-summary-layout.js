/* 공통 상세 산행 정보: 기본 정보 2행·3열, 코스는 다음 행 전체 폭. */
(() => {
 'use strict';if(document.getElementById('jk-record-summary-style'))return;
 if(document.getElementById('gpx-payload'))document.body.classList.add('jk-record-stats-readable');
 const style=document.createElement('style');style.id='jk-record-summary-style';style.textContent=`
 html body .ux-record-panel dl.ux-info.jk-detail-info-grid,html body dl.jk-detail-info-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;margin:12px 0!important;padding:0!important}
 html body dl.jk-detail-info-grid>.jk-detail-info-cell{display:grid!important;grid-template-columns:max-content minmax(0,1fr)!important;align-content:start;align-items:baseline;gap:4px 12px!important;min-width:0;min-height:0!important;height:auto!important;padding:9px 10px!important;border:1px solid #dfd2be;border-radius:6px;background:#fbf7ee}
 html body dl.jk-detail-info-grid>.jk-detail-info-cell[data-summary-field="course"]{grid-column:1/-1!important}
 html body .hike-stats>div,html body #stats>div{display:flex!important;align-items:baseline;justify-content:space-between;gap:6px 12px!important;min-width:0}
 html body .hike-stats>div,html body #stats>div{box-shadow:inset 0 0 0 1px #d6c5a9!important}
 html body .hike-stats>div>:is(span,strong),html body #stats>div>:is(span,strong){display:inline!important;margin:0!important;white-space:nowrap}
 html body.jk-record-stats-readable #stats>div{padding:12px 14px!important;min-height:52px!important;height:auto!important;box-sizing:border-box;gap:6px 12px!important}
 html body.jk-record-stats-readable #stats>div>:is(small,strong){max-width:100%;white-space:normal!important;overflow-wrap:anywhere;min-width:0}
 html body.jk-record-stats-readable #stats>div>small{color:#6a5844}
 html body .tranggle-reference dl{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))!important}
 html body .tranggle-reference dl>div{display:flex!important;align-items:baseline;justify-content:space-between;flex-wrap:nowrap!important;gap:8px!important;min-width:0}
 html body .tranggle-reference dl>div>:is(dt,dd){display:inline!important;flex:0 0 auto;margin:0!important;white-space:nowrap!important;line-height:1.6!important}
 html body dl.jk-detail-info-grid>.jk-detail-info-cell>dt,html body dl.jk-detail-info-grid>.jk-detail-info-cell>dd{min-width:0;max-width:100%;height:auto!important;margin:0!important;white-space:pre-wrap!important;overflow-wrap:anywhere;line-height:1.6!important}
 html body dl.jk-detail-info-grid>.jk-detail-info-cell>dt{color:#746b5d!important;font-weight:400}
 html body dl.jk-detail-info-grid>.jk-detail-info-cell>dd{color:#403a32!important}
 html body .jk-summary-section{margin-top:12px!important;margin-bottom:12px!important;padding:12px!important;min-width:0;border:1px solid #dfd2be;border-radius:10px;background:#fffdf8;color:#30432e}
 html body .jk-summary-section>h3{margin:0 0 8px!important}
 @media(min-width:901px){html body dl.jk-detail-info-grid>.jk-detail-info-cell[data-summary-slot]{grid-column:var(--summary-column)!important;grid-row:var(--summary-row)!important}html body dl.jk-detail-info-grid>.jk-detail-info-cell[data-summary-field="course"]{grid-row:3!important}}
 @media(max-width:900px){html body .ux-record-panel dl.ux-info.jk-detail-info-grid,html body dl.jk-detail-info-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}html body .hike-stats>div,html body #stats>div{flex-wrap:wrap}html body .hike-stats>div>:is(span,strong),html body #stats>div>:is(span,strong){white-space:normal}}
 @media(max-width:580px){html body .ux-record-panel dl.ux-info.jk-detail-info-grid,html body dl.jk-detail-info-grid{grid-template-columns:minmax(0,1fr)!important}}
 `;document.head.append(style);
 function pairGrid(dl){
  if(dl.classList.contains('jk-detail-info-grid'))return;
  for(const node of [...dl.children]){if(node.tagName!=='DT')continue;const value=node.nextElementSibling;if(value?.tagName!=='DD')continue;const cell=document.createElement('div');cell.className='jk-detail-info-cell';node.before(cell);cell.append(node,value);}
  const order=['산행일','정상 고도','산행거리','산행시간','들머리','주차·교통','산행 코스'];
  const key=label=>label==='최고 GPS 고도'?'정상 고도':label.replace(/\s*\(앱\)$/,'');
  const position=cell=>{const dt=cell.querySelector('dt');return dl.dataset.summaryKind==='islands'?(dt?.dataset.summaryPosition===undefined?-1:Number(dt.dataset.summaryPosition)):order.indexOf(key(dt?.textContent||''));};
  const cells=[...dl.children];cells.sort((a,b)=>{const ai=position(a),bi=position(b);return(ai<0?99:ai)-(bi<0?99:bi);});
  let extra=0;for(const cell of cells){const i=position(cell);if(i===6)cell.dataset.summaryField='course';else{const slot=i>=0?i:9+extra++;cell.dataset.summarySlot=String(slot);cell.style.setProperty('--summary-column',String(slot%3+1));cell.style.setProperty('--summary-row',String(Math.floor(slot/3)+1));}dl.append(cell);}
  dl.classList.add('jk-detail-info-grid');
 }
 function gpxSummary(){
  const payload=document.getElementById('gpx-payload');if(!payload||document.getElementById('jk-gpx-hike-summary'))return;
  let r;try{r=JSON.parse(payload.textContent).record;}catch{return;}if(!r)return;
  const fields=[['산행일',r.date],['산행 코스',r.course||r.route],['산행거리',Number.isFinite(r.distanceKm)?r.distanceKm+' km':''],['산행시간',r.duration||r.elapsed],['최고 GPS 고도',Number.isFinite(r.maxEle)?r.maxEle+' m':''],['누적 상승 고도',Number.isFinite(r.gain)?r.gain+' m':''],['들머리',r.start],['주차·교통',r.parking]];
  const section=document.createElement('section');section.id='jk-gpx-hike-summary';section.className='panel jk-summary-section';const h=document.createElement('h3');h.textContent='나의 상세 산행 정보';const dl=document.createElement('dl');
  for(const [label,value]of fields){if(value===null||value===undefined||value==='')continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(value);dl.append(dt,dd);}
  if(!dl.children.length)return;pairGrid(dl);section.append(h,dl);const anchor=document.getElementById('meta')?.closest('section');if(anchor)anchor.after(section);
 }
 // Other-hike photo records can open a recovered Tranggle record rather than a GPX page.
 if(document.querySelector('[data-tranggle-record-host]')){
  const base=new URL('.',document.currentScript?.src||location.href),params=new URLSearchParams(location.search);
  fetch(new URL('tranggle-supplements.json?v=20261114-gps7',base)).then(r=>{if(!r.ok)throw Error('트랭글 기록 연결 실패');return r.json();}).then(data=>{
   const r=data.records?.find(r=>(r.albumId||'m-'+r.mountainNo)===params.get('album')&&r.date===params.get('date'));if(!r)return;
   const section=document.createElement('section');section.id='jk-tranggle-hike-summary';section.className='jk-summary-section';const h=document.createElement('h3');h.textContent='나의 상세 산행 정보';const dl=document.createElement('dl');
   const fields=[['산행일',r.date],['산행거리 (앱)',Number.isFinite(r.distanceKm)?r.distanceKm+' km':''],['산행시간 (앱)',r.totalDuration||r.duration],['최고 GPS 고도',Number.isFinite(r.gps?.maxAltitudeM)?Math.round(r.gps.maxAltitudeM)+' m':''],['누적 고도 (앱)',Number.isFinite(r.cumulativeElevationM)?r.cumulativeElevationM+' m':''],['산행 코스',r.route]];
   for(const [label,value]of fields){if(value===null||value===undefined||value==='')continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(value);dl.append(dt,dd);}
   if(!dl.children.length)return;pairGrid(dl);section.append(h,dl);document.getElementById('dialogTitle')?.after(section);
  }).catch(e=>console.warn(e.message));
 }
 let queued=false;function scan(){document.querySelectorAll('.ux-record-panel dl.ux-info').forEach(pairGrid);gpxSummary();}
 new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.body,{childList:true,subtree:true});scan();
})();
