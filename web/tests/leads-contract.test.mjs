import assert from 'node:assert/strict'
import test from 'node:test'
import { prepareLeadRow, LEAD_COLUMNS } from '../src/lib/leads/contract.ts'
const server={id:'11111111-2222-4333-8444-555555555555',timestamp:'2026-11-11T21:00:00.000Z',approvedPolicyVersion:'CALIZA-PRIV-V1.0'}
const draft={name:'Ana',email:'ana@example.org',line:'Living Design',family:'mesas-auxiliares',sourceRoute:'/contacto',message:'Interesada en una mesa auxiliar para mi sala.',privacyAccepted:true}
test('QA no crea fila de leads si no se ha aprobado la política',()=>{
 assert.deepEqual(prepareLeadRow(draft,{...server,approvedPolicyVersion:undefined}),{ok:false,code:'POLICY_NOT_APPROVED'})
 assert.deepEqual(prepareLeadRow({...draft,privacyAccepted:false},server),{ok:false,code:'CONSENT_REQUIRED'})
})
test('Contrato mínimo sólo después de consentimiento; ninguna escritura real',()=>{
 const v=prepareLeadRow(draft,server)
 assert.equal(v.ok,true)
 if(v.ok){ assert.equal(v.columns.length,13);assert.equal(v.row.length,LEAD_COLUMNS.length);assert.equal(v.row[2],'Living Design');assert.equal(v.row[12],'nuevo');}
})
test('Google Sheets: CSV/Excel no interpretará como fórmula valores declarados',()=>{
 const v=prepareLeadRow({...draft,name:'=IMPORTXML(1,2)',city:'-Barranquilla'},server)
 assert.equal(v.ok,true)
 if(v.ok){ assert.equal(v.row[5],"'=IMPORTXML(1,2)");assert.equal(v.row[8],"' -Barranquilla".replace("' ","'")); }
})
test('rechaza contacto inválido y ausencia de mensaje',()=>{
 assert.equal(prepareLeadRow({...draft,email:'invalido'},server).ok,false)
 assert.equal(prepareLeadRow({...draft,message:'   '},server).ok,false)
})
