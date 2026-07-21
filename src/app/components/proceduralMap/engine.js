// Procedural constellation engine · ported & reworked from the validated
// design mock (treasurymap-A.html). Every query is scoped to the `root`
// element passed in, so it is safe inside React.
//
// Placement strategy (guarantees, per acceptance criteria):
//  - Logos are packed on a polar GRID inside each category's angular wedge.
//    Grid spacing >= logo size => NO logo-logo overlap (no relaxation pass
//    that could push a logo out of its sector).
//  - Each slot is angularly clamped to [wedgeStart+pad, wedgeEnd-pad] so a
//    logo never touches/crosses the dashed separator line.
//  - Per-category logo SCALE: each category shrinks its logos only as much
//    as needed to fit N = min(total, cap) logos. Sparse categories stay full
//    size; only dense ones (TRMS, TR, OTS, CFF) shrink.
//
// Public API:
//   buildMap(root, cats, { cap, navigate })  -> render the constellation
//   teardownMap(root)                         -> remove generated nodes
//
// `cats` shape: [{ code, full, hue, total, items: [{ n, i, href }] }]
import { cld } from "../../utils/cloudinary";

const NS = "http://www.w3.org/2000/svg";
const TAU = 2 * Math.PI;

const P = {
  innerMin: 95, logoMargin: 14,
  labelInset: 30, padT: 50, padB: 24, padX: 44, angleFloor: 24, cap: 30,
};

// Base logo cell (at scale 1.0). Adaptive scale shrinks these per category.
// Tuned (with map height 1150) so EVERY vendor of a category fits without
// overlap and without silent drops · verified across screen widths ≥1280.
const CELL = { w: 80, h: 46, imgW: 76, imgH: 42 };
const H_GAP = 4;    // horizontal gap between logos on a ring
const V_GAP = 5;    // radial gap between rings
const SEP_GAP = 6;  // clearance kept from the wedge separator line (px)
const S_MIN = 0.46; // smallest allowed logo scale (densest cats shrink to this)

// Paying clients all target the SAME absolute logo-box width (internal px),
// whatever their category's density · so a paid logo looks consistent across the
// map instead of ballooning in sparse wedges. A paid logo is never shrunk below
// its category's base size, and never grown past what the local grid can absorb
// without overlapping or dropping a vendor (see placement). 64 ≈ the FSC paid
// size the sizing was tuned against (~45px on screen).
const PAID_TARGET_W = 64;

export function teardownMap(root) {
  if (!root) return;
  root.querySelectorAll(".tok,.clabel,.aura").forEach((e) => e.remove());
  const deco = root.querySelector(".deco");
  if (deco) deco.querySelectorAll("line,path.sector").forEach((e) => e.remove());
}

export function buildMap(root, cats, opts = {}) {
  if (!root || !cats || !cats.length) return;
  const cap = opts.cap || P.cap;
  const navigate = opts.navigate || (() => {});

  const map = root;
  const deco = root.querySelector(".deco");
  const auras = root.querySelector(".auras");
  const tip = root.querySelector(".tip");

  const W = map.clientWidth, H = map.clientHeight;
  if (!W || !H) return;
  const cx = W / 2, cy = (P.padT + (H - P.padB)) / 2;
  const hx = (W - 2 * P.padX) / 2, hy = ((H - P.padB) - P.padT) / 2;
  const maxR = Math.sqrt(hx * hx + hy * hy);

  deco.setAttribute("viewBox", "0 0 " + W + " " + H);
  const grad = deco.querySelector("#lfade");
  grad.setAttribute("cx", cx); grad.setAttribute("cy", cy);
  grad.setAttribute("r", maxR);

  const ce = root.querySelector(".center");
  ce.style.left = cx + "px"; ce.style.top = cy + "px";

  // measure real title box -> tight inner radius (clears the title).
  // Use the whole .center box (title + optional MULTIPLAYER badge) so the
  // exclusion zone covers everything rendered at the centre.
  const _h1 = ce.querySelector("h1");
  const _tb = ce.getBoundingClientRect();
  const _mb = map.getBoundingClientRect();
  const TITLE_HALF_W = _tb.width / 2, TITLE_HALF_H = _tb.height / 2;
  const TMARGIN = 22;
  const titleAx = TITLE_HALF_W + TMARGIN, titleAy = TITLE_HALF_H + TMARGIN;

  const _glow = root.querySelector(".titleglow");
  if (_glow) {
    _glow.style.width = (TITLE_HALF_W * 2 + 130) + "px";
    _glow.style.height = (_tb.height + 110) + "px";
  }
  const _cyPct = ((cy - _mb.top) / _mb.height * 100).toFixed(2);
  deco.style.webkitMaskImage =
    "radial-gradient(ellipse " + titleAx + "px " + titleAy + "px at 50% " + _cyPct +
    "%, transparent 0, transparent 92%, #000 100%)";
  deco.style.maskImage = deco.style.webkitMaskImage;

  // radius of the bounding ellipse along angle t
  function edgeR(t) {
    const c = Math.cos(t), s = Math.sin(t);
    const rx = Math.abs(c) < 1e-6 ? 1e9 : hx / Math.abs(c);
    const ry = Math.abs(s) < 1e-6 ? 1e9 : hy / Math.abs(s);
    return Math.min(rx, ry);
  }
  // inner radius along angle (clears the title ellipse)
  function innerAt(ang) {
    return Math.max(
      P.innerMin,
      1 / Math.sqrt(Math.pow(Math.cos(ang) / titleAx, 2) + Math.pow(Math.sin(ang) / titleAy, 2)) + 24
    );
  }

  // category wedge angles, weighted by size (clamped) so big cats get more arc
  const weights = cats.map((c) => Math.max(Math.min(c.total, cap), P.angleFloor));
  const sumW = weights.reduce((a, b) => a + b, 0);
  const base = -Math.PI / 2 - (weights[0] / sumW * TAU) / 2;
  const starts = [], wid = [];
  let c0 = base;
  cats.forEach((c, i) => { wid[i] = weights[i] / sumW * TAU; starts[i] = c0; c0 += wid[i]; });

  // hard title-rectangle exclusion (map-local) · covers the full centre box
  const _cb = ce.getBoundingClientRect();
  const TR = {
    l: _cb.left - _mb.left - 26,
    t: _cb.top - _mb.top - 20,
    r: _cb.right - _mb.left + 26,
    b: _cb.bottom - _mb.top + 20,
  };

  // Pre-compute FIXED label centres for ALL categories before placing any logo.
  // Labels sit at 88% of the edge radius on each wedge bisector.
  // Estimated label bounding box: 160×72px (code + name + chip).
  const LAB_HW = 80, LAB_HH = 36; // half-width / half-height of label box + margin
  const labelZones = cats.map((_, i) => {
    const theta = starts[i] + wid[i] / 2;
    const r = edgeR(theta) * 0.88;
    return { x: cx + Math.cos(theta) * r, y: cy + Math.sin(theta) * r };
  });

  // Returns true if a logo bounding-box at (x,y) overlaps the title or any label zone.
  const hitsExclusion = (x, y, halfW, halfH) => {
    // title
    if (x + halfW > TR.l && x - halfW < TR.r && y + halfH > TR.t && y - halfH < TR.b) return true;
    // labels
    for (const lz of labelZones) {
      if (Math.abs(x - lz.x) < halfW + LAB_HW + 4 &&
          Math.abs(y - lz.y) < halfH + LAB_HH + 4) return true;
    }
    return false;
  };

  // Generate candidate positions for category i at scale s, then greedily
  // accept only non-overlapping ones (pixel-exact bounding-box check).
  function layoutSlots(i, s) {
    const logoW = CELL.w * s, logoH = CELL.h * s;
    const rowStep = logoH + V_GAP;
    const halfW = logoW / 2, halfH = logoH / 2;
    const minChord = logoW + H_GAP;
    const a0 = starts[i], a1 = starts[i] + wid[i], theta = a0 + wid[i] / 2;
    const rStart = innerAt(theta);

    // 1. Generate all geometrically valid candidate positions
    const candidates = [];
    for (let r = rStart; r <= maxR; r += rowStep) {
      const sinHalf = minChord / (2 * r);
      if (sinHalf >= 1) continue;
      const dAng = 2 * Math.asin(sinHalf);
      const angPad = Math.asin(Math.min((halfW + SEP_GAP) / r, 1));
      const lo = a0 + angPad, hi = a1 - angPad;
      if (hi <= lo) continue;
      const n = Math.floor((hi - lo) / dAng) + 1;
      if (n <= 0) continue;
      const mid = (lo + hi) / 2;
      let anyValid = false;
      for (let j = 0; j < n; j++) {
        const ang = mid + (j - (n - 1) / 2) * dAng;
        if (ang < lo || ang > hi) continue;
        if (r > edgeR(ang) - P.logoMargin) continue;
        const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
        if (hitsExclusion(x, y, halfW, halfH)) continue;
        candidates.push({ x, y, r });
        anyValid = true;
      }
      if (!anyValid && r > edgeR(theta)) break;
    }

    // 2. Greedy acceptance: keep a slot only if it doesn't overlap any accepted slot
    const accepted = [];
    for (const c of candidates) {
      const overlaps = accepted.some(a =>
        Math.abs(a.x - c.x) < logoW + H_GAP &&
        Math.abs(a.y - c.y) < logoH + V_GAP
      );
      if (!overlaps) accepted.push(c);
    }
    return accepted;
  }

  let revealIndex = 0; // global counter → logos appear one after another (progressive reveal)

  cats.forEach((c, i) => {
    const theta = starts[i] + wid[i] / 2, eR = edgeR(theta);
    const N = Math.min(c.items.length, cap);

    // --- separator line at the wedge's starting boundary ---
    const bAng = starts[i], i0 = innerAt(bAng);
    const ln = document.createElementNS(NS, "line");
    ln.dataset.cat = i;
    ln.setAttribute("x1", cx + Math.cos(bAng) * i0);
    ln.setAttribute("y1", cy + Math.sin(bAng) * i0);
    ln.setAttribute("x2", cx + Math.cos(bAng) * edgeR(bAng));
    ln.setAttribute("y2", cy + Math.sin(bAng) * edgeR(bAng));
    ln.setAttribute("stroke", "url(#lfade)");
    ln.setAttribute("stroke-width", "2");
    ln.setAttribute("stroke-dasharray", "0.1 7");
    ln.setAttribute("stroke-linecap", "round");
    deco.appendChild(ln);

    // --- aura blob ---
    const aR = Math.min(eR * 0.5, 300);
    const au = document.createElement("div");
    au.className = "aura"; au.dataset.cat = i;
    const sz = 150 + Math.min(c.total, cap) * 6;
    au.style.width = sz + "px"; au.style.height = sz + "px";
    au.style.left = (cx + Math.cos(theta) * aR) + "px";
    au.style.top = (cy + Math.sin(theta) * aR) + "px";
    au.style.background = "radial-gradient(circle, hsla(" + c.hue + ",72%,52%,.55), transparent 70%)";
    auras.appendChild(au);

    // --- pick the largest scale that fits N logos in this wedge ---
    // Reserve extra slots so an enlarged paid logo can swallow the neighbours it
    // covers without ever dropping a vendor.
    const paidCount = c.items.slice(0, N).filter((it) => it.paid).length;
    const need = N + paidCount;
    let s = 1.0;
    let slots = layoutSlots(i, s);
    while (s > S_MIN && slots.length < need) {
      s = Math.round((s - 0.05) * 100) / 100;
      slots = layoutSlots(i, s);
    }

    // --- place N logos, enlarging paying clients where there is spare room ---
    const remaining = slots.slice();
    let placed = 0;
    while (placed < N && remaining.length) {
      const sl = remaining.shift();
      const it = c.items[placed];
      const isPaid = !!it.paid;
      let f = 1;
      // Target box width for this logo (per-vendor override, else the shared
      // paid target), brought to a factor, never below the category base.
      const paidF = Math.max(1, (it.boostW || PAID_TARGET_W) / (CELL.w * s));
      if (it.bisectorR) {
        // Placed off-grid, centred on the wedge bisector (see below), so it
        // takes its full target size · nothing else occupies that spot.
        f = paidF;
      } else if (isPaid && paidF > 1) {
        // Slots this enlarged token would cover (must be freed so nothing draws
        // underneath). Only take them if enough slots remain for the vendors
        // still to place · otherwise fall back to a gap-only bump (no overlap,
        // no drop).
        const tW = CELL.w * s * paidF, tH = CELL.h * s * paidF;
        const covered = [];
        for (let k = 0; k < remaining.length; k++) {
          const o = remaining[k];
          if (Math.abs(o.x - sl.x) < (tW + CELL.w * s) / 2 + H_GAP &&
              Math.abs(o.y - sl.y) < (tH + CELL.h * s) / 2 + V_GAP) covered.push(k);
        }
        const vendorsLeft = N - placed - 1;
        if (remaining.length - covered.length >= vendorsLeft) {
          f = paidF;
          for (let j = covered.length - 1; j >= 0; j--) remaining.splice(covered[j], 1);
        } else {
          f = Math.min(paidF, Math.min(1 + (2 * H_GAP) / (CELL.w * s), 1 + (2 * V_GAP) / (CELL.h * s)));
        }
      }
      const tokW = CELL.w * s * f, tokH = CELL.h * s * f;
      const imgW = CELL.imgW * s * f, imgH = CELL.imgH * s * f;

      const t = document.createElement("div");
      t.className = "tok" + (isPaid ? " tok-paid" : ""); t.dataset.cat = i;
      // Filter metadata (comma-wrapped id lists for fast includes-check)
      t.dataset.sub    = "," + (it.sub    || []).join(",") + ",";
      t.dataset.active = "," + (it.active || []).join(",") + ",";
      t.dataset.hq     = "," + (it.hq     || []).join(",") + ",";
      // Position: grid slot by default (+ optional vertical nudge), OR centred
      // on the wedge bisector at a chosen radius for a per-vendor override.
      // Tokens are centred on their (left, top) via CSS translate(-50%), so a
      // slot/bisector point is used as-is · no half-size subtraction.
      let posX = sl.x + (it.boostDx || 0), posY = sl.y + (it.boostDy || 0);
      if (it.bisectorR) {
        posX = cx + Math.cos(theta) * it.bisectorR;
        posY = cy + Math.sin(theta) * it.bisectorR;
      }
      t.style.left = posX + "px"; t.style.top = posY + "px";
      t.style.width = tokW + "px"; t.style.height = tokH + "px";
      t.style.setProperty("--tglow", "hsla(" + c.hue + ",80%,45%,.6)");
      const img = document.createElement("img");
      img.loading = "lazy"; img.src = cld(it.i, { w: 200 }); img.alt = it.n;
      img.style.maxWidth = imgW + "px"; img.style.maxHeight = imgH + "px";
      t.appendChild(img);
      // Progressive reveal: each logo appears slightly after the previous one,
      // sweeping across the constellation as the map loads.
      const delay = revealIndex * 7;
      revealIndex += 1;
      t.style.setProperty("--delay", delay + "ms");

      t.addEventListener("mouseenter", () => {
        focusCat(i);
        // E1: enriched tooltip with "Click to view profile"
        tip.innerHTML = '<strong>' + it.n + '</strong><br><span class="sub">' +
          c.code + " · " + c.full + '</span><br><span class="sub-action">Click to view profile →</span>';
        const rb = t.getBoundingClientRect();
        const tx = rb.left + rb.width / 2 - tip.offsetWidth / 2;
        const ty = rb.top - tip.offsetHeight - 10;
        tip.style.left = Math.max(8, Math.min(window.innerWidth - tip.offsetWidth - 8, tx)) + "px";
        tip.style.top  = (ty < 8 ? rb.bottom + 10 : ty) + "px";
        tip.style.opacity = 1;
      });
      t.addEventListener("mouseleave", () => { unfocus(); tip.style.opacity = 0; });
      if (it.href) {
        t.style.cursor = "pointer";
        // A1: click opens mini-card via navigate callback (handled in React layer)
        t.addEventListener("click", () => navigate({ name: it.n, logo: it.i, code: c.code, full: c.full, href: it.href, hue: c.hue }));
      }
      map.appendChild(t); placed++;
    }

    // No silent drops: warn if the wedge could not fit every vendor.
    if (placed < N) {
      console.warn(
        `[ProceduralMap] ${c.code}: only ${placed}/${N} logos placed ` +
        `(${N - placed} dropped · wedge too tight at min scale ${S_MIN}).`
      );
    }

    // --- category label: FIXED on wedge bisector at 88% of the edge radius ---
    const labR = edgeR(theta) * 0.88;
    const lx = cx + Math.cos(theta) * labR;
    const ly = cy + Math.sin(theta) * labR;
    const lab = document.createElement("div");
    lab.className = "clabel"; lab.dataset.cat = i; lab.dataset.code = c.code;
    lab.style.left = lx + "px"; lab.style.top = ly + "px";
    lab.style.setProperty("--cc", "hsl(" + c.hue + ",60%,70%)");
    const chip = c.total > placed ? c.total + " ↗" : "" + c.total;
    lab.innerHTML =
      '<div class="cn"><span class="dot" style="--dot:hsl(' + c.hue + ',75%,55%);background:hsl(' +
      c.hue + ',75%,55%)"></span>' + c.code + "</div>" +
      '<div class="ct">' + c.full + "</div>" +
      '<div class="chip">' + chip + "</div>";
    lab.addEventListener("mouseenter", () => focusCat(i));
    lab.addEventListener("mouseleave", unfocus);
    // A2: click label → callback to React layer for persistent filter
    if (opts.onCategoryClick) {
      lab.style.cursor = "pointer";
      lab.addEventListener("click", () => opts.onCategoryClick(c.code, c.full, c.hue));
    }
    map.appendChild(lab);
  });

  // labels are fixed · no resolution pass

  function focusCat(i) {
    map.classList.add("focusing");
    map.querySelectorAll(".tok,.aura,.sector,.clabel").forEach((e) => {
      e.classList.toggle("dim", e.dataset.cat != i);
      e.classList.toggle("on", e.dataset.cat == i);
    });
  }
  function unfocus() {
    map.classList.remove("focusing");
    map.querySelectorAll(".tok,.aura,.sector,.clabel").forEach((e) => {
      e.classList.remove("dim"); e.classList.remove("on");
    });
  }
}

// Separate labels from each other and from logos; keep them on-screen.
// Labels are pushed RADIALLY (away from the map centre) so each label stays
// visually inside its own wedge sector instead of drifting sideways.
function resolveLabels(map, W, H, cx, cy) {
  const PAD_LL = 18; // min gap between two label bounding-boxes
  const PAD_LT = 6;  // min gap between a label and a logo

  const labels = [...map.querySelectorAll(".clabel")];
  const toks = [...map.querySelectorAll(".tok")].map((t) => ({
    x: parseFloat(t.style.left), y: parseFloat(t.style.top),
    w: parseFloat(t.style.width) || 60, h: parseFloat(t.style.height) || 34,
  }));
  const pos = labels.map((l) => ({
    el: l,
    x: parseFloat(l.style.left), y: parseFloat(l.style.top),
    w: l.offsetWidth || 140, h: l.offsetHeight || 60,
    // radial direction from centre · used to push outward
    ax: parseFloat(l.style.left) - cx,
    ay: parseFloat(l.style.top)  - cy,
  }));

  const clamp = (p) => {
    p.x = Math.max(p.w / 2 + 8, Math.min(W - p.w / 2 - 8, p.x));
    p.y = Math.max(64 + p.h / 2, Math.min(H - 8 - p.h / 2, p.y));
  };

  // Push label p radially outward (along its initial angle from centre)
  const pushRadial = (p, dist) => {
    const m = Math.hypot(p.ax, p.ay) || 1;
    p.x += (p.ax / m) * dist;
    p.y += (p.ay / m) * dist;
    clamp(p);
  };

  // Separate labels from logos · push radially outward
  const sepFromToks = () => {
    let moved = false;
    for (const p of pos)
      for (const t of toks) {
        const ox = (p.w / 2 + t.w / 2 + PAD_LT) - Math.abs(p.x - t.x);
        const oy = (p.h / 2 + t.h / 2 + PAD_LT) - Math.abs(p.y - t.y);
        if (ox > 0 && oy > 0) {
          pushRadial(p, Math.max(ox, oy) + 2);
          moved = true; break;
        }
      }
    return moved;
  };

  // Separate labels from each other · push each radially outward by half
  const sepFromLabels = () => {
    let moved = false;
    for (let i = 0; i < pos.length; i++)
      for (let j = i + 1; j < pos.length; j++) {
        const A = pos[i], B = pos[j];
        const ox = (A.w / 2 + B.w / 2 + PAD_LL) - Math.abs(A.x - B.x);
        const oy = (A.h / 2 + B.h / 2 + PAD_LL) - Math.abs(A.y - B.y);
        if (ox > 0 && oy > 0) {
          const push = (Math.min(ox, oy) / 2) + 2;
          pushRadial(A, push);
          pushRadial(B, push);
          moved = true;
        }
      }
    return moved;
  };

  for (let pass = 0; pass < 60; pass++) { if (!sepFromToks()) break; }
  for (let pass = 0; pass < 80; pass++) { const m = sepFromLabels(); pos.forEach(clamp); if (!m) break; }
  for (let pass = 0; pass < 60; pass++) {
    const a = sepFromToks(), b = sepFromLabels();
    pos.forEach(clamp);
    if (!a && !b) break;
  }
  pos.forEach((p) => { p.el.style.left = p.x + "px"; p.el.style.top = p.y + "px"; });
}
