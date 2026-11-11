"""One-time font outline exporter for portable logo SVGs.

Run with two downloaded OFL font files:
python3 brand/identity/scripts/extract-glyphs.py playfair.ttf montserrat.ttf

No font binary is needed at runtime: the audited glyph outlines are committed.
"""
import json
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont


def read_glyphs(font_path: str):
    font = TTFont(font_path)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font['hmtx'].metrics
    alphabet = ' ABCDEGILNOPRSTUVZ'
    glyphs = {}
    for ch in alphabet:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyph_set)
        glyph_set[name].draw(pen)
        glyphs[ch] = {'advance': hmtx[name][0], 'path': pen.getCommands()}
    return {'unitsPerEm': font['head'].unitsPerEm, 'glyphs': glyphs}


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    data = {'playfair': read_glyphs(sys.argv[1]), 'montserrat': read_glyphs(sys.argv[2])}
    target = Path(__file__).resolve().parents[1] / 'glyphs.json'
    target.write_text(json.dumps(data, separators=(',', ':'), ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Wrote {target}')
