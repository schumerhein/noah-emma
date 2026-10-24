import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AfsluitendeCta, Faq, Hero, Kaarten, MarketingFooter, PRODUCTEN, SCHADUW, Sectie, SectieKop, Stappen, StructuredData, SwipeKaart, Tegels, type Vraag,
} from "@/components/marketing/Blokken";

// Zoekwoord: "kinderkleding verkopen". Voor ouders met een kast vol kleding en
// spullen die te klein zijn. Zusterpagina: /kinderkleding/kopen.
const PAD = "/kinderkleding/verkopen";
const OUDER = { naam: "Kinderkleding", pad: "/kinderkleding" };

export const metadata: Metadata = {
  title: "Kinderkleding verkopen, gratis en veilig | Noah & Emma",
  description:
    "Kinderkleding verkopen zonder foto van je kind. Gratis, en je kleding komt terecht bij ouders van wie het kind die maat nu heeft. Ook accessoires.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Kinderkleding verkopen, zonder foto van je kind | Noah & Emma",
    description: "Verkoop wat te klein is gratis aan ouders in de buurt. Onze AI weigert elke foto met een kindergezicht.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const USPS = [
  { kop: "Gratis verkopen.", tekst: "Geen kosten voor je account en geen kosten per verkoop." },
  { kop: "Bij de juiste ouders.", tekst: "Je advertentie verschijnt bij ouders van wie het kind die maat nu heeft." },
  { kop: "Nooit een kindergezicht.", tekst: "Onze slimme AI weigert elke foto waar een kind op staat." },
  { kop: "Ook accessoires.", tekst: "Verkoop ook de kinderwagen, het autostoeltje of speelgoed." },
];

const WAAROM = [
  { titel: "Je kind blijft offline", tekst: "Je fotografeert alleen de kleding. Staat er toch een kindergezicht op de foto, dan weigert onze AI hem. Zo komt je kind nooit online." },
  { titel: "Je bereikt de juiste kopers", tekst: "Je advertentie komt bij ouders van wie het kind nu precies die maat of leeftijd heeft. Dat zijn de mensen die het nodig hebben." },
  { titel: "Helemaal gratis", tekst: "Een account maken en kinderkleding verkopen kost niets. Wat je afspreekt met de koper, is voor jou." },
  { titel: "Snel een advertentie", tekst: "Foto maken, maat, staat en prijs kiezen en klaar. Binnen een paar minuten staat je kleding online." },
  { titel: "Eerlijke reviews", tekst: "Na elke deal geven koper en verkoper elkaar een review. Zo bouw je vertrouwen op voor je volgende verkoop." },
  { titel: "Ruimte in de kast", tekst: "Wat te klein is, past een ander kind precies. Je maakt plek en een ander gezin blij." },
];

const STAPPEN = [
  { titel: "Maak een foto van alleen het product", tekst: "Leg de kleding plat neer of hang hem op. Fotografeer een kinderwagen of speelgoed los, zonder je kind erbij." },
  { titel: "Kies maat, staat en prijs", tekst: "Vul de maat, de staat en je prijs in en schrijf er een korte omschrijving bij." },
  { titel: "Wij controleren je advertentie", tekst: "Onze AI controleert elke foto. Twijfelt de AI, dan kijkt een van ons mee. Daarna staat je advertentie online." },
  { titel: "Chat en spreek af", tekst: "Ouders in die maat zien je advertentie. Je spreekt zelf af over ophalen of verzenden en betalen. Na de deal volgt een review." },
];

const WAT = [
  { naam: "Babykleding", sub: "Rompers, boxpakjes, slaapzakken" },
  { naam: "Jassen", sub: "Winterjas, regenjas, skipak" },
  { naam: "Broeken en jurkjes", sub: "Voor elke dag en feestjes" },
  { naam: "Truien en vesten", sub: "Gebreid, hoodies, fleece" },
  { naam: "Schoenen", sub: "Sneakers, laarzen, sloffen" },
  { naam: "Kinderwagens", sub: "Ook buggy's en wiegjes" },
  { naam: "Autostoeltjes", sub: "Van babyzitje tot zitverhoger" },
  { naam: "Speelgoed en meubels", sub: "Van blokken tot ledikant" },
];

const TIPS = [
  { titel: "Fotografeer bij daglicht", tekst: "Leg de kleding plat op een rustige ondergrond of hang hem op. Daglicht laat de echte kleur zien." },
  { titel: "Noem merk, maat en lengte", tekst: "Maten vallen per merk anders uit. Een lengte in centimeters helpt kopers om te kiezen." },
  { titel: "Wees eerlijk over de staat", tekst: "Een klein vlekje of pluisjes? Zet het erbij. Eerlijke advertenties leveren betere reviews op." },
  { titel: "Verkoop op tijd", tekst: "Zet kleding online zodra het te klein is. Een winterjas verkoopt het best aan het begin van het seizoen." },
];

const FAQ: Vraag[] = [
  { vraag: "Wat kost kinderkleding verkopen via Noah & Emma?", antwoord: "Niets. Een account maken en verkopen is gratis. Premium is optioneel, voor extra functies." },
  { vraag: "Mag mijn kind op de foto staan?", antwoord: "Nee. Onze AI weigert elke foto met het gezicht van een kind. Fotografeer alleen de kleding, plat neergelegd of op een hanger." },
  { vraag: "Hoe snel staat mijn advertentie online?", antwoord: "Meestal direct na de controle door onze AI. Twijfelt de AI, dan kijkt een van ons mee en dat kan iets langer duren." },
  { vraag: "Hoe krijg ik betaald?", antwoord: "Je spreekt met de koper af hoe hij betaalt, bijvoorbeeld contant bij het ophalen of met een betaalverzoek." },
  { vraag: "Kan ik ook accessoires en speelgoed verkopen?", antwoord: "Ja. Je kunt ook kinderwagens, autostoeltjes, speelgoed en meubels voor kinderen van 0 tot 12 jaar verkopen." },
];

export default function KinderkledingVerkopenPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Verkopen" pad={PAD} faq={FAQ} ouder={OUDER} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Verkopen"
          ouder={OUDER}
          eyebrow="Gratis en veilig"
          titel={<>Kinderkleding verkopen, <span className="text-[#D63D74]">zonder foto van je kind</span></>}
          usps={USPS}
          tweedeKnop={{ label: "Zo werkt verkopen", href: "#stappen" }}
          beeld={<SwipeKaart product={PRODUCTEN.sneakers} />}
        />

        <Sectie>
          <SectieKop label="Waarom Noah & Emma" titel="Kinderkleding verkopen aan ouders die het nodig hebben" sub="Je kast staat vol met kleding die te klein is. Bij een ander kind past het precies." />
          <Kaarten items={WAAROM} />
        </Sectie>

        <Sectie id="stappen" smal>
          <SectieKop titel="Zo verkoop je kinderkleding in 4 stappen" />
          <div className="mt-8">
            <Stappen titel="Verkopen" stappen={STAPPEN} kleur="roze" />
          </div>
        </Sectie>

        <Sectie>
          <SectieKop label="Wat kun je verkopen?" titel="Kleding en alles voor kinderen van 0 tot 12 jaar" />
          <Tegels items={WAT} />
        </Sectie>

        <Sectie>
          <SectieKop label="Tips" titel="Zo verkoop je je kinderkleding sneller" />
          <Kaarten items={TIPS} kolommen="sm:grid-cols-2" />
        </Sectie>

        <Sectie smal>
          <Link href="/kinderkleding/kopen" className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[28px] p-6 sm:p-8 bg-gradient-to-br from-[#E4F4FB] to-white ${SCHADUW}`}>
            <span>
              <span className="block font-headline font-extrabold text-[22px]">Zoek je zelf de volgende maat?</span>
              <span className="block mt-1 text-[#5B4F63]">Koop tweedehands kinderkleding in de maat die je kind nu heeft.</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[#1C7FA8] shrink-0">Kinderkleding kopen <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
          </Link>
        </Sectie>

        <Faq vragen={FAQ} titel="Vragen over kinderkleding verkopen" />
        <AfsluitendeCta titel="Geef wat te klein is door aan een kind dat het" accent="nu past" tekst="Maak gratis een account en zet je eerste kledingstuk online. Zonder foto van je kind, zonder kosten." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
