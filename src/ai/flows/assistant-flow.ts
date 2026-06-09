
'use server';
/**
 * @fileOverview Een Genkit flow voor de Kids Market AI assistent die contextuele antwoorden geeft.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

const AssistantInputSchema = z.object({
  message: z.string().describe('Het bericht van de gebruiker.'),
  history: z.array(MessageSchema).optional().describe('Eerdere berichten in de chat voor context.'),
});

const AssistantOutputSchema = z.object({
  reply: z.string().describe('Het antwoord van de AI assistent.'),
});

export async function askAssistant(input: z.infer<typeof AssistantInputSchema>) {
  return assistantFlow(input);
}

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async input => {
    const history = input.history || [];
    
    const systemPrompt = `Je bent de vriendelijke AI-assistent van 'Noah & Emma', een marktplaats voor tweedehands kinderspullen (vergelijkbaar met Vinted maar dan voor kinderen). 
    Je helpt gebruikers met vragen over kopen, verkopen, verzenden, kopersbescherming of het gebruik van de app.
    
    Belangrijke informatie:
    - Kopersbescherming: Wij houden geld vast tot het pakketje binnen is.
    - Verzending: Kan via PostNL (thuis) of DHL (afhaalpunt).
    - Premium: Kost €5 per maand en geeft onbeperkt swipen en vroege toegang tot advertenties.
    
    Houd je antwoorden kort, behulpzaam, empathisch (als een ouder naar een andere ouder) en altijd in het Nederlands.`;

    const {output} = await ai.generate({
      system: systemPrompt,
      history: history.map(m => ({
        role: m.role,
        content: [{ text: m.text }]
      })),
      prompt: input.message,
      output: {schema: AssistantOutputSchema},
    });

    if (!output) {
      throw new Error('Geen antwoord ontvangen van de AI.');
    }

    return output;
  }
);
