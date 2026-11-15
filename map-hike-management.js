/* 지도에서 선택한 명산·섬에 공통 산행 편집기를 연결합니다. */
(() => {
 'use strict';
 const kind=document.body.dataset.hikeMapKind;
 if(!['mountains','islands'].includes(kind))return;
 const button=document.getElementById('map-manage-hike'),host=document.getElementById('map-hike-editor');
 if(!button||!host)return;
 let selected=null,recordsPromise=null,pending=false,revision=0;
 const entries=JSON.parse(document.getElementById('data').textContent);
 async function records(){
  if(!recordsPromise)recordsPromise=fetch(kind+'.html',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('산행 목록을 불러오지 못했습니다.');return r.text();}).then(html=>{
   const doc=new DOMParser().parseFromString(html,'text/html');
   if(kind==='mountains')return JSON.parse(doc.getElementById('mountain-data').textContent);
   const script=[...doc.querySelectorAll('script:not([src])')].find(s=>s.textContent.includes('const records='));
   const match=script?.textContent.match(/const records=(\[[\s\S]*?\]);/);
   if(!match)throw Error('섬 산행 목록 형식을 확인할 수 없습니다.');
   return JSON.parse(match[1]);
  }).catch(e=>{recordsPromise=null;throw e;});
  return recordsPromise;
 }
 function selection(index){selected=entries[index];revision++;pending=false;button.disabled=!selected;button.textContent=selected?selected.name+' 산행 정보 추가·수정·삭제':'장소 선택 후 산행 정보 추가·수정·삭제';host.replaceChildren();host.hidden=true;}
 for(const row of document.querySelectorAll('.entry'))row.addEventListener('click',()=>selection(Number(row.dataset.index)));
 async function open(){
  if(!selected)return;
  if(!window.JKOwnerSession?.getToken()){pending=true;window.JKOwnerSession?.open();return;}
  pending=false;const current=revision;button.disabled=true;host.hidden=false;host.textContent='선택한 장소의 산행 정보를 불러오는 중입니다…';
  try{const list=await records();if(current!==revision)return;const rec=list.find(r=>Number(r.no)===Number(selected.no));if(!rec)throw Error('선택한 장소의 원본 기록을 찾을 수 없습니다.');host.replaceChildren();window.HikeRecords.show(kind,rec,host);}
  catch(e){if(current===revision)host.textContent=e.message;}
  finally{if(current===revision)button.disabled=false;}
 }
 button.addEventListener('click',open);
 window.addEventListener('jk-owner-connected',()=>{if(pending)open();});
})();
