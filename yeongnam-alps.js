(() => {'use strict';
const names=['전체','가지산','운문산','천황산','재약산','간월산','신불산','영축산','고헌산','문복산','연계 산행'];
const list=document.getElementById('alps-records'),search=document.getElementById('alps-search'),sort=document.getElementById('alps-sort'),count=document.getElementById('alps-count'),filters=document.getElementById('summit-filters');let selected='전체',records=[],summitCovers={};
const coverStyle=document.createElement('style');coverStyle.textContent='.jk-alps-cover-row{display:flex;align-items:center;gap:9px;margin:5px 0;min-width:0}.jk-alps-cover-row .jk-alps-intro{flex:1;min-width:0;margin:0!important}.jk-alps-summit-cover{display:block;flex:0 0 76px;width:76px!important;height:64px!important;max-width:76px!important;object-fit:contain;background:#f5efdf;border:1px solid #dac9ae;border-radius:6px;box-sizing:border-box}';document.head.append(coverStyle);
const el=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e;};
// 산 소개는 실제 방문일의 날씨·완등 여부를 뜻하지 않습니다.
// 참고: 울산관광 영남알프스 소개·하늘억새길, 한국민족문화대백과사전 천황산.
// https://www.ulsan.go.kr/tour/korean/contents.ulsan?mId=001002001002008000
// https://encykorea.aks.ac.kr/Article/E0056095
const introductions={
 '가지산':'영남알프스의 큰 산줄기를 이루는 가지산, 정상과 능선의 풍경을 담은 산행입니다.',
 '운문산':'영남알프스의 한 봉우리 운문산에서 남긴 산길과 정상 풍경의 기록입니다.',
 '천황산':'사자평과 주변 산줄기를 품은 천황산, 고원 풍경을 만나는 산행입니다.',
 '재약산':'사자평 억새로 이름난 재약산에서 넓게 펼쳐지는 고원의 매력을 만납니다.',
 '간월산':'간월재의 억새와 이어지는 산줄기가 매력적인 영남알프스의 봉우리입니다.',
 '신불산':'너른 억새밭과 영축산으로 이어지는 능선이 인상적인 산입니다.',
 '영축산':'신불산으로 이어지는 억새 능선에서 영남알프스의 탁 트인 풍경을 만납니다.',
 '고헌산':'정상 부근의 억새와 주변 산줄기를 조망하는 즐거움이 있는 산입니다.',
 '문복산':'청도와 경주 사이의 산줄기에서 주변 봉우리를 바라보는 산입니다.',
 '간월산·신불산':'간월재의 억새와 두 산의 능선 풍경을 함께 담은 간월산·신불산 연계 산행입니다.',
 '가지산·운문산':'가지산과 운문산의 산줄기를 함께 담은 영남알프스 연계 산행 기록입니다.',
 '천황산·재약산':'천황산과 재약산 사이의 산줄기와 사자평 억새가 매력적인 연계 산행입니다.',
 '간월산·신불산·영축산':'간월재에서 신불산·영축산으로 이어지는 억새 능선의 매력을 담은 연계 산행입니다.',
 '신불산·영축산':'신불산과 영축산 사이에 펼쳐지는 넓은 억새 능선이 인상적인 연계 산행입니다.'
};
function introFor(r){const key=(r.summits||[]).join('·');if(introductions[key])return introductions[key];if(r.title.includes('입석대'))return '능동산과 입석대 일대에서 남긴 산길과 풍경의 기록을 모았습니다.';if(r.title.includes('능동산'))return '능동산에서 남긴 산행 사진과 걸음의 기억을 모았습니다.';if(r.title.includes('배내봉'))return '배내봉에서 남긴 능선 풍경과 산행의 기억을 모았습니다.';return '영남알프스의 산길에서 직접 남긴 풍경과 산행 기록을 모았습니다.';}
// 정상 고도: alps-summit-elevations.json의 출처 기준이며 GPS 최고 고도와 구분합니다.
const summitElevations={"가지산":1241,"운문산":1188,"천황산":1189,"재약산":1108,"간월산":1069,"신불산":1159,"영축산":1081,"고헌산":1034,"문복산":1015,"능동산":983,"배내봉":966};
function elevationFor(r){const names=[...new Set([...(r.summits||[]),...Object.keys(summitElevations).filter(name=>r.title.includes(name))])].filter(name=>summitElevations[name]);return names.map(name=>(names.length>1?name+' ':'')+summitElevations[name].toLocaleString('ko-KR')+'m').join(' · ');}
function render(){for(const b of filters.children)b.setAttribute('aria-pressed',String(b.textContent===selected));const q=search.value.trim();let shown=records.filter(r=>(selected==='전체'||selected==='연계 산행'&&!r.summits.length||r.summits.includes(selected))&&(!q||(window.JKDestinationSearch?window.JKDestinationSearch.matches(r,q,'alps'):(r.title+' '+r.date).includes(q))));shown.sort((a,b)=>(sort.value==='old'?1:-1)*a.date.localeCompare(b.date));list.replaceChildren();for(const r of shown){const card=el('article');card.className='record';card.append(el('small',r.date+(r.kind==='photo'?' · 사진 기록':'')),el('h3',r.title),el('p',r.region.replace('대한민국 ','')));const elevationText=elevationFor(r);if(elevationText){const elevation=el('span','정상 '+elevationText);elevation.className='jk-alps-elevation';elevation.title='정상 고도 · 관광 안내 기준, GPS 최고 고도와 구분';card.querySelector('h3').append(elevation);}const intro=el('p',introFor(r));intro.className='jk-alps-intro';intro.setAttribute('aria-label','산 소개');const cover=summitCovers[r.id];if(cover){const body=el('div'),img=el('img');body.className='jk-alps-cover-row';img.className='jk-alps-summit-cover jk-photo-protected';img.src=cover.src;img.alt=cover.alt;img.title='장소 대표 사진 · '+(cover.date||'촬영일 미등록');img.loading='lazy';img.width=76;img.height=64;img.draggable=false;img.onerror=()=>img.remove();body.append(intro,img);card.append(body);}else card.append(intro);const detail=el('a',r.kind==='photo'?'사진·기록 보기':'산행 지도·기록');detail.className='btn';detail.href=r.url;const source=el('a','램블러 원본 ↗');source.className='btn';source.href=r.source;source.target='_blank';source.rel='noopener';card.append(detail);if(r.source)card.append(source);else card.append(el('p','사진 기록 · GPS 원본 미보충'));list.append(card);}count.textContent=shown.length+'건 / 전체 '+records.length+'건';document.getElementById('alps-empty').hidden=shown.length>0;}
for(const name of names){const b=el('button',name);b.type='button';b.addEventListener('click',()=>{selected=name;render();});filters.append(b);}search.addEventListener('input',render);sort.addEventListener('change',render);
Promise.all([fetch('yeongnam-alps.json?v=20261112').then(r=>{if(!r.ok)throw Error();return r.json();}),fetch('summit-covers.json?v=20261124').then(r=>r.ok?r.json():{}).catch(()=>({}))]).then(([data,covers])=>{records=data;summitCovers=covers.alps||{};render();}).catch(()=>{count.textContent='기록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';});
})();
