"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BeveiligingPage() {
  const router = useRouter();

  const items = [
    {
      label: "E-mailadres",
      sub: "Houd je e-mail up-to-date.",
      href: "/instellingen/email",
    },
    {
      label: "Wachtwoord",
      sub: "Beveilig je account met een sterker wachtwoord.",
      href: "/instellingen/wachtwoord",
    },
    {
      label: "Tweestapsverificatie",
      sub: "Beveilig je login met een simpele verificatiestap.",
      href: "/instellingen/2fa",
      binnenkort: true,
    },
    {
      label: "Login activiteit",
      sub: "Bekijk je ingelogde apparaten.",
      href: "/instellingen/sessies",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Beveiliging</h1>
        </div>
      </header>

      <main className="pt-6">
        <div className="px-6 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Houd je account veilig</h2>
          <p className="text-sm text-slate-400 mt-1">Controleer je info om je account te helpen beschermen.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {items.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => !item.binnenkort && router.push(item.href)}
              className={`w-full flex items-center justify-between px-6 py-4 text-left ${idx < items.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} ${item.binnenkort ? "opacity-50" : "active:bg-slate-50 dark:active:bg-slate-800"}`}
              disabled={item.binnenkort}
            >
              <div>
                <p className="text-[17px] text-slate-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-slate-400 mt-0.5">{item.sub}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {item.binnenkort && (
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                    Binnenkort
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
