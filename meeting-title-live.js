(()=>{
  function br(v){if(!v)return'';const [y,m,d]=v.split('-');return `${d}/${m}/${y}`}
  function updateTitle(input){
    if(!input||!/^m-\d{4}-\d{2}-\d{2}-date$/.test(input.id))return;
    const panel=input.closest('.inlinePlan');
    const row=panel?.closest('.scheduleRow');
    const title=row?.querySelector(':scope > .scheduleToggle b');
    if(!title)return;
    const cycle=input.id.slice(2,-5);
    title.textContent=input.value?`${br(input.value)} · Reunião da Presidência`:`Semana de ${br(cycle)} · Data a definir`;
  }
  document.addEventListener('change',e=>updateTitle(e.target));
  document.addEventListener('input',e=>{if(e.target?.type==='date')updateTitle(e.target)});
})();