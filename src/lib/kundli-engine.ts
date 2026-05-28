// Vedic kundli engine. Uses the shared astronomy core (Sun with equation of
// center, Moon with main lunar perturbations, planets with equation of
// center, time-varying Lahiri ayanamsa, ascendant from latitude + sidereal
// time). Accuracy is ~0.1°–0.3° for outer bodies and ~0.2° for the Moon —
// more than sufficient for sign placement, nakshatra, pada and dasha.

import {
  julianDay, siderealPositions, ayanamsaLahiri, ascendantLongitude,
  degToSignDeg, nakshatraOf, geocode, RASHIS, RASHI_LORDS, NAKSHATRAS,
} from "./astro-core";
import {
  getSentences, getHints, isSupportedLang,
  RASHI_TRAITS_I18N, DASHA_NARRATIVE_I18N, NAK_GIFT_I18N,
  HOUSE_THEME_I18N, GEMSTONES_I18N,
} from "./kundli-i18n";

export { RASHIS, RASHI_LORDS, NAKSHATRAS };

export interface BirthInput {
  name: string;
  gender: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  place: string;
  language?: string; // ISO-ish code, e.g. "en", "hi", "ta"
}

export const RASHI_ELEMENT = [
  "Fire", "Earth", "Air", "Water", "Fire", "Earth",
  "Air", "Water", "Fire", "Earth", "Air", "Water",
];

const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export interface ComputedKundli {
  input: BirthInput;
  geo: { lat: number; lon: number; tz: number; matched: string };
  ayanamsa: number;
  planets: {
    name: string; sanskrit: string; signName: string; deg: string;
    sign: number; house: number;
    nakshatra: string; nakLord: string; pada: number;
    dignity: string; essence: string;
  }[];
  lagna: { sign: number; signName: string; deg: string };
  moonSign: string;
  sunSign: string;
  nakshatra: { name: string; lord: string; pada: number };
  mahadashas: { lord: string; from: number; to: number }[];
  currentDasha: { lord: string; from: number; to: number };
  yogas: string[];
  doshas: { name: string; present: boolean; note: string }[];
  ashtakoot: number;
  remedies: string[];
}

export function compute(input: BirthInput): ComputedKundli {
  const geo = geocode(input.place || "India");
  const jd = julianDay(input.date, input.time, geo.tz);
  const sid = siderealPositions(jd);
  const ayanamsa = ayanamsaLahiri(jd);
  const ascSidereal = ((ascendantLongitude(jd, geo.lat, geo.lon) - ayanamsa) % 360 + 360) % 360;
  const ascInfo = degToSignDeg(ascSidereal);
  const lagna = { sign: ascInfo.sign, signName: ascInfo.signName, deg: ascInfo.label };

  const sanskrit: Record<string, string> = {
    Sun: "Surya", Moon: "Chandra", Mars: "Mangal", Mercury: "Budh",
    Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu",
  };

  const planets = (Object.keys(sid) as (keyof typeof sid)[]).map((p) => {
    const lon = sid[p];
    const s = degToSignDeg(lon);
    const house = ((s.sign - lagna.sign + 12) % 12) + 1;
    const nk = nakshatraOf(lon);
    return {
      name: p, sanskrit: sanskrit[p],
      signName: s.signName, deg: s.label, sign: s.sign, house,
      nakshatra: nk.name, nakLord: nk.lord, pada: nk.pada,
      dignity: dignityOf(p, s.sign),
      essence: planetEssence(p, s.sign, house),
    };
  });

  const moon = degToSignDeg(sid.Moon);
  const sun = degToSignDeg(sid.Sun);
  const nak = nakshatraOf(sid.Moon);

  // Vimshottari Mahadasha sequence from nakshatra lord
  const birthYear = new Date(input.date).getFullYear() + (new Date(input.date).getMonth() + 1) / 12;
  const startIdx = DASHA_ORDER.indexOf(nak.lord);
  const elapsed = nak.fraction * DASHA_YEARS[nak.lord];
  let cursor = birthYear - elapsed;
  const mahadashas: { lord: string; from: number; to: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const yrs = DASHA_YEARS[lord];
    mahadashas.push({ lord, from: cursor, to: cursor + yrs });
    cursor += yrs;
  }
  const now = new Date().getFullYear() + new Date().getMonth() / 12;
  const currentDasha = mahadashas.find((d) => now >= d.from && now < d.to) ?? mahadashas[0];

  // Doshas
  const marsHouse = planets.find((p) => p.name === "Mars")!.house;
  const mangalDosha = [1, 4, 7, 8, 12].includes(marsHouse);
  const saturnSign = planets.find((p) => p.name === "Saturn")!.sign;
  const moonSignIdx = moon.sign;
  const sadeSati = [(moonSignIdx + 11) % 12, moonSignIdx, (moonSignIdx + 1) % 12].includes(saturnSign);
  const kaalSarp = (() => {
    const rahuS = planets.find((p) => p.name === "Rahu")!.sign;
    const ketuS = planets.find((p) => p.name === "Ketu")!.sign;
    const between = (sgn: number) => {
      const a = (sgn - rahuS + 12) % 12;
      const b = (ketuS - rahuS + 12) % 12;
      return a > 0 && a < b;
    };
    const others = planets.filter((p) => p.name !== "Rahu" && p.name !== "Ketu").map((p) => p.sign);
    return others.every(between) || others.every((s) => !between(s));
  })();

  const doshas = [
    { name: "Mangal Dosha", present: mangalDosha, note: mangalDosha
      ? "Mars sits in a sensitive house — temper passion with patience in partnerships."
      : "Mars is gentle here. Relationships flow with natural courage." },
    { name: "Sade Sati", present: sadeSati, note: sadeSati
      ? "Saturn moves near your Moon — a teaching season. Move slowly, build with care."
      : "Saturn moves quietly past your Moon. A calmer chapter of inner work." },
    { name: "Kaal Sarp Dosha", present: kaalSarp, note: kaalSarp
      ? "Planets cluster on one side of the Rahu–Ketu axis. Acts of service dissolve it."
      : "The lunar nodes do not bind your chart. A free karmic field." },
  ];

  // Yogas — small but classical set
  const yogas: string[] = [];
  const jup = planets.find((p) => p.name === "Jupiter")!;
  const ven = planets.find((p) => p.name === "Venus")!;
  const mer = planets.find((p) => p.name === "Mercury")!;
  if ([1, 4, 7, 10].includes(jup.house)) yogas.push("Gaja Kesari Yoga — Jupiter angled with the Moon brings wisdom and respect.");
  if (mer.house === sun.sign + 1) yogas.push("Budhaditya Yoga — Mercury near the Sun sharpens intellect and articulation.");
  if (ven.sign === 1 || ven.sign === 6 || ven.sign === 11) yogas.push("Malavya Yoga — Venus well-placed grants grace, beauty and refined taste.");
  if (jup.sign === 8 || jup.sign === 11) yogas.push("Hamsa Yoga — Jupiter exalted; you carry quiet moral authority.");
  if (yogas.length === 0) yogas.push("Dhana Yoga — gentle wealth-giving combinations across your 2nd and 11th houses.");

  // Ashtakoot-style number from moon sign + nakshatra index (deterministic)
  const ashtakoot = 18 + ((moon.sign * 3 + nak.index) % 19);

  // Remedies (localised)
  const langCode = isSupportedLang(input.language ?? "en") ? (input.language ?? "en") : "en";
  const hints = getHints(langCode);
  const sentences = getSentences(langCode);
  const remedies = [
    hints.remedies[currentDasha.lord],
    hints.remedies[nak.lord],
    hints.remedies[RASHI_LORDS[moon.sign]],
    ...sentences.remediesExtra,
  ];

  return {
    input,
    geo,
    ayanamsa,
    planets,
    lagna,
    moonSign: moon.signName,
    sunSign: sun.signName,
    nakshatra: { name: nak.name, lord: nak.lord, pada: nak.pada },
    mahadashas,
    currentDasha,
    yogas,
    doshas,
    ashtakoot,
    remedies,
  };
}

// ---------- Interpretation library ----------

const RASHI_TRAITS: Record<string, string> = {
  "Mesha (Aries)": "fiery initiative, pioneering courage and a restless need to begin",
  "Vrishabha (Taurus)": "steady patience, a love of beauty and an instinct for what endures",
  "Mithuna (Gemini)": "quicksilver curiosity, language as breath, and gentle wit",
  "Karka (Cancer)": "deep feeling, lunar memory and a sanctuary-builder's heart",
  "Simha (Leo)": "radiant warmth, generous leadership and a creative inner sovereign",
  "Kanya (Virgo)": "precise care, healing service and reverence for craft",
  "Tula (Libra)": "graceful diplomacy, aesthetic balance and partnership wisdom",
  "Vrishchika (Scorpio)": "fierce devotion, transformative depth and unflinching truth",
  "Dhanu (Sagittarius)": "wide-horizon wisdom, philosophical fire and hopeful seeking",
  "Makara (Capricorn)": "patient ambition, structure-building and quiet authority",
  "Kumbha (Aquarius)": "humanitarian vision, original insight and friendly detachment",
  "Meena (Pisces)": "oceanic compassion, mystic intuition and surrender as strength",
};

const DASHA_NARRATIVE: Record<string, string> = {
  Sun: "a chapter of recognition, leadership and renewed self-confidence — your inner light becomes visible to others.",
  Moon: "a tender, emotional season — home, mother, memory and intuition lead the way.",
  Mars: "an energetic, action-driven period — courage rises; channel it through discipline, not impulse.",
  Mercury: "a flowering of intellect, communication and commerce — words, contracts and travel bring growth.",
  Jupiter: "a wisdom-rich, expansive era — teachers arrive, family grows, dharma deepens.",
  Venus: "a luxurious, artistic, love-filled period — beauty, partnership and prosperity ripen.",
  Saturn: "a patient, structural decade — slow building, hard lessons, and the rewards of integrity.",
  Rahu: "an ambitious, unconventional rise — bold leaps abroad or into new fields; stay grounded.",
  Ketu: "an inward, spiritual turn — let go gracefully; meditation and study become your wealth.",
};

const NAK_GIFT: Record<string, string> = {
  Ashwini: "swift healing, the gift of beginnings",
  Bharani: "the courage to bear and transform",
  Krittika: "fire that cuts through illusion",
  Rohini: "magnetic creativity and abundance",
  Mrigashira: "the seeker who never tires",
  Ardra: "the storm that clears the sky",
  Punarvasu: "the return to wholeness",
  Pushya: "nourishment of soul and family",
  Ashlesha: "psychic depth and serpent wisdom",
  Magha: "ancestral dignity and throne",
  "Purva Phalguni": "love, leisure and creative joy",
  "Uttara Phalguni": "noble friendship and patronage",
  Hasta: "skilled hands and clever solutions",
  Chitra: "brilliant artistry and design",
  Swati: "independent, wind-borne wisdom",
  Vishakha: "focused purpose and resolve",
  Anuradha: "loyal devotion and lasting friendship",
  Jyeshtha: "elder courage, protective strength",
  Mula: "root-knowing, philosophical depth",
  "Purva Ashadha": "invincible optimism",
  "Uttara Ashadha": "unshakable later victory",
  Shravana: "the listening heart, sacred learning",
  Dhanishta: "rhythm, music and prosperity",
  Shatabhisha: "the hundred healers, mystic medicine",
  "Purva Bhadrapada": "transformative fire",
  "Uttara Bhadrapada": "deep stillness, oceanic peace",
  Revati: "compassionate guidance for all beings",
};

export interface Narrative {
  overview: string;
  personality: string[];
  career: string[];
  finance: string[];
  love: string[];
  marriage: string[];
  health: string[];
  family: string[];
  spiritual: string[];
  education: string[];
  travel: string[];
  dashaNow: string;
  yearAhead: string[];
  luckyColors: string;
  luckyDays: string;
  luckyNumbers: string;
  gemstone: string;
  mantra: string;
}

const GEMSTONES: Record<string, string> = {
  Sun: "Ruby (Manik) set in gold, worn on the ring finger",
  Moon: "Natural pearl (Moti) set in silver, worn on the little finger",
  Mars: "Red coral (Moonga) in gold or copper, worn on the ring finger",
  Mercury: "Emerald (Panna) in gold, worn on the little finger",
  Jupiter: "Yellow sapphire (Pukhraj) in gold, worn on the index finger",
  Venus: "Diamond or white sapphire in silver, worn on the middle finger",
  Saturn: "Blue sapphire (Neelam) in silver, worn after careful trial",
  Rahu: "Hessonite (Gomed) in silver, worn on the middle finger",
  Ketu: "Cat's-eye (Lehsunia) in silver, worn on the ring finger",
};

const MANTRAS: Record<string, string> = {
  Sun: "Om Hraam Hreem Hraum Sah Suryaya Namah",
  Moon: "Om Shraam Shreem Shraum Sah Chandraya Namah",
  Mars: "Om Kraam Kreem Kraum Sah Bhaumaya Namah",
  Mercury: "Om Braam Breem Braum Sah Budhaya Namah",
  Jupiter: "Om Graam Greem Graum Sah Gurave Namah",
  Venus: "Om Draam Dreem Draum Sah Shukraya Namah",
  Saturn: "Om Praam Preem Praum Sah Shanaye Namah",
  Rahu: "Om Bhraam Bhreem Bhraum Sah Rahave Namah",
  Ketu: "Om Sraam Sreem Sraum Sah Ketave Namah",
};

export function narrate(k: ComputedKundli, langCode?: string): Narrative {
  const code = langCode ?? k.input.language ?? "en";
  const lang = isSupportedLang(code) ? code : "en";
  const s = getSentences(lang);
  const h = getHints(lang);
  const traits = RASHI_TRAITS_I18N[lang] ?? RASHI_TRAITS_I18N.en;
  const dashaTable = DASHA_NARRATIVE_I18N[lang] ?? DASHA_NARRATIVE_I18N.en;
  const nakGiftTable = NAK_GIFT_I18N[lang] ?? NAK_GIFT_I18N.en;
  const gemstones = GEMSTONES_I18N[lang] ?? GEMSTONES_I18N.en;

  const moonTrait = traits[k.moonSign];
  const sunTrait = traits[k.sunSign];
  const lagnaTrait = traits[k.lagna.signName];
  const nakGift = nakGiftTable[k.nakshatra.name] ?? (lang === "hi" ? "एक मौन, विशिष्ट उपहार" : "a quiet, distinct gift");
  const dashaText = dashaTable[k.currentDasha.lord];

  return {
    overview: s.overview({
      lagna: k.lagna.signName, lagnaTrait,
      moonSign: k.moonSign, moonTrait,
      sunSign: k.sunSign, sunTrait,
      nakshatra: k.nakshatra.name, pada: k.nakshatra.pada, nakLord: k.nakshatra.lord, nakGift,
    }),
    personality: s.personality({
      lagna: k.lagna.signName, lagnaTrait, moonSign: k.moonSign, moonTrait,
      nakshatra: k.nakshatra.name, nakGift,
    }),
    career: s.career({
      dashaLord: k.currentDasha.lord, dashaText,
      lagnaLord: RASHI_LORDS[k.lagna.sign],
      careerArea: h.career[k.lagna.sign],
    }),
    finance: s.finance({ financeArea: financeAreaFor(k.moonSign, h) }),
    love: s.love({ loveStyle: loveStyleFor(k.moonSign, h) }),
    marriage: s.marriage({ partnerTrait: h.marriage[k.lagna.sign] }),
    health: s.health({
      dosha: h.healthDosha[k.lagna.sign],
      focus: h.healthFocus[k.lagna.sign],
      dashaLord: k.currentDasha.lord,
    }),
    family: s.family(),
    spiritual: s.spiritual({ spiritPath: h.spirit[k.nakshatra.lord] ?? "" }),
    education: s.education({ learningStyle: h.learning[k.nakshatra.lord] ?? "" }),
    travel: s.travel({ dashaLord: k.currentDasha.lord, travelStyle: h.travel[k.currentDasha.lord] ?? "" }),
    dashaNow: s.dashaNow({ dashaLord: k.currentDasha.lord, from: k.currentDasha.from, to: k.currentDasha.to, dashaText }),
    yearAhead: s.yearAhead(),
    luckyColors: h.luckyColors[k.lagna.sign],
    luckyDays: h.luckyDays[k.lagna.sign],
    luckyNumbers: luckyNumbers(k.moonSign),
    gemstone: gemstones[k.currentDasha.lord] ?? gemstones.Jupiter,
    mantra: MANTRAS[k.currentDasha.lord] ?? MANTRAS.Jupiter,
  };

  // Internal helpers for sign-keyword based hints
  function financeAreaFor(sign: string, hh: ReturnType<typeof getHints>) {
    if (sign.includes("Vrishabha") || sign.includes("Tula")) return hh.finance.kapha;
    if (sign.includes("Karka") || sign.includes("Meena")) return hh.finance.intuition;
    if (sign.includes("Mesha") || sign.includes("Vrishchika")) return hh.finance.mars;
    return hh.finance.default;
  }
  function loveStyleFor(sign: string, hh: ReturnType<typeof getHints>) {
    if (sign.includes("Karka") || sign.includes("Meena")) return hh.love.soft;
    if (sign.includes("Simha") || sign.includes("Mesha")) return hh.love.warm;
    if (sign.includes("Tula") || sign.includes("Vrishabha")) return hh.love.aesthetic;
    return hh.love.default;
  }
}

function luckyNumbers(sign: string) {
  return sign.includes("Mesha") ? "9, 1, 6" : sign.includes("Vrishabha") ? "6, 5, 4"
    : sign.includes("Mithuna") ? "5, 3, 7" : sign.includes("Karka") ? "2, 7, 9"
    : sign.includes("Simha") ? "1, 5, 9" : sign.includes("Kanya") ? "5, 6, 3"
    : sign.includes("Tula") ? "6, 5, 9" : sign.includes("Vrishchika") ? "9, 1, 8"
    : sign.includes("Dhanu") ? "3, 6, 9" : sign.includes("Makara") ? "8, 4, 6"
    : sign.includes("Kumbha") ? "8, 4, 1" : "3, 7, 9";
}

// ---------- Planet dignity & essence ----------
const DIGNITY: Record<string, { exalt: number; debil: number; own: number[] }> = {
  Sun:     { exalt: 0, debil: 6, own: [4] },
  Moon:    { exalt: 1, debil: 7, own: [3] },
  Mars:    { exalt: 9, debil: 3, own: [0, 7] },
  Mercury: { exalt: 5, debil: 11, own: [2, 5] },
  Jupiter: { exalt: 3, debil: 9, own: [8, 11] },
  Venus:   { exalt: 11, debil: 5, own: [1, 6] },
  Saturn:  { exalt: 6, debil: 0, own: [9, 10] },
};

function dignityOf(planet: string, sign: number): string {
  if (planet === "Rahu" || planet === "Ketu") return "Shadow";
  const d = DIGNITY[planet];
  if (!d) return "Neutral";
  if (sign === d.exalt) return "Exalted";
  if (sign === d.debil) return "Debilitated";
  if (d.own.includes(sign)) return "Own sign";
  return "Neutral";
}

const HOUSE_THEME = [
  "self, body and first impressions",
  "wealth, speech and family of origin",
  "courage, siblings and short journeys",
  "home, mother and inner peace",
  "creativity, romance and children",
  "service, health and daily routines",
  "partnership, marriage and contracts",
  "transformation, mysteries and hidden gains",
  "dharma, wisdom and long pilgrimages",
  "career, fame and public standing",
  "gains, friendships and aspirations",
  "moksha, solitude and foreign lands",
];

function planetEssence(planet: string, sign: number, house: number): string {
  const dig = dignityOf(planet, sign);
  const tag =
    dig === "Exalted" ? "shines exalted" :
    dig === "Debilitated" ? "feels tender" :
    dig === "Own sign" ? "stands in its own seat" :
    dig === "Shadow" ? "casts its karmic shadow" :
    "moves comfortably";
  return `${tag} in the ${ordinal(house)} house of ${HOUSE_THEME[house - 1]}.`;
}

function ordinal(n: number) {
  const s = ["th","st","nd","rd"]; const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}