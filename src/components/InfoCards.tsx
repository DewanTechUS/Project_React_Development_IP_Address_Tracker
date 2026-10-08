import type { IpifyResponse } from "../lib/types";

type Props = {
  data: IpifyResponse | null;
  isLoading: boolean;
};

export default function InfoCards({ data, isLoading }: Props) {
  const ip = data?.ip || "—";
  const location = data
    ? [data.location.city, data.location.region, data.location.country].filter(Boolean).join(", ") || "—"
    : "—";

  const timezone = data?.location.timezone ? `UTC ${data.location.timezone}` : "—";
  const isp = data?.isp || "—";

  const items = [
    { label: "IP Address", value: ip },
    { label: "Location", value: location },
    { label: "Timezone", value: timezone },
    { label: "ISP", value: isp },
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
            {showSkeleton ? <span className="skeleton" aria-hidden="true" /> : item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
