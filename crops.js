(function(){
'use strict';
const D=window.CropData,M=window.CropModel,$=id=>document.getElementById(id);
const R=window.SeedRates,rateStore=R?.createStore({getItem:k=>window.localStorage.getItem(k),setItem:(k,v)=>window.localStorage.setItem(k,v)},D.crops.map(c=>c.id));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=1)=>Number.isFinite(n)?n.toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:0}):'—';
const n=id=>$(id).value.trim()===''?NaN:Number($(id).value);
const nums=['length','width','seedsPerGram','germination','establishment','shootsPerUnit','multiplier','targetShoots','depth','theta','reserve','depletion','wetWeight','currentWeight','measuredBuffer','demand','demandUncertainty','temp','rh','ppfd','hours','ph','ec','coverDays','blackoutDays','harvestDay','bottomStartDay','amShare','weightLb','soakHours','seedPrice','salePrice','otherCost','turnaround'];
const texts=['mode','substrate','waterBasis','airflow','sowDate','sowTime','method','objective'];
let crop=D.crops[0],recipe=crop.alternatives[0],localTrials=null,activeCurve=null,ranked=null,lastPlan=null,extraRecipe=null,weightResetNote='',loggedWaterNote='';
let rateMessage='';
const sourceLink=(id,label)=>{const s=D.sources[id];return s?`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(label||s.title)} ↗</a>`:esc(label||(id==='PERSONAL'?'Your saved trial choice':'Your measured trays'));};
function state(){const s={};nums.forEach(id=>s[id]=n(id));texts.forEach(id=>s[id]=$(id).value);s.showWaterEstimate=!!$('show-water-estimate').checked;s.seedDiameterMm=$('seedDiameterMm').value.trim()===''?null:n('seedDiameterMm');return s;}
function set(id,value){$(id).value=String(value);}
function range(a){return a[0]===a[1]?String(a[0]):a.join('–');}
function notice(text,error=false){return `<p class="notice${error?' error':''}">${esc(text)}</p>`;}
function fillRecipes(selected=crop.alternatives[0].id){
 const all=[...crop.alternatives,...(extraRecipe?[extraRecipe]:[])];
 $('recipe').innerHTML=all.map(r=>`<option value="${esc(r.id)}">${esc(r.label)}</option>`).join('');set('recipe',selected);recipe=all.find(r=>r.id===selected)||all[0];
}
function applyRecipe(){
 loggedWaterNote='';
 recipe=[...crop.alternatives,...(extraRecipe?[extraRecipe]:[])].find(r=>r.id===$('recipe').value)||crop.alternatives[0];
 set('mode','reference');
 set('multiplier',1);
 set('coverDays',Math.round((recipe.cover[0]+recipe.cover[1])/2));
 set('harvestDay',Math.round((recipe.harvest[0]+recipe.harvest[1])/2));
 set('blackoutDays',Math.min(recipe.blackoutDays??0,Math.max(0,n('harvestDay')-n('coverDays')-1)));
 set('method',recipe.method);
 set('weightLb',recipe.weightLb??0);
 const soak=recipe.soak||crop.soakHours;
 set('soakHours',Math.round((soak[0]+soak[1])/2));
 set('demand',crop.calendar.demand);
 set('bottomStartDay',n('coverDays')+n('blackoutDays'));
 set('hours',recipe.lightHours??16);
 if(recipe.substrateId){const sub=D.substrates.find(x=>x.id===recipe.substrateId);set('substrate',sub.id);set('depth',sub.depth);set('theta',sub.theta*100);set('reserve',0);}
 if(recipe.substrateDepth!==undefined)set('depth',recipe.substrateDepth);
 if(recipe.substrateTheta!==undefined)set('theta',recipe.substrateTheta);
 if(recipe.substrateReserve!==undefined)set('reserve',recipe.substrateReserve);
 set('waterBasis','scenario');weightResetNote='Crop/source changes reset measured-water mode. Reweigh this specific tray and root-zone setup before calculating a refill.';
 const s=state(),d=M.density(s,crop,recipe);if(d)set('targetShoots',Math.min(150,Math.max(.1,Math.round(d.shootsIn2*10)/10)));
 render();
}
function chooseCrop(id){
 crop=D.crops.find(c=>c.id===id)||D.crops[0];set('crop',crop.id);extraRecipe=null;localTrials=null;
 const saved=rateStore?.latest(crop.id);if(saved)extraRecipe={...saved.recipe,id:'personal-rate',label:'My saved trial · '+fmt(saved.toGrams,1)+' g/200 in²',source:'PERSONAL',confidence:'Personal trial · evaluate measured yields'};
 rateMessage='';for(const id of ['rate-grams','rate-lot','rate-reason','rate-evidence'])if($(id))set(id,'');
 set('seedDiameterMm','');set('seedsPerGram',crop.seedsPerGram);set('germination',95);set('establishment',90);set('shootsPerUnit',1);set('trials','');$('trial-status').textContent='Use one crop, substrate, lot and harvest stage per comparison. Include failed trays as zero saleable grams.';
 fillRecipes(saved?'personal-rate':crop.alternatives[0].id);fillCurves();applyRecipe();
}
function filterCrops(){
 const family=$('family-filter').value,list=D.crops.filter(c=>family==='all'||c.family===family);
 $('crop').innerHTML=list.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}${c.includedPacket?' (includes '+esc(c.includedPacket)+')':''}</option>`).join('');
 chooseCrop(list.some(c=>c.id===crop.id)?crop.id:list[0].id);
}
function fillCurves(){
 $('curve').innerHTML='<option value="">Select a study or enter your own results</option>'+D.curves.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')+(localTrials?'<option value="local">Your comparable tray results</option>':'');
 const matched=D.curves.find(c=>c.crop===crop.id);set('curve',localTrials?'local':matched?matched.id:'');
}
function labelOutputs(s){
 const suffix={length:' in',width:' in',bottomStartDay:' d',amShare:'%',germination:'%',establishment:'%',depletion:'%',theta:'%',demandUncertainty:'%',reserve:' mL',depth:' in',temp:'°C',rh:'%',ppfd:'',hours:' h',coverDays:' d',blackoutDays:' d',harvestDay:' d',weightLb:' lb',soakHours:' h',demand:' mm/d',seedPrice:' $/kg',salePrice:' $/kg',otherCost:' $/m²',turnaround:' d',targetShoots:'/in²',ph:'',ec:' mS/cm'};
 for(const id of nums){const out=$(id+'-out');if(out)out.textContent=id==='multiplier'?fmt(s[id]*100,0)+'%':fmt(s[id],id==='depth'?2:1)+(suffix[id]||'');}
}
function seedMap(d,s){
 if(!d){$('seed-map').innerHTML='';$('seed-map-caption').textContent='Enter valid tray and seed-lot inputs to draw the tray.';return;}
 const diameter=s.seedDiameterMm===null?M.seedDiameter(s.seedsPerGram):s.seedDiameterMm;
 if(!Number.isFinite(diameter)||diameter<.3||diameter>30){$('seed-map').innerHTML='';$('seed-map-caption').textContent='Enter a seed dot diameter from 0.3 to 30 mm, or leave it blank for automatic sizing.';return;}
 const w=590,h=w*s.width/s.length,top=37,pad=55,count=Math.min(12000,Math.max(1,Math.round(d.units))),r=diameter/25.4*w/s.length/2;
 let dots='';let z=7457;const random=()=>{z=(z*1664525+1013904223)>>>0;return z/4294967296;};
 for(let i=0;i<count;i++){const x=pad+r+random()*Math.max(0,w-2*r),y=top+r+random()*Math.max(0,h-2*r);dots+=`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(3)}" fill="${i/count<s.germination/100?'#527a48':'#a69779'}" opacity=".8"/>`;}
 $('seed-map').setAttribute('viewBox',`0 0 700 ${h+90}`);
 $('seed-map').innerHTML=`<title>Seed distribution on ${fmt(s.length)} by ${fmt(s.width)} inch planted surface; illustrative seed diameter ${fmt(diameter,1)} mm</title><rect x="${pad-7}" y="${top-7}" width="${w+14}" height="${h+14}" rx="12" fill="#e1e6d4" stroke="#81936c"/><rect x="${pad}" y="${top}" width="${w}" height="${h}" rx="4" fill="#f5f3e5"/>${dots}<text x="350" y="20" text-anchor="middle">${fmt(s.length)}″ USABLE LENGTH</text><text x="350" y="${h+72}" text-anchor="middle">${fmt(d.area.in2)} in² · ${fmt(d.area.cm2,0)} cm² · ${fmt(d.area.m2,4)} m²</text>`;
 $('seed-map-caption').textContent=`Seed dots: ${fmt(diameter,1)} mm across, scaled to the tray. ${s.seedDiameterMm===null?'Automatic size is a spherical illustration from units/g at an assumed 1 g/cm³; enter a measured diameter to match your lot.':'Using your entered diameter.'} ${d.units>12000?'Showing a 12,000-unit sample of '+fmt(d.units,0)+' planting units; crowding is understated.':'One dot per planting unit (rounded).'} Green = potentially viable; muted = assumed germination loss. Scatter may overlap; seed shape and canopy growth are not simulated.`;
}
function renderSeed(s,d){
 $('count-controls').hidden=s.mode!=='count';
 $('species-line').textContent=crop.family+' / '+crop.species;
 $('crop-title').textContent=crop.name;
 $('included-packet').hidden=!crop.includedPacket;
 $('included-packet').textContent=crop.ownedPacket?'Your packet: '+crop.ownedPacket.name+' · True Leaf Market. The selected coir starter and named supplier alternatives keep their own rates and methods.':crop.includedPacket?'Includes '+crop.includedPacket+'. Select its True Leaf recipe for packet-specific settings.':'';
 $('confidence').textContent=recipe.id==='tested'?'Tested rate · context applies':recipe.id==='comparison'?'Starting rate from seed comparison':recipe.confidence||crop.confidence;
 $('source-context').innerHTML=sourceLink(recipe.source)+' · '+esc(recipe.note||crop.notes||'A published starting rate, scaled by usable surface area.')+' Source crop settings are restored where documented; depth, emergence assumptions and top load remain editable planning examples.';
 $('seed-size-basis').textContent=crop.seedSizeBasis+'. '+crop.seedForm+'. Count and weigh a representative sample; units/g = sample count ÷ dry grams.';
 $('mode-explanation').textContent=s.mode==='count'?'Compensates for measured germination and establishment to reach your selected emerged-shoot target. The target itself needs local validation.':'Area-scales the source’s dry seed rate. Germination changes the expected stand; it does not automatically inflate an already empirical mass recipe.';
 const notes=[];
 if(!d){$('seed-result').textContent='—';$('shoot-result').textContent='—';$('seed-rate-result').textContent='Check inputs';$('stand-result').textContent='';$('seed-equation').textContent='Enter valid tray dimensions and lot inputs.';notes.push(notice('Check the tray area and positive seed-lot inputs. A zero/blank seed count or invalid emergence value cannot be calculated.',true));}
 else{
  $('seed-result').textContent=fmt(d.grams,1)+' g';$('seed-rate-result').textContent=fmt(d.grams/28.349523125,2)+' oz · '+fmt(d.grams/d.area.in2,4)+' g/in² · '+fmt(d.gramsM2,0)+' g/m²';
  $('shoot-result').textContent='≈ '+fmt(d.shoots,0);$('stand-result').textContent=fmt(d.shootsIn2,1)+' shoots/in² · '+fmt(d.units,0)+' units sown';
  $('seed-equation').textContent=d.formula+' = '+fmt(d.grams,2)+' g dry seed. Expected stand = '+fmt(d.grams,2)+' × '+fmt(s.seedsPerGram,2)+' × '+fmt(s.germination/100,2)+' × '+fmt(s.establishment/100,2)+' × '+fmt(s.shootsPerUnit,1)+'.';
  if(s.mode==='count')notes.push(notice('Count mode maintains the chosen emerged population. Extra nonemerging seed can still create crowding and decay; investigate low lot performance before compensating with more seed.'));
  else notes.push(notice('Default = source-anchored calculation, not a universal biological optimum. Other media, cultivars, harvest stages and local results may justify a different tested rate.'));
  if(crop.sownCountCm2&&recipe.id==='baseline')notes.push(notice('Study target is 3 seeds SOWN/cm². Mass changes with units/g; germination is not divided into this sown-count target. Seed size remains an estimate until your lot is measured.'));
  if(crop.seedForm!=='single seed')notes.push(notice('Count-unit exception: '+crop.seedForm+'. A gram-to-unit conversion is not automatically a gram-to-plant conversion. Measure shoots per viable unit.'));
  if(s.multiplier!==1)notes.push(notice('You are testing '+fmt(s.multiplier*100,0)+'% of the selected source rate. This trial change has no validated yield forecast.'));
 }
 if(['mung','lentil'].includes(crop.id))notes.push(notice('Research pilot: agronomic density evidence exists, but raw-food safety remains unresolved in the archive. This growing plan does not establish a safe serving stage.'));
 if(crop.id==='soybean')notes.push(notice('150 g is a starting trial within a supplier range equivalent to 133–178 g per nominal 1020, not a verified optimum. Separate studies use about 0.5 and 2 seeds/cm²; do not average those methods. Count and weigh your lot; soaking does not establish a safe raw serving stage.'));
 if(crop.id==='fenugreek'&&recipe.id==='baseline')notes.push(notice('The fenugreek paper’s tray dimensions conflict. Treat 25 g as a nominal-tray test, without an area-yield forecast.'));
 $('seed-notices').innerHTML=notes.join('');
 $('harvest-result').textContent='Day '+fmt(s.harvestDay,0);$('cover-result').textContent=fmt(s.coverDays,0)+' d emergence + '+fmt(s.blackoutDays,0)+' d loose blackout';
 $('recipe-table').innerHTML=crop.alternatives.map(r=>{
  const grams=crop.sownCountCm2&&r.id==='baseline'&&d?crop.sownCountCm2*d.area.cm2/s.seedsPerGram:r.grams*(d?d.area.in2:200)/r.area;
  return `<tr><td>${esc(r.label)}<br><small>${esc(r.note||'Nominal source recipe')}</small></td><td>${fmt(grams,1)} g</td><td>${range(r.harvest)} d</td><td>${sourceLink(r.source,r.source)}</td></tr>`;
 }).join('');seedMap(d,s);
}
function waterChart(s,w){
 if(!w){$('water-chart').innerHTML='';return;}
 const reserve=w.measured?s.measuredBuffer:w.storedMl,maxT=Math.min(120,Math.max(12,w.fastHours*2)),x=t=>55+t/maxT*590,y=v=>245-(reserve>0?v/reserve:0)*200,threshold=reserve*(1-s.depletion/100);
 let svg=`<title>Illustrative root-zone water storage under uncertain demand</title><path d="M55 40V245H645" fill="none" stroke="#a4ae98"/><path d="M55 ${y(threshold)}H645" stroke="#b68c42" stroke-dasharray="5 4"/><text x="640" y="${y(threshold)-8}" text-anchor="end">refill-check trigger</text>`;
 for(const [rate,color] of [[w.lowDailyMl,'#9da674'],[w.dailyMl,'#315d43'],[w.highDailyMl,'#a4774d']]){
  let points='';for(let i=0;i<=80;i++){const t=maxT*i/80,v=Math.max(0,reserve-rate*t/24);points+=(i?'L':'M')+x(t).toFixed(2)+' '+y(v).toFixed(2);}
  svg+=`<path d="${points}" stroke="${color}" stroke-width="2.5" fill="none"/>`;
 }
 for(let i=0;i<=4;i++){const t=maxT*i/4;svg+=`<text x="${x(t)}" y="266" text-anchor="middle">${fmt(t,0)} h</text>`;}
 svg+=`<text x="55" y="22">${fmt(reserve,0)} mL starting reserve</text><text x="350" y="294" text-anchor="middle">LOW DEMAND / CENTRAL / HIGH DEMAND · NO REFILLS SHOWN</text>`;
 $('water-chart').innerHTML=svg;
 $('water-chart-caption').textContent='Constant late-crop demand sensitivity, starting at the selected full reserve. This is an illustrative drawdown graph, not predicted plant water stress. Reservoir access, pore aeration and early seed-surface drying are separate.';
}
function renderWater(s,w){
 const sub=D.substrates.find(x=>x.id===s.substrate),c=M.climate(s.temp,s.rh,s.ppfd,s.hours);$('measured-water').hidden=s.waterBasis!=='measured';$('substrate-note').textContent=sub.note;$('capacity-basis').textContent=sub.capacityBasis;
 const notes=[];
 if(!w){['volume-result','demand-result','refill-result'].forEach(id=>$(id).textContent='—');$('capacity-result').textContent='';$('demand-band').textContent='';$('refill-context').textContent='Check water and environment inputs';notes.push(notice('Invalid water-balance inputs. Check depth, capacity, reserve and demand.',true));}
 else{
  $('volume-result').textContent=fmt(w.volumeL,2)+' L';$('capacity-result').textContent=fmt(w.storedMl,0)+' mL modeled root-zone reserve';
  $('demand-result').textContent=fmt(w.dailyMl,0)+' mL/d';$('demand-band').textContent=fmt(w.lowDailyMl,0)+'–'+fmt(w.highDailyMl,0)+' mL/day sensitivity';
  if(w.error){$('refill-result').textContent='Check weights';$('refill-context').textContent=w.error;notes.push(notice(w.error,true));}
  else if(w.measured){$('refill-label').textContent='Calculated refill now';$('refill-result').textContent=fmt(w.refillMl,0)+' mL';$('refill-context').textContent='Trigger ≤ '+fmt(w.triggerWeight,0)+' g; deficit '+fmt(w.deficitMl,0)+' mL.';notes.push(notice('Measured-weight mode: these weights must be your current measurements. Add in portions, allow uptake/drainage and reweigh; do not leave roots unintentionally submerged.'));}
  else{$('refill-label').textContent='Time to check trigger';$('refill-result').textContent=w.storedMl>0?fmt(w.hoursToTrigger,0)+' h':'No reserve';$('refill-context').textContent=w.storedMl>0?fmt(w.fastHours,0)+'–'+fmt(w.slowHours,0)+' h under demand sensitivity':'Add an accessible reservoir or use a measured root-zone protocol.';notes.push(notice('Illustrative mode: capacity, depletion threshold and demand are assumptions. No automatic mL-per-watering prescription is generated.'));}
  if(w.fastHours<12)notes.push(notice('The high-demand scenario reaches the check trigger in under 12 hours. A shallow mat, drying airflow or inaccessible reservoir calls for more frequent observation or a different root-zone setup.'));
  if(s.substrate==='reusable'&&s.reserve===0)notes.push(notice('Nonabsorbent mesh has no bulk substrate water reserve in this model. Germinating seeds still need surface moisture before roots can reach a reservoir.',true));
 }
 if(c){notes.push(notice('Climate diagnostics: air VPD '+fmt(c.vpd,2)+' kPa · DLI '+fmt(c.dli,2)+' mol/m²/day. These change crop behavior but do not mathematically determine evapotranspiration or seed-density corrections.'));}
 if(s.rh>=75||s.airflow==='stagnant')notes.push(notice('High humidity or still canopy air: inspect condensation, media saturation and dense patches. The calculator does not assign a pathogen risk score or a “safe density.”'));
 if(s.airflow==='strong')notes.push(notice('Strong airflow can increase local drying. Measure corner-versus-center tray loss and surface moisture rather than applying a universal airflow multiplier.'));
 if(s.ec>2)notes.push(notice('Check the species and medium before using this EC. This is a recorded scenario, not a nutrient recipe or target.'));
 if(weightResetNote&&s.waterBasis==='scenario')notes.push(notice(weightResetNote));
 if(loggedWaterNote)notes.push(notice(loggedWaterNote));
 $('water-notices').innerHTML=notes.join('');waterChart(s,w);
}
function renderSchedule(s,rows){
 const g=D.groups[crop.group];$('group-label').textContent=crop.family+' / '+g.name;$('protocol-title').textContent=g.name;$('protocol-exception').textContent=g.exception;
 const readiness=M.lightReadiness(s,crop);
 const items=[['Sow',(recipe.topdress??crop.topdress)?'Sow evenly and use a thin species-appropriate top dress; do not bury fine seeds indiscriminately.':'Evenly surface-sow on a level, moistened medium. Keep clumps and multi-layer seed piles out of the tray.'],['Uncover / light readiness',readiness.action],['Water checks',g.water],['Harvest cue',g.stage]];
 $('protocol-steps').innerHTML=items.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
 const soak=recipe.soak||crop.soakHours;
 $('soak-note').textContent=`Recipe: ${soak[1]===0?'direct sow':range(soak)+' h presoak'}. ${recipe.soakBasis||'Use the selected crop preparation.'}`;
 $('cover-load-note').textContent=recipe.weightBasis||'Use a load appropriate to this recipe and tray.';
 $('calendar-source-basis').innerHTML=(recipe.calendarSources||crop.calendar.waterSources).map(id=>sourceLink(id)).join(' · ');
 $('demand-basis').textContent=crop.calendar.waterBasis+' Default '+fmt(crop.calendar.demand,1)+' mm/day. Change it using your own tray observations.';
 const broccoli=crop.id==='broccoli';
 $('broccoli-cover-note').hidden=!broccoli;
 const flags=[];
 if(broccoli&&s.method!=='dome'&&s.weightLb===15)flags.push('You selected 15 lb. For your first broccoli tray, set Added top load to 0 lb and use the empty cover tray alone.');
 if(s.soakHours>0&&['basil-genovese','basil-dark-opal','basil-italian','basil-red-rubin','basil-lemon','chia'].includes(crop.id))flags.push('Mucilaginous-seed override: this selected recipe direct-sows. A free-water presoak can create unspreadable clumps.');
 if(s.method==='dome'&&s.weightLb>0)flags.push('A humidity dome is not a contact stack. Remove the added load or select a supported contact-cover method.');
 if(s.method!==recipe.method)flags.push('Covered method differs from this source recipe; treat it as a separate method trial.');
 if(s.harvestDay<recipe.harvest[0]||s.harvestDay>recipe.harvest[1])flags.push('Harvest day is outside this source’s reported window; inspect actual leaf stage and do not assume the source yield applies.');
 if(s.blackoutDays!==(recipe.blackoutDays??0))flags.push('Loose blackout differs from the selected recipe. Use the actual stand to time the transition.');
 if(!rows){for(const id of ['schedule-am','schedule-pm','schedule-daily'])$(id).hidden=true;$('watering-calendar').innerHTML='';$('watering-transition').textContent='Check the sowing date/time, presoak, cover and bottom-watering settings.';$('schedule-body').innerHTML='<tr><td colspan="3">Check the schedule controls and make sure cover and stretch end before harvest.</td></tr>';$('schedule-chart').innerHTML='';$('schedule-note').textContent='Invalid schedule: covered emergence plus stretch must end before harvest; the first bottom-watering day must be between cover removal and harvest.';return;}
 const x=d=>45+d/s.harvestDay*660,width=d=>d/s.harvestDay*660,start=s.coverDays+s.blackoutDays;
 $('schedule-chart').innerHTML=`<title>Growing phases over ${s.harvestDay} days after sowing</title><rect x="45" y="42" width="${width(s.coverDays)}" height="36" rx="3" fill="#a5ae87"/>${s.blackoutDays?`<rect x="${x(s.coverDays)}" y="42" width="${width(s.blackoutDays)}" height="36" fill="#647351"/>`:''}<rect x="${x(start)}" y="42" width="${width(s.harvestDay-start)}" height="36" rx="3" fill="#b9cf81"/><text x="45" y="25">COVERED ${s.coverDays} d · STRETCH ${s.blackoutDays} d · LIGHT ${s.harvestDay-start} d</text><text x="45" y="104">Day 0</text><text x="705" y="104" text-anchor="end">Day ${s.harvestDay}</text><text x="45" y="137">${esc(s.sowDate)} → ${esc(M.dateAt(s.sowDate,s.harvestDay))} · ${s.hours} h light/day after emergence</text>`;
 const prep=rows.find(r=>r.phase==='presoak');
 const prepText=prep?`Presoak starts ${prep.date} at ${prep.time} for ${s.soakHours} h. Drain and rinse before sowing.`:crop.id==='sunflower'?'Rinse, drain and sow on day 0.':'Direct sow on day 0.';
 const blackoutText=s.blackoutDays?`After ${s.coverDays} covered days, remove the contact tray and any load. Allow ${s.blackoutDays} d under a loose unweighted blackout cover.`:'This recipe goes directly to lights after covered emergence.';
 $('schedule-note').textContent=[prepText,blackoutText,`Estimated light-transition height: ${readiness.height} above the medium. ${readiness.basis}`,'Dates are planning checkpoints. Use actual emergence and root anchoring; if uncovering is delayed, update covered/blackout days to shift later tasks. Once uncovered, continue under lights.',...flags].join(' ');
 $('watering-transition').textContent=`First planned bottom-water check: D${s.bottomStartDay} (${M.dateAt(s.sowDate,s.bottomStartDay)}). Water only if the tray needs it and the medium can wick from below. Until the switch, lightly mist a drying seed surface as needed.`;
 const method=r=>r.wateringMethod==='prep'?'Seed prep':r.wateringMethod==='spray'?(r.day===0?'Mist at sowing':'Mist only if drying'):'Bottom-water check';
 const volume=(cups,ml)=>cups===null?'—':`≈ ${fmt(cups,2)} cups <small>(${fmt(ml,0)} mL)</small>`;
 const budget=r=>r.dailyCups===null?'—':`${fmt(r.dailyCups,2)} cups <small>${fmt(r.lowCups,2)}–${fmt(r.highCups,2)} cups sensitivity</small>`;
 const dayLabel=r=>r.phase==='presoak'?'Prep':'D'+r.day;
 for(const id of ['schedule-am','schedule-pm','schedule-daily'])$(id).hidden=!s.showWaterEstimate;
 $('schedule-body').innerHTML=rows.map(r=>`<tr><td><strong>${dayLabel(r)}</strong><br><small>${esc(r.date)}${r.time?' · '+r.time:''}</small></td><td>${esc(r.stage)}<br><strong>${method(r)}</strong></td><td>${esc(r.action)}</td>${s.showWaterEstimate?`<td>${volume(r.amCups,r.amMl)}</td><td>${volume(r.pmCups,r.pmMl)}</td><td>${budget(r)}</td>`:''}</tr>`).join('');
 const byDate=new Map();
 for(const r of rows){
  if(!byDate.has(r.date))byDate.set(r.date,[]);
  byDate.get(r.date).push(r);
 }
 const offset=new Date(rows[0].date+'T12:00:00Z').getUTCDay();
 let cells=Array.from({length:offset},()=>'<div class="calendar-empty" aria-hidden="true"></div>').join('');
 for(const [date,events] of byDate){
  const monthDay=new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
  cells+='<div class="calendar-cell">'+events.map(r=>{
   const estimate=r.dailyCups===null?'':`<p class="calendar-total">${r.phase==='harvest'?'Budget if still growing':'Daily budget'} <strong>${budget(r)}</strong></p><dl class="calendar-volumes"><dt>Morning estimate</dt><dd>${volume(r.amCups,r.amMl)}</dd><dt>Late-day estimate</dt><dd>${volume(r.pmCups,r.pmMl)}</dd></dl>`;
   return `<article class="calendar-day ${r.wateringMethod}${r.phase==='blackout'?' blackout':''}${r.day===s.bottomStartDay?' switch-day':''}"><div class="calendar-date"><time datetime="${r.date}${r.time?'T'+r.time:''}">${monthDay}${r.time?' · '+r.time:''}</time><strong>${dayLabel(r)}</strong></div><p class="calendar-phase">${esc(r.stage)}</p><span class="water-method">${method(r)}</span><p class="calendar-cue">${esc(r.cue)}</p>${estimate}<details class="calendar-instructions"><summary>Instructions</summary><p>${esc(r.action)}</p></details></article>`;
  }).join('')+'</div>';
 }
 const trailing=(7-(offset+byDate.size)%7)%7;
 cells+=Array.from({length:trailing},()=>'<div class="calendar-empty" aria-hidden="true"></div>').join('');
 $('watering-calendar').innerHTML='<div class="calendar-grid">'+['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day=>`<div class="calendar-weekday">${day}</div>`).join('')+cells+'</div>';

}
function renderOptimization(s,d){
 const id=$('curve').value;activeCurve=id==='local'&&localTrials?{...localTrials,kind:'local',source:'LOCAL',crop:crop.id}:D.curves.find(c=>c.id===id)||null;ranked=null;
 $('apply-optimum').hidden=true;
 if(!activeCurve){$('curve-context').textContent='No matched response curve is required to use the source-based starting plan. One published recipe is not enough to fit a yield response.';$('optimum-result').textContent='A local optimum needs comparable tray results.';$('optimum-note').textContent='Choose a study for inspection, or enter your own independent trials below. The default seed plan does not invent a yield curve.';$('yield-chart').innerHTML='';$('optimization-body').innerHTML='';return;}
 $('curve-context').innerHTML=esc(activeCurve.context)+' '+sourceLink(activeCurve.source,activeCurve.source);
 ranked=M.rank(activeCurve.points,{seedPrice:s.seedPrice,salePrice:s.salePrice,otherCost:s.otherCost,turnaround:s.turnaround,goal:s.objective});
 if(!ranked){$('optimum-result').textContent='Check dataset or cost inputs';$('optimum-note').textContent='Cannot rank invalid or incomplete comparable observations.';return;}
 const best=ranked.best,a=d?d.area.m2:M.area(s.length,s.width)?.m2;
 $('winner-label').textContent=activeCurve.kind==='local'?'Best observed local treatment · provisional':'Best tested study treatment · context-specific';
 $('optimum-result').textContent=fmt(best.seedGm2,0)+' g/m²'+(a?' · '+fmt(best.seedGm2*a,1)+' g at your area':'');
 const limitations=[activeCurve.kind==='study'?'Fresh-biomass results, not a saleable-yield forecast for your shelf.':'Saleable-yield means; replicate variability and new cycles can change this ranking.',ranked.boundary?'Winner is the highest tested density: the experiment has not located an upper optimum.':'Winner selected only among observed treatments; no interpolation/extrapolation.',ranked.allNegative?'All tested contributions are negative at these prices and costs.':'',activeCurve.crop!==crop.id?'Different crop/cultivar context: inspect only; cannot apply to the current plan.':''];
 $('optimum-note').textContent=limitations.filter(Boolean).join(' ');
 $('apply-optimum').hidden=activeCurve.crop!==crop.id;
 const pts=[...activeCurve.points].sort((a,b)=>a.seedGm2-b.seedGm2),maxX=Math.max(...pts.map(p=>p.seedGm2))*1.1,maxY=Math.max(1,...pts.map(p=>p.yieldGm2))*1.16,x=v=>60+v/maxX*570,y=v=>245-v/maxY*200;
 let svg='<title>Observed yield against seed density, no extrapolation</title><path d="M60 40V245H640" fill="none" stroke="#9aa58c"/>';
 for(let i=0;i<=4;i++)svg+=`<text x="${x(maxX*i/4)}" y="266" text-anchor="middle">${fmt(maxX*i/4,0)}</text><text x="50" y="${y(maxY*i/4)+4}" text-anchor="end">${fmt(maxY*i/4,0)}</text>`;
 for(const p of pts){if(p.sd!==undefined&&p.sd!==null)svg+=`<path d="M${x(p.seedGm2)} ${y(Math.max(0,p.yieldGm2-p.sd))}V${y(p.yieldGm2+p.sd)}" stroke="#80966f"/>`;svg+=`<circle cx="${x(p.seedGm2)}" cy="${y(p.yieldGm2)}" r="${p===best?7:5}" fill="${p.seedGm2===best.seedGm2&&p.days===best.days?'#365e42':'#9eae76'}"/><text x="${x(p.seedGm2)}" y="${y(p.yieldGm2)-13}" text-anchor="middle">${fmt(p.yieldGm2,0)}</text>`;}
 svg+='<text x="350" y="295" text-anchor="middle">SEED g/m² → HARVEST g/m² · POINTS ARE OBSERVED MEANS</text>';$('yield-chart').innerHTML=svg;
 $('optimization-body').innerHTML=ranked.ranked.map(p=>`<tr><td>${fmt(p.seedGm2,1)}</td><td>${fmt(p.yieldGm2,0)}</td><td>${p.n?`${p.n} / SD ${p.sd===null?'—':fmt(p.sd,0)}`:'Study mean; raw replicate spread not imported'}</td><td>${fmt(p.score,2)}</td></tr>`).join('');
}
function renderSources(){
 const ids=[...new Set([recipe.source,crop.seedSizeSource,'D01','D06','D07','D09','D16','V17',...(recipe.calendarSources||crop.calendar.waterSources)].filter(Boolean))];
 $('selected-sources').innerHTML=ids.map(id=>D.sources[id]?`<div><span class="eyebrow">${esc(id)} / ${esc(D.sources[id].kind)}</span><p>${sourceLink(id)}</p><p>${esc(D.sources[id].note)}</p></div>`:'').join('');
}
function render(){
 const s=state(),d=M.density(s,crop,recipe),w=M.water(s),rows=M.schedule(s,crop,recipe,d);labelOutputs(s);renderSeed(s,d);renderWater(s,w);renderSchedule(s,rows);renderOptimization(s,d);renderSources();
 lastPlan={version:D.version,crop:{id:crop.id,name:crop.name,packetName:recipe.packetName||crop.ownedPacket?.name||null,species:crop.species,family:crop.family,protocolGroup:crop.group},sourceRecipe:recipe,inputs:s,density:d,water:w,schedule:rows,wateringPlan:{cupMl:M.CUP_ML,amSharePercent:s.amShare,bottomStartDay:s.bottomStartDay,volumeBasis:'Editable crop/family loss scenario split between morning and late day. The range is sensitivity to the demand input. Check moisture and wicking before watering.'},optimizer:activeCurve?{source:activeCurve.source,context:activeCurve.context,ranking:ranked}:null,evidenceBoundary:'Published starting plan and measured arithmetic; no universal agronomic optimum. All unmeasured seed sizes, capacities and demand inputs are illustrative.',sourceRecords:[...new Set([recipe.source,crop.seedSizeSource,'D01','D09','D16',...(recipe.calendarSources||crop.calendar.waterSources)].filter(Boolean))].map(id=>D.sources[id]).filter(Boolean)};
 lastPlan.seedRateRevision={published:D.seedRateHistory?.entries.filter(e=>e.cropId===crop.id).slice(-1)[0]||null,personal:recipe.id==='personal-rate'?rateStore?.latest(crop.id):null};
 renderRateHistory(s);renderOwnedRates();
}
function publishedGrams(c){const r=c.alternatives[0];return c.sownCountCm2&&r.id==='baseline'?c.sownCountCm2*1290.32/c.seedsPerGram:r.grams*200/r.area;}
function renderOwnedRates(){for(const p of D.ownedPackets||[]){const el=$('owned-'+p.cropId+'-rate'),c=D.crops.find(c=>c.id===p.cropId);if(el)el.textContent=fmt(rateStore?.latest(p.cropId)?.toGrams??publishedGrams(c),1)+' g';}}
function renderRateHistory(s){
 if(!$('rate-history-body'))return;
 const published=(D.seedRateHistory?.entries||[]).filter(e=>e.cropId===crop.id),personal=(rateStore?.read().entries||[]).filter(e=>e.cropId===crop.id);
 const entries=[...published.map(e=>({...e,scope:'Website',order:e.changedAt||e.date+'T00:00:00Z'})),...personal.map(e=>({...e,scope:'My trial',date:new Date(e.changedAt).toLocaleDateString('en-CA'),order:e.changedAt}))].sort((a,b)=>b.date.localeCompare(a.date)||Date.parse(b.order)-Date.parse(a.order));
 $('rate-history-body').innerHTML=entries.map(e=>`<tr><td>${esc(e.date)}<br><small>${esc(e.scope)}</small></td><td>${e.fromGrams===null?'Initial':fmt(e.fromGrams,1)+' g'} → ${fmt(e.toGrams,1)} g</td><td>${esc(e.reason)}${e.seedLot?'<br>Lot: '+esc(e.seedLot):''}${e.evidence?'<br><small>'+esc(e.evidence)+'</small>':''}</td></tr>`).join('');
 const latest=rateStore?.latest(crop.id);$('rate-current-basis').textContent='Website default: '+fmt(publishedGrams(crop),1)+' g/200 in².'+(latest?' Your saved next-trial default: '+fmt(latest.toGrams,1)+' g/200 in².':' No personal override saved in this browser.');
 $('rate-area-note').textContent='For your entered '+fmt(s.length*s.width,2)+' in² tray. History also keeps its equivalent g/200 in² so different areas are not confused.';
 $('rate-history-status').textContent=rateMessage||rateStore?.status().error||'Personal revisions stay in this browser. Export a backup to move them to another browser or device.';
}
function startFromNow(cropId){
 set('family-filter','all');filterCrops();set('length',20);set('width',10);chooseCrop(cropId);
 const prep=new Date(),sow=new Date(prep.getTime()+n('soakHours')*3600000),date=[sow.getFullYear(),String(sow.getMonth()+1).padStart(2,'0'),String(sow.getDate()).padStart(2,'0')].join('-');
 set('sowDate',date);set('sowTime',String(sow.getHours()).padStart(2,'0')+':'+String(sow.getMinutes()).padStart(2,'0'));render();
 $('start-plan-status').textContent=(n('soakHours')?'Begin the selected '+fmt(n('soakHours'),0)+' h water soak now; planned sowing ':'Direct sowing planned ')+date+' at '+$('sowTime').value+' local time. '+fmt(lastPlan.density.grams,1)+' g dry seed for this nominal 1020. Verify actual inputs before logging the tray.';
 $('seed-plan').scrollIntoView({behavior:'smooth',block:'start'});
}
function saveTrialRate(event){
 event.preventDefault();if(!rateStore){rateMessage='Rate-history storage could not be loaded.';render();return;}
 const grams=n('rate-grams'),reason=$('rate-reason').value.trim(),s=state();
 if(!Number.isFinite(grams)||grams<.01||grams>2000||reason.length<3||!lastPlan?.schedule||!lastPlan.density){rateMessage='Enter valid dry grams, a reason and a valid growing schedule before saving a trial rate.';render();return;}
 const area=s.length*s.width,toGrams=grams*200/area,previous=rateStore.latest(crop.id)?.toGrams??publishedGrams(crop),at=new Date().toISOString();
 const savedRecipe={...recipe,id:'personal-rate',source:'PERSONAL',grams:toGrams,area:200,cover:[s.coverDays,s.coverDays],harvest:[s.harvestDay,s.harvestDay],soak:[s.soakHours,s.soakHours],method:s.method,blackoutDays:s.blackoutDays,weightLb:s.weightLb,substrateId:s.substrate,substrateDepth:s.depth,substrateTheta:s.theta,substrateReserve:s.reserve,lightHours:s.hours,note:reason};
 const entry={id:'rate-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10),cropId:crop.id,changedAt:at,fromGrams:previous,toGrams,actualSeedG:grams,areaIn2:area,reason,seedLot:$('rate-lot').value.trim(),evidence:$('rate-evidence').value.trim(),recipe:savedRecipe};
 const result=rateStore.append(entry);if(!result.ok){rateMessage=result.error;render();return;}
 extraRecipe={...savedRecipe,label:'My saved trial · '+fmt(toGrams,1)+' g/200 in²',confidence:'Personal trial · evaluate measured yields'};fillRecipes('personal-rate');applyRecipe();
 rateMessage=result.persisted?'Trial rate saved with date, previous amount, area and reason. Existing tray records are unchanged.':'Trial rate is held in this tab only. '+result.error;render();
}
function download(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function csvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"';}
const families=[...new Set(D.crops.map(c=>c.family))].sort();
families.forEach(f=>{const opt=document.createElement('option');opt.value=f;opt.textContent=f;$('family-filter').appendChild(opt);});
$('catalog-count').textContent=`${D.crops.length} crop profiles · ${families.length} families · 17 caption reviews`;
$('substrate').innerHTML=D.substrates.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
$('family-table').innerHTML=Object.values(D.groups).map(g=>`<tr><td>${esc(g.family)}</td><td>${esc(g.name)}</td><td>Covered ${range(g.cover)} d<br>Harvest ${range(g.harvest)} d</td><td>${esc(g.exception)}</td></tr>`).join('');
$('all-sources').innerHTML=Object.values(D.sources).map(s=>`<li id="source-${esc(s.id)}"><strong>${esc(s.id)} · ${esc(s.kind)}</strong><br>${sourceLink(s.id)}<small>${esc(s.note)}</small>${s.local?`<small><a href="sources/${esc(s.local)}">Preserved primary source</a></small>`:''}</li>`).join('');
$('family-filter').addEventListener('change',filterCrops);
$('crop').addEventListener('change',()=>chooseCrop($('crop').value));
$('recipe').addEventListener('change',applyRecipe);
for(const p of D.ownedPackets||[])if($('start-'+p.cropId))$('start-'+p.cropId).addEventListener('click',()=>startFromNow(p.cropId));
if($('rate-history-form'))$('rate-history-form').addEventListener('submit',saveTrialRate);
if($('export-rate-history'))$('export-rate-history').addEventListener('click',()=>download('grow-lab-seed-rate-history.json',JSON.stringify({...rateStore?.read()||{schema:R?.SCHEMA,revision:0,entries:[]},exportedAt:new Date().toISOString(),publishedHistory:D.seedRateHistory},null,2),'application/json'));
if($('import-rate-history'))$('import-rate-history').addEventListener('change',async()=>{const file=$('import-rate-history').files?.[0];if(!file)return;try{if(!rateStore||file.size>20*1024*1024){rateMessage='Rate history is unavailable or the backup exceeds 20 MB.';}else{const result=rateStore.import(await file.text());if(result.ok){chooseCrop(crop.id);rateMessage=result.added+' personal revision(s) imported. '+(result.error||'Existing revision IDs were preserved.');}else rateMessage=result.error;}}catch{rateMessage='Could not read this rate-history file; existing revisions were preserved.';}finally{set('import-rate-history','');render();}});
$('show-water-estimate').addEventListener('change',render);
for(const [id,calendar] of [['calendar-view',true],['list-view',false]])$(id).addEventListener('click',()=>{$('watering-calendar').hidden=!calendar;$('schedule-list').hidden=calendar;$('calendar-view').setAttribute('aria-pressed',String(calendar));$('list-view').setAttribute('aria-pressed',String(!calendar));});
for(const form of ['seed-form','water-form','schedule-form']){$(form).addEventListener('submit',e=>e.preventDefault());$(form).addEventListener('input',e=>{if(['coverDays','blackoutDays'].includes(e.target.id))set('bottomStartDay',n('coverDays')+n('blackoutDays'));if(['length','width','depth','reserve','multiplier'].includes(e.target.id)&&$('waterBasis').value==='measured'){set('waterBasis','scenario');weightResetNote='The tray/seed/root-zone setup changed. Reweigh the revised assembly before reusing measured refill mode.';}render();});$(form).addEventListener('change',render);}
$('substrate').addEventListener('change',()=>{const s=D.substrates.find(x=>x.id===$('substrate').value);set('depth',s.depth);set('theta',s.theta*100);set('reserve',0);set('waterBasis','scenario');weightResetNote='Substrate changed: reweigh this assembly before selecting measured refill mode.';render();});
['curve','objective','seedPrice','salePrice','otherCost','turnaround'].forEach(id=>{$(id).addEventListener('input',render);$(id).addEventListener('change',render);});
$('method').addEventListener('change',()=>{if($('method').value==='dome')set('weightLb',0);render();});
$('reset-crop').addEventListener('click',()=>chooseCrop(crop.id));
$('export-plan').addEventListener('click',()=>download('grow-lab-'+crop.id+'-plan.json',JSON.stringify(lastPlan,null,2),'application/json'));
$('print-plan').addEventListener('click',()=>window.print());
$('export-schedule').addEventListener('click',()=>{if(!lastPlan?.schedule)return;const header=['day','date','stage','check_action','illustrative_loss_ml_day','watering_method','morning_ml','night_ml','morning_us_cups','night_us_cups','daily_us_cups','estimate_basis','phase','local_time','low_daily_us_cups','high_daily_us_cups'];const lines=[header,...lastPlan.schedule.map(r=>[r.day,r.date,r.stage,r.action,r.waterScenarioMl===null?'':r.waterScenarioMl.toFixed(1),r.wateringMethod,...[r.amMl,r.pmMl,r.amCups,r.pmCups,r.dailyCups].map(v=>v===null?'':v.toFixed(4)),'Planning scenario; check moisture and roots before watering; initial wetting and soak water excluded',r.phase,r.time,...[r.lowCups,r.highCups].map(v=>v==null?'':v.toFixed(4))])];download('grow-lab-'+crop.id+'-schedule.csv',lines.map(r=>r.map(csvCell).join(',')).join('\n'),'text/csv');});
$('trial-template').addEventListener('click',()=>download('grow-lab-'+crop.id+'-blank-trial.csv','crop_id,seed_g,saleable_g,area_in2,days,substrate,lot,stage\n','text/csv'));
function analyzeTrials(cropId){const result=M.parseTrials($('trials').value,cropId);if(result.error){$('trial-status').textContent=result.error;return;}localTrials=result;fillCurves();set('curve','local');render();$('trial-status').textContent=result.rows.length+' independent tray rows · '+result.points.length+' treatment means. '+result.warning;}
$('analyze-trials').addEventListener('click',()=>analyzeTrials(crop.id));
$('apply-optimum').addEventListener('click',()=>{
 if(!ranked||!activeCurve||activeCurve.crop!==crop.id)return;
 const p=ranked.best;extraRecipe={...recipe,id:'tested',label:activeCurve.kind==='local'?'Your best observed treatment':'Study treatment · local trial only',grams:p.seedGm2,area:1/M.IN2_M2,harvest:[Math.round(p.days),Math.round(p.days)],cover:recipe.cover,method:recipe.method,source:activeCurve.source,note:activeCurve.context+' Selected by '+$('objective').selectedOptions[0].textContent+'.'};
 fillRecipes('tested');applyRecipe();$('seed-plan').scrollIntoView({behavior:'smooth',block:'start'});
});
const now=new Date(),today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');set('sowDate',today);
filterCrops();
// Only explicit actions in My grow log create this one-time handoff.
try{
 const raw=window.sessionStorage?.getItem('grow-lab:journal-transfer');
 if(raw){const transfer=JSON.parse(raw),old=D.retiredCropIds?.[transfer.cropId],cropId=old?.cropId??transfer.cropId;if(D.crops.some(c=>c.id===cropId)){
  set('family-filter','all');filterCrops();chooseCrop(cropId);
  if(old){set('recipe',old.recipeId);applyRecipe();}
  if(transfer.kind==='trials'&&typeof transfer.csv==='string'){set('trials',transfer.csv);analyzeTrials(transfer.cropId);if(localTrials&&typeof transfer.context==='string'){localTrials.context+=' · Logged setup: '+transfer.context.slice(0,10000);render();}}
  if(transfer.kind==='water'&&Number.isFinite(transfer.demand)&&transfer.demand>=.1&&transfer.demand<=6){
   if(transfer.length>=5&&transfer.length<=24&&transfer.width>=4&&transfer.width<=12){set('length',transfer.length);set('width',transfer.width);}
   set('demand',Math.round(transfer.demand*10)/10);loggedWaterNote='Apparent water loss imported from logged tray '+String(transfer.recordId).slice(0,120)+': '+fmt(transfer.demand,2)+' mm/day, rounded to the demand slider’s 0.1-mm step. Review stage, biomass growth and weighing convention before applying it to a new grow.';render();
  }
 }window.sessionStorage.removeItem('grow-lab:journal-transfer');}
}catch{/* Optional journal handoff; the ordinary planner remains usable. */}
// A small read-only hook supports regression checks without duplicating UI math.
window.GrowCropLab={snapshot:()=>lastPlan};
})();
