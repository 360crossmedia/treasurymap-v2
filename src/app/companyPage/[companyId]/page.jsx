import { url } from "../../service/url";
import CompanyPageClient from "./CompanyPageClient";

async function fetchCompany(companyId) {
  try {
    const res = await fetch(`${url}/api/v1/companies/${companyId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { companyId } = await params;
  const company = await fetchCompany(companyId);
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
  const { companyId } = await params;
  const initialCompany = await fetchCompany(companyId);
  return (
    <CompanyPageClient
      companyId={companyId}
      initialCompany={initialCompany}
    />
  );
};

export default Layout;
