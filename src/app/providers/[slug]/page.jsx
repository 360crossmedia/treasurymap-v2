import { url } from "../../service/url";
import CompanyPageClient from "../../companyPage/[companyId]/CompanyPageClient";
import { notFound } from "next/navigation";

async function fetchCompanyBySlug(slug) {
  try {
    const res = await fetch(`${url}/api/v1/companies/by-slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const company = await fetchCompanyBySlug(slug);
  if (!company) return { title: "Treasurymap" };
  const title = `${company.name} | TreasuryMap`;
  const description =
    (company.description || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 200)
      .trim() || `${company.name} on the Treasury Technology Landscape.`;
  const image = company.logo;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

const Layout = async ({ params }) => {
  const { slug } = await params;
  const initialCompany = await fetchCompanyBySlug(slug);
  if (!initialCompany) notFound();
  return (
    <CompanyPageClient
      companyId={initialCompany.id}
      initialCompany={initialCompany}
    />
  );
};

export default Layout;
