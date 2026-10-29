// lib/i18n.ts — lightweight, dependency-free message catalogue.
//
// Language = UI chrome only (navigation, header/footer, auth forms, buttons).
// Sacred/product content (mantras, scriptures, saint bios, temple data) stays in
// Hindi by contract (AGENT.md §2: Hindi strings are contractual) — the English
// locale translates the shell so non-Hindi visitors can navigate, never the
// scripture itself.
//
// Locale routing is URL-based (`/en/...`, `/hi/...`). next-intl persists it in
// the NEXT_LOCALE cookie for unprefixed entry points. Default is English.
export const LOCALES = ["en", "hi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const hi = {
  "about.title": "परिचय",
  "about.intro": "सनातन श्री निरंजनी — श्री पंचायती अखाड़ा निरंजनी का डिजिटल द्वार — सनातन धर्म की साधना, दर्शन और सेवा को रोज़मर्रा के जीवन से जोड़ने का प्रयास है।",
  "about.mission": "हमारा उद्देश्य सीधा है:",
  "about.point1": "प्रतिदिन उपयोगी आध्यात्मिक सामग्री — दर्शन, प्रेरणा, मंत्र, पर्व-मार्गदर्शन।",
  "about.point2": "दिल्ली NCR के वास्तविक मन्दिरों की सत्यापित, स्रोत-सहित जानकारी।",
  "about.point3": "अखाड़े की सेवाएँ — गौ सेवा, वृक्षारोपण, पूजा बुकिंग, पूजा सामग्री।",
  "about.point4": "आदरपूर्ण भाषा, सांस्कृतिक प्रामाणिकता और स्पष्ट स्रोत-विवरण।",
  "about.principles": "हमारे सिद्धान्त",
  "about.truth": "सत्य: जो सत्यापित नहीं है, उसे सत्यापित ही लिखा जाता है। तिथि, समय व सूचना के स्रोत दिखाए जाते हैं।",
  "about.respect": "आदर: किसी सम्प्रदाय की श्रेष्ठता का दावा नहीं; सभी परम्पराओं का समान सम्मान।",
  "about.privacy": "निजता: प्राथमिकताएँ व सेव-सूची आपके उपकरण पर रहती हैं — खाता बनाना आवश्यक नहीं।",
  "about.service": "सेवा: विज्ञापन-प्रेरित नहीं, भक्ति-प्रेरित अनुभव।",
  "about.corrections": "सुझाव व सुधार",
  "about.correctionPrompt": "कोई गलती या सुझाव?",
  "about.correctionLink": "स्रोत एवं सुधार पृष्ठ",
  "about.correctionEnd": "पर बताया गया मार्ग अपनाएँ। हर सुधार-सुझाव श्रद्धा व सत्य की सेवा है।",
  // ---- shell / header ----
  "nav.daily": "दैनिक दर्शन",
  "nav.temples": "मंदिर",
  "nav.festivals": "पर्व",
  "nav.mantras": "मंत्र",
  "header.navAria": "साइट पृष्ठ",
  "header.search": "खोज",
  "header.saved": "सहेजे गए",
  "header.notifications": "सूचनाएँ",
  "header.cart": "पूजा स्टोर कार्ट",
  "header.account": "खाता",
  "header.login": "लॉग इन",
  "header.register": "पंजीकरण",
  "header.profile": "प्रोफ़ाइल",
  "header.logout": "लॉग आउट",
  "header.menu": "मेनू",
  "header.greeting": "नमस्ते",

  // ---- search bar ----
  "search.label": "खोजें",
  "search.placeholder": "मंदिर, संत, गाड़ी पूजन या नाम से खोजें...",
  "search.nearby": "पास के मंदिर",

  // ---- language toggle ----
  "lang.label": "भाषा",
  "lang.switchTo": "भाषा बदलें (English)",
  "lang.hi": "हिन्दी",
  "lang.en": "English",
  "lang.short": "हिं",

  // ---- bottom nav ----
  "bottom.home": "होम",
  "bottom.darshan": "दर्शन",
  "bottom.temples": "मंदिर",
  "bottom.mantras": "मंत्र",
  "bottom.menu": "मेनू",
  "bottom.aria": "मुख्य नेविगेशन",

  // ---- footer ----
  "footer.col.daily": "दैनिक साधना",
  "footer.col.temples": "मंदिर दर्शन",
  "footer.col.services": "अखाड़ा सेवाएँ",
  "footer.col.info": "जानकारी",
  "footer.daily.darshan": "दैनिक दर्शन",
  "footer.daily.mantras": "मंत्र एवं स्तोत्र",
  "footer.daily.festivals": "पर्व एवं कैलेण्डर",
  "footer.daily.granth": "ग्रंथ (गीता, जप माला)",
  "footer.temples.list": "मंदिर सूची (दिल्ली NCR)",
  "footer.temples.shaiva": "शिव मंदिर",
  "footer.temples.shakta": "देवी मंदिर",
  "footer.temples.vaishnava": "विष्णु / कृष्ण मंदिर",
  "footer.services.gau": "गौ सेवा एवं वृक्षारोपण",
  "footer.services.bookings": "पूजा बुकिंग",
  "footer.services.store": "पूजा स्टोर",
  "footer.services.kumbh": "महाकुम्भ 2027",
  "footer.info.about": "परिचय",
  "footer.info.sources": "स्रोत एवं सुधार",
  "footer.info.privacy": "गोपनीयता नीति",
  "footer.info.terms": "उपयोग की शर्तें",
  "footer.blurb":
    "सनातन धर्म का डिजिटल द्वार — दैनिक दर्शन, सत्यापित मंदिर सूचना, मंत्र, पर्व-मार्गदर्शिका और श्रद्धा की सेवाएँ। आपकी प्राथमिकताएँ आपके उपकरण पर ही रहती हैं।",
  "footer.correction":
    "तिथियों और मंदिर-सूचना के स्रोत दिए गए हैं; कोई गलती मिले तो सुधार सुझाएँ।",
  "footer.copyright": "श्रद्धा एवं सेवा-भाव से।",
  "footer.correctionLink": "सुधार सुझाएँ",

  // ---- auth: shared ----
  "auth.name": "पूरा नाम",
  "auth.namePlaceholder": "जैसे: राम भक्त",
  "auth.email": "ईमेल पता",
  "auth.emailPlaceholder": "जैसे: bhakt@example.com",
  "auth.phone": "मोबाइल नंबर (वैकल्पिक)",
  "auth.phonePlaceholder": "10 अंकों का मोबाइल नंबर",
  "auth.password": "पासवर्ड",
  "auth.passwordPlaceholder": "कम से कम 8 अक्षर",
  "auth.submitting": "प्रतीक्षा करें…",
  "auth.error.email": "कृपया सही ईमेल पता लिखें।",
  "auth.error.password": "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
  "auth.error.name": "कृपया अपना पूरा नाम लिखें।",
  "auth.error.phone": "कृपया 10 अंकों का मोबाइल नंबर लिखें।",
  "auth.error.generic": "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।",
  "auth.error.offline": "सेवा इस समय उपलब्ध नहीं है, कृपया पुनः प्रयास करें।",

  // ---- auth: login ----
  "auth.login.title": "लॉग इन करें",
  "auth.login.subtitle": "अपने खाते से जुड़कर सेवा, बुकिंग एवं दान की जानकारी देखें।",
  "auth.login.submit": "लॉग इन",
  "auth.login.done": "लॉग इन सफल हुआ।",
  "auth.noAccount": "खाता नहीं है?",
  "auth.registerLink": "नया खाता बनाएँ",

  // ---- auth: register ----
  "auth.register.title": "पंजीकरण करें",
  "auth.register.subtitle": "सनातन परिवार से जुड़ें — भक्त, संत अथवा स्वयंसेवक के रूप में।",
  "auth.register.submit": "खाता बनाएँ",
  "auth.register.done": "पंजीकरण सफल हुआ।",
  "auth.haveAccount": "पहले से खाता है?",
  "auth.loginLink": "लॉग इन करें",
  "auth.role.label": "आप किस रूप में जुड़ना चाहते हैं?",
  "auth.role.user": "भक्त",
  "auth.role.userDesc": "दर्शन, पर्व, बुकिंग एवं सेवा की जानकारी।",
  "auth.role.sadhu": "संत",
  "auth.role.sadhuDesc": "संत के रूप में पंजीकरण — प्रशासन सत्यापन के बाद।",
  "auth.role.volunteer": "स्वयंसेवक",
  "auth.role.volunteerDesc": "अखाड़ा सेवा एवं आयोजनों में सहयोग।",
  "auth.sadhuNote": "संत पंजीकरण पर सत्यापन तक “सत्यापन लंबित” रहेगा।",

  // ---- auth: profile ----
  "auth.profile.title": "मेरी प्रोफ़ाइल",
  "auth.profile.subtitle": "आपका खाता, भूमिका एवं सेवा-विवरण।",
  "auth.profile.member": "सदस्यता",
  "auth.profile.digitalId": "डिजिटल परिचय पत्र",
  "auth.profile.myBookings": "मेरी बुकिंग देखें",
  "auth.profile.manage": "प्रोफ़ाइल एवं सेवा",
  "auth.profile.logout": "लॉग आउट",
  "auth.profile.logoutDone": "लॉग आउट सफल हुआ।",
  "auth.status.verified": "सत्यापित",
  "auth.status.pending": "सत्यापन लंबित",
  "auth.roleBadge.user": "भक्त",
  "auth.roleBadge.sadhu": "संत",
  "auth.roleBadge.volunteer": "स्वयंसेवक",
  "auth.roleBadge.admin": "प्रबंधक",
  "auth.loginRequired": "यह पृष्ठ देखने के लिए कृपया लॉग इन करें।",

  // ---- menu ----
  "menu.digitalId": "डिजिटल परिचय पत्र (आईडी एवं प्रमाण पत्र)",
  "menu.volunteerActive": "सेवा दल पास सक्रिय",
} as const;

export type MessageKey = keyof typeof hi;

const en: Record<MessageKey, string> = {
  "about.title": "About",
  "about.intro": "Sanatan Shri Niranjani, the digital gateway of Shri Panchayati Akhara Niranjani, connects the practice, darshan and service of Sanatan Dharma with everyday life.",
  "about.mission": "Our purpose is simple:",
  "about.point1": "Useful daily spiritual content: darshan, inspiration, mantras and festival guidance.",
  "about.point2": "Verified, sourced information about real temples across Delhi NCR.",
  "about.point3": "Akhara services including gau seva, tree planting, puja bookings and worship items.",
  "about.point4": "Respectful language, cultural authenticity and clear sources.",
  "about.principles": "Our principles",
  "about.truth": "Truth: Unverified information is never presented as verified. Sources, dates and times are shown.",
  "about.respect": "Respect: We make no claims of one tradition’s superiority and respect all traditions equally.",
  "about.privacy": "Privacy: Preferences and saved items stay on your device; an account is not required.",
  "about.service": "Service: An experience guided by devotion, not advertising.",
  "about.corrections": "Suggestions and corrections",
  "about.correctionPrompt": "Found an error or have a suggestion?",
  "about.correctionLink": "Visit Sources & Corrections",
  "about.correctionEnd": "for guidance. Every correction serves truth and devotion.",
  "nav.daily": "Daily Darshan",
  "nav.temples": "Temples",
  "nav.festivals": "Festivals",
  "nav.mantras": "Mantras",
  "header.navAria": "Site pages",
  "header.search": "Search",
  "header.saved": "Saved",
  "header.notifications": "Notifications",
  "header.cart": "Pooja store cart",
  "header.account": "Account",
  "header.login": "Log in",
  "header.register": "Sign up",
  "header.profile": "Profile",
  "header.logout": "Log out",
  "header.menu": "Menu",
  "header.greeting": "Namaste",

  "search.label": "Search",
  "search.placeholder": "Search temples, saints, vehicle pooja or by name…",
  "search.nearby": "Temples near me",

  "lang.label": "Language",
  "lang.switchTo": "Switch language (Hindi)",
  "lang.hi": "Hindi",
  "lang.en": "English",
  "lang.short": "EN",

  "bottom.home": "Home",
  "bottom.darshan": "Darshan",
  "bottom.temples": "Temples",
  "bottom.mantras": "Mantras",
  "bottom.menu": "Menu",
  "bottom.aria": "Main navigation",

  "footer.col.daily": "Daily Sadhana",
  "footer.col.temples": "Temple Darshan",
  "footer.col.services": "Akhara Services",
  "footer.col.info": "Information",
  "footer.daily.darshan": "Daily Darshan",
  "footer.daily.mantras": "Mantras & Stotras",
  "footer.daily.festivals": "Festivals & Calendar",
  "footer.daily.granth": "Scriptures (Gita, Jap Mala)",
  "footer.temples.list": "Temple list (Delhi NCR)",
  "footer.temples.shaiva": "Shiva temples",
  "footer.temples.shakta": "Devi temples",
  "footer.temples.vaishnava": "Vishnu / Krishna temples",
  "footer.services.gau": "Cow seva & tree plantation",
  "footer.services.bookings": "Pooja booking",
  "footer.services.store": "Pooja store",
  "footer.services.kumbh": "Mahakumbh 2027",
  "footer.info.about": "About",
  "footer.info.sources": "Sources & corrections",
  "footer.info.privacy": "Privacy policy",
  "footer.info.terms": "Terms of use",
  "footer.blurb":
    "A digital gateway to Sanatan Dharma — daily darshan, verified temple information, mantras, festival guidance and devotional services. Your preferences stay on your device.",
  "footer.correction":
    "Sources for dates and temple information are cited; please suggest a correction if you spot an error.",
  "footer.copyright": "With reverence and a spirit of service.",
  "footer.correctionLink": "Suggest a correction",

  "auth.name": "Full name",
  "auth.namePlaceholder": "e.g. Ram Bhakt",
  "auth.email": "Email address",
  "auth.emailPlaceholder": "e.g. bhakt@example.com",
  "auth.phone": "Mobile number (optional)",
  "auth.phonePlaceholder": "10-digit mobile number",
  "auth.password": "Password",
  "auth.passwordPlaceholder": "At least 8 characters",
  "auth.submitting": "Please wait…",
  "auth.error.email": "Please enter a valid email address.",
  "auth.error.password": "Password must be at least 8 characters long.",
  "auth.error.name": "Please enter your full name.",
  "auth.error.phone": "Please enter a 10-digit mobile number.",
  "auth.error.generic": "Something went wrong, please try again.",
  "auth.error.offline": "The service is unavailable right now, please try again.",

  "auth.login.title": "Log in",
  "auth.login.subtitle": "Sign in to see your seva, bookings and contributions.",
  "auth.login.submit": "Log in",
  "auth.login.done": "Logged in successfully.",
  "auth.noAccount": "Don't have an account?",
  "auth.registerLink": "Create an account",

  "auth.register.title": "Create account",
  "auth.register.subtitle": "Join the Sanatan family — as a devotee, sadhu or volunteer.",
  "auth.register.submit": "Create account",
  "auth.register.done": "Registration successful.",
  "auth.haveAccount": "Already have an account?",
  "auth.loginLink": "Log in",
  "auth.role.label": "How would you like to join?",
  "auth.role.user": "Devotee",
  "auth.role.userDesc": "Darshan, festivals, bookings and seva updates.",
  "auth.role.sadhu": "Sadhu",
  "auth.role.sadhuDesc": "Register as a sadhu — verified by the administration.",
  "auth.role.volunteer": "Volunteer",
  "auth.role.volunteerDesc": "Support akhara seva and events.",
  "auth.sadhuNote": "Sadhu registrations stay “verification pending” until approved.",

  "auth.profile.title": "My profile",
  "auth.profile.subtitle": "Your account, role and seva details.",
  "auth.profile.member": "Member since",
  "auth.profile.digitalId": "Digital ID",
  "auth.profile.myBookings": "View my bookings",
  "auth.profile.manage": "Profile & seva",
  "auth.profile.logout": "Log out",
  "auth.profile.logoutDone": "Logged out successfully.",
  "auth.status.verified": "Verified",
  "auth.status.pending": "Verification pending",
  "auth.roleBadge.user": "Devotee",
  "auth.roleBadge.sadhu": "Sadhu",
  "auth.roleBadge.volunteer": "Volunteer",
  "auth.roleBadge.admin": "Administrator",
  "auth.loginRequired": "Please log in to view this page.",

  "menu.digitalId": "Digital ID & certificate",
  "menu.volunteerActive": "Volunteer pass active",
};

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = { hi, en };

export function isLocale(value: unknown): value is Locale {
  return value === "hi" || value === "en";
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Translate a key for a locale (falls back to English, then the key itself). */
export function t(locale: Locale, key: MessageKey): string {
  return MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key;
}

export type Translator = (key: MessageKey) => string;

export function createTranslator(locale: Locale): Translator {
  return (key) => t(locale, key);
}

/** Locale-aware role label for badges. */
export function roleLabelKey(role: string): MessageKey {
  switch (role) {
    case "ADMIN":
      return "auth.roleBadge.admin";
    case "SADHU":
      return "auth.roleBadge.sadhu";
    case "VOLUNTEER":
      return "auth.roleBadge.volunteer";
    default:
      return "auth.roleBadge.user";
  }
}
