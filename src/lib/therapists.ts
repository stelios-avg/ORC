/**
 * Clinic therapists — IDs must match the seed in supabase/add-therapists.sql
 *
 * Online booking routing:
 *   Osteopathy        → Charalambos
 *   Physiotherapy     → Rafaellos
 *   Clinical Pilates  → Pilates calendar (no person name)
 *
 * Antreas & Constantina are on the admin schedule (physiotherapy) but are not
 * the default online-booking targets — staff can transfer appointments to them.
 *
 * Secretary (Egly) is a master admin account only — never add her here as a therapist.
 */

export type TherapistSlug = "charalambos" | "rafaellos" | "antreas" | "constantina" | "pilates";
export type BookableService = "osteopathy" | "physiotherapy" | "pilates";
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
    id: "11111111-1111-4111-8111-111111111111",
    slug: "charalambos",
    nameEl: "Χαράλαμπος",
    nameEn: "Charalambos",
    specialty: "osteopathy",
    accent: "spine",
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
    id: "33333333-3333-4333-8333-333333333333",
    slug: "antreas",
    nameEl: "Αντρέας",
    nameEn: "Antreas",
    specialty: "physiotherapy",
    accent: "teal",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "constantina",
    nameEl: "Κωνσταντίνα",
    nameEn: "Constantina",
    specialty: "physiotherapy",
    accent: "rose",
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
  /** Hide “με …” — therapist is auto-assigned or calendar is anonymous */
  hideTherapistName?: boolean;
}[] = [
  {
    key: "physiotherapy",
    labelEl: "Φυσιοθεραπεία",
    labelEn: "Physiotherapy",
    therapistSlug: "rafaellos",
    hideTherapistName: true, // assigned to a free physio at booking time
  },
  {
    key: "osteopathy",
    labelEl: "Οστεοπαθητική",
    labelEn: "Osteopathy",
    therapistSlug: "charalambos",
  },
  {
    key: "pilates",
    labelEl: "Κλινική Πιλάτες",
    labelEn: "Clinical Pilates",
    therapistSlug: "pilates",
    hideTherapistName: true,
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

/** Admin “new appointment” service list with default prices (EUR). Discount stays editable. */
export const ADMIN_SERVICES: {
  label: string;
  defaultPrice: number | null;
}[] = [
  { label: "Φυσιοθεραπεία με ΓΕΣΥ", defaultPrice: 10 },
  { label: "Φυσιοθεραπεία χωρίς ΓΕΣΥ", defaultPrice: 35 },
  { label: "Φυσιοθεραπεία χωρίς συμπλήρωση", defaultPrice: 0 },
  { label: "Οστεοπαθητική", defaultPrice: null },
  { label: "Κλινική Πιλάτες", defaultPrice: null },
  { label: "Άλλο", defaultPrice: null },
];

export function defaultPriceForAdminService(label: string): number | null {
  const hit = ADMIN_SERVICES.find((s) => s.label === label);
  return hit ? hit.defaultPrice : null;
}

/** Suggest therapist when admin picks a Greek service name. */
export function suggestTherapistIdForService(service: string): string | null {
  const s = service.trim().toLowerCase();
  if (s.includes("οστεο") || s.includes("osteo")) {
    return getTherapist("charalambos")!.id;
  }
  if (s.includes("πιλάτ") || s.includes("pilates")) {
    return getTherapist("pilates")!.id;
  }
  if (s.includes("φυσιο") || s.includes("physio")) {
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
