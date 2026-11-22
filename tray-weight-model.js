/* Scale readings and grower observations are the calibration data. Grams throughout. */
(function (root) {
'use strict';
const Coir=typeof module==='object'?require('./coir-model.js'):root.CoirModel;
const DAY=86400000, HOUR=3600000, MAX_G=20000;
const observations={
  unknown:'Check only', ready:'Slightly dry · ready for water', dry:'Too dry',
  droop:'Drooping and coir feels dry', moist:'Evenly moist', wet:'Too wet'
};
const sessions={am:'Morning',pm:'Night'};
const grams=(value,min=0)=>Number.isFinite(value) && value>=min && value<=MAX_G;
const clock=value=>typeof value==='string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
const round=value=>Math.round(value*10)/10;
const median=values=>{
  const sorted=values.slice().sort((a,b)=>a-b), middle=Math.floor(sorted.length/2);
  return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;
};
function coirRecipe(cropId, version, saved) {
  const defaults=Coir.defaults(version);
  const plan=saved?.version===version && Array.isArray(saved.rows) && saved.rows.every(Boolean)
    ? Coir.calculate(saved):null;
  const coirId={'radish-daikon':'radish','pea-basic':'pea'}[cropId] || cropId;
  const row=plan?.valid && (plan.rows.find(r=>r.id===coirId) ||
    (plan.rows.every(r=>r.weighG===plan.rows[0].weighG && r.waterMl===plan.rows[0].waterMl) && plan.rows[0]));
  const recipe=row||Coir.calculate(defaults).rows[0];
  return {dryG:recipe.weighG, hydrationG:recipe.waterMl,
    recipe:row?'Saved '+version+' Coco coir recipe':'Coco coir '+version+' per-tray starter'};
}
function setupError(s) {
  if (!s || ![s.topG,s.holesG,s.bottomG,s.dryG,s.hydrationG,s.seedG].every(n=>grams(n,0.1)) ||
    !grams(s.mistG) || (s.sowG!==null&&!grams(s.sowG,0.1))) return 'Enter the tray, coir and seed weights in grams.';
  if (s.sowG!==null && s.sowG<=s.topG+s.holesG+s.bottomG+s.dryG+s.seedG) {
    return 'The measured sowing stack must include all three trays and the hydrated contents.';
  }
  if (!grams(starting(s,'germination'),0.1)) return 'Keep the full sowing stack within 20,000 g.';
  if (typeof s.sowMoist!=='boolean' || s.sowMoist && s.sowG===null) return 'Enter the full sowing weight to use it as an evenly moist reading.';
  if (!clock(s.am) || !clock(s.pm) || s.am>='12:00' || s.pm<'12:00') return 'Choose a morning time before noon and a night time after noon.';
  if (typeof s.coverBlackout!=='boolean' || typeof s.group!=='string' || !s.group.trim() ||
    s.group.length>60 || typeof s.recipe!=='string' || s.recipe.length>80) return 'Enter a setup name up to 60 characters.';
  return '';
}
const tare=(s,stage)=>s.holesG+s.bottomG+((stage==='germination'||stage==='blackout'&&s.coverBlackout)?s.topG:0);
const starting=(s,stage)=>round(s.sowG!==null?s.sowG-s.topG-s.holesG-s.bottomG+tare(s,stage):
  tare(s,stage)+s.dryG+s.hydrationG+s.seedG+s.mistG);
const drained=check=>round(check.totalG-check.poolG);
function checkError(check, setup, stage) {
  if (!check || !Object.hasOwn(sessions,check.session) || !Object.hasOwn(observations,check.observation)) {
    return 'Choose a check time and moisture observation.';
  }
  const {totalG,poolG,postG,waterG,postMoist,heightIn,note,band}=check;
  const minimum=round(tare(setup,stage)+setup.dryG);
  if (!grams(totalG,0.1) || !grams(poolG) || drained(check)<minimum) {
    return 'Check the full stack weight and pooled water. The drained stack must weigh at least as much as its empty trays and dry coir.';
  }
  if (postG!==null && (!grams(postG,minimum) || postG<drained(check))) {
    return 'The post-watering reading must be at least the starting weight with any pool drained.';
  }
  if (waterG!==null && !grams(waterG) || typeof postMoist!=='boolean' || postMoist&&postG===null ||
    heightIn!==null && !(Number.isFinite(heightIn)&&heightIn>=0&&heightIn<=36) ||
    typeof note!=='string' || note.length>500 ||
    band!==null && !(Array.isArray(band)&&band.length===2&&band.every(n=>grams(n,minimum))&&band[0]<band[1])) {
    return 'Check the optional after-watering weight, height and notes.';
  }
  return '';
}
const latestSetup=cycle=>cycle.events.findLast(e=>e.kind==='weight_setup_saved');
const closeRecipe=(a,b)=>a.group.toLowerCase()===b.group.toLowerCase() &&
  ['dryG','hydrationG','seedG','mistG'].every(key=>Math.abs(a[key]-b[key])<=Math.max(2,a[key]*0.05));
function series(cycle, planner) {
  const history=planner.effectiveHistory(cycle);
  const stages=new Map(history.map((event,index)=>[event.id,{event,next:history[index+1]}]));
  const setups=new Map();
  const checks=[];
  for (const event of cycle.events) {
    if (event.kind==='weight_setup_saved') setups.set(event.id,event.setup);
    if (event.kind!=='weight_check_added') continue;
    const setup=setups.get(event.setupId), {event:stage,next}=stages.get(event.stageId);
    const when=Date.parse(event.occurredAt);
    const stageName=stage.toPhase;
    checks.push({...event.check,at:event.occurredAt,stage:stageName,setup,setupId:event.setupId,
      day:planner.dayDelta(when,history[0].occurredAt),
      stageDay:planner.dayDelta(when,stage.occurredAt),
      valid:when>=Date.parse(stage.occurredAt) && (!next || when<=Date.parse(next.occurredAt)),
      tareG:tare(setup,stageName)});
  }
  return checks;
}
function scheduled(at,clockKey) {
  const date=new Date(at), [hour,minute]=clockKey.split(':').map(Number);
  date.setHours(hour,minute,0,0);
  return date;
}
function defaultSession(setup,at) {
  const distances=Object.fromEntries(Object.entries(sessions).map(([key])=>{
    const date=scheduled(at,setup[key]);
    return [key,Math.min(...[-1,0,1].map(days=>{
      const neighbor=new Date(date);
      neighbor.setDate(date.getDate()+days);
      return Math.abs(neighbor-at);
    }))];
  }));
  return distances.am<=distances.pm?'am':'pm';
}
function nextCheck(setup,session,at) {
  const date=scheduled(at,setup[session==='am'?'pm':'am']);
  if (date<=at) date.setDate(date.getDate()+1);
  return date;
}
function matching(cycles, cycle, setup, stage, at, planner) {
  return cycles.filter(c=>c.cropId===cycle.cropId && (c.id===cycle.id || planner.phase(c)!=='ended')).map(c=>({
    own:c.id===cycle.id,
    checks:series(c,planner).filter(r=>r.valid && Date.parse(r.at)<=at),
  })).filter(({checks})=>checks.some(r=>r.stage===stage && closeRecipe(setup,r.setup)));
}
function lossRates(runs, setup, stage, stageDay, session) {
  const rates=[];
  for (const {checks} of runs) {
    for (let i=1;i<checks.length;i++) {
      const a=checks[i-1], b=checks[i];
      if (a.session!==session || a.session===b.session || a.stage!==stage || b.stage!==stage ||
        a.setupId!==b.setupId || !closeRecipe(setup,a.setup) || Math.abs(a.stageDay-stageDay)>2 ||
        a.poolG>0 || b.poolG>0 || a.postG===null || !a.postMoist) continue;
      const hours=(Date.parse(b.at)-Date.parse(a.at))/HOUR;
      const loss=a.postG-drained(b);
      if (hours>=4 && hours<=20 && loss>=0) rates.push({at:b.at,rate:loss/hours});
    }
  }
  return rates.sort((a,b)=>Date.parse(b.at)-Date.parse(a.at)).slice(0,6).map(r=>r.rate);
}
const moistWeights=checks=>checks.flatMap(r=>[
  ...(r.postMoist?[r.post]:[]),
  ...(r.poolG===0 && r.observation==='moist'?[r.pre]:[]),
]).slice(0,6);
function target(cycles, cycle, setup, stage, at, session, planner) {
  const entry=planner.effectiveHistory(cycle).at(-1);
  const stageDay=planner.dayDelta(at,entry.occurredAt), emptyG=tare(setup,stage);
  const next=nextCheck(setup,session,at);
  const runs=matching(cycles,cycle,setup,stage,at,planner);
  const comparable=runs.flatMap(({own,checks})=>checks
    .filter(r=>r.stage===stage && closeRecipe(setup,r.setup) && Math.abs(r.stageDay-stageDay)<=3)
    .map(r=>({...r,own,gap:Math.abs(r.stageDay-stageDay),pre:drained(r)-r.tareG,
      post:r.postG===null?null:r.postG-r.tareG})))
    .sort((a,b)=>Number(b.own)-Number(a.own)||a.gap-b.gap||Date.parse(b.at)-Date.parse(a.at));
  const recent=comparable.filter(r=>r.gap<=1).slice(0,12);
  const earlier=comparable.filter(r=>r.gap>1 && r.stageDay<stageDay);
  const clear=recent.filter(r=>r.poolG===0);
  const ready=clear.filter(r=>r.observation==='ready').slice(0,5);
  const moist=moistWeights(recent);
  if (stage==='germination' && stageDay<=1 && setup.sowMoist && moist.length<3) {
    moist.push(starting(setup,stage)-emptyG);
  }
  const result={next,stageDay,samples:recent.length,band:null,postTarget:null,lossRange:null,intervals:0,conflict:false};
  const dry=clear.filter(r=>r.observation==='dry'||r.observation==='droop');
  const wet=clear.filter(r=>r.observation==='wet');
  const olderDry=dry.length?null:earlier.find(r=>r.poolG===0 && ['dry','droop'].includes(r.observation));
  const olderWet=wet.length?null:earlier.find(r=>r.poolG===0 && r.observation==='wet');
  const olderReady=ready.length||dry.length?null:earlier.find(r=>r.poolG===0 && r.observation==='ready');
  const olderMoist=moist.length?[]:moistWeights(earlier);
  if (olderDry) dry.push(olderDry);
  if (olderWet) wet.push(olderWet);
  if (olderReady) ready.push(olderReady);
  moist.push(...olderMoist);
  if (!moist.length || !ready.length && !dry.length) return result;

  // Dry feedback sets a floor. If repeated readings disagree with the previous
  // low edge, a higher confirmed-moist reading can support a new low edge.
  const dryFloor=dry.length?Math.max(...dry.map(r=>r.pre))+1:0;
  const wetCeiling=wet.length?Math.min(...wet.map(r=>r.pre))-1:Infinity;
  const allowedMoist=moist.filter(value=>value>dryFloor&&value<=wetCeiling);
  const usualLow=ready.length?median(ready.map(r=>r.pre)):dryFloor;
  const lower=Math.max(usualLow,dryFloor,setup.dryG);
  const upper=allowedMoist.length?median(allowedMoist):NaN;
  const band=[round(lower+emptyG),round(upper+emptyG)];
  if (!(band[0]<band[1]) || lower>wetCeiling || !band.every(value=>grams(value,emptyG+setup.dryG))) {
    return {...result,conflict:true};
  }
  const rates=lossRates(runs,setup,stage,stageDay,session);
  const hours=(next-at)/HOUR;
  const lossRange=rates.length>=2?[round(Math.min(...rates)*hours),round(Math.max(...rates)*hours)]:null;
  const postTarget=lossRange?Math.min(band[1],round(band[0]+lossRange[1])):band[1];
  return {...result,band,postTarget,lossRange,intervals:rates.length,earlier:!!(olderReady||olderDry||olderWet||olderMoist.length)};
}
function harvests(cycles, cycle, setup, planner) {
  const ownHistory=planner.effectiveHistory(cycle);
  const finished=!planner.ACTIVE.includes(planner.phase(cycle));
  const cutoff=finished?Date.parse(ownHistory.at(-1).occurredAt):Infinity;
  const usesBlackout=history=>history.some(event=>event.toPhase==='blackout');
  const pathKnown=planner.phase(cycle)!=='germination';
  const rows=cycles.filter(c=>c.id!==cycle.id && c.cropId===cycle.cropId && planner.phase(c)==='harvested' &&
    c.harvest?.weightG!=null).flatMap(c=>{
    const history=planner.effectiveHistory(c);
    const recipe=c.events.find(e=>e.kind==='weight_setup_saved')?.setup;
    if (Date.parse(history.at(-1).occurredAt)>cutoff || recipe && setup && !closeRecipe(setup,recipe) ||
      pathKnown && usesBlackout(history)!==usesBlackout(ownHistory)) return [];
    return [{grams:c.harvest.weightG,day:planner.dayDelta(history.at(-1).occurredAt,history[0].occurredAt),
      matched:!!recipe&&!!setup}];
  });
  const matched=rows.filter(row=>row.matched);
  const sample=matched.length?matched:rows;
  if (!sample.length) return null;
  const weights=sample.map(r=>r.grams);
  return {count:sample.length,median:median(weights),range:[Math.min(...weights),Math.max(...weights)],
    day:median(sample.map(r=>r.day)),matched:matched.length>0};
}
const api={observations,sessions,grams,coirRecipe,setupError,tare,starting,drained,checkError,latestSetup,
  series,defaultSession,nextCheck,target,harvests,round,DAY};
if (typeof module==='object') module.exports=api; else root.TrayWeightModel=api;
})(typeof window==='undefined'?globalThis:window);
