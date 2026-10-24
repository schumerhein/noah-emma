import type { Metadata } from "next";
import Link from "next/link";
import { Check, Search } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AfsluitendeCta, Faq, Kruimelpad, MarketingFooter, SCHADUW, Sectie, SectieKop, StructuredData, type Vraag,
} from "@/components/marketing/Blokken";

const PAD = "/helpcentrum";

export const metadata: Metadata = {
  title: "Veelgestelde vragen en hulp | Noah & Emma",
  description:
    "Antwoorden op je vragen over Noah & Emma: account, kopen, verkopen, het groeimodel, de AI-fotocontrole, reviews en veilig afspreken.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Veelgestelde vragen en hulp | Noah & Emma",
    description: "Antwoorden over je account, kopen, verkopen, het groeimodel en veilig afspreken.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const ONDERWERPEN = [
  { id: "account", naam: "Account en aanmelden", sub: "Registreren, inloggen, gratis" },
  { id: "kopen", naam: "Kopen", sub: "Contact opnemen, afspreken, betalen" },
  { id: "verkopen", naam: "Verkopen", sub: "Advertentie plaatsen, verkocht" },
  { id: "groeimodel", naam: "Groeimodel en maten", sub: "Maat instellen, meerdere kinderen" },
  { id: "fotos", naam: "Foto's en AI-controle", sub: "Waarom een foto geweigerd wordt" },
  { id: "reviews", naam: "Reviews", sub: "Review geven na een deal" },
  { id: "veiligheid", naam: "Veiligheid en melden", sub: "Melden, blokkeren, veilig afspreken" },
  { id: "premium", naam: "Premium", sub: "Extra functies" },
] as const;

type Onderwerp = (typeof ONDERWERPEN)[number]["id"];

const VRAGEN: (Vraag & { onderwerp: Onderwerp; populair?: boolean })[] = [
  { onderwerp: "account", populair: true, vraag: "Is Noah & Emma gratis?", antwoord: "Ja. Een account, kopen en verkopen is helemaal gratis. Premium is optioneel voor extra functies." },
  { onderwerp: "account", vraag: "Waarom heb ik een account nodig om producten te zien?", antwoord: "In je account stel je de leeftijd of maat van je kind in. Daardoor laten we je alleen aanbod zien dat nu past." },
  { onderwerp: "account", vraag: "Ik ben mijn wachtwoord vergeten. Wat nu?", antwoord: "Kies bij het inloggen voor 'Wachtwoord vergeten'. Je krijgt dan een mail om een nieuw wachtwoord in te stellen." },
  { onderwerp: "kopen", populair: true, vraag: "Hoe betaal ik en hoe krijg ik mijn aankoop?", antwoord: "Je spreekt dat samen met de verkoper af via de chat. Bijvoorbeeld ophalen en contant betalen, of verzenden met een betaalverzoek." },
  { onderwerp: "kopen", vraag: "Hoe neem ik contact op met een verkoper?", antwoord: "Open de advertentie en stuur de verkoper een bericht. Je kunt ook een bod doen." },
  { onderwerp: "verkopen", vraag: "Hoe plaats ik een advertentie?", antwoord: "Tik in de app op Uploaden, maak een foto van het product, kies de maat en de staat en plaats je advertentie. Het is gratis." },
  { onderwerp: "verkopen", vraag: "Hoe snel staat mijn advertentie online?", antwoord: "Meestal direct na de controle. Twijfelt de AI, dan kijkt een van ons mee en dat kan iets langer duren." },
  { onderwerp: "groeimodel", populair: true, vraag: "Hoe stel ik de maat van mijn kind in?", antwoord: "Ga in de app naar je profiel en kies je kind. Vul de geboortedatum of maat in. Daarna groeit de maat vanzelf mee." },
  { onderwerp: "groeimodel", vraag: "Ik heb meerdere kinderen. Werkt dat ook?", antwoord: "Ja. Je voegt elk kind toe met de eigen leeftijd of maat. Met één tik wissel je, en je ziet direct wat bij dat kind past." },
  { onderwerp: "fotos", populair: true, vraag: "Waarom is mijn foto geweigerd?", antwoord: "Onze AI weigert elke foto waarop het gezicht van een kind te zien is. Maak een nieuwe foto van alleen het product en probeer het opnieuw." },
  { onderwerp: "reviews", populair: true, vraag: "Wanneer kan ik een review geven?", antwoord: "Zodra de verkoper de deal heeft afgerond. Als koper kun je ook melden dat je iets hebt gekocht, de verkoper bevestigt dat dan." },
  { onderwerp: "veiligheid", populair: true, vraag: "Hoe meld of blokkeer ik iemand?", antwoord: "Open de advertentie of het profiel en tik op Melden of Blokkeren. Ons team bekijkt elke melding." },
  { onderwerp: "premium", vraag: "Wat krijg ik met Premium?", antwoord: "Premium geeft extra functies, zoals gericht zoeken in het aanbod en de AI-zoekassistent. Kopen en verkopen blijft ook zonder Premium gratis." },
];

const VEILIG = [
  { kop: "Bekijk eerst de reviews.", tekst: "Zo zie je hoe eerdere deals gingen." },
  { kop: "Houd contact in de chat.", tekst: "Dan staat alles wat jullie afspreken op één plek." },
  { kop: "Spreek af op een vertrouwde plek.", tekst: "Bij grote spullen bekijk je ze eerst." },
  { kop: "Betaal pas als je het hebt gezien.", tekst: "Of als je zeker weet met wie je handelt." },
];

export default async function HelpcentrumPage({ searchParams }: { searchParams: Promise<{ q?: string; onderwerp?: string }> }) {
  const { q = "", onderwerp } = await searchParams;
  const zoekterm = q.trim().toLowerCase();
  const gekozen = ONDERWERPEN.find((o) => o.id === onderwerp);

  let vragen = VRAGEN.filter((v) => v.populair);
  let titel = "Meest gestelde vragen";
  if (zoekterm) {
    vragen = VRAGEN.filter((v) => `${v.vraag} ${v.antwoord}`.toLowerCase().includes(zoekterm));
    titel = vragen.length ? `Resultaten voor "${q.trim()}"` : `Geen resultaten voor "${q.trim()}"`;
  } else if (gekozen) {
    vragen = VRAGEN.filter((v) => v.onderwerp === gekozen.id);
    titel = gekozen.naam;
  }

  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Veelgestelde vragen" pad={PAD} faq={VRAGEN.filter((v) => v.populair)} />
      <MarketingHeader />
      <main>
        <section className="bg-gradient-to-r from-[#E4F4FB] via-[#FFF9FA] to-[#FFEAF1]">
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 pt-7 sm:pt-16 pb-10 sm:pb-16 text-center">
            <Kruimelpad naam="Veelgestelde vragen" center />
            <h1 className="font-headline font-extrabold text-[34px] sm:text-[52px] leading-[1.06] tracking-tight">
              Veelgestelde vragen en <span className="text-[#D63D74]">hulp</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-[48ch] text-[17px] leading-relaxed text-[#5B4F63]">
              Hoe kunnen we helpen? Zoek je vraag of kies een onderwerp. Staat het er niet bij, dan helpen we je persoonlijk.
            </p>
            <form id="hero-cta" role="search" action={`${PAD}#vragen`} className={`mx-auto mt-6 max-w-[560px] flex items-center gap-2.5 bg-white rounded-full pl-5 pr-1.5 py-1.5 border border-[#241A2E]/10 ${SCHADUW}`}>
              <Search className="w-5 h-5 shrink-0 text-[#5B4F63]" aria-hidden="true" />
              <label htmlFor="zoek-help" className="sr-only">Zoek in de veelgestelde vragen</label>
              <input
                id="zoek-help"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Bijvoorbeeld: foto geweigerd"
                className="flex-1 min-w-0 bg-transparent outline-none text-base min-h-[44px] placeholder:text-[#5B4F63]/70"
              />
              <button type="submit" className="shrink-0 min-h-[48px] px-5 rounded-full bg-[#241A2E] text-white font-bold">Zoeken</button>
            </form>
          </div>
        </section>

        <section className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
          <SectieKop links titel="Kies een onderwerp" />
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3">
            {ONDERWERPEN.map((o, i) => (
              <Link
                key={o.id}
                href={`${PAD}?onderwerp=${o.id}#vragen`}
                aria-current={gekozen?.id === o.id ? "true" : undefined}
                className={`rounded-[20px] p-5 min-h-[112px] flex flex-col justify-between gap-2.5 transition-transform hover:-translate-y-0.5 ${i % 2 === 0 ? "bg-[#FFEAF1]" : "bg-[#E4F4FB]"} ${gekozen?.id === o.id ? "ring-2 ring-[#241A2E]" : ""}`}
              >
                <span className="font-headline font-extrabold text-[17px] leading-tight">{o.naam}</span>
                <span className="text-[13px] leading-snug text-[#5B4F63]">{o.sub}</span>
              </Link>
            ))}
          </div>
        </section>

        <div id="vragen" className="scroll-mt-20">
          <Faq vragen={vragen} titel={titel} />
          {(zoekterm || gekozen) && (
            <p className="text-center mt-5">
              <Link href={`${PAD}#vragen`} className="font-semibold text-[#1C7FA8] underline underline-offset-2">Toon de meest gestelde vragen</Link>
            </p>
          )}
        </div>

        <Sectie>
          <div className="rounded-[32px] bg-gradient-to-br from-[#E4F4FB] to-white p-6 sm:p-11">
            <SectieKop links label="Veilig handelen" titel="Zo spreek je veilig af" />
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-7 gap-y-3.5">
              {VEILIG.map((v) => (
                <li key={v.kop} className="flex gap-3 items-start leading-snug">
                  <Check className="w-6 h-6 shrink-0 text-[#1C7FA8]" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong>{v.kop}</strong> <span className="text-[#5B4F63]">{v.tekst}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </Sectie>

        <Sectie className="grid md:grid-cols-2 gap-5">
          <div className={`bg-white rounded-3xl p-7 ${SCHADUW}`}>
            <h2 className="font-headline font-extrabold text-[22px]">Staat je vraag er niet bij?</h2>
            <p className="mt-2.5 mb-5 text-[#5B4F63] leading-relaxed">Stuur ons een mail. We reageren meestal binnen één werkdag.</p>
            <a href="mailto:info@noah-emma.nl" className="inline-flex w-full sm:w-auto items-center justify-center min-h-[52px] px-7 rounded-full bg-[#241A2E] text-white font-bold">
              Mail info@noah-emma.nl
            </a>
          </div>
          <div className={`bg-white rounded-3xl p-7 ${SCHADUW}`}>
            <h2 className="font-headline font-extrabold text-[22px]">Hulp bij een deal</h2>
            <p className="mt-2.5 mb-5 text-[#5B4F63] leading-relaxed">Gaat er iets mis met een koper of verkoper? Log in en kies de deal in de helpdesk, dan kijken we mee.</p>
            <Link href="/helpdesk" className="font-bold text-[#1C7FA8] underline underline-offset-2">Naar de helpdesk in de app</Link>
          </div>
        </Sectie>

        <AfsluitendeCta titel="Nog geen account?" accent="Begin gratis" tekst="Maak in twee minuten een account, stel de maat van je kind in en ontdek wat andere ouders aanbieden." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
