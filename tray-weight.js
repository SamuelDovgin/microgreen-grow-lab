/* Grow Planner's scale card uses the same dialog and save flow as tray stages. */
(() => {
'use strict';
const M=window.GrowPlannerModel, W=window.TrayWeightModel;
const D=window.CropData, R=window.SeedRates, C=window.CoirModel;
const cropIds=D.crops.map(c=>c.id);
const cropKey=id=>Object.hasOwn(D.retiredCropIds,id)?D.retiredCropIds[id].cropId:id;
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const fmt=(value,digits=1)=>Number(value).toLocaleString('en-US',{maximumFractionDigits:digits});
const g=value=>fmt(value)+' g';
const span=([low,high])=>low===high?fmt(low):fmt(low)+'–'+fmt(high);
const bandText=band=>span(band)+' g';
const massField=(key,label,value='',{min=0,required=false,max=20000,step='0.1'}={})=>
  `<label>${label}<input name="${key}" type="number" min="${min}" max="${max}" step="${step}" inputmode="decimal" value="${escape(value)}" ${required?'required':''}></label>`;
const requiredMass={min:0.1,required:true};
const parseMass=(data,key)=>data.get(key)===''?null:Number(data.get(key));
const action=(label,key)=>`<button class="pl-button" type="button" data-action="${key}">${label}</button>`;
const formActions=(save,back='Back',backAction='close')=>`<div class="pl-actions"><button class="pl-button pl-primary" type="submit">${save}</button>${action(back,backAction)}</div>`;
const stageClass=stage=>'weight-'+stage;
function recipe(cropId,version) {
  let saved=null;
  try { saved=JSON.parse(localStorage.getItem(C.PLAN_KEYS[version])); }
  catch { /* Use the calculator's starter if browser storage is unavailable. */ }
  const row=W.coirRecipe(cropKey(cropId),version,saved);
  return W.validCoir(row)?row:W.coirRecipe(cropKey(cropId),version,null);
}
function activeCoir(cropId) {
  let version='new';
  try { if (localStorage.getItem(C.ACTIVE_PLAN_KEY)==='old') version='old'; }
  catch { /* Use the New starter if browser storage is unavailable. */ }
  return recipe(cropId,version);
}
let seedRaw=null, personalEntries=[];
function seedAt(cropId,sownAt) {
  let raw=null;
  try { raw=localStorage.getItem(R.KEY); } catch { /* Published history is available offline. */ }
  if (raw!==seedRaw) {
    seedRaw=raw;
    personalEntries=raw?R.parse(raw,cropIds).doc?.entries||[]:[];
  }
  const id=cropKey(cropId), seed=R.atSowing(D,personalEntries,id,sownAt);
  if (!seed) return null;
  const crop=D.crops.find(item=>item.id===id);
  const soak=seed.kind==='personal'?seed.needsDrainedWeight:crop?.alternatives[0]?.soak?.[1]>0;
  return {...seed,sownAt,needsDrainedWeight:soak||id==='sunflower'};
}
function sowingSeed(cycle) {
  const event=M.effectiveHistory(cycle)[0], current=seedAt(cycle.cropId,event.occurredAt);
  // A backup can carry a saved personal reference into a browser without that seed-rate history.
  const saved=[cycle.sowingInputs?.seed,...event.corrections.map(correction=>correction.seedBasis),
    ...cycle.events.filter(record=>record.kind==='weight_setup_saved').map(record=>record.setup.seedBasis)]
    .filter(seed=>seed?.sownAt===event.occurredAt&&seed.kind==='personal');
  return saved.reduce((latest,seed)=>latest?.kind==='personal'&&Date.parse(latest.changedAt)>=Date.parse(seed.changedAt)?latest:seed,current);
}
const sowingInputs=(cropId,sownAt)=>({coir:activeCoir(cropId),seed:seedAt(cropId,sownAt)});
const drySeedMass=seed=>seed&&!seed.needsDrainedWeight?seed.grams:'';
function seedLabel(seed) {
  if (!seed) return 'No seed-rate revision is recorded before sowing. Enter the amount you used.';
  const amount=fmt(seed.grams,2);
  const source=seed.kind==='personal'?'Personal trial':'Published rate';
  const date=seed.changedAt?M.formatTime(seed.changedAt):seed.date+' (Chicago date)';
  return `${amount} g dry seed per 200 in² · ${source} from ${date}.`;
}
function setupFields(cycle) {
  const previous=W.latestSetup(cycle)?.setup;
  const seed=sowingSeed(cycle);
  const coir=cycle.sowingInputs?.coir||activeCoir(cycle.cropId);
  const s=previous||{...coir,seedG:drySeedMass(seed),mistG:0,
    group:'My rack',am:'08:00',pm:'20:00',coverBlackout:true,sowMoist:false};
  return `<form id="weight-setup-form" data-follow-seed="${!previous}" data-follow-coir="${!previous&&!cycle.sowingInputs?.coir}">
    <fieldset class="weight-fields"><legend>Weigh each empty tray</legend>
      <div class="weight-grid">
        ${massField('topG','Top cover (g)',s.topG,requiredMass)}
        ${massField('holesG','Middle tray with holes (g)',s.holesG,requiredMass)}
        ${massField('bottomG','Solid bottom tray (g)',s.bottomG,requiredMass)}
      </div>
      ${cycle.cropMethodSnapshot.canBlackout?`<label class="weight-checkbox"><input type="checkbox" name="coverBlackout" ${s.coverBlackout?'checked':''}> Include top cover in optional blackout readings</label>`:
        `<input type="hidden" name="coverBlackout" value="on">`}
    </fieldset>
    <fieldset class="weight-fields"><legend>What went in at sowing</legend>
      <p class="pl-help">Coco coir amounts are per tray. If you mixed a batch, enter this tray’s share. <a href="coir.html">Coco coir calculator</a></p>
      <div class="pl-actions">${action('Load New coir recipe','weight-coir-new')}${action('Load Old coir recipe','weight-coir-old')}</div>
      <p class="pl-help" id="weight-recipe-source">${escape(s.recipe)}${!previous&&cycle.sowingInputs?.coir?' when this tray was added':''}. Edit to match what you used.</p>
      <input type="hidden" name="recipe" value="${escape(s.recipe)}">
      <p class="pl-help" id="weight-seed-source">${escape(seedLabel(seed))}</p>
      <div class="pl-actions" id="weight-seed-action" ${previous&&drySeedMass(seed)!==''?'':'hidden'}>
        ${action('Load dated dry seed amount','weight-seed-load')}
      </div>
      <div class="weight-grid">
        ${massField('dryG','Dry coco coir (g)',s.dryG,{...requiredMass,step:'any'})}
        ${massField('hydrationG','Coir hydration water (mL)',s.hydrationG,{...requiredMass,step:'any'})}
        ${massField('seedG','Seeds as sown (g)',s.seedG,{...requiredMass,step:'any'})}
        ${massField('mistG','Seed spray at sowing (mL)',s.mistG)}
        ${massField('sowG','Full sowing stack (g, optional)',s.sowG)}
      </div>
      <p class="pl-help">Use the weight you actually sowed. Weigh soaked or rinsed seeds after draining.
      A full sowing weight includes all three trays, moistened coir, seeds and spray. Leave spray at 0 if you didn’t measure it.</p>
      <label class="weight-checkbox"><input type="checkbox" name="sowMoist" ${s.sowMoist?'checked':''}> I weighed the sowing stack and the coir felt evenly moist</label>
    </fieldset>
    <fieldset class="weight-fields"><legend>Your check routine</legend>
      <div class="weight-grid">
        <label>Morning time <input type="time" name="am" value="${escape(s.am)}" required></label>
        <label>Night time <input type="time" name="pm" value="${escape(s.pm)}" required></label>
      </div>
      <label>Setup name <input name="group" value="${escape(s.group)}" required maxlength="60"></label>
      <p class="pl-help">Reuse the setup name for trays grown in similar conditions. Give a new rack or watering setup its own name.</p>
    </fieldset>
    ${formActions('Save scale setup')}
  </form>`;
}
function setRecipe(form,row) {
  for (const [key,value] of Object.entries(row)) form.elements[key].value=value;
  form.querySelector('#weight-recipe-source').textContent=row.recipe+'. Edit to match what you used.';
}
function loadRecipe(form,cycle,version) {
  form.dataset.followCoir='false';
  setRecipe(form,recipe(cycle.cropId,version));
}
function refreshSetup(form,cycle,key) {
  if (key===R.KEY || key===null) {
    const seed=sowingSeed(cycle);
    form.querySelector('#weight-seed-source').textContent=seedLabel(seed);
    form.querySelector('#weight-seed-action').hidden=!W.latestSetup(cycle)||drySeedMass(seed)==='';
    if (form.dataset.followSeed==='true') form.elements.seedG.value=drySeedMass(seed);
  }
  if (form.dataset.followCoir==='true' && [null,C.ACTIVE_PLAN_KEY,...Object.values(C.PLAN_KEYS)].includes(key)) {
    setRecipe(form,activeCoir(cycle.cropId));
  }
}
function loadSeed(form,cycle) {
  form.elements.seedG.value=drySeedMass(sowingSeed(cycle));
}
function readSetup(data,cycle) {
  const seedBasis=sowingSeed(cycle);
  return {...Object.fromEntries(['topG','holesG','bottomG','dryG','hydrationG','seedG','mistG','sowG'].map(key=>[key,parseMass(data,key)])),
    mistG:parseMass(data,'mistG')??0,am:data.get('am'),pm:data.get('pm'),group:data.get('group').trim(),
    recipe:data.get('recipe'),coverBlackout:data.has('coverBlackout'),sowMoist:data.has('sowMoist'),
    ...(seedBasis?{seedBasis}:{})};
}
function readCheck(data) {
  return {...Object.fromEntries(['totalG','poolG','postG','waterG','heightIn'].map(key=>[key,parseMass(data,key)])),
    poolG:parseMass(data,'poolG')??0, session:data.get('session'),observation:data.get('observation'),
    postMoist:data.has('postMoist'),note:data.get('weightNote').trim()};
}
function scaleForm(setup,stage,instant) {
  const covered=stage==='germination'||stage==='blackout'&&setup.coverBlackout;
  const defaultSession=W.defaultSession(setup,instant);
  return `<form id="weight-check-form">
    <div class="weight-scale-head">
      <h3>Weigh the full stack</h3>
      <p>${covered?'Top cover + tray with holes + solid bottom tray.':'Tray with holes + solid bottom tray.'}
      Keep the coir, seeds and shoots on the scale. Remove any separate weights.</p>
      <p class="pl-help">Empty trays together weigh ${g(W.tare(setup,stage))}.</p>
    </div>
    <div class="weight-grid">
      <div class="weight-select"><label for="weight-session">Check</label><select id="weight-session" name="session">${Object.entries(W.sessions).map(([key,label])=>
        `<option value="${key}" ${key===defaultSession?'selected':''}>${label}</option>`).join('')}</select></div>
      ${massField('totalG','Scale reading (g)','',requiredMass)}
    </div>
    <div class="weight-select"><label for="weight-observation">How does it feel?</label><select id="weight-observation" name="observation">${Object.entries(W.observations).map(([key,label])=>
      `<option value="${key}">${label}</option>`).join('')}</select></div>
    <div id="weight-result" class="weight-result" role="status" aria-live="polite"></div>
    <details class="weight-more"><summary>Water added, standing water or growth notes</summary>
      <div class="weight-fields">
        ${massField('poolG','Standing water in bottom tray (g)',0)}
        <p class="pl-help">Leave at 0 if the bottom is empty. If water pooled, pour it into a tared cup to weigh it and subtract it from the reading.</p>
        <div class="weight-grid">
          ${massField('waterG','Water you added (mL)')}
          ${massField('postG','Weight after watering and draining (g)','',{min:0.1})}
          ${massField('heightIn','Typical shoot height (in, optional)','',{max:36})}
        </div>
        <label class="weight-checkbox"><input type="checkbox" name="postMoist" disabled> Coir felt evenly moist after draining</label>
        <label>Observation note <textarea name="weightNote" maxlength="500" placeholder="e.g. Droop at one edge only"></textarea></label>
      </div>
    </details>
    ${formActions('Save weight check','Back to tray','weight-tray')}
  </form>`;
}
function renderPreview(form,doc,cycle,instant) {
  const post=form.elements.postMoist;
  post.disabled=!form.elements.postG.value;
  if (post.disabled) post.checked=false;
  const setup=W.latestSetup(cycle).setup, stage=M.phase(cycle);
  const check=readCheck(new FormData(form)), target=W.target(doc.cycles,cycle,setup,stage,instant,check.session,M);
  const next=M.formatTime(target.next,true);
  const {band,postTarget,conflict,lossRange,intervals}=target;
  const {totalG,poolG,observation}=check, drainedG=W.drained(check);
  const observedDry=['ready','dry','droop'].includes(observation);
  const observedWet=observation==='wet'||poolG>0;
  let verdict='', tip='';
  if (totalG!==null && drainedG<W.round(W.tare(setup,stage)+setup.dryG)) {
    verdict='Check the scale reading';
    tip='The drained stack should weigh at least as much as its empty trays and dry coir.';
  } else if (observedWet) {
    verdict=poolG>0?'Standing water in the bottom tray':'You observed wet coir';
    tip='Empty any standing water and check again later.';
  } else if (totalG!==null && band) {
    verdict=drainedG<band[0]?'Likely on the dry side':drainedG>band[1]?'Likely on the wet side':'Within your observed range';
    if (observedDry && drainedG>=band[0]) verdict+=' · you observed dryness';
    if (observedDry || observation==='unknown' && drainedG<=band[0]) {
      tip=drainedG<postTarget?`If the coir feels dry, ${stage==='lights'?'bottom-water':'mist lightly'}, then weigh after excess water drains. Aim near ${g(postTarget)}.`:
        'Your dry observation will be saved. Inspect the coir in several spots before adding water.';
    } else if (observation==='moist') {
      tip='The coir feels evenly moist. Check again at your next session.';
    } else if (drainedG>band[1]) {
      tip='Check for excess moisture and wait before watering.';
    } else if (lossRange && drainedG-lossRange[1]<band[0]) {
      tip='Your tray may reach the dry edge before the next session. Check the coir again sooner if you can.';
    } else {
      tip='Check the coir before adding water. Weigh again at your next session.';
    }
  } else if (observedDry) {
    verdict='You observed dry coir';
    tip=`${stage==='lights'?'Bottom-water in small amounts':'Mist lightly'} if the coir feels dry. Record the drained weight once it feels evenly moist.`;
  }
  const result=form.querySelector('#weight-result');
  const markup=`
    <p class="weight-result-label">Day ${M.projection(cycle,instant).day} · ${M.PHASE[stage]} day ${target.stageDay} · ${W.sessions[check.session]} check</p>
    <h3>${band?`Target range ${bandText(band)}`:conflict?'Observations disagree':'Learning your target range'}</h3>
    ${band?`<p class="pl-help">${target.earlier?'Using earlier readings from the same stage. Recheck how the coir feels.':
      `Based on ${target.samples} nearby-stage check${target.samples===1?'':'s'}.`}
      If watering is needed, aim for about <strong>${g(postTarget)}</strong> after draining.</p>`:
      `<p class="pl-help">${conflict?'Log a fresh slightly dry reading and a higher evenly moist reading for this stage.':
        'Save a slightly dry reading before watering and an evenly moist reading after draining to establish a range.'}</p>`}
    ${!band && stage==='germination'?`<p class="pl-help">${setup.sowG===null?'Estimated':'Measured'} stack at sowing <strong>${g(W.starting(setup,stage))}</strong></p>`:''}
    ${verdict?`<p><strong>${verdict}</strong>${totalG!==null&&poolG>0?` · ${g(drainedG)} without standing water`:''}</p><p>${tip}</p>`:''}
    <p class="pl-help">Next check ${escape(next)}.${lossRange?
      ` Expected net weight loss ${bandText(lossRange)} based on ${intervals} similar intervals.${postTarget-lossRange[1]<band[0]?' Check sooner if the tray dries quickly.':''}`:
      ' Log drained after-watering weights and the next check to learn your day and overnight weight loss.'}</p>`;
  if (result.renderedMarkup!==markup) {
    result.innerHTML=markup;
    result.renderedMarkup=markup;
  }
}
function plot(checks,history,key,label,unit) {
  const values=checks.flatMap(row=>key==='mass'?
    [W.drained(row)-row.tareG,...(row.postG===null?[]:[row.postG-row.tareG]),...(row.band||[]).map(value=>value-row.tareG)]:
    row.heightIn===null?[]:[row.heightIn]);
  if (!values.length) return '';
  const width=520,height=158,left=66,right=16,top=18,bottom=32;
  const start=Date.parse(history[0].occurredAt);
  const elapsed=at=>(Date.parse(at)-start)/W.DAY;
  const days=Math.max(1,Math.ceil(Math.max(...checks.map(row=>elapsed(row.at)),elapsed(history.at(-1).occurredAt))));
  const x=day=>left+Math.max(0,day)/days*(width-left-right);
  const low=Math.max(0,Math.floor(Math.min(...values))-1), high=Math.ceil(Math.max(...values))+1;
  const y=value=>top+(high-value)/(high-low)*(height-top-bottom);
  const phases=history.filter(event=>M.ACTIVE.includes(event.toPhase)).map((event,index)=>{
    const from=x(elapsed(event.occurredAt)), to=x(index+1<history.length?elapsed(history[index+1].occurredAt):days);
    return `<rect class="${stageClass(event.toPhase)}" x="${from}" y="${top}" width="${to-from}" height="${height-top-bottom}"/>`;
  }).join('');
  const grid=[low,(low+high)/2,high].map(value=>`<line class="weight-grid-line" x1="${left}" x2="${width-right}" y1="${y(value)}" y2="${y(value)}"/>
    <text text-anchor="end" x="${left-6}" y="${y(value)+4}">${fmt(value)} ${unit}</text>`).join('');
  const ticks=[...new Set([0,Math.round(days/2),days])].map(day=>
    `<text text-anchor="middle" x="${Math.min(width-28,x(day))}" y="${height-10}">Day ${day}</text>`).join('');
  const growth=key==='height'?checks.filter(row=>row.heightIn!==null)
    .map(row=>`${x(elapsed(row.at))},${y(row.heightIn)}`).join(' '):'';
  const points=checks.filter(row=>key==='mass'||row.heightIn!==null).map(row=>{
    const position=x(elapsed(row.at)), value=key==='mass'?W.drained(row)-row.tareG:row.heightIn;
    const band=key==='mass'&&row.band?`<line class="weight-chart-band" x1="${position}" x2="${position}" y1="${y(row.band[1]-row.tareG)}" y2="${y(row.band[0]-row.tareG)}"/>`:'';
    const post=key==='mass'&&row.postG!==null?`<circle class="weight-chart-post" cx="${position}" cy="${y(row.postG-row.tareG)}" r="4"><title>After draining ${g(row.postG-row.tareG)}</title></circle>`:'';
    return `${band}<circle class="weight-chart-pre" cx="${position}" cy="${y(value)}" r="4"><title>${escape(M.formatTime(row.at,true))} · ${fmt(value)} ${unit}</title></circle>${post}`;
  }).join('');
  return `<figure class="weight-plot"><figcaption>${label}</figcaption><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${label} plotted against elapsed days since sowing">
    ${phases}${grid}${ticks}${growth?`<polyline class="weight-chart-growth" points="${growth}"/>`:''}${points}</svg></figure>`;
}
function charts(cycle,checks) {
  if (!checks.length) return '<p class="pl-help">Save a scale reading to start the graph. Add shoot height to see how the crop grows across stages.</p>';
  const history=M.effectiveHistory(cycle);
  return `${plot(checks,history,'mass','Contents weight over time','g')}
    ${plot(checks,history,'height','Measured shoot height','in')}
    <p class="pl-help">Contents include coir, plants and retained water. The graph takes out the empty trays and any measured standing water.</p>
    <div class="weight-legend" aria-label="Chart key">
      ${history.filter(event=>M.ACTIVE.includes(event.toPhase)).map(event=>`<span class="${stageClass(event.toPhase)}">${M.PHASE[event.toPhase]}</span>`).join('')}
      <span class="weight-legend-pre">At check</span><span class="weight-legend-post">After watering</span><span class="weight-legend-band">Target at check</span>
    </div>
    <details><summary>Saved readings (${checks.length})</summary><ol class="weight-records">${checks.slice().reverse().map(row=>`<li>
      <strong>Day ${row.day} · ${M.PHASE[row.stage]} · ${W.sessions[row.session]}</strong>
      <small>${escape(M.formatTime(row.at))}</small>
      <p>${g(row.totalG)} on scale${row.poolG?` · ${g(row.poolG)} standing water`:''} · ${W.observations[row.observation]}</p>
      <p>${[
        row.postG!==null?`${g(row.postG)} after draining${row.postMoist?' · evenly moist':''}`:null,
        row.waterG!==null?`${fmt(row.waterG)} mL added`:null,
        row.heightIn!==null?`${fmt(row.heightIn)} in shoots`:null,
        row.band?`Target ${bandText(row.band)}`:null
      ].filter(Boolean).join(' · ')}</p>
      ${row.note?`<p class="note-text">${escape(row.note)}</p>`:''}
      ${row.valid?'':'<small>This check is outside its stage after a date correction. It stays in history and is excluded from calibration.</small>'}
    </li>`).join('')}</ol></details>`;
}
function harvests(doc,cycle,setup,instant) {
  const sample=W.harvests(doc.cycles,cycle,setup,M);
  const p=M.projection(cycle,instant);
  const crop=window.CropData.crops.find(item=>item.id===cycle.cropId);
  const reference=crop?.calendar?.harvestReadiness?.heightIn;
  return `<section class="dialog-section">
    <h3>Harvest outcome</h3>
    ${cycle.harvest?.weightG!=null?`<p>This tray yielded <strong>${g(cycle.harvest.weightG)}</strong>.</p>`:''}
    ${cycle.harvest?.note?`<p class="note-text">${escape(cycle.harvest.note)}</p>`:''}
    ${p.harvest?`<p class="pl-help">Estimated harvest check ${escape(M.formatTime(p.harvest[0],true))}${p.harvest[0]===p.harvest[1]?'':` – ${escape(M.formatTime(p.harvest[1],true))}`}.</p>`:''}
    ${reference?`<p class="pl-help">Crop guide harvest height ${span(reference)} in.</p>`:''}
    ${crop?.calendar?.harvest?`<p class="pl-help">${escape(crop.calendar.harvest)}</p>`:''}
    ${sample?`<p>${sample.count===1?'Previous harvest':'Median harvest'} <strong>${g(sample.median)}</strong> · day ${fmt(sample.day)}.</p>
      <p class="pl-help">${sample.count} previous ${sample.matched?'matching setup':'same crop'} ${sample.count===1?'tray':'trays'}${sample.count>1?` · recorded range ${bandText(sample.range)}`:''}.</p>`:
      '<p class="pl-help">Save your cut weight with Mark harvested. Previous tray results will appear here as you build a history.</p>'}
  </section>`;
}
function content(doc,cycle,instant) {
  const setup=W.latestSetup(cycle)?.setup, checks=W.series(cycle,M), stage=M.phase(cycle), live=M.ACTIVE.includes(stage);
  return `${live&&setup?scaleForm(setup,stage,instant):''}
    ${live?`<div class="weight-setup-link">${setup?'':'<p>Weigh each empty tray once and load your coir recipe to start checking this grow.</p>'}${action(setup?'Edit scale setup':'Set up tray weights','weight-setup')}</div>`:''}
    <section class="dialog-section"><h3>Growth and weight history</h3>${charts(cycle,checks)}</section>
    ${harvests(doc,cycle,setup,instant)}
    <details><summary>Sowing inputs and seed rate</summary>
      <p class="pl-help">Sown ${escape(M.formatTime(M.effectiveHistory(cycle)[0].occurredAt))}.</p>
      <p class="pl-help" id="weight-sowing-seed">${escape(seedLabel(sowingSeed(cycle)))}</p>
      ${setup?`<p class="pl-help">This tray’s saved amounts are ${fmt(setup.seedG,2)} g seed as sown, ${g(setup.dryG)} dry coir,
        ${fmt(setup.hydrationG)} mL coir water, and ${fmt(setup.mistG)} mL seed spray.</p>`:
        cycle.sowingInputs?.coir?`<p class="pl-help">Coir calculator when added · ${g(cycle.sowingInputs.coir.dryG)} dry coir
        and ${fmt(cycle.sowingInputs.coir.hydrationG)} mL water per tray.</p>`:''}
      <div class="guide-links"><a href="seed-rate-notes.html#dated-seed-rate-choices">Published seed-rate history</a>
        <a href="crops.html">Seed &amp; water planner</a><a href="coir.html">Coco coir calculator</a></div>
    </details>
    <details><summary>How weight guidance works</summary>
      <p class="pl-help">Ranges use nearby days in the same stage from this tray and comparable grows. Dry and wet observations adjust the edges. Shoot growth changes the scale reading, and net weight loss can vary between day and night.</p>
      <div class="guide-links"><a href="https://extension.usu.edu/yardandgarden/research/grow-your-own-microgreens">Utah State Extension on coir and tray care</a>
      <a href="https://www.mdpi.com/2077-0472/16/12/1277">Research on weighing growing trays</a></div>
    </details>
    ${live&&setup?'':`<div class="pl-actions">${action('Back to tray','weight-tray')}</div>`}`;
}
const refreshSowingSeed=(node,cycle)=>{node.textContent=seedLabel(sowingSeed(cycle));};
window.TrayWeightView={content,setupFields,loadRecipe,loadSeed,refreshSetup,refreshSowingSeed,readSetup,readCheck,renderPreview,sowingInputs,seedAt};
})();
