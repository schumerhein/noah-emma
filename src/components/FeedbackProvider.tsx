"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bug, Lightbulb, MessageCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { leesbareDeviceLabel } from "@/lib/deviceLabel";
import { cn } from "@/lib/utils";

type FeedbackType = "bug" | "verbetering" | "anders";

type OpenOpties = { type?: FeedbackType; bericht?: string };

const FeedbackContext = createContext<{ openFeedback: (opties?: OpenOpties) => void }>({
  openFeedback: () => {},
});

export const useFeedback = () => useContext(FeedbackContext);

const TYPES: { id: FeedbackType; label: string; icon: typeof Bug; placeholder: string }[] = [
  { id: "bug", label: "Iets werkt niet", icon: Bug, placeholder: "Wat probeerde je te doen en wat gebeurde er?" },
  { id: "verbetering", label: "Dit kan beter", icon: Lightbulb, placeholder: "Wat zou je anders of handiger willen zien?" },
  { id: "anders", label: "Anders", icon: MessageCircle, placeholder: "Vertel het ons, ook een compliment mag!" },
];

export function FeedbackProvider({ children, tabTonen = true }: { children: React.ReactNode; tabTonen?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("bug");
  const [bericht, setBericht] = useState("");
  const [email, setEmail] = useState("");
  const [ingelogd, setIngelogd] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const openFeedback = useCallback((opties?: OpenOpties) => {
    setType(opties?.type ?? "bug");
    setBericht(opties?.bericht ?? "");
    setVerstuurd(false);
    setFout(null);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    supabase.auth.getSession().then(({ data: { session } }) => setIngelogd(!!session));
  }, [open]);

  const verstuur = async () => {
    if (bericht.trim().length < 3 || bezig) return;
    setBezig(true);
    setFout(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          type,
          bericht,
          contact_email: session ? null : email,
          pagina: window.location.pathname,
          apparaat: leesbareDeviceLabel(navigator.userAgent),
          scherm: `${window.innerWidth}x${window.innerHeight}`,
          app_versie: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Versturen is niet gelukt. Probeer het zo nog eens.");
      setVerstuurd(true);
      setBericht("");
      setEmail("");
    } catch (err) {
      setFout(err instanceof Error ? err.message : "Versturen is niet gelukt. Probeer het zo nog eens.");
    } finally {
      setBezig(false);
    }
  };

  const waarde = useMemo(() => ({ openFeedback }), [openFeedback]);
  const huidig = TYPES.find(t => t.id === type)!;

  return (
    <FeedbackContext.Provider value={waarde}>
      {children}

      {/* Zwevend tabje aan de rand — op elk scherm bereikbaar, zonder de navigatie te storen */}
      {tabTonen && !open && pathname !== "/landing" && (
        <div className="fixed inset-x-0 top-[38%] max-w-md mx-auto z-40 pointer-events-none">
          <button
            type="button"
            onClick={() => openFeedback()}
            aria-label="Feedback geven"
            className="pointer-events-auto absolute right-0 flex items-center gap-1.5 bg-foreground/85 text-background text-[10px] font-bold uppercase tracking-widest py-3 px-1.5 rounded-l-xl shadow-md active:scale-95 transition-transform [writing-mode:vertical-rl] rotate-180"
          >
            <MessageCircle className="w-3.5 h-3.5 rotate-90" />
            Feedback
          </button>
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto px-6 pt-6 pb-8 max-h-[92vh] overflow-y-auto">
          {verstuurd ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <SheetTitle className="text-xl font-black">Bedankt!</SheetTitle>
              <SheetDescription className="text-sm text-slate-500">
                Je feedback is binnen. Hiermee maken we Noah &amp; Emma beter.
              </SheetDescription>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full h-12 rounded-2xl bg-primary text-white font-bold text-sm"
              >
                Sluiten
              </button>
            </div>
          ) : (
            <>
              <SheetHeader className="text-left space-y-1">
                <SheetTitle className="text-xl font-black">Jouw feedback</SheetTitle>
                <SheetDescription className="text-sm text-slate-500">
                  Werkt iets niet of kan iets beter? Laat het ons weten, we lezen alles.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {TYPES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border-2 text-[11px] font-bold leading-tight text-center transition-all",
                      type === t.id ? "border-primary bg-primary/10 text-primary" : "border-slate-100 dark:border-slate-700 text-slate-500"
                    )}
                  >
                    <t.icon className="w-5 h-5" />
                    {t.label}
                  </button>
                ))}
              </div>

              <textarea
                value={bericht}
                onChange={e => setBericht(e.target.value)}
                maxLength={2000}
                rows={5}
                placeholder={huidig.placeholder}
                className="mt-4 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary resize-none"
              />

              {!ingelogd && (
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Je e-mailadres (optioneel, voor een reactie)"
                  className="mt-3 w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary"
                />
              )}

              <p className="mt-3 text-[11px] text-slate-400">
                We sturen automatisch mee op welk scherm je zit en welk apparaat je gebruikt, zodat we het sneller kunnen vinden.
              </p>

              {fout && <p className="mt-3 text-sm font-semibold text-red-500">{fout}</p>}

              <button
                onClick={verstuur}
                disabled={bericht.trim().length < 3 || bezig}
                className="mt-4 w-full h-13 py-3.5 rounded-2xl bg-primary text-white font-black text-base flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                {bezig ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                {bezig ? "Versturen…" : "Feedback versturen"}
              </button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </FeedbackContext.Provider>
  );
}
