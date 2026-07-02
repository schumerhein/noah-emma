"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const LINKS = [
  {
    titel: "Gebruiksvoorwaarden",
    beschrijving: "Regels voor het gebruik van Noah & Emma",
    href: "/voorwaarden",
    icoon: "description",
  },
  {
    titel: "Privacybeleid",
    beschrijving: "Hoe we jouw gegevens verwerken en beschermen",
    href: "/privacy",
    icoon: "privacy_tip",
  },
  {
    titel: "Cookiebeleid",
    beschrijving: "Welke cookies we gebruiken en waarom",
    href: "/cookies",
    icoon: "cookie",
  },
  {
    titel: "Richtlijnen voor de community",
    beschrijving: "Gedragsregels voor een veilige marktplaats",
    href: "/community",
    icoon: "groups",
  },
];

export default function WettelijkPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Wettelijke gegevens</h1>
        </div>
      </header>

      <main>
        {LINKS.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800 transition-colors">
              <span className="material-icons-round text-slate-400 text-xl">{item.icoon}</span>
              <div className="flex-1">
                <p className="text-[17px] text-slate-900 dark:text-white">{item.titel}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.beschrijving}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </div>
          </Link>
        ))}

        {/* Bedrijfsgegevens */}
        <div className="px-6 pt-8 pb-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Bedrijfsgegevens</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Noah & Emma B.V.</p>
          <p className="text-sm text-slate-400">KvK: 12345678</p>
          <p className="text-sm text-slate-400">BTW: NL123456789B01</p>
          <p className="text-sm text-slate-400">Amsterdam, Nederland</p>
          <p className="text-sm text-slate-400 mt-2">
            <a href="mailto:legal@noahemma.nl" className="text-primary">legal@noahemma.nl</a>
          </p>
        </div>

        <div className="px-6 pt-4">
          <p className="text-xs text-slate-300">© 2024 Noah & Emma B.V. Alle rechten voorbehouden.</p>
        </div>
      </main>
    </div>
  );
}
