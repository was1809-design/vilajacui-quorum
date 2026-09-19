(()=>{'use strict';
const E=x=>(window.esc?esc(x):String(x??'')),D=x=>(window.dateBR?dateBR(x):x);
let threshold=3;
function roster(){return Array.isArray(state.members)?state.members.filter(m=>m&&m.active!==false&&m.name):[]}
function dates(){return Object.keys(state.attendance||{}).filter(d=>d>='2026-09-13'&&!state.lessonCancellations?.[d]).sort()}
function info(m){
 const ds=dates(),rev=ds.slice().reverse();let streak=0,lastClass='',lastSac='';
 for(const d of rev){const r=state.attendance?.[d]?.[m.name]||{};if(!lastSac&&r.sacrament)lastSac=d;if(r.class){lastClass=d;break}streak++}
 const recorded=ds.length;
 if(!recorded)return{streak:0,lastClass:'',lastSac:'',recorded:0};
 if(!lastClass)streak=recorded;
 return{streak,lastClass,lastSac,recorded};
}
function rows(){
 return roster().map(m=>({m,...info(m)})).filter(x=>x.recorded&&x.streak>=threshold).sort((a,b)=>b.streak-a.streak||String(a.m.name).localeCompare(String(b.m.name),'pt-BR'));
}
function render(){
 if(typeof currentTab!=='undefined'&&currentTab!=='Frequência')return;
 const view=document.getElementById('view');if(!view)return;
 view.querySelector('.qAbsencePanel')?.remove();
 const dash=view.querySelector('.afDashboard');if(!dash)return;
 const all=roster().map(m=>({m,...info(m)})).filter(x=>x.recorded).sort((a,b)=>b.streak-a.streak||String(a.m.name).localeCompare(String(b.m.name),'pt-BR'));
 const list=rows(),critical=all.filter(x=>x.streak>=3).length;
 const box=document.createElement('section');box.className='qAbsencePanel';
 box.innerHTML=`<div class="qapHead"><div><span>ACOMPANHAMENTO</span><h3>Tempo sem participar da aula</h3><p>Do maior período sem aula para o menor. “Só sacramental” continua contando como domingo sem aula.</p></div><strong>${critical}</strong></div><div class="qapFilters"><button data-qap="3" class="${threshold===3?'on':''}">3+ domingos</button><button data-qap="2" class="${threshold===2?'on':''}">2+</button><button data-qap="0" class="${threshold===0?'on':''}">Todos</button></div><div class="qapList">${list.length?list.map(x=>`<div class="qapRow"><div class="qapRank"><b>${x.streak}</b><span>${x.streak===1?'domingo':'domingos'}</span></div><div class="qapPerson"><b>${E(x.m.name)}</b><span>${x.lastClass?`Última aula: ${D(x.lastClass)}`:'Sem presença em aula no período registrado'}</span>${x.lastSac&&(!x.lastClass||x.lastSac>x.lastClass)?`<small>Esteve na sacramental em ${D(x.lastSac)}</small>`:''}</div></div>`).join(''):'<div class="qapEmpty">Nenhum irmão neste recorte.</div>'}</div>`;
 dash.insertBefore(box,dash.firstChild);
 box.querySelectorAll('[data-qap]').forEach(b=>b.onclick=()=>{threshold=+b.dataset.qap;render()});
}
function schedule(){setTimeout(render,20);setTimeout(render,180)}
const prev=window.renderTab;if(typeof prev==='function')window.renderTab=function(){const r=prev.apply(this,arguments);schedule();return r};
document.addEventListener('DOMContentLoaded',schedule);
const css=document.createElement('style');css.textContent=`.qAbsencePanel{background:var(--ios-card,#fff);border:1px solid var(--line);border-radius:18px;padding:18px;margin:0 0 18px}.qapHead{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.qapHead>div>span{display:block;color:var(--teal);font-size:9px;font-weight:800;letter-spacing:.07em}.qapHead h3{margin:3px 0 4px;font-size:18px}.qapHead p{margin:0;color:var(--mut);font-size:10px;max-width:600px}.qapHead>strong{font-size:30px;color:var(--teal);line-height:1}.qapFilters{display:flex;gap:6px;margin:14px 0 8px}.qapFilters button{border:1px solid var(--line);background:transparent;color:var(--mut);padding:7px 10px;border-radius:8px;font-size:10px;font-weight:750}.qapFilters button.on{background:var(--teal);border-color:var(--teal);color:#fff}.qapList{border-top:1px solid var(--line)}.qapRow{display:grid;grid-template-columns:62px 1fr;gap:12px;align-items:center;padding:12px 2px;border-bottom:1px solid var(--line)}.qapRank{text-align:center;border-right:1px solid var(--line)}.qapRank b{display:block;color:var(--teal);font-size:22px;line-height:1}.qapRank span{font-size:8px;color:var(--mut)}.qapPerson b,.qapPerson span,.qapPerson small{display:block}.qapPerson b{font-size:11.5px}.qapPerson span{font-size:9px;color:var(--mut);margin-top:2px}.qapPerson small{font-size:9px;color:var(--teal);margin-top:4px;font-weight:650}.qapEmpty{padding:18px 2px;color:var(--mut);font-size:11px}@media(max-width:520px){.qAbsencePanel{padding:15px}.qapHead p{line-height:1.35}.qapFilters button{flex:1}.qapRow{grid-template-columns:55px 1fr}}html[data-theme=dark] .qAbsencePanel{background:#15201f!important;color:#eef3f2!important;border-color:#293735!important}`;document.head.appendChild(css);
})();