"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, X, Loader2, Trash2, Check, Crown, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CATEGORIES: Record<string, string[]> = {
  "Meisjeskleding": ["Jurken & Rokken","Jassen & Vesten","Truien & Sweaters","T-shirts & Tops","Broeken & Leggings","Zwemkleding","Pyjama & Ondergoed","Schoenen & Laarzen","Sportkleding"],
  "Jongenskleding": ["Jassen & Vesten","Truien & Sweaters","T-shirts & Poloshirts","Broeken & Shorts","Zwemkleding","Pyjama & Ondergoed","Schoenen & Laarzen","Sportkleding"],
  "Speelgoed": ["Houten Speelgoed","Educatief","Knuffels & Poppen","Buitenspeelgoed","Puzzels & Spellen","Constructie & Lego"],
  "Kinderwagens, buggy's & autostoeltjes": ["Combinatiewagens","Buggy's","Autostoeltjes","Draagdoeken","Accessoires"],
  "Meubilair & decoratie": ["Bedjes & Wiegjes","Kasten","Kinderstoelen","Bureaus","Decoratie"],
  "Voeden": ["Flesjes","Borstkolven","Eetservies","Kinderstoelen (eten)","Sterilisatoren"],
  "Slapen & beddengoed": ["Slaapzakken","Kussens & Dekbedden","Beddengoed"],
  "Overige kinderartikelen": ["Speelmatten","Wipstoelen","Schoolspullen","Overig"],
};

const SIZES = ["50","56","62","68","74","80","86","92","98","104","110","116","122","128","134","140","146","152","158/164"];
const CONDITIONS = ["Nieuw met prijskaartje","Zo goed als nieuw","Goed","Gebruikt"];
const KLEUREN = [
  { naam: "Wit", hex: "#ffffff", border: true },
  { naam: "Zwart", hex: "#1a1a1a" },
  { naam: "Grijs", hex: "#9ca3af" },
  { naam: "Rood", hex: "#ef4444" },
  { naam: "Roze", hex: "#ffb8c4" },
  { naam: "Oranje", hex: "#f97316" },
  { naam: "Geel", hex: "#fbbf24" },
  { naam: "Groen", hex: "#22c55e" },
  { naam: "Blauw", hex: "#3b82f6" },
  { naam: "Paars", hex: "#a855f7" },
  { naam: "Bruin", hex: "#92400e" },
  { naam: "Beige", hex: "#d4b896" },
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();

  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);
  const [verwijderen, setVerwijderen] = useState(false);
  const [bevestigVerwijder, setBevestigVerwijder] = useState(false);

  // Form state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [titel, setTitel] = useState("");
  const [beschrijving, setBeschrijving] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [maat, setMaat] = useState("68");
  const [conditie, setConditie] = useState("Nieuw met prijskaartje");
  const [prijs, setPrijs] = useState("");
  const [merk, setMerk] = useState("");
  const [kleur, setKleur] = useState("");
  const [biedenToegestaan, setBiedenToegestaan] = useState(false);
  const [actief, setActief] = useState(true);
  const [gepromoot, setGepromoot] = useState(false);
  const [promotieDuur, setPromotieDuur] = useState<3 | 7 | null>(null);
  const [promotieVerloopdatum, setPromotieVerloopdatum] = useState<string | null>(null);

  useEffect(() => { laadListing(); }, [id]);

  const laadListing = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
    if (error || !data) { router.push("/"); return; }
    if (data.user_id !== user.id) { router.push(`/product/${id}`); return; }

    setTitel(data.titel || "");
    setBeschrijving(data.beschrijving || "");
    setMainCategory(data.categorie || "");
    setSubCategory(data.subcategorie || "");
    setMaat(data.maat || "68");
    setConditie(data.conditie || "Nieuw met prijskaartje");
    setPrijs(data.prijs?.toString() || "");
    setMerk(data.merk || "");
    setKleur(data.kleur || "");
    setBiedenToegestaan(data.bieden_toegestaan || false);
    setActief(data.actief !== false);
    setGepromoot(data.gepromoot || false);
    setPromotieVerloopdatum(data.promotie_verloopdatum || null);
    if (data.gepromoot && data.promotie_verloopdatum) {
      const restDagen = Math.round((new Date(data.promotie_verloopdatum).getTime() - Date.now()) / 86400000);
      if (restDagen > 4) setPromotieDuur(7);
      else if (restDagen > 0) setPromotieDuur(3);
    }
    setImagePreviews(data.foto_urls || []);
    setImageFiles((data.foto_urls || []).map(() => null)); // null = existing URL
    setLaden(false);
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const verwijderFoto = (idx: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const slaOp = async () => {
    if (!titel || !prijs) {
      toast({ title: "Vul minstens een titel en prijs in." });
      return;
    }
    setOpslaan(true);

    // Upload nieuwe foto's
    const bestaandeFotos: string[] = [];
    for (let i = 0; i < imagePreviews.length; i++) {
      if (imageFiles[i] === null) {
        // Bestaande URL bewaren
        bestaandeFotos.push(imagePreviews[i]);
      } else if (imageFiles[i] instanceof File) {
        const file = imageFiles[i] as File;
        const pad = `listings/${id}/${Date.now()}_${i}.${file.name.split(".").pop()}`;
        const { data: uploaded } = await supabase.storage.from("listings").upload(pad, file, { upsert: true });
        if (uploaded) {
          const { data: pub } = supabase.storage.from("listings").getPublicUrl(uploaded.path);
          bestaandeFotos.push(pub.publicUrl);
        }
      }
    }

    const { error } = await supabase.from("listings").update({
      titel,
      beschrijving,
      categorie: mainCategory,
      subcategorie: subCategory,
      maat,
      conditie,
      prijs: parseFloat(prijs),
      merk: merk || null,
      kleur: kleur || null,
      bieden_toegestaan: biedenToegestaan,
      actief,
      gepromoot: gepromoot && promotieDuur !== null,
      promotie_verloopdatum: gepromoot && promotieDuur ? (() => {
        const d = new Date(); d.setDate(d.getDate() + promotieDuur); return d.toISOString();
      })() : null,
      foto_urls: bestaandeFotos,
    }).eq("id", id);

    setOpslaan(false);

    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message });
    } else {
      toast({ title: "Artikel bijgewerkt!" });
      router.push(`/product/${id}`);
    }
  };

  const verwijderArtikel = async () => {
    if (!bevestigVerwijder) { setBevestigVerwijder(true); return; }
    setVerwijderen(true);
    await supabase.from("listings").update({ actief: false }).eq("id", id);
    toast({ title: "Artikel verwijderd." });
    router.push("/profile");
  };

  if (laden) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <span className="material-icons-round text-primary text-4xl animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-40">
      {/* Header */}
      <header className="px-5 pt-14 pb-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900 flex items-center justify-between">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-[17px] font-black text-slate-900 dark:text-white">Artikel aanpassen</h1>
        <div className="w-6" />
      </header>

      <main className="px-5 pt-5 space-y-6 max-w-lg mx-auto">

        {/* Foto's */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500">Foto's</label>
          <div className="flex gap-3 flex-wrap">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-100">
                <Image src={src} alt="" fill className="object-cover" />
                <button onClick={() => verwijderFoto(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 6 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer active:bg-slate-50">
                <Camera className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400">Toevoegen</span>
                <input type="file" accept="image/*" multiple onChange={handleFotoUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Titel */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Titel</label>
          <input value={titel} onChange={e => setTitel(e.target.value)}
            placeholder="Bijv. Roze zomerjas H&M maat 80"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary" />
        </div>

        {/* Beschrijving */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Omschrijving</label>
          <textarea value={beschrijving} onChange={e => setBeschrijving(e.target.value)}
            rows={4} placeholder="Beschrijf de staat, bijzonderheden..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary resize-none" />
        </div>

        {/* Categorie */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Categorie</label>
          <select value={mainCategory} onChange={e => { setMainCategory(e.target.value); setSubCategory(""); }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary">
            <option value="">Kies categorie</option>
            {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {mainCategory && (
            <select value={subCategory} onChange={e => setSubCategory(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary">
              <option value="">Subcategorie (optioneel)</option>
              {CATEGORIES[mainCategory].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>

        {/* Merk */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Merk (optioneel)</label>
          <input value={merk} onChange={e => setMerk(e.target.value)}
            placeholder="Bijv. H&M, Zara, Nike..."
            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:border-primary" />
        </div>

        {/* Maat */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Maat</label>
          <div className="grid grid-cols-5 gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => setMaat(s)}
                className={cn("py-2 rounded-xl text-xs font-bold border transition-all",
                  maat === s ? "bg-primary text-white border-primary" : "border-slate-100 dark:border-slate-700 text-slate-500")}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Kleur */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500">Kleur (optioneel)</label>
          <div className="flex flex-wrap gap-2">
            {KLEUREN.map(k => (
              <button key={k.naam} onClick={() => setKleur(kleur === k.naam ? "" : k.naam)}
                className={cn("w-8 h-8 rounded-full transition-all", k.border ? "border-2 border-slate-200" : "",
                  kleur === k.naam ? "ring-2 ring-offset-2 ring-primary scale-110" : "")}
                style={{ backgroundColor: k.hex }} title={k.naam} />
            ))}
          </div>
          {kleur && <p className="text-xs font-bold text-primary">Geselecteerd: {kleur}</p>}
        </div>

        {/* Conditie */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Conditie</label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map(c => (
              <button key={c} onClick={() => setConditie(c)}
                className={cn("py-3 px-3 rounded-xl text-xs font-bold border-2 transition-all text-left leading-tight",
                  conditie === c ? "bg-primary/10 text-primary border-primary/30" : "border-slate-100 dark:border-slate-700 text-slate-600")}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Prijs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-500">Prijs</label>
            <div className="flex items-center gap-2">
              <Switch id="bieden" checked={biedenToegestaan} onCheckedChange={setBiedenToegestaan} className="data-[state=checked]:bg-primary" />
              <Label htmlFor="bieden" className="text-xs font-bold text-slate-400">Bieden toegestaan</Label>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">€</span>
            <input type="number" value={prijs} onChange={e => setPrijs(e.target.value)}
              placeholder="0,00"
              className="w-full h-14 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xl font-bold outline-none focus:border-primary" />
          </div>
        </div>

        {/* Zichtbaarheid */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <div>
            <p className="font-bold text-sm text-slate-800 dark:text-white">Artikel zichtbaar</p>
            <p className="text-xs text-slate-400">Zet uit om te verbergen zonder te verwijderen</p>
          </div>
          <Switch checked={actief} onCheckedChange={setActief} className="data-[state=checked]:bg-emerald-500" />
        </div>

        {/* Promoot sectie */}
        <div className={cn(
          "rounded-2xl border-2 overflow-hidden transition-all",
          gepromoot && promotieDuur ? "border-amber-400 bg-amber-50 dark:bg-amber-900/10" : "border-slate-100 dark:border-slate-800"
        )}>
          {/* Header */}
          <div className="p-4 flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              gepromoot && promotieDuur ? "bg-amber-400" : "bg-slate-100 dark:bg-slate-800"
            )}>
              <Crown className={cn("w-5 h-5", gepromoot && promotieDuur ? "text-white" : "text-slate-400")} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">Advertentieruimte inkopen</p>
              <p className="text-xs text-slate-400 mt-0.5">Verschijn als eerste in Ontdekken</p>
            </div>
          </div>

          {/* Duur keuze */}
          <div className="px-4 pb-4 space-y-2">
            {([
              { dagen: 3, prijs: "€2,99", label: "3 dagen" },
              { dagen: 7, prijs: "€4,99", label: "7 dagen" },
            ] as const).map(optie => {
              const isActief = gepromoot && promotieDuur === optie.dagen;
              return (
                <button
                  key={optie.dagen}
                  type="button"
                  onClick={() => {
                    if (isActief) { setGepromoot(false); setPromotieDuur(null); }
                    else { setGepromoot(true); setPromotieDuur(optie.dagen); }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all",
                    isActief
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                      : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                      isActief ? "border-amber-500 bg-amber-500" : "border-slate-300 dark:border-slate-600"
                    )}>
                      {isActief && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="text-left">
                      <p className={cn("text-sm font-bold", isActief ? "text-amber-800 dark:text-amber-300" : "text-slate-700 dark:text-slate-200")}>
                        {optie.label} zichtbaarheid
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Gouden badge · Altijd bovenaan</p>
                    </div>
                  </div>
                  <span className={cn("text-base font-black shrink-0", isActief ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-white")}>
                    {optie.prijs}
                  </span>
                </button>
              );
            })}

            {gepromoot && promotieDuur && (
              <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 rounded-xl px-3 py-2 mt-1">
                <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Promotie actief voor {promotieDuur} dagen na opslaan. Betaling via Mollie (binnenkort).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verwijder sectie */}
        <div className="pt-2 space-y-2">
          <button
            onClick={verwijderArtikel}
            disabled={verwijderen}
            className={cn("w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2",
              bevestigVerwijder
                ? "bg-red-500 text-white border-red-500"
                : "border-red-200 text-red-400")}
          >
            {verwijderen ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {bevestigVerwijder ? "Definitief verwijderen" : "Artikel verwijderen"}
          </button>
          {bevestigVerwijder && (
            <button onClick={() => setBevestigVerwijder(false)} className="w-full text-center text-sm text-slate-400 font-medium">
              Annuleren
            </button>
          )}
        </div>
      </main>

      {/* Opslaan knop */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={slaOp}
          disabled={opslaan || !titel || !prijs}
          className={cn("w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all",
            !opslaan && titel && prijs
              ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]"
              : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed")}
        >
          {opslaan ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          {opslaan ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </div>
    </div>
  );
}
