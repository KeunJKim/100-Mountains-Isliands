/* 수정창의 입력·인증 정보 없이 선택한 날짜의 GPS 경로만 전달받습니다. */
(()=>{'use strict';
 const embedded=new URLSearchParams(location.search).has('embedded'),sender=embedded?window.parent:window.opener;document.getElementById('close').hidden=embedded;document.getElementById('close').onclick=()=>window.close();if(embedded){const style=document.createElement('style');style.textContent='body{padding:10px;font-size:14px}h1{font-size:17px}#map{height:calc(100dvh - 210px);min-height:180px}';document.head.append(style);}
 let map,received=false;
 function decode(s){let i=0,lat=0,lon=0,out=[];while(i<s.length){const values=[];for(let a=0;a<2;a++){let b,v=0,shift=0;do{if(i>=s.length||shift>30)return out;b=s.charCodeAt(i++)-63;v|=(b&31)<<shift;shift+=5;}while(b>=32);values.push(v&1?~(v>>1):v>>1);}lat+=values[0];lon+=values[1];out.push([lat/1e5,lon/1e5]);}return out;}
 window.addEventListener('message',e=>{
  if(e.origin!==location.origin||e.source!==sender||e.data?.type!=='jk-gpx-records'||received)return;
  received=true;const data=e.data.payload;document.getElementById('title').textContent=data.title;document.title=data.title+' · GPX';
  const routes=data.records.flatMap(r=>(r.routes||[]).map(line=>typeof line==='string'?decode(line):line)).filter(Array.isArray).map(line=>line.filter(p=>Array.isArray(p)&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180)).filter(line=>line.length);
  const points=routes.flat(),host=document.getElementById('map'),status=document.getElementById('status');if(!points.length){status.textContent='표시할 GPS 경로가 없습니다.';return;}
  const stats=document.getElementById('stats');for(const record of data.records){for(const text of [record.distanceKm!=null?'GPS 거리 '+record.distanceKm+' km':'',record.elapsed?'기록 시간 '+record.elapsed:'']){if(text){const span=document.createElement('span');span.textContent=text;stats.append(span);}}}
  // 지도를 불러올 수 없는 환경에서도 실제 경로 선은 표시합니다.
  const lat=points.map(p=>p[0]),lon=points.map(p=>p[1]),south=Math.min(...lat),north=Math.max(...lat),west=Math.min(...lon),east=Math.max(...lon),ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 800 600');svg.setAttribute('role','img');svg.setAttribute('aria-label','GPS 이동 경로');for(const route of routes){const line=document.createElementNS(ns,'polyline');line.setAttribute('points',route.map(p=>(40+(p[1]-west)/(east-west||1)*720)+','+(560-(p[0]-south)/(north-south||1)*520)).join(' '));line.setAttribute('fill','none');line.setAttribute('stroke','#147eac');line.setAttribute('stroke-width','4');svg.append(line);}host.replaceChildren(svg);status.textContent='선택한 산행일의 실제 GPS 이동 경로입니다.';
  const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=()=>{host.replaceChildren();map=L.map(host);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(map);for(const route of routes)L.polyline(route,{color:'#147eac',weight:4}).addTo(map);map.fitBounds(L.latLngBounds(points),{padding:[24,24]});window.addEventListener('resize',()=>{map.invalidateSize();map.fitBounds(L.latLngBounds(points),{padding:[24,24]});});L.circleMarker(points[0],{color:'#278f64',radius:7}).addTo(map);L.circleMarker(points[points.length-1],{color:'#dc8230',radius:7}).addTo(map);};document.head.append(script);
 });
 if(sender)sender.postMessage('jk-gpx-ready',location.origin);else document.getElementById('status').textContent='산행 정보 수정창의 ‘GPX 기록 함께 보기’를 눌러 열어 주세요.';
})();
