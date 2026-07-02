import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Eenmalige migratieroute — voeg geslacht kolom toe aan children tabel
// Aanroepen via: GET /api/migrate
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.rpc("exec_sql", {
    query: `ALTER TABLE children ADD COLUMN IF NOT EXISTS geslacht TEXT CHECK (geslacht IN ('meisje', 'jongen'));`
  });

  // Probeer direct via raw SQL als RPC niet werkt
  if (error) {
    // Supabase heeft geen directe SQL endpoint via de client — gebruik de postgrest manier
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      method: "GET",
      headers: {
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY!,
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      }
    });
    return NextResponse.json({
      note: "Voer dit handmatig uit in Supabase SQL Editor:",
      sql: "ALTER TABLE children ADD COLUMN IF NOT EXISTS geslacht TEXT CHECK (geslacht IN ('meisje', 'jongen'));",
      error: error.message
    });
  }

  return NextResponse.json({ success: true, message: "geslacht kolom toegevoegd!" });
}
