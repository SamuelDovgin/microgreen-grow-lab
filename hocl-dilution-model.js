(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HoclDilutionModel=api;})(typeof window==='object'?window:this,function(){
 'use strict';
 const FEED_G_L=6,ML_PER_SPRAY=1.66/10;
 const DEFAULTS=Object.freeze({mode:'final',stock:300,target:50,finalVolume:500,stockVolume:250,unit:'mL',sprays:10,applications:10,measuredFinal:'',ph:''});
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
  const a=calculate({...DEFAULTS,stock:300}),b=calculate({...DEFAULTS,mode:'stock',stock:300,stockVolume:a.stockMl});
  const near=(x,y)=>Math.abs(x-y)<=1e-9*Math.max(1,Math.abs(x),Math.abs(y));
  const checks={emptyStock:!calculate({...DEFAULTS,stock:''}).ok,default500:a.finalMl===500,conservation:near(a.stockMl+a.waterMl,a.finalMl)&&near(a.stockMl*300,a.finalMl*50),reverse:near(b.finalMl,500),salt:near(a.load.totalSaltMg,16.6),strongerTarget:!calculate({...DEFAULTS,stock:30,target:50}).ok};
  return {ok:Object.values(checks).every(Boolean),checks};
 }
 return {DEFAULTS,FEED_G_L,ML_PER_SPRAY,calculate,verification,selfTest};
});
