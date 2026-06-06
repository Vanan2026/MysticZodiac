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
