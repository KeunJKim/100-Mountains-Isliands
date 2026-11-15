/* 홈 사진 위 메뉴: 글자 크기를 유지하면서 여섯 항목을 한 줄로 표시합니다. */
(() => {
 'use strict';
 const card=document.querySelector('.hero-copy'),buttons=card?.querySelector('.buttons');
 if(!buttons)return;
 const put=(node,values)=>{for(const[key,value]of Object.entries(values))node.style.setProperty(key,String(value),'important');};
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});};
 const watched=new WeakSet(),observer=new ResizeObserver(schedule);
 function watch(node){if(!watched.has(node)){watched.add(node);observer.observe(node);}}
 function apply(){
  put(buttons,{display:'flex','flex-wrap':'nowrap',gap:'4px','overflow-x':'auto','align-items':'center','max-width':'100%'});
  const links=[...buttons.querySelectorAll('.button')];
  for(const link of links){put(link,{flex:'0 0 auto',width:'auto','min-width':'max-content','white-space':'nowrap'});watch(link);}
  const css=getComputedStyle(card),number=value=>Number.parseFloat(value)||0;
  const required=links.reduce((sum,link)=>sum+link.getBoundingClientRect().width,0)+Math.max(0,links.length-1)*4+number(css.paddingLeft)+number(css.paddingRight)+number(css.borderLeftWidth)+number(css.borderRightWidth)+2;
  const available=Math.min(innerWidth-24,card.parentElement.getBoundingClientRect().width);
  put(card,{'box-sizing':'border-box',width:Math.min(available,Math.max(210,Math.ceil(required)))+'px','max-width':'calc(100vw - 24px)'});
 }
 watch(card);watch(buttons);
 new MutationObserver(schedule).observe(buttons,{childList:true,subtree:true});
 window.addEventListener('resize',schedule);document.fonts?.ready.then(schedule);schedule();
})();
