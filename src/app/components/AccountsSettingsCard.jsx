"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { apiGetAllCompanies } from "../service/apiGetAllCompanies";
import { setUserIdToUpdate } from "../store/slices/userIdToUpdate.slice";

const AccountsSettingsCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const getCompanies = async () => {
    const list = await apiGetAllCompanies();
    setCompanies(Array.isArray(list) ? list.sort((a, b) => (a.name || "").localeCompare(b.name || "")) : []);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const openMine = () => {
    dispatch(setUserIdToUpdate(false));
    try { localStorage.removeItem("userIdToUpdate"); } catch (_) {}
    router.push("/myaccount");
  };

  const openSelected = () => {
    if (!selectedUserId) return;
    dispatch(setUserIdToUpdate(Number(selectedUserId)));
    try { localStorage.setItem("userIdToUpdate", Number(selectedUserId)); } catch (_) {}
    router.push("/myaccount");
  };

  return (
    <div className="as">
      <div className="as-card">
        <header className="as-head">
          <h1 className="as-title">Accounts</h1>
          <p className="as-sub">Manage your own account, or open a company owner’s account.</p>
        </header>

        <button className="as-btn primary" onClick={openMine}>My account</button>

        <div className="as-divider"><span>or open another account</span></div>

        <label className="as-label">Company owner</label>
        <div className="as-selectwrap">
          <select className="as-select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">Select a company…</option>
            {companies?.map((c, i) => (
              <option key={i} value={c.userId}>{c.name}</option>
            ))}
          </select>
          <span className="as-caret">▾</span>
        </div>
        <button className="as-btn" disabled={!selectedUserId} onClick={openSelected}>Open this account</button>
      </div>

      <style jsx>{`
        .as { min-height: 70vh; background: radial-gradient(ellipse 100% 40% at 50% 0%, #eef4ff 0%, #eef2f9 55%); padding: 48px 20px 70px; font-family: "Chivo", system-ui, -apple-system, sans-serif; }
        .as-card { max-width: 460px; margin: 0 auto; background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; box-shadow: 0 12px 40px -22px rgba(10,26,51,.28); padding: 32px 30px; }
        .as-head { margin-bottom: 22px; }
        .as-title { font-size: 1.5rem; font-weight: 800; color: #0e2c5c; margin: 0 0 6px; letter-spacing: -.01em; }
        .as-sub { font-size: 14px; color: #5a6a85; margin: 0; line-height: 1.5; }
        .as-btn { width: 100%; border: 1.5px solid #dce4ef; background: #f1f4f9; color: #2a3c5a; border-radius: 100px; padding: 12px 18px; font-size: 14.5px; font-weight: 700; cursor: pointer; transition: background .15s, transform .15s; }
        .as-btn:hover:not(:disabled) { background: #e7ecf4; }
        .as-btn:disabled { opacity: .5; cursor: default; }
        .as-btn.primary { border-color: transparent; background: linear-gradient(135deg,#4D8DFF,#2f6fe0); color: #fff; box-shadow: 0 8px 20px -8px rgba(47,111,224,.55); }
        .as-btn.primary:hover { transform: translateY(-1px); }
        .as-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; color: #9aa3b5; font-size: 12px; }
        .as-divider::before, .as-divider::after { content: ""; flex: 1; height: 1px; background: #eef2f8; }
        .as-label { display: block; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #9aa3b5; margin-bottom: 8px; }
        .as-selectwrap { position: relative; margin-bottom: 14px; }
        .as-select { width: 100%; appearance: none; border: 1.5px solid #e3e9f2; background: #f7f9fc; border-radius: 12px; padding: 12px 38px 12px 14px; font-size: 14.5px; color: #0e2c5c; outline: none; cursor: pointer; transition: border-color .15s, box-shadow .15s, background .15s; }
        .as-select:focus { border-color: #2f6fe0; background: #fff; box-shadow: 0 0 0 3px rgba(47,111,224,.12); }
        .as-caret { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #8a93a6; pointer-events: none; font-size: 12px; }
      `}</style>
    </div>
  );
};

export default AccountsSettingsCard;
