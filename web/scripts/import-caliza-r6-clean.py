#!/usr/bin/env python3
"""CALIZA QA: SHA-checked import of owner-supplied commercial reference crops.
The images remain clearly identified as commercial references (not stock/SKUs).
No production API, deployment or external network access.
"""
from pathlib import Path
import hashlib, io, json, zipfile
ROOT=Path(__file__).resolve().parents[2]
PARTS=ROOT/'.qa-media/caliza-r6-clean'
DEST=ROOT/'prototype/assets/img/catalog-r6'
JS=ROOT/'prototype/assets/data/r6-catalog.js'
DOC=ROOT/'docs/CALIZA_R6_CLEAN_CATALOG_PROVENANCE.json'
PART_SHA=[
 '42067dd38195fc3d653b1dc53894a781e722cbf8e74556fec928e89ae1bfe83a',
 'b86ae51a2eed2d6f5f9bca67a4c22e822f790d8a79b7f2d7ca1d29c82f759fd1',
 'b59e3214f36c4569a6ff1e1a450f5185b2e134f9c698b07e2d59a38bf6b4f9bf']
ARCHIVE_SHA='ed8fb6fc1b79334c91826e8de45b3348c8dc194d4d354ef1fcc2abe8f76237e1'
def sha(buf):return hashlib.sha256(buf).hexdigest()
blob=b''
for i,expected in enumerate(PART_SHA):
 p=PARTS/f'chunk_{i:02d}.bin'
 if not p.is_file():raise SystemExit('Missing sealed shard: '+str(p))
 b=p.read_bytes()
 if sha(b)!=expected:raise SystemExit('Shard checksum mismatch')
 blob+=b
if sha(blob)!=ARCHIVE_SHA:raise SystemExit('Archive checksum mismatch')
pre='CALIZA_R6_CATALOGO_LIMPIO_QA/'
with zipfile.ZipFile(io.BytesIO(blob)) as z:
 manifest=json.loads(z.read(pre+'manifest.json'))
 records=manifest.get('items',[])
 if manifest.get('count')!=41 or len(records)!=41:raise SystemExit('Expected 41 records')
 out=[]
 DEST.mkdir(parents=True,exist_ok=True)
 for row in records:
  key=row.get('id','')
  group=row.get('group')
  if not key.startswith('caliza-r6-') or group not in ('mesas-auxiliares','mesas-comedor-piedra','mesas-comedor-hierro','mesas-comedor-madera','sillas-hogar','sillas-comerciales'):raise SystemExit('Invalid product family/id')
  widths={}
  if len(row.get('variants',[]))!=2:raise SystemExit('Expected two responsive variants')
  for v in row['variants']:
   path=v['path']
   if not path.startswith('media/') or '/' in path[6:] or not path.endswith('.webp'):raise SystemExit('Unsafe path')
   b=z.read(pre+path)
   if sha(b)!=v['sha256'] or len(b)!=v['bytes']:raise SystemExit('Source integrity failure: '+path)
   dest=DEST/Path(path).name
   dest.write_bytes(b)
   width=640 if '-640.webp' in dest.name else 1280 if '-1280.webp' in dest.name else 0
   if not width:raise SystemExit('Unexpected derivative dimension')
   widths[width]='catalog-r6/'+dest.name
  if set(widths)!={640,1280}:raise SystemExit('Missing width')
  out.append({'id':key,'group':group,'source':row['source'],'kind':'sale_sheet_crop_reference','src':widths[1280],'src640':widths[640],'review':'QA_REFERENCE_ONLY_NO_VERIFIED_SKU_OR_PRICE'})
 JS.parent.mkdir(parents=True,exist_ok=True)
 JS.write_text('/* CALIZA cleaned commercial source crops. NOT verified products, prices, or stock. */\nwindow.CALIZA_R6_CATALOG = Object.freeze('+json.dumps(out,ensure_ascii=False,separators=(',',':'))+');\n',encoding='utf-8')
 DOC.write_text(json.dumps({'archive_sha256':ARCHIVE_SHA,'count':41,'responsive_derivatives':82,'publication_review':'QA_REFERENCE_ONLY','records':out},ensure_ascii=False,indent=2),encoding='utf-8')
 print('Validated',len(out),'commercial reference crops; saved',len(out)*2,'WebP derivatives.')
