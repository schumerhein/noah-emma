"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const GESLACHTEN = ["Man", "Vrouw", "Niet-binair", "Zeg ik liever niet"];

export default function AccountInstellingenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [naam, setNaam] = useState("");
  const [geslacht, setGeslacht] = useState("");
  const [verjaardag, setVerjaardag] = useState("");
  const [toonGeslacht, setToonGeslacht] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("naam, geslacht, geboortedatum, telefoonnummer")
        .eq("id", user.id)
        .single();

      if (data) {
        setNaam(data.naam || "");
        setGeslacht(data.geslacht || "");
        setVerjaardag(data.geboortedatum || "");
        setTelefoon(data.telefoonnummer || "");
      }
      setLaden(false);
    })();
  }, []);

  const slaOp = async () => {
    if (!userId) return;
    setOpslaan(true);
    await supabase.from("profiles").update({
      naam: naam.trim() || null,
      geslacht: geslacht || null,
      geboortedatum: verjaardag || null,
      telefoonnummer: telefoon.trim() || null,
    }).eq("id", userId);
    setOpslaan(false);
    toast({ title: "Opgeslagen ✓" });
    router.back();
  };

  if (laden) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Sluiten
          </button>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Accountinstellingen</h1>
          <button
            onClick={slaOp}
            disabled={opslaan}
            className="text-sm font-bold text-primary"
          >
            {opslaan ? "..." : "Opslaan"}
          </button>
        </div>
      </header>

      <main className="pt-6 space-y-0">
        {/* E-mail */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex-1 min-w-0">
              <p className="text-[17px] text-slate-900 dark:text-white">{email}</p>
              <p className="text-sm text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Geverifieerd
              </p>
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

        {/* Naam */}
        <div className="bg-white dark:bg-slate-900 mt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <label className="text-xs text-slate-400 mb-1 block">Echte naam</label>
            <input
              value={naam}
              onChange={e => setNaam(e.target.value)}
              placeholder="Voor- en achternaam"
              className="w-full text-[17px] text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Geslacht */}
          <div className="border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setToonGeslacht(!toonGeslacht)}
              className="w-full flex items-center justify-between px-6 py-4"
            >
              <div className="text-left">
                <label className="text-xs text-slate-400 block mb-0.5">Geslacht</label>
                <span className="text-[17px] text-slate-900 dark:text-white">{geslacht || "Selecteer"}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 text-slate-300 transition-transform", toonGeslacht ? "rotate-90" : "")} />
            </button>
            {toonGeslacht && (
              <div className="border-t border-slate-100 dark:border-slate-800">
                {GESLACHTEN.map(g => (
                  <button
                    key={g}
                    onClick={() => { setGeslacht(g); setToonGeslacht(false); }}
                    className="w-full flex items-center justify-between px-6 py-3.5 border-b border-slate-50 dark:border-slate-800 last:border-0"
                  >
                    <span className={cn("text-[17px]", geslacht === g ? "text-primary font-bold" : "text-slate-700 dark:text-slate-300")}>{g}</span>
                    {geslacht === g && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verjaardag */}
          <div className="px-6 py-4">
            <label className="text-xs text-slate-400 mb-1 block">Verjaardag</label>
            <input
              type="date"
              value={verjaardag}
              onChange={e => setVerjaardag(e.target.value)}
              max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              className="text-[17px] text-slate-900 dark:text-white bg-transparent outline-none w-full"
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 px-6 py-3 bg-slate-50 dark:bg-slate-950 leading-relaxed">
          Dankzij verificatie vergroot je jouw kansen om artikelen te verkopen en kun je sneller aankopen doen.
        </p>

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
