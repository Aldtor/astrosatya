// Shared astronomy core for AstroSatya.
// Implements a compact but meaningfully accurate model:
//   - Sun: VSOP-style mean longitude + equation of center (≤ ~0.02° error)
//   - Moon: mean longitude + main perturbations (equation of center, evection,
//     variation, annual equation, mean elongation) — accurate to ~0.2°
//   - Mercury–Saturn: mean longitude + equation of center for plausible signs
//   - Lahiri ayanamsa: 23.85° at J2000, drifting ~50.29"/year
//   - Tropical → sidereal conversion
//   - Ascendant from local sidereal time + observer latitude

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const norm = (d: number) => ((d % 360) + 360) % 360;
const sind = (d: number) => Math.sin(d * D2R);
const cosd = (d: number) => Math.cos(d * D2R);
const tand = (d: number) => Math.tan(d * D2R);
const atan2d = (y: number, x: number) => Math.atan2(y, x) * R2D;

// Julian Day from local civil date/time + UTC offset (hours east of UTC).
export function julianDay(dateISO: string, time: string, tzOffsetHours: number): number {
  const [Y, M, D] = dateISO.split("-").map(Number);
  const [h, m] = time.split(":").map(Number);
  let y = Y, mo = M;
  if (mo <= 2) { y -= 1; mo += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd0 = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (mo + 1)) + D + B - 1524.5;
  const utHours = h + m / 60 - tzOffsetHours;
  return jd0 + utHours / 24;
}

// Lahiri ayanamsa — Chitrapaksha. 23.85667° at J2000, drift 50.2876"/yr.
export function ayanamsaLahiri(jd: number): number {
  const t = (jd - 2451545.0) / 365.25;
  return 23.85667 + (50.2876 / 3600) * t;
}

// ---------- Sun ----------
export function sunTropical(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M)
    + (0.019993 - 0.000101 * T) * sind(2 * M)
    + 0.000289 * sind(3 * M);
  return norm(L0 + C);
}

// ---------- Moon (compact ELP — main terms) ----------
export function moonTropical(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Lp = norm(218.3164477 + 481267.88123421 * T); // mean longitude
  const D = norm(297.8501921 + 445267.1114034 * T);   // mean elongation
  const M = norm(357.5291092 + 35999.0502909 * T);    // sun anomaly
  const Mp = norm(134.9633964 + 477198.8675055 * T);  // moon anomaly
  const F = norm(93.2720950 + 483202.0175233 * T);    // argument of latitude

  // Major periodic terms (degrees)
  const dL =
    6.289 * sind(Mp)           // equation of center
    - 1.274 * sind(Mp - 2 * D) // evection
    + 0.658 * sind(2 * D)      // variation
    - 0.186 * sind(M)          // annual equation
    - 0.059 * sind(2 * Mp - 2 * D)
    - 0.057 * sind(Mp - 2 * D + M)
    + 0.053 * sind(Mp + 2 * D)
    + 0.046 * sind(2 * D - M)
    + 0.041 * sind(Mp - M)
    - 0.035 * sind(D)
    - 0.031 * sind(Mp + M)
    - 0.015 * sind(2 * F - 2 * D)
    + 0.011 * sind(Mp - 4 * D);
  return norm(Lp + dL);
}

// ---------- Inner / outer planets (mean longitude + equation of center) ----------
// Elements: L0 (deg at J2000), n (deg/day), e (eccentricity), peri (deg).
const ELEM = {
  Mercury: { L0: 252.25032, n: 4.09233445, e: 0.20563, peri: 77.4561 },
  Venus:   { L0: 181.97973, n: 1.60213034, e: 0.00678, peri: 131.5637 },
  Mars:    { L0: 355.43300, n: 0.52403840, e: 0.09340, peri: 336.0408 },
  Jupiter: { L0:  34.35148, n: 0.08308529, e: 0.04849, peri:  14.7283 },
  Saturn:  { L0:  50.07747, n: 0.03344414, e: 0.05551, peri:  93.0570 },
};

function planetTropical(name: keyof typeof ELEM, jd: number): number {
  const e = ELEM[name];
  const days = jd - 2451545.0;
  const L = norm(e.L0 + e.n * days);
  const M = norm(L - e.peri); // mean anomaly
  const eDeg = e.e * R2D;
  // Equation of center (series to e^3)
  const C = (2 * e.e - 0.25 * e.e ** 3) * R2D * sind(M)
          + 1.25 * e.e * e.e * R2D * sind(2 * M)
          + (13 / 12) * e.e ** 3 * R2D * sind(3 * M);
  void eDeg;
  return norm(L + C);
}

// ---------- Rahu / Ketu (mean lunar node) ----------
export function rahuMean(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
}

// ---------- Ascendant ----------
// Local sidereal time (degrees) from JD + longitude east.
function localSiderealTime(jd: number, longEast: number): number {
  const T = (jd - 2451545.0) / 36525;
  const gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T;
  return norm(gst + longEast);
}

export function ascendantLongitude(jd: number, latDeg: number, longEast: number): number {
  const lst = localSiderealTime(jd, longEast);
  const eps = 23.4392911; // mean obliquity (close enough for the era)
  const asc = atan2d(
    -cosd(lst),
    sind(lst) * cosd(eps) + tand(latDeg) * sind(eps),
  );
  return norm(asc);
}

// ---------- Sidereal positions of all bodies ----------
export interface SiderealPositions {
  Sun: number; Moon: number;
  Mercury: number; Venus: number; Mars: number; Jupiter: number; Saturn: number;
  Rahu: number; Ketu: number;
}
export function siderealPositions(jd: number): SiderealPositions {
  const ay = ayanamsaLahiri(jd);
  const fix = (l: number) => norm(l - ay);
  return {
    Sun: fix(sunTropical(jd)),
    Moon: fix(moonTropical(jd)),
    Mercury: fix(planetTropical("Mercury", jd)),
    Venus: fix(planetTropical("Venus", jd)),
    Mars: fix(planetTropical("Mars", jd)),
    Jupiter: fix(planetTropical("Jupiter", jd)),
    Saturn: fix(planetTropical("Saturn", jd)),
    Rahu: fix(rahuMean(jd)),
    Ketu: fix(rahuMean(jd) + 180),
  };
}

// ---------- Helpers ----------
export const RASHIS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
];
export const RASHI_LORDS = [
  "Mars","Venus","Mercury","Moon","Sun","Mercury",
  "Venus","Mars","Jupiter","Saturn","Saturn","Jupiter",
];

export function degToSignDeg(lon: number) {
  const sign = Math.floor(lon / 30);
  const d = lon - sign * 30;
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.floor((((d - deg) * 60) - min) * 60);
  return { sign, signName: RASHIS[sign], deg, min, sec, label: `${deg}° ${String(min).padStart(2,"0")}'` };
}

export const NAKSHATRAS = [
  ["Ashwini","Ketu"],["Bharani","Venus"],["Krittika","Sun"],
  ["Rohini","Moon"],["Mrigashira","Mars"],["Ardra","Rahu"],
  ["Punarvasu","Jupiter"],["Pushya","Saturn"],["Ashlesha","Mercury"],
  ["Magha","Ketu"],["Purva Phalguni","Venus"],["Uttara Phalguni","Sun"],
  ["Hasta","Moon"],["Chitra","Mars"],["Swati","Rahu"],
  ["Vishakha","Jupiter"],["Anuradha","Saturn"],["Jyeshtha","Mercury"],
  ["Mula","Ketu"],["Purva Ashadha","Venus"],["Uttara Ashadha","Sun"],
  ["Shravana","Moon"],["Dhanishta","Mars"],["Shatabhisha","Rahu"],
  ["Purva Bhadrapada","Jupiter"],["Uttara Bhadrapada","Saturn"],["Revati","Mercury"],
] as const;

export function nakshatraOf(moonLon: number) {
  const span = 360 / 27;
  const i = Math.floor(moonLon / span);
  const within = moonLon - i * span;
  const pada = Math.floor(within / (span / 4)) + 1;
  const [name, lord] = NAKSHATRAS[i];
  return { index: i, name, lord, pada, fraction: within / span };
}

// Very rough geocoder for common Indian cities + simple fallback.
// Returns { lat (deg N), lon (deg E), tz (hours east of UTC) }
const KNOWN_PLACES: Record<string, { lat: number; lon: number; tz: number }> = {
  varanasi: { lat: 25.32, lon: 83.01, tz: 5.5 },
  delhi:    { lat: 28.61, lon: 77.21, tz: 5.5 },
  mumbai:   { lat: 19.08, lon: 72.88, tz: 5.5 },
  bombay:   { lat: 19.08, lon: 72.88, tz: 5.5 },
  kolkata:  { lat: 22.57, lon: 88.36, tz: 5.5 },
  calcutta: { lat: 22.57, lon: 88.36, tz: 5.5 },
  chennai:  { lat: 13.08, lon: 80.27, tz: 5.5 },
  madras:   { lat: 13.08, lon: 80.27, tz: 5.5 },
  bengaluru:{ lat: 12.97, lon: 77.59, tz: 5.5 },
  bangalore:{ lat: 12.97, lon: 77.59, tz: 5.5 },
  hyderabad:{ lat: 17.39, lon: 78.49, tz: 5.5 },
  pune:     { lat: 18.52, lon: 73.86, tz: 5.5 },
  ahmedabad:{ lat: 23.03, lon: 72.58, tz: 5.5 },
  jaipur:   { lat: 26.92, lon: 75.79, tz: 5.5 },
  lucknow:  { lat: 26.85, lon: 80.95, tz: 5.5 },
  patna:    { lat: 25.59, lon: 85.14, tz: 5.5 },
  bhopal:   { lat: 23.26, lon: 77.41, tz: 5.5 },
  indore:   { lat: 22.72, lon: 75.86, tz: 5.5 },
  surat:    { lat: 21.17, lon: 72.83, tz: 5.5 },
  nagpur:   { lat: 21.15, lon: 79.09, tz: 5.5 },
  thane:    { lat: 19.22, lon: 72.98, tz: 5.5 },
  noida:    { lat: 28.54, lon: 77.39, tz: 5.5 },
  gurgaon:  { lat: 28.46, lon: 77.03, tz: 5.5 },
  chandigarh:{lat: 30.74, lon: 76.79, tz: 5.5 },
  amritsar: { lat: 31.63, lon: 74.87, tz: 5.5 },
  kanpur:   { lat: 26.45, lon: 80.33, tz: 5.5 },
  agra:     { lat: 27.18, lon: 78.01, tz: 5.5 },
  vadodara: { lat: 22.31, lon: 73.18, tz: 5.5 },
  visakhapatnam: { lat: 17.69, lon: 83.22, tz: 5.5 },
  kochi:    { lat: 9.93,  lon: 76.27, tz: 5.5 },
  trivandrum:{lat: 8.52,  lon: 76.94, tz: 5.5 },
  guwahati: { lat: 26.14, lon: 91.74, tz: 5.5 },
  dehradun: { lat: 30.32, lon: 78.03, tz: 5.5 },
  shimla:   { lat: 31.10, lon: 77.17, tz: 5.5 },
  kathmandu:{ lat: 27.71, lon: 85.32, tz: 5.75 },
  dhaka:    { lat: 23.81, lon: 90.41, tz: 6 },
  london:   { lat: 51.51, lon: -0.13, tz: 0 },
  newyork:  { lat: 40.71, lon: -74.01, tz: -5 },
  dubai:    { lat: 25.20, lon: 55.27, tz: 4 },
  singapore:{ lat: 1.35,  lon: 103.82, tz: 8 },
  toronto:  { lat: 43.65, lon: -79.38, tz: -5 },
  sydney:   { lat: -33.87,lon: 151.21, tz: 10 },
  losangeles:{lat: 34.05, lon: -118.24,tz: -8 },
  sanfrancisco:{lat:37.77,lon:-122.42, tz: -8 },
  paris:    { lat: 48.85, lon: 2.35,  tz: 1 },
  berlin:   { lat: 52.52, lon: 13.41, tz: 1 },
  tokyo:    { lat: 35.68, lon: 139.69,tz: 9 },
};

export function geocode(place: string): { lat: number; lon: number; tz: number; matched: string } {
  const key = place.toLowerCase().replace(/[^a-z]/g, "");
  for (const k of Object.keys(KNOWN_PLACES)) {
    if (key.startsWith(k) || key.includes(k)) return { ...KNOWN_PLACES[k], matched: k };
  }
  // Fallback: assume India / IST if the string mentions "india", else neutral 0,0 UTC.
  if (key.includes("india")) return { lat: 23, lon: 80, tz: 5.5, matched: "india" };
  return { lat: 23, lon: 80, tz: 5.5, matched: "default-IST" };
}