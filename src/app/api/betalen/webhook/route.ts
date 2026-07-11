import { NextResponse } from "next/server";
import { verwerkBetaling } from "@/lib/mollie";

// Mollie roept dit aan (server-naar-server) telkens als de status van een
// betaling verandert. Werkt alleen als de app op een https-adres bereikbaar
// is (dus pas na live zetten) — lokaal rondt de bevestigingspagina het zelf af.
export async function POST(request: Request) {
  const form = await request.formData();
  const paymentId = form.get("id");
  if (typeof paymentId !== "string") {
    return NextResponse.json({ error: "Geen betalings-id" }, { status: 400 });
  }

  await verwerkBetaling(paymentId);
  return NextResponse.json({ ok: true });
}
