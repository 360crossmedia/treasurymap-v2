// Server-side data helpers shared by the homepage "by category" section and the
// /category/[slug] landing pages. Grouping mirrors the homepage map exactly
// (see ProceduralMap.toCats): live + has logo + maincategory[0], one logo per
// vendor, dedupe by name. Using the same rule keeps the map, the home section
// and the category pages perfectly consistent (same vendors, same counts).
import { url } from "../../service/url";
import { providerHref } from "../../utils/slugify";
import { CAT_META } from "./catMeta";

export async function fetchCompanies() {
  try {
    const res = await fetch(`${url}/api/v1/companies/`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function toItem(c) {
  return {
    _k: (c.name || "").trim().toLowerCase() || `id-${c.id}`,
    id: c.id,
    name: c.name || "Provider",
    href: providerHref({ name: c.name, id: c.id }),
    logo: c.logo || "",
    location: c.location || "",
    website: c.companyWebsite || "",
  };
}

// { catId: [item, ...] } · deduped by name, items sorted alphabetically.
export function groupByMainCategory(companies) {
  const byCat = {};
  for (const c of companies) {
    if (!c.live || !c.logo) continue;
    if (!c.maincategory || !c.maincategory.length) continue;
    const catId = c.maincategory[0];
    if (!CAT_META[`category-${catId}`]) continue;
    (byCat[catId] ||= []);
    const item = toItem(c);
    if (byCat[catId].some((x) => x._k === item._k)) continue;
    byCat[catId].push(item);
  }
  for (const k of Object.keys(byCat)) {
    byCat[k].sort((a, b) => a.name.localeCompare(b.name));
  }
  return byCat;
}

// Providers for a single category id (deduped, alphabetical).
export async function getCategoryProviders(catId) {
  const companies = await fetchCompanies();
  return (groupByMainCategory(companies)[catId]) || [];
}
