import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingPaginaMarker } from "@/components/marketing/MarketingModus";
import { AfsluitendeCta, Kruimelpad, MarketingFooter, SCHADUW, StructuredData } from "@/components/marketing/Blokken";

// Websiteversie van de juridische pagina's (privacy, voorwaarden, cookies,
// community). Ook zonder account te lezen, in de huisstijl van de site.

export interface JuridischeSectie {
  titel: string;
  tekst: string;
}

export const JURIDISCHE_PAGINAS = [
  { titel: "Algemene voorwaarden", tekst: "De regels voor kopen en verkopen via Noah & Emma.", href: "/voorwaarden" },
  { titel: "Privacyverklaring", tekst: "Hoe we jouw gegevens verwerken en beschermen.", href: "/privacy" },
  { titel: "Cookiebeleid", tekst: "Welke cookies we gebruiken en waarom.", href: "/cookies" },
  { titel: "Communityrichtlijnen", tekst: "Gedragsregels voor een veilige plek voor ouders.", href: "/community" },
];

const anker = (titel: string) =>
  titel.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Zet platte tekst om in alinea's en opsommingen (regels die met "• " beginnen). */
function Tekst({ tekst }: { tekst: string }) {
  return (
    <>
      {tekst.split(/\n\s*\n/).map((blok, i) => {
        const regels = blok.split("\n").map((r) => r.trim()).filter(Boolean);
        const punten = regels.filter((r) => r.startsWith("•"));
        const kop = regels.filter((r) => !r.startsWith("•"));
        return (
          <div key={i} className="mt-4 first:mt-0">
            {kop.map((r, j) => <p key={j} className="leading-relaxed text-[#3F3447]">{r}</p>)}
            {punten.length > 0 && (
              <ul className="mt-2 flex flex-col gap-2">
                {punten.map((r, j) => (
                  <li key={j} className="flex gap-2.5 leading-relaxed text-[#3F3447]">
                    <span aria-hidden="true" className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#D63D74] shrink-0" />
                    <span>{r.replace(/^•\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}

export function JuridischePagina({
  naam,
  pad,
  titel,
  intro,
  datum,
  secties,
  extra,
}: {
  naam: string;
  pad: string;
  titel: string;
  intro: string;
  datum: string;
  secties: JuridischeSectie[];
  extra?: React.ReactNode;
}) {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <MarketingPaginaMarker />
      <StructuredData naam={naam} pad={pad} />
      <MarketingHeader />
      <main>
        <section className="bg-gradient-to-r from-[#E4F4FB] via-[#FFF9FA] to-[#FFEAF1]">
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 pt-7 sm:pt-14 pb-10 sm:pb-14">
            <Kruimelpad naam={naam} />
            <h1 className="font-headline font-extrabold text-[32px] sm:text-[44px] leading-[1.08] tracking-tight">{titel}</h1>
            <p className="mt-4 text-lg leading-relaxed text-[#5B4F63] max-w-[60ch]">{intro}</p>
            <p className="mt-3 text-sm font-semibold text-[#5B4F63]">{datum}</p>
            {extra && <div className="mt-5">{extra}</div>}
          </div>
        </section>

        <div className="max-w-[820px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <nav aria-label="Op deze pagina" className={`bg-white rounded-3xl p-5 sm:p-6 ${SCHADUW}`}>
            <p className="font-headline font-extrabold">Op deze pagina</p>
            <ol className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {secties.map((s) => (
                <li key={s.titel}>
                  <a href={`#${anker(s.titel)}`} className="flex items-center min-h-[40px] text-[15px] font-semibold text-[#1C7FA8] hover:underline underline-offset-2">{s.titel}</a>
                </li>
              ))}
            </ol>
          </nav>

          {secties.map((s) => (
            <section key={s.titel} id={anker(s.titel)} className="scroll-mt-24 pt-10 sm:pt-12">
              <h2 className="font-headline font-extrabold text-[22px] sm:text-[26px] tracking-tight">{s.titel}</h2>
              <div className="mt-3 text-[16px]">
                <Tekst tekst={s.tekst} />
              </div>
            </section>
          ))}

          <section className="pt-14">
            <h2 className="font-headline font-extrabold text-[22px] sm:text-[26px] tracking-tight">Andere juridische informatie</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3">
              {JURIDISCHE_PAGINAS.filter((p) => p.href !== pad).map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={`block h-full bg-white rounded-2xl p-5 ${SCHADUW} hover:-translate-y-0.5 transition-transform`}>
                    <span className="font-bold">{p.titel}</span>
                    <span className="block mt-1 text-sm text-[#5B4F63]">{p.tekst}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[#5B4F63]">
              Vragen? Mail naar <a href="mailto:info@noah-emma.nl" className="font-semibold text-[#1C7FA8] underline underline-offset-2">info@noah-emma.nl</a> of bekijk de <Link href="/veelgestelde-vragen" className="font-semibold text-[#1C7FA8] underline underline-offset-2">veelgestelde vragen</Link>.
            </p>
          </section>
        </div>

        <AfsluitendeCta titel="Zie vandaag nog wat jouw kind" accent="nu past" tekst="Maak gratis een account, stel de maat van je kind in en zie direct kleding en accessoires die passen. Nooit kindergezichten." />
      </main>
      <MarketingFooter />
    </div>
  );
}
