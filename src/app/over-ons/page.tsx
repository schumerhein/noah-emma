import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { NoahFace, EmmaFace } from "@/components/ai-models/NoahEmmaFaces";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { StickyCta } from "@/components/marketing/StickyCta";
import { SITE_URL, OG_AFBEELDING } from "@/components/marketing/links";
import {
  AfsluitendeCta, Hero, Kaarten, MarketingFooter, SCHADUW, Sectie, SectieKop, StructuredData,
} from "@/components/marketing/Blokken";

const PAD = "/over-ons";

export const metadata: Metadata = {
  title: "Over ons: tweedehands zonder kindergezichten | Noah & Emma",
  description:
    "De app voor vaders en moeders van kinderen van 0 tot 12 jaar: tweedehands kleding en accessoires, altijd in de juiste maat en zonder kindergezichten.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
  openGraph: {
    title: "Over Noah & Emma",
    description: "Tweedehands voor je kind, zonder je kind online te zetten.",
    url: `${SITE_URL}${PAD}`,
    siteName: "Noah & Emma",
    locale: "nl_NL",
    type: "website",
    images: [OG_AFBEELDING],
  },
};

const BELOFTES = [
  { titel: "Privacy by design", tekst: "Kinderen horen niet online in een advertentie. Daarom weigert onze AI elke foto met het gezicht van een kind. Zonder uitzondering." },
  { titel: "Gratis voor iedereen", tekst: "Tweedehands kopen moet makkelijk en goedkoop zijn. Een account, kopen en verkopen is daarom gratis." },
  { titel: "Van ouders, voor ouders", tekst: "Geen winkel, maar ouders die spullen doorgeven. Jullie spreken samen af en geven elkaar een review." },
  { titel: "Minder nieuw, meer hergebruik", tekst: "Kinderen groeien snel. Wat bij jou te klein is, past een ander kind precies. Zo hoeft er minder nieuw gemaakt te worden." },
];

const REVIEWS = [
  { quote: "Binnen een dag verkocht en ik hoefde geen foto van mijn dochter te posten. Precies wat ik zocht.", naam: "Lotte", context: "moeder van 2, Utrecht" },
  { quote: "Onze zoon groeit zo hard dat de helft van zijn kast nog het prijskaartje heeft. Nu verkoop ik het door voor hij het draagt.", naam: "Rik", context: "vader van 3, Rotterdam" },
  { quote: "Swipen door de buurt voelt echt als shoppen. Heerlijk simpel.", naam: "Sanne", context: "moeder van 1, Groningen" },
];

function Gezichten() {
  return (
    <div className="relative w-[300px] max-w-full h-[300px]" aria-hidden="true">
      <div className="absolute inset-5 rounded-full bg-gradient-to-br from-[#E4F4FB] to-[#FFEAF1]" />
      <div className="absolute left-2.5 top-[70px] w-40 h-40 rounded-full overflow-hidden border-[6px] border-white shadow-[0_30px_60px_-24px_rgba(36,26,46,0.45)]"><NoahFace size={148} /></div>
      <div className="absolute right-2.5 top-[50px] w-[170px] h-[170px] rounded-full overflow-hidden border-[6px] border-white shadow-[0_30px_60px_-24px_rgba(36,26,46,0.45)]"><EmmaFace size={158} /></div>
    </div>
  );
}

export default function OverOnsPage() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <StructuredData naam="Over ons" pad={PAD} />
      <MarketingHeader />
      <main>
        <Hero
          naam="Over ons"
          eyebrow="Over Noah & Emma"
          titel={<>Tweedehands voor je kind, <span className="text-[#D63D74]">zonder je kind online te zetten</span></>}
          intro="Noah & Emma is een app voor vaders en moeders van kinderen van 0 tot 12 jaar. Je koopt en verkoopt kleding en accessoires, altijd in de maat die nu past, en zonder ooit een kindergezicht te tonen."
          beeld={<Gezichten />}
        />

        <Sectie className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          <div className="flex-1 min-w-0">
            <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase">Ons verhaal</span>
            <h2 className="mt-2.5 font-headline font-extrabold text-[28px] sm:text-[38px] leading-tight tracking-tight">Waarom we Noah &amp; Emma zijn begonnen</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#5B4F63]">
              Wie kinderkleding verkoopt, ziet het vaak: een foto van een kind in de kleding die te koop is. Dat helpt bij de verkoop, maar zo staat je kind online, bij mensen die je niet kent.
            </p>
            <p className="mt-3 text-[17px] leading-relaxed text-[#5B4F63]">
              Wij vonden dat het anders moest. Daarom bouwden we een app waarin geen enkel kindergezicht te zien is, en waarin je zonder zoeken ziet wat je kind nu past.
            </p>
          </div>
          <figure className={`flex-1 min-w-0 w-full bg-white rounded-3xl p-7 sm:p-8 ${SCHADUW}`}>
            <blockquote className="font-headline font-extrabold text-[22px] leading-snug">
              &ldquo;Ik wil dat ouders makkelijk spullen kunnen doorgeven, zonder dat hun kind daarvoor online moet.&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3.5">
              <Image src="/images/hein-schumer.jpg" alt="Hein Schumer" width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
              <span>
                <strong className="block">Hein Schumer</strong>
                <span className="text-sm text-[#5B4F63]">Oprichter van Noah &amp; Emma</span>
              </span>
            </figcaption>
          </figure>
        </Sectie>

        <Sectie>
          <SectieKop label="Waar we voor staan" titel="Onze vier beloftes" />
          <Kaarten items={BELOFTES} kolommen="sm:grid-cols-2 lg:grid-cols-4" />
        </Sectie>

        <Sectie>
          <div className="rounded-[32px] bg-gradient-to-br from-[#E4F4FB] to-[#FFEAF1] p-6 sm:p-12 flex flex-col sm:flex-row gap-6 sm:gap-12 items-start sm:items-center">
            <span className="flex shrink-0" aria-hidden="true">
              <span className="w-24 h-24 rounded-full overflow-hidden border-4 border-white"><NoahFace size={88} /></span>
              <span className="w-24 h-24 rounded-full overflow-hidden border-4 border-white -ml-4"><EmmaFace size={88} /></span>
            </span>
            <div>
              <h2 className="font-headline font-extrabold text-2xl sm:text-[30px]">Wie zijn Noah en Emma?</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-[#5B4F63]">
                Noah en Emma zijn onze getekende gezichten. Ze staan voor alle kinderen die we beschermen. Je ziet ze in de app, zodat er nooit een echt kind in beeld hoeft.
              </p>
            </div>
          </div>
        </Sectie>

        <Sectie>
          <SectieKop label="Wat ouders zeggen" titel="Ouders over Noah & Emma" />
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

        <Sectie>
          <div className={`bg-white rounded-3xl p-6 sm:p-9 grid sm:grid-cols-2 gap-6 ${SCHADUW}`}>
            <div>
              <h2 className="font-headline font-extrabold text-[17px]">Contact</h2>
              <a href="mailto:info@noah-emma.nl" className="mt-1.5 inline-block font-semibold text-[#1C7FA8] underline underline-offset-2">info@noah-emma.nl</a>
            </div>
            <div>
              <h2 className="font-headline font-extrabold text-[17px]">Hulp nodig?</h2>
              <Link href="/helpcentrum" className="mt-1.5 inline-block font-semibold text-[#1C7FA8] underline underline-offset-2">Naar de veelgestelde vragen</Link>
            </div>
          </div>
        </Sectie>

        <AfsluitendeCta titel="Doe mee met ouders die" accent="slim doorgeven" tekst="Maak gratis een account. Koop en verkoop kleding en accessoires, zonder ooit een kindergezicht te tonen." />
      </main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
