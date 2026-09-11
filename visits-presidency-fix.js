(()=>{'use strict';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=s=>String(s??'').trim();
const D=s=>window.dateBR?dateBR(s):s;
function memberName(m){return typeof m==='string'?C(m):C(m?.name||m?.nome||m?.member||m?.fullName)}
function isActive(m){if(typeof m==='string')return true;if(m?.active===false||m?.ativo===false)return false;const s=C(m?.status||m?.situacao).toLowerCase();return !['inativo','inactive','false','0'].includes(s)}
function brotherNames(){
  const names=[];
  const add=m=>{const n=memberName(m);if(n&&isActive(m))names.push(n)};
  (Array.isArray(state?.members)?state.members:[]).forEach(add);
  if(!names.length){
    document.querySelectorAll('.brother').forEach(row=>{if(!/inativo/i.test(row.textContent||'')){const n=C(row.querySelector('b')?.textContent);if(n)names.push(n)}});
  }
  return [...new Set(names)].sort((a,b)=>a.localeCompare(b,'pt-BR'));
}
function removeMeetingItemVisits(){
  if(currentTab!=='Presidência')return;
  document.querySelectorAll('.collabMeeting').forEach(box=>{
    [...box.querySelectorAll('.collabHead')].forEach(head=>{
      if(!/Visitas programadas/i.test(head.textContent||''))return;
      const list=head.nextElementSibling,form=list?.nextElementSibling;
      if(list?.matches('[data-collab-list="visit"]'))list.remove();
      if(form?.matches('[data-collab-form="visit"]'))form.remove();
      head.remove();
    });
    box.querySelectorAll('[data-collab-list="visit"],[data-collab-form="visit"]').forEach(x=>x.remove());
  });
}
function makeBrotherDropdowns(){
  if(currentTab!=='Presidência')return;
  const names=brotherNames();
  document.querySelectorAll('[id^="visit-member-"]').forEach(old=>{
    const selected=C(old.value);
    let field=old;
    if(old.tagName!=='SELECT'){
      field=document.createElement('select');
      field.id=old.id;
      field.name=old.name||'';
      field.setAttribute('aria-label','Irmão');
      old.replaceWith(field);
    }
    field.innerHTML='<option value="">Selecione o irmão</option>'+names.map(n=>`<option value="${E(n)}">${E(n)}</option>`).join('');
    if(selected&&names.includes(selected))field.value=selected;
  });
}
function fix(){try{removeMeetingItemVisits();makeBrotherDropdowns()}catch(e){console.warn('visits presidency fix',e)}}
function shareText(cycle){
  const m=(state.meetings||[]).find(x=>(x.sourceDate||x.date)===cycle)||{},items=window.qvMeetingItems||[],actions=items.filter(x=>x.meeting_cycle===cycle&&x.item_type==='action'),visits=Array.isArray(m.presidencyVisits)?m.presidencyVisits:[];
  const l=['*Ata — Reunião da Presidência do Quórum de Élderes*','Ala Vila Jacuí',`📅 ${D(m.date||cycle)}`];
  if(m.participantList?.length)l.push('','*Participantes*',m.participantList.map(x=>'• '+x).join('\n'));
  if(C(m.thought))l.push('','*Pensamento espiritual*',C(m.thought));
  if(C(m.agenda))l.push('','*Assuntos tratados*',C(m.agenda));
  if(actions.length)l.push('','*Ações definidas*',actions.map(x=>`• ${C(x.title)}${x.assignee?' — '+x.assignee:''}${x.due_date?' · até '+D(x.due_date):''}`).join('\n'));
  if(visits.length)l.push('','*Visitas da presidência*',visits.map(v=>`• ${C(v.member)}${v.date?' — '+D(v.date):''}${v.time?' às '+v.time:''}${v.assignees?.length?' · '+v.assignees.join(', '):''}${C(v.note)?' · '+C(v.note):''}`).join('\n'));
  return l.join('\n');
}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-meeting-share]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const t=shareText(b.dataset.meetingShare);try{if(navigator.share)await navigator.share({title:'Ata da Presidência',text:t});else{await navigator.clipboard.writeText(t);b.textContent='Ata copiada ✓'}}catch(err){if(err?.name!=='AbortError')window.prompt('Copie a ata:',t)}},true);
const oldRender=window.renderTab;if(typeof oldRender==='function')window.renderTab=function(){const r=oldRender.apply(this,arguments);setTimeout(fix,0);setTimeout(fix,120);return r};
const root=document.getElementById('view');if(root)new MutationObserver(()=>requestAnimationFrame(fix)).observe(root,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target.closest('[data-qv="visit-add"]'))setTimeout(fix,0)},true);
document.addEventListener('DOMContentLoaded',()=>setTimeout(fix,300));
})();