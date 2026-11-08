(function(){'use strict';
const M=window.NutrientModel,$=id=>document.getElementById(id),ids=['water','mode','rate','step','ph','ec','stop'];
const fmt=(n,d=0)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
let current;
function inputs(){return Object.fromEntries(ids.map(id=>[id,id==='stop'?$(id).checked:$(id).value]));}
function render(){
 const i=inputs(),p=M.plan(i);current={inputs:i,outputs:p};$('rate').disabled=i.mode!=='coir';$('download-mix').disabled=!p.valid;$('recipe').hidden=!p.valid;
 $('verdict').textContent=p.message;$('verdict').className='notice'+(!p.valid?' error':'');$('download-status').textContent='';
 const water=Number(i.water);if(Number.isFinite(water)&&water>=250&&water<=10000)$('water-slider').value=String(water);
 $('water-slider').disabled=water>10000;
 for(const n of [1000,2000,4000,10000])$('batch-'+n).setAttribute('aria-pressed',String(water===n));
 if(!p.valid){$('ocean-out').textContent='—';$('ocean-water').textContent='Fix the batch inputs before comparing quantities.';$('evidence-out').textContent='No usable recipe displayed.';return;}
 $('water-out').textContent=fmt(p.water)+' g';$('litres-out').textContent='≈ '+fmt(p.litres,2)+' L water';$('powder-out').textContent=fmt(p.powder,2)+' g';
 $('scale-out').textContent=fmt(p.rounded,Number(i.step)===1?0:Number(i.step)===0.1?1:2)+' g on your selected scale';
 $('rounding-out').textContent=p.rate?'Exact dose before rounding: '+fmt(p.powder,3)+' g. Scale-rounding difference: '+fmt(p.error,1)+'%. Readability is not verified accuracy.':'No MaxiGro in this batch.';
 $('ratio-out').textContent=p.rate?'1 g powder for every '+fmt(1000/p.rate,0)+' g water':'Water only · 0 g fertilizer';
 $('concentration-label').textContent='Approximate added nitrogen · '+fmt(p.nitrogen)+' mg/L N';$('concentration-marker').style.left=(p.nitrogen/125*100)+'%';$('concentration-chart').setAttribute('aria-label','Selected added nitrogen: '+p.nitrogen+' mg/L, on a 0 to 125 mg/L scale');
 $('strength-out').textContent=fmt(p.rate,2)+' g/L';$('nitrogen-out').textContent=fmt(p.nitrogen)+' mg/L N';$('mixture-out').textContent=fmt(p.mixture,2)+' g';
 const evidence={starter:'Project starter: 50 mg/L added N, derived from the lower end of general microgreen guidance.',comparison:'Project comparison: 100 mg/L added N. Compare repeated trays before adopting it.',reference:'Historical label metric reference: 5 g per 4 L. Higher than the general 50–100 mg/L N guidance; not a proven microgreen optimum.',water:'Plain-water control: no added MaxiGro.'};
 $('evidence-out').textContent=p.rate?evidence[i.rate]:'Plain water selected for this stage, medium or comparison.';
 $('ocean-out').textContent=p.oceanMl===null?'Water only':fmt(p.oceanMl,2)+' mL';$('ocean-water').textContent=p.oceanMl===null?'No nutrient-volume comparison applies to this water-only plan.':'OceanSolution for the same '+fmt(p.water)+' g water, at OTG’s rate.';
}
for(const id of ids)$(id).addEventListener(['mode','rate','step','stop'].includes(id)?'change':'input',render);
$('mix-form').addEventListener('submit',e=>e.preventDefault());
$('water-slider').addEventListener('input',()=>{$('water').value=$('water-slider').value;render();});
for(const n of [1000,2000,4000,10000])$('batch-'+n).addEventListener('click',()=>{$('water').value=n;render();});
$('reset-mix').addEventListener('click',()=>{Object.entries({water:2000,mode:'coir',rate:'starter',step:'0.01',ph:'',ec:''}).forEach(([k,v])=>{$(k).value=v;});$('stop').checked=false;render();});
$('download-mix').addEventListener('click',()=>{if(!current.outputs.valid)return;const p=current.outputs,i=current.inputs;const content=['Grow Lab · MaxiGro mixing card','Recipe evidence: project trial; no crop optimum established.',`Water to weigh: ${p.water} g`,`Exact MaxiGro: ${p.powder.toFixed(3)} g`,`Scale-rounded MaxiGro: ${p.rounded} g (readability ${i.step} g; rounding difference ${p.error.toFixed(1)}%)`,`Rate: ${p.rate} g/L`,`Approximate added N: ${p.nitrogen} mg/L`,`Stage/medium: ${i.mode}`,`Final pH: ${p.ph===null?'not measured':p.ph}`,`Final EC: ${p.ec===null?'not measured':p.ec+' mS/cm'}`,`Interpretation: ${p.message}`,'Dissolve fully. Batch size is not a per-tray watering dose.','Fresh water is approximated as 1 g/mL; final pH and EC are not predicted.','Research: https://samueldovgin.github.io/microgreen-grow-lab/nutrient-guide.html'].join('\n');const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='maxigro-mixing-card.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('download-status').textContent='Mixing card downloaded with the current weights and measurements.';});
window.NutrientApp={snapshot:()=>JSON.parse(JSON.stringify(current))};render();
})();
