#!/usr/bin/env bash
# The applet fetches two JSON files, which browsers block over file://,
# so view the mock through a local server.
#
# Serve the *site* root (the parent), not this folder: publications.json lives
# outside the project, at ../assets/data/, and a server rooted here could not
# reach it. This also mirrors how the facility page will host it.
cd "$(dirname "$0")/.." || exit 1
PORT="${1:-8765}"
echo "http://localhost:${PORT}/brainsaw_map/"
exec python3 -m http.server "$PORT"
