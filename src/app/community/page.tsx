import type { Metadata } from "next";
import { JuridischePagina } from "@/components/marketing/JuridischePagina";
import { COMMUNITY } from "@/lib/juridischeTeksten";
import { SITE_URL } from "@/components/marketing/links";

export const metadata: Metadata = {
  title: "Communityrichtlijnen | Noah & Emma",
  description: "De gedragsregels van Noah & Emma: eerlijk handelen, respectvol contact, nooit kindergezichten en wat je doet als iets niet klopt.",
  alternates: { canonical: `${SITE_URL}/community` },
};

export default function CommunityPagina() {
  return (
    <JuridischePagina
      inhoud={COMMUNITY}
    />
  );
}
