import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Baby, BedSingle, Bike, Car } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AccessoireKaart, AfsluitendeCta, Faq, Groeimodel, Hero, Kaarten, MarketingFooter, SCHADUW, Sectie, SectieKop, Stappen, StructuredData, Tegels, type AccessoireItem, type Vraag,
} from "@/components/marketing/Blokken";

// Zoekwoord: "kinderaccessoires kopen". Voor ouders die tweedehands
// kinderwagens, autostoeltjes en speelgoed zoeken. Zusterpagina: /accessoires/verkopen.
const PAD = "/accessoires/kopen";
const OUDER = { naam: "Accessoires", pad: "/accessoires" };

export const metadata: Metadata = {
  title: "Kinderaccessoires kopen, tweedehands en gratis | Noah & Emma",
  description:
    "Kinderaccessoires kopen van andere ouders: tweedehands kinderwagens, autostoeltjes, speelgoed en meubels, passend bij de leeftijd van je kind. Gratis.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Tweedehands kinderaccessoires kopen | Noah & Emma",
    description: "Kinderwagens, autostoeltjes en speelgoed van ouders uit de buurt. Gratis account, gratis kopen.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const VOORBEELDEN: AccessoireItem[] = [
  { titel: "Buggy, lichtgewicht", sub: "Zo goed als nieuw · Amersfoort", Icoon: Baby, kleur: "roze" },
  { titel: "Houten loopfiets", sub: "Goed · Leusden", Icoon: Bike, kleur: "blauw" },
  { titel: "Peuterbed met lattenbodem", sub: "Zo goed als nieuw · Soest", Icoon: BedSingle, kleur: "roze" },
  { titel: "Autostoeltje groep 1", sub: "Ongevalvrij · Baarn", Icoon: Car, kleur: "blauw" },
];

const USPS = [
  { kop: "Passend bij de leeftijd.", tekst: "Je ziet wat nu bij je kind past, en dat groeit vanzelf mee." },
  { kop: "Van ouders uit de buurt.", tekst: "Grote spullen haal je op en bekijk je meteen in het echt." },
  { kop: "Jij kiest van wie je koopt.", tekst: "Bekijk de reviews van de verkoper voordat je afspreekt." },
  { kop: "Gratis kopen.", tekst: "Geen kosten voor je account en geen kosten per aankoop." },
];

const WAAROM = [
  { titel: "Je gebruikt het maar even", tekst: "Een babyzitje past een jaar, een box een paar maanden. Tweedehands betaal je een fractie van de nieuwprijs voor dezelfde periode." },
  { titel: "Afgestemd op de leeftijd", tekst: "Stel één keer de leeftijd van je kind in. Je ziet accessoires die nu passen, van kinderwagen tot fietsje." },
  { titel: "Ophalen bij jou in de buurt", tekst: "Kinderwagens en meubels zijn groot. Je ziet aanbod van ouders bij jou in de buurt, zodat ophalen makkelijk is." },
  { titel: "Reviews na echte deals", tekst: "Bij elke verkoper zie je reviews van eerdere deals. Een review kan alleen na een afgeronde deal." },
  { titel: "Alles voor je kind op één plek", tekst: "Kinderaccessoires en kinderkleding in de juiste maat, in één app." },
  { titel: "Nooit kindergezichten", tekst: "Onze slimme AI weigert elke foto met het gezicht van een kind. Je ziet alleen het product." },
];

const STAPPEN = [
  { titel: "Maak gratis een account", tekst: "Vul de leeftijd van je kind in. Heb je meer kinderen, voeg ze allemaal toe." },
  { titel: "Swipe door het aanbod", tekst: "Je ziet kinderwagens, autostoeltjes, speelgoed en meubels die passen bij de leeftijd van je kind." },
  { titel: "Stel je vragen in de chat", tekst: "Vraag naar de staat, de leeftijd en of alles compleet is. Bekijk ook de reviews van de verkoper." },
  { titel: "Bekijk het en haal het op", tekst: "Spreek af om het te bekijken en op te halen. De betaling regelen jullie samen. Na de deal laat je een review achter." },
];

const AANBOD = [
  { naam: "Kinderwagens", sub: "Combiwagens, buggy's, duowagens" },
  { naam: "Autostoeltjes", sub: "Babyzitje, i-Size, zittingverhoger" },
  { naam: "Kinderkamer", sub: "Ledikant, box, commode, peuterbed" },
  { naam: "Eten en drinken", sub: "Kinderstoel, meegroeistoel" },
  { naam: "Onderweg", sub: "Draagzak, fietsstoeltje, reisbedje" },
  { naam: "Speelgoed", sub: "Houten speelgoed, Lego, puzzels" },
  { naam: "Buitenspelen", sub: "Loopfiets, kinderfiets, step" },
  { naam: "Babyuitzet", sub: "Badje, boxkleed, babyfoon" },
];

const TIPS = [
  { titel: "Bekijk grote spullen in het echt", tekst: "Spreek af om een kinderwagen of ledikant te bekijken voordat je betaalt. Zo zie je direct of alles werkt." },
  { titel: "Vraag naar de geschiedenis", tekst: "Hoe oud is het, hoe vaak is het gebruikt en is een autostoeltje ongevalvrij? Een eerlijke verkoper vertelt het je graag." },
  { titel: "Check of alles compleet is", tekst: "Denk aan de regenhoes, de reiswieg, adapters, inbouwschroeven en de handleiding." },
  { titel: "Regel het vervoer vooraf", tekst: "Past de kinderwagen of kast in je auto? Meet het vooraf op, dan is ophalen zo gepiept." },
];

const FAQ: Vraag[] = [
  { vraag: "Wat kost kinderaccessoires kopen via Noah & Emma?", antwoord: "Een account en kopen zijn gratis. Je betaalt alleen de prijs die je met de verkoper afspreekt. Premium is optioneel, voor extra functies zoals gericht zoeken." },
  { vraag: "Welke kinderaccessoires kan ik kopen?", antwoord: "Kinderwagens, buggy's, autostoeltjes, meubels voor de kinderkamer, kinderstoelen, speelgoed, fietsjes en babyuitzet. Alles voor kinderen van 0 tot 12 jaar." },
  { vraag: "Is een tweedehands autostoeltje veilig?", antwoord: "Vraag altijd of het stoeltje ongevalvrij is, controleer het label (i-Size of R44/04) en of alle onderdelen en de handleiding er zijn. Twijfel je, koop het dan niet." },
  { vraag: "Hoe krijg ik een kinderwagen of meubel thuis?", antwoord: "Je spreekt met de verkoper af hoe jullie het regelen. Meestal haal je grote spullen op, zodat je ze meteen kunt bekijken." },
  { vraag: "Waarom heb ik een account nodig?", antwoord: "In je account staat de leeftijd van je kind. Zo laten we zien wat nu past, en kun je de verkoper een bericht sturen." },
];

export default function AccessoiresKopenPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Kopen" pad={PAD} faq={FAQ} ouder={OUDER} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Kopen"
          ouder={OUDER}
          eyebrow="Tweedehands, 0 tot 12 jaar"
          titel={<>Kinderaccessoires kopen, <span className="text-[#D63D74]">van ouders bij jou in de buurt</span></>}
          usps={USPS}
          tweedeKnop={{ label: "Zo werkt kopen", href: "#stappen" }}
          beeld={<AccessoireKaart kop="Voor Noor, 3 jaar" label="Peuter" items={VOORBEELDEN} />}
        />

        <Sectie>
          <SectieKop label="Waarom tweedehands" titel="Kinderaccessoires kopen zonder de nieuwprijs" sub="De meeste spullen gebruik je maar een korte periode. Bij een andere ouder liggen ze klaar voor de volgende." />
          <Kaarten items={WAAROM} />
        </Sectie>

        <Sectie id="stappen" smal>
          <SectieKop titel="Zo koop je kinderaccessoires in 4 stappen" />
          <div className="mt-8">
            <Stappen titel="Kopen" stappen={STAPPEN} kleur="blauw" />
          </div>
        </Sectie>

        <Groeimodel />

        <Sectie>
          <SectieKop label="Het aanbod" titel="Welke kinderaccessoires kun je kopen?" sub="Alles voor kinderen van 0 tot 12 jaar, van de eerste kinderwagen tot de eerste fiets." />
          <Tegels items={AANBOD} />
        </Sectie>

        <Sectie>
          <SectieKop label="Tips" titel="Waar let je op bij tweedehands kinderaccessoires?" />
          <Kaarten items={TIPS} kolommen="sm:grid-cols-2" />
          <p className="mt-6 text-center">
            <Link href="/accessoires" className="font-bold text-[#1C7FA8] underline underline-offset-2">Bekijk de checklist voor kinderwagens, autostoeltjes en ledikanten</Link>
          </p>
        </Sectie>

        <Sectie smal>
          <Link href="/accessoires/verkopen" className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[28px] p-6 sm:p-8 bg-gradient-to-br from-[#FFEAF1] to-white ${SCHADUW}`}>
            <span>
              <span className="block font-headline font-extrabold text-[22px]">Staat er bij jou iets op zolder?</span>
              <span className="block mt-1 text-[#5B4F63]">Verkoop je kinderwagen, box of speelgoed gratis aan een andere ouder.</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[#D63D74] shrink-0">Kinderaccessoires verkopen <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
          </Link>
        </Sectie>

        <Faq vragen={FAQ} titel="Vragen over kinderaccessoires kopen" />
        <AfsluitendeCta titel="Vind vandaag nog wat jouw kind" accent="nu nodig heeft" tekst="Maak gratis een account, vul de leeftijd van je kind in en swipe door kinderwagens, autostoeltjes en speelgoed van andere ouders." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
