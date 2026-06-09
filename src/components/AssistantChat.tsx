'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HelpCircle, Send, Loader2, Bot, User } from 'lucide-react';
import { askAssistant } from '@/ai/flows/assistant-flow';

export function AssistantChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    
    // Voeg gebruikersbericht toe aan lokale staat
    const updatedMessages = [...messages, { role: 'user', text: userMsg }] as { role: 'user' | 'assistant', text: string }[];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Map lokale berichten naar Genkit formaat (user/model)
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user' as 'user' | 'model',
        text: m.text
      }));

      const response = await askAssistant({ 
        message: userMsg,
        history: history
      });
      
      setMessages(prev => [...prev, { role: 'assistant', text: response.reply }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, er ging iets mis met mijn verbinding. Kun je het nog eens proberen?' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-32 right-6 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 active:scale-90 transition-transform z-40">
          <HelpCircle className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            Kids Market Assistent
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 py-10">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Hoe kan ik je vandaag helpen met je kleine schatten?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.role === 'assistant' && <Bot className="w-5 h-5 shrink-0 mt-1" />}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {msg.role === 'user' && <User className="w-5 h-5 shrink-0 mt-1" />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-slate-500">Aan het typen...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-white dark:bg-slate-900 pb-10">
          <div className="flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Typ je vraag..."
              className="rounded-xl"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="rounded-xl px-4 bg-primary hover:bg-primary-dark">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
