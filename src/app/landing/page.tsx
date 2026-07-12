import Link from "next/link";
import { Camera, Sparkles, Search, ShieldCheck, Leaf, Users, ArrowRight } from "lucide-react";
import { NoahEmmaLogo } from "@/components/Header";

const APP_URL = "https://noah-emma-sepia.vercel.app";

const STAPPEN = [
  {
    icon: Camera,
    titel: "Foto maken",
    tekst: "Je maakt een foto van het kledingstuk — met of zonder je kind erin, dat maakt niet uit.",
  },
  {
    icon: Sparkles,
    titel: "Noah of Emma laat het zien",
    tekst: "Onze AI-modellen dragen het kledingstuk in de advertentie. Het gezicht van jouw kind komt nooit online.",
  },
  {
    icon: Search,
    titel: "Andere ouders vinden het",
    tekst: "Kopers zoeken op maat, merk en categorie en swipen door het aanbod in hun buurt.",
  },
  {
    icon: Users,
    titel: "Samen een prijs afspreken",
    tekst: "Via de chat in de app spreek je zelf prijs en overdracht af — precies zoals dat hoort tussen ouders onderling.",
  },
];

const VOORDELEN = [
  {
    icon: ShieldCheck,
    titel: "Veilig voor je kind",
    tekst: "Geen herkenbare foto's van je kind online. Elke advertentie wordt bovendien gecontroleerd voordat hij zichtbaar is.",
  },
  {
    icon: Search,
    titel: "Snel het juiste vinden",
    tekst: "Filter op maat, merk, kleur en prijs — geen eindeloos scrollen door spullen die niet passen.",
  },
  {
    icon: Leaf,
    titel: "Duurzaam en voordelig",
    tekst: "Kinderen groeien razendsnel. Tweedehands kopen en verkopen scheelt geld en is beter voor het milieu.",
  },
  {
    icon: Users,
    titel: "Gemaakt voor ouders",
    tekst: "Een community van ouders die precies weten hoe snel een maatje te klein wordt.",
  },
];

export default function LandingPage() {
  return (
    <div className="font-body bg-white text-slate-900 min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NoahEmmaLogo size={32} />
            <span className="font-headline font-extrabold text-lg tracking-tight">Noah &amp; Emma</span>
          </div>
          <Link
            href={APP_URL}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Naar de app <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
          Tweedehands kindermode
        </div>
        <h1 className="font-headline font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight mb-6">
          De makkelijkste manier om<br className="hidden sm:block" /> kinderkleding te kopen &amp; verkopen
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          Kinderen groeien uit hun kleding voordat ze er versleten mee zijn. Noah &amp; Emma
          maakt tweedehands kopen en verkopen simpel, snel en veilig — zonder ooit een
          herkenbare foto van je kind te delen.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={APP_URL}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            Probeer de app <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#hoe-het-werkt"
            className="inline-flex items-center gap-2 text-slate-600 font-bold text-base px-7 py-3.5 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            Bekijk hoe het werkt
          </a>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section id="hoe-het-werkt" className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight mb-3">Hoe het werkt</h2>
            <p className="text-slate-500 max-w-xl mx-auto">In vier simpele stappen van volle kast naar verkocht.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STAPPEN.map((stap, i) => (
              <div key={stap.titel} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                <span className="absolute top-5 right-5 text-3xl font-headline font-black text-slate-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <stap.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-headline font-extrabold text-base mb-2">{stap.titel}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{stap.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voordelen */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight mb-3">Waarom Noah &amp; Emma</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Gemaakt voor ouders die het veilig, snel en eerlijk willen houden.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VOORDELEN.map((v) => (
              <div key={v.titel} className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-extrabold text-base mb-1.5">{v.titel}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.tekst}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Noah & Emma showcase */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <NoahEmmaLogo size={72} />
          </div>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight mb-4">
            Noah en Emma dragen het, jouw kind hoeft niet online
          </h2>
          <p className="text-slate-500 leading-relaxed">
            In plaats van foto's van je eigen kind te delen, laten onze AI-modellen Noah en Emma
            zien hoe een kledingstuk eruitziet en zit. Zo blijft de app veilig voor kinderen,
            zonder dat kopers iets missen — elke advertentie wordt bovendien gecontroleerd
            voordat hij zichtbaar wordt voor anderen.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-slate-500 mb-8">
            Plaats je eerste advertentie in een paar minuten, of ontdek wat andere ouders in
            jouw buurt te bieden hebben.
          </p>
          <Link
            href={APP_URL}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            Open Noah &amp; Emma <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <NoahEmmaLogo size={24} />
            <span className="font-headline font-bold text-sm">Noah &amp; Emma</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Noah &amp; Emma — De makkelijkste manier om kinderkleding te kopen en verkopen.
          </p>
        </div>
      </footer>
    </div>
  );
}
