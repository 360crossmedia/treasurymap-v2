"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { apiGetAllCompanies } from "../service/apiGetAllCompanies";
import { apiGetCompaniesByOwner } from "../service/apiGetCompaniesByOwner";
import { apiDeleteCompanyById } from "../service/apiDeleteCompanyById";
import { apiGetCompanyHasMedia } from "../service/apiGetCompanyHasMedia";
import { apiUpdateCompany } from "../service/apiUpdateCompany";
import { apiGetAllUsers } from "../service/apiGetAllUsers";
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

const I = {
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  media: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m10 8 5 3-5 3V8z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  star: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "hidden", label: "Hidden" },
  { key: "multiplayer", label: "Multiplayer" },
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
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState({}); // id -> true while toggling

  // vendor-path single select
  const [selectedId, setSelectedId] = useState(null);
  // admin command-center state
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

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
        setUsers(Object.fromEntries((userList || []).map((u) => [u.id, u.fullName || u.email])));
        if (uid !== 1 && a.length === 1) selectCompany(a[0].id);
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
  const createCompany = () => { dispatch(setCompanyId(false)); try { localStorage.removeItem("companyId"); } catch (_) {} router.push("/form"); };

  // Inline partial-update toggle (live / multiplayerMap)
  const toggleField = async (c, field) => {
    const next = !c[field];
    setBusy((b) => ({ ...b, [c.id]: true }));
    setCompanies((cs) => cs.map((x) => (x.id === c.id ? { ...x, [field]: next } : x)));
    try {
      const res = await apiUpdateCompany(c.id, { [field]: next });
      if (!res || res.status !== 200) throw new Error();
    } catch (_) {
      setCompanies((cs) => cs.map((x) => (x.id === c.id ? { ...x, [field]: !next } : x)));
      showToast("Update failed — reverted.", "err");
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[c.id]; return n; });
    }
  };

  const askDelete = async (c) => {
    let hasMedia = false;
    try { hasMedia = await apiGetCompanyHasMedia(c.id); } catch (_) {}
    setConfirm({ id: c.id, name: c.name, hasMedia });
  };
  const doDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await apiDeleteCompanyById(confirm.id);
      if (res?.status === 200) {
        setCompanies((cs) => cs.filter((c) => c.id !== confirm.id));
        if (selectedId === confirm.id) { setSelectedId(null); dispatch(setCompanyId(false)); }
        showToast(`“${confirm.name}” deleted.`);
      } else showToast("Could not delete this company.", "err");
    } catch (_) { showToast("Could not delete this company.", "err"); }
    finally { setDeleting(false); setConfirm(null); }
  };

  // Stats
  const stats = useMemo(() => {
    const live = companies.filter((c) => c.live).length;
    return {
      all: companies.length,
      live,
      hidden: companies.length - live,
      multiplayer: companies.filter((c) => c.multiplayerMap).length,
      attention: companies.filter(needsAttention).length,
    };
  }, [companies]);

  // Filtered list
  const visible = useMemo(() => {
    const q = search.toLowerCase().trim();
    return companies.filter((c) => {
      if (filter === "live" && !c.live) return false;
      if (filter === "hidden" && c.live) return false;
      if (filter === "multiplayer" && !c.multiplayerMap) return false;
      if (filter === "attention" && !needsAttention(c)) return false;
      if (q && !(c.name || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [companies, filter, search]);

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
                { k: "all", label: "Companies", val: stats.all, tone: "blue" },
                { k: "live", label: "Live on map", val: stats.live, tone: "green" },
                { k: "hidden", label: "Hidden", val: stats.hidden, tone: "slate" },
                { k: "multiplayer", label: "Multiplayer", val: stats.multiplayer, tone: "teal" },
                { k: "attention", label: "Needs attention", val: stats.attention, tone: "amber" },
              ].map((s) => (
                <button key={s.k} className={`dash-stat ${s.tone} ${filter === s.k ? "active" : ""}`} onClick={() => setFilter(s.k)}>
                  <span className="dash-stat-v">{s.val}</span>
                  <span className="dash-stat-l">{s.label}</span>
                </button>
              ))}
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
                        <th>Company</th><th>Category</th><th>Owner</th>
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
                          <td className="dash-owner">{users[c.userId] || (c.userId === 1 ? "Admin" : `#${c.userId}`)}</td>
                          <td className="ctr"><Switch on={!!c.live} busy={busy[c.id]} onClick={() => toggleField(c, "live")} /></td>
                          <td className="ctr"><Switch on={!!c.multiplayerMap} busy={busy[c.id]} onClick={() => toggleField(c, "multiplayerMap")} tone="teal" /></td>
                          <td className="ctr">
                            <div className="dash-rowact">
                              <button title="Edit listing" onClick={() => openEdit(c.id)}>{I.edit}</button>
                              <button title="Media Zone" onClick={() => openMedia(c.id)}>{I.media}</button>
                              <button title="Delete" className="del" onClick={() => askDelete(c)}>{I.trash}</button>
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

            {/* Admin tools */}
            <section className="dash-card">
              <h2 className="dash-card-title">Admin tools</h2>
              <div className="dash-tiles">
                <button className="dash-tile" onClick={createCompany}>
                  <span className="dash-tile-ic blue">{I.plus}</span>
                  <span className="dash-tile-t">Create a company</span>
                  <span className="dash-tile-d">Add a new vendor listing</span>
                </button>
                <button className="dash-tile" onClick={() => router.push("/publicationsControl")}>
                  <span className="dash-tile-ic amber">{I.star}</span>
                  <span className="dash-tile-t">Publications control</span>
                  <span className="dash-tile-d">Choose the featured article/video</span>
                </button>
                <button className="dash-tile" onClick={() => router.push("/accountsettings")}>
                  <span className="dash-tile-ic violet">{I.users}</span>
                  <span className="dash-tile-t">Accounts settings</span>
                  <span className="dash-tile-d">Manage vendor accounts</span>
                </button>
                <button className="dash-tile" onClick={() => router.push("/myaccount")}>
                  <span className="dash-tile-ic slate">{I.user}</span>
                  <span className="dash-tile-t">My account</span>
                  <span className="dash-tile-d">Name, email and password</span>
                </button>
              </div>
            </section>
          </>
        ) : (
          /* ───────── VENDOR (simple) ───────── */
          <>
            <section className="dash-card">
              <h2 className="dash-card-title">Your company</h2>
              <p className="dash-card-sub">Edit your listing or manage your media.</p>
              <CompanySelect companies={companies} loading={loading} value={selectedId} onChange={selectCompany} />
              {selected && (
                <div className="dash-actions">
                  <button className="dash-btn primary" onClick={() => openEdit(selected.id)}>{I.edit} Edit listing</button>
                  <button className="dash-btn" onClick={() => openMedia(selected.id)}>{I.media} Media Zone</button>
                </div>
              )}
              {!loading && companies.length === 0 && <p className="dash-empty">No company is linked to your account yet.</p>}
            </section>
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

      {/* Delete confirm */}
      {confirm && (
        <div className="dash-backdrop" onClick={() => !deleting && setConfirm(null)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-ic">{I.trash}</div>
            <h3>Delete “{confirm.name}”?</h3>
            <p>{confirm.hasMedia
              ? "This company owns articles/videos — they will be deleted too. This cannot be undone."
              : "This permanently removes the company from the map. This cannot be undone."}</p>
            <div className="dash-modal-btns">
              <button className="dash-btn ghost" disabled={deleting} onClick={() => setConfirm(null)}>Cancel</button>
              <button className="dash-btn danger" disabled={deleting} onClick={doDelete}>{deleting ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className={`dash-toast ${toast.kind}`}>{toast.msg}</div>}

      <style jsx>{`
        .dash { min-height: 70vh; background: radial-gradient(ellipse 90% 60% at 50% 0%, #f4f8ff, #eef2f9 60%); padding: 38px 20px 70px; font-family: 'Chivo', system-ui, -apple-system, sans-serif; }
        .dash-inner { max-width: 1040px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
        .dash-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .dash-head h1 { font-size: 30px; font-weight: 800; color: #0e2c5c; margin: 0 0 4px; letter-spacing: -.01em; }
        .dash-head p { font-size: 14.5px; color: #5a6a85; margin: 0; }
        .dash-role { flex-shrink: 0; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 100px; background: #e9edf4; color: #5a6a85; text-transform: uppercase; letter-spacing: .05em; }
        .dash-role.admin { background: linear-gradient(135deg,#dbe8ff,#cfe0ff); color: #1e4ba8; }

        .dash-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .dash-stat { display: flex; flex-direction: column; gap: 2px; padding: 16px 18px; border-radius: 14px; border: 1px solid #e6ecf5; background: #fff; cursor: pointer; text-align: left; transition: border-color .15s, transform .15s, box-shadow .15s; box-shadow: 0 8px 24px -16px rgba(10,26,51,.2); }
        .dash-stat:hover { transform: translateY(-2px); box-shadow: 0 12px 26px -14px rgba(10,26,51,.25); }
        .dash-stat.active { border-color: #2f6fe0; box-shadow: 0 0 0 3px rgba(47,111,224,.12); }
        .dash-stat-v { font-size: 26px; font-weight: 800; color: #0e2c5c; line-height: 1; }
        .dash-stat-l { font-size: 12px; color: #6a788f; font-weight: 600; }
        .dash-stat.green .dash-stat-v { color: #1f8a52; }
        .dash-stat.amber .dash-stat-v { color: #c98a10; }
        .dash-stat.teal .dash-stat-v { color: #1593a8; }
        .dash-stat.slate .dash-stat-v { color: #64748b; }

        .dash-card { background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; padding: 22px 24px; box-shadow: 0 10px 34px -18px rgba(10,26,51,.18); }
        .dash-card-title { font-size: 17px; font-weight: 700; color: #0e2c5c; margin: 0 0 14px; }
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
        .dash-table td { padding: 11px 16px; border-bottom: 1px solid #f2f5fa; font-size: 13.5px; color: #2a3c5a; vertical-align: middle; }
        .dash-table tr:last-child td { border-bottom: none; }
        .dash-table tr.warn td { background: #fffaf0; }
        .dash-co { display: flex; align-items: center; gap: 11px; }
        .dash-co img { width: 34px; height: 24px; object-fit: contain; flex-shrink: 0; }
        .dash-co-ph { width: 34px; height: 24px; display: grid; place-items: center; background: #eef2f8; border-radius: 5px; font-size: 10px; font-weight: 700; color: #8a93a6; flex-shrink: 0; }
        .dash-co-name { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 600; color: #0e2c5c; padding: 0; text-align: left; }
        .dash-co-name:hover { color: #2f6fe0; text-decoration: underline; }
        .dash-cat { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px; font-family: 'JetBrains Mono', monospace; }
        .dash-owner { color: #6a788f; font-size: 12.5px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
