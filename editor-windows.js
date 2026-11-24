/* 관리자 수정창 위치 이동. 입력값·저장·스크롤·기존 닫기 동작은 변경하지 않습니다. */
(()=>{
 'use strict';if(window.JKEditorWindows)return;
 const windows=new Map(),handles=new WeakSet();let moving=null,resizeClickUntil=0;
 const style=document.createElement('style');style.textContent=`
 .jk-editor-window{translate:var(--jk-editor-x,0px) var(--jk-editor-y,0px)!important;resize:both!important;overflow:auto;min-width:min(320px,calc(100vw - 32px));min-height:180px}
 .jk-editor-drag-handle{cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}
 .jk-editor-window.jk-editor-dragging .jk-editor-drag-handle{cursor:grabbing}
 .jk-gpx-companion-window{position:fixed;z-index:10000;top:60px;right:16px;width:min(570px,calc(100vw - 48px));height:min(650px,75dvh);display:flex;flex-direction:column;padding:12px;box-sizing:border-box;border:1px solid #a48a61;border-radius:12px;background:#fffdf8;box-shadow:0 8px 32px #0005;color:#344c40;overflow:hidden}
 .jk-gpx-companion-window h2{display:flex;align-items:center;justify-content:space-between;gap:10px;font:700 17px/1.5 'Malgun Gothic',sans-serif;margin:0 0 10px;padding:4px;flex-shrink:0}
 .jk-gpx-companion-window button{font:700 14px/1.5 'Malgun Gothic',sans-serif;padding:5px 12px;border:1px solid #a48a61;border-radius:8px;background:#f4e8cd;color:#344c40;cursor:pointer}
 .jk-gpx-companion-window iframe{width:100%;flex:1;min-height:0;border:0}
 @media(max-width:600px){.jk-gpx-companion-window{top:45px;right:6px;width:calc(100vw - 40px);height:65dvh}}
 `;document.head.append(style);
 const interactive='button,a,input,select,textarea,[contenteditable=true]';
 document.addEventListener('pointerdown',e=>{const panel=e.target.closest?.('.jk-editor-window');if(!panel)return;const r=panel.getBoundingClientRect();if(e.clientX>=r.right-24&&e.clientY>=r.bottom-24&&e.clientX<=r.right&&e.clientY<=r.bottom)resizeClickUntil=Date.now()+60000;},true);
 document.addEventListener('pointerup',()=>{if(resizeClickUntil>Date.now())resizeClickUntil=Date.now()+500;},true);
 document.addEventListener('click',e=>{if(resizeClickUntil>Date.now()){e.preventDefault();e.stopImmediatePropagation();resizeClickUntil=0;}},true);

 function reset(panel){const state=windows.get(panel);if(!state)return;state.x=state.y=0;panel.style.removeProperty('--jk-editor-x');panel.style.removeProperty('--jk-editor-y');}
 function place(panel,x,y){const state=windows.get(panel);state.x=x;state.y=y;panel.style.setProperty('--jk-editor-x',x+'px');panel.style.setProperty('--jk-editor-y',y+'px');}
 function finish(){if(!moving)return;moving.panel.classList.remove('jk-editor-dragging');try{moving.handle.releasePointerCapture(moving.pointer);}catch{}moving=null;}
 function bind(handle,panel){
  if(handles.has(handle))return;handles.add(handle);handle.classList.add('jk-editor-drag-handle');handle.title='제목줄을 끌어 이동 · 오른쪽 아래 모서리로 크기 조절 · 제목 두 번 클릭하면 위치 복원';
  handle.addEventListener('pointerdown',e=>{
   if(e.button!==0||e.isPrimary===false||e.target.closest(interactive))return;
   const rect=handle.getBoundingClientRect(),state=windows.get(panel);if(!rect.width)return;
   moving={panel,handle,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,x:state.x,y:state.y,rect};panel.classList.add('jk-editor-dragging');
   handle.setPointerCapture(e.pointerId);e.preventDefault();
  });
  handle.addEventListener('dblclick',e=>{if(e.target.closest(interactive))return;finish();reset(panel);});
 }
 document.addEventListener('pointermove',e=>{
  if(!moving||e.pointerId!==moving.pointer)return;
  const m=moving,visible=Math.min(160,m.rect.width),dx=Math.max(visible-m.rect.right,Math.min(innerWidth-visible-m.rect.left,e.clientX-m.startX)),dy=Math.max(8-m.rect.top,Math.min(innerHeight-Math.min(40,m.rect.height)-m.rect.top,e.clientY-m.startY));
  place(m.panel,m.x+dx,m.y+dy);e.preventDefault();
 },{passive:false});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,finish);
 window.addEventListener('resize',()=>{finish();for(const panel of windows.keys())reset(panel);});
 function scan(){
  for(const [panel,state]of windows){if(!panel.isConnected){windows.delete(panel);continue;}const visible=!!panel.getClientRects().length;if(state.visible&&!visible)reset(panel);state.visible=visible;}
  for(const panel of document.querySelectorAll('dialog,[role=dialog],#detail.detail')){
   if(panel.matches('.lightbox,.jk-protected-viewer')||!panel.querySelector('form,input:not([type=hidden]),textarea,select')&&!panel.hasAttribute('data-jk-editor-window'))continue;
   if(!windows.has(panel)){windows.set(panel,{x:0,y:0,visible:!!panel.getClientRects().length});panel.classList.add('jk-editor-window');panel.addEventListener('close',()=>{finish();reset(panel);});}
   const headers=[...panel.querySelectorAll(':scope>h2,:scope>h3,#dialogTitle,#detail-title,#dialog-title,#title,.ux-form>h3,.jk-editor-window-title')];if(!headers.length){const first=panel.querySelector('h2,h3');if(first)headers.push(first);}for(const header of headers)if(header.closest('dialog,[role=dialog],#detail.detail')===panel)bind(header,panel);
  }
 }
 let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});};
 new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open','hidden','class']});scan();
 window.JKEditorWindows={reset,refresh:scan};
})();
