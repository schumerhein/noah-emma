"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Rocket, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function BoostBevestigingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [status, setStatus] = useState<"laden" | "paid" | "anders">("laden");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStatus("anders"); return; }

      const res = await fetch(`/api/betalen/status?type=boost&listingId=${listingId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      setStatus(data.status === "paid" ? "paid" : "anders");
    })();
  }, [listingId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background dark:bg-background-dark">
      {status === "laden" && <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />}
      {status === "paid" && (
        <>
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Rocket className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Advertentie geboost!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Je advertentie verschijnt nu vaker in de swipe-flow en zoekresultaten.</p>
          <Button onClick={() => router.push(`/product/${listingId}`)} className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl h-12 px-8 border-none">
            Bekijk advertentie
          </Button>
        </>
      )}
      {status === "anders" && (
        <>
          <XCircle className="w-12 h-12 text-slate-400 mb-4" />
          <h1 className="text-2xl font-extrabold mb-2">Betaling niet voltooid</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Er is geen betaling ontvangen. Probeer het gerust nog eens.</p>
          <Button onClick={() => router.push(`/promote/${listingId}`)} className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl h-12 px-8 border-none">
            Terug naar Boost
          </Button>
        </>
      )}
    </div>
  );
}
