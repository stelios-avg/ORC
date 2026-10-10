import { getTherapist, type TherapistSlug } from "./therapists";

/**
 * Master / secretary accounts — see and edit everyone’s payments.
 * Egly and Georgia are secretaries only: do NOT add them as therapists on the schedule.
 */
export const MASTER_EMAILS = [
  "egly_mua@hotmail.com",
  "georgiak10@gmail.com",
  "x.neocleous@hotmail.com",
  "stelios0102@gmail.com",
] as const;

/** Clinic owner — the only account that sees everyone’s payments in one place. */
export const OWNER_EMAIL = "x.neocleous@hotmail.com";

/**
 * Login email → therapist calendar for payment scoping.
 * Non-masters only see/edit payments on their own therapist_id.
 * Pilates (anonymous calendar) is master-only.
 */
export const THERAPIST_ACCOUNT_EMAILS: Record<string, TherapistSlug> = {
  "x.neocleous@hotmail.com": "charalambos",
  "onisiforourafaellos@gmail.com": "rafaellos",
  "antreaslouis@gmail.com": "antreas",
  "constantinakitromilide@gmail.com": "constantina",
};

export function normalizeEmail(email: string | null | undefined): string {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

export function isMasterAccount(email: string | null | undefined): boolean {
  const e = normalizeEmail(email);
  return (MASTER_EMAILS as readonly string[]).includes(e);
}

/** Reception: Egly, and Georgia when Egly is away. */
export function isSecretaryAccount(email: string | null | undefined): boolean {
  const e = normalizeEmail(email);
  return e === "egly_mua@hotmail.com" || e === "georgiak10@gmail.com";
}

/** Charalambos only — full clinic payment overview. */
export function isOwnerAccount(email: string | null | undefined): boolean {
  return normalizeEmail(email) === OWNER_EMAIL;
}

export function therapistSlugForEmail(
  email: string | null | undefined,
): TherapistSlug | null {
  const e = normalizeEmail(email);
  return THERAPIST_ACCOUNT_EMAILS[e] ?? null;
}

export function therapistIdForEmail(
  email: string | null | undefined,
): string | null {
  const slug = therapistSlugForEmail(email);
  return slug ? (getTherapist(slug)?.id ?? null) : null;
}

/** Own therapist calendar (or master). Used for payments + deletes. */
export function canManageTherapistCalendar(
  email: string | null | undefined,
  therapistId: string | null | undefined,
): boolean {
  if (isMasterAccount(email)) return true;
  if (!therapistId) return false;
  const ownId = therapistIdForEmail(email);
  return !!ownId && ownId === therapistId;
}

/** Masters: all. Therapist accounts: only their own calendar. Others: none. */
export function canViewTherapistPayments(
  email: string | null | undefined,
  therapistId: string | null | undefined,
): boolean {
  return canManageTherapistCalendar(email, therapistId);
}

/** Non-masters may only delete appointments on their own calendar. */
export function canDeleteAppointment(
  email: string | null | undefined,
  therapistId: string | null | undefined,
): boolean {
  return canManageTherapistCalendar(email, therapistId);
}

/** Friendly display name for an appointment creator (task activity log). */
export function creatorDisplayName(
  createdBy: string | null | undefined,
): string | null {
  const v = normalizeEmail(createdBy);
  if (!v) return null;
  if (v === "online") return "Online κράτηση (πελάτης)";
  if (v === "egly_mua@hotmail.com") return "Egly (γραμματεία)";
  if (v === "georgiak10@gmail.com") return "Γεωργία (γραμματεία)";
  if (v === "stelios0102@gmail.com") return "Στέλιος";
  const slug = THERAPIST_ACCOUNT_EMAILS[v];
  if (slug) {
    const name = getTherapist(slug)?.nameEl;
    if (name) return name;
  }
  return v;
}

/** Therapist IDs whose payment fields this account may read/aggregate. */
export function paymentTherapistFilter(
  email: string | null | undefined,
): "all" | string[] {
  if (isMasterAccount(email)) return "all";
  const ownId = therapistIdForEmail(email);
  return ownId ? [ownId] : [];
}
