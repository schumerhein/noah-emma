"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Baby, ChevronRight, Calendar, ArrowLeft, Sparkles, Check } from "lucide-react";

const MAATLIJST = ["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158/164"];

function schatMaatOpLeeftijd(maanden: number): string {
  if (maanden <= 1)  return "50";
  if (maanden <= 3)  return "56";
  if (maanden <= 6)  return "62";
  if (maanden <= 9)  return "68";
  if (maanden <= 12) return "74";
  if (maanden <= 18) return "80";
  if (maanden <= 24) return "86";
  if (maanden <= 36) return "92";
  if (maanden <= 48) return "98";
  if (maanden <= 60) return "104";
  if (maanden <= 72) return "110";
  if (maanden <= 84) return "116";
  if (maanden <= 96) return "122";
  return "128";
}

function berekenLeeftijdInMaanden(geboortedatum: string): number {
  const geb = new Date(geboortedatum);
  const nu = new Date();
  return (nu.getFullYear() - geb.getFullYear()) * 12 + (nu.getMonth() - geb.getMonth());
}

function formatLeeftijd(maanden: number): string {
  if (maanden < 0) return "Nog niet geboren";
  if (maanden < 1) return "Pasgeboren";
  if (maanden < 24) return `${maanden} maanden`;
  const jaren = Math.floor(maanden / 12);
  const rest = maanden % 12;
  if (rest === 0) return `${jaren} jaar`;
  return `${jaren} jaar en ${rest} maanden`;
}

type Geslacht = "meisje" | "jongen" | null;

export default function KindOnboardingPage() {
  const router = useRouter();
  const [stap, setStap] = useState<1 | 2 | 3 | 4>(1);
  const [geslacht, setGeslacht] = useState<Geslacht>(null);
  const [naam, setNaam] = useState("");
  const [geboortedatum, setGeboortedatum] = useState("");
  const [gekozenMaat, setGekozenMaat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const leeftijdMaanden = geboortedatum ? berekenLeeftijdInMaanden(geboortedatum) : 0;
  const gesuggeerdeMaat = geboortedatum ? schatMaatOpLeeftijd(leeftijdMaanden) : null;
  // App is voor kinderen van 0–12 jaar
  const kindTeOud = geboortedatum ? leeftijdMaanden >= 13 * 12 : false;
  const minGeboortedatum = new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split("T")[0];
  const activeMaat = gekozenMaat ?? gesuggeerdeMaat ?? "86";

  const handleOpslaan = async () => {
    if (kindTeOud) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    await supabase.from("children").insert({
      user_id: user.id,
      naam: naam || null,
      geboortedatum: geboortedatum || new Date().toISOString().split("T")[0],
      maat: activeMaat,
      geslacht: geslacht,
    });

    // Thema direct toepassen
    if (geslacht) {
      document.documentElement.setAttribute("data-gender", geslacht);
    }

    setLoading(false);
    router.push("/");
  };

  const TOTAL_STEPS = 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f3] via-white to-[#fff8f0] font-display flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 flex items-center gap-4">
        {stap > 1 && (
          <button onClick={() => setStap(prev => (prev - 1) as 1 | 2 | 3 | 4)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
        )}
        <div className="flex-1">
          <div className="flex gap-1.5 mb-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full flex-1 transition-all", stap > i ? "bg-primary" : "bg-slate-200")} />
            ))}
          </div>
          <p className="text-xs text-slate-400 font-medium">Stap {stap} van {TOTAL_STEPS}</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-2 pb-10">

        {/* Stap 1: Geslacht */}
        {stap === 1 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center">
                <Baby className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Is het een<br />jongen of meisje?
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                De app past zijn uiterlijk aan op het geslacht van je kind.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGeslacht("jongen")}
                className={cn(
                  "aspect-square rounded-3xl border-3 flex flex-col items-center justify-center gap-4 transition-all text-center p-6 border-2",
                  geslacht === "jongen"
                    ? "border-blue-400 bg-blue-50 scale-[1.03] shadow-md"
                    : "border-slate-100 bg-white"
                )}
              >
                <span className="text-6xl">👦</span>
                <span className={cn("text-lg font-black", geslacht === "jongen" ? "text-blue-500" : "text-slate-600")}>
                  Jongen
                </span>
                {geslacht === "jongen" && (
                  <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setGeslacht("meisje")}
                className={cn(
                  "aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all text-center p-6",
                  geslacht === "meisje"
                    ? "border-primary bg-primary/10 scale-[1.03] shadow-md"
                    : "border-slate-100 bg-white"
                )}
              >
                <span className="text-6xl">👧</span>
                <span className={cn("text-lg font-black", geslacht === "meisje" ? "text-primary" : "text-slate-600")}>
                  Meisje
                </span>
                {geslacht === "meisje" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { if (geslacht) setStap(2); }}
                disabled={!geslacht}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
                  geslacht
                    ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                <span>Verder</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={() => { setGeslacht(null); setStap(2); }} className="w-full text-center text-slate-400 text-sm font-medium py-2">
                Overslaan
              </button>
            </div>
          </div>
        )}

        {/* Stap 2: Naam */}
        {stap === 2 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center">
                <Baby className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Hoe heet{geslacht === "meisje" ? " ze" : geslacht === "jongen" ? " hij" : " je kind"}?
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Noah & Emma filtert automatisch producten die passen bij de huidige maat van jouw kind.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Naam (optioneel)</label>
              <input
                type="text"
                value={naam}
                onChange={e => setNaam(e.target.value)}
                placeholder="Bijv. Noah of Emma"
                className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-800 font-semibold focus:border-primary outline-none transition-all text-lg"
              />
            </div>

            <button
              onClick={() => setStap(3)}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              <span>Verder</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stap 3: Geboortedatum */}
        {stap === 3 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Wanneer is{naam ? ` ${naam}` : " je kind"}<br />geboren?
              </h1>
              <p className="text-slate-500 leading-relaxed">Optioneel — we gebruiken dit om de maat automatisch bij te houden als je kind groeit.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Geboortedatum</label>
              <input
                type="date"
                value={geboortedatum}
                onChange={e => setGeboortedatum(e.target.value)}
                min={minGeboortedatum}
                max={new Date().toISOString().split("T")[0]}
                className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-800 font-semibold focus:border-primary outline-none transition-all text-lg"
              />
            </div>

            {kindTeOud && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <p className="text-sm font-bold text-red-600">Noah &amp; Emma is voor kinderen van 0 t/m 12 jaar. Controleer de geboortedatum.</p>
              </div>
            )}

            {geboortedatum && gesuggeerdeMaat && (
              <div className="bg-white rounded-2xl border border-primary/20 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leeftijd</p>
                  <p className="font-bold text-slate-700">{formatLeeftijd(leeftijdMaanden)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggestie</p>
                  <p className="text-2xl font-black text-primary">Maat {gesuggeerdeMaat}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStap(4)} className="flex-1 h-14 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold text-sm">
                Overslaan
              </button>
              <button onClick={() => setStap(4)} className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                <span>Verder</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Stap 4: Maat kiezen */}
        {stap === 4 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Welke maat draagt<br />{naam || "je kind"} nu?
              </h1>
              <p className="text-slate-500 leading-relaxed">
                Kies de exacte maat. De app filtert hier automatisch op.
                {gesuggeerdeMaat && <span className="font-bold text-primary"> Wij schatten maat {gesuggeerdeMaat} op basis van de leeftijd.</span>}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {MAATLIJST.map(maat => (
                <button
                  key={maat}
                  onClick={() => setGekozenMaat(maat)}
                  className={cn(
                    "py-4 rounded-2xl font-bold text-sm transition-all relative border-2",
                    activeMaat === maat
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/30 scale-105"
                      : "bg-white text-slate-600 border-slate-100 active:scale-95"
                  )}
                >
                  {maat}
                  {maat === gesuggeerdeMaat && activeMaat !== maat && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white" title="Gesuggereerd" />
                  )}
                  {activeMaat === maat && (
                    <Check className="w-3 h-3 absolute top-1 right-1 text-white/70" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 text-center">
              <p className="text-sm font-bold text-primary-dark">
                ✓ Geselecteerd: <span className="text-xl">Maat {activeMaat}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Je kunt dit altijd aanpassen in je profiel</p>
            </div>

            <button
              onClick={handleOpslaan}
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <span className="material-icons-round animate-spin">progress_activity</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Klaar — ontdek producten!</span>
                </>
              )}
            </button>

            <button onClick={() => router.push("/")} className="w-full text-center text-slate-400 text-sm font-medium py-2">
              Later invullen
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
