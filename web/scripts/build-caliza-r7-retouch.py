#!/usr/bin/env python3
"""QA-only: crop 27 former hold images from verified R6 WebP derivatives.
No generative pixels or invented project data. Do not deploy directly.
"""
from pathlib import Path
from PIL import Image,ImageOps,ImageEnhance
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'prototype/assets/img/catalog-r6'
DEST=ROOT/'prototype/assets/img/catalog-r7'
MANIFEST=ROOT/'docs/CALIZA_R7_CATALOG_PROVENANCE.json'
JS=ROOT/'prototype/assets/data/r7-catalog.js'
BOXES={6:[.015,.46,.995,.76],7:[.055,.34,.96,.8],8:[.01,.55,.99,.83],9:[.2,.06,.73,.91],
14:[.08,.14,.94,.97],21:[.02,.4,.97,.84],31:[.19,.08,.73,.94],33:[.02,.61,.97,.9],
38:[.18,.06,.74,.94],40:[.09,.17,.94,.94],41:[.02,.35,.98,.87],43:[.18,.08,.75,.94],
45:[.01,.2,.99,.69],54:[.42,.13,.97,.89],56:[.45,.18,.98,.91],57:[.18,.07,.75,.95],
58:[.04,.13,.96,.81],60:[.03,.14,.97,.83],62:[.09,.16,.94,.96],63:[.02,.43,.97,.87],
65:[.02,.18,.98,.7],78:[.17,.06,.66,.95],80:[.18,.07,.72,.86],83:[.02,.59,.98,.87],
85:[.09,.13,.96,.95],92:[.01,.44,.99,.81],94:[.11,.16,.94,.95]}
def sha(b):return hashlib.sha256(b).hexdigest()
assert len(BOXES)==27
DEST.mkdir(parents=True,exist_ok=True)
out=[]
for n,coords in sorted(BOXES.items()):
 key=f'caliza-r6-{n:03d}'
 src=SOURCE/f'{key}-clean-1280.webp'
 if not src.is_file():raise SystemExit('Missing tracked R6 original derivative: '+str(src))
 raw=src.read_bytes()
 im=Image.open(src).convert('RGB')
 w,h=im.size
 if w!=1536 or h!=1280:raise SystemExit('Unexpected original size for '+key)
 a,b,c,d=coords
 if not 0<=a<c<=1 or not 0<=b<d<=1:raise SystemExit('Invalid crop')
 photo=im.crop((round(a*w),round(b*h),round(c*w),round(d*h)))
 photo=ImageEnhance.Color(photo).enhance(.985)
 variants={}
 hashes={}
 for size in (640,1280):
  canvas=Image.new('RGB',(round(size*1.18),size),'#eee9e1')
  fit=ImageOps.contain(photo,(canvas.width-24,canvas.height-24),Image.Resampling.LANCZOS)
  canvas.paste(fit,((canvas.width-fit.width)//2,(canvas.height-fit.height)//2))
  dest=DEST/f'{key}-r7-{size}.webp'
  canvas.save(dest,format='WEBP',quality=87,method=4)
  variants[size]='catalog-r7/'+dest.name
  hashes[size]=sha(dest.read_bytes())
 is_detail=n in (6,7,8,21,33,41,45,54,56,58,60,63,65,83,92)
 out.append({'id':key,'src':variants[1280],'src640':variants[640],
  'crop_box':coords,'source_sha256':sha(raw),
  'derived_sha256':hashes,'kind':'SALE_SHEET_DETAIL' if is_detail else 'SALE_SHEET_PRODUCT_CROP',
  'review':'NO_STOCK_PRICE_OR_SKU_CLAIMS'})
if len(out)!=27 or len(list(DEST.glob('*.webp')))!=54:raise SystemExit('Output completeness error')
JS.write_text('/* Source-faithful R7 art direction; catalog references, not stock or SKU. */\nwindow.CALIZA_R7_CATALOG = Object.freeze('+json.dumps(out,ensure_ascii=False,separators=(',',':'))+');\n',encoding='utf-8')
MANIFEST.write_text(json.dumps({'records':27,'derivatives':54,'source':'R6 verified clean references','no_product_pixel_generation':True,'items':out},ensure_ascii=False,indent=2),encoding='utf-8')
print('CALIZA R7: 27 retained references reprocessed into 54 source-faithful WebP versions.')
