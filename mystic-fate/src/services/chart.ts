/**
 * ZiWei Adapter - Wraps the classic JS engine for React Native
 * 
 * This adapter handles the import compatibility for RN environment
 * and provides a clean async API for chart calculation.
 */
import { Solar, Lunar } from 'lunar-javascript';
import { calculateChart as rawCalculate } from './ziwei/index';
import type { ChartResult } from './ziwei/types';

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number; // 0-23
  gender: 'male' | 'female';
  name?: string;
}

export interface ChartCache {
  hash: string;
  result: ChartResult;
  timestamp: number;
}

const chartCache = new Map<string, ChartCache>();

function hashBirth(info: BirthInfo): string {
  return `${info.year}-${info.month}-${info.day}-${info.hour}-${info.gender}`;
}

/**
 * Calculate ZiWei chart from birth info
 */
export async function calculateChart(info: BirthInfo): Promise<ChartResult> {
  const key = hashBirth(info);

  // Check cache first
  const cached = chartCache.get(key);
  if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
    return cached.result;
  }

  // Convert to lunar
  const solar = Solar.fromYmd(info.year, info.month, info.day);
  const lunar = solar.getLunar();

  // Build input for the engine
  const input = {
    lunarYear: lunar.getYear(),
    lunarMonth: lunar.getMonth(),
    lunarDay: lunar.getDay(),
    isLeap: lunar.isLeap(),
    hour: info.hour,
    gender: info.gender === 'male' ? 0 : 1,
  };

  try {
    // Call the raw engine
    const result = rawCalculate(
      input.lunarYear,
      input.lunarMonth,
      input.lunarDay,
      input.hour,
      input.gender
    );

    // Cache it
    chartCache.set(key, {
      hash: key,
      result,
      timestamp: Date.now(),
    });

    return result;
  } catch (err) {
    console.error('Chart calculation failed:', err);
    throw err;
  }
}

/**
 * Get cached chart or null
 */
export function getCachedChart(info: BirthInfo): ChartResult | null {
  const cached = chartCache.get(hashBirth(info));
  return cached ? cached.result : null;
}
