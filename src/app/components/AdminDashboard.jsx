"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { apiGetAllCompanies } from "../service/apiGetAllCompanies";
import { apiGetCompaniesByOwner } from "../service/apiGetCompaniesByOwner";
import { apiUpdateCompany } from "../service/apiUpdateCompany";
import { apiGetAllUsers } from "../service/apiGetAllUsers";
import { apiCreateMagicLink } from "../service/apiCreateMagicLink";
import { apiGetAllArticles } from "../service/apiGetAllArticles";
import { apiGetAllVideos } from "../service/apiGetAllVideos";
import { formatDateShort } from "../utils";
import { cld } from "../utils/cloudinary";
import { CAT_META } from "./proceduralMap/catMeta";

const catCode = (c) => {
  const id = Array.isArray(c?.maincategory) ? c.maincategory[0] : null;
  return id ? CAT_META[`category-${id}`]?.code : null;
};
const catHue = (c) => {
  const id = Array.isArray(c?.maincategory) ? c.maincategory[0] : null;
  return id ? CAT_META[`category-${id}`]?.hue : 215;
};
const arr = (v) => (Array.isArray(v) ? v : []);
const needsAttention = (c) => c.live && c.logo && arr(c.companySubcategories).length === 0;

function timeAgo(d) {
  if (!d) return "—";
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return "—";
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24); if (dd < 31) return `${dd}d ago`;
  const mo = Math.floor(dd / 30); if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

const I = {
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  media: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m10 8 5 3-5 3V8z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  star: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
  mail2: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "hidden", label: "Hidden" },
  { key: "multiplayer", label: "Multiplayer" },
  { key: "clients", label: "Paid clients" },
  { key: "attention", label: "Needs attention" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userIdRedux = useSelector((s) => s.user);

  const [userId, setUserId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState({}); // id -> true while toggling
  const [latestPubs, setLatestPubs] = useState(null); // admin: most recent articles/videos

  // vendor-path single select
  const [selectedId, setSelectedId] = useState(null);
  // admin command-center state
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent"); // recent | name

  const isAdmin = userId === 1;

  useEffect(() => {
    const uid = Number(localStorage.getItem("userId")) || userIdRedux || null;
    setUserId(uid);
    (async () => {
      try {
        const [list, userList] = await Promise.all([
          uid === 1 ? apiGetAllCompanies() : apiGetCompaniesByOwner(uid),
          uid === 1 ? apiGetAllUsers().catch(() => []) : Promise.resolve([]),
        ]);
        const a = Array.isArray(list) ? list : [];
        setCompanies(a.sort((x, y) => (x.name || "").localeCompare(y.name || "")));
        setUsers(Object.fromEntries((userList || []).map((u) => [u.id, { name: u.fullName || u.email, email: u.email }])));
        if (uid !== 1 && a.length === 1) selectCompany(a[0].id);
        // Admin: load the most recent publications across all companies.
        if (uid === 1) {
          Promise.all([apiGetAllArticles().catch(() => []), apiGetAllVideos().catch(() => [])])
            .then(([arts, vids]) => {
              const merged = [
                ...(Array.isArray(arts) ? arts : []).map((x) => ({ ...x, isArticle: true })),
                ...(Array.isArray(vids) ? vids : []).map((x) => ({ ...x, isArticle: false })),
              ].sort((p, q) => new Date(q.createdAt || 0) - new Date(p.createdAt || 0));
              setLatestPubs(merged.slice(0, 6));
            })
            .catch(() => setLatestPubs([]));
        }
      } catch (_) {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3000); };

  const selectCompany = (id) => {
    setSelectedId(id);
    dispatch(setCompanyId(Number(id)));
    try { localStorage.setItem("companyId", Number(id)); } catch (_) {}
  };

  const openEdit = (id) => { selectCompany(id); router.push("/form"); };
  const openMedia = (id) => { selectCompany(id); router.push("/mediaZone"); };

  // Generate a signed magic edit-link for a company's owner and copy it, so the
  // admin can email it to the vendor (replaces the old shared "12345" links).
  const copyEditLink = async (c) => {
    if (!c?.userId) { alert("This company has no owner assigned yet."); return; }
    const data = await apiCreateMagicLink(c.userId);
    if (!data?.token) { alert("Could not generate the edit link. Please try again."); return; }
    const link = `${window.location.origin}/linkupdate/${data.token}`;
    try {
      await navigator.clipboard.writeText(link);
      alert(`Edit link copied — valid 30 days. Send it to the vendor:\n\n${link}`);
    } catch (_) {
      window.prompt("Copy this edit link for the vendor (valid 30 days):", link);
    }
  };
  const createCompany = () => { dispatch(setCompanyId(false)); try { localStorage.removeItem("companyId"); } catch (_) {} router.push("/form"); };

  // Inline partial-update toggle (live / multiplayerMap = boolean)
  const toggleField = async (c, field) => {
    const next = !c[field];
    setBusy((b) => ({ ...b, [c.id]: true }));
    setCompanies((cs) => cs.map((x) => (x.id === c.id ? { ...x, [field]: next } : x)));
    try {
      const res = await apiUpdateCompany(c.id, { [field]: next });
      if (!res || res.status !== 200) throw new Error();
    } catch (_) {
      setCompanies((cs) => cs.map((x) => (x.id === c.id ? { ...x, [field]: !next } : x)));
      showToast("Update failed. Reverted.", "err");
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[c.id]; return n; });
    }
  };

  // Client status: paid <-> free (stored in clientPackage)
  const toggleClient = async (c) => {
    const prev = c.clientPackage;
    const next = c.clientPackage === "paid" ? null : "paid";
    setBusy((b) => ({ ...b, [c.id]: true }));
    setCompanies((cs) => cs.map((x) => (x.id === c.id ? { ...x, clientPackage: next } : x)));
    try {
      const res = await apiUpdateCompany(c.id, { clientPackage: next });
      if (!res || res.status !== 200) throw new Error();
    } catch (_) {
      setCompanies((cs) => cs.map((x) => (x.id === c.id ? { ...x, clientPackage: prev } : x)));
      showToast("Update failed. Reverted.", "err");
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[c.id]; return n; });
    }
  };

  // Stats
  const stats = useMemo(() => {
    const live = companies.filter((c) => c.live).length;
    return {
      all: companies.length,
      live,
      hidden: companies.length - live,
      multiplayer: companies.filter((c) => c.multiplayerMap).length,
      clients: companies.filter((c) => c.clientPackage === "paid").length,
      attention: companies.filter(needsAttention).length,
    };
  }, [companies]);

  // Filtered list
  const visible = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = companies.filter((c) => {
      if (filter === "live" && !c.live) return false;
      if (filter === "hidden" && c.live) return false;
      if (filter === "multiplayer" && !c.multiplayerMap) return false;
      if (filter === "clients" && c.clientPackage !== "paid") return false;
      if (filter === "attention" && !needsAttention(c)) return false;
      if (q && !(c.name || "").toLowerCase().includes(q)) return false;
      return true;
    });
    list.sort((a, b) => sort === "name"
      ? (a.name || "").localeCompare(b.name || "")
      : new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    return list;
  }, [companies, filter, search, sort]);

  const selected = companies.find((c) => String(c.id) === String(selectedId));

  return (
    <div className="dash">
      <div className="dash-inner">
        <header className="dash-head">
          <div>
            <h1>Dashboard</h1>
            <p>{isAdmin ? "Manage every listing, publication and account." : "Manage your listing and media."}</p>
          </div>
          <span className={`dash-role ${isAdmin ? "admin" : ""}`}>{isAdmin ? "Administrator" : "Vendor"}</span>
        </header>

        {/* ───────── ADMIN COMMAND CENTER ───────── */}
        {isAdmin ? (
          <>
            {/* Stats */}
            <div className="dash-stats">
              {[
                { k: "all", label: "Companies", val: stats.all, tone: "blue", hint: "All companies in the database." },
                { k: "live", label: "Live on map", val: stats.live, tone: "green", hint: "Companies visible on the Treasury Map (live, with a logo and a category)." },
                { k: "hidden", label: "Hidden", val: stats.hidden, tone: "slate", hint: "Companies not set live · not shown on the map." },
                { k: "multiplayer", label: "Multiplayer", val: stats.multiplayer, tone: "teal", hint: "Companies flagged for the Multiplayer Map." },
                { k: "clients", label: "Paid clients", val: stats.clients, tone: "green", hint: "Companies marked as paid clients." },
                { k: "attention", label: "Needs attention", val: stats.attention, tone: "amber", hint: "Live companies with a logo but no sub-categories · their profile is incomplete. Click to see and fix them." },
              ].map((s) => (
                <button key={s.k} title={s.hint} className={`dash-stat ${s.tone} ${filter === s.k ? "active" : ""}`} onClick={() => setFilter(s.k)}>
                  <span className="dash-stat-v">{s.val}</span>
                  <span className="dash-stat-l">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Quick actions · always reachable without scrolling past the table */}
            <div className="dash-quick">
              <button onClick={createCompany}>{I.plus} New company</button>
              <button onClick={() => router.push("/publicationsControl")}>{I.star} Publications</button>
              <button onClick={() => router.push("/accountsettings")}>{I.users} Accounts</button>
              <button onClick={() => router.push("/myaccount")}>{I.user} My account</button>
            </div>

            {/* Latest publications · recency at a glance */}
            <div className="dash-card dash-pubs">
              <div className="dash-pubs-head">
                <h3>Latest publications</h3>
                <button className="dash-pubs-all" onClick={() => router.push("/publicationsControl")}>Manage all →</button>
              </div>
              {latestPubs === null ? (
                <p className="dash-pubs-empty">Loading…</p>
              ) : latestPubs.length === 0 ? (
                <p className="dash-pubs-empty">No publications yet.</p>
              ) : (
                <div className="dash-pubs-list">
                  {latestPubs.map((p) => (
                    <button
                      key={`${p.isArticle ? "a" : "v"}-${p.id}`}
                      className="dash-pub"
                      onClick={() => router.push("/publicationsControl")}
                      title="Open in Publications"
                    >
                      <span className={`dash-pub-type ${p.isArticle ? "art" : "vid"}`}>{p.isArticle ? "Article" : "Video"}</span>
                      <span className="dash-pub-title">{p.title}</span>
                      <span className="dash-pub-meta">
                        {(companies.find((c) => c.id === p.companyId)?.name) || ""}
                        {p.createdAt && <span className="dash-pub-date">{formatDateShort(p.createdAt)}</span>}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Toolbar */}
            <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="dash-toolbar">
                <div className="dash-srch">
                  {I.search}
                  <input placeholder="Search a company…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="dash-filters">
                  {FILTERS.map((f) => (
                    <button key={f.key} className={`dash-chip ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
                  ))}
                </div>
                <button className="dash-btn primary sm" onClick={createCompany}>{I.plus} New</button>
              </div>

              {filter === "hidden" && (
                <div className="dash-queue-note">
                  📥 <b>Review queue</b> · companies not yet on the map, newest first. Flip <b>Live</b> when a vendor has finished uploading.
                </div>
              )}

              {/* Table */}
              <div className="dash-tablewrap">
                {loading ? (
                  <p className="dash-pad muted">Loading companies…</p>
                ) : visible.length === 0 ? (
                  <p className="dash-pad muted">No company matches this view.</p>
                ) : (
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th className={`sortable ${sort === "name" ? "act" : ""}`} onClick={() => setSort("name")}>Company{sort === "name" ? " ↓" : ""}</th>
                        <th>Category</th><th>Client</th><th>Owner</th>
                        <th className={`sortable ${sort === "recent" ? "act" : ""}`} onClick={() => setSort("recent")}>Updated{sort === "recent" ? " ↓" : ""}</th>
                        <th className="ctr">Live</th><th className="ctr">Multiplayer</th><th className="ctr">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((c) => (
                        <tr key={c.id} className={needsAttention(c) ? "warn" : ""}>
                          <td>
                            <div className="dash-co">
                              {c.logo ? <img src={cld(c.logo, { w: 80 })} alt="" /> : <span className="dash-co-ph">{(c.name || "?").slice(0, 2).toUpperCase()}</span>}
                              <button className="dash-co-name" onClick={() => openEdit(c.id)} title="Edit listing">{c.name || "—"}</button>
                            </div>
                          </td>
                          <td>{catCode(c)
                            ? <span className="dash-cat" style={{ background: `hsl(${catHue(c)},70%,94%)`, color: `hsl(${catHue(c)},55%,32%)` }}>{catCode(c)}</span>
                            : <span className="muted">—</span>}</td>
                          <td>
                            <button
                              className={`dash-client ${c.clientPackage === "paid" ? "paid" : "free"}`}
                              disabled={busy[c.id]}
                              onClick={() => toggleClient(c)}
                              title="Click to toggle paid / free"
                            >
                              {c.clientPackage === "paid" ? "PAID CLIENT" : "FREE"}
                            </button>
                          </td>
                          <td className="dash-owner">
                            <span className="dash-owner-name">{c.ownerName || users[c.userId]?.name || (c.userId === 1 ? "Admin" : `#${c.userId}`)}</span>
                            {(c.ownerEmail || users[c.userId]?.email) && (
                              <a className="dash-owner-mail" href={`mailto:${c.ownerEmail || users[c.userId].email}?subject=${encodeURIComponent(`TreasuryMap · ${c.name}`)}`} title={`Email ${c.ownerEmail || users[c.userId].email}`}>
                                {I.mail2} {c.ownerEmail || users[c.userId].email}
                              </a>
                            )}
                          </td>
                          <td className="dash-date">{timeAgo(c.updatedAt || c.createdAt)}</td>
                          <td className="ctr"><Switch on={!!c.live} busy={busy[c.id]} onClick={() => toggleField(c, "live")} /></td>
                          <td className="ctr"><Switch on={!!c.multiplayerMap} busy={busy[c.id]} onClick={() => toggleField(c, "multiplayerMap")} tone="teal" /></td>
                          <td className="ctr">
                            <div className="dash-rowact">
                              <button title="Edit listing" onClick={() => openEdit(c.id)}>{I.edit}</button>
                              <button title="Media Zone" onClick={() => openMedia(c.id)}>{I.media}</button>
                              <button title="Copy vendor edit link" aria-label="Copy vendor edit link" onClick={() => copyEditLink(c)}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {!loading && <div className="dash-count">{visible.length} of {companies.length} companies</div>}
            </div>
          </>
        ) : (
          /* ───────── VENDOR (simple) ───────── */
          <>
            {!loading && companies.length === 0 ? (
              <section className="dash-card dash-getlisted">
                <span className="dash-gl-eyebrow">Get on the map</span>
                <h2 className="dash-card-title">Add your company to the Treasury Map</h2>
                <p className="dash-card-sub">Create your company profile (logo, description, categories). It’s free. When it’s ready, contact us to be featured live on the map.</p>
                <div className="dash-actions">
                  <button className="dash-btn primary" onClick={createCompany}>{I.plus} Create my company profile</button>
                </div>
              </section>
            ) : (
              <section className="dash-card">
                <div className="dash-co-head">
                  <h2 className="dash-card-title">Your company</h2>
                  <button className="dash-link" onClick={createCompany}>{I.plus} Add another</button>
                </div>
                <p className="dash-card-sub">Edit your listing or manage your media.</p>
                <CompanySelect companies={companies} loading={loading} value={selectedId} onChange={selectCompany} />
                {selected && (
                  <>
                    <div className="dash-status-row">
                      {selected.live
                        ? <span className="dash-status live">● Live on the map</span>
                        : <span className="dash-status draft">● Draft · not on the map yet</span>}
                    </div>
                    <div className="dash-actions">
                      <button className="dash-btn primary" onClick={() => openEdit(selected.id)}>{I.edit} Edit listing</button>
                      {selected.live
                        ? <button className="dash-btn" onClick={() => openMedia(selected.id)}>{I.media} Media Zone</button>
                        : <button className="dash-btn" disabled title="Available once your company is validated and live on the map">{I.media} Media Zone (locked)</button>}
                    </div>
                    {!selected.live && (
                      <div className="dash-featured">
                        <div className="dash-featured-txt">
                          <strong>Ready to go live?</strong>
                          <span>Your profile is saved as a draft. Contact us to review it and feature your company live on the Treasury Map.</span>
                        </div>
                        <button className="dash-btn primary" onClick={() => router.push("/contactUs")}>Contact us to be featured live</button>
                      </div>
                    )}
                  </>
                )}
              </section>
            )}
            <section className="dash-card">
              <h2 className="dash-card-title">Your account</h2>
              <button className="dash-tile solo" onClick={() => router.push("/myaccount")}>
                <span className="dash-tile-ic slate">{I.user}</span>
                <span className="dash-tile-t">My account</span>
                <span className="dash-tile-d">Name, email and password</span>
              </button>
            </section>
          </>
        )}
      </div>

      {toast && <div className={`dash-toast ${toast.kind}`}>{toast.msg}</div>}

      <style jsx>{`
        .dash { min-height: 70vh; background: radial-gradient(ellipse 90% 60% at 50% 0%, #f4f8ff, #eef2f9 60%); padding: 38px 20px 70px; font-family: 'Chivo', system-ui, -apple-system, sans-serif; }
        .dash-inner { max-width: 1040px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
        .dash-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .dash-head h1 { font-size: 30px; font-weight: 800; color: #0e2c5c; margin: 0 0 4px; letter-spacing: -.01em; }
        .dash-head p { font-size: 14.5px; color: #5a6a85; margin: 0; }
        .dash-role { flex-shrink: 0; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 100px; background: #e9edf4; color: #5a6a85; text-transform: uppercase; letter-spacing: .05em; }
        .dash-role.admin { background: linear-gradient(135deg,#dbe8ff,#cfe0ff); color: #1e4ba8; }

        .dash-stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
        @media (max-width: 920px) { .dash-stats { grid-template-columns: repeat(3, 1fr); } }
        .dash-stat { display: flex; flex-direction: column; gap: 2px; padding: 16px 18px; border-radius: 14px; border: 1px solid #e6ecf5; background: #fff; cursor: pointer; text-align: left; transition: border-color .15s, transform .15s, box-shadow .15s; box-shadow: 0 8px 24px -16px rgba(10,26,51,.2); }
        .dash-stat:hover { transform: translateY(-2px); box-shadow: 0 12px 26px -14px rgba(10,26,51,.25); }
        .dash-stat.active { border-color: #2f6fe0; box-shadow: 0 0 0 3px rgba(47,111,224,.12); }
        .dash-stat-v { font-size: 26px; font-weight: 800; color: #0e2c5c; line-height: 1; }
        .dash-stat-l { font-size: 12px; color: #6a788f; font-weight: 600; }
        .dash-stat.green .dash-stat-v { color: #1f8a52; }
        .dash-stat.amber .dash-stat-v { color: #c98a10; }
        .dash-stat.teal .dash-stat-v { color: #1593a8; }
        .dash-stat.slate .dash-stat-v { color: #64748b; }

        .dash-quick { display: flex; gap: 10px; flex-wrap: wrap; }
        .dash-quick button { display: inline-flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #dce4ef; color: #2a3c5a; border-radius: 100px; padding: 9px 16px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: border-color .15s, background .15s, transform .15s; }
        .dash-quick button:hover { border-color: #b8c6db; background: #f7f9fc; transform: translateY(-1px); }
        .dash-quick button :global(svg) { color: #2f6fe0; }
        .dash-pubs { padding: 18px 20px; margin-bottom: 18px; }
        .dash-pubs-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .dash-pubs-head h3 { font-size: 14px; font-weight: 700; color: #0e2c5c; margin: 0; }
        .dash-pubs-all { background: none; border: none; color: #2f6fe0; font-size: 13px; font-weight: 600; cursor: pointer; }
        .dash-pubs-empty { color: #9aa3b5; font-size: 13.5px; margin: 4px 0; }
        .dash-pubs-list { display: flex; flex-direction: column; gap: 2px; }
        .dash-pub { display: flex; align-items: center; gap: 11px; padding: 9px 10px; border: none; background: none; border-radius: 9px; cursor: pointer; text-align: left; width: 100%; transition: background .14s; }
        .dash-pub:hover { background: #f4f7fc; }
        .dash-pub-type { flex-shrink: 0; font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 100px; text-transform: uppercase; letter-spacing: .04em; }
        .dash-pub-type.art { background: #e9f0fc; color: #2f6fe0; }
        .dash-pub-type.vid { background: #fdeee0; color: #b06a18; }
        .dash-pub-title { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 600; color: #0e2c5c; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dash-pub-meta { flex-shrink: 0; display: flex; align-items: center; gap: 10px; font-size: 12px; color: #9aa3b5; }
        .dash-pub-date { font-family: 'JetBrains Mono', monospace; color: #5a6a85; }

        .dash-card { background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; padding: 22px 24px; box-shadow: 0 10px 34px -18px rgba(10,26,51,.18); }
        .dash-card-title { font-size: 17px; font-weight: 700; color: #0e2c5c; margin: 0 0 14px; }
        .dash-getlisted { background: linear-gradient(135deg,#f4f8ff,#fff); border: 1px solid #dbe8ff; }
        .dash-getlisted .dash-card-title { margin: 8px 0 6px; }
        .dash-gl-eyebrow { font-size: 11.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #2f6fe0; }
        .dash-getlisted .dash-actions { margin-top: 16px; }
        .dash-co-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .dash-co-head .dash-card-title { margin-bottom: 0; }
        .dash-link { display: inline-flex; align-items: center; gap: 5px; background: none; border: none; color: #2f6fe0; font-size: 13px; font-weight: 600; cursor: pointer; }
        .dash-link :global(svg) { width: 14px; height: 14px; }
        .dash-status-row { margin: 14px 0 4px; }
        .dash-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 4px 11px; border-radius: 100px; letter-spacing: .02em; }
        .dash-status.live { background: #e4f6ec; color: #1f8a52; }
        .dash-status.draft { background: #fff4d9; color: #cf8e1e; }
        .dash-featured { margin-top: 18px; padding: 18px 20px; border-radius: 14px; background: linear-gradient(135deg,#0e2c5c,#1e478f); display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
        .dash-featured-txt { display: flex; flex-direction: column; gap: 3px; min-width: 220px; flex: 1; }
        .dash-featured-txt strong { color: #fff; font-size: 14.5px; }
        .dash-featured-txt span { color: #c5d6f0; font-size: 12.5px; line-height: 1.5; }
        .dash-featured .dash-btn.primary { width: auto; flex-shrink: 0; background: #fff; color: #0e2c5c; border: none; }
        .dash-featured .dash-btn.primary:hover { background: #f0f5ff; }
        .dash-card-sub { font-size: 13.5px; color: #6a788f; margin: -10px 0 16px; }
        .dash-empty, .muted { color: #8a93a6; }
        .dash-pad { padding: 28px; text-align: center; font-size: 14px; }

        .dash-toolbar { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #eef2f8; flex-wrap: wrap; }
        .dash-srch { display: flex; align-items: center; gap: 8px; background: #f4f7fc; border: 1.5px solid #e3e9f2; border-radius: 100px; padding: 8px 14px; color: #8a93a6; min-width: 210px; flex: 1; }
        .dash-srch input { border: none; outline: none; background: transparent; font-size: 13.5px; width: 100%; color: #0e2c5c; }
        .dash-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .dash-chip { border: 1.5px solid #e3e9f2; background: #fff; color: #5a6a85; border-radius: 100px; padding: 7px 13px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all .15s; }
        .dash-chip:hover { border-color: #b8c6db; }
        .dash-chip.on { background: #eef4ff; border-color: #2f6fe0; color: #2f6fe0; }

        .dash-tablewrap { overflow-x: auto; }
        .dash-table { width: 100%; border-collapse: collapse; }
        .dash-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #8a93a6; font-weight: 700; padding: 12px 16px; border-bottom: 1px solid #eef2f8; white-space: nowrap; }
        .dash-table th.ctr, .dash-table td.ctr { text-align: center; }
        .dash-table th.sortable { cursor: pointer; user-select: none; }
        .dash-table th.sortable:hover { color: #2f6fe0; }
        .dash-table th.sortable.act { color: #2f6fe0; }
        .dash-date { color: #8a93a6; font-size: 12.5px; white-space: nowrap; }
        .dash-queue-note { padding: 11px 16px; background: #f0f6ff; border-bottom: 1px solid #e0ebfb; font-size: 13px; color: #2a4a78; }
        .dash-table td { padding: 11px 16px; border-bottom: 1px solid #f2f5fa; font-size: 13.5px; color: #2a3c5a; vertical-align: middle; }
        .dash-table tr:last-child td { border-bottom: none; }
        .dash-table tr.warn td { background: #fffaf0; }
        .dash-co { display: flex; align-items: center; gap: 11px; }
        .dash-co img { width: 34px; height: 24px; object-fit: contain; flex-shrink: 0; }
        .dash-co-ph { width: 34px; height: 24px; display: grid; place-items: center; background: #eef2f8; border-radius: 5px; font-size: 10px; font-weight: 700; color: #8a93a6; flex-shrink: 0; }
        .dash-co-name { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 600; color: #0e2c5c; padding: 0; text-align: left; }
        .dash-co-name:hover { color: #2f6fe0; text-decoration: underline; }
        .dash-cat { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px; font-family: 'JetBrains Mono', monospace; }
        .dash-client { font-size: 10.5px; font-weight: 800; letter-spacing: .03em; padding: 4px 11px; border-radius: 100px; border: 1.5px solid transparent; cursor: pointer; white-space: nowrap; transition: filter .15s, background .15s; }
        .dash-client.paid { background: #e4f6ec; color: #1f8a52; border-color: #bce6cd; }
        .dash-client.free { background: #f1f4f9; color: #9aa3b5; }
        .dash-client:hover { filter: brightness(.96); }
        .dash-client:disabled { opacity: .55; cursor: default; }
        .dash-owner { color: #6a788f; font-size: 12.5px; max-width: 220px; }
        .dash-owner-name { display: block; color: #2a3c5a; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dash-owner-mail { display: inline-flex; align-items: center; gap: 4px; margin-top: 2px; color: #2f6fe0; font-size: 11.5px; text-decoration: none; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dash-owner-mail:hover { text-decoration: underline; }
        .dash-rowact { display: inline-flex; gap: 4px; }
        .dash-rowact button { width: 30px; height: 30px; display: grid; place-items: center; border: none; background: #f4f7fc; border-radius: 8px; color: #5a6a85; cursor: pointer; transition: background .15s, color .15s; }
        .dash-rowact button:hover { background: #e7eef8; color: #0e2c5c; }
        .dash-rowact button.del:hover { background: #fdeeee; color: #c0392b; }
        .dash-count { padding: 12px 16px; font-size: 12.5px; color: #8a93a6; border-top: 1px solid #eef2f8; }

        .dash-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
        .dash-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 100px; border: 1.5px solid #dce4ef; background: #fff; color: #2a3c5a; font-size: 14px; font-weight: 600; cursor: pointer; transition: border-color .15s, background .15s, transform .15s; }
        .dash-btn:hover { border-color: #b8c6db; transform: translateY(-1px); }
        .dash-btn.sm { padding: 8px 15px; font-size: 13px; }
        .dash-btn.primary { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); border-color: transparent; color: #fff; box-shadow: 0 6px 16px -6px rgba(47,111,224,.6); }
        .dash-btn.primary:hover { color: #fff; }
        .dash-btn.danger { border-color: #f3c9c9; color: #c0392b; }
        .dash-btn.danger:hover { background: #fdeeee; border-color: #e9a8a8; }
        .dash-btn.ghost { background: #f1f4f9; border-color: transparent; }

        .dash-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }
        .dash-tile { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; text-align: left; padding: 16px; border-radius: 14px; border: 1px solid #eef2f8; background: #fbfcfe; cursor: pointer; transition: border-color .15s, box-shadow .15s, transform .15s; }
        .dash-tile.solo { max-width: 280px; }
        .dash-tile:hover { border-color: #d6e0ef; box-shadow: 0 8px 22px -12px rgba(10,26,51,.2); transform: translateY(-2px); }
        .dash-tile-ic { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; margin-bottom: 6px; color: #fff; }
        .dash-tile-ic.blue { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); }
        .dash-tile-ic.amber { background: linear-gradient(135deg,#f7b955,#e8941f); }
        .dash-tile-ic.violet { background: linear-gradient(135deg,#9b8cff,#6d56e0); }
        .dash-tile-ic.slate { background: linear-gradient(135deg,#7d8aa3,#56627d); }
        .dash-tile-t { font-size: 14px; font-weight: 700; color: #0e2c5c; }
        .dash-tile-d { font-size: 12.5px; color: #7a899f; }

        .dash-backdrop { position: fixed; inset: 0; z-index: 300; background: rgba(10,26,51,.4); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .dash-modal { background: #fff; border-radius: 18px; padding: 28px; max-width: 380px; text-align: center; box-shadow: 0 24px 60px -12px rgba(10,26,51,.34); }
        .dash-modal-ic { width: 48px; height: 48px; margin: 0 auto 14px; border-radius: 50%; display: grid; place-items: center; background: #fdeeee; color: #c0392b; }
        .dash-modal h3 { font-size: 18px; font-weight: 700; color: #0e2c5c; margin: 0 0 8px; }
        .dash-modal p { font-size: 13.5px; color: #5a6a85; margin: 0 0 20px; line-height: 1.5; }
        .dash-modal-btns { display: flex; gap: 10px; justify-content: center; }

        .dash-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 320; padding: 13px 22px; border-radius: 100px; font-size: 14px; font-weight: 600; color: #fff; box-shadow: 0 12px 30px -8px rgba(10,26,51,.4); }
        .dash-toast.ok { background: #1f8a52; }
        .dash-toast.err { background: #c0392b; }

        @media (max-width: 760px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-head { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

// ── Toggle switch ────────────────────────────────────────────────────────────
function Switch({ on, busy, onClick, tone = "blue" }) {
  return (
    <button className={`sw ${on ? "on" : ""} ${tone} ${busy ? "busy" : ""}`} onClick={onClick} disabled={busy} aria-pressed={on}>
      <span className="knob" />
      <style jsx>{`
        .sw { position: relative; width: 38px; height: 22px; border-radius: 100px; border: none; background: #d7deea; cursor: pointer; transition: background .18s; padding: 0; }
        .sw.on.blue { background: #2f6fe0; }
        .sw.on.teal { background: #16a3b8; }
        .sw.busy { opacity: .55; cursor: default; }
        .knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: transform .18s; }
        .sw.on .knob { transform: translateX(16px); }
      `}</style>
    </button>
  );
}

// ── Searchable company select (vendor path) ──────────────────────────────────
function CompanySelect({ companies, loading, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const selected = companies.find((c) => String(c.id) === String(value));
  const searchable = companies.length > 8;
  const shown = q.trim() ? companies.filter((c) => (c.name || "").toLowerCase().includes(q.toLowerCase().trim())) : companies;
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="cs" ref={ref}>
      <button className={`cs-trigger ${selected ? "on" : ""}`} onClick={() => setOpen((o) => !o)} disabled={loading}>
        <span className={selected ? "cs-val" : "cs-ph"}>{loading ? "Loading…" : selected ? selected.name : "Select a company"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="cs-menu">
          {searchable && <div className="cs-search"><input autoFocus placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} /></div>}
          <div className="cs-list">
            {shown.map((c) => (
              <div key={c.id} className={`cs-opt ${String(c.id) === String(value) ? "sel" : ""}`} onClick={() => { onChange(c.id); setOpen(false); setQ(""); }}>{c.name}</div>
            ))}
            {!shown.length && <div className="cs-opt empty">No match</div>}
          </div>
        </div>
      )}
      <style jsx>{`
        .cs { position: relative; max-width: 420px; }
        .cs-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #dce4ef; background: #f7f9fc; color: #2a3c5a; cursor: pointer; font-size: 14.5px; }
        .cs-trigger.on { border-color: #2f6fe0; background: #f4f8ff; }
        .cs-val { font-weight: 600; color: #0e2c5c; }
        .cs-ph { color: #9aa3b5; }
        .cs-menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50; background: #fff; border: 1px solid #e1e7f1; border-radius: 12px; box-shadow: 0 16px 44px -12px rgba(10,26,51,.24); overflow: hidden; }
        .cs-search { padding: 10px 14px; border-bottom: 1px solid #f0f3f8; }
        .cs-search input { border: none; outline: none; background: transparent; font-size: 14px; width: 100%; color: #0e2c5c; }
        .cs-list { max-height: 280px; overflow-y: auto; padding: 4px; }
        .cs-opt { padding: 10px 14px; border-radius: 8px; font-size: 14px; color: #3a4a66; cursor: pointer; }
        .cs-opt:hover { background: #f4f8ff; color: #0e2c5c; }
        .cs-opt.sel { background: #eef4ff; color: #2f6fe0; font-weight: 600; }
        .cs-opt.empty { color: #9aa3b5; cursor: default; }
      `}</style>
    </div>
  );
}
