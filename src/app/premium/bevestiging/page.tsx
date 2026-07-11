"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function PremiumBevestigingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"laden" | "paid" | "anders">("laden");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStatus("anders"); return; }

      const res = await fetch("/api/betalen/status?type=premium", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      setStatus(data.status === "paid" ? "paid" : "anders");
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background dark:bg-background-dark">
      {status === "laden" && <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />}
      {status === "paid" && (
        <>
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Crown className="w-10 h-10 text-primary fill-primary" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Welkom bij Premium!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Je account is bijgewerkt. Veel plezier met alle extra's.</p>
          <Button onClick={() => router.push("/profile")} className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl h-12 px-8 border-none">
            Naar mijn profiel
          </Button>
        </>
      )}
      {status === "anders" && (
        <>
          <XCircle className="w-12 h-12 text-slate-400 mb-4" />
          <h1 className="text-2xl font-extrabold mb-2">Betaling niet voltooid</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Er is geen betaling ontvangen. Probeer het gerust nog eens.</p>
          <Button onClick={() => router.push("/premium")} className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl h-12 px-8 border-none">
            Terug naar Premium
          </Button>
        </>
      )}
    </div>
  );
}
