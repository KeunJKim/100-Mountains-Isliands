/* 산·섬 소개와 대표 사진. 원본 인증·GPS 및 상단 찾기 메뉴는 변경하지 않습니다. */
(() => {
 'use strict';
 const page=location.pathname.split('/').pop(),mountain=page==='mountains.html',island=page==='islands.html';
 const map=['mountains-map.html','islands-map.html','yeongnam-alps-map.html'].includes(page);
 if(!mountain&&!island&&!map)return;
 const base=new URL('.',document.currentScript?.src||location.href);
 const style=document.createElement('style');style.id='jk-destination-style';style.textContent=`
 html body :is(#cards>.card,#island-cards>.ux-island-card) .jk-place-heading{display:flex!important;align-items:baseline;flex-wrap:wrap;gap:3px 8px;min-width:0;width:100%;padding-right:30px;box-sizing:border-box;margin:0!important}
 html body :is(#cards,#island-cards) .jk-place-heading :is(h2,strong){display:inline!important;flex:0 1 auto;margin:0!important;padding-right:0!important;line-height:1.45!important}
 html body .jk-place-meta{display:inline;flex:0 1 auto;font-size:12px;line-height:1.5;color:#5f4c36;white-space:normal}
 html body :is(#cards,#island-cards) .jk-list-region{display:block;margin:3px 0!important;color:#665740;line-height:1.5;white-space:normal}
 html body .jk-guide-body{display:flex;align-items:center;gap:9px;margin:6px 0 0;min-width:0;text-align:left;white-space:normal}
 html body .jk-guide-intro{flex:1;min-width:0;margin:0!important;color:#3f5038;font-size:13px;line-height:1.55!important;overflow-wrap:anywhere}
 html body .jk-guide-cover{display:block;flex:0 0 76px;width:76px!important;height:64px!important;max-width:76px!important;object-fit:cover;border:1px solid #dac9ae;border-radius:6px;box-sizing:border-box;user-select:none;-webkit-user-drag:none}
 html body .jk-guide-missing{display:flex;align-items:center;justify-content:center;flex:0 0 76px;width:76px;height:64px;border:1px dashed #c8b898;border-radius:6px;color:#84735a;font-size:11px;line-height:1.4;background:#f5efdf}
 html body .entries .jk-guide-body{margin:4px 0 0;gap:0}
 html body .entries .jk-guide-intro{font-size:12px;line-height:1.5!important}
 html body .jk-guide-detail{margin:8px 0;padding:8px 0;border-top:1px solid #ded0b9;border-bottom:1px solid #ded0b9;color:#3f5038}
 html body .jk-guide-detail p{margin:3px 0;line-height:1.55}
 html body .jk-guide-detail a{display:inline-block;margin:3px 10px 0 0;color:#855219;text-underline-offset:3px;font-size:12px}
 html body .jk-guide-detail small{display:block;color:#75664f;line-height:1.5}
 `;document.head.append(style);
 const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 let guides=null,extras=null,activeDetailId='';
 function introduction(id){const group=id.startsWith('m-')?'mountains':'islands',value=extras?.[group]?.[id.slice(2)]?.introduction;return typeof value==='string'?value:guides?.items[id]?.summary||'';}
 const root=document.querySelector(map?'#entries':mountain?'#cards':'#island-cards');if(!root)return;
 const mapData=map?JSON.parse(document.getElementById('data').textContent):[];
 const records=mountain?JSON.parse(document.getElementById('mountain-data').textContent):island?(()=>{const s=[...document.querySelectorAll('script:not([src])')].find(s=>s.textContent.includes('const records='));return JSON.parse(s.textContent.match(/const records=(\[[\s\S]*?\]);/)[1]);})():[];
 function guideId(card){
  if(!map)return (mountain?'m-':'i-')+card.dataset.no;
  const d=mapData[Number(card.dataset.index)];if(!d)return '';
  if(page==='yeongnam-alps-map.html')return Object.keys(guides.items).find(id=>id.startsWith('m-')&&guides.items[id].name.replace(/\(.+?\)/g,'').trim()===d.name)||'';
  return(page==='islands-map.html'?'i-':'m-')+d.no;
 }
 function count(card,id){if(!extras||map)return;const rec=records.find(r=>String(r.no)===id.slice(2));if(!rec)return;const x=extras[mountain?'mountains':'islands']?.[rec.no]||{},hidden=x.hiddenVisitDates||[];const dates=new Set((mountain?(rec.visits||[]).map(v=>v.date):[rec.visit]).concat(x.hikeDate||[]).filter(d=>d&&!hidden.includes(d)));const seasons=[...new Set([...dates].map(d=>{const m=Number(d.slice(5,7));return m>=3&&m<=5?'봄':m>=6&&m<=8?'여름':m>=9&&m<=11?'가을':'겨울';}))].join('·');if(card.dataset.visitSeasons!==seasons)card.dataset.visitSeasons=seasons;const span=card.querySelector('[data-hike-count]');if(span){const text='산행기록 '+dates.size+'회';if(span.textContent!==text)span.textContent=text;}}
 function enrich(){
  if(!guides)return;
  for(const card of root.querySelectorAll(map?':scope>.entry':mountain?':scope>.card':':scope>.ux-island-card')){
   const id=guideId(card),g=guides.items[id];if(!g)continue;card.dataset.guideId=id;count(card,id);
   if(map){card.querySelector('.jk-guide-body')?.remove();continue;}
   const existing=card.querySelector('.jk-guide-body');if(existing){const intro=existing.querySelector('.jk-guide-intro');if(intro&&intro.textContent!==introduction(id))intro.textContent=introduction(id);continue;}
   const body=make('span',null,'jk-guide-body');body.append(make('span',introduction(id),'jk-guide-intro'));
   if(!map){if(g.cover){const img=make('img',null,'jk-guide-cover jk-photo-protected');img.src=new URL(g.cover.src,base).href;img.alt=g.cover.alt;img.title=g.name+' · '+(g.cover.date||'촬영일 미등록');img.loading='lazy';img.decoding='async';img.width=76;img.height=64;img.draggable=false;img.addEventListener('error',()=>img.replaceWith(make('span','사진 준비 중','jk-guide-missing')),{once:true});body.append(img);}else body.append(make('span','사진 준비 중','jk-guide-missing'));}
   const destination=map?(card.querySelector('.map-row-copy')||card.querySelector(':scope>span')):card;destination.append(body);
  }
 }
 function detail(id){
  const g=guides?.items[id];if(!g)return;const panel=document.querySelector(mountain?'#details':'#detail');if(!panel)return;
  activeDetailId=id;panel.querySelector('.jk-guide-detail')?.remove();const section=make('section',null,'jk-guide-detail');section.setAttribute('aria-label',g.name+' 소개와 볼거리');const summary=introduction(id);if(summary)section.append(make('p',summary));
  if(g.recommendedVisit){const r=g.recommendedVisit;section.append(make('p','방문하기 좋은 계절 · '+r.seasons.join('·')+' — '+r.reason));section.append(make('small',r.basis));}
  if(g.highlights.length)section.append(make('p','추천 볼거리 · '+g.highlights.map(h=>[h.season,h.feature].filter(Boolean).join(' ')).join(' / ')));
  if(g.photoThemes.length)section.append(make('p','사진 속 풍경 · '+g.photoThemes.join('·')));
  const keys=[...new Set([...g.sources,...g.highlights.map(h=>h.source).filter(Boolean),...(g.recommendedVisit?.sourceKeys||[])])];
  for(const key of keys){const source=guides.sources[key];if(!source)continue;const a=make('a',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';section.append(a);}
  if(g.highlights.length)section.append(make('small','개화·적설과 행사 일정은 해마다 달라집니다.'));
  const anchor=panel.querySelector(mountain?'#dialogSubtitle':'#detail-title');anchor?.after(section);
 }
 // The map remains selected in place; this explicit action opens that exact place's saved record.
 if(map){
  const link=document.getElementById('map-record-link')||document.getElementById('alps-record-link');
  root.addEventListener('click',e=>{const card=e.target.closest('.entry');if(!card||!link)return;const d=mapData[Number(card.dataset.index)];if(!d)return;const url=page==='yeongnam-alps-map.html'?d.recordUrl:(page==='islands-map.html'?'islands.html?island=':'mountains.html?mountain=')+encodeURIComponent(d.no);if(url){link.href=url;link.textContent=d.name+' 산행 기록 보기 →';}});
 }else root.addEventListener('click',e=>{const card=e.target.closest(mountain?'.card':'.ux-island-card');if(card)detail((mountain?'m-':'i-')+card.dataset.no);});
 let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enrich();});};new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
 window.addEventListener('jk-hike-details-updated',e=>{extras=e.detail;enrich();if(activeDetailId)detail(activeDetailId);});
 Promise.all([fetch(new URL('destination-guides.json?v=20261120-supplement1',base)).then(r=>{if(!r.ok)throw Error('소개 자료 연결 실패');return r.json();}),fetch(new URL('hike-details.json',base),{cache:'no-cache'}).then(r=>r.ok?r.json():null).catch(()=>null)]).then(([g,x])=>{guides=g;window.JKDestinationGuides=g;extras=x;enrich();const p=new URLSearchParams(location.search),id=mountain?'m-'+p.get('mountain'):island?'i-'+p.get('island'):'';if(guides.items[id])detail(id);window.dispatchEvent(new CustomEvent('jk-destination-guides-ready',{detail:g}));}).catch(e=>console.warn(e.message));
})();
