#!/usr/bin/env python3
"""Generate synthetic placeholder imagery for the mock-up.

SUPERSEDED.  Real photographs arrived; the applet now shows those (see
tools/make_thumbs.py) and the Nerf toy where we have no photograph.  Nothing
references the output of this script any more.  Kept only because it is the one
way back to a neutral stand-in image if the toy ever wears out its welcome.

These are NOT data.  They are procedurally generated stand-ins so the cards
have something in them while we judge the layout; every file is written to
system_photos/placeholder-*.jpg and the applet labels them as placeholders.

    python3 tools/make_photos.py
"""

import numpy as np
from pathlib import Path
from PIL import Image

W, H = 720, 480
OUT = Path(__file__).resolve().parent.parent / "system_photos"


def blur(a, sigma):
    """Gaussian blur via FFT — keeps the dependency list at numpy alone."""
    ky = np.fft.fftfreq(a.shape[0])[:, None]
    kx = np.fft.fftfreq(a.shape[1])[None, :]
    k2 = (kx ** 2 + ky ** 2) * (2 * np.pi * sigma) ** 2
    return np.real(np.fft.ifft2(np.fft.fft2(a) * np.exp(-0.5 * k2)))


def norm(a):
    lo, hi = a.min(), a.max()
    return (a - lo) / (hi - lo) if hi > lo else np.zeros_like(a)


def slice_mask(rng, x, y):
    """A vaguely coronal outline: two lobes, a midline cleft, a wobbly edge."""
    # One broad superellipse for the whole section, rather than two lobes that
    # only touch — a coronal slice is continuous across the midline.
    outline = np.abs(x / 0.62) ** 2.1 + np.abs(y / 0.66) ** 2.4
    wobble = 0.10 * blur(rng.standard_normal((H, W)), 26)
    body = 1.0 - outline + norm(wobble) * 0.22 - 0.11
    # The midline fissure cuts down from the top but stops short of the base.
    cleft = np.clip((np.abs(x) - 0.02) / 0.075, 0, 1) ** 0.8
    depth = np.clip((0.30 - y) / 0.28, 0, 1)
    return np.clip(body * 6, 0, 1) * (1 - depth * (1 - cleft))


def make(seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W]
    x = (x - W / 2) / (W / 2)
    y = (y - H / 2) / (H / 2)

    mask = slice_mask(rng, x, y)

    # Channel A: diffuse structure — the tissue's general architecture.
    tissue = norm(blur(rng.standard_normal((H, W)), 7)) ** 1.4
    layers = 0.5 + 0.5 * np.sin(12 * np.hypot(x * 1.3, y) + 2 * tissue)
    green = (0.35 * tissue + 0.4 * tissue * layers) * mask

    # Channel B: sparse labelled cells — a few hundred bright somata.
    cells = np.zeros((H, W))
    n = rng.integers(600, 1400)
    ys = rng.integers(0, H, n)
    xs = rng.integers(0, W, n)
    cells[ys, xs] = rng.gamma(2.0, 1.0, n)
    cells = norm(blur(cells, 2.4)) ** 0.6
    magenta = cells * mask * rng.uniform(0.7, 1.0)

    # Detector noise and a gentle vignette, so it reads as a real acquisition.
    noise = rng.normal(0, 0.02, (H, W))
    vignette = 1 - 0.35 * np.hypot(x, y) ** 2

    r = np.clip((0.85 * magenta + 0.10 * green + noise) * vignette, 0, 1)
    g = np.clip((0.95 * green + 0.12 * magenta + noise) * vignette, 0, 1)
    b = np.clip((0.75 * magenta + 0.30 * green + noise) * vignette, 0, 1)

    rgb = (np.dstack([r, g, b]) ** 0.85 * 255).astype(np.uint8)
    return Image.fromarray(rgb)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i in range(1, 15):
        p = OUT / f"placeholder-{i:02d}.jpg"
        make(1000 + i).save(p, quality=82, optimize=True)
    print(f"wrote 14 placeholders to {OUT}")


if __name__ == "__main__":
    main()
