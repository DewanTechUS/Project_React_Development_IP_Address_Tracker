export type IpLocation = {
  city: string;
  region: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
};

export type IpLookupResult = {
  ip: string;
  isp?: string;
  location: IpLocation;
};
