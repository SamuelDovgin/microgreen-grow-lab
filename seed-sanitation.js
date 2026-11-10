(function(){'use strict';
 const $=id=>document.getElementById(id),D=window.SeedSanitationData,M=window.SeedSanitationModel;
 const fmt=n=>new Intl.NumberFormat(undefined,{maximumFractionDigits:3}).format(n);
 const defaultBath=D.chemicalComparisons.hocl.default;
 const defaults={peroxide:{stock:12,target:3},hocl:{stock:defaultBath,target:defaultBath},bleach:{stock:6,target:.6}};
 let current;
 const strengths={hocl:D.chemicalComparisons.hocl.default,peroxide:D.chemicalComparisons.peroxide.default};
 const comparisonState=()=>Object.fromEntries(['hocl','peroxide'].map(chem=>[chem,M.comparison(chem,strengths[chem],$('san-crop').value,D)]));
 const badgeCrops=['sunflower','pea-basic','radish-daikon','broccoli','mung'];
 function cropNote(){
  const cropId=$('san-crop').value,p=M.quickProfile(cropId,D);
  $('san-selected-name').textContent=p.label;$('san-answer').textContent=p.answer;$('san-answer').setAttribute('class',p.recommended?'answer-yes':'answer-no');$('san-crop-note').textContent=p.why;
  renderComparisons();
  for(const field of ['hocl','peroxide','concentration','note'])$('quick-spray-'+field).textContent=p.spray[field];
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
 function selectCrop(cropId){if(!D.crops[cropId])return;$('san-crop').value=cropId;$('san-label-ok').checked=false;cropNote();render();}
 function input(){return {chemical:$('san-chemical').value,basis:$('san-basis-select').value,stock:$('san-stock').value,target:$('san-target').value,batch:$('san-batch').value,contact:$('san-contact').value,labelOk:$('san-label-ok').checked};}
 function render(){const s=input(),r=M.plan(s);current={s,r};const chemical=s.chemical==='hocl',unit=s.basis==='mass'?'g':'mL';
  $('san-stock-label').textContent=chemical?'Measured stock chlorine (ppm)':'Bottle strength (%)';$('san-target-label').textContent=chemical?'Target available chlorine (ppm) · label value':'Target strength (%) · label value';$('san-batch-label').textContent='Finished batch ('+unit+')';
  $('san-verdict').textContent=!r.ok?'Check the inputs':r.ready?'Label-based planning quantities':'Example calculation only';
  $('san-stock-result').textContent=r.ok?fmt(r.stock)+' '+r.unit:'—';$('san-water-result').textContent=r.ok?fmt(r.water)+' '+r.unit:'—';$('san-time-result').textContent=r.ok&&r.contact?fmt(r.contact)+' min · entered from label':'Enter product-label time';
  $('san-result-note').textContent=!r.ok?r.reason:r.ready?'Use the stated label directions for this crop, treatment order, rinsing and disposal. These quantities do not validate effectiveness.':'Check edible-seed label suitability and enter its contact time before using these quantities. The default target is an arithmetic example.';
  $('san-formula').textContent=r.ok?'Stock = '+s.target+' ÷ '+s.stock+' × '+s.batch+' = '+fmt(r.stock)+' '+r.unit+'. '+(chemical?'Add water to the final volume; verify chlorine with a suitable test.':s.basis==='mass'?'Both percentages must be by weight; weigh both quantities.':'Both percentages must be on the same volume basis; do not substitute a weight-percent bottle.') :'';
  $('san-copy-status').textContent='';
 }
 function chemicalChanged(){const chem=$('san-chemical').value,v=defaults[chem];$('san-stock').value=v.stock;$('san-target').value=v.target;$('san-basis-select').value=chem==='hocl'?'volume':'mass';$('san-basis-select').disabled=chem==='hocl';$('san-volume-basis').textContent=chem==='hocl'?'ppm (mg/L) → measure in mL':'% by volume → measure in mL';$('san-label-ok').checked=false;$('san-contact').value='';$('san-unit-help').textContent=chem==='hocl'?'Use a measured available-chlorine concentration. pH and organic load still affect treatment; do not adjust pH by mixing cleaners.':'Use the same percentage basis as the bottle and intended target. Weight percent uses grams.';render();}
 $('san-form').addEventListener('submit',e=>e.preventDefault());
 $('san-form').addEventListener('input',e=>{if(e.target.id!=='san-label-ok')$('san-label-ok').checked=false;render();});
 $('san-chemical').addEventListener('change',chemicalChanged);
 $('san-form').addEventListener('reset',()=>{setTimeout(()=>{$('san-chemical').value='hocl';$('san-batch').value=1000;chemicalChanged();},0);});
 $('san-crop').addEventListener('change',()=>selectCrop($('san-crop').value));
 for(const id of badgeCrops)$('seed-badge-'+id).addEventListener('click',()=>selectCrop(id));
 for(const chem of ['hocl','peroxide'])for(const strength of D.chemicalComparisons[chem].options)$(chem+'-badge-'+strength).addEventListener('click',()=>{strengths[chem]=strength;renderComparisons();});
 $('san-copy').addEventListener('click',async()=>{const {s,r}=current,c=D.crops[$('san-crop').value],p=M.quickProfile($('san-crop').value,D),comparisons=comparisonState();const note=['Seed sanitation planning notes',c.name+' — '+p.answer,p.why,'UNCONFIRMED COMPARISONS — not treatment instructions','HOCl comparison: '+comparisons.hocl.concentration+'; '+comparisons.hocl.time+' — '+comparisons.hocl.status,comparisons.hocl.footnote,comparisons.hocl.note,'H2O2 comparison: '+comparisons.peroxide.concentration+'; '+comparisons.peroxide.time+' — '+comparisons.peroxide.status,comparisons.peroxide.footnote,comparisons.peroxide.note,'Daily spray: HOCl '+p.spray.hocl+'; H2O2 '+p.spray.peroxide+'. '+p.spray.concentration,'Custom mixing example below (separate from crop advice):','Chemical: '+s.chemical,'Stock: '+s.stock+(s.chemical==='hocl'?' ppm':'% ('+s.basis+' basis)'), 'Target: '+s.target+(s.chemical==='hocl'?' ppm':'%'),r.ok?'Stock: '+fmt(r.stock)+' '+r.unit+'; water: '+fmt(r.water)+' '+r.unit:'INVALID: '+r.reason,'Contact time: '+(r.contact?fmt(r.contact)+' min, entered from label':'not entered'),'Label suitability acknowledged: '+(s.labelOk?'yes':'no'),'Status: '+(r.ready?'Label-based quantities; effectiveness not validated':'Arithmetic example only — not an application protocol'),'Keep normal water presoak separate. Follow label rinse/disposal instructions. Never mix chemicals.','Sources: '+D.sources.study+' ; '+D.sources.grower].join('\n');
 try{await navigator.clipboard.writeText(note);$('san-copy-status').textContent='Planning notes copied.';}catch{$('san-copy-status').textContent='Clipboard unavailable. Select the visible results to copy them.';}});
 const requested=new URLSearchParams(location.search).get('crop');$('san-crop').value=D.crops[requested]?requested:'sunflower';cropNote();chemicalChanged();
 window.GrowSeedSanitation={snapshot:()=>({...current,crop:$('san-crop').value,quick:M.quickProfile($('san-crop').value,D),comparisons:comparisonState()})};
})();
