import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { IpLookupResult } from "../lib/types";
import { formatLocation } from "../lib/format";
import L from "leaflet";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

// An explicit icon avoids L.Icon.Default prefixing its auto-detected
// image path onto bundler-resolved URLs.
const markerIcon = L.icon({
  iconUrl: marker,
  iconRetinaUrl: marker2x,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fallback center shown until the first lookup resolves.
const DEFAULT_CENTER: [number, number] = [37.3861, -122.0839];

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [map, lat, lng]);
  return null;
}

type Props = {
  data: IpLookupResult | null;
};

export default function MapView({ data }: Props) {
  const lat = data?.location.lat ?? DEFAULT_CENTER[0];
  const lng = data?.location.lng ?? DEFAULT_CENTER[1];

  return (
    <MapContainer center={[lat, lng]} zoom={13} className="map">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data ? (
        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>
            <strong>{data.ip}</strong>
            <div>{formatLocation(data.location)}</div>
          </Popup>
        </Marker>
      ) : null}

      <Recenter lat={lat} lng={lng} />
    </MapContainer>
  );
}
