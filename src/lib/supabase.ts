import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client for the admin app.
 * Uses the publishable (anon) key — data access is protected by RLS,
 * which only allows authenticated users (the therapists).
 */
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

const REMEMBER_KEY = "orc-admin-remember";

let client: SupabaseClient | null = null;

/** Whether the therapist chose to stay signed in between browser sessions. */
export function getRememberMe(): boolean {
  return localStorage.getItem(REMEMBER_KEY) !== "0";
}

export function setRememberMe(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
}

/** Drop the cached client so the next call picks up a new auth storage. */
export function resetSupabaseClient() {
  client = null;
}

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY. Add them to .env (and Vercel).",
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storage: getRememberMe() ? localStorage : sessionStorage,
      },
    });
  }
  return client;
}

export interface Patient {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export interface TherapistRow {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  specialty: string;
  sort_order: number;
  active: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string | null;
  therapist_id: string | null;
  service: string | null;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled" | "completed";
  notes: string | null;
  /** List/session price in EUR (admin-set). Null = not set. */
  price: number | null;
  /** Fixed-amount discount in EUR (not a percentage). */
  discount: number;
  is_paid: boolean;
  /** How it was paid: cash | card | other. Null when unpaid. */
  payment_method: "cash" | "card" | "other" | null;
  /** When true, excluded from payment totals (master-only toggle). */
  payments_hidden: boolean;
  is_blocked_time: boolean;
  /** Admin email that created it, or "online" for public bookings. */
  created_by: string | null;
  /** Shared id linking appointments created as a recurring series. */
  recurrence_group: string | null;
  created_at: string;
  /** joined relation (when selected with `patients(...)`) */
  patients?: Pick<Patient, "id" | "name" | "phone"> | null;
  /** joined relation (when selected with `therapists(...)`) */
  therapists?: Pick<TherapistRow, "id" | "slug" | "name_el" | "name_en"> | null;
}

/** Special booking request for a closed day (visible to master accounts only). */
export interface BookingRequest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  concern: string | null;
  service: string | null;
  therapist_id: string | null;
  preferred_start: string;
  preferred_end: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}
