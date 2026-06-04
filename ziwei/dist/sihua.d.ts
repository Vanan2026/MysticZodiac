/**
 * Four Transformations (四化飞星) Module
 * Calculates the Si Hua (化禄、化权、化科、化忌) based on year stem
 * @module ziwei/sihua
 */
import { HeavenlyStem, SiHuaResult, PalaceData, Palace } from './types';
/**
 * Si Hua mapping table (四化表)
 * Maps year stem to transformation stars
 *
 * Standard table:
 * 甲: 廉贞化禄, 破军化权, 武曲化科, 太阳化忌
 * 乙: 天机化禄, 天梁化权, 紫微化科, 太阴化忌
 * 丙: 天同化禄, 天机化权, 文昌化科, 廉贞化忌
 * 丁: 太阴化禄, 天同化权, 天机化科, 巨门化忌
 * 戊: 贪狼化禄, 太阴化权, 右弼化科, 天机化忌
 * 己: 武曲化禄, 贪狼化权, 天梁化科, 文曲化忌
 * 庚: 太阳化禄, 武曲化权, 太阴化科, 天同化忌
 * 辛: 巨门化禄, 太阳化权, 文曲化科, 文昌化忌
 * 壬: 天梁化禄, 紫微化权, 左辅化科, 武曲化忌
 * 癸: 破军化禄, 巨门化权, 太阴化科, 贪狼化忌
 */
export declare const SI_HUA_TABLE: Record<string, SiHuaResult>;
/**
 * Get Si Hua result based on year stem
 */
export declare function getSiHua(yearStem: HeavenlyStem): SiHuaResult;
/**
 * Find the palace index where a specific transformation star is located
 */
export declare function findSiHuaPalace(palaces: PalaceData[], starName: string): number;
/**
 * Apply Si Hua transformations to palaces
 * Marks which stars have transformations in each palace
 */
export declare function applySiHuaToPalaces(palaces: PalaceData[], siHua: SiHuaResult): PalaceData[];
/**
 * Get Si Hua summary with palace information
 */
export declare function getSiHuaSummary(siHua: SiHuaResult, palaces: PalaceData[]): {
    huaLu: {
        star: string;
        palace: Palace;
        palaceIndex: number;
    } | null;
    huaQuan: {
        star: string;
        palace: Palace;
        palaceIndex: number;
    } | null;
    huaKe: {
        star: string;
        palace: Palace;
        palaceIndex: number;
    } | null;
    huaJi: {
        star: string;
        palace: Palace;
        palaceIndex: number;
    } | null;
};
/**
 * Get transformation name in English for display
 */
export declare function getTransformationNameEN(transformation: string): string;
/**
 * Get star transformation info
 */
export declare function getStarTransformation(starName: string, siHua: SiHuaResult): string | null;
/**
 * Get Si Hua text description
 */
export declare function getSiHuaDescription(siHua: SiHuaResult): string;
//# sourceMappingURL=sihua.d.ts.map