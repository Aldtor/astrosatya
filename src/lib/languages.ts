// Languages of India — the 22 official languages in the 8th Schedule,
// plus English. Each entry has native script, English label, and a
// short greeting / sign-off used to localise the reading.

export interface Language {
  code: string;       // ISO-like code
  english: string;    // English name
  native: string;     // name in its own script
  greeting: string;   // "Namaste"-equivalent in script
  blessing: string;   // short blessing line in script
}

export const LANGUAGES: Language[] = [
  { code: "en", english: "English",   native: "English",    greeting: "Namaste",   blessing: "May your path be filled with light." },
  { code: "hi", english: "Hindi",     native: "हिन्दी",       greeting: "नमस्ते",      blessing: "आपका मार्ग प्रकाश से भरा हो।" },
  { code: "bn", english: "Bengali",   native: "বাংলা",         greeting: "নমস্কার",    blessing: "আপনার পথ আলোয় ভরে উঠুক।" },
  { code: "mr", english: "Marathi",   native: "मराठी",        greeting: "नमस्कार",     blessing: "तुमचा मार्ग प्रकाशाने उजळो." },
  { code: "te", english: "Telugu",    native: "తెలుగు",         greeting: "నమస్కారం",   blessing: "మీ మార్గం వెలుగుతో నిండుగాక." },
  { code: "ta", english: "Tamil",     native: "தமிழ்",          greeting: "வணக்கம்",     blessing: "உங்கள் பாதை ஒளியால் நிறையட்டும்." },
  { code: "gu", english: "Gujarati",  native: "ગુજરાતી",        greeting: "નમસ્તે",      blessing: "તમારો માર્ગ પ્રકાશથી ભરપૂર રહે." },
  { code: "kn", english: "Kannada",   native: "ಕನ್ನಡ",          greeting: "ನಮಸ್ಕಾರ",      blessing: "ನಿಮ್ಮ ಮಾರ್ಗ ಬೆಳಕಿನಿಂದ ತುಂಬಿರಲಿ." },
  { code: "ml", english: "Malayalam", native: "മലയാളം",         greeting: "നമസ്കാരം",   blessing: "നിങ്ങളുടെ വഴി പ്രകാശത്താൽ നിറയട്ടെ." },
  { code: "or", english: "Odia",      native: "ଓଡ଼ିଆ",          greeting: "ନମସ୍କାର",    blessing: "ଆପଣଙ୍କ ପଥ ଆଲୋକରେ ଭରପୂର ହେଉ।" },
  { code: "pa", english: "Punjabi",   native: "ਪੰਜਾਬੀ",         greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", blessing: "ਤੁਹਾਡਾ ਰਸਤਾ ਚਾਨਣ ਨਾਲ ਭਰਿਆ ਰਹੇ।" },
  { code: "ur", english: "Urdu",      native: "اُردُو",         greeting: "السلام علیکم", blessing: "آپ کا راستہ روشنی سے بھرا رہے۔" },
  { code: "as", english: "Assamese",  native: "অসমীয়া",         greeting: "নমস্কাৰ",    blessing: "আপোনাৰ পথ পোহৰেৰে ভৰি থাকক।" },
  { code: "sa", english: "Sanskrit",  native: "संस्कृतम्",      greeting: "नमस्ते",     blessing: "तव मार्गः प्रकाशेन पूर्णः भवतु।" },
  { code: "ks", english: "Kashmiri",  native: "کٲشُر",          greeting: "آداب",       blessing: "تہٕنز راہ نوریَن سان بھرکھ۔" },
  { code: "sd", english: "Sindhi",    native: "سنڌي",           greeting: "آداب",       blessing: "اوهان جو رستو روشني سان ڀريل هجي." },
  { code: "ne", english: "Nepali",    native: "नेपाली",        greeting: "नमस्ते",     blessing: "तपाईंको बाटो उज्यालोले भरिएको होस्।" },
  { code: "kok", english: "Konkani",  native: "कोंकणी",        greeting: "नमस्कार",    blessing: "तुमचो मार्ग उजवाडान भरून पडो." },
  { code: "mai", english: "Maithili", native: "मैथिली",        greeting: "प्रणाम",     blessing: "अहाँक बाट प्रकाशसँ भरल रहए।" },
  { code: "doi", english: "Dogri",    native: "डोगरी",         greeting: "जय माता दी",  blessing: "तुहाडा रस्ता चानन कन्नै भरेआ रौह्ये।" },
  { code: "mni", english: "Manipuri", native: "মৈতৈলোন্",       greeting: "খুরুমজরি",    blessing: "নহাক্কী লম্বী অসি মঙালনা থল্লসনু।" },
  { code: "brx", english: "Bodo",     native: "बर'",           greeting: "जोहार",       blessing: "नोंथांनि लामायाव सोरांआव बोरै थानाय जायो।" },
  { code: "sat", english: "Santali",  native: "ᱥᱟᱱᱛᱟᱲᱤ",        greeting: "ᱡᱳᱦᱟᱨ",         blessing: "ᱟᱢᱟᱜ ᱦᱳᱨ ᱫᱷᱳ ᱢᱟᱨᱥᱟᱞ ᱛᱮ ᱯᱮᱨᱮᱡᱳᱜ ᱢᱟ᱾" },
];

export function findLanguage(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}