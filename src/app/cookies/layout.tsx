import type { Metadata } from "next";
import { SITE_URL } from "@/components/marketing/links";

// De pagina zelf is een clientcomponent; titel en canonical staan daarom hier.
export const metadata: Metadata = {
  title: "Cookiebeleid | Noah & Emma",
  description: "Welke cookies Noah & Emma gebruikt en waarvoor.",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
