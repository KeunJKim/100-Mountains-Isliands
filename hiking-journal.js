/* Optional photo-led journal layout. Existing plain-text posts keep their renderer. */
(()=>{
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 .reader .body:not(.jk-hiking-journal){line-height:1.8!important}
 #article-body.jk-hiking-journal{white-space:normal!important;font-size:17px!important;line-height:1.8!important}
 #article-body.jk-hiking-journal p{font-size:17px!important;line-height:1.8!important;margin:0 0 16px!important;padding-inline-start:1em!important;text-indent:0!important;white-space:pre-line;overflow-wrap:anywhere}
 #article-body.jk-hiking-journal p:not(.jk-journal-description){line-height:1.7!important}
 #article-body.jk-hiking-journal p.jk-journal-description{text-indent:1em!important}
 #article-body.jk-hiking-journal h3{font-size:21px!important;line-height:1.45!important;margin:28px 0 12px!important;padding-bottom:8px;border-bottom:1px solid #cdbd9f}
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
 #article-body.jk-hiking-journal a{font-size:inherit!important;line-height:inherit!important;text-decoration:underline;text-underline-offset:3px}
 @media(max-width:600px){#article-body.jk-hiking-journal p{font-size:16px!important}.jk-journal-figure{margin:16px 0 22px!important}}
 `;
 document.head.append(style);
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
  function figure(src,caption,target){
   const i=items.indexOf(src);if(i<0||used.has(src))return;used.add(src);
   const f=document.createElement('figure'),b=document.createElement('button'),img=document.createElement('img'),c=document.createElement('figcaption');
   f.className='jk-journal-figure';b.type='button';b.setAttribute('aria-label',(caption||post.title)+' 크게 보기');img.src=src;img.alt=caption||post.title;img.loading='lazy';b.append(img);b.onclick=()=>showLight(items,i);c.textContent=caption||post.title;f.append(b,c);target.append(f);
  }
  figure(items[0],journal.heroCaption,photos);
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
  let section='';const flush=()=>mediaGroup((journal.media||[]).filter(m=>m.section===section));
  for(const block of (post.body||'').split(/\n\s*\n/)){
   if(!block.trim())continue;
   if((journal.headings||[]).includes(block.trim())){flush();section=block.trim();const h=document.createElement('h3');h.textContent=section;body.append(h)}
   else{const p=document.createElement('p'),first=block.trim().split('\n')[0];if(/[.!?。]$/.test(first)&&!/^https:\/\//.test(first)&&!/^[^·\n]{1,24}\s·/.test(first))p.className='jk-journal-description';appendText(p,block,journal.linkLabels||{});body.append(p)}
  }
  flush();mediaGroup(items.filter(src=>!used.has(src)).map(src=>({src,caption:(journal.media||[]).find(m=>m.src===src)?.caption})));
  return true;
 }};
})();
