/* Match published hiking routes to the exact hike date shown in each article. */
(() => {
 'use strict';
 const leafletBase='https://unpkg.com/leaflet@1.9.4/dist/';
 const style=document.createElement('style');
 style.textContent=`
 .jk-blog-route{margin:22px 0;white-space:normal}
 .jk-blog-route .jk-blog-map{height:clamp(300px,49vh,470px);border:1px solid #d8c6a6;border-radius:9px;background:#f4f0e6}
 .jk-blog-route figure{margin:0}
 .jk-blog-route figure img{display:block;max-width:100%;max-height:460px;margin-inline:auto;border-radius:9px;object-fit:contain}
 .jk-blog-route figcaption,.jk-blog-route .jk-blog-route-note{display:block;margin-top:8px;font-size:14px;line-height:1.5}
 .jk-blog-route .jk-blog-map-photo{display:block;width:140px;max-height:120px;object-fit:contain;margin-top:6px}
 `;
 document.head.append(style);
 let dataRequest,leafletRequest,observer,map;
 const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 function loadLeaflet(){
  if(window.L)return Promise.resolve(window.L);
  if(!leafletRequest)leafletRequest=new Promise((resolve,reject)=>{
   const css=node('link'),script=node('script');
   css.rel='stylesheet';css.href=leafletBase+'leaflet.css';document.head.append(css);
   script.src=leafletBase+'leaflet.js';script.onload=()=>resolve(window.L);
   script.onerror=()=>{leafletRequest=null;script.remove();css.remove();reject(new Error('Leaflet unavailable'));};
   document.head.append(script);
  });
  return leafletRequest;
 }
 async function draw(container,route,pins){
  const L=await loadLeaflet();
  if(!container.isConnected||container.closest('#article-view')?.classList.contains('hidden'))return;
  map=L.map(container,{scrollWheelZoom:false});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
   maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  const line=L.polyline(route.segments,{color:'#1262a3',weight:4}).addTo(map);
  map.fitBounds(line.getBounds(),{padding:[22,22]});
  for(const pin of pins){
   const popup=node('div'),img=node('img');
   img.src=pin.src;img.alt=pin.caption;img.className='jk-blog-map-photo';
   popup.append(node('strong',pin.caption),img);
   L.circleMarker(pin.point,{radius:7,color:'#78470a',weight:2,fillColor:'#ffbd63',fillOpacity:1})
    .addTo(map).bindTooltip(pin.caption).bindPopup(popup);
  }
 }
 function addRoute(section,route,post){
  section.append(node('h3',route.image?'산행 코스 개략도':'GPS 산행 지도'));
  if(route.image){
   const figure=node('figure'),img=node('img'),caption=node('figcaption',route.note);
   img.src=route.image;img.loading='lazy';img.alt='중계소 부근에서 가야봉 정상까지의 왕복 동선';
   figure.append(img,caption);section.append(figure);return;
  }
  const canvas=node('div');
  canvas.className='jk-blog-map';canvas.setAttribute('aria-label','GPS 산행 경로와 사진 촬영 지점');
  section.append(canvas);
  const pins=route.pins.filter(pin=>post.photos?.includes(pin.src));
  if(pins.length){
   const note=node('span','주황색 점은 사진 촬영 시각을 GPS 기록과 대조해 추정한 위치입니다. 점을 누르면 사진이 열립니다.');
   note.className='jk-blog-route-note';section.append(note);
  }
  const source=node('a','GPS 원본 기록 보기 ↗');
  source.className='jk-blog-route-note';source.href=route.source;source.target='_blank';source.rel='noopener noreferrer';
  section.append(source);
  const show=()=>draw(canvas,route,pins).catch(()=>{
   canvas.remove();
   const notice=node('span','지도를 불러오지 못했습니다. GPS 원본 기록에서 경로를 볼 수 있습니다.');
   notice.className='jk-blog-route-note';section.insertBefore(notice,source);
  });
  if(!('IntersectionObserver' in window)){void show();return;}
  observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();void show();}
  },{rootMargin:'240px'});
  observer.observe(canvas);
 }
 window.JKBlogRoute={
  clear(){observer?.disconnect();observer=null;map?.remove();map=null;},
  insert(post,body){
   if(!post.hikeDate||body.querySelector('.jk-blog-route'))return;
   const section=node('section');section.className='jk-blog-route';section.hidden=true;body.append(section);
   dataRequest??=fetch('blog-routes.json').then(res=>{
    if(!res.ok)throw new Error('Route data unavailable');
    return res.json();
   });
   dataRequest.then(routes=>{
    const route=routes[post.id];
    if(!section.isConnected||section.closest('#article-view')?.classList.contains('hidden')||route?.date!==post.hikeDate){section.remove();return;}
    section.hidden=false;addRoute(section,route,post);
   }).catch(()=>section.remove());
  }
 };
})();
