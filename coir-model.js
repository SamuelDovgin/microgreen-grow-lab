/* Pure, deterministic coir planning model. Browser + Node; no dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CoirModel=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const CUP_ML=236.5882365, IN3_ML=16.387064, MAX_TRAYS_PER_CROP=100;
const TRAY_HEIGHT_IN=1.25, HEADSPACE_TARGET_IN=.5;
const CUP_DEPTH_IN=CUP_ML/(19.75*9.5*IN3_ML);
const HALF_INCH_CUPS=Math.round((TRAY_HEIGHT_IN-HEADSPACE_TARGET_IN)/CUP_DEPTH_IN);
const FULL_TRAY_CUPS=Math.round(TRAY_HEIGHT_IN/CUP_DEPTH_IN);
const trialInputs={date:'2026-11-04',dryBatchG:225,startingWaterMl:900,leftoverHydratedG:466};
const startingBatchG=trialInputs.dryBatchG+trialInputs.startingWaterMl; // Water is approximately 1 g/mL.
const hydratedTrayG=startingBatchG-trialInputs.leftoverHydratedG;
const fullTrayTrial=Object.freeze({...trialInputs,startingBatchG,hydratedTrayG,
 dryTrayG:hydratedTrayG*trialInputs.dryBatchG/startingBatchG,
 waterRatio:trialInputs.startingWaterMl/trialInputs.dryBatchG,
 estimatedCups:FULL_TRAY_CUPS,estimatedVolumeL:FULL_TRAY_CUPS*CUP_ML/1000});
const FULL_TRAY_FILL_FACTOR=1.1;
const crops=[
 {id:'broccoli',name:'Broccoli · Waltham',family:'Brassicaceae',seedG:22,treatment:'No presoak. Sow dry seed onto evenly moist coir.',basis:'22 g seed is the trial from your notes.'},
 {id:'radish',name:'Radish · Daikon',family:'Brassicaceae',seedG:30,treatment:'No presoak. Sow evenly and avoid dense clumps.',basis:'30 g seed is the trial from your notes.'},
 {id:'pea',name:'Pea · Speckled',family:'Fabaceae',seedG:230,treatment:'Weigh dry, then soak 8–12 hours, rinse and drain before sowing. Soak water is separate.',basis:'Check cover contact after sowing. 230 g seed is within OTG’s 200–260 g 1020 range.'},
 {id:'sunflower',name:'Sunflower · Black oil',family:'Asteraceae',seedG:125,treatment:'Rinse and sow without soaking for the current OTG approach. An approximately 8-hour presoak is an alternative trial.',basis:'Check cover contact after sowing. 125 g dry seed follows OTG’s current guide.'}
];
const defaults=()=>({brickG:4536,brickQt:51,price:19.98,rounding:'1',calibration:false,sampleG:'',sampleCups:'',sampleWater:'',condition:'unknown',rows:crops.map(c=>({id:c.id,count:1,cups:FULL_TRAY_CUPS,fill:'trial'}))});
const present=v=>v!==''&&v!==null&&v!==undefined;
const positive=v=>present(v)&&Number.isFinite(Number(v))&&Number(v)>0;
function calibration(s){
 if(!s.calibration)return {valid:true,basis:'Label yield estimate',gramsPerCup:Number(s.brickG)/(4*Number(s.brickQt)),waterRatio:4,waterBasis:'Uncalibrated starting estimate · 4 mL/g'};
 if(!positive(s.sampleG)||!positive(s.sampleCups))return {valid:false,message:'Enter both dry sample grams and measured expanded US cups. Zero or blank is not a measurement.'};
 if(Number(s.sampleG)<0.1||Number(s.sampleG)>100000||Number(s.sampleCups)<0.1||Number(s.sampleCups)>10000)return {valid:false,message:'Keep sample measurements within 0.1–100,000 g and 0.1–10,000 US cups.'};
 if(s.condition!=='ready')return {valid:false,message:s.condition==='wet'?'Sample is dripping: drain and reassess before measuring volume and retained water.':s.condition==='dry'?'Sample has dry patches: finish hydrating and mixing before calibrating.':'Confirm that the sample is evenly damp without dripping before applying calibration.'};
 if(present(s.sampleWater)&&(!positive(s.sampleWater)||Number(s.sampleWater)<0.1||Number(s.sampleWater)>1000000))return {valid:false,message:'Measured water must be 0.1–1,000,000 mL, or leave it blank to retain the 4 mL/g starting estimate.'};
 return {valid:true,basis:'One measured expansion sample · repeatability unknown',gramsPerCup:Number(s.sampleG)/Number(s.sampleCups),waterRatio:present(s.sampleWater)?Number(s.sampleWater)/Number(s.sampleG):4,waterBasis:present(s.sampleWater)?'Measured sample ratio · recheck each batch':'Expansion measured; water remains a 4 mL/g estimate'};
}
const depth=cups=>cups*CUP_DEPTH_IN;
function row(cups,count,basis,rounding,fill){
 const usesTrial=fill==='trial';
 const exactG=usesTrial?fullTrayTrial.dryTrayG*FULL_TRAY_FILL_FACTOR:cups*basis.gramsPerCup;
 const waterRatio=usesTrial?fullTrayTrial.waterRatio:basis.waterRatio;
 const step=Number(rounding),weighG=step===0?exactG:Math.ceil((exactG-1e-9)/step)*step;
 return {cups,count,fill,exactG,weighG,waterMl:weighG*waterRatio,liters:cups*CUP_ML/1000,depthIn:depth(cups),headroomIn:TRAY_HEIGHT_IN-depth(cups),batchG:weighG*count,batchWaterMl:weighG*waterRatio*count};
}
function calculate(s){
 const errors=[];
 if(!positive(s.brickG)||Number(s.brickG)<1||Number(s.brickG)>100000)errors.push('Enter a dry brick mass from 1 to 100,000 g.');
 if(!positive(s.brickQt)||Number(s.brickQt)<0.1||Number(s.brickQt)>10000)errors.push('Enter an expanded brick yield from 0.1 to 10,000 US quarts.');
 if(!present(s.price)||!Number.isFinite(Number(s.price))||Number(s.price)<0||Number(s.price)>10000)errors.push('Enter a brick price from $0 to $10,000.');
 if(!['0','1','5'].includes(String(s.rounding)))errors.push('Choose an available weighing precision.');
 const rows=s.rows||[];
 if(rows.length!==4||crops.some((c,i)=>rows[i]?.id!==c.id))errors.push('The plan needs all four crop rows in the standard order.');
 let trays=0;
 for(const r of rows){if(!present(r.count)||!Number.isInteger(Number(r.count))||Number(r.count)<0||Number(r.count)>MAX_TRAYS_PER_CROP)errors.push(`Each tray count must be a whole number from 0 to ${MAX_TRAYS_PER_CROP}.`);else trays+=Number(r.count);
 if(!present(r.cups)||!Number.isFinite(Number(r.cups))||Number(r.cups)<4||Number(r.cups)>FULL_TRAY_CUPS)errors.push('Each fill must be from 4 to 16 expanded US cups.');
 if(r.fill==='trial'&&Number(r.cups)!==FULL_TRAY_CUPS)errors.push('The full-tray test fill uses the modeled tray capacity.');}
 const basis=calibration(s);if(!basis.valid)errors.push(basis.message);
 if(errors.length)return {valid:false,errors:[...new Set(errors)]};
 const detail=rows.map((r,i)=>({...crops[i],...row(Number(r.cups),Number(r.count),basis,s.rounding,r.fill==='trial'?'trial':'volume')}));
 const dryG=detail.reduce((v,r)=>v+r.batchG,0),waterMl=detail.reduce((v,r)=>v+r.batchWaterMl,0),cups=detail.reduce((v,r)=>v+r.count*r.cups,0),fraction=dryG/Number(s.brickG);
 const trialTrays=detail.filter(r=>r.fill==='trial').reduce((total,r)=>total+r.count,0);
 return {valid:true,basis,rows:detail,trays,trialTrays,dryG,waterMl,cups,liters:cups*CUP_ML/1000,quarts:cups/4,cost:fraction*Number(s.price),fraction,remainingG:Math.max(0,Number(s.brickG)-dryG),shortfallG:Math.max(0,dryG-Number(s.brickG)),empty:trays===0,
 comparisons:[4,6,8,HALF_INCH_CUPS,12,13.5].map(c=>row(c,1,basis,s.rounding,'volume')),
 // A deliberate +/-20% scenario, not a confidence interval or final-water recommendation.
 waterSensitivity:[waterMl*.8,waterMl*1.2]};
}
function worksheet(s,p){if(!p.valid)return null;return {tool:'Grow Lab coco coir',version:'2026-11-13',inputs:s,outputs:p,fullTrayTrial:p.trialTrays?fullTrayTrial:null,notes:['Expanded volumes are US cups of damp, lightly leveled coir.','The full-tray test scales the leftover-based estimate by 10% before rounding because some trays had low, uneven spots. Full-tray cups describe the modeled tray capacity.','Cup-based fills use label yield or one measured expansion sample. Rounding applies per tray.','Initial water is for coir hydration and excludes soaking and irrigation.','Check headspace from the rim of the drainage tray to the leveled coir before sowing. Estimated geometry uses published outside height and a rectangular bottom footprint.']};}
function selfTest(){const s=defaults(),a=calculate(s);if(!a.valid||a.dryG!==580||a.waterMl!==2320||a.trialTrays!==4)throw Error('Default tray trial batch failed');s.rows.forEach(r=>r.count=0);if(!calculate(s).empty)throw Error('Empty batch failed');return {passed:2};}
return {crops,defaults,calculate,calibration,depth,worksheet,selfTest,fullTrayTrial,CUP_ML,MAX_TRAYS_PER_CROP,TRAY_HEIGHT_IN,HEADSPACE_TARGET_IN,HALF_INCH_CUPS,FULL_TRAY_CUPS};
});
