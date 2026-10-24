import type { Metadata } from "next";
import Link from "next/link";
import { Check, UserRound } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SIGNUP_URL, SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AfsluitendeCta, Faq, Groeimodel, Hero, Kaarten, MarketingFooter, PRODUCTEN, SCHADUW, Sectie, SectieKop, StructuredData, type Vraag,
} from "@/components/marketing/Blokken";

const PAD = "/hoe-het-werkt";

export const metadata: Metadata = {
  title: "Hoe werkt het? Kinderkleding kopen en verkopen | Noah & Emma",
  description:
    "Maak gratis een account, stel de maat van je kind in, swipe door het aanbod en spreek af met de verkoper. Onze AI weigert elke foto met een kindergezicht.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Zo werkt Noah & Emma",
    description: "Kopen en verkopen tussen ouders, in de maat die nu past. Gratis account, gratis kopen en gratis verkopen.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const USPS = [
  { kop: "Maak gratis een account", tekst: "en stel de maat van je kind in." },
  { kop: "Swipe door het aanbod", tekst: "in de maat die nu past." },
  { kop: "Neem contact op", tekst: "met de verkoper via de chat." },
  { kop: "Spreek samen af", tekst: "en laat na de deal een review achter." },
];

const KOPEN = [
  { titel: "Maak gratis een account", tekst: "Vul de leeftijd of maat van je kind in. Heb je meer kinderen, voeg ze dan allemaal toe." },
  { titel: "Swipe door het aanbod", tekst: "Naar rechts bewaar je iets, naar links ga je door. Je ziet kleding in de passende maat en accessoires voor de leeftijd van je kind." },
  { titel: "Neem contact op", tekst: "Stuur de verkoper een bericht. Bekijk de reviews van eerdere deals, zodat je weet met wie je te maken hebt." },
  { titel: "Spreek samen af", tekst: "Jullie regelen zelf het ophalen of verzenden en de betaling. Daarna laat je een review achter." },
];

const VERKOPEN = [
  { titel: "Maak een foto van het product", tekst: "Leg kleding plat neer of hang het op. Een kinderwagen of speelgoed fotografeer je los, zonder je kind erbij." },
  { titel: "Onze AI controleert de foto", tekst: "Staat er een gezicht van een kind op, dan wordt de foto geweigerd. Twijfelt de AI, dan kijkt een van ons mee." },
  { titel: "Ouders in die maat zien het", tekst: "Je advertentie verschijnt bij ouders van wie het kind nu die maat of leeftijd heeft." },
  { titel: "Chat en sluit de deal", tekst: "Je spreekt zelf af met de koper. Na de deal geven jullie elkaar een review." },
];

const VERTROUWEN = [
  { titel: "Reviews na elke deal", tekst: "Een review kan alleen na een echte deal. Zo zijn reviews eerlijk en niet te kopen." },
  { titel: "Melden en blokkeren", tekst: "Klopt er iets niet, dan meld je een advertentie of gebruiker met één tik. Ons team kijkt ernaar." },
  { titel: "Elke advertentie gecontroleerd", tekst: "Elke nieuwe advertentie wordt eerst gecontroleerd voordat andere ouders hem zien." },
];

const GRATIS = ["Account maken", "Kopen en verkopen", "Het groeimodel", "Chatten met kopers en verkopers", "Reviews geven en lezen"];
const PREMIUM = ["Gericht zoeken in het aanbod", "AI-zoekassistent", "Meer extra functies"];

const FAQ: Vraag[] = [
  { vraag: "Moet ik betalen om te kopen of verkopen?", antwoord: "Nee. Een account maken, kopen en verkopen is helemaal gratis. Premium is optioneel voor extra functies." },
  { vraag: "Hoe betaal ik de verkoper?", antwoord: "Jullie spreken samen af hoe je betaalt, bijvoorbeeld contant bij het ophalen of via een betaalverzoek." },
  { vraag: "Wat gebeurt er als mijn foto wordt geweigerd?", antwoord: "Je ziet direct waarom. Maak een nieuwe foto van alleen het product, zonder het gezicht van je kind, en probeer het opnieuw." },
  { vraag: "Hoe snel staat mijn advertentie online?", antwoord: "Meestal direct na de controle. Twijfelt de AI, dan kijkt een van ons mee en dat kan iets langer duren." },
  { vraag: "Kan ik een review geven zonder deal?", antwoord: "Nee. Een review kan alleen na een afgeronde deal. Zo blijven reviews eerlijk." },
];

function FotoControle() {
  return (
    <div className="w-full max-w-[360px] flex flex-col gap-3.5">
      <div className={`bg-white rounded-3xl p-4 flex gap-3.5 items-center ${SCHADUW}`}>
        <span className="shrink-0 w-[76px] h-[76px] rounded-2xl bg-gradient-to-br from-[#FFEAF1] to-[#F3E9F0] flex items-center justify-center">
          <UserRound className="w-10 h-10 text-[#D63D74]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span>
          <strong className="block text-[15px]">Foto met kindergezicht</strong>
          <span className="inline-flex mt-2 text-[13px] font-bold text-white bg-[#D63D74] px-3 py-1 rounded-full">✕ Geweigerd</span>
        </span>
      </div>
      <div className={`bg-white rounded-3xl p-4 flex gap-3.5 items-center ${SCHADUW}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PRODUCTEN.tuinbroek.afbeelding} alt="Spijkertuinbroekje, zonder kind op de foto" width={76} height={76} className="shrink-0 w-[76px] h-[76px] rounded-2xl object-cover" />
        <span>
          <strong className="block text-[15px]">Foto van alleen het product</strong>
          <span className="inline-flex mt-2 text-[13px] font-bold text-white bg-[#1C7FA8] px-3 py-1 rounded-full">✓ Goedgekeurd</span>
        </span>
      </div>
      <p className="mx-1.5 mt-1 text-sm text-[#5B4F63] leading-snug">Onze slimme AI controleert elke foto voordat een advertentie live gaat.</p>
    </div>
  );
}

function Stappen({ titel, stappen, kleur }: { titel: string; stappen: { titel: string; tekst: string }[]; kleur: "roze" | "blauw" }) {
  const tekstKleur = kleur === "roze" ? "text-[#D63D74]" : "text-[#1C7FA8]";
  return (
    <div className={`rounded-[28px] p-6 sm:p-8 bg-gradient-to-br to-white ${kleur === "roze" ? "from-[#FFEAF1]" : "from-[#E4F4FB]"}`}>
      <h3 className={`font-headline font-extrabold text-2xl ${tekstKleur}`}>{titel}</h3>
      <ol className="mt-5 flex flex-col gap-5">
        {stappen.map((s, i) => (
          <li key={s.titel} className="flex gap-3.5 items-start">
            <span className={`shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center font-headline font-extrabold ${tekstKleur}`}>{i + 1}</span>
            <span>
              <strong className="block text-[17px]">{s.titel}</strong>
              <span className="text-[#5B4F63] leading-relaxed">{s.tekst}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Lijstje({ punten, kleur }: { punten: string[]; kleur: string }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {punten.map((p) => (
        <li key={p} className="flex gap-2.5 items-start leading-snug">
          <Check className={`w-5 h-5 shrink-0 ${kleur}`} strokeWidth={2.5} aria-hidden="true" />
          {p}
        </li>
      ))}
    </ul>
  );
}

export default function HoeHetWerktPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Hoe het werkt" pad={PAD} faq={FAQ} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Hoe het werkt"
          eyebrow="In 4 stappen"
          titel={<>Zo werkt <span className="text-[#1C7FA8]">Noah</span> &amp; <span className="text-[#D63D74]">Emma</span></>}
          usps={USPS}
          tweedeKnop={{ label: "Lees de vragen", href: "#faq" }}
          beeld={<FotoControle />}
        />

        <Sectie id="stappen">
          <SectieKop label="Stap voor stap" titel="Kopen en verkopen, gewoon tussen ouders" />
          <div className="mt-10 grid lg:grid-cols-2 gap-5">
            <Stappen titel="Kopen" stappen={KOPEN} kleur="blauw" />
            <Stappen titel="Verkopen" stappen={VERKOPEN} kleur="roze" />
          </div>
        </Sectie>

        <Groeimodel titel="Het groeimodel: de maat groeit vanzelf mee" />

        <Sectie>
          <SectieKop label="Vertrouwen" titel="Jij kiest van wie je koopt" sub="Na elke afgeronde deal geven koper en verkoper elkaar een review. Die staan op het profiel. Zo zie je vooraf wie betrouwbaar is." />
          <Kaarten items={VERTROUWEN} />
        </Sectie>

        <Sectie id="gratis">
          <SectieKop label="Gratis of Premium" titel="Gratis is echt gratis" sub="Alles wat je nodig hebt om te kopen en verkopen kost niets. Wil je meer, dan kies je zelf voor Premium." />
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <div className={`bg-white rounded-3xl p-7 sm:p-8 border-2 border-[#1C7FA8] ${SCHADUW}`}>
              <div className="flex justify-between items-baseline gap-3">
                <h3 className="font-headline font-extrabold text-2xl">Gratis</h3>
                <span className="font-headline font-extrabold text-[28px] text-[#1C7FA8]">€ 0</span>
              </div>
              <p className="mt-1.5 mb-5 text-[#5B4F63]">Voor iedereen, altijd.</p>
              <Lijstje punten={GRATIS} kleur="text-[#1C7FA8]" />
              <Link href={SIGNUP_URL} className="mt-6 inline-flex w-full sm:w-auto items-center justify-center min-h-[52px] px-7 rounded-full bg-[#241A2E] text-white font-bold">
                Maak gratis een account
              </Link>
            </div>
            <div className="rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-[#FFEAF1] to-white">
              <h3 className="font-headline font-extrabold text-2xl">Premium</h3>
              <p className="mt-1.5 mb-5 text-[#5B4F63]">Optioneel, voor wie meer wil.</p>
              <Lijstje punten={PREMIUM} kleur="text-[#D63D74]" />
              <p className="mt-5 text-sm text-[#5B4F63]">Premium kies je later in de app. Nodig is het niet.</p>
            </div>
          </div>
        </Sectie>

        <Faq vragen={FAQ} />
        <AfsluitendeCta titel="Probeer het zelf," accent="in twee minuten" tekst="Maak gratis een account, stel de maat van je kind in en swipe meteen door het aanbod." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
