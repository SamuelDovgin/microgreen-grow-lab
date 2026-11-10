(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SeedSanitationModel=api;})(typeof window==='object'?window:this,function(){
 'use strict';
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
 return {dilution,plan};
});
