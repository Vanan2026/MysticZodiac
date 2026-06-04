"use strict";
/**
 * Four Transformations (四化飞星) Module
 * Calculates the Si Hua (化禄、化权、化科、化忌) based on year stem
 * @module ziwei/sihua
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SI_HUA_TABLE = void 0;
exports.getSiHua = getSiHua;
exports.findSiHuaPalace = findSiHuaPalace;
exports.applySiHuaToPalaces = applySiHuaToPalaces;
exports.getSiHuaSummary = getSiHuaSummary;
exports.getTransformationNameEN = getTransformationNameEN;
exports.getStarTransformation = getStarTransformation;
exports.getSiHuaDescription = getSiHuaDescription;
const types_1 = require("./types");
const palace_1 = require("./palace");
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
exports.SI_HUA_TABLE = {
    '甲': {
        stem: types_1.HeavenlyStem.JIA,
        huaLu: '廉贞',
        huaQuan: '破军',
        huaKe: '武曲',
        huaJi: '太阳',
    },
    '乙': {
        stem: types_1.HeavenlyStem.YI,
        huaLu: '天机',
        huaQuan: '天梁',
        huaKe: '紫微',
        huaJi: '太阴',
    },
    '丙': {
        stem: types_1.HeavenlyStem.BING,
        huaLu: '天同',
        huaQuan: '天机',
        huaKe: '文昌',
        huaJi: '廉贞',
    },
    '丁': {
        stem: types_1.HeavenlyStem.DING,
        huaLu: '太阴',
        huaQuan: '天同',
        huaKe: '天机',
        huaJi: '巨门',
    },
    '戊': {
        stem: types_1.HeavenlyStem.WU,
        huaLu: '贪狼',
        huaQuan: '太阴',
        huaKe: '右弼',
        huaJi: '天机',
    },
    '己': {
        stem: types_1.HeavenlyStem.JI,
        huaLu: '武曲',
        huaQuan: '贪狼',
        huaKe: '天梁',
        huaJi: '文曲',
    },
    '庚': {
        stem: types_1.HeavenlyStem.GENG,
        huaLu: '太阳',
        huaQuan: '武曲',
        huaKe: '太阴',
        huaJi: '天同',
    },
    '辛': {
        stem: types_1.HeavenlyStem.XIN,
        huaLu: '巨门',
        huaQuan: '太阳',
        huaKe: '文曲',
        huaJi: '文昌',
    },
    '壬': {
        stem: types_1.HeavenlyStem.REN,
        huaLu: '天梁',
        huaQuan: '紫微',
        huaKe: '左辅',
        huaJi: '武曲',
    },
    '癸': {
        stem: types_1.HeavenlyStem.GUI,
        huaLu: '破军',
        huaQuan: '巨门',
        huaKe: '太阴',
        huaJi: '贪狼',
    },
};
/**
 * Get Si Hua result based on year stem
 */
function getSiHua(yearStem) {
    return exports.SI_HUA_TABLE[yearStem] || exports.SI_HUA_TABLE['甲'];
}
/**
 * Find the palace index where a specific transformation star is located
 */
function findSiHuaPalace(palaces, starName) {
    for (let i = 0; i < palaces.length; i++) {
        const palace = palaces[i];
        // Check main stars
        if (palace.mainStars.includes(starName)) {
            return i;
        }
        // Check assistant stars
        if (palace.assistantStars.some(s => s.name === starName)) {
            return i;
        }
    }
    return -1; // Not found
}
/**
 * Apply Si Hua transformations to palaces
 * Marks which stars have transformations in each palace
 */
function applySiHuaToPalaces(palaces, siHua) {
    const result = palaces.map(palace => ({ ...palace }));
    // Get star names for each transformation
    const huaLuStar = siHua.huaLu;
    const huaQuanStar = siHua.huaQuan;
    const huaKeStar = siHua.huaKe;
    const huaJiStar = siHua.huaJi;
    // Mark transformations in each palace
    result.forEach(palace => {
        const siHuaData = { ...palace.siHua };
        // Check if palace has the transformation stars
        if (palace.mainStars.includes(huaLuStar)) {
            siHuaData.lu = huaLuStar;
        }
        if (palace.mainStars.includes(huaQuanStar)) {
            siHuaData.quan = huaQuanStar;
        }
        if (palace.mainStars.includes(huaKeStar)) {
            siHuaData.ke = huaKeStar;
        }
        if (palace.mainStars.includes(huaJiStar)) {
            siHuaData.ji = huaJiStar;
        }
        // Also check assistant stars
        if (palace.assistantStars.some(s => s.name === huaLuStar)) {
            siHuaData.lu = huaLuStar;
        }
        if (palace.assistantStars.some(s => s.name === huaQuanStar)) {
            siHuaData.quan = huaQuanStar;
        }
        if (palace.assistantStars.some(s => s.name === huaKeStar)) {
            siHuaData.ke = huaKeStar;
        }
        if (palace.assistantStars.some(s => s.name === huaJiStar)) {
            siHuaData.ji = huaJiStar;
        }
        palace.siHua = siHuaData;
    });
    return result;
}
/**
 * Get Si Hua summary with palace information
 */
function getSiHuaSummary(siHua, palaces) {
    const findPalace = (starName) => {
        if (!starName)
            return null;
        const index = findSiHuaPalace(palaces, starName);
        if (index === -1)
            return null;
        return {
            star: starName,
            palace: palace_1.PALACE_ORDER[index],
            palaceIndex: index,
        };
    };
    return {
        huaLu: findPalace(siHua.huaLu),
        huaQuan: findPalace(siHua.huaQuan),
        huaKe: findPalace(siHua.huaKe),
        huaJi: findPalace(siHua.huaJi),
    };
}
/**
 * Get transformation name in English for display
 */
function getTransformationNameEN(transformation) {
    switch (transformation) {
        case '化禄':
            return 'Wei (Wealth)';
        case '化权':
            return 'Quan (Authority)';
        case '化科':
            return 'Ke (Knowledge)';
        case '化忌':
            return 'Ji (Obstacle)';
        default:
            return '';
    }
}
/**
 * Get star transformation info
 */
function getStarTransformation(starName, siHua) {
    if (siHua.huaLu === starName)
        return '化禄';
    if (siHua.huaQuan === starName)
        return '化权';
    if (siHua.huaKe === starName)
        return '化科';
    if (siHua.huaJi === starName)
        return '化忌';
    return null;
}
/**
 * Get Si Hua text description
 */
function getSiHuaDescription(siHua) {
    return `年干${siHua.stem}：
- 化禄：${siHua.huaLu}
- 化权：${siHua.huaQuan}
- 化科：${siHua.huaKe}
- 化忌：${siHua.huaJi}`;
}
