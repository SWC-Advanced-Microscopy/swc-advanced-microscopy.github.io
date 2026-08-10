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

### If `jekyll` is not found

The gem's executables go somewhere different from `ruby` itself, and only the
latter tends to end up on `PATH`. Add this to your shell profile:

```
export PATH="$(gem environment gemdir)/bin:$PATH"
```

### If `jekyll serve`/`jekyll build` fails with `undefined method 'tainted?'`

Ruby 3.2 removed `Object#tainted?`, and `liquid` 4.0.3 still calls it (in
`liquid/variable.rb`). Jekyll 4.x asks for `liquid ~> 4.0`, so an installed
liquid 5.x does not satisfy it and 4.0.3 gets activated. Liquid 4.0.4 dropped
the call while staying within that constraint, so installing it is the whole
fix:

```
gem install liquid -v 4.0.4
```

It's purely additive — 4.0.3 stays where it is, and Jekyll picks the newer of
the two. This is a local toolchain issue either way: GitHub Pages builds
remotely with its own pinned versions.
