import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingPaginaMarker } from "@/components/marketing/MarketingModus";
import { AfsluitendeCta, Kruimelpad, MarketingFooter, SCHADUW, StructuredData } from "@/components/marketing/Blokken";
import { JuridischeTekst, anker } from "@/components/JuridischeTekst";
import { JURIDISCHE_DOCUMENTEN, type JuridischDocument } from "@/lib/juridischeTeksten";

// Websiteversie van de juridische pagina's (privacy, voorwaarden, cookies,
// community). Ook zonder account te lezen, in de huisstijl van de site. De
// teksten zelf staan in src/lib/juridischeTeksten.ts; de app toont dezelfde
// teksten onder /instellingen/juridisch.

export const JURIDISCHE_PAGINAS = JURIDISCHE_DOCUMENTEN.map((d) => ({ titel: d.naam, tekst: d.kort, href: d.pad }));

export function JuridischePagina({ inhoud, extra }: { inhoud: JuridischDocument; extra?: React.ReactNode }) {
  const { naam, pad, titel, intro, datum, secties } = inhoud;
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
                <JuridischeTekst tekst={s.tekst} tekstKlasse="text-[#3F3447]" bolletjeKlasse="bg-[#D63D74]" />
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
