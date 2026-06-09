
"use client";

import { useRouter } from "next/navigation";
import { X, Send, Bot, User, Loader2, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { askAssistant } from "@/ai/flows/assistant-flow";
import { cn } from "@/lib/utils";

export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: 'Hallo! 👋 Welkom bij Noah & Emma. Ik ben je persoonlijke assistent. Waar kan ik je vandaag mee helpen?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSend(textOverride?: string) {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim() || isLoading) return;

    setInput('');
    const updatedMessages = [...messages, { role: 'user', text: messageToSend }] as { role: 'user' | 'assistant', text: string }[];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Map history for Genkit
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user' as 'user' | 'model',
        text: m.text
      }));

      const { reply } = await askAssistant({ 
        message: messageToSend,
        history: history
      });
      
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (error) {
      console.error('AI Chat Page Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Oeps, er ging iets mis. Kun je het opnieuw proberen?' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col h-screen overflow-hidden">
      <header className="sticky top-0 z-10 px-6 pt-12 pb-4 flex items-center justify-between border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="w-6 h-6" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Noah & Emma AI Assistant</h1>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online • Antwoordt direct</p>
          </div>
        </div>
        <button 
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-primary/20 text-slate-500 dark:text-primary"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 no-scrollbar">
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vandaag</span>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex items-end gap-2 max-w-[85%]",
            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
          )}>
            <div className={cn(
              "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm",
              msg.role === 'assistant' ? "bg-slate-200 dark:bg-slate-700 text-slate-500" : "bg-primary/20 text-primary"
            )}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-4 rounded-xl shadow-sm border text-sm leading-relaxed",
              msg.role === 'assistant' 
                ? "bg-white dark:bg-slate-800 rounded-bl-none border-slate-100 dark:border-slate-700" 
                : "bg-primary text-white rounded-br-none border-primary shadow-primary/10"
            )}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-2 max-w-[85%] mr-auto">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-500">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl rounded-bl-none border border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-slate-400">Bezig met nadenken...</span>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-background-dark pb-10 pt-2 border-t border-primary/5 shadow-2xl shrink-0">
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          {["Betaalstatus checken", "Abonnement opzeggen", "Hoe werkt verkopen?"].map((action) => (
            <button 
              key={action}
              onClick={() => handleSend(action)}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>

        <div className="px-4 flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full h-11 pl-5 pr-12 rounded-full border-0 bg-slate-100 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400" 
              placeholder="Typ je bericht..." 
              type="text"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1 w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
