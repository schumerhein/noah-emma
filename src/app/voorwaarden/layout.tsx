import type { Metadata } from "next";
import { SITE_URL } from "@/components/marketing/links";

// De pagina zelf is een clientcomponent; titel en canonical staan daarom hier.
export const metadata: Metadata = {
  title: "Algemene voorwaarden | Noah & Emma",
  description: "De algemene voorwaarden voor kopen en verkopen via Noah & Emma.",
  alternates: { canonical: `${SITE_URL}/voorwaarden` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
