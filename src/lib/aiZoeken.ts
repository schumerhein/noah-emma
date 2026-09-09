import Anthropic from "@anthropic-ai/sdk";
import { CATEGORY_HIERARCHY } from "@/lib/categorieen";

const SIZES = ["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158/164"];
const CONDITIES = ["Nieuw met prijskaartje", "Zo goed als nieuw", "Goed", "Gebruikt"];
const KLEUREN = ["Wit", "Zwart", "Grijs", "Rood", "Roze", "Oranje", "Geel", "Groen", "Blauw", "Paars", "Bruin", "Beige"];
const MATERIALEN = ["Katoen", "Polyester", "Wol", "Denim", "Fleece", "Linnen", "Katoen-mix", "Synthetisch"];

export type AiZoekFilters = {
  zoekterm: string;
  sizeMin: string | null;
  sizeMax: string | null;
  conditions: string[];
  colors: string[];
  merken: string[];
  materialen: string[];
  minPrijs: number | null;
  maxPrijs: number | null;
  antwoord: string;
};

let client: Anthropic | null = null;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const CATEGORIE_OVERZICHT = Object.entries(CATEGORY_HIERARCHY)
  .map(([hoofd, { sub }]) => `${hoofd}: ${sub.join(", ")}`)
  .join("\n");

const SYSTEEM_PROMPT = `Je bent de zoekassistent van Noah & Emma, een Nederlandse marktplace voor tweedehands kinderartikelen (kleding, speelgoed, kinderwagens, meubels, en meer). Een gebruiker beschrijft in gewone taal wat die zoekt. Vertaal dat naar zoekfilters voor het bestaande assortiment.

Beschikbare hoofd- en subcategorieën:
${CATEGORIE_OVERZICHT}

Beschikbare kledingmaten (alleen relevant bij kleding): ${SIZES.join(", ")}
Beschikbare condities: ${CONDITIES.join(", ")}
Beschikbare kleuren: ${KLEUREN.join(", ")}
Beschikbare materialen: ${MATERIALEN.join(", ")}

Regels:
- "zoekterm" is vrije tekst die tegen titel, omschrijving, merk, categorie en subcategorie wordt gematcht — noem hierin het product/type (bijv. "houten speelgoed", "winterjas", "buggy"), niet een hele zin.
- sizeMin/sizeMax alleen invullen bij kledingvragen; laat ze op null bij niet-kleding (speelgoed, kinderwagens, etc.) — daar bestaat geen kledingmaat.
- Vul alleen filters in die je echt uit de vraag kunt afleiden. Vind je niets specifieks voor een veld, laat het leeg/null.
- "antwoord" is een kort, warm, informeel Nederlands zinnetje (max 20 woorden) alsof Noah of Emma reageert — geen technische termen, geen opsomming van de filters zelf.`;

export async function vertaalZoekvraag(vraag: string): Promise<AiZoekFilters> {
  const response = await getClient().messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    output_config: { effort: "low" },
    system: SYSTEEM_PROMPT,
    tools: [
      {
        name: "zoekfilters",
        description: "Structurele zoekfilters op basis van de vraag van de gebruiker.",
        strict: true,
        input_schema: {
          type: "object",
          additionalProperties: false,
          required: ["zoekterm", "sizeMin", "sizeMax", "conditions", "colors", "merken", "materialen", "minPrijs", "maxPrijs", "antwoord"],
          properties: {
            zoekterm: { type: "string" },
            sizeMin: { type: ["string", "null"], enum: [...SIZES, null] },
            sizeMax: { type: ["string", "null"], enum: [...SIZES, null] },
            conditions: { type: "array", items: { type: "string", enum: CONDITIES } },
            colors: { type: "array", items: { type: "string", enum: KLEUREN } },
            merken: { type: "array", items: { type: "string" } },
            materialen: { type: "array", items: { type: "string", enum: MATERIALEN } },
            minPrijs: { type: ["number", "null"] },
            maxPrijs: { type: ["number", "null"] },
            antwoord: { type: "string" },
          },
        },
      },
    ],
    tool_choice: { type: "tool", name: "zoekfilters" },
    messages: [{ role: "user", content: vraag }],
  });

  const toolUse = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
  if (!toolUse) throw new Error("Geen gestructureerd antwoord ontvangen van de AI");
  return toolUse.input as AiZoekFilters;
}
