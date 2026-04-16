import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCompany, getCategories, getSubCategories, getCountries } from "@/lib/api";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCompanyData(slug: string) {
  const id = parseInt(slug);
  if (isNaN(id)) return null;

  try {
    const [company, categories, subCategories, countries] = await Promise.all([
      getCompany(id),
      getCategories(),
      getSubCategories(),
      getCountries(),
    ]);
    return { company, categories, subCategories, countries };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCompanyData(slug);
  if (!data) return { title: "Company Not Found — TreasuryMap" };

  const { company, categories } = data;
  const catNames = categories
    .filter((c) => company.companyCategories?.includes(c.id))
    .map((c) => c.name)
    .join(", ");

  return {
    title: `${company.name} — Treasury Solutions | TreasuryMap`,
    description: `${company.name} provides treasury solutions in ${catNames || "financial technology"}. Headquarters: ${company.location || "N/A"}. ${(company.description || "").slice(0, 120)}`,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCompanyData(slug);

  if (!data || !data.company) notFound();

  const { company, categories, subCategories, countries } = data;

  const companyCategories = categories.filter((c) =>
    company.companyCategories?.includes(c.id)
  );
  const companySubCategories = subCategories.filter((s) =>
    company.companySubcategories?.includes(s.id)
  );
  const activeCountries = countries.filter((c) =>
    company.companyOffices?.includes(c.id)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    url: company.companyWebsite,
    foundingDate: company.creationDate,
    numberOfEmployees: company.employees,
    address: { "@type": "PostalAddress", addressLocality: company.location },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-white mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Map
        </Link>

        {/* Company header */}
        <div className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {company.logo && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl p-3 flex items-center justify-center flex-shrink-0">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={80}
                  height={80}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{company.name}</h1>

              {/* Category tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {companyCategories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#6C5CE7]/15 text-[#A29BFE] border border-[#6C5CE7]/20"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                {company.creationDate && company.creationDate !== "N/A" && (
                  <div>
                    <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Founded</p>
                    <p className="text-sm font-medium text-white mt-0.5">{company.creationDate}</p>
                  </div>
                )}
                {company.employees && company.employees !== "N/A" && (
                  <div>
                    <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Employees</p>
                    <p className="text-sm font-medium text-white mt-0.5">{company.employees}</p>
                  </div>
                )}
                {company.location && company.location !== "N/A" && (
                  <div>
                    <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Headquarters</p>
                    <p className="text-sm font-medium text-white mt-0.5">{company.location}</p>
                  </div>
                )}
                {company.companyWebsite && company.companyWebsite !== "N/A" && (
                  <div>
                    <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Website</p>
                    <a
                      href={company.companyWebsite.startsWith("http") ? company.companyWebsite : `https://${company.companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#6C5CE7] hover:text-[#A29BFE] mt-0.5 block truncate transition-colors"
                    >
                      {company.companyWebsite.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            {company.description && company.description !== "N/A" && (
              <div className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-3">Overview</h2>
                <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">
                  {company.description}
                </p>
              </div>
            )}

            {/* Product info */}
            {company.productVersion && company.productVersion !== "N/A" && (
              <div className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-3">Product Details</h2>
                {company.productName && company.productName !== "N/A" && (
                  <p className="text-xs text-[#64748B] uppercase tracking-wider mb-2">{company.productName}</p>
                )}
                <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">
                  {company.productVersion}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sub-categories */}
            {companySubCategories.length > 0 && (
              <div className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-3">Sub-Categories</h2>
                <div className="flex flex-wrap gap-1.5">
                  {companySubCategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="px-2 py-1 rounded text-xs bg-[#0F172A] text-[#94A3B8] border border-[#1E293B]"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Active regions */}
            {activeCountries.length > 0 && (
              <div className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-3">Active In</h2>
                <div className="flex flex-wrap gap-1.5">
                  {activeCountries.map((country) => (
                    <span
                      key={country.id}
                      className="px-2 py-1 rounded text-xs bg-[#0F172A] text-[#94A3B8] border border-[#1E293B]"
                    >
                      {country.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {company.keywords && company.keywords.length > 0 && (
              <div className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-3">Keywords</h2>
                <div className="flex flex-wrap gap-1.5">
                  {company.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded text-xs bg-[#6C5CE7]/10 text-[#A29BFE]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
