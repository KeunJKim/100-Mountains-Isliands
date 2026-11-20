/* 공통 방향키 이동: 선택은 Enter, 입력창·지도·사진 넘기기는 기존 동작 유지. */
(() => {
 'use strict';
 if(document.documentElement.dataset.jkArrowNavigation)return;
 document.documentElement.dataset.jkArrowNavigation='1';
 const control='a[href],button,summary,[tabindex]:not([tabindex="-1"])';
 const topMenu='.jk-compact-menu,.ux-menu';
 const drops='.jk-nav-drop,.ux-drop,.jk-home-list-drop,.jk-all-panel';
 const collections='#album-list,#entries,#cards,#island-cards,#alps-records,#list.grid,#overseas-list,#photo-cards,#record-rows,.jk-management-grid';
 const rows='.ux-context-links,.ux-breadcrumb,.quick-nav,.quicklinks,.buttons,.filters,.row,.actions,.tabs,.chips,.pills,.toolbar-actions,.toolbar,.mobile-links,.extra-links,.stage,.bottom,.seo-topics,.jk-return-links,.record-return-links,.jk-profile-actions,.jk-owner-actions,.navlinks,nav,ul,ol,[role="menu"],[role="tablist"],[role="toolbar"]';
 let marked=null;
 const style=document.createElement('style');style.id='jk-arrow-navigation-style';
 style.textContent='.jk-arrow-focus:focus{outline:3px solid #88602d!important;outline-offset:3px!important}';document.head.append(style);
 function visible(node){
  if(!node||node.matches(':disabled,[aria-disabled="true"]')||node.closest('[hidden],[inert],[aria-hidden="true"]'))return false;
  const s=getComputedStyle(node),r=node.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
 }
 function controls(root){return [...root.querySelectorAll(control)].filter(visible);}
 function focus(node,scroll=true){
  if(!node)return;if(marked)marked.classList.remove('jk-arrow-focus');marked=node;node.classList.add('jk-arrow-focus');
  node.focus({preventScroll:true});if(scroll)node.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
 }
 function move(items,current,key,vertical=false,wrap=false){
  const index=items.indexOf(current);if(index<0||!items.length)return null;
  if(key==='Home')return items[0];if(key==='End')return items[items.length-1];
  if(vertical||key==='ArrowLeft'||key==='ArrowRight'){
   const delta=key==='ArrowLeft'||key==='ArrowUp'?-1:1,next=index+delta;
   return items[wrap?(next+items.length)%items.length:Math.max(0,Math.min(items.length-1,next))];
  }
  const box=current.getBoundingClientRect(),sign=key==='ArrowUp'?-1:1,x=(box.left+box.right)/2,y=(box.top+box.bottom)/2;
  const candidates=items.filter(n=>n!==current).map(node=>{
   const r=node.getBoundingClientRect(),dx=Math.abs((r.left+r.right)/2-x),dy=((r.top+r.bottom)/2-y)*sign;
   return{node,dx,dy,beam:r.left<box.right-1&&r.right>box.left+1};
  }).filter(n=>n.dy>2).sort((a,b)=>Number(b.beam)-Number(a.beam)||(a.beam?a.dy-b.dy:a.dx+a.dy-b.dx-b.dy)||a.dx-b.dx);
  return candidates[0]?.node||current;
 }
 function topItems(menu){return [...menu.children].map(n=>n.matches('details')?n.querySelector(':scope > summary'):n).filter(n=>n?.matches(control)&&visible(n));}
 function closeGroup(group){group.open=false;group.querySelector(':scope > summary')?.setAttribute('aria-expanded','false');}
 function summaryFor(node){const g=node.closest('details');return g?.querySelector(':scope > summary');}
 function menuKey(node,key){
  const drop=node.closest(drops),menu=node.closest(topMenu),summary=node.matches('summary')?node:null;
  if(key==='Escape'){
   const owner=summaryFor(node);if(!owner||!owner.parentElement.open)return false;
   focus(owner,false);closeGroup(owner.parentElement);return true;
  }
  if(drop){
   if(menu&&drop.matches('.jk-nav-drop,.ux-drop')&&(key==='ArrowLeft'||key==='ArrowRight')){
    const owner=summaryFor(node),items=topItems(menu),next=move(items,owner,key,false,true);if(next){focus(next);return true;}
   }
   const items=controls(drop),next=move(items,node,key,!drop.matches('.jk-all-panel'),true);if(next){focus(next);return true;}
  }
  if(summary&&(summary.parentElement.matches('.jk-nav-group,.ux-group,.jk-all-menu,.jk-home-list-group'))&&(key==='ArrowDown'||key==='ArrowUp')){
   const group=summary.parentElement;group.open=true;summary.setAttribute('aria-expanded','true');
   const items=controls(group).filter(n=>n!==summary);if(items.length)focus(key==='ArrowDown'?items[0]:items[items.length-1]);return true;
  }
  if(menu){const next=move(topItems(menu),node,key,false,true);if(next){focus(next);return true;}}
  return false;
 }
 function collection(node){
  const root=node.closest(collections);if(!root)return null;
  if(root.matches('#album-list,#entries'))return{root,items:controls(root),vertical:true};
  if(root.matches('#record-rows'))return{root,items:[...root.children].map(row=>controls(row)[0]).filter(Boolean),vertical:true};
  if(root.matches('.jk-management-grid'))return{root,items:controls(root),vertical:false};
  // 보조 링크 대신 다음 기록 카드의 첫 번째 버튼·링크로 이동합니다.
  const items=[...root.children].map(card=>card.matches(control)&&visible(card)?card:controls(card)[0]).filter(Boolean);
  if(items.includes(node))return{root,items,vertical:false};
  const card=[...root.children].find(card=>card.contains(node));return card?{root:card,items:controls(card),vertical:false}:null;
 }
 function group(node){
  const c=collection(node);if(c)return c;
  let root=node.closest(rows)||node.closest('[role="dialog"]');
  if(!root){const parent=node.parentElement;if(parent?.matches('div,section,footer,header')&&[...parent.children].filter(n=>n.matches(control)&&visible(n)).length>1)root=parent;}
  if(!root)return null;
  const items=controls(root).filter(n=>!n.closest('.jk-nav-drop,.ux-drop,.jk-home-list-drop,.jk-all-panel'));
  return{root,items,vertical:root.matches('[role="dialog"]')};
 }
 function nativeContext(node){return !!node.closest('input,textarea,select,audio,video,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"],[role="slider"],.leaflet-container,iframe,#lightbox,.jk-protected-viewer');}
 document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.isComposing)return;
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(event.key))return;
  const node=event.target.closest?.(control);if(!node||nativeContext(event.target))return;
  // 사진 확대창은 기존 좌우 넘기기·닫기 키를 우선합니다.
  if([...document.querySelectorAll('#lightbox,.jk-protected-viewer')].some(visible))return;
  let handled=menuKey(node,event.key);
  if(!handled&&event.key!=='Escape'){const g=group(node),next=g&&move(g.items,node,event.key,g.vertical);if(next){focus(next);handled=true;}}
  if(handled){event.preventDefault();event.stopPropagation();}
 },true);
 // 앨범·필터 선택으로 목록이 다시 그려져도 키보드 초점을 잃지 않습니다.
 document.addEventListener('click',event=>{
  const node=event.target.closest?.(control);if(event.detail!==0||node!==document.activeElement||nativeContext(node))return;
  const g=group(node);if(!g||!g.items.includes(node))return;
  const index=g.items.indexOf(node),label=node.textContent.trim(),id=node.id,scrollTop=g.root.scrollTop;
  requestAnimationFrame(()=>{
   if(node.isConnected||!g.root.isConnected||document.activeElement!==document.body)return;
   const items=controls(g.root),replacement=(id&&items.find(n=>n.id===id))||items.find(n=>n.textContent.trim()===label)||items[Math.min(index,items.length-1)];
   if(replacement){focus(replacement,false);g.root.scrollTop=scrollTop;}
  });
 },true);
 document.addEventListener('pointerdown',()=>{if(marked)marked.classList.remove('jk-arrow-focus');marked=null;},true);
})();
