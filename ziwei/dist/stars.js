"use strict";
/**
 * Main Stars Placement Algorithm (主星安星)
 * Calculates the positions of the 14 main stars based on Five Element Bureau and birth day
 * @module ziwei/stars
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZiweiPosition = getZiweiPosition;
exports.placeZiweiConstellation = placeZiweiConstellation;
exports.placeTianfuConstellation = placeTianfuConstellation;
exports.placeAllMainStars = placeAllMainStars;
exports.getMingGongMainStar = getMingGongMainStar;
exports.applyMainStarsToPalaces = applyMainStarsToPalaces;
exports.getStarPlacementSummary = getStarPlacementSummary;
const palace_1 = require("./palace");
/**
 * The 6 stars of Ziwei Constellation (紫微星系) - placed counter-clockwise
 * Order: 紫微 → 天机 → 太阳 → 武曲 → 天同 → 廉贞
 */
const ZIWEI_CONSTELLATION = [
    '紫微', // 0: Purple Emperor
    '天机', // 1: Heavenly Mechanism
    '太阳', // 2: Sun
    '武曲', // 3: Military Curved
    '天同', // 4: Heavenly Concurrence
    '廉贞', // 5: Chastity
];
/**
 * The 8 stars of Tianfu Constellation (天府星系) - placed clockwise
 * Order: 天府 → 太阴 → 贪狼 → 巨门 → 天相 → 天梁 → 七杀 → 破军
 */
const TIANFU_CONSTELLATION = [
    '天府', // 0: Heavenly Fortune
    '太阴', // 1: Moon
    '贪狼', // 2: Greedy Wolf
    '巨门', // 3: Giant Gate
    '天相', // 4: Heavenly Minister
    '天梁', // 5: Heavenly Pillar
    '七杀', // 6: Seven Killings
    '破军', // 7: Broken Army
];
const ZIWEI_POSITION_TABLE = {
    '水二局': {
        ranges: [
            { min: 1, max: 10, offset: 0 }, // Day 1-10: Zi Wei Palace (same as Life Palace)
            { min: 11, max: 20, offset: 1 }, // Day 11-20: 1 palace ahead
            { min: 21, max: 30, offset: 2 }, // Day 21-30: 2 palaces ahead
        ]
    },
    '木三局': {
        ranges: [
            { min: 1, max: 10, offset: 2 }, // Day 1-10: 2 palaces ahead
            { min: 11, max: 20, offset: 3 }, // Day 11-20: 3 palaces ahead
            { min: 21, max: 30, offset: 4 }, // Day 21-30: 4 palaces ahead
        ]
    },
    '金四局': {
        ranges: [
            { min: 1, max: 10, offset: 4 }, // Day 1-10: 4 palaces ahead
            { min: 11, max: 20, offset: 5 }, // Day 11-20: 5 palaces ahead
            { min: 21, max: 30, offset: 6 }, // Day 21-30: 6 palaces ahead
        ]
    },
    '土五局': {
        ranges: [
            { min: 1, max: 10, offset: 6 }, // Day 1-10: 6 palaces ahead
            { min: 11, max: 20, offset: 7 }, // Day 11-20: 7 palaces ahead
            { min: 21, max: 30, offset: 8 }, // Day 21-30: 8 palaces ahead
        ]
    },
    '火六局': {
        ranges: [
            { min: 1, max: 10, offset: 8 }, // Day 1-10: 8 palaces ahead
            { min: 11, max: 20, offset: 9 }, // Day 11-20: 9 palaces ahead
            { min: 21, max: 30, offset: 10 }, // Day 21-30: 10 palaces ahead
        ]
    },
};
/**
 * Determine the position of Ziwei star based on Five Element Bureau and birth day
 * @param bureau - Five Element Bureau
 * @param birthDay - Lunar birth day (1-30)
 * @returns Palace index (0-11) where Ziwei star is located
 */
function getZiweiPosition(bureau, birthDay) {
    const bureauConfig = ZIWEI_POSITION_TABLE[bureau];
    if (!bureauConfig) {
        throw new Error(`Unknown Five Element Bureau: ${bureau}`);
    }
    for (const range of bureauConfig.ranges) {
        if (birthDay >= range.min && birthDay <= range.max) {
            return range.offset;
        }
    }
    // Default to offset 0 if no match
    return 0;
}
/**
 * Place Ziwei Constellation stars (counter-clockwise from Ziwei position)
 * Ziwei Constellation stars are placed every 2 palaces, counter-clockwise
 *
 * @param ziweiPosition - The palace index where Ziwei star is located (0-11)
 * @param mingGongIndex - Life Palace index (0-11)
 * @returns Map of palace index to main stars in that palace
 */
function placeZiweiConstellation(ziweiPosition, mingGongIndex) {
    const result = new Map();
    // Initialize all palaces with empty arrays
    for (let i = 0; i < 12; i++) {
        result.set(i, []);
    }
    // Place Ziwei Constellation stars counter-clockwise
    // Stars are placed every 2 palaces from the Ziwei position
    ZIWEI_CONSTELLATION.forEach((star, index) => {
        // Counter-clockwise movement: each star is 2 positions counter-clockwise from previous
        const palaceIndex = (ziweiPosition - index * 2 + 24) % 12;
        const currentStars = result.get(palaceIndex) || [];
        currentStars.push(star);
        result.set(palaceIndex, currentStars);
    });
    return result;
}
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
function placeTianfuConstellation(ziweiPosition, mingGongIndex) {
    const result = new Map();
    // Initialize all palaces with empty arrays
    for (let i = 0; i < 12; i++) {
        result.set(i, []);
    }
    // Tianfu is opposite to Ziwei (6 palaces away)
    const tianfuPosition = (ziweiPosition + 6) % 12;
    // Place Tianfu Constellation stars clockwise
    // Stars are placed every 2 palaces from the Tianfu position
    TIANFU_CONSTELLATION.forEach((star, index) => {
        // Clockwise movement: each star is 2 positions clockwise from previous
        const palaceIndex = (tianfuPosition + index * 2) % 12;
        const currentStars = result.get(palaceIndex) || [];
        currentStars.push(star);
        result.set(palaceIndex, currentStars);
    });
    return result;
}
/**
 * Place all main stars on the chart
 * @param mingGongIndex - Life Palace index (0-11)
 * @param bureau - Five Element Bureau
 * @param birthDay - Lunar birth day (1-30)
 * @returns Map of palace index to array of main stars
 */
function placeAllMainStars(mingGongIndex, bureau, birthDay) {
    // Get Ziwei position
    const ziweiPosition = getZiweiPosition(bureau, birthDay);
    // Place Ziwei Constellation
    const ziweiStars = placeZiweiConstellation(ziweiPosition, mingGongIndex);
    // Place Tianfu Constellation
    const tianfuStars = placeTianfuConstellation(ziweiPosition, mingGongIndex);
    // Merge both star maps
    const result = new Map();
    for (let i = 0; i < 12; i++) {
        const stars = [];
        const ziweiConstellation = ziweiStars.get(i) || [];
        const tianfuConstellation = tianfuStars.get(i) || [];
        stars.push(...ziweiConstellation, ...tianfuConstellation);
        result.set(i, stars);
    }
    return result;
}
/**
 * Get the main star at the Life Palace (命宫主星)
 * @param mainStarsMap - Map of palace index to main stars
 * @param mingGongIndex - Life Palace index
 * @returns The main star at Life Palace or null
 */
function getMingGongMainStar(mainStarsMap, mingGongIndex) {
    const stars = mainStarsMap.get(mingGongIndex) || [];
    // Return the first main star (usually Ziwei constellation star if present)
    return stars.length > 0 ? stars[0] : null;
}
/**
 * Apply main stars to palace data
 */
function applyMainStarsToPalaces(palaces, mainStarsMap) {
    return palaces.map((palace, index) => {
        const stars = mainStarsMap.get(index) || [];
        return {
            ...palace,
            mainStars: stars,
        };
    });
}
/**
 * Get a detailed description of the star placement
 */
function getStarPlacementSummary(bureau, birthDay, mingGongIndex) {
    const ziweiPosition = getZiweiPosition(bureau, birthDay);
    const tianfuPosition = (ziweiPosition + 6) % 12;
    const ziweiConstellation = ZIWEI_CONSTELLATION.map((star, index) => {
        const palaceIndex = (ziweiPosition - index * 2 + 24) % 12;
        return {
            star,
            palace: palace_1.PALACE_ORDER[palaceIndex],
            palaceIndex,
        };
    });
    const tianfuConstellation = TIANFU_CONSTELLATION.map((star, index) => {
        const palaceIndex = (tianfuPosition + index * 2) % 12;
        return {
            star,
            palace: palace_1.PALACE_ORDER[palaceIndex],
            palaceIndex,
        };
    });
    return {
        ziweiPosition,
        tianfuPosition,
        ziweiConstellation,
        tianfuConstellation,
    };
}
