"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Star, MessageCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function OverPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Over Noah & Emma</h1>
        </div>
      </header>

      <main className="px-5 pt-8 space-y-8 max-w-lg mx-auto">
        {/* Logo & tagline */}
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md" style={{ backgroundColor: "#b6e3f4" }}>
              <img src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=noah-kind-03&backgroundColor=b6e3f4&scale=80" alt="Noah" width={64} height={64} />
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md -ml-3" style={{ backgroundColor: "#ffb8c4" }}>
              <img src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=emma-kind-03&backgroundColor=ffb8c4&scale=80" alt="Emma" width={64} height={64} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Noah & Emma</h2>
            <p className="text-sm text-slate-400 mt-1">Tweedehands Kindermode</p>
          </div>
          <span className="bg-primary/10 text-primary font-black text-xs px-4 py-1.5 rounded-full">Versie 1.0.0</span>
        </div>

        {/* Missie */}
        <div className="bg-primary/5 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <h3 className="font-black text-slate-900 dark:text-white">Onze missie</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Kinderen groeien razendsnel. Met Noah & Emma geven we kinderkleding en speelgoed een tweede leven — goed voor jouw portemonnee en voor de planeet. Veilig, vertrouwd, en met een knipoog naar de toekomst.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { getal: "100%", label: "Kindfocus", icon: "👶" },
            { getal: "0%", label: "Advertenties", icon: "🚫" },
            { getal: "♻️", label: "Circulair", icon: "" },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-center">
              {stat.icon && !stat.getal.includes(stat.icon) && <p className="text-2xl mb-1">{stat.icon}</p>}
              <p className="font-black text-lg text-slate-900 dark:text-white">{stat.getal}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Acties */}
        <div className="space-y-3">
          <Link href="/support" className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 active:scale-[0.98] transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-800 dark:text-white">Feedback geven</p>
              <p className="text-xs text-slate-400">Deel jouw ideeën of meld een probleem</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-300" />
          </Link>

          <button className="w-full flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 active:scale-[0.98] transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm text-slate-800 dark:text-white">Beoordeel Noah & Emma</p>
              <p className="text-xs text-slate-400">Geef ons een review in de App Store</p>
            </div>
            <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-700 text-slate-400 px-2 py-1 rounded-full">Binnenkort</span>
          </button>
        </div>

        {/* Juridisch links */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Juridisch</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            {[
              { label: "Privacyverklaring", href: "/privacy" },
              { label: "Algemene voorwaarden", href: "/voorwaarden" },
              { label: "Cookiebeleid", href: "/cookies" },
            ].map((item, idx, arr) => (
              <Link key={item.label} href={item.href} className={`flex items-center justify-between px-5 py-4 ${idx < arr.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""} active:bg-slate-50 dark:active:bg-slate-700`}>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-300 dark:text-slate-600 pb-4">
          Made with ❤️ in Nederland · © 2025 Noah & Emma
        </p>
      </main>
    </div>
  );
}
