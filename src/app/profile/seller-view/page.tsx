
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Package, 
  MessageCircle, 
  Edit3, 
  Heart,
  Plus,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_PRODUCTS } from "@/app/lib/products";

const MOCK_REVIEWS = [
  {
    id: "r1",
    user: "Emma B.",
    rating: 5,
    comment: "Super blij met het jasje! Was precies zoals beschreven en heel netjes verpakt.",
    date: "2 weken geleden",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8D3gz5dgxlzo0aUBHJiwFYiq2yoGLs8pZfKpWZbuivILcyvPbt53iI2SSCYfFF8Q6h6pK_-t3kPYVauiioM8l5atuAZvzx4q_Vzsi70IQG8wGQHpORnEgzUBb-svVlJYXw0OLJePoALMSEnt8lCObDra8uW5rDi2Yq3L07Ruah_SFDY20-KPaQgJOecVR-QQUOKRElwoyJA09JjhQweM_jkwMvEOTUgWONqN3BFjc-QhIrsZbasoN_BzuKihYptbUkh5e7hy4nWU"
  },
  {
    id: "r2",
    user: "Marc de G.",
    rating: 4,
    comment: "Snelle verzending en goede communicatie. Item in top staat.",
    date: "1 maand geleden",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLV8vvhTMT8FHaBKBnLhUdlPDNc12HmE36JHGEuRotXUV_qsHcKmWE07Ft1TaxgxKxqP8zEupEGiArP8m-qjw7ycI6QLUaKFnJoIExI0x7_isFT22ZAldZRdZoKwluRiAR8AVLFxrv5YARCXsPoTQ0ISsHwWtAGsKDa7ThJJCpOTD19Ua6WnUH4SOiDU0tyWIoAPZ5OTPKBDZsdN68Q0SAta01yiWKN4jR-1jyY_5E2L6WjeW3scM8Mu5GfIQAzp9W29k7SdJgRVU"
  }
];

export default function SellerViewPage() {
  const router = useRouter();

  // Mock: Sanne's ads (we take a subset of products)
  const myAds = ALL_PRODUCTS.slice(0, 3);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-primary/10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest">Mijn Winkel</h1>
        <button 
          onClick={() => router.push('/profile/edit')}
          className="p-2 text-primary"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </header>

      <main className="pb-32">
        {/* Profile Header */}
        <section className="px-6 pt-8 pb-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/20 p-1">
              <Avatar className="w-full h-full border-2 border-white dark:border-slate-800 shadow-xl">
                <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLV8vvhTMT8FHaBKBnLhUdlPDNc12HmE36JHGEuRotXUV_qsHcKmWE07Ft1TaxgxKxqP8zEupEGiArP8m-qjw7ycI6QLUaKFnJoIExI0x7_isFT22ZAldZRdZoKwluRiAR8AVLFxrv5YARCXsPoTQ0ISsHwWtAGsKDa7ThJJCpOTD19Ua6WnUH4SOiDU0tyWIoAPZ5OTPKBDZsdN68Q0SAta01yiWKN4jR-1jyY_5E2L6WjeW3scM8Mu5GfIQAzp9W29k7SdJgRVU" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black">Sanne de Vries</h2>
            <div className="flex items-center justify-center gap-1 text-sm text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Utrecht, NL</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <span className="text-xs font-bold text-slate-400">4.9 (124 reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 w-full pt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-black">{myAds.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Te koop</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-black">48</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verkocht</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-black">124</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviews</span>
            </div>
          </div>
        </section>

        <section className="px-4">
          <Tabs defaultValue="ads" className="w-full">
            <TabsList className="w-full bg-slate-100 dark:bg-slate-800 p-1 rounded-xl h-12">
              <TabsTrigger value="ads" className="flex-1 rounded-lg text-xs font-bold uppercase">Advertenties</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 rounded-lg text-xs font-bold uppercase">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ads" className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                {myAds.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white dark:bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm"
                    onClick={() => router.push(`/product/${item.id}`)}
                  >
                    <div className="relative aspect-[4/5]">
                      <Image fill src={item.images[0]} alt={item.title} className="object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button className="p-1.5 bg-white/80 dark:bg-black/50 rounded-full backdrop-blur-sm shadow-sm">
                          <Edit3 className="w-3.5 h-3.5 text-slate-600 dark:text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <span className="text-sm font-black text-primary">€{item.price.toFixed(2).replace('.', ',')}</span>
                      <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 uppercase font-black">{item.size} • {item.condition}</p>
                    </div>
                  </div>
                ))}
                
                {/* Add New Ad Card */}
                <button 
                  onClick={() => router.push('/sell')}
                  className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 gap-3 active:scale-[0.98] transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Nieuw item</span>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-4">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xs font-bold">{review.user}</h4>
                        <div className="flex text-amber-400 mt-0.5">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{review.date}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{review.comment}</p>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full text-xs font-bold text-primary uppercase">
                Toon alle 124 reviews <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
