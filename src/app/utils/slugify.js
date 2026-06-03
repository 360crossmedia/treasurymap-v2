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

// SEO-friendly publication URL: /publication/{article|video}/{company-slug}-{id}
// The trailing id is what the page uses for lookup; the slug is cosmetic/SEO.
export function publicationHref(publication, companyName) {
  if (!publication?.id) return "#";
  const type = publication.url ? "video" : "article";
  const cs = slugify(companyName);
  const slug = cs ? `${cs}-${publication.id}` : `${publication.id}`;
  return `/publication/${type}/${slug}`;
}

// Extract the trailing numeric id from a publication slug ("cops-276" -> "276").
export function idFromPublicationSlug(slug) {
  if (slug == null) return null;
  const parts = String(slug).split("-");
  const last = parts[parts.length - 1];
  return /^\d+$/.test(last) ? last : String(slug);
}
