/**
 * Type definitions for Ziwei Dōufū (紫微斗数) Fortune Telling System
 * @module ziwei/types
 */

/** Heavenly Stems (天干) - 10 stems */
export enum HeavenlyStem {
  JIA = '甲',   // Wood (Yang)
  YI = '乙',    // Wood (Yin)
  BING = '丙',  // Fire (Yang)
  DING = '丁',  // Fire (Yin)
  WU = '戊',    // Earth (Yang)
  JI = '己',    // Earth (Yin)
  GENG = '庚',  // Metal (Yang)
  XIN = '辛',   // Metal (Yin)
  REN = '壬',   // Water (Yang)
  GUI = '癸',   // Water (Yin)
}

/** Earthly Branches (地支) - 12 branches */
export enum EarthlyBranch {
  ZI = '子',    // Rat - Water
  CHOU = '丑',  // Ox - Earth
  YIN = '寅',   // Tiger - Wood
  MAO = '卯',   // Rabbit - Wood
  CHEN = '辰',  // Dragon - Earth
  SI = '巳',    // Snake - Fire
  WU = '午',    // Horse - Fire
  WEI = '未',  // Goat - Earth
  SHEN = '申',  // Monkey - Metal
  YOU = '酉',   // Cock - Metal
  XU = '戌',    // Dog - Earth
  HAI = '亥',   // Pig - Water
}

/** Five Elements (五行) */
export const FIVE_ELEMENTS = {
  WOOD: '木',
  FIRE: '火',
  EARTH: '土',
  METAL: '金',
  WATER: '水',
} as const;

export type FiveElement = typeof FIVE_ELEMENTS[keyof typeof FIVE_ELEMENTS];

/** Five Elements Bureau (五行局) */
export const FIVE_ELEMENT_BUREAUS = {
  WATER_2: '水二局',
  WOOD_3: '木三局',
  METAL_4: '金四局',
  EARTH_5: '土五局',
  FIRE_6: '火六局',
} as const;

export type FiveElementBureau = typeof FIVE_ELEMENT_BUREAUS[keyof typeof FIVE_ELEMENT_BUREAUS];

/** Zodiac Signs (十二宫) */
export const PALACES = {
  MING_GONG: '命宫',      // Life Palace
  WEI_GONG: '兄弟宫',    // Siblings Palace
  JI_GONG: '夫妻宫',     // Spouse Palace
  ER_QIN: '子女宫',      // Children Palace
  CAI_BO: '财帛宫',      // Wealth Palace
  JI_YE: '疾厄宫',       // Health Palace
  JIAO_YOU: '交友宫',    // Friends Palace
  QIAN_GONG: '迁移宫',   // Migration Palace
  GUAN_LU: '官禄宫',     // Career Palace
  BI_JIA: '田宅宫',      // Property Palace
  FU_BEN: '福德宫',      // Fortune Palace
  FU_MU: '父母宫',       // Parents Palace
} as const;

export type Palace = typeof PALACES[keyof typeof PALACES];

/** Main Stars (主星) - 14 major stars */
export const MAIN_STARS = {
  ZIWEI: '紫微',          // Purple Emperor - Leader of Ziwei constellation
  TIANJI: '天机',         // Heavenly Mechanism
  TAIYANG: '太阳',        // Sun
  WUQU: '武曲',           // Military Curved
  TONG: '天同',           // Heavenly Concurrence
  LIANZHEN: '廉贞',       // Chastity
  TIANFU: '天府',         // Heavenly Fortune
  TAIYIN: '太阴',         // Moon
  TANLANG: '贪狼',        // Greedy Wolf
  JUMEN: '巨门',          // Giant Gate
  TIANXIANG: '天相',      // Heavenly Minister
  TIANLIANG: '天梁',      // Heavenly Pillar
  ZUOSHA: '左辅',         // Left Assistant
  YUANQIN: '右弼',        // Right Assistant
  QISHA: '七杀',          // Seven Killings
  POJUN: '破军',          // Broken Army
} as const;

export type MainStar = typeof MAIN_STARS[keyof typeof MAIN_STARS];

/** Assistant Stars (辅星) - Supporting stars */
export const ASSISTANT_STARS = {
  // Strengtheners
  ZUOFU: '左辅',          // Left Assistant
  YOUBI: '右弼',          // Right Assistant
  WENCHANG: '文昌',       // Civil昌
  WENQU: '文曲',          // Civil Curved
  TIANKUI: '天魁',        // Heavenly Honor
  TIANYUE: '天钺',        // Heavenly Blade
  LU: '禄存',             // Wealth Storage
  
  // Harmful Stars
  HUO: '火星',            // Fire Star
  LING: '铃星',           // Bell Star
  DIKONG: '地空',         // Earthly Void
  DIJIE: '地劫',          // Earthly Robbery
  TUOLUO: '陀罗',         // Horn
  QINGYANG: '擎羊',       // Javelin
  
  // Others
  TIANCONTROL: '天刑',    // Heavenly Punishment
  TIANYU: '天姚',         // Heavenly Eros
  QINYE: '天马',          // Running Horse
  JIUCANG: '解神',        // Relief Deity
  SUXIN: '破碎',          // Broken
  LINGXING: '铃星',       // Bell Star
} as const;

export type AssistantStar = typeof ASSISTANT_STARS[keyof typeof ASSISTANT_STARS];

/** Four Transformations (四化) */
export const FOUR_TRANSFORMATIONS = {
  HUA_LU: '化禄',         // Transformation of Wealth
  HUA_QUAN: '化权',       // Transformation of Power
  HUA_KE: '化科',         // Transformation of Knowledge
  HUA_JI: '化忌',         // Transformation of Obstacle
} as const;

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
  palaceIndex: number;  // 0-11, starting from Ming Gong (Life Palace)
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
  // Solar calendar input
  birthDate: Date;
  birthHour: number;  // 0-23
  
  // Lunar calendar info
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  
  // Pillars
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
  
  // Core calculations
  mingGongIndex: number;  // Index of Life Palace (0-11)
  shenGongIndex: number;  // Index of Body Palace (0-11)
  fiveElementBureau: FiveElementBureau;
  
  // Palaces (12 palaces)
  palaces: PalaceData[];
  
  // Main star at Life Palace
  mingGongMainStar: MainStar;
  
  // Si Hua result
  siHua: SiHuaResult;
  
  // Raw lunar data for debugging
  rawLunar: any;
}

/** Input for chart calculation */
export interface ChartInput {
  year: number;      // e.g., 1990
  month: number;     // 1-12
  day: number;       // 1-31
  hour: number;      // 0-23 (will be converted to traditional 2-hour periods)
  minute?: number;   // 0-59
  gender: 'male' | 'female';  // Gender affects some calculations
}

/** Si Hua mapping table row */
export interface SiHuaMapping {
  stem: HeavenlyStem;
  huaLu: string;
  huaQuan: string;
  huaKe: string;
  huaJi: string;
}
