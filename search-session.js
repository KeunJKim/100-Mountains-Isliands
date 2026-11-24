/* 검색 상태는 현재 페이지 작업 중에만 유지합니다. 인증·편집 데이터와 앨범 선택은 보존합니다. */
(() => {
 'use strict';if(window.JKSearchSession)return;
 const idleMs=5*60*1000,fields='input[type="search"],input[id*="search"],#album-search',filters='#region,.jk-season-tools select';
 let lastActivity=Date.now(),timer=null,resetting=false;
 const inputs=()=>[...document.querySelectorAll(fields)].filter(n=>!n.matches('[type=password],[type=hidden]'));
 const selects=()=>[...document.querySelectorAll(filters)];
 const active=()=>inputs().some(n=>n.value.trim())||selects().some(n=>n.value!==''&&n.value!==n.options[0]?.value);
 function reset(){
  if(resetting)return;resetting=true;clearTimeout(timer);
  for(const n of inputs()){n.autocomplete='off';if(n.value){n.value='';n.dispatchEvent(new Event('input',{bubbles:true}));}}
  for(const n of selects()){const value=[...n.options].some(o=>o.value==='')?'':n.options[0]?.value;if(value!==undefined&&n.value!==value){n.value=value;n.dispatchEvent(new Event('change',{bubbles:true}));}}
  resetting=false;lastActivity=Date.now();
 }
 function checkIdle(){
  clearTimeout(timer);if(!active())return;
  const left=idleMs-(Date.now()-lastActivity);
  if(left>0){timer=setTimeout(checkIdle,left);return;}
  // Closing a detail/photo/editor dialog keeps the list at the selected search result.
  if(document.querySelector('dialog[open],#detail[open]')){timer=setTimeout(checkIdle,10000);return;}
  reset();
 }
 function activity(){if(resetting)return;lastActivity=Date.now();clearTimeout(timer);if(active())timer=setTimeout(checkIdle,idleMs);}
 for(const type of ['pointerdown','keydown','wheel','touchstart','input','change'])document.addEventListener(type,activity,{passive:true});
 window.addEventListener('focus',checkIdle);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkIdle();});
 window.addEventListener('pageshow',()=>setTimeout(reset,0));
 window.JKSearchSession={reset,idleMs};
 requestAnimationFrame(reset);
})();
