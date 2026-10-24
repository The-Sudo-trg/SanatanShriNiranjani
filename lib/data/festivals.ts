// Festival guide — dates verified via drikpanchang.com on 2026-10-24 (lastVerified).
// Rule (brief §4.3/§6.4): never present unverified tithis or disputed regional
// timings as universal. Source URLs are kept per entry and shown in the UI.

export interface Festival {
  slug: string;
  nameEn: string;
  nameHi: string;
  /** Upcoming verified occurrence (ISO date, Gregorian). */
  dateIso: string;
  /** Tithi / basis, as stated by the source. Location-dependent timings noted. */
  tithi: string;
  significanceHi: string;
  significanceEn: string;
  observancesHi: string;
  regionalNotes: string;
  sourceUrls: string[];
  lastVerified: string;
}

export const FESTIVALS: Festival[] = [
  {
    slug: "karwa-chauth-2026",
    nameEn: "Karwa Chauth",
    nameHi: "करवा चौथ",
    dateIso: "2026-10-29",
    tithi: "कृष्ण पक्ष कार्तिक चतुर्थी; व्रत 6:31 AM–8:17 PM, पूजा मुहूर्त 5:38–6:56 PM, चन्द्रोदय ~8:17 PM (नई दिल्ली)",
    significanceHi:
      "सुहागिन स्त्रियों द्वारा पति की दीर्घायु और सुरक्षा हेतु किया जाने वाला निर्जला व्रत। वीरवती रानी और करवा की कथा इसका आधार है।",
    significanceEn:
      "A one-day vrat observed by married women for the longevity and well-being of their husbands, fasting from sunrise to moonrise, recalling the legend of Queen Veervati.",
    observancesHi:
      "सूर्योदय से पूर्व सरगी, सूर्यास्त के बाद कथा एवं व्रत-कथा संगठन, चन्द्रमा दर्शन (छलनी से) के पश्चात पति के मुख देखकर व्रत तोड़ना।",
    regionalNotes:
      "मुख्यतः उत्तर भारत (पंजाब, हरियाणा, उत्तर प्रदेश, राजस्थान, दिल्ली)। 2027 में यह 18 अक्टूबर 2027 (सोमवार) पर पड़ेगा।",
    sourceUrls: ["https://www.drikpanchang.com/festivals/karwa-chauth/karwa-chauth-date-time.html"],
    lastVerified: "2026-10-24",
  },
  {
    slug: "dev-uthani-ekadashi-2026",
    nameEn: "Dev Uthani Ekadashi (Prabodhini Ekadashi)",
    nameHi: "देव उठनी एकादशी (प्रबोधिनी एकादशी)",
    dateIso: "2026-11-20",
    tithi: "शुक्ल पक्ष कार्तिक एकादशी; तिथि 20 नवंबर सुबह 7:15 से 21 नवंबर प्रातः 6:32 तक; पारण 21 नवंबर (नई दिल्ली)",
    significanceHi:
      "चातुर्मास की चार-मास की निद्रा से भगवान् विष्णु के जागरण (देवोत्थान) का दिन। इसी से विवाह आदि शुभ कार्यों का आरम्भ होता है।",
    significanceEn:
      "Marks Lord Vishnu's awakening from his four-month cosmic sleep (Chaturmas); auspicious ceremonies such as weddings resume from this day.",
    observancesHi:
      "एकादशी व्रत, रात्रि-जागरण एवं भजन, तुलसी विवाह, द्वादशी पर निर्धारित समय में पारण।",
    regionalNotes:
      "उत्तर भारत में देव उठनी, महाराष्ट्र एवं दक्षिण में प्रबोधिनी एकादशी; तिथि-विस्तार के कारण कुछ समुदाय 21 नवंबर को मानते हैं।",
    sourceUrls: [
      "https://www.drikpanchang.com/ekadashis/prabodhini/prabodhini-ekadashi-date-time.html",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "kartik-purnima-2026",
    nameEn: "Kartik Purnima (Dev Deepawali)",
    nameHi: "कार्तिक पूर्णिमा (देव दीपावली)",
    dateIso: "2026-11-24",
    tithi: "शुक्ल पक्ष कार्तिक पूर्णिमा; तिथि 23 नवंबर रात्रि 11:42 से 24 नवंबर रात्रि 8:23 तक",
    significanceHi:
      "त्रिपुरासुर पर शिव की विजय (त्रिपुरी पूर्णिमा) तथा देवताओं के गंगा-अवतरण का पर्व; काशी में देव दीपावली का महोत्सव।",
    significanceEn:
      "Celebrates Shiva's victory over Tripurasura and the gods' descent to the Ganga; marked by Dev Deepawali on the Varanasi ghats.",
    observancesHi:
      "प्रातः कार्तिक स्नान, दीपदान, सत्यनारायण पूजा, दान; चन्द्रोदय (~5:01 PM, दिल्ली) तक व्रत।",
    regionalNotes:
      "देव दीपावली विशेषतः वाराणसी/गंगा-तट; ओडिशा में इसी दिन बोइता बन्दना (पोत-पूजा)।",
    sourceUrls: [
      "https://www.drikpanchang.com/purnima/kartik/kartik-purnima-date-time.html?year=2026",
      "https://www.drikpanchang.com/diwali/dev-diwali/dev-deepawali-date-time.html?year=2026",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "dhanu-sankranti-2026",
    nameEn: "Dhanu Sankranti",
    nameHi: "धनु संक्रान्ति",
    dateIso: "2026-12-16",
    tithi: "सौर पर्व (चन्द्र तिथि नहीं); संक्रान्ति क्षण 10:29 AM (दिल्ली), पुण्यकाल 10:29 AM–4:00 PM",
    significanceHi:
      "सूर्य का वृश्चिक से धनु राशि में प्रवेश। ओडिशा में धनु यात्रा (कृष्ण-कथा) का आरम्भ; दक्षिण में धनुर्मास (मार्गलि) उपासना-काल का आरम्भ।",
    significanceEn:
      "Sun's transit into Sagittarius; in Odisha it begins the Dhanu Yatra season, and in the South the Dhanurmasa month of early-morning worship.",
    observancesHi: "पुण्यकाल में स्नान-दान, सूर्य पूजा, नवाग्रह-अर्पण; वैष्णवों द्वारा धनुर्मास व्रत।",
    regionalNotes:
      "मुख्यतः ओडिशा (धनु यात्रा) एवं दक्षिण भारत (धनुर्मास)। शीत-अयन (winter solstice) 21–22 दिसंबर है, पर पारम्परिक उत्तरायण-पर्व मकर संक्रान्ति है।",
    sourceUrls: ["https://www.drikpanchang.com/sankranti/dhanu-sankranti-date-time.html"],
    lastVerified: "2026-10-24",
  },
  {
    slug: "gita-jayanti-2026",
    nameEn: "Gita Jayanti",
    nameHi: "गीता जयन्ती",
    dateIso: "2026-12-20",
    tithi: "शुक्ल पक्ष मार्गशीर्ष एकादशी (मोक्षदा एकादशी); तिथि 19 दिसंबर रात्रि 10:09 से 20 दिसंबर रात्रि 8:14 तक",
    significanceHi:
      "कुरुक्षेत्र में भगवान् कृष्ण द्वारा अर्जुन को गीता-उपदेश की स्मृति दिवस; मोक्षदा एकादशी का व्रत मोक्ष-प्रद माना जाता है।",
    significanceEn:
      "Commemorates Krishna's teaching of the Bhagavad Gita to Arjuna at Kurukshetra; falls on Mokshada Ekadashi.",
    observancesHi:
      "पूरी गीता (700 श्लोक) का पाठ, प्रवचन, गीता-प्रश्नोत्तरी; कुरुक्षेत्र में गीता जयन्ती महोत्सव; पारण 21 दिसंबर प्रातः।",
    regionalNotes: "विश्वभर के हिन्दू समुदायों द्वारा इसी एकादशी को मनाया जाता है।",
    sourceUrls: [
      "https://www.drikpanchang.com/ekadashis/mokshada/mokshada-ekadashi-date-time.html?year=2026",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "makar-sankranti-2027",
    nameEn: "Makar Sankranti",
    nameHi: "मकर संक्रान्ति",
    dateIso: "2027-01-15",
    tithi: "सौर पर्व: सूर्य मकर राशि में प्रवेश; संक्रान्ति क्षण 14 जनवरी रात्रि 9:14, अतः पर्व 15 जनवरी; पुण्यकाल 7:15 AM–5:46 PM (दिल्ली)",
    significanceHi:
      "सूर्य की उत्तरायण-यात्रा का उत्सव; सूर्य उपासना एवं फसल-आभार का पर्व। गंगासागर-प्रयागराज स्नान का महापर्व।",
    significanceEn:
      "Celebrates the Sun's northward journey (Uttarayana) into Capricorn — a solar-calendar festival of Surya worship and harvest thanksgiving.",
    observancesHi:
      "पवित्र नदियों में स्नान, सूर्य पूजा, तिल-गुड़-खिचड़ी का दान, पतंग उत्सव, नई फसल का अर्पण।",
    regionalNotes:
      "तमिलनाडु में पोंगल (15 जनवरी 2027), पंजाब में लोहड़ी (14 जनवरी), असम में माघ बिहु, गुजरात में उत्तरायण, बंगाल में पौष संक्रान्ति।",
    sourceUrls: ["https://www.drikpanchang.com/sankranti/makar-sankranti-date-time.html"],
    lastVerified: "2026-10-24",
  },
  {
    slug: "vasant-panchami-2027",
    nameEn: "Vasant Panchami (Saraswati Puja)",
    nameHi: "वसंत पंचमी (सरस्वती पूजा)",
    dateIso: "2027-02-11",
    tithi: "शुक्ल पक्ष माघ पंचमी; तिथि 11 फरवरी प्रातः 3:04 से 12 फरवरी प्रातः 3:18 तक; पूजा मुहूर्त 7:03 AM–12:36 PM (दिल्ली)",
    significanceHi:
      "वसंत-ऋतु का आगमन और विद्या-संगीत की देवी सरस्वती की उपासना; अक्षर-अभ्यास (विद्या-आरम्भ) हेतु श्रेष्ठ दिन।",
    significanceEn:
      "Welcomes spring and honors Devi Saraswati; considered most auspicious for beginning education and music.",
    observancesHi:
      "पीले वस्त्र-पुष्प, सरस्वती पूजा, पुस्तकों-वाद्यों का पूजन, बच्चों का विद्यारम्भ; पंजाब में बसंत पतंग उत्सव।",
    regionalNotes:
      "बंगाल, बिहार, असम, ओडिशा में बड़ा सार्वजनिक पर्व; दक्षिण में श्री पंचमी; प्रयागराज कुम्भ के पारम्परिक स्नान का प्रारम्भ-दिन।",
    sourceUrls: [
      "https://www.drikpanchang.com/festivals/vasant-panchami/vasant-panchami-puja-date-time.html",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "maha-shivaratri-2027",
    nameEn: "Maha Shivaratri",
    nameHi: "महाशिवरात्रि",
    dateIso: "2027-03-06",
    tithi: "कृष्ण पक्ष फाल्गुन चतुर्दशी; निशिता-काल पूजा ~12:07–12:57 AM (7 मार्च, दिल्ली); पारण 7 मार्च प्रातः 6:24 के बाद",
    significanceHi:
      "शिव-पार्वती विवाह तथा शिव-ताण्डव की दिव्य-रात्रि; इस रात्रि की उपासना से पाप-मोक्ष की मान्यता। वर्ष का सर्वप्रमुख शैव पर्व।",
    significanceEn:
      "The Great Night of Shiva — the divine wedding of Shiva and Parvati and the night of the Tandava; year's most important Shaiva festival.",
    observancesHi:
      "रात्रि-जागरण, शिवलिंग का अभिषेक (दूध, मधु, जल, बिल्वपत्र), 'ॐ नमः शिवाय' जप, शिव-मन्दिर दर्शन, दिन-भर व्रत।",
    regionalNotes:
      "कश्मीर में 'हेरथ' — विशिष्ट कश्मीरी पंडित परम्परा; दक्षिण में मन्दिरों में सम्पूर्ण रात्रि उपासना। निशिता-काल स्थानानुसार भिन्न।",
    sourceUrls: [
      "https://www.drikpanchang.com/festivals/maha-shivaratri/maha-shivaratri-date-time.html",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "holi-2027",
    nameEn: "Holi (Rangwali Holi)",
    nameHi: "होली (रंगवाली होली / धुलण्डी)",
    dateIso: "2027-03-22",
    tithi: "शुक्ल पक्ष फाल्गुन पूर्णिमा; होलिका दहन 21 मार्च (मुहूर्त 6:33–8:55 PM, दिल्ली); रंगोत्सव 22 मार्च",
    significanceHi:
      "प्रह्लाद-कथा से भक्ति और असत्य पर सत्य की विजय का, तथा वसंत आगमन और राधा-कृष्ण की दिव्य लीला का पर्व।",
    significanceEn:
      "The festival of colors — devotion's victory over evil (Prahlada's deliverance), the arrival of spring, and the playful divine love of Radha and Krishna.",
    observancesHi:
      "पूर्व-संध्या में होलिका दहन (21 मार्च), अगले दिन गुलाल एवं अबीर की खेल, गुजिया-ठंडाई, मिलन-समारोह — 'बुरा न मानो होली है'।",
    regionalNotes:
      "ब्रज में पूर्व-सप्ताह लठमार होली आदि विस्तृत उत्सव; दक्षिण में होलिका दहन (काम दहनम्) पर बल; कुछ पंचांगों में 22–23 मार्च भिन्नता।",
    sourceUrls: [
      "https://www.drikpanchang.com/festivals/holi/festivals-holi-rangwali.html",
      "https://www.drikpanchang.com/festivals/holi/festivals-holika-dahan-timings.html",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "rama-navami-2027",
    nameEn: "Rama Navami",
    nameHi: "राम नवमी",
    dateIso: "2027-04-15",
    tithi: "शुक्ल पक्ष चैत्र नवमी; तिथि 14 अप्रैल 3:23 PM से 15 अप्रैल 1:20 PM तक; मध्याह्न पूजा 11:04 AM–1:38 PM (दिल्ली)",
    significanceHi:
      "भगवान् राम (विष्णु के सप्तम अवतार) के जन्मोत्सव; चैत्र नवरात्रि का समापन; मध्याह्न-क्षण को राम-जन्म-समय माना जाता है।",
    significanceEn:
      "Celebrates the birth of Lord Rama at midday on the ninth day of Chaitra Navratri.",
    observancesHi:
      "व्रत, रामायण-रामचरितमानस पाठ, भजन-कीर्तन, मध्याह्न मन्दिर-पूजा, रथ यात्राएँ, चैत्र नवरात्रि व्रत की समाप्ति।",
    regionalNotes:
      "अयोध्या में महोत्सव; दक्षिण में कल्याणोत्सवम् (राम-सीता विवाह); सीता नवमी इसके बाद 14 मई 2027 को।",
    sourceUrls: [
      "https://www.drikpanchang.com/dashavatara/rama-navami/rama-navami-date-time.html?year=2027",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "hanuman-jayanti-2027",
    nameEn: "Hanuman Jayanti",
    nameHi: "हनुमान जयन्ती",
    dateIso: "2027-04-20",
    tithi: "शुक्ल पक्ष चैत्र पूर्णिमा; तिथि 20 अप्रैल प्रातः 4:51 से 21 अप्रैल प्रातः 3:56 तक",
    significanceHi:
      "शक्ति, भक्ति और निःस्वार्थ सेवा के प्रतीक श्री हनुमान जी का जन्मोत्सव — राम नवमी के बाद की चैत्र पूर्णिमा पर।",
    significanceEn:
      "Celebrates the birth of Lord Hanuman on the full moon following Rama Navami — the embodiment of strength, devotion, and selfless service.",
    observancesHi:
      "प्रातः मन्दिर दर्शन, सिन्दूर-अभिषेक, हनुमान चालीसा एवं सुन्दरकाण्ड पाठ, भण्डारे, व्रत; लाल/केसरिया वस्त्र।",
    regionalNotes:
      "उत्तर भारत में चैत्र पूर्णिमा (20 अप्रैल 2027); तमिलनाडु में दिसंबर-जनवरी (मार्गलि), तेलुगु परम्परा में 31 मई 2027।",
    sourceUrls: [
      "https://www.drikpanchang.com/festivals/hanuman-jayanti/hanuman-jayanti-date-time.html",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "krishna-janmashtami-2027",
    nameEn: "Krishna Janmashtami",
    nameHi: "कृष्ण जन्माष्टमी",
    dateIso: "2027-08-25",
    tithi: "कृष्ण पक्ष भाद्रपद अष्टमी; तिथि 24 अगस्त रात्रि 8:24 से 25 अगस्त रात्रि 7:19 तक; निशिता पूजा ~12:01–12:45 AM (26 अगस्त, दिल्ली)",
    significanceHi:
      "भगवान् कृष्ण के मध्यरात्रि-जन्म का उत्सव, जैसा भागवत पुराण में वर्णित है; मथुरा कारागृह की दिव्य घटना।",
    significanceEn:
      "Celebrates the midnight birth of Lord Krishna in the Mathura prison, as narrated in the Bhagavata Purana.",
    observancesHi:
      "मध्यरात्रि तक व्रत, निशिता-काल पूजा, झूला-पालना उत्सव, भागवत पाठ, पारण 26 अगस्त प्रातः 11:42 के बाद; अगले दिन दही-हांडी।",
    regionalNotes:
      "उत्तर भारत 25 अगस्त 2027; केरल में अष्टमी रोहिणी 24 अगस्त; महाराष्ट्र में दही-हांडी; मथुरा-वृन्दावन-मणिपुर में रासलीला।",
    sourceUrls: [
      "https://www.drikpanchang.com/dashavatara/lord-krishna/krishna-janmashtami-date-time.html",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "ganesh-chaturthi-2027",
    nameEn: "Ganesh Chaturthi",
    nameHi: "गणेश चतुर्थी (विनायक चतुर्थी)",
    dateIso: "2027-09-04",
    tithi: "शुक्ल पक्ष भाद्रपद चतुर्थी; तिथि 3 सितम्बर 2:18 PM से; मध्याह्न पूजा 11:04 AM–12:25 PM (दिल्ली)",
    significanceHi:
      "विघ्नहर्ता एवं शुभारम्भ के देवता गणेश जी का जन्मोत्सव; घरों और सार्वजनिक मण्डपों में मृण्मूर्ति-स्थापना।",
    significanceEn:
      "Celebrates the birth of Lord Ganesha, remover of obstacles and god of beginnings, with clay-idol installations at homes and pandals.",
    observancesHi:
      "प्राणप्रतिष्ठा, प्रतिदिन आरती एवं मोदक-अर्पण (1.5–10 दिन), चतुर्थी-रात्रि चन्द्र-दर्शन वर्जन, विसर्जन अनन्त चतुर्दशी (14 सितम्बर 2027) पर।",
    regionalNotes:
      "महाराष्ट्र में सर्वाधिक भव्य (लालबागचा राजा आदि); आन्ध्र/तेलंगाना-कर्नाटक में विनायक चविथी; तमिलनाडु में पिल्लैयार चतुर्थी।",
    sourceUrls: [
      "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "sharadiya-navratri-2027",
    nameEn: "Sharadiya Navratri (begins)",
    nameHi: "शारदीय नवरात्रि (आरम्भ)",
    dateIso: "2027-09-30",
    tithi: "शुक्ल पक्ष आश्विन प्रतिपदा; तिथि 30 सितम्बर प्रातः 8:05 से 1 अक्टूबर प्रातः 5:34 तक; घटस्थापना 30 सितम्बर",
    significanceHi:
      "नवदुर्गा की नौ-रात्रि उपासना; दुर्गा जी की महिषासुर-विजय का उत्सव; दुर्गा पूजा एवं विजयादशमी में समापन।",
    significanceEn:
      "The nine nights honoring the nine forms of Goddess Durga and her victory over Mahishasura, culminating in Durga Puja and Vijayadashami.",
    observancesHi:
      "घटस्थापना, प्रतिदिन नवदुर्गा रूप-पूजन, व्रत, गरबा-डांडिया (गुजरात), दुर्गा पूजा पण्डाल (बंगाल), कन्या पूजन; अष्टमी 7 अक्टूबर, विजयादशमी 9 अक्टूबर 2027।",
    regionalNotes:
      "बंगाल-ओडिशा-असम में दुर्गा पूजा; गुजरात में गरबा; मैसूर दशहरा एवं कुल्लू दशहरा; 2027 में अष्टमी दो दिन (7–8 अक्टूबर)।",
    sourceUrls: [
      "https://www.drikpanchang.com/navratri/ashwin-shardiya-navratri-dates.html?year=2027",
    ],
    lastVerified: "2026-10-24",
  },
  {
    slug: "diwali-2027",
    nameEn: "Diwali (Lakshmi Puja)",
    nameHi: "दीपावली (लक्ष्मी पूजा)",
    dateIso: "2027-10-29",
    tithi: "कृष्ण पक्ष कार्तिक अमावस्या; लक्ष्मी पूजा मुहूर्त ~5:54–7:50 PM प्रदोष काल (दिल्ली)",
    significanceHi:
      "प्रकाश-पर्व: राम की चौदह वर्ष के वनवास के पश्चात अयोध्या-वापसी, तथा लक्ष्मी जी की विचरण-रात्रि; अन्धकार पर प्रकाश की विजय।",
    significanceEn:
      "The festival of lights — Rama's return to Ayodhya and the night of Lakshmi's blessing; the triumph of light over darkness.",
    observancesHi:
      "घर की सजावट एवं दीप-रंगोली, प्रदोष काल में लक्ष्मी-गणेश पूजा, मिठाई-उपहार, चोपड़ा पूजन; पंच-दिवसीय उत्सव — धनतेरस (27 अक्टूबर) से भैया दूज (31 अक्टूबर) 2027।",
    regionalNotes:
      "दक्षिण में दीपावली मुख्यतः नरक चतुर्दशी प्रातः (28 अक्टूबर 2027); बंगाल में काली पूजा; गुजरात में नया विक्रम संवत्।",
    sourceUrls: [
      "https://www.drikpanchang.com/diwali/diwali-puja-calendar.html?year=2027",
    ],
    lastVerified: "2026-10-24",
  },
];

/** Festivals with the given upcoming occurrence on/after the given day. */
export function upcomingFestivals(fromDayKey: string, limit = 6): Festival[] {
  return FESTIVALS.filter((f) => f.dateIso >= fromDayKey)
    .sort((a, b) => a.dateIso.localeCompare(b.dateIso))
    .slice(0, limit);
}

/** Festival happening on (or most recently passed within 1 day of) the given day. */
export function festivalForDay(dayKey: string): Festival | undefined {
  return FESTIVALS.find((f) => f.dateIso === dayKey);
}

export function findFestival(slug: string): Festival | undefined {
  return FESTIVALS.find((f) => f.slug === slug);
}
