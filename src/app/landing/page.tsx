import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { MarketingPaginaMarker } from "@/components/marketing/MarketingModus";
import { SITE_URL } from "@/components/marketing/links";
import {
  AfsluitendeCta, Eyebrow, Faq, Groeimodel, HeroKnoppen, Kaarten, MarketingFooter, PRODUCTEN, SCHADUW, Sectie, SectieKop, SwipeKaart, UspLijst, type Vraag,
} from "@/components/marketing/Blokken";

// De homepage van noah-emma.nl: de middleware herschrijft "/" voor bezoekers
// zonder account naar deze pagina. Mobile first, net als de andere
// marketingpagina's, met de sticky aanmeldbalk onderin.

export const metadata: Metadata = {
  title: "Noah & Emma | Tweedehands kinderkleding en accessoires, altijd in de juiste maat",
  description:
    "Koop en verkoop tweedehands kinderkleding, kinderwagens, autostoeltjes en speelgoed voor kinderen van 0 tot 12 jaar. De maat groeit vanzelf mee, nooit kindergezichten en helemaal gratis.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "Noah & Emma: tweedehands voor je kind, altijd in de juiste maat",
    description: "Gratis account, gratis kopen en gratis verkopen. Nooit kindergezichten.",
    url: `${SITE_URL}/`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [{ url: PRODUCTEN.regenjas.afbeelding, alt: PRODUCTEN.regenjas.alt }],
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

const ROUTES = [
  { titel: "Kinderkleding", tekst: "Van maat 50 tot 158/164, voor jongens en meisjes.", href: "/kinderkleding", kleur: "from-[#FFEAF1]", accent: "text-[#D63D74]" },
  { titel: "Accessoires", tekst: "Kinderwagens, autostoeltjes, speelgoed en meubels.", href: "/accessoires", kleur: "from-[#E4F4FB]", accent: "text-[#1C7FA8]" },
];

const STAPPEN = [
  { titel: "Maak gratis een account", tekst: "Stel de leeftijd of maat van je kind in. Daarna groeit die vanzelf mee." },
  { titel: "Swipe door het aanbod", tekst: "Naar rechts bewaar je iets, naar links ga je door. Je ziet alleen wat past." },
  { titel: "Neem contact op", tekst: "Stuur de verkoper een bericht en bekijk de reviews van eerdere deals." },
  { titel: "Spreek samen af", tekst: "Jullie regelen zelf het ophalen en de betaling. Daarna laat je een review achter." },
];

const REVIEWS = [
  { quote: "Binnen een dag verkocht en ik hoefde geen foto van mijn dochter te posten. Precies wat ik zocht.", naam: "Lotte", context: "moeder van 2, Utrecht" },
  { quote: "Onze zoon groeit zo hard dat de helft van zijn kast nog het prijskaartje heeft. Nu verkoop ik het door voor hij het draagt.", naam: "Rik", context: "vader van 3, Rotterdam" },
  { quote: "Swipen door de buurt voelt echt als shoppen. Heerlijk simpel.", naam: "Sanne", context: "moeder van 1, Groningen" },
];

const FAQ: Vraag[] = [
  { vraag: "Is Noah & Emma gratis?", antwoord: "Ja. Een account maken, kopen en verkopen is helemaal gratis. Wil je extra functies, dan kun je kiezen voor Premium, maar dat hoeft niet." },
  { vraag: "Waarom heb ik een account nodig om producten te zien?", antwoord: "In je account stel je de leeftijd of maat van je kind in. Daardoor laten we je alleen aanbod zien dat nu past." },
  { vraag: "Hoe zorgen jullie dat er geen kindergezichten in de app staan?", antwoord: "Onze slimme AI controleert elke foto bij het plaatsen. Staat er een gezicht van een kind op, dan wordt het product geweigerd." },
  { vraag: "Hoe betaal ik en hoe krijg ik het product?", antwoord: "Je neemt via de chat contact op met de verkoper. Samen spreken jullie af hoe je betaalt en of je het ophaalt." },
];

export default function LandingPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <MarketingPaginaMarker />
      <MarketingHeader />
      <main>
        <section className="bg-gradient-to-r from-[#E4F4FB] via-[#FFF9FA] to-[#FFEAF1]">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-7 sm:pt-16 pb-10 sm:pb-16 flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
            <div className="flex-1 min-w-0 w-full">
              <Eyebrow>Kleding &amp; accessoires 0 tot 12 jaar</Eyebrow>
              <h1 className="mt-5 font-headline font-extrabold text-[34px] sm:text-[46px] lg:text-[54px] leading-[1.05] tracking-tight">
                Wat te klein is, past een ander kind <span className="text-[#D63D74]">precies</span>
              </h1>
              <UspLijst usps={USPS} />
              <HeroKnoppen tweede={{ label: "Bekijk hoe het werkt", href: "/hoe-het-werkt" }} />
            </div>
            <div className="flex-1 min-w-0 w-full flex justify-center">
              <SwipeKaart product={PRODUCTEN.regenjas} />
            </div>
          </div>
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
            <dl className={`bg-white rounded-3xl px-5 sm:px-7 py-5 ${SCHADUW} grid grid-cols-2 md:grid-cols-4 gap-4`}>
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

        <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 sm:pt-[72px]">
          <SectieKop links titel="Wat zoek je?" sub="Alles voor kinderen van 0 tot 12 jaar, van ouders uit de buurt." />
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {ROUTES.map((r) => (
              <Link key={r.href} href={r.href} className={`rounded-[28px] p-6 sm:p-7 min-h-[150px] flex flex-col justify-between gap-2 bg-gradient-to-br ${r.kleur} to-white transition-transform hover:-translate-y-0.5`}>
                <span className="font-headline font-extrabold text-[26px]">{r.titel}</span>
                <span className="text-[#5B4F63]">{r.tekst}</span>
                <span className={`inline-flex items-center gap-1.5 font-bold ${r.accent}`}>Bekijk {r.titel.toLowerCase()} <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <Groeimodel />

        <Sectie id="hoe-het-werkt">
          <SectieKop label="Hoe het werkt" titel="Kopen en verkopen, gewoon tussen ouders" />
          <Kaarten items={STAPPEN} kolommen="sm:grid-cols-2 lg:grid-cols-4" />
          <p className="mt-8 text-center">
            <Link href="/hoe-het-werkt" className="font-bold text-[#1C7FA8] underline underline-offset-2">Lees precies hoe het werkt</Link>
          </p>
        </Sectie>

        <Sectie id="reviews">
          <SectieKop label="Wat ouders zeggen" titel="Ouders geven ons een 4,8" />
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <figure key={r.naam} className={`bg-white rounded-3xl p-7 ${SCHADUW} flex flex-col gap-4`}>
                <div className="text-[#D63D74] tracking-wider" aria-label="5 van 5 sterren">★★★★★</div>
                <blockquote className="leading-relaxed">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="text-sm"><strong>{r.naam}</strong> <span className="text-[#5B4F63]">· {r.context}</span></figcaption>
              </figure>
            ))}
          </div>
        </Sectie>

        <Faq vragen={FAQ} />
        <p className="text-center mt-5">
          <Link href="/helpcentrum" className="font-semibold text-[#1C7FA8] underline underline-offset-2">Meer veelgestelde vragen</Link>
        </p>

        <AfsluitendeCta titel="Zie vandaag nog wat jouw kind" accent="nu past" tekst="Maak gratis een account, stel de maat van je kind in en swipe direct door kleding en accessoires die passen." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
