// Portable save format helpers for Recreated.
// Pure logic: browser download/upload UI lives in the playable build.
import {isValidSave} from './save-validation.mjs';
export const SAVE_KEY='recreated-playable-v2';
export const MAX_IMPORT_BYTES=1024*1024;
export function parsePortableSave(raw){
  if(typeof raw!=='string'||raw.length>MAX_IMPORT_BYTES)throw new Error('Invalid file size');
  let data;
  try{data=JSON.parse(raw)}catch{throw new Error('Invalid JSON')}
  if(!isValidSave(data))throw new Error('Invalid save data');
  return data;
}
export function serializePortableSave(data){
  if(!isValidSave(data))throw new Error('Invalid save data');
  return JSON.stringify(data,null,2);
}
export function prepareImport(raw,previousRaw){
  const next=serializePortableSave(parsePortableSave(raw));
  let backup=null;
  try{if(previousRaw)backup=serializePortableSave(parsePortableSave(previousRaw))}catch{}
  return {next,backup};
}
