# SWC Advanced Microscopy Facility website

Jekyll site served via GitHub Pages from the repo root (see `CNAME`).

## Running locally

Don't use `python -m http.server` — it serves the raw files without running
Jekyll, so `{% include %}`, `{{ site.title }}`, `relative_url`, etc. never get
processed and the page loads with no CSS/nav. Use Jekyll's own dev server
instead:

```
jekyll serve
```

Then open **http://127.0.0.1:4000/** (Jekyll's default port — not 8000).
Auto-regeneration is on, so edits rebuild automatically; refresh the browser
to see them.

### If `jekyll serve`/`jekyll build` fails with `undefined method 'tainted?'`

This happens on newer Ruby (Ruby removed `Object#tainted?`/`#untaint`, which
the `liquid` gem version pinned by this Jekyll install still calls). It's a
local toolchain issue, not a problem with the site — GitHub Pages builds with
its own pinned versions remotely, so it's unaffected either way.

Fix without touching installed gems — shim the removed methods back in via
`RUBYOPT`:

```
cat > /tmp/taint_shim.rb <<'EOF'
class Object
  def tainted?
    false
  end

  def untaint
    self
  end
end
EOF

RUBYOPT="-r/tmp/taint_shim.rb" jekyll serve
```
