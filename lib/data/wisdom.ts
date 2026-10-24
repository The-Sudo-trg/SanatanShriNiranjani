// Daily wisdom — verifiable scriptural quotations only.
// Rule (brief §6.2 / AGENT.md §2.5): never fabricate scripture or misattribute
// modern quotes to ancient texts. Every entry carries a chapter/verse reference.
// Editorial explanation lives in meaningHi/meaningEn and is clearly interpretation.

export interface WisdomEntry {
  /** Deterministic daily slot index (rotation order). */
  key: string;
  textHi: string;
  sourceHi: string;
  sourceEn: string;
  meaningHi: string;
  meaningEn: string;
  reflectionHi: string;
  reflectionEn: string;
}

export const WISDOM_ENTRIES: WisdomEntry[] = [
  {
    key: "gita-2-47",
    textHi: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    sourceHi: "श्रीमद्भगवद्गीता 2.47",
    sourceEn: "Bhagavad Gita 2.47",
    meaningHi:
      "कर्म करने में ही तुम्हारा अधिकार है, फलों में कभी नहीं। न कर्म का कर्ता बनकर फल की चिन्ता करो, और न ही अकर्म में आसक्ति रखो।",
    meaningEn:
      "You have a right to your actions alone, never to their fruits. Do not act for the sake of reward, yet do not sink into inaction either.",
    reflectionHi: "आज का कौन-सा कार्य मैं फल की चिन्ता छोड़कर पूरी श्रद्धा से कर सकता हूँ?",
    reflectionEn: "Which task today can I perform with full care, letting go of anxiety over outcomes?",
  },
  {
    key: "gita-6-5",
    textHi: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
    sourceHi: "श्रीमद्भगवद्गीता 6.5",
    sourceEn: "Bhagavad Gita 6.5",
    meaningHi:
      "मनुष्य स्वयं को स्वयं उद्धार करे; स्वयं को गिराए नहीं। मन ही आत्मा का मित्र है और मन ही शत्रु भी।",
    meaningEn:
      "Lift yourself up by your own self; do not let yourself sink. The mind alone is the friend of the self, and the mind alone its enemy.",
    reflectionHi: "आज मेरा मन मेरा मित्र बना या शत्रु? मैं उसे किस एक आदत से मित्र बना सकता हूँ?",
    reflectionEn: "Was my mind my friend today? Which one habit would make it more of a friend?",
  },
  {
    key: "gita-2-14",
    textHi: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः । आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
    sourceHi: "श्रीमद्भगवद्गीता 2.14",
    sourceEn: "Bhagavad Gita 2.14",
    meaningHi:
      "इन्द्रियों के विषय-स्पर्श ठण्ड-गर्मी, सुख-दुःख देने वाले हैं; आने-जाने वाले और अनित्य हैं। इन्हें सहन करो, तितिक्षा रखो।",
    meaningEn:
      "Contacts of the senses bring cold and heat, pleasure and pain; they come and go, and are impermanent. Endure them with patience.",
    reflectionHi: "आज जो असुविधा आई, वह भी गुजर जाएगी — क्या मैं उसे शान्ति से झेल पाया?",
    reflectionEn: "Today's discomfort will also pass — could I meet it with calm endurance?",
  },
  {
    key: "gita-9-22",
    textHi: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते । तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
    sourceHi: "श्रीमद्भगवद्गीता 9.22",
    sourceEn: "Bhagavad Gita 9.22",
    meaningHi:
      "जो लोग अनन्य भाव से मेरा चिन्तन और उपासना करते हैं, उनका योगक्षेम — साधन का प्राप्ति और रक्षण — मैं स्वयं वहन करता हूँ।",
    meaningEn:
      "Those who worship Me with undivided devotion — I Myself carry what they need and guard what they have.",
    reflectionHi: "क्या मेरी भक्ति में अनन्यता है, या मन अनेक ओर भटकता है?",
    reflectionEn: "Is my devotion wholehearted, or does the mind scatter in many directions?",
  },
  {
    key: "gita-3-35",
    textHi: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् । स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥",
    sourceHi: "श्रीमद्भगवद्गीता 3.35",
    sourceEn: "Bhagavad Gita 3.35",
    meaningHi:
      "दूसरों के अनुसरण में किया गया कर्तव्य भले सुव्यवस्थित हो, अपना स्वधर्म — अपूर्ण होते हुए भी — श्रेष्ठ है। स्वधर्म में मृत्यु भी कल्याणकारी, परधर्म भय देने वाला।",
    meaningEn:
      "Better one's own duty though imperfect, than another's duty well performed. Death in one's own dharma is welfare; another's dharma breeds fear.",
    reflectionHi: "मेरा स्वधर्म — मेरी प्रकृति के अनुकूल कर्तव्य — क्या है, और क्या मैं उसी में स्थिर हूँ?",
    reflectionEn: "What is my own dharma, suited to my nature — and am I standing firm in it?",
  },
  {
    key: "gita-12-15",
    textHi: "यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः । हर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः ॥",
    sourceHi: "श्रीमद्भगवद्गीता 12.15",
    sourceEn: "Bhagavad Gita 12.15",
    meaningHi:
      "जिससे लोग क्षुब्ध नहीं होते और जो लोगों से क्षुब्ध नहीं होता; जो हर्ष, आवेग, भय और उद्वेग से मुक्त है — वही मुझे प्रिय है।",
    meaningEn:
      "He by whom the world is not disturbed, and who cannot be disturbed by the world — free from exultation, anger, fear, and agitation — is dear to Me.",
    reflectionHi: "आज मेरे व्यवहार से किसी को शान्ति मिली या विघ्न?",
    reflectionEn: "Did my conduct today give others peace, or disturbance?",
  },
  {
    key: "gita-2-20",
    textHi: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥",
    sourceHi: "श्रीमद्भगवद्गीता 2.20",
    sourceEn: "Bhagavad Gita 2.20",
    meaningHi:
      "आत्मा न कभी जन्म लेता है, न मरता है; न यह होने के बाद अन्तर्ध्यान होता है। यह अजन्मा, नित्य, शाश्वत और पुरातन है — शरीर के वध में यह वध नहीं होता।",
    meaningEn:
      "The Self is never born nor does it ever die; it is unborn, eternal, everlasting, and primeval. It is not slain when the body is slain.",
    reflectionHi: "शरीर-परिवर्तन से परे चेतना की स्थिरता का बोध क्या मुझे साहस देता है?",
    reflectionEn: "Does the constancy of consciousness beyond bodily change give me courage?",
  },
  {
    key: "gita-4-7-8",
    textHi:
      "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥ परित्राणाय साधूनां विनाशाय च दुष्कृताम् । धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥",
    sourceHi: "श्रीमद्भगवद्गीता 4.7–4.8",
    sourceEn: "Bhagavad Gita 4.7–4.8",
    meaningHi:
      "जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं स्वयं को रचता हूँ; साधुओं के उद्धार, दुष्कृतियों के विनाश और धर्म की स्थापना के लिए युग-युग में प्रकट होता हूँ।",
    meaningEn:
      "Whenever dharma declines and adharma rises, I manifest Myself — age after age — to protect the good, destroy evil, and establish dharma.",
    reflectionHi: "अपने घेरे में धर्म की स्थापना मेरे एक नैतिक कार्य से आरम्भ हो सकती है — वह क्या है?",
    reflectionEn: "Where can I begin re-establishing dharma in my own circle, through one right act?",
  },
  {
    key: "gita-18-66",
    textHi: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
    sourceHi: "श्रीमद्भगवद्गीता 18.66",
    sourceEn: "Bhagavad Gita 18.66",
    meaningHi:
      "सब धर्मों (साधनों) की आशा त्यागकर केवल मेरी शरण में आ; मैं तुझे समस्त पापों से मुक्त करूँगा — शोक मत कर।",
    meaningEn:
      "Abandoning all means of support, take refuge in Me alone; I shall free you from all sins — do not grieve.",
    reflectionHi: "शरणागति का भाव क्या मुझे संसार की चिन्ताओं से विश्राम देता है?",
    reflectionEn: "Does the spirit of surrender give me rest from the world's anxieties?",
  },
  {
    key: "upanishad-asato-ma",
    textHi: "ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥",
    sourceHi: "बृहदारण्यक उपनिषद् 1.3.28",
    sourceEn: "Brihadaranyaka Upanishad 1.3.28",
    meaningHi:
      "असत्य से सत्य की, अज्ञान से ज्ञान की, मृत्यु से अमृतत्व की ओर हमें ले चलो — यह उपनिषदों की प्रसिद्ध शान्ति-प्रार्थना है।",
    meaningEn:
      "Lead me from the unreal to the real, from darkness to light, from death to immortality — the celebrated shanti prayer of the Upanishads.",
    reflectionHi: "सत्य की ओर मेरा आज का एक कदम क्या हो सकता है?",
    reflectionEn: "What is one step I can take today toward the real?",
  },
  {
    key: "upanishad-satyam-eva",
    textHi: "सत्यमेव जयते नानृतं",
    sourceHi: "मुण्डक उपनिषद् 3.1.6",
    sourceEn: "Mundaka Upanishad 3.1.6",
    meaningHi:
      "सत्य की ही विजय होती है, असत्य की नहीं। सत्यमेव जयते — यह उपनिषद्-वाक्य भारत का राष्ट्रीय आदर्श वाक्य भी है।",
    meaningEn:
      "Truth alone triumphs, not untruth — a line from the Mundaka Upanishad, also India's national motto.",
    reflectionHi: "क्या आज मैंने किसी ऐसे स्थान पर सत्य चुना जहाँ सुविधा नहीं थी?",
    reflectionEn: "Did I choose truth today where it was not convenient?",
  },
  {
    key: "upanishad-vasudhaiva",
    textHi: "उदारचरितानां तु वसुधैव कुटुम्बकम् ॥",
    sourceHi: "महा उपनिषद् 6.72",
    sourceEn: "Maha Upanishad 6.72",
    meaningHi:
      "उदार हृदय वालों के लिए सारी पृथ्वी ही कुटुम्ब है। यह भाव समग्र सृष्टि के प्रति करुणा और जिम्मेदारी का आधार है।",
    meaningEn:
      "For the noble-hearted, the whole earth is one family — the basis of compassion and responsibility toward all creation.",
    reflectionHi: "आज पृथ्वी-परिवार के किसी अजनबी के लिए मैंने क्या किया?",
    reflectionEn: "What did I do today for a stranger in this earth-family?",
  },
  {
    key: "upanishad-sarvam-khalv",
    textHi: "ॐ सर्वं खल्विदं ब्रह्म",
    sourceHi: "छान्दोग्य उपनिषद् 3.14.1",
    sourceEn: "Chandogya Upanishad 3.14.1",
    meaningHi:
      "यह सब कुछ ब्रह्म ही है — सृष्टि के समस्त रूपों में एक ही चेतन सत्ता प्रकाशित है। यह दृष्टि सम्मान और अहिंसा का आधार बनती है।",
    meaningEn:
      "All this is indeed Brahman — one conscious reality shining through every form. This vision grounds respect and non-harm.",
    reflectionHi: "क्या मैंने आज सबमें एक ही सत्ता का आदर किया?",
    reflectionEn: "Did I honor the one reality present in everyone today?",
  },
];

/** Deterministic daily pick — same entry for the whole Asia/Kolkata day. */
export function wisdomForDay(dayKey: string): WisdomEntry {
  const [, month, day] = dayKey.split("-");
  const seed = Number(month) * 31 + Number(day);
  return WISDOM_ENTRIES[seed % WISDOM_ENTRIES.length];
}
