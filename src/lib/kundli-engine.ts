// Lightweight Vedic kundli engine.
// Uses simplified mean-motion formulas + Lahiri ayanamsa (~24°) to derive a
// plausible, deterministic sidereal chart from birth date / time / place.
// Not astronomically exact — suitable for a reading-grade report.

export interface BirthInput {
  name: string;
  gender: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  place: string;
}

export const RASHIS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
];

export const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export const RASHI_ELEMENT = [
  "Fire", "Earth", "Air", "Water", "Fire", "Earth",
  "Air", "Water", "Fire", "Earth", "Air", "Water",
];

export const NAKSHATRAS = [
  ["Ashwini", "Ketu"], ["Bharani", "Venus"], ["Krittika", "Sun"],
  ["Rohini", "Moon"], ["Mrigashira", "Mars"], ["Ardra", "Rahu"],
  ["Punarvasu", "Jupiter"], ["Pushya", "Saturn"], ["Ashlesha", "Mercury"],
  ["Magha", "Ketu"], ["Purva Phalguni", "Venus"], ["Uttara Phalguni", "Sun"],
  ["Hasta", "Moon"], ["Chitra", "Mars"], ["Swati", "Rahu"],
  ["Vishakha", "Jupiter"], ["Anuradha", "Saturn"], ["Jyeshtha", "Mercury"],
  ["Mula", "Ketu"], ["Purva Ashadha", "Venus"], ["Uttara Ashadha", "Sun"],
  ["Shravana", "Moon"], ["Dhanishta", "Mars"], ["Shatabhisha", "Rahu"],
  ["Purva Bhadrapada", "Jupiter"], ["Uttara Bhadrapada", "Saturn"], ["Revati", "Mercury"],
] as const;

const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const AYANAMSA = 24.1; // Lahiri approximation

function toJD(date: string, time: string): number {
  const [Y, M, D] = date.split("-").map(Number);
  const [h, m] = time.split(":").map(Number);
  let y = Y, mo = M;
  if (mo <= 2) { y -= 1; mo += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (mo + 1)) + D + B - 1524.5;
  return jd + (h + m / 60) / 24;
}

const norm = (d: number) => ((d % 360) + 360) % 360;

function meanLongitudes(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  // Crude mean longitudes (tropical) — accurate enough for sign placement.
  const sun = norm(280.46 + 0.9856474 * (jd - 2451545.0));
  const moon = norm(218.316 + 13.176396 * (jd - 2451545.0));
  const mercury = norm(252.25 + 4.092339 * (jd - 2451545.0));
  const venus = norm(181.98 + 1.602136 * (jd - 2451545.0));
  const mars = norm(355.43 + 0.524039 * (jd - 2451545.0));
  const jupiter = norm(34.35 + 0.083091 * (jd - 2451545.0));
  const saturn = norm(50.08 + 0.033494 * (jd - 2451545.0));
  const rahu = norm(125.04 - 0.0529539 * (jd - 2451545.0));
  const ketu = norm(rahu + 180);
  return { sun, moon, mercury, venus, mars, jupiter, saturn, rahu, ketu, T };
}

function sidereal(lon: number) { return norm(lon - AYANAMSA); }

function signOf(lon: number) {
  const s = Math.floor(lon / 30);
  const deg = lon - s * 30;
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return { sign: s, signName: RASHIS[s], deg: `${d}° ${String(m).padStart(2, "0")}'` };
}

function nakshatraOf(moonLon: number) {
  const n = Math.floor(moonLon / (360 / 27));
  const within = moonLon - n * (360 / 27);
  const pada = Math.floor(within / (360 / 108)) + 1;
  const [name, lord] = NAKSHATRAS[n];
  const fraction = within / (360 / 27); // 0..1 elapsed in current nakshatra
  return { index: n, name, lord, pada, fraction };
}

function ascendant(jd: number, time: string) {
  // Very rough lagna: based on local sidereal hour. Each rashi rises for ~2h.
  const [h, m] = time.split(":").map(Number);
  const dayFrac = h + m / 60;
  const sunLon = sidereal(meanLongitudes(jd).sun);
  const sunSign = Math.floor(sunLon / 30);
  // sunrise ~06:00 → Sun's sign rises; each 2h → next sign.
  const offset = Math.floor(((dayFrac - 6 + 24) % 24) / 2);
  const lagnaSign = (sunSign + offset) % 12;
  const lagnaDeg = ((dayFrac - 6 + 24) % 2) * 15; // 0..30
  return { sign: lagnaSign, signName: RASHIS[lagnaSign], deg: `${Math.floor(lagnaDeg)}° ${String(Math.floor((lagnaDeg % 1) * 60)).padStart(2, "0")}'` };
}

export interface ComputedKundli {
  input: BirthInput;
  planets: { name: string; sanskrit: string; signName: string; deg: string; sign: number; house: number }[];
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
  const jd = toJD(input.date, input.time);
  const m = meanLongitudes(jd);

  const sid = {
    Sun: sidereal(m.sun), Moon: sidereal(m.moon), Mercury: sidereal(m.mercury),
    Venus: sidereal(m.venus), Mars: sidereal(m.mars), Jupiter: sidereal(m.jupiter),
    Saturn: sidereal(m.saturn), Rahu: sidereal(m.rahu), Ketu: sidereal(m.ketu),
  };

  const lagna = ascendant(jd, input.time);

  const sanskrit: Record<string, string> = {
    Sun: "Surya", Moon: "Chandra", Mars: "Mangal", Mercury: "Budh",
    Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu",
  };

  const planets = (Object.keys(sid) as (keyof typeof sid)[]).map((p) => {
    const s = signOf(sid[p]);
    const house = ((s.sign - lagna.sign + 12) % 12) + 1;
    return { name: p, sanskrit: sanskrit[p], signName: s.signName, deg: s.deg, sign: s.sign, house };
  });

  const moon = signOf(sid.Moon);
  const sun = signOf(sid.Sun);
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

  // Remedies
  const lordRemedies: Record<string, string> = {
    Sun: "Offer water to the Sun at sunrise; chant Aditya Hridayam on Sundays.",
    Moon: "Wear white on Mondays; meditate by moonlight near water.",
    Mars: "Read Hanuman Chalisa on Tuesdays; donate red lentils.",
    Mercury: "Feed green grass to a cow on Wednesdays; chant Vishnu Sahasranama.",
    Jupiter: "Wear yellow on Thursdays; offer turmeric and chana dal at a temple.",
    Venus: "Light a ghee lamp at dusk on Fridays; offer white flowers to Lakshmi.",
    Saturn: "Light a mustard-oil lamp under a peepal tree on Saturdays; serve elders.",
    Rahu: "Donate black sesame; chant Durga Saptashati.",
    Ketu: "Feed stray dogs; meditate in silence at dusk.",
  };
  const remedies = [
    lordRemedies[currentDasha.lord],
    lordRemedies[nak.lord],
    lordRemedies[RASHI_LORDS[moon.sign]],
    "Begin each day with three slow breaths and one moment of gratitude.",
    "Keep a small altar at home — a flame, a flower, a sacred sound.",
  ];

  return {
    input,
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

export function narrate(k: ComputedKundli): Narrative {
  const moonTrait = RASHI_TRAITS[k.moonSign];
  const sunTrait = RASHI_TRAITS[k.sunSign];
  const lagnaTrait = RASHI_TRAITS[k.lagna.signName];
  const nakGift = NAK_GIFT[k.nakshatra.name] ?? "a quiet, distinct gift";
  const dasha = DASHA_NARRATIVE[k.currentDasha.lord];

  const overview =
    `Your chart rises in ${k.lagna.signName}, lending you ${lagnaTrait}. The Moon — your inner ` +
    `landscape — rests in ${k.moonSign}, weaving ${moonTrait}. The Sun, your dharmic axis, sits ` +
    `in ${k.sunSign}, asking you to embody ${sunTrait}. You were born under ${k.nakshatra.name} ` +
    `nakshatra (pada ${k.nakshatra.pada}), ruled by ${k.nakshatra.lord}, which gifts you ${nakGift}.`;

  return {
    overview,
    personality: [
      `From your Lagna in ${k.lagna.signName}, you meet the world with ${lagnaTrait}. ` +
      `Others perceive you as composed, intentional, and quietly luminous.`,
      `Your Moon in ${k.moonSign} colours your private world with ${moonTrait}. ` +
      `In solitude you return to a steady, almost ancestral rhythm.`,
      `Born in ${k.nakshatra.name}, you carry ${nakGift}. This is your subtle signature — ` +
      `the quality friends remember long after a conversation ends.`,
    ],
    career: [
      `With the ${k.currentDasha.lord} Mahadasha active, your professional life enters ${dasha}`,
      `Roles aligned to ${RASHI_LORDS[k.lagna.sign]} energies — work involving ` +
      careerHints(k.lagna.sign) + ` — will feel natural and rewarding.`,
      `Avoid forcing growth in the first quarter of any new venture; the second half of the year ` +
      `carries stronger karmic momentum for visibility and promotion.`,
    ],
    finance: [
      `Wealth flows steadily through ${financeHints(k.moonSign)}. Avoid speculative ventures ` +
      `during Saturn's transit over your 8th house.`,
      `Long-term, sattvic investments — land, gold, education, sacred art — multiply gracefully.`,
      `Keep a portion of every earning for dāna (giving). Charity opens unseen channels of return.`,
    ],
    love: [
      `In love you offer ${loveHints(k.moonSign)}. You long for a partner who can meet your silence as well as your laughter.`,
      `Venus in your chart asks you to choose with intention rather than urgency.`,
      `Honest conversation, not perfection, is the true gemstone of your relationships.`,
    ],
    marriage: [
      `Marriage indicators suggest a partner who is ${marriageHints(k.lagna.sign)}.`,
      `The 7th house guidance favours unions formed after age 26, with deeper harmony unfolding gradually.`,
      `Annual rituals together — a yearly pilgrimage or shared fast — will quietly strengthen the bond.`,
    ],
    health: [
      `Your constitution leans ${healthHints(k.lagna.sign)}. Pay loving attention to ` +
      `${healthFocus(k.lagna.sign)}.`,
      `Daily pranayama (Anulom-Vilom and Bhramari) balances your nervous system beautifully.`,
      `Sleep before 11 pm during ${k.currentDasha.lord} dasha — your body restores fastest then.`,
    ],
    family: [
      `Family is a temple in your chart. Your mother's blessings carry extraordinary weight in this lifetime.`,
      `Children, when they arrive, are likely to be artistic, sensitive, and spiritually inclined.`,
      `Maintain a small altar dedicated to your kuldevta — it harmonises generational karma.`,
    ],
    spiritual: [
      `Your spiritual path is ${spiritHints(k.nakshatra.lord)}. Approach it with regularity rather than intensity.`,
      `Mantra japa with a tulsi or rudraksha mala for 11 minutes daily quietly rewires your subtle body.`,
      `Visit a flowing river or ancient temple once a year — your soul measures time in pilgrimages.`,
    ],
    education: [
      `Your mind grasps best through ${learningHints(k.nakshatra.lord)}.`,
      `Periods between ages 18–24 and 32–36 are especially fertile for higher studies and certifications.`,
      `Teaching what you learn — even informally — accelerates your own mastery tenfold.`,
    ],
    travel: [
      `Travel during ${k.currentDasha.lord} dasha tends to be ${travelHints(k.currentDasha.lord)}.`,
      `Eastward and northward journeys carry the strongest karmic openings.`,
      `Pilgrimages — Kashi, Tirupati, Kedarnath, or a sacred site personal to your lineage — bring lasting peace.`,
    ],
    dashaNow:
      `You are presently in the ${k.currentDasha.lord} Mahadasha (${Math.floor(k.currentDasha.from)} – ${Math.floor(k.currentDasha.to)}). ` +
      `This is ${dasha} Honour its themes; resist resisting it.`,
    yearAhead: [
      `The coming twelve months emphasise inner clarity over outer noise. A relationship, a project, or a place ` +
      `that has quietly drained you will gently release.`,
      `Between months 4 and 7, an opportunity arrives through someone older or more experienced — say yes slowly, but say yes.`,
      `By the year's end, a new daily practice (writing, walking, chanting) will have reshaped your inner life more than any external event.`,
    ],
    luckyColors: luckyColors(k.lagna.sign),
    luckyDays: luckyDays(k.lagna.sign),
    luckyNumbers: luckyNumbers(k.moonSign),
    gemstone: GEMSTONES[k.currentDasha.lord] ?? GEMSTONES.Jupiter,
    mantra: MANTRAS[k.currentDasha.lord] ?? MANTRAS.Jupiter,
  };
}

// ----- small helpers for varied, sign-aware sentences -----
function careerHints(s: number) {
  const a = ["leadership and pioneering", "design, finance and luxury", "writing, media and trade", "healing, hospitality and homes",
    "performance, mentorship and royal arts", "research, editing and wellness", "law, diplomacy and aesthetics", "investigation, depth psychology and finance",
    "teaching, philosophy and travel", "administration, real estate and slow industries", "technology, social causes and innovation", "spiritual work, film and oceanic creativity"];
  return a[s];
}
function financeHints(sign: string) {
  return sign.includes("Vrishabha") || sign.includes("Tula") ? "luxury, beauty and refined craft"
    : sign.includes("Karka") || sign.includes("Meena") ? "intuition, healing and ancestral property"
    : sign.includes("Mesha") || sign.includes("Vrishchika") ? "courageous initiative and decisive action"
    : "patient mastery of a single craft";
}
function loveHints(sign: string) {
  return sign.includes("Karka") || sign.includes("Meena") ? "soft, nurturing presence and emotional depth"
    : sign.includes("Simha") || sign.includes("Mesha") ? "warm devotion and protective generosity"
    : sign.includes("Tula") || sign.includes("Vrishabha") ? "beauty, romance and steady tenderness"
    : "thoughtful, quietly loyal companionship";
}
function marriageHints(s: number) {
  const a = ["independent and warm", "patient and aesthetic", "communicative and playful", "deeply nurturing",
    "generous and dignified", "discerning and devoted", "graceful and harmonious", "intense and loyal",
    "philosophical and free-spirited", "ambitious and grounded", "original and humanitarian", "intuitive and gentle"];
  return a[s];
}
function healthHints(s: number) { const v = ["pitta", "kapha", "vata", "kapha", "pitta", "vata", "vata", "pitta", "pitta-vata", "vata-kapha", "vata", "kapha"]; return v[s]; }
function healthFocus(s: number) { const v = ["the head and eyes", "the throat and neck", "lungs and shoulders", "stomach and chest", "heart and spine", "digestion and intestines", "kidneys and lower back", "reproductive system", "hips and liver", "knees and joints", "ankles and circulation", "feet and lymphatic flow"]; return v[s]; }
function spiritHints(lord: string) {
  return ({
    Sun: "the path of dharma and self-realisation through visible service",
    Moon: "bhakti — devotional surrender through song, water and the divine mother",
    Mars: "karma yoga — fierce, disciplined action offered without attachment",
    Mercury: "jnana yoga — sacred study, inquiry and clear discernment",
    Jupiter: "the guru-shishya path — learning at the feet of a true teacher",
    Venus: "tantric beauty — devotion through art, fragrance, sound and sacred relationship",
    Saturn: "ascetic patience — sustained sadhana, vows and quiet humility",
    Rahu: "unconventional mysticism — esoteric studies that surprise the orthodox",
    Ketu: "raja yoga — meditation, renunciation and the inward gaze",
  } as Record<string, string>)[lord] ?? "a balanced sadhana that honours both discipline and grace";
}
function learningHints(lord: string) {
  return ({ Sun: "structured mastery", Moon: "rhythm, repetition and visual memory", Mars: "challenge and competition",
    Mercury: "discussion, writing and lateral connections", Jupiter: "wise mentors and sacred texts",
    Venus: "beauty, art and creative practice", Saturn: "long patient hours and earned depth",
    Rahu: "unconventional, intensive immersion", Ketu: "silent contemplation and pattern-seeing" } as Record<string, string>)[lord] ?? "a balanced rhythm of study and rest";
}
function travelHints(lord: string) {
  return ({ Sun: "transformative — official journeys yield recognition", Moon: "emotional — water and mother-figures call you",
    Mars: "energetic — short, decisive trips bring success", Mercury: "frequent and commerce-rich",
    Jupiter: "pilgrimage-flavoured — temples and teachers", Venus: "luxurious — romantic and aesthetic destinations",
    Saturn: "long and serious — work-related, abroad or remote", Rahu: "foreign and unconventional — distant lands beckon",
    Ketu: "inward — retreats, ashrams and mountain solitudes" } as Record<string, string>)[lord] ?? "gentle and restorative";
}
function luckyColors(s: number) { const v = ["Crimson and saffron", "Ivory, soft pink and pastel green", "Mint, silver and turquoise", "Pearl white and silver", "Gold and warm orange", "Forest green and earth tones", "Pale blue and rose", "Maroon and deep red", "Marigold yellow and bronze", "Indigo and slate", "Sky blue and lavender", "Sea green and amber"]; return v[s]; }
function luckyDays(s: number) { const v = ["Tuesday, Sunday", "Friday, Monday", "Wednesday, Friday", "Monday, Thursday", "Sunday, Thursday", "Wednesday, Friday", "Friday, Wednesday", "Tuesday, Saturday", "Thursday, Sunday", "Saturday, Wednesday", "Saturday, Friday", "Thursday, Monday"]; return v[s]; }
function luckyNumbers(sign: string) {
  return sign.includes("Mesha") ? "9, 1, 6" : sign.includes("Vrishabha") ? "6, 5, 4"
    : sign.includes("Mithuna") ? "5, 3, 7" : sign.includes("Karka") ? "2, 7, 9"
    : sign.includes("Simha") ? "1, 5, 9" : sign.includes("Kanya") ? "5, 6, 3"
    : sign.includes("Tula") ? "6, 5, 9" : sign.includes("Vrishchika") ? "9, 1, 8"
    : sign.includes("Dhanu") ? "3, 6, 9" : sign.includes("Makara") ? "8, 4, 6"
    : sign.includes("Kumbha") ? "8, 4, 1" : "3, 7, 9";
}