import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingPaginaMarker } from "@/components/marketing/MarketingModus";
import { JURIDISCHE_PAGINAS } from "@/components/marketing/JuridischePagina";
import { AfsluitendeCta, Kruimelpad, MarketingFooter, SCHADUW, StructuredData } from "@/components/marketing/Blokken";
import { SITE_URL } from "@/components/marketing/links";

const PAD = "/wettelijk";

export const metadata: Metadata = {
  title: "Wettelijke informatie | Noah & Emma",
  description: "Alle juridische informatie van Noah & Emma op één plek: algemene voorwaarden, privacyverklaring, cookiebeleid, communityrichtlijnen en bedrijfsgegevens.",
  alternates: { canonical: `${SITE_URL}${PAD}` },
};

export default function WettelijkPagina() {
  return (
    <div className="font-body bg-[#FFF9FA] text-[#241A2E] min-h-screen antialiased">
      <MarketingPaginaMarker />
      <StructuredData naam="Wettelijke informatie" pad={PAD} />
      <MarketingHeader />
      <main>
        <section className="bg-gradient-to-r from-[#E4F4FB] via-[#FFF9FA] to-[#FFEAF1]">
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 pt-7 sm:pt-14 pb-10 sm:pb-14">
            <Kruimelpad naam="Wettelijke informatie" />
            <h1 className="font-headline font-extrabold text-[32px] sm:text-[44px] leading-[1.08] tracking-tight">Wettelijke informatie</h1>
            <p className="mt-4 text-lg leading-relaxed text-[#5B4F63] max-w-[60ch]">
              Alle afspraken en regels van Noah &amp; Emma op één plek. Ook zonder account te lezen.
            </p>
          </div>
        </section>

        <div className="max-w-[820px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <ul className="grid sm:grid-cols-2 gap-3">
            {JURIDISCHE_PAGINAS.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className={`block h-full bg-white rounded-2xl p-5 ${SCHADUW} hover:-translate-y-0.5 transition-transform`}>
                  <span className="font-headline font-extrabold text-lg">{p.titel}</span>
                  <span className="block mt-1 text-[15px] text-[#5B4F63]">{p.tekst}</span>
                </Link>
              </li>
            ))}
          </ul>

          <section className={`mt-10 bg-white rounded-3xl p-6 ${SCHADUW}`}>
            <h2 className="font-headline font-extrabold text-[22px] tracking-tight">Bedrijfsgegevens</h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
              <dt className="font-semibold">Naam</dt>
              <dd className="text-[#5B4F63]">Noah &amp; Emma</dd>
              <dt className="font-semibold">Land</dt>
              <dd className="text-[#5B4F63]">Nederland</dd>
              <dt className="font-semibold">E-mail</dt>
              <dd><a href="mailto:info@noah-emma.nl" className="font-semibold text-[#1C7FA8] underline underline-offset-2">info@noah-emma.nl</a></dd>
            </dl>
          </section>
        </div>

        <AfsluitendeCta titel="Zie vandaag nog wat jouw kind" accent="nu past" tekst="Maak gratis een account, stel de maat van je kind in en zie direct kleding en accessoires die passen. Nooit kindergezichten." />
      </main>
      <MarketingFooter />
    </div>
  );
}
