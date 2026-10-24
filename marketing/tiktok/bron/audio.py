# Eigen muziekje + geluidseffecten voor de TikTok-video's (volledig gesynthetiseerd, rechtenvrij).
import sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(3)

def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)

def tone(f, dur, d=0.3, partials=((1, 1), (4.0, .18), (2.0, .25))):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / (d / (1 + (m - 1) * .6))) for m, a in partials)
    return s * np.minimum(t / .004, 1)

def lp(x, k=0.15):  # one-pole lowpass
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += k * (v - acc); y[i] = acc
    return y

def hp(x, k=0.15): return x - lp(x, k)

def noise(dur): return rng.uniform(-1, 1, int(dur * SR))

def kick():
    n = int(.28 * SR); t = np.arange(n) / SR
    f = 45 + 90 * np.exp(-t / .04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .12)

def clap(): return hp(noise(.18), .3) * env(int(.18 * SR), .002, .05)
def hat(): return hp(noise(.05), .6) * env(int(.05 * SR), .001, .012)

def midi(m): return 440 * 2 ** ((m - 69) / 12)

def music(dur, bpm=116):
    out = np.zeros(int((dur + 1) * SR))
    beat = 60 / bpm
    # C - G - Am - F
    prog = [(60, [60, 64, 67, 72]), (55, [59, 62, 67, 71]), (57, [60, 64, 69, 72]), (53, [60, 65, 69, 72])]
    def add(sig, at, g):
        i = int(at * SR); j = min(len(out), i + len(sig))
        if i < len(out): out[i:j] += g * sig[: j - i]
    b = 0
    while b * beat < dur:
        bar = (b // 4) % 4; root, ch = prog[bar]; at = b * beat
        add(kick(), at, .55 if b % 4 in (0, 2) else 0)
        if b % 2 == 1: add(clap(), at, .22)
        for h in (0, .5): add(hat(), at + h * beat, .10)
        if b % 2 == 0: add(tone(midi(root - 24), beat * 1.9, .35, ((1, 1), (2, .3))), at, .28)
        # arpeggio, 8sten
        for k in range(2):
            note = ch[(b * 2 + k) % 4] + (12 if (b * 2 + k) % 8 >= 6 else 0)
            add(tone(midi(note), .45, .18), at + k * beat / 2, .12)
        b += 1
    out = out[: int(dur * SR)]
    fade = int(.8 * SR); out[-fade:] *= np.linspace(1, 0, fade)
    out[: int(.05 * SR)] *= np.linspace(0, 1, int(.05 * SR))
    return out

# --- effecten ---
def pop(p=1.0):
    n = int(.09 * SR); t = np.arange(n) / SR
    f = (380 + 900 * t / .09) * p
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .03)

def whoosh():
    x = noise(.38); n = len(x); t = np.arange(n) / SR
    k = .02 + .25 * np.sin(np.pi * t / .38) ** 2
    y = np.empty_like(x); acc = 0.0
    for i in range(n): acc += k[i] * (x[i] - acc); y[i] = acc
    return y * np.sin(np.pi * t / .38) ** 1.5 * 1.6

def ding(): return (tone(1318.5, .7, .25, ((1, 1),)) + .6 * tone(1975.5, .7, .2, ((1, 1),))) * .8
def fit(x, n): return np.pad(x, (0, max(0, n - len(x))))[:n]
def sparkle(): return sum(fit(np.pad(tone(midi(m), .4, .1, ((1, 1),)), (int(i * .06 * SR), 0)), int(.7 * SR)) for i, m in enumerate([84, 88, 91, 96])) * .5
def buzz():
    n = int(.4 * SR); t = np.arange(n) / SR
    return lp(np.sign(np.sin(2 * np.pi * 110 * t)), .2) * env(n, .005, .25) * .7
def shutter(): return hp(noise(.12), .5) * env(int(.12 * SR), .001, .02) * 1.2 + np.pad(hp(noise(.06), .5) * env(int(.06 * SR), .001, .015), (int(.06 * SR), 0))[: int(.12 * SR)]
def thump(): return kick() * 1.3 + fit(clap(), len(kick())) * .6

FX = {'pop': pop, 'whoosh': whoosh, 'ding': ding, 'sparkle': sparkle, 'buzz': buzz, 'shutter': shutter, 'thump': thump}

def end(t0): return [('whoosh', t0 - .1), ('pop', t0 + .3, 1.0), ('pop', t0 + .4, 1.2), ('ding', t0 + 1.0)]
def words(start, step, n, p0=1.0): return [('pop', start + i * step, p0 + .06 * i) for i in range(n)]

EV = {
 'v1': words(.15, .14, 4) + [('pop', 1.0, 1.4), ('whoosh', 2.5), ('whoosh', 3.2), ('buzz', 4.35), ('whoosh', 5.8), ('ding', 6.7), ('sparkle', 6.8), ('pop', 8.7, .8)] + end(9.9),
 'v2': words(.1, .2, 2) + [('pop', .45 + i * .09, .7 + .05 * i) for i in range(9)] + [('whoosh', 1.6), ('pop', 2.2), ('shutter', 3.6), ('whoosh', 4.5), ('ding', 5.65), ('pop', 6.8), ('pop', 7.0, 1.3), ('thump', 7.8), ('sparkle', 7.95)] + end(8.7),
 'v3': words(.15, .16, 5) + [('pop', 2.0 + i * .36, .8 + .05 * i) for i in range(13)] + [('whoosh', 7.2), ('pop', 7.28), ('pop', 7.63, 1.2)] + end(9.78),
 'v4': words(.1, .11, 7) + [('whoosh', .4), ('whoosh', 2.5)] + [('pop', 2.85 + i * .28, .9 + .07 * i) for i in range(6)] + [('whoosh', 5.8), ('pop', 6.6, 1.3), ('pop', 7.4, 1.5), ('pop', 8.6, .8), ('sparkle', 8.7)] + end(9.9),
 'v5': words(.1, .14, 4) + sum([[('whoosh', 1.6 + i * 1.35), ('ding', 2.3 + i * 1.35)] for i in range(4)], []) + [('shutter', 3.5), ('pop', 7.8, .8), ('sparkle', 7.9)] + end(9.4),
 'v6': words(.1, .14, 4) + [('pop', 2.1), ('whoosh', 3.3), ('pop', 3.9, 1.4), ('whoosh', 5.0), ('whoosh', 7.0), ('sparkle', 7.6), ('pop', 8.2, 1.3), ('pop', 8.8), ('pop', 9.9, .8)] + end(11.0),
}

def build(name, dur, path):
    # name = een van de voorbeelden (v1..v6) of een pad naar een events.json:
    # [["pop", 0.15, 1.0], ["whoosh", 2.5], ...]  (soort, tijd in s, optioneel toonhoogte voor pop)
    if name.endswith('.json'):
        import json
        EV[name] = [tuple(e) for e in json.load(open(name))]
    out = music(dur) * .8
    gain = {'pop': .35, 'whoosh': .3, 'ding': .3, 'sparkle': .35, 'buzz': .4, 'shutter': .5, 'thump': .5}
    for ev in EV[name]:
        kind, at = ev[0], ev[1]
        sig = FX[kind](ev[2]) if kind == 'pop' and len(ev) > 2 else FX[kind]()
        i = int(at * SR); j = min(len(out), i + len(sig))
        if i < len(out): out[i:j] += gain[kind] * sig[: j - i]
    out = np.tanh(out * 1.1)
    out = out / np.max(np.abs(out)) * .89
    st = np.stack([out, out], 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())

if __name__ == '__main__':
    build(sys.argv[1], float(sys.argv[2]), sys.argv[3])
