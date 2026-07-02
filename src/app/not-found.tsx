"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8 text-center bg-white dark:bg-slate-900">
      <div className="flex items-center gap-1 text-6xl">
        <span>👦</span>
        <span>👧</span>
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Oeps, niets gevonden</h1>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
        Deze pagina bestaat niet (meer). Misschien is het artikel al verkocht, of klopt de link niet.
      </p>
      <Link
        href="/"
        className="mt-2 h-12 px-8 bg-primary text-white rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
      >
        Terug naar Ontdekken
      </Link>
    </div>
  );
}
