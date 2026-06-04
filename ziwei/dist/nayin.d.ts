/**
 * Nayin (纳音) Five Elements Sound Table
 * Maps the 60-year cycle combinations to their Nayin elements
 * @module ziwei/nayin
 */
import { HeavenlyStem, EarthlyBranch, FiveElementBureau } from './types';
/** Nayin element mappings for each pillar combination */
export declare const NAYIN_TABLE: Record<string, {
    bureau: FiveElementBureau;
}>;
/** Heavenly Stems index mapping */
export declare const STEM_INDEX: Record<string, number>;
/** Earthly Branches index mapping */
export declare const BRANCH_INDEX: Record<string, number>;
/**
 * Get Nayin element and bureau for a given stem and branch combination
 */
export declare function getNayin(stem: HeavenlyStem, branch: EarthlyBranch): {
    bureau: FiveElementBureau;
};
/**
 * Get the index in the 60-year cycle (0-59)
 */
export declare function getNayinIndex(stem: HeavenlyStem, branch: EarthlyBranch): number;
/**
 * Get Nayin name
 */
export declare function getNayinName(stem: HeavenlyStem, branch: EarthlyBranch): string;
/**
 * Calculate Five Element Bureau based on Ming Gong (Life Palace) stem
 * The bureau is determined by the first character of the year pillar's Nayin
 */
export declare function getFiveElementBureau(stem: HeavenlyStem): FiveElementBureau;
//# sourceMappingURL=nayin.d.ts.map