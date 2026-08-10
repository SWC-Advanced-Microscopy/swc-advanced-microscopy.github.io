#!/usr/bin/env python3
"""Down-size the system photographs for the map panel.

The originals are 1400–3500 px square-ish and several megabytes each; the panel
shows them at about 380 px wide.  This writes a `<name>_small.jpg` beside every
original at 720x540, centre-cropped to the panel's 4:3 figure.  The originals
stay where they are — they are the archive copy.

4:3 rather than the 3:2 the synthetic placeholders used: these microscopes are
tall objects photographed from the front, and a 3:2 crop takes the objective off
the top or the breadboard off the bottom.

    python3 tools/make_thumbs.py

Re-runnable; existing _small files are overwritten.
"""

from pathlib import Path
from PIL import Image, ImageOps

W, H = 720, 540
PHOTOS = Path(__file__).resolve().parent.parent / "system_photos"

# Where to take the crop from, as a fraction of the surplus.  0.5 is centred.
# The Nerf toy is the exception: it is wider than it is tall to begin with and
# its lettering runs along the bottom, so the crop keeps the bottom edge.
CROP_Y = {"zombie_brainsaw": 1.0}


def main():
    originals = sorted(
        p for p in PHOTOS.iterdir()
        if p.suffix.lower() in {".jpg", ".jpeg", ".png"}
        and not p.stem.endswith("_small")
        and not p.stem.startswith("placeholder")
    )

    for src in originals:
        im = Image.open(src)
        # EXIF orientation first: phone photographs carry it, and cropping
        # before honouring it would crop the wrong edges.
        im = ImageOps.exif_transpose(im)
        # Flatten alpha (the PNGs have it) onto the panel's own backdrop rather
        # than onto white, which would flash a bright border on any soft edge.
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, (10, 17, 32))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert("RGB")

        out = ImageOps.fit(
            im, (W, H), method=Image.LANCZOS,
            centering=(0.5, CROP_Y.get(src.stem, 0.5)),
        )
        dst = src.with_name(src.stem + "_small.jpg")
        out.save(dst, quality=82, optimize=True, progressive=True)
        print(f"{src.name:32s} {im.size[0]}x{im.size[1]} -> "
              f"{dst.name:38s} {dst.stat().st_size // 1024} kB")


if __name__ == "__main__":
    main()
