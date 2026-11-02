/* Grow Lab records: explicit observations, conservative comparisons, portable backups. */
(function(root){'use strict';
const SCHEMA='grow-lab-journal/1',KEY='grow-lab:journal:v1',AREA=.00064516;
const num=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
const opt=(x,min,max)=>x===null||num(x,min,max);
const str=(x,max=1000)=>typeof x==='string'&&x.length<=max;
const date=x=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(x||''))return false;const d=new Date(x+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===x;};
const timestamp=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(x)&&date(x.slice(0,10))&&Number.isFinite(Date.parse(x));
const clone=x=>JSON.parse(JSON.stringify(x));
function empty(){return {schema:SCHEMA,revision:0,records:[],exportedAt:null};}
function validateRecord(r){
 if(!r||typeof r!=='object'||!str(r.id,120)||!r.id||!str(r.name,120)||!r.name.trim()||!str(r.cropId,80)||!r.cropId||!date(r.sowDate))return 'A tray needs an ID, name, crop and valid sowing date.';
 for(const key of ['cultivar','seedLot','substrateProduct','nutrientProgram','location','position','cycleId','notes','weighingMethod'])if(!str(r[key],key==='notes'?10000:1000))return 'Invalid or oversized tray text: '+key;
 if(!str(r.substrateId,80)||!str(r.coverMethod,80)||typeof r.setupVerified!=='boolean'||typeof r.archived!=='boolean')return 'Invalid substrate, method or verification flags.';
 if(!num(r.seedG,.01,2000)||!num(r.lengthIn,1,48)||!num(r.widthIn,1,48)||!num(r.depthIn,.02,2)||!num(r.lightHours,0,24)||!opt(r.ppfd,0,2000)||!opt(r.temperatureC,0,50)||!opt(r.rh,0,100)||!num(r.soakHours,0,48)||!num(r.coverDays,0,30)||!num(r.blackoutDays,0,14)||!num(r.weightLb,0,50))return 'Check seed grams, tray dimensions, medium depth and environment units/ranges.';
 if(!timestamp(r.createdAt)||!timestamp(r.updatedAt)||!Array.isArray(r.observations)||r.observations.length>2000)return 'Invalid record timestamps or observation list.';
 if(!['growing','harvested','failed'].includes(r.status))return 'Unknown tray status.';
 const h=r.harvest;
 if(!h||!str(h.stage,150)||!str(h.reason,4000)||!opt(h.grossG,0,10000)||!opt(h.rejectedG,0,10000)||!opt(h.saleableG,0,10000)||!opt(h.soldG,0,10000)||!opt(h.flavor,1,5)||!opt(h.texture,1,5))return 'Invalid harvest fields. Empty measurements must stay unknown.';
 if(h.date!==''&&!date(h.date))return 'Invalid harvest date.';
 if(r.status!=='growing'&&(!date(h.date)||h.date<r.sowDate||h.saleableG===null))return 'Completed trays need a harvest/failure date at or after sowing and an explicit saleable mass.';
 if(r.status==='failed'&&h.saleableG!==0)return 'A failed tray must record zero saleable grams.';
 if(h.soldG!==null&&h.saleableG!==null&&h.soldG>h.saleableG)return 'Sold grams cannot exceed saleable grams.';
 if(h.grossG!==null&&h.saleableG!==null&&h.saleableG>h.grossG+.5)return 'Saleable grams cannot exceed gross grams.';
 if(h.grossG!==null&&h.rejectedG!==null&&h.saleableG!==null&&Math.abs(h.grossG-h.rejectedG-h.saleableG)>.5)return 'Gross mass should equal rejected + saleable mass (within 0.5 g rounding).';
 const ids=new Set();
 for(const o of r.observations){
  if(!o||!str(o.id,120)||!o.id||ids.has(o.id)||!timestamp(o.at)||o.at.slice(0,10)<r.sowDate||!['covered','stretch','lights','harvest','other'].includes(o.phase)||!str(o.condition,80)||!str(o.notes,10000)||!str(o.photoRef,2000))return 'An observation has an invalid/duplicate ID, date, phase or text.';
  ids.add(o.id);
  for(const [k,min,max] of [['heightMm',0,1000],['emergencePct',0,100],['weightG',1,20000],['addedMl',0,10000],['drainedMl',0,10000],['temperatureC',0,50],['rh',0,100],['ppfd',0,2000],['ph',0,14],['ec',0,10]])if(!opt(o[k],min,max))return 'Invalid observation value: '+k;
 }
 return null;
}
function parse(text){
 if(typeof text!=='string'||text.length>20*1024*1024)return {error:'Backup is empty or exceeds the 20 MB limit.'};
 let d;try{d=JSON.parse(text);}catch{return {error:'This is not valid JSON.'};}
 if(!d||d.schema!==SCHEMA||!Number.isInteger(d.revision)||d.revision<0||!Array.isArray(d.records)||d.records.length>2000)return {error:'Use a Grow Lab journal backup with schema '+SCHEMA+'.'};
 const ids=new Set();for(const r of d.records){const e=validateRecord(r);if(e)return {error:e};if(ids.has(r.id))return {error:'Duplicate tray IDs in backup.'};ids.add(r.id);}
 return {doc:clone(d)};
}
function merge(current,incoming){
 const records=clone(current.records),byId=new Map(records.map(r=>[r.id,r]));let added=0,same=0,conflicts=0;
 for(const r of incoming.records){const old=byId.get(r.id);if(!old){records.push(clone(r));byId.set(r.id,r);added++;}else if(JSON.stringify(old)===JSON.stringify(r))same++;else conflicts++;}
 return {doc:{...current,records},added,same,conflicts};
}
function daysBetween(a,b){return date(a)&&date(b)?Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000):null;}
function fingerprint(r){
 // Density is the variable under comparison; other recorded setup differences stay separate.
 const text=x=>String(x).trim().toLowerCase();
 return JSON.stringify([r.cropId,...['cultivar','seedLot','substrateId','substrateProduct','nutrientProgram','location','weighingMethod'].map(k=>text(r[k])),r.depthIn,r.lightHours,r.ppfd,r.temperatureC,r.rh,r.soakHours,r.coverMethod,r.coverDays,r.blackoutDays,r.weightLb,text(r.harvest.stage)]);
}
function groups(records){
 const map=new Map(),excluded=[];
 for(const r of records){
  if(r.archived||r.status==='growing')continue;
  const reason=!r.setupVerified?'actual setup unverified':!r.seedLot.trim()||!r.substrateProduct.trim()||!r.nutrientProgram.trim()||!r.harvest.stage.trim()||!r.location.trim()?'missing lot, medium, nutrients, location or harvest-stage context':r.ppfd===null||r.temperatureC===null||r.rh===null?'missing measured light, temperature or humidity':daysBetween(r.sowDate,r.harvest.date)<1?'harvest cycle shorter than one day':null;
  if(reason){excluded.push({id:r.id,name:r.name,reason});continue;}
  const key=fingerprint(r);if(!map.has(key))map.set(key,{key,cropId:r.cropId,records:[],points:[]});map.get(key).records.push(r);
 }
 for(const group of map.values()){
  const bins=new Map();
  for(const r of group.records){const a=r.lengthIn*r.widthIn*AREA,density=r.seedG/a,days=daysBetween(r.sowDate,r.harvest.date),key=density.toFixed(5)+'|'+days;const p={seedGm2:density,yieldGm2:r.harvest.saleableG/a,days};if(!bins.has(key))bins.set(key,[]);bins.get(key).push({r,p});}
  group.points=[...bins.values()].map(b=>{const n=b.length,mean=b.reduce((s,x)=>s+x.p.yieldGm2,0)/n;return {seedGm2:b[0].p.seedGm2,yieldGm2:mean,days:b[0].p.days,n,sd:n>1?Math.sqrt(b.reduce((s,x)=>s+(x.p.yieldGm2-mean)**2,0)/(n-1)):null,cycles:new Set(b.map(x=>x.r.cycleId.trim()).filter(Boolean)).size};}).sort((a,b)=>a.seedGm2-b.seedGm2||a.days-b.days);
  group.densities=new Set(group.points.map(p=>p.seedGm2.toFixed(5))).size;
  group.cycles=new Set(group.records.map(r=>r.cycleId.trim()).filter(Boolean)).size;
  group.replicated=group.densities>=2&&group.points.every(p=>p.n>=3&&p.cycles>=2);
 }
 return {groups:[...map.values()],excluded};
}
function waterIntervals(r){
 const list=[...r.observations].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)),good=[],skipped=[];
 for(let i=1;i<list.length;i++){
  const prev=list[i-1],next=list[i],hours=(Date.parse(next.at)-Date.parse(prev.at))/3600000;
  if(prev.phase!=='lights'||next.phase!=='lights'||prev.weightG===null||next.weightG===null||prev.addedMl===null||prev.drainedMl===null||hours<=0){skipped.push({from:prev.id,to:next.id,reason:'Needs two under-light weights, water added/drained at the earlier check, and a positive time interval.'});continue;}
  const loss=prev.weightG+prev.addedMl-prev.drainedMl-next.weightG;
  if(loss<0){skipped.push({from:prev.id,to:next.id,reason:'Net mass increased: inspect biomass, drainage, watering records and weighing convention.'});continue;}
  good.push({from:prev.id,to:next.id,at:next.at,hours,lossMl:loss,mmDay:loss/(r.lengthIn*r.widthIn*AREA*1000)*24/hours});
 }
 const latest=good.slice(-3),hours=latest.reduce((s,v)=>s+v.hours,0),loss=latest.reduce((s,v)=>s+v.lossMl,0);
 return {intervals:good,skipped,latestMeanMmDay:hours?loss/(r.lengthIn*r.widthIn*AREA*1000)*24/hours:null};
}
function csv(group){
 const clean=x=>String(x).replace(/[\r\n,]/g,' ').trim();
 return ['crop_id,seed_g,saleable_g,area_in2,days,substrate,lot,stage',...group.records.map(r=>[r.cropId,r.seedG,r.harvest.saleableG,r.lengthIn*r.widthIn,daysBetween(r.sowDate,r.harvest.date),r.substrateId+' / '+r.substrateProduct,r.seedLot,r.harvest.stage].map(clean).join(','))].join('\n');
}
function createStore(storage){
 let doc=empty(),persistedRevision=0,available=true,protectedData=false,persisted=true,error='';
 try{const raw=storage.getItem(KEY);if(raw){const parsed=parse(raw);if(parsed.error){protectedData=true;error='Stored log could not be read and has been left untouched. '+parsed.error;}else{doc=parsed.doc;persistedRevision=doc.revision;}}}catch{available=false;persisted=false;error='Browser storage is unavailable. Keep this tab open and export a backup of changes.';}
 function save(next){
  const checked=parse(JSON.stringify({...next,schema:SCHEMA,revision:doc.revision}));if(checked.error)return {ok:false,error:checked.error};
  const candidate={...checked.doc,revision:doc.revision+1};
  if(available&&!protectedData){
   try{const raw=storage.getItem(KEY),current=raw?parse(raw):{doc:empty()};if(current.error||current.doc.revision!==persistedRevision)return {ok:false,error:'Another tab changed the stored log. Export your current backup, then reload the stored log before saving.'};storage.setItem(KEY,JSON.stringify(candidate));doc=candidate;persistedRevision=doc.revision;persisted=true;error='';return {ok:true,persisted:true};}
   catch{error='Browser storage is full or blocked. Your changes are held in this tab only; export a backup now.';}
  }else error=protectedData?'The unreadable stored log is protected. New changes are held in this tab only; export a backup.':'Browser storage is unavailable. New changes are held in this tab only; export a backup.';
  doc=candidate;persisted=false;return {ok:true,persisted:false,error};
 }
 return {read:()=>clone(doc),status:()=>({persisted,protectedData,error}),save};
}
const api={SCHEMA,KEY,AREA,empty,validateRecord,parse,merge,daysBetween,fingerprint,groups,waterIntervals,csv,createStore};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GrowJournal=api;
})(typeof window!=='undefined'?window:globalThis);
