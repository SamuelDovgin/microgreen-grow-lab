(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HoclDilutionModel=api;})(typeof window==='object'?window:this,function(){
 'use strict';
 const FEED_G_L=6,ML_PER_SPRAY=1.66/10;
 const DEFAULTS=Object.freeze({mode:'water',stock:200,target:50,waterVolume:500,unit:'mL',sprays:10,applications:10,measuredFinal:'',ph:''});
 const PEROXIDE_DEFAULTS=Object.freeze({stock:12,target:900,waterMass:500,sprays:10,applications:10});
 const missing=v=>v===''||v===null||v===undefined;
 const positive=v=>!missing(v)&&Number.isFinite(Number(v))&&Number(v)>0;
 function verification(input){
  const facMissing=missing(input.measuredFinal),phMissing=missing(input.ph),fac=facMissing?null:Number(input.measuredFinal),ph=phMissing?null:Number(input.ph);
  if((!facMissing&&(!Number.isFinite(fac)||fac<0))||(!phMissing&&(!Number.isFinite(ph)||ph<0||ph>14)))return {state:'invalid',message:'Final FAC must be zero or positive; measured pH must be between 0 and 14.'};
  return {state:facMissing&&phMissing?'missing':facMissing?'fac-missing':phMissing?'ph-missing':'recorded',fac,ph,delta:facMissing||!positive(input.target)?null:fac-Number(input.target)};
 }
 function calculate(input){
  const check=verification(input);
  if(!['water','final','stock'].includes(input.mode)||!['mL','L'].includes(input.unit))return {ok:false,reason:'Choose a batch mode and volume unit.',verification:check};
  if(missing(input.stock))return {ok:false,reason:'Enter the measured free chlorine in your stock solution.',verification:check};
  if(!positive(input.stock)||!positive(input.target))return {ok:false,reason:'Stock and target FAC must be positive numbers in ppm.',verification:check};
  const stock=Number(input.stock),target=Number(input.target);
  if(target>stock||(input.mode==='water'&&target===stock))return {ok:false,reason:'Use a target below your stock reading when adding water.',verification:check};
  const amount={water:input.waterVolume,final:input.finalVolume,stock:input.stockVolume}[input.mode];
  if(!positive(amount))return {ok:false,reason:'Enter a positive volume.',verification:check};
  const factor=input.unit==='L'?1000:1,volume=Number(amount)*factor,fraction=target/stock;
  const stockMl = input.mode==='water' ? volume*(target/(stock-target)) : input.mode==='final' ? volume*fraction : volume;
  const finalMl = input.mode==='water' ? volume+stockMl : input.mode==='final' ? volume : volume/fraction;
  const waterMl = input.mode==='water' ? volume : finalMl-stockMl;
  if(![stockMl,finalMl,waterMl,fraction].every(Number.isFinite)||stockMl<=0||finalMl<=0||waterMl<0)return {ok:false,reason:'These quantities are outside the calculation range.',verification:check};
  const sprays=Number(input.sprays),applications=Number(input.applications);
  const countOk=[input.sprays,input.applications].every(v=>!missing(v))&&[sprays,applications].every(v=>Number.isSafeInteger(v)&&v>=0);
  const saltMgMl=FEED_G_L*fraction,batchSaltMg=FEED_G_L*stockMl,appliedMl=countOk?ML_PER_SPRAY*sprays*applications:null,totalSaltMg=countOk?appliedMl*saltMgMl:null;
  if(![saltMgMl,batchSaltMg].every(Number.isFinite))return {ok:false,reason:'These quantities are outside the calculation range.',verification:check};
  const loadOk=countOk&&Number.isFinite(appliedMl)&&Number.isFinite(totalSaltMg);
  return {ok:true,stockPpm:stock,targetPpm:target,stockMl,waterMl,finalMl,fraction,dilutionFactor:stock/target,waterParts:stock/target-1,saltMgMl,batchSaltMg,load:{ok:loadOk,sprays,applications,appliedMl:loadOk?appliedMl:null,totalSaltMg:loadOk?totalSaltMg:null,reason:loadOk?'':'Use whole-number spray and application counts of zero or more.'},verification:check};
 }
 function selfTest(){
  const a=calculate(DEFAULTS),b=calculate({...DEFAULTS,mode:'stock',stockVolume:a.stockMl});
  const near=(x,y)=>Math.abs(x-y)<=1e-9*Math.max(1,Math.abs(x),Math.abs(y));
  const checks={emptyStock:!calculate({...DEFAULTS,stock:''}).ok,defaultMix:near(a.finalMl,2000/3)&&near(a.stockMl,500/3)&&a.waterMl===500,conservation:near(a.stockMl+a.waterMl,a.finalMl)&&near(a.stockMl*a.stockPpm,a.finalMl*a.targetPpm),reverse:near(b.finalMl,a.finalMl),salt:near(a.load.totalSaltMg,24.9),strongerTarget:!calculate({...DEFAULTS,stock:30,target:50}).ok};
  return {ok:Object.values(checks).every(Boolean),checks};
 }
 function calculatePeroxide(input){
  if(![input.stock,input.target,input.waterMass].every(positive)||Number(input.stock)>100){
   return {ok:false,reason:'Enter a positive water weight and target, and a stock percentage from above 0 through 100.'};
  }
  const stockPct=Number(input.stock), targetMgL=Number(input.target), waterGrams=Number(input.waterMass);
  // Approximate the finished dilute solution as 1 g/mL.
  const targetPct = targetMgL / 10000;
  const stockGrams = waterGrams * (targetPct / (stockPct - targetPct));
  const finalMl = waterGrams + stockGrams;
  if(targetPct>=stockPct||!positive(stockGrams)||!positive(finalMl)){
   return {ok:false,reason:'Choose a target below the stock concentration.'};
  }
  // A 1% w/w working solution contains 10 mg peroxide per gram.
  let twoStep=null;
  if(stockPct>1&&targetPct<1){
   const workingGrams = waterGrams * (targetPct / (1 - targetPct));
   const workingWater = Math.ceil(workingGrams * (1 - 1 / stockPct));
   const concentrateGrams = workingWater / (stockPct - 1);
   if([workingGrams,workingWater,concentrateGrams].every(positive)){
    twoStep={batchGrams:workingWater+concentrateGrams,concentrateGrams,waterGrams:workingWater,workingGrams};
   }
  }
  const counts=[input.sprays,input.applications];
  const validCounts=counts.every(value=>!missing(value)&&Number.isSafeInteger(Number(value))&&Number(value)>=0);
  const appliedMl=validCounts?ML_PER_SPRAY*Number(input.sprays)*Number(input.applications):null;
  const appliedMg=appliedMl===null?null:targetMgL*(appliedMl/1000);
  return {ok:true,stockPct,targetMgL,finalMl,stockGrams,waterGrams,twoStep,appliedMl,appliedMg:Number.isFinite(appliedMg)?appliedMg:null};
 }
 const BLEACH_WATER_PARTS=Object.freeze({tandil:64,clorox:384,vertex:320});
 function calculateTrayBleach({recipe,waterVolume,bleachMl,waterMl}){
  if(!positive(waterVolume)) return null;
  if(recipe==='label'&&![bleachMl,waterMl].every(positive)) return null;
  const waterParts=recipe==='label'?Number(waterMl)/Number(bleachMl):BLEACH_WATER_PARTS[recipe];
  if(!positive(waterParts)) return null;
  const dilutedWaterMl=Number(waterVolume);
  const stockMl=dilutedWaterMl/waterParts;
  const finalMl=dilutedWaterMl+stockMl;
  if(!positive(stockMl)||!positive(finalMl)) return null;
  return {finalMl,stockMl,waterMl:dilutedWaterMl};
 }
 return {DEFAULTS,PEROXIDE_DEFAULTS,FEED_G_L,ML_PER_SPRAY,calculate,calculatePeroxide,calculateTrayBleach,verification,selfTest};
});
