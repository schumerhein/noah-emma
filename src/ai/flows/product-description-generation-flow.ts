'use server';
/**
 * @fileOverview A Genkit flow for generating detailed product descriptions based on a title and product photos.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - ProductDescriptionGenerationInput - The input type for the generateProductDescription function.
 * - ProductDescriptionGenerationOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductDescriptionGenerationInputSchema = z.object({
  title: z.string().describe('The basic title of the product.'),
  photoDataUris: z
    .array(z.string())
    .min(1)
    .describe(
      "An array of product photos, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ProductDescriptionGenerationInput = z.infer<
  typeof ProductDescriptionGenerationInputSchema
>;

const ProductDescriptionGenerationOutputSchema = z.object({
  description: z
    .string()
    .describe('A detailed product description generated from the title and photos.'),
});
export type ProductDescriptionGenerationOutput = z.infer<
  typeof ProductDescriptionGenerationOutputSchema
>;

export async function generateProductDescription(
  input: ProductDescriptionGenerationInput
): Promise<ProductDescriptionGenerationOutput> {
  return productDescriptionGenerationFlow(input);
}

const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: {schema: ProductDescriptionGenerationInputSchema},
  output: {schema: ProductDescriptionGenerationOutputSchema},
  prompt: `You are an AI assistant for a kids' market app called 'Kids Market'. Your task is to generate a detailed and engaging product description for a used children's item.

Consider the provided product title and analyze the accompanying product photos to extract relevant details about the item's appearance, condition, and potential use. Your description should be:
- Descriptive and appealing to potential buyers.
- Highlight key features and benefits.
- Mention the condition (e.g., "gently used", "like new", "some wear").
- Be concise but informative.
- Always output the description in JSON format as specified by the output schema.

Product Title: {{{title}}}

Product Photos:
{{#each photoDataUris}}
  {{media url=this}}
{{/each}}
`,
});

const productDescriptionGenerationFlow = ai.defineFlow(
  {
    name: 'productDescriptionGenerationFlow',
    inputSchema: ProductDescriptionGenerationInputSchema,
    outputSchema: ProductDescriptionGenerationOutputSchema,
  },
  async input => {
    const {output} = await productDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate product description.');
    }
    return output;
  }
);
