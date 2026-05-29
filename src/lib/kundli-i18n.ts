// Local, offline translations for the kundli narrative.
// English (en) and Hindi (hi) are defined inline below.
// Additional Indian-language packs live in ./i18n-packs/ and self-register on import.

import { RASHIS, NAKSHATRAS, RASHI_LORDS } from "./astro-core";

const SUPPORTED: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
];

export function isSupportedLang(code: string): boolean {
  return SUPPORTED.some((s) => s.code === code);
}

export function getSupportedLangs(): string[] {
  return SUPPORTED.map((s) => s.label);
}

// Back-compat export — now a getter list that grows as packs register.
export const SUPPORTED_NARRATION_LANGS = new Proxy([] as string[], {
  get(_t, prop) {
    const arr = SUPPORTED.map((s) => s.label);
    // @ts-expect-error proxy passthrough
    return arr[prop];
  },
});

function pick<T>(table: Record<string, T>, lang: string): T {
  return table[lang] ?? table.en;
}

// ---------------- Rashi (sign) traits ----------------

const RASHI_TRAITS_EN: Record<string, string> = {
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

const RASHI_TRAITS_HI: Record<string, string> = {
  "Mesha (Aries)": "अग्नितुल्य पहल, अग्रणी साहस और सदा कुछ नया आरंभ करने की चाह",
  "Vrishabha (Taurus)": "स्थिर धैर्य, सौंदर्य से प्रेम और टिकाऊ वस्तुओं की समझ",
  "Mithuna (Gemini)": "चपल जिज्ञासा, वाणी की सहजता और कोमल बुद्धिमत्ता",
  "Karka (Cancer)": "गहरी भावनाएँ, चंद्र-स्मृति और घर बनाने वाला हृदय",
  "Simha (Leo)": "तेजस्वी ऊष्मा, उदार नेतृत्व और रचनात्मक आंतरिक राजसी भाव",
  "Kanya (Virgo)": "सूक्ष्म देखरेख, सेवा-भाव और कौशल के प्रति श्रद्धा",
  "Tula (Libra)": "सौम्य कूटनीति, सौंदर्य का संतुलन और साझेदारी की प्रज्ञा",
  "Vrishchika (Scorpio)": "तीव्र समर्पण, परिवर्तनकारी गहराई और निर्भीक सत्य",
  "Dhanu (Sagittarius)": "विस्तृत दृष्टि, दार्शनिक अग्नि और आशामय अन्वेषण",
  "Makara (Capricorn)": "धैर्यवान महत्वाकांक्षा, संरचना-निर्माण और मौन सत्ता",
  "Kumbha (Aquarius)": "मानवीय दृष्टि, मौलिक अंतर्दृष्टि और मैत्रीपूर्ण निरपेक्षता",
  "Meena (Pisces)": "सागर-सी करुणा, रहस्यमय अंतर्बोध और समर्पण की शक्ति",
};

export const RASHI_TRAITS_I18N: Record<string, Record<string, string>> = {
  en: RASHI_TRAITS_EN,
  hi: RASHI_TRAITS_HI,
};

// ---------------- Dasha narratives ----------------

const DASHA_EN: Record<string, string> = {
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

const DASHA_HI: Record<string, string> = {
  Sun: "मान-सम्मान, नेतृत्व और आत्म-विश्वास का अध्याय — आपका आंतरिक तेज सबके सामने प्रकट होता है।",
  Moon: "कोमल, भावनात्मक काल — घर, माता, स्मृति और अंतर्ज्ञान मार्गदर्शक बनते हैं।",
  Mars: "ऊर्जावान, कर्मप्रधान काल — साहस उठता है; उसे अनुशासन से दिशा दें, आवेग से नहीं।",
  Mercury: "बुद्धि, संवाद और व्यापार का पुष्पित काल — शब्द, अनुबंध और यात्राएँ वृद्धि देती हैं।",
  Jupiter: "ज्ञान-समृद्ध और विस्तारक युग — गुरु आते हैं, परिवार बढ़ता है, धर्म गहराता है।",
  Venus: "विलासमय, कलात्मक और प्रेमपूर्ण काल — सौंदर्य, संबंध और समृद्धि परिपक्व होते हैं।",
  Saturn: "धैर्यवान, संरचनात्मक दशक — धीमी रचना, कठोर पाठ और सत्यनिष्ठा का फल।",
  Rahu: "महत्वाकांक्षी, असामान्य उत्थान — विदेश अथवा नए क्षेत्रों में साहसी छलांग; जड़ें स्थिर रखें।",
  Ketu: "अंतर्मुखी, आध्यात्मिक मोड़ — कृपापूर्वक त्याग; ध्यान और स्वाध्याय ही धन बनते हैं।",
};

export const DASHA_NARRATIVE_I18N: Record<string, Record<string, string>> = {
  en: DASHA_EN,
  hi: DASHA_HI,
};

// ---------------- Nakshatra gifts (27) ----------------

const NAK_GIFT_EN: Record<string, string> = {
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

const NAK_GIFT_HI: Record<string, string> = {
  Ashwini: "त्वरित आरोग्य, आरंभ का वरदान",
  Bharani: "सहन और रूपांतर का साहस",
  Krittika: "भ्रम को छेदने वाली अग्नि",
  Rohini: "चुम्बकीय रचनाशीलता और समृद्धि",
  Mrigashira: "कभी न थकने वाला साधक",
  Ardra: "आकाश साफ करने वाला तूफ़ान",
  Punarvasu: "पूर्णता की ओर वापसी",
  Pushya: "आत्मा और परिवार का पोषण",
  Ashlesha: "मानसिक गहराई और सर्प-ज्ञान",
  Magha: "पैतृक गरिमा और सिंहासन",
  "Purva Phalguni": "प्रेम, विश्राम और रचनात्मक आनंद",
  "Uttara Phalguni": "श्रेष्ठ मित्रता और संरक्षण",
  Hasta: "कुशल हाथ और चतुर समाधान",
  Chitra: "उत्कृष्ट कला और रचना-कौशल",
  Swati: "स्वतंत्र, वायुवाहित प्रज्ञा",
  Vishakha: "केंद्रित उद्देश्य और संकल्प",
  Anuradha: "निष्ठावान भक्ति और स्थायी मित्रता",
  Jyeshtha: "ज्येष्ठ साहस और रक्षक शक्ति",
  Mula: "मूल-ज्ञान और दार्शनिक गहराई",
  "Purva Ashadha": "अजेय आशावाद",
  "Uttara Ashadha": "अटल विलंबित विजय",
  Shravana: "श्रवणशील हृदय, पवित्र अध्ययन",
  Dhanishta: "लय, संगीत और समृद्धि",
  Shatabhisha: "सौ चिकित्सकों की रहस्य-औषधि",
  "Purva Bhadrapada": "परिवर्तनकारी अग्नि",
  "Uttara Bhadrapada": "गहन शांति, सागरीय निस्तब्धता",
  Revati: "सभी प्राणियों हेतु करुणामयी पथ-प्रदर्शिका",
};

export const NAK_GIFT_I18N: Record<string, Record<string, string>> = {
  en: NAK_GIFT_EN,
  hi: NAK_GIFT_HI,
};

// ---------------- House themes ----------------

const HOUSE_THEME_EN = [
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

const HOUSE_THEME_HI = [
  "स्वयं, देह और प्रथम प्रभाव",
  "धन, वाणी और मूल परिवार",
  "साहस, भाई-बहन और लघु यात्राएँ",
  "घर, माता और आंतरिक शांति",
  "रचनात्मकता, प्रेम और संतान",
  "सेवा, स्वास्थ्य और दिनचर्या",
  "साझेदारी, विवाह और अनुबंध",
  "परिवर्तन, रहस्य और गुप्त लाभ",
  "धर्म, ज्ञान और दीर्घ तीर्थयात्रा",
  "कर्म, यश और सामाजिक स्थान",
  "लाभ, मित्रता और आकांक्षाएँ",
  "मोक्ष, एकांत और विदेश",
];

export const HOUSE_THEME_I18N: Record<string, string[]> = {
  en: HOUSE_THEME_EN,
  hi: HOUSE_THEME_HI,
};

// ---------------- Gemstones & mantras ----------------

const GEMSTONES_EN: Record<string, string> = {
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

const GEMSTONES_HI: Record<string, string> = {
  Sun: "स्वर्ण में जड़ित माणिक्य (Manik) — अनामिका में धारण करें",
  Moon: "रजत में जड़ित प्राकृतिक मोती (Moti) — कनिष्ठा में धारण करें",
  Mars: "स्वर्ण या ताम्र में जड़ित मूँगा (Moonga) — अनामिका में धारण करें",
  Mercury: "स्वर्ण में जड़ित पन्ना (Panna) — कनिष्ठा में धारण करें",
  Jupiter: "स्वर्ण में जड़ित पुखराज — तर्जनी में धारण करें",
  Venus: "रजत में जड़ित हीरा या सफ़ेद नीलम — मध्यमा में धारण करें",
  Saturn: "रजत में जड़ित नीलम — परीक्षण के पश्चात धारण करें",
  Rahu: "रजत में जड़ित गोमेद — मध्यमा में धारण करें",
  Ketu: "रजत में जड़ित लहसुनिया — अनामिका में धारण करें",
};

export const GEMSTONES_I18N: Record<string, Record<string, string>> = {
  en: GEMSTONES_EN,
  hi: GEMSTONES_HI,
};

// ---------------- Hint tables (for body-area bullets) ----------------

export type HintTable = {
  career: string[];           // length 12
  marriage: string[];         // length 12
  healthDosha: string[];      // length 12
  healthFocus: string[];      // length 12
  luckyColors: string[];      // length 12
  luckyDays: string[];        // length 12
  spirit: Record<string, string>;
  learning: Record<string, string>;
  travel: Record<string, string>;
  finance: { kapha: string; intuition: string; mars: string; default: string };
  love: { soft: string; warm: string; aesthetic: string; default: string };
  remedies: Record<string, string>;
  mantraTransliteration: boolean;
};

const EN_HINTS: HintTable = {
  career: ["leadership and pioneering", "design, finance and luxury", "writing, media and trade", "healing, hospitality and homes",
    "performance, mentorship and royal arts", "research, editing and wellness", "law, diplomacy and aesthetics", "investigation, depth psychology and finance",
    "teaching, philosophy and travel", "administration, real estate and slow industries", "technology, social causes and innovation", "spiritual work, film and oceanic creativity"],
  marriage: ["independent and warm", "patient and aesthetic", "communicative and playful", "deeply nurturing",
    "generous and dignified", "discerning and devoted", "graceful and harmonious", "intense and loyal",
    "philosophical and free-spirited", "ambitious and grounded", "original and humanitarian", "intuitive and gentle"],
  healthDosha: ["pitta", "kapha", "vata", "kapha", "pitta", "vata", "vata", "pitta", "pitta-vata", "vata-kapha", "vata", "kapha"],
  healthFocus: ["the head and eyes", "the throat and neck", "lungs and shoulders", "stomach and chest", "heart and spine", "digestion and intestines",
    "kidneys and lower back", "reproductive system", "hips and liver", "knees and joints", "ankles and circulation", "feet and lymphatic flow"],
  luckyColors: ["Crimson and saffron", "Ivory, soft pink and pastel green", "Mint, silver and turquoise", "Pearl white and silver",
    "Gold and warm orange", "Forest green and earth tones", "Pale blue and rose", "Maroon and deep red",
    "Marigold yellow and bronze", "Indigo and slate", "Sky blue and lavender", "Sea green and amber"],
  luckyDays: ["Tuesday, Sunday", "Friday, Monday", "Wednesday, Friday", "Monday, Thursday", "Sunday, Thursday", "Wednesday, Friday",
    "Friday, Wednesday", "Tuesday, Saturday", "Thursday, Sunday", "Saturday, Wednesday", "Saturday, Friday", "Thursday, Monday"],
  spirit: {
    Sun: "the path of dharma and self-realisation through visible service",
    Moon: "bhakti — devotional surrender through song, water and the divine mother",
    Mars: "karma yoga — fierce, disciplined action offered without attachment",
    Mercury: "jnana yoga — sacred study, inquiry and clear discernment",
    Jupiter: "the guru-shishya path — learning at the feet of a true teacher",
    Venus: "tantric beauty — devotion through art, fragrance, sound and sacred relationship",
    Saturn: "ascetic patience — sustained sadhana, vows and quiet humility",
    Rahu: "unconventional mysticism — esoteric studies that surprise the orthodox",
    Ketu: "raja yoga — meditation, renunciation and the inward gaze",
  },
  learning: {
    Sun: "structured mastery", Moon: "rhythm, repetition and visual memory", Mars: "challenge and competition",
    Mercury: "discussion, writing and lateral connections", Jupiter: "wise mentors and sacred texts",
    Venus: "beauty, art and creative practice", Saturn: "long patient hours and earned depth",
    Rahu: "unconventional, intensive immersion", Ketu: "silent contemplation and pattern-seeing",
  },
  travel: {
    Sun: "transformative — official journeys yield recognition", Moon: "emotional — water and mother-figures call you",
    Mars: "energetic — short, decisive trips bring success", Mercury: "frequent and commerce-rich",
    Jupiter: "pilgrimage-flavoured — temples and teachers", Venus: "luxurious — romantic and aesthetic destinations",
    Saturn: "long and serious — work-related, abroad or remote", Rahu: "foreign and unconventional — distant lands beckon",
    Ketu: "inward — retreats, ashrams and mountain solitudes",
  },
  finance: {
    kapha: "luxury, beauty and refined craft",
    intuition: "intuition, healing and ancestral property",
    mars: "courageous initiative and decisive action",
    default: "patient mastery of a single craft",
  },
  love: {
    soft: "soft, nurturing presence and emotional depth",
    warm: "warm devotion and protective generosity",
    aesthetic: "beauty, romance and steady tenderness",
    default: "thoughtful, quietly loyal companionship",
  },
  remedies: {
    Sun: "Offer water to the Sun at sunrise; chant Aditya Hridayam on Sundays.",
    Moon: "Wear white on Mondays; meditate by moonlight near water.",
    Mars: "Read Hanuman Chalisa on Tuesdays; donate red lentils.",
    Mercury: "Feed green grass to a cow on Wednesdays; chant Vishnu Sahasranama.",
    Jupiter: "Wear yellow on Thursdays; offer turmeric and chana dal at a temple.",
    Venus: "Light a ghee lamp at dusk on Fridays; offer white flowers to Lakshmi.",
    Saturn: "Light a mustard-oil lamp under a peepal tree on Saturdays; serve elders.",
    Rahu: "Donate black sesame; chant Durga Saptashati.",
    Ketu: "Feed stray dogs; meditate in silence at dusk.",
  },
  mantraTransliteration: false,
};

const HI_HINTS: HintTable = {
  career: ["नेतृत्व और अग्रणी कार्य", "डिज़ाइन, वित्त और विलासिता", "लेखन, मीडिया और व्यापार", "चिकित्सा, आतिथ्य और गृह-कार्य",
    "प्रदर्शन, मार्गदर्शन और राजसी कलाएँ", "शोध, संपादन और स्वास्थ्य", "विधि, कूटनीति और सौंदर्यशास्त्र", "अन्वेषण, गहन मनोविज्ञान और वित्त",
    "अध्यापन, दर्शन और यात्रा", "प्रशासन, स्थावर संपत्ति और स्थिर उद्योग", "प्रौद्योगिकी, सामाजिक उद्देश्य और नवाचार", "आध्यात्मिक कार्य, चलचित्र और सागरीय रचनात्मकता"],
  marriage: ["स्वतंत्र और स्नेहमय", "धैर्यवान और सौंदर्यप्रिय", "संवादप्रिय और चंचल", "अत्यंत पोषक",
    "उदार और गरिमामय", "विवेकी और समर्पित", "सौम्य और सामंजस्यपूर्ण", "तीव्र और निष्ठावान",
    "दार्शनिक और स्वच्छंद", "महत्वाकांक्षी और स्थिर", "मौलिक और मानवीय", "अंतर्ज्ञानी और कोमल"],
  healthDosha: ["पित्त", "कफ", "वात", "कफ", "पित्त", "वात", "वात", "पित्त", "पित्त-वात", "वात-कफ", "वात", "कफ"],
  healthFocus: ["सिर और नेत्र", "कंठ और गर्दन", "फेफड़े और कंधे", "उदर और वक्ष", "हृदय और रीढ़", "पाचन और आँतें",
    "वृक्क और कमर", "प्रजनन तंत्र", "कूल्हे और यकृत", "घुटने और जोड़", "टखने और रक्त-संचार", "पैर और लसिका तंत्र"],
  luckyColors: ["सिंदूरी और केसरिया", "हाथीदाँत, हल्का गुलाबी और पस्टेल हरा", "पुदीना, रजत और फ़िरोज़ा", "मोती-सफ़ेद और रजत",
    "स्वर्ण और गर्म नारंगी", "वन हरित और मृदा-वर्ण", "हल्का नीला और गुलाबी", "मरून और गहरा लाल",
    "गेंदा-पीला और कांस्य", "नील और स्लेट", "आकाश-नीला और लैवेंडर", "समुद्री हरा और एम्बर"],
  luckyDays: ["मंगल, रवि", "शुक्र, सोम", "बुध, शुक्र", "सोम, गुरु", "रवि, गुरु", "बुध, शुक्र",
    "शुक्र, बुध", "मंगल, शनि", "गुरु, रवि", "शनि, बुध", "शनि, शुक्र", "गुरु, सोम"],
  spirit: {
    Sun: "दृश्यमान सेवा द्वारा धर्म और आत्म-साक्षात्कार का मार्ग",
    Moon: "भक्ति — गीत, जल और दिव्य माता के माध्यम से समर्पण",
    Mars: "कर्मयोग — निर्भीक, अनुशासित कर्म, फलासक्ति-रहित",
    Mercury: "ज्ञानयोग — पवित्र अध्ययन, जिज्ञासा और स्पष्ट विवेक",
    Jupiter: "गुरु-शिष्य परंपरा — सच्चे गुरु के चरणों में सीखना",
    Venus: "तांत्रिक सौंदर्य — कला, सुगंध, ध्वनि और पवित्र संबंधों द्वारा भक्ति",
    Saturn: "तपस्वी धैर्य — सतत साधना, व्रत और मौन विनम्रता",
    Rahu: "अपरंपरागत रहस्यवाद — गुप्त-विद्या जो प्रचलित को चौंका दे",
    Ketu: "राजयोग — ध्यान, संन्यास और अंतर्मुखी दृष्टि",
  },
  learning: {
    Sun: "संरचित निपुणता", Moon: "लय, पुनरावृत्ति और दृश्य-स्मृति", Mars: "चुनौती और प्रतिस्पर्धा",
    Mercury: "चर्चा, लेखन और पार्श्व-संबंध", Jupiter: "विद्वान गुरु और पवित्र ग्रंथ",
    Venus: "सौंदर्य, कला और रचनात्मक अभ्यास", Saturn: "लंबे, धैर्यवान घंटे और अर्जित गहराई",
    Rahu: "अपरंपरागत, गहन निमज्जन", Ketu: "मौन चिंतन और प्रतिमान-दर्शन",
  },
  travel: {
    Sun: "परिवर्तनकारी — आधिकारिक यात्राएँ सम्मान देती हैं", Moon: "भावनात्मक — जल और मातृ-स्वरूप पुकारते हैं",
    Mars: "ऊर्जावान — संक्षिप्त, निर्णायक यात्राएँ सफलता लाती हैं", Mercury: "अक्सर और व्यापार-समृद्ध",
    Jupiter: "तीर्थ-स्वरूप — मंदिर और गुरु", Venus: "विलासमय — रोमांटिक और सौंदर्यपूर्ण स्थल",
    Saturn: "दीर्घ और गंभीर — कार्य-संबंधी, विदेश या दूरस्थ", Rahu: "विदेशी और असामान्य — दूर देश बुलाते हैं",
    Ketu: "अंतर्मुखी — आश्रम और पर्वतीय एकांत",
  },
  finance: {
    kapha: "विलासिता, सौंदर्य और परिष्कृत शिल्प",
    intuition: "अंतर्ज्ञान, चिकित्सा और पैतृक संपत्ति",
    mars: "साहसी पहल और निर्णायक कर्म",
    default: "एक ही कला में धैर्यपूर्ण निपुणता",
  },
  love: {
    soft: "कोमल, पोषक उपस्थिति और भावनात्मक गहराई",
    warm: "उष्ण समर्पण और रक्षात्मक उदारता",
    aesthetic: "सौंदर्य, रोमांस और स्थिर कोमलता",
    default: "विचारशील, मौन-निष्ठावान साहचर्य",
  },
  remedies: {
    Sun: "रविवार को सूर्योदय पर सूर्य को अर्घ्य दें; आदित्य हृदय स्तोत्र का पाठ करें।",
    Moon: "सोमवार को श्वेत वस्त्र धारण करें; जल के निकट चंद्र-प्रकाश में ध्यान करें।",
    Mars: "मंगलवार को हनुमान चालीसा का पाठ करें; मसूर दाल का दान करें।",
    Mercury: "बुधवार को गाय को हरी घास खिलाएँ; विष्णु सहस्रनाम का पाठ करें।",
    Jupiter: "गुरुवार को पीत वस्त्र धारण करें; मंदिर में हल्दी एवं चना दाल अर्पित करें।",
    Venus: "शुक्रवार को संध्या समय घी का दीप जलाएँ; लक्ष्मी जी को श्वेत पुष्प अर्पित करें।",
    Saturn: "शनिवार को पीपल वृक्ष के नीचे सरसों तेल का दीप जलाएँ; वृद्धजनों की सेवा करें।",
    Rahu: "काले तिल का दान करें; दुर्गा सप्तशती का पाठ करें।",
    Ketu: "स्वान को भोजन कराएँ; संध्या में मौन ध्यान करें।",
  },
  mantraTransliteration: false,
};

export const HINTS_I18N: Record<string, HintTable> = {
  en: EN_HINTS,
  hi: HI_HINTS,
};

// ---------------- Full-sentence templates ----------------

export interface SentenceBuilder {
  overview: (a: { lagna: string; lagnaTrait: string; moonSign: string; moonTrait: string; sunSign: string; sunTrait: string; nakshatra: string; pada: number; nakLord: string; nakGift: string }) => string;
  personality: (a: { lagna: string; lagnaTrait: string; moonSign: string; moonTrait: string; nakshatra: string; nakGift: string }) => string[];
  career: (a: { dashaLord: string; dashaText: string; lagnaLord: string; careerArea: string }) => string[];
  finance: (a: { financeArea: string }) => string[];
  love: (a: { loveStyle: string }) => string[];
  marriage: (a: { partnerTrait: string }) => string[];
  health: (a: { dosha: string; focus: string; dashaLord: string }) => string[];
  family: () => string[];
  spiritual: (a: { spiritPath: string }) => string[];
  education: (a: { learningStyle: string }) => string[];
  travel: (a: { dashaLord: string; travelStyle: string }) => string[];
  yearAhead: () => string[];
  dashaNow: (a: { dashaLord: string; from: number; to: number; dashaText: string }) => string;
  planetEssence: (a: { dignityTag: string; ordinalHouse: string; houseTheme: string }) => string;
  dignityTags: { Exalted: string; Debilitated: string; OwnSign: string; Shadow: string; Neutral: string };
  ordinal: (n: number) => string;
  remediesExtra: string[];
}

const EN: SentenceBuilder = {
  overview: (a) =>
    `Your chart rises in ${a.lagna}, lending you ${a.lagnaTrait}. The Moon — your inner ` +
    `landscape — rests in ${a.moonSign}, weaving ${a.moonTrait}. The Sun, your dharmic axis, sits ` +
    `in ${a.sunSign}, asking you to embody ${a.sunTrait}. You were born under ${a.nakshatra} ` +
    `nakshatra (pada ${a.pada}), ruled by ${a.nakLord}, which gifts you ${a.nakGift}.`,
  personality: (a) => [
    `From your Lagna in ${a.lagna}, you meet the world with ${a.lagnaTrait}. Others perceive you as composed, intentional, and quietly luminous.`,
    `Your Moon in ${a.moonSign} colours your private world with ${a.moonTrait}. In solitude you return to a steady, almost ancestral rhythm.`,
    `Born in ${a.nakshatra}, you carry ${a.nakGift}. This is your subtle signature — the quality friends remember long after a conversation ends.`,
  ],
  career: (a) => [
    `With the ${a.dashaLord} Mahadasha active, your professional life enters ${a.dashaText}`,
    `Roles aligned to ${a.lagnaLord} energies — work involving ${a.careerArea} — will feel natural and rewarding.`,
    `Avoid forcing growth in the first quarter of any new venture; the second half of the year carries stronger karmic momentum for visibility and promotion.`,
  ],
  finance: (a) => [
    `Wealth flows steadily through ${a.financeArea}. Avoid speculative ventures during Saturn's transit over your 8th house.`,
    `Long-term, sattvic investments — land, gold, education, sacred art — multiply gracefully.`,
    `Keep a portion of every earning for dāna (giving). Charity opens unseen channels of return.`,
  ],
  love: (a) => [
    `In love you offer ${a.loveStyle}. You long for a partner who can meet your silence as well as your laughter.`,
    `Venus in your chart asks you to choose with intention rather than urgency.`,
    `Honest conversation, not perfection, is the true gemstone of your relationships.`,
  ],
  marriage: (a) => [
    `Marriage indicators suggest a partner who is ${a.partnerTrait}.`,
    `The 7th house guidance favours unions formed after age 26, with deeper harmony unfolding gradually.`,
    `Annual rituals together — a yearly pilgrimage or shared fast — will quietly strengthen the bond.`,
  ],
  health: (a) => [
    `Your constitution leans ${a.dosha}. Pay loving attention to ${a.focus}.`,
    `Daily pranayama (Anulom-Vilom and Bhramari) balances your nervous system beautifully.`,
    `Sleep before 11 pm during ${a.dashaLord} dasha — your body restores fastest then.`,
  ],
  family: () => [
    `Family is a temple in your chart. Your mother's blessings carry extraordinary weight in this lifetime.`,
    `Children, when they arrive, are likely to be artistic, sensitive, and spiritually inclined.`,
    `Maintain a small altar dedicated to your kuldevta — it harmonises generational karma.`,
  ],
  spiritual: (a) => [
    `Your spiritual path is ${a.spiritPath}. Approach it with regularity rather than intensity.`,
    `Mantra japa with a tulsi or rudraksha mala for 11 minutes daily quietly rewires your subtle body.`,
    `Visit a flowing river or ancient temple once a year — your soul measures time in pilgrimages.`,
  ],
  education: (a) => [
    `Your mind grasps best through ${a.learningStyle}.`,
    `Periods between ages 18–24 and 32–36 are especially fertile for higher studies and certifications.`,
    `Teaching what you learn — even informally — accelerates your own mastery tenfold.`,
  ],
  travel: (a) => [
    `Travel during ${a.dashaLord} dasha tends to be ${a.travelStyle}.`,
    `Eastward and northward journeys carry the strongest karmic openings.`,
    `Pilgrimages — Kashi, Tirupati, Kedarnath, or a sacred site personal to your lineage — bring lasting peace.`,
  ],
  yearAhead: () => [
    `The coming twelve months emphasise inner clarity over outer noise. A relationship, a project, or a place that has quietly drained you will gently release.`,
    `Between months 4 and 7, an opportunity arrives through someone older or more experienced — say yes slowly, but say yes.`,
    `By the year's end, a new daily practice (writing, walking, chanting) will have reshaped your inner life more than any external event.`,
  ],
  dashaNow: (a) =>
    `You are presently in the ${a.dashaLord} Mahadasha (${Math.floor(a.from)} – ${Math.floor(a.to)}). This is ${a.dashaText} Honour its themes; resist resisting it.`,
  planetEssence: (a) => `${a.dignityTag} in the ${a.ordinalHouse} house of ${a.houseTheme}.`,
  dignityTags: {
    Exalted: "shines exalted", Debilitated: "feels tender", OwnSign: "stands in its own seat",
    Shadow: "casts its karmic shadow", Neutral: "moves comfortably",
  },
  ordinal: (n) => {
    const s = ["th", "st", "nd", "rd"]; const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },
  remediesExtra: [
    "Begin each day with three slow breaths and one moment of gratitude.",
    "Keep a small altar at home — a flame, a flower, a sacred sound.",
  ],
};

const HI: SentenceBuilder = {
  overview: (a) =>
    `आपका लग्न ${a.lagna} में उदित है, जो आपको ${a.lagnaTrait} प्रदान करता है। चंद्र — आपका ` +
    `आंतरिक संसार — ${a.moonSign} में विराजित है, ${a.moonTrait} बुनता हुआ। सूर्य, आपका धर्म-अक्ष, ` +
    `${a.sunSign} में स्थित है, और आपसे ${a.sunTrait} को मूर्त करने का आग्रह करता है। आपका जन्म ` +
    `${a.nakshatra} नक्षत्र (पाद ${a.pada}) में हुआ, जिसके स्वामी ${a.nakLord} हैं, और जो आपको ${a.nakGift} का वरदान देता है।`,
  personality: (a) => [
    `${a.lagna} लग्न से आप संसार से ${a.lagnaTrait} के साथ मिलते हैं। दूसरे आपको संयत, उद्देश्यपूर्ण और मौन रूप से दीप्तिमान देखते हैं।`,
    `${a.moonSign} में स्थित चंद्र आपके निजी संसार को ${a.moonTrait} से रंगता है। एकांत में आप एक स्थिर, लगभग पैतृक लय में लौट आते हैं।`,
    `${a.nakshatra} में जन्मे आप ${a.nakGift} धारण करते हैं। यह आपका सूक्ष्म हस्ताक्षर है — वह गुण जो वार्तालाप समाप्त होने के बाद भी मित्रों को स्मरण रहता है।`,
  ],
  career: (a) => [
    `${a.dashaLord} महादशा सक्रिय होने से आपका व्यावसायिक जीवन ${a.dashaText}`,
    `${a.lagnaLord} ऊर्जाओं से संरेखित भूमिकाएँ — ${a.careerArea} से जुड़े कार्य — स्वाभाविक और संतुष्टिदायक प्रतीत होंगी।`,
    `किसी भी नए उद्यम की प्रथम तिमाही में वृद्धि को बल पूर्वक न लाएँ; वर्ष का उत्तरार्ध दृश्यता और पदोन्नति हेतु अधिक कर्म-वेग रखता है।`,
  ],
  finance: (a) => [
    `धन ${a.financeArea} के माध्यम से स्थिर रूप से प्रवाहित होता है। आपके अष्टम भाव पर शनि के गोचर के समय सट्टा-आधारित उद्यमों से बचें।`,
    `दीर्घ-कालिक, सात्विक निवेश — भूमि, स्वर्ण, शिक्षा, पवित्र कला — सहजता से बढ़ते हैं।`,
    `प्रत्येक आय का एक अंश दान हेतु रखें। दान अदृश्य प्रत्यागमन के द्वार खोलता है।`,
  ],
  love: (a) => [
    `प्रेम में आप ${a.loveStyle} प्रदान करते हैं। आप ऐसे साथी की कामना करते हैं जो आपके मौन को भी उतने ही प्रेम से सुने जितना आपकी हँसी को।`,
    `आपकी कुंडली में शुक्र आपसे आग्रह करता है कि चुनाव त्वरा से नहीं, उद्देश्य से करें।`,
    `पूर्णता नहीं, सच्चा संवाद ही आपके संबंधों का असली रत्न है।`,
  ],
  marriage: (a) => [
    `विवाह-संकेत ऐसे जीवनसाथी की ओर इंगित करते हैं जो ${a.partnerTrait} हो।`,
    `सप्तम भाव के अनुसार 26 वर्ष की आयु के पश्चात होने वाले विवाह में गहन सामंजस्य धीरे-धीरे प्रकट होता है।`,
    `साथ में वार्षिक अनुष्ठान — एक तीर्थयात्रा अथवा संयुक्त व्रत — मौन रूप से बंधन को सुदृढ़ करते हैं।`,
  ],
  health: (a) => [
    `आपकी प्रकृति ${a.dosha} प्रधान है। ${a.focus} पर स्नेहपूर्ण ध्यान दें।`,
    `दैनिक प्राणायाम (अनुलोम-विलोम और भ्रामरी) आपके स्नायु-तंत्र को सुंदरता से संतुलित करता है।`,
    `${a.dashaLord} दशा में 11 बजे से पूर्व निद्रा लें — इस समय आपकी देह सर्वाधिक शीघ्र पुनरुज्जीवित होती है।`,
  ],
  family: () => [
    `आपकी कुंडली में परिवार एक मंदिर है। माता का आशीर्वाद इस जीवन में असाधारण भार वहन करता है।`,
    `संतान, जब आती है, संभवतः कलाप्रिय, संवेदनशील और आध्यात्मिक प्रवृत्ति की होगी।`,
    `घर में अपने कुलदेवता को समर्पित एक छोटा सा पूजा-स्थल बनाए रखें — यह पीढ़ीगत कर्म को संतुलित करता है।`,
  ],
  spiritual: (a) => [
    `आपका आध्यात्मिक पथ ${a.spiritPath} है। इसे तीव्रता से नहीं, नियमितता से अपनाएँ।`,
    `तुलसी अथवा रुद्राक्ष माला से प्रतिदिन 11 मिनट का मंत्र-जप मौन रूप से आपकी सूक्ष्म देह को पुनः रचित करता है।`,
    `वर्ष में एक बार किसी प्रवाहमान नदी अथवा प्राचीन मंदिर में जाएँ — आपकी आत्मा समय को तीर्थयात्राओं से मापती है।`,
  ],
  education: (a) => [
    `आपका मन ${a.learningStyle} के माध्यम से सर्वोत्तम ग्रहण करता है।`,
    `18–24 और 32–36 वर्ष की आयु के बीच के काल विशेष रूप से उच्च-शिक्षा एवं प्रमाण-पत्रों के लिए उपजाऊ हैं।`,
    `जो आप सीखते हैं उसे — अनौपचारिक रूप से भी — पढ़ाना आपकी अपनी निपुणता को दस गुना बढ़ाता है।`,
  ],
  travel: (a) => [
    `${a.dashaLord} दशा के दौरान यात्रा ${a.travelStyle} होती है।`,
    `पूर्व और उत्तर दिशा की यात्राएँ सर्वाधिक कर्म-द्वार खोलती हैं।`,
    `तीर्थयात्राएँ — काशी, तिरुपति, केदारनाथ, अथवा आपके कुल से जुड़ा कोई पवित्र स्थान — स्थायी शांति प्रदान करती हैं।`,
  ],
  yearAhead: () => [
    `आगामी बारह माह बाह्य कोलाहल से अधिक आंतरिक स्पष्टता पर बल देते हैं। एक संबंध, एक परियोजना, अथवा एक स्थान जो आपको मौन रूप से थका रहा था, सहजता से छूट जाएगा।`,
    `चौथे और सातवें माह के बीच किसी वरिष्ठ अथवा अनुभवी व्यक्ति के माध्यम से एक अवसर आता है — धीरे-धीरे हाँ कहें, परंतु हाँ कहें।`,
    `वर्षांत तक एक नई दैनिक साधना (लेखन, भ्रमण, जप) आपके आंतरिक जीवन को किसी भी बाह्य घटना से अधिक नव-रूप दे देगी।`,
  ],
  dashaNow: (a) =>
    `आप वर्तमान में ${a.dashaLord} महादशा (${Math.floor(a.from)} – ${Math.floor(a.to)}) में हैं। यह ${a.dashaText} इसके विषयों का आदर करें; इसका विरोध न करें।`,
  planetEssence: (a) => `${a.ordinalHouse} भाव — ${a.houseTheme} — में ${a.dignityTag}।`,
  dignityTags: {
    Exalted: "उच्च होकर प्रकाशमान है", Debilitated: "कोमल अनुभव करता है", OwnSign: "अपने स्वगृह में स्थित है",
    Shadow: "अपनी कर्मिक छाया डालता है", Neutral: "सहजता से गति करता है",
  },
  ordinal: (n) => `${n}वें`,
  remediesExtra: [
    "प्रत्येक दिन का आरंभ तीन धीमी श्वासों और एक क्षण की कृतज्ञता से करें।",
    "घर में एक छोटा पूजा-स्थल रखें — एक दीप, एक पुष्प, एक पवित्र ध्वनि।",
  ],
};

export const SENTENCES_I18N: Record<string, SentenceBuilder> = {
  en: EN,
  hi: HI,
};

export function getSentences(lang: string): SentenceBuilder {
  return SENTENCES_I18N[lang] ?? SENTENCES_I18N.en;
}

export function getHints(lang: string): HintTable {
  return HINTS_I18N[lang] ?? HINTS_I18N.en;
}

// Helper used by the route to localise the planet "essence" sentences after compute()
export function localizePlanetEssences(
  planets: { name: string; sign: number; house: number; dignity: string }[],
  langCode: string,
): string[] {
  const lang = isSupportedLang(langCode) ? langCode : "en";
  const s = getSentences(lang);
  const houseTheme = HOUSE_THEME_I18N[lang] ?? HOUSE_THEME_I18N.en;
  return planets.map((p) => {
    const dignityTag =
      p.dignity === "Exalted" ? s.dignityTags.Exalted :
      p.dignity === "Debilitated" ? s.dignityTags.Debilitated :
      p.dignity === "Own sign" ? s.dignityTags.OwnSign :
      p.dignity === "Shadow" ? s.dignityTags.Shadow :
      s.dignityTags.Neutral;
    return s.planetEssence({
      dignityTag,
      ordinalHouse: s.ordinal(p.house),
      houseTheme: houseTheme[p.house - 1],
    });
  });
}

// Re-export raw rashi/nakshatra lists in case other modules need them
export { RASHIS, NAKSHATRAS, RASHI_LORDS };

// ---------------- Pack registry ----------------

export interface LangPack {
  code: string;
  label: string;
  rashiTraits: Record<string, string>;
  dasha: Record<string, string>;
  nakGift: Record<string, string>;
  houseTheme: string[];
  gemstones: Record<string, string>;
  hints: HintTable;
  sentences: SentenceBuilder;
}

export function registerLangPack(p: LangPack): void {
  if (SUPPORTED.some((s) => s.code === p.code)) return;
  SUPPORTED.push({ code: p.code, label: p.label });
  RASHI_TRAITS_I18N[p.code] = p.rashiTraits;
  DASHA_NARRATIVE_I18N[p.code] = p.dasha;
  NAK_GIFT_I18N[p.code] = p.nakGift;
  HOUSE_THEME_I18N[p.code] = p.houseTheme;
  GEMSTONES_I18N[p.code] = p.gemstones;
  HINTS_I18N[p.code] = p.hints;
  SENTENCES_I18N[p.code] = p.sentences;
}