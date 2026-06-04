/**
 * Test Cases for Ziwei Dōufū Fortune Telling System
 * @module ziwei/test
 */
import { BirthChart, ChartInput } from './index';
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
declare const TEST_CASE_1: ChartInput;
/**
 * Test case 2: Known birth chart - Female born on March 8, 1985 at 14:30
 *
 * Expected:
 * - Year Pillar: 乙丑 (Wood, Ox)
 * - Five Element Bureau: 木三局 (Wood Bureau)
 */
declare const TEST_CASE_2: ChartInput;
/**
 * Test case 3: Known birth chart - Male born on December 25, 2000 at 23:00
 *
 * Expected:
 * - Year Pillar: 庚辰 (Metal, Dragon)
 * - Five Element Bureau: 金四局 (Metal Bureau)
 */
declare const TEST_CASE_3: ChartInput;
/**
 * Test case 4: Known birth chart - Female born on July 7, 1995 at 09:00 (Qi Xi - Chinese Valentine's Day)
 *
 * Expected:
 * - Year Pillar: 乙亥 (Wood, Pig)
 * - Five Element Bureau: 木三局 (Wood Bureau)
 */
declare const TEST_CASE_4: ChartInput;
/**
 * Run a single test case and validate results
 */
declare function runTestCase(testCase: ChartInput, caseName: string): Promise<BirthChart>;
/**
 * Validate specific aspects of a chart
 */
declare function validateChart(chart: BirthChart): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Run all test cases
 */
declare function runAllTests(): Promise<void>;
/**
 * Quick validation test for a specific chart
 */
declare function quickTest(): Promise<BirthChart>;
export { runTestCase, runAllTests, validateChart, quickTest, TEST_CASE_1, TEST_CASE_2, TEST_CASE_3, TEST_CASE_4, };
//# sourceMappingURL=test.d.ts.map