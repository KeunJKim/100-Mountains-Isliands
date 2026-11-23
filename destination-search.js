/* 이름·지역·계절·특징을 함께 찾는 공통 검색. 원본 산행 기록은 변경하지 않습니다. */
(() => {
 'use strict';if(window.JKDestinationSearch)return;
 const base=new URL('.',document.currentScript?.src||location.href);let guides={items:{},sources:{}},features={places:[],sources:{}};
 const plain=value=>String(value??'').normalize('NFKC').toLocaleLowerCase('ko').replace(/[·,()/&→—_-]/g,' ').replace(/\s+/g,' ').trim();
 const normalize=value=>plain(value).replace(/울주\s*오디세이|산중\s*음악회|산상\s*음악회/g,'음악회').replace(/참꽃/g,'진달래').replace(/눈꽃|설경|설산|상고대|눈(?=\s|$)/g,'겨울풍경').replace(/(철쭉|진달래|억새|단풍|동백|벚꽃|수국)(?:철|시즌)/g,'$1').replace(/\s+/g,' ').trim();
 const nameOf=r=>[r.name,r.island,r.place,r.title,...(r.summits||[])].filter(Boolean).join(' ');
 const fields=r=>[nameOf(r),r.search,r.region,r.locationLabel,r.peak,r.detail,r.date,r.visit,r.hikeDate,r.course,r.route,r.category,...(r.visits||[]).map(v=>[v.date,v.route].filter(Boolean).join(' '))].filter(Boolean).join(' ');
 const nameKey=s=>plain(String(s||'').replace(/\([^)]*\)/g,''));
 function info(record,kind){
  const r=typeof record==='string'?{name:record}:record||{},name=nameOf(r),key=r.albumId||((kind==='mountain'||kind==='island')&&r.no!=null?(kind==='island'?'i-':'m-')+r.no:'');
  const found=guides.items[key]?[guides.items[key]]:Object.values(guides.items).filter(g=>nameKey(g.name)&&nameKey(name).includes(nameKey(g.name)));
  const extra=features.places.filter(p=>p.names.some(n=>nameKey(name).includes(nameKey(n))));
  const highlights=[],seasons=new Set(),parts=[fields(r)];
  for(const g of found){parts.push(g.name,g.region,g.summary,...(g.photoThemes||[]),g.recommendedVisit?.reason||'');for(const s of g.recommendedVisit?.seasons||[])seasons.add(s);for(const h of g.highlights||[]){highlights.push({...h,url:guides.sources[h.source]?.url});if(h.season)seasons.add(h.season);}}
  for(const p of extra){parts.push(...(p.keywords||[]));for(const h of p.highlights||[]){highlights.push({...h,url:features.sources[h.source]?.url});if(h.season)seasons.add(h.season);}}
  const unique=[...new Map(highlights.map(h=>[h.season+'|'+h.feature,h])).values()];parts.push(...unique.map(h=>[h.season,h.feature].join(' ')));
  return{text:parts.join(' '),highlights:unique,seasons:[...seasons]};
 }
 const matches=(record,query,kind)=>{const q=normalize(query);return !q||q.split(' ').every(word=>normalize(info(record,kind).text).includes(word));};
 const api={normalize,info,matches,ready:null};window.JKDestinationSearch=api;
 api.ready=Promise.allSettled([fetch(new URL('destination-guides.json',base),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}),fetch(new URL('destination-search-data.json',base),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();})]).then(([g,f])=>{if(g.status==='fulfilled')guides=g.value;if(f.status==='fulfilled')features=f.value;window.dispatchEvent(new Event('jk-destination-search-ready'));document.querySelector('#search,#alps-search,#record-search')?.dispatchEvent(new Event('input',{bubbles:true}));});
})();
