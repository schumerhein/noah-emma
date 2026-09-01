import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Prijsvelden gebruiken overal placeholder "0,00" (NL-notatie), maar
// type="number" accepteert alleen een punt als decimaalteken en veegt de
// hele waarde stilletjes leeg zodra je een komma typt. Deze helper hoort bij
// een tekstveld (type="text" inputMode="decimal") en normaliseert de invoer
// naar iets dat parseFloat() correct oppikt, terwijl je gewoon met een
// komma kunt blijven typen.
export function normaliseerPrijsInvoer(waarde: string): string {
  return waarde.replace(",", ".").replace(/[^0-9.]/g, "");
}
