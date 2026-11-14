/* 명산외산행 목록 삭제·복원: 원본 산행 및 BAC 기록은 보존합니다. */
(() => {'use strict';
const clean=data=>({schemaVersion:1,hidden:Array.isArray(data?.hidden)?data.hidden.filter(x=>x&&typeof x.key==='string'&&typeof x.title==='string'):[]});
const change=(data,item,restore)=>{const next=clean(data);next.hidden=next.hidden.filter(x=>x.key!==item.key);if(!restore)next.hidden.push(item);return next;};
if(typeof module!=='undefined'&&module.exports){module.exports={clean,change};return;}
const list=document.getElementById('list');if(!list)return;
const root=document.createElement('details');root.className='other-admin';root.setAttribute('data-nosnippet','');const summary=document.createElement('summary');summary.textContent='목록 삭제·복원 관리';root.append(summary);
const intro=document.createElement('p');intro.textContent='각 항목의 ‘목록에서 삭제’를 누르세요. 관리자 인증 후 삭제할 수 있으며, 원본 산행기·사진·BAC 인증 기록은 보관합니다.';
const label=document.createElement('label');label.textContent='GitHub 관리 토큰 (관리자 메뉴에서 연결하면 재입력 불필요)';
const input=document.createElement('input');input.type='password';input.autocomplete='off';input.id='other-admin-token';label.htmlFor=input.id;
const connect=document.createElement('button');connect.type='button';connect.textContent='관리자 인증';
const note=document.createElement('p');note.setAttribute('role','status');note.setAttribute('aria-live','polite');
const trash=document.createElement('div');trash.className='other-trash';
root.append(intro,label,input,connect,note,trash);list.before(root);
let state=clean(null),token='',busy=false,ready=false;
const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
const msg=text=>{note.textContent=text;};
const auth=()=>{root.open=true;root.scrollIntoView({behavior:'smooth',block:'center'});input.focus();msg('먼저 관리자 인증을 해 주세요. 저장소 Contents 읽기/쓰기 권한이 필요합니다.');};
const keyFor=a=>{if(a.dataset.photoRecord)return 'photo:'+a.dataset.photoRecord;const u=new URL(a.href,location.href);return u.pathname.split('/').pop()+u.search+u.hash;};
function renderTrash(){trash.replaceChildren(el('strong','삭제한 목록 '+state.hidden.length+'건'));if(!state.hidden.length)return;for(const item of state.hidden){const row=el('div');row.append(el('span',item.title));const b=el('button','목록 복원');b.type='button';b.disabled=busy;b.onclick=()=>update(item,true);row.append(b);trash.append(row);}}
function scan(){for(const a of [...list.querySelectorAll('a.card')]){let wrap=a.parentElement;if(!wrap.classList.contains('other-record-item')){wrap=el('div');wrap.className='other-record-item';a.before(wrap);wrap.append(a);const b=el('button','목록에서 삭제');b.type='button';b.className='other-delete';const title=a.querySelector('h3')?.textContent||a.textContent.trim().slice(0,100);b.setAttribute('aria-label',title+' 목록에서 삭제');b.onclick=()=>update({key:keyFor(a),title,date:a.querySelector('small')?.textContent||'',deletedAt:new Date().toISOString()},false);wrap.append(b);}wrap.hidden=state.hidden.some(x=>x.key===keyFor(a));}}
const decode=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)));
const encode=s=>{let str='';for(const c of new TextEncoder().encode(s))str+=String.fromCharCode(c);return btoa(str);};
async function api(method='GET',payload){const r=await fetch('https://api.github.com/repos/KeunJKim/100-Mountains-Isliands/contents/other-hikes-hidden.json',{method,cache:'no-store',headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28',...(payload?{'Content-Type':'application/json'}:{})},...(payload?{body:JSON.stringify(payload)}:{})});if(!r.ok)throw Error('GitHub HTTP '+r.status+(r.status===409?' · 다른 기기에서 변경됐습니다. 새로고침 후 다시 시도해 주세요.':''));return r.json();}
connect.onclick=async()=>{if(busy)return;const value=input.value.trim()||window.JKOwnerSession?.getToken()||'';input.value='';if(!value){msg('토큰을 입력하세요.');return;}busy=true;connect.disabled=true;try{const r=await fetch('https://api.github.com/user',{headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+value},cache:'no-store'});if(!r.ok)throw Error('인증 실패 HTTP '+r.status);const me=await r.json();if(String(me.login).toLowerCase()!=='keunjkim')throw Error('홈페이지 소유자 계정이 아닙니다.');token=value;const file=await api();state=clean(JSON.parse(decode(file.content)));ready=true;scan();msg('관리자 인증 완료. 각 항목에서 삭제하거나 아래에서 복원할 수 있습니다.');}catch(e){token='';msg(e.message);}finally{busy=false;connect.disabled=false;renderTrash();}};
async function update(item,restore){if(busy)return;if(!token){auth();return;}if(!confirm('‘'+item.title+'’ 항목을 '+(restore?'목록에 복원':'명산외산행 목록에서 삭제')+'하시겠습니까?'+(restore?'':'\n원본 산행기·사진·BAC 인증 기록은 보관됩니다.')))return;busy=true;scan();renderTrash();msg('저장 중입니다…');try{const file=await api();const next=change(JSON.parse(decode(file.content)),item,restore);await api('PUT',{message:(restore?'Restore':'Remove')+' other-hike list entry: '+item.title,branch:'main',sha:file.sha,content:encode(JSON.stringify(next,null,2)+'\n')});state=next;ready=true;scan();msg((restore?'복원':'삭제')+'했습니다. 다른 기기에는 GitHub Pages 배포 후 반영됩니다.');}catch(e){msg('저장하지 못했습니다: '+e.message);}finally{busy=false;renderTrash();}}
let scheduled=false;new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;scan();});}}).observe(list,{childList:true,subtree:true});
fetch('other-hikes-hidden.json?fresh='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('목록 상태 HTTP '+r.status);return r.json();}).then(data=>{state=clean(data);ready=true;scan();renderTrash();}).catch(e=>{scan();msg('삭제 목록을 읽지 못했습니다. 새로고침해 주세요. '+e.message);});
window.addEventListener('jk-owner-connected',()=>{if(window.JKOwnerSession?.getToken())connect.click();});
})();
