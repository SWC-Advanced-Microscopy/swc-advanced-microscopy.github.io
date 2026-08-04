# AMF site rebuild — project brief

## Background

The current site is [swcmicroscopy.com](https://swcmicroscopy.com/), built with Jekyll + the Minimal Mistakes theme, hosted on GitHub Pages. It's the public site for the Advanced Microscopy Facility (AMF), the imaging core facility at the Sainsbury Wellcome Centre, UCL.

The site owner (me) is comfortable with HTML and CSS but hasn't built a site from scratch in a while and doesn't have time to do a full rebuild solo. I manage the facility and am self-taught in web/optics-adjacent tooling — I have a general CS background (I understand memory management, pre-allocation, why you'd sort before dedup, etc.) but I'm not a professional web developer. I'm most fluent in MATLAB; I know some C/C++; my Python is slow and non-idiomatic.

## Why we're doing this

Minimal Mistakes has become awkward to customise:

- The theme is built for many use cases (blogs, portfolios, docs, etc.), so there's a lot of config, includes, and Sass to understand before safely changing anything.
- Concrete failure case: I tried to add small logo images to the footer. The `<img>` tag is in the page but the image doesn't render — almost certainly a CSS or path issue buried somewhere in Minimal Mistakes' partials/Sass that I couldn't track down. See the footer of the live site for the broken instance.
- I'd rather hand-edit plain HTML/CSS than fight a theme's abstraction layers, but I don't want to lose the benefit of shared page furniture (nav, footer) across ~8+ pages.

## What "done" looks like

A rebuilt site that:

1. **Looks the same or very close to the current site** — this is not a redesign, it's a maintainability rebuild. Match the current look (colours, layout, tone) unless there's a good reason to deviate.
2. **Works well on both desktop and mobile** — responsive nav, responsive image/card grids, readable text at small widths.
3. **Is easy for me to hand-edit afterwards** — few files, each one legible top to bottom, minimal indirection. Concretely:
   - Plain HTML pages with YAML front matter (Jekyll supports `.html` pages, not just Markdown — use this; I'd rather write real HTML than fight Markdown's limitations, e.g. for the footer image issue).
   - Keep Jekyll's `{% include %}` mechanism for genuinely shared furniture only (nav, footer) so a nav change doesn't mean editing 8 files by hand. Don't reach for Liquid beyond that unless there's a clear payoff.
   - One CSS file (or a small number), using CSS custom properties for colours/fonts at the top, so a look-and-feel tweak is a few-line edit.
   - No unnecessary gems/plugins — keep it buildable natively on GitHub Pages with no local Ruby toolchain required for basic edits.

## Current site structure (for reference)

Nav: Equipment · Services · Tools · People · Blog · Publications · FAQ · Links

Home page: intro paragraph about the facility, then a "Learn more about some of our tools" section with a card grid (image + heading + blurb + "Read more" link) for a few featured tools (Serial Section Imaging, Zapit, Software).

Footer: "Follow:" section with a GitHub link, copyright line, Jekyll/Minimal Mistakes credit (to be replaced/removed), and the currently-broken logo image (Wellcome Trust logo).

## Decisions already made

- **Blog is being dropped.** Nobody reads it, I don't maintain it. Replace the "Blog" nav item with nothing, or fold any relevant content elsewhere.
- We will **Add a Bluesky link** in the footer's "Follow:" section, alongside the existing GitHub link — same tier, same treatment, just an icon + link to the AMF (or my) Bluesky profile. No feed widget, no third-party embedding service — those add an ongoing dependency and JS weight for no real benefit given how rarely this would be used. The bsky link will be to https://bsky.app/profile/sainsburywellcome.bsky.social for now. If we later make our own Facility account we can also add that. 
- Optionally, in future, I might drop in an **official Bluesky post embed** (via `embed.bsky.app`, official first-party oEmbed, no account needed) to highlight a specific post on the home page occasionally — this is a manual, one-post-at-a-time thing, not a live feed, and isn't part of the initial rebuild scope.

## Workflow for this project

1. **New repo** as a scratch workspace for the rebuild — clean slate, no Minimal Mistakes leftovers. All the actual build work happens here.
2. **Enable GitHub Pages on that new repo too**, giving a live, real URL (e.g. `username.github.io/repo-name`) to test on real devices — separate from and zero-risk to the live site.
3. **I test on that URL** — click through every page, check mobile nav, confirm the footer image actually renders, etc. — and iterate with Claude Code as needed.
4. **Migrate into the live repo via a branch + PR**, not by touching the live repo directly during development. Review the diff, then merge to `main`.
5. **The domain does not move.** `swcmicroscopy.com` is already pointed at GitHub Pages via a `CNAME` file in the live repo plus DNS at the registrar — neither changes. Merging the PR into the already-configured live repo is the entire deploy step.
6. **Rollback is trivial** if anything looks wrong post-merge — it's all git, revert the commit or keep the old Minimal Mistakes branch around as a backup.

## Open questions for Claude Code to raise with me if needed

- Whether the new repo should be public or private while it's a work in progress (private repos need Pages support on my GitHub plan — worth checking before starting).
- Confirm final page list/scope (Equipment, Services, Tools, People, Publications, FAQ, Links, plus home) before starting the build.
- Confirm my Bluesky handle for the footer link.



## Getting this live
We will be building on GitHub at https://github.com/SWC-Advanced-Microscopy/site-rebuild

Don't add a CNAME file to the scratch repo. GitHub only lets one repo claim a given custom domain at a time; if the scratch repo also claims swcmicroscopy.com, you'll get a conflict warning and possibly break the live site's claim on the domain. Let the scratch repo just serve at its own github.io/site-rebuild/ address.

Because a project page serves from a subpath, Jekyll's baseurl config needs to be set to /site-rebuild while testing there, and then set back to empty ("") when the files move into the org page repo, which serves from the root. As long as all internal links/assets go through Jekyll's {{ "/path" | relative_url }} (or {{ site.baseurl }}) instead of being hardcoded, that switch is a one-line config change and nothing breaks.
