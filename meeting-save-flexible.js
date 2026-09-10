(()=>{
  const val=id=>document.getElementById(id)?.value??'';
  window.saveMeeting=saveMeeting=async function(d){
    const id='m-'+d,x=findMeeting(d);
    const obj={
      sourceDate:d,
      date:val(id+'-date'),
      thought:val(id+'-thought').trim(),
      openingPrayer:val(id+'-open').trim(),
      closingPrayer:val(id+'-close').trim(),
      participantList:PRESIDENCY.filter((p,i)=>document.getElementById(id+'-p'+i)?.checked),
      agenda:val(id+'-agenda').trim()
    };
    if(Object.keys(x).length)Object.assign(x,obj);else state.meetings.push(obj);
    await saveState();
    renderTab();
  };
})();