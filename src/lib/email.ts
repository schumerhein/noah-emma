// Transactionele e-mail via SendGrid. Alleen voor triggers die om directe
// actie vragen (nieuw bericht, nieuw bod) — geen marketing, dus geen
// opt-out-mechanisme nodig zoals bij nieuwsbrieven.
const AFZENDER = { email: "noreply@noah-emma.nl", name: "Noah & Emma" };

// Voor in de logs: genoeg om een adres te herkennen, zonder het volledig te tonen.
const maskeer = (adres: string) => adres.replace(/^(.{2})[^@]*/, "$1***");

// Platte-tekstversie van de HTML. Mails met alleen HTML scoren slechter bij
// spamfilters (vooral Outlook/Hotmail).
function alsTekst(html: string) {
  return html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "$2: $1")
    .replace(/<(br|\/p|\/h1|\/div|\/blockquote)[^>]*>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n\n")
    .trim();
}

export async function stuurEmail(opts: { naar: string; onderwerp: string; html: string }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error("SENDGRID_API_KEY ontbreekt — e-mail niet verstuurd:", opts.onderwerp);
    return;
  }

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: opts.naar }] }],
      from: AFZENDER,
      subject: opts.onderwerp,
      content: [
        { type: "text/plain", value: alsTekst(opts.html) },
        { type: "text/html", value: opts.html },
      ],
      // Geen klik- en open-tracking: SendGrid herschrijft dan elke link naar
      // een eigen trackingdomein, en dat zien Outlook/Hotmail als spamsignaal.
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false },
        open_tracking: { enable: false },
      },
    }),
  });

  if (!res.ok) {
    const tekst = await res.text().catch(() => "");
    console.error(`SendGrid-fout (${res.status}) bij versturen naar ${maskeer(opts.naar)}:`, tekst);
    return;
  }
  // Met dit id is de mail terug te vinden in SendGrid → Activity.
  console.log(`E-mail aan SendGrid gegeven: "${opts.onderwerp}" naar ${maskeer(opts.naar)} (id ${res.headers.get("x-message-id") ?? "onbekend"})`);
}

// Simpele, consistente basis-opmaak zodat elke notificatiemail er hetzelfde uitziet.
export function emailSjabloon(opts: { titel: string; tekst: string; knopTekst: string; knopUrl: string; citaat?: string }) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #241A2E;">
      <p style="font-weight: 800; letter-spacing: 0.1em; font-size: 13px; text-transform: uppercase; margin: 0 0 24px;">
        <span style="color: #1C7FA8;">Noah</span> &amp; <span style="color: #D63D74;">Emma</span>
      </p>
      <h1 style="font-size: 20px; margin: 0 0 12px;">${opts.titel}</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #5B4F63; margin: 0 0 24px;">${opts.tekst}</p>
      ${opts.citaat ? `<blockquote style="margin: 0 0 24px; padding: 12px 16px; background: #FFF4F8; border-radius: 14px; font-size: 15px; line-height: 1.5; color: #241A2E;">${opts.citaat}</blockquote>` : ""}
      <a href="${opts.knopUrl}" style="display: inline-block; background: #241A2E; color: #fff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 999px;">${opts.knopTekst}</a>
    </div>
  `;
}

// Voor tekst van gebruikers (namen, producttitels) in de HTML van een mail.
export function escapeHtml(tekst: string) {
  return tekst.replace(/[&<>"']/g, t => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]!);
}
