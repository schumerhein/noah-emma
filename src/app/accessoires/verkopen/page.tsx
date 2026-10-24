import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Armchair, Baby, Car, ToyBrick } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AccessoireKaart, AfsluitendeCta, Faq, Hero, Kaarten, MarketingFooter, SCHADUW, Sectie, SectieKop, Stappen, StructuredData, Tegels, type AccessoireItem, type Vraag,
} from "@/components/marketing/Blokken";

// Zoekwoord: "kinderaccessoires verkopen". Voor ouders met een zolder of
// berging vol spullen die hun kind niet meer gebruikt. Zusterpagina: /accessoires/kopen.
const PAD = "/accessoires/verkopen";
const OUDER = { naam: "Accessoires", pad: "/accessoires" };

export const metadata: Metadata = {
  title: "Kinderaccessoires verkopen, gratis en veilig | Noah & Emma",
  description:
    "Kinderaccessoires verkopen zonder kosten: je kinderwagen, autostoeltje, box of speelgoed, aan ouders bij jou in de buurt. Nooit een foto van je kind.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Kinderaccessoires verkopen, helemaal gratis | Noah & Emma",
    description: "Verkoop je kinderwagen, autostoeltje of speelgoed aan ouders uit de buurt. Gratis en zonder foto van je kind.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const VOORBEELDEN: AccessoireItem[] = [
  { titel: "Combiwagen, compleet", sub: "Met reiswieg en regenhoes", Icoon: Baby, kleur: "blauw" },
  { titel: "Box met boxkleed", sub: "Opvouwbaar, zo goed als nieuw", Icoon: Armchair, kleur: "roze" },
  { titel: "Babyzitje met basis", sub: "Ongevalvrij, i-Size", Icoon: Car, kleur: "blauw" },
  { titel: "Doos houten speelgoed", sub: "Blokken, puzzels, treintje", Icoon: ToyBrick, kleur: "roze" },
];

const USPS = [
  { kop: "Gratis verkopen.", tekst: "Geen kosten voor je account en geen kosten per verkoop." },
  { kop: "Bij de juiste ouders.", tekst: "Je advertentie verschijnt bij ouders van wie het kind die leeftijd nu heeft." },
  { kop: "Nooit een kindergezicht.", tekst: "Onze slimme AI weigert elke foto waar een kind op staat." },
  { kop: "Ophalen in de buurt.", tekst: "Geen gedoe met grote pakketten: de koper haalt het bij je op." },
];

const WAAROM = [
  { titel: "Ruimte op zolder en in de berging", tekst: "De kinderwagen, de box en de kinderstoel nemen veel plek in. Bij een andere ouder worden ze weer elke dag gebruikt." },
  { titel: "Je bereikt de juiste kopers", tekst: "Je advertentie komt bij ouders van wie het kind nu de leeftijd heeft waarvoor jouw spullen bedoeld zijn." },
  { titel: "Helemaal gratis", tekst: "Een account maken en kinderaccessoires verkopen kost niets. Wat je afspreekt met de koper, is voor jou." },
  { titel: "Je kind blijft offline", tekst: "Fotografeer alleen het product. Staat er toch een kindergezicht op de foto, dan weigert onze AI hem." },
  { titel: "Eerlijke reviews", tekst: "Na elke deal geven koper en verkoper elkaar een review. Zo bouw je vertrouwen op voor je volgende verkoop." },
  { titel: "Kleding er meteen bij", tekst: "Verkoop je ook kinderkleding? Dat doe je in dezelfde app, met dezelfde account." },
];

const STAPPEN = [
  { titel: "Fotografeer alleen het product", tekst: "Zet de kinderwagen of het meubel op een rustige plek bij daglicht, zonder je kind erbij." },
  { titel: "Kies staat en prijs", tekst: "Vul de staat en je prijs in en schrijf erbij wat er allemaal bij zit." },
  { titel: "Wij controleren je advertentie", tekst: "Onze AI controleert elke foto. Twijfelt de AI, dan kijkt een van ons mee. Daarna staat je advertentie online." },
  { titel: "Chat en spreek af", tekst: "Ouders in de buurt zien je advertentie. Jullie spreken samen af over ophalen en betalen. Na de deal volgt een review." },
];

const WAT = [
  { naam: "Kinderwagens", sub: "Combiwagens, buggy's, duowagens" },
  { naam: "Autostoeltjes", sub: "Babyzitje, i-Size, zittingverhoger" },
  { naam: "Kinderkamer", sub: "Ledikant, box, commode, kast" },
  { naam: "Eten en drinken", sub: "Kinderstoel, meegroeistoel" },
  { naam: "Onderweg", sub: "Draagzak, fietsstoeltje, reisbedje" },
  { naam: "Speelgoed", sub: "Houten speelgoed, Lego, knuffels" },
  { naam: "Buitenspelen", sub: "Loopfiets, kinderfiets, step" },
  { naam: "Babyuitzet", sub: "Badje, boxkleed, babyfoon" },
];

const TIPS = [
  { titel: "Maak het eerst schoon", tekst: "Een frisse kinderwagen met schone stof verkoopt sneller en voor een betere prijs. Veel bekleding kan in de wasmachine." },
  { titel: "Noem merk, type en bouwjaar", tekst: "Ouders zoeken vaak op een bepaald merk of type. Het bouwjaar helpt ze om de prijs in te schatten." },
  { titel: "Zet erbij wat er compleet is", tekst: "Regenhoes, reiswieg, adapters, inbouwschroeven en handleiding: hoe completer, hoe makkelijker het verkoopt." },
  { titel: "Wees eerlijk bij autostoeltjes", tekst: "Vermeld of het stoeltje ongevalvrij is en welk label het heeft. Kopers vragen er altijd naar." },
];

const FAQ: Vraag[] = [
  { vraag: "Wat kost kinderaccessoires verkopen via Noah & Emma?", antwoord: "Niets. Een account maken en verkopen is gratis. Premium is optioneel, voor extra functies." },
  { vraag: "Welke kinderaccessoires kan ik verkopen?", antwoord: "Kinderwagens, buggy's, autostoeltjes, meubels voor de kinderkamer, kinderstoelen, speelgoed, fietsjes en babyuitzet voor kinderen van 0 tot 12 jaar." },
  { vraag: "Mag mijn kind op de foto staan?", antwoord: "Nee. Onze AI weigert elke foto met het gezicht van een kind. Fotografeer alleen het product." },
  { vraag: "Hoe krijgt de koper een kinderwagen of meubel?", antwoord: "Jullie spreken samen af hoe het wordt geregeld. Bij grote spullen haalt de koper het meestal bij je op." },
  { vraag: "Hoe krijg ik betaald?", antwoord: "Je spreekt met de koper af hoe hij betaalt, bijvoorbeeld contant bij het ophalen of met een betaalverzoek." },
];

export default function AccessoiresVerkopenPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Verkopen" pad={PAD} faq={FAQ} ouder={OUDER} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Verkopen"
          ouder={OUDER}
          eyebrow="Gratis en veilig"
          titel={<>Kinderaccessoires verkopen, <span className="text-[#D63D74]">gratis aan ouders in de buurt</span></>}
          usps={USPS}
          tweedeKnop={{ label: "Zo werkt verkopen", href: "#stappen" }}
          beeld={<AccessoireKaart kop="Van de zolder van Sanne" label="Te koop" items={VOORBEELDEN} voetnoot="Voorbeeld van advertenties. Zet je eigen spullen online na gratis aanmelden." />}
        />

        <Sectie>
          <SectieKop label="Waarom Noah & Emma" titel="Kinderaccessoires verkopen aan ouders die het nodig hebben" sub="Wat jouw kind niet meer gebruikt, staat bij een ander gezin zo weer elke dag in de gang." />
          <Kaarten items={WAAROM} />
        </Sectie>

        <Sectie id="stappen" smal>
          <SectieKop titel="Zo verkoop je kinderaccessoires in 4 stappen" />
          <div className="mt-8">
            <Stappen titel="Verkopen" stappen={STAPPEN} kleur="roze" />
          </div>
        </Sectie>

        <Sectie>
          <SectieKop label="Wat kun je verkopen?" titel="Alles voor kinderen van 0 tot 12 jaar" />
          <Tegels items={WAT} />
        </Sectie>

        <Sectie>
          <SectieKop label="Tips" titel="Zo verkoop je je kinderaccessoires sneller" />
          <Kaarten items={TIPS} kolommen="sm:grid-cols-2" />
          <p className="mt-6 text-center">
            <Link href="/kinderkleding/verkopen" className="font-bold text-[#1C7FA8] underline underline-offset-2">Ook kinderkleding verkopen? Zo werkt het</Link>
          </p>
        </Sectie>

        <Sectie smal>
          <Link href="/accessoires/kopen" className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[28px] p-6 sm:p-8 bg-gradient-to-br from-[#E4F4FB] to-white ${SCHADUW}`}>
            <span>
              <span className="block font-headline font-extrabold text-[22px]">Zoek je zelf iets voor de volgende fase?</span>
              <span className="block mt-1 text-[#5B4F63]">Koop een buggy, peuterbed of fietsje dat past bij de leeftijd van je kind.</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[#1C7FA8] shrink-0">Kinderaccessoires kopen <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
          </Link>
        </Sectie>

        <Faq vragen={FAQ} titel="Vragen over kinderaccessoires verkopen" />
        <AfsluitendeCta titel="Maak plek op zolder en help" accent="een ander gezin" tekst="Maak gratis een account en zet je kinderwagen, autostoeltje of speelgoed online. Zonder foto van je kind, zonder kosten." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
