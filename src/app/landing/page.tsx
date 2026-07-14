import Link from "next/link";
import { Camera, Sparkles, Search, MessageCircle, ArrowRight } from "lucide-react";
import { NoahFace, EmmaFace } from "@/components/ai-models/NoahEmmaFaces";
import { Reveal } from "@/components/Reveal";
import { VoordelenExplorer } from "@/components/VoordelenExplorer";

const APP_URL = "https://noah-emma-sepia.vercel.app";
const SIGNUP_URL = `${APP_URL}/login?mode=register`;

const STAPPEN = [
  {
    color: "blue" as const,
    titel: "Foto maken",
    tekst: "Je maakt een foto van het kledingstuk — met of zonder je kind erin, dat maakt niet uit. Wij regelen de rest.",
  },
  {
    color: "pink" as const,
    titel: "Noah of Emma trekt het aan",
    tekst: "Onze twee AI-modellen dragen het kledingstuk in de advertentie. Het gezicht van jouw kind komt nooit online.",
  },
  {
    color: "blue" as const,
    titel: "Andere ouders swipen mee",
    tekst: "Kopers zoeken op maat, merk en categorie en swipen door het aanbod in hun buurt — net zo simpel als daten, maar dan voor kinderkleding.",
  },
  {
    color: "pink" as const,
    titel: "Samen een prijs afspreken",
    tekst: "Via de chat in de app spreek je zelf prijs en overdracht af — precies zoals dat hoort tussen ouders onderling.",
  },
];

const REVIEWS = [
  {
    quote: "Binnen een dag verkocht en ik hoefde geen foto van mijn dochter te posten. Precies wat ik zocht.",
    naam: "Lotte",
    context: "moeder van 2, Utrecht",
    kleur: "bg-[#FF6F9C]",
  },
  {
    quote: "Onze zoon groeit zo hard dat de helft van zijn kast nog het prijskaartje heeft. Nu verkoop ik het door voor hij het draagt.",
    naam: "Rik",
    context: "vader van 3, Rotterdam",
    kleur: "bg-[#3FA9DB]",
  },
  {
    quote: "Swipen door de buurt voelt echt als shoppen, niet als een marktplaats doorzoeken. Heerlijk simpel.",
    naam: "Sanne",
    context: "moeder van 1, Groningen",
    kleur: "bg-[#D63D74]",
  },
];

function SwipePhone({ kind, tilt }: { kind: "noah" | "emma"; tilt: "left" | "right" }) {
  const isNoah = kind === "noah";
  const soft = isNoah ? "bg-[#E4F4FB]" : "bg-[#FFEAF1]";
  const line = isNoah ? "from-[#C7E7F5] to-[#E4F4FB]" : "from-[#FFD3E2] to-[#FFEAF1]";
  const deep = isNoah ? "text-[#1C7FA8]" : "text-[#D63D74]";
  const rotate = tilt === "left" ? "-rotate-6 translate-y-2" : "rotate-6 -translate-y-1";
  const overlap = tilt === "left" ? "mr-[-2.2rem] z-[1]" : "ml-[-2.2rem] z-[2]";

  return (
    <div className={`w-[168px] sm:w-[220px] rounded-[34px] bg-white p-2.5 shadow-[0_20px_40px_-20px_rgba(36,26,46,0.35)] ${rotate} ${overlap}`}>
      <div className={`rounded-[26px] overflow-hidden ${soft} aspect-[9/18.5] relative flex flex-col`}>
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#241A2E] rounded-full z-10" />
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-white ${deep}`}>
            {isNoah ? "JONGEN · 98" : "MEISJE · 104"}
          </span>
          <span className="text-sm">♡</span>
        </div>
        <div className="mx-3.5 mb-3.5 flex-1 bg-white rounded-[20px] shadow-[0_10px_24px_-12px_rgba(36,26,46,0.35)] overflow-hidden flex flex-col">
          <div className={`flex-1 bg-gradient-to-br ${line} flex items-center justify-center relative`}>
            <span className="absolute top-2.5 left-2.5 text-[9px] font-bold bg-white px-2 py-1 rounded-lg">
              {isNoah ? "NIEUWSTAAT" : "GOED"}
            </span>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-md">
              {isNoah ? <NoahFace size={80} /> : <EmmaFace size={80} />}
            </div>
          </div>
          <div className="px-3.5 py-3">
            <div className="font-bold text-[13px]">{isNoah ? "Regenjas · Maat 98" : "Winterjas · Maat 104"}</div>
            <div className={`font-extrabold text-[15px] mt-0.5 ${deep}`}>{isNoah ? "€ 8,00" : "€ 12,50"}</div>
          </div>
          <div className="flex gap-2.5 px-3.5 pb-3.5">
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">✕</span>
            <span className={`w-8 h-8 rounded-full ${soft} flex items-center justify-center text-sm`}>♡</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] flex items-center justify-center shrink-0">
          <Camera className="w-7 h-7 text-[#3FA9DB]" strokeWidth={1.75} />
        </div>
        <div className="w-28 h-28 rounded-2xl bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] overflow-hidden flex items-center justify-center -rotate-3">
          <NoahFace size={100} />
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="flex items-center">
        <div className="w-32 h-32 rounded-3xl bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] overflow-hidden flex items-center justify-center -rotate-6 -mr-5 z-[1]">
          <EmmaFace size={116} />
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] flex items-center justify-center rotate-6">
          <Sparkles className="w-6 h-6 text-[#FF6F9C]" strokeWidth={1.75} />
        </div>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="relative w-44 h-32">
        <div className="absolute top-3 left-8 w-28 h-24 rounded-2xl bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] -rotate-6" />
        <div className="absolute top-0 left-11 w-28 h-24 rounded-2xl bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] rotate-3 flex items-center justify-center">
          <Search className="w-9 h-9 text-[#3FA9DB]" strokeWidth={1.75} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-3.5">
      <div className="w-14 h-14 rounded-full bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] flex items-center justify-center shrink-0">
        <MessageCircle className="w-6 h-6 text-[#FF6F9C]" strokeWidth={1.75} />
      </div>
      <div className="max-w-[190px] px-4 py-3 rounded-2xl rounded-bl-sm bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.35)] font-body text-[13px] font-semibold text-[#241A2E]">
        Top, zullen we zaterdag afspreken? 🙂
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-[#FFF9FA]/90 backdrop-blur-md border-b border-[#241A2E]/[0.08]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="flex items-center shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-md"><NoahFace size={36} /></div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-md -ml-2"><EmmaFace size={36} /></div>
            </div>
            <span className="font-headline font-extrabold text-base sm:text-lg tracking-tight truncate">Noah &amp; Emma</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#hoe-het-werkt" className="text-sm font-semibold text-[#5B4F63] hover:text-[#241A2E] transition-colors">Hoe het werkt</a>
            <a href="#voordelen" className="text-sm font-semibold text-[#5B4F63] hover:text-[#241A2E] transition-colors">Voordelen</a>
            <a href="#reviews" className="text-sm font-semibold text-[#5B4F63] hover:text-[#241A2E] transition-colors">Reviews</a>
          </nav>
          <Link
            href={SIGNUP_URL}
            className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0 bg-[#241A2E] hover:-translate-y-0.5 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-[0_12px_30px_-14px_rgba(36,26,46,0.5)] transition-transform whitespace-nowrap"
          >
            <span className="hidden sm:inline">Naar de app</span><span className="sm:hidden">App</span> <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <header className="relative overflow-hidden pt-4">
        <div className="absolute inset-0 grid grid-cols-2 z-0">
          <div className="bg-gradient-to-br from-[#E4F4FB] to-[#FFF9FA]" />
          <div className="bg-gradient-to-bl from-[#FFEAF1] to-[#FFF9FA]" />
        </div>

        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)] mb-7">
            <span className="w-2 h-2 rounded-full bg-[#3FA9DB]" />
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#5B4F63]">Tweedehands kindermode</span>
            <span className="w-2 h-2 rounded-full bg-[#FF6F9C]" />
          </div>

          <h1 className="font-headline font-extrabold tracking-tight leading-[1.05] text-[2.4rem] sm:text-6xl md:text-[4.4rem] max-w-4xl mx-auto text-balance">
            Verkocht voor <span className="text-[#1C7FA8]">het</span> te <span className="text-[#D63D74]">klein</span> is.
          </h1>

          <p className="max-w-[46ch] mx-auto mt-6 text-base sm:text-lg text-[#5B4F63]">
            Elk kind groeit uit zijn kleding voordat hij er versleten mee is. Noah &amp; Emma laat je in een paar swipes
            verkopen wat te klein is geworden — en vinden wat er straks past. Zonder ooit een foto van je eigen kind te delen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9">
            <Link
              href={SIGNUP_URL}
              className="inline-flex items-center gap-2 bg-[#241A2E] text-white font-bold text-base px-7 py-4 rounded-full shadow-[0_12px_30px_-14px_rgba(36,26,46,0.5)] transition-transform active:scale-[0.97] hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Begin met swipen <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#hoe-het-werkt"
              className="inline-flex items-center gap-2 text-[#241A2E] font-bold text-base px-7 py-4 rounded-full border border-[#241A2E]/20 hover:bg-[#241A2E]/5 transition-colors w-full sm:w-auto justify-center"
            >
              Bekijk hoe het werkt
            </a>
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-center mt-14 sm:mt-16 px-4">
          <SwipePhone kind="noah" tilt="left" />
          <SwipePhone kind="emma" tilt="right" />
        </div>

        <div className="relative z-10 mx-auto mt-12 sm:mt-14 max-w-2xl">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap px-8 py-5 bg-white rounded-full shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)] mx-5">
            <Reveal delay={0} className="flex flex-col items-center sm:items-start">
              <span className="font-headline font-extrabold text-lg">★ 4,8</span>
              <span className="text-xs font-semibold text-[#8A7E90]">waardering ouders</span>
            </Reveal>
            <div className="w-px h-7 bg-[#241A2E]/10 hidden sm:block" />
            <Reveal delay={120} className="flex flex-col items-center sm:items-start">
              <span className="font-headline font-extrabold text-lg">0 foto&apos;s</span>
              <span className="text-xs font-semibold text-[#8A7E90]">van jouw kind nodig</span>
            </Reveal>
            <div className="w-px h-7 bg-[#241A2E]/10 hidden sm:block" />
            <Reveal delay={240} className="flex flex-col items-center sm:items-start">
              <span className="font-headline font-extrabold text-lg">100%</span>
              <span className="text-xs font-semibold text-[#8A7E90]">advertenties gecontroleerd</span>
            </Reveal>
          </div>
        </div>

        <div className="h-16 sm:h-24 relative z-10" />
      </header>

      {/* Insight */}
      <section className="py-16 sm:py-24 px-5">
        <Reveal>
          <p className="max-w-3xl mx-auto text-center font-headline font-bold leading-snug text-2xl sm:text-4xl tracking-tight text-balance">
            <span className="text-[#1C7FA8]">Nooit</span> een foto van jouw kind online.
            <br className="hidden sm:block" /> <span className="text-[#D63D74]">Altijd</span> de juiste maat binnen handbereik.
          </p>
        </Reveal>
      </section>

      {/* Hoe het werkt */}
      <section id="hoe-het-werkt" className="px-5 sm:px-8 pb-20 sm:pb-28">
        <Reveal className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase block mb-3">Hoe het werkt</span>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight mb-3">Van volle kast naar verkocht</h2>
          <p className="text-[#5B4F63]">Vier stappen, geen gedoe — en geen moment waarop je een foto van je eigen kind hoeft te posten.</p>
        </Reveal>

        <div className="max-w-5xl mx-auto">
          {STAPPEN.map((stap, i) => {
            const flip = i % 2 === 1;
            const isBlue = stap.color === "blue";
            return (
              <Reveal key={stap.titel}>
                <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center py-9 md:py-11 ${i !== STAPPEN.length - 1 ? "border-b border-[#241A2E]/[0.08]" : ""}`}>
                  <div className={flip ? "md:order-2" : ""}>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-headline font-extrabold text-sm mb-4 ${isBlue ? "bg-[#E4F4FB] text-[#1C7FA8]" : "bg-[#FFEAF1] text-[#D63D74]"}`}>
                      {i + 1}
                    </span>
                    <h3 className="font-headline font-extrabold text-xl sm:text-2xl mb-3">{stap.titel}</h3>
                    <p className="text-[#5B4F63] max-w-[42ch]">{stap.tekst}</p>
                  </div>
                  <div className={`${flip ? "md:order-1" : ""} group rounded-[28px] aspect-[16/11] flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 ${isBlue ? "bg-gradient-to-br from-[#E4F4FB] to-white" : "bg-gradient-to-br from-[#FFEAF1] to-white"}`}>
                    <div className="transition-transform duration-300 group-hover:scale-[1.04]">
                      <StepVisual index={i} />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Voordelen */}
      <section id="voordelen" className="relative overflow-hidden py-20 sm:py-28">
        <Reveal className="text-center max-w-xl mx-auto mb-12 px-5">
          <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase block mb-3">Waarom ouders overstappen</span>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight text-[#241A2E]">Veilig voor je kind, slim voor je gezin</h2>
        </Reveal>

        <Reveal className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <VoordelenExplorer />
        </Reveal>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 sm:py-28 px-5 sm:px-8">
        <Reveal className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase block mb-3">Wat ouders zeggen</span>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight mb-3">Nog even in te vullen met echte reviews</h2>
          <p className="text-[#5B4F63]">Onderstaande drie zijn voorbeeldteksten — vervang door echte quotes van gebruikers zodra die er zijn.</p>
        </Reveal>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.naam} delay={i * 110}>
              <div className="bg-white rounded-2xl p-7 shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)] h-full flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(36,26,46,0.32)]">
                <div className="text-[#D63D74] text-sm tracking-wider">★★★★★</div>
                <p className="text-[#241A2E] leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-headline font-extrabold text-sm ${r.kleur}`}>
                    {r.naam[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{r.naam}</div>
                    <div className="text-xs text-[#8A7E90]">{r.context}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28 px-5 text-center">
        <div className="absolute inset-0 grid grid-cols-2 z-0">
          <div className="bg-gradient-to-br from-[#E4F4FB] to-[#FFF9FA]" />
          <div className="bg-gradient-to-bl from-[#FFEAF1] to-[#FFF9FA]" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-headline font-extrabold text-3xl sm:text-5xl tracking-tight text-balance">
            Ruim de kast op.<br />Vind de volgende maat.
          </h2>
          <p className="text-[#5B4F63] mt-5 text-base sm:text-lg">
            Plaats je eerste advertentie in een paar minuten, of ontdek wat andere ouders in jouw buurt te bieden hebben.
          </p>
          <Link
            href={SIGNUP_URL}
            className="inline-flex items-center gap-2 bg-[#241A2E] text-white font-bold text-base px-8 py-4 rounded-full shadow-[0_12px_30px_-14px_rgba(36,26,46,0.5)] mt-9 transition-transform active:scale-[0.97] hover:-translate-y-0.5"
          >
            Maak gratis een account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 sm:px-8">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 pt-8 border-t border-[#241A2E]/10">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center">
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm"><NoahFace size={28} /></div>
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm -ml-2"><EmmaFace size={28} /></div>
            </div>
            <span className="font-headline font-bold text-sm">Noah &amp; Emma</span>
          </div>
          <p className="text-xs text-[#8A7E90]">
            © {new Date().getFullYear()} Noah &amp; Emma — De makkelijkste manier om kinderkleding te kopen en verkopen.
          </p>
        </div>
      </footer>
    </div>
  );
}
