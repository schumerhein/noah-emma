"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { slaActiefKindOp, leesActiefKind } from "@/components/ThemeProvider";

const MAATLIJST = ["50","56","62","68","74","80","86","92","98","104","110","116","122","128","134","140","146","152","158/164"];

type Geslacht = "meisje" | "jongen";

export default function KindBewerkenPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();

  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);
  const [bevestigVerwijder, setBevestigVerwijder] = useState(false);

  const [naam, setNaam] = useState("");
  const [geslacht, setGeslacht] = useState<Geslacht | null>(null);
  const [geboortedatum, setGeboortedatum] = useState("");
  const [maat, setMaat] = useState("86");

  // App is voor kinderen van 0–12 jaar
  const kindTeOud = (() => {
    if (!geboortedatum) return false;
    const geb = new Date(geboortedatum);
    const nu = new Date();
    const maanden = (nu.getFullYear() - geb.getFullYear()) * 12 + (nu.getMonth() - geb.getMonth());
    return maanden >= 13 * 12;
  })();
  const minGeboortedatum = new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split("T")[0];

  useEffect(() => { laadKind(); }, [id]);

  const laadKind = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) { router.push("/profile"); return; }

    setNaam(data.naam || "");
    setGeslacht(data.geslacht as Geslacht || null);
    setGeboortedatum(data.geboortedatum || "");
    setMaat(data.maat || "86");
    setLaden(false);
  };

  const slaOp = async () => {
    if (kindTeOud) {
      toast({ title: "Controleer de geboortedatum", description: "Noah & Emma is voor kinderen van 0 t/m 12 jaar." });
      return;
    }
    setOpslaan(true);
    const { error } = await supabase.from("children").update({
      naam: naam || null,
      geslacht: geslacht,
      geboortedatum: geboortedatum || null,
      maat,
    }).eq("id", id);

    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message });
      setOpslaan(false);
      return;
    }

    // Update actief kind als dit het actieve kind is
    const actief = leesActiefKind();
    if (actief?.id === id) {
      slaActiefKindOp({ id, naam: naam || null, maat, geslacht });
    }

    toast({ title: `${naam || "Kind"} bijgewerkt ✓` });
    router.push("/profile");
  };

  const verwijderKind = async () => {
    if (!bevestigVerwijder) { setBevestigVerwijder(true); return; }
    await supabase.from("children").delete().eq("id", id);

    // Als dit het actieve kind was, localStorage wissen
    const actief = leesActiefKind();
    if (actief?.id === id) {
      localStorage.removeItem("actief_kind");
      document.documentElement.removeAttribute("data-gender");
    }

    toast({ title: "Kind verwijderd." });
    router.push("/profile");
  };

  if (laden) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-40">
      {/* Header */}
      <header className="px-5 pt-14 pb-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900 flex items-center justify-between">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-[17px] font-black text-slate-900 dark:text-white">Kind bewerken</h1>
        <div className="w-6" />
      </header>

      <main className="px-5 pt-6 space-y-7 max-w-lg mx-auto">

        {/* Geslacht */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500">Geslacht</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGeslacht("jongen")}
              className={cn(
                "py-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                geslacht === "jongen"
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                  : "border-slate-100 dark:border-slate-700"
              )}
            >
              <span className="text-4xl">👦</span>
              <span className={cn("text-sm font-bold", geslacht === "jongen" ? "text-blue-500" : "text-slate-500")}>Jongen</span>
            </button>
            <button
              onClick={() => setGeslacht("meisje")}
              className={cn(
                "py-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                geslacht === "meisje"
                  ? "border-primary bg-primary/5"
                  : "border-slate-100 dark:border-slate-700"
              )}
            >
              <span className="text-4xl">👧</span>
              <span className={cn("text-sm font-bold", geslacht === "meisje" ? "text-primary" : "text-slate-500")}>Meisje</span>
            </button>
          </div>
        </div>

        {/* Naam */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Naam</label>
          <input
            value={naam}
            onChange={e => setNaam(e.target.value)}
            placeholder="Naam van je kind"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Geboortedatum */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Geboortedatum</label>
          <input
            type="date"
            value={geboortedatum}
            onChange={e => setGeboortedatum(e.target.value)}
            min={minGeboortedatum}
            max={new Date().toISOString().split("T")[0]}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary"
          />
          {kindTeOud && (
            <p className="text-xs font-bold text-red-500 mt-1">Noah &amp; Emma is voor kinderen van 0 t/m 12 jaar.</p>
          )}
        </div>

        {/* Maat */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500">Maat</label>
          <div className="grid grid-cols-5 gap-2">
            {MAATLIJST.map(m => (
              <button
                key={m}
                onClick={() => setMaat(m)}
                className={cn(
                  "py-3 rounded-xl text-xs font-bold border-2 transition-all",
                  maat === m
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="bg-primary/10 rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-primary">Geselecteerd: Maat {maat}</p>
          </div>
        </div>

        {/* Verwijderen */}
        <div className="pt-2 space-y-2">
          <button
            onClick={verwijderKind}
            className={cn(
              "w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all",
              bevestigVerwijder
                ? "bg-red-500 text-white border-red-500"
                : "border-red-200 text-red-400"
            )}
          >
            <Trash2 className="w-4 h-4" />
            {bevestigVerwijder ? "Definitief verwijderen" : "Kind verwijderen"}
          </button>
          {bevestigVerwijder && (
            <button onClick={() => setBevestigVerwijder(false)} className="w-full text-center text-sm text-slate-400">
              Annuleren
            </button>
          )}
        </div>
      </main>

      {/* Opslaan */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={slaOp}
          disabled={opslaan}
          className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          {opslaan ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          {opslaan ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </div>
    </div>
  );
}
