'use server';
/**
 * @fileOverview A Genkit flow for automatically detecting and blurring faces in product photos to protect privacy.
 *
 * - blurFacesInPhoto - A function that handles the face blurring process.
 * - BlurFacesInPhotoInput - The input type for the blurFacesInPhoto function.
 * - BlurFacesInPhotoOutput - The return type for the blurFacesInPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const BlurFacesInPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type BlurFacesInPhotoInput = z.infer<typeof BlurFacesInPhotoInputSchema>;

const BlurFacesInPhotoOutputSchema = z.object({
  blurredPhotoDataUri: z.string().describe("The data URI of the photo with detected faces blurred."),
  facesDetected: z.boolean().describe("Whether any faces were detected and blurred in the photo."),
});
export type BlurFacesInPhotoOutput = z.infer<typeof BlurFacesInPhotoOutputSchema>;

export async function blurFacesInPhoto(input: BlurFacesInPhotoInput): Promise<BlurFacesInPhotoOutput> {
  return blurFacesInPhotoFlow(input);
}

const blurFacesInPhotoFlow = ai.defineFlow(
  {
    name: 'blurFacesInPhotoFlow',
    inputSchema: BlurFacesInPhotoInputSchema,
    outputSchema: BlurFacesInPhotoOutputSchema,
  },
  async input => {
    const { text, media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-image'),
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: 'Detect all human faces in this image and apply a blur effect to them. If you detect and blur faces, respond with "true". If no faces are detected, respond with "false". Return the modified image.' },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Failed to get a modified image from the AI. No media URL found.');
    }

    const facesDetected = text?.toLowerCase().trim() === 'true';

    return {
      blurredPhotoDataUri: media.url,
      facesDetected: facesDetected,
    };
  }
);
