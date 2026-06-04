"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { truncateHtmlString } from "../../utils";
import { apiGetMainPublications } from "@/app/service/apiGetMainPublication";
import { apiUpdateMainPublication } from "@/app/service/apiUpdateMainPublication";
import { apiGetAllCompanies } from "@/app/service/apiGetAllCompanies";
import { apiGetAllVideosByCompanyId } from "@/app/service/apiGetAllVideosByCompanyId";
import { apiGetAllArticlesByCompanyId } from "@/app/service/apiGetAllArticlesByCompanyId";

const isVideo = (p) => !!p?.url;
const pubHref = (p) => (isVideo(p) ? `/publication/video/${p?.id}` : `/publication/article/${p?.id}`);

export default function BodyPublicationsControl() {
  const [mains, setMains] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [modalSlot, setModalSlot] = useState(null); // 1-based slot index
  const [toast, setToast] = useState(null);

  const loadMains = async () => setMains((await apiGetMainPublications()) || []);

  useEffect(() => {
    loadMains();
    (async () => {
      const c = await apiGetAllCompanies();
      setCompanies(Array.isArray(c) ? c.sort((a, b) => (a.name || "").localeCompare(b.name || "")) : []);
    })();
  }, []);

  const showToast = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3000); };
  const onSaved = async () => { await loadMains(); setModalSlot(null); showToast("Featured publication updated."); };

  return (
    <div className="pc">
      <div className="pc-inner">
        <header className="pc-head">
          <h1>Publications control</h1>
          <p>Choose the articles &amp; videos featured on the Insights page. Only <b>live</b> publications can be featured.</p>
        </header>

        <div className="pc-card">
          {mains === null ? (
            <p className="pc-muted pc-pad">Loading…</p>
          ) : mains.length === 0 ? (
            <p className="pc-muted pc-pad">No featured slots configured.</p>
          ) : (
            <div className="pc-list">
              {mains.map((p, i) => (
                <div className="pc-row" key={i}>
                  <span className="pc-slot">#{i + 1}</span>
                  <div className="pc-main">
                    <span className={`pc-type ${isVideo(p) ? "vid" : "art"}`}>{isVideo(p) ? "Video" : "Article"}</span>
                    <span className="pc-title">{p?.title ? truncateHtmlString(p.title, 90) : <em className="pc-muted">Empty</em>}</span>
                  </div>
                  {p?.id && (
                    <a className="pc-view" href={pubHref(p)} target="_blank" rel="noopener noreferrer">View ↗</a>
                  )}
                  <button className="pc-change" onClick={() => setModalSlot(i + 1)}>Change</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalSlot != null && (
        <ChangeModal slot={modalSlot} companies={companies} onClose={() => setModalSlot(null)} onSaved={onSaved} />
      )}
      {toast && <div className={`pc-toast ${toast.kind}`}>{toast.msg}</div>}

      <style jsx>{`
        .pc { min-height: 70vh; background: radial-gradient(ellipse 100% 45% at 50% 0%, #eef4ff 0%, #eef2f9 55%); padding: 44px 20px 70px; font-family: 'Chivo', system-ui, -apple-system, sans-serif; }
        .pc-inner { max-width: 820px; margin: 0 auto; }
        .pc-head { text-align: center; margin-bottom: 26px; }
        .pc-head h1 { font-size: 30px; font-weight: 800; color: #0e2c5c; margin: 0 0 8px; letter-spacing: -.01em; }
        .pc-head p { font-size: 14.5px; color: #5a6a85; margin: 0; }
        .pc-card { background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; box-shadow: 0 10px 34px -18px rgba(10,26,51,.18); overflow: hidden; }
        .pc-muted { color: #8a93a6; }
        .pc-pad { padding: 28px; text-align: center; font-size: 14px; }
        .pc-list { display: flex; flex-direction: column; }
        .pc-row { display: flex; align-items: center; gap: 14px; padding: 16px 22px; border-bottom: 1px solid #f2f5fa; }
        .pc-row:last-child { border-bottom: none; }
        .pc-slot { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #8a93a6; flex-shrink: 0; width: 34px; }
        .pc-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; }
        .pc-type { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 100px; flex-shrink: 0; text-transform: uppercase; letter-spacing: .04em; }
        .pc-type.vid { background: #fdeee0; color: #b06a18; }
        .pc-type.art { background: #e9f0fc; color: #2f6fe0; }
        .pc-title { font-size: 14px; color: #0e2c5c; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pc-view { font-size: 12.5px; color: #2f6fe0; text-decoration: none; font-weight: 600; flex-shrink: 0; }
        .pc-view:hover { text-decoration: underline; }
        .pc-change { flex-shrink: 0; background: linear-gradient(135deg,#4D8DFF,#2f6fe0); color: #fff; border: none; padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(47,111,224,.55); transition: transform .15s; }
        .pc-change:hover { transform: translateY(-1px); }
        .pc-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 320; padding: 13px 22px; border-radius: 100px; font-size: 14px; font-weight: 600; color: #fff; box-shadow: 0 12px 30px -8px rgba(10,26,51,.4); }
        .pc-toast.ok { background: #1f8a52; }
        .pc-toast.err { background: #c0392b; }
        @media (max-width: 560px) {
          .pc-row { flex-wrap: wrap; }
          .pc-main { order: 3; flex-basis: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── Change-featured modal ────────────────────────────────────────────────────
function ChangeModal({ slot, companies, onClose, onSaved }) {
  const [companyId, setCompanyId] = useState(null);
  const [pubs, setPubs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); // { id, isArticle }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!companyId) { setPubs(null); setSelected(null); return; }
    setLoading(true);
    (async () => {
      const [vids, arts] = await Promise.all([
        apiGetAllVideosByCompanyId(companyId).catch(() => []),
        apiGetAllArticlesByCompanyId(companyId).catch(() => []),
      ]);
      const live = [
        ...(Array.isArray(vids) ? vids : []).filter((v) => v.live).map((v) => ({ ...v, isArticle: false })),
        ...(Array.isArray(arts) ? arts : []).filter((a) => a.live).map((a) => ({ ...a, isArticle: true })),
      ];
      setPubs(live);
      setLoading(false);
    })();
  }, [companyId]);

  const save = async () => {
    if (!selected) return;
    setSaving(true); setError("");
    try {
      const res = await apiUpdateMainPublication(slot, { publicationId: selected.id, isArticle: selected.isArticle });
      if (res?.status === 200) { onSaved(); return; }
      setError("Could not update. Please try again.");
    } catch (_) { setError("Could not update. Please try again."); }
    setSaving(false);
  };

  return (
    <div className="pcm-back" onClick={() => !saving && onClose()}>
      <div className="pcm" onClick={(e) => e.stopPropagation()}>
        <div className="pcm-head">
          <h3>Featured publication · slot #{slot}</h3>
          <button className="pcm-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <CompanyPicker companies={companies} value={companyId} onChange={setCompanyId} />

        <div className="pcm-body">
          {!companyId ? (
            <p className="pcm-muted">Pick a company to see its live publications.</p>
          ) : loading ? (
            <p className="pcm-muted">Loading publications…</p>
          ) : pubs && pubs.length === 0 ? (
            <p className="pcm-muted">This company has no live publications.</p>
          ) : (
            <div className="pcm-list">
              {pubs?.map((p) => {
                const sel = selected && selected.id === p.id && selected.isArticle === p.isArticle;
                return (
                  <label key={`${p.isArticle ? "a" : "v"}-${p.id}`} className={`pcm-opt ${sel ? "sel" : ""}`}>
                    <input type="radio" name="pub" checked={!!sel} onChange={() => setSelected({ id: p.id, isArticle: p.isArticle })} />
                    <span className={`pcm-type ${p.isArticle ? "art" : "vid"}`}>{p.isArticle ? "Article" : "Video"}</span>
                    <span className="pcm-title">{p.title}</span>
                    <a className="pcm-view" href={p.isArticle ? `/publication/article/${p.id}` : `/publication/video/${p.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>View ↗</a>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {error && <p className="pcm-err">{error}</p>}
        <div className="pcm-actions">
          <button className="pcm-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="pcm-save" onClick={save} disabled={!selected || saving}>{saving ? "Saving…" : "Set as featured"}</button>
        </div>
      </div>

      <style jsx>{`
        .pcm-back { position: fixed; inset: 0; z-index: 400; background: rgba(10,26,51,.42); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Chivo', system-ui, sans-serif; }
        .pcm { background: #fff; border-radius: 18px; width: min(640px, 100%); max-height: 86vh; display: flex; flex-direction: column; padding: 24px 26px; box-shadow: 0 30px 80px -16px rgba(10,26,51,.4); }
        .pcm-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .pcm-head h3 { font-size: 18px; font-weight: 700; color: #0e2c5c; margin: 0; }
        .pcm-x { background: #f1f4f9; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; color: #5a6a85; }
        .pcm-x:hover { background: #e3e9f3; color: #0e2c5c; }
        .pcm-body { flex: 1; overflow-y: auto; margin-top: 14px; min-height: 80px; }
        .pcm-muted { color: #8a93a6; font-size: 14px; padding: 16px 4px; }
        .pcm-list { display: flex; flex-direction: column; gap: 8px; }
        .pcm-opt { display: flex; align-items: center; gap: 11px; padding: 11px 14px; border: 1.5px solid #eef2f8; border-radius: 12px; cursor: pointer; transition: border-color .15s, background .15s; }
        .pcm-opt:hover { border-color: #cdd9ec; }
        .pcm-opt.sel { border-color: #2f6fe0; background: #f4f8ff; }
        .pcm-type { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px; flex-shrink: 0; text-transform: uppercase; }
        .pcm-type.vid { background: #fdeee0; color: #b06a18; }
        .pcm-type.art { background: #e9f0fc; color: #2f6fe0; }
        .pcm-title { flex: 1; min-width: 0; font-size: 13.5px; color: #0e2c5c; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pcm-view { font-size: 12px; color: #2f6fe0; text-decoration: none; flex-shrink: 0; }
        .pcm-view:hover { text-decoration: underline; }
        .pcm-err { color: #c0392b; font-size: 13px; margin: 8px 0 0; }
        .pcm-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
        .pcm-ghost { background: #f1f4f9; border: none; border-radius: 100px; padding: 11px 22px; font-weight: 600; color: #2a3c5a; cursor: pointer; }
        .pcm-save { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); border: none; border-radius: 100px; padding: 11px 24px; font-weight: 600; color: #fff; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(47,111,224,.55); }
        .pcm-save:disabled { opacity: .5; cursor: default; box-shadow: none; }
      `}</style>
    </div>
  );
}

// ── Searchable company picker ────────────────────────────────────────────────
function CompanyPicker({ companies, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const selected = companies.find((c) => String(c.id) === String(value));
  const shown = useMemo(
    () => (q.trim() ? companies.filter((c) => (c.name || "").toLowerCase().includes(q.toLowerCase().trim())) : companies),
    [companies, q]
  );
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 15px", borderRadius: 12, border: `1.5px solid ${selected ? "#2f6fe0" : "#e3e9f2"}`, background: selected ? "#f4f8ff" : "#f7f9fc", cursor: "pointer", fontSize: 14.5, color: selected ? "#0e2c5c" : "#9aa3b5", fontWeight: selected ? 600 : 400 }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected ? selected.name : "Select a company"}</span>
        <span style={{ color: "#8a93a6" }}>▾</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60, background: "#fff", border: "1px solid #e1e7f1", borderRadius: 12, boxShadow: "0 16px 44px -12px rgba(10,26,51,.24)", overflow: "hidden" }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
            style={{ width: "100%", border: "none", borderBottom: "1px solid #f0f3f8", outline: "none", padding: "11px 14px", fontSize: 14, color: "#0e2c5c", boxSizing: "border-box" }} />
          <div style={{ maxHeight: 240, overflowY: "auto", padding: 4 }}>
            {shown.slice(0, 60).map((c) => (
              <div key={c.id} onClick={() => { onChange(c.id); setOpen(false); setQ(""); }}
                style={{ padding: "9px 12px", borderRadius: 8, fontSize: 13.5, color: String(c.id) === String(value) ? "#2f6fe0" : "#3a4a66", fontWeight: String(c.id) === String(value) ? 600 : 400, cursor: "pointer", background: String(c.id) === String(value) ? "#eef4ff" : "transparent" }}>
                {c.name}
              </div>
            ))}
            {!shown.length && <div style={{ padding: "10px 12px", color: "#9aa3b5", fontSize: 13 }}>No match</div>}
          </div>
        </div>
      )}
    </div>
  );
}
