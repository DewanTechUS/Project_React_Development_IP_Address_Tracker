import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { IpifyResponse } from "../lib/types";
import L from "leaflet";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], map.getZoom(), { animate: true });
  return null;
}

type Props = {
  data: IpifyResponse | null;
};

export default function MapView({ data }: Props) {
  
  const lat = data?.location.lat ?? 37.3861; 
  const lng = data?.location.lng ?? -122.0839;

  return (
    <div className="mapWrap" aria-label="Map">
      <MapContainer center={[lat, lng] as [number, number]} zoom={13} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            {data ? (
              <div>
                <strong>{data.ip}</strong>
                <div>
                  {data.location.city}, {data.location.region} {data.location.country}
                </div>
              </div>
            ) : (
              "Default location"
            )}
          </Popup>
        </Marker>

        <Recenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
