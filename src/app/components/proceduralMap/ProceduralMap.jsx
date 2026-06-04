"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { url } from "../../service/url";
import { providerHref } from "../../utils/slugify";
import { cld } from "../../utils/cloudinary";
import { CAT_META } from "./catMeta";
import { buildMap, teardownMap } from "./engine";

// Derive HQ country ids from the free-text `location` by matching country names.
function deriveHq(location, countries) {
  if (!location) return [];
  const loc = String(location).toLowerCase();
  const out = [];
  for (const c of countries) {
    const name = (c.name || "").toLowerCase();
    if (name.length >= 4 && loc.includes(name)) out.push(c.id);
  }
  return out;
}

// Build the per-category vendor groups.
//  - default (homepage / "Treasury Map"): 1 logo per vendor, in its MAIN category.
//  - multiplayer ("Multiplayer Map"): each vendor appears in EVERY category it
//    is active in (companyCategories) — same vendor repeated across wedges.
function toCats(companies, countries = [], multiplayer = false) {
  if (!Array.isArray(companies)) return [];
  const byId = {};
  const pushItem = (catId, c) => {
    const key = `category-${catId}`;
    if (!CAT_META[key]) return;
    if (!byId[catId]) byId[catId] = [];
    // Golden rule: one logo per vendor per category — dedupe by NAME
    // (source data has duplicate records, e.g. two "Payflows" in TRMS).
    const nameKey = (c.name || "").trim().toLowerCase() || `id-${c.id}`;
    if (byId[catId].some((x) => x._k === nameKey)) return;
    byId[catId].push({
      _k: nameKey,
      id: c.id,
      n: c.name || "—",
      i: c.logo,
      href: providerHref({ name: c.name, id: c.id }),
      sub: c.companySubcategories || [],
      active: c.companyOffices || [],
      hq: deriveHq(c.location, countries),
    });
  };
  for (const c of companies) {
    if (!c.live || !c.logo) continue;
    if (!c.maincategory || !c.maincategory.length) continue;
    pushItem(c.maincategory[0], c);
  }
  return Object.entries(byId)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([catId, items]) => {
      const meta = CAT_META[`category-${catId}`];
      return { code: meta.code, full: meta.full, hue: meta.hue, total: items.length, items };
    });
}

// Build groups for the Multiplayer Map from the CURATED endpoint
// (/api/v1/mapdata/multiplayerMap) — the exact same source the original
// multiplayer map used. Shape: { "category-N": [{ id, name, logo, live }] }.
// Each vendor appears in every category it was curated into. We join to the
// full companies list (by id) to recover sub-category / office data for filters.
function toCatsMultiplayer(mp, companies = [], countries = []) {
  if (!mp || typeof mp !== "object") return [];
  const byId = {};
  for (const c of companies) byId[c.id] = c;

  const groups = [];
  for (const key of Object.keys(mp)) {
    const meta = CAT_META[key];
    if (!meta) continue;
    const catId = parseInt(key.split("-")[1], 10);
    const items = [];
    const seen = new Set();
    for (const logo of mp[key] || []) {
      if (!logo || !logo.live || !logo.logo) continue;
      const comp = byId[logo.id] || {};
      const name = logo.name || comp.name || "—";
      // Golden rule: one logo per vendor per category — dedupe by name
      // (source data has duplicate records, e.g. two "Payflows" in TRMS).
      const dedupeKey = name.trim().toLowerCase() || `id-${logo.id}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      items.push({
        id: logo.id,
        n: name,
        i: logo.logo,
        href: providerHref({ name, id: logo.id }),
        sub: comp.companySubcategories || [],
        active: comp.companyOffices || [],
        hq: deriveHq(comp.location, countries),
      });
    }
    if (items.length) groups.push({ catId, code: meta.code, full: meta.full, hue: meta.hue, total: items.length, items });
  }
  return groups.sort((a, b) => a.catId - b.catId);
}

export default function ProceduralMap({ multiplayer = false, filters, subs = [], onCategoryClick, onClear, onVendors, onCats, onFilterOptions, onMatchCount }) {
  const rootRef             = useRef(null);
  const router              = useRouter();
  // Use a ref for onCategoryClick so it never triggers a map rebuild
  const onCategoryClickRef  = useRef(onCategoryClick);
  useEffect(() => { onCategoryClickRef.current = onCategoryClick; }, [onCategoryClick]);
  const [loading,  setLoading]  = useState(true);
  const [miniCard, setMiniCard] = useState(null);  // A1
  const [noResults, setNoResults] = useState(false); // C2

  // A1: navigate callback — opens mini-card instead of immediate navigation
  const handleNavigate = useCallback((payload) => {
    if (payload && typeof payload === "object" && payload.name) {
      setMiniCard(payload);
    } else if (typeof payload === "string") {
      router.push(payload);
    }
  }, [router]);

  // Build / rebuild the map
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      setLoading(true);
      let cats = [];
      try {
        const [res, subsRes, countriesRes, mpRes] = await Promise.all([
          axios.get(`${url}/api/v1/companies`),
          axios.get(`${url}/api/v1/subCategories`).then((r) => r.data).catch(() => []),
          axios.get(`${url}/api/v1/countries`).then((r) => r.data).catch(() => []),
          multiplayer
            ? axios.get(`${url}/api/v1/mapdata/multiplayerMap`).then((r) => r.data).catch(() => null)
            : Promise.resolve(null),
        ]);
        cats = multiplayer
          ? toCatsMultiplayer(mpRes, res.data, countriesRes)
          : toCats(res.data, countriesRes);
        // Expose filter dropdown options (sub-categories + countries)
        if (onFilterOptions) onFilterOptions({ subCategories: subsRes || [], countries: countriesRes || [] });
        // Expose the full vendor list (for data-backed search autocomplete).
        // In multiplayer mode a vendor recurs across categories → dedupe by name.
        if (onVendors) {
          const seen = new Set();
          const list = [];
          cats.forEach((c) =>
            c.items.forEach((it) => {
              if (seen.has(it.n)) return;
              seen.add(it.n);
              list.push({ name: it.n, href: it.href, code: c.code, hue: c.hue });
            })
          );
          onVendors(list);
        }
        // Expose full (uncapped) per-category vendor lists for category drill-down.
        if (onCats) onCats(cats);
      } catch (e) {
        console.error("ProceduralMap: failed to load /api/v1/companies", e);
        setLoading(false);
        return;
      }
      if (cancelled || !rootRef.current || !cats.length) { setLoading(false); return; }

      if (document.fonts?.ready) { try { await document.fonts.ready; } catch (_) {} }
      if (cancelled || !rootRef.current) { setLoading(false); return; }

      const root = rootRef.current;
      const render = () => {
        teardownMap(root);
        buildMap(root, cats, {
          cap: multiplayer ? 40 : 30,
          navigate: handleNavigate,
          onCategoryClick: (code, full, hue) => { // A2 — uses ref, no rebuild on change
            if (onCategoryClickRef.current) onCategoryClickRef.current(code, full, hue);
          },
        });
      };

      render();
      setLoading(false);

      let raf = 0;
      const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
      window.addEventListener("resize", onResize);
      cleanup = () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); teardownMap(root); };
    })();

    return () => { cancelled = true; cleanup(); };
  }, [handleNavigate, multiplayer]); // onCategoryClick intentionally excluded — handled via ref

  // Apply combinable filters (AND across facets, OR within sub-categories).
  // When filtering, NON-matching logos are fully hidden so only the vendors
  // concerned by the filters remain on the map.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const toks   = [...root.querySelectorAll(".tok")];
    const labels = [...root.querySelectorAll(".clabel")];
    const auras  = [...root.querySelectorAll(".aura")];

    // NB: tokens carry the `tokIn` reveal animation with fill-mode:both, which
    // pins opacity:1 and OVERRIDES inline styles. So hiding must use a class
    // with !important (an author !important rule beats a CSS animation).
    const showTok = (e) => { e.style.opacity = ""; e.style.pointerEvents = ""; e.classList.remove("dim", "filtered-out"); e.classList.add("on"); };
    const hideTok = (e) => { e.classList.add("dim", "filtered-out"); e.classList.remove("on"); };
    const dimCtx  = (e) => { e.style.opacity = "0.16"; e.classList.add("dim"); e.classList.remove("on"); };
    const reset   = (e) => { e.style.opacity = ""; e.style.pointerEvents = ""; e.classList.remove("dim", "on", "filtered-out"); };

    // Build active conditions
    const fcat = filters?.category;
    const fkw  = filters?.keyword && String(filters.keyword.value || "").trim()
      ? String(filters.keyword.value).toLowerCase().trim() : null;
    const fac  = filters?.active;
    const subVals = (subs || []).map((s) => String(s.value));
    const anyActive = !!(fcat || fkw || fac || subVals.length);

    if (!anyActive) {
      root.classList.remove("focusing");
      [...toks, ...labels, ...auras].forEach(reset);
      onMatchCount?.(null);
      setNoResults(false);
      return;
    }

    // code → cat index (from labels)
    const codeToCat = {};
    labels.forEach((l) => { codeToCat[l.dataset.code] = l.dataset.cat; });

    const tokMatches = (t) => {
      if (fcat && t.dataset.cat !== codeToCat[fcat.code]) return false;
      if (fkw && !(t.querySelector("img")?.alt || "").toLowerCase().includes(fkw)) return false;
      if (fac && !(t.dataset.active || "").includes("," + fac.value + ",")) return false;
      if (subVals.length && !subVals.some((v) => (t.dataset.sub || "").includes("," + v + ","))) return false;
      return true;
    };

    root.classList.add("focusing");
    let count = 0;
    toks.forEach((t) => { if (tokMatches(t)) { showTok(t); count++; } else hideTok(t); });

    // Labels/auras stay for context: highlight the filtered category if any, else dim
    labels.forEach((l) => { if (fcat && l.dataset.code === fcat.code) showTok(l); else dimCtx(l); });
    auras.forEach((a)  => { if (fcat && a.dataset.cat === codeToCat[fcat.code]) showTok(a); else dimCtx(a); });

    onMatchCount?.(count);
    setNoResults(count === 0);
  }, [filters, subs]);

  // C3: Escape key clears filters
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && onClear) { onClear(); setMiniCard(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClear]);

  return (
    <div style={{ position: "relative" }}>
      {/* C1: Loading spinner */}
      {loading && (
        <div className="pmap-spinner">
          <div className="pmap-spinner-ring" />
        </div>
      )}

      {/* C2: No results message */}
      {noResults && (
        <div className="pmap-no-results">
          No vendors match your filters
        </div>
      )}

      {/* A1: Mini-card */}
      {miniCard && (
        <div className="pmap-overlay" onClick={() => setMiniCard(null)}>
          <div className="pmap-card" onClick={e => e.stopPropagation()}>
            <button className="pmap-card-close" onClick={() => setMiniCard(null)}>✕</button>
            <img
              src={cld(miniCard.logo, { w: 220 })}
              alt={miniCard.name}
              className="pmap-card-logo"
            />
            <div className="pmap-card-name">{miniCard.name}</div>
            <div className="pmap-card-badge" style={{ background: `hsl(${miniCard.hue},70%,93%)`, color: `hsl(${miniCard.hue},60%,32%)` }}>
              {miniCard.code} · {miniCard.full}
            </div>
            <a href={miniCard.href} className="pmap-card-cta">
              View profile
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>
          </div>
        </div>
      )}

      <div className={"pmap-root" + (multiplayer ? " pmap-root--mp" : "")} ref={rootRef}>
        <div className="circuit" />
        <div className="titleglow" />
        <div className="auras" />
        <svg className="deco" preserveAspectRatio="none">
          <defs>
            <radialGradient id="lfade" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#243f6b" stopOpacity=".5" />
              <stop offset="70%" stopColor="#243f6b" stopOpacity=".26" />
              <stop offset="100%" stopColor="#243f6b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div className="center">
          <h1>
            THE TREASURY TECHNOLOGY LANDSCAPE
            {multiplayer && <span className="mp-badge">MULTIPLAYER MAP</span>}
          </h1>
        </div>
        <div className="tip" />
      </div>

      <style jsx global>{`
        /* ── Loading spinner ── */
        .pmap-spinner {
          position: absolute; inset: 0; z-index: 20;
          display: flex; align-items: center; justify-content: center;
          background: rgba(238,242,249,.7);
        }
        .pmap-spinner-ring {
          width: 48px; height: 48px; border-radius: 50%;
          border: 4px solid #E1E7F1;
          border-top-color: #2f6fe0;
          animation: spin .8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── No results ── */
        .pmap-no-results {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20; background: rgba(255,255,255,.92);
          border: 1px solid #E1E7F1; border-radius: 12px;
          padding: 18px 32px; font-size: 15px; color: #3a4a66;
          box-shadow: 0 8px 30px -8px rgba(10,26,51,.12);
        }

        /* ── Mini-card overlay ── */
        .pmap-overlay {
          position: absolute; inset: 0; z-index: 30;
          background: rgba(10,26,51,.35);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(3px);
          animation: fadeIn .18s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pmap-card {
          background: #fff; border-radius: 18px;
          padding: 32px 28px 28px;
          box-shadow: 0 24px 60px -12px rgba(10,26,51,.3);
          display: flex; flex-direction: column; align-items: center;
          gap: 14px; min-width: 260px; max-width: 320px;
          position: relative;
          animation: cardIn .22s ease;
        }
        @keyframes cardIn { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pmap-card-close {
          position: absolute; top: 12px; right: 14px;
          background: none; border: none; cursor: pointer;
          color: #8a93a6; font-size: 16px; line-height: 1;
          transition: color .15s;
        }
        .pmap-card-close:hover { color: #0e2c5c; }
        .pmap-card-logo {
          max-width: 180px; max-height: 80px; object-fit: contain;
        }
        .pmap-card-name {
          font-size: 18px; font-weight: 700; color: #0e2c5c;
          text-align: center;
        }
        .pmap-card-badge {
          font-size: 12px; font-weight: 600; padding: 5px 14px;
          border-radius: 100px; text-align: center;
        }
        .pmap-card-cta {
          display: inline-flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #4D8DFF, #2f6fe0);
          color: #fff; padding: 11px 24px; border-radius: 100px;
          font-weight: 600; font-size: 14px; text-decoration: none;
          box-shadow: 0 6px 18px -6px rgba(47,111,224,.65);
          transition: transform .2s, box-shadow .2s;
          margin-top: 4px;
        }
        .pmap-card-cta:hover { transform: translateY(-2px); color: #fff; }

        /* ── Map root ── */
        .pmap-root {
          position: relative; height: 1150px; overflow: hidden;
          background: radial-gradient(ellipse 80% 76% at 50% 50%, #fbfdff 0%, #e7eef8 50%, #d2ddec 100%);
          font-family: 'Chivo', sans-serif; color: #0a1a33;
        }
        /* Multiplayer map: green circuit-board theme (echoes the original) */
        .pmap-root.pmap-root--mp {
          height: 1200px;
          background: radial-gradient(ellipse 82% 78% at 50% 50%, #eaf6ec 0%, #bfe3c6 52%, #9ccfa6 100%);
        }
        .pmap-root.pmap-root--mp .circuit { opacity: .07; filter: hue-rotate(85deg); }
        .pmap-root.pmap-root--mp .titleglow {
          background: radial-gradient(ellipse, rgba(240,250,242,.95) 0%, rgba(240,250,242,.5) 50%, transparent 76%);
        }
        .pmap-root .circuit {
          position: absolute; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27220%27%20height%3D%27220%27%20viewBox%3D%270%200%20220%20220%27%3E%3Cg%20fill%3D%27none%27%20stroke%3D%27%233a5c93%27%20stroke-width%3D%271.2%27%3E%3Cpath%20d%3D%27M12%2044H96V120H188M44%2012V76H128V160M0%20176H76V128M220%2064H160V20M160%20220V150H108M220%20188H128M188%200V40M12%20200H64V168%27/%3E%3C/g%3E%3Cg%20fill%3D%27%233a5c93%27%3E%3Ccircle%20cx%3D%2796%27%20cy%3D%27120%27%20r%3D%273%27/%3E%3Ccircle%20cx%3D%27128%27%20cy%3D%2776%27%20r%3D%273%27/%3E%3Ccircle%20cx%3D%2776%27%20cy%3D%27128%27%20r%3D%273%27/%3E%3Ccircle%20cx%3D%27160%27%20cy%3D%2720%27%20r%3D%273%27/%3E%3Ccircle%20cx%3D%27128%27%20cy%3D%27160%27%20r%3D%273%27/%3E%3Ccircle%20cx%3D%2744%27%20cy%3D%2744%27%20r%3D%272.6%27/%3E%3Ccircle%20cx%3D%2764%27%20cy%3D%27168%27%20r%3D%272.6%27/%3E%3C/g%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 200px 200px; opacity: .05;
        }
        .pmap-root .titleglow {
          position: absolute; left: 50%; top: 50%; width: 680px; height: 340px;
          transform: translate(-50%,-50%); z-index: 1;
          background: radial-gradient(ellipse, rgba(244,248,253,.95) 0%, rgba(244,248,253,.55) 50%, transparent 76%);
          pointer-events: none;
        }
        .pmap-root .auras { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .pmap-root .aura {
          position: absolute; border-radius: 50%; transform: translate(-50%,-50%);
          filter: blur(58px); opacity: .2; transition: opacity .3s;
        }
        .pmap-root .deco {
          position: absolute; inset: 0; z-index: 3; width: 100%; height: 100%; pointer-events: none;
        }
        .pmap-root .center {
          position: absolute; transform: translate(-50%,-50%); z-index: 5;
          text-align: center; width: auto; white-space: nowrap; pointer-events: none;
        }
        .pmap-root .center h1 {
          font-family: 'Oswald', sans-serif; font-weight: 500; font-size: 40px;
          letter-spacing: .18em; line-height: 1; color: #0e2c5c; white-space: nowrap;
          text-shadow: 0 2px 26px rgba(255,255,255,.9);
        }
        .pmap-root .center h1 .mp-badge {
          display: block; margin: 14px auto 0; width: fit-content;
          font-size: 23px; font-weight: 700; letter-spacing: .14em;
          color: #fff; background: linear-gradient(135deg, #17a87f, #0e7a5b);
          padding: 7px 20px; border-radius: 5px; white-space: nowrap;
          text-shadow: none; box-shadow: 0 6px 20px -6px rgba(14,122,91,.6);
        }
        .pmap-root .clabel {
          position: absolute; z-index: 8; transform: translate(-50%,-50%);
          text-align: center; width: 150px; cursor: pointer; transition: opacity .3s;
        }
        .pmap-root .clabel .cn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 25px;
          letter-spacing: .03em; color: #0d2342; text-transform: uppercase; line-height: 1;
        }
        .pmap-root .clabel.on .cn { color: #2f6fe0; }
        .pmap-root .clabel .dot {
          width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0;
          box-shadow: 0 0 10px var(--dot);
        }
        .pmap-root .clabel .ct {
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #52647f;
          margin-top: 5px; font-weight: 500; line-height: 1.25;
        }
        .pmap-root .clabel .chip {
          display: inline-flex; align-items: center; gap: 4px; margin-top: 7px;
          font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
          color: #1f4a7a; background: rgba(255,255,255,.72); border: 1px solid var(--cc);
          border-radius: 100px; padding: 3px 9px; box-shadow: 0 2px 8px rgba(20,40,80,.08);
          transition: background .2s, color .2s;
        }
        .pmap-root .clabel.on .chip {
          background: var(--cc); color: #fff;
        }
        .pmap-root .tok {
          position: absolute; z-index: 6; transform: translate(-50%,-50%);
          cursor: pointer; display: grid; place-items: center;
          transition: transform .18s, filter .18s, opacity .3s;
          /* A3: entry animation */
          animation: tokIn .45s ease both;
          animation-delay: var(--delay, 0ms);
        }
        @keyframes tokIn {
          from { opacity: 0; transform: translate(-50%,-50%) scale(.7); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        .pmap-root .tok img {
          max-width: 100%; max-height: 100%; object-fit: contain;
          filter: drop-shadow(0 1px 2px rgba(20,40,80,.12));
        }
        .pmap-root .tok:hover { transform: translate(-50%,-50%) scale(1.75); z-index: 40; }
        .pmap-root .tok:hover img { filter: drop-shadow(0 5px 16px var(--tglow)); }
        .pmap-root.focusing .clabel.dim { opacity: .2; }
        .pmap-root.focusing .tok.dim { opacity: .1; }
        /* Filtered-out tokens fully hidden — !important beats the tokIn reveal animation */
        .pmap-root .tok.filtered-out { opacity: 0 !important; pointer-events: none !important; }
        .pmap-root.focusing .aura.dim { opacity: .03; }
        .pmap-root.focusing .aura.on  { opacity: .4; }
        .pmap-root .tip {
          position: fixed; z-index: 100; background: #0e1f3a;
          border: 1px solid rgba(120,160,220,.3); border-radius: 9px;
          padding: 9px 14px; font-size: 12px; font-weight: 600; color: #fff;
          pointer-events: none; opacity: 0; transition: opacity .15s;
          white-space: nowrap; box-shadow: 0 14px 38px rgba(0,0,0,.35);
          line-height: 1.5;
        }
        .pmap-root .tip .sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #5fd0e0; display: block; }
        .pmap-root .tip .sub-action { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #a0b8d8; display: block; margin-top: 2px; }
      `}</style>
    </div>
  );
}
