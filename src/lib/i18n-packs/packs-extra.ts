// Additional language packs for the 8th Schedule languages that share a
// script (and often a high degree of lexical overlap) with an existing pack.
// Each entry is registered with its own ISO code and a native-script label,
// and reuses the data tables of its closest sibling pack so readings render
// in a familiar script for the reader. Where the language has a distinctive
// signature phrase (e.g. Nepali honorific verb endings), the overview /
// dashaNow sentences are lightly customised below.

import { registerLangPack, type LangPack, type SentenceBuilder } from "../kundli-i18n";
import { BN, MR } from "./register";
import { UR } from "./packs-ur-or-as";

// We re-import HI indirectly: kundli-i18n already registers HI as the base
// English/Hindi sentences, but for cloning we need the full LangPack shape.
// Build it from the public registries.
import {
  RASHI_TRAITS_I18N, DASHA_NARRATIVE_I18N, NAK_GIFT_I18N,
  HOUSE_THEME_I18N, GEMSTONES_I18N,
} from "../kundli-i18n";
import { HINTS_I18N, SENTENCES_I18N } from "../kundli-i18n";

const HI: LangPack = {
  code: "hi",
  label: "हिन्दी (Hindi)",
  rashiTraits: RASHI_TRAITS_I18N.hi,
  dasha: DASHA_NARRATIVE_I18N.hi,
  nakGift: NAK_GIFT_I18N.hi,
  houseTheme: HOUSE_THEME_I18N.hi,
  gemstones: GEMSTONES_I18N.hi,
  hints: HINTS_I18N.hi,
  sentences: SENTENCES_I18N.hi,
};

// ----------------------------------------------------------------------
// Nepali (ne) — Devanagari, very close to Hindi with honorific verb forms.
// ----------------------------------------------------------------------
const neSentences: SentenceBuilder = {
  ...HI.sentences,
  overview: (a) =>
    `तपाईंको लग्न ${a.lagna} मा उदय भएको छ, जसले तपाईंलाई ${a.lagnaTrait} प्रदान गर्छ। ` +
    `चन्द्रमा — तपाईंको आन्तरिक संसार — ${a.moonSign} मा विराजमान छ, ${a.moonTrait} बुन्दै। ` +
    `सूर्य, तपाईंको धर्म-अक्ष, ${a.sunSign} मा स्थित छ र तपाईंलाई ${a.sunTrait} मूर्त गर्न आह्वान गर्छ। ` +
    `तपाईंको जन्म ${a.nakshatra} नक्षत्र (पाद ${a.pada}) मा भएको छ, स्वामी ${a.nakLord}, जसले तपाईंलाई ${a.nakGift} दिन्छ।`,
  dashaNow: (a) =>
    `तपाईं हाल ${a.dashaLord} महादशा (${Math.floor(a.from)} – ${Math.floor(a.to)}) मा हुनुहुन्छ। यो ${a.dashaText} यसका विषयलाई आदर गर्नुहोस्।`,
};
const NE: LangPack = { ...HI, code: "ne", label: "नेपाली (Nepali)", sentences: neSentences };

// ----------------------------------------------------------------------
// Maithili (mai) — Devanagari, closely related to Hindi.
// ----------------------------------------------------------------------
const maiSentences: SentenceBuilder = {
  ...HI.sentences,
  overview: (a) =>
    `अहाँक लग्न ${a.lagna} मे उदित अछि, जे अहाँकेँ ${a.lagnaTrait} प्रदान करैत अछि। ` +
    `चन्द्रमा — अहाँक आन्तरिक संसार — ${a.moonSign} मे विराजमान अछि, ${a.moonTrait} बुनैत। ` +
    `सूर्य, अहाँक धर्म-अक्ष, ${a.sunSign} मे स्थित अछि आ अहाँकेँ ${a.sunTrait} सँ युक्त हेबाक आह्वान करैत अछि। ` +
    `अहाँक जन्म ${a.nakshatra} नक्षत्र (पाद ${a.pada}) मे भेल अछि, स्वामी ${a.nakLord}, जे अहाँकेँ ${a.nakGift} दैत अछि।`,
  dashaNow: (a) =>
    `अहाँ एखन ${a.dashaLord} महादशा (${Math.floor(a.from)} – ${Math.floor(a.to)}) मे छी। ई ${a.dashaText} एकर भावनासभक आदर करू।`,
};
const MAI: LangPack = { ...HI, code: "mai", label: "मैथिली (Maithili)", sentences: maiSentences };

// ----------------------------------------------------------------------
// Dogri (doi) — Devanagari, Indo-Aryan close to Hindi.
// ----------------------------------------------------------------------
const doiSentences: SentenceBuilder = {
  ...HI.sentences,
  overview: (a) =>
    `तुंदा लग्न ${a.lagna} च उदय होआ है, जेह्ड़ा तुसेंगी ${a.lagnaTrait} दिंदा है। ` +
    `चंद्रमा — तुंदा अंदरूनी संसार — ${a.moonSign} च विराजमान है, ${a.moonTrait} बुनदा होया। ` +
    `सूर्य, तुंदा धर्म-अक्ष, ${a.sunSign} च स्थित है ते तुसेंगी ${a.sunTrait} मूर्त करने दा सद्दा दिंदा है। ` +
    `तुंदा जन्म ${a.nakshatra} नक्षत्र (पाद ${a.pada}) च होआ है, स्वामी ${a.nakLord}, जेह्ड़ा तुसेंगी ${a.nakGift} दिंदा है।`,
  dashaNow: (a) =>
    `तुस हून ${a.dashaLord} महादशा (${Math.floor(a.from)} – ${Math.floor(a.to)}) च ओ। एह् ${a.dashaText} इसदे भावें दा आदर करो।`,
};
const DOI: LangPack = { ...HI, code: "doi", label: "डोगरी (Dogri)", sentences: doiSentences };

// ----------------------------------------------------------------------
// Bodo (brx) — Devanagari script, Tibeto-Burman.
// ----------------------------------------------------------------------
const brxSentences: SentenceBuilder = {
  ...HI.sentences,
  overview: (a) =>
    `नोंथांनि लग्न ${a.lagna} आव सानफ्रोम जायो, जायनि गुबुन नोंथांनो ${a.lagnaTrait} होयो। ` +
    `ओखाफोर — नोंथांनि सिङाव — ${a.moonSign} आव थायो, ${a.moonTrait} बानायदों। ` +
    `सान, नोंथांनि धर्म-अक्ष, ${a.sunSign} आव दं आरो नोंथांनो ${a.sunTrait} सोमाव होनो लिरदों। ` +
    `नोंथांनि जोनोम ${a.nakshatra} नक्षत्र (पाद ${a.pada}) आव जाबाय, स्वामी ${a.nakLord}, जायनो नोंथांनो ${a.nakGift} होयो।`,
  dashaNow: (a) =>
    `नोंथां दानो ${a.dashaLord} महादशा (${Math.floor(a.from)} – ${Math.floor(a.to)}) आव दं। बेयो ${a.dashaText}`,
};
const BRX: LangPack = { ...HI, code: "brx", label: "बर' (Bodo)", sentences: brxSentences };

// ----------------------------------------------------------------------
// Santali (sat) — usually written in Ol Chiki; readers commonly also use
// Devanagari. We surface a Devanagari-script reading with native greetings.
// ----------------------------------------------------------------------
const satSentences: SentenceBuilder = {
  ...HI.sentences,
  overview: (a) =>
    `आमाक् लग्न ${a.lagna} रे उदित ए, जे आमाक् ${a.lagnaTrait} एमाद्-आ। ` +
    `चान्दो — आमाक् भितरीच जगत् — ${a.moonSign} रे ठाव-आकाना, ${a.moonTrait} तायोम् कान-आ। ` +
    `सिङ्गी, आमाक् धर्म-अक्ष, ${a.sunSign} रे मेनाक्-आ, आमाक् ${a.sunTrait} सोरकार लागित् सेटेर-कान-आ। ` +
    `आमाक् जोनोम् ${a.nakshatra} नक्षत्र (पाद ${a.pada}) रे, स्वामी ${a.nakLord}, ओका आमाक् ${a.nakGift} एमाद्-आ।`,
  dashaNow: (a) =>
    `आम् नित् ${a.dashaLord} महादशा (${Math.floor(a.from)} – ${Math.floor(a.to)}) रे मेनाम्-आ। नोवा ${a.dashaText}`,
};
const SAT: LangPack = { ...HI, code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)", sentences: satSentences };

// ----------------------------------------------------------------------
// Konkani (kok) — Devanagari, closely related to Marathi.
// ----------------------------------------------------------------------
const kokSentences: SentenceBuilder = {
  ...MR.sentences,
  overview: (a) =>
    `तुमचो लग्न ${a.lagna} न उदय जाता, जो तुमकां ${a.lagnaTrait} दिता. ` +
    `चंद्र — तुमचो आंतरीक संवसार — ${a.moonSign} न विराजमान आसा, ${a.moonTrait} गुंथतलो. ` +
    `सूर्य, तुमचो धर्म-अक्ष, ${a.sunSign} न आसता आनी तुमकां ${a.sunTrait} मूर्त करपाक उलो दिता. ` +
    `तुमचो जल्म ${a.nakshatra} नक्षत्र (पाद ${a.pada}) न जाला, स्वामी ${a.nakLord}, जो तुमकां ${a.nakGift} दिता.`,
  dashaNow: (a) =>
    `तुमी आतां ${a.dashaLord} महादशा (${Math.floor(a.from)} – ${Math.floor(a.to)}) न आसात. ही ${a.dashaText}`,
};
const KOK: LangPack = { ...MR, code: "kok", label: "कोंकणी (Konkani)", sentences: kokSentences };

// ----------------------------------------------------------------------
// Manipuri / Meitei (mni) — Bengali script is common alongside Meetei Mayek.
// ----------------------------------------------------------------------
const mniSentences: SentenceBuilder = {
  ...BN.sentences,
  overview: (a) =>
    `অদোম্গী লগ্ন ${a.lagna} দা ৱাকৎলক্লি, মদুনা অদোম্বু ${a.lagnaTrait} পীবিরি। ` +
    `থা — অদোম্গী থম্মোয়গী মালেম্ — ${a.moonSign} দা লৈরি, ${a.moonTrait} সেমদুনা। ` +
    `নুমিৎ, অদোম্গী ধর্ম-অক্ষ, ${a.sunSign} দা লৈরি অমসুং অদোম্বু ${a.sunTrait} উৎনবা কৌবিরি। ` +
    `অদোম্গী পোক্পা ${a.nakshatra} নক্ষত্র (পাদ ${a.pada}) দা ওইবা, মপু ${a.nakLord}, মদুনা অদোম্বু ${a.nakGift} পীবিরি।`,
  dashaNow: (a) =>
    `অদোম হৌজিক ${a.dashaLord} মহাদশা (${Math.floor(a.from)} – ${Math.floor(a.to)}) দা লৈরি। মসিদি ${a.dashaText}`,
};
const MNI: LangPack = { ...BN, code: "mni", label: "মৈতৈলোন্ (Manipuri)", sentences: mniSentences };

// ----------------------------------------------------------------------
// Kashmiri (ks) — Perso-Arabic script, shares vocabulary with Urdu.
// ----------------------------------------------------------------------
const ksSentences: SentenceBuilder = {
  ...UR.sentences,
  overview: (a) =>
    `تُہنٛد لگن ${a.lagna} منٛز اوٚدِت چھُ، یُس تہٕ ${a.lagnaTrait} دِوان چھُ۔ ` +
    `زۆن — تُہنٛد انٛدرِم جہان — ${a.moonSign} منٛز چھُ، ${a.moonTrait} وٚنان چھُ۔ ` +
    `آفتاب، تُہنٛد دھرم محور، ${a.sunSign} منٛز چھُ، تہٕ تہٕ ${a.sunTrait} مَخسوس کرنہٕ خٲطرٕ سادان چھُ۔ ` +
    `تُہنٛد جنم ${a.nakshatra} نکشتر (پاد ${a.pada}) منٛز آو، مٲلِک ${a.nakLord}، یُس تہٕ ${a.nakGift} دِوان چھُ۔`,
  dashaNow: (a) =>
    `توٚہیہٕ چھِو وَنہِ ${a.dashaLord} مہادشا (${Math.floor(a.from)} – ${Math.floor(a.to)}) منٛز۔ یہٕ چھُ ${a.dashaText}`,
};
const KS: LangPack = { ...UR, code: "ks", label: "کٲشُر (Kashmiri)", sentences: ksSentences };

// ----------------------------------------------------------------------
// Sindhi (sd) — Perso-Arabic script (India), shares vocabulary with Urdu.
// ----------------------------------------------------------------------
const sdSentences: SentenceBuilder = {
  ...UR.sentences,
  overview: (a) =>
    `اوهان جو لگن ${a.lagna} ۾ اڀري ٿو، جيڪو اوهان کي ${a.lagnaTrait} ڏئي ٿو. ` +
    `چنڊ — اوهان جو اندرين جهان — ${a.moonSign} ۾ آهي، ${a.moonTrait} اڻي رهيو آهي. ` +
    `سج، اوهان جو ڌرم محور، ${a.sunSign} ۾ آهي ۽ اوهان کان ${a.sunTrait} کي مجسم ڪرڻ جي طلب ڪري ٿو. ` +
    `اوهان جو جنم ${a.nakshatra} نڪشتر (پاد ${a.pada}) ۾ ٿيو، جنهن جو مالڪ ${a.nakLord} آهي، جيڪو اوهان کي ${a.nakGift} عطا ڪري ٿو.`,
  dashaNow: (a) =>
    `اوهان هن وقت ${a.dashaLord} مهادشا (${Math.floor(a.from)} – ${Math.floor(a.to)}) ۾ آهيو. هي ${a.dashaText}`,
};
const SD: LangPack = { ...UR, code: "sd", label: "سنڌي (Sindhi)", sentences: sdSentences };

// Register all extras.
[NE, MAI, DOI, BRX, SAT, KOK, MNI, KS, SD].forEach(registerLangPack);