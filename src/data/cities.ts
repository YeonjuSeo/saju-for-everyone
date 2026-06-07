// Curated list of major world cities with IANA timezone + longitude (east positive).
// Users pick the closest city; longitude only needs to be accurate to ~1° for Saju.
// Historical DST/offset changes are resolved by luxon from the IANA `tz` id.

export interface City {
  name: string;
  country: string;
  /** ISO 3166-1 alpha-2, used to render a flag emoji. */
  cc: string;
  /** IANA timezone id. */
  tz: string;
  /** Longitude in degrees, east positive. */
  lng: number;
}

export const CITIES: City[] = [
  // East Asia
  { name: 'Seoul', country: 'South Korea', cc: 'KR', tz: 'Asia/Seoul', lng: 126.98 },
  { name: 'Busan', country: 'South Korea', cc: 'KR', tz: 'Asia/Seoul', lng: 129.08 },
  { name: 'Tokyo', country: 'Japan', cc: 'JP', tz: 'Asia/Tokyo', lng: 139.69 },
  { name: 'Osaka', country: 'Japan', cc: 'JP', tz: 'Asia/Tokyo', lng: 135.5 },
  { name: 'Beijing', country: 'China', cc: 'CN', tz: 'Asia/Shanghai', lng: 116.41 },
  { name: 'Shanghai', country: 'China', cc: 'CN', tz: 'Asia/Shanghai', lng: 121.47 },
  { name: 'Hong Kong', country: 'Hong Kong', cc: 'HK', tz: 'Asia/Hong_Kong', lng: 114.17 },
  { name: 'Taipei', country: 'Taiwan', cc: 'TW', tz: 'Asia/Taipei', lng: 121.56 },
  // Southeast Asia
  { name: 'Bangkok', country: 'Thailand', cc: 'TH', tz: 'Asia/Bangkok', lng: 100.5 },
  { name: 'Singapore', country: 'Singapore', cc: 'SG', tz: 'Asia/Singapore', lng: 103.82 },
  { name: 'Kuala Lumpur', country: 'Malaysia', cc: 'MY', tz: 'Asia/Kuala_Lumpur', lng: 101.69 },
  { name: 'Jakarta', country: 'Indonesia', cc: 'ID', tz: 'Asia/Jakarta', lng: 106.85 },
  { name: 'Manila', country: 'Philippines', cc: 'PH', tz: 'Asia/Manila', lng: 120.98 },
  { name: 'Ho Chi Minh City', country: 'Vietnam', cc: 'VN', tz: 'Asia/Ho_Chi_Minh', lng: 106.66 },
  { name: 'Hanoi', country: 'Vietnam', cc: 'VN', tz: 'Asia/Ho_Chi_Minh', lng: 105.83 },
  // South Asia
  { name: 'New Delhi', country: 'India', cc: 'IN', tz: 'Asia/Kolkata', lng: 77.21 },
  { name: 'Mumbai', country: 'India', cc: 'IN', tz: 'Asia/Kolkata', lng: 72.88 },
  { name: 'Bengaluru', country: 'India', cc: 'IN', tz: 'Asia/Kolkata', lng: 77.59 },
  { name: 'Dhaka', country: 'Bangladesh', cc: 'BD', tz: 'Asia/Dhaka', lng: 90.41 },
  { name: 'Karachi', country: 'Pakistan', cc: 'PK', tz: 'Asia/Karachi', lng: 67.01 },
  { name: 'Kathmandu', country: 'Nepal', cc: 'NP', tz: 'Asia/Kathmandu', lng: 85.32 },
  // Middle East
  { name: 'Dubai', country: 'UAE', cc: 'AE', tz: 'Asia/Dubai', lng: 55.27 },
  { name: 'Riyadh', country: 'Saudi Arabia', cc: 'SA', tz: 'Asia/Riyadh', lng: 46.72 },
  { name: 'Tehran', country: 'Iran', cc: 'IR', tz: 'Asia/Tehran', lng: 51.39 },
  { name: 'Istanbul', country: 'Turkey', cc: 'TR', tz: 'Europe/Istanbul', lng: 28.98 },
  { name: 'Tel Aviv', country: 'Israel', cc: 'IL', tz: 'Asia/Jerusalem', lng: 34.78 },
  // Europe
  { name: 'London', country: 'United Kingdom', cc: 'GB', tz: 'Europe/London', lng: -0.13 },
  { name: 'Dublin', country: 'Ireland', cc: 'IE', tz: 'Europe/Dublin', lng: -6.26 },
  { name: 'Paris', country: 'France', cc: 'FR', tz: 'Europe/Paris', lng: 2.35 },
  { name: 'Madrid', country: 'Spain', cc: 'ES', tz: 'Europe/Madrid', lng: -3.7 },
  { name: 'Barcelona', country: 'Spain', cc: 'ES', tz: 'Europe/Madrid', lng: 2.17 },
  { name: 'Lisbon', country: 'Portugal', cc: 'PT', tz: 'Europe/Lisbon', lng: -9.14 },
  { name: 'Berlin', country: 'Germany', cc: 'DE', tz: 'Europe/Berlin', lng: 13.4 },
  { name: 'Munich', country: 'Germany', cc: 'DE', tz: 'Europe/Berlin', lng: 11.58 },
  { name: 'Amsterdam', country: 'Netherlands', cc: 'NL', tz: 'Europe/Amsterdam', lng: 4.9 },
  { name: 'Brussels', country: 'Belgium', cc: 'BE', tz: 'Europe/Brussels', lng: 4.35 },
  { name: 'Zurich', country: 'Switzerland', cc: 'CH', tz: 'Europe/Zurich', lng: 8.54 },
  { name: 'Rome', country: 'Italy', cc: 'IT', tz: 'Europe/Rome', lng: 12.5 },
  { name: 'Milan', country: 'Italy', cc: 'IT', tz: 'Europe/Rome', lng: 9.19 },
  { name: 'Vienna', country: 'Austria', cc: 'AT', tz: 'Europe/Vienna', lng: 16.37 },
  { name: 'Warsaw', country: 'Poland', cc: 'PL', tz: 'Europe/Warsaw', lng: 21.01 },
  { name: 'Prague', country: 'Czechia', cc: 'CZ', tz: 'Europe/Prague', lng: 14.44 },
  { name: 'Stockholm', country: 'Sweden', cc: 'SE', tz: 'Europe/Stockholm', lng: 18.07 },
  { name: 'Oslo', country: 'Norway', cc: 'NO', tz: 'Europe/Oslo', lng: 10.75 },
  { name: 'Copenhagen', country: 'Denmark', cc: 'DK', tz: 'Europe/Copenhagen', lng: 12.57 },
  { name: 'Helsinki', country: 'Finland', cc: 'FI', tz: 'Europe/Helsinki', lng: 24.94 },
  { name: 'Athens', country: 'Greece', cc: 'GR', tz: 'Europe/Athens', lng: 23.73 },
  { name: 'Moscow', country: 'Russia', cc: 'RU', tz: 'Europe/Moscow', lng: 37.62 },
  { name: 'Kyiv', country: 'Ukraine', cc: 'UA', tz: 'Europe/Kyiv', lng: 30.52 },
  // Africa
  { name: 'Cairo', country: 'Egypt', cc: 'EG', tz: 'Africa/Cairo', lng: 31.24 },
  { name: 'Lagos', country: 'Nigeria', cc: 'NG', tz: 'Africa/Lagos', lng: 3.38 },
  { name: 'Nairobi', country: 'Kenya', cc: 'KE', tz: 'Africa/Nairobi', lng: 36.82 },
  { name: 'Johannesburg', country: 'South Africa', cc: 'ZA', tz: 'Africa/Johannesburg', lng: 28.05 },
  { name: 'Casablanca', country: 'Morocco', cc: 'MA', tz: 'Africa/Casablanca', lng: -7.59 },
  { name: 'Addis Ababa', country: 'Ethiopia', cc: 'ET', tz: 'Africa/Addis_Ababa', lng: 38.76 },
  // North America
  { name: 'New York', country: 'United States', cc: 'US', tz: 'America/New_York', lng: -74.01 },
  { name: 'Washington, D.C.', country: 'United States', cc: 'US', tz: 'America/New_York', lng: -77.04 },
  { name: 'Boston', country: 'United States', cc: 'US', tz: 'America/New_York', lng: -71.06 },
  { name: 'Atlanta', country: 'United States', cc: 'US', tz: 'America/New_York', lng: -84.39 },
  { name: 'Miami', country: 'United States', cc: 'US', tz: 'America/New_York', lng: -80.19 },
  { name: 'Chicago', country: 'United States', cc: 'US', tz: 'America/Chicago', lng: -87.63 },
  { name: 'Houston', country: 'United States', cc: 'US', tz: 'America/Chicago', lng: -95.37 },
  { name: 'Dallas', country: 'United States', cc: 'US', tz: 'America/Chicago', lng: -96.8 },
  { name: 'Denver', country: 'United States', cc: 'US', tz: 'America/Denver', lng: -104.99 },
  { name: 'Phoenix', country: 'United States', cc: 'US', tz: 'America/Phoenix', lng: -112.07 },
  { name: 'Los Angeles', country: 'United States', cc: 'US', tz: 'America/Los_Angeles', lng: -118.24 },
  { name: 'San Francisco', country: 'United States', cc: 'US', tz: 'America/Los_Angeles', lng: -122.42 },
  { name: 'Seattle', country: 'United States', cc: 'US', tz: 'America/Los_Angeles', lng: -122.33 },
  { name: 'Honolulu', country: 'United States', cc: 'US', tz: 'Pacific/Honolulu', lng: -157.86 },
  { name: 'Anchorage', country: 'United States', cc: 'US', tz: 'America/Anchorage', lng: -149.9 },
  { name: 'Toronto', country: 'Canada', cc: 'CA', tz: 'America/Toronto', lng: -79.38 },
  { name: 'Montreal', country: 'Canada', cc: 'CA', tz: 'America/Toronto', lng: -73.57 },
  { name: 'Vancouver', country: 'Canada', cc: 'CA', tz: 'America/Vancouver', lng: -123.12 },
  { name: 'Mexico City', country: 'Mexico', cc: 'MX', tz: 'America/Mexico_City', lng: -99.13 },
  // South America
  { name: 'São Paulo', country: 'Brazil', cc: 'BR', tz: 'America/Sao_Paulo', lng: -46.63 },
  { name: 'Rio de Janeiro', country: 'Brazil', cc: 'BR', tz: 'America/Sao_Paulo', lng: -43.2 },
  { name: 'Buenos Aires', country: 'Argentina', cc: 'AR', tz: 'America/Argentina/Buenos_Aires', lng: -58.38 },
  { name: 'Santiago', country: 'Chile', cc: 'CL', tz: 'America/Santiago', lng: -70.65 },
  { name: 'Lima', country: 'Peru', cc: 'PE', tz: 'America/Lima', lng: -77.04 },
  { name: 'Bogotá', country: 'Colombia', cc: 'CO', tz: 'America/Bogota', lng: -74.07 },
  // Oceania
  { name: 'Sydney', country: 'Australia', cc: 'AU', tz: 'Australia/Sydney', lng: 151.21 },
  { name: 'Melbourne', country: 'Australia', cc: 'AU', tz: 'Australia/Melbourne', lng: 144.96 },
  { name: 'Brisbane', country: 'Australia', cc: 'AU', tz: 'Australia/Brisbane', lng: 153.03 },
  { name: 'Perth', country: 'Australia', cc: 'AU', tz: 'Australia/Perth', lng: 115.86 },
  { name: 'Auckland', country: 'New Zealand', cc: 'NZ', tz: 'Pacific/Auckland', lng: 174.76 },
];

/** 🇰🇷-style flag emoji from an ISO 3166-1 alpha-2 country code. */
export function flagEmoji(cc: string): string {
  return cc
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

/** Case-insensitive search over city + country name. */
export function searchCities(query: string, limit = 30): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return CITIES.slice(0, limit);
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
  ).slice(0, limit);
}
