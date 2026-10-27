// VERIFIED saint records for the landing-page "संत दर्शन" showcase.
//
// Accuracy policy (owner brief): every name, title, date, and claim below is
// traceable to a URL in `sources`, and every photo is a Wikimedia Commons file
// under a free licence (CC BY / CC BY-SA / CC0 / public domain) that was
// visually cross-checked against independent news photographs of the same
// person. Records without a verifiable free photo keep `image: null` and sort
// last. `verifiedOn` is the research date — re-verify before editing.
//
// Photo policy: direct upload.wikimedia.org URLs only (whitelisted in
// next.config.ts); the Commons file page is kept for attribution.

export interface SadhuImage {
  url: string;
  pageUrl: string;
  credit: string;
  license: string;
  altHi: string;
  width: number;
  height: number;
}

export interface SadhuRecord {
  id: string;
  nameHi: string;
  nameEn: string;
  padHi: string;
  bioHi: string;
  originHi: string;
  memorial: boolean;
  verified: boolean;
  order: number;
  image: SadhuImage | null;
  sources: string[];
  verifiedOn: string;
}

export const SADHUS: SadhuRecord[] = [
  {
    id: "saint-kailashanand-giri",
    nameHi: "आचार्य महामंडलेश्वर स्वामी कैलाशानंद गिरि जी महाराज",
    nameEn: "Acharya Mahamandaleshwar Swami Kailashanand Giri",
    padHi: "आचार्य महामंडलेश्वर — श्री पंचायती अखाड़ा निरंजनी",
    bioHi:
      "श्री पंचायती अखाड़ा निरंजनी के आचार्य महामंडलेश्वर एवं निरंजन पीठ के पीठाधीश्वर हैं। 2021 में वे निरंजनी अखाड़े के आचार्य महामंडलेश्वर बने; इससे पूर्व अग्नि अखाड़े में भी यही पद सुशोभित किया। हरिद्वार के श्री दक्षिण काली मंदिर से संबद्ध होकर सावन एवं नवरात्रि की कठोर तपस्या तथा सनातन धर्म के प्रचार-प्रसार हेतु श्रद्धेय हैं।",
    originHi: "जमुई, बिहार",
    memorial: false,
    verified: true,
    order: 1,
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Swami_Kailashanand_Giri_Ji.png",
      pageUrl: "https://commons.wikimedia.org/wiki/File:Swami_Kailashanand_Giri_Ji.png",
      credit: "Jahviraa9 (Wikimedia Commons)",
      license: "CC BY-SA 4.0",
      altHi:
        "आचार्य महामंडलेश्वर स्वामी कैलाशानंद गिरि जी महाराज — भगवा वस्त्र, तिलक एवं रुद्राक्ष माला के साथ",
      width: 1027,
      height: 1080,
    },
    sources: [
      "https://www.etvbharat.com/en/!lifestyle/maha-kumbh-mela-2025-know-who-acharya-kailashanand-giri-is-spiritual-guru-of-lauren-powell-jobs-wife-of-steve-jobs-enn25011306553",
      "https://www.lokmattimes.com/national/grand-celebration-marks-fifth-sannyasa-initiation-birth-anniversary-of-swami-kailashanand-giri-in-haridwar/",
      "https://english.bharatexpress.com/india/sawan-fourth-monday-27-hour-spiritual-vigil-draws-devotees-to-haridwar-temple-291482",
    ],
    verifiedOn: "2026-10-27",
  },
  {
    id: "saint-narendra-giri",
    nameHi: "श्री महंत नरेंद्र गिरि जी महाराज",
    nameEn: "Mahant Narendra Giri",
    padHi: "महंत, बाघंबरी मठ — सचिव, श्री पंचायती अखाड़ा निरंजनी",
    bioHi:
      "प्रयागराज के बाघंबरी मठ एवं बड़े हनुमान मंदिर के महंत तथा श्री पंचायती अखाड़ा निरंजनी के सचिव रहे। 2014 से 2021 तक अखिल भारतीय अखाड़ा परिषद के अध्यक्ष के रूप में उन्होंने संत-समाज एवं सनातन धर्म का मार्गदर्शन किया। 2021 में ब्रह्मलीन।",
    originHi: "प्रयागराज, उत्तर प्रदेश",
    memorial: true,
    verified: true,
    order: 2,
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Narendra_Giri.jpg",
      pageUrl: "https://commons.wikimedia.org/wiki/File:Narendra_Giri.jpg",
      credit: "Lgoyal786 (Wikimedia Commons)",
      license: "CC BY-SA 4.0",
      altHi:
        "श्री महंत नरेंद्र गिरि जी महाराज — भगवा वस्त्र, त्रिपुंड तिलक एवं रुद्राक्ष माला में ध्यानमग्न",
      width: 2319,
      height: 3319,
    },
    sources: [
      "https://en.wikipedia.org/wiki/Narendra_Giri",
      "https://indianexpress.com/article/cities/lucknow/math-to-name-mahant-giris-successor-if-suicide-note-is-fake-niranjani-akhara-7530556/",
    ],
    verifiedOn: "2026-10-27",
  },
  {
    id: "saint-chinmayananda-saraswati",
    nameHi: "स्वामी चिन्मयानंद सरस्वती",
    nameEn: "Swami Chinmayananda Saraswati",
    padHi: "आचार्य — चिन्मय मिशन के संस्थापक",
    bioHi:
      "अद्वैत वेदांत के प्रकांड विद्वान् एवं चिन्मय मिशन के संस्थापक। गीता तथा उपनिषदों पर ज्ञान-यज्ञों के माध्यम से उन्होंने सनातन ज्ञान का विश्वव्यापी प्रचार किया। 1916 में केरल में जन्मे स्वामी जी ने स्वामी शिवानंद सरस्वती से संन्यास-दीक्षा ली और 1993 में ब्रह्मलीन हुए।",
    originHi: "केरल, भारत",
    memorial: true,
    verified: true,
    order: 3,
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sourire_coul_1.jpg",
      pageUrl: "https://commons.wikimedia.org/wiki/File:Sourire_coul_1.jpg",
      credit: "Chmadeline (Wikimedia Commons)",
      license: "Public domain",
      altHi: "स्वामी चिन्मयानंद सरस्वती — श्वेत दाढ़ी, चश्मा एवं भगवा वस्त्र में मुस्कुराते हुए",
      width: 2000,
      height: 3068,
    },
    sources: [
      "https://en.wikipedia.org/wiki/Chinmayananda_Saraswati",
      "https://www.chinmayamission.com/",
    ],
    verifiedOn: "2026-10-27",
  },
  {
    id: "saint-narayana-guru",
    nameHi: "श्री नारायण गुरु",
    nameEn: "Sree Narayana Guru",
    padHi: "दार्शनिक एवं समाज-सुधारक संत",
    bioHi:
      "केरल के महान दार्शनिक एवं समाज-सुधारक संत। 'एक जाति, एक धर्म, एक ईश्वर' का संदेश देकर उन्होंने सामाजिक समरसता एवं आत्म-गौरव की चेतना जगाई। अद्वैत वेदांत पर आधारित अनेक ग्रंथों के रचयिता श्री नारायण गुरु 1928 में ब्रह्मलीन हुए।",
    originHi: "केरल, भारत",
    memorial: true,
    verified: true,
    order: 4,
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Sree_Narayana_guru_at_Meditation.jpg",
      pageUrl: "https://commons.wikimedia.org/wiki/File:Sree_Narayana_guru_at_Meditation.jpg",
      credit: "अज्ञात चित्रकार, केरल सांस्कृतिक विभाग (Wikimedia Commons)",
      license: "Public domain",
      altHi: "श्री नारायण गुरु — वृक्ष के नीचे ध्यान-मुद्रा में बैठे हुए (1905 का दुर्लभ चित्र)",
      width: 756,
      height: 1024,
    },
    sources: [
      "https://en.wikipedia.org/wiki/Narayana_Guru",
      "https://commons.wikimedia.org/wiki/File:Sree_Narayana_guru_at_Meditation.jpg",
    ],
    verifiedOn: "2026-10-27",
  },
  {
    id: "saint-sk-narayan-giri",
    nameHi: "महामंडलेश्वर एस. के. नारायण गिरि जी महाराज (गोल्डन बाबा)",
    nameEn: "Mahamandaleshwar S. K. Narayan Giri (Golden Baba)",
    padHi: "महामंडलेश्वर — श्री पंचायती अखाड़ा निरंजनी",
    bioHi:
      "श्री पंचायती अखाड़ा निरंजनी के महामंडलेश्वर; मूल निवास केरल। महाकुम्भ 2025 में लगभग चार किलोग्राम स्वर्ण आभूषण धारण करने हेतु चर्चित हुए — उनके अनुसार ये आभूषण गुरु-भक्ति एवं साधना के प्रतीक हैं। धर्म एवं शिक्षा के प्रचार-प्रसार में सक्रिय।",
    originHi: "केरल, भारत",
    memorial: false,
    verified: true,
    order: 5,
    image: null,
    sources: [
      "https://timesofindia.indiatimes.com/city/allahabad/golden-baba-who-wore-rs-6-crore-gold-jewellery-seers-shine-at-prayagraj-maha-kumbh-mela/articleshowprint/117368535.cms",
      "https://www.amritvichar.com/uttar-pradesh/prayagraj/the-glory-of-%22golden-baba%22-spread-in-maha-kumbh--gold-worth-6-crores-on-his-body-became-the-center-of-attraction/article-517387",
      "https://navbharattimes.indiatimes.com/state/uttar-pradesh/allahabad/prayagraj-news-know-about-golden-baba-aka-narayan-giri/articleshow/117387991.cms",
    ],
    verifiedOn: "2026-10-27",
  },
];
