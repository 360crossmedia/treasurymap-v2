"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { truncateHtmlString, formatDateShort } from "../../utils";
import { publicationHref } from "../../utils/slugify";
import { apiGetMainPublications } from "@/app/service/apiGetMainPublication";
import { apiUpdateMainPublication } from "@/app/service/apiUpdateMainPublication";
import { apiRevalidatePublications } from "@/app/service/apiRevalidatePublications";
import { apiGetAllCompanies } from "@/app/service/apiGetAllCompanies";
import { apiGetAllVideosByCompanyId } from "@/app/service/apiGetAllVideosByCompanyId";
import { apiGetAllArticlesByCompanyId } from "@/app/service/apiGetAllArticlesByCompanyId";
import { apiGetAllArticles } from "@/app/service/apiGetAllArticles";
import { apiGetAllVideos } from "@/app/service/apiGetAllVideos";
import { apiDeleteArticleById } from "@/app/service/apiDeleteArticleById";
import { apiDeleteVideoById } from "@/app/service/apiDeleteVideoById";
import { setArticleId } from "@/app/store/slices/articleId.slice";
import { setVideoId } from "@/app/store/slices/videoId.slice";
import { setCompanyId } from "@/app/store/slices/companyToUpdate.slice";

const isVideo = (p) => !!p?.url;
const pubHref = (p) => publicationHref(p);

const I = {
  edit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
  back: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  star: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
  starFill: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
  up: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>,
  down: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>,
  grip: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>,
  media: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M10 8l5 3-5 3V8z"/></svg>,
};

export default function BodyPublicationsControl() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mains, setMains] = useState(null);
  const [featuring, setFeaturing] = useState(null); // pubKey while promoting
  const [reordering, setReordering] = useState(false); // while swapping featured slots
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyById, setCompanyById] = useState({});
  const [allPubs, setAllPubs] = useState(null);
  const [modalSlot, setModalSlot] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // all-publications filters
  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [sortDir, setSortDir] = useState("new"); // "new" = newest first, "old" = oldest first
  const [newKind, setNewKind] = useState(null); // "article" | "video" · opens the company picker
  const [mediaPick, setMediaPick] = useState(false); // open Media Zone → pick a company first

  // Open a company's Media Zone (per-company articles/videos manager).
  const openMediaZone = (cid) => {
    if (!cid) return;
    dispatch(setCompanyId(Number(cid)));
    try { localStorage.setItem("companyId", Number(cid)); } catch (_) {}
    router.push("/mediaZone");
  };

  // Create a new publication: pick a company, then open the editor in create mode.
  const startNew = (cid) => {
    if (!newKind || !cid) return;
    dispatch(setCompanyId(Number(cid)));
    try { localStorage.setItem("companyId", Number(cid)); } catch (_) {}
    if (newKind === "article") { dispatch(setArticleId(null)); router.push("/mediaZone/article"); }
    else { dispatch(setVideoId(null)); router.push("/mediaZone/video"); }
  };

  const loadMains = async () => setMains((await apiGetMainPublications()) || []);

  const loadAll = async () => {
    const [arts, vids] = await Promise.all([apiGetAllArticles(), apiGetAllVideos()]);
    const merged = [
      ...(Array.isArray(arts) ? arts : []).map((a) => ({ ...a, isArticle: true })),
      ...(Array.isArray(vids) ? vids : []).map((v) => ({ ...v, isArticle: false })),
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setAllPubs(merged);
  };

  useEffect(() => {
    loadMains();
    loadAll();
    (async () => {
      const c = await apiGetAllCompanies();
      const arr = Array.isArray(c) ? c.sort((a, b) => (a.name || "").localeCompare(b.name || "")) : [];
      setCompanies(arr);
      setCompanyById(Object.fromEntries(arr.map((x) => [x.id, x.name])));
    })();
  }, []);

  const showToast = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3000); };

  // Featured helpers: which publications are featured, and at what position.
  const featuredKey = (m) => `${m?.url ? "v" : "a"}-${m?.id}`;
  const pubKey = (p) => `${p.isArticle ? "a" : "v"}-${p.id}`;
  const featuredPos = useMemo(() => {
    const map = {};
    (mains || []).forEach((m, i) => { if (m && m.id != null) map[featuredKey(m)] = i + 1; });
    return map;
  }, [mains]);
  const slotCount = (mains || []).length;
  const featuredCount = (mains || []).filter((m) => m && m.id != null).length;
  const featuredFull = slotCount > 0 && featuredCount >= slotCount;

  // Featured items only carry {id,title,url}. Match against allPubs (which has
  // companyId + createdAt) by id + type to resolve the company name and date.
  const featMatch = (p) => {
    if (!p?.id) return null;
    const isArt = !p.url;
    return (allPubs || []).find((x) => x.id === p.id && x.isArticle === isArt) || null;
  };

  // Toggle a publication's featured state.
  //  - Not featured  → insert at Featured #1, shift the rest down, drop the last.
  //  - Featured      → remove it, shift the others up, leaving the last slot empty.
  // Only the slots that actually change are written (in parallel).
  const toggleFeature = async (p) => {
    if (!mains || !mains.length) return;
    const N = mains.length;
    const k = pubKey(p);
    const isOn = !!featuredPos[k];
    if (!isOn && featuredFull) {
      showToast(`Featured is full (${featuredCount}/${slotCount}). Remove one first.`, "err");
      return;
    }
    const rest = mains
      .filter((m) => m && m.id != null && featuredKey(m) !== k)
      .map((m) => ({ id: m.id, isArticle: !m.url }));
    // Stars = membership only. Selecting appends to the first free slot WITHOUT
    // reordering the existing ones (the order is set in the Featured section).
    // Removing compacts the rest up, leaving a trailing empty slot.
    const target = isOn ? [...rest] : [...rest, { id: p.id, isArticle: p.isArticle }];
    const newOrder = target.slice(0, N);
    while (newOrder.length < N) newOrder.push(null);
    setFeaturing(k);
    try {
      const writes = [];
      for (let i = 0; i < N; i++) {
        const cur = mains[i] && mains[i].id != null ? featuredKey(mains[i]) : null;
        const nx = newOrder[i] || null;
        const nxKey = nx ? `${nx.isArticle ? "a" : "v"}-${nx.id}` : null;
        if (cur !== nxKey) {
          writes.push(apiUpdateMainPublication(i + 1, { publicationId: nx ? nx.id : null, isArticle: nx ? nx.isArticle : false }));
        }
      }
      const results = await Promise.all(writes);
      if (results.some((r) => !r || r.status !== 200)) throw new Error("partial");
      await loadMains();
      apiRevalidatePublications(); // flush the cached Insights page right away
      showToast(isOn ? "Removed from featured." : "Added to featured. Set its order below.");
    } catch (_) {
      showToast("Could not update featured. Please try again.", "err");
      await loadMains();
    } finally {
      setFeaturing(null);
    }
  };

  // Persist a new featured ordering (array of {id,isArticle}|null, length N).
  // Writes only the slots that changed.
  const applyFeaturedOrder = async (newArr) => {
    if (!mains) return;
    const N = mains.length;
    setReordering(true);
    try {
      const writes = [];
      for (let i = 0; i < N; i++) {
        const cur = mains[i] && mains[i].id != null ? featuredKey(mains[i]) : null;
        const nx = newArr[i] || null;
        const nxKey = nx ? `${nx.isArticle ? "a" : "v"}-${nx.id}` : null;
        if (cur !== nxKey) {
          writes.push(apiUpdateMainPublication(i + 1, { publicationId: nx ? nx.id : null, isArticle: nx ? nx.isArticle : false }));
        }
      }
      const results = await Promise.all(writes);
      if (results.some((r) => !r || r.status !== 200)) throw new Error("partial");
      await loadMains();
      apiRevalidatePublications(); // flush the cached Insights page right away
    } catch (_) {
      showToast("Could not reorder. Please try again.", "err");
      await loadMains();
    } finally {
      setReordering(false);
    }
  };

  const normSlot = (m) => (m && m.id != null ? { id: m.id, isArticle: !m.url } : null);

  // Move up/down (arrows): swap with the neighbour.
  const moveFeatured = (i, dir) => {
    if (!mains) return;
    const j = i + dir;
    if (j < 0 || j >= mains.length) return;
    const arr = mains.map(normSlot);
    [arr[i], arr[j]] = [arr[j], arr[i]];
    applyFeaturedOrder(arr);
  };

  // Drag & drop: grab a row and drop it at another position (move + shift).
  const handleFeaturedDrop = (targetIndex) => {
    const from = dragIndex;
    setDragIndex(null);
    setDragOverIndex(null);
    if (from == null || from === targetIndex || !mains) return;
    const arr = mains.map(normSlot);
    const [moved] = arr.splice(from, 1);
    arr.splice(targetIndex, 0, moved);
    applyFeaturedOrder(arr);
  };

  const onSavedFeatured = async () => { await loadMains(); setModalSlot(null); showToast("Featured publication updated."); };

  const editPub = (p) => {
    dispatch(setCompanyId(p.companyId));
    if (p.isArticle) { dispatch(setArticleId(p.id)); router.push("/mediaZone/article"); }
    else { dispatch(setVideoId(p.id)); router.push("/mediaZone/video"); }
  };

  const doDelete = async () => {
    if (!delConfirm) return;
    setDeleting(true);
    try {
      const res = delConfirm.isArticle ? await apiDeleteArticleById(delConfirm.id) : await apiDeleteVideoById(delConfirm.id);
      if (res?.status === 200) {
        setAllPubs((xs) => xs.filter((x) => !(x.id === delConfirm.id && x.isArticle === delConfirm.isArticle)));
        showToast("Publication deleted.");
      } else showToast("Could not delete. Please try again.", "err");
    } catch (_) { showToast("Could not delete. Please try again.", "err"); }
    finally { setDeleting(false); setDelConfirm(null); }
  };

  const visible = useMemo(() => {
    if (!allPubs) return [];
    const q = search.toLowerCase().trim();
    const filtered = allPubs.filter((p) => {
      if (typeF === "article" && !p.isArticle) return false;
      if (typeF === "video" && p.isArticle) return false;
      if (statusF === "live" && !p.live) return false;
      if (statusF === "draft" && p.live) return false;
      if (q && !(p.title || "").toLowerCase().includes(q) && !(companyById[p.companyId] || "").toLowerCase().includes(q)) return false;
      return true;
    });
    const dir = sortDir === "old" ? 1 : -1;
    return filtered.sort((a, b) => dir * (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)));
  }, [allPubs, search, typeF, statusF, sortDir, companyById]);

  return (
    <div className="pc">
      <div className="pc-inner">
        <nav className="pc-nav">
          <button className="pc-navbtn" onClick={() => router.push("/dashboard")}>{I.back} Dashboard</button>
          <button className="pc-navbtn primary" onClick={() => setMediaPick(true)}>{I.media} Media Zone</button>
        </nav>
        <header className="pc-head">
          <h1>Publications</h1>
          <p>Edit any article or video, and pick the ones featured first on Insights.</p>
        </header>

        {/* Featured (shown first, in order) */}
        <h2 className="pc-sec">
          ★ Featured on Insights <span>shown first · use ↑↓ to set the order</span>
          {slotCount > 0 && (
            <span className={`pc-featcount ${featuredFull ? "full" : ""}`}>
              {featuredCount}/{slotCount}{featuredFull ? " · full" : ""}
            </span>
          )}
        </h2>
        <div className="pc-card">
          {mains === null ? <p className="pc-pad pc-muted">Loading…</p> : mains.length === 0 ? (
            <p className="pc-pad pc-muted">No featured slots.</p>
          ) : (
            <div className="pc-list">
              {mains.map((p, i) => {
                const m = featMatch(p);
                return (
                <div
                  className={`pc-row pc-frow ${dragIndex === i ? "dragging" : ""} ${dragOverIndex === i && dragIndex !== i ? "dragover" : ""}`}
                  key={i}
                  draggable={!reordering}
                  onDragStart={(e) => { setDragIndex(i); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(i)); } catch (_) {} }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (dragOverIndex !== i) setDragOverIndex(i); }}
                  onDragLeave={() => { if (dragOverIndex === i) setDragOverIndex(null); }}
                  onDrop={(e) => { e.preventDefault(); handleFeaturedDrop(i); }}
                  onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                >
                  <span className="pc-grip" title="Drag to reorder">{I.grip}</span>
                  <span className="pc-slot">#{i + 1}</span>
                  <div className="pc-main">
                    <span className={`pc-type ${isVideo(p) ? "vid" : "art"}`}>{isVideo(p) ? "Video" : "Article"}</span>
                    <div className="pc-titlewrap">
                      <span className="pc-title">{p?.title ? truncateHtmlString(p.title, 80) : <em className="pc-muted">Empty</em>}</span>
                      {p?.id && (
                        <span className="pc-sub">
                          {m ? (companyById[m.companyId] || `#${m.companyId}`) : "—"}
                          {m?.createdAt ? ` · ${formatDateShort(m.createdAt)}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  {p?.id && <a className="pc-view" href={pubHref(p)} target="_blank" rel="noopener noreferrer">View ↗</a>}
                  <div className="pc-reorder">
                    <button title="Move up" disabled={i === 0 || reordering} onClick={() => moveFeatured(i, -1)}>{I.up}</button>
                    <button title="Move down" disabled={i === mains.length - 1 || reordering} onClick={() => moveFeatured(i, 1)}>{I.down}</button>
                  </div>
                  <button className="pc-change" onClick={() => setModalSlot(i + 1)}>Change</button>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All publications */}
        <div className="pc-sechead">
          <h2 className="pc-sec">All publications <span>{allPubs ? `${allPubs.length} total` : ""}</span></h2>
          <div className="pc-newbtns">
            <button onClick={() => setNewKind("article")}>+ New article</button>
            <button onClick={() => setNewKind("video")}>+ New video</button>
          </div>
        </div>
        <div className="pc-card">
          <div className="pc-toolbar">
            <div className="pc-srch">{I.search}<input placeholder="Search title or company…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <div className="pc-chips">
              {[["all", "All"], ["article", "Articles"], ["video", "Videos"]].map(([k, l]) => (
                <button key={k} className={`pc-chip ${typeF === k ? "on" : ""}`} onClick={() => setTypeF(k)}>{l}</button>
              ))}
              <span className="pc-sep" />
              {[["all", "Any"], ["live", "Live"], ["draft", "Draft"]].map(([k, l]) => (
                <button key={k} className={`pc-chip ${statusF === k ? "on" : ""}`} onClick={() => setStatusF(k)}>{l}</button>
              ))}
              <span className="pc-sep" />
              <button
                className="pc-chip pc-sort"
                onClick={() => setSortDir((d) => (d === "new" ? "old" : "new"))}
                title="Toggle sort by publication date"
              >
                {sortDir === "new" ? "Newest first ↓" : "Oldest first ↑"}
              </button>
            </div>
          </div>
          {allPubs === null ? (
            <p className="pc-pad pc-muted">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="pc-pad pc-muted">No publication matches.</p>
          ) : (
            <div className="pc-list">
              {visible.map((p) => (
                <div className="pc-row" key={`${p.isArticle ? "a" : "v"}-${p.id}`}>
                  <div className="pc-main">
                    <span className={`pc-type ${p.isArticle ? "art" : "vid"}`}>{p.isArticle ? "Article" : "Video"}</span>
                    <div className="pc-titlewrap">
                      <span className="pc-title">{truncateHtmlString(p.title || "", 80)}</span>
                      <span className="pc-sub">{companyById[p.companyId] || `#${p.companyId}`} · {String(p.createdAt || "").slice(0, 10)}</span>
                    </div>
                  </div>
                  {featuredPos[pubKey(p)] && (
                    <span
                      className={`pc-featbadge ${featuredPos[pubKey(p)] === 1 ? "first" : ""}`}
                      title={`Featured #${featuredPos[pubKey(p)]} on Insights`}
                    >
                      ★ #{featuredPos[pubKey(p)]}
                    </span>
                  )}
                  {p.live ? <span className="pc-badge live">Live</span> : <span className="pc-badge draft">Draft</span>}
                  <a className="pc-view" href={publicationHref(p)} target="_blank" rel="noopener noreferrer">View ↗</a>
                  <div className="pc-rowact">
                    <button
                      title={featuredPos[pubKey(p)]
                        ? `Featured #${featuredPos[pubKey(p)]} · click to remove`
                        : !p.live
                        ? "Set the publication live to feature it"
                        : featuredFull
                        ? `Featured is full (${featuredCount}/${slotCount}) · remove one to add another`
                        : "Add to featured"}
                      className={`feat ${featuredPos[pubKey(p)] ? "on" : ""}`}
                      disabled={featuring === pubKey(p) || (!featuredPos[pubKey(p)] && (!p.live || featuredFull))}
                      onClick={() => toggleFeature(p)}
                    >
                      {featuredPos[pubKey(p)] ? I.starFill : I.star}
                    </button>
                    <button title="Edit" onClick={() => editPub(p)}>{I.edit}</button>
                    <button title="Delete" className="del" onClick={() => setDelConfirm(p)}>{I.trash}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {newKind && (
        <NewModal kind={newKind} companies={companies} onClose={() => setNewKind(null)} onContinue={startNew} />
      )}
      {mediaPick && (
        <PickCompanyModal
          title="Open Media Zone · for which company?"
          cta="Open Media Zone →"
          companies={companies}
          onClose={() => setMediaPick(false)}
          onContinue={(cid) => { setMediaPick(false); openMediaZone(cid); }}
        />
      )}
      {modalSlot != null && (
        <ChangeModal slot={modalSlot} companies={companies} onClose={() => setModalSlot(null)} onSaved={onSavedFeatured} />
      )}
      {delConfirm && (
        <div className="pc-back-drop" onClick={() => !deleting && setDelConfirm(null)}>
          <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pc-modal-ic">{I.trash}</div>
            <h3>Delete this {delConfirm.isArticle ? "article" : "video"}?</h3>
            <p>“{truncateHtmlString(delConfirm.title || "", 70)}” will be permanently removed. This cannot be undone.</p>
            <div className="pc-modal-btns">
              <button className="pc-ghost" disabled={deleting} onClick={() => setDelConfirm(null)}>Cancel</button>
              <button className="pc-danger" disabled={deleting} onClick={doDelete}>{deleting ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className={`pc-toast ${toast.kind}`}>{toast.msg}</div>}

      <style jsx>{`
        .pc { min-height: 70vh; background: radial-gradient(ellipse 100% 40% at 50% 0%, #eef4ff 0%, #eef2f9 55%); padding: 44px 20px 70px; font-family: 'Chivo', system-ui, -apple-system, sans-serif; }
        .pc-inner { max-width: 900px; margin: 0 auto; }
        .pc-nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
        .pc-navbtn { display: inline-flex; align-items: center; gap: 7px; background: #fff; border: 1.5px solid #dce4ef; color: #2a3c5a; border-radius: 100px; padding: 8px 16px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: border-color .15s, background .15s, transform .15s; }
        .pc-navbtn:hover { border-color: #b8c6db; }
        .pc-navbtn.primary { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); border-color: transparent; color: #fff; box-shadow: 0 6px 16px -6px rgba(47,111,224,.5); }
        .pc-navbtn.primary:hover { transform: translateY(-1px); }
        .pc-head { text-align: center; margin-bottom: 26px; }
        .pc-head h1 { font-size: 30px; font-weight: 800; color: #0e2c5c; margin: 0 0 8px; letter-spacing: -.01em; }
        .pc-head p { font-size: 14.5px; color: #5a6a85; margin: 0; }
        .pc-sec { font-size: 15px; font-weight: 700; color: #0e2c5c; margin: 26px 0 12px; display: flex; align-items: baseline; gap: 10px; }
        .pc-sec span { font-size: 12.5px; font-weight: 500; color: #8a93a6; }
        .pc-sechead { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .pc-sechead .pc-sec { margin-bottom: 0; }
        .pc-newbtns { display: flex; gap: 8px; }
        .pc-newbtns button { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); color: #fff; border: none; border-radius: 100px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(47,111,224,.5); transition: transform .15s; }
        .pc-newbtns button:hover { transform: translateY(-1px); }
        .pc-card { background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; box-shadow: 0 10px 34px -18px rgba(10,26,51,.18); overflow: hidden; }
        .pc-muted { color: #8a93a6; }
        .pc-pad { padding: 26px; text-align: center; font-size: 14px; }
        .pc-list { display: flex; flex-direction: column; }
        .pc-row { display: flex; align-items: center; gap: 13px; padding: 14px 20px; border-bottom: 1px solid #f2f5fa; }
        .pc-row:last-child { border-bottom: none; }
        .pc-slot { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #8a93a6; flex-shrink: 0; width: 30px; }
        .pc-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 11px; }
        .pc-titlewrap { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .pc-type { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px; flex-shrink: 0; text-transform: uppercase; letter-spacing: .04em; }
        .pc-type.vid { background: #fdeee0; color: #b06a18; }
        .pc-type.art { background: #e9f0fc; color: #2f6fe0; }
        .pc-title { font-size: 14px; color: #0e2c5c; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pc-sub { font-size: 12px; color: #9aa3b5; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pc-badge { font-size: 10.5px; font-weight: 700; padding: 2px 9px; border-radius: 100px; flex-shrink: 0; text-transform: uppercase; letter-spacing: .04em; }
        .pc-badge.live { background: #e4f6ec; color: #1f8a52; }
        .pc-badge.draft { background: #eef2f8; color: #8a93a6; }
        .pc-view { font-size: 12.5px; color: #2f6fe0; text-decoration: none; font-weight: 600; flex-shrink: 0; }
        .pc-view:hover { text-decoration: underline; }
        .pc-change { flex-shrink: 0; background: linear-gradient(135deg,#4D8DFF,#2f6fe0); color: #fff; border: none; padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(47,111,224,.55); }
        .pc-frow { transition: background .12s, box-shadow .12s; }
        .pc-frow.dragging { opacity: .5; background: #f4f8ff; }
        .pc-frow.dragover { box-shadow: inset 0 2px 0 #2f6fe0; background: #f4f8ff; }
        .pc-grip { display: grid; place-items: center; color: #b8c2d4; cursor: grab; flex-shrink: 0; margin-right: -4px; }
        .pc-grip:active { cursor: grabbing; }
        .pc-frow:hover .pc-grip { color: #8a93a6; }
        .pc-reorder { display: inline-flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
        .pc-reorder button { width: 26px; height: 17px; display: grid; place-items: center; border: 1px solid #e3e9f2; background: #fff; color: #5a6a85; cursor: pointer; padding: 0; }
        .pc-reorder button:first-child { border-radius: 7px 7px 0 0; }
        .pc-reorder button:last-child { border-radius: 0 0 7px 7px; border-top: none; }
        .pc-reorder button:hover:not(:disabled) { background: #eef4ff; color: #2f6fe0; }
        .pc-reorder button:disabled { opacity: .35; cursor: default; }
        .pc-rowact { display: inline-flex; gap: 5px; flex-shrink: 0; }
        .pc-rowact button { width: 31px; height: 31px; display: grid; place-items: center; border: none; background: #f4f7fc; border-radius: 8px; color: #5a6a85; cursor: pointer; transition: background .15s, color .15s; }
        .pc-rowact button:hover { background: #e7eef8; color: #0e2c5c; }
        .pc-rowact button.del:hover { background: #fdeeee; color: #c0392b; }
        .pc-featcount { font-size: 11.5px; font-weight: 700; padding: 2px 10px; border-radius: 100px; background: #eef4ff; color: #2f6fe0; font-family: 'JetBrains Mono', monospace; }
        .pc-featcount.full { background: #fbe7e6; color: #c0392b; }
        .pc-featbadge { font-size: 10.5px; font-weight: 700; padding: 2px 9px; border-radius: 100px; flex-shrink: 0; background: #fff4d9; color: #cf8e1e; letter-spacing: .02em; }
        .pc-featbadge.first { background: linear-gradient(135deg,#f6b73c,#e0a32e); color: #fff; box-shadow: 0 2px 8px -2px rgba(224,163,46,.6); }
        .pc-rowact button.feat:hover { background: #fff7e6; color: #e0a32e; }
        .pc-rowact button.feat.on { background: #fff4d9; color: #e0a32e; }
        .pc-rowact button.feat:disabled { opacity: .45; cursor: default; }
        .pc-rowact button.feat.on:disabled { opacity: 1; }
        .pc-toolbar { display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-bottom: 1px solid #eef2f8; flex-wrap: wrap; }
        .pc-srch { display: flex; align-items: center; gap: 8px; background: #f4f7fc; border: 1.5px solid #e3e9f2; border-radius: 100px; padding: 8px 14px; color: #8a93a6; flex: 1; min-width: 180px; }
        .pc-srch input { border: none; outline: none; background: transparent; font-size: 13.5px; width: 100%; color: #0e2c5c; }
        .pc-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .pc-sep { width: 1px; height: 18px; background: #e3e9f2; margin: 0 2px; }
        .pc-chip { border: 1.5px solid #e3e9f2; background: #fff; color: #5a6a85; border-radius: 100px; padding: 6px 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
        .pc-chip.on { background: #eef4ff; border-color: #2f6fe0; color: #2f6fe0; }
        .pc-sort { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

        .pc-back-drop { position: fixed; inset: 0; z-index: 400; background: rgba(10,26,51,.42); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .pc-modal { background: #fff; border-radius: 18px; padding: 28px; max-width: 390px; text-align: center; box-shadow: 0 30px 80px -16px rgba(10,26,51,.4); }
        .pc-modal-ic { width: 48px; height: 48px; margin: 0 auto 14px; border-radius: 50%; display: grid; place-items: center; background: #fdeeee; color: #c0392b; }
        .pc-modal h3 { font-size: 18px; font-weight: 700; color: #0e2c5c; margin: 0 0 8px; text-transform: capitalize; }
        .pc-modal p { font-size: 13.5px; color: #5a6a85; margin: 0 0 22px; line-height: 1.55; }
        .pc-modal-btns { display: flex; gap: 10px; justify-content: center; }
        .pc-ghost { background: #f1f4f9; border: none; border-radius: 100px; padding: 11px 22px; font-weight: 600; color: #2a3c5a; cursor: pointer; }
        .pc-danger { background: #c0392b; border: none; border-radius: 100px; padding: 11px 22px; font-weight: 600; color: #fff; cursor: pointer; }
        .pc-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 420; padding: 13px 22px; border-radius: 100px; font-size: 14px; font-weight: 600; color: #fff; box-shadow: 0 12px 30px -8px rgba(10,26,51,.4); }
        .pc-toast.ok { background: #1f8a52; }
        .pc-toast.err { background: #c0392b; }
      `}</style>
    </div>
  );
}

// ── Change-featured modal ────────────────────────────────────────────────────
function ChangeModal({ slot, companies, onClose, onSaved }) {
  const [companyId, setCompanyId] = useState(null);
  const [pubs, setPubs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
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
      setPubs([
        ...(Array.isArray(vids) ? vids : []).filter((v) => v.live).map((v) => ({ ...v, isArticle: false })),
        ...(Array.isArray(arts) ? arts : []).filter((a) => a.live).map((a) => ({ ...a, isArticle: true })),
      ]);
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
          {!companyId ? <p className="pcm-muted">Pick a company to see its live publications.</p>
            : loading ? <p className="pcm-muted">Loading publications…</p>
            : pubs && pubs.length === 0 ? <p className="pcm-muted">This company has no live publications.</p>
            : (
              <div className="pcm-list">
                {pubs?.map((p) => {
                  const sel = selected && selected.id === p.id && selected.isArticle === p.isArticle;
                  return (
                    <label key={`${p.isArticle ? "a" : "v"}-${p.id}`} className={`pcm-opt ${sel ? "sel" : ""}`}>
                      <input type="radio" name="pub" checked={!!sel} onChange={() => setSelected({ id: p.id, isArticle: p.isArticle })} />
                      <span className={`pcm-type ${p.isArticle ? "art" : "vid"}`}>{p.isArticle ? "Article" : "Video"}</span>
                      <span className="pcm-title">{p.title}</span>
                      {p.createdAt && <span className="pcm-date">{formatDateShort(p.createdAt)}</span>}
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
        .pcm-back { position: fixed; inset: 0; z-index: 410; background: rgba(10,26,51,.42); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Chivo', system-ui, sans-serif; }
        .pcm { background: #fff; border-radius: 18px; width: min(620px, 100%); max-height: 86vh; display: flex; flex-direction: column; padding: 24px 26px; box-shadow: 0 30px 80px -16px rgba(10,26,51,.4); }
        .pcm-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .pcm-head h3 { font-size: 18px; font-weight: 700; color: #0e2c5c; margin: 0; }
        .pcm-x { background: #f1f4f9; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; color: #5a6a85; }
        .pcm-body { flex: 1; overflow-y: auto; margin-top: 14px; min-height: 80px; }
        .pcm-muted { color: #8a93a6; font-size: 14px; padding: 16px 4px; }
        .pcm-list { display: flex; flex-direction: column; gap: 8px; }
        .pcm-opt { display: flex; align-items: center; gap: 11px; padding: 11px 14px; border: 1.5px solid #eef2f8; border-radius: 12px; cursor: pointer; }
        .pcm-opt.sel { border-color: #2f6fe0; background: #f4f8ff; }
        .pcm-type { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px; flex-shrink: 0; text-transform: uppercase; }
        .pcm-type.vid { background: #fdeee0; color: #b06a18; }
        .pcm-type.art { background: #e9f0fc; color: #2f6fe0; }
        .pcm-title { flex: 1; min-width: 0; font-size: 13.5px; color: #0e2c5c; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pcm-date { flex-shrink: 0; font-size: 11.5px; color: #9aa3b5; font-family: 'JetBrains Mono', monospace; }
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
  const shown = q.trim() ? companies.filter((c) => (c.name || "").toLowerCase().includes(q.toLowerCase().trim())) : companies;
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

// ── New-publication modal: pick a company, then open the editor ───────────────
function NewModal({ kind, companies, onClose, onContinue }) {
  return (
    <PickCompanyModal
      title={`New ${kind} · for which company?`}
      cta="Continue →"
      companies={companies}
      onClose={onClose}
      onContinue={onContinue}
    />
  );
}

// ── Generic "pick a company then continue" modal ──────────────────────────────
function PickCompanyModal({ title, cta, companies, onClose, onContinue }) {
  const [cid, setCid] = useState(null);
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 410, background: "rgba(10,26,51,.42)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Chivo', system-ui, sans-serif" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 18, width: "min(520px,100%)", padding: "24px 26px", boxShadow: "0 30px 80px -16px rgba(10,26,51,.4)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0e2c5c", margin: 0, textTransform: "capitalize" }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: "#f1f4f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#5a6a85" }}>✕</button>
        </div>
        <CompanyPicker companies={companies} value={cid} onChange={setCid} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{ background: "#f1f4f9", border: "none", borderRadius: 100, padding: "11px 22px", fontWeight: 600, color: "#2a3c5a", cursor: "pointer" }}>Cancel</button>
          <button disabled={!cid} onClick={() => onContinue(cid)}
            style={{ background: "linear-gradient(135deg,#4D8DFF,#2f6fe0)", border: "none", borderRadius: 100, padding: "11px 24px", fontWeight: 600, color: "#fff", cursor: cid ? "pointer" : "default", opacity: cid ? 1 : 0.5, boxShadow: "0 8px 20px -6px rgba(47,111,224,.55)" }}>{cta}</button>
        </div>
      </div>
    </div>
  );
}
