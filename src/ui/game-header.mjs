/** Recreated game-header accessibility and storage availability.
 * Integrate with the playable HTML as the project moves to modular source.
 */
export function initializeGameHeader({doc=globalThis.document,storage=globalThis.localStorage}={}){
 if(!doc)throw new Error('Document required');
 const region=doc.getElementById('regionLabel');
 const stats=doc.getElementById('gameStats');
 const status=doc.getElementById('saveStatus');
 if(region){region.setAttribute('aria-label','Current game region');region.setAttribute('aria-live','polite')}
 if(stats)stats.setAttribute('aria-label','Player progression and expedition status');
 let available=false;
 try{
  if(storage){const key='__recreated_storage_probe__';storage.setItem(key,'1');storage.removeItem(key);available=true}
 }catch{}
 if(!available&&status){status.textContent='Save unavailable';status.dataset.state='saveunavailable'}
 return {storageAvailable:available};
}
export function releaseMovementOnBlur({win=globalThis.window}={}){
 if(!win)return ()=>{};
 const handler=()=>{for(const key of ['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift',' ']){
  win.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}));
 }};
 win.addEventListener('blur',handler);
 return ()=>win.removeEventListener('blur',handler);
}
