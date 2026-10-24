import type { Metadata } from "next";

// Inlog- en aanmeldscherm: eigen titel, maar niet in Google (geen inhoud om te vinden).
export const metadata: Metadata = {
  title: "Inloggen of gratis aanmelden | Noah & Emma",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
