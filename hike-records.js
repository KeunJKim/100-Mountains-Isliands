/* 100개의 산과 100개의 섬 — 원본 인증 기록을 보존하는 보충 산행 기록 편집기 */
(() => {
'use strict';
const OWNER='KeunJKim', REPO='100-Mountains-Isliands', FILE='hike-details.json';
const API=`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`;
const BLANK=()=>({version:1,mountains:{},islands:{}});
let publicData=BLANK();
let sessionToken=''; // 보안: 페이지 메모리에만 유지, 로컬 저장·쿠키·서버 기록 금지
const fields=[
 ['hikeDate','산행일','date','선택한 산·섬을 방문한 날'],
 ['route','산행 코스','text','예: 주차장 → 능선 → 정상 → 원점회귀'],
 ['distanceKm','산행거리 (km)','number','예: 8.7'],
 ['duration','산행시간','text','예: 4시간 20분'],
 ['summitElevationM','정상 고도 (m)','number','예: 1240'],
 ['elevationGainM','누적 상승 고도 (m)','number','예: 650'],
 ['start','출발지·들머리','text','예: 제2주차장 / 선착장'],
 ['parking','주차장·교통편','text','예: 주차장 또는 여객선 이용'],
 ['difficulty','난이도','select','쉬움 / 보통 / 어려움'],
 ['weather','날씨·계절','text','예: 맑음, 겨울'],
 ['notes','산행 메모·후기','textarea','현장에서 느낀 점, 주의사항'],
 ['blogUrl','연결할 산행기 주소','url','https://로 시작하는 산행 글 주소']
];
const validNumber=(n)=>Number.isFinite(n)&&n>=0&&n<=15000;
const el=(tag,txt,cls)=>{const d=document.createElement(tag);if(txt!==undefined&&txt!==null)d.textContent=String(txt);if(cls)d.className=cls;return d};
function baseline(kind,rec){
 const m=kind==='mountains', v=m?(rec.visits||[])[0]||{}:rec;
 return {
  hikeDate:m?(v.date||''):(rec.visit||''),
  route:m?(v.route||''):(rec.route||''),
  distanceKm:m?(v.distanceKm??''):(rec.distance||''),
  duration:m?(v.duration||''):(rec.duration||''),
  summitElevationM:m?(rec.height??''):'',
  elevationGainM:'',start:m?(v.start||''):'',
  parking:m?(v.parking||''):'',difficulty:'',weather:'',
  notes:m?(v.notes||''):(rec.memo||''),
  blogUrl:m?(v.blogUrl||''):(rec.blog||'')
 };
}
const keyOf=rec=>String(rec.no); // 다른 분류는 별도 네임스페이스
function infoOf(kind,rec){const group=kind==='mountains'?'mountains':'islands';return {...baseline(kind,rec),...(publicData[group]?.[keyOf(rec)]||{})};}
async function loadPublic(){
 try{const resp=await fetch(FILE+'?v='+Date.now(),{cache:'no-store'});
  if(!resp.ok)throw Error('산행 기록 파일을 불러올 수 없습니다.');
  const doc=await resp.json();if(!doc||!doc.mountains||!doc.islands)throw Error('기록 형식에 문제가 있습니다.');
  publicData=doc;
 }catch(e){console.warn('보충 산행 기록 불러오기:',e.message)}
}
const ready=loadPublic();
function addRow(list,label,value){
 if(value===null||value===undefined||value==='')return;
 if(typeof value==='string'&&value.trim()==='')return;
 const dt=el('dt',label);const dd=el('dd');
 if(label==='연결한 산행기'&&/^https:\/\//i.test(String(value))){
  const a=el('a','산행기 열기 ↗');a.href=value;a.target='_blank';a.rel='noopener noreferrer';a.style.color='#ffe0a4';dd.append(a);
 }else{dd.textContent=String(value)}list.append(dt,dd);
}
function readable(n,key){if(n===''||n===null||n===undefined)return '';
 if(key==='distanceKm')return n+' km';
 if(key==='summitElevationM'||key==='elevationGainM')return n+' m';
 return String(n);
}
function renderSummary(box,kind,rec){
 const values=infoOf(kind,rec),dl=el('dl',null,'ux-info');
 const rows=[['hikeDate','산행일'],['route','산행 코스'],['distanceKm','산행거리'],['duration','산행시간'],['summitElevationM','정상 고도'],['elevationGainM','누적 상승 고도'],['start','들머리'],['parking','주차·교통'],['difficulty','난이도'],['weather','날씨·계절'],['notes','산행 메모'],['blogUrl','연결한 산행기']];
 rows.forEach(([k,n])=>addRow(dl,n,readable(values[k],k)));
 const heading=el('h3','나의 상세 산행 정보');
 const note=el('p','기존 BAC 인증일과 인증지 정보는 그대로 보존합니다. 아래 정보만 따로 추가·수정합니다.');
 const b=el('button','이 산행 정보 추가·수정','ux-edit-btn');b.type='button';b.onclick=()=>renderForm(box,kind,rec);
 const photos=el('a','사진 갤러리에서 사진 보기·관리 →','ux-edit-btn');photos.href='gallery.html';photos.style.textDecoration='none';
 const actions=el('div',null,'ux-actions');actions.append(b,photos);
 box.replaceChildren(heading,note,dl.childElementCount?dl:el('p','입력된 상세 산행 정보가 없습니다. 정보를 추가해 주세요.','ux-empty'),actions);
}
function fieldNode(field,value){
 const [key,label,type,hint]=field,container=el('label',label,(type==='textarea'||key==='route')?'ux-full':'');
 let input;
 if(type==='textarea'){input=el('textarea');input.rows=4;}
 else if(type==='select'){
  input=el('select');[['','선택 안 함'],['쉬움','쉬움'],['보통','보통'],['어려움','어려움']].forEach(([val,name])=>{const o=el('option',name);o.value=val;input.append(o)});
 } else {input=el('input');input.type=type;if(type==='number'){input.min='0';input.max='15000';input.step='any'} }
 input.name=key;input.setAttribute('aria-label',label);if(hint&&type!=='date'&&type!=='select')input.placeholder=hint;
 input.value=value===null||value===undefined?'':String(value);
 container.append(input);return container;
}
function status(box,msg,error=false){box.textContent=msg;box.style.color=error?'#ffc7c7':'#ffe0a4'}
function apiError(response,obj){return `GitHub 요청 실패 (${response.status}): ${obj?.message||'계정·권한·연결을 확인하세요.'}`}
function b64ToText(b64){const bytes=Uint8Array.from(atob(b64.replace(/\s/g,'')),c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
function textToB64(txt){const u=new TextEncoder().encode(txt);let binary='';for(let i=0;i<u.length;i+=32768)binary+=String.fromCharCode(...u.subarray(i,i+32768));return btoa(binary)}
async function saveToGitHub(kind,rec,changes,token){
 const headers={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Authorization':'Bearer '+token};
 const user=await fetch('https://api.github.com/user',{headers});const who=await user.json().catch(()=>({}));
 if(!user.ok)throw Error(apiError(user,who));
 if(String(who.login||'').toLowerCase()!==OWNER.toLowerCase())throw Error('저장소 소유자 KeunJKim 계정의 GitHub 토큰이 아닙니다.');
 const get=await fetch(API+'?ref=main',{headers,cache:'no-store'});const raw=await get.json().catch(()=>({}));
 if(!get.ok&&get.status!==404)throw Error(apiError(get,raw));
 const content=get.ok?JSON.parse(b64ToText(raw.content)):BLANK();
 if(!content.mountains||!content.islands)throw Error('원본 기록 구조가 올바르지 않아 저장을 중단했습니다.');
 const group=kind==='mountains'?'mountains':'islands';
 const id=keyOf(rec);content[group][id]={...(content[group][id]||{}),...changes,updatedAt:new Date().toISOString()};
 // 명산·섬 목록에 저장된 인증일 등 기존 JSON 자료는 수정하지 않습니다.
 const body={message:`Update ${group} hiking details #${id}`,content:textToB64(JSON.stringify(content,null,2)+'\n'),branch:'main'};
 if(get.ok)body.sha=raw.sha;
 const put=await fetch(API,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});
 const answer=await put.json().catch(()=>({}));if(!put.ok)throw Error(apiError(put,answer));
 publicData=content;
}
function renderForm(box,kind,rec){
 sessionToken=window.JKOwnerSession?.getToken()||sessionToken;
 const values=infoOf(kind,rec),form=el('form',null,'ux-form');form.autocomplete='off';
 form.append(el('h3',`${kind==='mountains'?rec.name:rec.island} — 산행 기록 수정`));
 form.append(el('p','산행거리, 소요시간, 코스, 고도 등을 입력합니다. 비워둔 항목은 기존 정보가 유지됩니다.'));
 const grid=el('div',null,'ux-form-grid');fields.forEach(f=>grid.append(fieldNode(f,values[f[0]])));
 const label=el('label','GitHub 개인 액세스 토큰 (관리자 전용)','ux-full');
 const tokenInput=el('input');tokenInput.type='password';tokenInput.name='token';tokenInput.autocomplete='new-password';tokenInput.placeholder=sessionToken?'현재 탭에서 연결된 토큰이 있습니다':'Fine-grained token — Contents 읽기/쓰기 권한';
 label.append(tokenInput);grid.append(label);
 form.append(grid,el('p','관리자 메뉴에서 연결한 토큰은 현재 탭에서 작업 종료까지 사용합니다. 다른 사람에게 공유하지 마세요. 사진은 ‘사진 갤러리’에서 따로 관리합니다.','ux-help'));
 const actions=el('div',null,'ux-actions'),save=el('button','GitHub에 저장','ux-save-btn'),cancel=el('button','취소','ux-cancel-btn');
 save.type='submit';cancel.type='button';cancel.onclick=()=>renderSummary(box,kind,rec);actions.append(save,cancel);
 const notice=el('div','','ux-status');notice.setAttribute('role','status');form.append(actions,notice);
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(save.disabled)return;
  const formdata=new FormData(form),changes={};
  for(const [field,,type] of fields){let v=String(formdata.get(field)||'').trim();
   if(type==='number'&&v!==''){
    const n=Number(v);if(!validNumber(n)){status(notice,'숫자 항목은 0 이상, 15000 이하로 입력해 주세요.',true);return}v=n;
   }
   if(type==='url'&&v!==''&&!/^https:\/\/[^\s]+$/i.test(v)){status(notice,'산행기 주소는 https://로 시작해야 합니다.',true);return}
   changes[field]=v;
  }
  const entered=String(formdata.get('token')||'').trim();if(entered)sessionToken=entered;
  if(!sessionToken){status(notice,'GitHub 저장용 토큰을 입력해야 합니다. 토큰 없이 공개 사이트에 저장할 수 없습니다.',true);return}
  save.disabled=true;status(notice,'GitHub에 산행 정보를 저장하는 중입니다.');
  try{await saveToGitHub(kind,rec,changes,sessionToken);renderSummary(box,kind,rec);
   const ok=el('p','저장되었습니다. GitHub Pages에 배포되면 모든 방문자에게 표시됩니다.','ux-status');box.append(ok);
  }catch(error){status(notice,`저장하지 못했습니다: ${error.message}`,true);save.disabled=false}
 });
 box.replaceChildren(form);
}
function show(kind,rec,parent){
 if(!rec||!parent)return;
 for(const n of parent.querySelectorAll('.ux-record-panel'))n.remove();
 const box=el('section','산행 정보를 불러오는 중입니다.','ux-record-panel');
 box.setAttribute('aria-label','산행 정보 추가와 수정');
 const head=parent.querySelector('.dhead');
 if(head)head.insertAdjacentElement('afterend',box);else parent.append(box);
 ready.then(()=>{if(box.isConnected)renderSummary(box,kind,rec)});
}
window.HikeRecords={show};
})();
