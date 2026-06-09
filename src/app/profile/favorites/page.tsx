
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, MessageCircle, SlidersHorizontal, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FAVORITES = [
  {
    id: "f1",
    title: "Biologisch katoen trui",
    price: 14.50,
    size: "92/98",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzAb08zkPOfGg6Vdd4UTZG0xwR6Fa9l1LQnyA07wRXMVSxJR-O0jjFawVn4OhMUtR_qNeWb4MbsFbyM4RaWj6qmWLdB0ZMUcKKlCigcHBVACLgXvaSML4u0Es6zeNnOllwNL96fCYU3gcT4IRPnsxAbMVMMc_ihmvDWIiJNki_kdyjJ5JJKNrvV9Vk9KVeC9HgSp8sT4yYmKJGTz3yY4H0AEu_CfKRrEJDzLmtk2VNJh0nn_2Mr3rKh2_F5DeG8NcK3aim5W6oQDs",
    premium: true
  },
  {
    id: "f2",
    title: "Stoer spijkerjack",
    price: 22.00,
    size: "110",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfSoLiWLNF-xPUNCl0S0NNJZv7x1q9mUzbVYh4vcRBwYUvu8rctqz1MVvdi5PwTQb2a-vOELnV3Rhp8xNQjHc0QVi0S7DunnZx9gMLGE21XaXOFK0ejRreAl3v71gIoJJQLdu-Yn5sIoDYXkhZoT5sbHbGyhi9a_drp1c3xLPIvnaYy9J12Ux9Y9miz-pfYDzTb4P8Ohn7rEAiALkjg9rdFrTtoj539FqJkRwK_dsQN42SmQwah439g--7X5oiv5s4tLhomVJoBSo",
    premium: false
  },
  {
    id: "f3",
    title: "Wollen muts handgemaakt",
    price: 8.00,
    size: "One size",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGuOYW95spqL3V3Ujttst1XkA_upFw3zck-JZrxjYOBEj50mpupb6DGJFctEqDxnY3MYQ_xfKNJFCLU-bKlaSMF9hgO9nguE0frg-PZMFT867kXmlykwSY3jBIQMD99iaqTkUvMA25Xuh7nCPVpLClOnvWoN-XriWhZY0ZSsCwk4UKOhjJKGt-qbgY6IexFyPRsnBOHm0CYs5AS2z6K7tLkjv2JMVXGMCZtcccLXcy9ufPRXTj7zBnpz39xAcnekqQ84OvTQB-o6Q",
    premium: false
  },
  {
    id: "f4",
    title: "Gele regenlaarsjes",
    price: 12.50,
    size: "24",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA95GySa12qteHgMIWAq2D4F_qAcvB2D_5aSvKhrY4Ho_IsBWJ6obnaUchhPTI287XQkkYGAy2wNRc8UQ4kxRvhGyrZ2zDfijy3C52y5HR4t2DHFOPR5o7aOmDLpf2EZkWKiKSZwNuUxCSps6a8yOcsanuQB1H8zPQ5cGbcHCnmAgSqoQCW0F3nszO4uRlphJMso4OS1yb573TOudsrZibXF7njJ4qWd4fQEZMzn9der9_LnfmT3jg9gsiFgyzP18oT39Gg0IKGfrs",
    premium: false
  }
];

export default function FavoritesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("Alle items");

  return (
    <div className="bg-background-light dark:bg-background-dark text-pink-950 dark:text-pink-50 min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-pink-100 dark:border-pink-900/30">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="p-2 -ml-2 text-pink-600">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight">Mijn Favorieten</h1>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {["Alle items", "Liam (Maat 92)", "Sophie (Maat 116)", "Jassen"].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                filter === f 
                  ? "bg-primary text-white shadow-sm shadow-primary/20" 
                  : "bg-white dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 mb-24">
        <div className="grid grid-cols-2 gap-4">
          {FAVORITES.map((item) => (
            <div key={item.id} className="group relative flex flex-col" onClick={() => router.push(`/product/${item.id}`)}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-pink-50 dark:bg-pink-900/10 shadow-sm">
                <Image fill src={item.image} alt={item.title} className="object-cover" />
                <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-black/50 rounded-full text-primary shadow-sm">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                {item.premium && (
                  <div className="absolute bottom-2 left-2 bg-primary/90 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Premium
                  </div>
                )}
              </div>
              <div className="mt-2.5 px-1">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-lg text-slate-900 dark:text-white">€{item.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-[10px] bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-300 px-2 py-0.5 rounded font-bold uppercase">
                    {item.size}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
