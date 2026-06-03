import { cache } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import InsightsNavbar from "../../../components/InsightsNavbar";
import Video from "../../../components/Video";
import { url } from "../../../service/url";
import { slugify, idFromPublicationSlug } from "../../../utils/slugify";
import styles from "../../../styles/Insights.module.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

const fetchVideo = cache(async (id) => {
  try {
    const r = await fetch(`${url}/api/v1/videos/${id}`, { next: { revalidate: 300 } });
    return r.ok ? r.json() : null;
  } catch { return null; }
});

const fetchCompany = cache(async (id) => {
  if (!id) return null;
  try {
    const r = await fetch(`${url}/api/v1/companies/${id}`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : null;
  } catch { return null; }
});

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

  return (
    <>
      {video && <JsonLd video={video} company={company} id={id} />}
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <InsightsNavbar />
        <Video videoId={id} />
      </div>
      <Footer />
    </>
  );
}
