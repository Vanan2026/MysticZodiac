/**
 * Ziwei Dōufū Fortune Telling System
 * Main entry point for chart calculation
 * @module ziwei
 */
import { BirthChart, ChartInput } from './types';
/**
 * Main function to calculate birth chart
 * @param input - Birth date and time input
 * @returns Complete birth chart data
 */
export declare function calculateBirthChart(input: ChartInput): Promise<BirthChart>;
/**
 * Synchronous version of calculateBirthChart
 * Uses built-in lunar calculation when lunar-javascript is not available
 */
export declare function calculateBirthChartSync(input: ChartInput): BirthChart;
/**
 * Format birth chart for display
 */
export declare function formatBirthChart(chart: BirthChart): string;
/**
 * Export all types for external use
 */
export * from './types';
//# sourceMappingURL=index.d.ts.map