/**
 * Chart Screen - Main ZiWei chart display
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, FontSize } from '../../src/constants/theme';
import { ZiWeiChart } from '../../src/components/Chart/ZiWeiChart';

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width - 32, 400);

// Mock data for demo
const mockChartData = {
  palaces: Array.from({ length: 12 }, (_, i) => ({
    name: '',
    index: i,
    mainStars: [],
    minorStars: [],
  })),
};

export default function ChartScreen() {
  const [hasChart, setHasChart] = useState(false);

  if (!hasChart) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☽⊙⌛✦</Text>
          <Text style={styles.emptyTitle}>Your Chart Awaits</Text>
          <Text style={styles.emptyDesc}>
            Cast your celestial chart to unlock the wisdom of the stars
          </Text>
          <TouchableOpacity
            style={styles.castButton}
            onPress={() => setHasChart(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.castButtonText}>Cast Your Chart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.chartTitle}>Your Celestial Chart</Text>
      <Text style={styles.chartSubtitle}>紫微斗数命盘</Text>

      <View style={styles.chartWrapper}>
        <ZiWeiChart data={mockChartData} size={CHART_SIZE} />
      </View>

      <View style={styles.readingsSection}>
        <Text style={styles.sectionTitle}>Your Readings</Text>

        {[
          { name: 'Full Chart Reading', cost: '12', icon: '✦' },
          { name: 'Card of the Day', cost: '1', icon: '☽' },
          { name: 'Monthly Guide', cost: '10', icon: '⊙' },
          { name: 'Past Life Analysis', cost: '4', icon: '⌛' },
          { name: 'Soulmate Portrait', cost: '6', icon: '✦' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.readingItem} activeOpacity={0.7}>
            <Text style={styles.readingIcon}>{item.icon}</Text>
            <View style={styles.readingInfo}>
              <Text style={styles.readingName}>{item.name}</Text>
              <Text style={styles.readingCost}>{item.cost} credits</Text>
            </View>
            <Text style={styles.readingArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 120,
  },
  emptyIcon: {
    fontSize: 48,
    color: Colors.gold,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  emptyDesc: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  castButton: {
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  castButtonText: {
    color: Colors.gold,
    fontSize: FontSize.bodyLg,
    letterSpacing: 2,
  },
  chartTitle: {
    fontSize: FontSize.title,
    color: Colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  chartSubtitle: {
    fontSize: FontSize.caption,
    color: Colors.gold,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  readingsSection: {
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.subtitle,
    color: Colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  readingIcon: {
    fontSize: 18,
    color: Colors.gold,
    marginRight: Spacing.md,
    width: 24,
    textAlign: 'center',
  },
  readingInfo: {
    flex: 1,
  },
  readingName: {
    fontSize: FontSize.bodyLg,
    color: Colors.textPrimary,
  },
  readingCost: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  readingArrow: {
    fontSize: FontSize.subtitle,
    color: Colors.gold,
  },
});
