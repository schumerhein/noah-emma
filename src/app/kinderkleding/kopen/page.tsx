import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AfsluitendeCta, Faq, Groeimodel, Hero, Kaarten, MarketingFooter, PRODUCTEN, SCHADUW, Sectie, SectieKop, Stappen, StructuredData, SwipeKaart, Tegels, type Vraag,
} from "@/components/marketing/Blokken";

// Zoekwoord: "kinderkleding kopen". Voor ouders die op zoek zijn naar
// tweedehands kleding en accessoires. Zusterpagina: /kinderkleding/verkopen.
const PAD = "/kinderkleding/kopen";
const OUDER = { naam: "Kinderkleding", pad: "/kinderkleding" };

export const metadata: Metadata = {
  title: "Kinderkleding kopen, tweedehands en gratis | Noah & Emma",
  description:
    "Kinderkleding kopen van andere ouders: tweedehands, in de maat die je kind nu heeft en zonder kosten. Ook kinderwagens, autostoeltjes en speelgoed.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Kinderkleding kopen in de maat die nu past | Noah & Emma",
    description: "Tweedehands kinderkleding en accessoires van ouders uit de buurt. Gratis account, gratis kopen.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const USPS = [
  { kop: "Alleen wat nu past.", tekst: "Je ziet kleding in de maat van je kind, de maat groeit vanzelf mee." },
  { kop: "Van andere ouders.", tekst: "Kies van wie je koopt aan de hand van reviews na echte deals." },
  { kop: "Meer dan kleding.", tekst: "Ook kinderwagens, autostoeltjes, speelgoed en meubels." },
  { kop: "Gratis kopen.", tekst: "Geen kosten voor je account en geen kosten per aankoop." },
];

const WAAROM = [
  { titel: "Geen eindeloos zoeken op maat", tekst: "Stel één keer de leeftijd of maat van je kind in. Daarna zie je alleen kleding die nu past, ook als je kind een maat groeit." },
  { titel: "Handig met meerdere kinderen", tekst: "Voeg al je kinderen toe. Je ziet voor ieder kind het aanbod in de juiste maat." },
  { titel: "Zelf kiezen van wie je koopt", tekst: "Bij elke verkoper zie je reviews van eerdere deals. Een review kan alleen na een echte deal." },
  { titel: "Nooit kindergezichten", tekst: "Onze slimme AI weigert elke foto met het gezicht van een kind. Je ziet alleen de kleding." },
  { titel: "Swipen in plaats van zoeken", tekst: "Naar rechts bewaar je iets, naar links ga je door. Zo vind je snel iets moois." },
  { titel: "Goedkoper en duurzamer", tekst: "Veel kinderkleding is maar een paar weken gedragen. Tweedehands kopen scheelt geld en er hoeft minder nieuw gemaakt te worden." },
];

const STAPPEN = [
  { titel: "Maak gratis een account", tekst: "Vul de leeftijd of maat van je kind in. Heb je meer kinderen, voeg ze allemaal toe." },
  { titel: "Swipe door het aanbod", tekst: "Je ziet kleding en accessoires die passen bij de maat en leeftijd van je kind." },
  { titel: "Stuur de verkoper een bericht", tekst: "Stel je vragen in de chat en bekijk de reviews van de verkoper." },
  { titel: "Spreek samen af", tekst: "Jullie regelen zelf het ophalen of verzenden en de betaling. Na de deal laat je een review achter." },
];

const AANBOD = [
  { naam: "Babykleding", sub: "Rompers, boxpakjes, slaapzakken" },
  { naam: "Jassen", sub: "Winterjas, regenjas, zomerjas" },
  { naam: "Broeken en jurkjes", sub: "Voor elke dag en feestjes" },
  { naam: "Truien en vesten", sub: "Gebreid, hoodies, fleece" },
  { naam: "Schoenen", sub: "Sneakers, laarzen, sloffen" },
  { naam: "Kinderwagens", sub: "Ook buggy's en wiegjes" },
  { naam: "Autostoeltjes", sub: "Van babyzitje tot zitverhoger" },
  { naam: "Speelgoed", sub: "Puzzels, blokken, buitenspeelgoed" },
];

const TIPS = [
  { titel: "Kijk naar de maat én de lengte", tekst: "Maten verschillen per merk. Vraag bij twijfel naar de lengte of binnenbeenlengte in centimeters." },
  { titel: "Let op de staat", tekst: "Nieuw met label is nooit gedragen, zo goed als nieuw is een paar keer gedragen, goed is zichtbaar gedragen maar prima te gebruiken." },
  { titel: "Vraag om een extra foto", tekst: "Twijfel je over een vlekje of de kleur? Vraag de verkoper in de chat om een extra foto van het kledingstuk." },
  { titel: "Koop alvast een maat groter", tekst: "Het groeimodel laat ook de volgende maat zien. Handig voor een winterjas die het hele seizoen mee moet." },
];

const FAQ: Vraag[] = [
  { vraag: "Wat kost kinderkleding kopen via Noah & Emma?", antwoord: "Een account en kopen zijn gratis. Je betaalt alleen de prijs die je met de verkoper afspreekt. Premium is optioneel, voor extra functies zoals gericht zoeken." },
  { vraag: "Hoe betaal ik en hoe krijg ik de kleding?", antwoord: "Je spreekt via de chat met de verkoper af hoe je betaalt en of je ophaalt of dat het wordt opgestuurd." },
  { vraag: "Waarom heb ik een account nodig om kinderkleding te kopen?", antwoord: "In je account staat de maat van je kind. Zo laten we alleen kleding zien die nu past, en kun je de verkoper een bericht sturen." },
  { vraag: "Kan ik ook accessoires kopen, zoals een kinderwagen?", antwoord: "Ja. Je vindt ook kinderwagens, autostoeltjes, speelgoed en meubels voor kinderen van 0 tot 12 jaar." },
  { vraag: "Hoe weet ik of een verkoper betrouwbaar is?", antwoord: "Bekijk de reviews op het profiel van de verkoper. Een review kan alleen worden gegeven na een afgeronde deal. Klopt er iets niet, dan kun je een advertentie of gebruiker melden." },
];

export default function KinderkledingKopenPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Kopen" pad={PAD} faq={FAQ} ouder={OUDER} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Kopen"
          ouder={OUDER}
          eyebrow="Tweedehands, 0 tot 12 jaar"
          titel={<>Kinderkleding kopen, <span className="text-[#D63D74]">altijd in de maat die nu past</span></>}
          usps={USPS}
          tweedeKnop={{ label: "Zo werkt kopen", href: "#stappen" }}
          beeld={<SwipeKaart product={PRODUCTEN.trui} />}
        />

        <Sectie>
          <SectieKop label="Waarom Noah & Emma" titel="Kinderkleding kopen zonder gedoe" sub="Geen stapels advertenties in de verkeerde maat. Je ziet meteen wat jouw kind nu past." />
          <Kaarten items={WAAROM} />
        </Sectie>

        <Sectie id="stappen" smal>
          <SectieKop titel="Zo koop je kinderkleding in 4 stappen" />
          <div className="mt-8">
            <Stappen titel="Kopen" stappen={STAPPEN} kleur="blauw" />
          </div>
        </Sectie>

        <Groeimodel />

        <Sectie>
          <SectieKop label="Het aanbod" titel="Wat kun je kopen?" sub="Kleding van maat 50 tot 158/164 en alles voor kinderen van 0 tot 12 jaar." />
          <Tegels items={AANBOD} />
          <p className="mt-6 text-center">
            <Link href="/accessoires" className="font-bold text-[#1C7FA8] underline underline-offset-2">Meer over tweedehands accessoires</Link>
          </p>
        </Sectie>

        <Sectie>
          <SectieKop label="Tips" titel="Waar let je op bij tweedehands kinderkleding kopen?" />
          <Kaarten items={TIPS} kolommen="sm:grid-cols-2" />
        </Sectie>

        <Sectie smal>
          <Link href="/kinderkleding/verkopen" className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[28px] p-6 sm:p-8 bg-gradient-to-br from-[#FFEAF1] to-white ${SCHADUW}`}>
            <span>
              <span className="block font-headline font-extrabold text-[22px]">Heb je zelf kleding die te klein is?</span>
              <span className="block mt-1 text-[#5B4F63]">Verkoop het gratis aan ouders van wie het kind die maat nu heeft.</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[#D63D74] shrink-0">Kinderkleding verkopen <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
          </Link>
        </Sectie>

        <Faq vragen={FAQ} titel="Vragen over kinderkleding kopen" />
        <AfsluitendeCta titel="Vind vandaag nog kleding die jouw kind" accent="nu past" tekst="Maak gratis een account, stel de maat van je kind in en swipe direct door kinderkleding van andere ouders." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}

