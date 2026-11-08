/* Bounded MaxiGro batch arithmetic; evidence and assumptions: nutrient-guide.html. */
(function(root){'use strict';
const RATES={water:0,starter:0.5,ocean:0.8,density:0.9,comparison:1,reference:1.25};
const DEFAULT_RATE='ocean',OCEAN_ML_PER_L=0.5*29.5735295625/3.785411784;
// Scenario only: the product density is unknown. N and K2O are mass-percent analyses.
function oceanComparison(rate,density=1){
 if(!Number.isFinite(rate)||rate<0||!Number.isFinite(density)||density<=0)throw new RangeError('Use finite nonnegative rate and positive density.');
 const oceanN=OCEAN_ML_PER_L*density*0.02*1000,oceanK2O=OCEAN_ML_PER_L*density*0.03*1000;
 return {density,oceanN,oceanK2O,maxiN:rate*100,maxiK2O:rate*140,nMatchRate:oceanN/100,kMatchRate:oceanK2O/140,nDifferencePct:(rate*100/oceanN-1)*100,kDifferencePct:(rate*140/oceanK2O-1)*100};
}
const MODES=['coir','germination','mix'];
function optional(v){return v===null||v===undefined||String(v).trim()===''?null:Number(v);}
function plan(i){
 const water=optional(i.water),ph=optional(i.ph),ec=optional(i.ec),step=Number(i.step);
 if(!MODES.includes(i.mode)||!Object.hasOwn(RATES,i.rate)||![0.01,0.1,1].includes(step))return {valid:false,message:'Choose a listed medium, rate and scale readability.'};
 if(water===null||!Number.isFinite(water)||water<250||water>100000)return {valid:false,message:'Enter 250–100,000 g of water.'};
 if(ph!==null&&(!Number.isFinite(ph)||ph<0||ph>14)||ec!==null&&(!Number.isFinite(ec)||ec<0||ec>20))return {valid:false,message:'Check the readings: pH must be 0–14 and EC 0–20 mS/cm. Leave unmeasured values blank.'};
 if(i.stop)return {valid:false,message:'Pause feeding. Check persistent solids or suspected crop injury before mixing or applying more.'};
 const rate=i.mode==='coir'?RATES[i.rate]:0,litres=water/1000,powder=litres*rate,rounded=Number((Math.round((powder+Number.EPSILON)/step)*step).toFixed(2)),error=powder?(rounded-powder)/powder*100:0;
 const inspired=['ocean','density'].includes(i.rate),phLow=5.5,phHigh=inspired?6:6.5,phBasis=inspired?'OTG-inspired trial target':'GH common hydro/soilless guidance';
 let state,message;
 if(!rate){state='water';message=i.mode==='germination'?'Germination: use plain water. Revisit feeding after seedlings go under lights.':i.mode==='mix'?'Nutrient-bearing mix: begin with plain water; avoid automatically stacking fertilizer.':'Water-only comparison selected. Keep the same crop, coir and watering routine.';}
 else if(ph!==null&&(ph<phLow||ph>phHigh)){state='ph';message='pH is outside the '+phLow+'–'+phHigh+' '+phBasis+'. Recheck the final mix and product instructions before use.';}
 else if(Math.abs(error)>10){state='weigh';message='This scale rounds the dose by more than 10%. Use a finer scale or mix a larger batch at the same ratio.';}
 else if(ph===null&&ec===null){state='unmeasured';message='Recipe calculated; final pH and EC are unmeasured. Measure after dissolving. Crop response still needs a tray comparison.';}
 else if(ph===null||ec===null){state='partial';message=(ph===null?'Final pH is missing.':'Final EC is missing.')+' Record it after dissolution. No crop suitability verdict is inferred.';}
 else {state='recorded';message='Both readings recorded; pH is inside the selected '+phLow+'–'+phHigh+' guidance. EC has no universal pass/fail target here. Compare repeated trays.';}
 return {valid:true,water,litres,rate,powder,rounded,error,mixture:water+powder,nitrogen:rate*100,potash:rate*140,ph,ec,phLow,phHigh,phBasis,state,message,comparison:rate?oceanComparison(rate):null,oceanMl:rate?litres*OCEAN_ML_PER_L:null};
}
function selfTest(){const base={water:2000,mode:'coir',rate:DEFAULT_RATE,step:0.01,ph:'',ec:'',stop:false};const check=(x,m)=>{if(!x)throw Error(m);};const p=plan(base);check(p.powder===1.6&&p.nitrogen===80&&p.potash===112&&p.mixture===2001.6,'ocean-inspired default');check(plan({...base,water:4000}).powder===3.2,'scaling');check(plan({...base,water:1000}).oceanMl===3.90625,'fluid units');check(plan({...base,water:''}).valid===false,'blank');check(plan({...base,ph:5}).state==='ph','pH warning precedence');check(plan({...base,mode:'germination'}).powder===0,'germination gate');check(plan({...base,stop:true}).valid===false,'stop gate');return {passed:7};}
const api={RATES,DEFAULT_RATE,OCEAN_ML_PER_L,oceanComparison,plan,selfTest};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NutrientModel=api;
})(typeof window!=='undefined'?window:globalThis);
