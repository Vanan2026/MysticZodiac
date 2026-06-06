# Mystic Fate - Ziwei Dōufū Fortune Telling System

A comprehensive TypeScript implementation of the Ziwei Dōufū (紫微斗数) fortune telling algorithm for the Mystic Zodiac app. This module provides accurate birth chart calculations following traditional Chinese astrology principles.

## Features

- 🌙 **Lunar Calendar Conversion** - Accurate solar to lunar date conversion using the `lunar-javascript` library
- 🎯 **Four Pillars (四柱)** - Year, month, day, and hour pillars with heavenly stems and earthly branches
- ⭐ **14 Main Stars Placement** - Complete placement algorithm for all major stars including:
  - Ziwei Constellation (紫微星系): 紫微, 天机, 太阳, 武曲, 天同, 廉贞
  - Tianfu Constellation (天府星系): 天府, 太阴, 贪狼, 巨门, 天相, 天梁, 七杀, 破军
- 🌟 **Assistant Stars** - Comprehensive placement for supporting stars:
  - 左辅, 右弼 (Left/Right Assistants)
  - 文昌, 文曲 (Civil Stars)
  - 天魁, 天钺 (Honor Stars)
  - 火星, 铃星 (Fire/Bell Stars)
  - 地空, 地劫 (Void/Robbery Stars)
  - 陀罗, 擎羊 (Horn/Javelin Stars)
- 🔄 **Four Transformations (四化飞星)** - Full Si Hua calculation based on year stem
- 🏠 **12 Palaces** - Complete palace structure with stems, branches, and star assignments
- ♋ **Five Element Bureau** - Automatic calculation of 水二局, 木三局, 金四局, 土五局, 火六局

## Installation

```bash
npm install lunar-javascript
```

## Usage

### Basic Usage

```typescript
import { calculateBirthChart, formatBirthChart } from './ziwei';

// Create birth chart
const chart = await calculateBirthChart({
  year: 1990,
  month: 1,
  day: 15,
  hour: 10,
  gender: 'male',
});

// Access birth chart data
console.log(`Five Element Bureau: ${chart.fiveElementBureau}`);
console.log(`Life Palace: ${chart.palaces[chart.mingGongIndex].palace}`);
console.log(`Life Palace Main Star: ${chart.mingGongMainStar}`);

// Format for display
console.log(formatBirthChart(chart));
```

### Accessing Palace Data

```typescript
// Get all 12 palaces
chart.palaces.forEach((palace, index) => {
  console.log(`${palace.palace}: ${palace.stem}${palace.branch}`);
  console.log(`  Main Stars: ${palace.mainStars.join(', ')}`);
  console.log(`  Assistant Stars: ${palace.assistantStars.map(s => s.name).join(', ')}`);
  
  // Si Hua in this palace
  if (palace.siHua.lu) console.log(`  化禄: ${palace.siHua.lu}`);
  if (palace.siHua.quan) console.log(`  化权: ${palace.siHua.quan}`);
  if (palace.siHua.ke) console.log(`  化科: ${palace.siHua.ke}`);
  if (palace.siHua.ji) console.log(`  化忌: ${palace.siHua.ji}`);
});
```

## API Reference

### `calculateBirthChart(input: ChartInput): Promise<BirthChart>`

Calculate a complete birth chart based on birth date and time.

**Parameters:**
- `input.year` - Birth year (e.g., 1990)
- `input.month` - Birth month (1-12)
- `input.day` - Birth day (1-31)
- `input.hour` - Birth hour (0-23)
- `input.gender` - Gender ('male' | 'female')

**Returns:** `Promise<BirthChart>` with complete chart data

### `calculateBirthChartSync(input: ChartInput): BirthChart`

Synchronous version of the calculation (uses built-in lunar conversion).

### `formatBirthChart(chart: BirthChart): string`

Format birth chart as a readable string for debugging/display.

## Data Structures

### BirthChart

```typescript
interface BirthChart {
  birthDate: Date;
  birthHour: number;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  
  yearPillar: { stem: HeavenlyStem; branch: EarthlyBranch; nayin: string };
  monthPillar: { stem: HeavenlyStem; branch: EarthlyBranch };
  dayPillar: { stem: HeavenlyStem; branch: EarthlyBranch };
  hourPillar: { stem: HeavenlyStem; branch: EarthlyBranch };
  
  mingGongIndex: number;
  shenGongIndex: number;
  fiveElementBureau: FiveElementBureau;
  
  palaces: PalaceData[];
  mingGongMainStar: MainStar;
  siHua: SiHuaResult;
}
```

### PalaceData

```typescript
interface PalaceData {
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
```

## Algorithm Details

### Ziwei Star Position

The position of the Purple Emperor (紫微) star is determined by:

1. **Five Element Bureau** (based on year stem and Nayin)
2. **Birth Day** (lunar calendar day)

| Bureau | Day 1-10 | Day 11-20 | Day 21-30 |
|--------|----------|-----------|-----------|
| 水二局 (Water) | 0 | 1 | 2 |
| 木三局 (Wood) | 2 | 3 | 4 |
| 金四局 (Metal) | 4 | 5 | 6 |
| 土五局 (Earth) | 6 | 7 | 8 |
| 火六局 (Fire) | 8 | 9 | 10 |

### Life Palace Calculation

```
Life Palace Index = (Lunar Month + Hour Branch Index - 2) % 12
```

### Body Palace Calculation

```
Body Palace Index = (Lunar Month + Hour Branch Index + 10) % 12
```

## Testing

Run the test suite:

```bash
npm test
```

### Test Cases Included

1. **Male, Jan 15, 1990 at 10:00** - 己巳 year (Earth Bureau)
2. **Female, Mar 8, 1985 at 14:30** - 乙丑 year (Wood Bureau)
3. **Male, Dec 25, 2000 at 23:00** - 庚辰 year (Metal Bureau)
4. **Female, Jul 7, 1995 at 09:00** - 乙亥 year, Qi Xi (Wood Bureau)

## Project Structure

```
ziwei/
├── index.ts          # Main entry point, export calculation function
├── lunar.ts          # Lunar calendar conversion
├── palace.ts         # Palace calculations (Life Palace, Body Palace)
├── stars.ts          # Main stars placement algorithm
├── assist-stars.ts   # Assistant stars placement
├── sihua.ts          # Four transformations (四化飞星)
├── nayin.ts          # Nayin table and Five Element Bureau
├── types.ts          # TypeScript type definitions
├── test.ts           # Test cases
├── package.json
├── tsconfig.json
└── README.md
```

## React Native Integration

This module is designed to work seamlessly with React Native:

```typescript
// Example: Using in a React Native component
import { calculateBirthChart } from './ziwei';

const BirthChartScreen = () => {
  const [chart, setChart] = useState(null);
  
  useEffect(() => {
    calculateBirthChart({
      year: 1990,
      month: 1,
      day: 15,
      hour: 10,
      gender: 'male',
    }).then(setChart);
  }, []);
  
  if (!chart) return <ActivityIndicator />;
  
  return (
    <ScrollView>
      {chart.palaces.map((palace, index) => (
        <PalaceCard key={index} palace={palace} />
      ))}
    </ScrollView>
  );
};
```

## Accuracy Notes

This implementation follows traditional Ziwei Dōufū calculation methods. The accuracy depends on:

1. Correct input of birth date and time
2. Proper lunar calendar conversion
3. Accurate determination of year/month/day/hour pillars

**Note:** Traditional Chinese timekeeping uses the local solar time, which may differ from standard time zones. For birth times near daylight saving transitions, some adjustment may be needed.

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure all new features include proper TypeScript types and test cases.
