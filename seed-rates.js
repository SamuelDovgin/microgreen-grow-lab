/* Append-only personal trial-rate revisions; published history stays in CropData. */
(function(root){'use strict';
const KEY='grow-lab:seed-rate-history:v1',SCHEMA='grow-lab-personal-seed-rates/1';
const clone=x=>JSON.parse(JSON.stringify(x));
const num=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
const str=(x,max)=>typeof x==='string'&&x.length<=max;
const canonical=x=>JSON.stringify(x&&typeof x==='object'?Array.isArray(x)?x.map(v=>JSON.parse(canonical(v))):Object.fromEntries(Object.keys(x).sort().map(k=>[k,JSON.parse(canonical(x[k]))])):x);
function empty(){return {schema:SCHEMA,revision:0,entries:[]};}
function validRecipe(r){
 if(!r||!num(r.grams,.001,20000)||r.area!==200||!['stack','light-stack','dome'].includes(r.method))return false;
 for(const [key,min,max] of [['cover',1,14],['harvest',4,40],['soak',0,18]])if(!Array.isArray(r[key])||r[key].length!==2||!r[key].every(x=>num(x,min,max))||r[key][0]>r[key][1])return false;
 for(const [key,min,max] of [['substrateDepth',.02,2],['substrateTheta',0,100],['substrateReserve',0,3000]])if(r[key]!==undefined&&!num(r[key],min,max))return false;
 if(r.calendarSources!==undefined&&(!Array.isArray(r.calendarSources)||r.calendarSources.length>100||!r.calendarSources.every(x=>str(x,80))))return false;
 return num(r.blackoutDays,0,5)&&num(r.weightLb,0,15)&&r.cover[1]+r.blackoutDays<r.harvest[0]&&str(r.note,4000)&&['peat','coir','blend','hemp','jute','cellulose','reusable'].includes(r.substrateId)&&num(r.lightHours,0,24)&&JSON.stringify(r).length<20000;
}
function parse(text,cropIds){
 if(typeof text!=='string'||text.length>20*1024*1024)return {error:'Seed-rate history exceeds 20 MB.'};
 let d;try{d=JSON.parse(text);}catch{return {error:'This is not a valid seed-rate history JSON file.'};}
 if(!d||d.schema!==SCHEMA||!Number.isInteger(d.revision)||d.revision<0||!Array.isArray(d.entries)||d.entries.length>5000)return {error:'Unsupported or oversized seed-rate history.'};
 const seen=new Set();
 for(const e of d.entries){
  if(!e||!str(e.id,150)||!e.id||seen.has(e.id)||!cropIds.includes(e.cropId)||!str(e.changedAt,50)||!/^\d{4}-\d{2}-\d{2}T/.test(e.changedAt)||!Number.isFinite(Date.parse(e.changedAt))||!num(e.fromGrams,.001,20000)||!num(e.toGrams,.001,20000)||!num(e.actualSeedG,.01,2000)||!num(e.areaIn2,20,288)||Math.abs(e.actualSeedG*200/e.areaIn2-e.toGrams)>1e-6||!str(e.reason,2000)||e.reason.trim().length<3||!str(e.seedLot,200)||!str(e.evidence,2000)||!validRecipe(e.recipe)||Math.abs(e.recipe.grams-e.toGrams)>1e-6)return {error:'A seed-rate revision has invalid crop, units, date, reason or recipe settings.'};
  seen.add(e.id);
 }
 return {doc:{schema:SCHEMA,revision:d.revision,entries:clone(d.entries)}};
}
function latest(entries,cropId){let found=null;for(const e of entries)if(e.cropId===cropId&&(!found||Date.parse(e.changedAt)>=Date.parse(found.changedAt)))found=e;return found?clone(found):null;}
function merge(a,b){
 const ids=new Map(a.entries.map(e=>[e.id,e]));let added=0;
 for(const e of b.entries){if(ids.has(e.id)){if(canonical(ids.get(e.id))!==canonical(e))return {error:'A revision ID conflicts with your saved history. Neither version was overwritten.'};}else{ids.set(e.id,e);added++;}}
 if(ids.size>5000)return {error:'The combined seed-rate history is too large.'};
 return {doc:{...clone(a),entries:[...ids.values()]},added};
}
function createStore(storage,cropIds){
 let doc=empty(),revision=0,protectedData=false,available=true,persisted=true,error='';
 try{const raw=storage.getItem(KEY);if(raw){const p=parse(raw,cropIds);if(p.error){protectedData=true;persisted=false;error='Unreadable stored rate history was left untouched. '+p.error;}else{doc=p.doc;revision=doc.revision;}}}catch{available=false;persisted=false;error='Browser storage is unavailable; export any trial-rate changes before closing this tab.';}
 function save(next){
  const p=parse(JSON.stringify(next),cropIds);if(p.error)return {ok:false,error:p.error};
  const candidate={...p.doc,revision:doc.revision+1};
  if(available&&!protectedData){try{const raw=storage.getItem(KEY),current=raw?parse(raw,cropIds):{doc:empty()};if(current.error||current.doc.revision!==revision)return {ok:false,error:'Another tab changed the stored rate history. Export this tab’s history, then reload before saving.'};storage.setItem(KEY,JSON.stringify(candidate));doc=candidate;revision=doc.revision;persisted=true;error='';return {ok:true,persisted:true};}catch{error='Storage is full or blocked; changes are in this tab only. Export your rate history now.';}}
  else error=protectedData?'Unreadable stored history is protected; new changes are in this tab only. Export a backup.':'Changes are in this tab only. Export your rate history before closing.';
  doc=candidate;persisted=false;return {ok:true,persisted:false,error};
 }
 return {read:()=>clone(doc),status:()=>({persisted,error,protectedData}),latest:cropId=>latest(doc.entries,cropId),append:e=>{if(doc.entries.some(x=>x.id===e.id))return {ok:false,error:'This revision ID is already present.'};return save({...doc,entries:[...doc.entries,e]});},import:text=>{const p=parse(text,cropIds);if(p.error)return {ok:false,error:p.error};const m=merge(doc,p.doc);if(m.error)return {ok:false,error:m.error};if(!m.added)return {ok:true,persisted,added:0};return {...save(m.doc),added:m.added};}};
}
const api={KEY,SCHEMA,empty,parse,latest,merge,createStore};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeedRates=api;
})(typeof window!=='undefined'?window:globalThis);
