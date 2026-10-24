import Link from "next/link";
import { ArrowRight, Check, Heart, X } from "lucide-react";
import { NoahFace, EmmaFace } from "@/components/ai-models/NoahEmmaFaces";
import { CookieInstellingenKnop } from "@/components/CookieMelding";
import { FOOTER_EXTRA, LOGIN_URL, MENU_PAGINAS, SIGNUP_URL, SITE_URL } from "@/components/marketing/links";

// Gedeelde bouwblokken voor de marketingpagina's, zodat elke pagina dezelfde
// huisstijl, hetzelfde afsluitende aanmeldblok en dezelfde footer heeft.

export type Kleur = "roze" | "blauw";
export const SCHADUW = "shadow-[0_12px_30px_-14px_rgba(36,26,46,0.28)]";
export const tint = (kleur: Kleur) => (kleur === "roze" ? "bg-[#FFEAF1] text-[#D63D74]" : "bg-[#E4F4FB] text-[#1C7FA8]");
export const afwisselend = (i: number): Kleur => (i % 2 === 0 ? "blauw" : "roze");

export interface Vraag {
  vraag: string;
  antwoord: string;
}

/** Bovenliggende pagina in het kruimelpad, bv. Kinderkleding boven Kopen. */
export interface Ouder {
  naam: string;
  pad: string;
}

/** BreadcrumbList (en optioneel FAQPage) als JSON-LD. */
export function StructuredData({ naam, pad, faq, ouder }: { naam: string; pad: string; faq?: Vraag[]; ouder?: Ouder }) {
  const kruimels = [{ name: "Home", item: `${SITE_URL}/` }, ...(ouder ? [{ name: ouder.naam, item: `${SITE_URL}${ouder.pad}` }] : []), { name: naam, item: `${SITE_URL}${pad}` }];
  const graph: object[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: kruimels.map((k, i) => ({ "@type": "ListItem", position: i + 1, ...k })),
    },
  ];
  if (faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.vraag, acceptedAnswer: { "@type": "Answer", text: f.antwoord } })),
    });
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />;
}

export function Kruimelpad({ naam, center = false, ouder }: { naam: string; center?: boolean; ouder?: Ouder }) {
  return (
    <nav aria-label="Kruimelpad" className={`text-[13px] text-[#5B4F63] flex flex-wrap gap-2 mb-5 ${center ? "justify-center" : ""}`}>
      <Link href="/" className="underline underline-offset-2">Home</Link>
      <span aria-hidden="true">/</span>
      {ouder && (
        <>
          <Link href={ouder.pad} className="underline underline-offset-2">{ouder.naam}</Link>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span className="text-[#241A2E] font-semibold">{naam}</span>
    </nav>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase text-[#5B4F63] ${SCHADUW}`}>
      <span className="w-2 h-2 rounded-full bg-[#3FA9DB]" />
      {children}
      <span className="w-2 h-2 rounded-full bg-[#FF6F9C]" />
    </span>
  );
}

export function UspLijst({ usps }: { usps: { kop: string; tekst: string }[] }) {
  return (
    <ul className="mt-7 flex flex-col gap-3.5">
      {usps.map((u) => (
        <li key={u.kop} className="flex gap-3 items-start text-[17px] leading-snug">
          <Check className="w-6 h-6 shrink-0 text-[#1C7FA8]" strokeWidth={2.5} aria-hidden="true" />
          <span><strong>{u.kop}</strong> {u.tekst}</span>
        </li>
      ))}
    </ul>
  );
}

/** De twee knoppen in de hero. De StickyCta verschijnt zodra #hero-cta uit beeld is. */
export function HeroKnoppen({ tweede }: { tweede: { label: string; href: string } }) {
  return (
    <div id="hero-cta" className="mt-8 flex flex-col sm:flex-row gap-3">
      <Link
        href={SIGNUP_URL}
        className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 rounded-full bg-[#241A2E] text-white font-bold text-base shadow-[0_12px_30px_-14px_rgba(36,26,46,0.5)] transition-transform hover:-translate-y-0.5"
      >
        Maak gratis een account <ArrowRight className="w-5 h-5" />
      </Link>
      <Link
        href={tweede.href}
        className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-full border border-[#241A2E]/20 bg-white text-[#241A2E] font-bold text-base"
      >
        {tweede.label}
      </Link>
    </div>
  );
}

/** Hero met tekst links en een beeld rechts. */
export function Hero({
  naam,
  eyebrow,
  titel,
  intro,
  usps,
  tweedeKnop = { label: "Bekijk hoe het werkt", href: "/hoe-het-werkt" },
  beeld,
  ouder,
}: {
  naam: string;
  ouder?: Ouder;
  eyebrow: string;
  titel: React.ReactNode;
  intro?: string;
  usps?: { kop: string; tekst: string }[];
  tweedeKnop?: { label: string; href: string };
  beeld: React.ReactNode;
}) {
  return (
    <section className="bg-gradient-to-r from-[#E4F4FB] via-[#FFF9FA] to-[#FFEAF1]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-7 sm:pt-16 pb-10 sm:pb-16 flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
        <div className="flex-1 min-w-0 w-full">
          <Kruimelpad naam={naam} ouder={ouder} />
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-headline font-extrabold text-[34px] sm:text-[46px] lg:text-[52px] leading-[1.06] tracking-tight">{titel}</h1>
          {intro && <p className="mt-4 text-lg leading-relaxed text-[#5B4F63] max-w-[56ch]">{intro}</p>}
          {usps && <UspLijst usps={usps} />}
          <HeroKnoppen tweede={tweedeKnop} />
        </div>
        <div className="flex-1 min-w-0 w-full flex justify-center">{beeld}</div>
      </div>
    </section>
  );
}

export interface Product {
  afbeelding: string;
  alt: string;
  titel: string;
  maat: string;
  staat: string;
  kind: string;
}

// Productfoto's (gemaakt in Canva, zonder kinderen). Elke pagina krijgt een
// eigen kledingstuk, zodat dezelfde foto niet op meerdere pagina's staat.
export const PRODUCTEN = {
  trui: { afbeelding: "/images/trui-groen.png", alt: "Groene gebreide kindertrui aan een houten hanger", titel: "Gebreide trui, groen", maat: "98", staat: "Zo goed als nieuw", kind: "Voor Noor, 3 jaar" },
  sneakers: { afbeelding: "/images/sneakers-blauw.png", alt: "Blauwe kindersneakers aan een houten haakje", titel: "Sneakers, blauw", maat: "26", staat: "Goed", kind: "Voor Finn, 3 jaar" },
  vestje: { afbeelding: "/images/vestje-beige.png", alt: "Beige gebreid kindervestje aan een houten hanger", titel: "Gebreid vestje, beige", maat: "92", staat: "Zo goed als nieuw", kind: "Voor Lotte, 2 jaar" },
  regenjas: { afbeelding: "/images/regenjas-geel.png", alt: "Gele kinderregenjas aan een houten hanger", titel: "Regenjas, geel", maat: "104", staat: "Zo goed als nieuw", kind: "Voor Daan, 4 jaar" },
  jurkje: { afbeelding: "/images/jurkje-gestreept.png", alt: "Gestreept kinderjurkje met roze kraag aan een houten hanger", titel: "Gestreept jurkje", maat: "110", staat: "Nieuw met label", kind: "Voor Mila, 5 jaar" },
  tuinbroek: { afbeelding: "/images/tuinbroek-denim.png", alt: "Spijkertuinbroekje aan een houten hanger", titel: "Spijkertuinbroek", maat: "86", staat: "Goed", kind: "Voor Sam, 1 jaar" },
} satisfies Record<string, Product>;

/** Telefoonkaartje met een product, inclusief de swipeknoppen uit de app. */
export function SwipeKaart({ product = PRODUCTEN.vestje }: { product?: Product }) {
  return (
    <div className="w-full max-w-[300px] bg-white rounded-[36px] p-3.5 shadow-[0_30px_60px_-24px_rgba(36,26,46,0.45)] -rotate-3">
      <div className="flex items-center justify-between px-2 pt-1.5 pb-3">
        <span className="text-[13px] font-bold">{product.kind}</span>
        <span className="text-xs font-bold text-[#1C7FA8] bg-[#E4F4FB] px-2.5 py-1 rounded-full">Maat {product.maat}</span>
      </div>
      <div className="rounded-[26px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.afbeelding} alt={product.alt} width={1136} height={1408} className="block w-full h-[300px] object-cover" />
        <div className="px-4 pt-3.5 pb-4 bg-white">
          <div className="font-headline font-extrabold text-[17px]">{product.titel}</div>
          <div className="text-[13px] text-[#5B4F63] mt-1">Maat {product.maat} · {product.staat}</div>
          {/* Puur ter illustratie van het swipen in de app, geen echte knoppen. */}
          <div className="flex justify-center gap-5 mt-4" aria-hidden="true">
            <span className="w-12 h-12 rounded-full border border-[#241A2E]/15 bg-white flex items-center justify-center shadow-sm">
              <X className="w-5 h-5 text-[#5B4F63]" strokeWidth={2.5} />
            </span>
            <span className="w-12 h-12 rounded-full bg-[#D63D74] flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(214,61,116,0.8)]">
              <Heart className="w-[22px] h-[22px] text-white fill-white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sectie({ id, smal = false, className = "", children }: { id?: string; smal?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-20 ${smal ? "max-w-[820px]" : "max-w-[1180px]"} mx-auto px-4 sm:px-6 pt-14 sm:pt-24 ${className}`}>
      {children}
    </section>
  );
}

export function SectieKop({ label, titel, sub, links = false }: { label?: string; titel: string; sub?: string; links?: boolean }) {
  return (
    <div className={links ? "" : "text-center max-w-2xl mx-auto"}>
      {label && <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase">{label}</span>}
      <h2 className="mt-2.5 font-headline font-extrabold text-[28px] sm:text-[38px] leading-tight tracking-tight">{titel}</h2>
      {sub && <p className="mt-3 text-[17px] leading-relaxed text-[#5B4F63]">{sub}</p>}
    </div>
  );
}

/** Gekleurde tegels die naar de aanmelding leiden (aanbod zie je pas met een account). */
export function Tegels({ items, kolommen = "grid-cols-2 md:grid-cols-4" }: { items: { naam: string; sub: string }[]; kolommen?: string }) {
  return (
    <div className={`mt-7 grid ${kolommen} gap-3`}>
      {items.map((c, i) => (
        <Link
          key={c.naam}
          href={SIGNUP_URL}
          className={`rounded-[20px] p-5 min-h-[112px] flex flex-col justify-between gap-2.5 transition-transform hover:-translate-y-0.5 ${i % 2 === 0 ? "bg-[#FFEAF1]" : "bg-[#E4F4FB]"}`}
        >
          <span className="font-headline font-extrabold text-[17px] leading-tight">{c.naam}</span>
          <span className="text-[13px] leading-snug text-[#5B4F63]">{c.sub}</span>
        </Link>
      ))}
    </div>
  );
}

/** Genummerde witte kaarten. */
/** Genummerde stappen in een gekleurd kader (kopen of verkopen). */
export function Stappen({ titel, stappen, kleur }: { titel: string; stappen: { titel: string; tekst: string }[]; kleur: "roze" | "blauw" }) {
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

export function Kaarten({ items, kolommen = "sm:grid-cols-2 lg:grid-cols-3" }: { items: { titel: string; tekst: string }[]; kolommen?: string }) {
  return (
    <div className={`mt-10 grid ${kolommen} gap-5`}>
      {items.map((v, i) => (
        <div key={v.titel} className={`bg-white rounded-3xl p-7 ${SCHADUW}`}>
          <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-headline font-extrabold ${tint(afwisselend(i))}`}>{i + 1}</div>
          <h3 className="mt-4 mb-2 font-headline font-extrabold text-xl">{v.titel}</h3>
          <p className="text-[#5B4F63] leading-relaxed">{v.tekst}</p>
        </div>
      ))}
    </div>
  );
}

// Gelijk aan schatMaatOpLeeftijd in src/lib/groei.ts
const GROEIVOORBEELD = [
  { leeftijd: "1 maand", maat: "50", kleur: "blauw" },
  { leeftijd: "2 maanden", maat: "56", kleur: "blauw" },
  { leeftijd: "4 maanden", maat: "62", kleur: "blauw" },
  { leeftijd: "1 jaar", maat: "80", kleur: "roze" },
  { leeftijd: "2 jaar", maat: "92", kleur: "roze" },
  { leeftijd: "4 jaar", maat: "104", kleur: "roze" },
] as const;

export function Groeimodel({ titel = "Altijd de juiste maat, zonder dat je erop hoeft te letten" }: { titel?: string }) {
  return (
    <Sectie id="groeimodel">
      <div className={`rounded-[32px] bg-white ${SCHADUW} p-6 sm:p-12 flex flex-col lg:flex-row gap-8 lg:gap-14 items-center`}>
        <div className="flex-1 min-w-0">
          <span className="text-[#D63D74] text-xs font-bold tracking-[0.14em] uppercase">Het groeimodel</span>
          <h2 className="mt-2.5 font-headline font-extrabold text-[28px] sm:text-[38px] leading-tight tracking-tight">{titel}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#5B4F63]">
            Je stelt één keer de leeftijd of maat van je kind in. Daarna groeit de maat in de app vanzelf mee, maand na maand. Je ziet alleen wat nu past.
          </p>
        </div>
        <ol aria-label="Voorbeeld: zo groeit de maat mee" className="flex-1 min-w-0 w-full grid grid-cols-3 gap-2.5">
          {GROEIVOORBEELD.map((g) => (
            <li key={g.leeftijd} className={`rounded-[18px] px-3 py-4 text-center ${g.kleur === "roze" ? "bg-[#FFEAF1]" : "bg-[#E4F4FB]"}`}>
              <div className="text-[13px] font-semibold text-[#5B4F63]">{g.leeftijd}</div>
              <div className={`mt-1 font-headline font-extrabold text-2xl ${g.kleur === "roze" ? "text-[#D63D74]" : "text-[#1C7FA8]"}`}>{g.maat}</div>
            </li>
          ))}
        </ol>
      </div>
    </Sectie>
  );
}

export function Faq({ vragen, titel = "Veelgestelde vragen" }: { vragen: Vraag[]; titel?: string }) {
  return (
    <Sectie id="faq" smal>
      <h2 className="text-center font-headline font-extrabold text-[28px] sm:text-[38px] tracking-tight">{titel}</h2>
      <div className="mt-7 flex flex-col gap-3">
        {vragen.map((f) => (
          <details key={f.vraag} className="group bg-white rounded-[18px] px-5 sm:px-6 py-4 shadow-[0_8px_20px_-14px_rgba(36,26,46,0.25)]">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 min-h-[28px] font-bold">
              {f.vraag}
              <span aria-hidden="true" className="shrink-0 text-[#D63D74] text-xl leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2.5 text-[#5B4F63] leading-relaxed">{f.antwoord}</p>
          </details>
        ))}
      </div>
    </Sectie>
  );
}

/** Donker aanmeldblok onderaan elke pagina. */
export function AfsluitendeCta({ titel, accent, tekst }: { titel: string; accent: string; tekst: string }) {
  return (
    <Sectie>
      <div className="rounded-[32px] px-5 sm:px-8 py-10 sm:py-14 bg-[#241A2E] text-white text-center">
        <h2 className="mx-auto max-w-[22ch] font-headline font-extrabold text-[30px] sm:text-[44px] leading-[1.1] tracking-tight">
          {titel} <span className="text-[#FF8FB3]">{accent}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[#F3E9F0] text-[17px] leading-relaxed">{tekst}</p>
        <div className="mt-8 flex flex-col items-center gap-3.5">
          <Link
            href={SIGNUP_URL}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 min-h-[60px] px-10 rounded-full bg-white text-[#241A2E] font-extrabold text-lg"
          >
            Maak gratis een account <ArrowRight className="w-5 h-5" />
          </Link>
          <span className="text-sm text-[#F3E9F0]">
            Al een account? <Link href={LOGIN_URL} className="font-bold text-white underline underline-offset-2">Inloggen</Link>
          </span>
        </div>
        <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-sm font-semibold text-[#F3E9F0]">
          <li>✓ Gratis</li>
          <li>✓ Groeit mee met je kind</li>
          <li>✓ Nooit kindergezichten</li>
        </ul>
      </div>
    </Sectie>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mt-16 sm:mt-20 border-t border-[#241A2E]/[0.08] px-4 sm:px-6 pt-10 pb-24 sm:pb-10">
      <div className="max-w-[1180px] mx-auto grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex">
              <span className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm"><NoahFace size={32} /></span>
              <span className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm -ml-2"><EmmaFace size={32} /></span>
            </span>
            <span className="font-headline font-extrabold">
              <span className="text-[#1C7FA8]">Noah</span> &amp; <span className="text-[#D63D74]">Emma</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-[#5B4F63] max-w-[36ch] leading-relaxed">
            Tweedehands kinderkleding en accessoires voor kinderen van 0 tot 12 jaar. Zonder kindergezichten, helemaal gratis.
          </p>
        </div>
        <nav aria-label="Footer: pagina's">
          <p className="font-headline font-extrabold text-sm">Noah &amp; Emma</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-[#5B4F63]">
            {MENU_PAGINAS.map((m) => (
              <li key={m.href}><Link href={m.href} className="hover:text-[#241A2E]">{m.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer: meer">
          <p className="font-headline font-extrabold text-sm">Meer</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-[#5B4F63]">
            {FOOTER_EXTRA.map((m) => (
              <li key={m.href}><Link href={m.href} className="hover:text-[#241A2E]">{m.label}</Link></li>
            ))}
            <li><CookieInstellingenKnop className="hover:text-[#241A2E] text-left" /></li>
            <li><a href="mailto:info@noah-emma.nl" className="hover:text-[#241A2E]">info@noah-emma.nl</a></li>
          </ul>
        </nav>
      </div>
      <p className="max-w-[1180px] mx-auto mt-8 pt-6 border-t border-[#241A2E]/[0.08] text-xs text-[#5B4F63]">
        © {new Date().getFullYear()} Noah &amp; Emma
      </p>
    </footer>
  );
}
