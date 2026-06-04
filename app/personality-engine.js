/**
 * MysticZodiac - 生肖+五行性格测试引擎
 * Chinese Zodiac + Five Elements Personality Engine
 * 
 * 基于用户的生肖和五行局，生成个性化性格描述
 */

// ==================== 常量定义 ====================

// 12生肖性格特征（基础）
const ZODIAC_PERSONALITY = {
  rat: {
    name: 'Rat',
    nameCn: '鼠',
    traits: ['聪明', '机敏', '适应力强', '社交高手'],
    strengths: ['Quick-witted and intelligent', 'Highly adaptable to change', 'Excellent social skills', 'Resourceful and enterprising'],
    weaknesses: ['Can be manipulative', 'Tendency to be overly ambitious', 'May lack patience'],
    compatible: ['ox', 'dragon', 'monkey'],
    element: 'water',
    description: 'Rats are known for their intelligence and adaptability. They are social creatures who thrive in dynamic environments and possess exceptional survival instincts.'
  },
  ox: {
    name: 'Ox',
    nameCn: '牛',
    traits: ['踏实', '可靠', '有耐心', '意志坚强'],
    strengths: ['Reliable and dependable', 'Patient and methodical', 'Strong determination', 'Practical and grounded'],
    weaknesses: ['Can be stubborn', 'Tendency to keep emotions bottled up', 'May be overly critical'],
    compatible: ['rat', 'snake', 'rooster'],
    element: 'earth',
    description: 'Oxen are the pillars of stability in the zodiac. Their unwavering dedication and strong work ethic make them natural leaders who lead by example.'
  },
  tiger: {
    name: 'Tiger',
    nameCn: '虎',
    traits: ['勇敢', '自信', '有魅力', '冒险精神'],
    strengths: ['Brave and courageous', 'Confident and charismatic', 'Natural leader', 'Adventurous spirit'],
    weaknesses: ['Can be arrogant', 'Tendency toward recklessness', 'May struggle with vulnerability'],
    compatible: ['dragon', 'horse', 'pig'],
    element: 'wood',
    description: 'Tigers are the warriors of the zodiac, combining fierce courage with magnetic charm. They are born leaders who inspire others through their bold actions.'
  },
  rabbit: {
    name: 'Rabbit',
    nameCn: '兔',
    traits: ['温柔', '善良', '有艺术感', '谨慎'],
    strengths: ['Gentle and kind-hearted', 'Artistic and refined', 'Diplomatic and tactful', 'Good judgment'],
    weaknesses: ['Can be overly cautious', 'Tendency to avoid conflict', 'May be seen as indecisive'],
    compatible: ['sheep', 'monkey', 'dog'],
    element: 'wood',
    description: 'Rabbits embody grace and elegance. Their keen sense of aesthetics and diplomatic nature make them excellent mediators who bring harmony wherever they go.'
  },
  dragon: {
    name: 'Dragon',
    nameCn: '龙',
    traits: ['自信', '有魄力', '幸运', '理想主义'],
    strengths: ['Confident and ambitious', 'Natural authority', 'Lucky and fortunate', 'Inspiring vision'],
    weaknesses: ['Can be demanding', 'Tendency to be perfectionist', 'May struggle with criticism'],
    compatible: ['rat', 'monkey', 'rooster'],
    element: 'earth',
    description: 'Dragons are the royalty of the zodiac, destined for greatness. Their charismatic presence and visionary thinking attract followers who believe in their grand dreams.'
  },
  snake: {
    name: 'Snake',
    nameCn: '蛇',
    traits: ['智慧', '神秘', '直觉强', '有魅力'],
    strengths: ['Wise and insightful', 'Mysterious and intriguing', 'Strong intuition', 'Charming and persuasive'],
    weaknesses: ['Can be suspicious', 'Tendency to be secretive', 'May hold grudges'],
    compatible: ['ox', 'rooster', 'monkey'],
    element: 'fire',
    description: 'Snakes possess an enchanting wisdom that goes beyond ordinary understanding. Their hypnotic charm and sharp intuition guide them through lifes mysteries.'
  },
  horse: {
    name: 'Horse',
    nameCn: '马',
    traits: ['热情', '自由', '活泼', '有活力'],
    strengths: ['Energetic and enthusiastic', 'Independent and free-spirited', 'Warm and approachable', 'Quick learner'],
    weaknesses: ['Can be impatient', 'Tendency to be restless', 'May struggle with commitment'],
    compatible: ['tiger', 'sheep', 'rabbit'],
    element: 'fire',
    description: 'Horses are the free spirits of the zodiac, galloping through life with boundless energy. Their warm hearts and infectious enthusiasm light up any room they enter.'
  },
  goat: {
    name: 'Goat',
    nameCn: '羊',
    traits: ['温柔', '艺术感', '善解人意', '有耐心'],
    strengths: ['Gentle and compassionate', 'Artistic and creative', 'Empathetic and understanding', 'Patient and tolerant'],
    weaknesses: ['Can be indecisive', 'Tendency to be pessimistic', 'May worry too much'],
    compatible: ['rabbit', 'horse', 'pig'],
    element: 'earth',
    description: 'Goats are the artists of the zodiac, finding beauty in every moment. Their gentle nature and creative spirit bring comfort and inspiration to those around them.'
  },
  monkey: {
    name: 'Monkey',
    nameCn: '猴',
    traits: ['聪明', '好奇', '机智', '有趣'],
    strengths: ['Intelligent and clever', 'Curious and adaptable', 'Quick-witted and funny', 'Excellent problem-solver'],
    weaknesses: ['Can be mischievous', 'Tendency to be manipulative', 'May lack focus'],
    compatible: ['rat', 'dragon', 'snake'],
    element: 'metal',
    description: 'Monkeys are the jesters of the zodiac, bringing laughter and智慧 wherever they go. Their quick minds and playful spirit make them master problem-solvers.'
  },
  rooster: {
    name: 'Rooster',
    nameCn: '鸡',
    traits: ['勤奋', '自信', '观察力强', '诚实'],
    strengths: ['Hardworking and diligent', 'Confident and self-assured', 'Sharp observation skills', 'Honest and straightforward'],
    weaknesses: ['Can be critical', 'Tendency to be perfectionist', 'May be blunt'],
    compatible: ['ox', 'dragon', 'snake'],
    element: 'metal',
    description: 'Roosters are the guardians of truth in the zodiac. Their keen eyes miss nothing, and their honest nature ensures they always speak their mind.'
  },
  dog: {
    name: 'Dog',
    nameCn: '狗',
    traits: ['忠诚', '正直', '勇敢', '有责任感'],
    strengths: ['Loyal and devoted', 'Honest and principled', 'Brave and protective', 'Strong sense of justice'],
    weaknesses: ['Can be anxious', 'Tendency to worry', 'May be overly suspicious'],
    compatible: ['tiger', 'rabbit', 'horse'],
    element: 'earth',
    description: 'Dogs are the loyal guardians of the zodiac, standing firm in their principles. Their unwavering devotion and protective nature make them the most trusted friends.'
  },
  pig: {
    name: 'Pig',
    nameCn: '猪',
    traits: ['真诚', '慷慨', '有耐心', '乐观'],
    strengths: ['Sincere and genuine', 'Generous and kind', 'Patient and hardworking', 'Optimistic outlook'],
    weaknesses: ['Can be naive', 'Tendency to overspend', 'May be gullible'],
    compatible: ['tiger', 'rabbit', 'sheep'],
    element: 'water',
    description: 'Pigs are the warm hearts of the zodiac, bringing sincerity and joy to every relationship. Their generous spirit and positive outlook make life brighter for all.'
  }
};

// 五行性格特征
const FIVE_ELEMENT_PERSONALITY = {
  wood: {
    name: 'Wood',
    nameCn: '木',
    element: 'Wood',
    traits: ['仁慈', '正直', '有主见', '有领导力'],
    strengths: ['Compassionate and benevolent', 'Principled and ethical', 'Decisive leadership', 'Growth-oriented mindset'],
    weaknesses: ['Can be stubborn', 'Tendency to be rigid', 'May struggle with change'],
    nature: 'expansive and upward-growing, like a towering tree reaching for the sky',
    description: 'Wood types are natural leaders who grow and expand like trees. Their principled nature and desire for growth drive them to build lasting legacies.',
    colors: ['green', 'teal'],
    seasons: ['spring'],
    direction: 'east'
  },
  fire: {
    name: 'Fire',
    nameCn: '火',
    traits: ['热情', '活力', '有魅力', '有感染力'],
    strengths: ['Passionate and enthusiastic', 'Energetic and dynamic', 'Charismatic and inspiring', 'Natural warmth'],
    weaknesses: ['Can be volatile', 'Tendency to be impulsive', 'May burn too brightly'],
    nature: 'ardent and illuminating, like a flame that both warms and destroys',
    description: 'Fire types are the spark that ignites passion in others. Their charismatic energy and warm spirits light up every room and inspire great movements.',
    colors: ['red', 'orange', 'purple'],
    seasons: ['summer'],
    direction: 'south'
  },
  earth: {
    name: 'Earth',
    nameCn: '土',
    traits: ['稳重', '踏实', '有耐心', '有信用'],
    strengths: ['Stable and grounded', 'Practical and reliable', 'Patient and nurturing', 'Trustworthy and loyal'],
    weaknesses: ['Can be stubborn', 'Tendency to be materialistic', 'May resist change'],
    nature: 'stable and nourishing, like the earth that sustains all life',
    description: 'Earth types are the foundation upon which others build their lives. Their unwavering stability and nurturing spirit provide the security others desperately need.',
    colors: ['yellow', 'brown', 'beige'],
    seasons: ['late summer'],
    direction: 'center'
  },
  metal: {
    name: 'Metal',
    nameCn: '金',
    traits: ['果断', '正义', '有原则', '有纪律'],
    strengths: ['Decisive and clear-minded', 'Just and fair', 'Strong principles', 'Disciplined and organized'],
    weaknesses: ['Can be harsh', 'Tendency to be inflexible', 'May be too critical'],
    nature: 'clear and sharp, like metal that can both build and destroy',
    description: 'Metal types possess the clarity and strength of forged steel. Their sharp minds and unwavering principles make them natural judges and protectors of justice.',
    colors: ['white', 'gold', 'silver'],
    seasons: ['autumn'],
    direction: 'west'
  },
  water: {
    name: 'Water',
    nameCn: '水',
    traits: ['智慧', '灵活', '有洞察力', '有包容心'],
    strengths: ['Wise and intuitive', 'Adaptable and flexible', 'Deep insight', 'Inclusive and accepting'],
    weaknesses: ['Can be indecisive', 'Tendency to be passive', 'May lack direction'],
    nature: 'flowing and yielding, like water that shapes stone through patience',
    description: 'Water types possess the wisdom of oceans and rivers. Their adaptive nature and deep intuition allow them to navigate even the most challenging currents of life.',
    colors: ['blue', 'black'],
    seasons: ['winter'],
    direction: 'north'
  }
};

// 生肖×五行局交叉性格分析
const ZODIAC_ELEMENT_COMBINATIONS = {
  // 水二局
  'rat_wood': 'You possess the adaptability of Wood within your Rat nature, making you both intellectually sharp and spiritually flexible.',
  'ox_wood': 'Your Wood-influenced Ox energy creates a unique blend of steadfast reliability with progressive thinking.',
  'tiger_wood': 'Wood amplifies your natural leadership, making you a visionary who inspires growth in others.',
  'rabbit_wood': 'Your Rabbit-Wood combination gives you gentle strength and natural diplomatic abilities.',
  'dragon_wood': 'The Wood element enhances your Dragon ambition, creating a powerful force for growth and innovation.',
  'snake_wood': 'Your Snake-Wood nature combines ancient wisdom with flexible thinking.',
  'horse_wood': 'Wood fuels your Horse energy with sustainable passion and growth-oriented vision.',
  'sheep_wood': 'Your gentle Sheep nature is strengthened by Wood, giving you resilient compassion.',
  'monkey_wood': 'Wood enhances your intellectual agility, making you an excellent strategist.',
  'rooster_wood': 'Your sharp Rooster mind is grounded by Wood stability.',
  'dog_wood': 'Wood gives your loyal Dog nature a principled foundation.',
  'pig_wood': 'Your optimistic Pig energy is strengthened by Wood growth potential.',
  
  // 木三局
  'rat_fire': 'Fire brings passionate intensity to your Rat adaptability, creating dynamic intellectual power.',
  'ox_fire': 'Your patient Ox nature is warmed by Fire, giving you steady determination with热情.',
  'tiger_fire': 'Fire amplifies your Tiger courage into fearless leadership.',
  'rabbit_fire': 'Your gentle Rabbit gains Fire charm and creative expression.',
  'dragon_fire': 'Fire transforms your Dragon ambition into legendary achievement.',
  'snake_fire': 'Your mysterious Snake wisdom is illuminated by Fire insight.',
  'horse_fire': 'Fire makes your Horse spirit an unstoppable force of enthusiasm.',
  'sheep_fire': 'Your artistic Sheep nature gains Fire passion and creative spark.',
  'monkey_fire': 'Fire fuels your intellectual Monkey with brilliant innovation.',
  'rooster_fire': 'Your sharp Rooster judgment is enhanced by Fire clarity.',
  'dog_fire': 'Fire gives your loyal Dog nature passionate dedication.',
  'pig_fire': 'Your warm Pig heart glows with Fire enthusiasm and generosity.',
  
  // 金四局
  'rat_earth': 'Earth grounds your quick Rat mind with practical wisdom.',
  'ox_earth': 'Your steadfast Ox nature reaches peak reliability with Earth stability.',
  'tiger_earth': 'Earth gives your Tiger leadership a solid foundation of patience.',
  'rabbit_earth': 'Your diplomatic Rabbit nature is strengthened by Earth nurturing.',
  'dragon_earth': 'Earth transforms your Dragon ambition into lasting legacy building.',
  'snake_earth': 'Your wise Snake nature gains practical application through Earth.',
  'horse_earth': 'Your energetic Horse spirit finds grounding through Earth wisdom.',
  'sheep_earth': 'Earth amplifies your artistic Sheep nature with tangible creativity.',
  'monkey_earth': 'Your clever Monkey mind is stabilized by Earth practicality.',
  'rooster_earth': 'Your sharp Rooster judgment reaches peak clarity with Earth.',
  'dog_earth': 'Earth gives your loyal Dog nature unwavering devotion.',
  'pig_earth': 'Your generous Pig heart is nurtured by Earth abundance.',
  
  // 土五局
  'rat_metal': 'Metal sharpens your adaptable Rat mind into precise intelligence.',
  'ox_metal': 'Your patient Ox nature gains Metal clarity and focus.',
  'tiger_metal': 'Metal transforms your Tiger courage into decisive action.',
  'rabbit_metal': 'Your gentle Rabbit nature gains Metal elegance and refinement.',
  'dragon_metal': 'Metal gives your Dragon ambition razor-sharp clarity.',
  'snake_metal': 'Your mysterious Snake wisdom is enhanced by Metal insight.',
  'horse_metal': 'Metal gives your passionate Horse spirit clear direction.',
  'sheep_metal': 'Your artistic Sheep nature gains Metal sophistication.',
  'monkey_metal': 'Metal sharpens your clever Monkey mind into brilliant strategy.',
  'rooster_metal': 'Your Rooster nature reaches peak excellence with Metal.',
  'dog_metal': 'Metal gives your loyal Dog nature unshakeable principles.',
  'pig_metal': 'Your generous Pig spirit gains Metal authenticity.',
  
  // 火六局
  'rat_water': 'Water gives your intelligent Rat nature deep intuition and wisdom.',
  'ox_water': 'Your steadfast Ox nature is softened by Water adaptability.',
  'tiger_water': 'Water gives your brave Tiger spirit flexible wisdom.',
  'rabbit_water': 'Your diplomatic Rabbit nature gains Water intuition.',
  'dragon_water': 'Your ambitious Dragon nature gains Water adaptability.',
  'snake_water': 'Your wise Snake nature reaches mystical depth with Water.',
  'horse_water': 'Water gives your passionate Horse spirit flowing grace.',
  'sheep_water': 'Your artistic Sheep nature gains Water emotional depth.',
  'monkey_water': 'Water gives your clever Monkey mind adaptive intelligence.',
  'rooster_water': 'Your sharp Rooster judgment gains Water perspective.',
  'dog_water': 'Water gives your loyal Dog nature deep insight.',
  'pig_water': 'Your generous Pig nature reaches spiritual depth with Water.'
};

// ==================== 核心函数 ====================

/**
 * 获取生肖信息
 * @param {string} zodiacKey - 生肖键（如 'rat', 'dragon'）
 * @returns {Object} 生肖信息对象
 */
function getZodiacInfo(zodiacKey) {
  return ZODIAC_PERSONALITY[zodiacKey.toLowerCase()] || null;
}

/**
 * 获取五行信息
 * @param {string} elementKey - 五行键（如 'wood', 'fire'）
 * @returns {Object} 五行信息对象
 */
function getElementInfo(elementKey) {
  return FIVE_ELEMENT_PERSONALITY[elementKey.toLowerCase()] || null;
}

/**
 * 生成性格描述
 * @param {Object} userData - 用户数据
 * @param {string} userData.zodiac - 生肖（如 'rat', 'dragon'）
 * @param {string} userData.element - 五行局（如 'water', 'wood', 'fire', 'metal', 'earth'）
 * @param {string} userData.name - 用户名
 * @returns {Object} 性格分析结果
 */
function generatePersonalityReading(userData) {
  const { zodiac, element, name } = userData;
  
  const zodiacInfo = getZodiacInfo(zodiac);
  const elementInfo = getElementInfo(element);
  
  if (!zodiacInfo || !elementInfo) {
    return { error: 'Invalid zodiac or element' };
  }
  
  // 获取交叉性格描述
  const comboKey = `${zodiac.toLowerCase()}_${element.toLowerCase()}`;
  const combinationDescription = ZODIAC_ELEMENT_COMBINATIONS[comboKey] || 
    `Your ${zodiacInfo.name} nature combined with ${elementInfo.name} element creates a unique personality.`;
  
  // 生成性格优势
  const strengths = [...new Set([...zodiacInfo.strengths, ...elementInfo.strengths])];
  
  // 生成性格挑战
  const weaknesses = [...new Set([...zodiacInfo.weaknesses, ...elementInfo.weaknesses])];
  
  // 生成核心特质
  const coreTraits = [...new Set([...zodiacInfo.traits, ...elementInfo.traits])].slice(0, 5);
  
  // 生成完整性格描述
  const fullDescription = `
Dear ${name || 'Seeker'},

Your cosmic blueprint reveals a fascinating interplay between your ${zodiacInfo.name} (${zodiacInfo.nameCn}) nature and the ${elementInfo.name} (${elementInfo.nameCn}) element.

${combinationDescription}

As a ${zodiacInfo.name}-${elementInfo.name} type, you possess these core traits:
${coreTraits.map(t => `✦ ${t}`).join('\n')}

Your Strengths:
${strengths.map(s => `✦ ${s}`).join('\n')}

Your Growth Areas:
${weaknesses.map(w => `○ ${w}`).join('\n')}

Elemental Nature:
You embody the ${elementInfo.nature}. ${elementInfo.description}

Ancient Wisdom:
「${getClassicalText(zodiac, element)}」
  
The ${zodiacInfo.nameCn}年出生，${elementInfo.nameCn}命之人，${getClassicalAdvice(zodiac, element)}。
`.trim();
  
  return {
    name: name || 'Seeker',
    zodiac: zodiacInfo,
    element: elementInfo,
    combination: combinationDescription,
    coreTraits,
    strengths,
    weaknesses,
    fullDescription,
    classicalText: getClassicalText(zodiac, element),
    classicalAdvice: getClassicalAdvice(zodiac, element),
    luckyElements: {
      colors: elementInfo.colors,
      seasons: elementInfo.seasons,
      direction: elementInfo.direction
    },
    compatibility: {
      best: zodiacInfo.compatible.map(c => ZODIAC_PERSONALITY[c]?.name || c),
      advice: `Your ${zodiacInfo.name} nature harmonizes best with ${zodiacInfo.compatible.map(c => ZODIAC_PERSONALITY[c]?.name || c).join(', ')}. These connections bring out your best qualities.`
    }
  };
}

/**
 * 获取古典文本
 */
function getClassicalText(zodiac, element) {
  const texts = {
    rat_water: '鼠生水，水主智，智慧如深渊，取之不尽用之不竭。',
    ox_earth: '牛属土，土主信，诚信如大地，稳重踏实可托付。',
    tiger_wood: '虎属木，木主仁，仁慈如春风，威而不猛显德行。',
    rabbit_wood: '兔属木，木主仁，柔中带刚，温和中见智慧。',
    dragon_earth: '龙属土，土主信，帝王之象，泽被苍生。',
    snake_fire: '蛇属火，火主礼，礼中有智，神秘中显通达。',
    horse_fire: '马属火，火主礼，热情奔放，驰骋天下。',
    sheep_earth: '羊属土，土主信，温柔敦厚，福泽绵长。',
    monkey_metal: '猴属金，金主义，义薄云天，智勇双全。',
    rooster_metal: '鸡属金，金主义，知时守分，刚毅果断。',
    dog_earth: '狗属土，土主信，忠诚可靠，守正不阿。',
    pig_water: '猪属水，水主智，厚德载物，福寿双全。'
  };
  
  const key = `${zodiac.toLowerCase()}_${element.toLowerCase()}`;
  return texts[key] || '命由天定，运由人造，知命而行，方得圆满。';
}

/**
 * 获取古典建议
 */
function getClassicalAdvice(zodiac, element) {
  const advice = {
    rat_water: '宜发挥智慧之长，以柔克刚，忌急躁冒进。',
    ox_earth: '宜坚守正道，脚踏实地，忌好高骛远。',
    tiger_wood: '宜勇往直前，但需收敛锋芒，忌孤军奋战。',
    rabbit_wood: '宜以柔克刚，以德服人，忌优柔寡断。',
    dragon_earth: '宜厚积薄发，泽被苍生，忌骄傲自满。',
    snake_fire: '宜深藏不露，大智若愚，忌锋芒过露。',
    horse_fire: '宜奔腾向前，但需持之以恒，忌半途而废。',
    sheep_earth: '宜广结善缘，以柔克刚，忌消极悲观。',
    monkey_metal: '宜发挥才智，但需坚守底线，忌投机取巧。',
    rooster_metal: '宜坚守原则，刚正不阿，忌吹毛求疵。',
    dog_earth: '宜忠诚待人，正义行事，忌猜疑多虑。',
    pig_water: '宜保持真诚，乐善好施，忌贪小便宜。'
  };
  
  const key = `${zodiac.toLowerCase()}_${element.toLowerCase()}`;
  return advice[key] || '宜顺天应人，修身养性，方可趋吉避凶。';
}

/**
 * 生成完整性格测试报告
 */
function generateFullPersonalityReport(userData) {
  const reading = generatePersonalityReading(userData);
  
  if (reading.error) return reading;
  
  return {
    ...reading,
    reportDate: new Date().toISOString(),
    reportType: 'Zodiac-Element Personality Analysis',
    sections: [
      {
        title: 'Your Cosmic Identity',
        content: `As a ${reading.zodiac.name} (${reading.zodiac.nameCn}) born under the ${reading.element.name} (${reading.element.nameCn}) element, you possess a unique cosmic signature.`
      },
      {
        title: 'Core Personality',
        content: reading.combination
      },
      {
        title: 'Your Five Core Traits',
        content: reading.coreTraits.join(' • ')
      },
      {
        title: 'Strengths',
        content: reading.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')
      },
      {
        title: 'Growth Opportunities',
        content: reading.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')
      },
      {
        title: 'Lucky Elements',
        content: `Colors: ${reading.luckyElements.colors.join(', ')} | Best Season: ${reading.luckyElements.seasons.join(', ')} | Auspicious Direction: ${reading.luckyElements.direction}`
      },
      {
        title: 'Relationship Compatibility',
        content: reading.compatibility.advice
      },
      {
        title: 'Ancient Wisdom',
        content: `${reading.classicalText}\n\n${reading.classicalAdvice}`
      }
    ]
  };
}

// ==================== 导出 ====================

// 浏览器环境
if (typeof window !== 'undefined') {
  window.PersonalityEngine = {
    getZodiacInfo,
    getElementInfo,
    generatePersonalityReading,
    generateFullPersonalityReport,
    ZODIAC_PERSONALITY,
    FIVE_ELEMENT_PERSONALITY
  };
}

// Node.js环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getZodiacInfo,
    getElementInfo,
    generatePersonalityReading,
    generateFullPersonalityReport,
    ZODIAC_PERSONALITY,
    FIVE_ELEMENT_PERSONALITY
  };
}

console.log('✅ Personality Engine loaded - 生肖+五行性格测试引擎已加载');
