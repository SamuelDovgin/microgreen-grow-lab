/* Pure, unit-explicit calculations. No fitted agronomic coefficients. */
(function(root){
'use strict';
const IN2_M2=.00064516, IN3_ML=16.387064, CUP_ML=236.5882365;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const between=(x,a,b)=>finite(x)&&x>=a&&x<=b;
function area(length,width){return between(length,1,48)&&between(width,1,48)?{in2:length*width,cm2:length*width*6.4516,m2:length*width*IN2_M2}:null;}
function density(s,c,recipe){
 const a=area(s.length,s.width);
 if(!a||!between(s.seedsPerGram,.1,5000)||!between(s.germination,1,100)||!between(s.establishment,1,100)||!between(s.shootsPerUnit,1,5)||!between(s.multiplier,.25,2)||!['reference','count'].includes(s.mode))return null;
 const p=s.germination/100,e=s.establishment/100,q=s.seedsPerGram,r=s.shootsPerUnit;
 let base;
 if(s.mode==='count'){
  if(!between(s.targetShoots,.01,300))return null;
  base=s.targetShoots*a.in2/(q*p*e*r);
 }else if(c.sownCountCm2&&recipe.id==='baseline')base=c.sownCountCm2*a.cm2/q;
 else{
  if(!between(recipe.grams,.01,10000)||!finite(recipe.area)||recipe.area<=0)return null;
  base=recipe.grams*a.in2/recipe.area;
 }
 const grams=base*s.multiplier,units=grams*q,shoots=units*p*e*r;
 return {area:a,baseGrams:base,grams,units,viableUnits:units*p,shoots,unitsIn2:units/a.in2,shootsIn2:shoots/a.in2,gramsM2:grams/a.m2,spacingMm:Math.sqrt(a.cm2/shoots)*10,formula:s.mode==='count'?'A × target emerged shoots/in² ÷ (units/g × germination × establishment × shoots/viable unit) × trial factor':c.sownCountCm2&&recipe.id==='baseline'?'A(cm²) × study seeds sown/cm² ÷ lot units/g × trial factor':'Reference dry grams × usable area ÷ reference area × trial factor'};
}
function climate(temp,rh,ppfd,hours){
 if(!between(temp,10,35)||!between(rh,20,95)||!between(ppfd,0,500)||!between(hours,0,24))return null;
 const saturation=.6108*Math.exp(17.27*temp/(temp+237.3));
 return {vpd:saturation*(1-rh/100),dli:ppfd*hours*.0036,saturation};
}
function reservoir(s){
 const a=area(s.length,s.width);
 if(!a||!between(s.depth,.02,2)||!between(s.theta,0,90)||!between(s.reserve,0,3000)||!between(s.depletion,10,70))return null;
 const volumeMl=a.in2*s.depth*IN3_ML,stored=volumeMl*s.theta/100+s.reserve;
 return {volumeMl,volumeL:volumeMl/1000,storedMl:stored,drawdownMl:stored*s.depletion/100};
}
function water(s){
 const r=reservoir(s),c=climate(s.temp,s.rh,s.ppfd,s.hours),a=area(s.length,s.width);
 if(!r||!c||!a||!between(s.demand,.1,6)||!between(s.demandUncertainty,0,80))return null;
 // 1 mm over 1 m² = 1 L. Demand is entered/scenario data, not derived from VPD.
 const daily=s.demand*a.m2*1000,range=s.demandUncertainty/100;
 const useMeasured=s.waterBasis==='measured';
 let deficit=null,refill=null,trigger=null,remaining=null,error=null;
 if(useMeasured){
  if(!between(s.wetWeight,1,20000)||!between(s.currentWeight,1,20000)||!between(s.measuredBuffer,1,10000)||s.measuredBuffer>=s.wetWeight)error='Enter a positive wet weight and a usable water reserve smaller than the complete wet tray weight.';
  else{
   deficit=Math.max(0,s.wetWeight-s.currentWeight);trigger=s.wetWeight-s.measuredBuffer*s.depletion/100;
   remaining=Math.max(0,s.currentWeight-trigger);
   refill=s.currentWeight<=trigger?deficit:0;
  }
 }
 const drawdown=useMeasured&&!error?s.measuredBuffer*s.depletion/100:r.drawdownMl;
 return {...r,dailyMl:daily,lowDailyMl:daily*(1-range),highDailyMl:daily*(1+range),hoursToTrigger:drawdown>0?24*drawdown/daily:0,fastHours:drawdown>0?24*drawdown/(daily*(1+range)):0,slowHours:drawdown>0?24*drawdown/(daily*(1-range)):0,deficitMl:deficit,refillMl:refill,triggerWeight:trigger,remainingHours:remaining===null?null:24*remaining/daily,measured:useMeasured&&!error,error};
}
function dailyDemand(s,day){
 const d=water(s);if(!d)return null;
 const lightStart=s.coverDays+s.blackoutDays;
 if(day<lightStart)return d.dailyMl*.2; // Displayed germination scenario only.
 const span=Math.max(1,s.harvestDay-lightStart),progress=Math.max(0,Math.min(1,(day-lightStart)/span));
 return d.dailyMl*(.35+.65*progress); // Explicit illustration, never a refill instruction.
}
function dateAt(iso,offset){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return null;
 const d=new Date(iso+'T12:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==iso)return null;
 d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10);
}
// Visual proxy only: spherical planting unit at an assumed 1 g/cm³.
function seedDiameter(seedsPerGram){return between(seedsPerGram,.1,5000)?Math.cbrt(6000/(Math.PI*seedsPerGram)):null;}
// Preparation is scheduled from the local sow time; subtract elapsed hours across midnight or a clock change.
function soakStart(sowDate,sowTime,hours){
 const sow=new Date(sowDate+'T'+sowTime),start=new Date(sow.getTime()-hours*3600000);
 const pad=n=>String(n).padStart(2,'0');
 return {date:[start.getFullYear(),pad(start.getMonth()+1),pad(start.getDate())].join('-'),
         time:pad(start.getHours())+':'+pad(start.getMinutes())};
}
function schedule(s,c,recipe,densityResult){
 if(!Number.isInteger(s.coverDays)||!between(s.coverDays,1,14)||!Number.isInteger(s.blackoutDays)||!between(s.blackoutDays,0,5)||!Number.isInteger(s.harvestDay)||!between(s.harvestDay,4,40)||s.coverDays+s.blackoutDays>=s.harvestDay||!dateAt(s.sowDate,0))return null;
 const list=[],lightStart=s.coverDays+s.blackoutDays;
 const bottomStart=s.bottomStartDay??lightStart,amShare=s.amShare??50,soakHours=s.soakHours??0,sowTime=s.sowTime??'08:00';
 if(!Number.isInteger(bottomStart)||!between(bottomStart,s.coverDays,s.harvestDay)||!between(amShare,0,100)||!between(soakHours,0,18)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(sowTime))return null;
 const weight=s.method==='dome'?0:(s.weightLb??0);
 if(!between(weight,0,15))return null;
 const broccoli=c?.id==='broccoli',sunflower=c?.id==='sunflower',protocol=c?.calendar||{};
 const emptyBroccoliCover=broccoli&&s.method!=='dome'&&weight===0;
 const paver=sunflower&&(weight===15||weight===14&&recipe?.source==='V13');
 const coverStage=s.method==='dome'?'Vented humidity dome':paver?`Weighted dark cover · ${weight} lb paver`:weight>0?`Weighted cover · ${weight} lb added`:emptyBroccoliCover?'Empty cover tray · no 15 lb paver':'Contact cover · no added weight';
 const coverAction=emptyBroccoliCover?'Invert an empty tray so it rests gently on the seeds. Keep it dark and leave the 15 lb paver off.'
   :s.method==='dome'?'Place a vented dome above the seed surface.'
   :paver?`Rest a solid cover tray on the seeds, center the ${weight} lb paver on it and keep the tray dark.`
   :weight>0?`Set a contact tray over the seeds, add the selected ${weight} lb evenly and keep the tray dark.`
   :'Rest an empty tray on the seed surface and keep the tray dark.';
 const seed=Number.isFinite(densityResult?.grams)?`about ${Number(densityResult.grams.toFixed(1))} g of dry seed`:'the dry seed';
 if(soakHours>0){
  const start=soakStart(s.sowDate,sowTime,soakHours);
  list.push({day:start.date===s.sowDate?0:-1,date:start.date,time:start.time,phase:'presoak',
   stage:`Presoak · ${soakHours} h`,cue:'Weigh dry seed, then start soak',action:`Weigh ${seed}${sunflower?', rinse it and': ' and'} soak in ${recipe?.source==='D37'?'cold ':''}clean water for ${soakHours} h. Drain and rinse before sowing at ${sowTime} on ${s.sowDate}.`,
   wateringMethod:'prep',bottomStartDay:bottomStart,waterScenarioMl:null,amMl:null,pmMl:null,dailyCups:null,amCups:null,pmCups:null,lowCups:null,highCups:null});
 }
 const topdress=recipe?.topdress??c?.topdress;
 for(let day=0;day<=s.harvestDay;day++){
  const phase=day===0?'sow':day<s.coverDays?'emergence':day<lightStart?'blackout':day===s.harvestDay?'harvest':'light';
  const stage=day<s.coverDays?coverStage:phase==='blackout'?'Blackout · loose cover, 0 lb':phase==='harvest'?'Harvest checkpoint':'Under lights';
  const wateringMethod=day<bottomStart?'spray':'bottom';
  let action,cue;
  if(day===0){
   const prep=soakHours>0?'Rinse and drain soaked seed well.':sunflower?`Weigh ${seed}, rinse and drain it, then sow the same day.`:`Weigh ${seed} and direct-sow.`;
   action=[prep,'Use evenly moistened, drained medium. Sow evenly and mist to settle the seeds without pooling.',protocol.sow,
           topdress?'Apply a thin top dress as directed by the selected recipe.':'',coverAction].filter(Boolean).join(' ');
   cue=soakHours>0?'Drain, rinse, sow and cover':'Direct-sow, mist and cover';
  }else if(phase==='emergence'){
   action='Keep the selected cover in place. Check the seed surface and lightly mist only if it is drying.';
   cue='Keep covered · mist only if drying';
  }else{
   const actions=[];
   if(day===s.coverDays){
    actions.push(weight>0?'When the stand is ready, remove the weight and contact tray.':'Remove the contact cover or vented dome when the stand is ready.');
    if(protocol.exit)actions.push(protocol.exit);
   }
   if(phase==='blackout')actions.push('Keep the tray dark under a raised or inverted solid cover with space above the shoots. Leave all added weight off.');
   if(day===lightStart)actions.push('Remove any loose blackout cover and move under lights when the stand is ready.');
   if(phase==='harvest')actions.push(protocol.harvest||'Check leaf stage and harvest when ready.','Water only if the tray needs it and you are leaving it to grow.');
   else if(wateringMethod==='spray')actions.push('Lightly mist only if the seed surface is drying.');
   else if(day===bottomStart)actions.push('Bottom-water only if the tray needs it and the medium can wick from below. Delay the switch if it cannot.');
   else actions.push('Check tray weight and moisture. Bottom-water only as needed and drain excess.');
   if(day===lightStart){
    if(protocol.water)actions.push(protocol.water);
    if(protocol.litCare)actions.push(protocol.litCare);
   }
   if(phase==='harvest')cue='Harvest if ready';
   else if(phase==='blackout')cue=day===s.coverDays?'Remove contact cover'+(weight>0?' and weight':'')+' · start loose blackout':'Keep dark under loose cover';
   else if(day===lightStart)cue=(day===s.coverDays&&weight>0?'Remove weight and cover if ready':'Uncover if ready')+' · lights on'+(day===bottomStart?' · check wicking':'');
   else if(day===bottomStart)cue='Check wicking before switching';
   else cue=wateringMethod==='spray'?'Mist only if drying':'Check weight and moisture';
   if(broccoli&&day===7&&day<s.harvestDay&&day>=lightStart){
    actions.push('Start checking for fully open, green cotyledons and harvest when ready.');
    cue+=' · check harvest readiness';
   }
   action=actions.join(' ');
  }
  const waterScenarioMl=wateringMethod==='bottom'&&s.showWaterEstimate?dailyDemand(s,day):null;
  const amMl=waterScenarioMl===null?null:waterScenarioMl*amShare/100,pmMl=waterScenarioMl===null?null:waterScenarioMl-amMl;
  const spread=s.demandUncertainty/100;
  list.push({day,date:dateAt(s.sowDate,day),time:day===0?sowTime:null,phase,stage,action,cue,wateringMethod,bottomStartDay:bottomStart,waterScenarioMl,amMl,pmMl,dailyCups:waterScenarioMl===null?null:waterScenarioMl/CUP_ML,amCups:amMl===null?null:amMl/CUP_ML,pmCups:pmMl===null?null:pmMl/CUP_ML,
             lowCups:waterScenarioMl===null?null:waterScenarioMl*(1-spread)/CUP_ML,highCups:waterScenarioMl===null?null:waterScenarioMl*(1+spread)/CUP_ML});
 }
 return list;
}

function objective(row,seedPrice,salePrice,otherCost,turnaround,goal){
 const contribution=row.yieldGm2*salePrice/1000-row.seedGm2*seedPrice/1000-otherCost;
 if(goal==='yield')return row.yieldGm2;
 if(goal==='efficiency')return row.yieldGm2/row.seedGm2;
 if(goal==='margin')return contribution;
 if(goal==='throughput')return row.yieldGm2/(row.days+turnaround);
 return contribution/(row.days+turnaround);
}
function rank(points,options={}){
 const {seedPrice=20,salePrice=40,otherCost=0,turnaround=1,goal='marginDay'}=options;
 if(!Array.isArray(points)||points.length<2||!between(seedPrice,0,1000)||!between(salePrice,0,1000)||!between(otherCost,0,10000)||!between(turnaround,0,30)||!['yield','efficiency','margin','throughput','marginDay'].includes(goal))return null;
 if(points.some(p=>!between(p.seedGm2,.01,10000)||!between(p.yieldGm2,0,100000)||!between(p.days,1,100)))return null;
 const ranked=points.map(p=>({...p,score:objective(p,seedPrice,salePrice,otherCost,turnaround,goal)})).sort((a,b)=>b.score-a.score||a.seedGm2-b.seedGm2);
 return {best:ranked[0],ranked,allNegative:ranked.every(r=>r.score<0),boundary:ranked[0].seedGm2===Math.max(...points.map(p=>p.seedGm2))};
}
function parseTrials(text,expectedCrop){
 // Strict numeric schema; no eval/HTML. CSV uses unquoted identifiers and values.
 const lines=text.trim().split(/\r?\n/);if(lines.length<3)return {error:'Enter the header and at least two independent tray rows.'};
 const headers=lines.shift().split(',').map(x=>x.trim());
 const required=['crop_id','seed_g','saleable_g','area_in2','days','substrate','lot','stage'];
 if(required.some((h,i)=>headers[i]!==h)||headers.length!==required.length)return {error:'Use exactly: '+required.join(',')};
 const rows=[];
 for(let i=0;i<lines.length;i++){
  const fields=lines[i].split(',').map(x=>x.trim());if(fields.length!==8||fields.some(x=>!x))return {error:`Row ${i+2}: provide eight nonempty fields without commas inside identifiers.`};
  const [cropId,mass,yieldG,areaIn2,days,substrate,lot,stage]=fields;
  if(cropId!==expectedCrop)return {error:`Row ${i+2}: crop_id must match ${expectedCrop}. Analyze another crop separately.`};
  const seed=Number(mass),saleable=Number(yieldG),a=Number(areaIn2),d=Number(days);
  if(!between(seed,.01,2000)||!between(saleable,0,10000)||!between(a,1,2304)||!between(d,1,100))return {error:`Row ${i+2}: invalid seed, saleable mass, area or days.`};
  rows.push({cropId,seedGm2:seed/(a*IN2_M2),yieldGm2:saleable/(a*IN2_M2),days:d,substrate,lot,stage});
 }
 if(new Set(rows.map(r=>r.substrate+'|'+r.lot+'|'+r.stage)).size!==1)return {error:'Analyze one substrate, seed lot and harvest stage at a time; these rows mix contexts.'};
 const groups=new Map();
 for(const r of rows){const key=r.seedGm2.toFixed(5)+'|'+r.days;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
 const points=[...groups.values()].map(g=>{const mean=g.reduce((s,r)=>s+r.yieldGm2,0)/g.length;return {seedGm2:g[0].seedGm2,yieldGm2:mean,days:g[0].days,n:g.length,sd:g.length>1?Math.sqrt(g.reduce((s,r)=>s+(r.yieldGm2-mean)**2,0)/(g.length-1)):null};});
 if(new Set(points.map(p=>p.seedGm2.toFixed(5))).size<2)return {error:'Provide at least two distinct seed rates; repeated rows at one rate cannot locate a density winner.'};
 return {rows,points,context:rows[0].substrate+' / '+rows[0].lot+' / '+rows[0].stage,warning:points.some(p=>p.n<3)?'Fewer than three trays at one or more rates: exploratory evidence only.':'Replicates summarized by mean and sample SD; repeated independent cycles are still needed.'};
}
const api={IN2_M2,IN3_ML,CUP_ML,area,density,climate,reservoir,water,dailyDemand,dateAt,seedDiameter,schedule,rank,parseTrials};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CropModel=api;
})(typeof window!=='undefined'?window:globalThis);
