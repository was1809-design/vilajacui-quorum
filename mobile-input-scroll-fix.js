(()=>{'use strict';
/* Mobile reliability layer: keeps native checkboxes tappable and the document vertically scrollable. */
function normalize(){
  document.documentElement.style.overflowX='hidden';
  document.documentElement.style.overflowY='auto';
  document.body.style.overflowX='hidden';
  document.body.style.overflowY='auto';
  document.body.style.height='auto';
  document.body.style.minHeight='100dvh';
  document.body.style.touchAction='pan-y';
  const app=document.getElementById('appScreen');
  if(app){app.style.overflow='visible';app.style.height='auto';app.style.minHeight='100dvh';app.style.touchAction='pan-y'}
  document.querySelectorAll('.inlinePlan,.minterview,.mdCompBody,.mdDistrictBody,.sectionBody,#view').forEach(el=>{
    el.style.maxHeight='none';el.style.overflowY='visible';el.style.touchAction='pan-y';
  });
  document.querySelectorAll('.checkGroup label').forEach(label=>{
    label.style.pointerEvents='auto';label.style.touchAction='manipulation';label.style.cursor='pointer';
    const cb=label.querySelector('input[type="checkbox"]');
    if(cb){cb.style.pointerEvents='auto';cb.style.touchAction='manipulation';cb.style.opacity='1';cb.style.position='static';cb.style.width='20px';cb.style.height='20px';cb.style.minWidth='20px';cb.style.margin='0 10px 0 0';cb.style.accentColor='#0F6B68'}
  });
}
function schedule(){requestAnimationFrame(normalize);setTimeout(normalize,80);setTimeout(normalize,250)}
document.addEventListener('DOMContentLoaded',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-act="toggle"],[data-mact="toggle"],[data-mact="openSchedule"],[data-mact="openInterview"]'))schedule()});
const mo=new MutationObserver(()=>schedule());mo.observe(document.documentElement,{subtree:true,childList:true});
const st=document.createElement('style');st.textContent=`html,body{min-height:100%;height:auto!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch}body{touch-action:pan-y!important}.shell,#appScreen,#view{height:auto!important;max-height:none!important;overflow:visible!important}.inlinePlan,.minterview,.mdCompBody,.mdDistrictBody,.sectionBody{max-height:none!important;overflow:visible!important}.checkGroup{position:relative;z-index:2}.checkGroup label{display:flex!important;align-items:center!important;min-height:44px!important;padding:8px 2px!important;pointer-events:auto!important;touch-action:manipulation!important;user-select:none;-webkit-user-select:none}.checkGroup input[type=checkbox]{appearance:auto!important;-webkit-appearance:checkbox!important;display:inline-block!important;position:static!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;width:20px!important;height:20px!important;min-width:20px!important;margin:0 10px 0 0!important;accent-color:#0F6B68!important}.inlinePlan input,.inlinePlan select,.inlinePlan textarea,.minterview input,.minterview select,.minterview textarea{pointer-events:auto!important;touch-action:manipulation!important}@media(max-width:700px){.shell{padding-bottom:96px!important}.inlinePlan,.minterview{overscroll-behavior:auto}.mdDateTime{grid-template-columns:1fr!important}}`;
document.head.appendChild(st);
})();