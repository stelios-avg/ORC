import type { SupabaseClient } from "@supabase/supabase-js";
import type { Patient } from "./supabase";

const PAGE = 1000;

/** PostgREST caps a single select at 1000 rows — page until the table is exhausted. */
export async function fetchAllPatients(supabase: SupabaseClient): Promise<Patient[]> {
  const all: Patient[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("name")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    const chunk = (data ?? []) as Patient[];
    all.push(...chunk);
    if (chunk.length < PAGE) break;
  }
  return all;
}
