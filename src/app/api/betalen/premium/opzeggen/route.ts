import { NextResponse } from "next/server";
import { haalGebruikerOp, zegAbonnementOp } from "@/lib/mollie";

export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  try {
    const resultaat = await zegAbonnementOp(user.id);
    if ("error" in resultaat) {
      return NextResponse.json(resultaat, { status: 400 });
    }
    return NextResponse.json(resultaat);
  } catch (err) {
    console.error("Abonnement opzeggen mislukt:", err);
    return NextResponse.json({ error: "Opzeggen is niet gelukt. Probeer het zo nog eens." }, { status: 500 });
  }
}
