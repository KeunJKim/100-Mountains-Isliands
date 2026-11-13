/* 본인 기록과 대조한 트랭글 GPX/JPG 보충. 기존 BAC 인증·램블러 데이터는 보존합니다. */
(() => {
 'use strict';
 const dialog=document.getElementById('details');if(!dialog)return;
 const el=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
 const svg=(tag,attrs)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
 const style=el('style');style.textContent=`.tranggle-reference{border-top:1px solid #cbb99a;padding-top:14px;margin-top:16px}.tranggle-reference img{display:block;max-width:100%;width:620px;height:auto;border-radius:10px;margin:12px auto}.tranggle-reference dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;border:1px solid #cbb99a;border-radius:9px;overflow:hidden;padding:0}.tranggle-reference dl>div{min-width:0;padding:11px;border-right:1px solid #d8cab3;border-bottom:1px solid #d8cab3}.tranggle-reference dt{font-size:12px;color:#695439}.tranggle-reference dd{margin:4px 0 0;font-weight:700;color:#30482e}.tranggle-reference p{font-size:13px;line-height:1.6}.tranggle-reference a{color:#30482e;text-decoration:underline}.tranggle-gps-map{height:330px;border:1px solid #cbb99a;border-radius:10px;overflow:hidden;background:#f1eee4}.tranggle-gps-chart{display:block;width:100%;height:auto;border:1px solid #cbb99a;border-radius:10px;background:#fffdf8}.tranggle-reference h4{margin:14px 0 9px}@media(max-width:560px){.tranggle-reference dl{grid-template-columns:repeat(2,minmax(0,1fr))}.tranggle-gps-map{height:280px}}`;document.head.append(style);
 function stats(section,title,pairs){const shown=pairs.filter(([,v])=>v!=null);if(!shown.length)return;section.append(el('h4',title));const dl=el('dl');for(const [label,value]of shown){const cell=el('div');cell.append(el('dt',label),el('dd',value));dl.append(cell);}section.append(dl);}
 let leafletReady;
 function leaflet(){
  if(window.L)return Promise.resolve(window.L);
  if(!leafletReady){
   if(!document.querySelector('link[href*="leaflet.css"]')){const css=el('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.append(css);}
   leafletReady=new Promise((resolve,reject)=>{let script=document.querySelector('script[src*="leaflet.js"]');const fresh=!script;if(fresh){script=el('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';}script.addEventListener('load',()=>resolve(window.L),{once:true});script.addEventListener('error',reject,{once:true});if(fresh)document.head.append(script);});
  }
  return leafletReady;
 }
 function routeMap(section,record){
  const g=record.gps,points=g.routes.flat();if(!points.length)return;section.append(el('h4','GPS 이동 경로 · 트랭글 GPX'));const map=el('div');map.className='tranggle-gps-map';map.setAttribute('aria-label',record.place+' '+record.date+' 트랭글 GPS 경로');section.append(map);
  const lat=points.map(p=>p[0]),lon=points.map(p=>p[1]),north=Math.max(...lat),south=Math.min(...lat),east=Math.max(...lon),west=Math.min(...lon),cos=Math.cos(north*Math.PI/180),scale=Math.min(540/Math.max(1e-6,(east-west)*cos),250/Math.max(1e-6,north-south));
  const project=p=>[300+(p[1]-(west+east)/2)*cos*scale,150+((north+south)/2-p[0])*scale],preview=svg('svg',{viewBox:'0 0 600 300',role:'img','aria-label':'GPX 경로 개요, 위쪽이 북쪽',style:'width:100%;height:100%'});
  for(const route of g.routes)preview.append(svg('polyline',{points:route.map(project).map(p=>p.join(',')).join(' '),fill:'none',stroke:'#176fc7','stroke-width':3}));map.append(preview);
  leaflet().then(L=>{if(!map.isConnected||!map.offsetWidth||!L)return;map.replaceChildren();const view=L.map(map,{scrollWheelZoom:false});L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(view);for(const route of g.routes)L.polyline(route,{color:'#176fc7',weight:4}).addTo(view);L.circleMarker(points[0],{color:'#126641',fillColor:'#65e1a3',fillOpacity:1}).addTo(view).bindPopup('출발');L.circleMarker(points.at(-1),{color:'#a44913',fillColor:'#ffbf76',fillOpacity:1}).addTo(view).bindPopup('종료');view.fitBounds(points,{padding:[22,22],maxZoom:16});}).catch(()=>{});
 }
 function profile(section,record){
  const lines=record.gps.profile.filter(p=>p.length),pts=lines.flat();if(pts.length<2)return;section.append(el('h4','GPS 고도 변화 · 트랭글 GPX'));
  const low=Math.floor(Math.min(...pts.map(p=>p[1]))/100)*100,high=Math.ceil(Math.max(...pts.map(p=>p[1]))/100)*100,end=Math.max(1,...pts.map(p=>p[0]));
  const chart=svg('svg',{viewBox:'0 0 600 205',role:'img','aria-label':record.place+' '+record.date+' GPX 누적거리별 고도 변화',class:'tranggle-gps-chart'}),x=d=>55+520*d/end,y=h=>165-140*(h-low)/Math.max(100,high-low);
  const label=(v,tx,ty,anchor)=>{const n=svg('text',{x:tx,y:ty,'text-anchor':anchor,fill:'#4d5746','font-size':12});n.textContent=v;chart.append(n);};
  for(let i=0;i<=4;i++){const h=low+(high-low)*i/4,gy=y(h);chart.append(svg('line',{x1:55,y1:gy,x2:575,y2:gy,stroke:'#d5c8b1'}));label(Math.round(h)+' m',49,gy+4,'end');label((end*i/4/1000).toFixed(1)+' km',x(end*i/4),188,'middle');}
  for(const line of lines)chart.append(svg('polyline',{points:line.map(([d,h])=>x(d)+','+y(h)).join(' '),fill:'none',stroke:'#176f9b','stroke-width':2}));section.append(chart);
 }
 fetch('tranggle-supplements.json?v=20261113-gps3').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
  const records=Array.isArray(data.records)?data.records:[];
  const scan=()=>{const name=document.getElementById('dialogTitle')?.textContent.trim();for(const record of records){const hasImage=typeof record.image==='string'&&/^photos\/[A-Za-z0-9_-]+\.jpg$/.test(record.image);if(name!==record.place||(!record.gps&&!hasImage))continue;for(const visit of dialog.querySelectorAll('.visit')){
   const heading=visit.querySelector('h3');if(!heading?.textContent.startsWith(record.date.replaceAll('-','.'))||visit.querySelector('.tranggle-reference'))continue;
   for(const p of visit.querySelectorAll(':scope>p'))if(p.textContent.includes('산행 날짜 기록만 입력되어'))p.remove();
   const section=el('section');section.className='tranggle-reference';section.setAttribute('aria-label',record.place+' '+record.date+' 트랭글 기록');section.append(el('h4','트랭글 산행 기록'));
   if(record.gps){routeMap(section,record);const g=record.gps;stats(section,'GPX 분석 통계',[['GPX 분석 거리',g.distanceKm.toFixed(2)+' km'],['GPX 기록 지점',g.count+'개'],['GPX 기록 시각 간격',g.elapsed],['최고 GPS 고도',Math.round(g.maxAltitudeM).toLocaleString('ko-KR')+' m']]);}
   const pairs=[['트랭글 표시 거리',record.distanceKm!=null?record.distanceKm+' km':null],['트랭글 전체시간',record.totalDuration],['트랭글 운동시간',record.exerciseDuration],['트랭글 휴식시간',record.restDuration],['트랭글 최고고도',record.maxAltitudeM!=null?record.maxAltitudeM.toLocaleString('ko-KR')+' m':null],['트랭글 누적고도',record.cumulativeElevationM!=null?record.cumulativeElevationM+' m':null]];if(!record.exerciseDuration&&record.duration)pairs.push(['트랭글 표시 시간',record.duration]);stats(section,'트랭글 앱 표시 통계',pairs);section.append(el('p',record.notes));
   if(record.gps){profile(section,record);section.append(el('p','휴대폰에 보관된 트랭글 GPX를 복사해 분석했습니다. GPX 기록 시각 간격은 앱의 전체시간·운동시간과 다를 수 있습니다.'));}
   if(hasImage){section.append(el('h4','트랭글 공유 JPG'));const a=el('a');a.href=record.image;a.target='_blank';a.rel='noopener';const img=el('img');img.src=record.image;img.alt=record.place+' '+record.date+' 트랭글 경로 및 통계 공유 이미지';img.loading='lazy';a.append(img);section.append(a,el('p','위 이미지는 트랭글에서 만든 JPG입니다.'+(record.gps?'':' 원본 GPX 미확보로 실제 GPS 지도와 구분합니다.')));}
   const gallery=el('a',record.place+' 사진 앨범 보기 →');gallery.href='gallery.html?album=m-'+encodeURIComponent(record.mountainNo);section.append(gallery);visit.append(section);
  }}};
  let queued=false;new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;scan();});}}).observe(dialog,{childList:true,subtree:true});scan();
 }).catch(()=>{});
})();
