import type { IpLookupResult } from "../lib/types";
import { formatLocation } from "../lib/format";

type Props = {
  data: IpLookupResult | null;
  isLoading: boolean;
};

export default function InfoCards({ data, isLoading }: Props) {
  const items = [
    { label: "IP Address", value: data?.ip },
    { label: "Location", value: data && formatLocation(data.location) },
    { label: "Timezone", value: data?.location.timezone && `UTC ${data.location.timezone}` },
    { label: "ISP", value: data?.isp },
  ];

  const showSkeleton = isLoading && !data;

  return (
    <section
      className={`cards ${isLoading ? "isLoading" : ""}`}
      aria-label="IP information"
      aria-busy={isLoading}
    >
      {items.map((item) => (
        <div className="card" key={item.label}>
          <h2 className="cardLabel">{item.label}</h2>
          <p className="cardValue">
            {showSkeleton ? <span className="skeleton" aria-hidden="true" /> : item.value || "—"}
          </p>
        </div>
      ))}
    </section>
  );
}
