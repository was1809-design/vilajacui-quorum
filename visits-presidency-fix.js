(()=>{'use strict';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=s=>String(s??'').trim();
const D=s=>window.dateBR?dateBR(s):s;
function brotherOptions(selected=''){
  const names=[...new Set((state.members||[]).map(m=>m?.name).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  return '<option value="">Selecione o irmão</option>'+names.map(n=>`<option value="${E(n)}" ${n===selected?'selected':''}>${E(n)}</option>`).join('');
}
function removeMeetingItemVisits(){
  if(currentTab!=='Presidência')return;
  document.querySelectorAll('.collabMeeting').forEach(box=>{
    const heads=[...box.querySelectorAll('.collabHead')];
    heads.forEach(head=>{
      if(!/Visitas programadas/i.test(head.textContent||''))return;
      const list=head.nextElementSibling;
      const form=list?.nextElementSibling;
      if(list?.matches('[data-collab-list="visit"]'))list.remove();
      if(form?.matches('[data-collab-form="visit"]'))form.remove();
      head.remove();
    });
    box.querySelectorAll('[data-collab-list="visit"],[data-collab-form="visit"]').forEach(x=>x.remove());
  });
}
function makeBrotherDropdowns(){
  if(currentTab!=='Presidência')return;
  document.querySelectorAll('[id^="visit-member-"]').forEach(input=>{
    if(input.tagName==='SELECT')return;
    const select=document.createElement('select');
    select.id=input.id;
    select.innerHTML=brotherOptions(input.value||'');
    input.replaceWith(select);
  });
}
function fix(){removeMeetingItemVisits();makeBrotherDropdowns()}
function shareText(cycle){
  const m=(state.meetings||[]).find(x=>(x.sourceDate||x.date)===cycle)||{};
  const items=window.qvMeetingItems||[];
  const actions=items.filter(x=>x.meeting_cycle===cycle&&x.item_type==='action');
  const visits=Array.isArray(m.presidencyVisits)?m.presidencyVisits:[];
  const l=['*Ata — Reunião da Presidência do Quórum de Élderes*','Ala Vila Jacuí',`📅 ${D(m.date||cycle)}`];
  if(m.participantList?.length)l.push('','*Participantes*',m.participantList.map(x=>'• '+x).join('\n'));
  if(C(m.thought))l.push('','*Pensamento espiritual*',C(m.thought));
  if(C(m.agenda))l.push('','*Assuntos tratados*',C(m.agenda));
  if(actions.length)l.push('','*Ações definidas*',actions.map(x=>`• ${C(x.title)}${x.assignee?' — '+x.assignee:''}${x.due_date?' · até '+D(x.due_date):''}`).join('\n'));
  if(visits.length)l.push('','*Visitas da presidência*',visits.map(v=>`• ${C(v.member)}${v.date?' — '+D(v.date):''}${v.time?' às '+v.time:''}${v.assignees?.length?' · '+v.assignees.join(', '):''}${C(v.note)?' · '+C(v.note):''}`).join('\n'));
  return l.join('\n');
}
document.addEventListener('click',async e=>{
  const b=e.target.closest('[data-meeting-share]');
  if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  const cycle=b.dataset.meetingShare;
  const t=shareText(cycle);
  try{
    if(navigator.share)await navigator.share({title:'Ata da Presidência',text:t});
    else{await navigator.clipboard.writeText(t);b.textContent='Ata copiada ✓'}
  }catch(err){if(err?.name!=='AbortError')window.prompt('Copie a ata:',t)}
},true);
const old=window.renderTab;
if(typeof old==='function')window.renderTab=function(){const r=old.apply(this,arguments);setTimeout(fix,180);return r};
new MutationObserver(()=>requestAnimationFrame(fix)).observe(document.getElementById('view'),{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>setTimeout(fix,700));
})();