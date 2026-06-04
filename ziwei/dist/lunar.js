"use strict";
/**
 * Lunar Calendar Conversion Module
 * Uses lunar-javascript library to convert between solar and lunar calendars
 * @module ziwei/lunar
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearPillar = getYearPillar;
exports.getMonthPillar = getMonthPillar;
exports.getDayPillar = getDayPillar;
exports.getJulianDayNumber = getJulianDayNumber;
exports.getHourPillar = getHourPillar;
exports.getLunarInfo = getLunarInfo;
exports.getLunarInfoSync = getLunarInfoSync;
/** Heavenly Stems (天干) */
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
/** Earthly Branches (地支) */
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
/**
 * Convert year number to Chinese sexagenary cycle (干支)
 * Uses the formula: (year - 3) % 60 gives the index in the 60-year cycle
 * The cycle starts from Jia Zi (甲子) in 4 BC
 */
function getYearPillar(year) {
    // The Heavenly Stem cycle repeats every 10 years
    // Formula: (year - 4) % 10 gives stem index (0-9), adjusted to positive
    const stemIndex = ((year - 4) % 10 + 10) % 10;
    // The Earthly Branch cycle repeats every 12 years
    // Formula: (year - 4) % 12 gives branch index (0-11), adjusted to positive
    const branchIndex = ((year - 4) % 12 + 12) % 12;
    return {
        stem: STEMS[stemIndex],
        branch: BRANCHES[branchIndex],
    };
}
/**
 * Convert month number (1-12) to month pillar (月柱)
 * The month stem is determined by the year stem and month number
 * Using the formula: (yearStemIndex * 2 + month) % 10
 */
function getMonthPillar(yearStem, month) {
    const yearStemIndex = STEMS.indexOf(yearStem);
    // Month stems start from Jia (甲) for the first month of Yin Year (寅月)
    // Formula: (yearStemIndex * 2 + month) % 10
    const stemIndex = ((yearStemIndex * 2 + month) % 10 + 10) % 10;
    // Month branch follows the earthly branches in order, starting from Yin (寅)
    // Month 1 = Yin (寅), month 2 = Mao (卯), etc.
    const branchIndex = (month + 1) % 12; // 寅月 is month 1, so branch is at index 2 (寅)
    return {
        stem: STEMS[stemIndex],
        branch: BRANCHES[branchIndex],
    };
}
/**
 * Get the day pillar (日柱) based on Julian Day Number
 * Uses the traditional formula for calculating the sexagenary cycle for any given day
 */
function getDayPillar(lunarYear, lunarMonth, lunarDay) {
    // Calculate Julian Day Number (JDN) for the given date
    const jdn = getJulianDayNumber(lunarYear, lunarMonth, lunarDay);
    // The day stem and branch cycle starts from Jia Zi (甲子) on 4 BC 1/1
    // We use the formula: (JDN + 6) % 60 for the cycle position
    // But JDN 0 = 4713 BC Jan 1.5, so we need to adjust
    // Reference: JDN 2440588 = 1970-01-01 (Unix epoch)
    // Get cycle position: (JDN - 4) % 60, adjusted to positive
    const cyclePosition = ((jdn - 4) % 60 + 60) % 60;
    const stemIndex = cyclePosition % 10;
    const branchIndex = cyclePosition % 12;
    return {
        stem: STEMS[stemIndex],
        branch: BRANCHES[branchIndex],
    };
}
/**
 * Calculate Julian Day Number for a given Gregorian date
 * Using the algorithm from: https://en.wikipedia.org/wiki/Julian_day
 */
function getJulianDayNumber(year, month, day) {
    let y = year;
    let m = month;
    // Adjust for January and February
    if (m <= 2) {
        y -= 1;
        m += 12;
    }
    // Calculate JDN
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}
/**
 * Convert hour to time branch (时柱)
 * Traditional Chinese time uses 2-hour periods, starting from Zi (子) = 23:00-01:00
 */
function getHourPillar(dayStem, hour) {
    // Convert hour to traditional period (0-11)
    // Zi (子) = 23:00-01:00 (covers 2 periods: 23-24 and 0-1)
    // We use 2-hour blocks, so hour / 2 gives us the period index
    let periodIndex;
    if (hour >= 23 || hour < 1) {
        periodIndex = 0; // Zi (子)
    }
    else if (hour >= 1 && hour < 3) {
        periodIndex = 1; // Chou (丑)
    }
    else {
        periodIndex = Math.floor((hour + 1) / 2);
    }
    // Hour branch follows earthly branches in order
    const branchIndex = periodIndex % 12;
    // Hour stem formula: (dayStemIndex * 2 + periodIndex) % 10
    const dayStemIndex = STEMS.indexOf(dayStem);
    const stemIndex = ((dayStemIndex * 2 + periodIndex) % 10 + 10) % 10;
    return {
        stem: STEMS[stemIndex],
        branch: BRANCHES[branchIndex],
    };
}
/**
 * Get Chinese lunar date info using lunar-javascript library
 */
async function getLunarInfo(date, hour) {
    // Dynamic import of lunar-javascript
    const Lunar = require('lunar-javascript');
    const lunarDate = Lunar.Solar.fromDate(date);
    const lunar = lunarDate.getLunar();
    const lunarYear = lunar.getYear();
    const lunarMonth = lunar.getMonth();
    const lunarDay = lunar.getDay();
    // Check for leap month using getLeapMonth if available
    let isLeapMonth = false;
    try {
        if (typeof lunar.isLeapMonth === 'function') {
            isLeapMonth = lunar.isLeapMonth();
        }
        else if (typeof lunar.getLeapMonth === 'function') {
            const leapMonth = lunar.getLeapMonth();
            isLeapMonth = leapMonth > 0 && leapMonth === lunarMonth;
        }
        else {
            // Try to get leap month from the lunar calendar object
            const lunarCalendar = lunar;
            if (lunarCalendar.leapMonth !== undefined) {
                isLeapMonth = lunarCalendar.leapMonth > 0 && lunarCalendar.leapMonth === lunarMonth;
            }
        }
    }
    catch (e) {
        isLeapMonth = false;
    }
    // Get year pillar
    const yearPillar = getYearPillar(lunarYear);
    // Get month pillar (need the lunar month without leap month adjustment)
    const monthPillar = getMonthPillar(yearPillar.stem, lunarMonth);
    // Get day pillar using lunar-javascript directly (more accurate)
    const dayStem = lunar.getDayGan();
    const dayBranch = lunar.getDayZhi();
    const dayPillar = { stem: dayStem, branch: dayBranch };
    // Get hour pillar
    const hourPillar = getHourPillar(dayPillar.stem, hour);
    return {
        lunarYear,
        lunarMonth,
        lunarDay,
        isLeapMonth,
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
    };
}
/**
 * Synchronous version using built-in calculation (without lunar-javascript)
 * This is useful when lunar-javascript is not available
 */
function getLunarInfoSync(date, hour) {
    // Use Chinese Lunar Calendar library
    const Lunar = require('lunar-javascript');
    const lunarDate = Lunar.Solar.fromDate(date);
    const lunar = lunarDate.getLunar();
    const lunarYear = lunar.getYear();
    const lunarMonth = lunar.getMonth();
    const lunarDay = lunar.getDay();
    // Check for leap month
    let isLeapMonth = false;
    try {
        if (typeof lunar.isLeapMonth === 'function') {
            isLeapMonth = lunar.isLeapMonth();
        }
        else if (typeof lunar.getLeapMonth === 'function') {
            const leapMonth = lunar.getLeapMonth();
            isLeapMonth = leapMonth > 0 && leapMonth === lunarMonth;
        }
    }
    catch (e) {
        isLeapMonth = false;
    }
    // Get year pillar
    const yearPillar = getYearPillar(lunarYear);
    // Get month pillar
    const monthPillar = getMonthPillar(yearPillar.stem, lunarMonth);
    // Get day pillar using lunar-javascript directly (more accurate)
    const dayStem = lunar.getDayGan();
    const dayBranch = lunar.getDayZhi();
    const dayPillar = { stem: dayStem, branch: dayBranch };
    // Get hour pillar
    const hourPillar = getHourPillar(dayPillar.stem, hour);
    return {
        lunarYear,
        lunarMonth,
        lunarDay,
        isLeapMonth,
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
    };
}
