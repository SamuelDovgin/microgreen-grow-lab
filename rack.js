(function(){
'use strict';
const M=window.LightModel,$=id=>document.getElementById(id);
const numbers=['depth','firstDeck','railDepth','wireDepth','mountGap','fixtureHeight','trayDepth','bottomThickness','nestGap','fill','growth','targetGap','measuredDrop','measuredMedium'];
const selects=['base','layout','mount','mediumMode','pitchMode'];
const defaults={depth:24,firstDeck:8,railDepth:1.5,wireDepth:.125,mountGap:.125,fixtureHeight:1.53,trayDepth:1.25,bottomThickness:.075,nestGap:.125,fill:1,growth:1.5,targetGap:6,measuredDrop:1.78,measuredMedium:1.275,base:'wheels',layout:'full',mount:'grid',mediumMode:'components',pitchMode:'notches',bay:0};
const f=(v,d=2)=>Number((v+Math.sign(v)*1e-10).toFixed(d)).toString();
const txt=(x,y,t,attr='')=>`<text x="${x}" y="${y}" fill="#334e3b" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" ${attr}>${t}</text>`;
const line=(x1,y1,x2,y2,color='#78906b',width=1)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
function read(){const r=Object.fromEntries(numbers.map(k=>[k,Number($(k).value)]));for(const k of selects)r[k]=$(k).value;r.pitches=Array.from({length:5},(_,i)=>Number($('pitch'+i).value));r.bay=Number($('bay').value);return r;}
function valid(){return [...numbers,...Array.from({length:5},(_,i)=>'pitch'+i)].every(k=>$(k).value.trim()!==''&&$(k).validity.valid);}
function elevation(r,g){
 const el=$('rack-elevation'),W=Math.max(245,el.getBoundingClientRect().width),H=485,L=35,R=W*.53,domain=Math.max(g.overallHeight,g.floorDecks.at(-1)+5),scale=(H-60)/domain,y=h=>H-28-h*scale;
 let out='<title>Six-shelf TRINITY rack elevation</title><desc>Positions use the chosen lowest-deck datum and each independent shelf pitch. Highlighted bay is selected. Caster lift changes floor elevations but not leaf gaps.</desc>';
 out+=line(14,y(0),W-8,y(0),'#64755f',1.5);
 out+=line(L,y(g.baseLift),L,y(72+g.baseLift),'#64755f',3)+line(R,y(g.baseLift),R,y(72+g.baseLift),'#64755f',3);
 if(r.base==='wheels')for(const x of [L,R])out+=`<circle cx="${x}" cy="${y(2)}" r="${1.8*scale}" fill="#53604d"/>`;
 const selected=g.bays[r.bay];
 out+=`<rect x="${L-8}" y="${y(selected.upper)}" width="${R-L+16}" height="${selected.pitch*scale}" fill="#d8e8ae" fill-opacity=".45"/>`;
 for(let i=0;i<6;i++){
  const yy=y(g.floorDecks[i]);
  out+=`<rect x="${L-7}" y="${yy}" width="${R-L+14}" height="${r.railDepth*scale}" fill="#d0d7c5" stroke="#7b8b70" stroke-width=".8"/>`;
  out+=line(L-7,yy,R+7,yy,'#3c5940',1.5);
  out+=txt(R+15,yy+4,`S${i+1} · ${f(g.floorDecks[i])}″`);
 }
 for(const bay of g.bays){
  const lit=bay.lit,cropY=y(bay.canopy),soilY=y(bay.medium),ledY=y(bay.light);
  if(lit)out+=`<rect x="${L+8}" y="${ledY-3}" width="${R-L-16}" height="3" fill="#486a45"/>`;
  out+=`<rect x="${L+10}" y="${soilY}" width="${R-L-20}" height="${Math.max(2,r.fill*scale)}" fill="#ab926c"/>`;
  if(lit)out+=`<rect x="${L+11}" y="${cropY}" width="${R-L-22}" height="${r.growth*scale}" fill="#7da25b" fill-opacity=".65"/>`;
  out+=txt(L-13,y((bay.lower+bay.upper)/2)+4,`${f(bay.pitch)}″`,'text-anchor="end"');
 }
 out+=txt((L+R)/2,16,`${g.overallHeight}″ overall`,'text-anchor="middle"');
 out+=txt(W-7,H-5,'Deck heights above floor','text-anchor="end"');
 el.setAttribute('viewBox',`0 0 ${W} ${H}`);el.innerHTML=out;
}
function bayDrawing(r,g,b){
 const el=$('rack-bay'),W=Math.max(245,el.getBoundingClientRect().width),H=350,L=23,R=W-67,T=32,B=260;
 const max=Math.max(b.pitch,r.growth+g.medium+g.lightDrop+1),scale=(B-T)/max,y=h=>B-h*scale,deckY=y(b.pitch),railY=y(b.pitch-r.railDepth),mid=(L+R)/2;
 let out='<title>Selected bay vertical assembly</title><desc>Upper deck, rail and grid are separate references. Light drop, nested tray/fill elevation and shoot height are subtracted from deck-to-deck pitch.</desc>';
 out+=line(L-5,B,R+5,B,'#536e4b',2)+line(L-5,deckY,R+5,deckY,'#536e4b',2);
 for(const x of [L-5,R-4])out+=`<rect x="${x}" y="${deckY}" width="9" height="${r.railDepth*scale}" fill="#c1cbb5" stroke="#6c7e61"/>`;
 const lightTop=b.pitch-g.lightDrop+r.fixtureHeight,lightBottom=b.pitch-g.lightDrop;
 if(b.lit){
  out+=`<rect x="${mid-15}" y="${y(lightTop)}" width="30" height="${r.fixtureHeight*scale}" rx="2" fill="#d7ddc9" stroke="#56764c"/>`;
  out+=line(mid-15,y(lightBottom),mid+15,y(lightBottom),'#3b6a44',3);
  const anchor=r.mount==='rail'?railY:y(b.pitch-r.wireDepth);
  out+=line(mid,anchor,mid,y(lightTop),'#869279',1.5);
 }
 const innerBottom=2*r.bottomThickness+r.nestGap,innerOuterBottom=r.bottomThickness+r.nestGap;
 out+=`<path d="M${L+7},${y(r.trayDepth)} V${B-1} H${R-7} V${y(r.trayDepth)}" fill="none" stroke="#4f6550" stroke-width="2"/>`;
 out+=`<path d="M${L+12},${y(g.nestedRim)} V${y(innerOuterBottom)} H${R-12} V${y(g.nestedRim)}" fill="none" stroke="#73916b" stroke-width="2"/>`;
 out+=`<rect x="${L+14}" y="${y(g.medium)}" width="${R-L-28}" height="${Math.max(1,(g.medium-innerBottom)*scale)}" fill="#aa8e68"/>`;
 out+=`<rect x="${L+16}" y="${y(g.medium+r.growth)}" width="${R-L-32}" height="${r.growth*scale}" fill="#8ead63" fill-opacity=".48"/>`;
 for(let i=0;i<9;i++){const x=L+19+(R-L-38)*i/8;out+=line(x,y(g.medium),x,y(g.medium+r.growth),'#6f934f',1);}
 const dimX=R+20,canY=y(g.medium+r.growth),ledY=y(lightBottom);
 if(b.lit){out+=line(dimX,ledY,dimX,canY,b.gap>0?'#486a45':'#a3432f',1.3)+line(dimX-4,ledY,dimX+4,ledY)+line(dimX-4,canY,dimX+4,canY);out+=txt(dimX+7,(ledY+canY)/2+4,`${f(b.gap)}″`);}
 else out+=txt(mid,(deckY+B)/2,'Germination bay','text-anchor="middle"');
 out+=txt(W/2,H-63,`Pitch ${f(b.pitch)}″ · light drop ${f(g.lightDrop,3)}″`,'text-anchor="middle"');
 out+=txt(W/2,H-45,`Medium ${f(g.medium,3)}″ · shoots ${f(r.growth)}″`,'text-anchor="middle"');
 out+=txt(W/2,H-18,'Rail at ends; lamp mounted inside bay','text-anchor="middle"');
 el.setAttribute('viewBox',`0 0 ${W} ${H}`);el.innerHTML=out;
}
function render(){
 for(let i=0;i<5;i++)$('pitch'+i).step=$('pitchMode').value==='measured'?'.01':'1';
 const r=read(),g=valid()?M.rackGeometry(r):null,apply=$('apply-bay');
 if(!g){$('rack-validation').className='notice error';$('rack-validation').textContent='Enter valid dimensions; use whole-inch mounting steps, or switch to measured pitch mode for fractional deck distances.';apply.hidden=true;for(const id of ['pitch-result','opening-result','rack-gap-result'])$(id).textContent='—';$('rack-rows').innerHTML='';$('growth-rows').innerHTML='';$('rack-equation').textContent='';$('rack-elevation').innerHTML='';$('rack-bay').innerHTML='';return;}
 $('rack-depth-spec').textContent=`48 × ${r.depth} in`;
 $('rack-profile-label').textContent=r.depth===24?'Your 24-inch shelf adaptation':'Original 18-inch Costco reference';
 const b=g.bays[r.bay];elevation(r,g);bayDrawing(r,g,b);
 $('bay-title').textContent=`Bay ${r.bay+1} · S${r.bay+1} → S${r.bay+2}`;
 $('rack-height-note').textContent=`${g.overallHeight}″ overall; top deck at ${f(g.floorDecks.at(-1))}″ above floor with the chosen lowest-deck position. Not evenly divided from total rack height.`;
 const problems=[];
 if(!g.trayFits)problems.push(`The original 18-inch shelf leaves about ${f(g.trayOverhang)}″ of each 21-inch tray unsupported at both depth edges. This does not meet your no-overhang requirement; use the 24-inch planning shelf.`);
 if(!g.topFits)problems.push('The selected top shelf exceeds the 72-inch frame extent. Change shelf pitches or the lowest-deck position.');
 if(!g.fillFits&&r.mediumMode==='components')problems.push('Medium fill exceeds the modeled inner tray depth. Check tray geometry/fill.');
 if(b.gap<=0&&b.lit)problems.push('The canopy reaches or crosses the LED face. Increase this bay’s pitch or reduce the crop height.');
 if(g.bays.some(v=>v.clearOpening<=0))problems.push('A shelf rail overlaps the next deck in this model.');
 $('rack-validation').className='notice'+(problems.length?' error':' good');
 $('rack-validation').textContent=problems.length?problems.join(' '):`${r.depth}-inch shelf contains the 21-inch tray depth. Vertical geometry fits the reference frame extent; verify the actual 24-inch rack's height, rails and mounting dimensions. Installation offsets remain assumptions until measured.`;
 $('pitch-result').textContent=f(b.pitch)+'″';$('opening-result').textContent=f(b.clearOpening)+'″';$('rack-gap-result').textContent=b.lit?f(b.gap)+'″':'Unlit';
 $('rack-equation').textContent=`${f(b.pitch)}″ deck pitch − ${f(g.lightDrop,3)}″ deck-to-LED drop − ${f(g.medium,3)}″ medium elevation − ${f(r.growth)}″ shoots = ${f(b.gap,3)}″ leaf-to-LED gap`;
 const href=new URL('lighting.html',window.location.href);
 for(const [k,v] of Object.entries({rack:'trinity',depth:r.depth,pitch:b.pitch,drop:g.lightDrop,soil:g.medium,growth:r.growth,levels:g.litLevels}))href.searchParams.set(k,String(v));
 apply.href=href.href;apply.hidden=problems.length>0||!b.lit;
 $('bay-use-note').textContent=!b.lit?'This bay is reserved for germination in the beginner layout; select one of the three upper lit bays to transfer a lighting plan.':'Transfers this bay’s pitch, calculated lamp drop, medium elevation and shoot height to the light-spread and dose planner. Other rack bays can differ.';
 $('growth-rows').innerHTML=[1,3,5].map(h=>`<tr><td>${h}″</td><td>${b.lit?f(b.pitch-g.lightDrop-g.medium-h)+'″':'No lamp in this bay'}</td></tr>`).join('');
 $('pitch-advice').textContent=`To leave your selected ${f(r.targetGap)}″ gap above ${f(r.growth)}″ shoots, the next sufficient whole-inch pitch is ${g.recommendedPitch}″ using these inputs. This is a dimension check, not a light-dose recommendation.`;
 $('rack-rows').innerHTML=g.bays.map(v=>`<tr${v.index===r.bay?' class="selected-bay"':''}><td>Bay ${v.index+1} · S${v.index+1} at ${f(v.lower)}″</td><td>${v.pitch}″</td><td>${v.lit?f(v.light)+'″':'Unlit'}</td><td>${f(v.canopy)}″</td><td>${v.lit?f(v.gap)+'″':'—'}</td></tr>`).join('');
}
$('rack-form').addEventListener('submit',e=>e.preventDefault());$('rack-form').addEventListener('input',render);
$('reset-rack').addEventListener('click',()=>{for(const [k,v] of Object.entries(defaults))$(k).value=v;for(let i=0;i<5;i++)$('pitch'+i).value=10;render();});
new ResizeObserver(render).observe($('rack-elevation').parentElement);new ResizeObserver(render).observe($('rack-bay').parentElement);
render();
})();
