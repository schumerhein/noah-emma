
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, MoreHorizontal, ShoppingBag, MapPin, Star, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SalesRequestPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleAccept = () => {
    toast({
      title: "Verzoek geaccepteerd!",
      description: "De koper krijgt nu een melding om de betaling af te ronden.",
    });
    setTimeout(() => router.push('/orders/1'), 1500);
  };

  return (
    <div className="bg-background dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-32">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 flex items-center justify-between z-40 border-b border-primary/5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-primary/10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Verkoopverzoek</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-primary/10">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </nav>

      <main className="pt-20">
        <div className="bg-primary/5 dark:bg-primary/10 px-5 py-4 border-b border-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">Nieuw verzoek van de 'Berichten' tab</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vandaag, 10:24</p>
            </div>
          </div>
        </div>

        <section className="p-8 text-center flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-2xl mb-5">
            <Image 
              alt="Vintage Lederen Handtas" 
              fill
              className="object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpsvo1eCpnJ3bsWLfSTIoniIFLf7O75gVabcLHMy3kM24mS2yE-d6_OJAaO_TYLp1DY-gtFU-Hp86WEDCDnQ5Ob5Mv9GgeUfhJlATYV0CREnMsU73lnHO5fvWOnsK39uQQ5DL25YOc2zGnZQajZ-zgssPeujcpLC4fqHhRHFupNuRH1_DgKHdbCW7Jy0ojfsU6PMeHjsmHZX8lHQmYjdLXh1evu3-cnAOak-eTGTbCDbhalHK-pXalZDceLFy3Q_YBv_GdbbEPzbU"
            />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Vintage Lederen Handtas</h2>
          <div className="mt-2 text-primary font-black text-3xl">€85.00</div>
        </section>

        <section className="px-5 mb-6">
          <div className="bg-white dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Interesse van koper</p>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/5 shrink-0">
                <Image 
                  alt="Koper profiel" 
                  fill
                  className="object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqTtXjKHQuJ-0GkMxyjbRbPCfS1AkDVSfqW7jkUlDODp7ZjmAOjvseVEE9biulqEnSYF06ZiUGsXvnedPtQdQp4qNhnz5TotKv1Yc26Z1fWp5AzK9GGnjvsrD6sb4mgXexfQj6QyRc2ljnfNr0_elR6OuC8T7mXfK0ye50MDRgT8fEYR6c9obFv3ddj3rUosDnmfRHaVpSQUWpslqWo3uH4k3w85w3ZLRXVIjji-3XeBwGW7QGqajKBSyUexygDAFHKVd1EWZFzoc"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg truncate">Sophie de Vries</h3>
                  <div className="bg-green-500 w-2.5 h-2.5 rounded-full shrink-0"></div>
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Amsterdam, NL</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-primary">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    <Star className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold ml-1">4.9</span>
                  <span className="text-[10px] text-slate-400 ml-1">(42)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5">
          <div className="mb-5 flex gap-3 bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Door te accepteren, krijgt de koper de mogelijkheid om te betalen. 
              <span className="font-bold text-slate-800 dark:text-white"> Je reviews bepalen je zichtbaarheid in het algoritme.</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleAccept}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold rounded-2xl h-14 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 border-none"
            >
              Accepteren
              <CheckCircle className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-slate-200 dark:border-zinc-800 text-slate-500 font-bold"
              onClick={() => router.back()}
            >
              Weigeren
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
