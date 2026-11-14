/* 삼성헬스 앱에서 날짜·지도와 대조한 기록. GPX 원본과 구분합니다. */
(() => {
 'use strict';
 const dialog=document.getElementById('details'),host=document.getElementById('visits');if(!dialog||!host)return;
 const make=(tag,text)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;return e;};
 const style=make('style');style.textContent='.shealth-reference{border-top:1px solid #cbb99a;padding-top:14px;margin-top:16px}.shealth-reference img{display:block;width:min(100%,620px);height:auto;margin:12px auto;border:1px solid #cbb99a;border-radius:10px}.shealth-reference dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid #cbb99a;border-radius:9px;overflow:hidden;padding:0;gap:0}.shealth-reference dl>div{padding:11px;border-right:1px solid #d8cab3;border-bottom:1px solid #d8cab3;min-width:0}.shealth-reference dt{font-size:12px;color:#695439}.shealth-reference dd{margin:4px 0 0;font-weight:700;color:#30482e}.shealth-reference p{font-size:13px;line-height:1.6}.shealth-reference a{color:#30482e;text-decoration:underline}@media(max-width:560px){.shealth-reference dl{grid-template-columns:repeat(2,minmax(0,1fr))}}';document.head.append(style);
 fetch('samsung-health-supplements.json?v=20261114-health1').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
  function scan(){const name=document.getElementById('dialogTitle')?.textContent.trim();for(const record of data.records||[]){if(name!==record.place)continue;
   const label=record.date.replaceAll('-','.')+' 산행';let visit=[...host.querySelectorAll('.visit')].find(v=>v.querySelector('h3')?.textContent.startsWith(record.date.replaceAll('-','.')));
   if(!visit){visit=make('section');visit.className='visit';visit.append(make('h3',label),make('p','삼성헬스 기록과 사진 촬영일을 대조한 실제 기록 날짜입니다. 기존 BAC 인증일은 그대로 보존합니다.'));host.append(visit);}
   if(visit.querySelector('.shealth-reference'))continue;
   const section=make('section');section.className='shealth-reference';section.setAttribute('aria-label',record.place+' '+record.date+' 삼성헬스 기록');section.append(make('h4','삼성헬스 산행 기록'));
   const a=make('a');a.href=record.image;a.target='_blank';a.rel='noopener';const img=make('img');img.src=record.image;img.alt=record.place+' '+record.date+' 삼성헬스 공유 지도와 앱 표시 통계';img.loading='lazy';a.append(img);section.append(make('h4','삼성헬스 공유 지도 이미지'),a,make('p','삼성헬스에서 저장한 지도 이미지입니다. GPX 원본을 확보한 대화형 GPS 지도와 구분합니다.'));
   const dl=make('dl');for(const [key,value]of [['삼성헬스 표시 거리',record.distanceKm.toFixed(2)+' km'],['삼성헬스 운동 시간',record.duration],['시작 시각',record.startTime],['평균 속도',record.averageSpeedKmh+' km/h'],['총 누적 상승',record.totalAscentM.toLocaleString('ko-KR')+' m'],['최고 고도',record.maxAltitudeM.toLocaleString('ko-KR')+' m']]){const cell=make('div');cell.append(make('dt',key),make('dd',value));dl.append(cell);}section.append(make('h4','삼성헬스 앱 표시 통계'),dl,make('p',record.notes));
   const link=make('a',record.place+' 사진 앨범 보기 →');link.href='gallery.html?album='+encodeURIComponent(record.albumId);section.append(link);visit.append(section);
  }}
  let queued=false;new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;scan();});}}).observe(dialog,{childList:true,subtree:true});scan();
 }).catch(()=>{});
})();
