"use client";

import Link from "next/link";
import { useFeedback } from "@/components/FeedbackProvider";

export default function ErrorPagina({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { openFeedback } = useFeedback();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8 text-center bg-white dark:bg-slate-900">
      <div className="text-6xl">🙈</div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Oeps, er ging iets mis</h1>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
        Dit hoort niet te gebeuren. Probeer het opnieuw, en laat het ons weten zodat we het kunnen oplossen.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="h-12 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          Opnieuw proberen
        </button>
        <button
          onClick={() => openFeedback({ type: "bug", bericht: `Er ging iets mis op deze pagina.${error.digest ? ` (foutcode ${error.digest})` : ""}\n\nWat ik aan het doen was: ` })}
          className="h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold active:scale-[0.98] transition-all"
        >
          Meld dit probleem
        </button>
        <Link href="/" className="text-sm font-bold text-primary pt-1">Terug naar Ontdekken</Link>
      </div>
    </div>
  );
}
