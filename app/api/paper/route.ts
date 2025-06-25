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
          content: `
You are a helpful assistant specialized in analyzing and summarizing academic papers.

=== Section 1: Structure Verification ===
1. Inspect the provided text and verify it follows a valid research-paper structure:
   - Abstract
   - Introduction
   - Methods (or Materials and Methods)
   - Results
   - Discussion
   - Conclusion
2. If any key section is missing, misnamed, or out of order, respond with a concise diagnostic listing those issues (e.g. "Missing Methods section", "Discussion appears before Results").

=== Section 2: Summarization (Long Form) ===
After the structure analysis, produce a thorough, long-form summary that covers:
- The paper's main objectives and research questions
- Detailed description of key methods and approach
- Principal findings and contributions, with specifics
- Implications, significance, and potential future directions
- Any notable strengths or limitations you observe

Format your response EXACTLY as follows:

=== STRUCTURE ANALYSIS ===
[Your structure analysis here]

=== SUMMARY ===
[Your detailed summary here]`.trim(),
        },
        {
          role: 'user',
          content: `Here is the full text of the paper:\n\n${fullText}`,
        },
      ],
      temperature: 0.2,
    });

    // Parse the AI's response
    const aiResponse = response.choices[0].message.content?.trim() || '';
    
    // Extract structure analysis and summary sections
    let structureAnalysis = 'No structure analysis available.';
    let summary = 'No summary available.';
    
    const structureMatch = /=== STRUCTURE ANALYSIS ===\s*([\s\S]*?)(?=\n=== SUMMARY ===|$)/i.exec(aiResponse);
    const summaryMatch = /=== SUMMARY ===\s*([\s\S]*)/i.exec(aiResponse);
    
    if (structureMatch && structureMatch[1]) {
      structureAnalysis = structureMatch[1].trim();
    }
    
    if (summaryMatch && summaryMatch[1]) {
      summary = summaryMatch[1].trim();
    } else if (!structureMatch) {
      // If the response doesn't follow the expected format, use the whole response as summary
      summary = aiResponse.trim();
    }

    return NextResponse.json(
      { 
        summary: summary,
        fullSummary: summary,
        compliance: structureAnalysis 
      }, 
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('/api/paper error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
