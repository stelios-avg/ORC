/**
 * Clinic therapists — IDs must match the seed in supabase/add-therapists.sql
 *
 * Online booking routing:
 *   Osteopathy        → Charalambos
 *   Physiotherapy     → Rafaellos
 *   Clinical Pilates  → Rafaellos
 */

export type TherapistSlug = "charalambos" | "rafaellos";
export type BookableService = "osteopathy" | "physiotherapy" | "pilates";

export interface Therapist {
  id: string;
  slug: TherapistSlug;
  nameEl: string;
  nameEn: string;
  specialty: "osteopathy" | "physiotherapy";
  /** Tailwind-ish accent used in admin calendar */
  accent: "spine" | "sky";
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
];

/** First item is the online-booking default when the visitor doesn't change anything. */
export const BOOKABLE_SERVICES: {
  key: BookableService;
  labelEl: string;
  labelEn: string;
  therapistSlug: TherapistSlug;
}[] = [
  {
    key: "physiotherapy",
    labelEl: "Φυσιοθεραπεία",
    labelEn: "Physiotherapy",
    therapistSlug: "rafaellos",
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
    therapistSlug: "rafaellos",
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

/** Suggest therapist when admin picks a Greek service name. */
export function suggestTherapistIdForService(service: string): string | null {
  const s = service.trim().toLowerCase();
  if (s.includes("οστεο") || s.includes("osteo")) {
    return getTherapist("charalambos")!.id;
  }
  if (s.includes("φυσιο") || s.includes("physio") || s.includes("πιλάτ") || s.includes("pilates")) {
    return getTherapist("rafaellos")!.id;
  }
  return null;
}
