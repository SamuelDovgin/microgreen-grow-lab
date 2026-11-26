/* Browser controller: drag and button actions both open the same transition form. */
(() => {
'use strict';
const M=window.GrowPlannerModel, S=window.GrowPlannerStore, W=window.TrayWeightView;
const el=id=>document.getElementById(id), dialog=el('planner-dialog');
const now=()=>Date.now();
const focus=(node, preventScroll=true)=>node?.focus({preventScroll});
const id=()=>crypto.randomUUID?.() || Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
const store=S.open({
  storage:{getItem:k=>window.localStorage.getItem(k),setItem:(k,v)=>window.localStorage.setItem(k,v)},
  lock:fn=>navigator.locks?navigator.locks.request(S.KEY,fn):fn()
});
const dateLong=new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric'});
const dateShort=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'});
const agendaDate=new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric'});
const hour=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'});
const dateOnly=key=>new Date(key+'T12:00');
const dragMedia=window.matchMedia('(hover: hover) and (pointer: fine)');
const labels={past:'Past typical window',check:'Inspect today',tomorrow:'Possibly tomorrow',early:'Growing',none:'Timing unavailable'};
const laneCopy={
  germination:{icon:'◉',sub:'Covered establishment',empty:'New trays start here.',hint:'Add a tray to record germination.'},
  blackout:{icon:'◒',sub:'Loose cover · optional for every crop',empty:'No trays in blackout.',hint:'A separate, optional stretch stage.'},
  lights:{icon:'☼',sub:'Lit growth & harvest checks',empty:'No trays under lights.',hint:'Confirm when you move a tray to light.'}
};
let view='board', lastLiveView='board', weekOffset=0, weekAnchor=M.startOfWeek(now()), dragId=null, guidance=null, guidanceError='';
let change=null, returnTo=null, busy=false;
const esc=x=>String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const find=id=>store.current().cycles.find(c=>c.id===id);
const guideText='No reliable standard window stored. Use the crop guide and what you observe.';
const getCardName=c=>c.name===c.cropMethodSnapshot.cropName?'':c.cropMethodSnapshot.cropName;
const flag=p=>p.current==='lights'&&['early','none'].includes(p.status)?'Growing under lights':
  p.current==='blackout'&&p.status==='none'?'Inspect shoots':labels[p.status];
const timestamp=(at,compact=false)=>`<time datetime="${esc(at)}">${esc(M.formatTime(at,compact))}</time>`;
const harvestWeight=c=>c.harvest?.weightG!=null?`${c.harvest.weightG} g`:'';
const harvestPhoto=(src,alt)=>`<img class="harvest-photo" src="${esc(src)}" alt="${esc(alt)}">`;
const estimateDates=window=>{
  const text=window.map(at=>dateShort.format(new Date(at)));
  return text[0]===text[1]?text[0]:text.join(' – ');
};
const currentWindow=p=>p.window?`${p.stageLabel}: ${p.estimated?'about ':''}${M.bandText(p.days)} after ${p.current==='lights'?'moving to light':p.current==='blackout'?'starting blackout':'sowing'} (${estimateDates(p.window)}).`:
  p.current==='blackout'?'Use shoot condition to decide when to move to lights.':guideText;
function status(message) { el('live-status').textContent=message; }
function showError(message='') {
  const box=el('planner-error');
  box.hidden=!message;
  box.textContent=message;
  if (message) status(message);
}
function warning() {
  const {issue}=store.refresh();
  el('storage-warning').textContent=issue;
  el('storage-warning').hidden=!issue;
}
function setHTML(target, html) {
  // Keep native focus/drag nodes stable when a clock tick has not changed the content.
  if (target.renderedMarkup===html) return;
  const focused=document.activeElement;
  const key=target.contains(focused)?focused.dataset.focusKey:null;
  target.innerHTML=html;
  target.renderedMarkup=html;
  if (key) focus([...target.querySelectorAll('[data-focus-key]')].find(n=>n.dataset.focusKey===key));
}
const button=(text,action,attrs='',classes='')=>`<button type="button" class="pl-button ${classes}" data-action="${action}" ${attrs}>${text}</button>`;
const trayAttrs=(c,location)=>`data-tray="${esc(c.id)}" data-focus-key="${esc(location+'-'+c.id)}"`;
function plantArt(phase,big) {
  // The vector is an illustration keyed only to recorded phase. It is not a growth measurement.
  const green=phase==='lights', pale=phase==='blackout';
  const shoots=Array.from({length:9},(_,i)=>{
    const x=24+i*14, h=green?23+(i*7)%19:pale?17+(i*5)%13:3+(i*3)%12;
    if (!green&&!pale&&i%3===0) return `<ellipse cx="${x}" cy="54" rx="${big?4:2.4}" ry="2" fill="#c2a366"/>`;
    return `<path d="M${x} 56q-2 -${h*.48} 1 -${h}" fill="none" stroke="${green?'#45804d':pale?'#9c9f69':'#a8a570'}" stroke-width="${big?2.1:1.5}"/>
      <ellipse cx="${x-3}" cy="${55-h}" rx="${big?5:3.5}" ry="${big?2.7:2}" transform="rotate(24 ${x-3} ${55-h})" fill="${green?'#6c9e54':pale?'#d3d29e':'#bbb980'}"/>
      <ellipse cx="${x+4}" cy="${54-h}" rx="${big?5:3.7}" ry="${big?2.6:2}" transform="rotate(-25 ${x+4} ${54-h})" fill="${green?'#498350':pale?'#baba83':'#b0ad7b'}"/>`;
  }).join('');
  return `<svg class="tray-fig" viewBox="0 0 160 76" aria-hidden="true" focusable="false">
    <rect width="160" height="76" fill="${green?'#e7efdd':pale?'#efeee0':'#eeeadb'}"/>
    <ellipse cx="80" cy="65" rx="73" ry="7" fill="#384635" opacity=".09"/>
    <path d="M14 54H146L138 66H22Z" fill="${green?'#42644a':'#6c6f55'}"/>
    <path d="M13 53H147L144 57H16Z" fill="#796647"/>${shoots}<path d="M14 57H146" stroke="#a19c7b"/>
  </svg>`;
}
function card(c,instant,doc,position) {
  const p=M.projection(c,instant);
  const stage=p.current==='germination'?M.PHASE[p.current]:p.current==='blackout'?'Blackout':'Lights';
  const sub=p.days?`${p.estimated?'Approx. '+p.stageLabel.toLowerCase():p.stageLabel} · ${M.bandText(p.days)}`:
    {lights:'Harvest timing unavailable',blackout:'Manual blackout'}[p.current] || 'See crop guide';
  const descriptionId='board-weight-'+position;
  const weightAttrs=`${trayAttrs(c,'weight-board')} aria-label="${esc('Weight check for '+c.name)}" aria-describedby="${descriptionId}"`;
  return `<article class="tray-card" data-drag-tray="${esc(c.id)}" draggable="${dragMedia.matches}">
    <button class="tray-open" type="button" data-action="open" ${trayAttrs(c,'board')} aria-label="${esc(c.name+', '+stage+', Day '+p.day+', '+flag(p)+'. Open tray')}">
      <span class="tray-flag" data-status="${p.status}">${flag(p)}</span>
      ${plantArt(p.current,['pea-basic','sunflower','mung'].includes(c.cropId))}
      <span class="tray-copy">
        <strong class="tray-name">${esc(c.name)}</strong>
        ${getCardName(c)?`<span class="tray-meta">${esc(getCardName(c))}</span>`:''}
        <span class="tray-stage">${stage} · Day ${p.day}${p.current!=='germination'?' · Stage day '+p.phaseDay:''}</span>
        <span class="tray-meta">${esc(sub)}</span>
        <span class="tray-meta">Started ${timestamp(p.started,true)}</span>
        <span class="tray-handle"><span class="desktop-hint" aria-hidden="true">⠿ Drag or </span>Open tray →</span>
      </span>
    </button>
    ${button(W.boardGoal(doc,c,p.current,instant,descriptionId),'weight',weightAttrs,'tray-weight-button')}
  </article>`;
}
function renderBoard(doc,instant) {
  const cycles=M.active(doc);
  setHTML(el('board'),`<div class="lanes">${M.ACTIVE.map(key=>{
    const meta=laneCopy[key], rows=cycles.filter(c=>M.phase(c)===key);
    return `<section class="lane" data-lane="${key}" aria-labelledby="lane-${key}">
      <div class="lane-top"><span class="lane-icon" aria-hidden="true">${meta.icon}</span><div><h3 id="lane-${key}">${M.PHASE[key]}</h3><p class="lane-subtitle">${meta.sub}</p></div><span class="lane-count" aria-label="${rows.length} trays">${rows.length}</span></div>
      <div class="lane-drop" data-default="${meta.hint}">${meta.hint}</div>
      ${rows.length?`<div class="lane-cards">${rows.map((c,i)=>card(c,instant,doc,key+'-'+i)).join('')}</div>`:`<div class="lane-empty">${meta.empty}</div>`}
    </section>`;
  }).join('')}</div><div class="board-help"><span>Open a tray to see its history and record a move.<span class="desktop-hint"> You can also drag it to the next stage.</span></span>
  ${button('＋ Add one tray','add','data-focus-key="add-tray-footer"')}</div>`);
}
function entry(row) {
  const when=row.actual?`<time datetime="${esc(row.at)}">${esc(hour.format(new Date(row.at))+' '+M.zoneAt(row.at))}</time>`:
    `<span>${esc(estimateDates(row.window))}</span>`;
  return `<li><button type="button" class="agenda-item" data-action="open" ${trayAttrs(row.c,'agenda-'+row.label+'-'+row.at)}>
    <span aria-hidden="true" class="agenda-marker ${row.actual?'actual':''}">${row.actual?'✓':''}</span>
    <span class="agenda-item-copy"><strong>${esc(row.c.name)}</strong> <span class="agenda-tag">${row.actual?'Actual':row.estimated?'Approx. forecast':'Forecast'}</span><br>
    <span class="agenda-detail">${esc(row.label)} · ${when}</span></span>
  </button></li>`;
}
function renderCalendar(doc,instant) {
  const first=M.weekDay(weekAnchor,weekOffset*7), last=M.weekDay(first,6);
  const today=M.dayKey(instant);
  const title=`${dateShort.format(dateOnly(first))} – ${dateShort.format(dateOnly(last))}, ${last.slice(0,4)}`;
  setHTML(el('calendar'),`<div class="week-header"><div><h3>${esc(title)}</h3><div class="week-legend"><span><span class="agenda-marker actual" aria-hidden="true">✓</span> Actual event</span><span><span class="agenda-marker" aria-hidden="true"></span> Forecast check</span></div></div>
    <div class="pl-actions">${button('‹ Previous','prev','aria-label="Previous week" data-focus-key="prev"')}${button('Today','today','data-focus-key="today"')}${button('Next ›','next','aria-label="Next week" data-focus-key="next"')}</div></div>
    <div class="agenda">${M.agenda(doc,first,instant).map(({key,rows})=>`<section class="agenda-day ${key===today?'today':''}"><h4><time datetime="${key}">${agendaDate.format(dateOnly(key))}</time>${key===today?'<span class="today-tag">Today</span>':''}</h4>
    ${rows.length?`<ul class="agenda-list">${rows.map(entry).join('')}</ul>`:'<p class="agenda-detail">No events</p>'}</section>`).join('')}</div>`);
}
function renderHistory(doc) {
  const rows=doc.cycles.filter(c=>!M.ACTIVE.includes(M.phase(c))).map(c=>({c,e:M.effectiveHistory(c).at(-1)}))
    .sort((a,b)=>Date.parse(b.e.occurredAt)-Date.parse(a.e.occurredAt));
  setHTML(el('history'),rows.length?`<div class="past-list">${rows.map(({c,e})=>`<button type="button" class="past-grow" data-action="open" ${trayAttrs(c,'history')}><strong>${esc(c.name)}</strong><span>${M.PHASE[e.toPhase]}</span>${harvestWeight(c)?`<span>${harvestWeight(c)}</span>`:''}<small>${timestamp(e.occurredAt)}</small></button>`).join('')}</div>`:'<div class="lane-empty">Harvested and ended trays will appear here with their complete history.</div>');
}
function render() {
  if (dragId) return;
  const doc=store.current(), instant=now(), rows=M.digest(doc,instant), count=M.active(doc).length;
  el('daypart').textContent='Good '+M.daypart(instant);
  el('outlook-date').dateTime=M.dayKey(instant);
  el('outlook-date').textContent=dateLong.format(instant);
  setHTML(el('digest'),rows.length?`<ul class="digest-items">${rows.map(({c,p})=>`<li><button type="button" data-action="open" ${trayAttrs(c,'digest')}>
    <strong>${esc(c.name)} · ${esc(flag(p))}</strong><span>${p.estimated?'Approx. ':''}${p.stageLabel} · Day ${p.day}. ${p.status==='tomorrow'?'First suggested check may be tomorrow.':esc(p.cues[0] || 'Inspect the tray before changing stages.')}</span>
  </button></li>`).join('')}</ul>`:
    `<p>${count?'No important stage changes suggested right now. Open a tray to see its timing and notes.':'No trays to check yet. Add one with its actual start time, even if you sowed it days ago.'}</p>`);
  el('active-count').textContent=`${count} active ${count===1?'tray':'trays'}`;
  for (const key of ['board','calendar','history']) {
    el(key).hidden=key!==view;
    document.querySelector(`button[data-action="${key}"]`).setAttribute('aria-pressed',String(key===view));
  }
  if (view==='board') renderBoard(doc,instant);
  if (view==='calendar') renderCalendar(doc,instant);
  if (view==='history') renderHistory(doc);
}
function chooseView(next) {
  if (next==='history') {
    if (view==='history') view=lastLiveView;
    else { lastLiveView=view; view='history'; }
  } else view=next;
  render();
}
function dialogError(message='') {
  const box=el('dialog-error');
  box.hidden=!message;
  box.textContent=message;
  if (message) box.scrollIntoView({block:'nearest'});
}
function showDialog(mode,title,kicker,content,state, origin=null) {
  const wasOpen=dialog.open;
  if (!wasOpen) returnTo=origin||document.activeElement;
  change={mode, expected:store.current().revision,...state};
  dialog.classList.toggle('drawer',mode==='tray');
  dialog.innerHTML=`<div class="dialog-shell">
    <div class="dialog-head"><div><p class="planner-kicker">${esc(kicker)}</p><h2 id="dialog-title" tabindex="-1" autofocus>${esc(title)}</h2></div>
    ${button('×','close','aria-label="Close dialog"','dialog-close')}</div>
    <div class="dialog-scroll" id="dialog-scroll" tabindex="${mode.startsWith('weight')?'0':'-1'}" role="region" aria-label="Dialog content"><div class="dialog-content">
      <p id="dialog-error" class="pl-alert" role="alert" hidden></p>${content}
    </div></div>
  </div>`;
  if (!wasOpen) dialog.showModal();
  focus(el('dialog-title'));
  el('dialog-scroll').scrollTop=0;
}
function cancel() {
  if (busy) return;
  const c=find(change?.trayId);
  if (change?.mode==='weightSetup' && c) openWeight(c,null,change.fromTray);
  else if (change?.fromTray && c) openTray(c,null,change.backFocus);
  else closeDialog();
}
function focusAfter() {
  if (returnTo?.isConnected && returnTo.getClientRects().length) focus(returnTo);
  else if (returnTo?.dataset.tray) focus([...document.querySelectorAll('[data-tray]')].find(n=>
    n.dataset.tray===returnTo.dataset.tray&&n.dataset.action===returnTo.dataset.action&&n.getClientRects().length)||el('add-tray'));
  else focus(el('add-tray'));
  returnTo=null;
}
dialog.addEventListener('keydown',e=>{
  if (e.key!=='Tab') return;
  const targets=[...dialog.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex="0"]')]
    .filter(n=>!n.disabled && n.getClientRects().length && getComputedStyle(n).visibility!=='hidden');
  const first=targets[0], last=targets.at(-1), current=document.activeElement;
  if (e.shiftKey && (current===first||current===el('dialog-title'))) {e.preventDefault();focus(last,false);}
  else if (!e.shiftKey && current===last) {e.preventDefault();focus(first,false);}
});
dialog.addEventListener('cancel',e=>{e.preventDefault();cancel();});
function closeDialog() {
  dialog.close();
  change=null;
  focusAfter();
}
const quarterMinutes=['00','15','30','45'];
const timeOption=(value,label,selected)=>`<option value="${value}"${value===selected?' selected':''}>${label}</option>`;
function timeFields(heading, instant, earliest=-Infinity) {
  const current=new Date(instant);
  const rounded=instant-current.getMinutes()%15*60000-current.getSeconds()*1000-current.getMilliseconds();
  // Keep the existing time when correcting a record, or the current time if
  // the last quarter hour would put a new transition before its preceding stage.
  const initial=rounded<earliest?instant:rounded;
  const [d,t]=M.localInput(initial).split('T');
  const [h,m]=t.split(':');
  const hours=Array.from({length:24},(_,i)=>timeOption(String(i).padStart(2,'0'),`${i%12||12} ${i<12?'AM':'PM'}`,h));
  const minutes=quarterMinutes.includes(m)?quarterMinutes:[...quarterMinutes,m].sort();
  return `<fieldset style="margin:0;border:0;padding:0;min-width:0"><legend>${esc(heading)}</legend><div class="time-fields">
    <label>Date <input type="date" name="date" value="${d}" required></label>
    <label>Hour <select name="hour" required>${hours.join('')}</select></label>
    <label>Minute <select name="minute" data-initial="${initial}" required>${minutes.map(value=>timeOption(value,value,m)).join('')}</select></label>
  </div><label id="fold-picker" hidden>Which occurrence of this local time? <select name="fold"></select></label>
  <p class="pl-help">Use the local time when it happened. Earlier dates are welcome.</p></fieldset>`;
}
const formFooter=(save,back='Cancel')=>`<div class="pl-actions"><button class="pl-button pl-primary" type="submit">${esc(save)}</button>${button(back,'close')}</div>`;
const sameMinute=(at,initial)=>Date.parse(at)===Math.floor(initial/60000)*60000;
function refreshFold() {
  const form=dialog.querySelector('form');
  if (!form?.elements.date) return;
  const {date,hour,minute}=form.elements;
  const localHour=`${date.value}T${hour.value}`;
  const initial=Number(minute.dataset.initial);
  const initialLocal=M.localInput(initial);
  const extra=[...minute.options].find(option=>!quarterMinutes.includes(option.value));
  if (extra) {
    extra.hidden=extra.disabled=localHour!==initialLocal.slice(0,-3);
    if (extra.disabled&&extra.selected) minute.value=quarterMinutes[Math.floor(Number(extra.value)/15)];
  }
  const picker=el('fold-picker'), fold=form.elements.fold;
  const before=fold.value;
  picker.hidden=true;
  fold.innerHTML='';
  try {
    const matching=M.timeOptions(`${localHour}:${minute.value}`);
    if (matching.length<2) return;
    picker.hidden=false;
    fold.innerHTML=matching.map((at,i)=>`<option value="${at}">${i?'Second':'First'} occurrence · ${esc(M.zoneAt(at))}</option>`).join('');
    const preferred=matching.includes(before)?before:matching.find(at=>sameMinute(at,initial));
    if (preferred) fold.value=preferred;
  } catch { /* Invalid local times receive an explicit validation message on submit. */ }
}
function startTray(origin) {
  if (!guidance) { showError(guidanceError||'Crop guidance is loading. Try again in a moment.'); return; }
  const crops=[...window.CropData.crops].sort((a,b)=>a.name.localeCompare(b.name));
  showDialog('create','Add one tray','New germination',`<form>
    <label><span>Crop</span><select name="crop" required><option value="">Choose a crop</option>${crops.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></label>
    <label>Tray name <input name="label" maxlength="80" placeholder="e.g. Broccoli A"></label>
    ${timeFields('Actual germination start',now())}
    <label>Note (optional) <textarea name="note" maxlength="1500" placeholder="Anything you want to remember?"></textarea></label>
    ${formFooter('Save tray')}</form>`,{},origin);
  refreshFold();
}
const cuesList=cues=>cues.length?`<ul class="cues">${cues.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`:'';
const decisionLabels={
  'blackout-recommended':'Short blackout recommended',
  'blackout-optional':'Blackout is optional',
  'direct-light':'Direct to lights recommended'
};
function germinationGuide(decision,heading=decision.nextStep==='direct-light'?'When to move to lights':'When to begin blackout') {
  const {days,window,lookFor,action,nextStep}=decision;
  return `<h3>${heading}</h3>
    <p><strong>${decisionLabels[nextStep]}.</strong> Check about ${esc(M.bandText(days))} after sowing (${esc(estimateDates(window))}).</p>
    <p><strong>Look for:</strong> ${esc(lookFor)}</p>
    <p><strong>When ready:</strong> ${esc(action)}</p>`;
}
function heightGuide(height) {
  if (!height) return '';
  return `<div class="height-guide"><p><strong>${esc(height.label)}: about ${esc(height.height)} tall.</strong></p>
    <p>${esc(height.cue)}</p><p class="pl-help">Measure from the medium surface to the top of a typical shoot, in several spots. ${esc(height.basis)} <a href="crop-calendar-sources.html#heights-at-every-stage">Height sources &amp; limits</a></p></div>`;
}
function stageHeights(p) {
  return `<details class="stage-heights"><summary>Height recommendations for every stage</summary><dl>
    ${p.stageHeights.map(h=>`<dt>${esc({sow:'Sowing',germination:'End of germination',blackout:'End of optional blackout',lights:'Under lights → harvest'}[h.phase])}</dt><dd><strong>About ${esc(h.height)}.</strong> ${esc(h.basis)}</dd>`).join('')}
    </dl><p class="pl-help">Shoot height above the medium, not above the tray rim. Ranges guide inspection; leaf stage, rooting and stem strength decide readiness.</p></details>`;
}
function harvestDetail(p) {
  if (!M.ACTIVE.includes(p.current)) return '';
  if (p.current==='blackout' && !p.window) return '<p>Record the move to lights to start the harvest estimate.</p>';
  if (!p.harvest) return '<p>Harvest estimate unavailable for this method or stage path.</p>';
  const condition=p.current==='lights'?'.':p.harvestMethod.sowDays
    ? ' from sowing. This estimate updates when you record the move to lights.'
    : ' if moved to light near the estimated window.';
  return `<p><strong>Estimated harvest check: ${esc(estimateDates(p.harvest))}</strong>${condition} <span class="pl-help">Method: ${esc(p.harvestMethod.label)} (${esc(p.harvestMethod.source)}).</span></p>`;
}
function chronology(c,p) {
  const rows=[];
  for (const e of p.history) {
    if (e.toPhase==='lights'&&!p.dark && c.cropMethodSnapshot.canBlackout)
      rows.push('<li class="estimate">Optional blackout · skipped</li>');
    const corrected=e.corrections.length?`<details><summary>Correction history (${e.corrections.length})</summary>
      <p>Originally logged as ${timestamp(e.originalOccurredAt)}</p>
      ${e.corrections.map(item=>`<p>Changed to ${timestamp(item.occurredAt)} · recorded ${timestamp(item.recordedAt)}</p>`).join('')}</details>`:'';
    rows.push(`<li><strong>${M.eventLabel(e.toPhase)} · Actual</strong>
      <dl><dt>Happened</dt><dd>${timestamp(e.occurredAt)}</dd></dl>
      ${e.note?`<p class="note-text">${esc(e.note)}</p>`:''}${corrected}
      <div class="timeline-actions">
        ${button('Correct time','correct',`data-event="${esc(e.id)}" aria-label="Correct time: ${M.eventLabel(e.toPhase)}"`,'pl-quiet')}
        <details class="recorded-time"><summary>Recorded time</summary>${timestamp(e.recordedAt)}</details>
      </div>
      </li>`);
  }
  return rows.join('');
}
function harvestSummary(c) {
  const h=c.harvest;
  return `<section class="dialog-section"><h3>Harvest details</h3>
    ${harvestWeight(c)?`<p>Final harvest weight <strong>${harvestWeight(c)}</strong></p>`:''}
    ${h?.note?`<p class="note-text">${esc(h.note)}</p>`:''}
    ${h?.photo?harvestPhoto(h.photo,`Harvest photo for ${c.name}`):''}
    <div class="pl-actions">${button(h?'Edit harvest details':'Add harvest details','harvest')}</div></section>`;
}
function harvestFields(h={}) {
  return `<fieldset class="harvest-fields"><legend>Harvest details (optional)</legend>
    <label>Final harvest weight (g) <input type="number" name="weightG" min="0" step="any" inputmode="decimal" value="${esc(h.weightG)}"></label>
    <label>Harvest notes <textarea name="harvestNote" maxlength="1500">${esc(h.note)}</textarea></label>
    ${h.photo?`${harvestPhoto(h.photo,'Current harvest photo')}
      <label class="harvest-remove"><input type="checkbox" name="removePhoto"> Remove current photo</label>`:''}
    <label>${h.photo?'Replace harvest photo':'Harvest photo'} <input type="file" name="photo" accept="image/*" aria-describedby="harvest-photo-help"></label>
    <p id="harvest-photo-help" class="pl-help">The planner resizes photos and includes them in backups.</p>
    </fieldset>`;
}
function openTray(c,origin=null,backFocus=null) {
  const p=M.projection(c,now(),guidance), live=M.ACTIVE.includes(p.current), decision=p.germinationDecision;
  const elapsedDays=Math.max(0,p.age);
  const hours=Math.round(elapsedDays*240)/10;
  const days=Math.round(elapsedDays*10)/10;
  const dayLabel=hours>0&&days===0?'&lt;0.1 days':`${days} ${days===1?'day':'days'}`;
  const move=(label,dest,primary=false)=>button(label,'transition',`data-to="${dest}"`,primary?'pl-primary':'');
  const preferBlackout=decision?.nextStep==='blackout-recommended';
  const lights=move('Move to lights','lights',!preferBlackout);
  const blackout=p.current==='germination'?move('Begin blackout','blackout',preferBlackout):'';
  const actions=live?`<div class="pl-actions">
    ${p.current==='lights'?move('Mark harvested','harvested',true):preferBlackout?blackout+lights:lights+blackout}
    </div>`:'';
  const notes=M.notes(c);
  showDialog('tray',c.name,`${M.PHASE[p.current]} · Tray ${c.id.slice(0,8)}`,`
    <section class="detail-info">
      ${getCardName(c)?`<p><strong>${esc(getCardName(c))}</strong></p>`:''}
      <p>Germination started ${timestamp(p.started)}.</p>
      ${live?`<p><strong>Day ${p.day}</strong> · ${hours} ${hours===1?'hour':'hours'} (${dayLabel}) since ${p.current==='germination'?'sowing':p.current==='blackout'?'starting blackout':'moving to light'}.</p>`:''}
    </section>
    ${decision?`<section class="dialog-section">${germinationGuide(decision)}${heightGuide(p.height)}${actions}</section>`:actions}
    ${live?`<section class="dialog-section">
    ${decision?'':`<h3>What to look for</h3><p>${esc(currentWindow(p))}</p>${heightGuide(p.height)}${cuesList(p.cues)}`}
    ${harvestDetail(p)}<p class="pl-help">Typical timing. Use what you observe. <a href="crops.html">Crop guide</a> · <a href="quick-start-source-log.html">Timing sources</a></p></section>`:''}
    ${p.current==='harvested'?harvestSummary(c):''}
    <div class="weight-portal">${button((live?'Weight check':'Weight history')+' <span aria-hidden="true">↗</span>','weight','','weight-detail-link')}</div>
    ${stageHeights(p)}
    <section class="dialog-section"><h3>Stage history</h3><ol class="timeline">${chronology(c,p)}</ol></section>
    <section class="dialog-section"><h3>Tray notes</h3>
      ${notes.length?notes.map(e=>`<div><p class="note-text">${esc(e.note)}</p><p class="pl-help">Recorded ${timestamp(e.recordedAt)}</p></div>`).join(''):'<p class="pl-help">No notes yet.</p>'}
      <div class="pl-actions">${button('Add note','note')}</div></section>
    ${live?`<details><summary>More tray actions</summary>${button('End grow','transition','data-to="ended"','danger')}</details>`:''}
    <div class="guide-links"><a href="coir.html">Coir guide ↗</a><a href="grow-log.html">My Grow Log ↗</a></div>
  `,{trayId:c.id},origin);
  if (backFocus) {
    const trigger=[...dialog.querySelectorAll('button')].find(b=>b.dataset.action===backFocus.action &&
      (b.dataset.to||'')===backFocus.to && (b.dataset.event||'')===backFocus.event);
    focus(trigger||el('dialog-title'),false);
  }
}
const track=b=>({action:b.dataset.action,to:b.dataset.to||'',event:b.dataset.event||''});
function openWeight(c,origin=null,fromTray=false) {
  showDialog('weightCheck','Tray weight & watering',c.name+' · Experimental',
    W.content(store.current(),c,now()),{trayId:c.id,fromTray,backFocus:{action:'weight',to:'',event:''}},origin);
  refreshWeightPreview();
}
function openWeightSetup(c) {
  showDialog('weightSetup','Scale setup',c.name,W.setupFields(c),{trayId:c.id,fromTray:change.fromTray});
}
function refreshWeightPreview() {
  const c=change?.mode==='weightCheck'&&find(change.trayId);
  if (!c || !M.ACTIVE.includes(M.phase(c))) return;
  W.renderWeight(el('weight-breakdown'),el('weight-check-form'),el('weight-preview-reading'),store.current(),c,now());
}
function refreshWeightSources(key=null) {
  const c=change&&find(change.trayId);
  if (!c || change.expected!==store.current().revision) return;
  const form=el('weight-setup-form'), source=el('weight-sowing-seed');
  if (form) W.refreshSetup(form,c,key);
  if (source) W.refreshSowingSeed(source,c);
}
function propose(c,to,{source,trigger}) {
  const offer=M.previewTransition(c,to);
  if (!offer.ok) { if (dialog.open) dialogError(offer.reason);else showError(offer.reason); return; }
  const fromTray=source==='drawer', p=M.projection(c,now(),guidance), decision=p.germinationDecision;
  const naming={
    blackout:['Begin blackout','Confirm moved to blackout'],
    lights:['Move to lights','Confirm moved to lights'],
    harvested:['Mark harvested','Confirm harvest'],
    ended:['End grow','Confirm end grow']
  };
  const [title,save]=naming[to];
  const cues=to==='ended'?[]:p.cues;
  const actionText=to==='blackout'?(!decision&&c.cropMethodSnapshot.blackoutUse ||
    'Record when you switched to a loose dark cover without weight.'):to==='lights'?'Record when you removed the cover and moved this tray into light.':
    to==='harvested'?'Record when you actually harvested. The tray and its records will move to History.':'This will retain the tray as Ended in History.';
  const manualBlackout=to==='blackout'&&!c.cropMethodSnapshot.canBlackout;
  const readiness=manualBlackout?`<strong>Before blackout</strong>
    <p>${decision?esc(decision.lookFor):'Begin once shoots have emerged and anchored across most of the tray.'}</p>${decision?'':cuesList(cues)}`:
    decision?germinationGuide(decision,to==='lights'?'Before you uncover':undefined):
      `<strong>${p.window?'Typical readiness window':'Readiness check'}</strong><p>${esc(currentWindow(p))}</p>${cuesList(cues)}`;
  showDialog('transition',`${title}: ${c.name}?`,fromTray?'Record an actual event':'Proposed move',
    `<p>${esc(actionText)}</p><form>
    ${to!=='ended'?`<div class="detail-info">${readiness}
    ${heightGuide(to==='lights'?p.stageHeights.find(h=>h.phase===p.current):p.height)}
    ${p.status==='early'||p.status==='past'?'<p class="pl-help">This phase is outside the typical window now. You can still record the action you took.</p>':'<p class="pl-help">Typical, not a guarantee. Use what you observe.</p>'}</div>`:''}
    ${timeFields('Actual event time',now(),Date.parse(p.entry.occurredAt))}
    ${to==='harvested'?harvestFields():''}
    ${to==='ended'?'<label>Reason (optional) <textarea name="note" maxlength="1500"></textarea></label>':''}
    ${formFooter(save)}</form>`,{trayId:c.id,to,source,fromTray,backFocus:trigger&&track(trigger)},source==='drag'?trigger:null);
  refreshFold();
}
function editTime(c,eventId,b) {
  const event=M.effectiveHistory(c).find(e=>e.id===eventId);
  if (!event) return;
  const instant=Date.parse(event.occurredAt);
  showDialog('correct',`Correct time: ${M.eventLabel(event.toPhase)}`,c.name,`<form>
    <p>Keep this stage and correct when it happened. The old time stays in the correction history.</p>
    ${timeFields('Corrected actual time',instant,instant)}${formFooter('Save correction')}</form>`,
    {trayId:c.id,eventId,fromTray:true,backFocus:track(b)});
  refreshFold();
}
function editNote(c,b) {
  showDialog('note','Add note',c.name,`<form><label>Note <textarea name="note" required maxlength="1500"></textarea></label>${formFooter('Save note')}</form>`,
    {trayId:c.id,fromTray:true,backFocus:track(b)});
}
function editHarvest(c,b) {
  showDialog('harvest','Harvest details',c.name,`<form>${harvestFields(c.harvest)}${formFooter('Save harvest details')}</form>`,
    {trayId:c.id,fromTray:true,backFocus:track(b)});
}
async function resizeHarvestPhoto(file) {
  const url=URL.createObjectURL(file), img=new Image();
  try {
    img.src=url;
    try { await img.decode(); }
    catch { throw new Error('Could not open that photo. Choose a JPEG, PNG, or another supported image.'); }
    const canvas=document.createElement('canvas'), ctx=canvas.getContext('2d');
    for (const [size,quality] of [[800,.76],[640,.68],[440,.62],[280,.55]]) {
      const scale=Math.min(1,size/Math.max(img.naturalWidth,img.naturalHeight));
      canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
      canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
      ctx.fillStyle='#fff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const photo=canvas.toDataURL('image/jpeg',quality);
      if (photo.startsWith('data:image/jpeg;base64,') && photo.length<=M.MAX_PHOTO_LENGTH) return photo;
    }
    throw new Error('Could not resize that photo. Choose a smaller image.');
  } finally { URL.revokeObjectURL(url); }
}
async function submit(event) {
  const form=event.target;
  if (!(form instanceof HTMLFormElement) || !change || busy) return;
  event.preventDefault();
  const state=change, data=new FormData(form), submitButton=form.querySelector('[type=submit]');
  busy=true;submitButton.disabled=true;
  status('');dialogError();
  try {
    let occurredAt=null;
    if (form.elements.date) {
      const local=`${data.get('date')}T${data.get('hour')}:${data.get('minute')}`;
      occurredAt=data.get('fold')||M.localInstant(local);
      const initial=Number(form.elements.minute.dataset.initial);
      if (sameMinute(occurredAt,initial)) occurredAt=new Date(initial).toISOString();
    }
    const note=data.get('note'), input={trayId:state.trayId,expectedRevision:state.expected,occurredAt,note};
    if (form.elements.weightG) {
      const weight=data.get('weightG'), file=data.get('photo');
      const previous=data.has('removePhoto')?null:find(state.trayId)?.harvest?.photo;
      input.harvest={weightG:weight===''?null:Number(weight),note:data.get('harvestNote'),
        photo:file.name?await resizeHarvestPhoto(file):previous};
    }
    const opts={now:now(),id,guidance};
    const updates={
      create:d=>M.createTray(d,{cropId:data.get('crop'),startedAt:occurredAt,name:data.get('label'),note,
        sowingInputs:W.sowingInputs(data.get('crop'),occurredAt)},opts),
      transition:d=>M.confirmTransition(d,{...input,toPhase:state.to,source:state.source},opts),
      correct:d=>M.correctEvent(d,{...input,eventId:state.eventId,seedBasis:W.seedAt(find(state.trayId).cropId,occurredAt)},opts),
      note:d=>M.addNote(d,input,opts),
      harvest:d=>M.saveHarvest(d,input),
      weightSetup:d=>M.saveWeightSetup(d,{...input,setup:W.readSetup(data,find(state.trayId))},opts),
      weightCheck:d=>M.addWeightCheck(d,{...input,check:W.readCheck(data)},opts),
      import:d=>M.importBackup(d,state.backup)
    };
    const before=store.current(), next=await store.commit(state.expected,updates[state.mode]);
    showError();
    warning();
    render();
    status(state.mode==='transition'?M.eventLabel(state.to)+'.':
      state.mode==='weightCheck'?'Weight check saved.':
      state.mode==='import'?'':'Saved.');
    if (state.mode==='import') backupStatus(next===before?'This backup has no new trays to add.':'Planner backup imported.');
    const c=find(state.trayId);
    if (['weightSetup','weightCheck'].includes(state.mode) && c) openWeight(c,null,state.fromTray);
    else if (state.fromTray && c) openTray(c,null,state.mode==='transition'?null:state.backFocus);
    else closeDialog();
  } catch (error) {
    dialogError(error.message);
    render();
  } finally { busy=false; submitButton.disabled=false; }
}
function backupStatus(message) {
  el('backup-status').textContent=message;
  el('backup-status').hidden=!message;
  status(message);
}
function exportBackup() {
  const blob=new Blob([store.exportBackup(now())],{type:'application/json'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;
  a.download=`grow-lab-planner-${M.dayKey(now())}.json`;
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  backupStatus('Planner backup downloaded.');
}
el('backup-file').addEventListener('change',async event=>{
  const file=event.target.files[0];
  event.target.value='';
  if (!file) return;
  backupStatus('');
  try {
    if (file.size>20*1024*1024) throw new Error('Choose a Grow Planner backup under 20 MB.');
    const backup=M.parse(await file.text());
    // Validate the full proposed merge before asking the grower to confirm it.
    const before=store.current(), next=M.importBackup(before,backup);
    const additions=next.cycles.length-before.cycles.length;
    if (!additions) { showError();backupStatus('This backup has no new trays to add.');return; }
    showDialog('import','Import planner backup','Restore trays',`<form><p>Add ${additions} ${additions===1?'tray':'trays'} from this backup. Existing records stay as they are. Identical copies are skipped.</p>${formFooter('Confirm import')}</form>`,
      {backup},document.querySelector('[data-action=import]'));
  } catch (error) { showError(error.message); }
});
document.addEventListener('click',event=>{
  const b=event.target.closest('button[data-action]');
  if (!b || busy) return;
  const action=b.dataset.action, c=find(b.dataset.tray||change?.trayId);
  if (action==='add') startTray(b);
  if (action==='open'&&c) openTray(c,b);
  if (action==='close') cancel();
  if (action==='transition'&&c) propose(c,b.dataset.to,{source:'drawer',trigger:b});
  if (action==='correct'&&c) editTime(c,b.dataset.event,b);
  if (action==='note'&&c) editNote(c,b);
  if (action==='harvest'&&c) editHarvest(c,b);
  if (action==='weight'&&c) openWeight(c,b,dialog.open);
  if (action==='weight-setup'&&c) openWeightSetup(c);
  if (action==='weight-tray'&&c) openTray(c,null,change.backFocus);
  if (action==='weight-seed-load'&&c) W.loadSeed(b.form,c);
  if (['weight-coir-new','weight-coir-old'].includes(action)&&c) W.loadRecipe(b.form,c,action.split('-').at(-1));
  if (['board','calendar','history'].includes(action)) chooseView(action);
  if (['prev','next','today'].includes(action)) {
    if (action==='today') {weekOffset=0;weekAnchor=M.startOfWeek(now());}
    else weekOffset+=action==='next'?1:-1;
    render();
  }
  if (action==='export') exportBackup();
  if (action==='import') el('backup-file').click();
});
dialog.addEventListener('submit',submit);
function onTimeEdit(e) {
  if (['date','hour','minute'].includes(e.target.name)) refreshFold();
  if (e.target.form?.id==='weight-check-form') {
    if (e.target.name==='session') e.target.form.dataset.chosenSession='true';
    refreshWeightPreview();
  }
  if (e.target.id==='weight-preview-reading') refreshWeightPreview();
  if (e.target.form?.id==='weight-setup-form') {
    if (e.target.name==='seedG') e.target.form.dataset.followSeed='false';
    if (['dryG','hydrationG'].includes(e.target.name)) e.target.form.dataset.followCoir='false';
  }
}
dialog.addEventListener('input',onTimeEdit);
dialog.addEventListener('change',onTimeEdit);
const lanes=()=>[...el('board').querySelectorAll('[data-lane]')];
function clearDrag() {
  const wasDragging=!!dragId;
  dragId=null;
  for (const lane of lanes()) {
    lane.classList.remove('valid','invalid','over');
    const tip=lane.querySelector('.lane-drop');
    tip.textContent=tip.dataset.default;
  }
  el('board').querySelector('.dragging')?.classList.remove('dragging');
  if (wasDragging) render();
}
el('board').addEventListener('dragstart',e=>{
  const card=e.target.closest('[data-drag-tray]');
  const c=find(card?.dataset.dragTray);
  if (!c||!dragMedia.matches||!e.dataTransfer) {e.preventDefault();return;}
  dragId=c.id;
  card.classList.add('dragging');
  e.dataTransfer.effectAllowed='move';
  e.dataTransfer.setData('text/plain',c.id);
  for (const lane of lanes()) {
    if (M.previewTransition(c,lane.dataset.lane).ok) lane.classList.add('valid');
  }
});
el('board').addEventListener('dragover',e=>{
  const lane=e.target.closest('[data-lane]'), c=find(dragId);
  if (!lane||!c) return;
  e.preventDefault(); // Also accept the drop gesture on an invalid lane to explain why it is unavailable.
  for (const other of lanes()) if (other!==lane) {
    other.classList.remove('over','invalid');
    const tip=other.querySelector('.lane-drop');tip.textContent=tip.dataset.default;
  }
  const offer=M.previewTransition(c,lane.dataset.lane);
  lane.classList.toggle('over',offer.ok);
  lane.classList.toggle('invalid',!offer.ok);
  e.dataTransfer.dropEffect='move';
  lane.querySelector('.lane-drop').textContent=offer.ok?'Drop to propose move':offer.reason;
});
el('board').addEventListener('dragleave',e=>{
  const lane=e.target.closest('[data-lane]');
  if (!lane||!dragId||lane.contains(e.relatedTarget)) return;
  lane.classList.remove('over','invalid');
  const tip=lane.querySelector('.lane-drop');tip.textContent=tip.dataset.default;
});
el('board').addEventListener('drop',e=>{
  const lane=e.target.closest('[data-lane]'), c=find(dragId);
  if (!lane||!c) return;
  e.preventDefault();
  clearDrag();
  const trigger=[...el('board').querySelectorAll('.tray-open')].find(b=>b.dataset.tray===c.id);
  propose(c,lane.dataset.lane,{source:'drag',trigger});
});
document.addEventListener('dragend',clearDrag);
dragMedia.addEventListener('change',render);
window.addEventListener('storage',e=>{
  if (e.key===S.KEY||e.key===null) {warning();render();status('Planner records refreshed from this browser.');}
  else if (W.sourceKey(e.key)) {render();refreshWeightPreview();}
  refreshWeightSources(e.key);
});
function refresh() {
  if (!weekOffset) weekAnchor=M.startOfWeek(now());
  warning();render();
  if (change?.expected===store.current().revision) refreshWeightPreview();
  refreshWeightSources();
}
document.addEventListener('visibilitychange',()=>{if (!document.hidden) refresh();});
window.addEventListener('pageshow',refresh);
setInterval(refresh,30000);
refresh();
fetch('data/quick-start-growing-guidance.json').then(r=>{if(!r.ok) throw new Error();return r.json();})
  .then(doc=>{
    if(!Array.isArray(doc.crops)) throw new Error();
    guidance=doc;
    const c=change?.mode==='tray' && find(change.trayId);
    if (c && !c.cropMethodSnapshot.germinationDecision && M.projection(c,now(),guidance).germinationDecision) {
      const active=document.activeElement;
      openTray(c,null,active instanceof HTMLButtonElement?track(active):null);
    }
  })
  .catch(()=>{guidanceError='Crop guidance could not load. Reload Grow Planner to add a tray. Saved trays are still available.';showError(guidanceError);});
})();
