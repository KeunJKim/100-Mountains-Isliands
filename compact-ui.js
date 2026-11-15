/* 공통 표시 크기: 기존 기능·자료를 보존하고 버튼 여백과 높이를 약 20% 줄입니다. */
(() => {
 'use strict';
 if(document.getElementById('jk-compact-ui-style'))return;
 const style=document.createElement('style');style.id='jk-compact-ui-style';
 style.textContent=`
 html body{font-size:14px;line-height:1.65}
 html body .jk-header-grid .jk-header-title{transform:none!important;font-size:16px!important;line-height:1.45!important}
 html body.jk-hiking-home .hero-copy h1,html body.jk-representative-home .hero-copy h1{zoom:1!important;transform:none!important;font-size:16px!important;line-height:1.3!important}
 html body.jk-hiking-home .hero-copy,html body.jk-representative-home .hero-copy{width:300px!important;padding:10px 12px!important}
 html body.jk-hiking-home .hero-copy .buttons{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:3px!important;margin-top:7px!important}
 html body.jk-representative-home .hero-copy .buttons{display:flex!important;flex-wrap:wrap!important;gap:5px!important;margin-top:7px!important}
 html body .hero-copy .buttons .button{white-space:normal!important;min-width:0!important;line-height:1.35!important}
 html body .jk-home-card-stage>.grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:7px!important}
 html body .jk-home-card-stage .card{min-width:0!important;overflow-wrap:anywhere}
 html body .jk-home-card-stage .card .number{font-size:16px!important;line-height:1.1!important}
 html body .jk-home-card-stage .card h3{font-size:12px!important;line-height:1.35!important}
 html body .jk-home-card-stage .card :is(.coming,.more){font-size:11px!important;line-height:1.35!important}
 @media(max-width:1050px){html body .jk-home-card-stage>.grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
 @media(max-width:600px){html body .hero-copy .buttons{grid-template-columns:repeat(3,minmax(0,1fr))!important}html body .jk-home-card-stage>.grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}html body .jk-header-grid .jk-header-title{font-size:15px!important}}
 `;
 document.head.append(style);
 const controls='button,input[type="button"],input[type="submit"],a.button,a.btn,a.action,a.ux-edit-btn,a.jk-gallery-action,.jk-compact-menu> a,.jk-compact-menu>details>summary,.jk-nav-drop>a,.jk-all-panel a,.jk-management-grid>a,.jk-gps-map-actions>a,.jk-management-choices>a,.jk-home-card-stage .card,a[role="button"],a.jk-token-create,.quick-nav>a,.ux-context-links>a,.toolbar>a,.links>a';
 const done=new WeakSet(),texts=new WeakSet();
 const px=s=>Number.parseFloat(s)||0;
 function compact(node){
  if(done.has(node)||node.matches('.jk-profile-trigger')||!node.getClientRects().length)return;
  const c=getComputedStyle(node);if(c.display==='none')return;
  // Photograph thumbnails retain their image size; only their separate action buttons shrink.
  if(node.querySelector('img')&&!node.matches('.jk-home-card-stage .card'))return;
  if(node.matches('.jk-hiking-home .hero-copy .buttons .button')){for(const [key,value]of Object.entries({'font-size':'10px','line-height':'12px','padding':'1px 0','min-height':'28px'}))node.style.setProperty(key,value,'important');done.add(node);return;}
  const font=px(c.fontSize),line=px(c.lineHeight),min=px(c.minHeight);
  for(const side of ['Top','Right','Bottom','Left'])node.style.setProperty('padding-'+side.toLowerCase(),(px(c['padding'+side])*.8).toFixed(2)+'px','important');
  node.style.setProperty('min-height',Math.max(24,min*.8).toFixed(2)+'px','important');
  node.style.setProperty('font-size',Math.max(11,font*.9).toFixed(2)+'px','important');
  if(line)node.style.setProperty('line-height',Math.max(14,line*.9).toFixed(2)+'px','important');
  if(c.height!=='auto'&&node.matches('.leaflet-control a,button#close,button.close'))node.style.setProperty('height',Math.max(24,px(c.height)*.8)+'px','important');
  done.add(node);
 }

 // Restore the unscaled values before each DOM update. New children must not inherit
 // an already scaled size and receive another 70% reduction.
 const fontStates=new Map(),spacingDone=new WeakSet();
 function restoreFontScale(){
  for(const [node,state]of fontStates){
   if(!node.isConnected){fontStates.delete(node);continue;}
   for(const prop of ['font-size','line-height']){
    const current=node.style.getPropertyValue(prop);
    if(current!==state.applied[prop])state.original[prop]=[current,node.style.getPropertyPriority(prop)];
    const [value,priority]=state.original[prop];
    if(value)node.style.setProperty(prop,value,priority);else node.style.removeProperty(prop);
   }
  }
 }
 function scaleTypography(){
  const measurements=[];
  for(const node of document.querySelectorAll('body *:not(script):not(style):not(noscript)')){
   const ownText=[...node.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
   if(!ownText&&!node.matches('input,textarea,select,button'))continue;
   const c=getComputedStyle(node),size=px(c.fontSize),line=px(c.lineHeight);
   if(!size)continue;
   measurements.push([node,size,line]);
  }
  // Measure the entire text tree before changing parents, so nested text scales once.
  for(const [node,size,line]of measurements){
   const original={};for(const prop of ['font-size','line-height'])original[prop]=[node.style.getPropertyValue(prop),node.style.getPropertyPriority(prop)];
   const applied={'font-size':(size*.7).toFixed(3)+'px','line-height':line?(line*.7).toFixed(3)+'px':node.style.getPropertyValue('line-height')};
   node.style.setProperty('font-size',applied['font-size'],'important');
   if(line)node.style.setProperty('line-height',applied['line-height'],'important');
   fontStates.set(node,{original,applied});
  }
  for(const node of document.querySelectorAll(controls+',h1,h2,h3,h4,p')){
   if(spacingDone.has(node)||!node.getClientRects().length)continue;
   const c=getComputedStyle(node);
   if(node.matches(controls)&&!node.querySelector('img')){
    const pads=['top','right','bottom','left'].map(side=>[side,px(c.getPropertyValue('padding-'+side))]);
    const min=px(c.minHeight);
    for(const [side,pad]of pads)node.style.setProperty('padding-'+side,(pad*.7).toFixed(3)+'px','important');
    if(min)node.style.setProperty('min-height',(min*.7).toFixed(3)+'px','important');
   }
   if(node.matches('h1,h2,h3,h4,p')){
    const top=px(c.marginTop),bottom=px(c.marginBottom);
    node.style.setProperty('margin-top',(top*.7).toFixed(3)+'px','important');
    node.style.setProperty('margin-bottom',(bottom*.7).toFixed(3)+'px','important');
   }
   spacingDone.add(node);
  }
 }

 function scan(){
  restoreFontScale();
  for(const link of document.querySelectorAll('.jk-hiking-home .hero-copy .buttons .button')){const text=link.textContent,short=text.startsWith('BAC ')?text.slice(4):text;if(short!==text){link.setAttribute('aria-label',text);link.textContent=short;}}
  for(const text of document.querySelectorAll('.jk-home-card-stage :is(.coming,.more)')){const label=text.closest('a')?.getAttribute('href')?.includes('gallery.html')?'사진 보기 →':'기록 보기 →';if(text.textContent!==label)text.textContent=label;}
  for(const menu of document.querySelectorAll('.ux-context-links')){if(!menu.querySelector('a[href*="overseas-trekking.html"]')){const a=document.createElement('a');a.href='https://keunjkim.github.io/100-Mountains-Isliands/overseas-trekking.html';a.textContent='해외트래킹';menu.append(a);}}

  document.querySelectorAll('h1,h2,h3,h4,p').forEach(node=>{
   if(texts.has(node)||!node.getClientRects().length)return;
   const size=px(getComputedStyle(node).fontSize),cap={H1:30,H2:24,H3:19,H4:17,P:16}[node.tagName];
   if(size>cap)node.style.setProperty('font-size',cap+'px','important');texts.add(node);
  });
  document.querySelectorAll(controls).forEach(compact);
  scaleTypography();
 }
 let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});};
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('toggle',schedule,true);window.addEventListener('jk-owner-connected',schedule);window.addEventListener('resize',schedule);scan();
})();
