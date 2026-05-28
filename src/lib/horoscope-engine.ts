// Transit-driven Vedic horoscope.
// Computes today's sidereal positions of the seven traditional grahas and
// derives a personalised daily reading for each of the 12 moon signs.

import { julianDay, siderealPositions, RASHIS, RASHI_LORDS, nakshatraOf } from "./astro-core";

export const SIGNS = RASHIS.map((r) => r.split(" ")[1].replace(/[()]/g, "")); // ["Aries", ...]

const PLANET_FRIENDS: Record<string, string[]> = {
  Sun: ["Moon","Mars","Jupiter"],
  Moon: ["Sun","Mercury"],
  Mars: ["Sun","Moon","Jupiter"],
  Mercury: ["Sun","Venus"],
  Jupiter: ["Sun","Moon","Mars"],
  Venus: ["Mercury","Saturn"],
  Saturn: ["Mercury","Venus"],
};

const BENEFICS = new Set(["Jupiter","Venus","Mercury","Moon"]);
const FAVOURABLE_HOUSES = new Set([1,3,5,7,9,10,11]);
const TENSE_HOUSES = new Set([4,6,8,12]);

const LUCKY_COLORS = ["Saffron","Pearl white","Coral red","Forest green","Royal gold","Sea green","Rose","Maroon","Mustard yellow","Indigo","Sky blue","Soft amber"];
const LUCKY_NUMS = [9,2,5,2,1,5,6,9,3,8,8,3];
const COMPATIBLE = ["Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces","Aries","Taurus","Gemini","Cancer"];

export interface SignReading {
  sign: string;           // "Aries"
  rashi: string;          // "Mesha (Aries)"
  headline: string;
  detail: string;
  love: string;
  career: string;
  health: string;
  spiritual: string;
  mood: string;
  luckyColor: string;
  luckyNumber: number;
  compatible: string;
  score: number;          // 1-10
}

export interface DailyHoroscope {
  date: string;
  moonRashi: string;       // moon's current sidereal sign
  moonNakshatra: string;
  sunRashi: string;
  signs: SignReading[];
}

export function computeDaily(date: Date = new Date()): DailyHoroscope {
  const iso = date.toISOString().slice(0, 10);
  // Use 06:00 IST for daily reading reference point.
  const jd = julianDay(iso, "06:00", 5.5);
  const s = siderealPositions(jd);
  const transitSign: Record<string, number> = {
    Sun: Math.floor(s.Sun / 30), Moon: Math.floor(s.Moon / 30),
    Mars: Math.floor(s.Mars / 30), Mercury: Math.floor(s.Mercury / 30),
    Jupiter: Math.floor(s.Jupiter / 30), Venus: Math.floor(s.Venus / 30),
    Saturn: Math.floor(s.Saturn / 30),
    Rahu: Math.floor(s.Rahu / 30), Ketu: Math.floor(s.Ketu / 30),
  };
  const moonRashi = RASHIS[transitSign.Moon];
  const sunRashi = RASHIS[transitSign.Sun];
  const moonNak = nakshatraOf(s.Moon).name;

  const signs: SignReading[] = RASHIS.map((rashi, sign) => {
    // House of each transiting planet from this moon sign
    const houseOf = (p: keyof typeof transitSign) => ((transitSign[p] - sign + 12) % 12) + 1;
    const houses = {
      Moon: houseOf("Moon"), Sun: houseOf("Sun"), Mars: houseOf("Mars"),
      Mercury: houseOf("Mercury"), Jupiter: houseOf("Jupiter"),
      Venus: houseOf("Venus"), Saturn: houseOf("Saturn"),
      Rahu: houseOf("Rahu"), Ketu: houseOf("Ketu"),
    };

    // Composite score
    let score = 5;
    for (const [p, h] of Object.entries(houses)) {
      const benefic = BENEFICS.has(p);
      if (FAVOURABLE_HOUSES.has(h)) score += benefic ? 0.6 : 0.2;
      if (TENSE_HOUSES.has(h)) score -= benefic ? 0.2 : 0.6;
    }
    if (houses.Jupiter === 1 || houses.Jupiter === 5 || houses.Jupiter === 9) score += 1.2;
    if (houses.Saturn === 4 || houses.Saturn === 8 || houses.Saturn === 12) score -= 1;
    if (houses.Moon === 1) score += 0.5;
    score = Math.max(3, Math.min(10, Math.round(score * 10) / 10));

    const lord = RASHI_LORDS[sign];
    const friends = PLANET_FRIENDS[lord] ?? [];

    const englishName = rashi.split(" ")[1].replace(/[()]/g, "");

    const moonH = houses.Moon;
    const jupH = houses.Jupiter;
    const venH = houses.Venus;
    const satH = houses.Saturn;
    const marsH = houses.Mars;
    const merH = houses.Mercury;
    const sunH = houses.Sun;

    const headline = headlineFor(englishName, moonH, jupH, satH);
    const detail = detailFor(englishName, moonH, jupH, satH, sunH, friends);
    const love = loveFor(venH, moonH, marsH);
    const career = careerFor(sunH, satH, merH);
    const health = healthFor(satH, marsH, moonH, sign);
    const spiritual = spiritFor(jupH, lord, moonNak);
    const mood = moodFor(score, moonH);

    return {
      sign: englishName,
      rashi,
      headline,
      detail,
      love,
      career,
      health,
      spiritual,
      mood,
      luckyColor: LUCKY_COLORS[sign],
      luckyNumber: LUCKY_NUMS[sign],
      compatible: COMPATIBLE[(sign + (date.getDate() % 4)) % 12],
      score,
    };
  });

  return { date: iso, moonRashi, moonNakshatra: moonNak, sunRashi, signs };
}

/* ---------------- text generators (transit-aware, no AI) ---------------- */

function headlineFor(_s: string, moonH: number, jupH: number, satH: number): string {
  if (jupH === 1) return "A protective, gracious day — Jupiter shines on your sign.";
  if (jupH === 5 || jupH === 9) return "Wisdom flows easily today — speak from a settled heart.";
  if (moonH === 1) return "The Moon visits your own sign — your feelings are your compass.";
  if (satH === 1) return "Saturn asks for patience — slow steps go furthest today.";
  if (satH === 4 || satH === 8) return "A quieter day — protect your rest, conserve your speech.";
  if (moonH === 10) return "A spotlight day — what you do is gently noticed.";
  if (moonH === 4) return "Home and heart take precedence; tend to both.";
  if (moonH === 7) return "Relationships colour your day — listen more than you reply.";
  return "A balanced day — small choices carry meaningful weight.";
}

function detailFor(_s: string, moonH: number, jupH: number, satH: number, sunH: number, friends: string[]) {
  const parts: string[] = [];
  if (jupH === 1 || jupH === 5 || jupH === 9) parts.push("Jupiter's blessing brings clarity and quiet confidence. Begin something you've been delaying.");
  if (moonH === 1 || moonH === 4 || moonH === 7 || moonH === 10) parts.push("The Moon's angle to your sign deepens intuition — trust the first soft answer that arrives.");
  if (satH === 4 || satH === 8 || satH === 12) parts.push("Saturn nudges you to release a weight — a habit, a worry, a half-finished promise.");
  if (sunH === 10 || sunH === 11) parts.push("The Sun supports your visibility and gains; share a small accomplishment publicly.");
  if (parts.length === 0) parts.push(`A measured day. Lean on your sign's natural allies (${friends.slice(0,2).join(" & ")}) for steadiness.`);
  parts.push("Three slow breaths before any decision will keep you in your highest mind.");
  return parts.join(" ");
}

function loveFor(venH: number, moonH: number, marsH: number) {
  if (venH === 1 || venH === 5 || venH === 7) return "Venus warms your heart — a tender gesture lands beautifully today.";
  if (venH === 6 || venH === 8 || venH === 12) return "Speak gently; an old misunderstanding can dissolve with one honest sentence.";
  if (moonH === 7) return "Partnerships feel deeply emotional — meet softness with softness.";
  if (marsH === 7) return "Passions run high — channel intensity into shared creativity, not friction.";
  return "A quiet day in love — a small, attentive kindness means more than grand words.";
}

function careerFor(sunH: number, satH: number, merH: number) {
  if (sunH === 10) return "Leadership moments arrive — be the calm voice in the room.";
  if (merH === 3 || merH === 10) return "Communication is your superpower today — send the email, make the call.";
  if (satH === 10) return "Slow, structural work pays off — favour depth over speed.";
  if (satH === 6) return "Service and discipline are noticed; a colleague will return your kindness later.";
  return "Steady work, no dramatic moves. Finish one small task that's been waiting.";
}

function healthFor(satH: number, marsH: number, moonH: number, sign: number) {
  const focus = ["head and eyes","throat and neck","shoulders and lungs","stomach","heart and spine","digestion","kidneys","reproductive system","hips","knees","ankles","feet"][sign];
  if (satH === 6 || satH === 8) return `Rest the ${focus}. Skip the gym in favour of a slow walk and warm food.`;
  if (marsH === 1 || marsH === 8) return "Watch impulsive eating and sharp movements; warm-up before any exertion.";
  if (moonH === 4) return "Emotional eating is the watchpoint — sip warm water often.";
  return `Gentle pranayama (Anulom-Vilom for 7 minutes) balances your ${focus} today.`;
}

function spiritFor(jupH: number, lord: string, nak: string) {
  if (jupH === 1 || jupH === 5 || jupH === 9) return `A high-prana day. Chant your ${lord} mantra 27 times after sunset.`;
  return `Light a single ghee diya at dusk; the Moon transits ${nak} nakshatra and answers stillness.`;
}

function moodFor(score: number, moonH: number) {
  if (score >= 8) return "Luminous · grateful";
  if (score >= 7) return "Hopeful · warm";
  if (score >= 5.5) return "Reflective · calm";
  if (moonH === 8 || moonH === 12) return "Inward · tender";
  return "Patient · quiet";
}