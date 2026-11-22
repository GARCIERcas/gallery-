# Generates placeholder abstract paintings + src/artworks.js
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

REPO = sys.argv[1]
OUT = os.path.join(REPO, 'public', 'art')
W = 1400

def hexrgb(h): h = h.lstrip('#'); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], float)

def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), float) / 255

def lowfreq(rng, h, w, cell, horiz=1.0):
    sh, sw = max(2, int(h / cell)), max(2, int(w / (cell * horiz)))
    n = rng.random((sh, sw))
    im = Image.fromarray((n * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(im, float) / 255 - 0.5

def streaks(rng, h, w, vertical=False):
    if vertical:
        n = rng.random((h // 3, max(2, w // 90)))
    else:
        n = rng.random((max(2, h // 90), w // 3))
    im = Image.fromarray((n * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)
    return np.asarray(im, float) / 255 - 0.5

def texture(rng, h, w, vertical=False, strength=1.0):
    fine = blur(rng.random((h, w)), 0.7) - 0.5
    y, x = np.mgrid[0:h, 0:w]
    weave = (np.sin(x * 2.1) + np.sin(y * 2.1)) * 0.5
    t = 1 + strength * (0.04 * fine + 0.035 * streaks(rng, h, w, vertical) + 0.01 * weave + 0.02 * lowfreq(rng, h, w, 400))
    return t[..., None]

def soft_rect(rng, h, w, x0, y0, x1, y1, feather=14, rough=0.22):
    m = np.zeros((h, w))
    m[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 1
    m = blur(m, feather)
    m = m + rough * lowfreq(rng, h, w, 18) * (1 - np.abs(m - 0.5) * 2)
    return np.clip((m - 0.5) * 2.2 + 0.5, 0, 1)

def layer(img, mask, color, rng, var=0.06):
    c = hexrgb(color)[None, None, :] * (1 + var * lowfreq(rng, *img.shape[:2], 140))[..., None]
    m = mask[..., None]
    return img * (1 - m) + c * m

def finish(img, rng, vertical=False, strength=1.0):
    img = img * texture(rng, *img.shape[:2], vertical, strength)
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))

# ---------- styles ----------
def color_field(rng, h, w, p):
    img = np.ones((h, w, 3)) * hexrgb(p['bg'])
    img = layer(img, np.ones((h, w)), p['bg'], rng, 0.04)
    for (x0, y0, x1, y1), c in zip(p['rects'], p['colors']):
        img = layer(img, soft_rect(rng, h, w, x0, y0, x1, y1, feather=p.get('feather', 16)), c, rng, 0.09)
    return finish(img, rng)

def horizon(rng, h, w, p):
    img = np.ones((h, w, 3)) * hexrgb(p['bands'][0][1])
    img = layer(img, np.ones((h, w)), p['bands'][0][1], rng, 0.04)
    y = np.arange(h)[:, None] / h
    for pos, c in p['bands'][1:]:
        edge = pos + 0.012 * lowfreq(rng, 1, w, 1, horiz=0.02)[0][None, :] * 4
        m = 1 / (1 + np.exp(-(y - edge) * h / p.get('soft', 6)))
        img = layer(img, m, c, rng, 0.1)
    if 'sun' in p:
        cx, cy, r, c = p['sun']
        yy, xx = np.mgrid[0:h, 0:w]
        d = np.sqrt((xx - cx * w) ** 2 + (yy - cy * h) ** 2) / (r * w)
        img = layer(img, np.clip((1 - d) * 18, 0, 1) , c, rng, 0.05)
    return finish(img, rng)

def geometric(rng, h, w, p):
    S = 2
    im = Image.new('RGB', (w * S, h * S), p['bg'])
    d = ImageDraw.Draw(im)
    for sh in p['shapes']:
        kind, c = sh[0], sh[-1]
        if kind == 'circle':
            cx, cy, r = sh[1]
            box = [(cx * w - r * w) * S, (cy * h - r * w) * S, (cx * w + r * w) * S, (cy * h + r * w) * S]
        elif kind == 'ring':
            cx, cy, r = sh[1]
            box = [(cx * w - r * w) * S, (cy * h - r * w) * S, (cx * w + r * w) * S, (cy * h + r * w) * S]
            d.ellipse(box, outline=c, width=int(sh[2] * S)); continue
        else:
            box = [v * (w if i % 2 == 0 else h) * S for i, v in enumerate(sh[1])]
        if kind == 'rect': d.rectangle(box, fill=c)
        elif kind == 'circle': d.ellipse(box, fill=c)
        elif kind == 'pie': d.pieslice(box, sh[2], sh[3], fill=c)
        elif kind == 'line': d.line(box, fill=c, width=int(sh[2] * S))
    im = im.resize((w, h), Image.LANCZOS)
    img = np.asarray(im, float)
    img = img * (1 + 0.05 * lowfreq(rng, h, w, 120))[..., None]
    return finish(img, rng, strength=0.8)

def gestural(rng, h, w, p):
    base = np.ones((h, w, 3)) * hexrgb(p['bg'])
    base = layer(base, np.ones((h, w)), p['bg'], rng, 0.04)
    im = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert('RGBA')
    for k in range(p['n']):
        lay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay)
        c = hexrgb(rng.choice(p['colors'])).astype(int)
        x, y = rng.uniform(0.05, 0.95) * w, rng.uniform(0.05, 0.95) * h
        ang = rng.uniform(0, math.pi * 2) if p.get('free', True) else rng.normal(0, 0.25)
        width = rng.uniform(*p['width']) * w
        length = rng.uniform(*p['length']) * w
        alpha = int(rng.uniform(150, 235))
        steps = 160
        pts = []
        for i in range(steps):
            ang += rng.normal(0, p.get('curl', 0.06)) / 2
            x += math.cos(ang) * length / steps
            y += math.sin(ang) * length / steps
            pts.append((x, y))
        for i, (px, py) in enumerate(pts):
            r = width * (0.35 + 0.65 * math.sin(math.pi * (i + 1) / (steps + 1)) ** 0.5)
            d.ellipse([px - r, py - r, px + r, py + r], fill=(*c, alpha))
        lay = lay.filter(ImageFilter.GaussianBlur(1.2))
        im = Image.alpha_composite(im, lay)
    img = np.asarray(im.convert('RGB'), float)
    return finish(img, rng, strength=1.3)

def stripes(rng, h, w, p):
    img = np.ones((h, w, 3)) * hexrgb(p['bg'])
    img = layer(img, np.ones((h, w)), p['bg'], rng, 0.1)
    x = np.arange(w)[None, :] / w
    for x0, x1, c in p['stripes']:
        wob = 0.003 * lowfreq(rng, h, 1, h / 5)[:, :1]
        m = (1 / (1 + np.exp(-(x - x0 - wob) * w / 2.5))) * (1 / (1 + np.exp((x - x1 - wob) * w / 2.5)))
        top = np.arange(h)[:, None] / h
        m = m * (1 / (1 + np.exp(-(top - p.get('top', 0.0)) * h / 4))) * (1 / (1 + np.exp((top - p.get('bottom', 1.0)) * h / 4)))
        img = layer(img, m, c, rng, 0.08)
    return finish(img, rng, vertical=True)

STYLES = dict(color_field=color_field, horizon=horizon, geometric=geometric, gestural=gestural, stripes=stripes)

# ---------- catalogue ----------
ARTISTS = {
    'lm': dict(name='Léa Marchand', born=1964, country={'en': 'France', 'fr': 'France'}),
    'jw': dict(name='Jonas Wrede', born=1971, country={'en': 'Germany', 'fr': 'Allemagne'}),
    'af': dict(name='Ana Ferro', born=1983, country={'en': 'Spain', 'fr': 'Espagne'}),
    'eh': dict(name='Elias Hart', born=1958, country={'en': 'United Kingdom', 'fr': 'Royaume-Uni'}),
    'sl': dict(name='Sofia Lind', born=1990, country={'en': 'Sweden', 'fr': 'Suède'}),
}
OIL = {'en': 'Oil on canvas', 'fr': 'Huile sur toile'}
ACR = {'en': 'Acrylic on canvas', 'fr': 'Acrylique sur toile'}
MIX = {'en': 'Mixed media on linen', 'fr': 'Technique mixte sur lin'}

WORKS = [
  ('ochre-silence', 'lm', 2023, ('Ochre Silence', 'Silence ocre'), OIL, (100, 130), 8400, False, 'color_field',
     dict(bg='#3a2a24', rects=[(.08, .06, .92, .46), (.08, .52, .92, .66), (.08, .72, .92, .94)], colors=['#c98f4a', '#7b3b26', '#d8c3a0'])),
  ('north-light', 'sl', 2024, ('North Light', 'Lumière du nord'), OIL, (90, 90), 3600, False, 'horizon',
     dict(bands=[(0, '#dfe4e2'), (.58, '#a9b8bb'), (.74, '#56707a'), (.9, '#2d3c44')], soft=5)),
  ('composition-7', 'af', 2022, ('Composition No. 7', 'Composition n° 7'), ACR, (80, 80), 4200, False, 'geometric',
     dict(bg='#ece5d6', shapes=[('pie', (-.3, .2, .7, 1.2), 270, 360, '#1f3f8f'), ('rect', (.55, .1, .85, .4), '#d9a22b'), ('circle', (.75, .7, .15), '#c0402b'), ('line', (.1, .12, .45, .12), 6, '#1b1b1b')])),
  ('storm-study', 'jw', 2023, ('Storm Study', 'Étude d’orage'), OIL, (120, 100), 7200, False, 'gestural',
     dict(bg='#e8e3d8', colors=['#1d1d1d', '#3b4b5a', '#8d9aa3', '#c9c1b2', '#b5462d'], n=26, width=(.01, .04), length=(.3, .8), curl=.05)),
  ('quiet-field', 'eh', 2021, ('Quiet Field', 'Champ tranquille'), OIL, (70, 90), 2900, True, 'stripes',
     dict(bg='#efeadf', stripes=[(.2 + i * .065, .2 + i * .065 + .018, '#9b9384') for i in range(10)], top=.12, bottom=.88)),
  ('red-sun', 'af', 2024, ('Red Sun', 'Soleil rouge'), ACR, (100, 100), 5600, False, 'horizon',
     dict(bands=[(0, '#ebe2cf'), (.7, '#2a2623')], soft=3, sun=(.5, .4, .2, '#c8432b'))),
  ('blue-hour', 'lm', 2024, ('Blue Hour', 'L’heure bleue'), OIL, (90, 120), 7800, False, 'color_field',
     dict(bg='#141c2b', rects=[(.1, .07, .9, .55), (.1, .6, .9, .92)], colors=['#2f4d7a', '#5a6f8f'], feather=22)),
  ('garden-memory', 'jw', 2022, ('Garden Memory', 'Mémoire d’un jardin'), MIX, (110, 140), 9600, False, 'gestural',
     dict(bg='#efe9dc', colors=['#3f5e3a', '#86a06a', '#d6c06a', '#c2643c', '#2b2b2b', '#e9d8c6'], n=60, width=(.008, .03), length=(.12, .4), curl=.08)),
  ('dune', 'sl', 2023, ('Dune', 'Dune'), OIL, (100, 70), 3200, False, 'horizon',
     dict(bands=[(0, '#f1e6d2'), (.42, '#e2c49a'), (.6, '#c98f5b'), (.8, '#8a5a3c')], soft=10)),
  ('meridian', 'eh', 2023, ('Meridian', 'Méridien'), ACR, (60, 80), 2400, False, 'geometric',
     dict(bg='#f2efe8', shapes=[('rect', (.495, .08, .505, .92), '#1b1b1b'), ('ring', (.5, .5, .24), 5, '#1b1b1b'), ('rect', (.495, .3, .505, .7), '#c0402b')])),
  ('terracotta', 'lm', 2022, ('Terracotta', 'Terre cuite'), OIL, (80, 100), 6400, True, 'color_field',
     dict(bg='#b5552f', rects=[(.1, .08, .9, .4), (.1, .46, .9, .9)], colors=['#e3a06b', '#6f2a1a'])),
  ('rhythm-ii', 'af', 2024, ('Rhythm II', 'Rythme II'), ACR, (120, 90), 6800, False, 'stripes',
     dict(bg='#f1ede4', stripes=[(.08, .2, '#1f3f8f'), (.26, .3, '#d9a22b'), (.36, .55, '#1b1b1b'), (.61, .66, '#c0402b'), (.72, .92, '#d9d1bf')])),
  ('after-rain', 'sl', 2024, ('After Rain', 'Après la pluie'), OIL, (70, 70), 2600, False, 'horizon',
     dict(bands=[(0, '#cfd6cf'), (.5, '#9aa892'), (.66, '#5d6b55'), (.84, '#3a4236')], soft=8, sun=(.72, .28, .07, '#eef0e6'))),
  ('black-mountain', 'jw', 2021, ('Black Mountain', 'Montagne noire'), OIL, (130, 100), 8900, False, 'gestural',
     dict(bg='#ece7dd', colors=['#151515', '#151515', '#2c2c2c', '#7c7c7c'], n=14, width=(.025, .07), length=(.4, .9), curl=.03)),
  ('salt', 'eh', 2024, ('Salt', 'Sel'), OIL, (90, 120), 4800, False, 'color_field',
     dict(bg='#cfc9bd', rects=[(.12, .1, .88, .9)], colors=['#f1eee7'], feather=24)),
  ('signal', 'af', 2023, ('Signal', 'Signal'), ACR, (70, 100), 3900, False, 'geometric',
     dict(bg='#1c1c1c', shapes=[('rect', (.12, .1, .88, .5), '#e8e1d0'), ('circle', (.5, .72, .19), '#c0402b'), ('rect', (.12, .9, .88, .91), '#e8e1d0')])),
]

os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    os.remove(os.path.join(OUT, f))

arts = []
for i, (id_, a, year, (ten, tfr), medium, (cw, ch), price, sold, style, params) in enumerate(WORKS):
    rng = np.random.default_rng(1000 + i)
    ratio = ch / cw
    w, h = W, round(W * ratio)
    im = STYLES[style](rng, h, w, params)
    im.save(f'{OUT}/{id_}-l.webp', 'WEBP', quality=82, method=6)
    im.resize((640, round(640 * ratio)), Image.LANCZOS).save(f'{OUT}/{id_}-s.webp', 'WEBP', quality=80, method=6)
    arts.append(dict(id=id_, artist=a, year=year, title={'en': ten, 'fr': tfr}, medium=medium,
                     size=f'{cw} × {ch} cm', price=price, sold=sold, ratio=round(ratio, 4)))
    print(id_, w, h)

js = '// Placeholder works — replace with real artworks (images in public/art/{id}-s.webp and {id}-l.webp).\n'
js += 'export const artists = ' + json.dumps(ARTISTS, ensure_ascii=False, indent=2) + '\n\n'
js += 'export const artworks = ' + json.dumps(arts, ensure_ascii=False, indent=2) + '\n'
open(os.path.join(REPO, 'src', 'artworks.js'), 'w').write(js)
