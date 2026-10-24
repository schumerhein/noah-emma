"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bug, Lightbulb, MessageCircle, Mail, Smartphone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Status = "nieuw" | "in_behandeling" | "afgehandeld";
type FeedbackType = "bug" | "verbetering" | "anders";

type FeedbackItem = {
  id: string;
  created_at: string;
  type: FeedbackType;
  bericht: string;
  pagina: string | null;
  apparaat: string | null;
  scherm: string | null;
  app_versie: string | null;
  contact_email: string | null;
  status: Status;
  profiles: { naam: string | null } | null;
};

const TYPE_INFO: Record<FeedbackType, { label: string; icon: typeof Bug; kleur: string }> = {
  bug: { label: "Werkt niet", icon: Bug, kleur: "bg-red-100 text-red-600" },
  verbetering: { label: "Kan beter", icon: Lightbulb, kleur: "bg-amber-100 text-amber-700" },
  anders: { label: "Anders", icon: MessageCircle, kleur: "bg-sky-100 text-sky-700" },
};

const STATUS_FILTERS: { id: Status | "alles"; label: string }[] = [
  { id: "nieuw", label: "Nieuw" },
  { id: "in_behandeling", label: "In behandeling" },
  { id: "afgehandeld", label: "Afgehandeld" },
  { id: "alles", label: "Alles" },
];

const VOLGENDE_STATUS: Record<Status, { naar: Status; label: string }> = {
  nieuw: { naar: "in_behandeling", label: "Oppakken" },
  in_behandeling: { naar: "afgehandeld", label: "Afronden" },
  afgehandeld: { naar: "nieuw", label: "Heropenen" },
};

export default function FeedbackBeheerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [laden, setLaden] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<Status | "alles">("nieuw");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profiel } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
      if (!profiel?.is_admin) { setLaden(false); return; }
      setIsAdmin(true);

      const { data } = await supabase
        .from("feedback")
        .select("id, created_at, type, bericht, pagina, apparaat, scherm, app_versie, contact_email, status, profiles(naam)")
        .order("created_at", { ascending: false })
        .limit(300);
      setItems((data as unknown as FeedbackItem[]) || []);
      setLaden(false);
    })();
  }, [router]);

  const zetStatus = async (item: FeedbackItem, status: Status) => {
    const { error } = await supabase.from("feedback").update({ status }).eq("id", item.id);
    if (error) {
      toast({ variant: "destructive", title: "Bijwerken mislukt", description: "Probeer het zo nog eens." });
      return;
    }
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, status } : i)));
  };

  const zichtbaar = items.filter(i => filter === "alles" || i.status === filter);
  const aantal = (s: Status) => items.filter(i => i.status === s).length;

  if (laden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8 text-center bg-white dark:bg-slate-900">
        <p className="text-xl font-black text-slate-900 dark:text-white">Geen toegang</p>
        <p className="text-sm text-slate-400">Deze pagina is alleen voor beheerders.</p>
        <button onClick={() => router.push("/")} className="text-sm font-bold text-primary">Terug naar de app</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 space-y-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Feedback</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border",
                filter === f.id ? "bg-primary text-white border-primary" : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
              )}
            >
              {f.label}
              {f.id !== "alles" && ` (${aantal(f.id)})`}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 pt-4 space-y-3">
        {zichtbaar.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-16">Geen feedback in deze lijst.</p>
        )}
        {zichtbaar.map(item => {
          const info = TYPE_INFO[item.type];
          const volgende = VOLGENDE_STATUS[item.status];
          return (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full", info.kleur)}>
                  <info.icon className="w-3 h-3" />
                  {info.label}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(item.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words">{item.bericht}</p>

              <div className="space-y-1 text-[11px] text-slate-400">
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 shrink-0" />
                  {item.profiles?.naam ? `${item.profiles.naam} · ` : "Gast · "}
                  {item.contact_email ? (
                    <a href={`mailto:${item.contact_email}`} className="text-primary font-semibold truncate">{item.contact_email}</a>
                  ) : (
                    "geen e-mail"
                  )}
                </p>
                {item.pagina && (
                  <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" />{item.pagina}</p>
                )}
                {(item.apparaat || item.scherm) && (
                  <p className="flex items-center gap-1.5">
                    <Smartphone className="w-3 h-3 shrink-0" />
                    {[item.apparaat, item.scherm, item.app_versie && `versie ${item.app_versie}`].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  {item.status === "in_behandeling" ? "In behandeling" : item.status === "afgehandeld" ? "Afgehandeld" : "Nieuw"}
                </span>
                <button
                  onClick={() => zetStatus(item, volgende.naar)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
                >
                  {volgende.label}
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
