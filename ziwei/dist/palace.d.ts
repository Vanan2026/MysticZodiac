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
export declare const PALACE_ORDER: Palace[];
/**
 * Calculate the Life Palace (命宫) index
 * The Life Palace is determined by the hour of birth and the month of birth
 *
 * Formula: Life Palace Index = (month - hour + 12) % 12
 * Where month is the lunar month (1-12) and hour is the time branch index (0-11)
 */
export declare function calculateMingGongIndex(lunarMonth: number, birthHour: number): number;
/**
 * Calculate the Body Palace (身宫) index
 * The Body Palace is determined by the hour of birth
 *
 * Formula: Body Palace Index = (month + hour + 10) % 12
 */
export declare function calculateShenGongIndex(lunarMonth: number, birthHour: number): number;
/**
 * Calculate stem and branch for each palace
 * The stems follow the day stem cycle, starting from the Life Palace position
 */
export declare function calculatePalaceStemsAndBranches(mingGongIndex: number, dayStem: HeavenlyStem, dayBranch: EarthlyBranch): Array<{
    stem: HeavenlyStem;
    branch: EarthlyBranch;
}>;
/**
 * Create initial palace data structure
 */
export declare function createInitialPalaces(mingGongIndex: number, dayStem: HeavenlyStem, dayBranch: EarthlyBranch): PalaceData[];
/**
 * Get palace name by index
 */
export declare function getPalaceByIndex(index: number): Palace;
/**
 * Get palace index by name
 */
export declare function getPalaceIndex(palace: Palace): number;
/**
 * Calculate the distance between two palaces (counter-clockwise)
 */
export declare function getPalaceDistance(from: number, to: number): number;
/**
 * Get the palace at a specific offset from a starting palace
 */
export declare function getPalaceAtOffset(startPalace: number, offset: number): number;
//# sourceMappingURL=palace.d.ts.map