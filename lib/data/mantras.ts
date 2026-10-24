// Mantra & stotra library — traditional, public-domain texts with sources.
// AGENT.md §2.3: no silent stubs — audio is a documented v2 stub where present.
// Traditional texts are separated from editorial meaning ("meaningHi"/"meaningEn").

export interface Mantra {
  slug: string;
  titleEn: string;
  titleHi: string;
  deity: string;
  category: "SHIVA" | "VISHNU" | "DEVI" | "GANESHA" | "HANUMAN" | "VEDIC" | "SHANTI" | "GURU";
  /** Traditional text (Devanagari). Public domain. */
  text: string;
  /** IAST-style transliteration for pronunciation assistance. */
  transliteration: string;
  meaningHi: string;
  meaningEn: string;
  /** Scriptural / traditional source. Only stated when verifiable. */
  source: string;
  audioAvailable: boolean;
}

export const MANTRAS: Mantra[] = [
  {
    slug: "om",
    titleEn: "Om (Pranava)",
    titleHi: "ॐ (प्रणव)",
    deity: "सर्व देवता / All",
    category: "VEDIC",
    text: "ॐ",
    transliteration: "oṁ",
    meaningHi:
      "ॐ प्रणव मंत्र है — श्रुतियों में इसे ब्रह्म का साक्षात् ध्वनि-रूप कहा गया है। इसके अक्षर (अ-उ-म) जाग्रत, स्वप्न और सुषुप्ति — तीनों अवस्थाओं तथा उनसे परे की चेतना का बोध कराते हैं।",
    meaningEn:
      "Om is the primal sound (pranava), described in the Upanishads as the sound-form of Brahman. Its three matras (a-u-m) symbolize waking, dreaming, and deep sleep, and the silence after them points to the fourth state — pure consciousness.",
    source: "माण्डूक्य उपनिषद् (Mandukya Upanishad)",
    audioAvailable: false,
  },
  {
    slug: "gayatri-mantra",
    titleEn: "Gayatri Mantra",
    titleHi: "गायत्री मंत्र",
    deity: "सविता (सूर्य देव)",
    category: "VEDIC",
    text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
    transliteration:
      "oṁ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṁ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt",
    meaningHi:
      "हे प्राण, जल और अन्न के स्वामी, प्रकाशमान सविता देव! हम आपके उस परम पावन तेज का ध्यान करते हैं, जो हमारी बुद्धि को सन्मार्ग पर प्रेरित करे।",
    meaningEn:
      "We meditate on the radiant light of Savita (the solar deity); may that divine brilliance inspire and guide our intellect toward the right path.",
    source: "ऋग्वेद 3.62.10 (Rigveda)",
    audioAvailable: false,
  },
  {
    slug: "maha-mrityunjaya",
    titleEn: "Maha Mrityunjaya Mantra",
    titleHi: "महामृत्युंजय मंत्र",
    deity: "शिव",
    category: "SHIVA",
    text: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥",
    transliteration:
      "oṁ tryambakaṁ yajāmahe sugandhiṁ puṣṭi-vardhanam | urvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt ||",
    meaningHi:
      "हम तीन नेत्रों वाले त्र्यम्बक (शिव) की उपासना करते हैं, जो सुगन्ध और पुष्टि में वृद्धि करने वाले हैं। जैसे परिपक्व खरबूजा अपनी डंठल से सहज ही तरी जाता है, वैसे ही हमें मृत्यु के बंधन से मुक्त करें — अमृतत्व की प्राप्ति कराएं।",
    meaningEn:
      "We worship the three-eyed Lord Shiva, who nourishes and fragrances all life. As a ripe cucumber is released effortlessly from its stem, so may we be freed from the bonds of death — not by force, but in ripeness — and attain immortality.",
    source: "ऋग्वेद 7.59.12; यजुर्वेद-तैत्तिरीय संहिता 1.8.6.i",
    audioAvailable: false,
  },
  {
    slug: "om-namah-shivaya",
    titleEn: "Panchakshara Mantra",
    titleHi: "ॐ नमः शिवाय (पंचाक्षर मंत्र)",
    deity: "शिव",
    category: "SHIVA",
    text: "ॐ नमः शिवाय",
    transliteration: "oṁ namaḥ śivāya",
    meaningHi:
      "शिव को नमस्कार है। यह पंचाक्षर मंत्र भक्ति और समर्पण का सरलतम मार्ग माना गया है; पंच अक्षर (न-म-शि-वा-य) पंच तत्वों का भी प्रतीक माना जाता है।",
    meaningEn:
      "Salutations to Shiva — the auspicious innermost Self. This five-syllable mantra is regarded as the simplest path of devotion; its five letters are also associated with the five elements.",
    source: "श्रीरुद्रम् (नमकम्), यजुर्वेद परम्परा",
    audioAvailable: false,
  },
  {
    slug: "hare-krishna-mahamantra",
    titleEn: "Hare Krishna Mahamantra",
    titleHi: "हरे कृष्ण महामंत्र",
    deity: "कृष्ण / हरि",
    category: "VISHNU",
    text: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे । हरे राम हरे राम, राम राम हरे हरे ॥",
    transliteration:
      "hare kṛṣṇa hare kṛṣṇa, kṛṣṇa kṛṣṇa hare hare | hare rāma hare rāma, rāma rāma hare hare ||",
    meaningHi:
      "हे सर्वानन्द-स्वरूप कृष्ण, हे राम! हमें अपनी सेवा में सम्मिलित करें। यह 16-नाम-32-अक्षर का महामंत्र कलियुग में भक्ति-साधना का प्रमुख साधन माना गया है।",
    meaningEn:
      "O all-blissful Lord (Krishna/Rama), engage us in Your loving service. This sixteen-name mahamantra is regarded as the foremost means of devotion in the present age.",
    source: "कलिसन्तरण उपनिषद् (Kali-santarana Upanishad)",
    audioAvailable: false,
  },
  {
    slug: "om-namo-bhagavate-vasudevaya",
    titleEn: "Dvadashakshara Mantra",
    titleHi: "ॐ नमो भगवते वासुदेवाय",
    deity: "विष्णु / वासुदेव",
    category: "VISHNU",
    text: "ॐ नमो भगवते वासुदेवाय",
    transliteration: "oṁ namo bhagavate vāsudevāya",
    meaningHi:
      "भगवान् वासुदेव (विष्णु/कृष्ण) को नमस्कार। द्वादशाक्षर मंत्र भगवत्-भक्ति और शरणागति का प्रसिद्ध मंत्र है।",
    meaningEn:
      "Salutations to Bhagavan Vasudeva (Krishna/Vishnu). This twelve-syllable mantra is a celebrated mantra of devotion and surrender.",
    source: "भागवत परम्परा / पाञ्चरात्र आगम (Bhagavata tradition)",
    audioAvailable: false,
  },
  {
    slug: "ganesh-mantra",
    titleEn: "Ganesha Beeja & Invocation",
    titleHi: "गणेश बीज एवं प्रार्थना",
    deity: "गणेश",
    category: "GANESHA",
    text: "ॐ गं गणपतये नमः",
    transliteration: "oṁ gaṁ gaṇapataye namaḥ",
    meaningHi:
      "गणपति को नमस्कार। किसी भी शुभ कार्य का आरम्भ विघ्नहर्ता गणेश के आह्वान से किया जाता है, ताकि कार्य बिना विघ्न के सम्पन्न हो।",
    meaningEn:
      "Salutations to Ganapati, remover of obstacles. Auspicious undertakings traditionally begin with this invocation so that the work proceeds unhindered.",
    source: "गणपति परम्परा (Traditional Ganapati worship)",
    audioAvailable: false,
  },
  {
    slug: "hanuman-mantra",
    titleEn: "Hanuman Invocation",
    titleHi: "हनुमान आह्वान",
    deity: "हनुमान",
    category: "HANUMAN",
    text: "ॐ हं हनुमते नमः",
    transliteration: "oṁ haṁ hanumate namaḥ",
    meaningHi:
      "श्री हनुमान जी को नमस्कार। यह मंत्र साहस, एकाग्रता और भक्ति-शक्ति की प्राप्ति हेतु हनुमान उपासना में प्रयुक्त होता है।",
    meaningEn:
      "Salutations to Shri Hanuman. This mantra is used in Hanuman worship for courage, focus, and devoted strength.",
    source: "हनुमत् उपासना परम्परा (Traditional Hanuman worship)",
    audioAvailable: false,
  },
  {
    slug: "shanti-mantra",
    titleEn: "Shanti Path (Asato Ma)",
    titleHi: "शान्ति पाठ (असतो मा)",
    deity: "सर्व देवता / All",
    category: "SHANTI",
    text: "ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय । ॐ शान्तिः शान्तिः शान्तिः ॥",
    transliteration:
      "oṁ asato mā sad gamaya | tamaso mā jyotir gamaya | mṛtyor mā amṛtaṁ gamaya | oṁ śāntiḥ śāntiḥ śāntiḥ ||",
    meaningHi:
      "असत्य से सत्य की ओर हमें ले चलो; अज्ञान-अँधेरे से ज्ञान-प्रकाश की ओर; मृत्यु से अमृतत्व की ओर। तीन शान्तियाँ — अधिभौतिक, अधिदैविक और अध्यात्मिक विघ्नों की शान्ति के लिए।",
    meaningEn:
      "Lead me from the unreal to the real; from darkness to light; from death to immortality. The three shantis invoke peace from external, divine, and inner obstacles.",
    source: "बृहदारण्यक उपनिषद् 1.3.28 (Brihadaranyaka Upanishad)",
    audioAvailable: false,
  },
  {
    slug: "guru-mantra",
    titleEn: "Guru Mantra",
    titleHi: "गुरु मंत्र",
    deity: "गुरु / आचार्य",
    category: "GURU",
    text: "ॐ गुरुर्ब्रह्मा गुरुर्विष्णुर्गुरुर्देवो महेश्वरः । गुरुः साक्षात् परब्रह्म तस्मै श्रीगुरवे नमः ॥",
    transliteration:
      "oṁ gurur brahmā gurur viṣṇur gurur devo maheśvaraḥ | guruḥ sākṣāt parabrahma tasmai śrī gurave namaḥ ||",
    meaningHi:
      "गुरु ब्रह्मा हैं, गुरु विष्णु हैं, गुरु ही महेश्वर हैं; गुरु साक्षात् परब्रह्म हैं — ऐसे श्रीगुरु को नमस्कार। ज्ञान की परम्परा गुरु के माध्यम से ही चलती है।",
    meaningEn:
      "The teacher is Brahma, Vishnu, and Maheshvara; the teacher is the direct presence of the Supreme — salutations to such a guru. Knowledge flows through the lineage of teachers.",
    source: "गुरु परम्परा (Traditional guru-vandana)",
    audioAvailable: false,
  },
  {
    slug: "saraswati-mantra",
    titleEn: "Saraswati Beeja Mantra",
    titleHi: "सरस्वती बीज मंत्र",
    deity: "सरस्वती",
    category: "DEVI",
    text: "ॐ ऐं सरस्वत्यै नमः",
    transliteration: "oṁ aiṁ sarasvatyai namaḥ",
    meaningHi:
      "देवी सरस्वती को नमस्कार। विद्या, संगीत और वाणी की देवी का यह बीज-मंत्र अध्ययन एवं कला-साधना के प्रारम्भ में जपा जाता है।",
    meaningEn:
      "Salutations to Devi Saraswati, goddess of learning, music, and speech. This seed-mantra is chanted at the start of study or artistic practice.",
    source: "देवी उपासना परम्परा (Traditional Devi worship)",
    audioAvailable: false,
  },
  {
    slug: "vasudhaiva-kutumbakam",
    titleEn: "Vasudhaiva Kutumbakam",
    titleHi: "वसुधैव कुटुम्बकम्",
    deity: "सर्व देवता / All",
    category: "VEDIC",
    text: "अयं निजः परो वेति गणना लघुचेतसाम् । उदारचरितानां तु वसुधैव कुटुम्बकम् ॥",
    transliteration:
      "ayaṁ nijaḥ paro veti gaṇanā laghu-cetasām | udāra-caritānāṁ tu vasudhaiva kuṭumbakam ||",
    meaningHi:
      "\"यह मेरा है, यह पराया है\" — ऐसी गिनती छोटे मन वाले करते हैं; उदार हृदय वालों के लिए तो सारी पृथ्वी ही एक परिवार है।",
    meaningEn:
      "\"This one is mine, that one is a stranger\" — such accounting belongs to small minds. For the noble-hearted, the whole earth is one family.",
    source: "महा उपनिषद् 6.72 (Maha Upanishad)",
    audioAvailable: false,
  },
];

export function findMantra(slug: string): Mantra | undefined {
  return MANTRAS.find((m) => m.slug === slug);
}
