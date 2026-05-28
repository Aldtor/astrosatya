import { createServerFn } from "@tanstack/react-start";

export interface TranslatePayload {
  languageCode: string;
  languageName: string; // e.g. "Hindi (हिन्दी)"
  // arbitrary JSON tree of strings; AI mirrors structure & translates leaf strings only
  payload: unknown;
}

export const translateContent = createServerFn({ method: "POST" })
  .inputValidator((d: TranslatePayload) => d)
  .handler(async ({ data }) => {
    if (data.languageCode === "en") return data.payload;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const system =
      "You are a precise translator for a Vedic astrology reading. " +
      "Translate every string VALUE in the given JSON into the target language using its native script. " +
      "RULES: (1) Preserve the JSON structure and all keys exactly. (2) Keep Sanskrit/Vedic proper nouns " +
      "(planet names, sign names like Mesha/Vrishabha, nakshatra names, dasha lord names) — transliterate " +
      "them naturally into the target script rather than translating their meaning. (3) Keep numbers, " +
      "years, degree symbols and punctuation intact. (4) Tone: warm, devotional, literary. " +
      "(5) Return ONLY a single JSON object — no markdown, no prose.";

    const user = `Target language: ${data.languageName}\n\nJSON to translate:\n${JSON.stringify(data.payload)}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
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

    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    if (!res.ok) throw new Error(`Translation failed (${res.status}): ${await res.text()}`);

    const j: { choices?: { message?: { content?: string } }[] } = await res.json();
    const content = j.choices?.[0]?.message?.content ?? "";
    try {
      return JSON.parse(content);
    } catch {
      // Fallback: try to strip code fences
      const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      return JSON.parse(cleaned);
    }
  });