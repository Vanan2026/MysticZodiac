/**
 * MysticFate - App Configuration
 * 
 * 🔒 API Key 安全说明：
 * API Key 绝不硬编码在此文件中。
 * 生产环境：走 Supabase Edge Function 代理，API Key 仅存于 Supabase 环境变量
 * 开发环境：localStorage.setItem('DEEPSEEK_API_KEY', 'sk-xxx') 临时设置
 */

window.APP_CONFIG = {
  // ====== DeepSeek V4 Pro ======
  DEEPSEEK_API_KEY: localStorage.getItem('DEEPSEEK_API_KEY') || '',
  DEEPSEEK_BASE_URL: 'https://api.deepseek.com',
  DEEPSEEK_MODEL: 'deepseek-v4-pro',
  DEEPSEEK_MODEL_ALIAS: 'deepseek-v4-pro',

  // ====== Supabase Edge Function（已部署）======
  SUPABASE_EDGE_FUNCTION_URL: localStorage.getItem('SUPABASE_EDGE_FUNCTION_URL') ||
    'https://tgggebljhvpxgaehsnvq.supabase.co/functions/v1/deepseek-proxy',

  // ====== deepseek-v4-pro 参数 ======
  TEMPERATURE: 0.7,
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.0,
  PRESENCE_PENALTY: 0.0,
  MAX_TOKENS: 1000,
  TIMEOUT_MS: 30000,

  // ====== 积分经济 ======
  CREDIT_NEW_USER: 8,
  CREDIT_DAILY_SIGNIN: 1,
  CREDIT_SHARE_BONUS: 1,

  CREDIT_COST_CARD_OF_DAY: 1,
  CREDIT_COST_FULL_CHART: 12,
  CREDIT_COST_SOULMATE: 6,
  CREDIT_COST_MONTHLY_GUIDE: 10,
  CREDIT_COST_PAST_LIFE: 4,
  CREDIT_COST_CHAPTER: 1,

  CACHE_ENABLED: true,
  CACHE_EXPIRY_HOURS: 24,
  FALLBACK_ENABLED: true,

  ENV: 'demo'
};