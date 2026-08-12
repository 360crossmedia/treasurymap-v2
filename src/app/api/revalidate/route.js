import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import jwt from "jsonwebtoken";

// On-demand revalidation. Lets an authenticated admin flush the cached public
// pages (Insights) immediately after changing the featured publications, instead
// of waiting for the 5-minute ISR window. Only a valid admin token (id 1) works,
// verified server-side with the shared JWT_SECRET, so this can't be abused.
export async function POST(req) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS512"] });
    } catch {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    if (Number(decoded && decoded.id) !== 1) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
    // Insights list + every article and video detail page (dynamic routes).
    revalidatePath("/insights");
    revalidatePath("/publication/article/[articleId]", "page");
    revalidatePath("/publication/video/[videoId]", "page");
    // Company-driven public pages: the homepage "by category" section, the
    // /providers hub, and all 15 category landing pages. Flushed so a newly
    // added or edited vendor shows immediately instead of after the ISR window.
    revalidatePath("/");
    revalidatePath("/providers");
    revalidatePath("/category/[slug]", "page");
    revalidatePath("/partners");
    // Individual vendor profile pages (edited company data must show at once).
    revalidatePath("/companyPage/[companyId]", "page");
    revalidatePath("/providers/[slug]", "page");
    return NextResponse.json({
      ok: true,
      revalidated: [
        "/insights",
        "/publication/article/*",
        "/publication/video/*",
        "/",
        "/providers",
        "/category/*",
      ],
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "revalidate failed" }, { status: 500 });
  }
}
