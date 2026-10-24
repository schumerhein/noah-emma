import type { MetadataRoute } from "next";
import { MENU_PAGINAS, SITE_URL } from "@/components/marketing/links";

// /sitemap.xml voor Google Search Console. Alleen de openbare pagina's: de
// app zelf (aanbod, chat, profiel) is alleen met een account te zien.
export default function sitemap(): MetadataRoute.Sitemap {
  const laatstGewijzigd = new Date();
  const pagina = (pad: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "weekly") => ({
    url: `${SITE_URL}${pad}`,
    lastModified: laatstGewijzigd,
    changeFrequency,
    priority,
  });

  return [
    pagina("/", 1),
    pagina("/2e-hands-kinderkleding", 0.9),
    ...MENU_PAGINAS.map((m) => pagina(m.href, 0.8)),
    pagina("/privacy", 0.2, "yearly"),
    pagina("/voorwaarden", 0.2, "yearly"),
    pagina("/cookies", 0.2, "yearly"),
    pagina("/community", 0.2, "yearly"),
    pagina("/wettelijk", 0.2, "yearly"),
  ];
}
