import type { Metadata } from "next";
import Link from "next/link";
import { Armchair, Baby, Car, Check, ToyBrick } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AccessoireKaart, AfsluitendeCta, Faq, Hero, Kaarten, MarketingFooter, SCHADUW, Sectie, SectieKop, StructuredData, Tegels, type Vraag,
} from "@/components/marketing/Blokken";

const PAD = "/accessoires";

export const metadata: Metadata = {
  title: "Tweedehands kinderwagens en autostoeltjes | Noah & Emma",
  description:
    "Tweedehands kinderwagens, buggy's, autostoeltjes, speelgoed en meubels. Van ouders uit de buurt, met reviews na elke deal. Helemaal gratis.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Tweedehands kinderwagens, autostoeltjes en meer | Noah & Emma",
    description: "Alles voor kinderen van 0 tot 12 jaar, van ouders uit de buurt. Gratis kopen en verkopen.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const USPS = [
  { kop: "Meer dan kleding.", tekst: "Kinderwagens, autostoeltjes, speelgoed en meubels voor de kinderkamer." },
  { kop: "Passend bij de leeftijd.", tekst: "Het groeimodel laat zien wat nu bij je kind past." },
  { kop: "Jij kiest van wie je koopt.", tekst: "Bekijk de reviews van de verkoper voordat je afspreekt." },
  { kop: "Helemaal gratis.", tekst: "Gratis account, gratis kopen en gratis verkopen." },
];

const VOORBEELDEN = [
  { titel: "Combiwagen met reiswieg", sub: "Zo goed als nieuw · Utrecht", Icoon: Baby, kleur: "blauw" },
  { titel: "Autostoeltje i-Size", sub: "Ongevalvrij · Houten", Icoon: Car, kleur: "roze" },
  { titel: "Meegroeistoel, eiken", sub: "Goed · Zeist", Icoon: Armchair, kleur: "blauw" },
  { titel: "Houten loopwagen", sub: "Zo goed als nieuw · Bunnik", Icoon: ToyBrick, kleur: "roze" },
] as const;

const CATEGORIEEN = [
  { naam: "Kinderwagens en buggy's", sub: "Combiwagens, wandelwagens, buggy's, duowagens" },
  { naam: "Autostoeltjes", sub: "Babyzitjes, i-Size, groep 1-2-3, zittingverhogers" },
  { naam: "Kinderkamer", sub: "Ledikanten, commodes, boxen, kasten" },
  { naam: "Eten en drinken", sub: "Kinderstoelen, meegroeistoelen, flessenwarmers" },
  { naam: "Onderweg", sub: "Draagzakken, fietsstoeltjes, reisbedjes" },
  { naam: "Speelgoed", sub: "Houten speelgoed, Lego, puzzels, knuffels" },
  { naam: "Buitenspelen", sub: "Loopfietsjes, kinderfietsen, steps" },
  { naam: "Babyuitzet", sub: "Badjes, boxkleden, babyfoons" },
];

const CHECKLIST = [
  { titel: "Kinderwagen of buggy", punten: ["Rem goed op beide achterwielen", "Vouwen en uitklappen zonder haperen", "Banden en vering niet versleten", "Gordels en sluitingen compleet"] },
  { titel: "Autostoeltje", punten: ["Vraag of het stoeltje ongevalvrij is", "Kijk naar het label: i-Size (R129) of R44/04", "Controleer of de handleiding en alle onderdelen er zijn", "Let op de leeftijd van het stoeltje"] },
  { titel: "Ledikant of box", punten: ["Spijlen staan niet verder dan 6,5 cm uit elkaar", "Geen losse of gebroken delen", "Koop bij voorkeur een nieuw matras", "Vraag of de montagehandleiding erbij zit"] },
];

const STAPPEN = [
  { titel: "Vind wat je zoekt", tekst: "Swipe door accessoires van ouders bij jou in de buurt, afgestemd op de leeftijd van je kind." },
  { titel: "Stuur een bericht", tekst: "Stel je vragen via de chat en bekijk de reviews van de verkoper." },
  { titel: "Spreek af en haal op", tekst: "Jullie regelen samen het ophalen en de betaling. Grote spullen bekijk je zo eerst in het echt." },
  { titel: "Laat een review achter", tekst: "Na de deal geven jullie elkaar een review. Zo weet de volgende ouder wat hij kan verwachten." },
];

const FAQ: Vraag[] = [
  { vraag: "Welke accessoires kan ik kopen en verkopen?", antwoord: "Kinderwagens, buggy's, autostoeltjes, meubels voor de kinderkamer, kinderstoelen, speelgoed, fietsjes en babyuitzet. Alles voor kinderen van 0 tot 12 jaar." },
  { vraag: "Is het veilig om een tweedehands autostoeltje te kopen?", antwoord: "Vraag altijd of het stoeltje ongevalvrij is, controleer het label (i-Size of R44/04) en of alle onderdelen en de handleiding er zijn. Twijfel je, koop het dan niet." },
  { vraag: "Hoe krijg ik een kinderwagen bij mij thuis?", antwoord: "Je spreekt met de verkoper af hoe jullie het regelen. Meestal haal je grote spullen op, zodat je ze ook meteen kunt bekijken." },
  { vraag: "Kost het iets om accessoires te verkopen?", antwoord: "Nee. Een account, kopen en verkopen is helemaal gratis." },
];

export default function AccessoiresPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Accessoires" pad={PAD} faq={FAQ} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Accessoires"
          eyebrow="Alles voor kinderen van 0 tot 12 jaar"
          titel={<>Tweedehands kinderwagens, autostoeltjes en <span className="text-[#D63D74]">alles voor je kind</span></>}
          usps={USPS}
          beeld={<AccessoireKaart kop="Voor Daan, 8 maanden" label="Maat 74" items={[...VOORBEELDEN]} />}
        />

        <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 sm:pt-[72px] grid md:grid-cols-2 gap-4">
          <Link href="/accessoires/kopen" className={`rounded-[28px] p-6 sm:p-7 bg-white ${SCHADUW} flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5`}>
            <span className="font-headline font-extrabold text-[22px]">Kinderaccessoires kopen</span>
            <span className="text-[#5B4F63]">Kinderwagens, autostoeltjes en speelgoed van andere ouders.</span>
            <span className="font-bold text-[#1C7FA8]">Zo werkt kopen →</span>
          </Link>
          <Link href="/accessoires/verkopen" className={`rounded-[28px] p-6 sm:p-7 bg-white ${SCHADUW} flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5`}>
            <span className="font-headline font-extrabold text-[22px]">Kinderaccessoires verkopen</span>
            <span className="text-[#5B4F63]">Gratis, aan ouders die het nu nodig hebben.</span>
            <span className="font-bold text-[#D63D74]">Zo werkt verkopen →</span>
          </Link>
        </section>

        <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 sm:pt-[72px]">
          <SectieKop links label="Categorieën" titel="Accessoires per categorie" sub="Grote spullen gebruik je maar een korte periode. Bij een andere ouder krijgen ze een tweede leven." />
          <Tegels items={CATEGORIEEN} />
        </section>

        <Sectie>
          <SectieKop label="Veilig tweedehands kopen" titel="Waar let je op?" sub="Bij grote of veiligheidsgevoelige spullen kijk je net iets beter. Met deze checklist ga je goed voorbereid naar de verkoper." />
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {CHECKLIST.map((c) => (
              <div key={c.titel} className={`bg-white rounded-3xl p-6 sm:p-7 ${SCHADUW}`}>
                <h3 className="font-headline font-extrabold text-[19px]">{c.titel}</h3>
                <ul className="mt-3.5 flex flex-col gap-2.5">
                  {c.punten.map((p) => (
                    <li key={p} className="flex gap-2.5 items-start text-[#5B4F63] leading-snug">
                      <Check className="w-5 h-5 shrink-0 text-[#1C7FA8]" strokeWidth={2.5} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Sectie>

        <Sectie>
          <SectieKop label="Zo werkt het" titel="Bekijken, afspreken, ophalen" />
          <Kaarten items={STAPPEN} kolommen="sm:grid-cols-2 lg:grid-cols-4" />
        </Sectie>

        <Faq vragen={FAQ} />
        <AfsluitendeCta titel="Geef spullen een" accent="tweede leven" tekst="Maak gratis een account en vind kinderwagens, autostoeltjes en speelgoed van ouders bij jou in de buurt." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
