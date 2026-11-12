#!/usr/bin/env python3
"""CALIZA: transform authorized originals into editorial web assets. No generative edits."""
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
import json, hashlib
ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "media-source" / "caliza"
DEST = ROOT / "prototype" / "assets" / "img" / "approved"
MANIFEST = SRC / "source-manifest.json"
OUTPUT_META = ROOT / "docs" / "CALIZA_REAL_MEDIA_PROVENANCE.json"
APPROVED_JS = ROOT / "prototype" / "assets" / "data" / "approved-media.js"
WIDTHS = [320, 480, 640, 960, 1280, 1600]
# Editorial gate: do not expose source sell-sheets containing printed prices as clean catalog photography.
# Other product families stay conceptual until verified price-free editorial crops are generated.
family_key = {
    "lavamanos": "basin-main"
}
def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()
data = json.loads(MANIFEST.read_text("utf-8"))
DEST.mkdir(parents=True, exist_ok=True)
OUTPUT_META.parent.mkdir(parents=True, exist_ok=True)
processed = {}
for rec in data["entries"]:
    key = rec["key"]
    source = SRC / rec["source"]
    if not source.is_file() or not source.name.lower().endswith((".png", ".jpg", ".jpeg")):
        raise RuntimeError("Missing authorized photographic source " + key)
    im = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    if rec["crop"]:
        x0,y0,x1,y1 = rec["crop"]
        if not (0 <= x0 < x1 <= im.width and 0 <= y0 < y1 <= im.height):
            raise RuntimeError("Invalid crop " + key)
        im = im.crop(tuple(rec["crop"]))
    # Minimal photometric treatment, respecting the real color and shape of natural stone.
    im = ImageEnhance.Contrast(im).enhance(1.025)
    im = ImageEnhance.Color(im).enhance(.96)
    warm = Image.new("RGB", im.size, (247, 238, 228))
    im = Image.blend(im, warm, .013)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=55, threshold=3))
    candidates = sorted(set([w for w in WIDTHS if w <= im.width] + [im.width]))
    derivatives = []
    for width in candidates:
        scaled = im if width == im.width else im.resize((width, round(im.height*width/im.width)), Image.Resampling.LANCZOS)
        for ext, quality in [("webp", 79), ("avif", 57)]:
            path = DEST / (key + "-" + str(width) + "." + ext)
            scaled.save(path, format=ext.upper(), quality=quality)
            derivatives.append({"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size, "sha256": sha(path), "width": width, "height": scaled.height})
    main = [x for x in derivatives if x["path"].endswith(".webp")][-1]
    processed[key] = {
        "alt": rec["alt"],
        "medio_id": rec["medio_id"],
        "drive_id": rec["drive_id"],
        "group": rec["group"],
        "source_sha256": sha(source),
        "crop": rec["crop"],
        "src": str(Path(main["path"]).relative_to("prototype/assets/img")),
        "widths": candidates,
        "aspectRatio": round(im.width/im.height, 5),
        "derivatives": derivatives
    }
approved = {slug:{k: processed[key][k] for k in ["src","alt","medio_id","widths","aspectRatio"]} for slug,key in family_key.items()}
archive = {key:{k:processed[key][k] for k in ["src","alt","medio_id","widths","aspectRatio","group"]} for key in processed}
APPROVED_JS.write_text(
    "/* Medios auténticos de CALIZA, autorizados expresamente por titular el 11-11-2026. */\n"
    "window.CALIZA_APPROVED_MEDIA = Object.freeze(" + json.dumps(approved, ensure_ascii=False, separators=(",",":")) + ");\n"
    "window.CALIZA_REAL_ARCHIVE = Object.freeze(" + json.dumps(archive, ensure_ascii=False, separators=(",",":")) + ");\n", encoding="utf-8")
OUTPUT_META.write_text(json.dumps({
    "source_folder_id": data["source_folder_id"],
    "authorization": data["owner_authorization"],
    "total_sources": len(processed),
    "total_derivatives": sum(len(v["derivatives"]) for v in processed.values()),
    "entries": processed
}, ensure_ascii=False, indent=2)+"\n",encoding="utf-8")
print("CALIZA_REAL_MEDIA_OK", len(processed), sum(len(x["derivatives"]) for x in processed.values()))
