"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut, Clock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function SessiesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bezig, setBezig] = useState(false);

  const uitloggenOveral = async () => {
    setBezig(true);
    await supabase.auth.signOut({ scope: "global" });
    toast({ title: "Overal uitgelogd" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Login activiteit</h1>
        </div>
      </header>

      <main className="pt-6">
        <div className="mx-6 flex items-start gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 px-4 py-3.5">
          <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Een overzicht per apparaat is <strong>binnenkort beschikbaar</strong>. Twijfel je of iemand anders toegang
            heeft tot je account? Log dan hieronder overal in één keer uit.
          </p>
        </div>

        <div className="mt-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={uitloggenOveral}
            disabled={bezig}
            className="w-full flex items-center gap-4 px-6 py-4 active:bg-red-50 dark:active:bg-red-900/10 disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-[17px] text-red-500">Overal uitloggen</span>
          </button>
        </div>
      </main>
    </div>
  );
}
