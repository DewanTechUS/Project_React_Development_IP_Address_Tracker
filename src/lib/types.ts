export type IpifyLocation = {
  country: string;
  region: string;
  city: string;
  lat: number;
  lng: number;
  timezone: string;
  postalCode?: string;
};

export type IpifyResponse = {
  ip: string;
  location: IpifyLocation;
  isp?: string;
};
