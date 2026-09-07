// Transactionele e-mail via SendGrid. Alleen voor triggers die om directe
// actie vragen (nieuw bericht, nieuw bod) — geen marketing, dus geen
// opt-out-mechanisme nodig zoals bij nieuwsbrieven.
const AFZENDER = { email: "noreply@noah-emma.nl", name: "Noah & Emma" };

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
      content: [{ type: "text/html", value: opts.html }],
    }),
  });

  if (!res.ok) {
    const tekst = await res.text().catch(() => "");
    console.error(`SendGrid-fout (${res.status}) bij versturen naar ${opts.naar}:`, tekst);
  }
}

// Simpele, consistente basis-opmaak zodat elke notificatiemail er hetzelfde uitziet.
export function emailSjabloon(opts: { titel: string; tekst: string; knopTekst: string; knopUrl: string }) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #241A2E;">
      <p style="font-weight: 800; letter-spacing: 0.1em; font-size: 13px; text-transform: uppercase; margin: 0 0 24px;">
        <span style="color: #1C7FA8;">Noah</span> &amp; <span style="color: #D63D74;">Emma</span>
      </p>
      <h1 style="font-size: 20px; margin: 0 0 12px;">${opts.titel}</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #5B4F63; margin: 0 0 24px;">${opts.tekst}</p>
      <a href="${opts.knopUrl}" style="display: inline-block; background: #241A2E; color: #fff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 999px;">${opts.knopTekst}</a>
    </div>
  `;
}
