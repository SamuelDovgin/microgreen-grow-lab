(function (root) {
'use strict';
const M=typeof module==='object'?require('./grow-planner-model.js'):root.GrowPlannerModel;
const KEY='grow-lab:planner:v1';
const CONFLICT='Planner changed in another tab. Nothing from this action was saved. Review the refreshed tray and try again.';
function open({storage,lock=fn=>fn()}) {
  let doc=M.empty(), baseline=null, readable=false, issue='';
  function refresh() {
    try {
      const raw=storage.getItem(KEY);
      if (!readable || raw!==baseline) {
        doc=raw===null?M.empty():M.parse(raw);
        baseline=raw;
      }
      readable=true;
      issue='';
    } catch {
      readable=false;
      issue='Could not read saved planner data. Changes are paused. You can export the last readable copy, if available.';
    }
    return {doc,issue};
  }
  refresh();
  async function commit(expectedRevision, mutate) {
    // Web Locks serializes same-origin tabs when available. Raw comparison also
    // detects stale reads and older/non-cooperating tabs before touching storage.
    return lock(()=>{
      if (!readable) throw new Error(issue);
      const expectedRaw=baseline;
      function recheck() {
        let raw;
        try { raw=storage.getItem(KEY); }
        catch { throw new Error('Could not read browser storage. Nothing was saved. Export a backup before closing this page.'); }
        if (raw!==expectedRaw) { refresh(); throw new Error(CONFLICT); }
      }
      recheck();
      if (expectedRevision!==doc.revision) throw new Error(CONFLICT);
      const next=mutate(doc);
      if (next===doc) return doc;
      M.validate(next);
      const raw=JSON.stringify(next);
      recheck();
      try { storage.setItem(KEY,raw); }
      catch { throw new Error('Browser storage could not save this change. The previous records are unchanged. Export a backup before closing this page.'); }
      doc=next;
      baseline=raw;
      return doc;
    });
  }
  return {refresh,commit,current:()=>doc,exportBackup:now=>JSON.stringify({...doc,exportedAt:new Date(now).toISOString()},null,2)};
}
const api={open,KEY};
if (typeof module==='object') module.exports=api; else root.GrowPlannerStore=api;
})(typeof window==='undefined'?globalThis:window);
