import { JuridischePagina } from "@/components/marketing/JuridischePagina";
import { COOKIES } from "@/lib/juridischeTeksten";
import { CookieInstellingenKnop } from "@/components/CookieMelding";

export default function CookiesPagina() {
  return (
    <JuridischePagina
      inhoud={COOKIES}
      extra={<CookieInstellingenKnop className="min-h-[44px] px-5 rounded-full bg-[#241A2E] text-white text-sm font-bold" />}
    />
  );
}
