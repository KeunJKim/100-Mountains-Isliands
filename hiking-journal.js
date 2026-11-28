/* Optional photo-led journal layout. Existing plain-text posts keep their renderer. */
(()=>{
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 .reader .body:not(.jk-hiking-journal){line-height:1.8!important}
 html body #article-title{font-size:25.2px!important;line-height:1.45!important;color:#344c40!important;margin:14px 0 12px!important;overflow-wrap:anywhere}
 html body #article-title::before{content:'★';display:inline-block;margin-right:8px;color:#6b704b;font-size:.85em}
 html body #article-body,html body #article-body :is(p,li){color:#454b44!important}
 html body #article-body h3{color:#344c40!important}
 html body #article-body a{color:#3e645d!important}
 html body #article-body figcaption{color:#686e63!important}
 #article-body.jk-hiking-journal{white-space:normal!important;font-size:17px!important;line-height:1.8!important}
 #article-body.jk-hiking-journal p{font-size:17px!important;line-height:1.8!important;margin:0 0 16px!important;padding-inline-start:1em!important;text-indent:0!important;white-space:pre-line;overflow-wrap:anywhere}
 #article-body.jk-hiking-journal p:not(.jk-journal-description){line-height:1.7!important}
 #article-body.jk-hiking-journal p.jk-journal-description{text-indent:1em!important}
 #article-body.jk-hiking-journal h3{font-size:21px!important;line-height:1.45!important;margin:28px 0 12px!important;padding-top:14px;padding-bottom:0;border-top:1px solid #cdbd9f;border-bottom:0}
 #article-body.jk-hiking-journal h3::before{content:'◆';display:inline-block;margin-right:8px;color:#426348;font-size:.75em;vertical-align:2px}
 .jk-journal-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;list-style:none;padding:0;margin:0 0 12px;counter-reset:overview}
 .jk-journal-overview li{display:flex;align-items:flex-start;gap:8px;min-width:0;padding:11px 12px;border:1px solid #d8c6a6;border-radius:7px;background:#faf6ed;font-size:16px;line-height:1.65;overflow-wrap:anywhere;counter-increment:overview}
 .jk-journal-overview li::before{content:counter(overview);display:inline-flex;align-items:center;justify-content:center;flex:0 0 23px;height:23px;border:1px solid #abb99a;border-radius:4px;background:#e9efdf;color:#35543a;font-size:13px;font-weight:700}
 .jk-journal-overview .jk-overview-wide{grid-column:1/-1}
 .jk-journal-course{margin:0 0 16px;padding:10px 12px;border:1px solid #d8c6a6;border-radius:7px;background:#faf6ed}
 .jk-journal-course dt{font-weight:bold;margin-bottom:4px}
 .jk-journal-course dd{margin:0;overflow-wrap:anywhere}
 @media(max-width:650px){.jk-journal-overview{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:420px){.jk-journal-overview{grid-template-columns:minmax(0,1fr)}}
 .jk-journal-figure{display:block;width:100%;margin:18px 0 24px!important;break-inside:avoid}
 .jk-journal-figure button{display:block;width:60%;margin-inline:auto!important;padding:0!important;background:transparent!important;border:0;cursor:zoom-in}
 .jk-journal-figure img{display:block;width:auto;max-width:100%;height:auto;max-height:372px;margin-inline:auto;object-fit:contain;border-radius:9px}
 .reader #article-photos{display:flex;flex-direction:column;align-items:stretch;gap:24px}
 .reader #article-photos>button{display:block;flex:none;width:60%;margin-inline:auto!important}
 .reader #article-photos>button img{display:block;width:100%;height:auto;object-fit:contain}
 .reader #article-photos img{max-height:318px!important}
 .jk-journal-figure figcaption{font-size:14px!important;line-height:1.5!important;margin-top:7px!important;text-align:center;color:#635c50}
 .jk-journal-photo-row{display:grid;grid-template-columns:repeat(var(--photo-count),minmax(0,1fr));gap:14px;width:100%;margin:18px auto 24px;align-items:start}
 .jk-journal-photo-row .jk-journal-figure{min-width:0;margin:0!important}
 .jk-journal-photo-row .jk-journal-figure button{width:100%;background:transparent!important}
 .jk-journal-photo-row .jk-journal-figure img{width:100%;height:auto;max-height:none;object-fit:contain}
 #article-photos.jk-journal-hero{display:block;margin:18px 0 26px!important}
 #article-photos.jk-journal-hero:empty{display:none;margin:0!important}
 #article-body.jk-hiking-journal a{font-size:inherit!important;line-height:inherit!important;text-decoration:underline;text-underline-offset:3px}
 @media(max-width:600px){#article-body.jk-hiking-journal p{font-size:16px!important}.jk-journal-figure{margin:16px 0 22px!important}}
 `;
 document.head.append(style);
 let detailsRequest;
 function addRecordedCourse(post,overview){
  const keys={mountain:'mountains',island:'islands'};
  const key=keys[post.category];
  const refs=post.listIds;
  if(!key||!post.hikeDate||!Array.isArray(refs)||refs.length!==1)return;
  const id=refs[0].match(post.category==='mountain'?/^m-(\d+)$/:/^i-(\d+)$/)?.[1];
  if(!id)return;
  detailsRequest??=fetch('hike-details.json',{cache:'no-cache'}).then(response=>{
   if(!response.ok)throw Error('Hike details unavailable');
   return response.json();
  }).catch(()=>{detailsRequest=null;});
  detailsRequest.then(details=>{
   const hike=details?.[key]?.[id];
   const route=typeof hike?.route==='string'?hike.route.trim():'';
   if(!overview.isConnected||!route||hike.hikeDate!==post.hikeDate)return;
   const course=document.createElement('dl'),label=document.createElement('dt'),value=document.createElement('dd');
   course.className='jk-journal-course';
   label.textContent='실제 산행 코스';
   value.textContent=route.replace(/\s*->\s*/g,' → ');
   course.append(label,value);
   overview.after(course);
  });
 }
 function appendText(node,text,labels){
  const re=/https:\/\/[^\s]+/g;let end=0;
  for(const match of text.matchAll(re)){
   node.append(document.createTextNode(text.slice(end,match.index)));
   const a=document.createElement('a');a.href=match[0];a.textContent=labels[match[0]]||match[0];a.target='_blank';a.rel='noopener noreferrer';node.append(a);end=match.index+match[0].length;
  }
  node.append(document.createTextNode(text.slice(end)));
 }
 window.JKHikingJournal={render(post,{body,photos,showLight}){
  body.classList.remove('jk-hiking-journal');photos.classList.remove('jk-journal-hero');
  if(post.journal?.version!==1)return false;
  body.replaceChildren();photos.replaceChildren();body.classList.add('jk-hiking-journal');photos.classList.add('jk-journal-hero');
  const used=new Set(),items=post.photos||[],journal=post.journal;
  const media=journal.media||[];
  const headings=journal.headings||[];
  const orderedMedia=['',...headings].flatMap(section=>media.filter(m=>m.section===section).map(m=>m.src));
  const lightItems=[...new Set([
   ...(media.some(m=>m.src===items[0])?[]:items.slice(0,1)),
   ...orderedMedia.filter(src=>items.includes(src)),
   ...items
  ])];
  function figure(src,caption,target){
   const i=lightItems.indexOf(src);if(i<0||used.has(src))return;used.add(src);
   const f=document.createElement('figure'),b=document.createElement('button'),img=document.createElement('img'),c=document.createElement('figcaption');
   f.className='jk-journal-figure';b.type='button';b.setAttribute('aria-label',(caption||post.title)+' 크게 보기');img.src=src;img.alt=caption||post.title;img.loading='lazy';b.append(img);b.onclick=()=>showLight(lightItems,i);c.textContent=caption||post.title;f.append(b,c);target.append(f);
  }
  if(!journal.media?.some(m=>m.src===items[0]))figure(items[0],journal.heroCaption,photos);
  function mediaGroup(media){
   const available=media.filter(m=>items.includes(m.src)&&!used.has(m.src));
   let target=body;
   if(available.length>1){target=document.createElement('div');target.className='jk-journal-photo-row';target.style.setProperty('--photo-count',available.length);body.append(target)}
   for(const m of available)figure(m.src,m.caption,target);
   if(available.length>1){
    const images=[...target.querySelectorAll('img')];
    const sizeRow=()=>{if(images.some(img=>!img.naturalWidth||!img.naturalHeight))return;const ratios=images.map(img=>img.naturalWidth/img.naturalHeight);target.style.gridTemplateColumns=ratios.map(r=>`minmax(0,${r}fr)`).join(' ');target.style.maxWidth=(ratios.reduce((a,b)=>a+b,0)*340+(images.length-1)*14)+'px';};
    for(const img of images)img.addEventListener('load',sizeRow,{once:true});sizeRow();
   }
  }
  let section='',overviewDone=false;const flush=()=>mediaGroup((journal.media||[]).filter(m=>m.section===section));
  for(const block of (post.body||'').split(/\n\s*\n/)){
   if(!block.trim())continue;
   if((journal.headings||[]).includes(block.trim())){
    flush();section=block.trim();
    if(section==='다음 방문 참고')window.JKBlogRoute?.insert(post,body);
    const h=document.createElement('h3');h.textContent=section;body.append(h);
   }
   else if(/^(?:이날의 )?산행 한눈에$/.test(section)&&!overviewDone){
    overviewDone=true;const list=document.createElement('ol');list.className='jk-journal-overview';list.setAttribute('aria-label','산행 요약');
    for(const line of block.trim().split('\n').filter(Boolean))for(const text of (line.startsWith('산행강도')?[line]:line.split(' · '))){const item=document.createElement('li');item.textContent=text.trim();if(text.includes('→'))item.className='jk-overview-wide';list.append(item)}
    body.append(list);addRecordedCourse(post,list);
   }
   else{const p=document.createElement('p'),first=block.trim().split('\n')[0];if(/[.!?。]$/.test(first)&&!/^https:\/\//.test(first)&&!/^[^·\n]{1,24}\s·/.test(first))p.className='jk-journal-description';appendText(p,block,journal.linkLabels||{});body.append(p)}
  }
  flush();mediaGroup(items.filter(src=>!used.has(src)).map(src=>({src,caption:(journal.media||[]).find(m=>m.src===src)?.caption})));
  window.JKBlogRoute?.insert(post,body);
  return true;
 }};
})();
