/* 검색 상태는 현재 페이지 작업 중에만 유지합니다. 인증·편집 데이터와 앨범 선택은 보존합니다. */
(() => {
 'use strict';if(window.JKSearchSession)return;
 const idleMs=5*60*1000,fields='input[type="search"],input[id*="search"],input[placeholder*="검색"],input[aria-label*="검색"],input[placeholder*="찾기"],.jk-season-tools input,#album-search',filters='#region,.jk-season-tools select';
 let lastActivity=Date.now(),timer=null,resetting=false;
 const registered=new WeakSet();
 let edited=new WeakSet(),restoreTimers=[];
 const inputs=()=>[...document.querySelectorAll(fields)].filter(n=>!n.matches('[type=password],[type=hidden]'));
 const selects=()=>[...document.querySelectorAll(filters)];
 const active=()=>inputs().some(n=>n.value.trim())||selects().some(n=>n.value!==''&&n.value!==n.options[0]?.value);
 function reset(){
  if(resetting)return;resetting=true;clearTimeout(timer);
  // Browsers can restore the form separately from the rendered list. Redraw even
  // when the field is already empty, so stale results cannot survive a reset.
  for(const n of inputs()){registered.add(n);n.autocomplete='off';n.value='';n.dispatchEvent(new Event('input',{bubbles:true}));}
  for(const n of selects()){registered.add(n);const value=[...n.options].some(o=>o.value==='')?'':n.options[0]?.value;if(value!==undefined){n.value=value;n.dispatchEvent(new Event('change',{bubbles:true}));}}
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
 // Chrome may restore/autofill values after pageshow and after our first reset.
 // Retry only untouched controls; a fresh query typed by the visitor must survive.
 for(const type of ['input','change'])document.addEventListener(type,e=>{if(e.isTrusted&&document.activeElement===e.target&&e.target.matches?.(fields+','+filters))edited.add(e.target);},true);
 function clearRestored(){
  for(const n of inputs())if(!edited.has(n)&&n.value){n.value='';n.dispatchEvent(new Event('input',{bubbles:true}));}
  for(const n of selects())if(!edited.has(n)&&n.selectedIndex>0){n.selectedIndex=0;n.dispatchEvent(new Event('change',{bubbles:true}));}
 }
 function startPage(){
  restoreTimers.forEach(clearTimeout);edited=new WeakSet();reset();
  restoreTimers=[0,250,1000,2000].map(delay=>setTimeout(clearRestored,delay));
 }
 for(const type of ['pointerdown','keydown','wheel','touchstart','input','change'])document.addEventListener(type,activity,{passive:true});
 window.addEventListener('focus',checkIdle);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkIdle();});
 window.addEventListener('pageshow',startPage);
 window.addEventListener('pagehide',reset);
 window.JKSearchSession={reset,idleMs};
 // Some menus create their search controls after the initial page reset.
 // Initialize each new control once without clearing an ongoing search when
 // cards, photos or editor content are subsequently redrawn.
 new MutationObserver(()=>{
  for(const n of inputs())if(!registered.has(n)){registered.add(n);n.autocomplete='off';n.value='';n.dispatchEvent(new Event('input',{bubbles:true}));}
  for(const n of selects())if(!registered.has(n)){registered.add(n);const first=[...n.options].some(o=>o.value==='')?'':n.options[0]?.value;if(first!==undefined){n.value=first;n.dispatchEvent(new Event('change',{bubbles:true}));}}
 }).observe(document.body,{childList:true,subtree:true});
 startPage();
})();
