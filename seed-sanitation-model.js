(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SeedSanitationModel=api;})(typeof window==='object'?window:this,function(){
 'use strict';
 function bathFromSeed(seedGrams,bathPerGram){
  const seed=Number(seedGrams),ratio=Number(bathPerGram),bath=seed*ratio;
  return seed>0&&ratio>0&&Number.isFinite(bath)&&bath>0?bath:null;
 }
 function dilution({stock,target,batch}){
  const values=[stock,target,batch];
  if(values.some(v=>v===''||v===null||v===undefined||!Number.isFinite(Number(v))||Number(v)<=0))return {ok:false,reason:'Enter positive stock strength, target strength and finished batch.'};
  [stock,target,batch]=values.map(Number);
  if(target>stock)return {ok:false,reason:'Target exceeds stock strength. Dilution cannot make a stronger solution.'};
  const amount=batch*target/stock;
  if(!Number.isFinite(amount))return {ok:false,reason:'The quantities are outside the calculation range.'};
  return {ok:true,stock:amount,water:batch-amount,final:batch};
 }
 function plan(input){
  if(!['peroxide','hocl','bleach'].includes(input.chemical)||!['mass','volume'].includes(input.basis))return {ok:false,reason:'Choose a chemical and matching concentration basis.'};
  if(input.chemical!=='hocl'&&(Number(input.stock)>100||Number(input.target)>100))return {ok:false,reason:'A percentage cannot exceed 100%.'};
  if(input.chemical==='hocl'&&input.basis!=='volume')return {ok:false,reason:'Available chlorine uses measured ppm and final volume in this planner.'};
  const result=dilution(input);if(!result.ok)return result;
  const time=Number(input.contact),hasTime=input.contact!==''&&input.contact!==null&&input.contact!==undefined&&Number.isFinite(time)&&time>0;
  return {...result,unit:input.basis==='mass'?'g':'mL',contact:hasTime?time:null,ready:input.labelOk===true&&hasTime};
 }
 function quickProfile(cropId,data){
  if(data.quickProfiles[cropId])return data.quickProfiles[cropId];
  const crop=data.crops[cropId];if(!crop)return null;
  const unspecified={status:'No dose specified here',concentration:'Use crop-specific label',time:'Use crop-specific label',note:'This guide does not select a chemical protocol for this crop.',source:data.sources.grower};
  return {label:crop.name,recommended:crop.status==='Recommended',answer:crop.status==='Recommended'?'Yes — recommended':crop.status==='Consider'?'Consider treatment':crop.status==='Avoid routine bath'?'No — avoid routine bath':'No — not routinely',why:crop.note,hocl:{...unspecified},peroxide:{...unspecified},spray:{hocl:'No — not recommended',peroxide:'No — not recommended',concentration:'No concentration recommended',note:'Use potable water when needed; no crop-specific daily spray is selected here.'}};
 }
 function comparison(chemical,concentration,cropId,data){
  const c=Number(concentration),settings=data.chemicalComparisons?.[chemical];
  if(!settings||!settings.options.includes(c)||!data.crops[cropId])return null;
  if(chemical==='peroxide'){
   const ratio=settings.referenceConcentration/c,minutes=settings.referenceMinutes*ratio,anchor=c===settings.referenceConcentration;
   const alternatives=[settings.referenceMinutes*Math.pow(ratio,.5),settings.referenceMinutes*Math.pow(ratio,2)];
   return {chemical,selected:c,minutes,concentration:c+'% H₂O₂*',time:minutes+' min*',status:anchor?'Grower anchor · 5-minute assumption*':'Unconfirmed time extrapolation*',confirmed:false,kind:anchor?'grower-anchor':'hypothetical-extrapolation',sensitivity:{low:Math.min(...alternatives),high:Math.max(...alternatives)},source:settings.source,footnote:settings.footnote,note:anchor?'The model chooses 5 minutes, the upper end of the grower’s 3–5 minute guidance, as a common 3% anchor. This does not establish a crop-specific kill step.':'5 × (3 ÷ '+c+') = '+minutes+' min assumes constant concentration × time. At 12%, that is 75 seconds, an untested extrapolation. It does not predict germination or microbial reduction. The separate 12% × 15-minute broccoli bacterial experiment is documented in the research note; it is not the timing-model anchor.'};
  }
  const ratio=settings.referenceConcentration/c,minutes=settings.referenceMinutes*ratio,anchor=c===settings.referenceConcentration;
  const sensitivity={low:settings.referenceMinutes*Math.pow(ratio,.5),high:settings.referenceMinutes*Math.pow(ratio,2)};
  const note=anchor?'800 ppm × 15 minutes is the broccoli reference. This is not a validated treatment for your seed lot.':'15 × (800 ÷ '+c+') = '+minutes+' min assumes constant concentration × time. This exceeds the studied 1–15 minute window; effectiveness and germination at this duration were not established.';
  return {chemical,selected:c,minutes,concentration:c+' ppm*',time:minutes+' min*',status:anchor?'Broccoli study reference*':'Unconfirmed time extrapolation*',footnote:anchor?'* Broccoli study reference; not a confirmed protocol for your seed lot.':settings.footnote,note,source:settings.source,confirmed:false,kind:anchor?'study-reference':'hypothetical-extrapolation',sensitivity};
 }
 return {dilution,plan,quickProfile,comparison,bathFromSeed};
});
