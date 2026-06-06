/**
 * History Screen - Past readings log
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, FontSize } from '../../src/constants/theme';

const HISTORY_ITEMS = [
  { type: 'Card of the Day', date: 'Jun 5, 2026', icon: '☽', credits: 1 },
  { type: 'Full Chart', date: 'Jun 4, 2026', icon: '✦', credits: 12 },
  { type: 'Soulmate', date: 'Jun 3, 2026', icon: '✦', credits: 6 },
];

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.subtitle}>Your journey through the stars</Text>
      <View style={styles.divider} />

      {HISTORY_ITEMS.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No readings yet</Text>
          <Text style={styles.emptyHint}>
            Your first reading awaits at the Oracle
          </Text>
        </View>
      ) : (
        HISTORY_ITEMS.map((item, i) => (
          <TouchableOpacity key={i} style={styles.item} activeOpacity={0.7}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemType}>{item.type}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={styles.itemCredits}>-{item.credits}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: Spacing.md,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: FontSize.hero,
    color: Colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.gold,
    textAlign: 'center',
    marginTop: Spacing.xs,
    letterSpacing: 1,
  },
  divider: {
    width: 30,
    height: 1,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    marginVertical: Spacing.lg,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: FontSize.bodyLg,
    color: Colors.textSecondary,
  },
  emptyHint: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  itemIcon: {
    fontSize: 20,
    color: Colors.gold,
    marginRight: Spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemType: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  itemDate: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemCredits: {
    fontSize: FontSize.body,
    color: Colors.gold,
  },
});
