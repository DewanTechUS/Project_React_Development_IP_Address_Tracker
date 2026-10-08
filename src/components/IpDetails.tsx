import { useEffect, useState } from "react";
import type { IpLookupResult } from "../lib/types";
import CopyButton from "./CopyButton";
import { formatCoordinates, formatCountry, formatLocalTime, ipVersion, safeUrl } from "../lib/format";

type Props = {
  data: IpLookupResult;
  shareUrl: string;
};

type Row = { label: string; value: React.ReactNode };

// Drops rows whose data the API didn't provide.
function compact(rows: (Row | null)[]): Row[] {
  return rows.filter((row): row is Row => row !== null);
}

function DetailList({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="detailGroup">
      <h3 className="detailTitle">{title}</h3>
      <dl className="detailList">
        {rows.map((row) => (
          <div className="detailRow" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function IpDetails({ data, shareUrl }: Props) {
  const [now, setNow] = useState(() => new Date());

  // Keep the remote local time current.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const { location, as: network } = data;
  const coordinates = formatCoordinates(location.lat, location.lng);
  const website = safeUrl(network?.domain);
  const mapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  const networkRows = compact([
    { label: "IP version", value: ipVersion(data.ip) },
    network?.asn ? { label: "ASN", value: `AS${network.asn}` } : null,
    network?.name ? { label: "Network", value: network.name } : null,
    network?.route ? { label: "IP range", value: network.route } : null,
    network?.type ? { label: "Network type", value: network.type } : null,
    website
      ? {
          label: "Website",
          value: (
            <a href={website.href} target="_blank" rel="noopener noreferrer">
              {website.hostname.replace(/^www\./, "")}
            </a>
          ),
        }
      : null,
  ]);

  const localTime = formatLocalTime(location.timezone, now);
  const locationRows = compact([
    location.country ? { label: "Country", value: formatCountry(location.country) } : null,
    location.postalCode ? { label: "Postal code", value: location.postalCode } : null,
    localTime ? { label: "Local time", value: localTime } : null,
    {
      label: "Coordinates",
      value: (
        <span className="inlineActions">
          {coordinates}
          <CopyButton text={coordinates} label="Copy coordinates" />
        </span>
      ),
    },
    {
      label: "Map",
      value: (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
        </a>
      ),
    },
  ]);

  return (
    <section className="details" aria-labelledby="details-title">
      <div className="detailsHeader">
        <h2 id="details-title" className="detailsHeading">IP details</h2>
        <CopyButton text={shareUrl} label="Copy link to this result" buttonText="Copy link" />
      </div>
      <div className="detailGrid">
        <DetailList title="Network" rows={networkRows} />
        <DetailList title="Location" rows={locationRows} />
      </div>
    </section>
  );
}
