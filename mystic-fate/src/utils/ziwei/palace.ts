/**
 * Palace Calculation Module (宫位计算)
 * Calculates the 12 palaces including Life Palace (命宫) and Body Palace (身宫)
 * @module ziwei/palace
 */

import { Palace, HeavenlyStem, EarthlyBranch, PalaceData } from './types';

/**
 * The 12 palaces in order, starting from Life Palace (命宫)
 * Palaces are arranged counter-clockwise in the chart
 */
export const PALACE_ORDER: Palace[] = [
  '命宫',     // 0: Life Palace (命宫)
  '兄弟宫',   // 1: Siblings Palace (兄弟宫)
  '夫妻宫',   // 2: Spouse Palace (夫妻宫)
  '子女宫',   // 3: Children Palace (子女宫)
  '财帛宫',   // 4: Wealth Palace (财帛宫)
  '疾厄宫',   // 5: Health Palace (疾厄宫)
  '交友宫',   // 6: Friends Palace (交友宫)
  '迁移宫',   // 7: Migration Palace (迁移宫)
  '官禄宫',   // 8: Career Palace (官禄宫)
  '田宅宫',   // 9: Property Palace (田宅宫)
  '福德宫',   // 10: Fortune Palace (福德宫)
  '父母宫',   // 11: Parents Palace (父母宫)
];

/** Heavenly Stems (天干) */
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/** Earthly Branches (地支) */
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * Calculate the Life Palace (命宫) index
 * The Life Palace is determined by the hour of birth and the month of birth
 * 
 * Formula: Life Palace Index = (month - hour + 12) % 12
 * Where month is the lunar month (1-12) and hour is the time branch index (0-11)
 */
export function calculateMingGongIndex(lunarMonth: number, birthHour: number): number {
  // Convert hour to time branch index (0-11)
  // Zi=0, Chou=1, Yin=2, Mao=3, Chen=4, Si=5, Wu=6, Wei=7, Shen=8, You=9, Xu=10, Hai=11
  let hourIndex: number;
  if (birthHour >= 23 || birthHour < 1) {
    hourIndex = 0; // Zi (子)
  } else if (birthHour >= 1 && birthHour < 3) {
    hourIndex = 1; // Chou (丑)
  } else {
    hourIndex = Math.floor((birthHour + 1) / 2);
  }
  
  // Life Palace calculation: (month - 1 + hour) % 12
  // Starting from Yin (寅) as month 1
  return ((lunarMonth - 1 + hourIndex) % 12);
}

/**
 * Calculate the Body Palace (身宫) index
 * The Body Palace is determined by the hour of birth
 * 
 * Formula: Body Palace Index = (month + hour + 10) % 12
 */
export function calculateShenGongIndex(lunarMonth: number, birthHour: number): number {
  // Convert hour to time branch index (0-11)
  let hourIndex: number;
  if (birthHour >= 23 || birthHour < 1) {
    hourIndex = 0; // Zi (子)
  } else if (birthHour >= 1 && birthHour < 3) {
    hourIndex = 1; // Chou (丑)
  } else {
    hourIndex = Math.floor((birthHour + 1) / 2);
  }
  
  // Body Palace calculation: (month + hour + 10) % 12
  return ((lunarMonth + hourIndex + 10) % 12);
}

/**
 * Calculate stem and branch for each palace
 * The stems follow the day stem cycle, starting from the Life Palace position
 */
export function calculatePalaceStemsAndBranches(
  mingGongIndex: number,
  dayStem: HeavenlyStem,
  dayBranch: EarthlyBranch
): Array<{ stem: HeavenlyStem; branch: EarthlyBranch }> {
  // Day stem and branch determine the starting position
  const dayStemIndex = STEMS.indexOf(dayStem);
  const dayBranchIndex = BRANCHES.indexOf(dayBranch);
  
  const result: Array<{ stem: HeavenlyStem; branch: EarthlyBranch }> = [];
  
  for (let i = 0; i < 12; i++) {
    // Branch follows earthly branches counter-clockwise
    const branchOffset = (i - mingGongIndex + 12) % 12;
    const branchIndex = (dayBranchIndex + branchOffset) % 12;
    
    // Stem calculation: follows the day stem pattern
    // Each palace stem is offset from the day stem based on its position
    const stemOffset = (i - mingGongIndex + 12) % 12;
    const stemIndex = (dayStemIndex + stemOffset) % 10;
    
    result.push({
      stem: STEMS[stemIndex] as HeavenlyStem,
      branch: BRANCHES[branchIndex] as EarthlyBranch,
    });
  }
  
  return result;
}

/**
 * Create initial palace data structure
 */
export function createInitialPalaces(
  mingGongIndex: number,
  dayStem: HeavenlyStem,
  dayBranch: EarthlyBranch
): PalaceData[] {
  const stemsBranches = calculatePalaceStemsAndBranches(mingGongIndex, dayStem, dayBranch);
  
  return PALACE_ORDER.map((palace, index) => ({
    palace,
    palaceIndex: index,
    stem: stemsBranches[index].stem,
    branch: stemsBranches[index].branch,
    mainStars: [],
    assistantStars: [],
    siHua: {},
  }));
}

/**
 * Get palace name by index
 */
export function getPalaceByIndex(index: number): Palace {
  return PALACE_ORDER[index % 12];
}

/**
 * Get palace index by name
 */
export function getPalaceIndex(palace: Palace): number {
  return PALACE_ORDER.indexOf(palace);
}

/**
 * Calculate the distance between two palaces (counter-clockwise)
 */
export function getPalaceDistance(from: number, to: number): number {
  return (to - from + 12) % 12;
}

/**
 * Get the palace at a specific offset from a starting palace
 */
export function getPalaceAtOffset(startPalace: number, offset: number): number {
  return (startPalace + offset) % 12;
}
