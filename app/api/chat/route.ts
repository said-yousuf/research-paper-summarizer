import { orClient } from '@/lib/openrouter';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema),
  paperContent: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { messages, paperContent } = RequestSchema.parse(json);

    // Prepare system message with paper context
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful research assistant. Use the following paper content to answer questions accurately. If the answer isn't in the paper, say so.
      
Paper Content:
${paperContent || 'No paper content provided.'}`,
    };

    const response = await orClient.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
    });

    return NextResponse.json({
      message: response.choices[0].message,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
