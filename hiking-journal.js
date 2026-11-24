/* Optional photo-led journal layout. Existing plain-text posts keep their renderer. */
(()=>{
 'use strict';
 const style=document.createElement('style');
 style.textContent=`
 #article-body.jk-hiking-journal{white-space:normal!important;font-size:17px!important;line-height:1.9!important}
 #article-body.jk-hiking-journal p{font-size:17px!important;line-height:1.9!important;margin:0 0 18px!important;padding-inline-start:1em!important;text-indent:0!important;white-space:pre-line;overflow-wrap:anywhere}
 #article-body.jk-hiking-journal p.jk-journal-description{text-indent:1em!important}
 #article-body.jk-hiking-journal h3{font-size:21px!important;line-height:1.5!important;margin:32px 0 14px!important;padding-bottom:8px;border-bottom:1px solid #cdbd9f}
 .jk-journal-figure{margin:20px 0 28px!important}
 .jk-journal-figure button{display:block;width:60%;margin-inline:auto!important;padding:0!important;background:transparent;border:0;cursor:zoom-in}
 .jk-journal-figure img{display:block;width:100%;height:auto;max-height:372px;object-fit:contain;border-radius:9px}
 .reader #article-photos>button{width:60%;margin-inline:auto!important}
 .reader #article-photos img{max-height:318px!important}
 .jk-journal-figure figcaption{font-size:14px!important;line-height:1.6!important;margin-top:8px!important;text-align:center;color:#635c50}
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
  let section='';const flush=()=>{for(const m of journal.media||[])if(m.section===section)figure(m.src,m.caption,body)};
  for(const block of (post.body||'').split(/\n\s*\n/)){
   if(!block.trim())continue;
   if((journal.headings||[]).includes(block.trim())){flush();section=block.trim();const h=document.createElement('h3');h.textContent=section;body.append(h)}
   else{const p=document.createElement('p'),first=block.trim().split('\n')[0];if(/[.!?。]$/.test(first)&&!/^https:\/\//.test(first)&&!/^[^·\n]{1,24}\s·/.test(first))p.className='jk-journal-description';appendText(p,block,journal.linkLabels||{});body.append(p)}
  }
  flush();for(const src of items)figure(src,(journal.media||[]).find(m=>m.src===src)?.caption,body);
  return true;
 }};
})();
