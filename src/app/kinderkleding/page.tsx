import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SIGNUP_URL, SITE_URL } from "@/components/marketing/links";
import {
  AfsluitendeCta, Faq, Groeimodel, Hero, MarketingFooter, PRODUCTEN, SCHADUW, Sectie, SectieKop, StructuredData, SwipeKaart, Tegels, type Vraag,
} from "@/components/marketing/Blokken";

const PAD = "/kinderkleding";

export const metadata: Metadata = {
  title: "Tweedehands kinderkleding maat 50 tot 164 | Noah & Emma",
  description:
    "Tweedehands kinderkleding voor jongens en meisjes van 0 tot 12 jaar, altijd in de maat die nu past. Het groeimodel schuift vanzelf mee. Gratis kopen en verkopen.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Tweedehands kinderkleding, altijd in de maat die nu past | Noah & Emma",
    description: "Kleding van maat 50 tot 158/164 van ouders uit de buurt. Gratis account, gratis kopen en gratis verkopen.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [{ url: PRODUCTEN.jurkje.afbeelding, alt: PRODUCTEN.jurkje.alt }],
  },
};

const USPS = [
  { kop: "Groeit mee met je kind.", tekst: "Stel één keer de maat in, de app schuift vanzelf mee." },
  { kop: "Van baby tot basisschool.", tekst: "Van maat 50 tot 158/164, voor jongens en meisjes." },
  { kop: "Nooit kindergezichten.", tekst: "Onze slimme AI weigert elke foto met het gezicht van een kind." },
  { kop: "Helemaal gratis.", tekst: "Gratis account, gratis kopen en gratis verkopen." },
];

// Maatbereiken volgen schatMaatOpLeeftijd in src/lib/groei.ts
const LEEFTIJDEN = [
  { label: "0 tot 1 jaar", titel: "Baby", maten: "Maat 50 tot 80", sub: "Rompers, boxpakjes, slaapzakken" },
  { label: "1 tot 4 jaar", titel: "Dreumes en peuter", maten: "Maat 86 tot 104", sub: "Broekjes, truien, jasjes" },
  { label: "4 tot 6 jaar", titel: "Kleuter", maten: "Maat 110 tot 116", sub: "Jurkjes, joggingbroeken, regenjassen" },
  { label: "6 tot 12 jaar", titel: "Basisschool", maten: "Maat 122 tot 152", sub: "Jeans, hoodies, sportkleding" },
];

const SOORTEN = [
  { naam: "Jassen", sub: "Winterjas, regenjas, zomerjas" },
  { naam: "Broeken", sub: "Jeans, joggers, korte broeken" },
  { naam: "Truien en vesten", sub: "Gebreid, hoodies, fleece" },
  { naam: "Jurken en rokjes", sub: "Voor elke dag en feestjes" },
  { naam: "Babykleding", sub: "Rompers, boxpakjes, slaapzakken" },
  { naam: "Pyjama's", sub: "Ook onesies en badjassen" },
  { naam: "Schoenen", sub: "Sneakers, laarzen, sloffen" },
  { naam: "Zwemkleding", sub: "Badpakken, zwembroeken, UV-shirts" },
];

const FAQ: Vraag[] = [
  { vraag: "Welke maten kinderkleding vind ik op Noah & Emma?", antwoord: "Van maat 50 (pasgeboren) tot en met 158/164 (ongeveer 12 jaar), voor jongens en meisjes." },
  { vraag: "Hoe weet ik welke maat mijn kind nu heeft?", antwoord: "Je stelt in je account de leeftijd of maat van je kind in. Het groeimodel schuift de maat daarna vanzelf mee. Een kind van 1 jaar draagt meestal maat 80, met 2 jaar maat 92." },
  { vraag: "Waarom zie ik pas kleding als ik een account heb?", antwoord: "In je account staat de maat van je kind. Zo laten we je alleen kleding zien die nu past. Een account is gratis." },
  { vraag: "Kan ik ook kinderkleding verkopen?", antwoord: "Ja, gratis. Maak een foto van alleen de kleding, zonder je kind erop. Onze AI weigert elke foto met een kindergezicht." },
];

export default function KinderkledingPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Kinderkleding" pad={PAD} faq={FAQ} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Kinderkleding"
          eyebrow="Maat 50 tot 158/164"
          titel={<>Tweedehands kinderkleding, <span className="text-[#D63D74]">altijd in de maat die nu past</span></>}
          usps={USPS}
          beeld={<SwipeKaart product={PRODUCTEN.jurkje} />}
        />

        <Sectie>
          <SectieKop label="Kies op leeftijd" titel="Kinderkleding per leeftijd" sub="Je kind groeit de eerste jaren door bijna twintig maten heen. In je account kies je één keer de leeftijd, daarna zie je steeds de maat die past." />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LEEFTIJDEN.map((l, i) => (
              <Link key={l.titel} href={SIGNUP_URL} className={`bg-white rounded-3xl p-6 ${SCHADUW} flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5`}>
                <span className={`text-xs font-bold tracking-[0.1em] uppercase ${i % 2 === 0 ? "text-[#1C7FA8]" : "text-[#D63D74]"}`}>{l.label}</span>
                <span className="font-headline font-extrabold text-[22px]">{l.titel}</span>
                <span className="font-bold">{l.maten}</span>
                <span className="text-sm text-[#5B4F63]">{l.sub}</span>
              </Link>
            ))}
          </div>
        </Sectie>

        <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 grid md:grid-cols-2 gap-4">
          <Link href={SIGNUP_URL} className="rounded-[28px] p-7 min-h-[150px] flex flex-col justify-between gap-2 bg-gradient-to-br from-[#FFEAF1] to-white">
            <span className="font-headline font-extrabold text-[26px]">Meisjeskleding</span>
            <span className="text-[#5B4F63]">Jurken, rokjes, leggings, vesten en jassen</span>
            <span className="font-bold text-[#D63D74]">Bekijk meisjeskleding →</span>
          </Link>
          <Link href={SIGNUP_URL} className="rounded-[28px] p-7 min-h-[150px] flex flex-col justify-between gap-2 bg-gradient-to-br from-[#E4F4FB] to-white">
            <span className="font-headline font-extrabold text-[26px]">Jongenskleding</span>
            <span className="text-[#5B4F63]">Broeken, shirts, hoodies, pyjama&apos;s en jassen</span>
            <span className="font-bold text-[#1C7FA8]">Bekijk jongenskleding →</span>
          </Link>
        </section>

        <Sectie>
          <SectieKop label="Soorten kleding" titel="Wat zoek je?" />
          <Tegels items={SOORTEN} />
        </Sectie>

        <Groeimodel />

        <Sectie className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-headline font-extrabold text-2xl sm:text-[30px] leading-tight">Waarom tweedehands kinderkleding?</h2>
            <p className="mt-3.5 text-[#5B4F63] leading-relaxed">
              Een baby groeit het eerste jaar door zes maten heen. Veel kleding wordt maar een paar weken gedragen en is daarna nog zo goed als nieuw. Tweedehands kopen scheelt geld en er hoeft minder nieuw gemaakt te worden.
            </p>
          </div>
          <div>
            <h2 className="font-headline font-extrabold text-2xl sm:text-[30px] leading-tight">Zo kies je de goede staat</h2>
            <ul className="mt-3.5 pl-5 list-disc text-[#5B4F63] leading-relaxed space-y-1">
              <li><strong className="text-[#241A2E]">Nieuw met label:</strong> nooit gedragen.</li>
              <li><strong className="text-[#241A2E]">Zo goed als nieuw:</strong> een paar keer gedragen, geen gebreken.</li>
              <li><strong className="text-[#241A2E]">Goed:</strong> zichtbaar gedragen, nog prima te gebruiken.</li>
            </ul>
          </div>
        </Sectie>

        <Faq vragen={FAQ} />
        <AfsluitendeCta titel="Vind kleding die jouw kind" accent="nu past" tekst="Maak gratis een account, stel de maat van je kind in en zie direct kleding van andere ouders in die maat." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
