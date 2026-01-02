import type { IpifyResponse } from "../lib/types";

type Props = {
  data: IpifyResponse | null;
};

export default function InfoCards({ data }: Props) {
  const ip = data?.ip ?? "—";
  const location = data
    ? `${data.location.city}, ${data.location.region} ${data.location.country}`
    : "—";
    
  const timezone = data?.location.timezone ? `UTC ${data.location.timezone}` : "—";
  const isp = data?.isp ?? "—";

  return (
    <section className="cards" aria-label="IP information">
      <div className="card">
        <div className="cardLabel">IP ADDRESS</div>
        <div className="cardValue">{ip}</div>
      </div>

      <div className="card">
        <div className="cardLabel">LOCATION</div>
        <div className="cardValue">{location}</div>
      </div>

      <div className="card">
        <div className="cardLabel">TIMEZONE</div>
        <div className="cardValue">{timezone}</div>
      </div>

      <div className="card">
        <div className="cardLabel">ISP</div>
        <div className="cardValue">{isp}</div>
      </div>
    </section>
  );
}
