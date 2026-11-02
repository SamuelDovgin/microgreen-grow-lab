/* Uncalibrated Lambertian geometry; automatic PPFD additionally assumes the documented lumens/W and rough lumen-to-photon conversion. */
(function(root){
  const dli=(ppfd,hours=16)=>ppfd*hours*.0036;
  function dosePlan(ppfd,hours,days,upper=12){
    if(![ppfd,hours,days,upper].every(Number.isFinite)||ppfd<0||hours<0||hours>24||!Number.isInteger(days)||days<1||![12,16].includes(upper))return null;
    const daily=dli(ppfd,hours),total=daily*days;
    const tolerance=1e-9;
    return {ppfd,hours,days,daily,total,lower:9,upper,lowerTotal:9*days,upperTotal:upper*days,lightHours:hours*days,status:daily<9-tolerance?'below':daily>upper+tolerance?'above':'within'};
  }
  const clearance=s=>s.pitch-s.drop-s.soil-s.growth;
  function rackGeometry(r){
    const numeric=['firstDeck','railDepth','wireDepth','mountGap','fixtureHeight','trayDepth','bottomThickness','nestGap','fill','growth','targetGap'];
    if(!numeric.every(k=>Number.isFinite(r[k])&&r[k]>=0)||!Array.isArray(r.pitches)||r.pitches.length!==5||!r.pitches.every(p=>Number.isFinite(p)&&p>0&&(r.pitchMode==='measured'||Number.isInteger(p))))return null;
    if(r.pitchMode!==undefined&&!['notches','measured'].includes(r.pitchMode))return null;
    if(!['grid','rail','measured'].includes(r.mount)||!['wheels','feet'].includes(r.base)||!['full','beginner'].includes(r.layout)||!['components','measured'].includes(r.mediumMode))return null;
    const depth=r.depth??24;if(![18,24].includes(depth))return null;
    const trayOverhang=Math.max(0,(21-depth)/2),trayFits=trayOverhang===0;
    const baseLift=r.base==='wheels'?5:0,overallHeight=72+baseLift;
    const lightDrop=r.mount==='measured'?r.measuredDrop:(r.mount==='rail'?r.railDepth:r.wireDepth)+r.mountGap+r.fixtureHeight;
    const medium=r.mediumMode==='measured'?r.measuredMedium:2*r.bottomThickness+r.nestGap+r.fill;
    if(![lightDrop,medium].every(v=>Number.isFinite(v)&&v>=0))return null;
    const decks=[r.firstDeck];for(const p of r.pitches)decks.push(decks.at(-1)+p);
    const floorDecks=decks.map(v=>v+baseLift),nestedRim=r.bottomThickness+r.nestGap+r.trayDepth;
    const bays=r.pitches.map((pitch,i)=>({index:i,lower:floorDecks[i],upper:floorDecks[i+1],pitch,clearOpening:pitch-r.railDepth,light:floorDecks[i+1]-lightDrop,medium:floorDecks[i]+medium,canopy:floorDecks[i]+medium+r.growth,gap:pitch-lightDrop-medium-r.growth,lit:r.layout==='full'||i>=2}));
    const recommendedPitch=Math.ceil(lightDrop+medium+r.growth+r.targetGap-1e-9);
    return {depth,trayOverhang,trayFits,decks,floorDecks,baseLift,overallHeight,lightDrop,medium,nestedRim,bays,recommendedPitch,topFits:decks.at(-1)<=72,fillFits:r.fill<=r.trayDepth-r.bottomThickness+1e-9,litLevels:r.layout==='full'?5:3};
  }
  function trays(s){
    const n=s.trays, across=n===4?4:2;
    const outerW=n===4?10.75:21.25, outerD=n===4?21.25:10.75;
    const innerW=n===4?10:20, innerD=n===4?20:10;
    const gap=.5, total=across*outerW+(across-1)*gap;
    return Array.from({length:across},(_,i)=>({x:(48-total)/2+i*(outerW+gap)+(outerW-innerW)/2,y:(s.depth-innerD)/2,w:innerW,d:innerD,ox:(48-total)/2+i*(outerW+gap),oy:(s.depth-outerD)/2,ow:outerW,od:outerD}));
  }
  const bars=s=>Array.from({length:s.bars},(_,i)=>s.depth/2+(i-(s.bars-1)/2)*s.spacing);
  function field(s,x,y,segments=48){
    const h=clearance(s); if(h<=0)return null;
    let sum=0; const points=bars(s);
    for(const by of points)for(let i=0;i<segments;i++){
      const bx=(48-s.length)/2+s.length*(i+.5)/segments;
      const r2=h*h+(x-bx)**2+(y-by)**2;
      sum+=h*h/(Math.PI*r2*r2*segments);
    }return sum;
  }
  function map(s){
    if(clearance(s)<=0)return null;
    const ts=trays(s), values=[];
    for(const t of ts)for(let j=0;j<8;j++)for(let i=0;i<16;i++)values.push(field(s,t.x+t.w*(i+.5)/16,t.y+t.d*(j+.5)/8));
    const avg=values.reduce((a,b)=>a+b,0)/values.length;
    return {avg,min:Math.min(...values)/avg,max:Math.max(...values)/avg,values:values.map(v=>v/avg),rawValues:values,columns:16,rows:8};
  }
  const photonAssumptions=Object.freeze({lumensPerWatt:100,lumensPerMicromole:60,sensitivityLumensPerMicromole:[40,80],inchesToMeters:.0254,emission:'All fixture flux distributed downward with a Lambertian profile; no reflections.'});
  function estimate(s){
    if(!Number.isFinite(s.watts)||s.watts<0||!Number.isInteger(s.bars)||s.bars<1||!['depth','spacing','pitch','drop','soil','growth','length'].every(k=>Number.isFinite(s[k]))||s.depth<=0||s.length<=0||s.spacing<0||![2,4].includes(s.trays))return null;
    const spatial=map(s);if(!spatial)return null;
    const lumensPerWatt=s.lumensPerWatt??photonAssumptions.lumensPerWatt;
    if(!Number.isFinite(lumensPerWatt)||lumensPerWatt<=0)return null;
    const a={...photonAssumptions,lumensPerWatt},ppfPerBar=s.watts*a.lumensPerWatt/a.lumensPerMicromole;
    const scale=ppfPerBar/(a.inchesToMeters*a.inchesToMeters);
    const values=spatial.rawValues.map(v=>v*scale),sorted=[...values].sort((x,y)=>x-y),n=sorted.length;
    const median=(sorted[Math.floor((n-1)/2)]+sorted[Math.floor(n/2)])/2;
    return {median,mean:spatial.avg*scale,min:sorted[0],max:sorted[n-1],values,ppfPerBar,sampleCount:n,spatial,
      spectrumLow:median*a.lumensPerMicromole/80,spectrumHigh:median*a.lumensPerMicromole/40,assumptions:a};
  }
  function energy(s,hours=16,days=30){const watts=s.bars*s.watts;return {watts,perTray:watts/s.trays,rackWatts:watts*s.levels,kwh:watts/1000*hours*days*s.levels,cost:watts/1000*hours*days*s.levels*s.rate};}
  const api={dli,dosePlan,clearance,rackGeometry,trays,bars,field,map,estimate,photonAssumptions,energy};
  if(typeof module!=='undefined')module.exports=api; else root.LightModel=api;
})(typeof window!=='undefined'?window:globalThis);
