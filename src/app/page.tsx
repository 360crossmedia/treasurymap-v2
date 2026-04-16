import { MapContainer } from "@/components/MapContainer";
import { getMapData } from "@/lib/api";

export default async function HomePage() {
  let mapData;
  try {
    mapData = await getMapData();
  } catch {
    mapData = undefined;
  }

  return (
    <div>
      <MapContainer initialData={mapData} />
    </div>
  );
}
