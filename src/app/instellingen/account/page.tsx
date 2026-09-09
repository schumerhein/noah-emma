"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AccountInstellingenPage() {
  const router = useRouter();
  const [laden, setLaden] = useState(true);
  const [email, setEmail] = useState("");
  const [emailGeverifieerd, setEmailGeverifieerd] = useState(false);
  const [telefoon, setTelefoon] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
      setEmailGeverifieerd(!!user.email_confirmed_at);

      const { data } = await supabase.from("profiles").select("telefoonnummer").eq("id", user.id).single();
      setTelefoon(data?.telefoonnummer || "");
      setLaden(false);
    })();
  }, []);

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
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Accountinstellingen</h1>
        </div>
      </header>

      <main className="pt-6 space-y-0">
        {/* E-mail */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex-1 min-w-0">
              <p className="text-[17px] text-slate-900 dark:text-white">{email}</p>
              {emailGeverifieerd ? (
                <p className="text-sm text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Geverifieerd
                </p>
              ) : (
                <p className="text-sm text-slate-400 mt-0.5">Niet geverifieerd</p>
              )}
            </div>
            <button onClick={() => router.push("/instellingen/email")} className="text-sm font-bold text-primary border border-primary/30 px-4 py-1.5 rounded-lg ml-3 shrink-0">
              Wijzigen
            </button>
          </div>

          {/* Telefoon */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1 min-w-0">
              {telefoon ? (
                <>
                  <p className="text-[17px] text-slate-900 dark:text-white">+31 {telefoon}</p>
                  <p className="text-sm text-slate-400 mt-0.5">Niet geverifieerd</p>
                </>
              ) : (
                <>
                  <p className="text-[17px] text-slate-400">Telefoonnummer</p>
                  <p className="text-sm text-slate-400 mt-0.5">Optioneel</p>
                </>
              )}
            </div>
            <button onClick={() => router.push("/instellingen/telefoon")} className="text-sm font-bold text-primary border border-primary/30 px-4 py-1.5 rounded-lg ml-3 shrink-0">
              {telefoon ? "Wijzigen" : "Toevoegen"}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 px-6 py-3 bg-slate-50 dark:bg-slate-950 leading-relaxed">
          Je telefoonnummer wordt alleen gebruikt bij het inloggen. Het wordt niet openbaar gemaakt of gebruikt voor marketingdoeleinden.
        </p>

        {/* Naam, foto en overige profielgegevens */}
        <div className="bg-white dark:bg-slate-900 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => router.push("/instellingen/profiel")}
            className="w-full flex items-center justify-between px-6 py-4 active:bg-slate-50 dark:active:bg-slate-800"
          >
            <span className="text-[17px] text-slate-900 dark:text-white">Naam, foto en profielgegevens</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Wachtwoord + Account verwijderen */}
        <div className="bg-white dark:bg-slate-900 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => router.push("/instellingen/wachtwoord")}
            className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
          >
            <span className="text-[17px] text-slate-900 dark:text-white">Wachtwoord wijzigen</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={() => router.push("/instellingen?verwijder=1")}
            className="w-full flex items-center justify-between px-6 py-4 active:bg-red-50 dark:active:bg-red-900/10"
          >
            <span className="text-[17px] text-red-500">Account verwijderen</span>
            <ChevronRight className="w-4 h-4 text-red-200" />
          </button>
        </div>
      </main>
    </div>
  );
}
