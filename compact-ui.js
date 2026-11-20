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
 html body .jk-compact-menu .jk-nav-drop{min-width:min(264px,calc(100vw - 24px))!important;max-width:calc(100vw - 24px)!important;padding:18px!important;gap:6px!important;max-height:70dvh;overflow:auto}
 html body .jk-compact-menu .jk-all-panel{gap:16px!important;padding:22px!important}
 html body .side .alb-btn{gap:13.2px;min-width:0;box-sizing:border-box}
 html body .side .alb-name{min-width:0;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
 html body .side .alb-title{white-space:normal!important;overflow-wrap:anywhere}
 html body .lightbox:has(#lb-close){padding-top:86.4px!important}
 html body .lightbox .lb-back{right:96.4px!important}
 html body .jk-home-card-stage>.grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:7px!important}
 html body .jk-home-card-stage .card{min-width:0!important;overflow-wrap:anywhere}
 html body .jk-home-card-stage .card .number{font-size:16px!important;line-height:1.1!important}
 html body .jk-home-card-stage .card h3{font-size:12px!important;line-height:1.35!important}
 html body .jk-home-card-stage .card :is(.coming,.more){font-size:11px!important;line-height:1.35!important}
 @media(max-width:1050px){html body .jk-home-card-stage>.grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
 @media(max-width:600px){html body .hero-copy .buttons{grid-template-columns:repeat(3,minmax(0,1fr))!important}html body .jk-home-card-stage>.grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}html body .jk-header-grid .jk-header-title{font-size:15px!important}}
 `;
 style.textContent+=`html body :is(dialog#details,#detail.detail) :is(.ux-info,.island-detail-cell,.hike-stats>div){height:auto!important;min-height:0!important}html body :is(dialog#details,#detail.detail) :is(.ux-actions,.jk-gps-map-actions){flex-wrap:wrap!important;gap:8px!important}html body :is(dialog#details,#detail.detail) :is(.ux-info dd,.island-detail-cell dd){min-width:0;overflow-wrap:anywhere}html body :is(dialog#details,#detail.detail) .jk-guide-detail{padding:9px 0!important;margin:8px 0!important}html body :is(dialog#details,#detail.detail) :is(.ux-record-panel,.visit){padding-top:10px!important;padding-bottom:10px!important}`;
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
  const topMenu=node.matches('.jk-compact-menu>a,.jk-compact-menu>details>summary'),subMenu=node.matches('.jk-nav-drop>a,.jk-all-panel a'),album=node.matches('.side .alb-btn');
  const related=node.matches('.ux-context-links>a,.quick-nav>a,.record-return-links>.btn'),galleryChoice=node.matches('.actions>.btn,.go-home-bottom>.btn');
  const closeReturn=node.matches('.jk-bottom-close>button,.jk-gps-large-footer>.jk-gps-large-close,.lightbox .lb-back');
  const photoClose=node.matches('#lb-close,#close-lightbox,.jk-protected-viewer>button,.lightbox .close');
  const detailAction=node.matches('dialog#details #close,#detail.detail #close,dialog#details .ux-actions>a.ux-edit-btn,#detail.detail .ux-actions>a.ux-edit-btn,dialog#details a.jk-gallery-action,#detail.detail a.jk-gallery-action');
  const growth=detailAction?1.3:topMenu?1.69:subMenu?1.95:album?1.43:photoClose?1.3:closeReturn?1.2:related||galleryChoice?1.1:1;
  for(const side of ['Top','Right','Bottom','Left'])node.style.setProperty('padding-'+side.toLowerCase(),(px(c['padding'+side])*.8*growth).toFixed(2)+'px','important');
  node.style.setProperty('min-height',(Math.max(24,min*.8)*growth).toFixed(2)+'px','important');
  node.style.setProperty('font-size',Math.max(11,font*.9).toFixed(2)+'px','important');
  if(line)node.style.setProperty('line-height',Math.max(14,line*.9).toFixed(2)+'px','important');
  if(c.height!=='auto'&&node.matches('.leaflet-control a,button#close,button.close'))node.style.setProperty('height',(Math.max(24,px(c.height)*.8)*(detailAction?1.3:1))+'px','important');
  if(photoClose&&node.matches('#lb-close')){node.style.setProperty('width',(px(c.width)*1.3).toFixed(2)+'px','important');node.style.setProperty('height',(px(c.height)*1.3).toFixed(2)+'px','important');}
  else if(photoClose&&node.matches('button.close'))node.style.setProperty('height',(Math.max(24,px(c.height)*.8)*1.3).toFixed(2)+'px','important');
  done.add(node);
 }

 // Restore the unscaled values before each DOM update. New children must not inherit
 // an already scaled size and receive another 70% reduction.
 const fontStates=new Map(),spacingDone=new WeakSet();
 function restoreFontScale(){
  for(const [node,state]of fontStates){
   if(!node.isConnected){fontStates.delete(node);continue;}
   for(const prop of ['font-size','line-height']){
    const [value,priority]=state.original[prop];
    if(value)node.style.setProperty(prop,value,priority);else node.style.removeProperty(prop);
   }
  }
 }
 function scaleTypography(){
  const measurements=[];
  const listPage=['mountains.html','islands.html','yeongnam-alps.html','other-hikes.html','overseas-trekking.html','records-to-complete.html'].includes(location.pathname.split('/').pop());
  for(const node of document.querySelectorAll('body *:not(script):not(style):not(noscript)')){
   // Inline children also need their parent's line-box metrics reduced.
   if(node.matches('img,svg,canvas,iframe,br,hr,source,video,audio,path,polyline,polygon,circle,rect'))continue;
   const c=getComputedStyle(node),size=px(c.fontSize),line=px(c.lineHeight);
   if(!size)continue;
   measurements.push([node,size,line]);
  }
  // Measure the entire text tree before changing parents, so nested text scales once.
  for(const [node,size,line]of measurements){
   const original={};for(const prop of ['font-size','line-height'])original[prop]=[node.style.getPropertyValue(prop),node.style.getPropertyPriority(prop)];
   const topMenu=node.closest('.jk-compact-menu>a,.jk-compact-menu>details>summary'),subMenu=node.closest('.jk-nav-drop>a,.jk-all-panel a'),gallerySidebar=location.pathname.endsWith('/gallery.html')&&node.closest('.side');
   const enlargedList=node.closest('.entries .entry');
   const baseRatio=node.closest('.jk-season-tools,.jk-season-note')?1:node.closest('.jk-all-panel strong')?1.05:subMenu?1.365:topMenu?1.183:gallerySidebar||enlargedList||(listPage&&node.closest('#cards>.card,#island-cards>.ux-island-card,#alps-records>.record,#list>.card,#list>.other-record-item,#overseas-list>.trek-card,.filters button,.toolbar .btn,.ux-context-links a')?.closest('main,.ux-context-links')?.nodeType)? .91:.7;
   const tenPercent=gallerySidebar||node.closest('.ux-context-links>a,.quick-nav>a,.record-return-links>.btn,.actions>.btn,.go-home-bottom>.btn');
   const recordList=location.pathname.endsWith('/records-to-complete.html')&&node.closest('.table-wrap table');
   const closeReturn=node.closest('.jk-bottom-close>button,.jk-bottom-close>a,.jk-gps-large-footer>.jk-gps-large-close,.lightbox .lb-back');
   const photoClose=node.closest('#lb-close,#close-lightbox,.jk-protected-viewer>button,.lightbox .close');
   const detailAction=node.closest('dialog#details #close,#detail.detail #close,dialog#details .ux-actions>a.ux-edit-btn,#detail.detail .ux-actions>a.ux-edit-btn,dialog#details a.jk-gallery-action,#detail.detail a.jk-gallery-action');
   const ratio=(detailAction?baseRatio*1.3:baseRatio)*(tenPercent?1.1:1)*(recordList?1.2:1)*(closeReturn?1.2:1)*(photoClose?1.3:1);
   // Detailed records need a readable baseline independent of the compact navigation scale.
   const detailText=node.closest('dialog#details,#detail.detail,#map-hike-editor,.jk-summary-section')&&!node.closest('.leaflet-container,.hike-map,.tranggle-gps-map,svg');
   const detailSize=node.matches('#dialogTitle,#detail-title,h1,h2')?20:node.matches('h3')?17:node.matches('h4')?15:node.matches('small,.ux-help')?13:14;
   const textSize=detailText?detailSize:size*ratio,textLine=detailText?detailSize*1.6:line*ratio;
   const applied={'font-size':textSize.toFixed(3)+'px','line-height':textLine?textLine.toFixed(3)+'px':node.style.getPropertyValue('line-height')};
   node.style.setProperty('font-size',applied['font-size'],'important');
   if(line||detailText)node.style.setProperty('line-height',applied['line-height'],'important');
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


 const layoutDone=new WeakSet();
 const layouts='header:not(.hero),main,article,aside,section:not(.hero),.container,.wrap,.head,.intro,.banner,.section-head,.hero-copy,.panel,.panelhead,.card,.grid,.layout,.mapinfo,.filters,.actions,.toolbar,.stats,.stat,.hike-stats,.ux-record-panel,.ux-form,.ux-form-grid,.ux-info,dl,dd,.jk-header-grid,.jk-profile-byline,.jk-management-group,.jk-management-grid,.jk-profile-dialog,.jk-profile-actions,.jk-home-card-stage,.connect,.tags,.seo-topics,.visit,.guide,.notice,input,select,textarea,dialog,td,th,footer';
 function compactLayout(){
  const measurements=[];
  for(const node of document.querySelectorAll(layouts)){
   if(layoutDone.has(node)||!node.getClientRects().length||node.closest('.leaflet-container,.jk-gps-large-dialog,.lightbox'))continue;
   const c=getComputedStyle(node),values={};
   // Auto margins center the page; shrink only the vertical whitespace around it.
   for(const prop of ['margin-top','margin-bottom','row-gap','column-gap']){
    const value=c.getPropertyValue(prop);if(value.endsWith('px'))values[prop]=px(value)*.7;
   }
   const recordCell=location.pathname.endsWith('/records-to-complete.html')&&node.matches('td,th')&&node.closest('.table-wrap table');
   if(!node.matches(controls))for(const side of ['top','right','bottom','left'])values['padding-'+side]=px(c.getPropertyValue('padding-'+side))*(recordCell?.84:.7);
   let columns=null,avatar=null,copy=null;
   if(node.matches('.jk-header-grid')){const tracks=c.gridTemplateColumns.split(' ');if(tracks[0]?.endsWith('px'))columns=(px(tracks[0])*.7)+'px minmax(0,1fr)'+(tracks.length>2?' auto':'');}
   if(node.matches('.hero-copy'))copy=px(c.width)*.7;
   measurements.push({node,values,columns,copy});
  }
  for(const {node,values,columns,copy}of measurements){
   for(const [prop,value]of Object.entries(values))node.style.setProperty(prop,value.toFixed(3)+'px','important');
   if(node.matches('main,.section-head,.intro,.banner,.head,.panelhead,.mapinfo,input,select,textarea,#cards>.card,#island-cards>.ux-island-card'))node.style.setProperty('min-height','0','important');
   if(columns)node.style.setProperty('grid-template-columns',columns,'important');
   if(copy)node.style.setProperty('width',copy.toFixed(3)+'px','important');
   layoutDone.add(node);
  }
  for(const avatar of document.querySelectorAll('.jk-header-grid .jk-profile-avatar')){
   if(layoutDone.has(avatar))continue;const r=avatar.getBoundingClientRect();if(!r.width)continue;
   avatar.style.setProperty('width',(r.width*.7).toFixed(3)+'px','important');avatar.style.setProperty('height',(r.height*.7).toFixed(3)+'px','important');layoutDone.add(avatar);
  }
  for(const small of document.querySelectorAll('.section-head>small'))if(getComputedStyle(small).display!=='none')small.style.setProperty('display','block','important');
  if(innerWidth>1050){
   for(const node of document.querySelectorAll('.jk-hiking-home #mountains,.jk-hiking-home #blog,.jk-representative-home main>h2,.jk-representative-home main>.intro,.jk-representative-home main>.tags,.jk-representative-home main>.connect')){
    node.style.setProperty('width','60%','important');node.style.setProperty('margin-left','auto','important');node.style.setProperty('margin-right','auto','important');
   }
  }else{
   for(const node of document.querySelectorAll('.jk-hiking-home #mountains,.jk-hiking-home #blog,.jk-representative-home main>h2,.jk-representative-home main>.intro,.jk-representative-home main>.tags,.jk-representative-home main>.connect')){
    node.style.setProperty('width','100%','important');node.style.setProperty('margin-left','0','important');node.style.setProperty('margin-right','0','important');
   }
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
  compactLayout();
  // Keep enlarged flyouts inside the viewport when their parent wraps to a new row.
  for(const drop of document.querySelectorAll('.jk-nav-group[open]>.jk-nav-drop,.jk-all-menu[open]>.jk-all-panel')){
   drop.style.setProperty('translate','0px 0px');const r=drop.getBoundingClientRect();
   const shift=Math.max(12-r.left,Math.min(0,innerWidth-12-r.right));
   drop.style.setProperty('translate',shift.toFixed(2)+'px 0px');
  }
 }
 let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});};
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('toggle',schedule,true);window.addEventListener('jk-owner-connected',schedule);window.addEventListener('resize',schedule);scan();
})();
