export type IpLocation = {
  city: string;
  region: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
  postalCode?: string;
};

// Autonomous System: the network that announces this IP on the internet.
export type IpNetwork = {
  asn: number;
  name: string;
  route: string;
  domain: string;
  type: string;
};

export type IpLookupResult = {
  ip: string;
  isp?: string;
  location: IpLocation;
  as?: IpNetwork;
};
