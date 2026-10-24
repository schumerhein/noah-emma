import { JuridischePagina } from "@/components/marketing/JuridischePagina";
import { VOORWAARDEN } from "@/lib/juridischeTeksten";

export default function VoorwaardenPagina() {
  return (
    <JuridischePagina
      inhoud={VOORWAARDEN}
    />
  );
}
