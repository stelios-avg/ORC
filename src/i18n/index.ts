export type Lang = "el" | "en";
export const defaultLang: Lang = "el";

export function getLang(pathname: string): Lang {
  return pathname.startsWith("/en") ? "en" : "el";
}

export function getAlternatePath(pathname: string, currentLang: Lang): string {
  if (currentLang === "el") {
    return `/en${pathname === "/" ? "/" : pathname}`;
  }
  const stripped = pathname.replace(/^\/en/, "") || "/";
  return stripped;
}

// ─────────────────────────────────────────────────────────────────────────────
// Translation dictionaries
// ─────────────────────────────────────────────────────────────────────────────

const el = {
  lang: "el",
  htmlLang: "el",
  dir: "ltr" as const,

  /* Real contact details (matching the Fresha listing). */
  address: "Περικλέους 63, Στρόβολος 2021, Κύπρος",
  hours: [
    { day: "Δευ – Παρ", time: "09:00 – 13:30" },
    { day: "", time: "15:00 – 19:30" },
    { day: "Σαβ – Κυρ", time: "Κλειστά" },
  ],

  nav: {
    home: "Αρχική",
    bio: "Η ομάδα μας",
    services: "Υπηρεσίες",
    gallery: "Το κέντρο μας",
    contact: "Επικοινωνία",
    book: "Κλείστε ραντεβού",
    bookShort: "Ραντεβού",
    menu: "Μενού",
    close: "Κλείσιμο",
    switchLang: "EN",
    switchLangLabel: "Switch to English",
  },

  preloader: {
    tagline: "Κινηθείτε καλύτερα. Ζήστε καλύτερα.",
  },

  hero: {
    eyebrow: "Οστεοπαθητική · Φυσιοθεραπεία · Αποκατάσταση",
    title: "Επαναφέρετε\nτην κίνηση.",
    titleAccent: "Ανακτήστε τη ζωή σας.",
    subtitle:
      "Στο ORC Osteopathy & Rehabilitation Center, συνδυάζουμε εξειδικευμένη οστεοπαθητική και αποδεδειγμένη φυσιοθεραπεία για να ανακουφίσουμε τον πόνο, να επιταχύνουμε την αποκατάσταση και να σας κρατήσουμε στο καλύτερό σας — σε κάθε στάδιο της ζωής.",
    infoLabel: "Γενικές πληροφορίες",
    ctaPrimary: "Κλείστε ραντεβού",
    ctaSecondary: "Εξερευνήστε τις υπηρεσίες",
  },

  intro: {
    eyebrow: "Καλωσορίσατε στο ORC",
    title: "Φροντίδα σχεδιασμένη γύρω από εσάς, όχι το σύμπτωμα.",
    body: "Κάθε σώμα είναι διαφορετικό. Γι' αυτό ξεκινάμε με μια διεξοδική αξιολόγηση και σχεδιάζουμε ένα εξατομικευμένο πρόγραμμα θεραπείας που στοχεύει στην πραγματική αιτία της δυσφορίας σας — συνδυάζοντας χειροπρακτική θεραπεία, εξατομικευμένη άσκηση και εκπαίδευση για μόνιμα αποτελέσματα.",
    checks: [
      "Ολοκληρωμένες ατομικές αξιολογήσεις",
      "Αποδεδειγμένη, χειροπρακτική θεραπεία",
      "Εξατομικευμένα προγράμματα οικιακής άσκησης",
    ],
    bioLink: "Γνωρίστε τον θεραπευτή",
  },

  stats: [
    { value: "10+", label: "Χρόνια εμπειρίας" },
    { value: "5.000+", label: "Θεραπείες που πραγματοποιήθηκαν" },
    { value: "98%", label: "Ικανοποίηση ασθενών" },
  ],

  servicesPreview: {
    title: "Πώς μπορούμε να βοηθήσουμε",
    subtitle:
      "Από οξείες κακώσεις έως μακροχρόνιες παθήσεις, οι θεραπείες μας είναι σχεδιασμένες για να σας επιστρέψουν σε αυτό που αγαπάτε.",
    viewAll: "Δείτε όλες τις υπηρεσίες",
    items: [
      {
        title: "Φυσιοθεραπεία",
        desc: "Χειροπρακτική και ασκησιολογική θεραπεία για αποκατάσταση δύναμης, κινητικότητας και λειτουργικότητας.",
      },
      {
        title: "Οστεοπαθητική",
        desc: "Ολιστική χειροπρακτική αντιμετώπιση που απευθύνεται στη ρίζα του πόνου σας.",
      },
      {
        title: "Αθλητική Αποκατάσταση",
        desc: "Προγράμματα επιστροφής στον αθλητισμό για αθλητές που αναρρώνουν από κάκωση.",
      },
    ],
  },

  ctaBand: {
    title: "Έτοιμοι να κινηθείτε χωρίς πόνο;",
    subtitle:
      "Κλείστε το ραντεβού σας σήμερα. Χρειάζεται μόνο ένα λεπτό — και η αποκατάστασή σας ξεκινά τη στιγμή που το κάνετε.",
    cta: "Κλείστε ραντεβού",
  },

  /* Editorial teaser sections on the home page (medwest-style structure). */
  statements: [
    {
      eyebrow: "Φυσιοθεραπεία",
      title: "Υγεία με πρόγραμμα, εξατομικευμένη για εσάς.",
      link: "Οι υπηρεσίες μας",
      href: "/services/",
      img: "/images/home/physio.svg",
    },
    {
      eyebrow: "Ο χώρος μας",
      title: "Η ολιστική θεραπεία ξεκινά εδώ.",
      link: "Δείτε τον χώρο",
      href: "/gallery/",
      img: "/images/home/clinic.jpg",
    },
    {
      eyebrow: "Η ομάδα",
      title: "Πίσω από κάθε θεραπεία, ένας άνθρωπος.",
      link: "Γνωρίστε μας",
      href: "/bio/",
      img: "/images/home/team.svg",
    },
  ],

  booking: {
    title: "Κλείστε το ραντεβού σας",
    subtitle:
      "Μερικά γρήγορα στοιχεία και θα σας πάμε κατευθείαν στο ημερολόγιο κρατήσεών μας.",
    fullNameLabel: "Ονοματεπώνυμο",
    emailLabel: "Email",
    phoneLabel: "Τηλέφωνο",
    concernLabel: "Αιτία επίσκεψης",
    concernHint: "Περιγράψτε σύντομα τι σας απασχολεί",
    required: "*",
    consent:
      "Συνεχίζοντας συμφωνείτε να επικοινωνήσουμε μαζί σας για το ραντεβού σας. Χρησιμοποιούμε το Fresha για τη διαχείριση κρατήσεων· θα μεταφερθείτε εκεί για να επιλέξετε την ώρα σας.",
    submit: "Συνέχεια στην κράτηση",
    submitting: "Παρακαλώ περιμένετε…",
    closeLabel: "Κλείσιμο",
    errFullName: "Παρακαλώ εισάγετε το ονοματεπώνυμό σας.",
    errEmail: "Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.",
    errPhone: "Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου.",
    errConcern: "Παρακαλώ περιγράψτε σύντομα την αιτία της επίσκεψής σας.",
  },

  bioPage: {
    eyebrow: "Σχετικά",
    title: "Γνωρίστε τον θεραπευτή σας",
    subtitle:
      "Αφοσιωμένη, αποδεδειγμένη φροντίδα από έναν κλινικό που θεραπεύει τον άνθρωπο — όχι μόνο το πρόβλημα.",
    credentials: [
      "MSc Οστεοπαθητικής",
      "BSc (Hons) Φυσιοθεραπείας",
      "Πιστοποιημένος Θεραπευτής Αθλητικής Αποκατάστασης",
      "Εγγεγραμμένος και ασφαλισμένος επαγγελματίας",
    ],
    credTitle: "Πιστοποιήσεις",
    h2: "Πάθος για να βοηθάμε τους ανθρώπους να κινούνται",
    p1: "Με πάνω από μια δεκαετία κλινικής εμπειρίας, ο κύριος θεραπευτής μας έχει βοηθήσει χιλιάδες ασθενείς να ξεπεράσουν τον πόνο, να αναρρώσουν από κακώσεις και να ανακτήσουν την εμπιστοσύνη στο σώμα τους. Η φιλοσοφία στο ORC είναι απλή: ακούστε προσεκτικά, αξιολογήστε διεξοδικά και θεραπεύστε ολόκληρο τον άνθρωπο.",
    p2: "Συνδυάζοντας την ολιστική, χειροπρακτική προσέγγιση της οστεοπαθητικής με τις δομημένες, προοδευτικές μεθόδους της σύγχρονης φυσιοθεραπείας, κάθε θεραπευτικό πρόγραμμα είναι προσαρμοσμένο στους στόχους σας — είτε αυτό είναι το να περπατάτε χωρίς πόνο, να επιστρέψετε στον αθλητισμό ή απλά να απολαμβάνετε την καθημερινή ζωή ξανά.",
    p3: "Πέρα από την κλινική, ο θεραπευτής μας δεσμεύεται για συνεχή επαγγελματική ανάπτυξη, παραμένοντας στην αιχμή της επιστήμης αποκατάστασης ώστε να λαμβάνετε πάντα φροντίδα βασισμένη στα πιο πρόσφατα δεδομένα.",
    promiseTitle: "Η υπόσχεσή μας",
    promiseBody:
      "Δεν θα είστε ποτέ απλώς ένας αριθμός. Αναμένετε άνετες συνεδρίες, σαφείς εξηγήσεις και ένα πρόγραμμα που πραγματικά καταλαβαίνετε.",
    promiseCta: "Κλείστε μια συνεδρία",
    imgAlt: "Κύριος θεραπευτής ORC",
    imgPlaceholder: "Προσθέστε /images/practitioner.jpg",
  },

  servicesPage: {
    eyebrow: "Τι κάνουμε",
    title: "Οι υπηρεσίες μας",
    subtitle:
      "Ολοκληρωμένες, αποδεδειγμένες θεραπείες προσαρμοσμένες στο σώμα και τους στόχους σας.",
    bookBtn: "Κλείστε αυτή την υπηρεσία",
    unsureTitle: "Δεν είστε σίγουροι ποια υπηρεσία χρειάζεστε;",
    unsureSubtitle:
      "Κλείστε μια αρχική αξιολόγηση και θα σας καθοδηγήσουμε στο κατάλληλο πρόγραμμα.",
    cta: "Κλείστε ραντεβού",
    list: [
      {
        title: "Φυσιοθεραπεία",
        desc: "Αποκαταστήστε τη δύναμη, την κινητικότητα και τη λειτουργικότητα μετά από κάκωση, χειρουργείο ή χρόνιο πόνο μέσω χειροπρακτικής θεραπείας και στοχευμένης άσκησης.",
        points: ["Χειροπρακτική θεραπεία", "Εξατομικευμένη άσκηση", "Αποκατάσταση μετά χειρουργείο", "Νευρολογική αποκατάσταση"],
      },
      {
        title: "Οστεοπαθητική",
        desc: "Μια ολιστική, σφαιρική προσέγγιση με ήπιες χειροπρακτικές τεχνικές για βελτίωση κινητικότητας, ανακούφιση από τάση και αντιμετώπιση βαθύτερων αιτιών.",
        points: ["Κινητοποίηση σπονδύλων & αρθρώσεων", "Αποσυμπίεση μαλακών ιστών", "Ορθοστατική διόρθωση"],
      },
      {
        title: "Αθλητική Αποκατάσταση",
        desc: "Δομημένα προγράμματα επιστροφής στον αθλητισμό για αθλητές όλων των επιπέδων, από διαχείριση κάκωσης έως βελτιστοποίηση απόδοσης.",
        points: ["Αξιολόγηση κάκωσης", "Δύναμη & κατάσταση", "Δοκιμή επιστροφής στον αθλητισμό"],
      },
      {
        title: "Κλινική Πιλάτες",
        desc: "Εξατομικευμένα προγράμματα πιλάτες με ιατρική καθοδήγηση για ενδυνάμωση του κορμού, βελτίωση στάσης και αποκατάσταση μετά από τραυματισμό.",
        points: ["Ενδυνάμωση κορμού", "Βελτίωση στάσης", "Αποκατάσταση & πρόληψη"],
      },
    ],
    icons: [
      "M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5",
      "M12 2a4 4 0 100 8 4 4 0 000-8zM6 22v-3a6 6 0 0112 0v3",
      "M4 12h16M12 4v16M7 7l10 10M17 7L7 17",
      "M4 18h16M12 4v14M8 8l4-4 4 4",
    ],
  },

  galleryPage: {
    eyebrow: "Ο χώρος μας",
    title: "Γκαλερί",
    subtitle: "Ένας ήρεμος, σύγχρονος χώρος σχεδιασμένος για την άνεση και την αποκατάστασή σας.",
    ctaTitle: "Ελάτε να το δείτε μόνοι σας",
    ctaSubtitle: "Κλείστε μια επίσκεψη και δείτε πώς μπορούμε να σας βοηθήσουμε να κινηθείτε καλύτερα.",
    cta: "Κλείστε ραντεβού",
    imgAlt: "Φωτογραφία κλινικής ORC",
  },

  contactPage: {
    eyebrow: "Επικοινωνήστε",
    title: "Επικοινωνία",
    subtitle: "Έχετε απορίες πριν κλείσετε ραντεβού; Χαιρόμαστε να βοηθήσουμε.",
    visitTitle: "Επισκεφθείτε μας ή επικοινωνήστε",
    visitSubtitle:
      "Προτιμάτε να κλείσετε ραντεβού διαδικτυακά; Χρησιμοποιήστε το παρακάτω κουμπί — θα συμπληρώσετε μια σύντομη φόρμα και θα σας πάμε κατευθείαν στο ζωντανό ημερολόγιό μας.",
    addressLabel: "Διεύθυνση",
    phoneLabel: "Τηλέφωνο",
    emailLabel: "Email",
    hoursLabel: "Ωράριο λειτουργίας",
    cta: "Κλείστε ραντεβού",
    messageTitle: "Στείλτε μήνυμα",
    messageSubtitle:
      "Για γενικές ερωτήσεις. Για κράτηση, παρακαλώ χρησιμοποιήστε το κουμπί κράτησης.",
    nameLabel: "Ονοματεπώνυμο",
    emailFormLabel: "Email",
    messageLabel: "Μήνυμα",
    submitBtn: "Αποστολή μηνύματος",
    successMsg: "Ευχαριστούμε! Θα επικοινωνήσουμε σύντομα.",
    mapTitle: "Χάρτης τοποθεσίας ORC",
  },

  footer: {
    tagline: "Φροντίδα βασισμένη σε αποδείξεις στη φυσιοθεραπεία & οστεοπαθητική.",
    exploreTitle: "Εξερεύνηση",
    contactTitle: "Επικοινωνία",
    hoursTitle: "Ωράριο λειτουργίας",
    findUs: "Εδώ θα μας βρείτε",
    sayHello: "Πείτε μας γεια",
    followUs: "Ακολουθήστε μας",
    cta: "Κλείστε ραντεβού",
    rights: "Όλα τα δικαιώματα διατηρούνται.",
  },

  seo: {
    homeTitle: "ORC Osteopathy & Rehabilitation Center",
    homeDesc:
      "Εξειδικευμένη φυσιοθεραπεία και οστεοπαθητική στο ORC. Εξατομικευμένη, αποδεδειγμένη φροντίδα για ανακούφιση πόνου, αποκατάσταση κίνησης και καλύτερη απόδοση.",
    bioTitle: "Βιογραφικό",
    bioDesc: "Γνωρίστε τον θεραπευτή πίσω από το ORC Osteopathy & Rehabilitation Center.",
    servicesTitle: "Υπηρεσίες",
    servicesDesc: "Φυσιοθεραπεία, οστεοπαθητική, αθλητική αποκατάσταση και πολλά άλλα στο ORC.",
    galleryTitle: "Γκαλερί",
    galleryDesc: "Ρίξτε μια ματιά στο εσωτερικό του ORC Osteopathy & Rehabilitation Center.",
    contactTitle: "Επικοινωνία",
    contactDesc: "Επικοινωνήστε με το ORC Osteopathy & Rehabilitation Center.",
  },
};

const en = {
  lang: "en",
  htmlLang: "en",
  dir: "ltr" as const,

  /* Real contact details (matching the Fresha listing). */
  address: "Perikleous 63, Strovolos 2021, Cyprus",
  hours: [
    { day: "Mon – Fri", time: "09:00 – 13:30" },
    { day: "", time: "15:00 – 19:30" },
    { day: "Sat – Sun", time: "Closed" },
  ],

  nav: {
    home: "Home",
    bio: "Bio",
    services: "Services",
    gallery: "Gallery",
    contact: "Contact",
    book: "Book appointment",
    bookShort: "Book",
    menu: "Menu",
    close: "Close",
    switchLang: "ΕΛ",
    switchLangLabel: "Αλλαγή σε Ελληνικά",
  },

  preloader: {
    tagline: "Move better. Live better.",
  },

  hero: {
    eyebrow: "Osteopathy · Physiotherapy · Rehabilitation",
    title: "Restore movement.",
    titleAccent: "Reclaim your life.",
    subtitle:
      "At ORC Osteopathy & Rehabilitation Center, we combine expert osteopathy and evidence-based physiotherapy to relieve pain, accelerate recovery and keep you moving your best — at every stage of life.",
    infoLabel: "General information",
    ctaPrimary: "Book appointment",
    ctaSecondary: "Explore services",
  },

  intro: {
    eyebrow: "Welcome to ORC",
    title: "Care built around you, not the symptom.",
    body: "Every body is different. That's why we start with a thorough assessment, then design a personalised treatment plan that targets the real cause of your discomfort — combining manual therapy, tailored exercise and education so results last.",
    checks: [
      "Comprehensive one-on-one assessments",
      "Evidence-based, hands-on treatment",
      "Personalised home exercise programmes",
    ],
    bioLink: "Meet the practitioner",
  },

  stats: [
    { value: "10+", label: "Years of experience" },
    { value: "5,000+", label: "Treatments delivered" },
    { value: "98%", label: "Patient satisfaction" },
  ],

  servicesPreview: {
    title: "How we can help",
    subtitle:
      "From acute injuries to long-term conditions, our treatments are designed to get you back to doing what you love.",
    viewAll: "View all services",
    items: [
      {
        title: "Physiotherapy",
        desc: "Hands-on and exercise-based therapy to restore strength, mobility and function.",
      },
      {
        title: "Osteopathy",
        desc: "Whole-body manual treatment that addresses the root cause of your pain.",
      },
      {
        title: "Sports Rehabilitation",
        desc: "Return-to-play programmes for athletes recovering from injury.",
      },
    ],
  },

  ctaBand: {
    title: "Ready to move without pain?",
    subtitle:
      "Book your appointment today. It only takes a minute — and your recovery starts the moment you do.",
    cta: "Book appointment",
  },

  statements: [
    {
      eyebrow: "Physiotherapy",
      title: "Health by design, tailored to you.",
      link: "Our services",
      href: "/services/",
      img: "/images/home/physio.svg",
    },
    {
      eyebrow: "Our space",
      title: "Holistic healing starts here.",
      link: "See the clinic",
      href: "/gallery/",
      img: "/images/home/clinic.jpg",
    },
    {
      eyebrow: "The team",
      title: "Behind every treatment, a person.",
      link: "Meet us",
      href: "/bio/",
      img: "/images/home/team.svg",
    },
  ],

  booking: {
    title: "Book your appointment",
    subtitle:
      "A few quick details and we'll take you straight to our booking calendar.",
    fullNameLabel: "Full name",
    emailLabel: "Email",
    phoneLabel: "Phone number",
    concernLabel: "Reason for visit",
    concernHint: "Briefly describe what brings you in",
    required: "*",
    consent:
      "By continuing you agree to be contacted about your appointment. We use Fresha to manage bookings; you'll be taken there to pick your time.",
    submit: "Continue to booking",
    submitting: "Just a sec…",
    closeLabel: "Close booking form",
    errFullName: "Please enter your full name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please enter a valid phone number.",
    errConcern: "Please briefly describe the reason for your visit.",
  },

  bioPage: {
    eyebrow: "About",
    title: "Meet your practitioner",
    subtitle:
      "Dedicated, evidence-based care from a clinician who treats the person — not just the problem.",
    credentials: [
      "MSc Osteopathy",
      "BSc (Hons) Physiotherapy",
      "Certified Sports Rehabilitation Therapist",
      "Registered & insured practitioner",
    ],
    credTitle: "Credentials",
    h2: "A passion for helping people move",
    p1: "With over a decade of clinical experience, our lead practitioner has helped thousands of patients overcome pain, recover from injury and rediscover confidence in their bodies. The philosophy at ORC is simple: listen carefully, assess thoroughly, and treat the whole person.",
    p2: "Blending osteopathy's holistic, hands-on approach with the structured, progressive methods of modern physiotherapy, every treatment plan is tailored to your goals — whether that's walking pain-free, returning to sport, or simply enjoying daily life again.",
    p3: "Beyond the clinic, our practitioner is committed to ongoing professional development, staying at the forefront of rehabilitation science so you always receive care grounded in the latest evidence.",
    promiseTitle: "Our promise",
    promiseBody:
      "You'll never be just a number. Expect unhurried appointments, clear explanations, and a plan you actually understand.",
    promiseCta: "Book a consultation",
    imgAlt: "ORC lead practitioner",
    imgPlaceholder: "Add /images/practitioner.jpg",
  },

  servicesPage: {
    eyebrow: "What we do",
    title: "Our services",
    subtitle:
      "Comprehensive, evidence-based treatments tailored to your body and your goals.",
    bookBtn: "Book this service",
    unsureTitle: "Not sure which service you need?",
    unsureSubtitle: "Book an initial assessment and we'll guide you to the right plan.",
    cta: "Book appointment",
    list: [
      {
        title: "Physiotherapy",
        desc: "Restore strength, mobility and function after injury, surgery or chronic pain through hands-on therapy and targeted exercise.",
        points: ["Manual therapy", "Exercise prescription", "Post-surgical rehab", "Neurological rehabilitation"],
      },
      {
        title: "Osteopathy",
        desc: "A holistic, whole-body approach using gentle manual techniques to improve mobility, relieve tension and address root causes.",
        points: ["Spinal & joint mobilisation", "Soft tissue release", "Postural correction"],
      },
      {
        title: "Sports Rehabilitation",
        desc: "Structured return-to-play programmes for athletes of all levels, from injury management to performance optimisation.",
        points: ["Injury assessment", "Strength & conditioning", "Return-to-sport testing"],
      },
      {
        title: "Clinical Pilates",
        desc: "Individualised, medically guided Pilates programmes to strengthen your core, improve posture and support recovery after injury.",
        points: ["Core strengthening", "Posture improvement", "Rehabilitation & prevention"],
      },
    ],
    icons: [
      "M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5",
      "M12 2a4 4 0 100 8 4 4 0 000-8zM6 22v-3a6 6 0 0112 0v3",
      "M4 12h16M12 4v16M7 7l10 10M17 7L7 17",
      "M4 18h16M12 4v14M8 8l4-4 4 4",
    ],
  },

  galleryPage: {
    eyebrow: "Our space",
    title: "Gallery",
    subtitle: "A calm, modern clinic designed for your comfort and recovery.",
    ctaTitle: "Come experience it yourself",
    ctaSubtitle: "Book a visit and see how we can help you move better.",
    cta: "Book appointment",
    imgAlt: "ORC clinic photo",
  },

  contactPage: {
    eyebrow: "Get in touch",
    title: "Contact us",
    subtitle: "Questions before booking? We're happy to help.",
    visitTitle: "Visit or reach out",
    visitSubtitle:
      "Prefer to book online? Use the button below — you'll fill in a quick form and we'll take you straight to our live calendar.",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Opening hours",
    cta: "Book appointment",
    messageTitle: "Send a message",
    messageSubtitle:
      "For general enquiries. To book, please use the booking button.",
    nameLabel: "Name",
    emailFormLabel: "Email",
    messageLabel: "Message",
    submitBtn: "Send message",
    successMsg: "Thanks! We'll be in touch shortly.",
    mapTitle: "ORC location map",
  },

  footer: {
    tagline: "Evidence-based physiotherapy & osteopathy care.",
    exploreTitle: "Explore",
    contactTitle: "Contact",
    hoursTitle: "Opening hours",
    findUs: "Find us here",
    sayHello: "Say hello",
    followUs: "Follow us",
    cta: "Book appointment",
    rights: "All rights reserved.",
  },

  seo: {
    homeTitle: "ORC Osteopathy & Rehabilitation Center",
    homeDesc:
      "Expert physiotherapy and osteopathy at ORC. Personalised, evidence-based care to relieve pain, restore movement and keep you performing at your best.",
    bioTitle: "Bio",
    bioDesc: "Meet the practitioner behind ORC Osteopathy & Rehabilitation Center.",
    servicesTitle: "Services",
    servicesDesc: "Physiotherapy, osteopathy, sports rehabilitation and more at ORC.",
    galleryTitle: "Gallery",
    galleryDesc: "Take a look inside ORC Osteopathy & Rehabilitation Center.",
    contactTitle: "Contact",
    contactDesc: "Get in touch with ORC Osteopathy & Rehabilitation Center.",
  },
};

export const translations = { el, en } as const;
export type Translations = typeof el;

export function useTranslations(lang: Lang): Translations {
  return translations[lang] as Translations;
}
