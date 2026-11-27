/* 목록의 실제 번호만 사용합니다. 이름이 모호하면 게시자가 연결 항목을 고릅니다. */
(()=>{
 'use strict';
 let entries=[];
 const key=s=>String(s||'').normalize('NFKC').replace(/[\s·.,｜|★]/g,'').toLowerCase();
 const stem=s=>key(String(s||'').replace(/\([^)]*\)/g,''));
 const api={
  ready:null,
  entries:()=>entries,
  resolve(post){
   const kind=post.category==='island'?'island':post.category==='mountain'?'mountain':null;
   const candidates=entries.filter(e=>!kind||e.kind===kind);
   if(Array.isArray(post.listIds))return candidates.filter(e=>post.listIds.includes(e.id));
   const name=key(post.place),exact=candidates.filter(e=>key(e.name)===name);
   if(exact.length)return exact;
   return candidates.filter(e=>{
    const base=stem(e.name);if(!base||!name.includes(base))return false;
    const homonyms=candidates.filter(x=>stem(x.name)===base);
    if(homonyms.length===1)return true;
    const qualifier=e.name.match(/\(([^)]+)\)/)?.[1];
    return qualifier&&name.includes(key(qualifier));
   });
  },
  title(title,refs){
   if(!refs.length)return title;
   const prefix='['+refs.map(r=>String(r.no).padStart(3,'0')).join('·')+']';
   return prefix+' '+String(title||'').replace(/^\s*\[\d{1,3}(?:[·,\s]+\d{1,3})*\]\s*/,'');
  },
  links(post,target){
   target.replaceChildren();
   for(const ref of api.resolve(post)){
    const a=document.createElement('a');a.href=ref.url;
    a.textContent=(ref.kind==='island'?'섬&산':'명산')+' 목록 '+String(ref.no).padStart(3,'0')+' · '+ref.name+' →';
    a.style.marginInlineEnd='16px';target.append(a);
   }
   target.hidden=!target.childNodes.length;
  }
 };
 api.ready=fetch('destination-guides.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('목록 번호 자료를 불러오지 못했습니다.');return r.json();}).then(data=>{
  entries=Object.entries(data.items||{}).flatMap(([id,item])=>{
   const m=id.match(/^([mi])-(\d+)$/);if(!m)return [];
   return [{id,no:Number(m[2]),name:item.name,kind:m[1]==='i'?'island':'mountain',url:(m[1]==='i'?'islands.html?island=':'mountains.html?mountain=')+Number(m[2])}];
  });return entries;
 });
 window.JKBlogListNumbers=api;
})();
