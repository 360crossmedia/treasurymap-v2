import MapExperience from "./components/proceduralMap/MapExperience";
import LandscapeSEO from "./components/proceduralMap/LandscapeSEO";

// Home is a Server Component so the category/provider section (LandscapeSEO) is
// server-rendered into the initial HTML for SEO/GEO. The interactive map below
// it (MapExperience) is a Client Component; we pass the server-rendered section
// down as a prop so it renders inside the layout, above the footer.
export default function HomePage() {
  return <MapExperience multiplayer={false} seoSection={<LandscapeSEO />} />;
}
