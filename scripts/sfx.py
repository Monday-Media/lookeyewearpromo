"""Sound design layer for the Look Eyewear promo. Run: python3 -I scripts/sfx.py [gain_db]

Palette: the Flare haptic set (audio/sfx/C2_*.wav) plus four sounds synthesised here (lock, counter tick, soft swell,
draw tick). Every event is placed by film time (seconds, the same numbers as src/film/Film.tsx) and levelled by
loudness: measured through a small-speaker model (350 Hz high-pass, then K-weighting, 100 ms window) and set a fixed
number of LU under REF, the level the voice peaks at in the mix through the same model (about -21). The mix itself
swings from -19 to -59 in that band as the voice and the dips come and go, so following it moment by moment made
the sounds jump about; a fixed reference keeps each kind of sound at one level through the film.
Output: public/audio/mix_sfx.wav (mix + sounds) and out/sfx_only.wav.
"""
import sys, glob
import numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter, butter, sosfilt, resample_poly

ROOT = __file__.rsplit("/scripts/", 1)[0]
SR = 48000
TRIM = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0

def load(path):
    sr, d = wavfile.read(path)
    d = d.astype(np.float64) / (32768.0 if d.dtype == np.int16 else 2147483648.0 if d.dtype == np.int32 else 1.0)
    if d.ndim == 1: d = np.stack([d, d], 1)
    if sr != SR: d = resample_poly(d, SR, sr, axis=0)
    return d

KB1, KA1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585]
KB2, KA2 = [1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621]
HP = butter(4, 350, "hp", fs=SR, output="sos")
def spk(x): return lfilter(KB2, KA2, lfilter(KB1, KA1, sosfilt(HP, x, axis=0), axis=0), axis=0)
def loud(x, win):
    p = (spk(x) ** 2).sum(1); w = max(1, int(win * SR))
    if len(p) < w: p = np.pad(p, (0, w - len(p)))
    c = np.cumsum(np.insert(p, 0, 0)); m = (c[w:] - c[:-w]).max() / w
    return -0.691 + 10 * np.log10(m + 1e-12)

t_ = lambda dur: np.arange(int(dur * SR)) / SR
st = lambda m: np.stack([m, m], 1)
rng = np.random.default_rng(7)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], "bp", fs=SR, output="sos"), x)

def lock():
    """Two-part latch: a small bright click, then a short lower clunk 70 ms later."""
    n = t_(0.22); out = np.zeros_like(n)
    a = np.exp(-n / 0.004) * (np.sin(2 * np.pi * 2600 * n) * 0.6 + bp(rng.standard_normal(len(n)), 1800, 6000) * 0.5)
    m = t_(0.15); b = np.exp(-m / 0.018) * (np.sin(2 * np.pi * 240 * m) * 0.9 + np.sin(2 * np.pi * 760 * m) * 0.45 + bp(rng.standard_normal(len(m)), 900, 3200) * 0.25 * np.exp(-m / 0.006))
    out += a; k = int(0.07 * SR); out[k:k + len(b)] += b[: len(out) - k]
    return st(out)

def count_tick():
    """Tiny dry tick for the numbers counting up."""
    n = t_(0.03); return st(np.exp(-n / 0.0035) * (np.sin(2 * np.pi * 1900 * n) * 0.7 + bp(rng.standard_normal(len(n)), 1500, 5000) * 0.3))

def draw_tick(f=520):
    """Soft pencil-like tick for a piece of interface being drawn: a short rounded pulse with a little air."""
    n = t_(0.07); return st(np.exp(-n / 0.012) * np.sin(2 * np.pi * f * n) * 0.8 + np.exp(-n / 0.02) * bp(rng.standard_normal(len(n)), 1400, 4200) * 0.22)

def swell(dur=0.95):
    """Soft rising air with a low body, for the site lifting off the stack. No hard edge."""
    n = t_(dur); u = n / dur; env = np.sin(np.pi * u) ** 1.6
    noise = rng.standard_normal(len(n)); out = np.zeros(len(n)); bands = 8
    for i in range(bands):
        seg = slice(i * len(n) // bands, (i + 1) * len(n) // bands); c = 380 * (1 + 2.2 * (i / bands))
        out[seg] = bp(noise, c * 0.7, c * 1.5)[seg]
    body = np.sin(2 * np.pi * (150 * n + 45 * n * n)) * 0.5
    return st(env * (out * 0.8 + body))

S = {k.split("C2_")[1][:-4]: load(k) for k in glob.glob(f"{ROOT}/audio/sfx/C2_*.wav")}
def lift(dur=0.42):
    """A soft rounded rise for a slow lift: a low tone gliding up with a quiet overtone, no noise, no hard edge."""
    n = t_(dur); u = n / dur; env = np.sin(np.pi * u) ** 1.3
    return st(env * (np.sin(2 * np.pi * (190 * n + 110 * n * n)) * 0.7 + np.sin(2 * np.pi * (570 * n + 330 * n * n)) * 0.3))
S.update(lock=lock(), count=count_tick(), draw=draw_tick(), draw2=draw_tick(640), lift=lift())

# LU under the mix for each role (smaller = louder). This film leads with sound, so these sit closer than on Flare.
# v5 (Paul, 24 Nov): everything was far too loud, the single haptics most of all. All down 10 to 14 LU.
BELOW = dict(haptic=18, haptic_light=20, haptic_double=15, pick=20, draw=18, count=24, lock=14, lift=20, whoosh=20)
REF = -21.0

E = []
def ev(t, name, role=None, trim=0.0): E.append((t, name, role or name, trim))
def run(t0, n, step, names, role, trim=0.0):
    for i in range(n): ev(t0 + i * step, names[i % len(names)], role, trim - 0.25 * i)
PICKS = ["pick_1", "pick_2", "pick_3", "pick_4"]

ev(5.12, "haptic")                                         # pointer lands on CMS in the side menu
ev(6.6, "haptic_light")                                    # VAANYARD tile sharpens
for i, t in enumerate([8.0, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875]): ev(t, "draw" if i % 2 == 0 else "draw2", "draw")  # journal drawn in
ev(9.0, "haptic_double")                                   # journal resolves
ev(9.5, "draw", "draw"); run(9.92, 5, 0.045, PICKS, "pick"); ev(10.42, "draw2", "draw")  # product page sections build
for t in (11.3, 11.68, 12.04): ev(t, "haptic_light")       # menu hovers
ev(15.24, "haptic"); ev(15.6, "haptic"); ev(15.94, "draw2", "draw"); ev(16.0, "haptic_double")  # dashboard build and drop
run(16.04, 9, 0.04, PICKS, "pick")                         # rows cascade
ev(16.68, "haptic_light"); run(17.03, 6, 0.045, PICKS, "pick"); ev(17.7, "haptic_light")
ev(18.1, "haptic"); run(18.16, 5, 0.03, PICKS, "pick", -2); ev(18.52, "haptic_light")  # marketing menu opens, settles on Email Marketing
run(19.0, 4, 0.05, PICKS, "pick")                          # item fields
for i in range(11): ev(20.5 + 0.045 * i * (1 + 0.04 * i), "count", "count", -0.2 * i)  # analytics counting, slowing
ev(21.44, "lock")                                          # padlock closes
ev(26.72, "lift")                                          # the site lifts off the stack (soft, no whoosh)
ev(28.72, "whoosh_2", "whoosh")                            # clear
ev(29.02, "haptic"); ev(31.0, "haptic")             # pin lands, logo lands

mix = load(f"{ROOT}/public/audio/mix.wav")
layer = np.zeros_like(mix)
rows = []
for t, name, role, trim in E:
    x = S[name]; i = int(t * SR)
    target = REF - BELOW[role] + trim + TRIM
    g = 10 ** ((target - loud(x, 0.1)) / 20)
    n = min(len(x), len(layer) - i)
    if n > 0: layer[i:i + n] += x[:n] * g
    rows.append((t, name, round(target, 1)))
out = mix + layer
pk = np.abs(out).max()
if pk > 0.98: out *= 0.98 / pk
wavfile.write(f"{ROOT}/public/audio/mix_sfx.wav", SR, (out * 32767).astype(np.int16))
wavfile.write(f"{ROOT}/out/sfx_only.wav", SR, (np.clip(layer, -1, 1) * 32767).astype(np.int16))
for r in rows: print("%6.2f  %-14s %6.1f" % r)
print("events", len(rows), "peak before limit", round(float(pk), 3))
