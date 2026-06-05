const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// Allow crawling of public content; keep auth/admin/account areas out of the
// index. Points crawlers at the sitemap for discovery (the homepage map is a
// canvas with no crawlable links, so the sitemap is the main entry point).
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/login",
        "/signup",
        "/myaccount",
        "/accountsettings",
        "/form",
        "/publicationsControl",
        "/restorePassword",
        "/linkupdate",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
