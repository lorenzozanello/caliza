#!/usr/bin/env python3
"""Deterministic QA importer of the user-authorized 140 CALIZA source records.

Input: 9 SHA-pinned Git blobs, a ZIP of editorial WebP derivatives (NO raw originals).
Output: optimized /prototype assets + safe browser manifest. Production is NOT targeted here.
"""
import hashlib, io, json, pathlib, shutil, sys, zipfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
PARTS = ROOT / ".qa-media/caliza-r6"
DEST = ROOT / "prototype/assets/img/editorial-r6"
DATA = ROOT / "prototype/assets/data/r6-gallery.js"
DOC = ROOT / "docs/CALIZA_R6_REAL_ARCHIVE_PROVENANCE.json"
EXPECTED_ZIP_SHA256 = "73bf30ee67b80e8f2f36a03cf7534fbacb6cf1e64e945c81138d434a93e1dca6"
PART_HASHES = [
 "4db8caf43005026c313f3397f093748dfc8f9ba378554a4b450ead89b7c7ad83",
 "95280e17d620b718daafd0c36da8611c945e99281b4c7dfa387c4ecd7ac4f880",
 "0d51449840b7f079ba9cdf7e73d2f2c72e37210da32397c51dc0f4b8e7657c5d",
 "4e2f68f0eddd51f2971bab974620750f4927be7805346efb2cd411aff2829333",
 "6357c70ba2dcc4fee811ed1cad290f6a5e05b9f2f18c959e12df91ec58186f6a",
 "616d12d30c5e4ff084b33391c635f30b4dfe23f8b6d55800ebbb7d143a0eb947",
 "b583ec2ab073998eddc98612f395ddadd472165cac132db65c6847575278a01c",
 "5db479a8971056edfe35e36b916cf61bc6ef7586c85ddef95924bf0ffa89fc3d",
 "32e0f9c1fef54a515d9fcba840681590c54a3370d6918c22563e1c19c306c7db",
]
def digest(b): return hashlib.sha256(b).hexdigest()
def die(msg): raise SystemExit(msg)
parts = []
for idx, checksum in enumerate(PART_HASHES):
    file = PARTS / f"chunk_{idx:02d}.bin"
    if not file.is_file(): die("Missing expected shard: " + str(file))
    b = file.read_bytes()
    if digest(b) != checksum: die(f"Shard hash failed {idx}")
    parts.append(b)
archive = b"".join(parts)
if digest(archive) != EXPECTED_ZIP_SHA256: die("Combined archive SHA256 mismatch")
prefix = "CALIZA_R6_ARCHIVO_COMPLETO_QA/"
with zipfile.ZipFile(io.BytesIO(archive)) as z:
    manifest = json.loads(z.read(prefix+"manifest.json"))
    records = manifest.get("records", [])
    if len(records) != 140 or manifest.get("processed") != 140 or manifest.get("errors"):
        die("The curated archive did not pass the 140-record completeness gate")
    if sum(r["kind"]=="sale_sheet_reference" for r in records) != 41:
        die("Wrong number of commercial references")
    if sum(r["kind"]=="authentic_photo" for r in records) != 99:
        die("Wrong number of source photographs")
    DEST.mkdir(parents=True, exist_ok=True)
    entries = []
    seen = set()
    for r in records:
        group = r["group"]
        if group not in ("cocinas", "lavamanos", "mesas-auxiliares", "mesas-comedor-piedra",
                         "mesas-comedor-hierro", "mesas-comedor-madera", "sillas-hogar", "sillas-comerciales"):
            die("Unexpected category")
        if len(r.get("variants", [])) != 2: die("Invalid derivative count")
        variants = {}
        for v in r["variants"]:
            src = v["path"]
            if not src.startswith("media/caliza-r6-") or "/" in src[6:] or not src.endswith(".webp"):
                die("Invalid derivative path "+src)
            data = z.read(prefix+src)
            if digest(data) != v["sha256"]: die("Derivative SHA mismatch: "+src)
            outfile = DEST / pathlib.PurePosixPath(src).name
            outfile.write_bytes(data)
            width = int(pathlib.PurePosixPath(src).stem.split("-")[-1])
            variants[width] = "editorial-r6/"+outfile.name
        if set(variants) != {640,1280}: die("Wrong responsive widths")
        unique = r["source_sha256"] not in seen
        seen.add(r["source_sha256"])
        entries.append({
            "id":r["asset"],"group":group,"original":r["source"],
            "kind":r["kind"],"duplicate":not unique,
            "src":variants[1280],"src640":variants[640],
            "review":"REFERENCE_ONLY_NO_STOCK_OR_PRICE" if r["kind"]=="sale_sheet_reference"
              else "REAL_ARCHIVE_NO_VERIFIED_PROJECT_METADATA"
        })
    print("Checked",len(entries),"records;",len(seen),"source-hash-unique;",len(entries)*2,"derivatives")
DATA.parent.mkdir(parents=True, exist_ok=True)
DATA.write_text("/* Original CALIZA source imagery, QA; sale-sheet excerpts are references only. */\n"
                "window.CALIZA_R6_ARCHIVE = Object.freeze("+json.dumps(entries,ensure_ascii=False,separators=(",",":"))+");\n",encoding="utf-8")
DOC.write_text(json.dumps({"archive_sha256":EXPECTED_ZIP_SHA256,"source_count":140,
                           "photo_records":99,"sale_reference_records":41,
                           "source_duplicates":sum(e["duplicate"] for e in entries),
                           "derivative_count":280,"records":entries},ensure_ascii=False,indent=2),encoding="utf-8")
