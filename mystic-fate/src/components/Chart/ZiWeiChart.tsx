/**
 * ZiWei Chart - SVG Visualization Component
 * Renders the 12-palace ZiWei chart with stars
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { Colors } from '../../constants/theme';

interface Palace {
  name: string;
  index: number;
  mainStars: string[];
  minorStars: string[];
  transformations?: string[];
}

interface ChartData {
  palaces: Palace[];
  // Additional chart data
}

interface ZiWeiChartProps {
  data: ChartData;
  size?: number;
}

const PALACE_NAMES = [
  '命宫', '兄弟', '夫妻', '子女',
  '财帛', '疾厄', '迁移', '交友',
  '官禄', '田宅', '福德', '父母',
];

// Grid layout: 4 columns x 3 rows
const COLS = 4;
const ROWS = 3;

export const ZiWeiChart: React.FC<ZiWeiChartProps> = ({ data, size = 360 }) => {
  const cellW = size / COLS;
  const cellH = size / ROWS;
  const padding = 2;

  const renderPalace = (row: number, col: number, palaceIndex: number) => {
    const x = col * cellW;
    const y = row * cellH;
    const name = PALACE_NAMES[palaceIndex] || '';
    const palace = data.palaces?.[palaceIndex];

    return (
      <G key={`p-${row}-${col}`}>
        {/* Palace background */}
        <Rect
          x={x + padding}
          y={y + padding}
          width={cellW - padding * 2}
          height={cellH - padding * 2}
          fill={Colors.chartPalace}
          stroke={Colors.chartGrid}
          strokeWidth={0.5}
        />
        {/* Palace name */}
        <SvgText
          x={x + cellW / 2}
          y={y + 20}
          fill={Colors.gold}
          fontSize={11}
          textAnchor="middle"
          fontWeight="bold"
        >
          {name}
        </SvgText>
        {/* Main stars */}
        {palace?.mainStars?.slice(0, 3).map((star, i) => (
          <SvgText
            key={`ms-${i}`}
            x={x + 8}
            y={y + 38 + i * 16}
            fill={Colors.chartStar}
            fontSize={9}
          >
            {star}
          </SvgText>
        ))}
        {/* Minor stars */}
        {palace?.minorStars?.slice(0, 2).map((star, i) => (
          <SvgText
            key={`ss-${i}`}
            x={x + cellW / 2 + 4}
            y={y + 38 + i * 16}
            fill={Colors.chartStarMinor}
            fontSize={8}
          >
            {star}
          </SvgText>
        ))}
        {/* Transformations */}
        {palace?.transformations?.map((t, i) => (
          <SvgText
            key={`tf-${i}`}
            x={x + cellW - 4}
            y={y + 38 + i * 14}
            fill={Colors.purple}
            fontSize={8}
            textAnchor="end"
          >
            {t}
          </SvgText>
        ))}
      </G>
    );
  };

  const chartGrid = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // ZiWei chart layout: clockwise from bottom-left
      const positions = [
        [2, 0], [2, 1], [2, 2], [2, 3], // bottom row
        [1, 3], [0, 3],                  // right col
        [0, 2], [0, 1], [0, 0],          // top row
        [1, 0],                           // left col center
        [1, 1],                           // center
        [1, 2],                           // center-right
      ];
      const palaceIndex = positions.findIndex(
        (p) => p[0] === row && p[1] === col
      );
      if (palaceIndex >= 0) {
        chartGrid.push(renderPalace(row, col, palaceIndex));
      } else {
        // Center empty space
        chartGrid.push(
          <Rect
            key={`empty-${row}-${col}`}
            x={col * cellW + padding}
            y={row * cellH + padding}
            width={cellW - padding * 2}
            height={cellH - padding * 2}
            fill={Colors.chartBg}
          />
        );
      }
    }
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <Rect width={size} height={size} fill={Colors.chartBg} />
        {/* Grid lines */}
        {[1, 2].map((i) => (
          <Line
            key={`v-${i}`}
            x1={i * cellW}
            y1={0}
            x2={i * cellW}
            y2={size}
            stroke={Colors.chartGrid}
            strokeWidth={0.5}
          />
        ))}
        {[1, 2].map((i) => (
          <Line
            key={`h-${i}`}
            x1={0}
            y1={i * cellH}
            x2={size}
            y2={i * cellH}
            stroke={Colors.chartGrid}
            strokeWidth={0.5}
          />
        ))}
        {/* Palaces */}
        {chartGrid}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
});
