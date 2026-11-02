(function(){
'use strict';
const M=window.LightModel,$=id=>document.getElementById(id),form=$('layout-form');
const keys=['depth','trays','bars','watts','lumensPerWatt','spacing','pitch','growth','length','drop','soil','levels','rate'];
const presets={
 barrinaT8:{depth:18,trays:4,bars:2,watts:40,lumensPerWatt:137.5,spacing:14,pitch:10,growth:1.5,length:46.1,drop:1.78,soil:1.275,levels:5,rate:.15},
 recommended:{depth:24,trays:4,bars:3,watts:20,lumensPerWatt:100,spacing:8,pitch:14,growth:1.5,length:46.1,drop:1.5,soil:1.5,levels:5,rate:.15},
 mgmOriginal:{depth:18,trays:4,bars:2,watts:22,lumensPerWatt:100,spacing:14,pitch:10,growth:1.5,length:46.1,drop:1.78,soil:1.275,levels:5,rate:.15},
 mgm:{depth:24,trays:4,bars:2,watts:22,lumensPerWatt:100,spacing:20,pitch:10,growth:1.5,length:46.1,drop:1.78,soil:1.275,levels:5,rate:.15},
 otg:{depth:24,trays:4,bars:3,watts:20,lumensPerWatt:100,spacing:9,pitch:10,growth:1.5,length:46.1,drop:1.5,soil:1.5,levels:6,rate:.15},
 home:{depth:24,trays:2,bars:2,watts:20,lumensPerWatt:100,spacing:6,pitch:14,growth:1.5,length:46.1,drop:1.5,soil:1.5,levels:1,rate:.15}};
const DEFAULT_PRESET='barrinaT8';
let active=DEFAULT_PRESET,lastGeometry='',state,importedRack=false;
const notes={barrinaT8:'Your Barrina T8 shop lights · B07G2Q4VZN: 2 × 40 W per shelf, listed 5,500 lm each, 5000 K (137.5 lm/W). Your existing 18″ shelf layout is retained, including tray overhang. Fixture length 46.1″ and deck-to-LED drop 1.78″ are carried-over planning assumptions, not verified T8 dimensions; measure and adjust them. The V-shaped fixture is still approximated by the uncalibrated downward model. A six-pack covers three shelves at two lights each; the current five-shelf rack scenario requires ten lights.',recommended:'Our roomy trial: 24″ shelf, three 20 W bars. Geometry is editorial; measure PPFD before judging dose.',mgmOriginal:'Microgreen Manager source reference: 48 × 18-inch Costco/TRINITY rack, 2 × 22 W bars per shelf, 5 lit shelves and 16 hours on. The 1.5-inch shoot height is a representative mid-growth planning example, not a measurement of his crop. Four trays per shelf and 10-inch pitch are documented across his production articles; their combination with this starter rack is a reconstruction. The video suggests front/rear edge placement; 2-inch insets and 14-inch separation are assumed, not measured. This 18-inch layout has tray overhang. Choose MGM method · 24″ shelf for your contained-tray plan. Lamp drop and medium elevation also include installation assumptions.',mgm:'Your 24-inch-deep adaptation of MGM’s two-bar method: 2 × 22 W, 5 lit shelves, 10″ pitch. His linked Costco rack is 18″ deep; your plan uses 24″ to contain the trays. Assumed 2″ edge insets give 20″ bar separation on this deeper shelf. These are adapted coordinates, not his measured layout. Detailed rack defaults: lamp drop 1.78″ and medium elevation 1.275″, assembled from published dimensions plus assumed grid/tie/nesting/fill values. Use Rack & clearance to inspect or measure them.',otg:'Source build: 3 × 20 W, 6 lit shelves, 24″ depth, 9–10″ pitch. Their reported 17 h is compared here at the selected schedule (16 h by default). Bar centers and vertical offsets are illustrative.',home:'Editorial two-tray layout. Trays run lengthwise across the shelf, with both bars extending over both trays.'};
const fmt=(n,d=1)=>Number((Number(n)+Math.sign(Number(n))*1e-10).toFixed(d)).toString();
const svgText=(x,y,t,attrs='')=>`<text x="${x}" y="${y}" fill="#334e3b" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" ${attrs}>${t}</text>`;
function read(){return Object.fromEntries(keys.map(k=>[k,Number($(k).value)]));}
function color(v){const stops=[[.3,[232,237,209]],[.8,[170,202,120]],[1.2,[85,145,101]],[1.7,[29,95,65]]];v=Math.max(.3,Math.min(1.7,v));let j=1;while(j<stops.length-1&&v>stops[j][0])j++;const a=stops[j-1],b=stops[j],t=(v-a[0])/(b[0]-a[0]);return 'rgb('+a[1].map((c,i)=>Math.round(c+(b[1][i]-c)*t)).join(',')+')';}
function top(s,map){
 const el=$('top-map'),W=Math.max(240,el.getBoundingClientRect().width),pad=W<400?10:24,scale=(W-pad*2)/48;
 const ts=M.trays(s),yMin=Math.min(0,...ts.map(t=>t.oy))-1, yMax=Math.max(s.depth,...ts.map(t=>t.oy+t.od))+1;
 const x=v=>pad+v*scale,y=v=>36+(v-yMin)*scale,H=y(yMax)+(W<380?48:35);
 el.setAttribute('viewBox',`0 0 ${W} ${H}`);
 let out=`<title>Relative canopy light spread</title><desc>${s.bars} bars over ${s.trays} trays. Colors show normalized relative light. Absolute values use an uncalibrated lamp-output estimate.</desc>`;
 out+=`<rect x="${x(0)}" y="${y(0)}" width="${48*scale}" height="${s.depth*scale}" rx="4" fill="#eff0e6" stroke="#aab6a1"/>`;
 out+=svgText(W/2,17,`48″ shelf · ${fmt(s.length)}″ bars`, 'text-anchor="middle"');
 for(const [idx,t] of ts.entries()){
  out+=`<rect x="${x(t.ox)}" y="${y(t.oy)}" width="${t.ow*scale}" height="${t.od*scale}" rx="3" fill="#cbd5bd" stroke="#63795e"/>`;
  const nx=16,ny=8;
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
    const v=map?map.values[idx*nx*ny+j*nx+i]:0;
    out+=`<rect x="${x(t.x+i*t.w/nx)}" y="${y(t.y+j*t.d/ny)}" width="${t.w/nx*scale+.2}" height="${t.d/ny*scale+.2}" fill="${map?color(v):'#d1d4c8'}"/>`;
  }
  const cx=x(t.x+t.w/2),cy=y(t.y+t.d/2);
  out+=`<rect x="${cx-14}" y="${cy-10}" width="28" height="20" rx="4" fill="#fffefa" fill-opacity=".92"/>`+svgText(cx,cy+4,`T${idx+1}`,'text-anchor="middle"');
 }
 for(const by of M.bars(s)){
   out+=`<line x1="${x((48-s.length)/2)}" y1="${y(by)}" x2="${x((48+s.length)/2)}" y2="${y(by)}" stroke="#fffdea" stroke-width="5"/><line x1="${x((48-s.length)/2)}" y1="${y(by)}" x2="${x((48+s.length)/2)}" y2="${y(by)}" stroke="#314c3b" stroke-width="1.2" stroke-dasharray="6 4"/>`;
 }
 out+=W<380?svgText(W/2,H-23,`${s.depth}″ shelf depth`,'text-anchor="middle"')+svgText(W/2,H-7,'Nominal 10 × 20″ canopies','text-anchor="middle"'):svgText(W/2,H-7,`${s.depth}″ shelf depth · nominal 10 × 20″ canopies`,'text-anchor="middle"');
 el.innerHTML=out;
}
function side(s){
 const el=$('side-map'),W=Math.max(240,el.getBoundingClientRect().width),H=W<430?240:220,left=24,right=W-65,bottom=190,sc=145/Math.max(s.pitch, s.drop+s.soil+s.growth+1),topY=bottom-s.pitch*sc,ledY=topY+s.drop*sc,soilY=bottom-s.soil*sc,canY=soilY-s.growth*sc;
 const mid=(left+right)/2,drawW=right-left,dx=v=>left+v/s.depth*drawW;
 let out='<title>Shelf clearance diagram</title><desc>Shelf pitch minus fixture drop, medium height and shoot height gives the remaining leaf-to-light distance.</desc>';
 out+=`<rect x="${left-5}" y="${topY-5}" width="${drawW+10}" height="5" fill="#64755f"/><rect x="${left-5}" y="${bottom}" width="${drawW+10}" height="5" fill="#64755f"/>`;
 const gap=M.clearance(s);
 for(const by of M.bars(s)){
  const bx=dx(by),spread=Math.max(0,gap)*sc*.65;
  if(gap>0)out+=`<path d="M${bx-5},${ledY} L${bx-spread-5},${canY} L${bx+spread+5},${canY} L${bx+5},${ledY}Z" fill="#d9e992" fill-opacity=".22"/>`;
  out+=`<rect x="${bx-5}" y="${ledY-4}" width="10" height="4" rx="1" fill="#335b42"/><line x1="${bx}" y1="${topY}" x2="${bx}" y2="${ledY-4}" stroke="#8a9782"/>`;
 }
 out+=`<rect x="${left+8}" y="${soilY}" width="${drawW-16}" height="${bottom-soilY-2}" fill="#a88c68"/><path d="M${left+5},${soilY} L${left+10},${bottom-2} H${right-10} L${right-5},${soilY}" fill="none" stroke="#596e54" stroke-width="2"/>`;
 for(let i=0;i<18;i++){
   const px=left+15+(drawW-30)*i/17,py=canY+3+(i%3)*2;
   out+=`<path d="M${px},${soilY} Q${px-2},${py+12} ${px},${py}" fill="none" stroke="#5e8851" stroke-width="1.3"/><ellipse cx="${px-3}" cy="${py}" rx="4" ry="2.5" fill="#79a35b" transform="rotate(25 ${px-3} ${py})"/><ellipse cx="${px+3}" cy="${py-1}" rx="4" ry="2.5" fill="#659753" transform="rotate(-25 ${px+3} ${py-1})"/>`;
 }
 out+=`<line x1="${right+16}" y1="${ledY}" x2="${right+16}" y2="${canY}" stroke="${gap>0?'#3d6244':'#a3432f'}" stroke-width="1"/><path d="M${right+12},${ledY}h8 M${right+12},${canY}h8" stroke="#3d6244"/>`;
 out+=svgText(right+23,(ledY+canY)/2+4,`${fmt(gap,2)}″`);
 out+=W<430?svgText(W/2,H-23,`Pitch ${fmt(s.pitch)}″ · fixture drop ${fmt(s.drop)}″`,'text-anchor="middle"')+svgText(W/2,H-6,`Medium ${fmt(s.soil)}″ · shoots ${fmt(s.growth)}″`,'text-anchor="middle"'):svgText(W/2,H-5,`${fmt(s.pitch)}″ pitch − ${fmt(s.drop)}″ fixture − ${fmt(s.soil)}″ medium − ${fmt(s.growth)}″ shoots`,'text-anchor="middle"');
 el.setAttribute('viewBox',`0 0 ${W} ${H}`);el.innerHTML=out;
}
function schedule(){
 const hours=Number($('hours').value),days=Number($('days').value),upper=Number($('reference').value);
 return {hours,days,upper,valid:$('hours').value.trim()!==''&&$('days').value.trim()!==''&&$('hours').validity.valid&&$('days').validity.valid&&Number.isFinite(hours)&&Number.isInteger(days)};
}
function cumulativeChart(plan,days,upper){
 const el=$('dose-chart'),W=Math.max(230,el.getBoundingClientRect().width),H=220,L=51,R=W-14,T=30,B=H-40;
 const max=Math.max(upper*days,plan?plan.total:0,1)*1.12;
 const x=d=>L+(R-L)*d/days,y=v=>B-(B-T)*v/max;
 const pts=[[L,B],[R,y(upper*days)],[R,y(9*days)]];
 let out='<title>Cumulative light dose compared with reference</title><desc>Shaded band extends the selected daily reference across the same number of lit days. The solid line uses the entered constant PPFD and daily hours.</desc>';
 out+=`<rect x="${L}" y="${T}" width="${R-L}" height="${B-T}" fill="none" stroke="#ccd5c1"/>`;
 for(const v of [0,max/2,max])out+=`<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="#d6decb"/>`+svgText(L-7,y(v)+4,fmt(v),'text-anchor="end"');
 out+=`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="#a8c77a" fill-opacity=".45"/>`;
 for(const day of [...new Set([0,Math.round(days/2),days])])out+=svgText(x(day),B+18,String(day),'text-anchor="middle"');
 out+=svgText((L+R)/2,H-4,'Days under lights','text-anchor="middle"');
 out+=svgText(13,(T+B)/2,'Total (mol·m⁻²)',`text-anchor="middle" transform="rotate(-90 13 ${(T+B)/2})"`);
 out+=svgText(L,15,'Shading: reference');
 if(plan){
  const stroke=plan.status==='within'?'#286044':'#99631d';
  out+=`<line x1="${L}" y1="${B}" x2="${R}" y2="${y(plan.total)}" stroke="${stroke}" stroke-width="2.5"/><circle cx="${R}" cy="${y(plan.total)}" r="4" fill="${stroke}"/>`;
  out+=svgText(R,15,'Line: dose','text-anchor="end"');
 }
 el.setAttribute('viewBox',`0 0 ${W} ${H}`);el.innerHTML=out;
}
function selectLightLevel(){
 const choice=$('ppfd-preset').value,custom=choice==='custom';
 $('custom-ppfd-field').hidden=!custom;$('reading-basis-field').hidden=!custom;
 if(!custom){if(choice!=='auto')$('ppfd').value=choice;$('basis').value='example';}
 dose();
}
function dose(){
 const automatic=$('ppfd-preset').value==='auto',estimated=automatic?M.estimate(state||read()):null;
 if(automatic){$('ppfd').value=estimated?String(estimated.median):'';$('basis').value='example';}
 $('auto-ppfd-note').hidden=!automatic;
 $('auto-ppfd-note').textContent=estimated?`≈ ${Math.round(estimated.median)} PPFD · estimated canopy median. Sampled spread: ${Math.round(estimated.min)}–${Math.round(estimated.max)} PPFD. Updates with the lamp and shelf settings. Not measured.`:'No estimate: keep the canopy below the LED face and use valid lamp settings.';
 const el=$('ppfd'),value=el.value.trim(),p=Number(value),example=$('basis').value==='example',q=schedule();
 $('dose-basis-note').textContent=automatic?'Estimated spatial median, not a measurement.':example?'Fixed planning assumption, not a measurement.':'Your entered canopy measurement.';
 $('off-hours').textContent=q.valid?`${fmt(q.hours)} h on / ${fmt(24-q.hours)} h off`:'Choose 0–24 hours/day in half-hour steps.';
 $('daily-range').textContent=`Reference: 9–${q.upper} per day`;
 $('total-period').textContent=q.valid?`total over ${q.days} ${q.days===1?'day':'days'}`:'total over selected period';
 $('period-range-unit').textContent=q.valid?`mol·m⁻² over ${q.days} ${q.days===1?'day':'days'}`:'mol·m⁻² over selected period';
 $('period-range').textContent=q.valid?`${9*q.days}–${q.upper*q.days}`:'—';
 $('total-hours').textContent=q.valid?`${fmt(q.hours*q.days)} h`:'—';
 const plan=value&&(automatic||el.validity.valid)&&q.valid?M.dosePlan(p,q.hours,q.days,q.upper):null;
 $('dose-verdict').dataset.state=plan?plan.status:'unknown';
 if(!plan){
  $('total-result').textContent='—';$('dli-result').textContent='—';
  $('dose-verdict').textContent=!q.valid?'Check the selected period':automatic?'No estimate at this layout':value?'Check PPFD':'Enter PPFD to check the range';
  $('dose-status').textContent=!q.valid?'Use 0–24 light hours per day and 1–60 whole days.':automatic?'The estimate is unavailable at this geometry. Correct the lamp-to-canopy clearance.':value?'Enter a PPFD from 0 to 2000.':'Enter your PPFD or return to the automatic estimate.';
  $('dose-next').textContent='Use valid shelf geometry for Auto, or enter a custom light level.';
  if(q.valid)cumulativeChart(null,q.days,q.upper);else $('dose-chart').innerHTML='';
  return;
 }
 $('total-result').textContent=plan.total.toFixed(2);$('dli-result').textContent=plan.daily.toFixed(2);
 const label={below:'Below reference range',within:'Within reference range',above:'Above reference range'}[plan.status];
 $('dose-verdict').textContent=(automatic?'Estimated median · ':example?'Assumed light · ':'')+label;
 const prefix=automatic?'Estimated median-canopy dose: ':example?'Planning assumption: ':'From your entered reading: ';
 $('dose-status').textContent=`${prefix}${plan.daily.toFixed(2)} DLI × ${plan.days} days = ${plan.total.toFixed(2)} mol·m⁻². ${label} of ${plan.lowerTotal}–${plan.upperTotal} over this period.`;
 const neededLo=9/(q.hours*.0036),neededHi=q.upper/(q.hours*.0036);
 $('dose-next').textContent=q.hours===0?'No light hours selected: calculated exposure is zero.':`${fmt(q.hours)} h/day needs about ${Math.ceil(neededLo)}–${Math.floor(neededHi)} PPFD for the selected daily reference (normally compared using area-average readings). `+(plan.status==='below'?'Increasing the number of days also raises the period benchmark; it does not fix a low daily dose.':plan.status==='above'?'Compare a lower daily PPFD or shorter photoperiod, then assess the crop.':'Daily and cumulative arithmetic fit this reference; verify uniformity and crop response.');
 $('measurement-reset').textContent=automatic?`Auto uses ${fmt(state?.lumensPerWatt??100)} lm/W, a rough 60 lm per µmol/s conversion, and a downward Lambertian model. Spectrum-only sensitivity: `+Math.round(estimated.spectrumLow)+'–'+Math.round(estimated.spectrumHigh)+' median PPFD; not a confidence interval. The displayed representative height and PPFD are held constant over the period.':example?'The selected assumed light level stays in place when you change the layout; it does not predict lamp output.':'Re-measure as shoots grow; this projection assumes the entered PPFD holds throughout the period.';
 cumulativeChart(plan,plan.days,plan.upper);
}
function costs(){
 if(!state)return;
 const q=schedule();
 if(!q.valid||!Number.isFinite(state.rate)||!$('rate').validity.valid){$('cost-result').textContent='Enter a valid daily schedule and an electricity rate between $0 and $2/kWh.';return;}
 const e=M.energy(state,q.hours),period=M.energy(state,q.hours,q.days);
 $('cost-result').innerHTML=`<strong>${state.bars*state.levels} bars / ${state.levels} lit shelves</strong> · ${fmt(e.rackWatts,0)} W/rack · ${fmt(e.perTray)} W/tray allocation<br>${e.kwh.toFixed(2)} kWh / 30 days · <strong>$${e.cost.toFixed(2)} / rack</strong> at $${state.rate.toFixed(2)}/kWh · ${fmt(q.hours)} h/day<br>Selected ${q.days}-day period: ${period.kwh.toFixed(2)} kWh / rack · $${period.cost.toFixed(2)} · lights only`;
}

function render(reason){
 const s=read();const maxSpacing=s.bars>1?Math.floor((s.depth-1)/(s.bars-1)*2)/2:10;
 $('spacing').max=maxSpacing;$('spacing').disabled=s.bars===1;
 if(s.spacing>maxSpacing){s.spacing=maxSpacing;$('spacing').value=maxSpacing;}
 const geometry=JSON.stringify(keys.filter(k=>!['levels','rate'].includes(k)).map(k=>s[k]));
 if(lastGeometry&&lastGeometry!==geometry&&$('basis').value==='measured'&&$('ppfd').value){$('ppfd').value='';$('measurement-reset').textContent='Layout changed. Re-measure PPFD at this geometry before calculating its dose.';}
 lastGeometry=geometry;state=s;
 for(const k of keys){const out=$(k+'-out');if(out)out.textContent=fmt(s[k],['drop','soil','growth'].includes(k)?3:1)+(k==='watts'?' W':['bars','levels'].includes(k)?'':'″');}
 const estimated=M.estimate(s),map=estimated?.spatial||M.map(s),gap=M.clearance(s);
 top(s,map);side(s);
 $('gap-result').textContent=fmt(gap,2)+'″';$('watts-result').textContent=fmt(s.bars*s.watts,0)+' W';$('uniform-result').textContent=map?Math.round(map.min*100)+'%':'—';
 $('map-caption').textContent=estimated?`Estimated canopy PPFD: ${Math.round(estimated.median)} median · ${Math.round(estimated.min)}–${Math.round(estimated.max)} sampled range. Colors are relative to this layout’s mean; absolute estimates assume ${fmt(s.lumensPerWatt)} lm/W and a rough spectrum conversion, not measured output.`:'No valid light map: the canopy reaches or exceeds the LED face.';
 const over=Math.max(0,...M.trays(s).map(t=>Math.max(-t.oy,t.oy+t.od-s.depth)));
 $('fit-note').className='notice'+(over?'':' good');
 $('fit-note').textContent=over?`Tray fit: about ${fmt(over,2)}″ of outer-tray overhang at both front and back with these example dimensions. The original MGM reference includes overhang; choose the 24-inch adaptation to contain all four trays.`:`Tray fit: this example layout fits within the nominal shelf rectangle. Measure inside the posts and check your actual tray rims.`;
 let message='',kind='';
 if(gap<=0){kind=' error';message='Canopy intersects the light. Increase shelf pitch, raise the fixture or use a shorter crop. The spread model is suspended.';}
 else if(gap<4){kind=' error';message='Very tight clearance. Reconfigure before the canopy reaches the fixture; check the exact product’s clearance and temperature requirements. No dose can be inferred.';}
 else if(gap<6){message='Below the initial 6–10″ trial gap. Re-map near harvest and watch leaf temperature and hotspots; taller shelf spacing may be needed.';}
 else if(gap<=10){kind=' good';message='Within the initial 6–10″ canopy-gap trial. Verify actual PPFD at the center, edges and corners as shoots grow.';}
 else{message='Above the initial trial gap. Overlap may improve, but spill can reduce canopy intensity. Measure before moving the lights or adding bars.';}
 $('height-note').className='notice'+kind;$('height-note').textContent=message;
 costs();
 $('preset-note').textContent=active?notes[active]:importedRack?'Transferred TRINITY bay: pitch, mounted LED drop, medium elevation and shoot height come from the detailed rack model. Installation assumptions still require measurement.':'Custom layout · source counts no longer define this configuration. Compare measurements from this exact layout.';
 const inset=(s.depth-(s.bars-1)*s.spacing)/2;
 $('bar-inset').textContent=s.bars===1?'One bar centered on shelf depth.':`${fmt(inset)}″ centerline inset from front/rear edges · ${fmt(s.spacing)}″ between bar centers.`;
 dose();
}
function preset(name){active=name;importedRack=false;$('hours').value=16;$('spacing').max=presets[name].bars>1?Math.floor((presets[name].depth-1)/(presets[name].bars-1)*2)/2:10;for(const [k,v] of Object.entries(presets[name]))$(k).value=v;document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===name)));render('preset');}
form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',()=>{active='';importedRack=false;document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));render('input');});
for(const b of document.querySelectorAll('[data-preset]'))b.addEventListener('click',()=>preset(b.dataset.preset));
for(const id of ['hours','days','reference'])$(id).addEventListener('input',()=>{dose();costs();});
$('ppfd-preset').addEventListener('change',selectLightLevel);
$('ppfd').addEventListener('input',dose);$('basis').addEventListener('change',dose);$('example').addEventListener('click',()=>{$('ppfd-preset').value='auto';selectLightLevel();});
$('export').addEventListener('click',()=>{
 const entered=$('ppfd').value.trim(),q=schedule();if(!q.valid)return;const plan=entered&&($('ppfd-preset').value==='auto'||$('ppfd').validity.valid)?M.dosePlan(Number(entered),q.hours,q.days,q.upper):null;const data={title:'Microgreen Guide shelf plan',savedAt:new Date().toISOString(),units:'inches, electrical watts, USD/kWh',photoperiod:{on:q.hours,off:24-q.hours},layout:state,clearanceIn:M.clearance(state),energy30days:M.energy(state,q.hours),energySelectedPeriod:M.energy(state,q.hours,q.days),dose:plan?{...plan,basis:$('ppfd-preset').value==='auto'?'estimated-median':$('basis').value}:null,lightEstimate:$('ppfd-preset').value==='auto'?(()=>{const e=M.estimate(state);return e?{median:e.median,mean:e.mean,min:e.min,max:e.max,sampleCount:e.sampleCount,spectrumLow:e.spectrumLow,spectrumHigh:e.spectrumHigh,assumptions:e.assumptions}:null;})():null,evidence:'lighting.html#sources',limits:['Relative geometry is illustrative and uncalibrated.',`Automatic PPFD additionally assumes ${state.lumensPerWatt} lm/W, a rough lumen-to-photon conversion and a downward Lambertian profile; not calibrated output.`,'Outer tray dimensions are illustrative; verify actual dimensions.','Period reference equals daily DLI reference times lit days; not a validated crop lifetime threshold.','MGM 2-inch edge inset is a video-informed reconstruction, not a measured coordinate.']};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='microgreen-lighting-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
let resizeTimer;new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>render('resize'),100);}).observe($('top-map').parentElement);
new ResizeObserver(()=>dose()).observe(document.querySelector('.dose-results'));
selectLightLevel();
const rackParams=new URLSearchParams(window.location?.search||'');
if(rackParams.get('rack')==='trinity'){
 preset('barrinaT8');$('depth').value=24;$('spacing').value=20;
 for(const k of ['depth','pitch','drop','soil','growth','levels']){
  const raw=rackParams.get(k),n=Number(raw),el=$(k);
  if(raw!==null&&Number.isFinite(n)&&n>=Number(el.min)&&n<=Number(el.max))el.value=n;
 }
 if(rackParams.get('depth')==='18')$('spacing').value=14;
 active='';importedRack=true;document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));render('rack import');
}else preset(DEFAULT_PRESET);
})();
