import { getTherapist } from "./therapists";

/**
 * Master / secretary accounts — full admin including Charalambos payments.
 * Egly is secretary only: do NOT add her as a therapist on the schedule.
 */
export const MASTER_EMAILS = [
  "egly_mua@hotmail.com",
  "x.neocleous@hotmail.com",
] as const;

export function normalizeEmail(email: string | null | undefined): string {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

export function isMasterAccount(email: string | null | undefined): boolean {
  const e = normalizeEmail(email);
  return (MASTER_EMAILS as readonly string[]).includes(e);
}

/** Charalambos payment fields are visible only to master accounts. */
export function canViewTherapistPayments(
  email: string | null | undefined,
  therapistId: string | null | undefined,
): boolean {
  const th = getTherapist(therapistId);
  if (th?.slug === "charalambos") return isMasterAccount(email);
  return true;
}
