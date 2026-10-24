import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { LOGIN_URL, SIGNUP_URL, SITE_URL } from "@/components/marketing/links";
import { MarketingFooter, SwipeKaart } from "@/components/marketing/Blokken";

const PAGINA_URL = `${SITE_URL}/2e-hands-kinderkleding`;

export const metadata: Metadata = {
  title: "2e hands kinderkleding kopen en verkopen | Noah & Emma",
  description:
    "2e hands kinderkleding en accessoires voor kinderen van 0 tot 12 jaar, altijd in de juiste maat. Nooit kindergezichten, zelf kiezen van wie je koopt. Helemaal gratis.",
  alternates: { canonical: PAGINA_URL },
  openGraph: {
    title: "2e hands kinderkleding, altijd in de juiste maat | Noah & Emma",
    description:
      "Kleding en accessoires van ouders uit de buurt, in de maat die nu past. Gratis account, gratis kopen en gratis verkopen.",
    url: PAGINA_URL,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/images/vestje-beige.png", alt: "Beige gebreid kindervestje aan een houten hanger" }],
  },
};

const USPS = [
  { kop: "Groeit mee met je kind.", tekst: "Je ziet altijd de maat die nu past, vanzelf." },
  { kop: "Nooit kindergezichten.", tekst: "Onze slimme AI weigert elke foto met het gezicht van een kind." },
  { kop: "Meer dan kleding.", tekst: "Ook kinderwagens, autostoeltjes, speelgoed en meubels." },
  { kop: "Jij kiest van wie je koopt.", tekst: "Met reviews van andere ouders na elke deal." },
  { kop: "Helemaal gratis.", tekst: "Gratis account, gratis kopen en gratis verkopen." },
];

const KERNCIJFERS = [
  { waarde: "★ 4,8", label: "waardering door ouders" },
  { waarde: "0", label: "kindergezichten in de app" },
  { waarde: "100%", label: "advertenties gecontroleerd" },
  { waarde: "0 tot 12 jaar", label: "van rompertje tot kinderfiets" },
];

const CATEGORIEEN = [
  { naam: "Meisjeskleding", sub: "Jurken, jassen, truien", kleur: "roze" },
  { naam: "Jongenskleding", sub: "Broeken, shirts, jassen", kleur: "blauw" },
  { naam: "Kinderwagens & buggy's", sub: "Combiwagens, wandelwagens", kleur: "roze" },
  { naam: "Autostoeltjes", sub: "Groep 0+, 1-2-3, Maxi-Cosi", kleur: "blauw" },
  { naam: "Speelgoed", sub: "Houten speelgoed, Lego, puzzels", kleur: "roze" },
  { naam: "Kinderkamer", sub: "Bedjes, commodes, kinderstoelen", kleur: "blauw" },
] as const;

// Gelijk aan schatMaatOpLeeftijd in src/lib/groei.ts
const GROEIVOORBEELD = [
  { leeftijd: "1 maand", maat: "50", kleur: "blauw" },
  { leeftijd: "2 maanden", maat: "56", kleur: "blauw" },
  { leeftijd: "4 maanden", maat: "62", kleur: "blauw" },
  { leeftijd: "1 jaar", maat: "80", kleur: "roze" },
  { leeftijd: "2 jaar", maat: "92", kleur: "roze" },
  { leeftijd: "4 jaar", maat: "104", kleur: "roze" },
] as const;

const VOORDELEN = [
  { titel: "Altijd de passende maat", tekst: "Het groeimodel in je account groeit mee met je kind. Je ziet vanzelf de volgende maat, zonder zelf te zoeken of te filteren.", kleur: "blauw" },
  { titel: "Handig met meerdere kinderen", tekst: "Elk kind heeft een eigen maat en een eigen kleur. Je wisselt met één tik en ziet direct wat bij dat kind past.", kleur: "roze" },
  { titel: "Nooit kindergezichten", tekst: "Onze slimme AI controleert elke foto. Staat er een gezicht van een kind op, dan wordt het product geweigerd.", kleur: "blauw" },
  { titel: "Meer dan kleding", tekst: "Kinderwagens, buggy's, autostoeltjes, speelgoed en meubels voor de kinderkamer. Alles voor kinderen van 0 tot 12 jaar.", kleur: "roze" },
  { titel: "Jij kiest van wie je koopt", tekst: "Na elke deal laten koper en verkoper een review achter. Zo zie je vooraf of je iemand vertrouwt.", kleur: "blauw" },
  { titel: "Simpel en leuk swipen", tekst: "Geen eindeloos scrollen. Swipe naar links of rechts en bewaar wat je leuk vindt.", kleur: "roze" },
] as const;

const KOPEN = [
  { titel: "Maak gratis een account", tekst: "Stel de leeftijd of maat van je kind in. Daarna groeit die vanzelf mee." },
  { titel: "Swipe door het aanbod", tekst: "Je ziet kleding in de passende maat, en accessoires zoals kinderwagens en speelgoed." },
  { titel: "Neem contact op", tekst: "Stuur de verkoper een bericht en bekijk de reviews van eerdere deals." },
  { titel: "Spreek samen af", tekst: "Jullie regelen zelf het ophalen en de betaling. Daarna laat je een review achter." },
];

const VERKOPEN = [
  { titel: "Maak een foto", tekst: "Fotografeer het product: kleding, een buggy, speelgoed of een bedje." },
  { titel: "Onze AI controleert de foto", tekst: "Staat er een kindergezicht op, dan wordt de foto geweigerd. Zo blijven kinderen offline." },
  { titel: "Ouders in die maat zien het", tekst: "Je advertentie verschijnt bij ouders van wie het kind nu die maat heeft." },
  { titel: "Chat en sluit de deal", tekst: "Je spreekt zelf af met de koper. Na de deal geven jullie elkaar een review." },
];

const REVIEWS = [
  { quote: "Binnen een dag verkocht en ik hoefde geen foto van mijn dochter te posten. Precies wat ik zocht.", naam: "Lotte", context: "moeder van 2, Utrecht" },
  { quote: "Onze zoon groeit zo hard dat de helft van zijn kast nog het prijskaartje heeft. Nu verkoop ik het door voor hij het draagt.", naam: "Rik", context: "vader van 3, Rotterdam" },
  { quote: "Swipen door de buurt voelt echt als shoppen, niet als een marktplaats doorzoeken. Heerlijk simpel.", naam: "Sanne", context: "moeder van 1, Groningen" },
];

const FAQ = [
  { vraag: "Is een account bij Noah & Emma gratis?", antwoord: "Ja. Een account maken, kopen en verkopen is helemaal gratis. Wil je extra functies, dan kun je kiezen voor Premium, maar dat hoeft niet." },
  { vraag: "Waarom heb ik een account nodig om producten te zien?", antwoord: "In je account stel je de leeftijd of maat van je kind in. Daardoor laten we je alleen aanbod zien dat nu past." },
  { vraag: "Hoe werkt het groeimodel?", antwoord: "Je stelt één keer de leeftijd of maat van je kind in. Wordt je kind ouder, dan schuift de maat in de app automatisch mee. Een kind van 1 maand ziet maat 50, met 2 maanden maat 56, enzovoort." },
  { vraag: "Ik heb meerdere kinderen. Werkt dat ook?", antwoord: "Ja. Je voegt elk kind toe met de eigen leeftijd of maat. Met één tik wissel je, en je ziet direct wat bij dat kind past." },
  { vraag: "Hoe zorgen jullie dat er geen kindergezichten in de app staan?", antwoord: "Onze slimme AI controleert elke foto bij het plaatsen. Staat er een gezicht van een kind op, dan wordt het product geweigerd." },
  { vraag: "Welke producten kan ik kopen en verkopen?", antwoord: "Kinderkleding van 0 tot 12 jaar, schoenen, en accessoires zoals kinderwagens, buggy's, autostoeltjes, speelgoed en meubels voor de kinderkamer." },
  { vraag: "Hoe betaal ik en hoe krijg ik het product?", antwoord: "Je neemt via de chat contact op met de verkoper. Samen spreken jullie af hoe je betaalt en of je het ophaalt." },
  { vraag: "Hoe weet ik of een verkoper betrouwbaar is?", antwoord: "Na elke afgeronde deal laten koper en verkoper een review achter. Die zie je op het profiel, zodat jij bepaalt van wie je koopt." },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "2e hands kinderkleding", item: PAGINA_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.vraag,
        acceptedAnswer: { "@type": "Answer", text: f.antwoord },
      })),
    },
  ],
};

const tint = (kleur: "roze" | "blauw") => (kleur === "roze" ? "bg-[#FFEAF1] text-[#D63D74]" : "bg-[#E4F4FB] text-[#1C7FA8]");

function SectieKop({ label, titel }: { label: string; titel: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase">{label}</span>
      <h2 className="mt-2.5 font-headline font-extrabold text-[28px] sm:text-[38px] leading-tight tracking-tight">{titel}</h2>
    </div>
  );
}

export default function TweedehandsKinderkledingPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#E4F4FB] via-[#FFF9FA] to-[#FFEAF1]">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-7 sm:pt-16 pb-10 sm:pb-16 flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
            <div className="flex-1 min-w-0 w-full">
              <nav aria-label="Kruimelpad" className="text-[13px] text-[#5B4F63] flex gap-2 mb-5">
                <Link href="/" className="underline underline-offset-2">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#241A2E] font-semibold">2e hands kinderkleding</span>
              </nav>
              <span className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase text-[#5B4F63] shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)]">
                <span className="w-2 h-2 rounded-full bg-[#3FA9DB]" />
                Kleding &amp; accessoires 0 tot 12 jaar
                <span className="w-2 h-2 rounded-full bg-[#FF6F9C]" />
              </span>
              <h1 className="mt-5 font-headline font-extrabold text-[34px] sm:text-[46px] lg:text-[54px] leading-[1.05] tracking-tight">
                2e hands kinderkleding en accessoires, altijd in <span className="text-[#D63D74]">de juiste maat</span>
              </h1>
              <ul className="mt-7 flex flex-col gap-3.5">
                {USPS.map((u) => (
                  <li key={u.kop} className="flex gap-3 items-start text-[17px] leading-snug">
                    <Check className="w-6 h-6 shrink-0 text-[#1C7FA8]" strokeWidth={2.5} aria-hidden="true" />
                    <span><strong>{u.kop}</strong> {u.tekst}</span>
                  </li>
                ))}
              </ul>
              <div id="hero-cta" className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={SIGNUP_URL}
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 rounded-full bg-[#241A2E] text-white font-bold text-base shadow-[0_12px_30px_-14px_rgba(36,26,46,0.5)] transition-transform hover:-translate-y-0.5"
                >
                  Maak gratis een account <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#hoe-het-werkt"
                  className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-full border border-[#241A2E]/20 bg-white text-[#241A2E] font-bold text-base"
                >
                  Bekijk hoe het werkt
                </a>
              </div>
            </div>

            <div className="flex-1 min-w-0 w-full flex justify-center">
              <SwipeKaart />
            </div>
          </div>

          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
            <dl className="bg-white rounded-3xl px-5 sm:px-7 py-5 shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)] grid grid-cols-2 md:grid-cols-4 gap-4">
              {KERNCIJFERS.map((k) => (
                <div key={k.label}>
                  <dt className="sr-only">{k.label}</dt>
                  <dd className="font-headline font-extrabold text-[22px]">{k.waarde}</dd>
                  <dd className="text-[13px] font-semibold text-[#5B4F63]">{k.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Categorieën */}
        <section id="categorieen" aria-labelledby="categorieen-kop" className="scroll-mt-20 max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 sm:pt-[72px]">
          <h2 id="categorieen-kop" className="font-headline font-extrabold text-2xl sm:text-[28px]">Kleding en accessoires, tweedehands</h2>
          <p className="mt-2 text-[#5B4F63]">Van zomerjurk tot combiwagen: alles wat je kind nodig heeft, van ouders uit de buurt.</p>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIEEN.map((c) => (
              <Link
                key={c.naam}
                href={SIGNUP_URL}
                className={`rounded-[20px] p-5 min-h-[104px] flex flex-col justify-between transition-transform hover:-translate-y-0.5 ${c.kleur === "roze" ? "bg-[#FFEAF1]" : "bg-[#E4F4FB]"}`}
              >
                <span className="font-headline font-extrabold text-[17px] leading-tight">{c.naam}</span>
                <span className="text-[13px] text-[#5B4F63]">{c.sub}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Groeimodel */}
        <section id="groeimodel" className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-14 sm:pt-24">
          <div className="rounded-[32px] bg-white shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)] p-6 sm:p-12 flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
            <div className="flex-1 min-w-0">
              <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase">Het groeimodel</span>
              <h2 className="mt-2.5 font-headline font-extrabold text-[28px] sm:text-[38px] leading-tight tracking-tight">
                Altijd de juiste maat, zonder dat je erop hoeft te letten
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-[#5B4F63]">
                Je stelt één keer de leeftijd of maat van je kind in. Daarna groeit de maat in de app vanzelf mee. Swipe je door het aanbod, dan zie je alleen wat nu past.
              </p>
              <p className="mt-3 text-[17px] leading-relaxed text-[#5B4F63]">
                Geen filters instellen, geen maattabellen naast je telefoon. Heb je meerdere kinderen, dan wissel je met één tik.
              </p>
            </div>
            <ol aria-label="Voorbeeld: zo groeit de maat mee" className="flex-1 min-w-0 w-full grid grid-cols-3 gap-2.5">
              {GROEIVOORBEELD.map((g) => (
                <li key={g.leeftijd} className={`rounded-[18px] px-3 py-4 text-center ${g.kleur === "roze" ? "bg-[#FFEAF1]" : "bg-[#E4F4FB]"}`}>
                  <div className="text-[13px] font-semibold text-[#5B4F63]">{g.leeftijd}</div>
                  <div className={`mt-1 font-headline font-extrabold text-2xl ${g.kleur === "roze" ? "text-[#D63D74]" : "text-[#1C7FA8]"}`}>{g.maat}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Waarom */}
        <section id="waarom" className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-14 sm:pt-24">
          <SectieKop label="Waarom Noah & Emma" titel="Veilig voor je kind, slim voor je gezin" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VOORDELEN.map((v, i) => (
              <div key={v.titel} className="bg-white rounded-3xl p-7 shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)]">
                <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-headline font-extrabold ${tint(v.kleur)}`}>{i + 1}</div>
                <h3 className="mt-4 mb-2 font-headline font-extrabold text-xl">{v.titel}</h3>
                <p className="text-[#5B4F63] leading-relaxed">{v.tekst}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hoe het werkt */}
        <section id="hoe-het-werkt" className="scroll-mt-20 max-w-[1180px] mx-auto px-4 sm:px-6 pt-14 sm:pt-24">
          <SectieKop label="Hoe het werkt" titel="Kopen en verkopen, gewoon tussen ouders" />
          <div className="mt-10 grid lg:grid-cols-2 gap-5">
            {[
              { titel: "Kopen", stappen: KOPEN, kleur: "blauw" as const },
              { titel: "Verkopen", stappen: VERKOPEN, kleur: "roze" as const },
            ].map((kolom) => (
              <div
                key={kolom.titel}
                className={`rounded-[28px] p-6 sm:p-8 bg-gradient-to-br to-white ${kolom.kleur === "roze" ? "from-[#FFEAF1]" : "from-[#E4F4FB]"}`}
              >
                <h3 className={`font-headline font-extrabold text-[22px] ${kolom.kleur === "roze" ? "text-[#D63D74]" : "text-[#1C7FA8]"}`}>{kolom.titel}</h3>
                <ol className="mt-5 flex flex-col gap-4">
                  {kolom.stappen.map((s, i) => (
                    <li key={s.titel} className="flex gap-3.5 items-start">
                      <span className={`shrink-0 w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center font-headline font-extrabold ${kolom.kleur === "roze" ? "text-[#D63D74]" : "text-[#1C7FA8]"}`}>
                        {i + 1}
                      </span>
                      <span>
                        <strong className="block">{s.titel}</strong>
                        <span className="text-[#5B4F63] leading-relaxed">{s.tekst}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href={SIGNUP_URL} className="inline-flex w-full sm:w-auto items-center justify-center min-h-[52px] px-7 rounded-full bg-[#241A2E] text-white font-bold">
              Maak gratis een account
            </Link>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-14 sm:pt-24">
          <SectieKop label="Wat ouders zeggen" titel="Ouders geven ons een 4,8" />
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <figure key={r.naam} className="bg-white rounded-3xl p-7 shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)] flex flex-col gap-4">
                <div className="text-[#D63D74] tracking-wider" aria-label="5 van 5 sterren">★★★★★</div>
                <blockquote className="leading-relaxed">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="text-sm">
                  <strong>{r.naam}</strong> <span className="text-[#5B4F63]">· {r.context}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Uitleg */}
        <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-14 sm:pt-24 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-headline font-extrabold text-2xl sm:text-[30px] leading-tight">Waarom 2e hands kinderkleding en accessoires?</h2>
            <p className="mt-3.5 text-[#5B4F63] leading-relaxed">
              Een kind gaat de eerste jaren door een groot aantal maten heen. Veel kleding wordt maar een paar maanden gedragen. Ook een kinderwagen, box of autostoeltje gebruik je maar een korte periode.
            </p>
            <p className="mt-3 text-[#5B4F63] leading-relaxed">
              Tweedehands kopen scheelt geld, en er hoeft minder nieuw gemaakt te worden. Wat bij jou te klein is, past een ander kind precies.
            </p>
          </div>
          <div>
            <h2 className="font-headline font-extrabold text-2xl sm:text-[30px] leading-tight">Waar let je op bij tweedehands kopen?</h2>
            <ul className="mt-3.5 pl-5 list-disc text-[#5B4F63] leading-relaxed space-y-1">
              <li>Bekijk de reviews van de verkoper voordat je afspreekt.</li>
              <li>Let op de staat: nieuw met label, zo goed als nieuw of goed.</li>
              <li>Check bij een kinderwagen de remmen, wielen en vouwfunctie.</li>
              <li>Vraag bij een autostoeltje naar de veiligheidsnorm en of het ongevalvrij is.</li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-[820px] mx-auto px-4 sm:px-6 pt-14 sm:pt-24">
          <h2 className="text-center font-headline font-extrabold text-[28px] sm:text-[38px] tracking-tight">Veelgestelde vragen</h2>
          <div className="mt-7 flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.vraag} className="group bg-white rounded-[18px] px-5 sm:px-6 py-4 shadow-[0_8px_20px_-14px_rgba(36,26,46,0.25)]">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 min-h-[28px] font-bold">
                  {f.vraag}
                  <span aria-hidden="true" className="shrink-0 text-[#D63D74] text-xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2.5 text-[#5B4F63] leading-relaxed">{f.antwoord}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Afsluitende call-to-action */}
        <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-14 sm:pt-24">
          <div className="rounded-[32px] px-5 sm:px-8 py-10 sm:py-14 bg-[#241A2E] text-white text-center">
            <h2 className="mx-auto max-w-[22ch] font-headline font-extrabold text-[30px] sm:text-[44px] leading-[1.1] tracking-tight">
              Zie vandaag nog wat jouw kind <span className="text-[#FF8FB3]">nu past</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-[#F3E9F0] text-[17px] leading-relaxed">
              Maak gratis een account, stel de maat van je kind in en swipe direct door kleding en accessoires die passen.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3.5">
              <Link
                href={SIGNUP_URL}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 min-h-[60px] px-10 rounded-full bg-white text-[#241A2E] font-extrabold text-lg"
              >
                Maak gratis een account <ArrowRight className="w-5 h-5" />
              </Link>
              <span className="text-sm text-[#F3E9F0]">
                Al een account? <Link href={LOGIN_URL} className="font-bold text-white underline underline-offset-2">Inloggen</Link>
              </span>
            </div>
            <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-sm font-semibold text-[#F3E9F0]">
              <li>✓ Gratis</li>
              <li>✓ Groeit mee met je kind</li>
              <li>✓ Nooit kindergezichten</li>
            </ul>
          </div>
        </section>
      </main>

      <MarketingFooter />

      <StickyCta />
    </div>
  );
}
