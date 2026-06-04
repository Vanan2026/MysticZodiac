/**
 * Lunar Calendar Conversion Module
 * Uses lunar-javascript library to convert between solar and lunar calendars
 * @module ziwei/lunar
 */
import { HeavenlyStem, EarthlyBranch } from './types';
/**
 * Convert year number to Chinese sexagenary cycle (干支)
 * Uses the formula: (year - 3) % 60 gives the index in the 60-year cycle
 * The cycle starts from Jia Zi (甲子) in 4 BC
 */
export declare function getYearPillar(year: number): {
    stem: HeavenlyStem;
    branch: EarthlyBranch;
};
/**
 * Convert month number (1-12) to month pillar (月柱)
 * The month stem is determined by the year stem and month number
 * Using the formula: (yearStemIndex * 2 + month) % 10
 */
export declare function getMonthPillar(yearStem: HeavenlyStem, month: number): {
    stem: HeavenlyStem;
    branch: EarthlyBranch;
};
/**
 * Get the day pillar (日柱) based on Julian Day Number
 * Uses the traditional formula for calculating the sexagenary cycle for any given day
 */
export declare function getDayPillar(lunarYear: number, lunarMonth: number, lunarDay: number): {
    stem: HeavenlyStem;
    branch: EarthlyBranch;
};
/**
 * Calculate Julian Day Number for a given Gregorian date
 * Using the algorithm from: https://en.wikipedia.org/wiki/Julian_day
 */
export declare function getJulianDayNumber(year: number, month: number, day: number): number;
/**
 * Convert hour to time branch (时柱)
 * Traditional Chinese time uses 2-hour periods, starting from Zi (子) = 23:00-01:00
 */
export declare function getHourPillar(dayStem: HeavenlyStem, hour: number): {
    stem: HeavenlyStem;
    branch: EarthlyBranch;
};
/**
 * Get Chinese lunar date info using lunar-javascript library
 */
export declare function getLunarInfo(date: Date, hour: number): Promise<{
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    isLeapMonth: boolean;
    yearPillar: {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
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
}>;
/**
 * Synchronous version using built-in calculation (without lunar-javascript)
 * This is useful when lunar-javascript is not available
 */
export declare function getLunarInfoSync(date: Date, hour: number): {
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    isLeapMonth: boolean;
    yearPillar: {
        stem: HeavenlyStem;
        branch: EarthlyBranch;
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
};
//# sourceMappingURL=lunar.d.ts.map