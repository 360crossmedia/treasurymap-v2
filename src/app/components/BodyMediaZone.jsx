"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiGetAllArticlesByCompanyId } from "../service/apiGetAllArticlesByCompanyId";
import { apiGetAllVideosByCompanyId } from "../service/apiGetAllVideosByCompanyId";
import { apiDeleteArticleById } from "../service/apiDeleteArticleById";
import { apiDeleteVideoById } from "../service/apiDeleteVideoById";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { setArticleId } from "../store/slices/articleId.slice";
import { setVideoId } from "../store/slices/videoId.slice";
import { truncateHtmlString } from "../utils";
import { publicationHref } from "../utils/slugify";

const I = {
  edit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  back: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
};

export default function BodyMediaZone() {
  const dispatch = useDispatch();
  const router = useRouter();
  const companyIdRedux = useSelector((s) => s.companyId);
  const companyId = companyIdRedux || (typeof window !== "undefined" ? localStorage.getItem("companyId") : null);

  const [tab, setTab] = useState("articles");
  const [articles, setArticles] = useState(null);
  const [videos, setVideos] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [confirm, setConfirm] = useState(null); // { kind, id, title }
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    const [a, v] = await Promise.all([
      apiGetAllArticlesByCompanyId(companyId).catch(() => []),
      apiGetAllVideosByCompanyId(companyId).catch(() => []),
    ]);
    setArticles(Array.isArray(a) ? a : []);
    setVideos(Array.isArray(v) ? v : []);
  };

  useEffect(() => {
    if (!companyId) return;
    apiGetCompanyData(companyId).then((c) => {
      // Vendors can only manage media once their company is validated (live).
      const isAdmin = typeof window !== "undefined" && String(localStorage.getItem("userId")) === "1";
      if (c && c.live === false && !isAdmin) {
        router.push("/dashboard");
        return;
      }
      setCompanyName(c?.name || "");
      load();
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3000); };

  const newItem = () => {
    if (tab === "articles") { dispatch(setArticleId(null)); router.push("/mediaZone/article"); }
    else { dispatch(setVideoId(null)); router.push("/mediaZone/video"); }
  };
  const editItem = (kind, id) => {
    if (kind === "article") { dispatch(setArticleId(id)); router.push("/mediaZone/article"); }
    else { dispatch(setVideoId(id)); router.push("/mediaZone/video"); }
  };

  const doDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = confirm.kind === "article"
        ? await apiDeleteArticleById(confirm.id)
        : await apiDeleteVideoById(confirm.id);
      if (res?.status === 200) {
        if (confirm.kind === "article") setArticles((xs) => xs.filter((x) => x.id !== confirm.id));
        else setVideos((xs) => xs.filter((x) => x.id !== confirm.id));
        showToast(`${confirm.kind === "article" ? "Article" : "Video"} deleted.`);
      } else showToast("Could not delete. Please try again.", "err");
    } catch (_) { showToast("Could not delete. Please try again.", "err"); }
    finally { setDeleting(false); setConfirm(null); }
  };

  const items = tab === "articles" ? articles : videos;
  const kind = tab === "articles" ? "article" : "video";
  const hrefBase = tab === "articles" ? "/publication/article/" : "/publication/video/";

  return (
    <div className="mz">
      <div className="mz-inner">
        <header className="mz-head">
          <div>
            <h1>Media Zone</h1>
            <p>{companyName ? <>Articles &amp; videos for <b>{companyName}</b>.</> : "Manage this company's articles and videos."}</p>
          </div>
          <button className="mz-back" onClick={() => router.push("/dashboard")}>{I.back} Dashboard</button>
        </header>

        <div className="mz-bar">
          <div className="mz-tabs">
            <button className={`mz-tab ${tab === "articles" ? "on" : ""}`} onClick={() => setTab("articles")}>
              Articles <span className="mz-count">{articles?.length ?? "–"}</span>
            </button>
            <button className={`mz-tab ${tab === "videos" ? "on" : ""}`} onClick={() => setTab("videos")}>
              Videos <span className="mz-count">{videos?.length ?? "–"}</span>
            </button>
          </div>
          <button className="mz-new" onClick={newItem}>{I.plus} New {kind}</button>
        </div>

        <div className="mz-card">
          {items === null ? (
            <p className="mz-pad mz-muted">Loading…</p>
          ) : items.length === 0 ? (
            <div className="mz-empty">
              <p>No {tab} yet.</p>
              <button className="mz-new" onClick={newItem}>{I.plus} Create your first {kind}</button>
            </div>
          ) : (
            <div className="mz-list">
              {items.map((it) => (
                <div className="mz-row" key={it.id}>
                  <div className="mz-info">
                    <span className="mz-title">{truncateHtmlString(it.title, 90)}</span>
                    <span className="mz-meta">
                      {it.live ? <span className="mz-live">Live</span> : <span className="mz-draft">Draft</span>}
                      {it.createdAt && <span className="mz-date">{String(it.createdAt).slice(0, 10)}</span>}
                    </span>
                  </div>
                  <a className="mz-view" href={publicationHref(tab === "articles" ? { ...it, url: undefined } : { ...it })} target="_blank" rel="noopener noreferrer">View ↗</a>
                  <div className="mz-actions">
                    <button title="Edit" onClick={() => editItem(kind, it.id)}>{I.edit}</button>
                    <button title="Delete" className="del" onClick={() => setConfirm({ kind, id: it.id, title: it.title })}>{I.trash}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirm && (
        <div className="mz-back-drop" onClick={() => !deleting && setConfirm(null)}>
          <div className="mz-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mz-modal-ic">{I.trash}</div>
            <h3>Delete this {confirm.kind}?</h3>
            <p>“{truncateHtmlString(confirm.title || "", 80)}” will be permanently removed. This cannot be undone.</p>
            <div className="mz-modal-btns">
              <button className="mz-ghost" disabled={deleting} onClick={() => setConfirm(null)}>Cancel</button>
              <button className="mz-danger" disabled={deleting} onClick={doDelete}>{deleting ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className={`mz-toast ${toast.kind}`}>{toast.msg}</div>}

      <style jsx>{`
        .mz { min-height: 70vh; background: radial-gradient(ellipse 100% 45% at 50% 0%, #eef4ff 0%, #eef2f9 55%); padding: 40px 20px 70px; font-family: 'Chivo', system-ui, -apple-system, sans-serif; }
        .mz-inner { max-width: 860px; margin: 0 auto; }
        .mz-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
        .mz-head h1 { font-size: 30px; font-weight: 800; color: #0e2c5c; margin: 0 0 5px; letter-spacing: -.01em; }
        .mz-head p { font-size: 14.5px; color: #5a6a85; margin: 0; }
        .mz-back { display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0; background: #fff; border: 1.5px solid #dce4ef; color: #2a3c5a; border-radius: 100px; padding: 8px 16px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
        .mz-back:hover { border-color: #b8c6db; }
        .mz-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .mz-tabs { display: flex; gap: 6px; background: #fff; border: 1px solid #e6ecf5; border-radius: 100px; padding: 4px; }
        .mz-tab { display: inline-flex; align-items: center; gap: 8px; border: none; background: none; color: #5a6a85; border-radius: 100px; padding: 8px 18px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background .15s, color .15s; }
        .mz-tab.on { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); color: #fff; }
        .mz-count { font-size: 11px; background: rgba(255,255,255,.25); padding: 1px 8px; border-radius: 100px; }
        .mz-tab:not(.on) .mz-count { background: #eef2f8; color: #8a93a6; }
        .mz-new { display: inline-flex; align-items: center; gap: 7px; background: #fff; border: 1.5px solid #cdd9ec; color: #2f6fe0; border-radius: 100px; padding: 9px 18px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background .15s; }
        .mz-new:hover { background: #f4f8ff; }
        .mz-card { background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; box-shadow: 0 10px 34px -18px rgba(10,26,51,.18); overflow: hidden; }
        .mz-muted { color: #8a93a6; }
        .mz-pad { padding: 28px; text-align: center; font-size: 14px; }
        .mz-empty { padding: 44px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .mz-empty p { color: #8a93a6; margin: 0; font-size: 15px; }
        .mz-list { display: flex; flex-direction: column; }
        .mz-row { display: flex; align-items: center; gap: 14px; padding: 15px 22px; border-bottom: 1px solid #f2f5fa; }
        .mz-row:last-child { border-bottom: none; }
        .mz-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .mz-title { font-size: 14.5px; font-weight: 600; color: #0e2c5c; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mz-meta { display: flex; align-items: center; gap: 10px; }
        .mz-live { font-size: 10.5px; font-weight: 700; color: #1f8a52; background: #e4f6ec; padding: 2px 9px; border-radius: 100px; text-transform: uppercase; letter-spacing: .04em; }
        .mz-draft { font-size: 10.5px; font-weight: 700; color: #8a93a6; background: #eef2f8; padding: 2px 9px; border-radius: 100px; text-transform: uppercase; letter-spacing: .04em; }
        .mz-date { font-size: 12px; color: #9aa3b5; }
        .mz-view { font-size: 12.5px; color: #2f6fe0; text-decoration: none; font-weight: 600; flex-shrink: 0; }
        .mz-view:hover { text-decoration: underline; }
        .mz-actions { display: inline-flex; gap: 5px; flex-shrink: 0; }
        .mz-actions button { width: 32px; height: 32px; display: grid; place-items: center; border: none; background: #f4f7fc; border-radius: 8px; color: #5a6a85; cursor: pointer; transition: background .15s, color .15s; }
        .mz-actions button:hover { background: #e7eef8; color: #0e2c5c; }
        .mz-actions button.del:hover { background: #fdeeee; color: #c0392b; }

        .mz-back-drop { position: fixed; inset: 0; z-index: 400; background: rgba(10,26,51,.42); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .mz-modal { background: #fff; border-radius: 18px; padding: 28px; max-width: 390px; text-align: center; box-shadow: 0 30px 80px -16px rgba(10,26,51,.4); font-family: 'Chivo', system-ui, sans-serif; }
        .mz-modal-ic { width: 48px; height: 48px; margin: 0 auto 14px; border-radius: 50%; display: grid; place-items: center; background: #fdeeee; color: #c0392b; }
        .mz-modal h3 { font-size: 18px; font-weight: 700; color: #0e2c5c; margin: 0 0 8px; text-transform: capitalize; }
        .mz-modal p { font-size: 13.5px; color: #5a6a85; margin: 0 0 22px; line-height: 1.55; }
        .mz-modal-btns { display: flex; gap: 10px; justify-content: center; }
        .mz-ghost { background: #f1f4f9; border: none; border-radius: 100px; padding: 11px 22px; font-weight: 600; color: #2a3c5a; cursor: pointer; }
        .mz-danger { background: #c0392b; border: none; border-radius: 100px; padding: 11px 22px; font-weight: 600; color: #fff; cursor: pointer; }
        .mz-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 420; padding: 13px 22px; border-radius: 100px; font-size: 14px; font-weight: 600; color: #fff; box-shadow: 0 12px 30px -8px rgba(10,26,51,.4); }
        .mz-toast.ok { background: #1f8a52; }
        .mz-toast.err { background: #c0392b; }
        @media (max-width: 560px) { .mz-head { flex-direction: column; } }
      `}</style>
    </div>
  );
}
