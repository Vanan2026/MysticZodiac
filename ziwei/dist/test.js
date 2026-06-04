"use strict";
/**
 * Test Cases for Ziwei Dōufū Fortune Telling System
 * @module ziwei/test
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_CASE_4 = exports.TEST_CASE_3 = exports.TEST_CASE_2 = exports.TEST_CASE_1 = void 0;
exports.runTestCase = runTestCase;
exports.runAllTests = runAllTests;
exports.validateChart = validateChart;
exports.quickTest = quickTest;
const index_1 = require("./index");
const palace_1 = require("./palace");
/**
 * Test case 1: Known birth chart - Male born on January 15, 1990 at 10:00
 *
 * Expected:
 * - Year Pillar: 己巳 (Earth, Snake)
 * - Month Pillar: 丁丑
 * - Day Pillar: 辛未
 * - Hour Pillar: 乙巳
 * - Five Element Bureau: 土五局 (Earth Bureau)
 */
const TEST_CASE_1 = {
    year: 1990,
    month: 1,
    day: 15,
    hour: 10,
    gender: 'male',
};
exports.TEST_CASE_1 = TEST_CASE_1;
/**
 * Test case 2: Known birth chart - Female born on March 8, 1985 at 14:30
 *
 * Expected:
 * - Year Pillar: 乙丑 (Wood, Ox)
 * - Five Element Bureau: 木三局 (Wood Bureau)
 */
const TEST_CASE_2 = {
    year: 1985,
    month: 3,
    day: 8,
    hour: 14,
    gender: 'female',
};
exports.TEST_CASE_2 = TEST_CASE_2;
/**
 * Test case 3: Known birth chart - Male born on December 25, 2000 at 23:00
 *
 * Expected:
 * - Year Pillar: 庚辰 (Metal, Dragon)
 * - Five Element Bureau: 金四局 (Metal Bureau)
 */
const TEST_CASE_3 = {
    year: 2000,
    month: 12,
    day: 25,
    hour: 23,
    gender: 'male',
};
exports.TEST_CASE_3 = TEST_CASE_3;
/**
 * Test case 4: Known birth chart - Female born on July 7, 1995 at 09:00 (Qi Xi - Chinese Valentine's Day)
 *
 * Expected:
 * - Year Pillar: 乙亥 (Wood, Pig)
 * - Five Element Bureau: 木三局 (Wood Bureau)
 */
const TEST_CASE_4 = {
    year: 1995,
    month: 7,
    day: 7,
    hour: 9,
    gender: 'female',
};
exports.TEST_CASE_4 = TEST_CASE_4;
/**
 * Run a single test case and validate results
 */
async function runTestCase(testCase, caseName) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test Case: ${caseName}`);
    console.log(`Input: Year ${testCase.year}, Month ${testCase.month}, Day ${testCase.day}, Hour ${testCase.hour}`);
    console.log(`${'='.repeat(60)}\n`);
    try {
        const chart = await (0, index_1.calculateBirthChart)(testCase);
        console.log('--- Basic Info ---');
        console.log(`Lunar Date: ${chart.lunarYear}/${chart.lunarMonth}/${chart.lunarDay}`);
        console.log(`Is Leap Month: ${chart.isLeapMonth}`);
        console.log('');
        console.log('--- Four Pillars ---');
        console.log(`Year Pillar: ${chart.yearPillar.stem}${chart.yearPillar.branch} (${chart.yearPillar.nayin})`);
        console.log(`Month Pillar: ${chart.monthPillar.stem}${chart.monthPillar.branch}`);
        console.log(`Day Pillar: ${chart.dayPillar.stem}${chart.dayPillar.branch}`);
        console.log(`Hour Pillar: ${chart.hourPillar.stem}${chart.hourPillar.branch}`);
        console.log('');
        console.log('--- Core Calculations ---');
        console.log(`Five Element Bureau: ${chart.fiveElementBureau}`);
        console.log(`Life Palace Index: ${chart.mingGongIndex} (${palace_1.PALACE_ORDER[chart.mingGongIndex]})`);
        console.log(`Body Palace Index: ${chart.shenGongIndex} (${palace_1.PALACE_ORDER[chart.shenGongIndex]})`);
        console.log(`Life Palace Main Star: ${chart.mingGongMainStar}`);
        console.log('');
        console.log('--- Si Hua (Four Transformations) ---');
        console.log(`Stem: ${chart.siHua.stem}`);
        console.log(`化禄 (Wei): ${chart.siHua.huaLu}`);
        console.log(`化权 (Quan): ${chart.siHua.huaQuan}`);
        console.log(`化科 (Ke): ${chart.siHua.huaKe}`);
        console.log(`化忌 (Ji): ${chart.siHua.huaJi}`);
        console.log('');
        console.log('--- Palaces ---');
        chart.palaces.forEach((palace, index) => {
            const isMingGong = index === chart.mingGongIndex;
            const isShenGong = index === chart.shenGongIndex;
            const markers = [];
            if (isMingGong)
                markers.push('命宫');
            if (isShenGong)
                markers.push('身宫');
            const markerStr = markers.length > 0 ? ` [${markers.join(', ')}]` : '';
            console.log(`\n${index}. ${palace.palace}${markerStr}`);
            console.log(`   Stem/Branch: ${palace.stem}${palace.branch}`);
            if (palace.mainStars.length > 0) {
                console.log(`   Main Stars: ${palace.mainStars.join(', ')}`);
            }
            if (palace.assistantStars.length > 0) {
                console.log(`   Assistant Stars: ${palace.assistantStars.map(s => s.name).join(', ')}`);
            }
            const siHuaArr = [];
            if (palace.siHua.lu)
                siHuaArr.push(`禄:${palace.siHua.lu}`);
            if (palace.siHua.quan)
                siHuaArr.push(`权:${palace.siHua.quan}`);
            if (palace.siHua.ke)
                siHuaArr.push(`科:${palace.siHua.ke}`);
            if (palace.siHua.ji)
                siHuaArr.push(`忌:${palace.siHua.ji}`);
            if (siHuaArr.length > 0) {
                console.log(`   Si Hua: ${siHuaArr.join(', ')}`);
            }
        });
        console.log('\n' + '='.repeat(60));
        console.log(`Test Case ${caseName} completed successfully!`);
        console.log('='.repeat(60));
        return chart;
    }
    catch (error) {
        console.error(`Error in test case ${caseName}:`, error);
        throw error;
    }
}
/**
 * Validate specific aspects of a chart
 */
function validateChart(chart) {
    const errors = [];
    const warnings = [];
    // Check that Life Palace has a main star
    const mingGong = chart.palaces[chart.mingGongIndex];
    if (mingGong.mainStars.length === 0) {
        errors.push('Life Palace has no main star');
    }
    // Check that Si Hua stars exist in the chart
    const allStarNames = chart.palaces.flatMap(p => [
        ...p.mainStars,
        ...p.assistantStars.map(a => a.name)
    ]);
    if (!allStarNames.includes(chart.siHua.huaLu)) {
        warnings.push(`化禄 star ${chart.siHua.huaLu} not found in chart`);
    }
    if (!allStarNames.includes(chart.siHua.huaQuan)) {
        warnings.push(`化权 star ${chart.siHua.huaQuan} not found in chart`);
    }
    if (!allStarNames.includes(chart.siHua.huaKe)) {
        warnings.push(`化科 star ${chart.siHua.huaKe} not found in chart`);
    }
    if (!allStarNames.includes(chart.siHua.huaJi)) {
        warnings.push(`化忌 star ${chart.siHua.huaJi} not found in chart`);
    }
    // Check that Ziwei star exists in the chart
    if (!allStarNames.includes('紫微')) {
        warnings.push('紫微星 not found in chart');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Run all test cases
 */
async function runAllTests() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     Ziwei Dōufū Fortune Telling System - Test Suite       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n');
    const testCases = [
        { input: TEST_CASE_1, name: 'Male, Jan 15, 1990 at 10:00 (己巳 year)' },
        { input: TEST_CASE_2, name: 'Female, Mar 8, 1985 at 14:30 (乙丑 year)' },
        { input: TEST_CASE_3, name: 'Male, Dec 25, 2000 at 23:00 (庚辰 year)' },
        { input: TEST_CASE_4, name: 'Female, Jul 7, 1995 at 09:00 (乙亥 year, Qi Xi)' },
    ];
    const results = [];
    for (const { input, name } of testCases) {
        const chart = await runTestCase(input, name);
        const validation = validateChart(chart);
        results.push({ name, chart, validation });
    }
    // Print validation summary
    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                   Validation Summary                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    results.forEach(({ name, validation }) => {
        console.log(`\n${name}:`);
        console.log(`  Status: ${validation.valid ? '✅ VALID' : '❌ INVALID'}`);
        if (validation.errors.length > 0) {
            console.log(`  Errors: ${validation.errors.join(', ')}`);
        }
        if (validation.warnings.length > 0) {
            console.log(`  Warnings: ${validation.warnings.join(', ')}`);
        }
    });
    // Print comparison of expected vs actual for key values
    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║              Expected vs Actual Comparison                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\nTest Case 1 (1990-01-15 10:00):');
    console.log('  Expected Year Pillar: 己巳 (己巳年)');
    console.log(`  Actual Year Pillar: ${results[0].chart.yearPillar.stem}${results[0].chart.yearPillar.branch}`);
    console.log('  Expected Bureau: 土五局');
    console.log(`  Actual Bureau: ${results[0].chart.fiveElementBureau}`);
    console.log('\nTest Case 2 (1985-03-08 14:30):');
    console.log('  Expected Year Pillar: 乙丑');
    console.log(`  Actual Year Pillar: ${results[1].chart.yearPillar.stem}${results[1].chart.yearPillar.branch}`);
    console.log('  Expected Bureau: 木三局');
    console.log(`  Actual Bureau: ${results[1].chart.fiveElementBureau}`);
    console.log('\nTest Case 3 (2000-12-25 23:00):');
    console.log('  Expected Year Pillar: 庚辰');
    console.log(`  Actual Year Pillar: ${results[2].chart.yearPillar.stem}${results[2].chart.yearPillar.branch}`);
    console.log('  Expected Bureau: 金四局');
    console.log(`  Actual Bureau: ${results[2].chart.fiveElementBureau}`);
    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                   All Tests Completed                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
}
/**
 * Quick validation test for a specific chart
 */
async function quickTest() {
    console.log('\nQuick Test: Calculating chart for 1990-01-15 10:00\n');
    const chart = await (0, index_1.calculateBirthChart)(TEST_CASE_1);
    console.log((0, index_1.formatBirthChart)(chart));
    return chart;
}
// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}
