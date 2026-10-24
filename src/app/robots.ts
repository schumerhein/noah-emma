import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/marketing/links";

// /robots.txt: de openbare pagina's mogen in Google, de afgeschermde delen van
// de app (beheer, API, account en chat) niet.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin", "/api/", "/instellingen", "/messages", "/notificaties", "/orders",
        "/profile", "/sell", "/onboarding", "/wachtwoord-reset", "/feed-voorkeuren", "/voorkeuren",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
