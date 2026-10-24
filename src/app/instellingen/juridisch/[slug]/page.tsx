import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { JURIDISCHE_DOCUMENTEN } from "@/lib/juridischeTeksten";
import { JuridischeTekst } from "@/components/JuridischeTekst";
import { SITE_URL } from "@/components/marketing/links";
import { AppKop } from "../AppKop";

// Appversie van /voorwaarden, /privacy, /cookies en /community: dezelfde
// tekst als op de website, maar in de app-opmaak en binnen de app.
type Props = { params: Promise<{ slug: string }> };

const zoek = (slug: string) => JURIDISCHE_DOCUMENTEN.find((d) => d.slug === slug);

export function generateStaticParams() {
  return JURIDISCHE_DOCUMENTEN.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const inhoud = zoek((await params).slug);
  if (!inhoud) return {};
  return {
    title: `${inhoud.naam} | Noah & Emma`,
    alternates: { canonical: `${SITE_URL}${inhoud.pad}` },
    robots: { index: false },
  };
}

export default async function AppJuridischDocument({ params }: Props) {
  const inhoud = zoek((await params).slug);
  if (!inhoud) notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-32">
      <AppKop titel={inhoud.naam} />

      <main className="px-5 pt-5">
        <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">{inhoud.intro}</p>
        <p className="mt-2 text-xs font-semibold text-slate-400">{inhoud.datum}</p>
        {inhoud.slug === "cookies" && (
          <Link href="/voorkeuren" className="mt-4 inline-flex items-center min-h-[44px] px-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold">
            Cookievoorkeuren aanpassen
          </Link>
        )}

        {inhoud.secties.map((s) => (
          <section key={s.titel} className="pt-7">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{s.titel}</h2>
            <div className="mt-2 text-[15px]">
              <JuridischeTekst tekst={s.tekst} tekstKlasse="text-slate-600 dark:text-slate-300" bolletjeKlasse="bg-primary" />
            </div>
          </section>
        ))}

        <section className="pt-10">
          <h2 className="text-sm font-bold text-slate-400">Andere juridische informatie</h2>
          <div className="mt-2 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden">
            {JURIDISCHE_DOCUMENTEN.filter((d) => d.slug !== inhoud.slug).map((d, i) => (
              <Link key={d.slug} href={`/instellingen/juridisch/${d.slug}`}
                className={`flex items-center justify-between px-4 py-3.5 active:bg-slate-100 dark:active:bg-slate-700 ${i > 0 ? "border-t border-slate-100 dark:border-slate-700" : ""}`}>
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{d.naam}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Vragen? Mail naar <a href="mailto:info@noah-emma.nl" className="font-semibold text-primary">info@noah-emma.nl</a> of bekijk de <Link href="/faq" className="font-semibold text-primary">veelgestelde vragen</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}
