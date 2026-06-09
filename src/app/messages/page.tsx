
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  SquarePen, 
  ChevronRight, 
} from "lucide-react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  {
    id: "1",
    user: "Sophie V.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeWaIURUP4rULHUxaRJIxmtY1SKJ7Wvx6vOCxnGxRtTp1dG67_Oz6g_4EMP-pRQOUgDE9ehlACR5elJ8PKLNIrXACOCrs4wNXcJiT8G70SeJXhQRhhAx6YOVwf61iMKeFC912lGkp9UczvMwJH0y3lXH64RP3CN0woScltCsJci8W1cz5fazdnwmnsSZt_hW-duR3aqwKBXX4aqYXyGu58e_BdT9Q3Ik9YQnCAVkbgt_BpB7lb34fjJDKHJUdsXj8ZIAuALcIeHi8",
    lastMessage: "Ik heb de jas zojuist op de post gedaan!",
    time: "10:45",
    unread: true,
    type: "Kopen",
    status: "Verzonden",
    item: "Patagonia Winterjas"
  },
  {
    id: "2",
    user: "Marc de Groot",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLV8vvhTMT8FHaBKBnLhUdlPDNc12HmE36JHGEuRotXUV_qsHcKmWE07Ft1TaxgxKxqP8zEupEGiArP8m-qjw7ycI6QLUaKFnJoIExI0x7_isFT22ZAldZRdZoKwluRiAR8AVLFxrv5YARCXsPoTQ0ISsHwWtAGsKDa7ThJJCpOTD19Ua6WnUH4SOiDU0tyWIoAPZ5OTPKBDZsdN68Q0SAta01yiWKN4jR-1jyY_5E2L6WjeW3scM8Mu5GfIQAzp9W29k7SdJgRVU",
    lastMessage: "U: Is de set nog compleet?",
    time: "Gister",
    unread: false,
    type: "Kopen",
    status: "In afwachting",
    item: "Houten Blokkenset"
  },
  {
    id: "3",
    user: "Emma Bakker",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8D3gz5dgxlzo0aUBHJiwFYiq2yoGLs8pZfKpWZbuivILcyvPbt53iI2SSCYfFF8Q6h6pK_-t3kPYVauiioM8l5atuAZvzx4q_Vzsi70IQG8wGQHpORnEgzUBb-svVlJYXw0OLJePoALMSEnt8lCObDra8uW5rDi2Yq3L07Ruah_SFDY20-KPaQgJOecVR-QQUOKRElwoyJA09JjhQweM_jkwMvEOTUgWONqN3BFjc-QhIrsZbasoN_BzuKihYptbUkh5e7hy4nWU",
    lastMessage: "Bedankt voor de snelle afhandeling!",
    time: "Maandag",
    unread: false,
    type: "Verkopen",
    status: "Ontvangen",
    item: "Wollen Baby Trui"
  },
  {
    id: "4",
    user: "Thomas de Lange",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCSCH1bEXHaHKpKk-Rc7rZcViXxoZ_AThTy3YwSulJSNLuIDGVtHJmiiHbMe-dunsB2FSUqM4Je2xELC-SikaS5DkYm1peQV4WxB-0U6oSCWWCvBsZwsyruExhcSpGI9_9TyP0cw9qKDgBuMkeElKLj7hniox6Qylh9jfKSXIKWtde1IO-dIXAzvbvSC49zyJU-EfTbO3EJEx2Dcew2dXDmG0B9Lc7kw0pj8wx3K3TOXQG-IqKTT03eTQvGLN7YjVoMzc0MVIpggM",
    lastMessage: "Het geld staat binnen 2 dagen op je rekening.",
    time: "2 jan",
    unread: false,
    type: "Verkopen",
    status: "Betaald",
    item: "Looprek"
  }
];

export default function MessagesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("Alle");

  const filteredMessages = MESSAGES.filter(msg => {
    if (filter === "Alle") return true;
    return msg.type === filter;
  });

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="px-6 pt-2 pb-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-[800] tracking-tight text-slate-800 dark:text-slate-100">Berichten</h1>
          <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark active:scale-95 transition-transform">
            <SquarePen className="w-5 h-5" />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-dark transition-colors" />
          <Input 
            className="w-full bg-white dark:bg-slate-800/50 border-none rounded-xl py-6 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/30 placeholder:text-slate-400 transition-all shadow-sm"
            placeholder="Zoek in gesprekken..."
          />
        </div>
      </header>

      <div className="flex gap-3 px-6 pb-6 overflow-x-auto no-scrollbar">
        {["Alle", "Kopen", "Verkopen"].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm whitespace-nowrap",
              filter === f ? "bg-primary text-white shadow-primary/20" : "bg-white dark:bg-slate-800 text-slate-500"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <main className="px-6 space-y-5">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            Geen berichten gevonden in deze categorie.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => router.push(`/messages/${msg.id}`)}
              className={cn(
                "bg-white dark:bg-slate-800/40 p-4 rounded-2xl flex gap-4 items-center border border-slate-50 dark:border-slate-800/50 shadow-sm cursor-pointer active:scale-[0.98] transition-transform",
                msg.unread && "border-primary/20 bg-primary/5"
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="w-14 h-14 border-2 border-primary/10">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback>{msg.user[0]}</AvatarFallback>
                </Avatar>
                {msg.unread && (
                  <div className="absolute top-0 -right-1 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={cn("text-[15px] truncate", msg.unread ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300")}>
                    {msg.user}
                  </h3>
                  <span className={cn("text-[11px]", msg.unread ? "text-primary-dark font-bold" : "text-slate-400 font-medium")}>
                    {msg.time}
                  </span>
                </div>
                
                <p className={cn("text-[13px] truncate mb-2", msg.unread ? "font-bold text-slate-800 dark:text-slate-200" : "font-normal text-slate-500 dark:text-slate-400")}>
                  {msg.lastMessage}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    msg.status === "In afwachting" 
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600" 
                      : "bg-primary/15 text-primary-dark border-primary/10"
                  )}>
                    {msg.status}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 truncate tracking-tight">
                    {msg.item}
                  </span>
                </div>
              </div>
              
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </div>
          ))
        )}
      </main>
    </div>
  );
}
