import { NextResponse } from "next/server";
import { haalGebruikerOp, supabaseAdmin } from "@/lib/mollie";

// Wordt door de client aangeroepen direct na een geslaagde login — legt één
// regel vast in het inlog-activiteitenoverzicht (Instellingen → Beveiliging
// → Login activiteit). Puur een logboek, geen sessiebeheer: Supabase Auth
// biedt geen betrouwbare, client-veilige manier om actieve sessies per
// apparaat te tonen of los te beëindigen, dus dit toont wél eerlijk "wanneer
// en van waar is er ingelogd" in plaats van iets te beloven wat niet klopt.
export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { device_label } = await request.json().catch(() => ({ device_label: null }));
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  await supabaseAdmin.from("login_sessions").insert({
    user_id: user.id,
    device_label: typeof device_label === "string" ? device_label.slice(0, 100) : null,
    ip_address: ip,
  });

  return NextResponse.json({ ok: true });
}
