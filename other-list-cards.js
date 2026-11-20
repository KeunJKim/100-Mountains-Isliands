/* 명산외 기록도 같은 3열 카드로 표시하며 원래 산행기·관리 연결을 보존합니다. */
(() => {
 'use strict';if(!location.pathname.endsWith('/other-hikes.html'))return;const list=document.getElementById('list');if(!list)return;
 const base=new URL('.',document.currentScript?.src||location.href),make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const style=document.createElement('style');style.id='jk-other-list-style';style.textContent=`
 html body.jk-readable-lists main #list#list.grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important}
 @media(max-width:760px){html body.jk-readable-lists main #list#list.grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}}
 @media(max-width:480px){html body.jk-readable-lists main #list#list.grid{grid-template-columns:1fr!important}}
 html body.jk-readable-lists #list>.other-record-item{min-width:0;padding:0!important;height:auto;display:flex;flex-direction:column}
 html body.jk-readable-lists #list>.other-record-item[hidden]{display:none!important}
 html body.jk-readable-lists #list :is(:scope>.card,.other-record-item>.card){display:flex!important;flex-direction:column;gap:4px;position:relative;padding:12px!important;min-height:0!important;height:auto!important;flex:1;overflow-wrap:anywhere;border-radius:8px}
 html body #list .jk-other-heading{display:flex;align-items:baseline;flex-wrap:wrap;gap:3px 8px;padding-right:30px;min-width:0}
 html body #list .jk-other-heading h3{display:inline;margin:0!important;font-size:16px;line-height:1.45!important}
 html body #list .jk-other-meta{font-size:12px;line-height:1.5;color:#67513b;white-space:normal}
 html body #list .jk-other-no{position:absolute;right:8px;top:9px;font-size:13px;color:#86603b;font-variant-numeric:tabular-nums}
 html body #list .jk-other-body{display:flex;align-items:center;gap:9px;min-width:0;margin:5px 0}
 html body #list .jk-other-intro{flex:1;min-width:0;font-size:13px!important;line-height:1.55!important;color:#3f5038;margin:0!important}
 html body #list img.jk-other-cover{flex:0 0 76px;width:76px!important;height:64px!important;max-width:76px!important;object-fit:cover;border:1px solid #dac9ae;border-radius:6px;box-sizing:border-box;user-select:none;-webkit-user-drag:none}
 html body #list .jk-other-missing{display:flex;align-items:center;justify-content:center;flex:0 0 76px;width:76px;height:64px;border:1px dashed #c8b898;border-radius:6px;color:#84735a;font-size:11px;line-height:1.4;background:#f5efdf}
 html body #list .jk-other-facts{margin:2px 0!important;color:#665740;font-size:12px;line-height:1.5}
 html body #list .other-delete{align-self:flex-end;margin:4px 0 0!important}
 `.replaceAll('#list#list','#list').replaceAll('html body.jk-readable-lists','html body.jk-readable-lists:has(#list)').replaceAll('html body #list','html body.jk-readable-lists:has(#list) #list');document.head.append(style);let data=null;
 function keyFor(a){if(a.dataset.photoRecord)return 'photo:'+a.dataset.photoRecord;const u=new URL(a.href,location.href);if(u.pathname.endsWith('/blog.html'))return 'blog:'+decodeURIComponent(u.hash.replace(/^#post-/,''));return 'gpx:'+u.pathname.split('/').pop();}
 function apply(){if(!data)return;let no=0;for(const a of list.querySelectorAll('a.card')){const key=keyFor(a);let g=data.items[key];if(!g){const name=a.querySelector('h3')?.textContent||'산행 기록',date=a.querySelector('small')?.textContent.match(/20\d{2}-\d{2}-\d{2}/)?.[0]||'',img=a.querySelector('img');g=data.items[key]={name,date,kind:a.querySelector('.gps-cover')?'GPS':'산행',summary:(a.querySelector('p')?.textContent||'새로 추가한 산행 기록을 살펴보세요.').slice(0,100),photoThemes:['산행 기록'],highlights:[],elevation:null,visitDays:date?1:0,photoCount:0,cover:img?{src:img.getAttribute('src'),alt:img.alt||name+' 대표 사진'}:null};}no++;const wrapper=a.closest('.other-record-item')||a;wrapper.dataset.guideId=key;const number=a.querySelector('.jk-other-no');if(number){if(number.textContent!==String(no).padStart(3,'0'))number.textContent=String(no).padStart(3,'0');continue;}
  const title=a.querySelector('h3')?.textContent||g.name;const head=make('span',null,'jk-other-heading');head.append(make('h3',title));
  const parts=[g.date?'산행일 '+g.date:'날짜 미등록',Number.isFinite(g.elevation)?'GPS 최고 '+g.elevation.toLocaleString('ko-KR')+'m':'고도 미등록',g.kind+' 기록',g.visitDays?'방문 '+g.visitDays+'일':'방문일 미등록'];head.append(make('small',parts.join(' · '),'jk-other-meta'));
  const body=make('span',null,'jk-other-body');body.append(make('span',g.summary,'jk-other-intro'));
  if(g.cover){const img=make('img',null,'jk-other-cover jk-photo-protected');img.src=new URL(g.cover.src,base).href;img.alt=g.cover.alt;img.loading='lazy';img.decoding='async';img.width=76;img.height=64;img.draggable=false;img.addEventListener('error',()=>img.replaceWith(make('span','사진 준비 중','jk-other-missing')),{once:true});body.append(img);}else body.append(make('span','사진 준비 중','jk-other-missing'));
  const tags=a.querySelector('.jk-season-tags');const ordinal=make('span',String(no).padStart(3,'0'),'jk-other-no');a.replaceChildren(ordinal,head,body);
  const facts=[Number.isFinite(g.distanceKm)?'거리 '+g.distanceKm+'km':'',g.duration?'소요 '+g.duration:'',g.photoCount?'사진 '+g.photoCount+'장':''].filter(Boolean);if(facts.length)a.append(make('small',facts.join(' · '),'jk-other-facts'));if(tags)a.append(tags);
 }}
 let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});};new MutationObserver(schedule).observe(list,{subtree:true,childList:true});
 fetch(new URL('other-list-guides.json?v=20261120-other1',base)).then(r=>{if(!r.ok)throw Error('명산외 소개 연결 실패');return r.json();}).then(g=>{data=g;window.JKDestinationGuides=g;apply();window.dispatchEvent(new CustomEvent('jk-destination-guides-ready',{detail:g}));}).catch(e=>console.warn(e.message));
})();
