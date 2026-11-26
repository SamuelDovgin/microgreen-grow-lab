/* Grow Planner records facts as events; every view derives from the same history. */
(function (root) {
'use strict';
const CropData = typeof module === 'object' ? require('./crop-data.js') : root.CropData;
const Weights = typeof module === 'object' ? require('./tray-weight-model.js') : root.TrayWeightModel;
const {dateAt,stageHeight} = typeof module === 'object' ? require('./crop-model.js') : root.CropModel;
const DAY = 86400000, CHECK_EARLY_MS = 4*60*60*1000, SCHEMA = 'grow-lab-planner/1';
const MAX_PHOTO_LENGTH = 80*1024;
const PHASE = {germination:'Germination', blackout:'Optional Blackout', lights:'Under Lights', harvested:'Harvested', ended:'Ended'};
const ACTIVE = ['germination','blackout','lights'];
const kindFor = {germination:'germination_started', blackout:'blackout_started', lights:'lights_started', harvested:'harvested', ended:'ended'};
const dateText = new Intl.DateTimeFormat('en-CA', {year:'numeric', month:'2-digit', day:'2-digit'});
const fmtLong = new Intl.DateTimeFormat('en-US', {dateStyle:'medium', timeStyle:'short'});
const fmtShort = new Intl.DateTimeFormat('en-US', {weekday:'short', hour:'numeric', minute:'2-digit'});
const fmtZone = new Intl.DateTimeFormat('en-US', {timeZoneName:'short'});
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = (x, max=160) => typeof x === 'string' && x.trim().length > 0 && x.length <= max;
const stringList = (x, max=30) => Array.isArray(x) && x.length <= max && x.every(v=>text(v,400));
const range = x => Array.isArray(x) && x.length===2 && x.every(n=>Number.isFinite(n)&&n>0&&n<=100) && x[0]<=x[1];
const optionalRange = x => x === null || range(x);
const revision = x => Number.isSafeInteger(x) && x>=0 && x<Number.MAX_SAFE_INTEGER;
const time = x => new Date(x).getTime();
const requireThat = (ok, message) => { if (!ok) throw new Error(message); };
const stamp = x => new Date(x).toISOString();
function isInstant(s) {
  if (typeof s!=='string' || !/^\d{4}-\d\d-\d\dT(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(s)) return false;
  return !!dateAt(s.slice(0,10),0) && Number.isFinite(time(s));
}
function dayKey(x) {
  const parts = Object.fromEntries(dateText.formatToParts(new Date(x)).map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
const clockKey = x => [new Date(x).getHours(),new Date(x).getMinutes()].map(n=>String(n).padStart(2,'0')).join(':');
const localInput = x => `${dayKey(x)}T${clockKey(x)}`;
function localInstant(value) {
  requireThat(typeof value==='string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value), 'Enter a date and time.');
  const n = time(value);
  requireThat(Number.isFinite(n) && localInput(n)===value, 'That local date or time does not exist. Choose another time.');
  // For the repeated fall-back hour JS selects its first occurrence. The form exposes both offsets.
  return stamp(n);
}
function timeOptions(value) {
  const first = localInstant(value), matches = [first];
  const n = time(first);
  const offsets = [new Date(n-DAY),new Date(n),new Date(n+DAY)].map(d=>d.getTimezoneOffset());
  for (const delta of new Set(offsets.map(o=>o-offsets[1]))) {
    if (delta>0 && localInput(n+delta*60000)===value) matches.push(stamp(n+delta*60000));
  }
  return matches;
}
const zoneAt = x => fmtZone.formatToParts(new Date(x)).find(p=>p.type==='timeZoneName')?.value || '';
const formatTime = (x, compact=false) => `${(compact?fmtShort:fmtLong).format(new Date(x))} ${zoneAt(x)}`;
const dayDelta = (a,b) => Math.round((time(dayKey(a)+'T12:00:00Z')-time(dayKey(b)+'T12:00:00Z'))/DAY);
const startOfWeek = x => dateAt(dayKey(x),-((new Date(dayKey(x)+'T12:00:00Z').getUTCDay()+6)%7));
const weekDay = (key, i) => dateAt(key,i);
const shift = (anchor, days) => stamp(time(anchor)+days*DAY);
const band = (anchor, days) => days?.map(d=>shift(anchor,d)) || null;
const bandText = days => days[0]===days[1] ? `${days[0]} ${days[0]===1?'day':'days'}` : `${days[0]}–${days[1]} days`;
const normalizeCrop = id => Object.hasOwn(CropData.retiredCropIds,id) ? CropData.retiredCropIds[id].cropId : id;
const cropById = new Map(CropData.crops.map(crop=>[crop.id,crop]));
const findCrop = id => cropById.get(normalizeCrop(id));

// Prefer the quick-start checks and their path-specific harvest anchors.
// For a source with cover+total only, subtract the outer bounds.
const anchors = {
  broccoli:{direct:['bootstrap'], blackout:['otg-coir']},
  'radish-daikon':{blackout:[null,[3,4],'G09','On The Grow · radish']},
  sunflower:{direct:['donny',[6,7]], blackout:['otg-soak']},
  'pea-basic':{blackout:['otg-coir']}
};
const blackoutCue = {
  broccoli:'Pale stems still stand on their own; early light is fine even if they are shorter.',
  'radish-daikon':'Seedlings stand on their own. Move to light before stems start to lean.',
  sunflower:'Shoots stand upright and hulls are loosening; look for crowding under the dome.',
  'pea-basic':'Most shoots are upright and anchored. Move to light before they start to tangle.'
};
const manualBlackoutCues = [
  'Use a loose dark cover without weight.',
  'Check that shoots are rooted and upright. Move to lights before they start to lean or crowd the cover.'
];
const germCue = {
  broccoli:'Rooted, pale shoots cover most of the tray. Look for shoots lifting the contact tray.',
  'radish-daikon':'Most seedlings have emerged and anchored. Pale shoots outnumber dark hulls.',
  sunflower:'Rooted shoots are lifting the contact tray. Look for pale growth and loosening hulls.',
  'pea-basic':'Shoots are anchored across most of the tray. Check for cover lift and move before shoots tangle.',
  mung:'Roots are anchored and shoots are upright across most of the tray. A tiny root tip alone is too early.'
};
function catalogSchedule(crop) {
  if (!crop) return {};
  const cover = range(crop.coverDays) ? [...crop.coverDays] : null;
  const sowDays = crop.harvestDays;
  // The catalog gives days from sowing. Keep that window until an actual light
  // time is recorded, then use the possible light durations for the catalog method.
  const days = cover && range(sowDays) ? [sowDays[0]-cover[1],sowDays[1]-cover[0]] : null;
  const harvest = range(days) ? {
    days, sowDays:[...sowDays],
    source:crop.provenance?.harvest?.split(';')[0] || crop.source,
    label:'Crop catalog'
  } : null;
  return {cover,harvest};
}
const catalogCues = {
  germination:crop=>[crop?.calendar?.exit].filter(Boolean),
  lights:crop=>[crop?.calendar?.harvest,'Inspect several spots across the tray before deciding to cut.'].filter(Boolean)
};
const decisionFits = (decision,canBlackout) => object(decision) && range(decision.days)
  && text(decision.lookFor,400) && text(decision.action,400)
  && (canBlackout ? ['blackout-recommended','blackout-optional'].includes(decision.nextStep) : decision.nextStep==='direct-light');
function quickStartDecision(row,canBlackout) {
  const decision={days:row?.transitionCheckDays || row?.germinationDays, lookFor:row?.germinationReady,
    action:row?.blackoutUse, nextStep:row?.nextStep};
  return decisionFits(decision,canBlackout)?{...decision,days:[...decision.days]}:null;
}
function snapshot(crop, guidance) {
  const q = guidance?.crops?.find(row=>row.cropId===crop.id && range(row.germinationDays) && text(row.germinationReady,400));
  const reference = anchors[crop.id] || {};
  const catalog = catalogSchedule(crop);
  function timing(path) {
    const [id, explicit, source, label] = reference[path] || [];
    const recipe = crop.alternatives?.find(r=>r.id===id);
    const beforeLights = recipe?.blackoutDays;
    const inferred = range(recipe?.harvest) && range(recipe?.cover) && Number.isFinite(beforeLights)
      ? [recipe.harvest[0]-recipe.cover[1]-beforeLights, recipe.harvest[1]-recipe.cover[0]-beforeLights] : null;
    const days = explicit || inferred;
    return range(days) ? {days:[...days], source:source||recipe.source, label:label||recipe.label} : null;
  }
  // This snapshot flag describes the source method; stage transitions are available to all trays.
  const methodIncludesBlackout = q?.extraBlackoutDays?.[1]>0 || false;
  const decision = quickStartDecision(q,methodIncludesBlackout);
  const blackoutRecipe = crop.alternatives?.find(r=>r.id===reference.blackout?.[0]);
  // G09 records one loose blackout day; the other durations come from their named recipes.
  const darkDays = methodIncludesBlackout ? (crop.id==='radish-daikon' ? 1 : blackoutRecipe?.blackoutDays) : null;
  const directHarvest = (q && timing('direct')) || catalog.harvest;
  return {
    dataVersion:CropData.version, reviewed:q ? guidance.reviewed : null, cropId:crop.id, cropName:crop.name,
    recipeId:q?'quick-start':'catalog-estimate', methodLabel:q?'Quick-start inspection guide':'Crop catalog estimate',
    canBlackout:methodIncludesBlackout, coverRangeDays:q ? [...q.germinationDays] : catalog.cover, blackoutRangeDays:darkDays>0?[darkDays,darkDays]:null,
    ...(decision && {germinationDecision:decision}),
    directHarvest, blackoutHarvest:methodIncludesBlackout ? timing('blackout') : null,
    readinessCues:{
      germination:q?[germCue[crop.id] || q.germinationReady,q.note].filter(Boolean):catalogCues.germination(crop),
      blackout:methodIncludesBlackout?[blackoutCue[crop.id],'Remove the loose cover when you move the tray to light.']:[],
      lights:catalogCues.lights(crop)
    },
    blackoutUse:methodIncludesBlackout?q.blackoutUse:null,
    sourceReferences:[...new Set([...(q?.sources || []),...(directHarvest?.sowDays?[directHarvest.source]:[])])]
  };
}
function validateSnapshot(s, cropId) {
  const timing = v => v===null || object(v)&&range(v.days)&&text(v.source)&&text(v.label)
    && (v.sowDays===undefined||range(v.sowDays));
  requireThat(object(s) && s.cropId===cropId && text(s.cropName) && text(s.dataVersion)
    && (s.reviewed===null||text(s.reviewed)) && text(s.recipeId) && text(s.methodLabel) && typeof s.canBlackout==='boolean'
    && optionalRange(s.coverRangeDays) && optionalRange(s.blackoutRangeDays) && timing(s.directHarvest) && timing(s.blackoutHarvest)
    && (s.canBlackout || s.blackoutRangeDays===null && s.blackoutHarvest===null && s.blackoutUse===null)
    && (s.germinationDecision===undefined || decisionFits(s.germinationDecision,s.canBlackout))
    && (s.blackoutUse===null || text(s.blackoutUse,400)) && object(s.readinessCues)
    && ACTIVE.every(k=>stringList(s.readinessCues[k],3)) && stringList(s.sourceReferences),
    'The backup contains an invalid crop guidance snapshot.');
}
function allowed(from, to) {
  return (from===null && to==='germination') || (
    ACTIVE.includes(from) && (to==='ended' ||
    from==='germination' && (to==='lights'||to==='blackout') ||
    from==='blackout'&&to==='lights' || from==='lights'&&to==='harvested'));
}
function effectiveHistory(cycle) {
  const history = [], indexes = new Map();
  for (const e of cycle.events) {
    if (e.toPhase) {
      indexes.set(e.id,history.length);
      history.push({...e, originalOccurredAt:e.occurredAt, corrections:[]});
    } else if (e.kind==='event_corrected' && indexes.has(e.relatedEventId)) {
      const row = history[indexes.get(e.relatedEventId)];
      row.occurredAt=e.occurredAt;
      row.corrections.push(e);
    }
  }
  return history;
}
const phase = cycle => cycle.events.findLast(e=>e.toPhase)?.toPhase;
const active = doc => doc.cycles.filter(c=>ACTIVE.includes(phase(c)));
const empty = () => ({schema:SCHEMA,revision:0,cycles:[]});
const notes = cycle => cycle.events.filter(e=>e.kind==='note_added');
function withinTimeline(rows, index) {
  const current = time(rows[index].occurredAt);
  return (index===0 || current>=time(rows[index-1].occurredAt)) &&
    (index===rows.length-1 || current<=time(rows[index+1].occurredAt));
}
function validateHarvest(harvest) {
  requireThat(object(harvest),'The tray contains invalid harvest details.');
  const {weightG,note,photo}=harvest;
  requireThat(weightG===null || Number.isFinite(weightG) && weightG>=0,'Enter a nonnegative harvest weight in grams.');
  requireThat(note===null || text(note,1500),'Enter a harvest note up to 1,500 characters.');
  requireThat(photo===null || typeof photo==='string' && photo.length<=MAX_PHOTO_LENGTH &&
    /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]*={0,2}$/.test(photo),'The tray contains an invalid harvest photo.');
}
function validate(doc) {
  requireThat(object(doc) && doc.schema===SCHEMA && revision(doc.revision) && Array.isArray(doc.cycles)
    && (doc.exportedAt===undefined||isInstant(doc.exportedAt)), 'This is not a supported Grow Planner backup.');
  const ids = new Set();
  function unique(id) {
    requireThat(text(id,120) && !ids.has(id),'The backup has a missing or duplicate record ID.');
    ids.add(id);
  }
  for (const c of doc.cycles) {
    requireThat(object(c) && text(c.name,80) && text(c.cropId) && c.rackGroupId==='rack1' && isInstant(c.createdAt)
      && revision(c.revision) && Array.isArray(c.events) && c.events.length>0
      && c.revision===c.events.length-1,'The backup contains an invalid tray.');
    unique(c.id);
    validateSnapshot(c.cropMethodSnapshot,c.cropId);
    const effective = [], byId = new Map();
    if (c.sowingInputs!==undefined) {
      const {coir,seed}=c.sowingInputs||{};
      requireThat(Weights.validCoir(coir) && (seed===null || Weights.validSeedBasis(seed) &&
        seed.sownAt===c.events[0]?.occurredAt),'The tray contains invalid sowing inputs.');
    }
    let from=null, recordedAt=time(c.createdAt), weightSetup=null;
    for (const [i,e] of c.events.entries()) {
      requireThat(object(e) && isInstant(e.occurredAt) && isInstant(e.recordedAt)
        && time(e.occurredAt)<=time(e.recordedAt) && time(e.recordedAt)>=recordedAt,
        'The history contains a time that is out of order.');
      unique(e.id);
      recordedAt=time(e.recordedAt);
      if (e.note!==undefined) requireThat(text(e.note,1500),'The backup contains an invalid note.');
      if (e.toPhase!==undefined) {
        requireThat(allowed(from,e.toPhase) && e.kind===kindFor[e.toPhase] && e.fromPhase===from
          && (e.note===undefined||e.toPhase==='ended'),'The history contains an unsupported stage change.');
        byId.set(e.id,effective.length);
        effective.push({...e});
        requireThat(withinTimeline(effective,effective.length-1),'This time would put stages out of order. It must be between the preceding and following actual stages.');
        from=e.toPhase;
      } else {
        requireThat(i>0 && e.fromPhase===undefined,'The first event must be a germination start.');
        if (e.kind==='event_corrected') {
          const j=byId.get(e.relatedEventId);
          requireThat(j!==undefined && e.note===undefined,'The correction does not refer to an actual stage.');
          requireThat(e.seedBasis===undefined || j===0 && Weights.validSeedBasis(e.seedBasis) &&
            e.seedBasis.sownAt===e.occurredAt,'The correction contains an invalid sowing seed rate.');
          effective[j].occurredAt=e.occurredAt;
          requireThat(withinTimeline(effective,j),'This time would put stages out of order. It must be between the preceding and following actual stages.');
        } else if (e.kind==='weight_setup_saved') {
          requireThat(ACTIVE.includes(from) && !Weights.setupError(e.setup),'The tray contains an invalid weight setup.');
          weightSetup=e;
        } else if (e.kind==='weight_check_added') {
          const stage=effective.at(-1);
          requireThat(ACTIVE.includes(from) && e.stageId===stage.id && e.setupId===weightSetup?.id &&
            time(e.occurredAt)>=time(stage.occurredAt) && !Weights.checkError(e.check,weightSetup.setup,from),
            'The tray contains an invalid weight check.');
        } else requireThat(e.kind==='note_added' && text(e.note,1500),'The history contains an invalid event.');
      }
    }
    if (c.harvest!==undefined) {
      requireThat(from==='harvested','Harvest details require a harvested tray.');
      validateHarvest(c.harvest);
    }
  }
  return doc;
}
function parse(raw) {
  let doc;
  try { doc=JSON.parse(raw); } catch { throw new Error('This file is not valid JSON.'); }
  return validate(doc);
}
function enteredAt(occurredAt, now, earliest=-Infinity) {
  requireThat(isInstant(occurredAt),'Enter a valid actual date and time.');
  const n=time(occurredAt);
  requireThat(n<=now,'Actual time cannot be in the future.');
  requireThat(n>=earliest,'Actual time cannot be before the preceding stage.');
  return stamp(n);
}
const nextDoc = (doc, cycles) => validate({schema:SCHEMA,revision:doc.revision+1,cycles});
function createTray(doc, input, {now,id,guidance}) {
  const crop = findCrop(input.cropId);
  requireThat(crop,'Choose a crop.');
  const startedAt=enteredAt(input.startedAt,now), recordedAt=stamp(now);
  const note=input.note?.trim(), activeNames=new Set(active(doc).map(c=>c.name));
  let name=input.name?.trim() || crop.name;
  if (!input.name?.trim()) {
    for (let i=2; activeNames.has(name); i++) name=`${crop.name} ${i}`;
  }
  const cycle = {
    id:id(), name, cropId:crop.id, rackGroupId:'rack1', createdAt:recordedAt, revision:note?1:0,
    cropMethodSnapshot:snapshot(crop,guidance),
    events:[{id:id(),kind:kindFor.germination,fromPhase:null,toPhase:'germination',occurredAt:startedAt,recordedAt}]
  };
  if (input.sowingInputs) cycle.sowingInputs=input.sowingInputs;
  if (note) cycle.events.push({id:id(),kind:'note_added',occurredAt:recordedAt,recordedAt,note});
  return nextDoc(doc,[...doc.cycles,cycle]);
}
function previewTransition(cycle, to) {
  const from=phase(cycle);
  if (allowed(from,to)) return {ok:true,from,to};
  if (from===to) return {ok:false,reason:'This tray is already in that stage.'};
  if (ACTIVE.indexOf(to)>=0 && ACTIVE.indexOf(to)<ACTIVE.indexOf(from)) return {ok:false,reason:'That would reverse a recorded stage. Open the tray and use Correct time to fix a timestamp.'};
  return {ok:false,reason:'This stage change is unavailable.'};
}
function updateTray(doc, input, update) {
  requireThat(input.expectedRevision===doc.revision,'Planner changed in another tab or this action was already saved. Reopen the tray and review its history.');
  const c=doc.cycles.find(c=>c.id===input.trayId);
  requireThat(c,'This tray is no longer available.');
  const next=update(c);
  return next===c ? doc : nextDoc(doc,doc.cycles.map(row=>row===c ? next : row));
}
function withEvent(c,event) {
  return {...c,revision:c.revision+1,events:[...c.events,event]};
}
function append(doc, input, build) {
  return updateTray(doc,input,c=>withEvent(c,build(c)));
}
function withHarvest(c,{weightG=null,note=null,photo=null}={}) {
  const harvest={weightG,note:typeof note==='string' ? note.trim()||null : note,photo};
  validateHarvest(harvest);
  if (!c.harvest && weightG===null && !harvest.note && !photo) return c;
  if (c.harvest?.weightG===weightG && c.harvest.note===harvest.note && c.harvest.photo===photo) return c;
  const next={...c};
  if (weightG!==null || harvest.note || photo) next.harvest=harvest;
  else delete next.harvest;
  return next;
}
function confirmTransition(doc, input, {now,id}) {
  return updateTray(doc,input,c=>{
    const result=previewTransition(c,input.toPhase);
    requireThat(result.ok,result.reason);
    const occurredAt=enteredAt(input.occurredAt,now,time(effectiveHistory(c).at(-1).occurredAt));
    const note=input.toPhase==='ended' && input.note?.trim();
    const event={id:id(),kind:kindFor[input.toPhase],fromPhase:result.from,toPhase:input.toPhase,occurredAt,recordedAt:stamp(now),...(note?{note}:{})};
    const next=withEvent(c,event);
    return input.toPhase==='harvested' && input.harvest ? withHarvest(next,input.harvest) : next;
  });
}
function saveHarvest(doc,input) {
  return updateTray(doc,input,c=>{
    requireThat(phase(c)==='harvested','Mark this tray harvested before adding harvest details.');
    return withHarvest(c,input.harvest);
  });
}
function correctEvent(doc, input, {now,id}) {
  return append(doc,input,c=>{
    const original=effectiveHistory(c).find(e=>e.id===input.eventId);
    requireThat(original,'Choose an actual stage to correct.');
    const occurredAt=enteredAt(input.occurredAt,now);
    requireThat(time(occurredAt)!==time(original.occurredAt),'Choose a different date or time to correct this entry.');
    return {id:id(),kind:'event_corrected',relatedEventId:input.eventId,occurredAt,recordedAt:stamp(now),
      ...(original.toPhase==='germination' && input.seedBasis?{seedBasis:input.seedBasis}:{})};
  });
}
function addNote(doc, input, {now,id}) {
  const note=input.note?.trim();
  requireThat(text(note,1500),'Enter a note up to 1,500 characters.');
  return append(doc,input,()=>({id:id(),kind:'note_added',occurredAt:stamp(now),recordedAt:stamp(now),note}));
}
function saveWeightSetup(doc, input, {now,id}) {
  const error=Weights.setupError(input.setup);
  requireThat(!error,error);
  return append(doc,input,c=>{
    requireThat(ACTIVE.includes(phase(c)),'Weight setup requires a growing tray.');
    return {id:id(),kind:'weight_setup_saved',occurredAt:stamp(now),recordedAt:stamp(now),setup:input.setup};
  });
}
function addWeightCheck(doc, input, {now,id}) {
  return append(doc,input,c=>{
    const setup=Weights.latestSetup(c), stage=effectiveHistory(c).at(-1);
    requireThat(setup && ACTIVE.includes(stage.toPhase),'Set up scale weights for this growing tray first.');
    const check={...input.check,band:null};
    const error=Weights.checkError(check,setup.setup,stage.toPhase);
    requireThat(!error,error);
    check.band=Weights.target(doc.cycles,c,setup.setup,stage.toPhase,now,M).band;
    return {id:id(),kind:'weight_check_added',occurredAt:stamp(now),recordedAt:stamp(now),
      stageId:stage.id,setupId:setup.id,check};
  });
}
function importBackup(doc, backup) {
  validate(backup);
  const known=new Map(doc.cycles.map(c=>[c.id,c]));
  const additions=[];
  const canonical = obj => Array.isArray(obj) ? obj.map(canonical) : object(obj)
    ? Object.fromEntries(Object.keys(obj).sort().map(k=>[k,canonical(obj[k])])) : obj;
  for (const c of backup.cycles) {
    if (!known.has(c.id)) additions.push(c);
    else requireThat(JSON.stringify(canonical(known.get(c.id)))===JSON.stringify(canonical(c)),
      'A tray in this backup differs from a tray already saved here. Nothing was imported. To restore this version, use a separate browser profile.');
  }
  return additions.length?nextDoc(doc,[...doc.cycles,...additions]):doc;
}
function projection(cycle, now, guidance) {
  const history=effectiveHistory(cycle), started=history[0].occurredAt, entry=history.at(-1), current=entry.toPhase;
  const s=cycle.cropMethodSnapshot, dark=history.some(e=>e.toPhase==='blackout');
  // Old backups and saved trays lack some forecasts. Fill gaps in the view so
  // importing an identical backup still works and no saved facts need rewriting.
  const crop=findCrop(s.cropId);
  const catalog=s.coverRangeDays && s.directHarvest ? {} : catalogSchedule(crop);
  const directHarvest=s.directHarvest || catalog.harvest || null;
  const approximateAfterBlackout=dark && !s.blackoutHarvest && current==='lights' && !!directHarvest;
  const harvestMethod=dark ? (s.blackoutHarvest || (approximateAfterBlackout
    ? {...directHarvest,label:directHarvest.label+' · usual time under lights'} : null)) : directHarvest;
  const days=current==='germination'?(s.coverRangeDays || catalog.cover):current==='blackout'?s.blackoutRangeDays:current==='lights'?harvestMethod?.days:null;
  const estimated=current==='germination'
    ? !!days && (s.recipeId==='catalog-estimate' || !s.coverRangeDays)
    : current==='lights' && (!!harvestMethod?.sowDays || approximateAfterBlackout);
  const window=band(entry.occurredAt,days), age=(now-time(entry.occurredAt))/DAY;
  const stageLabel=current==='lights'?'Harvest inspection':current==='blackout'?'Light check':'Cover check';
  let status='none';
  if (window) {
    const [first,last]=window;
    // An exact-day method is a first check, not a zero-length readiness window.
    const end=time(first)===time(last) ? time(last)+DAY : time(last);
    status=now>end?'past':now>=time(first)-CHECK_EARLY_MS?'check':dayDelta(first,now)===1 && time(first)-now<=1.5*DAY?'tomorrow':'early';
  }
  // Before lights, a harvest estimate is conditional on the projected next stage.
  const lightWindow=current==='lights'?[entry.occurredAt,entry.occurredAt]:window;
  const harvest=current==='germination' && harvestMethod?.sowDays ? band(started,harvestMethod.sowDays)
    : ACTIVE.includes(current) && lightWindow && harvestMethod
      ? [shift(lightWindow[0],harvestMethod.days[0]),shift(lightWindow[1],harvestMethod.days[1])] : null;
  const savedCues=s.readinessCues[current];
  // Show the reviewed decision on existing quick-start trays without editing their snapshots.
  const decision=current==='germination' && (s.germinationDecision || (s.recipeId==='quick-start'
    && quickStartDecision(guidance?.crops?.find(row=>row.cropId===s.cropId),s.canBlackout)));
  return {history,started,entry,current,age,day:dayDelta(now,started),phaseDay:dayDelta(now,entry.occurredAt),
    dark,days,window,status,stageLabel,harvest,harvestMethod,estimated,
    height:current==='ended'?null:stageHeight(crop,current),
    stageHeights:['sow','germination','blackout','lights'].map(phase=>({phase,...stageHeight(crop,phase)})),
    germinationDecision:decision?{...decision,window:band(started,decision.days)}:null,
    cues:savedCues?.length?savedCues:(current==='blackout'?manualBlackoutCues:(catalogCues[current]?.(crop) || []))};
}
function digest(doc, now) {
  const weight={past:0,check:1,tomorrow:2};
  const priority=p=>p.current==='lights'&&p.status!=='past'?3:weight[p.status];
  return active(doc).map(c=>({c,p:projection(c,now)})).filter(({p})=>Object.hasOwn(weight,p.status))
    .sort((a,b)=>priority(a.p)-priority(b.p));
}
function agenda(doc, weekStart, now) {
  const week=Array.from({length:7},(_,i)=>({key:weekDay(weekStart,i),rows:[]}));
  const days=new Map(week.map(day=>[day.key,day.rows]));
  const add=row=>days.get(dayKey(row.at))?.push(row);
  for (const c of doc.cycles) {
    const p=projection(c,now);
    for (const e of p.history) add({c,actual:true,at:e.occurredAt,label:eventLabel(e.toPhase)});
    if (p.window) {
      const at=['past','check'].includes(p.status) ? stamp(now) : p.window[0];
      add({c,actual:false,at,label:p.status==='past'?`${p.stageLabel} · past typical window`:p.stageLabel,window:p.window,estimated:p.estimated});
    }
    if (p.harvest && p.current!=='lights' && time(p.harvest[0])>now) {
      const estimated=!!p.harvestMethod.sowDays;
      const label=estimated?'Harvest inspection · updates after move to light':'Harvest inspection · if moved to light near the estimate';
      add({c,actual:false,at:p.harvest[0],label,window:p.harvest,estimated});
    }
  }
  for (const {rows} of week) rows.sort((a,b)=>Number(b.actual)-Number(a.actual)||time(a.at)-time(b.at));
  return week;
}
function eventLabel(p) {
  return {germination:'Germination started',blackout:'Blackout started',lights:'Moved to lights',harvested:'Harvested',ended:'Grow ended'}[p];
}
function daypart(now) {
  const h=new Date(now).getHours();
  return h<12?'morning':h<17?'midday':'evening';
}
const M={DAY,SCHEMA,PHASE,ACTIVE,MAX_PHOTO_LENGTH,empty,active,phase,parse,validate,createTray,previewTransition,confirmTransition,
  saveHarvest,correctEvent,addNote,saveWeightSetup,addWeightCheck,importBackup,projection,digest,agenda,notes,effectiveHistory,localInstant,localInput,timeOptions,zoneAt,
  formatTime,dayKey,dayDelta,startOfWeek,weekDay,bandText,eventLabel,daypart};
if (typeof module==='object') module.exports=M; else root.GrowPlannerModel=M;
})(typeof window==='undefined'?globalThis:window);
