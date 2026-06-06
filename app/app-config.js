/**
 * MysticZodiac - App Configuration
 * 应用全局配置（API密钥、模型参数等）
 *
 * 生产环境必须通过环境变量注入或Supabase Edge Function代理
 * 当前文件仅用于本地开发与Demo演示
 */

window.APP_CONFIG = {
  // ====== DeepSeek V4 Pro (official) ======
  DEEPSEEK_API_KEY: localStorage.getItem('DEEPSEEK_API_KEY') || '',
  DEEPSEEK_BASE_URL: 'https://api.deepseek.com',
  DEEPSEEK_MODEL: 'deepseek-v4-pro',
  DEEPSEEK_MODEL_ALIAS: 'deepseek-v4-pro',

  // ====== Supabase Edge Function（DeepSeek API 代理） ======
  // 生产环境优先走 Edge Function，API Key 仅存在 Supabase 环境变量中
  SUPABASE_EDGE_FUNCTION_URL: localStorage.getItem('SUPABASE_EDGE_FUNCTION_URL') ||
    'https://tgggebljhvpxgaehsnvq.supabase.co/functions/v1/deepseek-proxy',

  // ====== deepseek-v4-pro 推荐参数 ======
  TEMPERATURE: 0.7,
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.0,
  PRESENCE_PENALTY: 0.0,
  MAX_TOKENS: 1000,
  TIMEOUT_MS: 30000,

  // ====== 积分经济 (v2.2) ======
  // 免费获取
  CREDIT_NEW_USER: 8,           // 注册赠送（原15→8）
  CREDIT_DAILY_SIGNIN: 1,       // 每日签到（原2→1）
  CREDIT_SHARE_BONUS: 1,        // 分享奖励 每日限1次

  // 日常消耗
  CREDIT_COST_CARD_OF_DAY: 1,   // 每日星曜启示

  // 深度功能消耗
  CREDIT_COST_FULL_CHART: 12,   // 命盘全解（原CREDIT_COST_CHART_READING:5→12）
  CREDIT_COST_SOULMATE: 6,      // 关系深度（原4→6）
  CREDIT_COST_MONTHLY_GUIDE: 10,// 月运趋势（新增）
  CREDIT_COST_PAST_LIFE: 4,     // 前世回响（新增）
  CREDIT_COST_CHAPTER: 1,       // Chapters深度解读（原CREDIT_COST_DAILY_WHISPER移用）

  // 缓存：相同key 24小时内不重复扣费
  CACHE_ENABLED: true,
  CACHE_EXPIRY_HOURS: 24,

  // 回退策略：API失败时返回预设解读而非崩溃
  FALLBACK_ENABLED: true,

  // 环境
  ENV: 'demo' // demo | staging | production
};

console.log('MysticZodiac Config loaded - model:', window.APP_CONFIG.DEEPSEEK_MODEL_ALIAS);
