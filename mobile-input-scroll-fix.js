(()=>{'use strict';
/* Mobile compatibility: let the browser own vertical scrolling. Avoid JS scroll loops. */
function once(){
 const root=document.documentElement,body=document.body,app=document.getElementById('appScreen'),view=document.getElementById('view');
 root.style.setProperty('height','auto','important');root.style.setProperty('min-height','100%','important');root.style.setProperty('overflow-x','hidden','important');root.style.setProperty('overflow-y','auto','important');root.style.setProperty('touch-action','auto','important');
 if(body){body.style.setProperty('position','static','important');body.style.setProperty('height','auto','important');body.style.setProperty('min-height','100vh','important');body.style.setProperty('overflow-x','hidden','important');body.style.setProperty('overflow-y','auto','important');body.style.setProperty('touch-action','auto','important')}
 [app,view].filter(Boolean).forEach(el=>{el.style.setProperty('position','relative','important');el.style.setProperty('height','auto','important');el.style.setProperty('min-height','0','important');el.style.setProperty('max-height','none','important');el.style.setProperty('overflow','visible','important');el.style.setProperty('touch-action','auto','important')});
}
function afterRender(){requestAnimationFrame(once)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{once();setTimeout(once,250)});else once();
document.addEventListener('click',e=>{if(e.target.closest('#nav button,[data-act="toggle"],[data-mact="toggle"],[data-mact="openSchedule"],[data-mact="openInterview"]'))setTimeout(afterRender,0)});
const st=document.createElement('style');st.textContent=`
html{height:auto!important;min-height:100%!important;overflow-x:hidden!important;overflow-y:auto!important;touch-action:auto!important;overscroll-behavior:auto!important}
body{position:static!important;height:auto!important;min-height:100vh!important;overflow-x:hidden!important;overflow-y:auto!important;touch-action:auto!important;overscroll-behavior:auto!important;-webkit-overflow-scrolling:touch}
.shell,#appScreen,#view{position:relative!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;touch-action:auto!important}
.section,.sectionBody,.inlinePlan,.minterview,.mdCompBody,.mdDistrictBody,.mqDash,.mqBlock,.qvHomeSection,.qvBlock{height:auto!important;max-height:none!important;touch-action:auto!important}
.nav{overflow-x:auto!important;overflow-y:hidden!important;touch-action:auto!important;-webkit-overflow-scrolling:touch}
.checkGroup label{pointer-events:auto!important;touch-action:manipulation!important}.checkGroup input[type=checkbox]{appearance:auto!important;-webkit-appearance:checkbox!important;position:static!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;width:20px!important;height:20px!important;min-width:20px!important;margin:0 10px 0 0!important;accent-color:#0F6B68!important}
input,select,textarea,button{touch-action:manipulation}
@media(max-width:700px){.shell{padding-bottom:96px!important}.mdDateTime{grid-template-columns:1fr!important}}
`;document.head.appendChild(st);
})();