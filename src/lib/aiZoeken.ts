import { GoogleGenAI } from "@google/genai";
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

let client: GoogleGenAI | null = null;
function getClient() {
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
- sizeMin/sizeMax alleen invullen bij kledingvragen; laat ze weg bij niet-kleding (speelgoed, kinderwagens, etc.) — daar bestaat geen kledingmaat.
- Vul alleen filters in die je echt uit de vraag kunt afleiden. Vind je niets specifieks voor een veld, laat het leeg.
- "antwoord" is een kort, warm, informeel Nederlands zinnetje (max 20 woorden) alsof Noah of Emma reageert — geen technische termen, geen opsomming van de filters zelf.
- Antwoord ALTIJD met alleen het JSON-object, niets anders.`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    zoekterm: { type: "STRING" },
    sizeMin: { type: "STRING", nullable: true, enum: SIZES },
    sizeMax: { type: "STRING", nullable: true, enum: SIZES },
    conditions: { type: "ARRAY", items: { type: "STRING", enum: CONDITIES } },
    colors: { type: "ARRAY", items: { type: "STRING", enum: KLEUREN } },
    merken: { type: "ARRAY", items: { type: "STRING" } },
    materialen: { type: "ARRAY", items: { type: "STRING", enum: MATERIALEN } },
    minPrijs: { type: "NUMBER", nullable: true },
    maxPrijs: { type: "NUMBER", nullable: true },
    antwoord: { type: "STRING" },
  },
  required: ["zoekterm", "conditions", "colors", "merken", "materialen", "antwoord"],
};

export async function vertaalZoekvraag(vraag: string): Promise<AiZoekFilters> {
  const response = await getClient().models.generateContent({
    model: "gemini-3.6-flash",
    contents: vraag,
    config: {
      systemInstruction: SYSTEEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const tekst = response.text;
  if (!tekst) throw new Error("Geen antwoord ontvangen van de AI");
  return JSON.parse(tekst) as AiZoekFilters;
}
