/** Recreated controls help — source component for integration into playable UI. */
export const CONTROL_ROWS = Object.freeze([
  ['Move','W A S D / Arrow keys'],['Attack','Space'],['Echo Pulse','Q'],
  ['Dodge','Shift'],['Return to hub','E'],['Controls','?']
]);
export function mountControlsHelp({document: doc=globalThis.document, container}={}) {
  if (!doc || !container) throw new Error('A document and container are required');
  const trigger=doc.createElement('button');
  trigger.type='button'; trigger.id='controlsHelp';
  trigger.textContent='? Controls';trigger.setAttribute('aria-haspopup','dialog');
  trigger.setAttribute('aria-controls','controlsDialog');
  const dialog=doc.createElement('dialog');
  dialog.id='controlsDialog';dialog.setAttribute('aria-labelledby','controlsTitle');
  const title=doc.createElement('h2');title.id='controlsTitle';title.textContent='Controls';
  const list=doc.createElement('dl');list.className='controls-grid';
  for(const [action,keys] of CONTROL_ROWS){
    const dt=doc.createElement('dt');dt.textContent=action;
    const dd=doc.createElement('dd');dd.textContent=keys;
    list.append(dt,dd);
  }
  const close=doc.createElement('button');close.type='button';close.textContent='Back to game';
  dialog.append(title,list,close);container.append(trigger,dialog);
  const show=()=>{if(!dialog.open){dialog.showModal();close.focus()}};
  const hide=()=>{if(dialog.open)dialog.close()};
  const keydown=e=>{if(e.key==='?'&&!e.repeat&&!['INPUT','TEXTAREA'].includes(doc.activeElement?.tagName)){e.preventDefault();show()}};
  trigger.addEventListener('click',show);close.addEventListener('click',hide);
  doc.addEventListener('keydown',keydown);
  dialog.addEventListener('close',()=>trigger.focus());
  return {trigger,dialog,destroy(){doc.removeEventListener('keydown',keydown);trigger.remove();dialog.remove()}};
}
