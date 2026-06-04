"use strict";
/**
 * Ziwei Dōufū Fortune Telling System
 * Main entry point for chart calculation
 * @module ziwei
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBirthChart = calculateBirthChart;
exports.calculateBirthChartSync = calculateBirthChartSync;
exports.formatBirthChart = formatBirthChart;
const lunar_1 = require("./lunar");
const nayin_1 = require("./nayin");
const palace_1 = require("./palace");
const stars_1 = require("./stars");
const assist_stars_1 = require("./assist-stars");
const sihua_1 = require("./sihua");
/**
 * Main function to calculate birth chart
 * @param input - Birth date and time input
 * @returns Complete birth chart data
 */
async function calculateBirthChart(input) {
    // Convert input to Date object
    const birthDate = new Date(input.year, input.month - 1, input.day);
    // Get lunar calendar information
    const lunarInfo = await (0, lunar_1.getLunarInfo)(birthDate, input.hour);
    // Get year pillar (for Nayin calculation)
    const yearPillar = lunarInfo.yearPillar;
    const nayin = (0, nayin_1.getNayin)(yearPillar.stem, yearPillar.branch);
    // Calculate Five Element Bureau
    const fiveElementBureau = (0, nayin_1.getFiveElementBureau)(yearPillar.stem);
    // Calculate Life Palace (命宫) index
    const mingGongIndex = (0, palace_1.calculateMingGongIndex)(lunarInfo.lunarMonth, input.hour);
    // Calculate Body Palace (身宫) index
    const shenGongIndex = (0, palace_1.calculateShenGongIndex)(lunarInfo.lunarMonth, input.hour);
    // Create initial palace structure with stems and branches
    let palaces = (0, palace_1.createInitialPalaces)(mingGongIndex, lunarInfo.dayPillar.stem, lunarInfo.dayPillar.branch);
    // Place main stars (14 main stars)
    const mainStarsMap = (0, stars_1.placeAllMainStars)(mingGongIndex, fiveElementBureau, lunarInfo.lunarDay);
    palaces = (0, stars_1.applyMainStarsToPalaces)(palaces, mainStarsMap);
    // Place assistant stars
    const assistantStarsMap = (0, assist_stars_1.placeAllAssistantStars)(yearPillar.stem, yearPillar.branch, lunarInfo.lunarMonth, lunarInfo.dayPillar.stem, input.hour);
    palaces = (0, assist_stars_1.applyAssistantStarsToPalaces)(palaces, assistantStarsMap);
    // Calculate Si Hua (四化飞星)
    const siHua = (0, sihua_1.getSiHua)(yearPillar.stem);
    palaces = (0, sihua_1.applySiHuaToPalaces)(palaces, siHua);
    // Get main star at Life Palace
    const mingGongMainStar = (0, stars_1.getMingGongMainStar)(mainStarsMap, mingGongIndex);
    // Build the complete birth chart
    const birthChart = {
        // Solar calendar input
        birthDate,
        birthHour: input.hour,
        // Lunar calendar info
        lunarYear: lunarInfo.lunarYear,
        lunarMonth: lunarInfo.lunarMonth,
        lunarDay: lunarInfo.lunarDay,
        isLeapMonth: lunarInfo.isLeapMonth,
        // Pillars
        yearPillar: {
            stem: yearPillar.stem,
            branch: yearPillar.branch,
            nayin: nayin.bureau,
        },
        monthPillar: {
            stem: lunarInfo.monthPillar.stem,
            branch: lunarInfo.monthPillar.branch,
        },
        dayPillar: {
            stem: lunarInfo.dayPillar.stem,
            branch: lunarInfo.dayPillar.branch,
        },
        hourPillar: {
            stem: lunarInfo.hourPillar.stem,
            branch: lunarInfo.hourPillar.branch,
        },
        // Core calculations
        mingGongIndex,
        shenGongIndex,
        fiveElementBureau,
        // Palaces
        palaces,
        // Main star at Life Palace
        mingGongMainStar: mingGongMainStar || '紫微',
        // Si Hua
        siHua,
        // Raw lunar data
        rawLunar: lunarInfo,
    };
    return birthChart;
}
/**
 * Synchronous version of calculateBirthChart
 * Uses built-in lunar calculation when lunar-javascript is not available
 */
function calculateBirthChartSync(input) {
    // Convert input to Date object
    const birthDate = new Date(input.year, input.month - 1, input.day);
    // Get lunar calendar information (sync version)
    const { lunarYear, lunarMonth, lunarDay, isLeapMonth, yearPillar, monthPillar, dayPillar, hourPillar } = getYearPillarAndPillars(birthDate, input.hour);
    // Get year pillar (for Nayin calculation)
    const nayin = (0, nayin_1.getNayin)(yearPillar.stem, yearPillar.branch);
    // Calculate Five Element Bureau
    const fiveElementBureau = (0, nayin_1.getFiveElementBureau)(yearPillar.stem);
    // Calculate Life Palace (命宫) index
    const mingGongIndex = (0, palace_1.calculateMingGongIndex)(lunarMonth, input.hour);
    // Calculate Body Palace (身宫) index
    const shenGongIndex = (0, palace_1.calculateShenGongIndex)(lunarMonth, input.hour);
    // Create initial palace structure with stems and branches
    let palaces = (0, palace_1.createInitialPalaces)(mingGongIndex, dayPillar.stem, dayPillar.branch);
    // Place main stars (14 main stars)
    const mainStarsMap = (0, stars_1.placeAllMainStars)(mingGongIndex, fiveElementBureau, lunarDay);
    palaces = (0, stars_1.applyMainStarsToPalaces)(palaces, mainStarsMap);
    // Place assistant stars
    const assistantStarsMap = (0, assist_stars_1.placeAllAssistantStars)(yearPillar.stem, yearPillar.branch, lunarMonth, dayPillar.stem, input.hour);
    palaces = (0, assist_stars_1.applyAssistantStarsToPalaces)(palaces, assistantStarsMap);
    // Calculate Si Hua (四化飞星)
    const siHua = (0, sihua_1.getSiHua)(yearPillar.stem);
    palaces = (0, sihua_1.applySiHuaToPalaces)(palaces, siHua);
    // Get main star at Life Palace
    const mingGongMainStar = (0, stars_1.getMingGongMainStar)(mainStarsMap, mingGongIndex);
    // Build the complete birth chart
    const birthChart = {
        birthDate,
        birthHour: input.hour,
        lunarYear,
        lunarMonth,
        lunarDay,
        isLeapMonth,
        yearPillar: {
            stem: yearPillar.stem,
            branch: yearPillar.branch,
            nayin: nayin.bureau,
        },
        monthPillar: {
            stem: monthPillar.stem,
            branch: monthPillar.branch,
        },
        dayPillar: {
            stem: dayPillar.stem,
            branch: dayPillar.branch,
        },
        hourPillar: {
            stem: hourPillar.stem,
            branch: hourPillar.branch,
        },
        mingGongIndex,
        shenGongIndex,
        fiveElementBureau,
        palaces,
        mingGongMainStar: mingGongMainStar || '紫微',
        siHua,
        rawLunar: { lunarYear, lunarMonth, lunarDay, isLeapMonth },
    };
    return birthChart;
}
/**
 * Helper function to calculate all pillars synchronously
 */
function getYearPillarAndPillars(date, hour) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // Simple lunar calendar conversion
    const lunar = convertToLunar(year, month, day);
    const yearPillar = (0, lunar_1.getYearPillar)(lunar.lunarYear);
    const monthPillar = (0, lunar_1.getMonthPillar)(yearPillar.stem, lunar.lunarMonth);
    const dayPillar = (0, lunar_1.getDayPillar)(lunar.lunarYear, lunar.lunarMonth, lunar.lunarDay);
    const hourPillar = (0, lunar_1.getHourPillar)(dayPillar.stem, hour);
    return {
        lunarYear: lunar.lunarYear,
        lunarMonth: lunar.lunarMonth,
        lunarDay: lunar.lunarDay,
        isLeapMonth: lunar.isLeapMonth,
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
    };
}
/**
 * Simple lunar calendar conversion
 * This is a simplified version - in production, use lunar-javascript library
 */
function convertToLunar(year, month, day) {
    // This is a very simplified conversion
    // In production, use lunar-javascript library
    try {
        const Lunar = require('lunar-javascript');
        const solar = Lunar.Solar.fromYmdHms(year, month, day, 12, 0, 0);
        const lunar = solar.getLunar();
        return {
            lunarYear: lunar.getYear(),
            lunarMonth: lunar.getMonth(),
            lunarDay: lunar.getDay(),
            isLeapMonth: lunar.isLeap(),
        };
    }
    catch (e) {
        // Fallback: approximate calculation
        // This is a simplified approximation and may not be accurate
        const lunarNewYear = getLunarNewYearDay(year);
        const solarDay = new Date(year, month - 1, day);
        const diffDays = Math.floor((solarDay.getTime() - lunarNewYear.getTime()) / (1000 * 60 * 60 * 24));
        // Approximate lunar month and day
        const approxLunarDay = diffDays + 1;
        const lunarMonth = Math.floor(approxLunarDay / 30) + 1;
        const lunarDay = ((approxLunarDay - 1) % 30) + 1;
        return {
            lunarYear: year,
            lunarMonth: lunarMonth,
            lunarDay: lunarDay,
            isLeapMonth: false,
        };
    }
}
/**
 * Get approximate Lunar New Year day for a given year
 * This is a simplified version
 */
function getLunarNewYearDay(year) {
    // Approximate: Lunar New Year is between Jan 21 and Feb 20
    // This uses a simplified calculation
    const baseDate = new Date(year, 0, 22); // Jan 22
    return baseDate;
}
/**
 * Get Julian Day Number
 */
function getJulianDayNumber(year, month, day) {
    let y = year;
    let m = month;
    if (m <= 2) {
        y -= 1;
        m += 12;
    }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}
/**
 * Format birth chart for display
 */
function formatBirthChart(chart) {
    const lines = [];
    lines.push('=== 紫微斗数命盘 ===');
    lines.push('');
    lines.push(`出生日期: ${chart.birthDate.toLocaleDateString()}`);
    lines.push(`出生时间: ${chart.birthHour}:00`);
    lines.push('');
    lines.push('--- 四柱 ---');
    lines.push(`年柱: ${chart.yearPillar.stem}${chart.yearPillar.branch} (${chart.yearPillar.nayin})`);
    lines.push(`月柱: ${chart.monthPillar.stem}${chart.monthPillar.branch}`);
    lines.push(`日柱: ${chart.dayPillar.stem}${chart.dayPillar.branch}`);
    lines.push(`时柱: ${chart.hourPillar.stem}${chart.hourPillar.branch}`);
    lines.push('');
    lines.push(`五行局: ${chart.fiveElementBureau}`);
    lines.push(`命宫: ${palace_1.PALACE_ORDER[chart.mingGongIndex]}`);
    lines.push(`身宫: ${palace_1.PALACE_ORDER[chart.shenGongIndex]}`);
    lines.push(`命宫主星: ${chart.mingGongMainStar}`);
    lines.push('');
    lines.push('--- 命宫主星四化 ---');
    lines.push(`化禄: ${chart.siHua.huaLu}`);
    lines.push(`化权: ${chart.siHua.huaQuan}`);
    lines.push(`化科: ${chart.siHua.huaKe}`);
    lines.push(`化忌: ${chart.siHua.huaJi}`);
    lines.push('');
    lines.push('--- 十二宫 ---');
    chart.palaces.forEach((palace) => {
        lines.push('');
        lines.push(`【${palace.palace}】(${palace.stem}${palace.branch})`);
        if (palace.mainStars.length > 0) {
            lines.push(`主星: ${palace.mainStars.join(', ')}`);
        }
        if (palace.assistantStars.length > 0) {
            lines.push(`辅星: ${palace.assistantStars.map(s => s.name).join(', ')}`);
        }
        const siHuaList = [];
        if (palace.siHua.lu)
            siHuaList.push(`化禄:${palace.siHua.lu}`);
        if (palace.siHua.quan)
            siHuaList.push(`化权:${palace.siHua.quan}`);
        if (palace.siHua.ke)
            siHuaList.push(`化科:${palace.siHua.ke}`);
        if (palace.siHua.ji)
            siHuaList.push(`化忌:${palace.siHua.ji}`);
        if (siHuaList.length > 0) {
            lines.push(`四化: ${siHuaList.join(', ')}`);
        }
    });
    return lines.join('\n');
}
/**
 * Export all types for external use
 */
__exportStar(require("./types"), exports);
