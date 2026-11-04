/* Pure, deterministic coir planning model. Browser + Node; no dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CoirModel=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const CUP_ML=236.5882365, IN3_ML=16.387064, MAX_TRAYS_PER_CROP=100;
const TRAY_HEIGHT_IN=1.25, HEADSPACE_TARGET_IN=.5;
const CUP_DEPTH_IN=CUP_ML/(19.75*9.5*IN3_ML);
const HALF_INCH_CUPS=Math.round((TRAY_HEIGHT_IN-HEADSPACE_TARGET_IN)/CUP_DEPTH_IN);
const crops=[
 {id:'broccoli',name:'Broccoli · Waltham',family:'Brassicaceae',cups:6,seedG:22,treatment:'No presoak. Sow dry seed onto evenly moist coir.',basis:'6 cups follows the general shallow-tray grower baseline; 22 g seed is the selected starting trial from your notes.'},
 {id:'radish',name:'Radish · Daikon',family:'Brassicaceae',cups:6,seedG:30,treatment:'No presoak. Sow evenly; avoid dense clumps.',basis:'6 cups is the OTG general shallow-tray baseline. A higher fill can ease access to shorter crops; the separate clearance preset is an adaptation, not a measured optimum. 30 g seed remains the selected trial.'},
 {id:'pea',name:'Pea · Speckled',family:'Fabaceae',cups:6,seedG:230,treatment:'Weigh dry, then soak 8–12 hours, rinse and drain before sowing. Soak water is separate.',basis:'6 cups is the economical coir baseline. A lower fill relative to small-seed crops can leave room for large seeds and the stacking tray. 230 g seed is within OTG’s 200–260 g 1020 range.'},
 {id:'sunflower',name:'Sunflower · Black oil',family:'Asteraceae',cups:6,seedG:125,treatment:'Rinse and sow without soaking for the current OTG approach. An approximately 8-hour presoak is an alternative trial.',basis:'6 cups is the economical coir baseline. The previous 8-cup sunflower default had no established crop-specific basis. Large seeds need clearance; 125 g dry seed follows OTG’s current guide.'}
];
const defaults=()=>({brickG:4536,brickQt:51,price:19.98,rounding:'5',calibration:false,sampleG:'',sampleCups:'',sampleWater:'',condition:'unknown',rows:crops.map(c=>({id:c.id,count:1,cups:HALF_INCH_CUPS}))});
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
function row(cups,count,basis,rounding){
 const exactG=cups*basis.gramsPerCup,step=Number(rounding),weighG=step===0?exactG:Math.ceil((exactG-1e-9)/step)*step;
 return {cups,count,exactG,weighG,waterMl:weighG*basis.waterRatio,liters:cups*CUP_ML/1000,depthIn:depth(cups),headroomIn:TRAY_HEIGHT_IN-depth(cups),batchG:weighG*count,batchWaterMl:weighG*basis.waterRatio*count};
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
 if(!present(r.cups)||!Number.isFinite(Number(r.cups))||Number(r.cups)<4||Number(r.cups)>16)errors.push('Each fill must be from 4 to 16 expanded US cups.');}
 const basis=calibration(s);if(!basis.valid)errors.push(basis.message);
 if(errors.length)return {valid:false,errors:[...new Set(errors)]};
 const detail=rows.map((r,i)=>({...crops[i],...row(Number(r.cups),Number(r.count),basis,s.rounding)}));
 const dryG=detail.reduce((v,r)=>v+r.batchG,0),waterMl=detail.reduce((v,r)=>v+r.batchWaterMl,0),cups=detail.reduce((v,r)=>v+r.count*r.cups,0),fraction=dryG/Number(s.brickG);
 return {valid:true,basis,rows:detail,trays,dryG,waterMl,cups,liters:cups*CUP_ML/1000,quarts:cups/4,cost:fraction*Number(s.price),fraction,remainingG:Math.max(0,Number(s.brickG)-dryG),shortfallG:Math.max(0,dryG-Number(s.brickG)),empty:trays===0,
 comparisons:[4,6,8,HALF_INCH_CUPS,12,13.5].map(c=>row(c,1,basis,s.rounding)),
 // A deliberate +/-20% scenario, not a confidence interval or final-water recommendation.
 waterSensitivity:[waterMl*.8,waterMl*1.2]};
}
function worksheet(s,p){if(!p.valid)return null;return {tool:'Grow Lab coco coir',version:'2026-11-04',inputs:s,outputs:p,notes:['Expanded volumes are US cups of damp, lightly leveled coir.','Dry grams use label yield or one measured sample, with rounding applied per tray.','Initial water is for coir hydration; it excludes soaking and irrigation.','Check headspace from the rim of the drainage tray to the leveled coir before sowing. Estimated geometry uses published outside height and a rectangular bottom footprint.']};}
function selfTest(){const s=defaults(),a=calculate(s);if(!a.valid||a.dryG!==900||a.waterMl!==3600||a.cups!==40||Math.abs(a.rows[0].headroomIn-HEADSPACE_TARGET_IN)>.05)throw Error('Default batch identity failed');s.rows.forEach(r=>r.count=0);if(!calculate(s).empty)throw Error('Empty batch failed');return {passed:2};}
return {crops,defaults,calculate,calibration,depth,worksheet,selfTest,CUP_ML,MAX_TRAYS_PER_CROP,TRAY_HEIGHT_IN,HEADSPACE_TARGET_IN,HALF_INCH_CUPS};
});
