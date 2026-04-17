# TreasuryMap V2

## Project
Rebuild of treasurymap.com — interactive constellation map of treasury technology solutions.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind
- Hosted on Railway (service: treasurymap-v2, project: TreasuryMap V2)
- Backend API: https://treasurymapbackend-production.up.railway.app/api/v1
- GitHub: 360crossmedia/treasurymap-v2

## Key files
- `src/components/MapContainer.tsx` — MAP CORE — the constellation map. Do not refactor without explicit instruction.
- `src/lib/api.ts` — API client + types
- `src/lib/theme.ts` — design tokens
- `src/app/page.tsx` — homepage (renders MapContainer)
- `src/app/company/[slug]/page.tsx` — SSR company page
- `src/app/contact/page.tsx` — contact form
- `src/app/signup/page.tsx` — get listed form
- `src/app/insights/page.tsx` — insights placeholder

## API endpoints (backend — don't touch)
- GET /companies — all companies
- GET /companies/:id — single company
- GET /categories — categories with sub_options
- GET /subCategories — subcategories
- GET /countries — countries list
- GET /mapdata — map data (categories + logos per category)
- GET /articles/:id — article by id
- GET /articles/all/:companyId — articles by company

## Map data
- 15 categories (API ids 0-14)
- 113 logos shown (matching current treasurymap.com)
- Logo counts per category from live site: {0:4, 1:2, 2:7, 3:4, 4:15, 5:18, 6:3, 7:1, 8:4, 9:5, 10:15, 11:7, 12:10, 13:15, 14:3}

## Current state
- Map constellation with organic spiral layout, glassmorphism logos, hover effects
- Known issues: some clusters overflow viewport edges, need tighter constraints
- Company pages SSR with metadata + JSON-LD
- Forms have validation
- Original TreasuryMap logo SVG in header

## Dev commands
```
npm install
npm run dev      # local dev on port 3000
npm run build    # production build
# Push to main triggers Railway auto-deploy
# Railway listens on port 8080 (set in package.json start script)
```

## What needs to be done
1. Fix map overflow — logos going off-screen on edges
2. Make map more polished — better spacing, smoother interactions
3. Phase 2 — articles/insights system (backend schema additions needed)
4. Phase 3 — slug-based company URLs, design tokens cleanup, Image optimization
5. Phase 4 — robots.txt, sitemap.xml, JSON-LD on all company pages
