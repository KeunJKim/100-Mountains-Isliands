/* 공통 GPS 경로 지도: 원래 경로를 크게 보고 실제 출발 좌표를 외부 지도에 연결합니다. */
(() => {
 'use strict';
 if(document.getElementById('jk-gps-map-style'))return;
 const base='https://keunjkim.github.io/100-Mountains-Isliands/';
 const style=document.createElement('style');style.id='jk-gps-map-style';
 style.textContent='.jk-gps-map-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}.jk-gps-map-actions a,.jk-gps-map-actions button,.jk-gps-large-close{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:8px 14px;border:1px solid #a48a61;border-radius:22px;background:#fff3d9;color:#29462a!important;font:700 13px/1.45 "Malgun Gothic",sans-serif;text-decoration:none;cursor:pointer}.jk-gps-map-actions button{background:#45603b;color:#fff!important}.jk-gps-map-actions :focus-visible,.jk-gps-large-close:focus-visible{outline:3px solid #b67425;outline-offset:3px}.jk-gps-large-dialog{position:fixed;inset:0;width:min(1400px,96vw);max-width:96vw;height:92dvh;max-height:94dvh;box-sizing:border-box;padding:14px;border:1px solid #a48a61;border-radius:14px;background:#fffdf8;color:#29462a;overflow:hidden}.jk-gps-large-dialog[open]{display:flex;flex-direction:column;gap:10px}.jk-gps-large-dialog::backdrop{background:rgba(0,0,0,.62)}.jk-gps-large-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0}.jk-gps-large-head h2{font:700 19px/1.4 "Malgun Gothic",sans-serif;margin:0}.jk-gps-large-dialog .jk-expanded-map{height:auto!important;min-height:0!important;flex:1;width:100%!important;display:block!important;margin:0!important}.jk-gps-large-footer{display:flex;justify-content:flex-end;flex-shrink:0}.jk-gps-large-dialog .jk-expanded-map>svg{height:100%;width:100%}@media(max-width:600px){.jk-gps-large-dialog{width:98vw;max-width:98vw;height:94dvh;padding:9px}.jk-gps-large-head h2{font-size:16px}.jk-gps-map-actions a,.jk-gps-map-actions button{font-size:12px;padding:8px 11px}}';document.head.append(style);
 const valid=p=>p&&Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lon))&&Math.abs(Number(p.lat))<=90&&Math.abs(Number(p.lon))<=180;
 function decodeFirst(encoded){let i=0,lat=0,lon=0;for(let axis=0;axis<2;axis++){let shift=0,value=0,b;do{if(i>=encoded.length||shift>30)return null;b=encoded.charCodeAt(i++)-63;value|=(b&31)<<shift;shift+=5;}while(b>=32);const delta=(value&1)?~(value>>1):value>>1;if(axis===0)lat=delta;else lon=delta;}return{lat:lat/1e5,lon:lon/1e5};}
 let sources;
 function loadSources(){if(!sources)sources=fetch(base+'ramblr-supplements.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(()=>({}));return sources;}
 function titleOf(map){if(map.id==='map'&&document.getElementById('gpx-payload'))return document.getElementById('title')?.textContent?.trim()||'산행 GPS 경로';const scope=map.closest('.tranggle-reference,.visit,.panel')||map.parentElement;return scope?.querySelector('h4,h3,h2')?.textContent?.trim()||document.querySelector('#title,#detail-title,#dialogTitle,h1')?.textContent?.trim()||'산행 GPS 경로';}
 async function startOf(map){
  if(map.dataset.gpsStartLat&&map.dataset.gpsStartLon)return{lat:Number(map.dataset.gpsStartLat),lon:Number(map.dataset.gpsStartLon)};
  const payload=document.getElementById('gpx-payload');if(payload&&map.id==='map'){try{const d=JSON.parse(payload.textContent),route=d.routes?.[0];if(typeof route==='string')return decodeFirst(route);if(Array.isArray(route?.[0]))return{lat:route[0][0],lon:route[0][1]};}catch{}}
  const scope=map.closest('.visit')||map.parentElement;const link=[...scope.querySelectorAll('a[href]')].find(a=>/ramblr\.com\/web\/mymap\/trip\/\d+\/\d+/.test(a.href));
  const id=link?.href.match(/\/trip\/\d+\/(\d+)/)?.[1];if(id)return(await loadSources())[id]?.start;
  return null;
 }
 function largeMap(map,opener){
  const marker=document.createComment('GPS 지도 원래 위치');map.before(marker);const dialog=document.createElement('dialog');dialog.className='jk-gps-large-dialog';dialog.setAttribute('aria-label',titleOf(map)+' 큰 지도');
  const head=document.createElement('div');head.className='jk-gps-large-head';const title=document.createElement('h2');title.textContent=titleOf(map)+' · GPS 지도';const top=document.createElement('button');top.type='button';top.className='jk-gps-large-close';top.textContent='닫기 ×';top.setAttribute('aria-label','큰 GPS 지도 닫기');head.append(title,top);
  const footer=document.createElement('div');footer.className='jk-gps-large-footer';const bottom=top.cloneNode(true);bottom.textContent='닫기 · 산행 기록으로';footer.append(bottom);dialog.append(head);document.body.append(dialog);map.classList.add('jk-expanded-map');dialog.append(map,footer);
  const resize=()=>requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
  dialog.addEventListener('close',()=>{map.classList.remove('jk-expanded-map');if(marker.isConnected){marker.replaceWith(map);}dialog.remove();resize();opener.focus({preventScroll:true});},{once:true});
  top.onclick=bottom.onclick=()=>dialog.close();dialog.showModal();resize();
 }
 function enhance(map){
  if(map.dataset.gpsActionsReady)return;map.dataset.gpsActionsReady='1';
  const actions=document.createElement('div');actions.className='jk-gps-map-actions';actions.setAttribute('aria-label','GPS 경로 지도 연결');const open=document.createElement('button');open.type='button';open.textContent='GPS 지도 크게 열기 ↗';open.onclick=()=>largeMap(map,open);actions.append(open);
  const naver=document.createElement('a'),google=document.createElement('a');for(const a of [naver,google]){a.target='_blank';a.rel='noopener noreferrer';}
  const title=titleOf(map);naver.textContent='네이버 장소 검색 ↗';naver.href='https://map.naver.com/p/search/'+encodeURIComponent(title);google.textContent='구글 장소 검색 ↗';google.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(title);actions.append(naver,google);map.after(actions);
  startOf(map).then(point=>{if(!valid(point))return;const lat=Number(point.lat),lon=Number(point.lon);naver.textContent='네이버 출발지 지도 ↗';naver.href='https://map.naver.com/p/search/'+encodeURIComponent(lat.toFixed(7)+','+lon.toFixed(7));google.textContent='구글 출발지 지도 ↗';google.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(lat.toFixed(7)+','+lon.toFixed(7));});
 }
 let queued=false;function scan(){document.querySelectorAll('.hike-map,.tranggle-gps-map,#map.leaflet-container').forEach(enhance);}
 new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;scan();});}}).observe(document.body,{childList:true,subtree:true});scan();
})();
