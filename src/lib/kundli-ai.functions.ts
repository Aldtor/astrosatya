import { createServerFn } from "@tanstack/react-start";
import { findLanguage } from "./languages";

export interface AIGenInput {
  language: string;
  // Compact context from the computed kundli
  ctx: {
    name: string;
    gender: string;
    lagna: string;
    moonSign: string;
    sunSign: string;
    nakshatra: string;
    pada: number;
    nakLord: string;
    currentDasha: { lord: string; from: number; to: number };
    planets: { name: string; sanskrit: string; signName: string; house: number; nakshatra: string; dignity: string }[];
    yogas: string[];
    doshas: { name: string; present: boolean }[];
  };
}

export interface AINarrative {
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
  yearAhead: string[];
  dashaNow: string;
  remedies: string[];
  planetEssences: string[]; // same length & order as ctx.planets
}

const SHAPE_HINT = `{
  "overview": "1 paragraph (3-4 sentences)",
  "personality": ["3 sentences as 3 array items"],
  "career": ["3 items"],
  "finance": ["3 items"],
  "love": ["3 items"],
  "marriage": ["3 items"],
  "health": ["3 items"],
  "family": ["3 items"],
  "spiritual": ["3 items"],
  "education": ["3 items"],
  "travel": ["3 items"],
  "yearAhead": ["3 items"],
  "dashaNow": "1 paragraph about current Mahadasha",
  "remedies": ["5 items"],
  "planetEssences": ["one short line per planet in the same order"]
}`;

export const generateKundliInLanguage = createServerFn({ method: "POST" })
  .inputValidator((d: AIGenInput) => d)
  .handler(async ({ data }): Promise<AINarrative> => {
    const lang = findLanguage(data.language);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const planetsList = data.ctx.planets
      .map((p) => `${p.name} (${p.sanskrit}) in ${p.signName}, house ${p.house}, nakshatra ${p.nakshatra}, ${p.dignity}`)
      .join("\n");

    const system = `You are a senior Vedic astrologer. Write the entire reading in ${lang.english} (${lang.native}) using its native script. Keep Sanskrit/Vedic terms (rashis, nakshatras, planets, yogas, dashas, doshas) in their traditional Sanskrit/Devanagari or the standard local-script form for that language. Write with warmth, classical authority and modern clarity — like a wise family astrologer. Never use English for the body content; only Sanskrit technical terms may stay. Return STRICT JSON only, no markdown, no commentary.`;

    const user = `Birth details:
- Name: ${data.ctx.name || "Seeker"}
- Gender: ${data.ctx.gender || "—"}
- Lagna (Ascendant): ${data.ctx.lagna}
- Moon sign (Rashi): ${data.ctx.moonSign}
- Sun sign: ${data.ctx.sunSign}
- Janma Nakshatra: ${data.ctx.nakshatra} pada ${data.ctx.pada} (lord ${data.ctx.nakLord})
- Current Mahadasha: ${data.ctx.currentDasha.lord} (${Math.floor(data.ctx.currentDasha.from)}–${Math.floor(data.ctx.currentDasha.to)})
- Yogas: ${data.ctx.yogas.join(" | ") || "—"}
- Doshas: ${data.ctx.doshas.map((d) => `${d.name}: ${d.present ? "present" : "absent"}`).join(" | ")}

Planets:
${planetsList}

Produce a detailed Vedic kundli reading as JSON with EXACTLY this shape (keys in English, all VALUES in ${lang.english}):
${SHAPE_HINT}

Constraints:
- "planetEssences" MUST have exactly ${data.ctx.planets.length} items, in the same order as the planet list above.
- Each bullet array item is 1-2 sentences.
- Use the native script of ${lang.english} throughout.
- Be specific to this chart (cite the actual rashi, nakshatra, dasha, houses).`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("AI rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Settings → Workspace → Usage.");
      throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: AINarrative;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to salvage by extracting first JSON block
      const m = content.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : ({} as AINarrative);
    }

    // Pad planetEssences to match planet count
    if (!Array.isArray(parsed.planetEssences)) parsed.planetEssences = [];
    while (parsed.planetEssences.length < data.ctx.planets.length) parsed.planetEssences.push("");

    return parsed;
  });