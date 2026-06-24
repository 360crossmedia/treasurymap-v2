import { url } from "./service/url";
import { slugify, publicationHref } from "./utils/slugify";
import { CATEGORIES } from "./components/proceduralMap/categoryInfo";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// Fetch a list endpoint from the API; tolerate failures (a flaky API must never
// break the sitemap build) and unwrap the common { data: [...] } shape.
async function getList(path) {
  try {
    const res = await fetch(`${url}/api/v1/${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch {
    return [];
  }
}

function lastMod(item) {
  const d = item?.updatedAt || item?.createdAt;
  if (!d) return undefined;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap() {
  const [companies, articles, videos] = await Promise.all([
    getList("companies"),
    getList("publications"), // articles (no url field)
    getList("videos"), // videos (have a url field → routed as /publication/video/…)
  ]);
  const publications = [...articles, ...videos];

  // Public static pages that actually exist as routes.
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/providers", priority: 0.9, changeFrequency: "daily" },
    { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
    { path: "/multiplayer-map", priority: 0.6, changeFrequency: "weekly" },
    { path: "/contactUs", priority: 0.3, changeFrequency: "yearly" },
    { path: "/gdpr", priority: 0.2, changeFrequency: "yearly" },
  ].map((p) => ({
    url: `${SITE_URL}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Only LIVE vendors (the public set shown on the map) with a usable slug.
  const vendorPages = (Array.isArray(companies) ? companies : [])
    .filter((c) => c && c.live && c.name && slugify(c.name))
    .map((c) => ({
      url: `${SITE_URL}/providers/${slugify(c.name)}`,
      lastModified: lastMod(c),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Live articles + videos. publicationHref routes /publication/{type}/{slug}
  // (type = video when the record has a url field, else article).
  const publicationPages = publications
    .filter((p) => p && p.id && p.live)
    .map((p) => ({
      url: `${SITE_URL}${publicationHref(p)}`,
      lastModified: lastMod(p),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // One landing page per treasury-technology category (/category/[slug]).
  const categoryPages = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...vendorPages, ...publicationPages];
}
