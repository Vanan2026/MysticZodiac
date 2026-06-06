/**
 * DeepSeek AI Engine - Edge Function Proxy + Fallback
 */
import { supabase } from './supabase';
import {
  SUPABASE_EDGE_FUNCTION_URL,
  DEEPSEEK_MODEL,
  DEEPSEEK_TEMPERATURE,
  DEEPSEEK_TOP_P,
  DEEPSEEK_FREQUENCY_PENALTY,
  DEEPSEEK_PRESENCE_PENALTY,
  DEEPSEEK_MAX_TOKENS,
  DEEPSEEK_TIMEOUT_MS,
} from '../constants/config';

interface AICallOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

const READING_PROMPTS: Record<string, string> = {
  destiny:
    'You are a wise Ziwei Doushu astrologer. Interpret this person\'s birth chart and reveal their destiny. 3-4 paragraphs covering personality, life path, relationships, and career. Speak in direct second person ("you").',
  monthly:
    'You are a celestial guide. Based on the user\'s birth chart and the current month, provide a monthly cosmic guide. Include: 1) Monthly theme (1 sentence), 2) Week-by-week breakdown (4 items), 3) Lucky elements (direction, color, number) 4) Areas to watch.',
  soulmate:
    'You are a star-crossed love interpreter. Based on the user\'s chart, describe their ideal soulmate archetype. What star signs would complement them? What should they look for in a partner? 3 paragraphs.',
  compatibility:
    'You are a cosmic matchmaker. Analyze the connection between two charts. Describe the strengths, challenges, and karmic lessons of this pairing. 3-4 paragraphs emotional and spiritual depth.',
  pastlife:
    'You are a past life regression guide. Based on the user\'s natal chart, reveal their most significant past life incarnation. Include: 1) Historical era and identity, 2) Key life events, 3) How it connects to their present self. 2-3 poetic paragraphs.',
  daily:
    'You are a celestial whisperer. Offer a short, poetic daily fortune for today based on the stars. 2-3 sentences, metaphorical and inspiring. Include a practical tip.',
};

/**
 * Call DeepSeek via Supabase Edge Function proxy
 */
export async function callDeepSeekAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options: AICallOptions = {}
): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('deepseek-proxy', {
      body: {
        model: DEEPSEEK_MODEL,
        messages,
        temperature: options.temperature ?? DEEPSEEK_TEMPERATURE,
        top_p: DEEPSEEK_TOP_P,
        frequency_penalty: DEEPSEEK_FREQUENCY_PENALTY,
        presence_penalty: DEEPSEEK_PRESENCE_PENALTY,
        max_tokens: options.maxTokens ?? DEEPSEEK_MAX_TOKENS,
        stream: false,
        thinking: { type: 'disabled' },
      },
    });

    if (error) {
      console.warn('⚠️ Edge Function error:', error);
      return null;
    }

    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn('⚠️ AI call failed:', err);
    return null;
  }
}

/**
 * Direct DeepSeek API call (fallback, requires localStorage key)
 */
export async function callDeepSeekDirect(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  apiKey: string,
  options: AICallOptions = {}
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        temperature: options.temperature ?? DEEPSEEK_TEMPERATURE,
        top_p: DEEPSEEK_TOP_P,
        max_tokens: options.maxTokens ?? DEEPSEEK_MAX_TOKENS,
        stream: false,
        thinking: { type: 'disabled' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn('⚠️ Direct AI call failed:', err);
    return null;
  }
}

/**
 * Generate reading content for a specific type
 * Used by the Reading detail screen
 */
export async function generateReading(
  type: string,
  userData?: Record<string, any>
): Promise<string | null> {
  const systemPrompt = READING_PROMPTS[type] || READING_PROMPTS.daily;
  const userContext = userData
    ? `User data: ${JSON.stringify(userData)}`
    : 'Provide a general reading.';

  return callDeepSeekAI(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContext },
    ],
    { temperature: 0.85 }
  );
}
