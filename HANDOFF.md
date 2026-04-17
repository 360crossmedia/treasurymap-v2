# Handoff — 2026-04-17

Session context for picking this up on another machine.

## What shipped in this session

Full redesign of the homepage map from scattered-cluster layout to a **3-orbit
solar system** where `Treasury Map` sits as the central sun and the 15 categories
orbit around it, grouped by proximity to treasury operations.

- **Inner orbit (core)**: TMS · ERP · Banking · FDF · CFF
- **Middle orbit (adjacent systems)**: BI · ETL · RegTech · Integrators · FIDP
- **Outer orbit (extended ecosystem)**: OTS · CMA · FSC · Insurance · Other

Merged into `main` as:
- PR #1 · commit `12b61ba` — initial solar system (Sprints 0–2)
- direct push · commit `aaa65e4` — Sprint 3 polish (+ label overlap fix)

Railway auto-deploys from `main`; both are live by now.

## What the map does today

- Central brand sun (amber glow + wordmark) surrounded by 3 orbital rings
- Each planet = cluster of logos (spiral layout), size scales with company count (log)
- **Hover a planet** → tooltip with definition + `Connects to` pills + dashed lines
  to linked categories; unlinked planets dim
- **Hover a logo** → keyword tooltip in the category color
- **Click "+N"** (or "See all N" in tooltip) → right-side drawer with the full
  list of companies in that category
- **Search** → highlights matches (colored ring + dims non-matches), no
  destructive filtering
- **Mobile** (< md breakpoint) → switches to a vertical list of category
  sections (label + blurb + 4-col logo grid + overflow button), reuses the
  same side panel
- **Starfield** background (160 deterministic stars, seeded RNG)

## Files touched

- `src/components/MapContainer.tsx` — full rewrite (solar system + mobile + panel)
- Unchanged: `src/lib/api.ts`, `src/lib/theme.ts`, layout, other pages

## Known issues / open follow-ups

- **Theme sprawl** — `src/lib/theme.ts`, `CATS` in `MapContainer.tsx`, and
  `src/app/globals.css` each define overlapping colors. One source of truth.
- **Skeleton loader** — loading state is a basic spinner; the plan was orbits
  assembling progressively. Not done.
- **`Other` label on top** — when the cluster sits at the very top of the
  outer orbit, its label can be slightly clipped. We removed the `sticky` on
  the search bar which largely fixes it, but at very tall viewports it could
  still look tight.
- **Admin panel** — out of scope for this session (Sprint 4); user mentioned
  wanting a way to manage which companies are in / out.
- **Business connection map** (`LINKS` dict in `MapContainer.tsx`) is a V1
  guess; should be reviewed with treasury domain knowledge.

## Parallel work note

Between this session starting and merging, 12+ commits landed on `main` from
another Claude session (force-separated layout, concentric rings, etc.).
User decision was "notre version gagne" — merged with `-X ours`, the other
session's MapContainer work was overwritten. `CLAUDE.md` from that session
was kept.

## To resume

```bash
git pull
npm install   # first time only
npm run dev
# open http://localhost:3000
```

Current branch strategy: feature branches → PR → merge to `main` →
Railway auto-deploy. Small fixes have been pushed directly to `main`
when urgent.

## Auth note

The fine-grained PAT used for push must have both `Contents: write` AND
`Pull requests: write`. If `gh pr create` errors with "Resource not
accessible by personal access token", that's the missing scope.
