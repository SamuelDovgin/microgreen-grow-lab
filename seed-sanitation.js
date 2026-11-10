(function(){'use strict';
 const $=id=>document.getElementById(id),D=window.SeedSanitationData,M=window.SeedSanitationModel;
 const fmt=n=>new Intl.NumberFormat(undefined,{maximumFractionDigits:3}).format(n);
 const defaults={peroxide:{stock:12,target:3},hocl:{stock:200,target:200},bleach:{stock:6,target:.6}};
 let current;
 function cropNote(){const c=D.crops[$('san-crop').value];$('san-priority').textContent=c.name+' · '+c.status.toLowerCase();$('san-crop-note').textContent=c.note;$('san-basis').textContent=(c.basis==='grower'?'Grower practice':'Editorial handling judgment')+' · not a validated crop-specific kill step.';}
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
 $('san-form').addEventListener('reset',()=>{setTimeout(()=>{$('san-chemical').value='peroxide';$('san-batch').value=1000;chemicalChanged();},0);});
 $('san-crop').addEventListener('change',()=>{$('san-label-ok').checked=false;cropNote();render();});
 $('san-copy').addEventListener('click',async()=>{const {s,r}=current,c=D.crops[$('san-crop').value];const note=['Seed sanitation planning notes',c.name+' — '+c.status,c.note,'Chemical: '+s.chemical,'Stock: '+s.stock+(s.chemical==='hocl'?' ppm':'% ('+s.basis+' basis)'), 'Target: '+s.target+(s.chemical==='hocl'?' ppm':'%'),r.ok?'Stock: '+fmt(r.stock)+' '+r.unit+'; water: '+fmt(r.water)+' '+r.unit:'INVALID: '+r.reason,'Contact time: '+(r.contact?fmt(r.contact)+' min, entered from label':'not entered'),'Label suitability acknowledged: '+(s.labelOk?'yes':'no'),'Status: '+(r.ready?'Label-based quantities; effectiveness not validated':'Arithmetic example only — not an application protocol'),'Keep normal water presoak separate. Follow label rinse/disposal instructions. Never mix chemicals.','Sources: '+D.sources.study+' ; '+D.sources.grower].join('\n');
 try{await navigator.clipboard.writeText(note);$('san-copy-status').textContent='Planning notes copied.';}catch{$('san-copy-status').textContent='Clipboard unavailable. Select the visible results to copy them.';}});
 const requested=new URLSearchParams(location.search).get('crop');$('san-crop').value=D.crops[requested]?requested:'sunflower';cropNote();chemicalChanged();
 window.GrowSeedSanitation={snapshot:()=>({...current,crop:$('san-crop').value})};
})();
