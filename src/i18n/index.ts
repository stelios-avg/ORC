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
    { day: "Δευ – Παρ", time: "08:00 – 19:00" },
    { day: "Σαβ – Κυρ", time: "Κλειστά" },
  ],

  nav: {
    home: "Αρχική",
    bio: "Η ομάδα μας",
    services: "Υπηρεσίες",
    gallery: "Ο χώρος μας",
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
      img: "/images/home/physio.png",
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
      "Επιλέξτε υπηρεσία, συμπληρώστε τα στοιχεία σας και μετά ημέρα και ώρα.",
    serviceLabel: "Υπηρεσία",
    serviceHint: "Η διαθεσιμότητα εξαρτάται από τον θεραπευτή της υπηρεσίας.",
    errService: "Παρακαλώ επιλέξτε υπηρεσία.",
    fullNameLabel: "Ονοματεπώνυμο",
    emailLabel: "Email",
    phoneLabel: "Τηλέφωνο",
    concernLabel: "Αιτία επίσκεψης",
    concernHint: "Περιγράψτε σύντομα τι σας απασχολεί",
    required: "*",
    consent:
      "Συνεχίζοντας συμφωνείτε να επικοινωνήσουμε μαζί σας για το ραντεβού σας.",
    submit: "Συνέχεια",
    submitting: "Παρακαλώ περιμένετε…",
    closeLabel: "Κλείσιμο",
    errFullName: "Παρακαλώ εισάγετε το ονοματεπώνυμό σας.",
    errEmail: "Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.",
    errPhone: "Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου.",
    errConcern: "Παρακαλώ περιγράψτε σύντομα την αιτία της επίσκεψής σας.",
    // step 2: date & time
    pickTitle: "Επιλέξτε ημέρα & ώρα",
    pickSubtitle: "Διάρκεια συνεδρίας: 45 λεπτά",
    pickDayHint: "Επιλέξτε μια ημέρα για να δείτε τις διαθέσιμες ώρες.",
    loadingSlots: "Φόρτωση διαθεσιμότητας…",
    noSlots: "Δεν υπάρχουν διαθέσιμες ώρες αυτή την ημέρα.",
    closedDay: "Κλειστά",
    back: "Πίσω",
    // step 3: confirm
    confirmTitle: "Επιβεβαίωση ραντεβού",
    confirmBtn: "Επιβεβαίωση κράτησης",
    booking: "Γίνεται κράτηση…",
    slotTaken: "Η ώρα μόλις κλείστηκε από άλλον. Παρακαλώ επιλέξτε άλλη.",
    bookError: "Κάτι πήγε στραβά. Δοκιμάστε ξανά ή καλέστε μας.",
    withTherapist: "με",
    // success
    successTitle: "Το ραντεβού σας κλείστηκε!",
    successMsg: "Θα επικοινωνήσουμε μαζί σας για επιβεβαίωση. Σας περιμένουμε!",
    successClose: "Τέλεια, ευχαριστώ",
  },

  bioPage: {
    eyebrow: "Σχετικά",
    title: "Η ομάδα μας",
    subtitle:
      "Αφοσιωμένη, αποδεδειγμένη φροντίδα από θεραπευτές που θεραπεύουν τον άνθρωπο — όχι μόνο το πρόβλημα.",
    team: [
      {
        name: "Χαράλαμπος Νεοκλέους",
        role: "Οστεοπαθητικός",
        img: "/images/team/charalambos.png",
        bio: "Ιδρυτής του ORC, ο Χαράλαμπος συνδυάζει την ολιστική, χειροπρακτική προσέγγιση της οστεοπαθητικής με σύγχρονες μεθόδους αποκατάστασης. Ακούει προσεκτικά, αξιολογεί διεξοδικά και θεραπεύει ολόκληρο τον άνθρωπο — όχι μόνο το σύμπτωμα.",
      },
      {
        name: "Ραφαέλλος Ονησιφόρου",
        role: "Φυσιοθεραπευτής",
        img: "/images/team/rafaellos.png",
        bio: "Ο Ραφαέλλος ειδικεύεται στην αξιολόγηση και αποκατάσταση μυοσκελετικών προβλημάτων. Με στοχευμένη θεραπευτική άσκηση και χειροπρακτικές τεχνικές, βοηθά τους ασθενείς να επιστρέψουν με ασφάλεια στην καθημερινότητα και τον αθλητισμό.",
      },
      {
        name: "Κωνσταντίνα Κιτρομηλίδη",
        role: "Φυσιοθεραπεύτρια & Pilates Instructor",
        img: "/images/team/konstantina.png",
        bio: "Η Κωνσταντίνα συνδυάζει τη φυσιοθεραπεία με το κλινικό πιλάτες, σχεδιάζοντας εξατομικευμένα προγράμματα ενδυνάμωσης, βελτίωσης στάσης και πρόληψης τραυματισμών για κάθε ασθενή.",
      },
    ],
    promiseTitle: "Η υπόσχεσή μας",
    promiseBody:
      "Δεν θα είστε ποτέ απλώς ένας αριθμός. Αναμένετε άνετες συνεδρίες, σαφείς εξηγήσεις και ένα πρόγραμμα που πραγματικά καταλαβαίνετε.",
    promiseCta: "Κλείστε μια συνεδρία",
  },

  servicesPage: {
    eyebrow: "Τι κάνουμε",
    title: "Οι υπηρεσίες μας",
    subtitle:
      "Ολοκληρωμένες, αποδεδειγμένες θεραπείες προσαρμοσμένες στο σώμα και τους στόχους σας.",
    bookBtn: "Κλείστε ραντεβού",
    servicesLabel: "Οι υπηρεσίες μας",
    servicesTagline: "Ολοκληρωμένες θεραπείες προσαρμοσμένες στις ανάγκες και στους στόχους κάθε ασθενή",
    learnMore: "Μάθετε περισσότερα",
    stats: [
      { value: "8+", label: "Χρόνια εμπειρίας" },
      { value: "1.500+", label: "Ικανοποιημένοι ασθενείς" },
      { value: "3", label: "Εξειδικευμένες υπηρεσίες" },
      { value: "100%", label: "Εξατομικευμένη φροντίδα" },
    ],
    whyLabel: "Γιατί να μας επιλέξετε",
    whyTitle: "Θεραπεία προσαρμοσμένη στον κάθε ασθενή",
    whyDesc: "Μοναδικός συνδυασμός οστεοπαθητικής και φυσιοθεραπείας, προσφέροντας μια ολοκληρωμένη προσέγγιση στη θεραπεία, την κίνηση και τη λειτουργικότητα του σώματος.",
    whyPoints: [
      "Εξειδικευμένη ομάδα θεραπευτών",
      "Σύγχρονες τεχνικές & εξοπλισμός",
      "Εξατομικευμένα προγράμματα αποκατάστασης",
      "Υποστήριξη σε κάθε βήμα της ανάρρωσης",
    ],
    whyImage: "/images/home/team.svg",
    unsureTitle: "Δεν είστε σίγουροι ποια υπηρεσία χρειάζεστε;",
    unsureSubtitle:
      "Κλείστε μια αρχική αξιολόγηση και θα σας καθοδηγήσουμε στο κατάλληλο πρόγραμμα.",
    cta: "Κλείστε ραντεβού",
    list: [
      {
        title: "Φυσιοθεραπεία",
        desc: "Αποκαταστήστε τη δύναμη, την κινητικότητα και τη λειτουργικότητα μετά από κάκωση, χειρουργείο ή χρόνιο πόνο μέσω χειροπρακτικής θεραπείας και στοχευμένης άσκησης.",
        points: [
          "Αποκατάσταση μετά χειρουργείο",
          "Νευρολογική αποκατάσταση",
          "Εξειδικευμένη αξιολόγηση και αποκατάσταση μυοσκελετικών προβλημάτων",
          "Θεραπευτική άσκηση και ενδυνάμωση",
          "Βελτίωση κινητικότητας και λειτουργικότητας",
          "Επανάκτηση σε καθημερινές και αθλητικές δραστηριότητες",
          "Αξιολόγηση κάκωσης",
          "Δύναμη & κατάσταση",
          "Δοκιμή επιστροφής στον αθλητισμό",
          "Μασάζ",
        ],
      },
      {
        title: "Οστεοπαθητική",
        desc: "Μια ολιστική, σφαιρική προσέγγιση με ήπιες χειροπρακτικές τεχνικές για βελτίωση κινητικότητας, ανακούφιση από τάση και αντιμετώπιση βαθύτερων αιτιών.",
        points: [
          "Ολιστική αξιολόγηση ολόκληρου του σώματος",
          "Εξειδικευμένες τεχνικές κινητοποίησης",
          "Μυοπεριτονιακή απελευθέρωση",
          "Βελτίωση στάσης και κινητικότητας",
        ],
      },
      {
        title: "Κλινική Πιλάτες",
        desc: "Εξατομικευμένα προγράμματα πιλάτες με ιατρική καθοδήγηση για ενδυνάμωση του κορμού, βελτίωση στάσης και αποκατάσταση μετά από τραυματισμό.",
        points: ["Ενδυνάμωση κορμού", "Βελτίωση στάσης", "Αποκατάσταση & πρόληψη"],
      },
    ],
    icons: [
      "/images/services/physiotherapy.png",
      "/images/services/osteopathy.png",
      "/images/services/pilates.png",
    ],
  },

  galleryPage: {
    eyebrow: "Ο χώρος μας",
    title: "Ο Χώρος μας",
    subtitle: "Ένας ήρεμος, σύγχρονος χώρος σχεδιασμένος για την άνεση και την αποκατάστασή σας.",
    ctaTitle: "Ελάτε, ελάτε να μας γνωρίσετε",
    ctaSubtitle: "Κλείστε μια επίσκεψη και δείτε πώς μπορούμε να σας βοηθήσουμε να κινηθείτε καλύτερα.",
    cta: "Κλείστε ραντεβού",
    imgAlt: "Φωτογραφία κλινικής ORC",
    images: [
      "/images/gallery/reception.png",
      "/images/gallery/pilates-room.png",
      "/images/gallery/gym.png",
      "/images/gallery/entrance.png",
      "/images/gallery/floor.png",
    ],
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
    tagline: "Φροντίδα βασισμένη σε ερευνητικά άρθρα.",
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
    bioTitle: "Η ομάδα μας",
    bioDesc: "Γνωρίστε την ομάδα θεραπευτών του ORC Osteopathy & Rehabilitation Center.",
    servicesTitle: "Υπηρεσίες",
    servicesDesc: "Φυσιοθεραπεία, οστεοπαθητική, κλινική πιλάτες και πολλά άλλα στο ORC.",
    galleryTitle: "Ο Χώρος μας",
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
    { day: "Mon – Fri", time: "08:00 – 19:00" },
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
      img: "/images/home/physio.png",
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
    subtitle: "Choose a service, add your details, then pick a day and time.",
    serviceLabel: "Service",
    serviceHint: "Availability depends on the therapist for that service.",
    errService: "Please choose a service.",
    fullNameLabel: "Full name",
    emailLabel: "Email",
    phoneLabel: "Phone number",
    concernLabel: "Reason for visit",
    concernHint: "Briefly describe what brings you in",
    required: "*",
    consent: "By continuing you agree to be contacted about your appointment.",
    submit: "Continue",
    submitting: "Just a sec…",
    closeLabel: "Close booking form",
    errFullName: "Please enter your full name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please enter a valid phone number.",
    errConcern: "Please briefly describe the reason for your visit.",
    // step 2: date & time
    pickTitle: "Pick a day & time",
    pickSubtitle: "Session duration: 45 minutes",
    pickDayHint: "Pick a day to see available times.",
    loadingSlots: "Loading availability…",
    noSlots: "No available times on this day.",
    closedDay: "Closed",
    back: "Back",
    // step 3: confirm
    confirmTitle: "Confirm appointment",
    confirmBtn: "Confirm booking",
    booking: "Booking…",
    slotTaken: "That time was just taken. Please pick another.",
    bookError: "Something went wrong. Try again or give us a call.",
    withTherapist: "with",
    // success
    successTitle: "Your appointment is booked!",
    successMsg: "We'll be in touch to confirm. See you soon!",
    successClose: "Great, thanks",
  },

  bioPage: {
    eyebrow: "About",
    title: "Our team",
    subtitle:
      "Dedicated, evidence-based care from clinicians who treat the person — not just the problem.",
    team: [
      {
        name: "Charalambos Neokleous",
        role: "Osteopath",
        img: "/images/team/charalambos.png",
        bio: "Founder of ORC, Charalambos blends osteopathy's holistic, hands-on approach with modern rehabilitation methods. He listens carefully, assesses thoroughly and treats the whole person — not just the symptom.",
      },
      {
        name: "Rafaellos Onisiforou",
        role: "Physiotherapist",
        img: "/images/team/rafaellos.png",
        bio: "Rafaellos specialises in assessing and rehabilitating musculoskeletal conditions. Through targeted therapeutic exercise and hands-on techniques, he helps patients return safely to daily life and sport.",
      },
      {
        name: "Konstantina Kitromilidi",
        role: "Physiotherapist & Pilates Instructor",
        img: "/images/team/konstantina.png",
        bio: "Konstantina combines physiotherapy with clinical Pilates, designing individualised programmes for strength, posture and injury prevention tailored to every patient.",
      },
    ],
    promiseTitle: "Our promise",
    promiseBody:
      "You'll never be just a number. Expect unhurried appointments, clear explanations, and a plan you actually understand.",
    promiseCta: "Book a consultation",
  },

  servicesPage: {
    eyebrow: "What we do",
    title: "Our services",
    subtitle:
      "Comprehensive, evidence-based treatments tailored to your body and your goals.",
    bookBtn: "Book appointment",
    servicesLabel: "Our services",
    servicesTagline: "Comprehensive treatments tailored to each patient's needs and goals",
    learnMore: "Learn more",
    stats: [
      { value: "8+", label: "Years of experience" },
      { value: "1,500+", label: "Satisfied patients" },
      { value: "3", label: "Specialised services" },
      { value: "100%", label: "Personalised care" },
    ],
    whyLabel: "Why choose us",
    whyTitle: "Treatment tailored to every patient",
    whyDesc: "A unique combination of osteopathy and physiotherapy, offering a comprehensive approach to treatment, movement and body function.",
    whyPoints: [
      "Specialist team of therapists",
      "Modern techniques & equipment",
      "Individualised rehabilitation programmes",
      "Support at every step of recovery",
    ],
    whyImage: "/images/home/team.svg",
    unsureTitle: "Not sure which service you need?",
    unsureSubtitle: "Book an initial assessment and we'll guide you to the right plan.",
    cta: "Book appointment",
    list: [
      {
        title: "Physiotherapy",
        desc: "Restore strength, mobility and function after injury, surgery or chronic pain through hands-on therapy and targeted exercise.",
        points: [
          "Post-surgical rehabilitation",
          "Neurological rehabilitation",
          "Specialist assessment and musculoskeletal rehabilitation",
          "Therapeutic exercise and strengthening",
          "Improved mobility and function",
          "Return to daily and sporting activities",
          "Injury assessment",
          "Strength & conditioning",
          "Return-to-sport testing",
          "Massage",
        ],
      },
      {
        title: "Osteopathy",
        desc: "A holistic, whole-body approach using gentle manual techniques to improve mobility, relieve tension and address root causes.",
        points: [
          "Holistic whole-body assessment",
          "Specialist mobilisation techniques",
          "Myofascial release",
          "Posture and mobility improvement",
        ],
      },
      {
        title: "Clinical Pilates",
        desc: "Individualised, medically guided Pilates programmes to strengthen your core, improve posture and support recovery after injury.",
        points: ["Core strengthening", "Posture improvement", "Rehabilitation & prevention"],
      },
    ],
    icons: [
      "/images/services/physiotherapy.png",
      "/images/services/osteopathy.png",
      "/images/services/pilates.png",
    ],
  },

  galleryPage: {
    eyebrow: "Our space",
    title: "Our space",
    subtitle: "A calm, modern clinic designed for your comfort and recovery.",
    ctaTitle: "Come, come and get to know us",
    ctaSubtitle: "Book a visit and see how we can help you move better.",
    cta: "Book appointment",
    imgAlt: "ORC clinic photo",
    images: [
      "/images/gallery/reception.png",
      "/images/gallery/pilates-room.png",
      "/images/gallery/gym.png",
      "/images/gallery/entrance.png",
      "/images/gallery/floor.png",
    ],
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
    tagline: "Care based on research articles.",
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
    bioTitle: "Our team",
    bioDesc: "Meet the team of clinicians behind ORC Osteopathy & Rehabilitation Center.",
    servicesTitle: "Services",
    servicesDesc: "Physiotherapy, osteopathy, clinical pilates and more at ORC.",
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
