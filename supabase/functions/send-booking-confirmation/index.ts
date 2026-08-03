import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Sends a booking confirmation email to the patient after a successful
 * online booking. Uses Brevo (Sendinblue) transactional email API.
 *
 * Secrets (Dashboard → Edge Functions → Secrets):
 *   BREVO_API_KEY        — API key from https://app.brevo.com
 *   BOOKING_FROM_EMAIL   — verified sender, e.g. orcosteopathy@hotmail.com
 *   BOOKING_FROM_NAME    — optional, defaults to "ORC Osteopathy"
 *
 * Only sends if a matching confirmed appointment exists for that email
 * + start time in the last 15 minutes (anti-spam).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Payload {
  name: string;
  email: string;
  phone?: string;
  concern?: string;
  start: string;
  lang?: "el" | "en";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Payload;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const startIso = body.start;
    const lang = body.lang === "en" ? "en" : "el";

    if (!name || !email || !startIso) {
      return json({ error: "missing_fields" }, 400);
    }

    const brevoKey = Deno.env.get("BREVO_API_KEY");
    const fromEmail = Deno.env.get("BOOKING_FROM_EMAIL") || "orcosteopathy@hotmail.com";
    const fromName = Deno.env.get("BOOKING_FROM_NAME") || "ORC Osteopathy";

    if (!brevoKey) {
      console.error("BREVO_API_KEY secret is not set");
      return json({ error: "email_not_configured" }, 503);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const start = new Date(startIso);
    const windowStart = new Date(Date.now() - 15 * 60_000).toISOString();

    const { data: appts, error: lookupErr } = await supabase
      .from("appointments")
      .select("id, start_time, end_time, patients(email)")
      .eq("status", "confirmed")
      .gte("created_at", windowStart)
      .order("created_at", { ascending: false })
      .limit(20);

    if (lookupErr) {
      console.error("lookup failed", lookupErr);
      return json({ error: "lookup_failed" }, 500);
    }

    const match = (appts ?? []).find((a) => {
      const patientEmail = String(
        (a as { patients?: { email?: string } | null }).patients?.email || "",
      )
        .trim()
        .toLowerCase();
      if (patientEmail !== email) return false;
      const diff = Math.abs(new Date(a.start_time).getTime() - start.getTime());
      return diff < 60_000;
    });

    if (!match) {
      return json({ error: "appointment_not_found" }, 404);
    }

    const whenDate = start.toLocaleDateString(lang === "en" ? "en-GB" : "el-GR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Nicosia",
    });
    const whenTime = start.toLocaleTimeString(lang === "en" ? "en-GB" : "el-GR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Nicosia",
    });
    const endTime = new Date(match.end_time).toLocaleTimeString(
      lang === "en" ? "en-GB" : "el-GR",
      { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Nicosia" },
    );

    const subject =
      lang === "en"
        ? `Appointment confirmed — ${whenDate} at ${whenTime}`
        : `Επιβεβαίωση ραντεβού — ${whenDate} στις ${whenTime}`;

    const html =
      lang === "en"
        ? emailHtmlEn({ name, whenDate, whenTime, endTime })
        : emailHtmlEl({ name, whenDate, whenTime, endTime });

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": brevoKey,
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email, name }],
        replyTo: { email: fromEmail, name: fromName },
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Brevo error", res.status, detail);
      return json({ error: "send_failed", detail }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ error: "unexpected" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function emailHtmlEl(p: { name: string; whenDate: string; whenTime: string; endTime: string }) {
  return `<!DOCTYPE html>
<html lang="el"><body style="margin:0;padding:0;background:#f5f3ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#1d3e62;padding:28px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">ORC</p>
          <p style="margin:6px 0 0;color:#d4e2ef;font-size:13px;">Osteopathy &amp; Rehabilitation Center</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 12px;font-size:22px;color:#44464a;">Το ραντεβού σας επιβεβαιώθηκε</h1>
          <p style="margin:0 0 20px;color:#6a6d72;font-size:15px;line-height:1.55;">
            Γεια σας ${escapeHtml(p.name)},<br/>λάβαμε την κράτησή σας. Σας περιμένουμε!
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f9;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 22px;">
              <p style="margin:0 0 6px;font-size:12px;color:#1d3e62;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Ημερομηνία &amp; ώρα</p>
              <p style="margin:0;font-size:18px;color:#44464a;font-weight:700;">${escapeHtml(p.whenDate)}</p>
              <p style="margin:6px 0 0;font-size:16px;color:#1d3e62;">${escapeHtml(p.whenTime)} – ${escapeHtml(p.endTime)}</p>
              <p style="margin:10px 0 0;font-size:13px;color:#6a6d72;">Διάρκεια: 45 λεπτά</p>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:14px;color:#44464a;"><strong>Διεύθυνση</strong><br/>Περικλέους 63, Στρόβολος 2021, Κύπρος</p>
          <p style="margin:0 0 24px;font-size:14px;color:#44464a;"><strong>Τηλέφωνο</strong><br/><a href="tel:+35796322622" style="color:#1d3e62;">+357 96 322622</a></p>
          <p style="margin:0;font-size:13px;color:#6a6d72;line-height:1.5;">Αν χρειαστεί να αλλάξετε ή να ακυρώσετε το ραντεβού, καλέστε μας.</p>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#f5f3ef;text-align:center;">
          <p style="margin:0;font-size:12px;color:#6a6d72;">ORC Osteopathy &amp; Rehabilitation Center</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function emailHtmlEn(p: { name: string; whenDate: string; whenTime: string; endTime: string }) {
  return `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:0;background:#f5f3ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#1d3e62;padding:28px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">ORC</p>
          <p style="margin:6px 0 0;color:#d4e2ef;font-size:13px;">Osteopathy &amp; Rehabilitation Center</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 12px;font-size:22px;color:#44464a;">Your appointment is confirmed</h1>
          <p style="margin:0 0 20px;color:#6a6d72;font-size:15px;line-height:1.55;">
            Hi ${escapeHtml(p.name)},<br/>we received your booking. We look forward to seeing you!
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f9;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 22px;">
              <p style="margin:0 0 6px;font-size:12px;color:#1d3e62;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Date &amp; time</p>
              <p style="margin:0;font-size:18px;color:#44464a;font-weight:700;">${escapeHtml(p.whenDate)}</p>
              <p style="margin:6px 0 0;font-size:16px;color:#1d3e62;">${escapeHtml(p.whenTime)} – ${escapeHtml(p.endTime)}</p>
              <p style="margin:10px 0 0;font-size:13px;color:#6a6d72;">Duration: 45 minutes</p>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:14px;color:#44464a;"><strong>Address</strong><br/>Perikleous 63, Strovolos 2021, Cyprus</p>
          <p style="margin:0 0 24px;font-size:14px;color:#44464a;"><strong>Phone</strong><br/><a href="tel:+35796322622" style="color:#1d3e62;">+357 96 322622</a></p>
          <p style="margin:0;font-size:13px;color:#6a6d72;line-height:1.5;">If you need to change or cancel, please call us.</p>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#f5f3ef;text-align:center;">
          <p style="margin:0;font-size:12px;color:#6a6d72;">ORC Osteopathy &amp; Rehabilitation Center</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
