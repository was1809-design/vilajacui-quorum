(()=>{
  const val=id=>document.getElementById(id)?.value??'';
  window.saveMeeting=saveMeeting=async function(d){
    const id='m-'+d,x=findMeeting(d);
    const obj={
      sourceDate:d,
      date:val(id+'-date'),
      participantList:PRESIDENCY.filter((p,i)=>document.getElementById(id+'-p'+i)?.checked),
      agenda:val(id+'-agenda').trim()
    };
    if(Object.keys(x).length)Object.assign(x,obj);else state.meetings.push(obj);
    await saveState();
    renderTab();
  };
})();