# VibeCon Portfolio Site

Static multipage portfolio designed for VibeCon review.

## Structure

- index.html: cinematic landing page
- work.html: project index
- about.html: profile and submission checklist
- projects/treefolio.html: case study 01
- projects/streetlens.html: case study 02
- projects/tree-dashboard.html: case study 03
- projects/toiletwatch.html: case study 04
- projects/ecopath.html: case study 05
- styles.css: design system and responsive layout
- script.js: theme toggle and reveal animations

## Local preview

Open index.html directly in browser, or run a local static server.

PowerShell example:

```powershell
Set-Location "d:\Projects\VibeCon\portfolio"
python -m http.server 8080
```

Then open http://localhost:8080

## GitHub Pages deployment

1. Push portfolio folder contents into a repository root (or docs folder).
2. In repository settings, open Pages.
3. Source:
   - Deploy from branch
   - Branch: main
   - Folder: /(root) or /docs
4. Save and wait for the published URL.

## Immediate content tasks

1. Validate StreetLens accuracy benchmark and add confusion matrix evidence.
2. Add Toilet Watch response-time and SLA trend metrics once production telemetry is available.
3. Add EcoPath user/adoption metrics and emissions benchmarking when field trials are complete.
4. Replace sitemap and robots base URL if your production domain differs from GitHub Pages assumptions.

## Suggested asset naming

- assets/treefolio-demo.mp4
- assets/treefolio-mask-1.png
- assets/treefolio-mask-2.png
- assets/streetlens-demo.mp4
- assets/streetlens-overlay-1.png
- assets/tree-dashboard-demo.mp4
- assets/tree-dashboard-ward-view.png
- assets/ecopath-demo.mp4
- assets/SHOT_LIST.md

## SEO and discovery files

- sitemap.xml
- robots.txt
- site.webmanifest
- JSON-LD blocks in each page head
