import { cn } from "@/lib/utils";

export const anker = (titel: string) =>
  titel.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Zet platte tekst om in alinea's en opsommingen (regels die met "• "
 * beginnen). Gedeeld door de website- en de appversie van de juridische
 * pagina's; alleen de kleuren verschillen.
 */
export function JuridischeTekst({ tekst, tekstKlasse, bolletjeKlasse }: { tekst: string; tekstKlasse: string; bolletjeKlasse: string }) {
  return (
    <>
      {tekst.split(/\n\s*\n/).map((blok, i) => {
        const regels = blok.split("\n").map((r) => r.trim()).filter(Boolean);
        const punten = regels.filter((r) => r.startsWith("•"));
        const kop = regels.filter((r) => !r.startsWith("•"));
        return (
          <div key={i} className="mt-4 first:mt-0">
            {kop.map((r, j) => <p key={j} className={cn("leading-relaxed", tekstKlasse)}>{r}</p>)}
            {punten.length > 0 && (
              <ul className="mt-2 flex flex-col gap-2">
                {punten.map((r, j) => (
                  <li key={j} className={cn("flex gap-2.5 leading-relaxed", tekstKlasse)}>
                    <span aria-hidden="true" className={cn("mt-[9px] w-1.5 h-1.5 rounded-full shrink-0", bolletjeKlasse)} />
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
