/**
 * Type definitions for Ziwei Dōufū (紫微斗数) Fortune Telling System
 * @module ziwei/types
 */
/** Heavenly Stems (天干) - 10 stems */
export declare enum HeavenlyStem {
    JIA = "\u7532",// Wood (Yang)
    YI = "\u4E59",// Wood (Yin)
    BING = "\u4E19",// Fire (Yang)
    DING = "\u4E01",// Fire (Yin)
    WU = "\u620A",// Earth (Yang)
    JI = "\u5DF1",// Earth (Yin)
    GENG = "\u5E9A",// Metal (Yang)
    XIN = "\u8F9B",// Metal (Yin)
    REN = "\u58EC",// Water (Yang)
    GUI = "\u7678"
}
/** Earthly Branches (地支) - 12 branches */
export declare enum EarthlyBranch {
    ZI = "\u5B50",// Rat - Water
    CHOU = "\u4E11",// Ox - Earth
    YIN = "\u5BC5",// Tiger - Wood
    MAO = "\u536F",// Rabbit - Wood
    CHEN = "\u8FB0",// Dragon - Earth
    SI = "\u5DF3",// Snake - Fire
    WU = "\u5348",// Horse - Fire
    WEI = "\u672A",// Goat - Earth
    SHEN = "\u7533",// Monkey - Metal
    YOU = "\u9149",// Cock - Metal
    XU = "\u620C",// Dog - Earth
    HAI = "\u4EA5"
}
/** Five Elements (五行) */
export declare const FIVE_ELEMENTS: {
    readonly WOOD: "木";
    readonly FIRE: "火";
    readonly EARTH: "土";
    readonly METAL: "金";
    readonly WATER: "水";
};
export type FiveElement = typeof FIVE_ELEMENTS[keyof typeof FIVE_ELEMENTS];
/** Five Elements Bureau (五行局) */
export declare const FIVE_ELEMENT_BUREAUS: {
    readonly WATER_2: "水二局";
    readonly WOOD_3: "木三局";
    readonly METAL_4: "金四局";
    readonly EARTH_5: "土五局";
    readonly FIRE_6: "火六局";
};
export type FiveElementBureau = typeof FIVE_ELEMENT_BUREAUS[keyof typeof FIVE_ELEMENT_BUREAUS];
/** Zodiac Signs (十二宫) */
export declare const PALACES: {
    readonly MING_GONG: "命宫";
    readonly WEI_GONG: "兄弟宫";
    readonly JI_GONG: "夫妻宫";
    readonly ER_QIN: "子女宫";
    readonly CAI_BO: "财帛宫";
    readonly JI_YE: "疾厄宫";
    readonly JIAO_YOU: "交友宫";
    readonly QIAN_GONG: "迁移宫";
    readonly GUAN_LU: "官禄宫";
    readonly BI_JIA: "田宅宫";
    readonly FU_BEN: "福德宫";
    readonly FU_MU: "父母宫";
};
export type Palace = typeof PALACES[keyof typeof PALACES];
/** Main Stars (主星) - 14 major stars */
export declare const MAIN_STARS: {
    readonly ZIWEI: "紫微";
    readonly TIANJI: "天机";
    readonly TAIYANG: "太阳";
    readonly WUQU: "武曲";
    readonly TONG: "天同";
    readonly LIANZHEN: "廉贞";
    readonly TIANFU: "天府";
    readonly TAIYIN: "太阴";
    readonly TANLANG: "贪狼";
    readonly JUMEN: "巨门";
    readonly TIANXIANG: "天相";
    readonly TIANLIANG: "天梁";
    readonly ZUOSHA: "左辅";
    readonly YUANQIN: "右弼";
    readonly QISHA: "七杀";
    readonly POJUN: "破军";
};
export type MainStar = typeof MAIN_STARS[keyof typeof MAIN_STARS];
/** Assistant Stars (辅星) - Supporting stars */
export declare const ASSISTANT_STARS: {
    readonly ZUOFU: "左辅";
    readonly YOUBI: "右弼";
    readonly WENCHANG: "文昌";
    readonly WENQU: "文曲";
    readonly TIANKUI: "天魁";
    readonly TIANYUE: "天钺";
    readonly LU: "禄存";
    readonly HUO: "火星";
    readonly LING: "铃星";
    readonly DIKONG: "地空";
    readonly DIJIE: "地劫";
    readonly TUOLUO: "陀罗";
    readonly QINGYANG: "擎羊";
    readonly TIANCONTROL: "天刑";
    readonly TIANYU: "天姚";
    readonly QINYE: "天马";
    readonly JIUCANG: "解神";
    readonly SUXIN: "破碎";
    readonly LINGXING: "铃星";
};
export type AssistantStar = typeof ASSISTANT_STARS[keyof typeof ASSISTANT_STARS];
/** Four Transformations (四化) */
export declare const FOUR_TRANSFORMATIONS: {
    readonly HUA_LU: "化禄";
    readonly HUA_QUAN: "化权";
    readonly HUA_KE: "化科";
    readonly HUA_JI: "化忌";
};
export type FourTransformations = typeof FOUR_TRANSFORMATIONS[keyof typeof FOUR_TRANSFORMATIONS];
/** Si Hua (四化) result for each stem */
export interface SiHuaResult {
    stem: HeavenlyStem;
    huaLu: MainStar | AssistantStar | null;
    huaQuan: MainStar | AssistantStar | null;
    huaKe: MainStar | AssistantStar | null;
    huaJi: MainStar | AssistantStar | null;
}
/** Star in a palace */
export interface PalaceStar {
    name: string;
    isMainStar: boolean;
    transformation?: FourTransformations;
}
/** Individual palace data */
export interface PalaceData {
    palace: Palace;
    palaceIndex: number;
    stem: HeavenlyStem;
    branch: EarthlyBranch;
    mainStars: MainStar[];
    assistantStars: PalaceStar[];
    siHua: {
        lu?: MainStar | AssistantStar;
        quan?: MainStar | AssistantStar;
        ke?: MainStar | AssistantStar;
        ji?: MainStar | AssistantStar;
    };
}
/** Complete birth chart data */
export interface BirthChart {
    birthDate: Date;
    birthHour: number;
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    isLeapMonth: boolean;
    yearPillar: {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
        nayin: string;
    };
    monthPillar: {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
    };
    dayPillar: {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
    };
    hourPillar: {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
    };
    mingGongIndex: number;
    shenGongIndex: number;
    fiveElementBureau: FiveElementBureau;
    palaces: PalaceData[];
    mingGongMainStar: MainStar;
    siHua: SiHuaResult;
    rawLunar: any;
}
/** Input for chart calculation */
export interface ChartInput {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute?: number;
    gender: 'male' | 'female';
}
/** Si Hua mapping table row */
export interface SiHuaMapping {
    stem: HeavenlyStem;
    huaLu: string;
    huaQuan: string;
    huaKe: string;
    huaJi: string;
}
//# sourceMappingURL=types.d.ts.map