import { dataUrlToFile } from "@/lib/avatarComposite";

// Verkleint een geüploade foto clientside voordat 'm naar Supabase Storage
// gaat: geen enkele kant groter dan maxAfmeting, herexporteren als JPEG met
// de opgegeven kwaliteit. Zonder dit gaan foto's rechtstreeks van een
// telefooncamera (vaak meerdere MB's) ongewijzigd de opslag in.
export async function verkleinAfbeelding(
  file: File,
  maxAfmeting = 1600,
  kwaliteit = 0.82,
): Promise<{ file: File; dataUrl: string }> {
  const dataUrl: string = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });

    const schaal = Math.min(1, maxAfmeting / Math.max(img.width, img.height));
    if (schaal === 1 && file.size < 1.5 * 1024 * 1024) {
      // Al klein genoeg: niet opnieuw encoderen (kwaliteitsverlies vermijden).
      return { file, dataUrl };
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * schaal);
    canvas.height = Math.round(img.height * schaal);
    const ctx = canvas.getContext("2d");
    if (!ctx) return { file, dataUrl };
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const nieuweDataUrl = canvas.toDataURL("image/jpeg", kwaliteit);
    const nieuwBestand = dataUrlToFile(nieuweDataUrl, file.name.replace(/\.\w+$/, ".jpg"));
    return { file: nieuwBestand, dataUrl: nieuweDataUrl };
  } catch {
    // Verkleinen mislukt (bv. onbekend formaat): gewoon origineel gebruiken.
    return { file, dataUrl };
  }
}
