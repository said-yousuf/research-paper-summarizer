// lib/openrouter.ts
import OpenAI from 'openai';

export const orClient = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL!,
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? '',
    'X-Title': process.env.NEXT_PUBLIC_SITE_TITLE ?? '',
  },
});
