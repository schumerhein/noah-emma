import { NextResponse } from "next/server";
import { haalGebruikerOp, zegAbonnementOp } from "@/lib/mollie";

export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const resultaat = await zegAbonnementOp(user.id);
  if ("error" in resultaat) {
    return NextResponse.json(resultaat, { status: 400 });
  }
  return NextResponse.json(resultaat);
}
