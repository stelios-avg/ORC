/**
 * Clinic therapists — IDs must match the seed in supabase/add-therapists.sql
 *
 * Online booking routing:
 *   Physiotherapy     → a free physio (capacity 2)
 *   Osteopathy        → Charalambos only (45′ session or 1h assessment)
 *   Clinical Pilates  → not online; clients call. Staff still book it in admin.
 *
 * Antreas & Constantina are on the admin schedule (physiotherapy) but are not
 * the default online-booking targets — staff can transfer appointments to them.
 *
 * Secretary (Egly) is a master admin account only — never add her here as a therapist.
 */

export type TherapistSlug = "charalambos" | "rafaellos" | "antreas" | "constantina" | "pilates";
export type BookableService = "osteopathy" | "osteopathy_assessment" | "physiotherapy";
export type TherapistAccent = "spine" | "sky" | "teal" | "rose" | "amber";

export interface Therapist {
  id: string;
  slug: TherapistSlug;
  nameEl: string;
  nameEn: string;
  specialty: "osteopathy" | "physiotherapy" | "pilates";
  /** Tailwind-ish accent used in admin calendar */
  accent: TherapistAccent;
  /**
   * Schedule column that is not a named person (e.g. Pilates).
   * Online booking hides “με …” for these.
   */
  anonymous?: boolean;
}

export const THERAPISTS: Therapist[] = [
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "constantina",
    nameEl: "Κωνσταντίνα",
    nameEn: "Constantina",
    specialty: "physiotherapy",
    accent: "rose",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "antreas",
    nameEl: "Αντρέας",
    nameEn: "Antreas",
    specialty: "physiotherapy",
    accent: "teal",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "rafaellos",
    nameEl: "Ραφαέλλος",
    nameEn: "Rafaellos",
    specialty: "physiotherapy",
    accent: "sky",
  },
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "charalambos",
    nameEl: "Χαράλαμπος",
    nameEn: "Charalambos",
    specialty: "osteopathy",
    accent: "spine",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    slug: "pilates",
    nameEl: "Πιλάτες",
    nameEn: "Pilates",
    specialty: "pilates",
    accent: "amber",
    anonymous: true,
  },
];

/** First item is the online-booking default when the visitor doesn't change anything. */
export const BOOKABLE_SERVICES: {
  key: BookableService;
  labelEl: string;
  labelEn: string;
  therapistSlug: TherapistSlug;
  durationMin: number;
  /** Hide “με …” — therapist is auto-assigned or calendar is anonymous */
  hideTherapistName?: boolean;
}[] = [
  {
    key: "physiotherapy",
    labelEl: "Φυσιοθεραπεία",
    labelEn: "Physiotherapy",
    therapistSlug: "rafaellos",
    durationMin: 45,
    hideTherapistName: true, // assigned to a free physio at booking time
  },
  {
    key: "osteopathy",
    labelEl: "Οστεοπαθητική",
    labelEn: "Osteopathy",
    therapistSlug: "charalambos",
    durationMin: 45,
  },
  {
    key: "osteopathy_assessment",
    labelEl: "Οστεοπαθητική — Αξιολόγηση",
    labelEn: "Osteopathy — Assessment",
    therapistSlug: "charalambos",
    durationMin: 60,
  },
];

/** Shown in the booking form, but not sent as an online appointment. */
export const PHONE_ONLY_SERVICES: {
  key: "pilates";
  labelEl: string;
  labelEn: string;
}[] = [
  {
    key: "pilates",
    labelEl: "Κλινική Πιλάτες",
    labelEn: "Clinical Pilates",
  },
];

/** Default therapist for new online bookings / admin “Όλοι” tab. */
export const DEFAULT_THERAPIST_ID = THERAPISTS.find((t) => t.slug === "rafaellos")!.id;

export function getTherapist(idOrSlug: string | null | undefined): Therapist | undefined {
  if (!idOrSlug) return undefined;
  return THERAPISTS.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
}

export function therapistForService(service: BookableService): Therapist {
  const map = BOOKABLE_SERVICES.find((s) => s.key === service)!;
  return getTherapist(map.therapistSlug)!;
}

export function serviceLabel(service: BookableService, lang: "el" | "en"): string {
  const s = BOOKABLE_SERVICES.find((x) => x.key === service)!;
  return lang === "en" ? s.labelEn : s.labelEl;
}

/** Concurrent online bookings allowed for a bookable service at the same time. */
export function slotCapacityForService(service: BookableService | string): number {
  return service === "physiotherapy" ? 2 : 1;
}

/** Admin “new appointment” service list with default prices (EUR) and duration. Discount stays editable. */
export const ADMIN_SERVICES: {
  label: string;
  defaultPrice: number | null;
  durationMin: number;
  /** When set, the appointment can only be placed on this therapist. */
  therapistSlug?: TherapistSlug;
}[] = [
  { label: "Φυσιοθεραπεία εκτός ΓΕΣΥ", defaultPrice: 35, durationMin: 45 },
  { label: "Φυσιοθεραπεία με ΓΕΣΥ", defaultPrice: 10, durationMin: 45 },
  { label: "Φυσιοθεραπεία ΓΕΣΥ χωρίς συμπλήρωση", defaultPrice: 0, durationMin: 45 },
  { label: "Μασάζ", defaultPrice: 50, durationMin: 60 },
  { label: "Οστεοπαθητική", defaultPrice: 60, durationMin: 45, therapistSlug: "charalambos" },
  { label: "Οστεοπαθητική — Αξιολόγηση", defaultPrice: 60, durationMin: 60, therapistSlug: "charalambos" },
  { label: "Κλινική Πιλάτες", defaultPrice: null, durationMin: 45 },
  { label: "Άλλο", defaultPrice: null, durationMin: 45 },
];

/** Older admin labels — keep default prices working on existing appointments. */
const ADMIN_SERVICE_PRICE_ALIASES: Record<string, string> = {
  "Φυσιοθεραπεία χωρίς ΓΕΣΥ": "Φυσιοθεραπεία εκτός ΓΕΣΥ",
  "Φυσιοθεραπεία χωρίς συνπληρωμή": "Φυσιοθεραπεία ΓΕΣΥ χωρίς συμπλήρωση",
};

function adminServiceByLabel(label: string) {
  const resolved = ADMIN_SERVICE_PRICE_ALIASES[label] ?? label;
  return ADMIN_SERVICES.find((s) => s.label === resolved);
}

export function defaultPriceForAdminService(label: string): number | null {
  const hit = adminServiceByLabel(label);
  return hit ? hit.defaultPrice : null;
}

export function durationForAdminService(label: string): number {
  return adminServiceByLabel(label)?.durationMin ?? 45;
}

/** Osteopathy (session and assessment) can only sit on Charalambos. */
export function lockedTherapistIdForAdminService(label: string): string | null {
  const slug = adminServiceByLabel(label)?.therapistSlug;
  return slug ? getTherapist(slug)!.id : null;
}

/** Suggest therapist when admin picks a Greek service name. */
export function suggestTherapistIdForService(service: string): string | null {
  const locked = lockedTherapistIdForAdminService(service);
  if (locked) return locked;
  const s = service.trim().toLowerCase();
  if (s.includes("οστεο") || s.includes("osteo") || s.includes("αξιολόγ") || s.includes("axiolog")) {
    return getTherapist("charalambos")!.id;
  }
  if (s.includes("πιλάτ") || s.includes("pilates")) {
    return getTherapist("pilates")!.id;
  }
  if (s.includes("φυσιο") || s.includes("physio") || s.includes("μασάζ") || s.includes("massage")) {
    return getTherapist("rafaellos")!.id;
  }
  return null;
}

export function therapistAccentClasses(accent: TherapistAccent): {
  text: string;
  block: string;
} {
  switch (accent) {
    case "sky":
      return {
        text: "text-sky-700",
        block:
          "z-20 mx-0.5 my-px overflow-hidden rounded-lg border-l-4 border-sky-500 bg-sky-50 px-2 py-1 text-left transition hover:bg-sky-100",
      };
    case "teal":
      return {
        text: "text-teal-700",
        block:
          "z-20 mx-0.5 my-px overflow-hidden rounded-lg border-l-4 border-teal-500 bg-teal-50 px-2 py-1 text-left transition hover:bg-teal-100",
      };
    case "rose":
      return {
        text: "text-rose-700",
        block:
          "z-20 mx-0.5 my-px overflow-hidden rounded-lg border-l-4 border-rose-500 bg-rose-50 px-2 py-1 text-left transition hover:bg-rose-100",
      };
    case "amber":
      return {
        text: "text-amber-800",
        block:
          "z-20 mx-0.5 my-px overflow-hidden rounded-lg border-l-4 border-amber-500 bg-amber-50 px-2 py-1 text-left transition hover:bg-amber-100",
      };
    default:
      return {
        text: "text-spine",
        block:
          "z-20 mx-0.5 my-px overflow-hidden rounded-lg border-l-4 border-spine bg-spine-50 px-2 py-1 text-left transition hover:bg-spine-100",
      };
  }
}
