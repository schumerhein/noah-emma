"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserX, Unlock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type GeblokkeerdeGebruiker = {
  id: string;
  geblokkeerd_id: string;
  created_at: string;
  profiel: { naam: string | null; stad: string | null; avatar_url: string | null } | null;
};

export default function GeblokkeerdeGebruikersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [gebruikers, setGebruikers] = useState<GeblokkeerdeGebruiker[]>([]);
  const [laden, setLaden] = useState(true);
  const [deblokkeerBezig, setDeblokkeerBezig] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("blocks")
        .select("id, geblokkeerd_id, created_at, profiel:profiles!blocks_geblokkeerd_id_fkey(naam, stad, avatar_url)")
        .eq("blokkeerder_id", user.id)
        .order("created_at", { ascending: false });

      setGebruikers((data as unknown as GeblokkeerdeGebruiker[]) || []);
      setLaden(false);
    })();
  }, []);

  const deblokkeer = async (id: string, geblokkeerd_id: string) => {
    setDeblokkeerBezig(geblokkeerd_id);
    await supabase.from("blocks").delete().eq("id", id);
    setGebruikers(prev => prev.filter(g => g.id !== id));
    toast({ title: "Gebruiker gedeblokkeerd" });
    setDeblokkeerBezig(null);
  };

  if (laden) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Geblokkeerde gebruikers</h1>
          </div>
          {gebruikers.length > 0 && (
            <span className="text-xs font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              {gebruikers.length}
            </span>
          )}
        </div>
      </header>

      <main className="px-5 pt-6">
        {gebruikers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <UserX className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-200">Geen geblokkeerde gebruikers</p>
              <p className="text-sm text-slate-400 mt-1">
                Gebruikers die je blokkeert kunnen geen<br />berichten sturen of jouw profiel zien.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 px-1">Geblokkeerde gebruikers kunnen geen berichten sturen of jouw advertenties zien.</p>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              {gebruikers.map((g, idx) => (
                <div key={g.id} className={cn(
                  "flex items-center gap-4 px-5 py-4",
                  idx < gebruikers.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""
                )}>
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-lg font-black text-primary">
                    {g.profiel?.naam?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                      {g.profiel?.naam || "Onbekende gebruiker"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Geblokkeerd op {new Date(g.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                  <button
                    onClick={() => deblokkeer(g.id, g.geblokkeerd_id)}
                    disabled={deblokkeerBezig === g.geblokkeerd_id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
                  >
                    {deblokkeerBezig === g.geblokkeerd_id ? (
                      <span className="material-icons-round text-xs animate-spin">progress_activity</span>
                    ) : (
                      <><Unlock className="w-3.5 h-3.5" /> Deblokkeer</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
