
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, ShieldCheck, Zap, Leaf, Sparkles, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 pt-12 pb-4 flex items-center justify-between border-b border-primary/10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-extrabold tracking-tight">Over Noah & Emma</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 pb-32 no-scrollbar space-y-12">
        {/* Introductie */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
            Welkom bij Noah & Emma
          </h2>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Noah & Emma is dé Nederlandse app voor tweedehands kinderkleding en accessoires. 
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Wij verbinden ouders die slimmer willen shoppen met ouders die ruimte willen maken in de kast — en samen maken we kindermode een stuk duurzamer.
          </p>
        </section>

        {/* Het Verhaal */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Hoe het begon</h3>
          <p className="leading-relaxed">
            Elk kind groeit razendsnel. Kleding die in september nog perfect paste, is tegen de kerstvakantie al te klein.
          </p>
          <p className="leading-relaxed">
            Intussen stapelen de dozen zich op in de berging, vol met bijna nieuwe spullen waar een ander kind blij van zou worden.
          </p>
          <p className="leading-relaxed">
            Wij vroegen ons af: waarom is er geen platform dat dit echt makkelijk maakt? Geen app waar je eindeloos moet filteren, maar een plek die precies weet wat jouw kind nodig heeft en met je meegroeit.
          </p>
          <p className="font-bold text-slate-900 dark:text-white">
            Zo ontstond Noah & Emma.
          </p>
        </section>

        {/* Missie & Visie */}
        <div className="grid grid-cols-1 gap-6">
          <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-3xl border border-primary/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Onze missie</h3>
            <p className="text-sm leading-relaxed font-medium">
              Wij geloven dat kinderkleding niet één eigenaar verdient, maar meerdere. 
            </p>
            <p className="text-sm leading-relaxed mt-2">
              Onze missie is om tweedehands de logische eerste keuze te maken voor iedere ouder in Nederland. Makkelijk, leuk en betrouwbaar.
            </p>
          </section>

          <section className="bg-accent/5 dark:bg-accent/10 p-6 rounded-3xl border border-accent/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-3">Onze visie</h3>
            <p className="text-sm leading-relaxed font-medium">
              We bouwen aan een wereld waarin een kind nooit iets nieuws hoeft te dragen dat al bestond.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              Een wereld waarin kleding rondgaat in plaats van weggegooid wordt. Noah & Emma is de app die dat mogelijk maakt — één ruil tegelijk.
            </p>
          </section>
        </div>

        {/* Kernwaarden */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-center">Waar wij voor staan</h3>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Gemak boven gedoe</h4>
                <p className="text-sm text-slate-500 mt-1">Goede intenties stranden vaak op te veel moeite. Alles in onze app is ontworpen om snel en prettig te werken.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Veiligheid zonder compromis</h4>
                <p className="text-sm text-slate-500 mt-1">Kinderen horen niet zichtbaar te zijn op een openbaar platform. Wij zorgen voor 100% privacy.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Eerlijk en transparant</h4>
                <p className="text-sm text-slate-500 mt-1">Geen verborgen kosten. Verkopen is gratis. Het abonnement voor kopers is helder en zegt zichzelf terug.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Duurzaamheid als keuze</h4>
                <p className="text-sm text-slate-500 mt-1">We wijzen niet met de vinger. Maar elke aankoop via ons platform betekent één nieuw kledingstuk minder geproduceerd.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Modellen */}
        <section className="bg-slate-900 text-white p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black leading-tight">Noah en Emma — wie zijn zij?</h3>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Noah en Emma zijn onze twee AI-gegenereerde kindermodellen. Noah is een jongen, Emma is een meisje.
            </p>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Dankzij hen hoef jij als verkoper nooit foto's van je eigen kind te plaatsen. Kopers zien tóch precies hoe een kledingstuk valt.
            </p>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Je uploadt simpelweg een foto van de kleding, en onze technologie doet de rest. Zo blijft het platform persoonlijk én veilig.
            </p>
          </div>
        </section>

        {/* Hoe het werkt */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-center">Zo werkt Noah & Emma</h3>
          
          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Voor kopers</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Maak een groeiprofiel aan. De app toont automatisch items die nu passen. Swipe rechts op wat je leuk vindt. Met Premium swipe je onbeperkt.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="w-5 h-5 text-accent" />
                <h4 className="font-bold">Voor verkopers</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Fotografeer, upload en stel je prijs in. Verkopen is gratis. Gebruik een boost voor meer zichtbaarheid en verkoop sneller aan de juiste ouders.
              </p>
            </div>
          </div>
        </section>

        {/* DNA Duurzaamheid */}
        <section className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 mb-2">
            <Leaf className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black">Duurzaamheid zit in ons DNA</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We zijn een platform dat tweedehands de norm wil maken — niet als statement, maar als slimme keuze.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Elk item dat via Noah & Emma een nieuw thuis vindt, telt. En hoe meer ouders meedoen, hoe groter dat effect wordt.
          </p>
        </section>

        {/* CTA */}
        <section className="space-y-4 pb-12">
          <Button 
            onClick={() => router.push('/sell')}
            className="w-full h-16 bg-primary hover:bg-primary-dark text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 border-none"
          >
            Start met Verkopen
          </Button>
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full h-16 border-2 border-primary text-primary font-black text-lg rounded-2xl hover:bg-primary/5"
          >
            Ontdek de Collectie
          </Button>
        </section>
      </main>
    </div>
  );
}
