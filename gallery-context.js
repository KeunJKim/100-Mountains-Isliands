/* 상세 기록의 갤러리 링크는 선택 장소를 유지합니다. 상단 전체 갤러리 메뉴는 유지합니다. */
(() => {
 'use strict';
 if(location.pathname.endsWith('/gallery.html'))return;
 const albums=[{"id":"m-1","name":"가리산(홍천)"},{"id":"m-2","name":"가리왕산"},{"id":"m-3","name":"가야산(합천)"},{"id":"m-4","name":"가야산(충남)"},{"id":"m-5","name":"가지산"},{"id":"m-6","name":"감악산(원주)"},{"id":"m-7","name":"감악산(파주)"},{"id":"m-8","name":"계룡산"},{"id":"m-9","name":"계방산"},{"id":"m-10","name":"관악산"},{"id":"m-11","name":"광덕산"},{"id":"m-12","name":"구병산(보은)"},{"id":"m-13","name":"구봉산(진안)"},{"id":"m-14","name":"금수산"},{"id":"m-15","name":"금오산"},{"id":"m-16","name":"금정산"},{"id":"m-17","name":"남산(경주)"},{"id":"m-18","name":"내변산(변산)"},{"id":"m-19","name":"내연산"},{"id":"m-20","name":"내장산"},{"id":"m-21","name":"노인봉(오대산)"},{"id":"m-22","name":"달마산"},{"id":"m-23","name":"대둔산"},{"id":"m-24","name":"대야산"},{"id":"m-25","name":"덕룡산"},{"id":"m-26","name":"덕유산"},{"id":"m-27","name":"덕항산"},{"id":"m-28","name":"도락산"},{"id":"m-29","name":"도봉산"},{"id":"m-30","name":"동악산(곡성)"},{"id":"m-31","name":"두륜산"},{"id":"m-32","name":"두타산"},{"id":"m-33","name":"마니산(강화도)"},{"id":"m-34","name":"마이산(진안)"},{"id":"m-35","name":"천마산"},{"id":"m-36","name":"명지산"},{"id":"m-37","name":"모악산"},{"id":"m-38","name":"무등산"},{"id":"m-39","name":"민주지산"},{"id":"m-40","name":"바래봉(지리산)"},{"id":"m-41","name":"반야봉(지리산)"},{"id":"m-42","name":"방장산"},{"id":"m-43","name":"방태산"},{"id":"m-44","name":"백덕산"},{"id":"m-45","name":"백암산"},{"id":"m-46","name":"백운산(광양)"},{"id":"m-47","name":"백운산(동강)"},{"id":"m-48","name":"북한산"},{"id":"m-49","name":"불갑산(영광)"},{"id":"m-50","name":"비슬산"},{"id":"m-51","name":"삼악산"},{"id":"m-52","name":"선운산"},{"id":"m-53","name":"설악산"},{"id":"m-54","name":"소백산"},{"id":"m-55","name":"소요산"},{"id":"m-56","name":"속리산"},{"id":"m-57","name":"수락산"},{"id":"m-58","name":"신불산"},{"id":"m-59","name":"연인산"},{"id":"m-60","name":"오대산 비로봉"},{"id":"m-61","name":"오봉산(춘천)"},{"id":"m-62","name":"오서산(보령)"},{"id":"m-63","name":"용문산"},{"id":"m-64","name":"용봉산(홍성)"},{"id":"m-65","name":"용화산"},{"id":"m-66","name":"운악산"},{"id":"m-67","name":"운장산"},{"id":"m-68","name":"월악산"},{"id":"m-69","name":"월출산"},{"id":"m-70","name":"유명산"},{"id":"m-71","name":"응봉산"},{"id":"m-72","name":"장안산"},{"id":"m-73","name":"재약산"},{"id":"m-74","name":"조계산"},{"id":"m-75","name":"조령산"},{"id":"m-76","name":"주왕산"},{"id":"m-77","name":"주흘산"},{"id":"m-78","name":"지리산 천왕봉"},{"id":"m-79","name":"천관산"},{"id":"m-80","name":"천성산"},{"id":"m-81","name":"천태산"},{"id":"m-82","name":"청계산"},{"id":"m-83","name":"청량산"},{"id":"m-84","name":"청화산"},{"id":"m-85","name":"축령산(장성)"},{"id":"m-86","name":"치악산"},{"id":"m-87","name":"칠갑산"},{"id":"m-88","name":"칠보산"},{"id":"m-89","name":"태백산"},{"id":"m-90","name":"태화산"},{"id":"m-91","name":"팔공산"},{"id":"m-92","name":"팔봉산(홍천)"},{"id":"m-93","name":"팔영산"},{"id":"m-94","name":"한라산"},{"id":"m-95","name":"함백산"},{"id":"m-96","name":"화악산(가평)"},{"id":"m-97","name":"화왕산(창녕)"},{"id":"m-98","name":"황매산(산청)"},{"id":"m-99","name":"황석산(함양)"},{"id":"m-100","name":"황악산(김천)"},{"id":"i-1","name":"교동도"},{"id":"i-2","name":"석모도"},{"id":"i-3","name":"대청도"},{"id":"i-4","name":"굴업도"},{"id":"i-5","name":"문갑도"},{"id":"i-6","name":"백아도"},{"id":"i-7","name":"덕적도"},{"id":"i-8","name":"백령도"},{"id":"i-9","name":"신도"},{"id":"i-10","name":"장봉도"},{"id":"i-11","name":"연평도"},{"id":"i-12","name":"영흥도"},{"id":"i-13","name":"승봉도"},{"id":"i-14","name":"대이작도"},{"id":"i-15","name":"자월도"},{"id":"i-16","name":"무의도"},{"id":"i-17","name":"제부도"},{"id":"i-18","name":"난지도"},{"id":"i-19","name":"고대도"},{"id":"i-20","name":"삽시도"},{"id":"i-21","name":"외연도"},{"id":"i-22","name":"원산도"},{"id":"i-23","name":"죽도"},{"id":"i-24","name":"관리도"},{"id":"i-25","name":"방축도"},{"id":"i-26","name":"선유도"},{"id":"i-27","name":"신시도"},{"id":"i-28","name":"어청도"},{"id":"i-29","name":"위도"},{"id":"i-30","name":"가우도"},{"id":"i-31","name":"거금도"},{"id":"i-32","name":"연홍도"},{"id":"i-33","name":"애도(쑥섬)"},{"id":"i-34","name":"외나로도"},{"id":"i-35","name":"우이도"},{"id":"i-36","name":"비금도"},{"id":"i-37","name":"암태도"},{"id":"i-38","name":"임자도"},{"id":"i-39","name":"자은도"},{"id":"i-40","name":"가거도"},{"id":"i-41","name":"만재도"},{"id":"i-42","name":"흑산도"},{"id":"i-43","name":"홍도"},{"id":"i-44","name":"금오도"},{"id":"i-45","name":"돌산도"},{"id":"i-46","name":"거문도"},{"id":"i-47","name":"손죽도"},{"id":"i-48","name":"초도"},{"id":"i-49","name":"개도"},{"id":"i-50","name":"낭도"},{"id":"i-51","name":"사도"},{"id":"i-52","name":"백야도"},{"id":"i-53","name":"하화도"},{"id":"i-54","name":"안마도"},{"id":"i-55","name":"송이도"},{"id":"i-56","name":"하낙월도"},{"id":"i-57","name":"금당도"},{"id":"i-58","name":"보길도"},{"id":"i-59","name":"신지도"},{"id":"i-60","name":"생일도"},{"id":"i-61","name":"소안도"},{"id":"i-62","name":"조약도(약산도)"},{"id":"i-63","name":"완도"},{"id":"i-64","name":"청산도"},{"id":"i-65","name":"여서도"},{"id":"i-66","name":"진도"},{"id":"i-67","name":"상조도"},{"id":"i-68","name":"하조도"},{"id":"i-69","name":"관매도"},{"id":"i-70","name":"대마도(진도)"},{"id":"i-71","name":"가덕도"},{"id":"i-72","name":"영도"},{"id":"i-73","name":"울릉도"},{"id":"i-74","name":"독도"},{"id":"i-75","name":"산달도"},{"id":"i-76","name":"거제도"},{"id":"i-77","name":"가조도"},{"id":"i-78","name":"지심도"},{"id":"i-79","name":"외도"},{"id":"i-80","name":"남해금산"},{"id":"i-81","name":"창선도"},{"id":"i-82","name":"신수도"},{"id":"i-83","name":"저도"},{"id":"i-84","name":"미륵도"},{"id":"i-85","name":"수우도"},{"id":"i-86","name":"사량도(상)"},{"id":"i-87","name":"사량도(하)"},{"id":"i-88","name":"연대도"},{"id":"i-89","name":"두미도"},{"id":"i-90","name":"욕지도"},{"id":"i-91","name":"연화도"},{"id":"i-92","name":"한산도"},{"id":"i-93","name":"소매물도"},{"id":"i-94","name":"매물도"},{"id":"i-95","name":"장사도"},{"id":"i-96","name":"비진도"},{"id":"i-97","name":"용초도"},{"id":"i-98","name":"마라도"},{"id":"i-99","name":"우도"},{"id":"i-100","name":"추자도"},{"id":"o-3194311","name":"걷기 - 07/16/2021"},{"id":"o-11297793","name":"운문사"},{"id":"o-11112113","name":"영축산"},{"id":"o-10956445","name":"노고단"},{"id":"o-10647378","name":"통도사 19암자"},{"id":"o-10353862","name":"능동산.입석대"},{"id":"o-10302971","name":"운문산"},{"id":"o-10291379","name":"여수 영취산"},{"id":"o-10256640","name":"염포산"},{"id":"a-goheonsan","name":"고헌산"},{"id":"a-munboksan","name":"문복산"},{"id":"o-local-cheongoksan","name":"청옥산"},{"id":"o-local-osaekryeong","name":"백두대간오색령"},{"id":"a-baenaebong","name":"배내봉"},{"id":"o-tranggle-20261107-udong","name":"부산 해운대구 우동"},{"id":"a-ganwolsan","name":"간월산"},{"id":"a-cheonhwangsan","name":"천황산"},{"id":"o-photo-9c5ea3d46e69","name":"종남산"},{"id":"o-photo-ff3c2249aec4","name":"채석강"},{"id":"o-photo-045a964e697c","name":"만항재"},{"id":"o-5138124","name":"제비봉"},{"id":"o-photo-d2c82e691e20","name":"응봉산(서울 성동구)"},{"id":"o-5515204","name":"발왕산"},{"id":"o-5633628","name":"동석산"},{"id":"o-5833377","name":"백운산(밀양)"},{"id":"o-5854147","name":"청태산"},{"id":"o-5859239","name":"금학산"},{"id":"o-5861246","name":"사명산"},{"id":"o-photo-d87d58a902a4","name":"응봉(2023.08.07)"},{"id":"o-5882260","name":"계족산"},{"id":"o-5904312","name":"민둥산"},{"id":"o-photo-3e2f3e10e2c4","name":"쉰움산"},{"id":"o-6210016","name":"희양산"},{"id":"o-photo-9e053c46dde9","name":"토함산"},{"id":"o-6432253","name":"간월산·신불산·영축산 연계산행"},{"id":"o-6434425","name":"천황산·재약산 연계산행"},{"id":"o-6558048","name":"선자령"},{"id":"o-6767444","name":"장복산"},{"id":"a-photo-b5d75294a377","name":"능동산·가지산 연계산행"},{"id":"o-6907846","name":"미숭산"},{"id":"o-8371248","name":"천주산"},{"id":"o-8415535","name":"주작산"},{"id":"o-8546897","name":"일림산"},{"id":"o-8566215","name":"초암산"},{"id":"o-8935820","name":"백두대간 수목원"},{"id":"o-10103040","name":"장산"},{"id":"o-10131126","name":"용궐산"},{"id":"o-10527459","name":"금강산 신선대"},{"id":"o-10575902","name":"거창 감악산"},{"id":"o-11154473","name":"간월산·신불산 연계산행"},{"id":"o-island-photo-e096119e1445","name":"차귀도"},{"id":"o-9027063","name":"장자도"},{"id":"o-island-photo-8ffa4db4d123","name":"병풍도"}];
 const params=new URLSearchParams(location.search);
 const normalize=s=>String(s||'').trim().replace(/\s+/g,'');
 function recordAlbum(id,label){
  const direct=albums.find(a=>a.id==='o-'+id);if(direct)return direct;
  const title=label||document.querySelector('h1')?.textContent.replace(/\s*기록$/,'')||'선택한 산행';
  const matches=albums.filter(a=>normalize(a.name).length>=3&&normalize(title).includes(normalize(a.name))).sort((a,b)=>normalize(b.name).length-normalize(a.name).length);
  if(matches.length&&(!matches[1]||normalize(matches[0].name).length>normalize(matches[1].name).length))return matches[0];
  return{id:'o-'+id,name:title};
 }
 function context(node){
  const explicit=node.closest('[data-gallery-album]')?.dataset.galleryAlbum;
  if(explicit)return{id:explicit};
  const detail=node.closest('#details,#detail');
  if(detail){
   const routeAlbum=albums.find(a=>a.id==='o-'+params.get('record'));if(routeAlbum)return routeAlbum;
   const number=detail.querySelector('#dialogNumber')?.textContent.match(/·\s*(\d+)/)?.[1];
   if(number)return{id:'m-'+Number(number)};
   const name=normalize(detail.querySelector('#detail-title')?.textContent.replace(/\s*·\s*산행 상세.*$/,''));
   const album=albums.find(a=>a.id.startsWith('i-')&&normalize(a.name)===name);if(album)return album;
  }
  if(params.get('album'))return{id:params.get('album')};
  const alpsCard=node.closest('#alps-records .record'),trip=node.getAttribute('href')?.match(/gpx-\d{8}-(\d+)\.html/)?.[1];
  if(alpsCard&&trip)return recordAlbum(trip,alpsCard.querySelector('h3')?.textContent);
  const record=location.pathname.match(/gpx-\d{8}-(\d+)\.html$/)?.[1];
  if(record)return recordAlbum(record);
  const source=node.closest('main')?.querySelector('[data-jk-source]')?.dataset.jkSource;
  if(source)return recordAlbum(source);
  return null;
 }
 function update(link,album){
  const url=new URL(link.href,location.href);url.searchParams.set('album',album.id);url.searchParams.delete('group');
  if(album.name)url.searchParams.set('place',album.name);
  if(link.href!==url.href)link.href=url.href;
 }
 let queued=false;
 function scan(){
  for(const link of document.querySelectorAll('a[href*="gallery.html"]')){
   if(!/사진.*갤러리.*(보기|추가|관리)/.test(link.textContent))continue;
   const album=context(link);if(album)update(link,album);
  }
  // 이후 별도 GPS 페이지로 이동해도 선택했던 장소를 전달합니다.
  for(const link of document.querySelectorAll('a[href*="gpx-"],a[href*="yeongchuksan-"]')){
   const album=context(link);if(!album)continue;
   const url=new URL(link.href,location.href);if(!url.searchParams.has('album')){url.searchParams.set('album',album.id);link.href=url.href;}
  }
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}
 new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-gallery-album']});
 document.addEventListener('click',event=>{const link=event.target.closest('a[href*="gallery.html"]');if(link&&/사진.*갤러리.*(보기|추가|관리)/.test(link.textContent)){const album=context(link);if(album)update(link,album);}},true);
 // 해외트래킹 글에는 글에 첨부한 사진만 연결합니다. 현재 등록된 글을 기준으로 처리합니다.
 if(location.pathname.endsWith('/blog.html'))fetch('blog-posts.json?fresh='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(data=>{
  const posts=Array.isArray(data)?data:data.posts||[];
  const connect=()=>{const id=decodeURIComponent(location.hash.replace(/^#post-/,'')),post=posts.find(p=>p.id===id&&p.category==='overseas'),view=document.getElementById('article-view');if(!view)return;let link=document.getElementById('linked-post-gallery');if(!post){link?.remove();return;}if(!link){link=document.createElement('a');link.id='linked-post-gallery';link.className='btn';link.textContent='사진 갤러리에서 보기 →';document.getElementById('article-photos').after(link);}const url=new URL('gallery.html',location.href);url.searchParams.set('post',post.id);url.searchParams.set('place',post.place||post.title||'해외트래킹');if(link.href!==url.href)link.href=url.href;};
  let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;connect();});}).observe(document.getElementById('article-title'),{childList:true,subtree:true});window.addEventListener('hashchange',connect);connect();
 }).catch(e=>console.warn('해외트래킹 사진 연결 확인 실패',e));
 schedule();
})();
