// Server-side proxy — bypasses CORS restriction on the client back.
// The client back only allows Origin: treasurymap.com, so browser requests
// from localhost (dev) or our Railway front are blocked.
// This route fetches server-side and forwards the JSON.
const CLIENT_BACK = "https://treasurymapbackend-production.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${CLIENT_BACK}/api/v1/mapdata/multiplayerMap`, {
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
