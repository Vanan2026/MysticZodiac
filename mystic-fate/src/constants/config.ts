/**
 * Mystic Fate - App Configuration & Constants
 */

// Supabase
export const SUPABASE_URL = 'https://tgggebljhvpxgaehsnvq.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZ2dlYmxqaHZweGdhZWhzbnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTk1ODIsImV4cCI6MjA5NjIzNTU4Mn0.PgAh22rq8olZXSdMWxTzsFhKj5x1dJc-PlL9HSNMZ5U';
export const SUPABASE_EDGE_FUNCTION_URL = 'https://tgggebljhvpxgaehsnvq.supabase.co/functions/v1/deepseek-proxy';

// DeepSeek
export const DEEPSEEK_MODEL = 'deepseek-v4-pro';
export const DEEPSEEK_TEMPERATURE = 0.95;
export const DEEPSEEK_TOP_P = 0.97;
export const DEEPSEEK_FREQUENCY_PENALTY = 0.3;
export const DEEPSEEK_PRESENCE_PENALTY = 0.2;
export const DEEPSEEK_MAX_TOKENS = 2500;
export const DEEPSEEK_TIMEOUT_MS = 30000;

// Credits Economy
export const CREDITS = {
  NEW_USER: 8,
  DAILY_SIGNIN: 1,
  SHARE_BONUS: 1,

  COST_CARD_OF_DAY: 1,
  COST_FULL_CHART: 12,
  COST_SOULMATE: 6,
  COST_MONTHLY_GUIDE: 10,
  COST_PAST_LIFE: 4,
  COST_CHAPTER: 1,
};

// IAP Products
export const IAP_PRODUCTS = {
  CREDITS_30: 'mystic_fate.credits_30',
  CREDITS_80: 'mystic_fate.credits_80',
  CREDITS_250: 'mystic_fate.credits_250',
  PRO_MONTHLY: 'mystic_fate.pro_monthly',
  PRO_YEARLY: 'mystic_fate.pro_yearly',
};

export const IAP_PRICES = {
  [IAP_PRODUCTS.CREDITS_30]: 1.99,
  [IAP_PRODUCTS.CREDITS_80]: 4.99,
  [IAP_PRODUCTS.CREDITS_250]: 9.99,
  [IAP_PRODUCTS.PRO_MONTHLY]: 14.99,
  [IAP_PRODUCTS.PRO_YEARLY]: 99.99,
};

// App Info
export const APP_NAME = 'Mystic Fate';
export const APP_SUBTITLE = 'Eastern Wisdom for Self-Discovery';
export const APP_SLOGAN = 'Unlock 5,000 years of Eastern wisdom';
