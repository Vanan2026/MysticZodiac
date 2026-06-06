/**
 * Profile Screen - Settings, credits, account
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

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.divider} />

      {/* Credits Card */}
      <View style={styles.creditsCard}>
        <Text style={styles.creditsLabel}>Your Credits</Text>
        <Text style={styles.creditsAmount}>8</Text>
        <Text style={styles.creditsHint}>
          Use credits to unlock readings
        </Text>
        <TouchableOpacity style={styles.buyButton} activeOpacity={0.7}>
          <Text style={styles.buyButtonText}>Get More Credits</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {['Daily Reminder', 'Sign In', 'Reset Chart'].map((item, i) => (
          <TouchableOpacity key={i} style={styles.settingsItem} activeOpacity={0.7}>
            <Text style={styles.settingsText}>{item}</Text>
            <Text style={styles.settingsArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Mystic Fate v1.0.0</Text>
        <Text style={styles.footerText}>For entertainment purposes only</Text>
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
  divider: {
    width: 30,
    height: 1,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    marginVertical: Spacing.lg,
  },
  creditsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  creditsLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  creditsAmount: {
    fontSize: 56,
    color: Colors.gold,
    fontWeight: '300',
    marginVertical: Spacing.sm,
  },
  creditsHint: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  buyButton: {
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  buyButtonText: {
    color: Colors.gold,
    fontSize: FontSize.body,
    letterSpacing: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.body,
    color: Colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  settingsText: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  settingsArrow: {
    fontSize: FontSize.body,
    color: Colors.gold,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
});
