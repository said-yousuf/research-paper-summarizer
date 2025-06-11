/* eslint-disable @typescript-eslint/no-explicit-any */
import { orClient } from '@/lib/openrouter';
import { extractPdfPages } from '@/lib/pdf';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

const BodySchema = z.object({
  pdfBase64: z.string().min(1),
});
type Body = z.infer<typeof BodySchema>;

export async function POST(request: NextRequest) {
  // Validate request body
  let body: Body;
  try {
    const json = await request.json();
    body = BodySchema.parse(json);
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          typeof err === 'object' &&
          err !== null &&
          'errors' in err &&
          Array.isArray((err as any).errors)
            ? (err as any).errors[0].message
            : 'Invalid JSON body',
      },
      { status: 400 }
    );
  }

  try {
    // Decode Base64 and extract pages
    const buffer = Buffer.from(body.pdfBase64, 'base64');
    const pages = await extractPdfPages(buffer);

    // Combine all page text into a single string
    const fullText = pages.join('\n\n');

    // Call OpenRouter with the extracted text
    const response = await orClient.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant specialized in analyzing and summarizing academic papers. 
1. First, inspect the text and verify that it follows a valid research-paper structure (e.g., Abstract, Introduction, Methods/Materials, Results, Discussion, Conclusion). 
2. If any key section is missing or out of order, respond with a concise diagnostic listing the missing or misordered sections and do not proceed to summarization. 
3. If the structure is valid, generate a broad, high-level summary that covers:
   - The paper’s main objectives and research questions
   - Key methods and approach
   - Principal findings and contributions
   - Implications, significance, and potential future directions`,
        },
        {
          role: 'user',
          content: `Here is the full text of the paper:\n\n${fullText}`,
        },
      ],

      temperature: 0.2,
    });

    const summary = response.choices[0].message.content?.trim() ?? '';
    return NextResponse.json({ summary }, { status: 200 });
  } catch (err: unknown) {
    console.error('/api/paper error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
