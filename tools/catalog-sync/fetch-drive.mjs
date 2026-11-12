#!/usr/bin/env node
// Optional read-only Google Sheets pull. Requires an OAuth access token supplied
// by the operator via environment; never prints or writes the token.
import { writeFile } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'
import { SPREADSHEET_ID, TABS } from './contract.mjs'

const token = process.env.CALIZA_GOOGLE_ACCESS_TOKEN
const i=process.argv.indexOf('--out');const output=i>=0?process.argv[i+1]:null
if(!token||!output||!isAbsolute(output)){console.error('Requiere CALIZA_GOOGLE_ACCESS_TOKEN y --out /ruta/absoluta/temporal/snapshot.json');process.exit(64)}
const api = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet`)
for (const t of TABS) api.searchParams.append('ranges', `'${t}'!A1:Z500`)
api.searchParams.set('valueRenderOption','UNFORMATTED_VALUE')
try {
  const response=await fetch(api,{headers:{Authorization:`Bearer ${token}`}})
  if (!response.ok) throw Error(`Google Sheets HTTP ${response.status}; comprueba acceso de solo lectura`)
  const payload=await response.json()
  const tabs=Object.fromEntries(TABS.map((name,i)=>[name,payload.valueRanges?.[i]?.values||[]]))
  await writeFile(resolve(output),JSON.stringify({spreadsheetId:SPREADSHEET_ID,tabs},null,2)+'\n',{mode:0o600,flag:'wx'})
  console.log('Snapshot temporal descargado; no se ha publicado ni modificado la hoja.')
} catch(e){console.error(e.message);process.exit(1)}
