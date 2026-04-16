import { MapContainer } from "@/components/MapContainer";
import { getMapData } from "@/lib/api";

export default async function HomePage() {
  let mapData;
  try {
    mapData = await getMapData();
  } catch {
    mapData = undefined;
  }

  const totalCompanies = mapData
    ? mapData.reduce((a, c) => a + c.logos.filter((l) => l.live).length, 0)
    : 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6C5CE7]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            The Interactive Map of
            <br />
            <span className="text-[#6C5CE7]">Treasury Solutions</span>
          </h1>
          <p className="mt-5 text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Explore {totalCompanies}+ treasury technology providers across 15 categories.
            Compare solutions, find the right fit for your organization.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#map"
              className="px-6 py-3 rounded-lg bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white font-medium transition-colors"
            >
              Explore the Map
            </a>
            <a
              href="/signup"
              className="px-6 py-3 rounded-lg bg-[#1A2332] hover:bg-[#1E293B] text-[#94A3B8] border border-[#1E293B] font-medium transition-colors"
            >
              Get Your Company Listed
            </a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <MapContainer initialData={mapData} />
      </section>
    </div>
  );
}
