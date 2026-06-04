/**
 * MysticFate - App Configuration
 * 应用全局配置（API密钥、模型参数等）
 *
 * ⚠️ 生产环境必须通过环境变量注入或Supabase Edge Function代理
 * 当前文件仅用于本地开发与Demo演示
 */

window.APP_CONFIG = {
  // ====== DeepSeek V4 Pro (official) ======
  DEEPSEEK_API_KEY: localStorage.getItem('DEEPSEEK_API_KEY') || 'sk-e6078716aa6141dcaf753cda9d26272f',
  DEEPSEEK_BASE_URL: 'https://api.deepseek.com',
  DEEPSEEK_MODEL: 'deepseek-v4-pro',
  DEEPSEEK_MODEL_ALIAS: 'deepseek-v4-pro',

  // ====== deepseek-v4-pro 推荐参数 ======
  // 占星/命理解读，温度0.7平衡文采与稳定性
  TEMPERATURE: 0.7,
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.0,
  PRESENCE_PENALTY: 0.0,
  MAX_TOKENS: 1000,
  TIMEOUT_MS: 30000,

  // ====== 业务配置 ======
  // 信用点：每次AI调用消耗点数
  CREDIT_COST_DAILY_WHISPER: 1,
  CREDIT_COST_PERSONALITY: 3,
  CREDIT_COST_CHART_READING: 5,
  CREDIT_COST_SOULMATE: 4,
  CREDIT_COST_COMPATIBILITY: 6,

  // 缓存：相同key 24小时内不重复扣费
  CACHE_ENABLED: true,
  CACHE_EXPIRY_HOURS: 24,

  // 回退策略：API失败时返回预设解读而非崩溃
  FALLBACK_ENABLED: true,

  // 环境
  ENV: 'demo' // demo | staging | production
};

console.log('⚙️ App Config loaded - model:', window.APP_CONFIG.DEEPSEEK_MODEL_ALIAS, '(' + window.APP_CONFIG.DEEPSEEK_MODEL + ')');
