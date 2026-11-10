(function(){'use strict';
 const $=id=>document.getElementById('hcd-'+id),M=window.HoclDilutionModel;
 const fields=['mode','stock','target','finalVolume','stockVolume','unit','sprays','applications','measuredFinal','ph'],presets=[30,50,70,100,200,300];
 const fmt=n=>Math.abs(n)>0&&Math.abs(n)<.01?Number(n.toPrecision(3)).toString():new Intl.NumberFormat(undefined,{maximumFractionDigits:2}).format(n);
 let current,lastUnit='mL';
 const read=()=>Object.fromEntries(fields.map(id=>[id,$(id).value]));
 function clearMeasurements(){$('measuredFinal').value='';$('ph').value='';}
 function render(){
  const input=read(),r=M.calculate(input);current={input,result:r};
  $('final-control').hidden=input.mode!=='final';$('stock-control').hidden=input.mode!=='stock';
  $('volume-help').textContent=input.mode==='final'?'Finished total, including stock and water.':'Enter the stock you have; final volume is calculated.';
  for(const n of presets)$('target-'+n).setAttribute('aria-pressed',String(Number(input.target)===n));
  $('state').textContent=r.ok?(r.waterMl===0?'No dilution needed at this target.':'Calculated from the entered FAC and selected target.') :r.reason;
  $('state').className='hcd-state'+(!r.ok&&input.stock!==''?' hcd-error':'');
  $('recipe-title').textContent=r.ok?'Make '+fmt(r.finalMl)+' mL':'Your mixing amounts';
  $('stock-out').textContent=r.ok?fmt(r.stockMl)+' mL':'—';$('water-out').textContent=r.ok?fmt(r.waterMl)+' mL':'—';
  $('ratio').textContent=r.ok?'1 part stock + '+fmt(r.waterParts)+' parts water · '+fmt(r.fraction*100)+'% stock':'';
  $('composition').hidden=!r.ok;$('stock-fill').style.width=r.ok?(r.fraction*100)+'%':'0%';
  $('composition').setAttribute('aria-label',r.ok?fmt(r.fraction*100)+' percent stock solution; '+fmt((1-r.fraction)*100)+' percent water':'No dilution calculated');
  $('salt-strength').textContent=r.ok?fmt(r.saltMgMl)+' mg/mL':'—';$('salt-batch').textContent=r.ok?fmt(r.batchSaltMg)+' mg':'—';
  $('salt-tray').textContent=r.ok&&r.load.ok?fmt(r.load.totalSaltMg)+' mg / tray':'—';
  $('salt-status').textContent=r.ok&&!r.load.ok?r.load.reason:r.ok&&r.load.appliedMl>r.finalMl?'This schedule uses '+fmt(r.load.appliedMl)+' mL per tray, more than this batch.':'';
  const v=r.verification;
  $('verification').textContent=v.state==='invalid'?v.message:v.state==='missing'?'Recheck FAC and pH after mixing; neither is measured by this calculator.':(v.fac===null?'Final FAC not recorded.':'Measured FAC: '+fmt(v.fac)+' ppm; '+(v.delta===null?'target unavailable. ':(v.delta>=0?'+':'')+fmt(v.delta)+' ppm from target. '))+(v.ph===null?'Final pH not recorded.':'Measured pH: '+fmt(v.ph)+'.');
  $('copy').disabled=!r.ok;$('copy-status').textContent='';
 }
 $('form').addEventListener('submit',e=>e.preventDefault());
 for(const id of fields)$(id).addEventListener(id==='mode'||id==='unit'?'change':'input',()=>{
  if(id==='unit'){
   const next=$('unit').value,multiplier=lastUnit==='mL'&&next==='L'?.001:lastUnit==='L'&&next==='mL'?1000:1;
   for(const name of ['finalVolume','stockVolume'])if($(name).value!==''&&Number.isFinite(Number($(name).value)))$(name).value=String(Number($(name).value)*multiplier);
   lastUnit=next;
  }else if(!['sprays','applications','measuredFinal','ph'].includes(id))clearMeasurements();
  render();
 });
 for(const n of presets)$('target-'+n).addEventListener('click',()=>{$('target').value=String(n);clearMeasurements();render();});
 $('reset').addEventListener('click',()=>{for(const id of fields)$(id).value=String(M.DEFAULTS[id]);lastUnit='mL';render();});
 $('copy').addEventListener('click',async()=>{
  const {input:i,result:r}=current;if(!r.ok)return;
  const note=['Grow Lab · HOCl dilution calculation',`Stock FAC used: ${fmt(r.stockPpm)} ppm; confirm with a fresh measurement`,`Calculation target: ${fmt(r.targetPpm)} ppm (not a treatment recommendation)`,`Final volume: ${fmt(r.finalMl)} mL`,`Stock solution: ${fmt(r.stockMl)} mL`,`Distilled water: approximately ${fmt(r.waterMl)} mL; add water to the final-volume mark.`,`Ratio: 1 part stock + ${fmt(r.waterParts)} parts water.`,`Salt-equivalent estimate: ${fmt(r.saltMgMl)} mg/mL; ${fmt(r.batchSaltMg)} mg in the batch.`,r.load.ok?`${i.sprays} sprays/application × ${i.applications} applications: ${fmt(r.load.appliedMl)} mL liquid; ${fmt(r.load.totalSaltMg)} mg salt-equivalent per tray.`:'Salt schedule unavailable: '+r.load.reason,'Salt assumes the recorded 6 g/L feed and 0.166 mL per trigger pull; it is not a residual-NaCl assay.',$('verification').textContent,'Use water only for this dilution; follow product directions. Recheck free chlorine and pH after mixing. No crop safety, contact time or antimicrobial effectiveness is established.'].join('\n');
  try{await navigator.clipboard.writeText(note);$('copy-status').textContent='Dilution notes copied.';}catch{$('copy-status').textContent='Clipboard unavailable. Copy the visible amounts.';}
 });
 window.HoclDilutionApp={snapshot:()=>JSON.parse(JSON.stringify(current)),selfTest:M.selfTest};render();
})();
