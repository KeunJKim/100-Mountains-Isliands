/* 공통 상단 메뉴: 여러 하위 메뉴가 동시에 열리지 않도록 정리 */
(() => {
'use strict';
const nav=document.getElementById('ux-navigation');if(!nav)return;
const groups=[...nav.querySelectorAll('details.ux-group')];
for(const group of groups)group.addEventListener('toggle',()=>{
 if(group.open)for(const other of groups)if(other!==group)other.open=false;
});
document.addEventListener('click',e=>{
 if(!nav.contains(e.target))for(const group of groups)group.open=false;
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape')for(const group of groups)group.open=false;
});
})();
