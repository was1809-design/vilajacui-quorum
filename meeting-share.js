(()=>{'use strict';
const D=x=>window.dateBR?dateBR(x):x;
const clean=x=>String(x??'').trim();
function meetingForCycle(cycle){return (state.meetings||[]).find(m=>(m.sourceDate||m.date)===cycle||m.date===cycle)}
function taskStatus(t){return t.status||(t.done?'completed':'pending')}
function statusLabel(t){const s=taskStatus(t);return s==='completed'?'Concluída':s==='progress'?'Em andamento':'Pendente'}
function meetingTasks(m,cycle){const keys=[cycle,m?.sourceDate,m?.date].filter(Boolean);return (state.tasks||[]).filter(t=>keys.includes(t.sourceDate))}
function meetingText(m,cycle){const date=m?.date||cycle,participants=m?.participantList||[],tasks=meetingTasks(m,cycle),visits=m?.presidencyVisits||[];
const lines=[`*Ata — Reunião da Presidência do Quórum de Élderes*`,`Ala Vila Jacuí`,`📅 ${D(date)}`];
if(participants.length)lines.push('',`*Participantes*`,participants.map(n=>`• ${n}`).join('\n'));
if(clean(m?.thought))lines.push('',`*Pensamento espiritual*`,clean(m.thought));
if(clean(m?.agenda))lines.push('',`*Assuntos tratados*`,clean(m.agenda));
if(tasks.length){lines.push('',`*Ações definidas*`);tasks.forEach(t=>{let s=`• ${clean(t.title)||'Ação'} — ${statusLabel(t)}`;if(clean(t.assignee))s+=`\n  Responsável: ${clean(t.assignee)}`;if(t.due)s+=` · Prazo: ${D(t.due)}`;lines.push(s)})}
if(visits.length){lines.push('',`*Visitas programadas*`);visits.forEach(v=>{let s=`• ${clean(v.member||v.name)||'Irmão/família'}`;if(v.date)s+=` — ${D(v.date)}`;if(v.time)s+=` às ${v.time}`;if(clean(v.assignee||v.responsible))s+=`\n  Responsável: ${clean(v.assignee||v.responsible)}`;lines.push(s)})}
if(clean(m?.openingPrayer)||clean(m?.closingPrayer)){lines.push('',`*Orações*`);if(clean(m.openingPrayer))lines.push(`• Abertura: ${clean(m.openingPrayer)}`);if(clean(m.closingPrayer))lines.push(`• Encerramento: ${clean(m.closingPrayer)}`)}
return lines.join('\n')}
async function share(cycle,button){const m=meetingForCycle(cycle);if(!m)return alert('Salve a reunião antes de compartilhar a ata.');const text=meetingText(m,cycle);const old=button.textContent;try{if(navigator.share){await navigator.share({title:`Ata da Presidência — ${D(m.date||cycle)}`,text});return}await navigator.clipboard.writeText(text);button.textContent='Copiado';setTimeout(()=>button.textContent=old,1500)}catch(e){if(e?.name==='AbortError')return;try{await navigator.clipboard.writeText(text);button.textContent='Copiado';setTimeout(()=>button.textContent=old,1500)}catch(_){window.prompt('Copie a ata abaixo:',text)}}}
function enhance(){if(typeof currentTab!=='undefined'&&currentTab!=='Presidência')return;document.querySelectorAll('[id^="meeting-"]').forEach(panel=>{if(panel.querySelector('.meetingShareBtn'))return;const cycle=panel.id.replace('meeting-',''),save=[...panel.querySelectorAll('button')].find(b=>/salvar ata/i.test(b.textContent));if(!save)return;const b=document.createElement('button');b.type='button';b.className='mini meetingShareBtn';b.dataset.meetingShare=cycle;b.textContent='Compartilhar ata';save.insertAdjacentElement('afterend',b)})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-meeting-share]');if(b){e.preventDefault();share(b.dataset.meetingShare,b)}});
const old=window.renderTab;if(typeof old==='function')window.renderTab=function(){const r=old.apply(this,arguments);setTimeout(enhance,60);return r};document.addEventListener('DOMContentLoaded',()=>setTimeout(enhance,100));
const s=document.createElement('style');s.textContent=`.meetingShareBtn{margin-left:8px;color:var(--teal);font-weight:750}@media(max-width:520px){.meetingShareBtn{margin:8px 0 0;width:100%;min-height:44px}}html[data-theme=dark] .meetingShareBtn{background:#1b2927!important;color:#8bd8d1!important;border-color:#3a4e4a!important}`;document.head.appendChild(s)
})();