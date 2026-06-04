/**
 * Assistant Stars Placement Algorithm (辅星安星)
 * Calculates the positions of supporting stars based on year/month/day/hour pillars
 * @module ziwei/assist-stars
 */
import { AssistantStar, PalaceData, HeavenlyStem, EarthlyBranch } from './types';
/**
 * Convert hour (0-23) to time branch index (0-11)
 * Zi (子) = 0, Chou (丑) = 1, Yin (寅) = 2, ...
 */
export declare function hourToBranchIndex(hour: number): number;
/**
 * Get stem index (0-9)
 */
export declare function stemToIndex(stem: HeavenlyStem): number;
/**
 * Get branch index (0-11)
 */
export declare function branchToIndex(branch: EarthlyBranch): number;
/**
 * Place Zuo Fu (左辅) and You Bi (右弼) based on month and hour
 *
 * Left Assistant (左辅) and Right Assistant (右弼) are placed based on birth month and hour
 * They are always opposite each other (6 palaces apart)
 */
export declare function placeZuoFuYouBi(month: number, hourBranchIndex: number): {
    zuofu: number;
    youbi: number;
};
/**
 * Place Wen Chang (文昌) and Wen Qu (文曲) based on hour and day
 *
 * Wen Chang (文昌) - Civil Prosperity
 * Wen Qu (文曲) - Civil Curved
 */
export declare function placeWenChangWenQu(hourBranchIndex: number, dayStem: HeavenlyStem): {
    wenChang: number;
    wenQu: number;
};
/**
 * Place Tian Kui (天魁) and Tian Yue (天钺) based on year stem
 *
 * Tian Kui (天魁) - Heavenly Honor
 * Tian Yue (天钺) - Heavenly Blade
 */
export declare function placeTianKuiTianYue(yearStem: HeavenlyStem): {
    tianKui: number;
    tianYue: number;
};
/**
 * Place Huo Xing (火星) and Ling Xing (铃星) based on year branch and hour
 *
 * Fire Star (火星) and Bell Star (铃星)
 */
export declare function placeHuoXingLingXing(yearBranchIndex: number, hourBranchIndex: number): {
    huoXing: number;
    lingXing: number;
};
/**
 * Place Di Kong (地空) and Di Jie (地劫) based on hour
 *
 * Earthly Void (地空) and Earthly Robbery (地劫)
 */
export declare function placeDiKongDiJie(hourBranchIndex: number): {
    diKong: number;
    diJie: number;
};
/**
 * Place Tuo Luo (陀罗) and Qing Yang (擎羊) based on month and hour
 *
 * Horn (陀罗) and Javelin (擎羊)
 */
export declare function placeTuoLuoQingYang(month: number, hourBranchIndex: number): {
    tuoLuo: number;
    qingYang: number;
};
/**
 * Place all assistant stars
 */
export declare function placeAllAssistantStars(yearStem: HeavenlyStem, yearBranch: EarthlyBranch, month: number, dayStem: HeavenlyStem, hour: number): Map<number, AssistantStar[]>;
/**
 * Apply assistant stars to palace data
 */
export declare function applyAssistantStarsToPalaces(palaces: PalaceData[], assistantStarsMap: Map<number, AssistantStar[]>): PalaceData[];
/**
 * Get assistant star placement summary
 */
export declare function getAssistantStarSummary(yearStem: HeavenlyStem, yearBranch: EarthlyBranch, month: number, dayStem: HeavenlyStem, hour: number): Record<string, {
    palace: string;
    palaceIndex: number;
}>;
//# sourceMappingURL=assist-stars.d.ts.map