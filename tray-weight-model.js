/* Scale readings and grower observations are the calibration data. Grams throughout. */
(function (root) {
'use strict';
const Coir=typeof module==='object'?require('./coir-model.js'):root.CoirModel;
const DAY=86400000, HOUR=3600000, MAX_G=20000;
const TRAY_TARE_G=290, REFILL_WINDOW_G=20;
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
const validCoir=coir=>coir && grams(coir.dryG,0.1) && grams(coir.hydrationG,0.1) &&
  typeof coir.recipe==='string' && coir.recipe.length>0 && coir.recipe.length<=80;
function validSeedBasis(seed) {
  return seed && ['personal','published'].includes(seed.kind) && typeof seed.id==='string' && seed.id.length>0 &&
    seed.id.length<=150 && typeof seed.sownAt==='string' && Number.isFinite(Date.parse(seed.sownAt)) &&
    typeof seed.date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(seed.date) &&
    (seed.changedAt===null && seed.kind==='published' ||
      typeof seed.changedAt==='string' && Date.parse(seed.changedAt)<=Date.parse(seed.sownAt)) &&
    grams(seed.grams,.001) && typeof seed.needsDrainedWeight==='boolean';
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
  if (s.seedBasis!==undefined && !validSeedBasis(s.seedBasis)) return 'The setup contains an invalid dated seed rate.';
  return '';
}
const tare=(s,stage)=>s.holesG+s.bottomG+((stage==='germination'||stage==='blackout'&&s.coverBlackout)?s.topG:0);
function stackBudget(setup,stage) {
  const trays=[setup.holesG,setup.bottomG];
  if (stage==='germination'||stage==='blackout'&&setup.coverBlackout) trays.unshift(setup.topG);
  const trayG=tare(setup,stage), dryG=setup.dryG, seedG=grams(setup.seedG,.1)?setup.seedG:null;
  const fixedG=trayG+dryG+(seedG??0);
  return {trays,trayG,dryG,seedG,hydrationG:setup.hydrationG,mistG:setup.mistG,
    remainder:(total,pool=0)=>round(total-pool-fixedG)};
}
const starting=(s,stage)=>round(s.sowG!==null?s.sowG-s.topG-s.holesG-s.bottomG+tare(s,stage):
  tare(s,stage)+s.dryG+s.hydrationG+s.seedG+s.mistG);
const nearMoist=(low,high)=>[Math.max(low,round(high-REFILL_WINDOW_G)),high];
function recipeBand(setup,stage,target={}) {
  const seedG=grams(setup.seedG,.1)?setup.seedG:0;
  const recipeWeight=starting({...setup,seedG,sowG:setup.sowMoist?setup.sowG:null},stage);
  const upper=Math.min(recipeWeight,target.wetEdge??Infinity);
  const minimum=round(tare(setup,stage)+setup.dryG+seedG);
  const lower=Math.max(minimum,round(recipeWeight-REFILL_WINDOW_G),target.dryEdge??minimum);
  return grams(upper,lower)&&!target.conflict?[lower,upper]:null;
}
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
      stageHours:(when-Date.parse(stage.occurredAt))/HOUR,
      valid:when>=Date.parse(stage.occurredAt) && (!next || when<=Date.parse(next.occurredAt)),
      tareG:tare(setup,stageName)});
  }
  return checks;
}
function scheduled(at,clockKey,day) {
  const date=new Date(at), [hour,minute]=clockKey.split(':').map(Number);
  date.setDate(date.getDate()+day);
  date.setHours(hour,minute,0,0);
  return date;
}
function scheduledChecks(setup,at) {
  return [-1,0,1].flatMap(day=>Object.keys(sessions).map(session=>({
    session,time:scheduled(at,setup[session],day)
  })));
}
function checkWindow(setup,at) {
  const checks=scheduledChecks(setup,at);
  const previous=checks.findLastIndex(check=>check.time<=at);
  // Watering up to one hour early counts as this routine check.
  const current=checks[previous+1].time-at<=HOUR?previous+1:previous;
  const {time,session}=checks[current], next=checks[current+1].time;
  const periods=[{session,hours:(next-Math.max(time,at))/HOUR}];
  if (time>at) periods.unshift({session:checks[previous].session,hours:(time-at)/HOUR});
  return {session,next,periods};
}
const defaultSession=(setup,at)=>checkWindow(setup,at).session;
function lossPeriod(setup,start,end) {
  const checks=scheduledChecks(setup,start);
  const index=checks.findLastIndex(check=>check.time<=start);
  const boundary=checks[index+1];
  if (end<=boundary.time) return checks[index].session;
  if (end>checks[index+2].time) return null;
  const before=boundary.time-start, after=end-boundary.time;
  // Attribute a pair to one period when it only grazes the other.
  if (Math.min(before,after)>Math.min(HOUR,(end-start)*0.15)) return null;
  return before>=after?checks[index].session:boundary.session;
}
function matching(cycles, cycle, setup, stage, at, planner) {
  return cycles.filter(c=>c.cropId===cycle.cropId && (c.id===cycle.id || planner.phase(c)!=='ended')).map(c=>({
    own:c.id===cycle.id,
    checks:series(c,planner).filter(r=>r.valid && Date.parse(r.at)<=at),
  })).filter(({checks})=>checks.some(r=>r.stage===stage && closeRecipe(setup,r.setup)));
}
function lossForecast(runs,setup,stage,stageHours,periods) {
  const samples={am:[],pm:[]};
  for (const {checks,own} of runs) {
    for (let i=1;i<checks.length;i++) {
      const a=checks[i-1], b=checks[i];
      const gap=Math.abs(a.stageHours-stageHours);
      if (a.stage!==stage || b.stage!==stage ||
        a.setupId!==b.setupId || !closeRecipe(setup,a.setup) || gap>60 ||
        a.poolG>0 || b.poolG>0 || a.postG===null || !a.postMoist) continue;
      const start=Date.parse(a.at), end=Date.parse(b.at), hours=(end-start)/HOUR;
      const loss=a.postG-drained(b);
      if (hours<2 || hours>20 || loss<0) continue;
      const period=lossPeriod(a.setup,start,end);
      if (period) samples[period].push({at:b.at,own,gap,rate:loss/hours});
    }
  }
  const loss=[0,0];
  let intervals=0;
  for (const {session,hours} of periods) {
    // Prefer intervals at a similar elapsed growth age, including earlier runs.
    const rates=samples[session].sort((a,b)=>a.gap-b.gap||Number(b.own)-Number(a.own)||Date.parse(b.at)-Date.parse(a.at))
      .slice(0,6).map(row=>row.rate);
    if (rates.length<2) return {lossRange:null,intervals:0};
    loss[0]+=Math.min(...rates)*hours;
    loss[1]+=Math.max(...rates)*hours;
    intervals+=rates.length;
  }
  return {lossRange:loss.map(round),intervals};
}
function moistTrend(rows,setupId,at) {
  const anchors=[];
  const verified=rows.filter(row=>row.own && row.setupId===setupId && row.postMoist && row.poolG===0)
    .sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
  for (const row of verified) {
    const time=Date.parse(row.at);
    if (!anchors.length || anchors.at(-1).time-time>=4*HOUR) anchors.push({time,grams:row.post});
    if (anchors.length===5) break;
  }
  const latest=anchors[0], first=anchors.at(-1);
  if (anchors.length<3 || latest.time-first.time<12*HOUR) return null;
  const slopes=anchors.slice(1).map((older,i)=>(anchors[i].grams-older.grams)*HOUR/(anchors[i].time-older.time));
  const sign=Math.sign(slopes[0]);
  if (!sign || slopes.some(value=>Math.sign(value)!==sign)) return null;
  const rate=sign*Math.min(...slopes.map(Math.abs));
  const until=latest.time+12*HOUR;
  return {rate,from:first.time,to:Math.min(at,until),until};
}
const moistWeights=checks=>checks.flatMap(r=>[
  ...(r.postMoist?[r.post]:[]),
  ...(r.poolG===0 && r.observation==='moist'?[r.pre]:[]),
]).slice(0,6);
function target(cycles, cycle, setup, stage, at, planner) {
  const entry=planner.effectiveHistory(cycle).at(-1);
  const stageDay=planner.dayDelta(at,entry.occurredAt), emptyG=tare(setup,stage);
  const stageHours=(at-Date.parse(entry.occurredAt))/HOUR;
  const {next,periods}=checkWindow(setup,at);
  const runs=matching(cycles,cycle,setup,stage,at,planner);
  const rows=runs.flatMap(({own,checks})=>checks
    .filter(r=>r.stage===stage && closeRecipe(setup,r.setup) && Math.abs(r.stageDay-stageDay)<=3)
    .map(r=>({...r,own,gap:Math.abs(r.stageDay-stageDay),pre:drained(r)-r.tareG,
      post:r.postG===null?null:r.postG-r.tareG})))
    .sort((a,b)=>Number(b.own)-Number(a.own)||a.gap-b.gap||Date.parse(b.at)-Date.parse(a.at));
  const setupId=latestSetup(cycle)?.id, trend=moistTrend(rows,setupId,at);
  // Compare current-setup observations at today's moist reference. Older
  // observations still contribute to paired loss rates and remain in history.
  const comparable=trend?rows.filter(row=>row.own && row.setupId===setupId).map(row=>{
    const shift=trend.rate*(trend.to-Math.max(trend.from,Date.parse(row.at)))/HOUR;
    return {...row,pre:row.pre+shift,post:row.post===null?null:row.post+shift};
  }):rows;
  const recent=comparable.filter(r=>r.gap<=1).slice(0,12);
  const earlier=comparable.filter(r=>r.gap>1 && r.stageDay<stageDay);
  const clear=recent.filter(r=>r.poolG===0);
  const ready=clear.filter(r=>r.observation==='ready').slice(0,5);
  const moist=moistWeights(recent);
  if (stage==='germination' && stageDay<=1 && setup.sowMoist && moist.length<3) {
    moist.push(starting(setup,stage)-emptyG);
  }
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

  // Dry feedback sets a floor. If repeated readings disagree with the previous
  // low edge, a higher confirmed-moist reading can support a new low edge.
  const dryFloor=dry.length?Math.max(...dry.map(r=>r.pre))+1:0;
  const wetCeiling=wet.length?Math.min(...wet.map(r=>r.pre))-1:Infinity;
  const result={next,stageDay,band:null,postBand:null,postTarget:null,lossRange:null,intervals:0,trend:!!trend,
    conflict:false,dryEdge:round(dryFloor+emptyG),wetEdge:wet.length?round(wetCeiling+emptyG):null};
  if (!moist.length) return result;
  const allowedMoist=moist.filter(value=>value>dryFloor&&value<=wetCeiling);
  const upper=allowedMoist.length?round(median(allowedMoist)+emptyG):NaN;
  const usedEarlier=!!(olderReady||olderDry||olderWet||olderMoist.length);
  const minimum=round(emptyG+setup.dryG);
  if (!grams(upper,minimum)) return {...result,conflict:true};
  // One verified moist weight is enough for a refill reference. A pre-water
  // range and a forecast still need a dry edge and paired interval readings.
  if (!ready.length && !dry.length) return {...result,postBand:nearMoist(minimum,upper),postTarget:upper,earlier:usedEarlier};
  const usualLow=ready.length?median(ready.map(r=>r.pre)):dryFloor;
  const lower=Math.max(usualLow,dryFloor,setup.dryG);
  const band=[round(lower+emptyG),upper];
  if (!(band[0]<band[1]) || !grams(band[0],minimum)) {
    return {...result,conflict:true};
  }
  const {lossRange,intervals}=lossForecast(runs,setup,stage,stageHours,periods);
  // Intervals give net loss on the scale. If the reference is moving, aim
  // to stay above the projected dry edge at the next check.
  const shiftToNext=trend?trend.rate*(Math.min(next,trend.until)-trend.to)/HOUR:0;
  const nextFloor=round(band[0]+shiftToNext);
  const postBand=lossRange?lossRange.map(loss=>Math.min(upper,Math.max(band[0],round(nextFloor+loss)))):nearMoist(band[0],upper);
  return {...result,band,postBand,postTarget:postBand[1],lossRange,intervals,nextFloor,earlier:usedEarlier};
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
const api={observations,sessions,grams,coirRecipe,validCoir,validSeedBasis,setupError,tare,stackBudget,starting,drained,checkError,latestSetup,
  series,defaultSession,target,recipeBand,harvests,round,DAY,TRAY_TARE_G,REFILL_WINDOW_G};
if (typeof module==='object') module.exports=api; else root.TrayWeightModel=api;
})(typeof window==='undefined'?globalThis:window);
