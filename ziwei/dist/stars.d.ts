/**
 * Main Stars Placement Algorithm (主星安星)
 * Calculates the positions of the 14 main stars based on Five Element Bureau and birth day
 * @module ziwei/stars
 */
import { MainStar, PalaceData, FiveElementBureau, Palace } from './types';
/**
 * Determine the position of Ziwei star based on Five Element Bureau and birth day
 * @param bureau - Five Element Bureau
 * @param birthDay - Lunar birth day (1-30)
 * @returns Palace index (0-11) where Ziwei star is located
 */
export declare function getZiweiPosition(bureau: FiveElementBureau, birthDay: number): number;
/**
 * Place Ziwei Constellation stars (counter-clockwise from Ziwei position)
 * Ziwei Constellation stars are placed every 2 palaces, counter-clockwise
 *
 * @param ziweiPosition - The palace index where Ziwei star is located (0-11)
 * @param mingGongIndex - Life Palace index (0-11)
 * @returns Map of palace index to main stars in that palace
 */
export declare function placeZiweiConstellation(ziweiPosition: number, mingGongIndex: number): Map<number, MainStar[]>;
/**
 * Place Tianfu Constellation stars (clockwise from Tianfu position)
 * Tianfu Constellation stars are placed every 2 palaces, clockwise
 *
 * Tianfu star is opposite to Ziwei (offset by 6 palaces)
 *
 * @param ziweiPosition - The palace index where Ziwei star is located (0-11)
 * @param mingGongIndex - Life Palace index (0-11)
 * @returns Map of palace index to main stars in that palace
 */
export declare function placeTianfuConstellation(ziweiPosition: number, mingGongIndex: number): Map<number, MainStar[]>;
/**
 * Place all main stars on the chart
 * @param mingGongIndex - Life Palace index (0-11)
 * @param bureau - Five Element Bureau
 * @param birthDay - Lunar birth day (1-30)
 * @returns Map of palace index to array of main stars
 */
export declare function placeAllMainStars(mingGongIndex: number, bureau: FiveElementBureau, birthDay: number): Map<number, MainStar[]>;
/**
 * Get the main star at the Life Palace (命宫主星)
 * @param mainStarsMap - Map of palace index to main stars
 * @param mingGongIndex - Life Palace index
 * @returns The main star at Life Palace or null
 */
export declare function getMingGongMainStar(mainStarsMap: Map<number, MainStar[]>, mingGongIndex: number): MainStar | null;
/**
 * Apply main stars to palace data
 */
export declare function applyMainStarsToPalaces(palaces: PalaceData[], mainStarsMap: Map<number, MainStar[]>): PalaceData[];
/**
 * Get a detailed description of the star placement
 */
export declare function getStarPlacementSummary(bureau: FiveElementBureau, birthDay: number, mingGongIndex: number): {
    ziweiPosition: number;
    tianfuPosition: number;
    ziweiConstellation: Array<{
        star: MainStar;
        palace: Palace;
        palaceIndex: number;
    }>;
    tianfuConstellation: Array<{
        star: MainStar;
        palace: Palace;
        palaceIndex: number;
    }>;
};
//# sourceMappingURL=stars.d.ts.map