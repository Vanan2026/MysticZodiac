/**
 * Nayin (纳音) Five Elements Sound Table
 * Maps the 60-year cycle combinations to their Nayin elements
 * @module ziwei/nayin
 */

import { HeavenlyStem, EarthlyBranch, FiveElementBureau } from './types';

/** Nayin element mappings for each pillar combination */
export const NAYIN_TABLE: Record<string, { bureau: FiveElementBureau }> = {
  // Jia Zi Cycle (甲子) starts from here
  '甲子': { bureau: '金四局' },
  '乙丑': { bureau: '金四局' },
  '丙寅': { bureau: '火六局' },
  '丁卯': { bureau: '火六局' },
  '戊辰': { bureau: '木三局' },
  '己巳': { bureau: '木三局' },
  '庚午': { bureau: '火六局' },
  '辛未': { bureau: '火六局' },
  '壬申': { bureau: '金四局' },
  '癸酉': { bureau: '金四局' },
  '甲戌': { bureau: '火六局' },
  '乙亥': { bureau: '火六局' },
  '丙子': { bureau: '火六局' },
  '丁丑': { bureau: '火六局' },
  '戊寅': { bureau: '木三局' },
  '己卯': { bureau: '木三局' },
  '庚辰': { bureau: '金四局' },
  '辛巳': { bureau: '金四局' },
  '壬午': { bureau: '木三局' },
  '癸未': { bureau: '木三局' },
  '甲申': { bureau: '水二局' },
  '乙酉': { bureau: '水二局' },
  '丙戌': { bureau: '水二局' },
  '丁亥': { bureau: '水二局' },
  '戊子': { bureau: '土五局' },
  '己丑': { bureau: '土五局' },
  '庚寅': { bureau: '火六局' },
  '辛卯': { bureau: '火六局' },
  '壬辰': { bureau: '水二局' },
  '癸巳': { bureau: '水二局' },
  '甲午': { bureau: '金四局' },
  '乙未': { bureau: '金四局' },
  '丙申': { bureau: '水二局' },
  '丁酉': { bureau: '水二局' },
  '戊戌': { bureau: '土五局' },
  '己亥': { bureau: '土五局' },
  '庚子': { bureau: '土五局' },
  '辛丑': { bureau: '土五局' },
  '壬寅': { bureau: '金四局' },
  '癸卯': { bureau: '金四局' },
  '甲辰': { bureau: '水二局' },
  '乙巳': { bureau: '水二局' },
  '丙午': { bureau: '水二局' },
  '丁未': { bureau: '水二局' },
  '戊申': { bureau: '土五局' },
  '己酉': { bureau: '土五局' },
  '庚戌': { bureau: '金四局' },
  '辛亥': { bureau: '金四局' },
  '壬子': { bureau: '木三局' },
  '癸丑': { bureau: '木三局' },
  '甲寅': { bureau: '水二局' },
  '乙卯': { bureau: '水二局' },
  '丙辰': { bureau: '水二局' },
  '丁巳': { bureau: '水二局' },
  '戊午': { bureau: '火六局' },
  '己未': { bureau: '火六局' },
  '庚申': { bureau: '木三局' },
  '辛酉': { bureau: '木三局' },
  '壬戌': { bureau: '土五局' },
  '癸亥': { bureau: '水二局' },
};

/** Heavenly Stems index mapping */
export const STEM_INDEX: Record<string, number> = {
  '甲': 0,
  '乙': 1,
  '丙': 2,
  '丁': 3,
  '戊': 4,
  '己': 5,
  '庚': 6,
  '辛': 7,
  '壬': 8,
  '癸': 9,
};

/** Earthly Branches index mapping */
export const BRANCH_INDEX: Record<string, number> = {
  '子': 0,
  '丑': 1,
  '寅': 2,
  '卯': 3,
  '辰': 4,
  '巳': 5,
  '午': 6,
  '未': 7,
  '申': 8,
  '酉': 9,
  '戌': 10,
  '亥': 11,
};

/**
 * Get Nayin element and bureau for a given stem and branch combination
 */
export function getNayin(stem: HeavenlyStem, branch: EarthlyBranch): { bureau: FiveElementBureau } {
  const key = `${stem}${branch}`;
  return NAYIN_TABLE[key] || { bureau: '土五局' };
}

/**
 * Get the index in the 60-year cycle (0-59)
 */
export function getNayinIndex(stem: HeavenlyStem, branch: EarthlyBranch): number {
  const stemIdx = STEM_INDEX[stem];
  const branchIdx = BRANCH_INDEX[branch];
  return (stemIdx + 60 - branchIdx) % 10 * 6 + branchIdx;
}

/**
 * Get Nayin name
 */
export function getNayinName(stem: HeavenlyStem, branch: EarthlyBranch): string {
  const { bureau } = getNayin(stem, branch);
  return bureau;
}

/**
 * Calculate Five Element Bureau based on Ming Gong (Life Palace) stem
 * The bureau is determined by the first character of the year pillar's Nayin
 */
export function getFiveElementBureau(stem: HeavenlyStem): FiveElementBureau {
  switch (stem) {
    case HeavenlyStem.JIA:
    case HeavenlyStem.YI:
      return '木三局';  // Wood Bureau
    case HeavenlyStem.BING:
    case HeavenlyStem.DING:
      return '火六局';  // Fire Bureau
    case HeavenlyStem.WU:
    case HeavenlyStem.JI:
      return '土五局';  // Earth Bureau
    case HeavenlyStem.GENG:
    case HeavenlyStem.XIN:
      return '金四局';  // Metal Bureau
    case HeavenlyStem.REN:
    case HeavenlyStem.GUI:
      return '水二局';  // Water Bureau
    default:
      return '土五局';
  }
}
