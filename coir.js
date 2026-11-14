(function(){
'use strict';
const M=window.CoirModel,$=id=>document.getElementById(id);
const version=()=>$('protocol-version').checked?'new':'old';
const key=()=>version()==='new'?'grow-lab:coir-plan:v2':'grow-lab:coir-plan:v1';
const defaults=()=>M.defaults(version());
let quickCount=1;
const ids=['brickG','brickQt','price','rounding','sampleG','sampleCups','sampleWater','condition'];
let last;
const fmt=(n,d=0)=>Number(n).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const mass=(n,exact=false)=>fmt(n,exact?1:0)+' g';
const water=n=>n>=1000?fmt(n/1000,2)+' L':fmt(n,0)+' mL';
function renderQuickBatch(count){
 quickCount=count;
 const quickTrial=M.calculate(defaults()).rows[0],fresh=version()==='new';
 $('tray-trial-title').textContent=count===1?`Prepare one ${fresh?'':'full '}shallow 1020 tray`:`Prepare ${count} ${fresh?'':'full '}shallow 1020 trays`;
 $('trial-dry').textContent=mass(quickTrial.weighG*count);
 $('trial-water').textContent=fmt(quickTrial.waterMl*count)+' mL';
 $('trial-water-label').textContent=fresh?'Starting water at 3.33 mL/g':'Starting water at 4 mL/g';
 $('trial-volume-label').textContent=fresh?'Estimated expanded coir':'Modeled tray capacity';
 $('trial-volume').textContent=`≈ ${fmt(quickTrial.liters*count,1)} L / ${quickTrial.cups*count} US cups`;
 for(let n=1;n<=4;n++)$('trial-batch-'+n).setAttribute('aria-pressed',String(n===count));
}
for(let n=1;n<=4;n++)$('trial-batch-'+n).addEventListener('click',()=>renderQuickBatch(n));
function read(){return Object.fromEntries([...ids.map(id=>[id,$(id).value]),['version',version()],['fillDefaultVersion',version()==='new'?3:2],['calibration',$('calibration').checked],['rows',M.crops.map(c=>({id:c.id,count:$(c.id+'-count').value,cups:$(c.id+'-cups').value,fill:['moisture','trial'].includes($(c.id+'-fill').value)?$(c.id+'-fill').value:'volume'}))]]);}
function load(s){for(const id of ids)$(id).value=s[id]??defaults()[id];$('calibration').checked=!!s.calibration;M.crops.forEach((c,i)=>{const r=s.rows?.find(r=>r.id===c.id)||defaults().rows[i];$(c.id+'-count').value=r.count;setFill(c.id,r.cups,r.fill);});}
function syncFill(id){const v=$(id+'-cups').value;$(id+'-fill').value=['6','8',String(M.HALF_INCH_CUPS),'12','13.5'].includes(v)?v:'custom';}
function setFill(id,cups,fill){$(id+'-cups').value=cups;if(['trial','moisture'].includes(fill))$(id+'-fill').value=fill;else syncFill(id);}
function useStarter(){defaults().rows.forEach(r=>setFill(r.id,r.cups,r.fill));}
function tray(r){
 const base=158,scale=90,top=base-M.TRAY_HEIGHT_IN*scale,fill=base-r.depthIn*scale,target=top+M.HEADSPACE_TARGET_IN*scale;
 return `<article class="coir-tray-card"><h3>${r.name}</h3><svg viewBox="0 0 260 195" role="img" aria-label="${r.cups} cups: approximately ${fmt(r.depthIn,2)} inch coir in a 1.25 inch tray"><title>${r.name}: approximate coir depth</title><defs><pattern id="fiber-${r.id}" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="#8a6748"/><path d="M1 3l7 3M5 9l6-2" stroke="#b3946c" stroke-width="1"/></pattern></defs><rect x="30" y="${fill}" width="200" height="${r.depthIn*scale}" fill="url(#fiber-${r.id})"/><path d="M25 ${top}V${base+5}H235V${top}" stroke="#294c37" stroke-width="7" fill="none"/><path d="M30 ${fill}H230" stroke="#c3d597" stroke-width="3"/><path d="M30 ${top}H230" stroke="#9caa90" stroke-dasharray="4 4"/><path d="M30 ${target}H230" stroke="#315d43" stroke-dasharray="5 4"/><text x="130" y="22" text-anchor="middle" fill="#637067" font-size="11">1¼″ RIM · ${fmt(r.headroomIn,2)}″ FREE</text><text x="130" y="185" text-anchor="middle" fill="#213c30" font-size="12">${fmt(r.cups,1)} US CUPS / ${fmt(r.liters,2)} L</text></svg><p class="depth">≈ ${fmt(r.depthIn,2)}″ <small>coir</small></p><p>${mass(r.weighG,true)} dry + ${water(r.waterMl)} starting water per tray</p><p class="small">${r.count===0?'Not included in this batch':r.count+' tray'+(r.count===1?'':'s')+' in this batch'}</p></article>`;
}
function render(){
 const s=read(),p=M.calculate(s);last={inputs:s,plan:p};
 M.crops.forEach((c,i)=>{const count=Number(s.rows[i].count);$(c.id+'-remove').disabled=!Number.isFinite(count)||count<=0;$(c.id+'-add').disabled=count>=M.MAX_TRAYS_PER_CROP;});
 const fills=s.rows.map(r=>Number(r.cups)).join('/');
 const isHalfInch=s.rows.every(r=>Number(r.cups)===M.HALF_INCH_CUPS);
 $('fill-mode').textContent=s.rows.every(r=>r.fill==='moisture')?'Shallow-tray moisture trial · 180 g dry coir and 600 mL starting water per tray. Measure expansion and clearance before sowing.':s.rows.every(r=>r.fill==='trial')?'Your full tray is the starting fill. This test increases dry coir and starting water by 10% before rounding. Cup volume describes the modeled tray capacity.':isHalfInch?'½-inch headspace target: about '+M.HALF_INCH_CUPS+' cups per tray by geometry. Check the gap on the leveled coir before sowing.':fills==='6/6/6/6'?'Source baseline: 6 cups for all four crops.':fills==='12/12/8/8'?'Seed-clearance trial: broccoli/radish 12 cups; pea/sunflower 8 cups. The relative fill pattern follows grower practice. The cup amounts are an adaptation.':fills==='8/8/8/8'?'USU-style comparison: 2 US quarts / 8 cups per tray.':'Custom fills. Check the leveled coir and confirm that the cover can contact the seeds evenly.';
 M.crops.forEach((c,i)=>{const {fill,cups}=s.rows[i];$(c.id+'-cups-out').textContent=fill==='trial'||fill==='moisture'?'≈ '+cups+' US cups':fmt(Number(cups),1)+' US cups';$(c.id+'-note').textContent=fill==='moisture'?'Fixed weigh-out. Eight cups is an estimate; check the actual fill.':fill==='trial'?'Full-tray test with 10% extra coir and hydration water. Check cover clearance after leveling.':'Cup-based fill uses the brick label or your measured expansion sample.';});
 $('coir-results').hidden=!p.valid;$('export-coir').disabled=!p.valid||p.empty;
 $('coir-verdict').className='notice'+(!p.valid?' error':'');
 const b=M.calibration(s);$('calibration-tag').textContent=s.calibration?(b.valid?'One measured sample':'Calibration incomplete'):'Label estimate';
 $('calibration-result').textContent=b.valid?`${b.basis}. ${fmt(b.gramsPerCup,3)} g per expanded US cup. ${b.waterBasis}: ${fmt(b.waterRatio,2)} mL/g.`:b.message;
 if(!p.valid){$('coir-verdict').textContent=p.errors.join(' ');$('batch-title').textContent='Check your batch';$('tray-visuals').innerHTML='';$('fill-comparison').innerHTML='';M.crops.forEach(c=>$(c.id+'-facts').textContent='— Check the inputs to recalculate.');return;}
 const batchBasis=p.moistureTrays===p.trays?'Shallow-tray moisture trial':p.moistureTrays?'Mixed fills with shallow-tray moisture trial':p.trialTrays===p.trays?'Full-tray +10% test':p.trialTrays?`${p.trialTrays} full-tray trial fill${p.trialTrays===1?'':'s'} plus cup-based fills`:p.basis.basis;
 $('coir-verdict').textContent=p.empty?'No trays selected. Tap + Add tray on a crop to prepare a batch.':p.shortfallG>0?`This batch exceeds one whole brick by ${mass(p.shortfallG,true)}. Use more coir or reduce the fill/count.`:`${p.trays} tray${p.trays===1?'':'s'} selected · ${batchBasis}. Check expansion and moisture before sowing.`;
 $('batch-title').textContent=p.empty?'Choose your next tray.':`One bucket. ${p.trays===1?'One tray':p.trays+' trays'}.`;
 $('total-coir').textContent=mass(p.dryG,s.rounding==='0');$('total-water').textContent=water(p.waterMl);$('total-volume').textContent=(p.trialTrays||p.moistureTrays?'≈ ':'')+fmt(p.cups,1)+' cups';$('total-volume-sub').textContent=fmt(p.liters,2)+' L / '+fmt(p.quarts,2)+' US qt '+(p.trialTrays===p.trays&&!p.empty?'modeled tray capacity':p.trialTrays||p.moistureTrays?'estimated volume':'expanded target');$('total-cost').textContent='$'+fmt(p.cost,2);
 const ratios=[p.moistureTrays?'Moisture trial uses 3.33 mL/g':'',p.trialTrays?'Full-tray test uses 4 mL/g':'',p.trays>p.moistureTrays+p.trialTrays?`${p.basis.waterBasis}: ${fmt(p.basis.waterRatio,2)} mL/g`:''];
 const waterBasis=ratios.filter(Boolean).join(' · ')+'.';
 $('basis-label').textContent=`${waterBasis} Water follows ${s.rounding==='0'?'exact':'rounded'} dry grams.`;
 $('brick-used').style.width=Math.min(100,p.fraction*100)+'%';$('brick-meter').setAttribute('aria-label',fmt(p.fraction*100,1)+' percent of one dry brick required');
 $('brick-caption').textContent=`${fmt(p.fraction*100,1)}% of a ${mass(Number(s.brickG))} brick · ${mass(p.remainingG,true)} remaining${p.shortfallG>0?' · extra brick material required':''}. This is a batch estimate, not an inventory record.`;
 $('water-sensitivity').textContent=`Sensitivity only: 20% less/more water would be ${water(p.waterSensitivity[0])}–${water(p.waterSensitivity[1])}. This is not a final-water target or confidence interval. The squeeze test decides when to stop.`;
 $('bucket-action').textContent=p.empty?'No coir or water needed.':`Break off ${mass(p.dryG,s.rounding==='0')} dry coir and stage ${water(p.waterMl)} water beside a clean bucket with room for at least ${fmt(p.liters,1)} L of coir plus extra mixing space.`;
 p.rows.forEach(r=>{$(r.id+'-facts').innerHTML=`<span><strong>${mass(r.weighG,s.rounding==='0')}</strong> dry / tray</span><span><strong>${water(r.waterMl)}</strong> water / tray</span><span>≈ <strong>${fmt(r.headroomIn,2)}″</strong> below rim</span><span>${r.count} × = ${mass(r.batchG,s.rounding==='0')} + ${water(r.batchWaterMl)}</span>`;});
 $('tray-visuals').innerHTML=p.rows.map(tray).join('');
 const reasons=['Thin-fill comparison','OTG general shallow-tray baseline','USU 2-quart baseline / clearance-trial large seed','About ½″ below the rim','Near-rim comparison','Earlier ~300 g comparison'];
 $('fill-comparison').innerHTML=p.comparisons.map((r,i)=>`<tr><td><strong>${fmt(r.cups,1)} cups</strong><br>${fmt(r.cups/4,2)} US qt</td><td>${mass(r.exactG,true)} → <strong>${mass(r.weighG,s.rounding==='0')}</strong></td><td>${water(r.waterMl)}</td><td>≈ ${fmt(r.depthIn,2)}″ / ${fmt(r.headroomIn,2)}″</td><td>${reasons[i]}</td></tr>`).join('');
 try{window.localStorage.setItem(key(),JSON.stringify(s));}catch(e){$('coir-export-status').textContent='Browser storage is unavailable. Download a worksheet to retain this plan.';}
}
function exportPlan(){const s=read(),p=M.calculate(s);if(!p.valid||p.empty){$('coir-export-status').textContent='Choose a valid nonempty batch before exporting.';return;}const doc=M.worksheet(s,p);const blob=new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='grow-lab-coir-worksheet.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('coir-export-status').textContent='Downloaded inputs, per-tray grams/water, batch totals and measurement notes.';}
$('coir-form').addEventListener('submit',e=>e.preventDefault());
for(const id of ids)$(id).addEventListener('input',render);
for(const id of ['calibration','condition','rounding'])$(id).addEventListener('change',render);
M.crops.forEach(c=>{
 for(const [action,delta] of [['add',1],['remove',-1]])$(c.id+'-'+action).addEventListener('click',()=>{
  const input=$(c.id+'-count'),current=Number(input.value);
  input.value=Math.min(M.MAX_TRAYS_PER_CROP,Math.max(0,(Number.isFinite(current)?Math.floor(current):0)+delta));
  render();
 });
 $(c.id+'-count').addEventListener('input',render);$(c.id+'-cups').addEventListener('input',()=>{syncFill(c.id);render();});$(c.id+'-fill').addEventListener('change',()=>{const fill=$(c.id+'-fill').value;if(fill!=='custom')$(c.id+'-cups').value=fill==='trial'?M.FULL_TRAY_CUPS:fill==='moisture'?M.moistureTrial.cupsEstimate:fill;render();});});
$('reset-coir').addEventListener('click',()=>{load(defaults());$('coir-export-status').textContent='Starter plan and blank calibration restored.';render();});
$('starter-mix').addEventListener('click',()=>{M.crops.forEach(c=>$(c.id+'-count').value=1);useStarter();render();});
$('use-tray-trial').addEventListener('click',()=>{useStarter();render();});
$('two-trays').addEventListener('click',()=>{M.crops.forEach((c,i)=>$(c.id+'-count').value=i<2?1:0);render();});
for(const [id,cups] of [['fill-half-inch',M.HALF_INCH_CUPS],['fill-six',6],['fill-eight',8],['fill-near',12]])$(id).addEventListener('click',()=>{M.crops.forEach(c=>{$(c.id+'-cups').value=cups;syncFill(c.id);});render();});
$('fill-clearance').addEventListener('click',()=>{M.crops.forEach((c,i)=>{$(c.id+'-cups').value=i<2?12:8;syncFill(c.id);});render();});
$('export-coir').addEventListener('click',exportPlan);$('print-coir').addEventListener('click',()=>window.print());
function loadVersion(){
 $('coir-export-status').textContent='';
 const starter=defaults(),fresh=version()==='new';
$('seed-companions').innerHTML=M.crops.map(c=>`<tr><td>${c.name}<br><small>${c.family}</small></td><td>${c.seedG} g / tray</td><td>${fresh&&c.id==='pea'?'Weigh dry, water-presoak for 6–8 hours, drain and rinse. Soak water is separate.':c.treatment}</td><td>${c.basis}</td></tr>`).join('');
 $('use-tray-trial').textContent=fresh?'Use moisture trial in calculator':'Use full tray in calculator';
 $('starter-mix').textContent=fresh?'Moisture trial · one of each':'Full tray · one of each';
 try{
  const saved=JSON.parse(window.localStorage.getItem(key())||'null');
  if(saved&&M.calculate(saved).valid){
   const fills=saved.rows.map(r=>Number(r.cups)).join('/');
   const oldStarter=!fresh&&(saved.fillDefaultVersion===1?fills==='10/10/10/10':saved.fillDefaultVersion!==2&&['6/6/6/6','6/8/6/8'].includes(fills));
   if(oldStarter&&!saved.calibration){
    saved.rows.forEach(r=>{r.cups=M.FULL_TRAY_CUPS;r.fill='trial';});
    if(String(saved.rounding)==='5')saved.rounding=starter.rounding;
    $('coir-export-status').textContent='Updated the saved starter to your full-tray fill. Your tray counts and brick measurements are retained.';
   }
   load(saved);
  }else load(starter);
 }catch(e){load(starter);}
 renderQuickBatch(quickCount);render();
}
$('protocol-version').checked=true;
$('protocol-version').addEventListener('change',loadVersion);
loadVersion();window.CoirApp={snapshot:()=>last,selfTest:M.selfTest};
})();
