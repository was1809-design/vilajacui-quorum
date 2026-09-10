(()=>{
  const oldTaskCard=window.taskCard||taskCard;
  const oldMeetingRow=window.meetingRow||meetingRow;
  const status=t=>t.status||(t.done?'completed':'pending');
  const statusLabel=s=>s==='progress'?'Em andamento':s==='completed'?'Concluída':'Pendente';
  const completedDate=t=>t.completedAt?String(t.completedAt).slice(0,10):'';
  function workflowTaskCard(t){
    const i=state.tasks.indexOf(t),s=status(t),hist=(t.history||[]).filter(h=>h.from&&h.to&&h.from!=='Ata').map(h=>`<small>Redesignada: ${esc(h.from)} → ${esc(h.to)} · ${dateBR(String(h.at||'').slice(0,10))}</small>`).join('');
    return `<div class="item workflowTask"><b>${esc(t.title)}</b><small>${esc(t.assignee||'Sem responsável')} · Prazo ${dateBR(t.due)}</small><div class="taskStageRow"><span class="taskStage ${s}">${statusLabel(s)}</span>${s==='completed'&&completedDate(t)?`<small>Concluída em ${dateBR(completedDate(t))}</small>`:''}</div>${hist}<label class="stageSelectLabel">Andamento<select class="stageSelect" data-task-status="${i}"><option value="pending" ${s==='pending'?'selected':''}>Pendente</option><option value="progress" ${s==='progress'?'selected':''}>Em andamento</option><option value="completed" ${s==='completed'?'selected':''}>Concluída</option></select></label><div class="actionsRow">${s!=='completed'?`<button class="mini" data-act="reassign" data-i="${i}">Redesignar</button>`:''}<button class="mini danger" data-act="askDelete" data-i="${i}">Excluir</button></div><div id="reas-${i}" class="inlinePlan" hidden><label>Novo responsável<select id="rp-${i}">${opts(t.assignee)}</select></label><label>Novo prazo<input type="date" id="rd-${i}" value="${esc(t.due||'')}"></label><button class="primary" data-act="saveReassign" data-i="${i}">Salvar redesignação</button></div><div id="del-${i}" class="inlineConfirm" hidden><b>Excluir este registro?</b><span>Use apenas para teste ou lançamento feito por engano.</span><button class="mini danger" data-act="delete" data-i="${i}">Confirmar exclusão</button><button class="mini" data-act="cancelDelete" data-i="${i}">Cancelar</button></div></div>`;
  }
  function previousOpenTasks(sourceDate){
    const dates=(state.meetings||[]).map(m=>m.sourceDate||m.date).filter(Boolean).filter(d=>d<sourceDate).sort();
    const prev=dates.length?dates[dates.length-1]:null;
    if(!prev)return[];
    return (state.tasks||[]).filter(t=>t.sourceDate===prev&&status(t)!=='completed');
  }
  function previousBlock(sourceDate){
    const a=previousOpenTasks(sourceDate);
    if(!a.length)return'';
    return `<div class="previousActions"><div class="previousActionsHead"><b>Ações da reunião anterior</b><small>${a.length} ${a.length===1?'ação ainda aberta':'ações ainda abertas'}</small></div>${a.map(workflowTaskCard).join('')}</div>`;
  }
  function workflowMeetingRow(s){
    let html=oldMeetingRow(s);
    html=html.replace(/<label>Revisar na próxima reunião<textarea[\s\S]*?<\/textarea><\/label>/,'');
    const marker=`<button class="scheduleToggle sub" data-act="toggle" data-target="task-${s.date}">`;
    const block=previousBlock(s.date);
    if(block&&html.includes(marker))html=html.replace(marker,block+marker);
    html=html.replace(/<b>([^<]+) · Reunião da Presidência<\/b>/,`<b>Semana até $1 · Reunião da Presidência</b>`);
    html=html.replace('<label>Data<input type="date"','<label>Data-limite da semana<input type="date"');
    return html;
  }
  window.taskCard=taskCard=workflowTaskCard;
  window.meetingRow=meetingRow=workflowMeetingRow;
  document.addEventListener('change',async ev=>{
    const el=ev.target.closest('[data-task-status]'); if(!el)return;
    const i=+el.dataset.taskStatus,t=state.tasks[i]; if(!t)return;
    const s=el.value,was=status(t); t.status=s;t.done=s==='completed';
    if(s==='completed'&&was!=='completed')t.completedAt=new Date().toISOString();
    if(s!=='completed')delete t.completedAt;
    try{await call('save',{state});renderTab()}catch(err){el.value=was;t.status=was;t.done=was==='completed';alert(err.message||'Não foi possível salvar o andamento.')}
  });
  const oldRender=window.renderTab;
  window.renderTab=function(){
    (state.tasks||[]).forEach(t=>{if(!t.status)t.status=t.done?'completed':'pending';if(t.status==='completed')t.done=true});
    return oldRender.apply(this,arguments);
  };
  const style=document.createElement('style');style.textContent=`.taskStageRow{display:flex;align-items:center;gap:8px;margin:7px 0 4px}.taskStage{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border-left:3px solid #9aa7a6;padding:4px 7px;background:#f4f6f6}.taskStage.progress{border-color:#b78a36;background:#fbf7ed}.taskStage.completed{border-color:#3d8a72;background:#eef7f3}.stageSelectLabel{font-size:10px;margin-top:8px}.stageSelect{margin:4px 0 8px;padding:8px 10px;font-size:12px}.previousActions{margin:16px 0;border-top:3px solid var(--teal);background:#f7faf9;padding:0 13px 10px}.previousActionsHead{padding:13px 0 7px}.previousActionsHead b,.previousActionsHead small{display:block}.previousActionsHead b{font-size:13px;color:var(--teal)}.previousActionsHead small{margin-top:3px;font-size:10px}.previousActions .workflowTask{background:#fff;padding:12px;margin-top:7px;border:1px solid var(--line)}@media(max-width:650px){.taskStageRow{align-items:flex-start;flex-direction:column;gap:3px}}`;document.head.appendChild(style);
})();