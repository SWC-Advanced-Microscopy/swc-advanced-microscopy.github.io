#!/usr/bin/env python3
"""Bake Natural Earth country outlines into a dependency-free SVG path table.

Reads a world-atlas TopoJSON (1:50m), projects every country into Web Mercator
normalised to a 0-1000 square, and writes map/world.js.  The applet then has no
runtime dependency on any geodata, CDN or tile server.

Regenerate with:
    curl -sLO https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json
    python3 tools/build_world.py countries-50m.json
"""

import json
import math
import sys
from pathlib import Path

SIZE = 1000.0          # projected world is a SIZE x SIZE square
MAX_LAT = 85.05113     # Mercator clip, as used by every slippy map
DP = 2                 # decimals kept; 0.01 unit ~ 400 m at the equator

# Simplification tolerance in projected units.  At the deepest zoom the applet
# allows (MAX_ZOOM_FACTOR in brainsaw-map.js) roughly 80 px covers one unit, so
# 0.04 holds the coastline within about 3 px of the truth even there, and well
# under a pixel at the opening view.  Raise it to shrink map/world.js -- 0.15
# roughly halves the file -- and lower the zoom cap to match.
TOLERANCE = 0.04
# Rings whose bounding box is smaller than this are Pacific specks: invisible
# at world view and not worth their bytes.
MIN_RING = 0.25

# Antarctica is a Mercator disaster and holds no BrainSaws.
SKIP_IDS = {"010"}


def decode_arcs(topo):
    """Undo TopoJSON delta encoding, returning arcs as lists of [lon, lat]."""
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    out = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        out.append(pts)
    return out


def project(lon, lat):
    lat = max(-MAX_LAT, min(MAX_LAT, lat))
    x = (lon + 180.0) / 360.0
    s = math.sin(math.radians(lat))
    y = 0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)
    return x * SIZE, y * SIZE


def ring_points(arc_indices, arcs):
    """Stitch a ring's arcs together, honouring TopoJSON's ~i reversal rule."""
    pts = []
    for i in arc_indices:
        a = arcs[~i][::-1] if i < 0 else arcs[i]
        pts.extend(a[1:] if pts else a)
    return pts


def simplify(pts, tol):
    """Douglas-Peucker, iterative so that Siberia does not blow the stack."""
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    tol2 = tol * tol
    while stack:
        lo, hi = stack.pop()
        if hi <= lo + 1:
            continue
        ax, ay = pts[lo]
        bx, by = pts[hi]
        dx, dy = bx - ax, by - ay
        span = dx * dx + dy * dy
        worst, at = -1.0, -1
        for i in range(lo + 1, hi):
            px, py = pts[i]
            if span == 0:
                d2 = (px - ax) ** 2 + (py - ay) ** 2
            else:
                t = ((px - ax) * dx + (py - ay) * dy) / span
                t = max(0.0, min(1.0, t))
                d2 = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2
            if d2 > worst:
                worst, at = d2, i
        if worst > tol2:
            keep[at] = True
            stack.append((lo, at))
            stack.append((at, hi))
    return [p for p, k in zip(pts, keep) if k]


def unwrap(pts):
    """Remove antimeridian jumps so a ring is continuous in longitude.

    Russia's mainland runs east past 180 deg and re-enters the data at -180.
    Taken literally that ring spans 350 deg and smears across the whole map,
    so each step of more than half the globe is treated as a wrap and undone.
    The result may sit outside [-180, 180]; emit_subpaths puts it back.
    """
    out = [pts[0]]
    shift = 0.0
    for i in range(1, len(pts)):
        d = pts[i][0] - pts[i - 1][0]
        if d > 180:
            shift -= 360
        elif d < -180:
            shift += 360
        out.append((pts[i][0] + shift, pts[i][1]))
    return out


def emit_subpaths(xy):
    """Quantise a projected ring into SVG, repeating it either side of the map.

    A ring that runs off one edge of the Mercator square belongs on the other
    edge too, which is how Chukotka appears at the far left of a world map.
    """
    d = []
    prev = None
    for x, y in xy:
        q = (round(x, DP), round(y, DP))
        if q == prev:
            continue
        d.append(q)
        prev = q
    # A ring reduced to a sliver by rounding is not worth drawing.
    if len(d) < 4:
        return ""

    def draw(dx):
        # Negatives are fine here: in path data a minus sign is its own
        # separator, so implicit linetos still parse.
        return "M" + " ".join(f"{x + dx:g} {y:g}" for x, y in d) + "Z"

    lo = min(p[0] for p in d)
    hi = max(p[0] for p in d)
    parts = [draw(0)]
    if hi > SIZE:
        parts.append(draw(-SIZE))
    if lo < 0:
        parts.append(draw(SIZE))
    return "".join(parts)


def ring_to_path(pts):
    """Simplify, quantise and emit one ring, wrapping included."""
    xy = [project(lon, lat) for lon, lat in unwrap(pts)]
    xs = [p[0] for p in xy]
    ys = [p[1] for p in xy]
    if max(xs) - min(xs) < MIN_RING and max(ys) - min(ys) < MIN_RING:
        return ""
    return emit_subpaths(simplify(xy, TOLERANCE))


def geometry_to_path(geom, arcs):
    polys = (
        [geom["arcs"]] if geom["type"] == "Polygon"
        else geom["arcs"] if geom["type"] == "MultiPolygon"
        else []
    )
    parts = []
    for poly in polys:
        for ring in poly:
            parts.append(ring_to_path(ring_points(ring, arcs)))
    return "".join(parts)


def main():
    src = Path(sys.argv[1] if len(sys.argv) > 1 else "countries-50m.json")
    topo = json.loads(src.read_text())
    arcs = decode_arcs(topo)

    countries = []
    for geom in topo["objects"]["countries"]["geometries"]:
        if geom.get("id") in SKIP_IDS:
            continue
        d = geometry_to_path(geom, arcs)
        if d:
            countries.append({"name": geom["properties"]["name"], "d": d})

    countries.sort(key=lambda c: c["name"])
    body = ",\n".join(
        "  " + json.dumps(c, separators=(",", ":"), ensure_ascii=False)
        for c in countries
    )
    out = Path(__file__).resolve().parent.parent / "map" / "world.js"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        "// Generated by tools/build_world.py from Natural Earth 1:50m "
        "(public domain).\n"
        "// Web Mercator, clipped at +/-85.05 deg, normalised to a "
        f"{SIZE:g}x{SIZE:g} square.\n"
        "// Do not hand-edit.\n"
        f"const WORLD_SIZE = {SIZE:g};\n"
        f"const WORLD = [\n{body}\n];\n"
    )
    kb = out.stat().st_size / 1024
    print(f"{len(countries)} countries -> {out} ({kb:.0f} kB)")


if __name__ == "__main__":
    main()
