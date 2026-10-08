import type { IpLocation } from "./types";

export function formatLocation({ city, region, country }: IpLocation) {
  return [city, region, country].filter(Boolean).join(", ");
}
