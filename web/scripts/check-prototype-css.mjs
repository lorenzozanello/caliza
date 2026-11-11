import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..')
const parts=['option08.css','experience.css','identity.css','authority-tokens.css','marketing.css','boutique-v2.css']
const header='/* CALIZA GROUP / CSS unificado. NO EDITAR DIRECTAMENTE.\n   Fuentes: option08, experience, identity, authority-tokens, marketing, boutique-v2.\n   Regenerar con: node web/scripts/check-prototype-css.mjs --write */\n'
const desired=header+parts.map(n=>'/* BEGIN '+n+' */\n'+fs.readFileSync(path.join(root,'prototype/assets/css',n),'utf8')+'\n/* END '+n+' */\n').join('')
const dest=path.join(root,'prototype/assets/css/site-bundle.css')
if(process.argv.includes('--write')){
  fs.writeFileSync(dest,desired,'utf8')
  console.log('CALIZA CSS bundle updated:',Buffer.byteLength(desired),'bytes')
}else{
  if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8')!==desired) {
    console.error('CALIZA CSS bundle stale: run node web/scripts/check-prototype-css.mjs --write')
    process.exitCode=1
  } else console.log('CALIZA CSS bundle is consistent')
}
