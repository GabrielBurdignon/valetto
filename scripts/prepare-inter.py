"""Build-time authoring utility, not run by Next or required in production.
Uses installed fontTools and Node's built-in Brotli; no project dependency added.
"""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import sys
import types

# fontTools delegates WOFF2's Brotli stream to Node's standard library here.
brotli = types.ModuleType('brotli')
brotli.MODE_FONT = 2
brotli.MODE_TEXT = 1

def transform(data, compress=False, mode=2):
    code = ("const z=require('node:zlib'),f=require('node:fs'),b=f.readFileSync(0);"
            + ("process.stdout.write(z.brotliCompressSync(b,{params:{[z.constants.BROTLI_PARAM_MODE]:"
               + str(mode) + ",[z.constants.BROTLI_PARAM_QUALITY]:11}}));" if compress
               else "process.stdout.write(z.brotliDecompressSync(b));"))
    return subprocess.run(['node', '-e', code], input=data, check=True, capture_output=True).stdout

brotli.compress = lambda data, mode=2: transform(data, True, mode)
brotli.decompress = lambda data: transform(data)
sys.modules['brotli'] = brotli
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
source = root / 'src/app/revisao/tipografia/fonts/inter-latin-wght-normal.woff2'
output = root / 'src/assets/fonts/inter-latin-400-600.woff2'
font = TTFont(source, recalcTimestamp=False)
portuguese = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÀÂÃÉÊÍÓÔÕÚÜÇáàâãéêíóôõúüç0123456789“”‘’.,:;!?—–()/%&@'
missing = sorted(set(portuguese) - set(map(chr, font.getBestCmap())))
assert not missing, f'Missing characters: {missing}'
limited = instantiateVariableFont(font, {'wght': (400, 400, 600)}, inplace=False)
limited.recalcTimestamp = False
limited.flavor = 'woff2'
limited.save(output)
shutil.copyfile(source.parent / 'inter-LICENSE', output.parent / 'Inter-OFL.txt')

# Calibrate per weight using approved Portuguese copy, rather than an English
# frequency sample that wrapped the mobile support paragraph to an extra line.
samples = json.loads((root / 'scripts/font-fallback-samples.json').read_text())
fallbacks = {
    400: '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    500: '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    600: '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
}
metrics = []
for weight, fallback_path in fallbacks.items():
    target = instantiateVariableFont(limited, {'wght': weight}, inplace=False)
    original = instantiateVariableFont(font, {'wght': weight}, inplace=False)
    assert target.getBestCmap() == original.getBestCmap()
    max_delta = max(abs(target['hmtx'][g][0] - original['hmtx'][g][0]) for g in target.getBestCmap().values())
    assert max_delta <= 1, max_delta
    fallback = TTFont(fallback_path)
    sample = samples[str(weight)]
    def average(f):
        cmap = f.getBestCmap()
        characters = [c for c in sample if ord(c) in cmap]
        return sum(f['hmtx'][cmap[ord(c)]][0] for c in characters) / len(characters) / f['head'].unitsPerEm
    scale = average(target) / average(fallback)
    upm = target['head'].unitsPerEm
    hhea = target['hhea']
    metrics.append({
        'weight': weight,
        'sizeAdjust': round(scale * 100, 5),
        'ascentOverride': round(hhea.ascent / upm / scale * 100, 5),
        'descentOverride': round(abs(hhea.descent) / upm / scale * 100, 5),
        'lineGapOverride': round(hhea.lineGap / upm / scale * 100, 5),
        'maxAdvanceDeltaFromSourceUnits': max_delta,
    })
record = {
    'source': str(source.relative_to(root)),
    'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'file': str(output.relative_to(root)),
    'sha256': hashlib.sha256(output.read_bytes()).hexdigest(),
    'sourceBytes': source.stat().st_size,
    'bytes': output.stat().st_size,
    'license': 'SIL OFL 1.1',
    'weights': [400, 500, 600],
    'subset': 'Original Fontsource Latin; no further character removal',
    'portugueseCoverageVerified': portuguese,
    'fallbackMetrics': metrics,
}
(output.parent / 'inter-metrics.json').write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n')
faces = []
for metric in metrics:
    sources = ('local("Arial"), local("ArialMT"), local("Liberation Sans"), local("Helvetica")' if metric['weight'] != 600
               else 'local("Arial Bold"), local("Arial-BoldMT"), local("Liberation Sans Bold"), local("Helvetica Bold")')
    faces.append('@font-face {\n  font-family: "Valetto Inter Fallback";\n  src: '+sources+';\n  font-style: normal;\n  font-weight: '+str(metric['weight'])+';\n  size-adjust: '+str(metric['sizeAdjust'])+'%;\n  ascent-override: '+str(metric['ascentOverride'])+'%;\n  descent-override: '+str(metric['descentOverride'])+'%;\n  line-gap-override: '+str(metric['lineGapOverride'])+'%;\n}')
(root / 'src/app/font-fallback.css').write_text('/* Generated from the approved Inter Latin file; see scripts/prepare-inter.py. */\n'+'\n\n'.join(faces)+'\n')
print(json.dumps(record, ensure_ascii=False, indent=2))
