import { NextResponse } from "next/server";
import { haalGebruikerOp } from "@/lib/mollie";
import { stuurEmail, emailSjabloon } from "@/lib/email";

// Wordt door de client aangeroepen direct na een geslaagde wachtwoordwijziging
// — een extra beveiligingslaag zodat de gebruiker het merkt als iemand anders
// dit deed. Faalt de mail, dan is de wachtwoordwijziging zelf al wel gelukt;
// dit blokkeert dus nooit de eigenlijke actie.
export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  if (!user.email) {
    return NextResponse.json({ ok: true });
  }

  await stuurEmail({
    naar: user.email,
    onderwerp: "Je wachtwoord is gewijzigd",
    html: emailSjabloon({
      titel: "Wachtwoord gewijzigd",
      tekst: "Het wachtwoord van je Noah & Emma-account is zojuist gewijzigd. Was jij dit niet? Neem dan meteen contact met ons op via de helpdesk.",
      knopTekst: "Naar de helpdesk",
      knopUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://noah-emma.nl"}/helpdesk`,
    }),
  });

  return NextResponse.json({ ok: true });
}
