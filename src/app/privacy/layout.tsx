import type { Metadata } from "next";
import { SITE_URL } from "@/components/marketing/links";

// De pagina zelf is een clientcomponent; titel en canonical staan daarom hier.
export const metadata: Metadata = {
  title: "Privacyverklaring | Noah & Emma",
  description: "Hoe Noah & Emma omgaat met je persoonsgegevens en die van je kinderen, volgens de AVG.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
