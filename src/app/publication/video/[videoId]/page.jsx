import { cache } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import PublicationView from "../../../components/PublicationView";
import { url } from "../../../service/url";
import { slugify, idFromPublicationSlug } from "../../../utils/slugify";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

const getJson = async (path, revalidate) => {
  try {
    const r = await fetch(`${url}/api/v1/${path}`, { next: { revalidate } });
    return r.ok ? r.json() : null;
  } catch { return null; }
};

const fetchVideo     = cache((id) => getJson(`videos/${id}`, 300));
const fetchCompany   = cache((id) => (id ? getJson(`companies/${id}`, 3600) : null));
const fetchCategory  = cache((id) => (id ? getJson(`categories/${id}`, 86400) : null));
const fetchByCat     = cache((id) => (id ? getJson(`publications/${id}`, 300) : null));
const fetchCompanies = cache(() => getJson(`companies`, 3600));

export async function generateMetadata({ params }) {
  const { videoId } = await params;
  const id = idFromPublicationSlug(videoId);
  const video = await fetchVideo(id);
  if (!video) return {};
  const company = await fetchCompany(video.companyId);
  const cs = slugify(company?.name);
  const canonical = `${SITE}/publication/video/${cs ? `${cs}-${id}` : id}`;
  const title = `${video.title}${company?.name ? ` — ${company.name}` : ""} | TreasuryMap`;
  const description = (video.introduction || video.title || "").slice(0, 200);
  const image = video.coverImage;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title: video.title, description, url: canonical, type: "video.other",
      siteName: "TreasuryMap", images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title: video.title, description, images: image ? [image] : undefined },
  };
}

function JsonLd({ video, company, id }) {
  const cs = slugify(company?.name);
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.introduction || video.title,
    thumbnailUrl: video.coverImage || undefined,
    uploadDate: video.createdAt || undefined,
    contentUrl: video.url || undefined,
    publisher: { "@type": "Organization", name: "TreasuryMap" },
    mainEntityOfPage: `${SITE}/publication/video/${cs ? `${cs}-${id}` : id}`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function VideoPage({ params }) {
  const { videoId } = await params;
  const id = idFromPublicationSlug(videoId);
  const video = await fetchVideo(id);
  const company = video ? await fetchCompany(video.companyId) : null;
  const catId   = company?.maincategory?.[0];

  const [category, related, companies] = await Promise.all([
    fetchCategory(catId),
    fetchByCat(catId),
    fetchCompanies(),
  ]);

  const companyNameById = Object.fromEntries((companies || []).map((c) => [c.id, c.name]));
  const relatedList = (related || [])
    .filter((r) => r && r.coverImage && String(r.id) !== String(id))
    .slice(0, 4);

  return (
    <>
      {video && <JsonLd video={video} company={company} id={id} />}
      <Navbar buttonLabel="Log In" />
      <PublicationView
        publication={video}
        company={company}
        category={category}
        related={relatedList}
        companyNameById={companyNameById}
        isVideo={true}
      />
      <Footer />
    </>
  );
}
