(function(){'use strict';
 const $=id=>document.getElementById(id),D=window.SeedSanitationData,M=window.SeedSanitationModel;
 const fmt=n=>new Intl.NumberFormat(undefined,{maximumFractionDigits:3}).format(n);
 const defaultBath=D.chemicalComparisons.hocl.default;
 const defaults={peroxide:{stock:12,target:3},hocl:{stock:defaultBath,target:defaultBath},bleach:{stock:6,target:.6}};
 let current;
 const strengths={hocl:D.chemicalComparisons.hocl.default,peroxide:D.chemicalComparisons.peroxide.default};
 const comparisonState=()=>Object.fromEntries(['hocl','peroxide'].map(chem=>[chem,M.comparison(chem,strengths[chem],$('san-crop').value,D)]));
 const badgeCrops=['sunflower','pea-basic','radish-daikon','broccoli','mung'];
 const bleachCrop = $('bleach-trial-crop');
 const bleachSeed = $('bleach-trial-seed');
 const bleachCover = $('bleach-trial-cover');
 const bleachResult = $('bleach-trial-result');
 const jarNote = $('bleach-trial-jar-note');
 const jarSeedGrams = Number(bleachSeed.defaultValue);
 const preplantPeroxide = $('preplant-peroxide');
 const blendWeight = new Intl.NumberFormat(undefined, {minimumFractionDigits:1, maximumFractionDigits:1});
 let selectedCropId = 'sunflower';
 function renderBleachTrial(){
  const usesJar = ['pea-basic', 'pea-tendril'].includes(selectedCropId);
  const batch = M.bleachTrialBatch(bleachSeed.value, bleachCover.validity?.badInput ? NaN : bleachCover.value, usesJar ? jarSeedGrams : null);
  jarNote.hidden = !usesJar;
  $('bleach-trial-cover-label').textContent = usesJar ? 'Measured water to cover one portion (mL)' : 'Measured water to cover (mL)';
  const portions = batch.portions > 1
   ? `Split into ${fmt(batch.portions)} portions of about ${fmt(batch.seedPerPortion)} g dry seed each. For each portion, mix a fresh bath. `
   : '';
  bleachResult.textContent = batch.ok
   ? `${portions}≈${fmt(batch.estimatedMl)} mL finished · Start with ${fmt(batch.waterG)} g water. Add ${blendWeight.format(batch.stockG)} g Tandil 7.5%.`
   : batch.reason;
 }
 bleachSeed.addEventListener('input', renderBleachTrial);
 bleachCover.addEventListener('input', renderBleachTrial);
 function cropNote(){
  const cropId=$('san-crop').value,p=M.quickProfile(cropId,D);
  $('san-selected-name').textContent=p.label;$('san-answer').textContent=p.answer;$('san-answer').setAttribute('class',p.recommended?'answer-yes':'answer-no');$('san-crop-note').textContent=p.why;
  renderComparisons();
  for(const id of badgeCrops)$('seed-badge-'+id).setAttribute('aria-pressed',String(id===cropId));
 }
 function renderComparisons(){
  const comparisons=comparisonState();
  for(const chem of ['hocl','peroxide']){
   const c=comparisons[chem];
   for(const field of ['status','concentration','time','note','footnote'])$('quick-'+chem+'-'+field).textContent=c[field];
   $('quick-'+chem+'-source').setAttribute('href',c.source);
   for(const strength of D.chemicalComparisons[chem].options)$(chem+'-badge-'+strength).setAttribute('aria-pressed',String(strengths[chem]===strength));
  }
  $('san-copy-status').textContent='';
 }
 function selectCrop(cropId){
  const knownCrop = Object.hasOwn(D.crops, cropId);
  if (!knownCrop && cropId !== 'other') return;
  const changed = selectedCropId !== cropId;
  selectedCropId = cropId;
  bleachCrop.value = cropId;
  const option = bleachCrop.selectedOptions[0];
  preplantPeroxide.hidden = option?.dataset.preplantPeroxide !== 'true';
  if (option) {
   $('bleach-trial-prep-text').textContent = option.dataset.prep;
   if (changed) {
    bleachSeed.value = option.dataset.grams ?? '';
    bleachCover.value = '';
   }
  }
  renderBleachTrial();
  $('quick-answer').hidden = !knownCrop;
  $('old-custom-seed').hidden = knownCrop;
  $('quick-explanations').hidden = !knownCrop;
  if (knownCrop) {
   $('san-crop').value = cropId;
   $('san-label-ok').checked = false;
   cropNote();
   render();
  } else {
   for (const id of badgeCrops) $('seed-badge-'+id).setAttribute('aria-pressed', 'false');
  }
 }
 function input(){
  const sizing=$('san-sizing').value,seedGrams=$('san-seed-grams').value,bathPerGram=$('san-bath-ratio').value;
  const batch=sizing==='seed'?M.bathFromSeed(seedGrams,bathPerGram):$('san-batch').value;
  return {water:sizing==='manual'?batch:undefined,chemical:$('san-chemical').value,basis:$('san-basis-select').value,stock:$('san-stock').value,target:$('san-target').value,batch,contact:$('san-contact').value,labelOk:$('san-label-ok').checked,sizing,seedGrams,bathPerGram};
 }
 function render(){const s=input(),r=M.plan(s);current={s,r};const chemical=s.chemical==='hocl',unit=s.basis==='mass'?'g':'mL';
  const bySeed=s.sizing==='seed';
  $('san-seed-sizing').hidden=!bySeed;$('san-manual-sizing').hidden=bySeed;
  $('san-bath-ratio-label').textContent='Finished bath per gram of dry seed ('+unit+'/g)';
  $('san-bath-result').textContent=r.ok?fmt(r.final)+' '+unit:'—';
  $('san-stock-label').textContent=chemical?'Measured stock chlorine (ppm)':'Bottle strength (%)';$('san-target-label').textContent=chemical?'Target available chlorine (ppm) · label value':'Target strength (%) · label value';$('san-batch-label').textContent='Starting water ('+unit+')';
  $('san-verdict').textContent=!r.ok?'Check the inputs':r.ready?'Label-based planning quantities':'Example calculation only';
  $('san-stock-result').textContent=r.ok?fmt(r.stock)+' '+r.unit:'—';$('san-water-result').textContent=r.ok?fmt(r.water)+' '+r.unit:'—';$('san-time-result').textContent=r.ok&&r.contact?fmt(r.contact)+' min · entered from label':'Enter product-label time';
  $('san-result-note').textContent=bySeed&&s.batch===null?'Enter a positive dry seed weight and bath amount per gram.':!r.ok?r.reason:r.ready?'Use the stated label directions for this crop, treatment order, rinsing and disposal. These quantities do not validate effectiveness.':'Check edible-seed label suitability and enter its contact time before using these quantities. The default target is an arithmetic example.';
  $('san-mix-ratio').textContent=r.ok&&r.stock>0?`Mixing ratio ${fmt(r.water/r.stock)} parts water per 1 part stock by ${s.basis==='mass'?'weight':'volume'}.`:'';
  $('san-formula').textContent=r.ok?'Measure the water first. Stock = water × target ÷ (stock strength − target). '+(chemical?'Verify the mixed chlorine concentration with a suitable test.':s.basis==='mass'?'Use matching weight percentages and weigh both ingredients.':'Use matching volume percentages.'):'';
  $('san-copy-status').textContent='';
 }
 function chemicalChanged(){const chem=$('san-chemical').value,v=defaults[chem];$('san-stock').value=v.stock;$('san-target').value=v.target;$('san-basis-select').value=chem==='hocl'?'volume':'mass';$('san-basis-select').disabled=chem==='hocl';$('san-volume-basis').textContent=chem==='hocl'?'ppm (mg/L) → measure in mL':'% by volume → measure in mL';$('san-label-ok').checked=false;$('san-contact').value='';$('san-unit-help').textContent=chem==='hocl'?'Use a measured available-chlorine concentration. pH and organic load still affect treatment; do not adjust pH by mixing cleaners.':'Use the same percentage basis as the bottle and intended target. Weight percent uses grams.';render();}
 $('san-form').addEventListener('submit',e=>e.preventDefault());
 $('san-form').addEventListener('input',e=>{if(e.target.id!=='san-label-ok')$('san-label-ok').checked=false;render();});
 $('san-chemical').addEventListener('change',chemicalChanged);
 $('san-form').addEventListener('reset',()=>{setTimeout(()=>{$('san-chemical').value='peroxide';$('san-sizing').value='seed';$('san-seed-grams').value=130;$('san-bath-ratio').value=5;$('san-batch').value=500;chemicalChanged();},0);});
 $('san-crop').addEventListener('change',()=>selectCrop($('san-crop').value));
 bleachCrop.addEventListener('change', event => selectCrop(event.target.value));
 for(const id of badgeCrops)$('seed-badge-'+id).addEventListener('click',()=>selectCrop(id));
 for(const chem of ['hocl','peroxide'])for(const strength of D.chemicalComparisons[chem].options)$(chem+'-badge-'+strength).addEventListener('click',()=>{strengths[chem]=strength;renderComparisons();});
 $('san-copy').addEventListener('click',async()=>{const {s,r}=current,c=D.crops[$('san-crop').value],p=M.quickProfile($('san-crop').value,D),comparisons=comparisonState();const note=['Seed sanitation planning notes',c.name+' — '+p.answer,p.why,'HOCl reference: '+p.hocl.concentration+'; '+p.hocl.time+' — '+p.hocl.status,p.hocl.note,'H2O2 reference: '+p.peroxide.concentration+'; '+p.peroxide.time+' — '+p.peroxide.status,p.peroxide.note,'UNCONFIRMED COMPARISONS — not treatment instructions','HOCl comparison: '+comparisons.hocl.concentration+'; '+comparisons.hocl.time+' — '+comparisons.hocl.status,comparisons.hocl.footnote,comparisons.hocl.note,'H2O2 comparison: '+comparisons.peroxide.concentration+'; '+comparisons.peroxide.time+' — '+comparisons.peroxide.status,comparisons.peroxide.footnote,comparisons.peroxide.note,'Daily spray: HOCl '+p.spray.hocl+'; H2O2 '+p.spray.peroxide+'. '+p.spray.concentration,'Custom mixing example below (separate from crop advice):','Chemical: '+s.chemical,'Stock: '+s.stock+(s.chemical==='hocl'?' ppm':'% ('+s.basis+' basis)'), 'Target: '+s.target+(s.chemical==='hocl'?' ppm':'%'),...(r.ok?[('Finished bath: '+fmt(r.final)+' '+r.unit+(s.sizing==='seed'?' for '+fmt(Number(s.seedGrams))+' g dry seed at '+fmt(Number(s.bathPerGram))+' '+r.unit+'/g (coverage estimate).':'.')),$('san-mix-ratio').textContent]:[]),r.ok?'Start with '+fmt(r.water)+' '+r.unit+' water and add '+fmt(r.stock)+' '+r.unit+' stock':'INVALID: '+r.reason,'Contact time: '+(r.contact?fmt(r.contact)+' min, entered from label':'not entered'),'Label suitability acknowledged: '+(s.labelOk?'yes':'no'),'Status: '+(r.ready?'Label-based quantities; effectiveness not validated':'Arithmetic example only — not an application protocol'),'Keep normal water presoak separate. Follow label rinse/disposal instructions. Never mix chemicals.','Sources: '+D.sources.study+' ; '+D.sources.grower].join('\n');
 try{await navigator.clipboard.writeText(note);$('san-copy-status').textContent='Planning notes copied.';}catch{$('san-copy-status').textContent='Clipboard unavailable. Select the visible results to copy them.';}});
 const requested = new URLSearchParams(location.search).get('crop');
 selectCrop(requested === 'other' || Object.hasOwn(D.crops, requested) ? requested : 'sunflower');
 chemicalChanged();
 window.GrowSeedSanitation={snapshot:()=>({...current,crop:$('san-crop').value,quick:M.quickProfile($('san-crop').value,D),comparisons:comparisonState()})};
})();
