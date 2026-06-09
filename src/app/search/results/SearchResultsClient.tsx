"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Heart,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ALL_PRODUCTS } from "@/app/lib/products";
import { useState, useMemo } from "react";

export default function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);

  const filteredResults = useMemo(() => {
    if (!query) return ALL_PRODUCTS;

    const lowerQuery = query.toLowerCase();
    const queryParts = lowerQuery.split(" ").filter((part) => part.length > 0);

    return ALL_PRODUCTS.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
      const brandMatch = product.brand.toLowerCase().includes(lowerQuery);

      const multiPartMatch = queryParts.every(
        (part) =>
          product.title.toLowerCase().includes(part) ||
          product.category.toLowerCase().includes(part) ||
          product.description.toLowerCase().includes(part)
      );

      return titleMatch || categoryMatch || brandMatch || multiPartMatch;
    });
  }, [query]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      router.push(`/search/results?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex flex-col font-sans">
      <header className="px-4 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <Input
              className="block w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-0 h-10"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Zoeken..."
            />
          </div>
          <button className="flex items-center gap-1 px-3 py-2 border border-primary text-primary rounded-full text-xs font-semibold whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-32 no-scrollbar">
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {filteredResults.length}{" "}
            {filteredResults.length === 1 ? "resultaat" : "resultaten"} voor
            &apos;{query}&apos;
          </h2>
        </div>

        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Niets gevonden
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              We konden geen producten vinden die voldoen aan je zoekopdracht.
              Probeer een andere term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {filteredResults.map((item) => (
              <div
                key={item.id}
                className="flex flex-col group cursor-pointer"
                onClick={() => router.push(`/product/${item.id}`)}
              >
                <div className="relative aspect-[3/4] mb-2 overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-800">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 rounded-full shadow-sm"
                  >
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  </button>
                  {item.verified && (
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-slate-100">
                        <ShieldCheck className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                        <span className="text-[8px] font-black text-gray-700 uppercase">
                          Verified
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 px-1">
                  <span className="text-lg font-bold text-primary">
                    € {item.price.toFixed(2).replace(".", ",")}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      {item.brand} • {item.size}
                    </span>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-primary" />
                      <span className="text-[11px] font-bold text-gray-400">
                        {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}