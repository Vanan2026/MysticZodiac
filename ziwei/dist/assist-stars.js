"use strict";
/**
 * Assistant Stars Placement Algorithm (辅星安星)
 * Calculates the positions of supporting stars based on year/month/day/hour pillars
 * @module ziwei/assist-stars
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hourToBranchIndex = hourToBranchIndex;
exports.stemToIndex = stemToIndex;
exports.branchToIndex = branchToIndex;
exports.placeZuoFuYouBi = placeZuoFuYouBi;
exports.placeWenChangWenQu = placeWenChangWenQu;
exports.placeTianKuiTianYue = placeTianKuiTianYue;
exports.placeHuoXingLingXing = placeHuoXingLingXing;
exports.placeDiKongDiJie = placeDiKongDiJie;
exports.placeTuoLuoQingYang = placeTuoLuoQingYang;
exports.placeAllAssistantStars = placeAllAssistantStars;
exports.applyAssistantStarsToPalaces = applyAssistantStarsToPalaces;
exports.getAssistantStarSummary = getAssistantStarSummary;
const palace_1 = require("./palace");
/**
 * Convert hour (0-23) to time branch index (0-11)
 * Zi (子) = 0, Chou (丑) = 1, Yin (寅) = 2, ...
 */
function hourToBranchIndex(hour) {
    if (hour >= 23 || hour < 1)
        return 0; // Zi
    if (hour >= 1 && hour < 3)
        return 1; // Chou
    if (hour >= 3 && hour < 5)
        return 2; // Yin
    if (hour >= 5 && hour < 7)
        return 3; // Mao
    if (hour >= 7 && hour < 9)
        return 4; // Chen
    if (hour >= 9 && hour < 11)
        return 5; // Si
    if (hour >= 11 && hour < 13)
        return 6; // Wu
    if (hour >= 13 && hour < 15)
        return 7; // Wei
    if (hour >= 15 && hour < 17)
        return 8; // Shen
    if (hour >= 17 && hour < 19)
        return 9; // You
    if (hour >= 19 && hour < 21)
        return 10; // Xu
    if (hour >= 21 && hour < 23)
        return 11; // Hai
    return 0;
}
/**
 * Get stem index (0-9)
 */
function stemToIndex(stem) {
    const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    return STEMS.indexOf(stem);
}
/**
 * Get branch index (0-11)
 */
function branchToIndex(branch) {
    const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return BRANCHES.indexOf(branch);
}
/**
 * Place Zuo Fu (左辅) and You Bi (右弼) based on month and hour
 *
 * Left Assistant (左辅) and Right Assistant (右弼) are placed based on birth month and hour
 * They are always opposite each other (6 palaces apart)
 */
function placeZuoFuYouBi(month, hourBranchIndex) {
    // Zuo Fu position: (month * 2 + hour) % 12
    const zuofuIndex = ((month * 2 + hourBranchIndex) % 12);
    // You Bi is opposite to Zuo Fu
    const youbiIndex = (zuofuIndex + 6) % 12;
    return { zuofu: zuofuIndex, youbi: youbiIndex };
}
/**
 * Place Wen Chang (文昌) and Wen Qu (文曲) based on hour and day
 *
 * Wen Chang (文昌) - Civil Prosperity
 * Wen Qu (文曲) - Civil Curved
 */
function placeWenChangWenQu(hourBranchIndex, dayStem) {
    // Wen Chang position: based on hour branch
    // Table: Zi=申, Chou=酉, Yin=戌, Mao=亥, Chen=子, Si=丑, Wu=寅, Wei=卯, Shen=辰, You=巳, Xu=午, Hai=未
    const WEN_CHANG_TABLE = {
        0: 8, // Zi -> Shen (申)
        1: 9, // Chou -> You (酉)
        2: 10, // Yin -> Xu (戌)
        3: 11, // Mao -> Hai (亥)
        4: 0, // Chen -> Zi (子)
        5: 1, // Si -> Chou (丑)
        6: 2, // Wu -> Yin (寅)
        7: 3, // Wei -> Mao (卯)
        8: 4, // Shen -> Chen (辰)
        9: 5, // You -> Si (巳)
        10: 6, // Xu -> Wu (午)
        11: 7, // Hai -> Wei (未)
    };
    // Wen Qu position: based on day stem
    // Table: Jia=巳, Yi=午, Bing=未, Ding=申, Wu=酉, Ji=戌, Geng=亥, Xin=子, Ren=丑, Gui=寅
    const WEN_QU_TABLE = {
        0: 5, // Jia (甲) -> Si (巳)
        1: 6, // Yi (乙) -> Wu (午)
        2: 7, // Bing (丙) -> Wei (未)
        3: 8, // Ding (丁) -> Shen (申)
        4: 9, // Wu (戊) -> You (酉)
        5: 10, // Ji (己) -> Xu (戌)
        6: 11, // Geng (庚) -> Hai (亥)
        7: 0, // Xin (辛) -> Zi (子)
        8: 1, // Ren (壬) -> Chou (丑)
        9: 2, // Gui (癸) -> Yin (寅)
    };
    const wenChangIndex = WEN_CHANG_TABLE[hourBranchIndex];
    const wenQuIndex = WEN_QU_TABLE[stemToIndex(dayStem)];
    return { wenChang: wenChangIndex, wenQu: wenQuIndex };
}
/**
 * Place Tian Kui (天魁) and Tian Yue (天钺) based on year stem
 *
 * Tian Kui (天魁) - Heavenly Honor
 * Tian Yue (天钺) - Heavenly Blade
 */
function placeTianKuiTianYue(yearStem) {
    // Tian Kui and Tian Yue are placed based on year stem
    // They are opposite each other (6 palaces apart)
    const STEM_TO_KUI_YUE = {
        0: { kui: 2, yue: 8 }, // Jia (甲): Kui at Yin, Yue at Shen
        1: { kui: 3, yue: 9 }, // Yi (乙): Kui at Mao, Yue at You
        2: { kui: 4, yue: 10 }, // Bing (丙): Kui at Chen, Yue at Xu
        3: { kui: 5, yue: 11 }, // Ding (丁): Kui at Si, Yue at Hai
        4: { kui: 6, yue: 0 }, // Wu (戊): Kui at Wu, Yue at Zi
        5: { kui: 7, yue: 1 }, // Ji (己): Kui at Wei, Yue at Chou
        6: { kui: 8, yue: 2 }, // Geng (庚): Kui at Shen, Yue at Yin
        7: { kui: 9, yue: 3 }, // Xin (辛): Kui at You, Yue at Mao
        8: { kui: 10, yue: 4 }, // Ren (壬): Kui at Xu, Yue at Chen
        9: { kui: 11, yue: 5 }, // Gui (癸): Kui at Hai, Yue at Si
    };
    const stemIndex = stemToIndex(yearStem);
    const positions = STEM_TO_KUI_YUE[stemIndex];
    return { tianKui: positions.kui, tianYue: positions.yue };
}
/**
 * Place Huo Xing (火星) and Ling Xing (铃星) based on year branch and hour
 *
 * Fire Star (火星) and Bell Star (铃星)
 */
function placeHuoXingLingXing(yearBranchIndex, hourBranchIndex) {
    // Fire Star and Bell Star are placed based on year branch and hour
    // They are adjacent to each other (1 palace apart)
    // Base position from year branch
    const BASE_HOU_XING = {
        0: 2, // Zi -> Yin
        1: 4, // Chou -> Chen
        2: 6, // Yin -> Wu
        3: 8, // Mao -> Shen
        4: 10, // Chen -> Xu
        5: 0, // Si -> Zi
        6: 2, // Wu -> Yin
        7: 4, // Wei -> Chen
        8: 6, // Shen -> Wu
        9: 8, // You -> Shen
        10: 10, // Xu -> Xu
        11: 0, // Hai -> Zi
    };
    // Fire Star base position
    const huoXingBase = BASE_HOU_XING[yearBranchIndex];
    // Bell Star is offset based on hour
    // If hour is Yin-Mao (2-3), Bell Star is 1 palace ahead
    const lingXingBase = (huoXingBase + 1) % 12;
    return { huoXing: huoXingBase, lingXing: lingXingBase };
}
/**
 * Place Di Kong (地空) and Di Jie (地劫) based on hour
 *
 * Earthly Void (地空) and Earthly Robbery (地劫)
 */
function placeDiKongDiJie(hourBranchIndex) {
    // Di Kong and Di Jie are opposite each other (6 palaces apart)
    // Based on hour branch
    // Di Kong position
    const DI_KONG_TABLE = {
        0: 4, // Zi -> Chen
        1: 10, // Chou -> Xu
        2: 4, // Yin -> Chen
        3: 10, // Mao -> Xu
        4: 4, // Chen -> Chen
        5: 10, // Si -> Xu
        6: 4, // Wu -> Chen
        7: 10, // Wei -> Xu
        8: 4, // Shen -> Chen
        9: 10, // You -> Xu
        10: 4, // Xu -> Chen
        11: 10, // Hai -> Xu
    };
    const diKongIndex = DI_KONG_TABLE[hourBranchIndex];
    const diJieIndex = (diKongIndex + 6) % 12;
    return { diKong: diKongIndex, diJie: diJieIndex };
}
/**
 * Place Tuo Luo (陀罗) and Qing Yang (擎羊) based on month and hour
 *
 * Horn (陀罗) and Javelin (擎羊)
 */
function placeTuoLuoQingYang(month, hourBranchIndex) {
    // Tuo Luo and Qing Yang are placed based on month and hour
    // They are opposite each other (6 palaces apart)
    // Base position from month
    const BASE_TUO_LUO = {
        1: 2, // Jan -> Yin
        2: 3, // Feb -> Mao
        3: 4, // Mar -> Chen
        4: 5, // Apr -> Si
        5: 6, // May -> Wu
        6: 7, // Jun -> Wei
        7: 8, // Jul -> Shen
        8: 9, // Aug -> You
        9: 10, // Sep -> Xu
        10: 11, // Oct -> Hai
        11: 0, // Nov -> Zi
        12: 1, // Dec -> Chou
    };
    // Tuo Luo is offset based on hour
    const baseTuoLuo = BASE_TUO_LUO[month];
    const tuoLuoOffset = (hourBranchIndex % 2 === 0) ? 0 : 1;
    const tuoLuoIndex = (baseTuoLuo + tuoLuoOffset) % 12;
    // Qing Yang is opposite to Tuo Luo
    const qingYangIndex = (tuoLuoIndex + 6) % 12;
    return { tuoLuo: tuoLuoIndex, qingYang: qingYangIndex };
}
/**
 * Place all assistant stars
 */
function placeAllAssistantStars(yearStem, yearBranch, month, dayStem, hour) {
    const result = new Map();
    // Initialize all palaces
    for (let i = 0; i < 12; i++) {
        result.set(i, []);
    }
    const hourBranchIndex = hourToBranchIndex(hour);
    const yearBranchIndex = branchToIndex(yearBranch);
    // Place Zuo Fu and You Bi
    const { zuofu, youbi } = placeZuoFuYouBi(month, hourBranchIndex);
    result.get(zuofu)?.push('左辅');
    result.get(youbi)?.push('右弼');
    // Place Wen Chang and Wen Qu
    const { wenChang, wenQu } = placeWenChangWenQu(hourBranchIndex, dayStem);
    result.get(wenChang)?.push('文昌');
    result.get(wenQu)?.push('文曲');
    // Place Tian Kui and Tian Yue
    const { tianKui, tianYue } = placeTianKuiTianYue(yearStem);
    result.get(tianKui)?.push('天魁');
    result.get(tianYue)?.push('天钺');
    // Place Huo Xing and Ling Xing
    const { huoXing, lingXing } = placeHuoXingLingXing(yearBranchIndex, hourBranchIndex);
    result.get(huoXing)?.push('火星');
    result.get(lingXing)?.push('铃星');
    // Place Di Kong and Di Jie
    const { diKong, diJie } = placeDiKongDiJie(hourBranchIndex);
    result.get(diKong)?.push('地空');
    result.get(diJie)?.push('地劫');
    // Place Tuo Luo and Qing Yang
    const { tuoLuo, qingYang } = placeTuoLuoQingYang(month, hourBranchIndex);
    result.get(tuoLuo)?.push('陀罗');
    result.get(qingYang)?.push('擎羊');
    return result;
}
/**
 * Apply assistant stars to palace data
 */
function applyAssistantStarsToPalaces(palaces, assistantStarsMap) {
    return palaces.map((palace, index) => {
        const stars = assistantStarsMap.get(index) || [];
        const assistantStars = stars.map(star => ({
            name: star,
            isMainStar: false,
        }));
        return {
            ...palace,
            assistantStars,
        };
    });
}
/**
 * Get assistant star placement summary
 */
function getAssistantStarSummary(yearStem, yearBranch, month, dayStem, hour) {
    const hourBranchIndex = hourToBranchIndex(hour);
    const yearBranchIndex = branchToIndex(yearBranch);
    const summary = {};
    // Zuo Fu and You Bi
    const { zuofu, youbi } = placeZuoFuYouBi(month, hourBranchIndex);
    summary['左辅'] = { palace: palace_1.PALACE_ORDER[zuofu], palaceIndex: zuofu };
    summary['右弼'] = { palace: palace_1.PALACE_ORDER[youbi], palaceIndex: youbi };
    // Wen Chang and Wen Qu
    const { wenChang, wenQu } = placeWenChangWenQu(hourBranchIndex, dayStem);
    summary['文昌'] = { palace: palace_1.PALACE_ORDER[wenChang], palaceIndex: wenChang };
    summary['文曲'] = { palace: palace_1.PALACE_ORDER[wenQu], palaceIndex: wenQu };
    // Tian Kui and Tian Yue
    const { tianKui, tianYue } = placeTianKuiTianYue(yearStem);
    summary['天魁'] = { palace: palace_1.PALACE_ORDER[tianKui], palaceIndex: tianKui };
    summary['天钺'] = { palace: palace_1.PALACE_ORDER[tianYue], palaceIndex: tianYue };
    // Huo Xing and Ling Xing
    const { huoXing, lingXing } = placeHuoXingLingXing(yearBranchIndex, hourBranchIndex);
    summary['火星'] = { palace: palace_1.PALACE_ORDER[huoXing], palaceIndex: huoXing };
    summary['铃星'] = { palace: palace_1.PALACE_ORDER[lingXing], palaceIndex: lingXing };
    // Di Kong and Di Jie
    const { diKong, diJie } = placeDiKongDiJie(hourBranchIndex);
    summary['地空'] = { palace: palace_1.PALACE_ORDER[diKong], palaceIndex: diKong };
    summary['地劫'] = { palace: palace_1.PALACE_ORDER[diJie], palaceIndex: diJie };
    // Tuo Luo and Qing Yang
    const { tuoLuo, qingYang } = placeTuoLuoQingYang(month, hourBranchIndex);
    summary['陀罗'] = { palace: palace_1.PALACE_ORDER[tuoLuo], palaceIndex: tuoLuo };
    summary['擎羊'] = { palace: palace_1.PALACE_ORDER[qingYang], palaceIndex: qingYang };
    return summary;
}
