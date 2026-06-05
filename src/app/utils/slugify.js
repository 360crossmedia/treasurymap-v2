export function slugify(input) {
  if (!input) return "";
  return String(input)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function providerHref(company) {
  const slug = slugify(company?.name);
  return slug ? `/providers/${slug}` : `/companyPage/${company?.id}`;
}

// Cap a slug to a sensible length on a word (dash) boundary.
function capSlug(s, max = 45) {
  if (!s || s.length <= max) return s || "";
  const cut = s.slice(0, max);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 20 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}

// SEO slug for a publication: "{title-slug}-{id}". The trailing id is what the
// page uses for lookup; the keyword-rich title slug is the SEO value.
export function publicationSlug(publication) {
  if (!publication?.id) return "";
  const ts = capSlug(slugify(publication.title || ""));
  return ts ? `${ts}-${publication.id}` : `${publication.id}`;
}

// SEO-friendly publication URL: /publication/{article|video}/{title-slug}-{id}
// (companyName arg kept for backward-compatibility; no longer used.)
export function publicationHref(publication, companyName) {
  if (!publication?.id) return "#";
  const type = publication.url ? "video" : "article";
  return `/publication/${type}/${publicationSlug(publication)}`;
}

// Extract the trailing numeric id from a publication slug ("cops-276" -> "276").
export function idFromPublicationSlug(slug) {
  if (slug == null) return null;
  const parts = String(slug).split("-");
  const last = parts[parts.length - 1];
  return /^\d+$/.test(last) ? last : String(slug);
}
