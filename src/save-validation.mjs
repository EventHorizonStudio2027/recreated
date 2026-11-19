// Recreated save validation — shared source module (Node + future browser integration).
// The playable v1.8 HTML currently contains an equivalent inline validator.
// This module is not yet wired into the playable build.
export const RELICS = Object.freeze(['Ember','Tide','Gale']);
export function isValidSave(data, width=900, height=600) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const p=data.player, w=data.world;
  if (!p || typeof p!=='object' || Array.isArray(p) || !w || typeof w!=='object' || Array.isArray(w)) return false;
  return Number.isInteger(p.level) && p.level>=1 && p.level<=99
    && Number.isFinite(p.max) && p.max>0 && p.max<=9999
    && Number.isFinite(p.hp) && p.hp>=0 && p.hp<=p.max
    && Number.isFinite(p.x) && p.x>=0 && p.x<=width
    && Number.isFinite(p.y) && p.y>=0 && p.y<=height
    && Number.isFinite(p.xp) && p.xp>=0
    && Number.isFinite(p.echoes) && p.echoes>=0
    && Number.isInteger(w.version) && w.version>=1 && w.version<=999
    && [1,1.25].includes(w.enemyHp) && typeof w.storm==='boolean'
    && (!p.relics || (Array.isArray(p.relics) && p.relics.length<=3
       && new Set(p.relics).size===p.relics.length
       && p.relics.every(r=>RELICS.includes(r))));
}
