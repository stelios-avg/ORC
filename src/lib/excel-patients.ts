import type { SupabaseClient } from "@supabase/supabase-js";
import type { Patient } from "./supabase";
import { fetchAllPatients } from "./patients";

export interface ExcelPatient {
  name: string;
  phone: string | null;
  email: string | null;
}

export interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

const HEADER_ALIASES: Record<string, string> = {
  "ονοματεπώνυμο": "full",
  "όνομα": "first",
  "επώνυμο": "last",
  "αριθμός κινητού": "mobile",
  "τηλέφωνο": "landline",
  "email": "email",
};

export function digitsOnly(value: string | null | undefined): string {
  return String(value ?? "").replace(/\D+/g, "");
}

export function normalizePersonName(name: string): string {
  return name
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .replace(/\bviber\b/gi, "")
    .trim()
    .toLocaleUpperCase("el-GR");
}

export function namesMatch(a: string, b: string): boolean {
  const left = normalizePersonName(a);
  const right = normalizePersonName(b);
  if (!left || !right) return false;
  if (left === right) return true;
  return left.includes(right) || right.includes(left);
}

/** Store Cyprus numbers as +357 96 322622; keep other countries as +digits. */
export function normalizePhone(raw: string | null | undefined): string | null {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const digits = digitsOnly(text);
  if (!digits) return null;

  if (digits.startsWith("357") && digits.length >= 11) {
    const national = digits.slice(3);
    if (national.length === 8) return `+357 ${national.slice(0, 2)} ${national.slice(2)}`;
    return `+357 ${national}`;
  }
  if (digits.length === 8 && (digits.startsWith("9") || digits.startsWith("2"))) {
    return `+357 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  return `+${digits}`;
}

function cell(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function colIndex(header: unknown[]): Record<string, number> {
  const map: Record<string, number> = {};
  header.forEach((h, i) => {
    const key = HEADER_ALIASES[cell(h).toLocaleLowerCase("el-GR")];
    if (key) map[key] = i;
  });
  return map;
}

function pick(row: unknown[], cols: Record<string, number>, key: string): unknown {
  const i = cols[key];
  return i == null ? "" : row[i];
}

export function parseExcelPatients(rows: unknown[][]): ExcelPatient[] {
  if (!rows.length) return [];
  const cols = colIndex(rows[0] ?? []);
  if (cols.full == null && cols.first == null) {
    throw new Error("Το αρχείο χρειάζεται στήλες ονόματος, τηλεφώνου και email.");
  }

  const out: ExcelPatient[] = [];
  const seen = new Set<string>();

  for (const row of rows.slice(1)) {
    if (!row || !row.length) continue;
    const full =
      cell(pick(row, cols, "full")) ||
      `${cell(pick(row, cols, "first"))} ${cell(pick(row, cols, "last"))}`.trim();
    if (full.length < 2) continue;

    const mobile = normalizePhone(cell(pick(row, cols, "mobile")));
    const landline = normalizePhone(cell(pick(row, cols, "landline")));
    const email = cell(pick(row, cols, "email")).toLowerCase() || null;
    const phone = mobile || landline;
    const key = `${normalizePersonName(full)}|${digitsOnly(phone)}|${email ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ name: full, phone, email });
  }
  return out;
}

export function findExistingPatient(existing: Patient[], row: ExcelPatient): Patient | undefined {
  if (row.email) {
    const byEmail = existing.find((p) => (p.email ?? "").trim().toLowerCase() === row.email);
    if (byEmail) return byEmail;
  }
  const incomingDigits = digitsOnly(row.phone);
  if (incomingDigits.length >= 8) {
    const tail = incomingDigits.slice(-8);
    const phoneHits = existing.filter((p) => {
      const d = digitsOnly(p.phone);
      return d.length >= 8 && d.slice(-8) === tail;
    });
    const named = phoneHits.find((p) => namesMatch(p.name, row.name));
    if (named) return named;
  }
  if (!row.phone && !row.email) {
    return existing.find((p) => namesMatch(p.name, row.name));
  }
  return undefined;
}

export async function importExcelPatients(
  supabase: SupabaseClient,
  records: ExcelPatient[],
  onProgress?: (done: number, total: number) => void,
): Promise<ImportResult> {
  const result: ImportResult = { inserted: 0, updated: 0, skipped: 0, errors: [] };
  const existing = await fetchAllPatients(supabase);
  const inserts: ExcelPatient[] = [];
  const updates: { id: string; phone: string | null; email: string | null }[] = [];

  for (const record of records) {
    const found = findExistingPatient(existing, record);
    if (found) {
      const patch: { phone?: string | null; email?: string | null } = {};
      if (!found.phone && record.phone) patch.phone = record.phone;
      if (!found.email && record.email) patch.email = record.email;
      if (!Object.keys(patch).length) {
        result.skipped += 1;
        continue;
      }
      updates.push({ id: found.id, phone: patch.phone ?? found.phone, email: patch.email ?? found.email });
      Object.assign(found, patch);
    } else {
      inserts.push(record);
      existing.push({
        id: `pending-${inserts.length}`,
        name: record.name,
        phone: record.phone,
        email: record.email,
        notes: null,
        created_at: new Date().toISOString(),
      });
    }
  }

  const total = inserts.length + updates.length;
  let done = 0;
  onProgress?.(0, Math.max(total, 1));

  for (let i = 0; i < inserts.length; i += 100) {
    const chunk = inserts.slice(i, i + 100);
    const { error } = await supabase.from("patients").insert(chunk);
    if (error) {
      for (const row of chunk) {
        const { error: oneErr } = await supabase.from("patients").insert(row);
        if (oneErr) result.errors.push(`${row.name}: ${oneErr.message}`);
        else result.inserted += 1;
        done += 1;
        onProgress?.(done, total);
      }
    } else {
      result.inserted += chunk.length;
      done += chunk.length;
      onProgress?.(done, total);
    }
  }

  for (const u of updates) {
    const { error } = await supabase
      .from("patients")
      .update({ phone: u.phone, email: u.email })
      .eq("id", u.id);
    if (error) result.errors.push(`update ${u.id}: ${error.message}`);
    else result.updated += 1;
    done += 1;
    onProgress?.(done, total);
  }

  return result;
}
