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
    console.log(`Extracted ${pages.length} pages from PDF`);

    // Combine all page text into a single string
    const fullText = pages.join('\n\n');
    console.log(`Combined text length: ${fullText.length} characters`);
    console.log(`First 500 characters: ${fullText.slice(0, 500)}`);

    // Call OpenRouter with the extracted text
    const response = await orClient.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: `Summarize the following research paper text:\n\n${fullText}`,
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
