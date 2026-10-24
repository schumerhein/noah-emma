import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Cookie } from "lucide-react";
import { JURIDISCHE_DOCUMENTEN } from "@/lib/juridischeTeksten";
import { SITE_URL } from "@/components/marketing/links";
import { AppKop } from "./AppKop";

// Appversie van /wettelijk: zelfde informatie, maar binnen de app (met de
// onderbalk), zodat je vanuit je profiel niet op de website belandt.
export const metadata: Metadata = {
  title: "Wettelijke informatie | Noah & Emma",
  alternates: { canonical: `${SITE_URL}/wettelijk` },
  robots: { index: false },
};

export default function AppWettelijkPagina() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      <AppKop titel="Wettelijke informatie" />

      <main className="px-5 pt-5 space-y-5">
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Alle afspraken en regels van Noah &amp; Emma op één plek.
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {JURIDISCHE_DOCUMENTEN.map((d, i) => (
            <Link key={d.slug} href={`/instellingen/juridisch/${d.slug}`}
              className={`flex items-center gap-4 px-4 py-4 active:bg-slate-50 dark:active:bg-slate-800 ${i > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}`}>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-slate-800 dark:text-slate-100 block">{d.naam}</span>
                <span className="text-xs text-slate-400">{d.kort}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </Link>
          ))}
        </div>

        <Link href="/voorkeuren" className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 active:scale-[0.98] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-slate-800 dark:text-slate-100 block">Mijn cookievoorkeuren</span>
            <span className="text-xs text-slate-400">Kies welke cookies je toestaat</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>

        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Bedrijfsgegevens</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="font-semibold text-slate-700 dark:text-slate-200">Naam</dt>
            <dd className="text-slate-500 dark:text-slate-400">Noah &amp; Emma</dd>
            <dt className="font-semibold text-slate-700 dark:text-slate-200">Land</dt>
            <dd className="text-slate-500 dark:text-slate-400">Nederland</dd>
            <dt className="font-semibold text-slate-700 dark:text-slate-200">E-mail</dt>
            <dd><a href="mailto:info@noah-emma.nl" className="font-semibold text-primary">info@noah-emma.nl</a></dd>
          </dl>
        </section>
      </main>
    </div>
  );
}
