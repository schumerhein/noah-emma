"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldCheck, Check, X, ChevronLeft as Prev, ChevronRight as Next } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type WachtendeListing = {
  id: string;
  titel: string;
  beschrijving: string | null;
  prijs: number;
  maat: string;
  categorie: string;
  conditie: string;
  foto_urls: string[];
  created_at: string;
  user_id: string;
  profiles: { naam: string | null; stad: string | null } | null;
};

const AFKEUR_REDENEN = [
  "Herkenbare kinderfoto",
  "Geen kinderartikel",
  "Misleidende of onvolledige beschrijving",
  "Verboden of onveilig product",
  "Ongepaste inhoud",
  "Andere reden",
];

export default function ModeratiePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [laden, setLaden] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [wachtrij, setWachtrij] = useState<WachtendeListing[]>([]);
  const [fotoIndex, setFotoIndex] = useState<Record<string, number>>({});
  const [bezigMet, setBezigMet] = useState<string | null>(null);
  const [afkeurItem, setAfkeurItem] = useState<WachtendeListing | null>(null);
  const [afkeurReden, setAfkeurReden] = useState<string | null>(null);

  useEffect(() => {
    laadWachtrij();
  }, []);

  const laadWachtrij = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Alleen admins mogen hier komen
    const { data: profiel } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profiel?.is_admin) {
      setIsAdmin(false);
      setLaden(false);
      return;
    }
    setIsAdmin(true);

    const { data } = await supabase
      .from("listings")
      .select("id, titel, beschrijving, prijs, maat, categorie, conditie, foto_urls, created_at, user_id, profiles(naam, stad)")
      .eq("moderatie_status", "wachtend")
      .order("created_at", { ascending: true });

    setWachtrij((data as unknown as WachtendeListing[]) || []);
    setLaden(false);
  };

  const keurGoed = async (item: WachtendeListing) => {
    setBezigMet(item.id);
    const { error } = await supabase.from("listings")
      .update({ moderatie_status: "goedgekeurd", moderatie_reden: null })
      .eq("id", item.id);
    if (error) {
      toast({ variant: "destructive", title: "Goedkeuren mislukt", description: error.message });
    } else {
      setWachtrij(prev => prev.filter(l => l.id !== item.id));
      toast({ title: `"${item.titel}" goedgekeurd ✓` });
    }
    setBezigMet(null);
  };

  const keurAf = async () => {
    if (!afkeurItem || !afkeurReden) return;
    setBezigMet(afkeurItem.id);
    const { error } = await supabase.from("listings")
      .update({ moderatie_status: "afgekeurd", moderatie_reden: afkeurReden, actief: false })
      .eq("id", afkeurItem.id);
    if (error) {
      toast({ variant: "destructive", title: "Afkeuren mislukt", description: error.message });
    } else {
      setWachtrij(prev => prev.filter(l => l.id !== afkeurItem.id));
      toast({ title: `"${afkeurItem.titel}" afgekeurd` });
    }
    setBezigMet(null);
    setAfkeurItem(null);
    setAfkeurReden(null);
  };

  if (laden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
        <ShieldCheck className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Geen toegang</h2>
        <p className="text-sm text-slate-400">Deze pagina is alleen voor beheerders.</p>
        <button onClick={() => router.push("/")} className="text-primary font-bold">Terug naar de app</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display pb-32">
      <header className="pt-14 pb-4 px-6 flex items-center gap-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Moderatie</h1>
          <p className="text-xs text-slate-400">{wachtrij.length} {wachtrij.length === 1 ? "advertentie wacht" : "advertenties wachten"} op beoordeling</p>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {wachtrij.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-600 dark:text-slate-300">Alles beoordeeld</h2>
            <p className="text-sm text-slate-400">Er staan geen advertenties in de wachtrij.</p>
          </div>
        )}

        {wachtrij.map(item => {
          const idx = fotoIndex[item.id] || 0;
          const fotos = item.foto_urls || [];
          return (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
              {/* Foto's */}
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                {fotos[idx] ? (
                  <Image src={fotos[idx]} alt={item.titel} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-icons-round text-slate-300 text-4xl">image</span>
                  </div>
                )}
                {fotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setFotoIndex(p => ({ ...p, [item.id]: Math.max(0, idx - 1) }))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center"
                    >
                      <Prev className="w-5 h-5 text-slate-600" />
                    </button>
                    <button
                      onClick={() => setFotoIndex(p => ({ ...p, [item.id]: Math.min(fotos.length - 1, idx + 1) }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center"
                    >
                      <Next className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/50 text-white text-[10px] font-bold">
                      {idx + 1}/{fotos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white">{item.titel}</h3>
                  <span className="font-black text-primary shrink-0">€{item.prijs.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">Maat {item.maat}</span>
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{item.conditie}</span>
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{item.categorie}</span>
                </div>
                {item.beschrijving && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.beschrijving}</p>
                )}
                <p className="text-xs text-slate-400">
                  Door <strong>{item.profiles?.naam || "Onbekend"}</strong>
                  {item.profiles?.stad ? ` · ${item.profiles.stad}` : ""} · {new Date(item.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                </p>

                {/* Acties */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setAfkeurItem(item); setAfkeurReden(null); }}
                    disabled={bezigMet === item.id}
                    className="flex-1 h-12 rounded-2xl border-2 border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Afkeuren
                  </button>
                  <button
                    onClick={() => keurGoed(item)}
                    disabled={bezigMet === item.id}
                    className="flex-1 h-12 rounded-2xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {bezigMet === item.id ? "Bezig..." : "Goedkeuren"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Afkeur modal */}
      {afkeurItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Advertentie afkeuren</h2>
              <button onClick={() => setAfkeurItem(null)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-400">Waarom keur je "{afkeurItem.titel}" af? De verkoper ziet deze reden.</p>

            <div className="space-y-2">
              {AFKEUR_REDENEN.map(reden => (
                <button
                  key={reden}
                  onClick={() => setAfkeurReden(reden)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all",
                    afkeurReden === reden
                      ? "border-red-400 bg-red-50 text-red-600 font-bold"
                      : "border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  )}
                >
                  {reden}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setAfkeurItem(null)} className="flex-1 h-12 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm">
                Annuleren
              </button>
              <button
                onClick={keurAf}
                disabled={!afkeurReden || bezigMet === afkeurItem.id}
                className="flex-1 h-12 rounded-2xl bg-red-500 text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                Afkeuren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
