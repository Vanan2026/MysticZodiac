/**
 * Oracle Screen - AI readings & daily fortune
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

const READINGS = [
  { name: 'Card of the Day', icon: '☽', desc: 'Your daily celestial whisper' },
  { name: 'Full Chart Reading', icon: '✦', desc: 'Complete destiny analysis' },
  { name: 'Monthly Guide', icon: '⊙', desc: 'The month ahead, revealed' },
  { name: 'Past Life', icon: '⌛', desc: 'Echoes from your previous journey' },
  { name: 'Soulmate Portrait', icon: '✦', desc: 'The stars speak of connection' },
  { name: 'Celebrity Match', icon: '✦', desc: 'Compare your chart with the stars' },
];

export default function OracleScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>The Oracle</Text>
      <Text style={styles.subtitle}>Seek the wisdom of the stars</Text>
      <View style={styles.divider} />

      <View style={styles.grid}>
        {READINGS.map((item, i) => (
          <TouchableOpacity key={i} style={styles.card} activeOpacity={0.7}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
            <Text style={styles.cardAction}>Unlock →</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: Colors.bgCard,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardIcon: {
    fontSize: 24,
    color: Colors.gold,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  cardDesc: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  cardAction: {
    fontSize: FontSize.caption,
    color: Colors.gold,
    letterSpacing: 1,
  },
});
