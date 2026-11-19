/** Keyboard enhancement for the Recreated gameplay Tools popover. */
export function enhanceToolsKeyboard({document:doc=globalThis.document}={}){
  const toggle=doc?.getElementById('gameToolsToggle'),menu=doc?.getElementById('gameToolsMenu');
  if(!toggle||!menu)return null;
  const items=()=>[...menu.querySelectorAll('button:not([disabled])')];
  toggle.setAttribute('aria-label','Open game tools');
  const onToggle=e=>{
    if(e.key==='ArrowDown'||(e.key==='Enter'&&menu.hidden)){
      e.preventDefault();if(menu.hidden)toggle.click();items()[0]?.focus();
    }
  };
  const onMenu=e=>{
    const all=items();if(!all.length)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();const i=all.indexOf(doc.activeElement);
      all[(i+(e.key==='ArrowDown'?1:-1)+all.length)%all.length].focus();
    }else if(e.key==='Home'){e.preventDefault();all[0].focus()}
    else if(e.key==='End'){e.preventDefault();all.at(-1).focus()}
  };
  toggle.addEventListener('keydown',onToggle);menu.addEventListener('keydown',onMenu);
  return ()=>{toggle.removeEventListener('keydown',onToggle);menu.removeEventListener('keydown',onMenu)};
}
export function announceSaveStatus({document:doc=globalThis.document}={}){
 const status=doc?.getElementById('saveStatus');if(!status)return false;
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 status.setAttribute('aria-atomic','true');return true;
}
