/**
 * MysticFate - AI驱动功能引擎
 * AI-Powered Fortune Generation Engine
 * 
 * 功能：
 * 1. DeepSeek API 集成
 * 2. 每日运势生成
 * 3. AI性格解读
 * 4. 命盘解读生成
 */

// ==================== 配置 ====================

const AI_CONFIG = {
  // ===== DeepSeek（xiaowen / deepseek-v4-pro via OpenAI兼容网关）=====
  // API密钥与endpoint从 window.APP_CONFIG 注入
  apiKey: '',
  apiUrl: '',
  model: 'fast-model', // 网关别名 xiaowen，后端映射 deepseek-v4-pro
  modelAlias: 'xiaowen',

  // ===== 模型参数（deepseek-v4-pro 推荐）=====
  temperature: 0.7,
  top_p: 0.95,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_tokens: 1000,

  // 备用API（如果DeepSeek不可用）
  fallbackEnabled: true,
  timeoutMs: 30000,

  // 缓存配置
  cacheEnabled: true,
  cacheExpiry: 24 * 60 * 60 * 1000, // 24小时
  cache: new Map()
};

// 启动时从 window.APP_CONFIG 读取真实配置
function applyAppConfig() {
  if (typeof window === 'undefined' || !window.APP_CONFIG) return;
  const cfg = window.APP_CONFIG;
  AI_CONFIG.apiKey = cfg.DEEPSEEK_API_KEY || '';
  AI_CONFIG.model = cfg.DEEPSEEK_MODEL || AI_CONFIG.model;
  AI_CONFIG.modelAlias = cfg.DEEPSEEK_MODEL_ALIAS || AI_CONFIG.modelAlias;
  // OpenAI兼容路径：{BASE_URL}/v1/chat/completions
  const base = (cfg.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '');
  AI_CONFIG.apiUrl = base + '/v1/chat/completions';
  AI_CONFIG.temperature = (cfg.TEMPERATURE ?? AI_CONFIG.temperature);
  AI_CONFIG.top_p = (cfg.TOP_P ?? AI_CONFIG.top_p);
  AI_CONFIG.frequency_penalty = (cfg.FREQUENCY_PENALTY ?? AI_CONFIG.frequency_penalty);
  AI_CONFIG.presence_penalty = (cfg.PRESENCE_PENALTY ?? AI_CONFIG.presence_penalty);
  AI_CONFIG.max_tokens = (cfg.MAX_TOKENS ?? AI_CONFIG.max_tokens);
  AI_CONFIG.timeoutMs = (cfg.TIMEOUT_MS ?? AI_CONFIG.timeoutMs);
  AI_CONFIG.cacheEnabled = (cfg.CACHE_ENABLED ?? AI_CONFIG.cacheEnabled);
  AI_CONFIG.fallbackEnabled = (cfg.FALLBACK_ENABLED ?? AI_CONFIG.fallbackEnabled);
}

// ==================== Prompt 模板 ====================

const PROMPT_TEMPLATES = {
  dailyWhisper: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a daily fortune reading.

## User's Chart
- Name: {name}
- Destiny Palace: {destinyPalace}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Key Transformations: {transformations}

## Today's Date
{date}

## Response Format (JSON)
{
  "whisper": "One poetic sentence about today's energy (in English)",
  "doList": ["action1", "action2", "action3"],
  "dontList": ["avoid1", "avoid2", "avoid3"],
  "luckyDirection": "Direction name",
  "luckyElement": "Element name",
  "goldenHour": "Time period description",
  "classicalText": "One classical Chinese fortune text",
  "interpretation": "Brief interpretation"
}

Requirements:
- Whisper must be poetic and mysterious
- Do/Don't list must be specific and actionable
- Use Eastern astrology terminology (palace names, star names)
- Classical text should be from 紫微斗数 or similar traditional text
- Keep the tone mystical but grounded`,

  personalityReading: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a personality reading based on zodiac and five elements.

## User's Information
- Name: {name}
- Chinese Zodiac: {zodiac} ({zodiacCn})
- Five Element: {element} ({elementCn})
- Bureau: {bureau}

## Response Format (JSON)
{
  "combination": "One sentence describing the unique personality blend",
  "coreTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "strengths": ["strength1", "strength2", "strength3", "strength4"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "classicalText": "Classical Chinese text about this combination",
  "classicalAdvice": "Ancient advice for this personality type",
  "luckyElements": {
    "colors": ["color1", "color2"],
    "seasons": ["season1"],
    "direction": "direction"
  }
}

Requirements:
- Be poetic but specific
- Reference zodiac animal characteristics
- Reference five element properties
- Classical text should be authentic from traditional texts
- Advice should be practical and grounded`,

  chartInterpretation: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a detailed interpretation of the user's chart.

## User's Chart
- Name: {name}
- Destiny Palace: {mingGong} with main star {mainStar}
- Life Palace: {shenGong}
- Wealth Palace: {caiBoGong}
- Partnership Palace: {fuQiGong}
- Ambition Palace: {guanLuGong}
- Five Element Bureau: {bureau}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}
- User's Question: {question}

## Response Format (JSON)
{
  "opening": "Poetic opening statement (1-2 sentences)",
  "interpretation": "Detailed interpretation in plain English (3-4 paragraphs)",
  "classicalText": "Classical Chinese text with translation",
  "modernAdvice": "Practical modern-day advice",
  "timeReference": "Relevant time cycle (大运/流年) if applicable"
}

Requirements:
- Map to specific stars and palaces
- Reference classical texts (紫微斗数全书 or similar)
- Give specific, actionable insights
- Use "the stars suggest" not "you will definitely"
- Keep interpretation under 300 words`,

  soulmateReading: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a soulmate portrait based on the user's Partnership Palace.

## User's Chart
- Name: {name}
- Partnership Palace: {partnershipPalace} with {partnershipStars}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Key Transformation: {keyTransformation}

## Response Format (JSON)
{
  "archetype": "Poetic name for the soulmate archetype",
  "element": "Their elemental energy",
  "nature": "Their core nature description",
  "traits": ["trait1", "trait2", "trait3", "trait4"],
  "timing": "When they might meet (be vague but intriguing)",
  "connection": "How the connection will feel",
  "classicalText": "Classical Chinese text about soulmate bonds",
  "classicalTranslation": "Translation of classical text"
}

Requirements:
- Be romantic and mysterious
- Reference Partnership Palace stars
- Include specific traits
- Timing should reference 大运/流年
- Classical text from traditional texts about love and fate`,

  compatibilityReading: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a compatibility reading for two charts.

## User 1
- Name: {name1}
- Main Star: {mainStar1}
- Destiny Palace: {destinyPalace1}
- Element: {element1}

## User 2
- Name: {name2}
- Main Star: {mainStar2}
- Destiny Palace: {destinyPalace2}
- Element: {element2}

## Response Format (JSON)
{
  "soulScore": number (0-100),
  "communicationScore": number (0-100),
  "growthScore": number (0-100),
  "verdict": "Overall compatibility verdict (2-3 sentences)",
  "strengths": ["strength1", "strength2", "strength3"],
  "challenges": ["challenge1", "challenge2", "challenge3"],
  "classicalText": "Classical text about the relationship",
  "advice": "Ancient advice for this pairing"
}

Requirements:
- Score should reflect harmony of elements and stars
- Reference specific compatibility factors
- Be honest about challenges but positive
- Classical text should be authentic`,

  fullChartReading: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a complete 12-palace life chart reading.

## User's Chart
- Name: {name}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Ming Palace (命宫): {mingGong} with {mingStars}
- Sibling Palace (兄弟宫): {siblingStars}
- Partnership Palace (夫妻宫): {partnershipStars}
- Children Palace (子女宫): {childrenStars}
- Wealth Palace (财帛宫): {wealthStars}
- Health Palace (疾厄宫): {healthStars}
- Travel Palace (迁移宫): {travelStars}
- Social Palace (交友宫): {socialStars}
- Career Palace (官禄宫): {careerStars}
- Property Palace (田宅宫): {propertyStars}
- Fortune Palace (福德宫): {fortuneStars}
- Parents Palace (父母宫): {parentsStars}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}
- Life Palace (身宫): {shenGong}

## Response Format (JSON)
{
  "overview": "One paragraph life overview based on the chart (2-3 sentences)",
  "palaces": [
    {
      "name": "Ming Palace",
      "chinese": "命宫",
      "stars": "Purple Star, Tian Fu",
      "interpretation": "Detailed interpretation of this palace (2-3 sentences)"
    },
    ... (all 12 palaces)
  ],
  "keyTheme": "One sentence summarizing the chart's most important message",
  "classicalText": "Classical Chinese text about the chart configuration",
  "classicalTranslation": "English translation of the classical text"
}

Requirements:
- Each palace interpretation must be unique and specific
- Reference actual stars in each palace
- Keep interpretations grounded and insightful, not generic fortune-telling
- Use "the stars suggest" / "the chart indicates" language
- Under 500 words total
- Classical text should feel authentic to Chinese astrology tradition`,

  monthlyGuide: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a monthly fortune guide based on the user's birth chart.

## User's Chart
- Name: {name}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Ming Palace: {mingGong}
- Career Palace: {careerStars}
- Wealth Palace: {wealthStars}
- Partnership Palace: {partnershipStars}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}

## Month
{month} {year}

## Response Format (JSON)
{
  "keyword": "One-word keyword for the month",
  "energyPhrase": "A poetic phrase describing the month's energy",
  "overview": "2-3 sentence monthly overview",
  "weeks": [
    {
      "week": "Week 1",
      "focus": "Main focus for this week",
      "advice": "Specific advice for this week",
      "highlight": "One key opportunity this week"
    },
    {
      "week": "Week 2",
      ...
    },
    {
      "week": "Week 3",
      ...
    },
    {
      "week": "Week 4",
      ...
    }
  ],
  "luckyElements": {
    "direction": "Direction name",
    "color": "Color name",
    "number": "A number"
  },
  "watchPalace": "Which palace needs attention this month",
  "classicalAdvice": "Ancient wisdom for this month"
}

Requirements:
- Be specific about dates and timing
- Connect to the user's actual palace activations
- Practical and actionable advice
- Under 400 words total`,

  pastLifeInsight: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a past life insight based on the user's birth chart.

## User's Chart
- Name: {name}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Ming Palace Stars: {mingStars}
- Fortune Palace: {fortuneStars}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}

## Response Format (JSON)
{
  "pastLifeTitle": "A compelling title like 'The Silk Road Scholar' or 'The Jade General'",
  "era": "Historical era/dynasty (e.g., Tang Dynasty, Warring States Period)",
  "identity": "What they were in that life (2-3 words)",
  "story": "A 3-4 sentence narrative of the past life, vivid and specific",
  "whyStillRelevant": "How this past life connects to their current personality or situation (2 sentences)",
  "lesson": "What lesson from that life carries over to this one",
  "presentConnection": "One specific current trait/habit that echoes from the past life"
}

Requirements:
- Make it feel personal and specific to the chart
- Reference actual star energies (e.g., Purple Star → imperial connection)
- The story should be engaging and shareable
- Connect past life strengths/weaknesses to current life patterns
- Keep it positive or neutral in tone`,

  soulmateDeepDive: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a deep soulmate analysis based on the user's Partnership Palace.

## User's Chart
- Name: {name}
- Partnership Palace: {partnershipPalace}
- Partnership Stars: {partnershipStars}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}
- Ming Palace: {mingGong}

## Response Format (JSON)
{
  "loveArchetype": "Their archetype in relationships (e.g., The Guardian, The Seeker)",
  "coreDesire": "What they truly seek in a partner (1-2 sentences)",
  "loveStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "loveChallenges": ["Challenge 1", "Challenge 2"],
  "partnerProfile": "Description of their ideal partner based on the stars (2-3 sentences)",
  "timingInsight": "When the stars suggest a significant romantic chapter may unfold",
  "deeperConnection": "How to move from surface to soul-level connection",
  "classicalWisdom": "Ancient Chinese wisdom about their relationship path"
}

Requirements:
- Reference the Partnership Palace stars specifically
- Be poetic but grounded
- Avoid generic matchmaking language
- Use "the stars indicate" not "you will definitely"
- Keep under 400 words`
};

// ==================== 核心函数 ====================

/**
 * 调用 DeepSeek API（xiaowen / deepseek-v4-pro via OpenAI兼容网关）
 */
async function callDeepSeekAPI(prompt, systemPrompt = '') {
  if (!AI_CONFIG.apiKey || !AI_CONFIG.apiUrl) {
    console.warn('⚠️ No API key/url configured, using fallback');
    return generateFallbackResponse(prompt);
  }

  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    let timer = null;
    if (controller && AI_CONFIG.timeoutMs) {
      timer = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);
    }

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AI_CONFIG.apiKey
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        temperature: AI_CONFIG.temperature,
        top_p: AI_CONFIG.top_p,
        frequency_penalty: AI_CONFIG.frequency_penalty,
        presence_penalty: AI_CONFIG.presence_penalty,
        max_tokens: AI_CONFIG.max_tokens,
        stream: false,
        // 禁用思考模式（deepseek-v4-pro 默认启思考，占星解读用非思考即可）
        thinking: { type: 'disabled' }
      })
    };
    if (controller) fetchOptions.signal = controller.signal;

    const response = await fetch(AI_CONFIG.apiUrl, fetchOptions);
    if (timer) clearTimeout(timer);

    if (!response.ok) {
      throw new Error('API error: ' + response.status);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in response');
    }

    return content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    if (AI_CONFIG.fallbackEnabled) {
      return generateFallbackResponse(prompt);
    }
    throw error;
  }
}

/**
 * 解析JSON响应
 */
function parseJSONResponse(content) {
  try {
    // 尝试提取JSON块
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/```\n([\s\S]*?)\n```/) ||
                      content.match(/(\{[\s\S]*\})/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // 直接解析
    return JSON.parse(content);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
}

/**
 * 生成备用响应（当API不可用时）
 */
function generateFallbackResponse(prompt) {
  // 根据prompt类型生成不同的备用响应
  if (prompt.includes('dailyWhisper') || prompt.includes('daily fortune')) {
    return JSON.stringify({
      whisper: "The Moon Palace awakens today—trust your inner voice and the hidden paths will reveal themselves.",
      doList: ["Speak your truth with clarity", "Trust your intuition", "Take decisive action"],
      dontList: ["Make hasty decisions", "Hide your true feelings", "Overthink simple matters"],
      luckyDirection: "Northeast",
      luckyElement: "Water",
      goldenHour: "Shen Hour (3-5 PM)",
      classicalText: "月宫星动，宜静心养性，忌妄动。",
      interpretation: "Today's lunar energy favors introspection and creative pursuits."
    });
  }
  
  if (prompt.includes('personality')) {
    return JSON.stringify({
      combination: "Your Rat nature combined with Water element creates a sharp, adaptable personality.",
      coreTraits: ["Intelligent", "Resourceful", "Social", "Quick-witted", "Adaptable"],
      strengths: ["Excellent problem-solver", "Natural communicator", "Highly adaptable", "Lucky in opportunities"],
      weaknesses: ["Can be manipulative", "May overthink", "Tendency to be anxious"],
      classicalText: "鼠年生水，水主智，智慧如深渊。",
      classicalAdvice: "宜发挥才智，忌急躁冒进，当以柔克刚。",
      luckyElements: { colors: ["blue", "green"], seasons: ["winter"], direction: "north" }
    });
  }
  
  // 默认响应
  return JSON.stringify({
    message: "The stars are aligned in your favor. Trust the cosmic flow.",
    suggestion: "Take time today to reflect on your true desires."
  });
}

// ==================== 公共API ====================

/**
 * 生成每日运势
 */
async function generateDailyWhisper(userData) {
  const cacheKey = `daily_${userData.name}_${new Date().toDateString()}`;
  
  // 检查缓存
  if (AI_CONFIG.cacheEnabled) {
    const cached = AI_CONFIG.cache.get(cacheKey);
    if (cached) return cached;
  }
  
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const prompt = PROMPT_TEMPLATES.dailyWhisper
    .replace('{name}', userData.name || 'Seeker')
    .replace('{destinyPalace}', userData.destinyPalace || 'Life Palace')
    .replace('{mainStar}', userData.mainStar || 'Purple Star')
    .replace('{bureau}', userData.bureau || 'Water Bureau')
    .replace('{transformations}', userData.transformations || 'Balanced')
    .replace('{date}', dateStr);
  
  try {
    const content = await callDeepSeekAPI(prompt);
    const result = parseJSONResponse(content);
    
    if (AI_CONFIG.cacheEnabled && result) {
      AI_CONFIG.cache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating daily whisper:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * 生成性格解读
 */
async function generatePersonalityReading(userData) {
  const prompt = PROMPT_TEMPLATES.personalityReading
    .replace('{name}', userData.name || 'Seeker')
    .replace('{zodiac}', userData.zodiac || 'Dragon')
    .replace('{zodiacCn}', userData.zodiacCn || '龙')
    .replace('{element}', userData.element || 'Wood')
    .replace('{elementCn}', userData.elementCn || '木')
    .replace('{bureau}', userData.bureau || 'Wood Bureau');
  
  try {
    const content = await callDeepSeekAPI(prompt);
    return parseJSONResponse(content);
  } catch (error) {
    console.error('Error generating personality reading:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * 生成命盘解读
 */
async function generateChartInterpretation(userData, question = '') {
  const prompt = PROMPT_TEMPLATES.chartInterpretation
    .replace('{name}', userData.name || 'Seeker')
    .replace('{mingGong}', userData.mingGong || 'Life Palace')
    .replace('{mainStar}', userData.mainStar || 'Purple Star')
    .replace('{shenGong}', userData.shenGong || 'Body Palace')
    .replace('{caiBoGong}', userData.caiBoGong || 'Wealth Palace')
    .replace('{fuQiGong}', userData.fuQiGong || 'Partnership Palace')
    .replace('{guanLuGong}', userData.guanLuGong || 'Ambition Palace')
    .replace('{bureau}', userData.bureau || 'Water Bureau')
    .replace('{lu}', userData.lu || 'None')
    .replace('{quan}', userData.quan || 'None')
    .replace('{ke}', userData.ke || 'None')
    .replace('{ji}', userData.ji || 'None')
    .replace('{question}', question || 'What should I know about my destiny?');
  
  try {
    const content = await callDeepSeekAPI(prompt);
    return parseJSONResponse(content);
  } catch (error) {
    console.error('Error generating chart interpretation:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * 生成灵魂伴侣画像
 */
async function generateSoulmatePortrait(userData) {
  const prompt = PROMPT_TEMPLATES.soulmateReading
    .replace('{name}', userData.name || 'Seeker')
    .replace('{partnershipPalace}', userData.partnershipPalace || 'Partnership Palace')
    .replace('{partnershipStars}', userData.partnershipStars || 'Tian Tong')
    .replace('{mainStar}', userData.mainStar || 'Purple Star')
    .replace('{bureau}', userData.bureau || 'Water Bureau')
    .replace('{keyTransformation}', userData.lu || 'Balanced');
  
  try {
    const content = await callDeepSeekAPI(prompt);
    return parseJSONResponse(content);
  } catch (error) {
    console.error('Error generating soulmate portrait:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * 生成合盘分析
 */
async function generateCompatibilityReading(user1, user2) {
  const prompt = PROMPT_TEMPLATES.compatibilityReading
    .replace('{name1}', user1.name || 'User 1')
    .replace('{mainStar1}', user1.mainStar || 'Purple Star')
    .replace('{destinyPalace1}', user1.destinyPalace || 'Life Palace')
    .replace('{element1}', user1.element || 'Wood')
    .replace('{name2}', user2.name || 'User 2')
    .replace('{mainStar2}', user2.mainStar || 'Tian Tong')
    .replace('{destinyPalace2}', user2.destinyPalace || 'Life Palace')
    .replace('{element2}', user2.element || 'Fire');
  
  try {
    const content = await callDeepSeekAPI(prompt);
    return parseJSONResponse(content);
  } catch (error) {
    console.error('Error generating compatibility reading:', error);
    return generateFallbackResponse(prompt);
  }
}

// ==================== 本地数据增强 ====================

/**
 * 增强每日运势（添加本地计算的天象信息）
 */
function enhanceDailyWhisper(aiResult, userData) {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  
  // 基于日期的简单天象计算
  const moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  const moonPhase = moonPhases[dayOfYear % 8];
  
  // 添加天象信息
  return {
    ...aiResult,
    celestialEvent: moonPhase,
    dayEnergy: dayOfYear % 2 === 0 ? 'Yang' : 'Yin',
    elementalDay: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'][dayOfYear % 5],
    formattedDate: today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  };
}

/**
 * 生成命盘全解（12宫）
 */
async function generateFullChartReading(userData) {
  const cacheKey = 'full_chart_' + userData.name + '_' + new Date().toDateString();
  
  if (AI_CONFIG.cacheEnabled) {
    const cached = AI_CONFIG.cache.get(cacheKey);
    if (cached) return cached;
  }

  const prompt = PROMPT_TEMPLATES.fullChartReading
    .replace('{name}', userData.name || 'Seeker')
    .replace('{mainStar}', userData.mainStar || 'Purple Star')
    .replace('{bureau}', userData.bureau || 'Water Bureau')
    .replace('{mingGong}', userData.mingGong || 'Life Palace')
    .replace('{mingStars}', userData.mingStars || 'Purple Star, Tian Fu')
    .replace('{siblingStars}', userData.siblingStars || 'None')
    .replace('{partnershipStars}', userData.partnershipStars || 'Tian Tong')
    .replace('{childrenStars}', userData.childrenStars || 'None')
    .replace('{wealthStars}', userData.wealthStars || 'Wu Qu')
    .replace('{healthStars}', userData.healthStars || 'None')
    .replace('{travelStars}', userData.travelStars || 'None')
    .replace('{socialStars}', userData.socialStars || 'None')
    .replace('{careerStars}', userData.careerStars || 'Zi Wei')
    .replace('{propertyStars}', userData.propertyStars || 'None')
    .replace('{fortuneStars}', userData.fortuneStars || 'None')
    .replace('{parentsStars}', userData.parentsStars || 'None')
    .replace('{lu}', userData.lu || 'None')
    .replace('{quan}', userData.quan || 'None')
    .replace('{ke}', userData.ke || 'None')
    .replace('{ji}', userData.ji || 'None')
    .replace('{shenGong}', userData.shenGong || 'Life Palace');

  try {
    const content = await callDeepSeekAPI(prompt);
    const result = parseJSONResponse(content);
    
    if (AI_CONFIG.cacheEnabled && result) {
      AI_CONFIG.cache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating full chart reading:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * 生成月运趋势
 */
async function generateMonthlyGuide(userData, month, year) {
  const cacheKey = 'monthly_' + userData.name + '_' + month + '_' + year;
  
  if (AI_CONFIG.cacheEnabled) {
    const cached = AI_CONFIG.cache.get(cacheKey);
    if (cached) return cached;
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[month - 1] || 'January';

  const prompt = PROMPT_TEMPLATES.monthlyGuide
    .replace('{name}', userData.name || 'Seeker')
    .replace('{mainStar}', userData.mainStar || 'Purple Star')
    .replace('{bureau}', userData.bureau || 'Water Bureau')
    .replace('{mingGong}', userData.mingGong || 'Life Palace')
    .replace('{careerStars}', userData.careerStars || 'Zi Wei')
    .replace('{wealthStars}', userData.wealthStars || 'Wu Qu')
    .replace('{partnershipStars}', userData.partnershipStars || 'Tian Tong')
    .replace('{lu}', userData.lu || 'None')
    .replace('{quan}', userData.quan || 'None')
    .replace('{ke}', userData.ke || 'None')
    .replace('{ji}', userData.ji || 'None')
    .replace('{month}', monthName)
    .replace('{year}', year || '2026');

  try {
    const content = await callDeepSeekAPI(prompt);
    const result = parseJSONResponse(content);
    
    if (AI_CONFIG.cacheEnabled && result) {
      AI_CONFIG.cache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating monthly guide:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * 生成前世回响
 */
async function generatePastLifeInsight(userData) {
  const cacheKey = 'past_life_' + userData.name;
  
  if (AI_CONFIG.cacheEnabled) {
    const cached = AI_CONFIG.cache.get(cacheKey);
    if (cached) return cached;
  }

  const prompt = PROMPT_TEMPLATES.pastLifeInsight
    .replace('{name}', userData.name || 'Seeker')
    .replace('{mainStar}', userData.mainStar || 'Purple Star')
    .replace('{bureau}', userData.bureau || 'Water Bureau')
    .replace('{mingStars}', userData.mingStars || 'Purple Star')
    .replace('{fortuneStars}', userData.fortuneStars || 'None')
    .replace('{lu}', userData.lu || 'None')
    .replace('{quan}', userData.quan || 'None')
    .replace('{ke}', userData.ke || 'None')
    .replace('{ji}', userData.ji || 'None');

  try {
    const content = await callDeepSeekAPI(prompt);
    const result = parseJSONResponse(content);
    
    if (AI_CONFIG.cacheEnabled && result) {
      AI_CONFIG.cache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating past life insight:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * 生成关系深度解读
 */
async function generateSoulmateDeepDive(userData) {
  const cacheKey = 'soulmate_deep_' + userData.name + '_' + new Date().toDateString();
  
  if (AI_CONFIG.cacheEnabled) {
    const cached = AI_CONFIG.cache.get(cacheKey);
    if (cached) return cached;
  }

  const prompt = PROMPT_TEMPLATES.soulmateDeepDive
    .replace('{name}', userData.name || 'Seeker')
    .replace('{partnershipPalace}', userData.partnershipPalace || 'Partnership Palace')
    .replace('{partnershipStars}', userData.partnershipStars || 'Tian Tong')
    .replace('{mainStar}', userData.mainStar || 'Purple Star')
    .replace('{bureau}', userData.bureau || 'Water Bureau')
    .replace('{lu}', userData.lu || 'None')
    .replace('{quan}', userData.quan || 'None')
    .replace('{ke}', userData.ke || 'None')
    .replace('{ji}', userData.ji || 'None')
    .replace('{mingGong}', userData.mingGong || 'Life Palace');

  try {
    const content = await callDeepSeekAPI(prompt);
    const result = parseJSONResponse(content);
    
    if (AI_CONFIG.cacheEnabled && result) {
      AI_CONFIG.cache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating soulmate deep dive:', error);
    return generateFallbackResponse(prompt);
  }
}

// ==================== 导出 ====================

if (typeof window !== 'undefined') {
  window.AIEngine = {
    generateDailyWhisper,
    generatePersonalityReading,
    generateChartInterpretation,
    generateSoulmatePortrait,
    generateCompatibilityReading,
    generateFullChartReading,
    generateMonthlyGuide,
    generatePastLifeInsight,
    generateSoulmateDeepDive,
    enhanceDailyWhisper,
    callDeepSeekAPI,
    PROMPT_TEMPLATES,
    AI_CONFIG
  };
}

// 立即注入配置
applyAppConfig();

// 设置API密钥（兼容旧版 APP_CONFIG 字段）
if (typeof window !== 'undefined' && window.APP_CONFIG?.DEEPSEEK_API_KEY && !AI_CONFIG.apiKey) {
  AI_CONFIG.apiKey = window.APP_CONFIG.DEEPSEEK_API_KEY;
  if (!AI_CONFIG.apiUrl && window.APP_CONFIG?.DEEPSEEK_BASE_URL) {
    const base = window.APP_CONFIG.DEEPSEEK_BASE_URL.replace(/\/+$/, '');
    AI_CONFIG.apiUrl = base + '/v1/chat/completions';
  }
}

console.log('✅ AI Engine loaded -', AI_CONFIG.modelAlias, '(' + AI_CONFIG.model + ')', '→', AI_CONFIG.apiUrl || '(fallback mode)');
