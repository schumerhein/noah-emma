import { createClient } from "@supabase/supabase-js";

// Server-only client met volledige rechten (service role) — voor gebruik in
// API-routes en webhooks die buiten de rechten van een ingelogde gebruiker
// om moeten werken.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
