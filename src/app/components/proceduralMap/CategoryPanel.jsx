"use client";
import { cld } from "../../utils/cloudinary";

// Full category drill-down: shows EVERY vendor of a category in a clean grid
// (no constellation packing → nothing is ever hidden). Opened by clicking a
// category label on the map.
export default function CategoryPanel({ cat, categoryId, onClose }) {
  if (!cat) return null;
  const hue = cat.hue;
  const items = [...cat.items].sort((a, b) => (a.n || "").localeCompare(b.n || ""));

  return (
    <div className="catpanel-backdrop" onClick={onClose}>
      <div className="catpanel" onClick={(e) => e.stopPropagation()}>
        <button className="catpanel-x" onClick={onClose} aria-label="Close">✕</button>

        <div className="catpanel-head">
          <span className="catpanel-dot" style={{ background: `hsl(${hue},75%,55%)`, boxShadow: `0 0 12px hsl(${hue},75%,60%)` }} />
          <div className="catpanel-titles">
            <div className="catpanel-code">{cat.code}</div>
            <div className="catpanel-full">{cat.full}</div>
          </div>
          <span className="catpanel-count" style={{ background: `hsl(${hue},70%,93%)`, color: `hsl(${hue},55%,32%)` }}>
            {items.length} vendor{items.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="catpanel-grid">
          {items.map((it) => (
            <a className="catpanel-cell" href={it.href} key={it.id || it.n} title={it.n}>
              <div className="catpanel-logo">
                <img src={cld(it.i, { w: 200 })} alt={it.n} loading="lazy" />
              </div>
              <div className="catpanel-name">{it.n}</div>
            </a>
          ))}
        </div>

        <a className="catpanel-compare" href="/get-my-list"
          style={{ background: `linear-gradient(135deg,hsl(${hue},80%,55%),hsl(${hue},65%,38%))` }}>
          Build my shortlist →
        </a>
      </div>

      <style jsx>{`
        .catpanel-backdrop {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(10,26,51,.42);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 32px 20px; animation: cpFade .18s ease;
        }
        @keyframes cpFade { from { opacity: 0 } to { opacity: 1 } }
        .catpanel {
          position: relative; background: #fff; border-radius: 22px;
          width: min(960px, 100%); max-height: 86vh; overflow-y: auto;
          padding: 30px 34px 34px;
          box-shadow: 0 30px 80px -16px rgba(10,26,51,.4);
          font-family: 'Chivo', system-ui, sans-serif;
          animation: cpIn .22s ease;
        }
        @keyframes cpIn { from { transform: scale(.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .catpanel-x {
          position: absolute; top: 18px; right: 20px;
          background: #f1f4f9; border: none; border-radius: 50%;
          width: 34px; height: 34px; cursor: pointer;
          color: #5a6a85; font-size: 15px; line-height: 1;
          transition: background .15s, color .15s;
        }
        .catpanel-x:hover { background: #e3e9f3; color: #0e2c5c; }
        .catpanel-head {
          display: flex; align-items: center; gap: 14px;
          padding-bottom: 20px; margin-bottom: 22px;
          border-bottom: 1px solid #eef2f8;
        }
        .catpanel-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
        .catpanel-titles { display: flex; flex-direction: column; gap: 2px; }
        .catpanel-code {
          font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 28px;
          letter-spacing: .04em; color: #0d2342; text-transform: uppercase; line-height: 1;
        }
        .catpanel-full { font-size: 13.5px; color: #5a6a85; }
        .catpanel-count {
          margin-left: auto; font-family: 'JetBrains Mono', monospace;
          font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 100px;
        }
        .catpanel-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
          gap: 12px;
        }
        .catpanel-cell {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 16px 10px 12px; border-radius: 14px;
          border: 1px solid #eef2f8; text-decoration: none;
          transition: transform .16s, box-shadow .16s, border-color .16s;
        }
        .catpanel-cell:hover {
          transform: translateY(-3px); border-color: #d6e0ef;
          box-shadow: 0 10px 26px -10px rgba(10,26,51,.22);
        }
        .catpanel-logo {
          height: 54px; width: 100%; display: flex; align-items: center; justify-content: center;
        }
        .catpanel-logo img { max-width: 100%; max-height: 54px; object-fit: contain; }
        .catpanel-name {
          font-size: 12px; font-weight: 600; color: #2a3c5a; text-align: center;
          line-height: 1.3; overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .catpanel-compare {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 26px;
          color: #fff; padding: 12px 24px; border-radius: 100px;
          font-weight: 600; font-size: 14px; text-decoration: none;
          box-shadow: 0 8px 22px -8px rgba(10,26,51,.4);
          transition: transform .18s;
        }
        .catpanel-compare:hover { transform: translateY(-2px); color: #fff; }
        @media (max-width: 560px) {
          .catpanel { padding: 22px 18px 26px; border-radius: 18px; }
          .catpanel-grid { grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 9px; }
          .catpanel-code { font-size: 23px; }
        }
      `}</style>
    </div>
  );
}
