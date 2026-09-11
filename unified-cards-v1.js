(()=>{'use strict';
const css=`
/* Unified card language: visual only, no persistence/data mutation */
#view .qvUC{border:1px solid var(--line)!important;border-left:4px solid var(--teal)!important;border-radius:15px!important;background:var(--ios-card,#fff)!important;margin:9px 0!important;overflow:hidden!important;box-shadow:0 1px 2px rgba(20,45,43,.04)}
#view .qvUC.scheduleRow{border-top:1px solid var(--line)!important}#view .qvUC .scheduleToggle{padding:14px 13px!important;background:transparent!important}
#view .qvUC.item{padding:13px 14px!important}#view .qvUC.brother{padding:13px 14px!important}
#view .qvUCBrother>div:first-child{min-width:0}#view .qvUCBrother>b,#view .qvUCBrother>div>b{font-size:14px}
#view .qvUCConvert{display:flex;justify-content:space-between;align-items:center;gap:12px}
#view .qvUCConvert:after{content:'›';font-size:22px;color:var(--mut)}
/* Ministering companionships are the unit/card */
#view .mcomp{border:1px solid var(--line)!important;border-left:4px solid var(--teal)!important;border-radius:15px!important;margin:10px 0!important;overflow:hidden!important;background:var(--ios-card,#fff)!important}
#view .mcomp .mdCompToggle{background:transparent!important}
/* Traffic-light task states: accent only, never full-card fill */
#view .qvModernTask{border-left:4px solid #c84646!important}#view .qvModernTask:has(.taskStage.progress){border-left-color:#d29a2e!important}#view .qvModernTask:has(.taskStage.completed){border-left-color:#369568!important}
#view .qvModernTask .taskStage{border-left:0!important}
html[data-theme=dark] #view .qvUC,html[data-theme=dark] #view .mcomp{background:#15201f!important;border-color:#30413e!important}
@media(max-width:600px){#view .qvUC{border-radius:14px!important;margin:8px 0!important}#view .qvUC.item,#view .qvUC.brother{padding:12px!important}}
`;
function activeTab(){
 const on=document.querySelector('#nav button.on');
 return on?on.textContent.trim():'';
}
function mark(){try{
 const tab=activeTab();
 if(tab==='Aulas'||tab==='Presidência')document.querySelectorAll('#view .scheduleRow').forEach(x=>x.classList.add('qvUC'));
 if(tab==='Frequência')document.querySelectorAll('#view .sectionBody>.item').forEach(x=>x.classList.add('qvUC'));
 if(tab==='Irmãos')document.querySelectorAll('#view .item.brother').forEach(x=>x.classList.add('qvUC','qvUCBrother'));
 if(tab==='Recém-conversos')document.querySelectorAll('#view .sectionBody>.item').forEach(x=>x.classList.add('qvUC','qvUCConvert'));
 }catch(e){console.warn('unified cards skipped',e)}}
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const observer=new MutationObserver(()=>requestAnimationFrame(mark));
function start(){const view=document.getElementById('view');if(view){observer.observe(view,{childList:true,subtree:true});mark()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
document.addEventListener('click',e=>{if(e.target.closest('#nav button'))requestAnimationFrame(()=>requestAnimationFrame(mark))});
})();