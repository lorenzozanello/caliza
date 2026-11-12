#!/usr/bin/env node
import { access, readFile, writeFile } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'
import { buildRelease, compareRelease } from './lib.mjs'

const args = process.argv.slice(2)
function flag(name) { const i=args.indexOf(name); return i >= 0 ? args[i+1] : null }
const input = flag('--input')
const output = flag('--out')
const reportPath = flag('--report')
const previousPath = flag('--baseline')
if (!input || !output || !reportPath || !args.includes('--dry-run')) {
  console.error('Uso: node cli.mjs --input snapshot.json --out release.json --report report.json --dry-run [--baseline release.json]')
  process.exit(64)
}
try {
  if (![input,output,reportPath].every(isAbsolute)) throw Error('Usa rutas absolutas; los snapshots deben guardarse fuera del repositorio.')
  for(const target of [output,reportPath]) {
    try { await access(resolve(target)); throw Error(`La ruta ya existe; no se sobrescribe: ${target}`) }
    catch(e) { if(e.code!=='ENOENT') throw e }
  }
  const snapshot=JSON.parse(await readFile(resolve(input),'utf8'))
  const result=buildRelease(snapshot,{spreadsheetId:snapshot.spreadsheetId})
  const previous=previousPath ? JSON.parse(await readFile(resolve(previousPath),'utf8')) : null
  const diff=result.release ? compareRelease(previous,result.release) : null
  if (diff && Object.values(diff).some(x=>x.removed.length)) result.report.errors.push({code:'REMOVAL_BLOCKED',id:'release',message:'El cambio elimina entidades publicadas; requiere procedimiento de archivo explícito, no sincronización automática'})
  result.report.diff=diff
  await writeFile(resolve(reportPath),JSON.stringify(result.report,null,2)+'\n',{flag:'wx',mode:0o600})
  if (!result.ok || result.report.errors.length) { console.error('BLOQUEADO: revisar informe de errores; ninguna versión pública generada.'); process.exit(2) }
  await writeFile(resolve(output),JSON.stringify(result.release,null,2)+'\n',{flag:'wx',mode:0o600})
  console.log(`VALIDADO: ${result.report.ready} entidades. Se generó propuesta de contenido, no se publicó ni modificó la base de datos.`)
} catch(e) { console.error('Error de lectura/validación: '+e.message); process.exit(1) }
