"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

// Kop met terugknop voor de juridische pagina's in de app.
export function AppKop({ titel }: { titel: string }) {
  const router = useRouter();
  return (
    <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="Terug">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">{titel}</h1>
      </div>
    </header>
  );
}
