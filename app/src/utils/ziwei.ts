/**
 * Ziwei Dou Shu - React Native Version
 * Complete birth chart calculation for RN/Expo
 */

// Constants
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const BRANCH_ANIMALS = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐗'];

export const BRANCH_NAMES_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Boar'];

export const PALACE_NAMES_CN = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];

export const PALACE_NAMES_EN = ['Destiny', 'Siblings', 'Partnership', 'Children', 'Wealth', 'Vitality', 'Journey', 'Alliance', 'Ambition', 'Sanctuary', 'Harmony', 'Heritage'];

export const MAIN_STARS_CN = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];

export const STAR_SYMBOLS: Record<string, string> = {
  '紫微': '👑', '天机': '🧭', '太阳': '☀️', '武曲': '⚔️', '天同': '🎵', '廉贞': '⚖️',
  '天府': '🏛️', '太阴': '🌙', '贪狼': '🐺', '巨门': '🚪', '天相': '📜', '天梁': '🛡️',
  '七杀': '🗡️', '破军': '💥', '左辅': '🤝', '右弼': '🤝', '文昌': '📚', '文曲': '🎓',
  '天魁': '✨', '天钺': '🌟', '禄存': '💰', '火星': '🔥', '铃星': '🔔',
  '地空': '💫', '地劫': '⚡', '陀罗': '🔱', '擎羊': '🐐'
};

export const STAR_NAMES_EN: Record<string, string> = {
  '紫微': 'Purple Star', '天机': 'Celestial Mechanic', '太阳': 'Solar Radiance',
  '武曲': 'Martial Virtue', '天同': 'Celestial Harmony', '廉贞': 'Righteous Spirit',
  '天府': 'Celestial Treasury', '太阴': 'Lunar Grace', '贪狼': 'Greedy Wolf',
  '巨门': 'Great Gate', '天相': 'Celestial Minister', '天梁': 'Celestial Beam',
  '七杀': 'Seven Kills', '破军': 'Po Jun', '左辅': 'Left Assistant', '右弼': 'Right Assistant',
  '文昌': 'Civil Scholar', '文曲': 'Civil Curved', '天魁': 'Heavenly Honor',
  '天钺': 'Heavenly Blade', '禄存': 'Wealth Storage'
};

export const SI_HUA_TABLE: Record<string, { huaLu: string; huaQuan: string; huaKe: string; huaJi: string }> = {
  '甲': { huaLu: '禄存', huaQuan: '紫微', huaKe: '文昌', huaJi: '廉贞' },
  '乙': { huaLu: '天机', huaQuan: '紫微', huaKe: '天机', huaJi: '太阴' },
  '丙': { huaLu: '天同', huaQuan: '天权', huaKe: '天科', huaJi: '天忌' },
  '丁': { huaLu: '天机', huaQuan: '太阴', huaKe: '天同', huaJi: '天梁' },
  '戊': { huaLu: '天机', huaQuan: '天梁', huaKe: '天同', huaJi: '天同' },
  '己': { huaLu: '武曲', huaQuan: '天同', huaKe: '天机', huaJi: '贪狼' },
  '庚': { huaLu: '天同', huaQuan: '武曲', huaKe: '天梁', huaJi: '天相' },
  '辛': { huaLu: '天同', huaQuan: '天梁', huaKe: '天同', huaJi: '太阳' },
  '壬': { huaLu: '天同', huaQuan: '天梁', huaKe: '天同', huaJi: '太阳' },
  '癸': { huaLu: '天同', huaQuan: '天梁', huaKe: '天同', huaJi: '太阳' }
};

export interface ChartInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
}

export interface Pillar {
  stem: string;
  branch: string;
}

export interface PalaceData {
  index: number;
  palaceIndex: number;
  palaceName: string;
  palaceNameEn: string;
  stem: string;
  branch: string;
  branchName: string;
  branchAnimal: string;
  mainStars: string[];
  assistantStars: string[];
  siHua: {
    lu: string | null;
    quan: string | null;
    ke: string | null;
    ji: string | null;
  };
}

export interface BirthChart {
  birthDate: { year: number; month: number; day: number };
  birthHour: number;
  gender: 'male' | 'female';
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  yearPillar: Pillar & { nayin: string };
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  fiveElementBureau: string;
  mingGongIndex: number;
  shenGongIndex: number;
  mingGongMainStar: string;
  palaces: PalaceData[];
  siHua: {
    stem: string;
    huaLu: string;
    huaQuan: string;
    huaKe: string;
    huaJi: string;
    huaLuPalace: number;
    huaQuanPalace: number;
    huaKePalace: number;
    huaJiPalace: number;
  };
}

// Helper functions
function getStemIndex(stem: string): number {
  return HEAVENLY_STEMS.indexOf(stem);
}

function getBranchIndex(branch: string): number {
  return EARTHLY_BRANCHES.indexOf(branch);
}

function getYearStem(year: number): string {
  const baseYear = 1984; // 甲子年
  const offset = year - baseYear;
  const stemIndex = ((offset % 10) + 10) % 10;
  return HEAVENLY_STEMS[stemIndex];
}

function getYearBranch(year: number): string {
  const baseYear = 1984; // 甲子年
  const offset = year - baseYear;
  const branchIndex = ((offset % 12) + 12) % 12;
  return EARTHLY_BRANCHES[branchIndex];
}

function getMonthStem(yearStem: string, month: number): string {
  const monthStems = ['甲', '己', '乙', '庚', '丙', '辛', '丁', '壬', '戊', '癸'];
  const startStem = monthStems.indexOf(yearStem);
  const stemIndex = (startStem + month - 1) % 10;
  return HEAVENLY_STEMS[stemIndex];
}

function getDayPillar(year: number, month: number, day: number): Pillar {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const days = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const stemIndex = ((days % 10) + 10) % 10;
  const branchIndex = ((days % 12) + 12) % 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex]
  };
}

function getHourPillar(dayStem: string, hour: number): Pillar {
  const hourBranches = EARTHLY_BRANCHES;
  const branchIndex = Math.floor(hour / 2) % 12;
  
  const hourStems = ['甲', '己', '乙', '庚', '丙', '辛', '丁', '壬', '戊', '癸'];
  const startStem = hourStems.indexOf(dayStem);
  const stemIndex = (startStem * 2 + branchIndex) % 10;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: hourBranches[branchIndex]
  };
}

function getNayin(stem: string, branch: string): string {
  const nayinMap: Record<string, string> = {
    '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
    '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
    '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
    '甲申': '井泉水', '乙酉': '井泉水', '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂石金', '乙未': '砂石金',
    '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
    '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
    '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '砂中土', '丁巳': '砂中土', '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
  };
  return nayinMap[stem + branch] || '未知';
}

function getFiveElementBureau(yearStem: string): string {
  const bureauMap: Record<string, string> = {
    '甲': '木三局', '乙': '木三局',
    '丙': '火六局', '丁': '火六局',
    '戊': '土五局', '己': '土五局',
    '庚': '金四局', '辛': '金四局',
    '壬': '水二局', '癸': '水二局'
  };
  return bureauMap[yearStem] || '水二局';
}

function calculateMingGongIndex(lunarMonth: number, hour: number): number {
  const hourIndex = Math.floor(hour / 2) % 12;
  const base = (lunarMonth - 1) % 12;
  return (base + hourIndex) % 12;
}

function calculateShenGongIndex(lunarMonth: number, hour: number): number {
  const hourIndex = Math.floor(hour / 2) % 12;
  const base = lunarMonth % 12;
  return (base + hourIndex) % 12;
}

function placeMainStars(mingGongIndex: number, fiveElementBureau: string, lunarDay: number): Record<string, number> {
  const stars: Record<string, number> = {};
  
  // Core star positions
  const ziweiPos = (mingGongIndex + 2) % 12;
  stars['紫微'] = ziweiPos;
  
  stars['天机'] = (ziweiPos + 6) % 12;
  
  const sunMoonOffset = Math.floor(lunarDay / 15);
  stars['太阳'] = (mingGongIndex + 4 + sunMoonOffset) % 12;
  stars['太阴'] = (mingGongIndex + 10 - sunMoonOffset) % 12;
  
  stars['武曲'] = (mingGongIndex + 8) % 12;
  stars['天同'] = (mingGongIndex + 5) % 12;
  stars['廉贞'] = (mingGongIndex + 3) % 12;
  stars['天府'] = (ziweiPos + 6) % 12;
  stars['贪狼'] = (mingGongIndex + 1) % 12;
  stars['巨门'] = (mingGongIndex + 11) % 12;
  stars['天相'] = (mingGongIndex + 9) % 12;
  stars['天梁'] = (mingGongIndex + 7) % 12;
  stars['七杀'] = (mingGongIndex + 4) % 12;
  stars['破军'] = (mingGongIndex + 11) % 12;
  
  return stars;
}

function placeAssistantStars(yearStem: string, yearBranch: string, lunarMonth: number, dayStem: string, hour: number): Record<string, number> {
  const stars: Record<string, number> = {};
  
  stars['左辅'] = (getBranchIndex(yearBranch) + 1) % 12;
  stars['右弼'] = (getBranchIndex(yearBranch) + 11) % 12;
  
  stars['文昌'] = (getStemIndex(dayStem) + 4) % 12;
  stars['文曲'] = (getStemIndex(dayStem) + 5) % 12;
  
  stars['天魁'] = getStemIndex(yearStem) % 12;
  stars['天钺'] = (getStemIndex(yearStem) + 1) % 12;
  
  stars['禄存'] = getBranchIndex(yearBranch);
  
  stars['火星'] = (lunarMonth + 5) % 12;
  stars['铃星'] = (lunarMonth + 6) % 12;
  
  stars['地空'] = (getBranchIndex(yearBranch) + 1) % 12;
  stars['地劫'] = (getBranchIndex(yearBranch) + 5) % 12;
  
  stars['陀罗'] = (lunarMonth * 2) % 12;
  stars['擎羊'] = (lunarMonth * 2 + 2) % 12;
  
  return stars;
}

/**
 * Main function to calculate birth chart
 */
export function calculateBirthChart(input: ChartInput): BirthChart {
  const { year, month, day, hour, gender } = input;
  
  const yearStem = getYearStem(year);
  const yearBranch = getYearBranch(year);
  const monthStem = getMonthStem(yearStem, month);
  const monthBranch = EARTHLY_BRANCHES[(month - 1) % 12];
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar.stem, hour);
  
  const fiveElementBureau = getFiveElementBureau(yearStem);
  const mingGongIndex = calculateMingGongIndex(month, hour);
  const shenGongIndex = calculateShenGongIndex(month, hour);
  
  const mainStarsMap = placeMainStars(mingGongIndex, fiveElementBureau, day);
  const assistantStarsMap = placeAssistantStars(yearStem, yearBranch, month, dayPillar.stem, hour);
  
  const siHua = SI_HUA_TABLE[yearStem] || SI_HUA_TABLE['甲'];
  
  const palaces: PalaceData[] = [];
  for (let i = 0; i < 12; i++) {
    const palaceIndex = (mingGongIndex + i) % 12;
    const branchIndex = palaceIndex;
    
    const palace: PalaceData = {
      index: i,
      palaceIndex,
      palaceName: PALACE_NAMES_CN[palaceIndex],
      palaceNameEn: PALACE_NAMES_EN[palaceIndex],
      stem: dayPillar.stem,
      branch: EARTHLY_BRANCHES[branchIndex],
      branchName: BRANCH_NAMES_EN[branchIndex],
      branchAnimal: BRANCH_ANIMALS[branchIndex],
      mainStars: [],
      assistantStars: [],
      siHua: { lu: null, quan: null, ke: null, ji: null }
    };
    
    // Add main stars
    for (const [star, pos] of Object.entries(mainStarsMap)) {
      if (pos === palaceIndex) {
        palace.mainStars.push(star);
        if (siHua.huaLu === star) palace.siHua.lu = star;
        if (siHua.huaQuan === star) palace.siHua.quan = star;
        if (siHua.huaKe === star) palace.siHua.ke = star;
        if (siHua.huaJi === star) palace.siHua.ji = star;
      }
    }
    
    // Add assistant stars
    for (const [star, pos] of Object.entries(assistantStarsMap)) {
      if (pos === palaceIndex) {
        palace.assistantStars.push(star);
        if (siHua.huaLu === star) palace.siHua.lu = star;
        if (siHua.huaQuan === star) palace.siHua.quan = star;
        if (siHua.huaKe === star) palace.siHua.ke = star;
        if (siHua.huaJi === star) palace.siHua.ji = star;
      }
    }
    
    palaces.push(palace);
  }
  
  const mingGongMainStar = palaces[0].mainStars[0] || '紫微';
  
  let huaLuPalace = -1, huaQuanPalace = -1, huaKePalace = -1, huaJiPalace = -1;
  palaces.forEach((p, idx) => {
    if (p.siHua.lu) huaLuPalace = idx;
    if (p.siHua.quan) huaQuanPalace = idx;
    if (p.siHua.ke) huaKePalace = idx;
    if (p.siHua.ji) huaJiPalace = idx;
  });
  
  return {
    birthDate: { year, month, day },
    birthHour: hour,
    gender,
    lunarYear: year,
    lunarMonth: month,
    lunarDay: day,
    yearPillar: {
      stem: yearStem,
      branch: yearBranch,
      nayin: getNayin(yearStem, yearBranch)
    },
    monthPillar: { stem: monthStem, branch: monthBranch },
    dayPillar,
    hourPillar,
    fiveElementBureau,
    mingGongIndex,
    shenGongIndex,
    mingGongMainStar,
    palaces,
    siHua: {
      stem: yearStem,
      huaLu: siHua.huaLu,
      huaQuan: siHua.huaQuan,
      huaKe: siHua.huaKe,
      huaJi: siHua.huaJi,
      huaLuPalace,
      huaQuanPalace,
      huaKePalace,
      huaJiPalace
    }
  };
}

export interface DailyFortune {
  date: { year: number; month: number; day: number };
  dayStem: string;
  dayBranch: string;
  dayBranchName: string;
  overallScore: number;
  loveScore: number;
  careerScore: number;
  healthScore: number;
  luckyElements: string[];
  luckyDirection: string;
  favorable: string[];
  avoid: string[];
}

export function calculateDailyFortune(chart: BirthChart, date: { year: number; month: number; day: number }): DailyFortune {
  const dayPillar = getDayPillar(date.year, date.month, date.day);
  const branchIndex = getBranchIndex(dayPillar.branch);
  
  const overallScore = 60 + Math.floor(Math.random() * 30);
  const loveScore = 55 + Math.floor(Math.random() * 35);
  const careerScore = 50 + Math.floor(Math.random() * 40);
  const healthScore = 65 + Math.floor(Math.random() * 25);
  
  const luckyElementsMap: Record<string, string[]> = {
    '水二局': ['Water 💧', 'Black ⚫'],
    '木三局': ['Wood 🌿', 'Green 🟢'],
    '金四局': ['Metal ⚪', 'White '],
    '土五局': ['Earth 🟤', 'Yellow 🟡'],
    '火六局': ['Fire 🔴', 'Orange 🟠']
  };
  
  const directions = ['East', 'Southeast', 'South', 'Northeast'];
  const luckyDirection = directions[Math.floor(Math.random() * directions.length)];
  
  return {
    date,
    dayStem: dayPillar.stem,
    dayBranch: dayPillar.branch,
    dayBranchName: BRANCH_NAMES_EN[branchIndex],
    overallScore,
    loveScore,
    careerScore,
    healthScore,
    luckyElements: luckyElementsMap[chart.fiveElementBureau] || luckyElementsMap['水二局'],
    luckyDirection,
    favorable: ['Negotiation', 'New beginnings', 'Social connections'],
    avoid: ['Rushing decisions', 'Confrontation']
  };
}

export interface Hexagram {
  name: string;
  lines: string;
  meaning: string;
  interpretation: string;
}

export function generateHexagram(question: string): Hexagram {
  const hexagrams: Hexagram[] = [
    { name: 'Qian (Creation)', lines: '111111', meaning: 'Pure Yang, Creative Force', interpretation: 'The ultimate power, leadership, and new beginnings. This hexagram represents the creative principle - the father, heaven, and the driving force of all existence.' },
    { name: 'Kun (Reception)', lines: '000000', meaning: 'Pure Yin, Receptive Force', interpretation: 'Complete receptivity and devotion. Represents the mother, earth, and the principle of yielding accommodation.' },
    { name: 'Li (Clinging)', lines: '101101', meaning: 'Fire, Clarity', interpretation: 'Light, intelligence, and beauty. Represents the fire that clings to things, illuminating truth and driving away darkness.' },
    { name: 'Kan (Abyss)', lines: '010010', meaning: 'Water, Precipitation', interpretation: 'Danger, innovation, and the abyss. Represents water flowing into the abyss - danger that must be navigated with wisdom and courage.' },
    { name: 'Gua (Youth)', lines: '001001', meaning: 'Following, Innocence', interpretation: 'Youthful follies, following, and innocence. Represents the stage of learning and following guidance with youthful energy.' },
    { name: 'Da You (Great Harvest)', lines: '101001', meaning: 'Great Possession', interpretation: 'Great riches and possession. Represents the reward for correct action and the possession of great treasures.' }
  ];
  
  const index = question.length % hexagrams.length;
  return hexagrams[index];
}

export default {
  calculateBirthChart,
  calculateDailyFortune,
  generateHexagram,
  STAR_SYMBOLS,
  STAR_NAMES_EN,
  PALACE_NAMES_EN,
  BRANCH_ANIMALS,
  BRANCH_NAMES_EN
};
