"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { apiGetAllCompanies } from "../service/apiGetAllCompanies";
import { apiGetCompaniesByOwner } from "../service/apiGetCompaniesByOwner";
import { apiDeleteCompanyById } from "../service/apiDeleteCompanyById";
import { apiGetCompanyHasMedia } from "../service/apiGetCompanyHasMedia";

// ── icons ────────────────────────────────────────────────────────────────────
const I = {
  edit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  media: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m10 8 5 3-5 3V8z"/></svg>,
  trash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  star: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  chevron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
};

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userIdRedux = useSelector((s) => s.user);

  const [userId, setUserId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { name, hasMedia }
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const isAdmin = userId === 1;

  useEffect(() => {
    const uid = Number(localStorage.getItem("userId")) || userIdRedux || null;
    setUserId(uid);
    (async () => {
      try {
        const list = uid === 1 ? await apiGetAllCompanies() : await apiGetCompaniesByOwner(uid);
        const arr = Array.isArray(list) ? list : [];
        setCompanies(arr.sort((a, b) => (a.name || "").localeCompare(b.name || "")));
        // Non-admins with a single company: preselect it
        if (uid !== 1 && arr.length === 1) selectCompany(arr[0].id);
      } catch (_) {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3200); };

  const selectCompany = (id) => {
    setSelectedId(id);
    dispatch(setCompanyId(Number(id)));
    try { localStorage.setItem("companyId", Number(id)); } catch (_) {}
  };

  const selected = useMemo(() => companies.find((c) => String(c.id) === String(selectedId)), [companies, selectedId]);

  const goEdit = () => { if (!selected) return; selectCompany(selected.id); router.push("/form"); };
  const goMedia = () => { if (!selected) return; selectCompany(selected.id); router.push("/mediaZone"); };

  const askDelete = async () => {
    if (!selected) return;
    let hasMedia = false;
    try { hasMedia = await apiGetCompanyHasMedia(selected.id); } catch (_) {}
    setConfirm({ name: selected.name, hasMedia });
  };

  const doDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await apiDeleteCompanyById(selected.id);
      if (res?.status === 200) {
        setCompanies((cs) => cs.filter((c) => c.id !== selected.id));
        setSelectedId(null);
        dispatch(setCompanyId(false));
        showToast(`“${selected.name}” deleted.`);
      } else {
        showToast("Could not delete this company.", "err");
      }
    } catch (_) {
      showToast("Could not delete this company.", "err");
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const createCompany = () => { dispatch(setCompanyId(false)); try { localStorage.removeItem("companyId"); } catch (_) {} router.push("/form"); };

  return (
    <div className="dash">
      <div className="dash-inner">
        {/* Header */}
        <header className="dash-head">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your treasury listings, publications and account.</p>
          </div>
          <span className={`dash-role ${isAdmin ? "admin" : ""}`}>{isAdmin ? "Administrator" : "Vendor"}</span>
        </header>

        {/* Manage a company */}
        <section className="dash-card">
          <h2 className="dash-card-title">{isAdmin ? "Manage a company" : "Your company"}</h2>
          <p className="dash-card-sub">
            {isAdmin ? "Pick a company to edit its listing or media." : "Edit your listing or manage your media."}
          </p>

          <CompanySelect
            companies={companies}
            loading={loading}
            value={selectedId}
            onChange={selectCompany}
          />

          {selected && (
            <div className="dash-actions">
              <button className="dash-btn primary" onClick={goEdit}>{I.edit} Edit listing</button>
              <button className="dash-btn" onClick={goMedia}>{I.media} Media Zone</button>
              {isAdmin && <button className="dash-btn danger" onClick={askDelete}>{I.trash} Delete</button>}
            </div>
          )}
          {!loading && companies.length === 0 && (
            <p className="dash-empty">No company is linked to your account yet.</p>
          )}
        </section>

        {/* Admin tools */}
        {isAdmin && (
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
            </div>
          </section>
        )}

        {/* Account */}
        <section className="dash-card">
          <h2 className="dash-card-title">Your account</h2>
          <button className="dash-tile solo" onClick={() => router.push("/myaccount")}>
            <span className="dash-tile-ic slate">{I.user}</span>
            <span className="dash-tile-t">My account</span>
            <span className="dash-tile-d">Name, email and password</span>
          </button>
        </section>
      </div>

      {/* Delete confirm modal */}
      {confirm && (
        <div className="dash-backdrop" onClick={() => !deleting && setConfirm(null)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-ic">{I.trash}</div>
            <h3>Delete “{confirm.name}”?</h3>
            <p>
              {confirm.hasMedia
                ? "This company owns articles/videos — they will be deleted too. This cannot be undone."
                : "This permanently removes the company from the map. This cannot be undone."}
            </p>
            <div className="dash-modal-btns">
              <button className="dash-btn ghost" disabled={deleting} onClick={() => setConfirm(null)}>Cancel</button>
              <button className="dash-btn danger" disabled={deleting} onClick={doDelete}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`dash-toast ${toast.kind}`}>{toast.msg}</div>}

      <style jsx>{`
        .dash { min-height: 70vh; background: radial-gradient(ellipse 90% 60% at 50% 0%, #f4f8ff, #eef2f9 60%); padding: 40px 20px 70px; font-family: 'Chivo', system-ui, -apple-system, sans-serif; }
        .dash-inner { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .dash-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
        .dash-head h1 { font-size: 30px; font-weight: 800; color: #0e2c5c; margin: 0 0 4px; letter-spacing: -.01em; }
        .dash-head p { font-size: 14.5px; color: #5a6a85; margin: 0; }
        .dash-role { flex-shrink: 0; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 100px; background: #e9edf4; color: #5a6a85; text-transform: uppercase; letter-spacing: .05em; }
        .dash-role.admin { background: linear-gradient(135deg,#dbe8ff,#cfe0ff); color: #1e4ba8; }

        .dash-card { background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; padding: 24px 26px; box-shadow: 0 10px 34px -18px rgba(10,26,51,.18); }
        .dash-card-title { font-size: 17px; font-weight: 700; color: #0e2c5c; margin: 0 0 3px; }
        .dash-card-sub { font-size: 13.5px; color: #6a788f; margin: 0 0 16px; }
        .dash-empty { font-size: 13.5px; color: #8a93a6; margin: 14px 0 0; }

        .dash-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
        .dash-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 100px; border: 1.5px solid #dce4ef; background: #fff; color: #2a3c5a; font-size: 14px; font-weight: 600; cursor: pointer; transition: border-color .15s, background .15s, transform .15s; }
        .dash-btn:hover { border-color: #b8c6db; transform: translateY(-1px); }
        .dash-btn.primary { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); border-color: transparent; color: #fff; box-shadow: 0 6px 16px -6px rgba(47,111,224,.6); }
        .dash-btn.primary:hover { color: #fff; }
        .dash-btn.danger { border-color: #f3c9c9; color: #c0392b; }
        .dash-btn.danger:hover { background: #fdeeee; border-color: #e9a8a8; }
        .dash-btn.ghost { background: #f1f4f9; border-color: transparent; }

        .dash-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        .dash-tile { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; text-align: left; padding: 18px; border-radius: 14px; border: 1px solid #eef2f8; background: #fbfcfe; cursor: pointer; transition: border-color .15s, box-shadow .15s, transform .15s; }
        .dash-tile.solo { max-width: 280px; }
        .dash-tile:hover { border-color: #d6e0ef; box-shadow: 0 8px 22px -12px rgba(10,26,51,.2); transform: translateY(-2px); }
        .dash-tile-ic { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px; margin-bottom: 8px; color: #fff; }
        .dash-tile-ic.blue { background: linear-gradient(135deg,#4D8DFF,#2f6fe0); }
        .dash-tile-ic.amber { background: linear-gradient(135deg,#f7b955,#e8941f); }
        .dash-tile-ic.violet { background: linear-gradient(135deg,#9b8cff,#6d56e0); }
        .dash-tile-ic.slate { background: linear-gradient(135deg,#7d8aa3,#56627d); }
        .dash-tile-t { font-size: 14.5px; font-weight: 700; color: #0e2c5c; }
        .dash-tile-d { font-size: 12.5px; color: #7a899f; }

        .dash-backdrop { position: fixed; inset: 0; z-index: 300; background: rgba(10,26,51,.4); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fade .15s ease; }
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        .dash-modal { background: #fff; border-radius: 18px; padding: 28px; max-width: 380px; text-align: center; box-shadow: 0 24px 60px -12px rgba(10,26,51,.34); }
        .dash-modal-ic { width: 48px; height: 48px; margin: 0 auto 14px; border-radius: 50%; display: grid; place-items: center; background: #fdeeee; color: #c0392b; }
        .dash-modal h3 { font-size: 18px; font-weight: 700; color: #0e2c5c; margin: 0 0 8px; }
        .dash-modal p { font-size: 13.5px; color: #5a6a85; margin: 0 0 20px; line-height: 1.5; }
        .dash-modal-btns { display: flex; gap: 10px; justify-content: center; }

        .dash-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 320; padding: 13px 22px; border-radius: 100px; font-size: 14px; font-weight: 600; color: #fff; box-shadow: 0 12px 30px -8px rgba(10,26,51,.4); animation: fade .15s ease; }
        .dash-toast.ok { background: #1f8a52; }
        .dash-toast.err { background: #c0392b; }

        @media (max-width: 560px) {
          .dash-head { flex-direction: column; }
          .dash-card { padding: 20px; }
        }
      `}</style>
    </div>
  );
}

// ── Searchable company select ────────────────────────────────────────────────
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
        <span className={selected ? "cs-val" : "cs-ph"}>
          {loading ? "Loading companies…" : selected ? selected.name : "Select a company"}
        </span>
        {I.chevron}
      </button>
      {open && (
        <div className="cs-menu">
          {searchable && (
            <div className="cs-search">
              {I.search}
              <input autoFocus placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          )}
          <div className="cs-list">
            {shown.map((c) => (
              <div key={c.id} className={`cs-opt ${String(c.id) === String(value) ? "sel" : ""}`}
                onClick={() => { onChange(c.id); setOpen(false); setQ(""); }}>
                {c.name}
              </div>
            ))}
            {!shown.length && <div className="cs-opt empty">No match</div>}
          </div>
        </div>
      )}

      <style jsx>{`
        .cs { position: relative; max-width: 420px; }
        .cs-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #dce4ef; background: #f7f9fc; color: #2a3c5a; cursor: pointer; font-size: 14.5px; transition: border-color .15s, background .15s; }
        .cs-trigger:hover { border-color: #b8c6db; }
        .cs-trigger.on { border-color: #2f6fe0; background: #f4f8ff; }
        .cs-trigger:disabled { opacity: .7; cursor: default; }
        .cs-val { font-weight: 600; color: #0e2c5c; }
        .cs-ph { color: #9aa3b5; }
        .cs-menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50; background: #fff; border: 1px solid #e1e7f1; border-radius: 12px; box-shadow: 0 16px 44px -12px rgba(10,26,51,.24); overflow: hidden; }
        .cs-search { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid #f0f3f8; color: #8a93a6; }
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
