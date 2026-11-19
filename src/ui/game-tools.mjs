/** Compact gameplay tools menu. The offline v2.1 HTML embeds equivalent code. */
export function mountGameTools({document:doc=globalThis.document,header}={}){
  if(!doc||!header)throw new Error('Document and header required');
  const controls=['backupSave','restoreSave','controlsHelp'].map(id=>doc.getElementById(id)).filter(Boolean);
  if(!controls.length)return null;
  const wrapper=doc.createElement('div');wrapper.className='game-utility-menu';
  const toggle=doc.createElement('button');toggle.id='gameToolsToggle';toggle.type='button';toggle.textContent='Tools ▾';
  toggle.setAttribute('aria-controls','gameToolsMenu');toggle.setAttribute('aria-expanded','false');
  const menu=doc.createElement('div');menu.id='gameToolsMenu';menu.className='game-utility-popover';menu.hidden=true;
  for(const control of controls)menu.append(control);
  wrapper.append(toggle,menu);
  const save=doc.getElementById('saveNow');
  if(save)save.after(wrapper);else header.append(wrapper);
  const setOpen=open=>{menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open))};
  const onToggle=()=>setOpen(menu.hidden);
  const onMenu=e=>{if(e.target.closest('button'))setOpen(false)};
  const onOutside=e=>{if(!wrapper.contains(e.target))setOpen(false)};
  const onKey=e=>{if(e.key==='Escape'&&!menu.hidden){setOpen(false);toggle.focus()}};
  toggle.addEventListener('click',onToggle);menu.addEventListener('click',onMenu);
  doc.addEventListener('click',onOutside);doc.addEventListener('keydown',onKey);
  return {wrapper,toggle,menu,destroy(){toggle.removeEventListener('click',onToggle);menu.removeEventListener('click',onMenu);doc.removeEventListener('click',onOutside);doc.removeEventListener('keydown',onKey);wrapper.remove()}};
}
