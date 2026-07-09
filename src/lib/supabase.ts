import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client for the admin app.
 * Uses the publishable (anon) key — data access is protected by RLS,
 * which only allows authenticated users (the therapists).
 */
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY. Add them to .env (and Vercel).",
    );
  }
  if (!client) client = createClient(supabaseUrl, supabaseKey);
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

export interface Appointment {
  id: string;
  patient_id: string | null;
  service: string | null;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled" | "completed";
  notes: string | null;
  is_paid: boolean;
  is_blocked_time: boolean;
  created_at: string;
  /** joined relation (when selected with `patients(...)`) */
  patients?: Pick<Patient, "id" | "name" | "phone"> | null;
}
