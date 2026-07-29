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

// Per-vendor logo overrides for specific paying clients that asked for extra
// prominence, keyed by company id:
//   w         · target logo-box width in internal px (overrides shared paid size)
//   dx / dy   · nudge in internal px (dx>0 = right, dy>0 = lower on the map)
//   bisectorR · place the logo centred on its category's bisector (the middle of
//               the two dashed wedge lines) at this radius from the map centre
const LOGO_OVERRIDE = {
  195: { w: 81, bisectorR: 193, dx: -12 }, // Orbian · ~57px, on the FSC axis, a touch left
  242: { bisectorR: 232, dx: -42, dy: 6 }, // Surecomp · on the axis, just below-left of Orbian
};

// Whole-category vertical nudge (internal px, positive = lower on the map),
// keyed by category code · shifts every logo of that wedge down together.
const CATEGORY_NUDGE = {
  FSC: { dy: 18 },
};

// Build the per-category vendor groups.
//  - default (homepage / "Treasury Map"): 1 logo per vendor, in its MAIN category.
//  - multiplayer ("Multiplayer Map"): each vendor appears in EVERY category it
//    is active in (companyCategories) · same vendor repeated across wedges.
function toCats(companies, countries = [], multiplayer = false) {
  if (!Array.isArray(companies)) return [];
  const byId = {};
  const pushItem = (catId, c) => {
    const key = `category-${catId}`;
    if (!CAT_META[key]) return;
    if (!byId[catId]) byId[catId] = [];
    // Golden rule: one logo per vendor per category · dedupe by NAME
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
      paid: String(c.clientPackage || "").toLowerCase() === "paid",
      boostW: LOGO_OVERRIDE[c.id]?.w || 0,
      boostDx: LOGO_OVERRIDE[c.id]?.dx || 0,
      boostDy: LOGO_OVERRIDE[c.id]?.dy || 0,
      bisectorR: LOGO_OVERRIDE[c.id]?.bisectorR || 0,
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
      // Paying clients first. The map only keeps the logos that physically fit
      // its wedge (the engine drops overlapping slots, and how many fit depends
      // on the viewport), taking them in list order. Without this, order was
      // effectively "oldest record first", so recent paying clients were the
      // first to be cut and their visibility silently depended on the visitor's
      // screen size. Array.sort is stable, so the existing order is preserved
      // within the paid and unpaid groups.
      const ordered = [...items].sort((a, b) => Number(b.paid) - Number(a.paid));
      return { code: meta.code, full: meta.full, hue: meta.hue, total: ordered.length, items: ordered, catDy: CATEGORY_NUDGE[meta.code]?.dy || 0 };
    });
}

// Build groups for the Multiplayer Map from the CURATED endpoint
// (/api/v1/mapdata/multiplayerMap) · the exact same source the original
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
      // Golden rule: one logo per vendor per category · dedupe by name
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

export default function ProceduralMap({ multiplayer = false, filters, catSels = [], subs = [], onCategoryClick, onClear, onVendors, onCats, onFilterOptions, onMatchCount }) {
  const rootRef             = useRef(null);
  const catsRef             = useRef(null);   // latest category data · used by the poster export
  const router              = useRouter();
  // Use a ref for onCategoryClick so it never triggers a map rebuild
  const onCategoryClickRef  = useRef(onCategoryClick);
  useEffect(() => { onCategoryClickRef.current = onCategoryClick; }, [onCategoryClick]);
  const [loading,  setLoading]  = useState(true);
  const [miniCard, setMiniCard] = useState(null);  // A1
  const [noResults, setNoResults] = useState(false); // C2

  // A1: navigate callback · opens mini-card instead of immediate navigation
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
      catsRef.current = cats;   // expose for the poster export
      const render = () => {
        teardownMap(root);
        buildMap(root, cats, {
          cap: multiplayer ? 40 : 30,
          navigate: handleNavigate,
          onCategoryClick: (code, full, hue) => { // A2 · uses ref, no rebuild on change
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
  }, [handleNavigate, multiplayer]); // onCategoryClick intentionally excluded · handled via ref

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

    // code → cat index (from labels)
    const codeToCat = {};
    labels.forEach((l) => { codeToCat[l.dataset.code] = l.dataset.cat; });

    // Build active conditions
    const catCodes = (catSels || []).map((c) => c.code);
    const catIdxSet = new Set(catCodes.map((code) => codeToCat[code]));
    const fkw  = filters?.keyword && String(filters.keyword.value || "").trim()
      ? String(filters.keyword.value).toLowerCase().trim() : null;
    const fac  = filters?.active;
    const subVals = (subs || []).map((s) => String(s.value));
    const anyActive = !!(catCodes.length || fkw || fac || subVals.length);

    if (!anyActive) {
      root.classList.remove("focusing");
      [...toks, ...labels, ...auras].forEach(reset);
      onMatchCount?.(null);
      setNoResults(false);
      return;
    }

    const tokMatches = (t) => {
      if (catIdxSet.size && !catIdxSet.has(t.dataset.cat)) return false;
      if (fkw && !(t.querySelector("img")?.alt || "").toLowerCase().includes(fkw)) return false;
      if (fac && !(t.dataset.active || "").includes("," + fac.value + ",")) return false;
      if (subVals.length && !subVals.some((v) => (t.dataset.sub || "").includes("," + v + ","))) return false;
      return true;
    };

    root.classList.add("focusing");
    let count = 0;
    toks.forEach((t) => { if (tokMatches(t)) { showTok(t); count++; } else hideTok(t); });

    // Labels/auras stay for context: highlight selected categories, else dim
    const catCodeSet = new Set(catCodes);
    labels.forEach((l) => { if (catCodeSet.size && catCodeSet.has(l.dataset.code)) showTok(l); else dimCtx(l); });
    auras.forEach((a)  => { if (catIdxSet.size && catIdxSet.has(a.dataset.cat)) showTok(a); else dimCtx(a); });

    onMatchCount?.(count);
    setNoResults(count === 0);
  }, [filters, catSels, subs]);

  // C3: Escape key clears filters
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && onClear) { onClear(); setMiniCard(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClear]);

  // Download the FULL map as a dated PNG. We snapshot an off-screen clone (with
  // every filter stripped) + an elegant dated footer, so the export is always the
  // complete constellation and the visitor's on-screen filtered view is untouched.
  const [exporting, setExporting] = useState(false);
  const downloadMap = async () => {
    const root = rootRef.current;
    if (!root || exporting) return;
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      if (!catsRef.current || !catsRef.current.length) {
        alert("The map is still loading. Please try again in a moment.");
        setExporting(false);
        return;
      }

      // ── Poster canvas · Full HD 16:9 landscape ──
      const FRAME_W = 1920, FRAME_H = 1080;
      const LEFT_W  = 660;                 // dark branding panel
      const GREEN   = "#35e0a1";
      const NAVY    = "#0b1a36";
      // The constellation is tuned for desktop widths ≥1280; we rebuild it wide
      // (not the visitor's narrow, possibly-filtered on-screen map) so the export
      // is always the spacious landscape layout.
      const MAP_W = 1500, MAP_H = 1150;              // height 1150 = engine's tuned value
      // Browser mock-up window on the right half. Its content area matches the map
      // aspect so the constellation fills it edge-to-edge (no margins, larger logos).
      const BW = 1184, TBAR = 46;
      const CW = BW;
      const CH = Math.round(CW * MAP_H / MAP_W);      // == map aspect
      const BH = CH + TBAR;
      const BX = LEFT_W + Math.round((FRAME_W - LEFT_W - BW) / 2);
      const BY = Math.round((FRAME_H - BH) / 2);
      const mScale = Math.min(CW / MAP_W, CH / MAP_H);
      const dispW = Math.round(MAP_W * mScale), dispH = Math.round(MAP_H * mScale);

      // NB: the capture frame must live ON-SCREEN (top-left of the viewport).
      // html-to-image paints elements at their real page coordinates, so a frame
      // parked far off-screen (e.g. left:-99999px) renders entirely outside the
      // canvas → a blank PNG with no error. We hide it behind the page instead
      // (negative z-index + pointer-events:none), which does not affect the
      // capture since html-to-image serialises the DOM subtree, not the screen.
      const frame = document.createElement("div");
      frame.id = "pmap-export-frame";
      frame.style.cssText = `position:fixed;left:0;top:0;z-index:-2147483647;pointer-events:none;width:${FRAME_W}px;height:${FRAME_H}px;background:#e9eff8;font-family:'Chivo',sans-serif;overflow:hidden;`;

      // Freeze the tokIn reveal animation (fill-mode:both restarts on the fresh
      // clone and would be snapshotted mid-fade at opacity < 1).
      const freeze = document.createElement("style");
      freeze.textContent =
        "#pmap-export-frame *, #pmap-export-frame *::before, #pmap-export-frame *::after" +
        "{animation:none!important;transition:none!important;animation-delay:0s!important;}";
      frame.appendChild(freeze);

      // ── Left: dark branding panel ──
      const nCats = catsRef.current.length;
      const nProv = catsRef.current.reduce((s, c) => s + (c.total || 0), 0);
      const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      const panel = document.createElement("div");
      panel.style.cssText = `position:absolute;left:0;top:0;width:${LEFT_W}px;height:${FRAME_H}px;box-sizing:border-box;padding:74px 62px;background:linear-gradient(160deg,#0d1f42,#0a1631);display:flex;flex-direction:column;`;
      panel.innerHTML =
        `<div style="display:inline-flex;align-self:flex-start;align-items:center;gap:7px;background:#fff;padding:11px 18px;border-radius:13px;">` +
          `<span style="font-size:24px;font-weight:700;color:#0a1a33;letter-spacing:-.01em;">Treasury</span>` +
          `<span style="font-size:24px;font-weight:800;color:#0a1a33;text-transform:uppercase;letter-spacing:.03em;">MAP</span>` +
          `<svg width="18" height="18" viewBox="0 0 24 24" fill="${GREEN}"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/></svg>` +
        `</div>` +
        `<h2 style="margin:50px 0 0;font-size:62px;line-height:1.04;font-weight:800;color:#fff;letter-spacing:-.01em;">The Treasury<br/>Technology<br/>Landscape</h2>` +
        `<div style="width:92px;height:7px;background:${GREEN};border-radius:4px;margin-top:30px;"></div>` +
        `<div style="margin-top:28px;font-size:21px;font-weight:600;color:#dbe3f2;">${nCats} categories <span style="color:#5a6a86;">·</span> ${nProv} providers</div>` +
        `<div style="margin-top:12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:${GREEN};">As of ${dateStr}</div>` +
        `<div style="flex:1 1 auto;"></div>` +
        `<div style="display:inline-flex;align-self:flex-start;align-items:center;gap:12px;background:${GREEN};color:#06231a;font-size:18px;font-weight:800;padding:16px 30px;border-radius:100px;box-shadow:0 10px 30px -8px rgba(53,224,161,.5);">` +
          `Explore the full map` +
          `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06231a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>` +
        `</div>` +
        `<div style="margin-top:38px;font-size:26px;font-weight:800;color:#fff;letter-spacing:.01em;">www.treasurymap.com</div>`;
      frame.appendChild(panel);

      // ── Right: browser mock-up window ──
      const browser = document.createElement("div");
      browser.style.cssText = `position:absolute;left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 40px 90px -30px rgba(10,26,51,.45),0 6px 20px -10px rgba(10,26,51,.3);`;
      browser.innerHTML =
        `<div style="height:${TBAR}px;background:#f1f3f8;border-bottom:1px solid #e4e8f0;display:flex;align-items:center;padding:0 18px;box-sizing:border-box;">` +
          `<span style="width:12px;height:12px;border-radius:50%;background:#ff5f57;"></span>` +
          `<span style="width:12px;height:12px;border-radius:50%;background:#febc2e;margin-left:8px;"></span>` +
          `<span style="width:12px;height:12px;border-radius:50%;background:#28c840;margin-left:8px;"></span>` +
          `<div style="flex:1 1 auto;display:flex;justify-content:center;">` +
            `<div style="background:#fff;border:1px solid #e3e7ee;border-radius:8px;padding:6px 18px;font-size:13px;color:#5a6474;min-width:300px;text-align:center;">treasurymap.com</div>` +
          `</div>` +
        `</div>`;
      // Map viewport inside the browser.
      const mapClip = document.createElement("div");
      mapClip.style.cssText = `position:relative;width:${CW}px;height:${CH}px;overflow:hidden;background:#eef2f8;`;
      const mapWrap = document.createElement("div");
      mapWrap.style.cssText = `position:absolute;left:${Math.round((CW - dispW) / 2)}px;top:${Math.round((CH - dispH) / 2)}px;width:${dispW}px;height:${dispH}px;overflow:hidden;`;

      // Wide rebuild of the constellation.
      const wide = root.cloneNode(true);
      wide.classList.remove("focusing", "pmap-loading");
      wide.style.opacity = "1";
      wide.style.width = `${MAP_W}px`;
      wide.style.height = `${MAP_H}px`;
      mapWrap.appendChild(wide);
      mapClip.appendChild(mapWrap);
      browser.appendChild(mapClip);
      frame.appendChild(browser);

      document.body.appendChild(frame);

      // Re-lay out the constellation at the wide size, THEN scale to fit (scaling
      // before buildMap would corrupt the getBoundingClientRect title measurement).
      teardownMap(wide);
      buildMap(wide, catsRef.current, { cap: multiplayer ? 40 : 30 });
      // Shrink the centre watermark. buildMap has already reserved the centre at
      // full size, so scaling the title down afterwards keeps its clear band and
      // just makes the wordmark smaller and less dominant over the logos.
      const ctr = wide.querySelector(".center");
      if (ctr) ctr.style.transform = "translate(-50%,-50%) scale(0.8)";
      wide.style.transformOrigin = "top left";
      wide.style.transform = `scale(${mScale})`;

      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch {} }

      // Inline every logo as a data URI BEFORE capture. The logos are served
      // cross-origin from Cloudinary; letting html-to-image fetch them at capture
      // time is racy and often yields a logo-less (blank) export. We fetch each
      // unique URL once (CORS), convert to a data URI, and swap it into the clone
      // so the snapshot has only same-origin data — deterministic, no CORS race.
      const imgEls = [...wide.querySelectorAll("img")];
      const bySrc = new Map();
      imgEls.forEach((im) => {
        const s = im.getAttribute("src");
        if (!s || bySrc.has(s)) return;
        bySrc.set(s, fetch(s, { mode: "cors", cache: "force-cache" })
          .then((r) => (r.ok ? r.blob() : null))
          .then((b) => b && new Promise((res) => {
            const fr = new FileReader();
            fr.onload = () => res(fr.result);
            fr.onerror = () => res(null);
            fr.readAsDataURL(b);
          }))
          .catch(() => null));
      });
      const resolved = new Map();
      await Promise.race([
        Promise.all([...bySrc.entries()].map(async ([s, p]) => { resolved.set(s, await p); })),
        new Promise((r) => setTimeout(r, 15000)),
      ]);
      imgEls.forEach((im) => { const d = resolved.get(im.getAttribute("src")); if (d) im.src = d; });

      const dataUrl = await Promise.race([
        toPng(frame, {
          pixelRatio: 1,           // exact Full HD · 1920×1080
          backgroundColor: "#e9eff8",
          width: FRAME_W,
          height: FRAME_H,
          cacheBust: false,        // logos are already inlined as data URIs above
          skipFonts: true,         // keep already-rendered fonts; avoids a cross-origin CSS read
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("Map export timed out")), 30000)),
      ]);
      if (frame.parentNode) document.body.removeChild(frame);

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `TreasuryMap-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    } catch (e) {
      console.error("Map export failed", e);
      alert("Sorry, the map could not be exported. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button className="pmap-download" onClick={downloadMap} disabled={exporting}
              title="Download the full map as a dated image">
        {exporting
          ? <span className="pmap-dl-spin" aria-hidden="true" />
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
        {exporting ? "Preparing…" : "Download map"}
      </button>

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

      <div className={"pmap-root" + (multiplayer ? " pmap-root--mp" : "") + (loading ? " pmap-loading" : "")} ref={rootRef}>
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
          <h2>
            THE TREASURY TECHNOLOGY LANDSCAPE
            {multiplayer && <span className="mp-badge">MULTIPLAYER MAP</span>}
          </h2>
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

        /* ── Download map button (elegant glass pill, top-right) ── */
        .pmap-download {
          position: absolute; top: 16px; right: 16px; z-index: 16;
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,.90);
          -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          border: 1px solid #dbe4f0; color: #0e2c5c;
          font-family: 'Chivo', sans-serif; font-size: 13.5px; font-weight: 600;
          padding: 9px 16px; border-radius: 100px; cursor: pointer;
          box-shadow: 0 6px 18px -8px rgba(10,26,51,.25);
          transition: transform .18s, box-shadow .18s, background .18s;
        }
        .pmap-download:hover:not(:disabled) {
          transform: translateY(-1px); background: #fff;
          box-shadow: 0 10px 26px -8px rgba(10,26,51,.32);
        }
        .pmap-download:disabled { opacity: .7; cursor: default; }
        .pmap-dl-spin {
          width: 15px; height: 15px; border-radius: 50%;
          border: 2px solid #cdd8ea; border-top-color: #2f6fe0;
          animation: spin .7s linear infinite;
        }
        @media (max-width: 620px) {
          .pmap-download { top: 10px; right: 10px; padding: 8px 13px; font-size: 12.5px; }
        }

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
          /* Reveal the map only once it is built and fonts are ready. The build
             and font swap happen while invisible, so their layout shifts do not
             count toward CLS (Core Web Vitals). Purely visual · no layout impact. */
          opacity: 1; transition: opacity .5s ease;
        }
        .pmap-root.pmap-loading { opacity: 0; }
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
        .pmap-root .center h2 {
          font-family: 'Oswald', sans-serif; font-weight: 500; font-size: 40px;
          letter-spacing: .18em; line-height: 1; color: #0e2c5c; white-space: nowrap;
          text-shadow: 0 2px 26px rgba(255,255,255,.9);
          margin: 0;
        }
        .pmap-root .center h2 .mp-badge {
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
        /* !important needed: the tokIn reveal animation (fill-mode:both) otherwise
           locks token opacity and overrides class-based dimming on hover. */
        .pmap-root.focusing .clabel.dim { opacity: .2 !important; }
        /* :not(.filtered-out) so this never overrides a filter-hidden token (which
           carries both .dim and .filtered-out); filtered-out must stay opacity 0. */
        .pmap-root.focusing .tok.dim:not(.filtered-out) { opacity: .1 !important; transition: opacity .18s ease; }
        /* Filtered-out tokens fully hidden · !important beats the tokIn reveal animation */
        .pmap-root .tok.filtered-out { opacity: 0 !important; pointer-events: none !important; }
        .pmap-root.focusing .aura.dim { opacity: .03 !important; }
        .pmap-root.focusing .aura.on  { opacity: .4 !important; }
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
