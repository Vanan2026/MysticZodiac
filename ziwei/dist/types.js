"use strict";
/**
 * Type definitions for Ziwei Dōufū (紫微斗数) Fortune Telling System
 * @module ziwei/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOUR_TRANSFORMATIONS = exports.ASSISTANT_STARS = exports.MAIN_STARS = exports.PALACES = exports.FIVE_ELEMENT_BUREAUS = exports.FIVE_ELEMENTS = exports.EarthlyBranch = exports.HeavenlyStem = void 0;
/** Heavenly Stems (天干) - 10 stems */
var HeavenlyStem;
(function (HeavenlyStem) {
    HeavenlyStem["JIA"] = "\u7532";
    HeavenlyStem["YI"] = "\u4E59";
    HeavenlyStem["BING"] = "\u4E19";
    HeavenlyStem["DING"] = "\u4E01";
    HeavenlyStem["WU"] = "\u620A";
    HeavenlyStem["JI"] = "\u5DF1";
    HeavenlyStem["GENG"] = "\u5E9A";
    HeavenlyStem["XIN"] = "\u8F9B";
    HeavenlyStem["REN"] = "\u58EC";
    HeavenlyStem["GUI"] = "\u7678";
})(HeavenlyStem || (exports.HeavenlyStem = HeavenlyStem = {}));
/** Earthly Branches (地支) - 12 branches */
var EarthlyBranch;
(function (EarthlyBranch) {
    EarthlyBranch["ZI"] = "\u5B50";
    EarthlyBranch["CHOU"] = "\u4E11";
    EarthlyBranch["YIN"] = "\u5BC5";
    EarthlyBranch["MAO"] = "\u536F";
    EarthlyBranch["CHEN"] = "\u8FB0";
    EarthlyBranch["SI"] = "\u5DF3";
    EarthlyBranch["WU"] = "\u5348";
    EarthlyBranch["WEI"] = "\u672A";
    EarthlyBranch["SHEN"] = "\u7533";
    EarthlyBranch["YOU"] = "\u9149";
    EarthlyBranch["XU"] = "\u620C";
    EarthlyBranch["HAI"] = "\u4EA5";
})(EarthlyBranch || (exports.EarthlyBranch = EarthlyBranch = {}));
/** Five Elements (五行) */
exports.FIVE_ELEMENTS = {
    WOOD: '木',
    FIRE: '火',
    EARTH: '土',
    METAL: '金',
    WATER: '水',
};
/** Five Elements Bureau (五行局) */
exports.FIVE_ELEMENT_BUREAUS = {
    WATER_2: '水二局',
    WOOD_3: '木三局',
    METAL_4: '金四局',
    EARTH_5: '土五局',
    FIRE_6: '火六局',
};
/** Zodiac Signs (十二宫) */
exports.PALACES = {
    MING_GONG: '命宫', // Life Palace
    WEI_GONG: '兄弟宫', // Siblings Palace
    JI_GONG: '夫妻宫', // Spouse Palace
    ER_QIN: '子女宫', // Children Palace
    CAI_BO: '财帛宫', // Wealth Palace
    JI_YE: '疾厄宫', // Health Palace
    JIAO_YOU: '交友宫', // Friends Palace
    QIAN_GONG: '迁移宫', // Migration Palace
    GUAN_LU: '官禄宫', // Career Palace
    BI_JIA: '田宅宫', // Property Palace
    FU_BEN: '福德宫', // Fortune Palace
    FU_MU: '父母宫', // Parents Palace
};
/** Main Stars (主星) - 14 major stars */
exports.MAIN_STARS = {
    ZIWEI: '紫微', // Purple Emperor - Leader of Ziwei constellation
    TIANJI: '天机', // Heavenly Mechanism
    TAIYANG: '太阳', // Sun
    WUQU: '武曲', // Military Curved
    TONG: '天同', // Heavenly Concurrence
    LIANZHEN: '廉贞', // Chastity
    TIANFU: '天府', // Heavenly Fortune
    TAIYIN: '太阴', // Moon
    TANLANG: '贪狼', // Greedy Wolf
    JUMEN: '巨门', // Giant Gate
    TIANXIANG: '天相', // Heavenly Minister
    TIANLIANG: '天梁', // Heavenly Pillar
    ZUOSHA: '左辅', // Left Assistant
    YUANQIN: '右弼', // Right Assistant
    QISHA: '七杀', // Seven Killings
    POJUN: '破军', // Broken Army
};
/** Assistant Stars (辅星) - Supporting stars */
exports.ASSISTANT_STARS = {
    // Strengtheners
    ZUOFU: '左辅', // Left Assistant
    YOUBI: '右弼', // Right Assistant
    WENCHANG: '文昌', // Civil昌
    WENQU: '文曲', // Civil Curved
    TIANKUI: '天魁', // Heavenly Honor
    TIANYUE: '天钺', // Heavenly Blade
    LU: '禄存', // Wealth Storage
    // Harmful Stars
    HUO: '火星', // Fire Star
    LING: '铃星', // Bell Star
    DIKONG: '地空', // Earthly Void
    DIJIE: '地劫', // Earthly Robbery
    TUOLUO: '陀罗', // Horn
    QINGYANG: '擎羊', // Javelin
    // Others
    TIANCONTROL: '天刑', // Heavenly Punishment
    TIANYU: '天姚', // Heavenly Eros
    QINYE: '天马', // Running Horse
    JIUCANG: '解神', // Relief Deity
    SUXIN: '破碎', // Broken
    LINGXING: '铃星', // Bell Star
};
/** Four Transformations (四化) */
exports.FOUR_TRANSFORMATIONS = {
    HUA_LU: '化禄', // Transformation of Wealth
    HUA_QUAN: '化权', // Transformation of Power
    HUA_KE: '化科', // Transformation of Knowledge
    HUA_JI: '化忌', // Transformation of Obstacle
};
