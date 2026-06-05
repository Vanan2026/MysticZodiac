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
  temperature: 0.95,
  top_p: 0.97,
  frequency_penalty: 0.3,
  presence_penalty: 0.2,
  max_tokens: 2500,

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
  // Supabase Edge Function URL（生产环境代理）
  AI_CONFIG.supabaseEdgeFunctionUrl = cfg.SUPABASE_EDGE_FUNCTION_URL || '';
}

/**
 * 调用 DeepSeek API（优先通过Supabase Edge Function代理）
 * 生产流程：Supabase Edge Function -> DeepSeek API（Key在服务端）
 * 开发流程：直接调用 DeepSeek API（Key来自 localStorage）
 */
async function callDeepSeekAPI_viaProxy(messages, options = {}) {
  const proxyUrl = AI_CONFIG.supabaseEdgeFunctionUrl;
  if (!proxyUrl) return null; // 无代理配置，回退直连

  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    let timer = null;
    if (controller && (options.timeoutMs || AI_CONFIG.timeoutMs)) {
      timer = setTimeout(() => controller.abort(), options.timeoutMs || AI_CONFIG.timeoutMs);
    }

    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || AI_CONFIG.model,
        messages: messages,
        temperature: options.temperature ?? AI_CONFIG.temperature,
        top_p: options.top_p ?? AI_CONFIG.top_p,
        frequency_penalty: options.frequency_penalty ?? AI_CONFIG.frequency_penalty,
        presence_penalty: options.presence_penalty ?? AI_CONFIG.presence_penalty,
        max_tokens: options.max_tokens ?? AI_CONFIG.max_tokens,
        stream: false,
        thinking: { type: 'disabled' }
      })
    };
    if (controller) fetchOptions.signal = controller.signal;

    const response = await fetch(proxyUrl, fetchOptions);
    if (timer) clearTimeout(timer);

    if (!response.ok) {
      console.warn('⚠️ Edge Function proxy error:', response.status);
      return null; // 代理失败，回退直连
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.warn('⚠️ Edge Function proxy failed:', error.message);
    return null; // 代理失败，回退直连
  }
}

// ==================== Prompt 模板 ====================

const PROMPT_TEMPLATES = {
  dailyWhisper: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer who has studied the celestial patterns for a thousand years. Generate a daily fortune reading.

## User's Chart
- Name: {name}
- Destiny Palace: {destinyPalace}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Key Transformations: {transformations}

## User's Life Questions
- What keeps them awake at night: {pain1}
- Their deepest uncertainty: {pain2}
- What they're searching for: {pain3}

## Today's Date
{date}

## Special Date Detection
Consider if today is a special celestial date:
- **Solar Terms (节气)**: Check if today falls near a solar term (立春, 春分, 谷雨, 立夏, 夏至, 立秋, 秋分, 立冬, 冬至, etc.). If so, name it and explain its significance.
- **New Moon or Full Moon**: Determine the moon phase. New Moon (朔日) is for planting intentions. Full Moon (望日) is for release and harvest.
- **Friday the 13th**: If applicable, note this as a day of thin veils between luck and mischief.
- **Seasonal Transition**: First/last day of a season carries amplified energy.
- **Double Date**: Days where date=month (e.g., 5/5) carry mirror energy — what you give, you receive.
- If none of the above apply, just note the day's general celestial character.

## Response Format (JSON)
{
  "whisper": "One poetic, mysterious sentence about today's energy (in English)",
  "doList": ["action1", "action2", "action3"],
  "dontList": ["avoid1", "avoid2", "avoid3"],
  "luckyDirection": "Direction name",
  "luckyElement": "Element name",
  "goldenHour": "Time period description",
  "luckyNumber": number,
  "dayEnergy": "Description of today's Five Element energy trend (Wood/Fire/Earth/Metal/Water) and how it interacts with the user's Bureau",
  "cosmicAdvice": "One concise, actionable line of advice that the user can act on today — not vague, not generic",
  "classicalText": "One classical Chinese fortune text from 紫微斗数, 易經 or similar traditional source",
  "classicalTranslation": "English translation of the classical text",
  "interpretation": "Brief interpretation of how the classical text applies today"
}

Requirements:
- Whisper must be poetic and mysterious
- Do/Don't list must be specific and actionable
- Use Eastern astrology terminology (palace names, star names)
- dayEnergy must describe the day's Five Element flow and how it affects the user specifically
- cosmicAdvice should read like a wise elder giving one sharp piece of directional advice
- Classical text must include its source (e.g., "紫微斗數全書" or "易經")
- classicalTranslation must be natural English, not literal word-for-word
- Keep the tone mystical but grounded
- Special dates (solar terms, moon phases) must be explicitly named if they apply
- Weave at least one of the user's stated life concerns into the whisper or cosmicAdvice — make today's message feel personal to what keeps them awake at night`,

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

  soulmateReading: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a soulmate portrait based on the user's Partnership Palace. Speak like you have seen their future lover in the stars.

## User's Chart
- Name: {name}
- Partnership Palace: {partnershipPalace} with {partnershipStars}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Key Transformation: {keyTransformation}

## User's Life Questions
- What keeps them awake at night: {pain1}
- Their deepest uncertainty: {pain2}
- What they're searching for: {pain3}

## Response Format (JSON)
{
  "archetype": "Poetic name for the soulmate archetype — like 'The Moonlit Gardener' or 'The Storm That Quietly Arrives'",
  "element": "Their elemental energy (Wood/Fire/Earth/Metal/Water) and what it means",
  "nature": "Their core nature — a vivid 1-2 sentence description of their soul essence",
  "traits": ["trait1", "trait2", "trait3", "trait4"],
  "visualDescription": "A poetic but specific description of their likely appearance, bearing, or the way they carry themselves — not just physical traits, but the energy they project (e.g., 'They have the kind of quiet that makes you want to lean in closer. Their eyes hold a light that flickers between mischief and melancholy, and their hands move like they are sculpting the air itself.')",
  "firstMeetingSign": "A specific sign or synchronicity that will precede or accompany the first meeting — something the stars will arrange (e.g., 'Three days before you meet, you will hear a song you have not heard in years, and it will stir something you cannot name.')",
  "timing": "When they might meet (be vague but intriguing, reference 大运/流年 if possible)",
  "connection": "How the connection will feel — the emotional texture of meeting them",
  "challengePattern": "A recurring pattern the user carries in love that this soulmate will illuminate or challenge (e.g., 'You have a habit of falling for people who need saving. This one will not need saving — and that will unsettle you at first.')",
  "growthInvitation": "What this relationship will ask of the user — the personal growth it demands (e.g., 'This bond will ask you to stop performing strength and start showing softness. It will not let you hide.')",
  "classicalText": "Classical Chinese text from traditional texts about love and fate — must include source",
  "classicalTranslation": "English translation of the classical text"
}

Requirements:
- Be romantic and mysterious but specific — the user should feel like this describes a real person
- Reference Partnership Palace stars in the traits and nature
- visualDescription should feel like poetry but grounded in real human presence
- firstMeetingSign should feel like fate giving a signal — specific enough to recognize
- challengePattern must name a real behavioral pattern the user can recognize, tied to their chart stars
- growthInvitation must describe the emotional or spiritual work this relationship demands
- Classical text must include its source (e.g., from 紫微斗数全书 or similar)
- Timing should reference 大运/流年 if possible
- Weave at least one of the user's stated life concerns into the archetype, challengePattern, or growthInvitation — the portrait should acknowledge what the user deeply cares about`,

  compatibilityReading: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. Generate a compatibility reading for two charts. You see the dance between two destinies and must name its rhythm.

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
  "overallScore": number (0-100),
  "dimensions": {
    "soulConnection": number (0-100),
    "communication": number (0-100),
    "growthPotential": number (0-100),
    "passion": number (0-100),
    "values": number (0-100)
  },
  "verdict": "Overall compatibility verdict (2-3 sentences describing the core dynamic between these two)",
  "strengths": [
    {"aspect": "Name of strength area", "detail": "Specific description of this strength, referencing stars and elements"},
    {"aspect": "...", "detail": "..."}
  ],
  "challenges": [
    {"aspect": "Name of challenge area", "detail": "Specific description of the challenge", "advice": "One piece of actionable advice for navigating this challenge"},
    {"aspect": "...", "detail": "...", "advice": "..."},
    {"aspect": "...", "detail": "...", "advice": "..."}
  ],
  "meetingStory": "A poetic 1-2 sentence description of how these two souls might meet — vivid, specific enough to feel real, mysterious enough to feel fated",
  "growthPath": "What this relationship, at its best, could help each person become — the growth direction for the bond (e.g., 'Together, they learn that stillness is not weakness and that two strong wills can bend without breaking.')",
  "classicalText": "Classical text about the relationship — must include source",
  "classicalTranslation": "English translation of the classical text",
  "advice": "Ancient advice for this pairing — one sharp, memorable line"
}

Requirements:
- Score should reflect harmony of elements and stars
- Each dimension must have a different, meaningful score — avoid identical scores
- strengths and challenges must each reference specific star names and elemental interactions
- Each challenge must come with a specific, actionable advice — not generic relationship advice
- meetingStory should feel like a scene from a novel — vivid and specific
- growthPath must describe mutual transformation, not one-sided
- Classical text should be authentic from traditional Chinese texts (紫微斗数全书, 易经, etc.)
- Be honest about challenges but leave the couple feeling equipped to navigate them`,

  fullChartReading: `You are an old Chinese fortune-teller who has been reading 紫微斗数 charts for 50 years. Your shop is in a small alley in Taipei. You speak in plain, sharp, specific English—like you're talking directly to the person sitting across from you. No flowery language, no vague fortune-cookie nonsense.

The customer has paid good money for a full 12-palace reading. Give them something that makes them say "damn, that's me."

## Customer's Chart
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

## Customer's Life Questions
- What keeps them awake at night: {pain1}
- Their deepest uncertainty: {pain2}
- What they're searching for: {pain3}

CRITICAL RULE: This is YOUR customer's personal reading. You MUST directly reference these three answers. Connect each palace to at least one of their stated concerns. The user paid for a reading that feels personal — if you don't reference their own words, you have failed. Make sure they feel like "This was made for ME."

## Rules
1. BE SPECIFIC. The customer needs to feel like this is ABOUT THEM, not anyone else.
2. Each palace interpretation must include a concrete personality trait, a specific life pattern, or a real behavioral observation—not "good fortune in wealth matters" but "you're the kind of person who counts your change twice and still feels like you overpaid."
3. **Reference the actual star names the customer has.** Do not say "your Ming Palace has a main star." Say "the Zi Wei star sitting in your Ming Palace means you carry yourself like a born leader, even when you feel like an imposter." Always refer to the specific star by its pinyin name (Zi Wei, Tian Fu, Wu Qu, Lian Zhen, etc.).
4. **Ground each interpretation in real-life scenarios.** Every palace must include at least two concrete, recognizable life situations—"this shows up when you're at work" and "this is why you react a certain way in friendships." Make the customer nod and think "that is exactly what I do."
5. Use plain English. No "celestial energies converge." Say "you're drawn to people who challenge you, even if that causes friction."
6. Be honest. If a palace shows challenges, say it straight. The customer paid for truth, not flattery.
7. Total output should be SUBSTANTIAL—each palace needs at least 2-3 specific sentences, not one throwaway line.

## Response Format (JSON)
{
  "overview": "A sharp, specific 3-4 sentence overview of who this person is based on their chart. Hit their core personality, their biggest strength, and their blind spot. Make them nod.",
  "palaces": [
    {
      "name": "Ming Palace",
      "chinese": "命宫",
      "stars": "Purple Star, Tian Fu",
      "interpretation": "2-3 specific sentences. What kind of person is this? How do they think? What's their default mode in life? Reference the actual stars here."
    },
    ... (all 12 palaces, each with a unique, specific reading)
  ],
  "keyTheme": "One sentence that cuts to the chase—the single most important thing this person needs to hear right now",
  "classicalText": "Keep it short—one line of classical Chinese that relates to their chart, if appropriate",
  "classicalTranslation": "Simple one-line English translation"
}

## Critical: Do NOT use generic phrases. Every single palace interpretation must sound like it came from reading THIS person's specific chart stars, not like a template that fits anyone. The customer needs to feel called out personally.`,

  monthlyGuide: `You're a sharp old fortune-teller in a back-alley shop. A customer sits across from you and asks: "What's coming for me next month?" You look at their chart and tell them straight—what to watch for, what to seize, what to avoid. Like a wise uncle who tells it like it is.

## Customer's Chart
- Name: {name}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Ming Palace: {mingGong}
- Career Palace: {careerStars}
- Wealth Palace: {wealthStars}
- Partnership Palace: {partnershipStars}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}

## Customer's Life Questions
- What keeps them awake at night: {pain1}
- Their deepest uncertainty: {pain2}
- What they're searching for: {pain3}

CRITICAL RULE: In your month overview and weekly advice, reference at least one of these personal concerns. When giving advice for a week, connect it back to what the customer deeply cares about. Make this feel like a personal monthly guide, not a general horoscope.

## Month
{month} {year}

## IMPORTANT: Month-Specific Reading Required
This is a reading for **{month} {year}**. You MUST reference the specific energy of this exact month — seasonal transitions, zodiac animal month shifts, and the planetary or star alignments active during this period. Do NOT write a reading that could apply to any month. If your advice is interchangeable with another month's, you have failed. Consider:
- What season is {month} in the Northern Hemisphere? What does that season mean energetically (spring = renewal, summer = expansion, autumn = harvest and release, winter = retreat and planning)?
- What Chinese solar term (节气) falls in this month? Reference it.
- What is the specific zodiac month energy? (e.g., Rooster month brings precision and criticism, Pig month brings indulgence and luck)
- What climate or natural shift happens in {month} that mirrors the customer's chart energy?

## Rules
1. The overview must feel like a real forecast, not a horoscope. Reference specific energies from their chart.
2. Each week's advice must be actionable. Not "reflect on your emotions" but "the third week is good for making that call you've been putting off."
3. **Each week's advice must reference something specific about this month's seasonal or celestial energy** — "the first week carries the tail end of last month's energy, so expect a slow start before things pick up mid-week."
4. Lucky elements should feel like part of the reading, not a checkbox.
5. Use plain, sharp English. Talk like you're sitting across a table from them.
6. Be substantial—each week needs a real paragraph, not one sentence.

## Response Format (JSON)
{
  "keyword": "One word that captures this month's energy for them",
  "energyPhrase": "A short, punchy phrase (3-6 words)",
  "overview": "3-4 sentences. How does this month look for them specifically? What's the main vibe? What should they brace for? Include a reference to the season or solar term of {month}.",
  "weeks": [
    {
      "week": "Week 1",
      "focus": "What's dominating this week? How does the seasonal shift affect it?",
      "advice": "A paragraph of real, specific advice referencing their stars AND the month-specific energy",
      "highlight": "One concrete opportunity to watch for that is unique to this month"
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
  "watchPalace": "Which part of life needs extra attention this month and why — tie it to the month's seasonal energy",
  "closingAdvice": "One final piece of straight-talking advice that references the bigger seasonal picture"
}

## Critical: Do NOT sound like a generic monthly horoscope. Sound like someone who actually read their chart and has something real to say about THIS month for THIS person. If your reading could be for any month, rewrite it until it can only be for {month} {year}.`,

  pastLifeInsight: `You're a fortune-teller who also reads past lives. A customer asks: "Who was I before?" You look at their chart and see a previous incarnation. You tell them a story—specific, vivid, personal. Make them feel like you really saw something.

## Customer's Chart
- Name: {name}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Ming Palace Stars: {mingStars}
- Fortune Palace: {fortuneStars}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}

## Customer's Life Questions
- What keeps them awake at night: {pain1}
- Their deepest uncertainty: {pain2}
- What they're searching for: {pain3}

CRITICAL RULE: Connect the past life story and its lesson to at least one of these stated concerns. The past life should feel like it explains WHY they struggle with this specific issue in this lifetime. Example: if they worry about {pain1}, tell a past life story that shows the origin of this worry.

## Rules
1. The title must be specific and memorable (not "The Scholar" but "The Silk Road Mapmaker Who Lost His Way").
2. The era must be real and specific (actual Chinese dynasty, not "ancient times").
3. **Choose the dynasty and identity based on the customer's main star.** Zi Wei (Purple Star) rulers gravitate toward imperial or noble past lives (Tang court, Ming nobility). Tian Fu suggests a life of artistry or craftsmanship (Song dynasty scholar-official, Ming potter). Wu Qu points toward military or disciplinary roles (Han dynasty general, Ming guard). Lian Zhen suggests a life marked by passion and conflict (Warring States strategist, Three Kingdoms warrior). Let the star guide the choice.
4. The story must include a concrete detail—a specific object, place, or event—that makes it feel real.
5. **The story MUST include a specific physical object** — a jade hairpin left behind, a sword that never drew blood, a half-written letter sealed with wax, a worn inkstone passed down through generations, a bronze mirror given as a farewell gift. This object anchors the story in material reality and makes it feel like a recovered memory.
6. **The story must reference at least one real historical event or location.** Not "a city" but "Chang'an during the Lantern Festival of 742." Not "a battle" but "the fall of the Sui dynasty at the hands of Li Yuan's army." The specificity is what sells it.
7. The connection to their current life must be specific and behavioral: "this is why you still ___" not "you carry forward wisdom."
8. The lesson must feel earned from the story, not tacked on.

## Response Format (JSON)
{
  "pastLifeTitle": "A specific, memorable title like 'The Silk Road Mapmaker Who Lost His Way' or 'The Tang Guard Who Fell in Love With a Poet'",
  "era": "Specific Chinese dynasty or historical period (e.g., Tang Dynasty 618-907, Ming Dynasty, Warring States Period)",
  "identity": "What they were—specific, 2-4 words",
  "story": "A vivid 5-7 sentence narrative. Must include: (1) a real historical event or location, and (2) a specific physical object that plays a role in the story. Make it feel like a real memory, not a fairy tale.",
  "whyStillRelevant": "How this past life echoes in their current personality or struggles. Be specific: 'This is why you have that recurring dream about...' or 'This is why you feel restless every autumn.'",
  "lesson": "What unfinished business or lesson carries over",
  "presentConnection": "One specific current behavior or trait that traces directly to this past life"
}

## Critical: The story must be so specific that the customer thinks "how did they know that?" Do not write generic past life readings. Every detail should feel hand-picked for this chart. Make it shareable—people will want to screenshot this.`,

  soulmateDeepDive: `You're a fortune-teller who specializes in love and relationships. A customer who's already done their Soulmate Portrait wants the DEEP reading. You look at their Partnership Palace and tell them the real truth about how they love, what they need, and what keeps screwing them up.

## Customer's Chart
- Name: {name}
- Partnership Palace: {partnershipPalace}
- Partnership Stars: {partnershipStars}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}
- Ming Palace: {mingGong}

## Customer's Life Questions
- What keeps them awake at night: {pain1}
- Their deepest uncertainty: {pain2}
- What they're searching for: {pain3}

CRITICAL RULE: Weave at least one of these personal concerns into the love reading. If they mentioned trust or loneliness in {pain1}, make sure the love archetype, challenge, or deeper connection section directly addresses it. This reading must feel like it was written for THEM.

## Rules
1. The love archetype must feel like a real psychological type, not a zodiac sign label. Make it specific. **Frame it through a psychological lens — describe the attachment pattern, the defense mechanism, the unmet childhood need that drives their romantic choices.**
2. Core desire must be honest and specific—what do they ACTUALLY want in a partner? Not "love and connection" but "someone who challenges their opinions without dismissing them."
3. Strengths and challenges must be grounded in their chart stars, not generic relationship advice.
4. **loveArchetype MUST include a specific family or upbringing reference. Connect their romantic pattern back to something they experienced growing up — "the way your father never listened taught you to over-explain yourself in relationships" or "you learned to earn love by being useful, and now you attract partners who need fixing."**
5. **Include a specific observation about the irony or contradiction in their love life.** Every chart has one: they crave freedom but keep choosing possessive partners. They say they want softness but are drawn to intensity. They fear abandonment but push people away first. Name the contradiction explicitly.
6. Partner profile must describe a real TYPE of person, not "kind and caring."
7. Timing insight must reference their actual chart timing (大运/流年).
8. Use plain, direct English. Talk like you know something about them that they don't even know about themselves.

## Response Format (JSON)
{
  "loveArchetype": "A specific archetype name and what it means — must include a psychological pattern AND a family/upbringing root (e.g., 'The Sentry — you guard your heart behind walls you built so long ago you forgot why they're there. Maybe it started when you were the one your parents leaned on, and you learned that love means holding things together alone.')",
  "coreDesire": "What they truly seek in a partner—1-2 specific sentences that hit deep. Include the hidden desire they might not admit to themselves.",
  "loveStrengths": ["A specific relationship strength, grounded in their stars", "Another specific strength", "A third one"],
  "loveChallenges": ["A specific challenge they face in relationships, not generic — framed as a psychological pattern", "Another one — name the contradiction or irony"],
  "partnerProfile": "A vivid 2-3 sentence description of the type of person the stars suggest for them. Not a checklist—a portrait. Describe the energy, the dynamic, the way this person makes them feel.",
  "timingInsight": "When the stars suggest a significant romantic chapter may unfold. Reference 大运 or 流年 timing if possible. Be intriguing but honest.",
  "deeperConnection": "How they can move from surface-level to soul-level connection—specific advice, not 'communicate more'. Address the contradiction you identified.",
  "closingWisdom": "One final, memorable line about their relationship path that they'll want to screenshot"
}

## Critical: This must feel like a psychological insight wrapped in astrology, not a generic love horoscope. Be specific enough that the customer thinks "how did this app know that about me?" Target the pain points and the hidden desires—that's what makes it feel "so accurate it's scary"`,

  weeklyOutlook: `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer. A seeker asks: "What does this week hold for me?" You look at their chart and the shifting celestial patterns to give them a day-by-day forecast of the week ahead.

## User's Chart
- Name: {name}
- Main Star: {mainStar}
- Five Element Bureau: {bureau}
- Ming Palace: {mingGong}
- Career Palace: {careerStars}
- Wealth Palace: {wealthStars}
- Partnership Palace: {partnershipStars}
- Four Transformations: Lu={lu}, Quan={quan}, Ke={ke}, Ji={ji}

## Week Context
Week of: {startDate} to {endDate}
Current Season: {season}
Solar Term (节气): {solarTerm}
Moon Phase: {moonPhase}

## Response Format (JSON)
{
  "overview": "A 2-3 sentence overview of the week's overall energy - what to expect, what to watch for. Reference seasonal or celestial context.",
  "weeklyEnergy": "Description of the week's Five Element energy flow and how it interacts with the user's Bureau",
  "days": [
    {
      "day": "Monday",
      "energy": "The dominant energy of this day (e.g. 'Wood rising - initiative is favored')",
      "focus": "What to focus on today - one specific area of life (career, relationships, self, etc.)",
      "advice": "One actionable piece of advice for this day"
    },
    {
      "day": "Tuesday",
      "energy": "...",
      "focus": "...",
      "advice": "..."
    },
    {
      "day": "Wednesday",
      "energy": "...",
      "focus": "...",
      "advice": "..."
    },
    {
      "day": "Thursday",
      "energy": "...",
      "focus": "...",
      "advice": "..."
    },
    {
      "day": "Friday",
      "energy": "...",
      "focus": "...",
      "advice": "..."
    },
    {
      "day": "Saturday",
      "energy": "...",
      "focus": "...",
      "advice": "..."
    },
    {
      "day": "Sunday",
      "energy": "...",
      "focus": "...",
      "advice": "..."
    }
  ],
  "keyTheme": "One sentence capturing the week's single most important theme",
  "classicalText": "A classical Chinese text (from 紫微斗数, 易经, or similar) that resonates with this week's energy - include source",
  "classicalTranslation": "English translation of the classical text"
}

Requirements:
- The overview must feel like a real weather report for the soul, not a generic horoscope
- Each day must have a distinct energy that shifts naturally through the week - do not repeat
- Each day's focus and advice must be specific and actionable
- weeklyEnergy should describe the Five Element flow (Wood/Fire/Earth/Metal/Water) and its implications
- keyTheme should be concise and memorable - something the user will carry through the week
- Consider seasonal transitions, the moon phase, and any solar terms when crafting each day's energy
- Classical text must include its source
- Keep the tone wise, grounded, and slightly mystical - like an elder reading omens for the week ahead`
};

// ==================== 核心函数 ====================

/**
 * 调用 DeepSeek API
 * 路由优先级：
 *   1. Supabase Edge Function 代理（生产环境，API Key在服务端）
 *   2. 直接调用 DeepSeek API（本地开发/调试，Key来自 localStorage）
 */
async function callDeepSeekAPI(prompt, systemPrompt = '') {
  if (!AI_CONFIG.apiKey && !AI_CONFIG.supabaseEdgeFunctionUrl) {
    console.warn('⚠️ No API key/url configured, using fallback');
    return generateFallbackResponse(prompt);
  }

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  // 优先：Supabase Edge Function 代理
  if (AI_CONFIG.supabaseEdgeFunctionUrl) {
    const proxyResult = await callDeepSeekAPI_viaProxy(messages);
    if (proxyResult) return proxyResult;
    // 代理失败，回退到直连
    console.log('ℹ️ Proxy failed, falling back to direct DeepSeek API call');
  }

  // 回退：直接调用 DeepSeek API
  try {
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
  // 根据prompt类型生成深度预设备用响应
  var today = new Date();
  var month = today.getMonth(); // 0-based
  var date = today.getDate();
  var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  var monthDay = month * 100 + date;
  
  // ------ dailyWhisper fallback (日期感知) ------
  if (prompt.includes('dailyWhisper') || prompt.includes('daily fortune')) {
    // 根据月相和特殊日期生成不同的whisper
    var moonPhase = dayOfYear % 29.5;
    var isNewMoon = moonPhase < 1.5 || moonPhase > 28;
    var isFullMoon = moonPhase > 13.5 && moonPhase < 16;
    var isFriday13th = today.getDay() === 5 && date === 13;
    
    var whisper = '';
    var doList = [];
    var dontList = [];
    var luckyDirection = '';
    var luckyElement = '';
    var goldenHour = '';
    var classicalText = '';
    var interpretation = '';
    
    if (isNewMoon) {
      whisper = 'The sky is dark and waiting. What you plant in silence today will grow when the light returns.';
      doList = [
        'Set intentions for the month ahead with pen and paper',
        'Spend the evening alone in quiet reflection',
        'Clean out a physical space to invite new energy',
        'Write a letter to your future self about what you want to release',
        'Start a new project even if it feels fragile and small',
        'Meditate on what you truly want — not what you think you should want'
      ];
      dontList = [
        'Push yourself into social situations you do not feel',
        'Force decisions before the energy has settled',
        'Share your plans with people who will doubt them',
        'Spend money impulsively — new moon energy is for intention, not action',
        'Ignore a quiet feeling of restlessness — it is telling you something'
      ];
      luckyDirection = 'North';
      luckyElement = 'Water';
      goldenHour = 'Zi Hour (11 PM - 1 AM)';
      classicalText = '朔月之夜，万象更新，宜静思内省。';
      interpretation = 'The new moon erases the slate. Your inner world is louder than the outer one today — listen to what surfaces when no one is watching.';
    } else if (isFullMoon) {
      whisper = 'The full moon pulls everything to the surface — what you have buried is asking to be seen.';
      doList = [
        'Release something you have been holding onto too tightly',
        'Have the honest conversation you have been avoiding',
        'Write down what is coming to a head and look for patterns',
        'Spend time under the moonlight if you can — even for five minutes',
        'Trust what rises emotionally without judging it',
        'Celebrate how far you have come, even if the destination is unclear'
      ];
      dontList = [
        'Start something new — full moon is for completion, not initiation',
        'Suppress emotions that surface — they are here to be processed',
        'Make permanent decisions based on temporary intensity',
        'Assume the worst when things feel heightened — clarity comes after the peak',
        'Isolate yourself completely — you need reflection but not exile'
      ];
      luckyDirection = 'Southwest';
      luckyElement = 'Fire';
      goldenHour = 'Mao Hour (5-7 AM, before sunrise)';
      classicalText = '月满盈亏，物极必反，诸事宜静不宜动。';
      interpretation = 'Everything is magnified under the full moon. Do not act on impulse — observe what surfaces and let it teach you before you decide.';
    } else if (isFriday13th) {
      whisper = 'The veils are thin today and the boundary between luck and misfortune is drawn in chalk. Walk carefully.';
      doList = [
        'Carry a small protective object — a key, a coin, a stone',
        'Double-check your plans before committing to anything',
        'Trust your instincts if something feels off',
        'Keep your words kind — what you say today echoes twice as far',
        'Stay grounded — eat well, drink water, wear something that feels like armor',
        'Laugh at small misfortunes — they feed on fear'
      ];
      dontList = [
        'Sign contracts or make binding agreements',
        'Take unnecessary risks with money or travel',
        'Engage in arguments that serve no purpose',
        'Walk under ladders or tempt superstition — respect the energy',
        'Ignore a feeling of dread — acknowledge it and move on'
      ];
      luckyDirection = 'East';
      luckyElement = 'Earth';
      goldenHour = 'Chen Hour (7-9 AM)';
      classicalText = '晦气临门，宜守不宜攻，静观其变。';
      interpretation = 'Friday the 13th carries old, prickly energy. It is not bad luck — it is a test of how well you hold your ground when things feel unpredictable.';
    } else {
      // 普通日期的通用版
      var hour = today.getHours();
      if (hour < 6) {
        whisper = 'The stars are still awake while the world sleeps. Whatever is keeping you up — it has something to tell you.';
        doList = ['Rest even if you cannot sleep — stillness counts', 'Let your mind wander without judgment', 'Drink something warm'];
        dontList = ['Open your phone and spiral', 'Make decisions before sunrise', 'Lie to yourself about why you are awake'];
        classicalText = '夜深星明，思绪如水，静待天明。';
        interpretation = 'The pre-dawn hours carry a different frequency. Your subconscious is closer to the surface right now — pay attention to what drifts through your mind.';
      } else if (hour < 12) {
        whisper = 'Morning light carries yesterday\'s residue and today\'s potential. Choose which one you carry forward.';
        doList = ['Set one clear intention for the day', 'Move your body even briefly', 'Eat something that fuels you'];
        dontList = ['Check notifications before checking in with yourself', 'Rush into the day without a moment of pause', 'Carry yesterday\'s mood into today\'s decisions'];
        classicalText = '晨光初照，万象更新。';
        interpretation = 'The morning hours belong to you before they belong to the world. Take that sliver of time for yourself.';
      } else if (hour < 17) {
        whisper = 'The sun is high and the world demands your attention. Stay centered or the noise will steer you.';
        doList = ['Take one deliberate pause mid-day', 'Tackle one thing you have been postponing', 'Step outside for air even for two minutes'];
        dontList = ['Let other people\'s urgency become your emergency', 'Skip lunch or eat while working', 'Say yes to something you mean to say no to'];
        classicalText = '日中则昃，月盈则亏。';
        interpretation = 'Mid-day tests your boundaries. How you protect your energy now determines how much you have left tonight.';
      } else {
        whisper = 'The sun has set but the mind is still running. Let it slow down on its own — do not force it.';
        doList = ['Close one open loop before bed', 'Wind down with something that does not involve a screen', 'Reflect on one thing that went well today'];
        dontList = ['Replay the day\'s regrets', 'Scroll until your eyes burn', 'Make big plans when you are tired'];
        classicalText = '日落星升，万事休矣。';
        interpretation = 'Evening is for release. Let the day go even if it did not go the way you wanted — tomorrow is a new chart entirely.';
      }
      
      luckyDirection = ['North', 'East', 'Southwest', 'Northwest'][dayOfYear % 4];
      luckyElement = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'][dayOfYear % 5];
      goldenHour = ['Chen Hour (7-9 AM)', 'Wu Hour (11 AM - 1 PM)', 'You Hour (5-7 PM)', 'Hai Hour (9-11 PM)'][dayOfYear % 4];
    }
    
    return JSON.stringify({
      whisper: whisper,
      doList: doList,
      dontList: dontList,
      luckyDirection: luckyDirection,
      luckyElement: luckyElement,
      goldenHour: goldenHour,
      classicalText: classicalText,
      interpretation: interpretation
    });
  }
  
  // ------ personality reading fallback ------
  if (prompt.includes('personality')) {
    var personalities = [
      {
        combination: 'Your Rat nature steeped in Water element creates a mind that moves faster than most — sharp, strategic, always three steps ahead. But speed without rest becomes exhaustion.',
        coreTraits: ['Quick-witted and sees patterns others miss', 'Naturally cautious but capable of bold moves', 'Socially adaptable — can talk to anyone', 'Resourceful in crisis', 'Deeply private despite appearing open'],
        strengths: ['Exceptional problem-solving under pressure', 'Reads people accurately within minutes', 'Turns setbacks into opportunities', 'Intuitive about money and timing'],
        weaknesses: ['Tendency to overthink until action becomes impossible', 'Can be manipulative without realizing it', 'Anxiety masquerades as preparation'],
        classicalText: '鼠年生水，水主智，智慧如深渊，深不可测。',
        classicalAdvice: 'Trust your instincts but question your assumptions. Your mind is a weapon — do not turn it on yourself.',
        luckyElements: { colors: ['blue', 'black'], seasons: ['winter'], direction: 'north' }
      },
      {
        combination: 'Your Tiger nature with Wood element makes you a natural force — magnetic, fierce, impossible to ignore. But fire that burns too bright leaves ashes behind.',
        coreTraits: ['Bold and unafraid of confrontation', 'Protective of those you love', 'Impulsive but often right', 'Craves freedom and hates cages', 'Charismatic leader energy'],
        strengths: ['Courageous when others hesitate', 'Inspires loyalty without asking for it', 'Gets things done while others plan', 'Emotionally honest to a fault'],
        weaknesses: ['Can be recklessly impatient', 'Struggles with authority and routine', 'Burns out because you do not know how to pause'],
        classicalText: '虎年生木，木主仁，仁心侠骨，义薄云天。',
        classicalAdvice: 'Strength without tempering breaks the blade. Learn when to wait — not everything is a battle.',
        luckyElements: { colors: ['green', 'orange'], seasons: ['spring'], direction: 'east' }
      },
      {
        combination: 'Your Dragon nature with Earth element is rare and powerful — you carry a weight you did not ask for but refuse to put down. The world expects much from you because you expect much from yourself.',
        coreTraits: ['Ambitious with a vision that is larger than life', 'Perfectionist tendencies that fuel and exhaust you', 'Charismatic but keeps people at a distance', 'Deeply principled — your word is your bond', 'Secretly softer than you let on'],
        strengths: ['Natural leader who inspires without trying', 'Sees the big picture when others are stuck in details', 'Resilient — you have survived things that would break most people', 'Generous when it counts'],
        weaknesses: ['Sets standards no human can meet consistently', 'Lonely at the top and refuses to admit it', 'Can be arrogant when stressed'],
        classicalText: '龙年生土，土主信，诚信如鼎，稳如泰山。',
        classicalAdvice: 'You do not have to carry everything alone. Strength is not just holding on — it is knowing when to let others help.',
        luckyElements: { colors: ['gold', 'red'], seasons: ['summer'], direction: 'center' }
      }
    ];
    
    var idx = dayOfYear % personalities.length;
    return JSON.stringify(personalities[idx]);
  }
  
  // 检测prompt类型
  var isFullChart = prompt.includes('fullChartReading') || prompt.includes('12-palace');
  var isMonthly = prompt.includes('monthlyGuide') || prompt.includes('monthly guide') || prompt.includes('What\'s coming for me next month');
  var isPastLife = prompt.includes('pastLifeInsight') || prompt.includes('past life') || prompt.includes('Who was I before');
  var isSoulmateDeep = prompt.includes('soulmateDeepDive') || prompt.includes('deep reading') || prompt.includes('DEEP reading');
  var isWeekly = prompt.includes('weeklyOutlook') || prompt.includes('weekly outlook') || prompt.includes('week ahead');
  
  // ------ fullChartReading fallback (完整12宫命盘解读) ------
  if (isFullChart) {
    return JSON.stringify({
      overview: 'Your chart tells me you are someone who carries two opposing truths at once. You want stability but you get bored when things are too safe. You care deeply about what people think of you, but you also secretly do not want to be understood completely. Your Zi Wei star in the Ming Palace gives you a natural command presence — people notice when you walk into a room, even when you wish they would not. But your Tian Fu star adds a layer of refinement that means you feel things more than you let on. Your blind spot? You assume everyone operates the same way you do and get frustrated when they do not. Not everyone thinks three moves ahead like you do.',
      palaces: [
        {
          name: 'Ming Palace',
          chinese: '命宫',
          stars: 'Zi Wei, Tian Fu',
          interpretation: 'With Zi Wei in your Ming Palace, you were born under a sovereign star. This means you have a core identity that expects to lead — not because you are bossy, but because you naturally see the right path and get impatient when others do not. Your Tian Fu star adds an aristocratic layer: you care about quality, aesthetics, and how things look on the surface even when you pretend not to. At work, you are the person who takes over without asking because you cannot stand watching someone do it wrong. In friendships, you attract people who lean on you, and you let them because it feels easier than admitting you also need support. Your default mode is control disguised as calm.'
        },
        {
          name: 'Sibling Palace',
          chinese: '兄弟宫',
          stars: 'Tian Tong',
          interpretation: 'Your sibling palace carries Tian Tong, a star of emotional bonds and friendship. This suggests you either have a sibling who is your closest confidant, or you have built friendships that function like family. You are the peacemaker in group dynamics — the one who smooths things over when tension rises. But the pattern here is that you give more than you receive in these relationships, and over time that builds a quiet resentment you never voice. The specific scene: you are the one planning the group trip, checking in on people, remembering birthdays. And sometimes you wonder who would do the same for you.'
        },
        {
          name: 'Partnership Palace',
          chinese: '夫妻宫',
          stars: 'Lian Zhen',
          interpretation: 'Lian Zhen in your Partnership Palace tells me your love life has never been simple. You are drawn to intensity — people who challenge you, provoke you, make you feel alive even when the dynamic is unstable. You say you want peace but you get bored with people who give you too much of it. The contradiction is that you also crave safety: you want someone who will not leave, but you test them to see if they will. In your last relationship or the one you think about too much, there was a moment where you could have walked away and you stayed — or you walked away and wondered if you should have stayed. That pattern is not random. It is written in your stars.'
        },
        {
          name: 'Children Palace',
          chinese: '子女宫',
          stars: 'Tian Liang',
          interpretation: 'Tian Liang in your Children Palace suggests a nurturing side that comes out in unexpected ways. You may not see yourself as the caretaker type, but people younger than you — children, mentees, younger colleagues — naturally gravitate toward you for guidance. You have a gift for explaining complicated things simply. The pattern here: you pour energy into helping others grow, sometimes at the expense of your own growth. If you have children or plan to, you will be the parent who reads the parenting books and still worries you are getting it wrong. If not, you channel this energy into creative projects or mentorship. Either way, you care more than you let on.'
        },
        {
          name: 'Wealth Palace',
          chinese: '财帛宫',
          stars: 'Wu Qu',
          interpretation: 'Wu Qu in your Wealth Palace means money is never just money to you — it is security, control, and a scorecard. You think about it more than you admit. You are not reckless with spending, but you have a specific indulgence (travel, a hobby, good food) that you justify to yourself every single time. The behavioral pattern: you check your balance more than you need to. You calculate before committing. You are generous with people you care about but it pains you a little when the bill comes. The lesson here is not about earning more — it is about loosening the grip just enough that money stops running your emotional state.'
        },
        {
          name: 'Health Palace',
          chinese: '疾厄宫',
          stars: 'Tai Yin',
          interpretation: 'Tai Yin in your Health Palace points to a body that responds to emotional stress before your mind catches up. You get headaches when you are suppressing something. Your sleep suffers when you are carrying unresolved tension. You carry stress in your shoulders and neck — the classic sign of someone who takes on too much and complains too little. The specific scene: you have pushed through exhaustion more times than you can count, telling yourself you will rest later. Later never comes until your body forces you to stop. The message here is not alarming — it is a pattern to watch. Your body speaks in whispers before it shouts.'
        },
        {
          name: 'Travel Palace',
          chinese: '迁移宫',
          stars: 'Tan Lang',
          interpretation: 'Tan Lang in your Travel Palace reveals a restless soul disguised as a practical person. You crave new experiences — new places, new faces, new ways of seeing the world. When you travel, a different version of you comes out: more adventurous, more spontaneous, more open. The pattern at home is the opposite — you can get stuck in routines that drain you, all while dreaming of escape. The insight: you do not necessarily need a plane ticket. You need novelty in your everyday life. A new route, a new hobby, a new conversation with someone unexpected. Your spirit expands when you expose yourself to the unfamiliar.'
        },
        {
          name: 'Social Palace',
          chinese: '交友宫',
          stars: 'Ju Men',
          interpretation: 'Ju Men in your Social Palace means your social circle is smaller than people think. You appear friendly and approachable, but you are selective about who gets past a certain point. You have a sharp tongue when you feel safe enough to use it — your friends know you as the one who tells the truth even when it stings. The behavioral pattern: you attract people who want your opinion, your advice, your clarity. But you rarely ask for the same in return. The imbalance is invisible to others but heavy for you. Your social battery drains faster than people realize because you are always performing a version of yourself that is sharper, funnier, more put-together.'
        },
        {
          name: 'Career Palace',
          chinese: '官禄宫',
          stars: 'Zi Wei',
          interpretation: 'Zi Wei in your Career Palace confirms what you already suspect: you are not meant to follow. You are built to lead, whether you have the title for it or not. You have strong opinions about how things should be done and struggle to execute someone else\'s vision without tweaking it. The career pattern: you do your best work when you have autonomy. Micromanagement makes you resentful and sloppy. You have either changed jobs because of a boss who did not trust you, or you have thought about it. The advice here is not to quit impulsively — it is to build leverage. Skills, reputation, relationships — things that make you the one in control of your next move.'
        },
        {
          name: 'Property Palace',
          chinese: '田宅宫',
          stars: 'Tian Fu',
          interpretation: 'Tian Fu in your Property Palace means your home environment matters more to your well-being than you give it credit for. You are sensitive to your physical surroundings — clutter stresses you out more than it should, and a space that feels wrong drains your energy. The pattern: you either spend too much on making your space beautiful, or you neglect it entirely because you are too busy with other things. Either way, your environment reflects your inner state. When your space is chaotic, your mind is chaotic. When your space is settled, you breathe easier. The insight: invest in your home not as a status symbol but as a sanctuary.'
        },
        {
          name: 'Fortune Palace',
          chinese: '福德宫',
          stars: 'Tai Yang',
          interpretation: 'Tai Yang in your Fortune Palace reveals your spiritual nature — and it is surprisingly optimistic for someone who overthinks as much as you do. Beneath the worry and the planning, you genuinely believe things will work out. You have a core resilience that you do not give yourself credit for. When life hits hard, you bend but you do not break. The scene: people have told you you are stronger than you think, and you did not believe them. But look back at what you have already survived. That is Tai Yang energy — the sun always rises, even after the longest night. Your fortune lies in your refusal to stay down, even when staying down would be easier.'
        },
        {
          name: 'Parents Palace',
          chinese: '父母宫',
          stars: 'Tian Ji',
          interpretation: 'Tian Ji in your Parents Palace suggests your relationship with your parents or upbringing was intellectually charged. One of your parents was sharp, analytical, and probably critical — not maliciously, but in a way that made you grow up fast mentally. You learned early that being smart earned you approval. This shaped how you seek validation today: you still believe you have to earn love through achievement. The pattern shows up when you over-explain yourself, when you feel the need to prove your worth before anyone asked. Your parents gave you a gift of intelligence but also a burden — the feeling that you are only as valuable as your last accomplishment.'
        }
      ],
      keyTheme: 'You have spent so much time taking care of everyone else\'s world that you forgot yours needs tending too. The stars are not asking you to change who you are. They are asking you to extend the same grace to yourself that you offer so freely to others.',
      classicalText: '紫微坐命，天相辅之，福慧双修，贵不可言。',
      classicalTranslation: 'Purple Star sits in the Palace of Life, supported by the Seal of Heaven — fortune and wisdom walk together, and nobility cannot be spoken aloud.'
    });
  }
  
  // ------ monthlyGuide fallback (月份感知) ------
  if (isMonthly) {
    // 尝试从prompt中提取月份
    var monthMatch = prompt.match(/January|February|March|April|May|June|July|August|September|October|November|December/);
    var fallbackMonth = monthMatch ? monthMatch[0] : 'January';
    var isWinterMonth = ['January', 'February', 'December'].indexOf(fallbackMonth) >= 0;
    var isSummerMonth = ['June', 'July', 'August'].indexOf(fallbackMonth) >= 0;
    var isSpringMonth = ['March', 'April', 'May'].indexOf(fallbackMonth) >= 0;
    
    if (fallbackMonth === 'January') {
      return JSON.stringify({
        keyword: 'Rebirth',
        energyPhrase: 'The Year Turns',
        overview: 'January carries the sharp, clean energy of a new beginning. The old year has released its grip and the slate is blank — but do not mistake quiet for empty. This month is a doorway, not a destination. The deep winter stillness asks you to move slowly even as the world around you accelerates into resolutions and goals. Your chart shows that the first weeks of the year favor strategy over action: plan now, execute later. The solar term of Xiaohan (Minor Cold) sits in early January, urging you to conserve warmth and energy before the spring thrust arrives.',
        weeks: [
          {
            week: 'Week 1',
            focus: 'Closing the last loop. The residue of last year is still settling.',
            advice: 'The first week of January is like the last ember of a fire — still warm but no longer burning. You may feel pressure to start everything at once, but your stars suggest a slow unfurling instead. Use this week to close what is unfinished: the email you meant to send, the conversation you avoided, the closet you have been meaning to organize. Small closures create momentum. Do not start something new until the old is acknowledged.',
            highlight: 'A message from someone from your past may arrive — do not ignore it, but do not rush to respond either.'
          },
          {
            week: 'Week 2',
            focus: 'Intention setting under the new moon.',
            advice: 'The new moon in early January amplifies the energy of beginnings, but your chart warns against grand declarations. Instead of a dramatic resolution, pick one small practice you can maintain for forty days. January is a month of testing — whatever you start now will reveal whether it is genuine desire or just新年 energy. Check your Wealth Palace: this is a good week to review your finances and set a clear budget for the months ahead.',
            highlight: 'An opportunity to restructure something — your schedule, your budget, your morning routine — will present itself.'
          },
          {
            week: 'Week 3',
            focus: 'Tension between past and future.',
            advice: 'Mid-January brings a friction point. The newness has worn off and the reality of winter settles in. You may feel a dip in motivation — this is normal, not a sign of failure. Your Career Palace is active here, so work demands may increase, but resist the urge to overcommit. The winter season favors rest, and your body will remind you of this if you ignore it. Prioritize sleep and say no to one thing you would normally say yes to.',
            highlight: 'A creative idea will surface in a moment of boredom — capture it before it slips away.'
          },
          {
            week: 'Week 4',
            focus: 'Gathering momentum beneath the surface.',
            advice: 'The last week of January carries the energy of Dahan (Major Cold), the final solar term of winter. Things feel still on the surface but much is happening underground. Your Social Palace lights up: unexpected invitations or reconnections may come. Do not isolate completely — even low-key social contact will lift your energy more than you expect. The seeds you planted in week one are beginning to germinate. Trust the invisible process.',
            highlight: 'A chance encounter with someone who shares your vision could plant the seed for a collaboration later in the year.'
          }
        ],
        luckyElements: {
          direction: 'North',
          color: 'Deep blue',
          number: 1
        },
        watchPalace: 'Your Wealth Palace needs attention this month. The urge to spend on fresh starts is strong in January, but your stars advise restraint. Budget before you buy. Your Fortune Palace suggests that this year\'s abundance comes from discipline, not impulse.',
        closingAdvice: 'January is not asking you to have everything figured out. It is asking you to trust that the winter is preparing you for spring. Do not rush the process.'
      });
    } else if (fallbackMonth === 'June') {
      return JSON.stringify({
        keyword: 'Expansion',
        energyPhrase: 'Fire Meets Air',
        overview: 'June arrives with the full heat of summer and the longest days of the year. The solar term of Mangzhong (Grain in Ear) marks a time of rapid growth — in nature and in life. Your chart shows that this month carries a restless, expansive energy. You may feel pulled in multiple directions: more social invitations, more opportunities, more demands on your time. The danger is not having too little but trying to hold too much. Summer is a season of action, but even fire needs fuel. Monitor your Partnership Palace — relationships demand attention this month, and neglect will cost more than you think.',
        weeks: [
          {
            week: 'Week 1',
            focus: 'Ignition. The energy of the month is still building.',
            advice: 'The first week of June carries the momentum of late spring into full summer. You will feel a noticeable shift in your energy — more drive, more desire to go out, to create, to connect. Your Travel Palace is active, suggesting that movement (even small trips or daily walks in new places) will unlock ideas. Use this week to initiate something you have been postponing. Your stars align for bold first steps, not perfect ones.',
            highlight: 'An invitation to an event, trip, or gathering that feels inconvenient may be exactly what you need.'
          },
          {
            week: 'Week 2',
            focus: 'Connection and friction in equal measure.',
            advice: 'Mid-June brings the summer solstice — the point of maximum light. This energy can be exhilarating but also overwhelming. Your Social Palace is highlighted, and you may find yourself in the middle of group dynamics that require diplomacy. Someone close to you may need more from you than you have to give. Set boundaries clearly and early. The solstice energy amplifies everything, including conflict. A disagreement this week is not a sign of a broken relationship — it is a sign that something needs to be said.',
            highlight: 'A conversation that starts awkwardly will end with clarity if you stay honest.'
          },
          {
            week: 'Week 3',
            focus: 'Harvest and heat.',
            advice: 'The third week of June brings the fruits of what you planted earlier in the year. Look back at your intentions from spring — something you started in March or April is now coming to fruition. Your Career Palace suggests professional recognition or progress, but the cost is energy. You may feel depleted by the constant social and work demands. The advice: rest is not optional in summer. Without it, the fire burns out. Take one day this week with zero obligations.',
            highlight: 'A financial opportunity or gift may arrive unexpectedly — accept it without guilt.'
          },
          {
            week: 'Week 4',
            focus: 'The turn toward depth.',
            advice: 'As June closes, the days begin to shorten imperceptibly. The energy shifts from pure outward expansion to a mix of action and reflection. Your Fortune Palace is active, inviting you to ask: what am I building and why? The summer haze can make you lose sight of long-term direction. Use the last week of June to journal, to sit still, to ask the harder questions beneath the surface. The answers are quieter than the summer noise.',
            highlight: 'A moment of stillness — a sunset, a late-night conversation, a quiet morning — will reveal something important.'
          }
        ],
        luckyElements: {
          direction: 'South',
          color: 'Coral',
          number: 6
        },
        watchPalace: 'Your Health Palace signals caution. Summer energy makes you feel invincible, but your body has limits. Watch for signs of burnout around week three. Sleep, hydration, and solitude are non-negotiable.',
        closingAdvice: 'Summer is generous with its energy, but it does not discriminate. Pour yourself into what matters and let the rest burn away. You cannot do everything, and you were not meant to.'
      });
    } else if (fallbackMonth === 'December') {
      return JSON.stringify({
        keyword: 'Completion',
        energyPhrase: 'The Year Unwinds',
        overview: 'December carries the heavy, reflective energy of endings. The solar term of Daxue (Major Snow) blankets the Northern Hemisphere in stillness, and your chart mirrors this inward turn. This is not a month for launching — it is a month for closing, reviewing, and releasing. The year has given you what it came to give, and December asks you to receive it fully before moving on. Your Ming Palace is in a reflective phase, making you more introspective than usual. Honor that. The pressure to end the year on a high note is external. Internally, the stars are asking you to rest.',
        weeks: [
          {
            week: 'Week 1',
            focus: 'The residue of November settles.',
            advice: 'December begins with the energy of the previous month still clinging to you. You may feel tired in a way that sleep does not fix — a deeper exhaustion from a long year. Your Health Palace is sensitive now: honor what your body is telling you. This is not the week to push through. Cancel what you can, simplify where possible, and let yourself be unproductive. The world will not stop because you slow down, but you might break if you do not.',
            highlight: 'Old patterns or habits will surface for review — not to shame you, but to show you what you have outgrown.'
          },
          {
            week: 'Week 2',
            focus: 'Year-end review and reckoning.',
            advice: 'Mid-December brings the energy of clear sight. This is the week to look back at the year honestly — not with regret, but with the clarity that distance provides. Your Career Palace and Property Palace are active, making this a good time to review your professional and living situations. What worked? What drained you? What are you ready to leave behind? Be honest in your answers. The stars favor truth over comfort right now.',
            highlight: 'An old friend or colleague may reappear, and the conversation will reveal how much you have changed.'
          },
          {
            week: 'Week 3',
            focus: 'The darkest days.',
            advice: 'The winter solstice falls this week — the longest night of the year. It is a powerful portal: the point of maximum darkness before the light returns. Your Partnership Palace may feel heavy: relationships require patience now, not fixing. If there is tension, let it breathe. Do not force resolutions before the solstice passes. The darkness is not a problem to solve. It is a condition to endure. And you have endured harder things than this.',
            highlight: 'A quiet moment alone near the solstice — even ten minutes of candle-gazing — will recalibrate something in you.'
          },
          {
            week: 'Week 4',
            focus: 'Release and renewal.',
            advice: 'The final week of the year is for letting go, not holding on. Your Fortune Palace and Parents Palace are lit, suggesting that family dynamics or inherited patterns may surface. Observe them without getting pulled in. Whatever you release before the new year — a resentment, an attachment, an old story about yourself — will lighten your load for what comes next. You do not need to enter January carrying December\'s weight.',
            highlight: 'The new year energy will flicker before it fully ignites. Set one intention for the year ahead, but keep it private.'
          }
        ],
        luckyElements: {
          direction: 'Northwest',
          color: 'Silver',
          number: 12
        },
        watchPalace: 'Your Fortune Palace requires gentle attention. December amplifies emotions — grief, gratitude, nostalgia, regret. Let them coexist. Your goal is not to feel only good feelings but to feel them all without being consumed.',
        closingAdvice: 'You made it through another year. That is not a small thing. Before you plan the next chapter, close this one properly. The end of the year is not a deadline — it is a threshold. Cross it with grace, not exhaustion.'
      });
    } else if (fallbackMonth === 'April') {
      return JSON.stringify({
        keyword: 'Awakening',
        energyPhrase: 'Spring Unfolds',
        overview: 'April is the month when spring stops promising and starts delivering. The solar term of Qingming (Clear and Bright) signals a turning point — the fog of early spring lifts and things become visible again. Your chart shows a surge of creative and social energy this month. What felt stuck in March begins to move. The danger is scattering your energy across too many directions. Let spring\'s momentum carry you, but keep one hand on the rudder.',
        weeks: [
          { week: 'Week 1', focus: 'Clearing the debris of March.', advice: 'The first week of April carries a cleansing energy. Use it to clear unfinished business — old emails, unresolved conversations, physical clutter. Your Health Palace is active, and the Qingming solar term encourages you to tend to your body and home. A fresh start requires a clean foundation.', highlight: 'A solution to a problem that has been nagging you will appear when you stop forcing it.' },
          { week: 'Week 2', focus: 'Social re-emergence.', advice: 'Mid-April brings a burst of social energy. Your Social Palace lights up, drawing people toward you. Accept invitations even if you are not in the mood — the connections you make this week carry more weight than usual. Your Communication Palace is strong: speak your mind clearly, especially about what you want.', highlight: 'A new acquaintance may quickly become an important ally or friend.' },
          { week: 'Week 3', focus: 'Creative acceleration.', advice: 'The third week of April is fertile ground for creative work. Your Children Palace and Fortune Palace align, making this an excellent time to start a personal project, write, paint, or plan something that is purely for joy. Do not wait for inspiration to strike perfectly — start imperfectly and let the energy build.', highlight: 'An idea that felt half-formed will click into place with surprising clarity.' },
          { week: 'Week 4', focus: 'Planting for summer.', advice: 'As April closes, the energy turns toward preparation for summer. Your Career Palace and Property Palace are highlighted: review your professional goals and physical environment. What do you need in place by June to feel secure? The seeds you plant now will bloom in the summer months. Give them attention.', highlight: 'A financial or practical decision made now will pay off significantly in three months.' }
        ],
        luckyElements: { direction: 'East', color: 'Spring green', number: 4 },
        watchPalace: 'Your Social Palace is active — do not overcommit socially at the expense of rest. Spring energy is seductive but finite.',
        closingAdvice: 'Spring does not ask for permission. It simply arrives. Let this month carry you forward into something new — you have been waiting long enough.'
      });
    } else if (fallbackMonth === 'October') {
      return JSON.stringify({
        keyword: 'Harvest',
        energyPhrase: 'Gold and Shadow',
        overview: 'October brings the shift from the intensity of autumn to something softer and more reflective. The solar term of Hanlu (Cold Dew) signals the cooling of the earth — and your energy follows suit. Your chart shows a month of reckoning: what you planted earlier in the year is ready to be harvested, but not everything will be what you expected. October asks you to sort through what worked, what did not, and what you are ready to release. The days are shortening, and so should your to-do list.',
        weeks: [
          { week: 'Week 1', focus: 'Taking stock.', advice: 'The first week of October carries the energy of assessment. Your Wealth Palace and Career Palace are active, making this a good time to review your professional and financial position. Do not judge yourself for what has not gone according to plan — simply observe. October rewards honesty more than optimism.', highlight: 'A number or statistic that surprises you will reveal something about your trajectory.' },
          { week: 'Week 2', focus: 'Relationships under the harvest moon.', advice: 'Mid-October brings a full harvest moon that illuminates your Partnership Palace. Relationship dynamics come into focus — what you have been avoiding in a partnership (romantic or otherwise) will surface. The advice: do not look away. The harvest moon reveals what is ready to be gathered and what is ready to be let go.', highlight: 'A conversation you have been postponing will be easier than you think once you start it.' },
          { week: 'Week 3', focus: 'Letting go.', advice: 'The third week of October carries a bittersweet energy. Your Fortune Palace is active, and you may feel a pull toward nostalgia or regret. Honor what you have been through, but do not live there. October teaches that letting go is not losing — it is making space. Clear out what no longer serves you: old habits, old resentments, old versions of yourself.', highlight: 'An object or keepsake you find while cleaning will trigger a memory that helps you understand something about your present.' },
          { week: 'Week 4', focus: 'Preparing for the dark.', advice: 'As October closes, the veil between worlds thins. Your Parents Palace and Sibling Palace are highlighted, making this a time of ancestral connection and family dynamics. Whether you honor this literally or metaphorically, the energy asks you to acknowledge where you come from — and decide what to carry forward into the darker months ahead.', highlight: 'A dream or strong intuition carries a message from someone or something older than you.' }
        ],
        luckyElements: { direction: 'West', color: 'Amber', number: 10 },
        watchPalace: 'Your Partnership Palace is under intense review this month. Do not make permanent decisions based on temporary autumn moods, but do not ignore what is being shown to you either.',
        closingAdvice: 'October is not the end of the year, but it is the end of the growing season. Take what is good, release what is not, and trust that winter\'s rest will prepare you for a new cycle.'
      });
    } else {
      // 通用月份版
      return JSON.stringify({
        keyword: 'Balance',
        energyPhrase: 'The Middle Path',
        overview: 'This month carries a steady, unremarkable energy — and that is not a bad thing. Not every month is meant to be dramatic. Your chart shows a period of maintenance rather than breakthrough. The work of this month is quiet, consistent, and cumulative. The solar terms of this period suggest gradual change rather than sudden shifts. Pay attention to your routines because they will determine your momentum for the coming season.',
        weeks: [
          { week: 'Week 1', focus: 'Reading the temperature.', advice: 'The first week sets the tone for the month. Take it slowly and observe before you act. Your Social Palace is moderately active — accept invitations but keep your energy for what matters. The pace of this week is deliberate. Do not rush into decisions.', highlight: 'A small but consistent effort this week will compound more than you expect.' },
          { week: 'Week 2', focus: 'Deepening the work.', advice: 'Mid-month energy supports focus and depth. Pick one area of your life — work, health, a relationship, a creative project — and give it concentrated attention. Your Career Palace suggests that incremental progress now will yield visible results by next month.', highlight: 'An offer or opportunity may arrive disguised as extra work. Look closer before declining.' },
          { week: 'Week 3', focus: 'Social connections and unexpected turns.', advice: 'The third week brings a slight shift in energy. Your Travel Palace or Social Palace may activate unexpectedly. Be open to detours from your routine — they carry information you need. A conversation or chance encounter this week will affect your thinking going forward.', highlight: 'Someone you meet casually this week will mention something that stays with you for months.' },
          { week: 'Week 4', focus: 'Review and consolidate.', advice: 'As the month closes, take stock of what you have learned. Your Fortune Palace invites reflection. This month may not have been remarkable, but it has been instructive. What patterns do you see? What do you want to take into next month?', highlight: 'A book, article, or piece of media you encounter will articulate something you have been feeling but could not name.' }
        ],
        luckyElements: { direction: 'Center', color: 'Neutral grey', number: 5 },
        watchPalace: 'Your Health Palace deserves attention. In a month without major events, the body often speaks up about what has been neglected.',
        closingAdvice: 'Not every month is a chapter — some are just paragraphs that connect one story to the next. Write them carefully, even if no one is watching.'
      });
    }
  }
  
  // ------ pastLifeInsight fallback (3个前世故事模板，随机返回) ------
  if (isPastLife) {
    var pastLifeStories = [
      {
        pastLifeTitle: 'The Court Calligrapher Who Wrote What Could Not Be Said',
        era: 'Tang Dynasty, Chang\'an, circa 742 AD',
        identity: 'Imperial court calligrapher',
        story: 'You served under Emperor Xuanzong during the golden age of the Tang Dynasty. Your hands were known across Chang\'an for the precision of your brushstrokes — you could capture a feeling in a single character that others could not express in a hundred words. But you used this gift to hide. You wrote poetry for courtiers who could not write their own feelings, pouring their loves and griefs into elegant script while your own heart remained unread. One winter night, during the Lantern Festival of 742, you wrote a letter to someone you never sent it to — a confession disguised as a poem, tucked inside a hollow bronze mirror that still waits to be found. The words were true, but you never let them leave your hands.',
        whyStillRelevant: 'This is why you carry things inside that you desperately want to say but cannot. You learned in that lifetime that expressing yourself means becoming visible, and becoming visible means becoming vulnerable. The habit of hiding your truth behind beautiful surfaces is ancient — you have been doing it for over a thousand years.',
        lesson: 'The calligrapher\'s lesson: words held too long turn to stone in the chest. You came into this life to learn that speaking your truth is worth the risk of being seen.',
        presentConnection: 'You have a tendency to express yourself most clearly when you are not speaking directly about yourself — through art, through work, through helping others articulate their feelings. The one letter you never sent still echoes.'
      },
      {
        pastLifeTitle: 'The Ming Garrison Guard Who Watched the Wall Too Long',
        era: 'Ming Dynasty, Northern Frontier, circa 1550',
        identity: 'Frontier garrison soldier',
        story: 'You were stationed at a remote fortress along the northern frontier during the late Ming Dynasty, watching for Mongol raids that came less often than the stories claimed. Your post was a stone watchtower on a ridge where the wind never stopped. You spent years scanning a horizon that rarely changed, learning to read the landscape like a language — the way dust rose before a rider, the way crows scattered before trouble. You were loyal, disciplined, utterly reliable. But loyalty to a distant emperor meant nothing when the supply lines failed and winter came early. You survived the cold but not the loneliness. A jade talisman your mother pressed into your hand before you left home stayed with you through every watch, its surface worn smooth by your thumb. You returned to find your village changed and yourself a stranger in it.',
        whyStillRelevant: 'This is why you feel most alive when you have a purpose and most lost when you do not. Your soul remembers what it means to stand guard — and what it costs. You need a mission, even a small one, to feel oriented. Without one, restlessness consumes you.',
        lesson: 'You spent a lifetime watching for threats that mostly never came. This time, learn to watch for beauty and possibility too. The vigilance served its purpose. It does not need to define you anymore.',
        presentConnection: 'You have a heightened awareness of your surroundings — you notice things others miss, subtle shifts in mood or atmosphere. This is the watchtower instinct. But you also struggle to relax fully, to let your guard down. The wall is still standing. It is time to open the gate.'
      },
      {
        pastLifeTitle: 'The Song Dynasty Poet Who Sold Tea and Collected Secrets',
        era: 'Song Dynasty, Hangzhou, circa 1120',
        identity: 'Tea house owner and poet',
        story: 'You ran a small tea house in Hangzhou during the Northern Song Dynasty, near the shores of West Lake. Your establishment was unremarkable — bamboo screens, clay cups, the smell of roasted leaves — but it was a crossroads. Merchants, scholars, officials, and wanderers passed through your doors, and you listened to all of them. You wrote poems in secret, recording the stories you overheard, the confessions whispered over steam, the political murmurs that could get a man exiled. Your finest poem was never published: it described a single autumn afternoon when a stranger told you about the woman he loved but could not have, and you realized you were writing about yourself. You kept that poem folded inside an inkstone case, hidden beneath the counter, next to a jar of long-cold tea leaves. You died before you showed it to anyone.',
        whyStillRelevant: 'This is why you are drawn to stories — other people\'s and your own. You collect fragments of conversations, remember details people do not expect you to, and sense the subtext beneath what is being said. You are a keeper of secrets, even the ones you did not ask for. And you still struggle to tell your own story as fully as you tell others\'.',
        lesson: 'The tea house taught you to listen, which is a rare gift. But you came into this life to learn that your own voice deserves the same attention you give to others. Your story counts too.',
        presentConnection: 'You instinctively become the listener in any group, the person people confide in. This is not random — it is a craft you have been honing across lifetimes. But ask yourself: who listens to you? And what would happen if you wrote your own poem instead of transcribing everyone else\'s?'
      }
    ];
    
    var storyIdx = dayOfYear % pastLifeStories.length;
    return JSON.stringify(pastLifeStories[storyIdx]);
  }
  
  // ------ soulmateDeepDive fallback ------
  if (isSoulmateDeep) {
    return JSON.stringify({
      loveArchetype: 'The Architect — you build love the way some people build houses: carefully, deliberately, with an eye for structure and a fear of what might collapse. You do not fall into relationships — you construct them. Every detail is considered: is this person safe? Do they fit the blueprint? But here is the tension your Partnership Palace reveals — you are drawn to people who unsettle that blueprint. You pick partners who challenge the very structure you are trying to build. The family root: maybe you grew up in a home where love felt conditional, earned through achievement or compliance. So you learned to control the conditions, thinking that if you built the perfect relationship, it could not hurt you. But love that is too controlled stops being love. It becomes a contract.',
      coreDesire: 'You say you want someone stable, reliable, aligned with your vision. And you do. But what you actually crave — what keeps you up at night and draws you to the wrong people — is someone who sees through your structure and loves what is underneath. You want to be chosen for the parts of yourself you keep hidden, not the polished version you present.',
      loveStrengths: [
        'You are loyal to a fault — once you commit, you do not leave easily, even when you should',
        'You bring intentionality to relationships: you think about the other person, plan for their needs, show up consistently',
        'You are self-aware enough to recognize your patterns, which means you are capable of change'
      ],
      loveChallenges: [
        'You evaluate love like a feasibility study instead of letting it unfold. The irony: you are terrified of being evaluated the same way',
        'You attract partners who need fixing because it gives you a sense of purpose in the relationship, but you secretly resent being needed more than wanted',
        'You push people away right when they get close — not because you stop caring, but because intimacy triggers the old belief that it will be taken away'
      ],
      partnerProfile: 'You need someone who matches your depth but not your guardedness. Someone who is emotionally intelligent enough to see through your walls but patient enough not to demand they come down all at once. They are probably more spontaneous than you, which irritates and intrigues you in equal measure. They make you laugh in moments when you are taking yourself too seriously. They are not impressed by your resume — they are interested in your inner world. And crucially: they do not need you to fix them. They are whole on their own, which is both attractive and slightly unsettling to someone who learned to love through caretaking.',
      timingInsight: 'Your current 大运 cycle suggests a significant romantic phase is either approaching or already quietly unfolding. Watch for a shift around the time your Astrological Year (流年) enters a Palace that connects to your Partnership Palace. The stars suggest that the next meaningful relationship will begin differently than your past ones — less dramatic, less consuming, and that is precisely why it will last. Timing favors late spring or early autumn for a meeting that feels accidental but is not.',
      deeperConnection: 'The contradiction in your love life is that you crave depth but control distance. To move from surface to soul level, you have to risk being disliked. That means saying what you actually feel before you have processed it into a safer version. It means letting someone see you mid-emotion, not after you have composed yourself. The Architect in you thinks love is about building something perfect. But love is actually about letting something imperfect be enough. Start with small risks: share something embarrassing, admit you are scared, let them see you cry. The walls you built kept you safe, but they also kept you lonely. You can put down the blueprint now.',
      closingWisdom: 'The love you are looking for is not looking for a finished person. It is looking for someone brave enough to be unfinished — and still show up.'
    });
  }

  // ------ 默认响应 ------
  return JSON.stringify({
    message: 'The stars have aligned for this moment, but the screen is quiet today. Trust that the energy is working beneath the surface — even when you cannot see it.',
    suggestion: 'Take a breath. Look at the sky tonight if you can. The cosmos does not stop speaking just because the app paused.'
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
    .replace('{date}', dateStr)
    .replace('{pain1}', userData.pain1 || '...')
    .replace('{pain2}', userData.pain2 || '...')
    .replace('{pain3}', userData.pain3 || '...');
  
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
    .replace('{keyTransformation}', userData.lu || 'Balanced')
    .replace('{pain1}', userData.pain1 || '...')
    .replace('{pain2}', userData.pain2 || '...')
    .replace('{pain3}', userData.pain3 || '...');
  
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
    .replace('{shenGong}', userData.shenGong || 'Life Palace')
    .replace('{pain1}', userData.pain1 || '...')
    .replace('{pain2}', userData.pain2 || '...')
    .replace('{pain3}', userData.pain3 || '...');

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
    .replace('{year}', year || '2026')
    .replace('{pain1}', userData.pain1 || '...')
    .replace('{pain2}', userData.pain2 || '...')
    .replace('{pain3}', userData.pain3 || '...');

  try {
    const content = await callDeepSeekAPI(prompt);
    const result = parseJSONResponse(content);
    
    if (AI_CONFIG.cacheEnabled && result) {
      AI_CONFIG.cache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating monthly guide:', error);

/**
 * 生成周运
 */
async function generateWeeklyOutlook(userData) {
  var today = new Date();
  var dayOfWeek = today.getDay(); // 0=Sun
  var monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 1));
  var sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  var dateStr = monday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ' - ' +
                sunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  var seasonNames = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Autumn', 'Autumn', 'Autumn', 'Winter'];
  var solarTerms = ['Xiaohan (Small Cold)', 'Dahan (Great Cold)', 'Lichun (Spring Begins)', 'Jingzhe (Insects Awaken)', 'Qingming (Clear Brightness)', 'Lixia (Summer Begins)', 'Mangzhong (Grain in Ear)', 'Xiaoshu (Small Heat)', 'Liqiu (Autumn Begins)', 'Bailu (White Dew)', 'Hanlu (Cold Dew)', 'Lidong (Winter Begins)', 'Daxue (Great Snow)'];
  var month = today.getMonth();
  var season = seasonNames[month] || 'Unknown';
  var solarTerm = solarTerms[month] || 'None';

  var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  var moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
                    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  var moonPhase = moonPhases[dayOfYear % 8];

  var prompt = PROMPT_TEMPLATES.weeklyOutlook
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
    .replace('{startDate}', dateStr.split(' - ')[0] || 'Monday')
    .replace('{endDate}', dateStr.split(' - ')[1] || 'Sunday')
    .replace('{season}', season)
    .replace('{solarTerm}', solarTerm)
    .replace('{moonPhase}', moonPhase);

  try {
    var result = await callDeepSeekAPI(prompt);
    return result;
  } catch (error) {
    console.error('Error generating weekly outlook:', error);
    return generateFallbackResponse(prompt);
  }
}
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
    .replace('{ji}', userData.ji || 'None')
    .replace('{pain1}', userData.pain1 || '...')
    .replace('{pain2}', userData.pain2 || '...')
    .replace('{pain3}', userData.pain3 || '...');

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
    .replace('{mingGong}', userData.mingGong || 'Life Palace')
    .replace('{pain1}', userData.pain1 || '...')
    .replace('{pain2}', userData.pain2 || '...')
    .replace('{pain3}', userData.pain3 || '...');

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

/**
 * Enhance soulmate portrait with a deeper story-based reading
 * Generates meeting story, life together, and soul purpose narrative
 */
async function enhanceSoulmatePortrait(userData) {
  const cacheKey = 'soulmate_enhance_' + userData.name + '_' + new Date().toDateString();

  if (AI_CONFIG.cacheEnabled) {
    const cached = AI_CONFIG.cache.get(cacheKey);
    if (cached) return cached;
  }

  const prompt = `You are the Oracle of the Purple Star (紫微星君), an ancient Eastern astrologer who reads the threads of fate between destined souls. A seeker who has already received their Soulmate Portrait now asks for the deeper story — the hidden narrative that the stars have woven.

## Seeker's Chart
- Name: ${userData.name || 'Seeker'}
- Partnership Palace: ${userData.partnershipPalace || 'Partnership Palace'} with ${userData.partnershipStars || 'Tian Tong'}
- Main Star: ${userData.mainStar || 'Purple Star'}
- Five Element Bureau: ${userData.bureau || 'Water Bureau'}
- Key Transformation: ${userData.keyTransformation || 'Balanced'}
- Existing Archetype: ${userData.existingArchetype || 'Unknown'}
- Existing Element: ${userData.existingElement || 'Unknown'}
- Existing Traits: ${userData.existingTraits ? userData.existingTraits.join(', ') : 'Unknown'}

## Seeker's Life Questions
- What keeps them awake at night: ${userData.pain1 || '...'}
- Their deepest uncertainty: ${userData.pain2 || '...'}
- What they're searching for: ${userData.pain3 || '...'}

CRITICAL RULE: Weave these personal concerns into the soulmate story. The meeting story, life together, or soul purpose should directly reference at least one of what the seeker deeply cares about.

## Response Format (JSON)
{
  "meetingStory": "A vivid, scene-based narrative of how they will meet their soulmate. 3-4 sentences. Describe the atmosphere, the moment, the feeling — like a scene from a wuxia novel or a dream. Include a sensory detail (a scent, a sound, a quality of light). End with the line the seeker will say to them.",
  "lifeTogether": "What their shared life will feel like. 3-4 sentences. Not specific events — the emotional texture of being together. What conflicts will teach them, what quiet moments will feel like, how they will grow together.",
  "soulPurpose": "The cosmic reason this soulmate exists in their life. 2-3 sentences. What karmic lesson or soul evolution this relationship serves. Frame it as destiny's intention.",
  "classicalText": "A classical Chinese passage about destined meetings or soul bonds (姻缘), from traditional texts",
  "classicalTranslation": "English translation of the classical text"
}

Requirements:
- The meetingStory must feel cinematic but never overly specific (no exact dates, no specific locations)
- The lifeTogether should acknowledge that love includes challenge — not just sweetness
- The soulPurpose should connect to their Partnership Palace stars
- Classical text from 诗经, 牡丹亭, 西厢记, or other classical works about love and fate
- Write in lyrical, plain English — as if the stars themselves are whispering`;

  try {
    const content = await callDeepSeekAPI(prompt);
    const result = parseJSONResponse(content);

    if (AI_CONFIG.cacheEnabled && result) {
      AI_CONFIG.cache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Error enhancing soulmate portrait:', error);
    // Fallback: generate a poetic default response
    return {
      meetingStory: 'The stars align on a quiet evening when the air carries the first chill of autumn. You are not looking — you have stopped looking — and that is precisely when the universe moves. They step into your orbit not with fanfare but with presence. A voice that cuts through the noise, a laugh that sounds like recognition. And in that moment, the world goes still. You will turn to them and say: "I think I have been waiting for you."',
      lifeTogether: 'Your lives will weave together like two rivers meeting — at first there is turbulence, the clashing of currents, the adjustment of two separate worlds becoming one. But eventually, the water settles into something deeper. You will argue about small things and understand each other in the silences. The gift of this bond is not that it is easy — it is that it is worth it. You will grow not despite each other, but because of each other.',
      soulPurpose: 'This soulmate comes to you not to complete you — you were already whole — but to mirror the parts of yourself you have not yet learned to love. They are here to teach you that vulnerability is not weakness, that being seen is not the same as being judged. The karmic contract between you is simple: to remind each other what is real.',
      classicalText: '有缘千里来相会，无缘对面不相逢。'
    };
 
  // ------ weeklyOutlook fallback (周运) ------
  if (isWeekly) {
    var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var energies = ['Wood rising - plant what matters', 'Fire building - take bold action', 'Earth steady - ground your plans', 'Metal sharpening - cut what no longer serves', 'Water flowing - adapt and reflect', 'Wind carrying - release and receive', 'Stillness settling - prepare for what comes'];
    var focuses = ['Career and long-term goals', 'Communication and connection', 'Financial decisions', 'Relationships and partnership', 'Self-care and inner work', 'Community and social ties', 'Rest and spiritual reflection'];
    var advices = ['Make one decision you have been postponing', 'Speak honestly even if it feels uncomfortable', 'Review your budget and adjust one habit', 'Reach out to someone you have been thinking about', 'Do something that brings you joy without guilt', 'Let your guard down with someone who has earned it', 'Do nothing ambitious. Rest is productive.'];
    
    var days = [];
    for (var d = 0; d < 7; d++) {
      days.push({
        day: weekDays[d],
        energy: energies[d],
        focus: focuses[d],
        advice: advices[d]
      });
    }
    
    return JSON.stringify({
      overview: 'This week carries the energy of transition and subtle alignment. Each day brings a different flavor of elemental influence. Pay attention to how your energy shifts as the week unfolds.',
      weeklyEnergy: 'A balanced week with each element finding its moment. Let the rhythm of the days guide you rather than forcing a single agenda.',
      days: days,
      keyTheme: 'Flow with the week, do not fight it. Each day has its purpose.',
      classicalText: '顺其自然，万物各得其和而生。',
      classicalTranslation: 'Follow the natural course — all things find harmony when they move in their own time.'
    });
  }
  
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
    generateWeeklyOutlook,
    generatePastLifeInsight,
    generateSoulmateDeepDive,
    enhanceSoulmatePortrait,
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
