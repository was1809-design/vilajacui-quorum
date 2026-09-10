(()=>{
  const SYNC_MS=15000;
  let syncing=false,lastSnapshot='';
  const e=v=>typeof esc==='function'?esc(v):String(v??'');
  const val=(v,fallback='—')=>v===undefined||v===null||v===''?fallback:String(v);
  const yn=v=>val(v);
  const labelDate=v=>{try{return typeof dateBR==='function'?dateBR(v):val(v)}catch{return val(v)}};
  function freqRows(x){
    const f=x&&x.frequencia&&typeof x.frequencia==='object'?x.frequencia:{};
    const rows=Object.entries(f).sort((a,b)=>String(b[0]).localeCompare(String(a[0]))).slice(0,12);
    return rows.length?rows.map(([d,s])=>`<div class="convertHistory"><span>${e(labelDate(d))}</span><b>${e(s)}</b></div>`).join(''):'<p class="mut">Nenhuma frequência dominical registrada.</p>';
  }
  function templeRows(x){
    const t=x&&x.visitaTemplo&&typeof x.visitaTemplo==='object'?x.visitaTemplo:{};
    const rows=Object.entries(t).sort((a,b)=>String(b[0]).localeCompare(String(a[0]))).slice(0,12);
    return rows.length?rows.map(([d,s])=>`<div class="convertHistory"><span>${e(labelDate(d.length===7?d+'-01':d))}</span><b>${e(s)}</b></div>`).join(''):'<p class="mut">Nenhuma ida ao templo registrada.</p>';
  }
  function row(label,value){return `<div class="convertDetail"><span>${e(label)}</span><b>${e(val(value))}</b></div>`}
  function profile(x,i){
    const interview=x.nuncaEntrevistado?'Nunca entrevistado':x.ultimaEntrevista?labelDate(x.ultimaEntrevista):'Não registrada';
    const ministers=x.ministradores==='Possui'&&x.ministradoresNomes?`${x.ministradores} · ${x.ministradoresNomes}`:val(x.ministradores);
    const calling=x.chamado==='Possui'&&x.chamadoQual?`${x.chamado} · ${x.chamadoQual}`:val(x.chamado);
    return `<div class="convertCard"><button class="convertToggle" data-convert="${i}"><span><b>${e(x.nome)}</b><small>${e(val(x.statusMembro,'Ativo'))} · Quórum de Élderes</small></span><strong>⌄</strong></button><div class="convertProfile" id="convert-${i}" hidden>${row('Status do membro',x.statusMembro||'Ativo')}${row('Organização',x.organizacao)}${row('Última entrevista / visita',interview)}${row('Sacerdócio',x.sacerdocio)}${row('Recomendação para o templo',x.recomendacao)}${row('Ministradores / amigos',ministers)}${row('Chamado',calling)}${row('Bênção patriarcal',x.bencaoPatriarcal)}<div class="convertSub"><h3>Frequência dominical</h3>${freqRows(x)}</div><div class="convertSub"><h3>Templo</h3>${templeRows(x)}</div></div></div>`;
  }
  window.convertsView=function(){
    const a=Array.isArray(converts)?converts:[];
    return section('Recém-conversos',a.length?a.map(profile).join(''):'<p class="mut">Nenhum recém-converso do Quórum de Élderes encontrado.</p>','Perfil sincronizado automaticamente com o Acompanhamento de Recém-Conversos. A edição continua sendo feita no app de origem.');
  };
  document.addEventListener('click',ev=>{const b=ev.target.closest('[data-convert]');if(!b)return;const p=document.getElementById('convert-'+b.dataset.convert);if(p)p.hidden=!p.hidden});
  async function refreshConverts(){
    if(syncing||!token||!me)return;syncing=true;
    try{
      const j=await call('get');
      const fresh=Array.isArray(j.converts)?j.converts:[];
      const snap=JSON.stringify(fresh);
      if(snap!==lastSnapshot){converts=fresh;lastSnapshot=snap;if(currentTab==='Recém-conversos')renderTab()}
    }catch(err){console.warn('Sincronização de recém-conversos adiada:',err?.message||err)}finally{syncing=false}
  }
  function seed(){lastSnapshot=JSON.stringify(Array.isArray(converts)?converts:[])}
  seed();
  setInterval(refreshConverts,SYNC_MS);
  window.addEventListener('focus',refreshConverts,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshConverts()});
  const style=document.createElement('style');style.textContent=`.convertCard{border-top:1px solid var(--line)}.convertToggle{width:100%;border:0;background:#fff;padding:15px 0;display:flex;justify-content:space-between;align-items:center;text-align:left;color:var(--ink)}.convertToggle b,.convertToggle small{display:block}.convertToggle small{margin-top:3px}.convertProfile{padding:0 0 16px}.convertDetail{display:grid;grid-template-columns:minmax(130px,.8fr) 1.2fr;gap:14px;padding:10px 0;border-top:1px solid #edf0ef}.convertDetail span{font-size:11px;color:var(--mut)}.convertDetail b{font-size:12px;text-align:right}.convertSub{margin-top:15px;padding-top:4px;border-top:2px solid #edf0ef}.convertSub h3{font-size:13px;color:var(--teal);margin:10px 0 5px}.convertHistory{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid #edf0ef;font-size:11px}.convertHistory span{color:var(--mut)}@media(max-width:520px){.convertDetail{grid-template-columns:1fr}.convertDetail b{text-align:left;margin-top:-8px}}`;document.head.appendChild(style);
})();