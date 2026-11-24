/* 명산·섬·영남알프스 지도: 고정 빈 공간을 없애고 가용 화면에 맞춥니다. */
(() => {
 'use strict';
 const main=document.querySelector('main.main'),layout=main?.querySelector('.layout');
 if(!main||!layout||document.getElementById('jk-map-layout-style'))return;
 document.body.classList.add('jk-map-compact');
 const style=document.createElement('style');style.id='jk-map-layout-style';
 style.textContent=`
 html body.jk-map-compact .wrap{width:calc(100% - 24px)!important;max-width:none!important}
 html body.jk-map-compact .layout{display:grid!important;grid-template-columns:clamp(227.5px,22.75vw,309.4px) minmax(0,1fr)!important;align-items:stretch!important}
 html body.jk-map-compact .layout>.panel{display:flex!important;flex-direction:column!important;min-width:0!important;min-height:0!important;border-radius:10px!important}
 html body.jk-map-compact .panelhead{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:4px 8px!important;min-width:0!important;flex:0 0 auto!important}
 html body.jk-map-compact .panelhead>strong{flex:none!important}
 html body.jk-map-compact .panelhead p{white-space:normal!important;text-overflow:clip!important;overflow:visible!important;min-width:0!important;flex:1 1 150px!important}
 html body.jk-map-compact .filters{flex:0 0 auto!important}
 html body.jk-map-compact .entries{overflow:auto!important;overscroll-behavior:contain;min-height:0!important}
 html body.jk-map-compact .entry{flex:none!important;align-items:center!important;box-sizing:border-box!important}
 html body.jk-map-compact .mapbox{flex:1 1 auto!important;min-width:0!important}
 html body.jk-map-compact .mapbox iframe{display:block!important;width:100%!important;height:100%!important;border:0!important}
 html body.jk-map-compact .mapinfo{flex:0 0 auto!important}
 html body.jk-map-compact .jk-map-bottom-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;margin-top:4px}
 html body.jk-map-compact .jk-map-help{margin:0 0 4px;border:1px solid #d7c6a9;border-radius:7px;background:#fff9ec}
 html body.jk-map-compact .jk-map-help>summary{padding:3px 8px;cursor:pointer;color:#354b32;font-weight:700}
 html body.jk-map-compact .jk-map-help .notice{border:0!important;background:transparent!important;color:inherit!important}
 html body.jk-map-compact .seo-topics{display:flex!important;flex-wrap:wrap!important;align-items:center!important;max-width:none!important;width:auto!important}
 @media(max-width:999px){html body.jk-map-compact .layout{grid-template-columns:minmax(0,1fr)!important}html body.jk-map-compact .jk-map-bottom-row{justify-content:flex-start}}
 `;document.head.append(style);
 const put=(node,values)=>{if(!node)return;for(const [key,value]of Object.entries(values))node.style.setProperty(key,String(value),'important');};
 const each=(selector,values)=>document.querySelectorAll(selector).forEach(n=>put(n,values));
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});};
 const observed=new WeakSet(),observer=new ResizeObserver(schedule);
 function watch(node){if(node&&!observed.has(node)){observed.add(node);observer.observe(node);}}
 function wrapHelp(){
  const notice=main.querySelector(':scope>.notice');
  if(notice){const help=document.createElement('details');help.className='jk-map-help';const summary=document.createElement('summary');summary.textContent='지도 이용 안내';help.append(summary);notice.before(help);help.append(notice);help.addEventListener('toggle',schedule);}
  const bottom=main.querySelector('.bottom');let close=main.querySelector('.jk-bottom-close');
  if(!close&&location.pathname.endsWith('yeongnam-alps-map.html')){close=document.createElement('div');close.className='jk-bottom-close';const link=document.createElement('a');link.href='yeongnam-alps.html';link.textContent='닫기 · 목록으로';link.setAttribute('aria-label','지도 닫고 목록으로 돌아가기');close.append(link);main.append(close);}
  if(bottom||close){let row=main.querySelector('.jk-map-bottom-row');if(!row){row=document.createElement('div');row.className='jk-map-bottom-row';(bottom||close).before(row);}if(bottom&&bottom.parentElement!==row)row.append(bottom);if(close&&close.parentElement!==row)row.append(close);}
 }
 function outerHeight(node){const c=getComputedStyle(node);if(c.display==='none')return 0;return node.getBoundingClientRect().height+(Number.parseFloat(c.marginTop)||0)+(Number.parseFloat(c.marginBottom)||0);}
 function apply(){
  if(!layout.isConnected)return;wrapHelp();
  const contentWidth=innerWidth>=1000?'calc(70% - 16.8px)':'calc(100% - 24px)';
  put(main,{width:contentWidth,'max-width':'none',padding:'4px 0',margin:'0 auto','min-height':'0'});
  each('.intro',{padding:'4px 0',margin:'0',height:'auto','min-height':'0'});
  each('.intro>.wrap',{width:contentWidth,'max-width':'none',margin:'0 auto',padding:'0'});
  each('.intro h1',{margin:'2px 0'});each('.intro .lead',{margin:'0'});each('.intro .eyebrow',{display:'block',margin:'0'});
  each('.jk-header-grid',{width:contentWidth,'max-width':'none',margin:'0 auto',padding:'4px 0','min-height':'0','row-gap':'1px','column-gap':'6px'});
  each('.jk-header-grid .jk-profile-avatar',{width:'40px',height:'40px'});
  for(const header of document.querySelectorAll('.jk-header-grid')){const tracks=getComputedStyle(header).gridTemplateColumns.split(' ');put(header,{'grid-template-columns':'48px minmax(0,1fr)'+(tracks.length>2?' auto':'')});}
  each('.ux-context-links',{display:'flex','flex-wrap':'wrap',gap:'4.4px',width:contentWidth,'box-sizing':'border-box',padding:'3.3px 0',margin:'0 auto','min-height':'0',height:'auto'});
  each('.ux-context-links>a',{padding:'2.2px 5.5px',margin:'0','min-height':'19.8px',height:'auto'});
  each('.panelhead',{padding:'5px 8px',margin:'0',height:'auto','min-height':'0'});
  each('.panelhead p',{margin:'0'});
  for(const p of document.querySelectorAll('.panelhead p'))p.title=p.textContent;
  each('.filters',{padding:'4px 6px',gap:'4px',margin:'0'});
  each('.filters input,.filters select',{padding:'7px 10px',height:'auto','min-height':'43px'});
  each('.entry',{height:'auto','min-height':'0',padding:'5.2px 10.4px',gap:'9.1px'});
  each('.map-row-meta',{margin:'2px 0 0'});
  each('.bac-map-link',{padding:'4px 8px',margin:'0',gap:'6px',height:'auto','min-height':'0','flex-shrink':'0'});
  each('.map-location-warning',{padding:'3px 8px',margin:'0','flex-shrink':'0'});
  each('.mapinfo',{padding:'8px 10px',margin:'0','min-height':'0',height:'auto'});
  each('.mapinfo h2',{margin:'0 0 2px'});each('.mapinfo p',{margin:'0 0 4px'});
  each('.mapinfo .actions',{margin:'6px 0 0',gap:'6px'});
  each('.mapinfo .action',{padding:'6px 10px','min-height':'32px',height:'auto'});
  each('.bottom,.jk-bottom-close',{margin:'0',padding:'0','min-height':'0',height:'auto'});
  each('.jk-bottom-close a,.jk-bottom-close button',{padding:'3.6px 9.6px','min-height':'24px',height:'auto'});
  each('.seo-topics',{width:contentWidth,margin:'2px auto',padding:'0',gap:'3px','min-height':'0',height:'auto'});
  each('.seo-topics a',{padding:'1px 4px',margin:'0','min-height':'0',height:'auto'});
  each('footer',{padding:'3px 12px',margin:'0','min-height':'0',height:'auto'});
  put(layout,{gap:innerWidth>=1000?'5.6px':'8px',padding:'0',margin:'0','min-height':'0'});
  const panels=[...layout.children].filter(n=>n.classList.contains('panel')),entries=document.getElementById('entries'),map=document.querySelector('.mapbox');
  const editing=!!document.querySelector('#map-hike-editor:not([hidden])'),helpOpen=!!main.querySelector('.jk-map-help[open]');
  const fit=innerWidth>=1000&&innerHeight>=620&&!editing&&!helpOpen;
  if(fit){
   let after=Number.parseFloat(getComputedStyle(main).paddingBottom)||0;
   let passed=false;for(const child of main.children){if(child===layout){passed=true;continue;}if(passed)after+=outerHeight(child);}
   passed=false;for(const child of document.body.children){if(child===main){passed=true;continue;}if(passed&&!['SCRIPT','STYLE','DIALOG'].includes(child.tagName))after+=outerHeight(child);}
   const available=Math.max(300,Math.floor(innerHeight-(layout.getBoundingClientRect().top+scrollY)-after-3));
   put(layout,{height:available+'px'});panels.forEach(p=>put(p,{height:'100%','max-height':'100%'}));
   put(entries,{flex:'1 1 0',height:'auto','max-height':'none'});put(map,{height:'auto','min-height':'160px',flex:'1 1 0'});
   if(panels[0]&&entries){let content=2;for(const child of panels[0].children)if(child!==entries)content+=outerHeight(child);for(const row of entries.children)if(!row.hidden)content+=outerHeight(row);put(panels[0],{height:Math.min(available,Math.ceil(content))+'px','align-self':'start'});}
  }else{
   put(layout,{height:'auto'});panels.forEach(p=>put(p,{height:'auto','max-height':'none'}));
   put(entries,{flex:'0 1 auto',height:'auto','max-height':innerWidth<1000?'min(35dvh,300px)':'min(60dvh,600px)'});
   put(map,{height:innerWidth<1000?'clamp(240px,48dvh,430px)':'clamp(280px,50dvh,650px)','min-height':'240px',flex:'none'});
  }
  for(const node of document.querySelectorAll('#ux-navigation,.ux-context-links,.intro,.panelhead,.filters,.mapinfo,.jk-map-help,.jk-map-bottom-row,.seo-topics,footer,.jk-profile-avatar'))watch(node);
 }
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('resize',schedule);document.addEventListener('input',schedule,true);document.addEventListener('change',schedule,true);
 document.fonts?.ready.then(schedule);schedule();
})();
