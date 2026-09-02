import { NextResponse } from "next/server";
import { haalGebruikerOp } from "@/lib/mollie";
import { verwijderAccount } from "@/lib/account";

export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  await verwijderAccount(user.id);
  return NextResponse.json({ ok: true });
}
