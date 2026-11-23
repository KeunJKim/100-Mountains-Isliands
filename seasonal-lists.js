/* 표시 전용 계절·특징 찾기. 인증일·산행일·본문·GPS 원본은 변경하지 않습니다. */
(() => {
 'use strict';
 if(document.getElementById('jk-season-style'))return;
 const page=location.pathname.split('/').pop();
 const configs={
  'mountains.html':['#cards',':scope>.card','mountain'],
  'islands.html':['#island-cards',':scope>.ux-island-card','island'],
  'mountains-map.html':['#entries',':scope>.entry','mountain'],
  'islands-map.html':['#entries',':scope>.entry','island'],
  'yeongnam-alps-map.html':['#entries',':scope>.entry','mountain'],
  'yeongnam-alps.html':['#alps-records',':scope>.record','mountain'],
  'other-hikes.html':['#list',':scope>.other-record-item,:scope>.card','mountain'],
  'overseas-trekking.html':['#overseas-list',':scope>.trek-card','overseas'],
  'blog.html':['#cards',':scope>.card','story'],
  'records-to-complete.html':['#record-rows',':scope>tr','record']
 };
 const config=configs[page];if(!config)return;
 const root=document.querySelector(config[0]);if(!root)return;
 const style=document.createElement('style');style.id='jk-season-style';style.textContent=`
 html body .jk-season-tools{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0;padding:7px 8px;border:1px solid #c9b693;border-radius:8px;background:#fffaf0;color:#34472e;box-sizing:border-box}
 html body .jk-season-tools label{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:5px;font:600 12px/1.5 'Malgun Gothic',sans-serif;margin:0;min-width:0;flex:1 1 200px;white-space:nowrap}
 html body .jk-season-tools select,html body .jk-season-tools input{width:100%;min-width:0;min-height:28px;height:auto;padding:4px 6px;border:1px solid #baa47e;border-radius:6px;background:#fffefb;color:#35452e;font:12px/1.5 'Malgun Gothic',sans-serif;box-sizing:border-box}
 html body .jk-season-tools .jk-season-select-label{flex:0 1 150px}
 html body .jk-season-tools output{flex:1 0 100%;font:11px/1.4 'Malgun Gothic',sans-serif;color:#65543e}
 html body .jk-season-note{margin:3px 0 7px;font:11px/1.5 'Malgun Gothic',sans-serif;color:#76674f}
 html body .jk-season-tags{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 0;white-space:normal;line-height:1.5}
 html body .jk-season-tag{display:inline-block;max-width:100%;padding:2px 6px;border:1px solid #bfceb0;border-radius:5px;background:#eff4e8;color:#365331;font:600 12px/1.4 'Malgun Gothic',sans-serif;white-space:normal;overflow-wrap:anywhere}
 html body .jk-season-tag[data-kind=visit]{background:#f6eee1;border-color:#d6c4a6;color:#71502b}
 html body .entries .jk-season-tags{gap:3px;margin-top:4px}
 html body .entries .jk-season-tag{padding:1px 4px;font-size:11px}
 html body .entries .entry strong{white-space:normal!important;flex-wrap:wrap!important;row-gap:2px!important}
 html body .entries .entry em{white-space:nowrap;flex:none}
 html body .jk-season-filtered{display:none!important}
 html body .jk-season-no-results{padding:12px;border:1px dashed #baa47e;border-radius:7px;color:#6a5130;background:#fffaf0;font-size:13px}
 html body .jk-season-no-results[hidden]{display:none!important}
 @media(max-width:600px){html body .jk-season-tools label{flex-basis:100%}html body .jk-season-tools .jk-season-select-label{flex:1 1 100%}}
 `;document.head.append(style);
 // Primary tourism sources support these destination highlights. No annual event date is inferred.
 const sources={
  azalea:'https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=188397',
  royal:'https://mpva.go.kr/scnc/contents.do?key=805',
  goryeo:'https://www.ganghwa.go.kr/tour/travel/trspt/azalea.jsp',
  snow:'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=f3ac0c1f-a375-460e-ac3d-303f50216d81',
  deogyu:'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=a4f278b0-0b16-4cf8-a6e3-ddc795c4d0f5',
  maple:'https://www.forest.go.kr/kfsweb/kfi/kfs/foreston/main/contents/ClbngManage/selectMntnInfoDetail.do?mn=AR02_02_05_01&mntnId=20000112&orgId=fon',
  reeds:'https://www.ulsan.go.kr/tour/korean/contents.ulsan?mId=001002001002008000',
  concert:'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=7f7c6a8a-4946-4487-8b76-d524fba80fb8'
 };
 const highlights=[
  [/황매산/,'봄','철쭉철',sources.royal],
  [/비슬산/,'봄','진달래·참꽃철',sources.azalea],
  [/고려산/,'봄','진달래철',sources.goryeo],
  [/태백산/,'겨울','눈꽃·설경',sources.snow],
  [/덕유산/,'겨울','눈꽃·상고대',sources.deogyu],
  [/내장산/,'가을','단풍철',sources.maple],
  [/간월산|간월재|신불산|영축산|재약산|고헌산/,'가을','억새철',sources.reeds],
  [/천황산/,'가을','단풍길',sources.reeds],
  [/간월산|간월재/,'가을','울주 오디세이',sources.concert]
 ];
 const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const tools=make('section',null,'jk-season-tools');tools.setAttribute('aria-label','계절과 특징으로 목록 찾기');
 const label=make('label','계절'),select=make('select');label.className='jk-season-select-label';select.setAttribute('aria-label','방문 계절 또는 볼거리 계절');
 for(const s of ['전체 계절','봄','여름','가을','겨울','날짜 미등록']){const o=make('option',s);o.value=s==='전체 계절'?'':s;select.append(o);}label.append(select);
 const primarySearch=document.querySelector('#search,#alps-search,#record-search');
 const searchLabel=make('label','특징'),search=primarySearch||make('input');
 if(primarySearch){search.placeholder='이름·지역·날짜·특징 검색 (예: 철쭉, 억새, 동백)';search.setAttribute('aria-label','이름·지역·날짜·특징 검색');}
 else{search.type='search';search.placeholder='예: 철쭉, 진달래, 단풍, 눈, 억새, 바다';search.setAttribute('aria-label','계절·특징 검색');searchLabel.append(search);}
 const status=make('output');status.setAttribute('aria-live','polite');tools.append(label,...(primarySearch?[]:[searchLabel]),status);
 const destinationPage=['mountains.html','islands.html','mountains-map.html','islands-map.html','yeongnam-alps-map.html'].includes(page);
 const note=make('p',(primarySearch?'위 검색창에서 이름과 특징을 함께 찾고 지역·계절로 좁힐 수 있습니다. ':'')+(destinationPage?'추천 계절은 개인 방문일과 무관합니다. 장소별 관광 안내를 우선하고, 개별 자료가 없는 곳은 봄·가을 걷기를 추천합니다. 개화·적설·행사 일정·운항·통제는 방문 전 확인하세요.':'방문 계절은 기록 날짜 기준입니다. 볼거리 계절은 별도 안내이며, 개화·적설·행사 일정은 매년 달라집니다.'),'jk-season-note');
 const map=root.id==='entries',table=root.tagName==='TBODY';
 const anchor=map?root.closest('.panel').querySelector('.filters'):table?root.closest('.table-wrap'):root;
 if(map)anchor.after(tools,note);else anchor.before(tools,note);
 const noResults=make('p','계절·특징 조건에 맞는 항목이 없습니다. 전체 계절로 바꾸거나 검색어를 지워주세요.','jk-season-no-results');noResults.hidden=true;
 (table?root.closest('.table-wrap'):root).after(noResults);
 let memo=new WeakMap();
 function describe(card){
  const old=card.querySelector('.jk-season-tags');
  // Exclude our display tags when deriving the original record text.
  const source=card.cloneNode(true);source.querySelectorAll('.jk-season-tags,.jk-guide-body').forEach(n=>n.remove());const content=source.textContent||'';
  const guide=window.JKDestinationGuides?.items[card.dataset.guideId];if(memo.get(card)?.content===content&&memo.get(card)?.guide===guide)return memo.get(card);
  const title=table?source.children[2]?.textContent:source.querySelector('.map-row-name,h2,h3,strong')?.textContent||content;
  const dates=[...content.matchAll(/(?<!\d)(20\d{2})[-.](\d{2})[-.](\d{2})(?!\d)/g)];
  let seasons=[...new Set(dates.filter(m=>+m[2]>=1&&+m[2]<=12&&+m[3]>=1&&+m[3]<=31).map(m=>{const month=+m[2];return month>=3&&month<=5?'봄':month>=6&&month<=8?'여름':month>=9&&month<=11?'가을':'겨울';}))];
  if(card.dataset.visitSeasons)seasons=card.dataset.visitSeasons.split('·').filter(Boolean);
  const recommendation=destinationPage?guide?.recommendedVisit:null;
  const searchInfo=window.JKDestinationSearch?.info({name:title,albumId:card.dataset.guideId},config[2]);
  if(recommendation)seasons=[...new Set([...recommendation.seasons,...(searchInfo?.seasons||[])])];
  const tags=[recommendation?{text:'추천 '+seasons.join('·'),kind:'recommendation',url:window.JKDestinationGuides.sources[recommendation.sourceKeys[0]]?.url,reason:recommendation.basis+' · '+recommendation.reason}:{text:seasons.length?'방문 '+seasons.join('·'):'방문 계절 미등록',kind:'visit'}];
  const matched=searchInfo?.highlights.length?searchInfo.highlights.map(h=>[null,h.season,h.feature,h.url]):guide?.highlights.length?guide.highlights.map(h=>[null,h.season,h.feature,window.JKDestinationGuides.sources[h.source]?.url]):highlights.filter(([re])=>re.test(title));
  if(guide?.photoThemes.length)tags.push({text:'풍경 · '+guide.photoThemes.join('·'),kind:'category'});
  for(const [,season,feature,url]of matched)tags.push({text:(season?season+' · ':'')+feature,kind:'highlight',url});
  if(config[2]==='island')for(const [re,feature]of [[/대마도/,'선착장 표지석'],[/안마도/,'선착장 표지석'],[/상조도/,'도리산 전망대'],[/백령도/,'최북단 백령도비'],[/독도/,'해상 인증 기록']])if(re.test(title))tags.push({text:'인증지 · '+feature,kind:'record'});
  // Features in the user's own record are tagged as recorded content, not as a forecast.
  for(const [re,feature]of [[/철쭉/,'철쭉'],[/진달래|참꽃/,'진달래'],[/단풍/,'단풍'],[/눈꽃|설경|설산|상고대/,'눈꽃·설경'],[/억새/,'억새'],[/음악회|오디세이/,'산중음악회']]){
   if(re.test(content)&&!tags.some(t=>re.test(t.text)))tags.push({text:'기록 · '+feature,kind:'record'});
  }
  if(tags.length===1)tags.push({text:config[2]==='island'?'섬·바다 풍경':config[2]==='overseas'?'해외 여정':config[2]==='story'?'산행 이야기':config[2]==='record'?'자료 보충':'산행 기록',kind:'category'});
  old?.remove();const box=make('span',null,'jk-season-tags');
  for(const tag of tags){const chip=make('span',tag.text,'jk-season-tag');chip.dataset.kind=tag.kind;if(tag.url)chip.title=(tag.reason||'볼거리 참고')+' · '+tag.url;box.append(chip);}
  const destination=table?card.children[2]:card.querySelector('.map-row-copy')||(map?card.querySelector(':scope>span'):null)||card.querySelector(':scope>.card')||card;destination?.append(box);
  // Read stable text again because the destination may be nested inside the card.
  const info={content,title,seasons,guide,highlights:matched.map(x=>x[1]).filter(Boolean),text:[title,guide?.summary||'',searchInfo?.text||'',...tags.map(t=>t.text),content].join(' ').toLocaleLowerCase('ko')};memo.set(card,info);return info;
 }
 let queued=false;
 function apply(){
  const cards=[...root.querySelectorAll(config[1])];let available=0,visible=0;const q=search.value.trim().toLocaleLowerCase('ko');
  const normalize=window.JKDestinationSearch?.normalize||(s=>s.toLocaleLowerCase('ko'));
  for(const card of cards){const info=describe(card),season=select.value;const yes=(!q||normalize(q).split(/\s+/).every(word=>normalize(info.text).includes(word)))&&(!season||(season==='날짜 미등록'?!info.seasons.length:[...info.seasons,...info.highlights].includes(season)));
   card.classList.toggle('jk-season-filtered',!yes);if(!card.hidden&&card.style.display!=='none'){available++;if(yes)visible++;}
  }
  const text='계절·특징 결과 '+visible+' / '+available+'개';if(status.textContent!==text)status.textContent=text;
  noResults.hidden=!cards.length||visible>0||(!q&&!select.value);
 }
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});};
 new MutationObserver(schedule).observe(root,{subtree:true,childList:true});
 // Existing name/region/category searches continue to own their own visibility state.
 window.addEventListener('jk-destination-guides-ready',()=>{memo=new WeakMap();schedule();});window.addEventListener('jk-destination-search-ready',()=>{memo=new WeakMap();schedule();});document.addEventListener('input',schedule);document.addEventListener('change',schedule);document.addEventListener('click',schedule);apply();
})();
