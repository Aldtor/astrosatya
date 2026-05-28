// Vedic Ashtakoot Guna Milan — 8 kootas summing to 36 points.
// Reference: classical Parashari rules; the moon sign + nakshatra of each
// partner is computed from the shared astronomy core, then evaluated across:
//   1. Varna (1)   2. Vashya (2)   3. Tara (3)   4. Yoni (4)
//   5. Graha Maitri (5)   6. Gana (6)   7. Bhakoot (7)   8. Nadi (8)

import { julianDay, siderealPositions, nakshatraOf, geocode, RASHIS, RASHI_LORDS } from "./astro-core";

export interface Partner {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  place: string;
}

interface NatalCore {
  name: string;
  moonSign: number;       // 0..11
  moonSignName: string;
  nakIndex: number;       // 0..26
  nakName: string;
  nakLord: string;
  pada: number;
}

function natal(p: Partner): NatalCore {
  const geo = geocode(p.place || "India");
  const jd = julianDay(p.date, p.time, geo.tz);
  const s = siderealPositions(jd);
  const moonSign = Math.floor(s.Moon / 30);
  const nak = nakshatraOf(s.Moon);
  return {
    name: p.name, moonSign, moonSignName: RASHIS[moonSign],
    nakIndex: nak.index, nakName: nak.name, nakLord: nak.lord, pada: nak.pada,
  };
}

// --- 1. Varna ---  (Brahmin > Kshatriya > Vaishya > Shudra)
const VARNA = [1,2,3,0, 1,2,3,0, 1,2,3,0]; // by moon sign — 0=Shudra .. 3=Brahmin (Aries=Kshatriya etc.)
function varna(a: NatalCore, b: NatalCore) {
  const ok = VARNA[b.moonSign] <= VARNA[a.moonSign];
  return { points: ok ? 1 : 0, max: 1, label: "Varna", note: ok ? "Spiritual castes align." : "Slight imbalance in spiritual disposition." };
}

// --- 2. Vashya ---  (control / mutual attraction by sign group)
const VASHYA_GROUP: Record<number, string> = {
  0:"Quadruped", 1:"Quadruped", 4:"Quadruped", 8:"Quadruped", 9:"Quadruped",
  2:"Human", 5:"Human", 6:"Human", 10:"Human",
  3:"Aquatic", 11:"Aquatic",
  7:"Insect",
};
function vashya(a: NatalCore, b: NatalCore) {
  const same = VASHYA_GROUP[a.moonSign] === VASHYA_GROUP[b.moonSign];
  const pts = same ? 2 : (VASHYA_GROUP[a.moonSign] === "Human" && VASHYA_GROUP[b.moonSign] === "Quadruped" ? 1 : 0.5);
  return { points: pts, max: 2, label: "Vashya", note: same ? "Easy natural attraction." : "Attraction needs gentle effort." };
}

// --- 3. Tara ---  (count from bride's nakshatra to groom's, %9)
function tara(a: NatalCore, b: NatalCore) {
  const fwd = ((b.nakIndex - a.nakIndex + 27) % 27) + 1;
  const rev = ((a.nakIndex - b.nakIndex + 27) % 27) + 1;
  const goodFwd = ![3,5,7].includes(fwd % 9);
  const goodRev = ![3,5,7].includes(rev % 9);
  const pts = (goodFwd ? 1.5 : 0) + (goodRev ? 1.5 : 0);
  return { points: pts, max: 3, label: "Tara", note: pts >= 2.5 ? "Both stars protect each other." : pts >= 1.5 ? "Mostly protective stars." : "Stars need a small remedy." };
}

// --- 4. Yoni ---  (animal symbol of nakshatra)
const YONI = [
  "Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Sheep","Cat",
  "Rat","Rat","Cow","Buffalo","Tigress","Buffalo","Tigress","Deer","Deer",
  "Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant",
];
const YONI_SCORE: Record<string, Record<string, number>> = {};
function yoniScore(y1: string, y2: string): number {
  if (y1 === y2) return 4;
  const enemies: [string,string][] = [["Cow","Tigress"],["Elephant","Lion"],["Horse","Buffalo"],["Dog","Deer"],["Serpent","Mongoose"],["Cat","Rat"],["Sheep","Monkey"]];
  if (enemies.some(([x,y]) => (x===y1&&y===y2)||(x===y2&&y===y1))) return 0;
  return 2;
}
void YONI_SCORE;
function yoni(a: NatalCore, b: NatalCore) {
  const y1 = YONI[a.nakIndex], y2 = YONI[b.nakIndex];
  const pts = yoniScore(y1, y2);
  return { points: pts, max: 4, label: "Yoni", note: `${y1} & ${y2} — ${pts === 4 ? "deeply harmonious" : pts === 2 ? "neutral" : "needs patience"}.` };
}

// --- 5. Graha Maitri --- (friendship of moon-sign lords)
const FRIENDS: Record<string, string[]> = {
  Sun:["Moon","Mars","Jupiter"], Moon:["Sun","Mercury"], Mars:["Sun","Moon","Jupiter"],
  Mercury:["Sun","Venus"], Jupiter:["Sun","Moon","Mars"], Venus:["Mercury","Saturn"], Saturn:["Mercury","Venus"],
};
function maitri(a: NatalCore, b: NatalCore) {
  const la = RASHI_LORDS[a.moonSign], lb = RASHI_LORDS[b.moonSign];
  if (la === lb) return { points: 5, max: 5, label: "Graha Maitri", note: "Same lord — natural understanding." };
  const af = FRIENDS[la]?.includes(lb), bf = FRIENDS[lb]?.includes(la);
  const pts = af && bf ? 5 : af || bf ? 4 : 1;
  return { points: pts, max: 5, label: "Graha Maitri", note: pts >= 4 ? "Friendly lords — easy companionship." : "Lords are neutral; cultivate shared rituals." };
}

// --- 6. Gana --- (Deva / Manushya / Rakshasa)
const GANA = ["Deva","Manushya","Rakshasa","Manushya","Deva","Manushya","Deva","Deva","Rakshasa",
  "Rakshasa","Manushya","Manushya","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa",
  "Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva"];
function gana(a: NatalCore, b: NatalCore) {
  const ga = GANA[a.nakIndex], gb = GANA[b.nakIndex];
  let pts = 0;
  if (ga === gb) pts = 6;
  else if ((ga === "Deva" && gb === "Manushya") || (ga === "Manushya" && gb === "Deva")) pts = 5;
  else if ((ga === "Manushya" && gb === "Rakshasa") || (ga === "Rakshasa" && gb === "Manushya")) pts = 1;
  else if ((ga === "Deva" && gb === "Rakshasa") || (ga === "Rakshasa" && gb === "Deva")) pts = 0;
  else pts = 6;
  return { points: pts, max: 6, label: "Gana", note: `${ga} & ${gb} — ${pts >= 5 ? "temperaments align" : pts >= 1 ? "different rhythms" : "opposing temperaments"}.` };
}

// --- 7. Bhakoot --- (relative position of moon signs)
function bhakoot(a: NatalCore, b: NatalCore) {
  const diff = Math.abs(a.moonSign - b.moonSign);
  const d = Math.min(diff, 12 - diff);
  const bad = [6, 5, 2].includes(d); // 2-12, 5-9, 6-8 inauspicious
  const pts = bad ? 0 : 7;
  return { points: pts, max: 7, label: "Bhakoot", note: bad ? "Moon-sign distance asks for conscious harmony." : "Moon signs sit in a flowing relationship." };
}

// --- 8. Nadi --- (Vata / Pitta / Kapha by nakshatra)
const NADI = ["V","P","K","V","P","K","K","P","V","V","P","K","V","P","K","K","P","V","V","P","K","V","P","K","K","P","V"];
function nadi(a: NatalCore, b: NatalCore) {
  const pts = NADI[a.nakIndex] !== NADI[b.nakIndex] ? 8 : 0;
  return { points: pts, max: 8, label: "Nadi", note: pts === 8 ? "Different nadis — vital harmony, healthy progeny." : "Same nadi — perform a small parihar (remedy) before marriage." };
}

// --- Mangal Dosha check (rough — needs ascendant; we use moon sign as fallback) ---
function mangalDosha(p: Partner) {
  const geo = geocode(p.place || "India");
  const jd = julianDay(p.date, p.time, geo.tz);
  const s = siderealPositions(jd);
  const moonSign = Math.floor(s.Moon / 30);
  const marsSign = Math.floor(s.Mars / 30);
  const houseFromMoon = ((marsSign - moonSign + 12) % 12) + 1;
  return [1, 2, 4, 7, 8, 12].includes(houseFromMoon);
}

export interface MatchResult {
  partners: { a: NatalCore; b: NatalCore };
  kootas: { label: string; points: number; max: number; note: string }[];
  total: number;
  percent: number;
  verdict: string;
  scores: { label: string; value: number }[];
  mangal: { a: boolean; b: boolean; verdict: string };
  strengths: string[];
  challenges: string[];
  remedy: string;
}

export function computeMatch(pa: Partner, pb: Partner): MatchResult {
  const a = natal(pa), b = natal(pb);
  const kootas = [varna(a,b), vashya(a,b), tara(a,b), yoni(a,b), maitri(a,b), gana(a,b), bhakoot(a,b), nadi(a,b)];
  const total = kootas.reduce((s,k) => s + k.points, 0);
  const percent = Math.round((total / 36) * 100);

  const verdict =
    total >= 28 ? "An exceptional match — destined harmony."
    : total >= 24 ? "A graceful match — well-suited with gentle effort."
    : total >= 18 ? "A workable match — love and ritual will deepen it."
    : "A challenging match — conscious work and remedies recommended.";

  // Derived life-area scores
  const scores = [
    { label: "Emotional Compatibility", value: pct(kootas[5].points, 6, kootas[3].points, 4) },
    { label: "Marriage Harmony", value: pct(kootas[6].points, 7, kootas[1].points, 2) },
    { label: "Mental Connection", value: pct(kootas[4].points, 5, kootas[5].points, 6) },
    { label: "Spiritual Alignment", value: pct(kootas[0].points, 1, kootas[2].points, 3) },
    { label: "Long-term Stability", value: pct(kootas[7].points, 8, kootas[6].points, 7) },
  ];

  const mangalA = mangalDosha(pa), mangalB = mangalDosha(pb);
  const mangal = {
    a: mangalA, b: mangalB,
    verdict: mangalA && mangalB ? "Both partners share Mangal Dosha — it cancels itself."
      : mangalA || mangalB ? "One partner has Mangal Dosha — perform a Mangal shanti puja before marriage."
      : "Neither partner has Mangal Dosha — Mars is gentle here.",
  };

  const strengths: string[] = [];
  const challenges: string[] = [];
  kootas.forEach((k) => {
    const ratio = k.points / k.max;
    if (ratio >= 0.75) strengths.push(`${k.label}: ${k.note}`);
    else if (ratio <= 0.25) challenges.push(`${k.label}: ${k.note}`);
  });
  if (strengths.length === 0) strengths.push("A balanced match — no single area dominates, allowing harmony to grow naturally.");
  if (challenges.length === 0) challenges.push("No major frictions — sustain the match with weekly conversation and yearly pilgrimage.");

  const remedy = total < 18
    ? "Recite Gauri Mantra together for 40 days and perform Navagraha puja before marriage."
    : kootas[7].points === 0 ? "Perform a Nadi dosha nivaran puja and donate to a temple kitchen."
    : "Maintain a small altar at home — a flame, a flower, a sacred sound — to keep the union luminous.";

  return { partners: { a, b }, kootas, total, percent, verdict, scores, mangal, strengths, challenges, remedy };
}

function pct(...pairs: number[]) {
  let s = 0, m = 0;
  for (let i = 0; i < pairs.length; i += 2) { s += pairs[i]; m += pairs[i+1]; }
  return Math.round((s / m) * 100);
}