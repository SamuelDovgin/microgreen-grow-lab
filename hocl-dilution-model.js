(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HoclDilutionModel=api;})(typeof window==='object'?window:this,function(){
 'use strict';
 const FEED_G_L=6,ML_PER_SPRAY=1.66/10;
 const DEFAULTS=Object.freeze({mode:'final',stock:200,target:50,finalVolume:500,stockVolume:250,unit:'mL',sprays:10,applications:10,measuredFinal:'',ph:''});
 const PEROXIDE_DEFAULTS=Object.freeze({stock:12,target:100,finalVolume:500,sprays:10,applications:10});
 const missing=v=>v===''||v===null||v===undefined;
 const positive=v=>!missing(v)&&Number.isFinite(Number(v))&&Number(v)>0;
 function verification(input){
  const facMissing=missing(input.measuredFinal),phMissing=missing(input.ph),fac=facMissing?null:Number(input.measuredFinal),ph=phMissing?null:Number(input.ph);
  if((!facMissing&&(!Number.isFinite(fac)||fac<0))||(!phMissing&&(!Number.isFinite(ph)||ph<0||ph>14)))return {state:'invalid',message:'Final FAC must be zero or positive; measured pH must be between 0 and 14.'};
  return {state:facMissing&&phMissing?'missing':facMissing?'fac-missing':phMissing?'ph-missing':'recorded',fac,ph,delta:facMissing||!positive(input.target)?null:fac-Number(input.target)};
 }
 function calculate(input){
  const check=verification(input);
  if(!['final','stock'].includes(input.mode)||!['mL','L'].includes(input.unit))return {ok:false,reason:'Choose a batch mode and volume unit.',verification:check};
  if(missing(input.stock))return {ok:false,reason:'Enter the measured free chlorine in your stock solution.',verification:check};
  if(!positive(input.stock)||!positive(input.target))return {ok:false,reason:'Stock and target FAC must be positive numbers in ppm.',verification:check};
  const stock=Number(input.stock),target=Number(input.target);
  if(target>stock)return {ok:false,reason:'Target is above your stock reading. Adding water cannot increase FAC.',verification:check};
  const amount=input.mode==='final'?input.finalVolume:input.stockVolume;
  if(!positive(amount))return {ok:false,reason:'Enter a positive volume.',verification:check};
  const factor=input.unit==='L'?1000:1,volume=Number(amount)*factor,fraction=target/stock;
  const stockMl=input.mode==='final'?volume*fraction:volume,finalMl=input.mode==='final'?volume:volume/fraction,waterMl=finalMl-stockMl;
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
  const checks={emptyStock:!calculate({...DEFAULTS,stock:''}).ok,defaultMix:a.finalMl===500&&a.stockMl===125&&a.waterMl===375,conservation:near(a.stockMl+a.waterMl,a.finalMl)&&near(a.stockMl*a.stockPpm,a.finalMl*a.targetPpm),reverse:near(b.finalMl,500),salt:near(a.load.totalSaltMg,24.9),strongerTarget:!calculate({...DEFAULTS,stock:30,target:50}).ok};
  return {ok:Object.values(checks).every(Boolean),checks};
 }
 function calculatePeroxide(input){
  if(![input.stock,input.target,input.finalVolume].every(positive)||Number(input.stock)>100){
   return {ok:false,reason:'Enter a positive batch and target, and a stock percentage from above 0 through 100.'};
  }
  const stockPct=Number(input.stock), targetMgL=Number(input.target), finalMl=Number(input.finalVolume);
  const activeMg=targetMgL*(finalMl/1000);
  const stockGrams=activeMg/(10*stockPct);
  if(!positive(stockGrams)||stockGrams>=finalMl){
   return {ok:false,reason:'Choose a lower target or stronger stock for a dilute spray.'};
  }
  // A 1% w/w working solution contains 10 mg peroxide per gram.
  const workingGrams=activeMg/10;
  let twoStep=null;
  if(stockPct>1&&workingGrams<finalMl){
   const batchGrams=Math.max(stockPct,Math.ceil(workingGrams));
   const concentrateGrams=batchGrams/stockPct;
   twoStep={batchGrams,concentrateGrams,waterGrams:batchGrams-concentrateGrams,workingGrams};
  }
  const counts=[input.sprays,input.applications];
  const validCounts=counts.every(value=>!missing(value)&&Number.isSafeInteger(Number(value))&&Number(value)>=0);
  const appliedMl=validCounts?ML_PER_SPRAY*Number(input.sprays)*Number(input.applications):null;
  const appliedMg=appliedMl===null?null:targetMgL*(appliedMl/1000);
  return {ok:true,stockPct,targetMgL,finalMl,stockGrams,twoStep,appliedMl,appliedMg:Number.isFinite(appliedMg)?appliedMg:null};
 }
 const BLEACH_WATER_PARTS=Object.freeze({clorox:384,vertex:320});
 function calculateTrayBleach({recipe,finalVolume,bleachMl,waterMl}){
  if(!positive(finalVolume)) return null;
  if(recipe==='label'&&![bleachMl,waterMl].every(positive)) return null;
  const waterParts=recipe==='label'?Number(waterMl)/Number(bleachMl):BLEACH_WATER_PARTS[recipe];
  if(!positive(waterParts)) return null;
  const finalMl=Number(finalVolume);
  const stockMl=finalMl/(1+waterParts);
  const dilutedWaterMl=finalMl-stockMl;
  if(!positive(stockMl)||!positive(dilutedWaterMl)) return null;
  return {finalMl,stockMl,waterMl:dilutedWaterMl};
 }
 return {DEFAULTS,PEROXIDE_DEFAULTS,FEED_G_L,ML_PER_SPRAY,calculate,calculatePeroxide,calculateTrayBleach,verification,selfTest};
});
