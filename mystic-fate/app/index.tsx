/**
 * Welcome / Onboarding Entry Screen
 * Splash → Onboarding flow
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize } from '../src/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [phase, setPhase] = useState<'splash' | 'pain' | 'birth' | 'done'>('splash');

  if (phase === 'splash') {
    return (
      <View style={styles.container}>
        <View style={styles.splashContent}>
          <Text style={styles.logo}>☽⊙⌛✦</Text>
          <Text style={styles.title}>Mystic Fate</Text>
          <Text style={styles.subtitle}>Eastern Wisdom for Self-Discovery</Text>
          <View style={styles.divider} />
          <Text style={styles.slogan}>
            "Unlock 5,000 years of celestial wisdom"
          </Text>
          <TouchableOpacity
            style={styles.beginButton}
            onPress={() => setPhase('pain')}
            activeOpacity={0.8}
          >
            <Text style={styles.beginButtonText}>Begin Your Journey</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'pain') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.stepIndicator}>Step 1 of 3</Text>
          <Text style={styles.question}>
            What keeps you awake at night?
          </Text>
          <Text style={styles.hint}>
            The stars already know. Just speak your truth.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setPhase('birth')}
          >
            <Text style={styles.continueText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'birth') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.stepIndicator}>Step 2 of 3</Text>
          <Text style={styles.question}>
            When were you born?
          </Text>
          <Text style={styles.hint}>
            The exact moment holds the key to your destiny.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              setPhase('done');
              router.replace('/(tabs)');
            }}
          >
            <Text style={styles.continueText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    width: '100%',
  },
  logo: {
    fontSize: 48,
    color: Colors.gold,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 6,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.bodyLg,
    color: Colors.gold,
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.gold,
    marginBottom: Spacing.lg,
  },
  slogan: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  beginButton: {
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  beginButtonText: {
    color: Colors.gold,
    fontSize: FontSize.bodyLg,
    letterSpacing: 2,
  },
  stepIndicator: {
    fontSize: FontSize.caption,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: Spacing.lg,
  },
  question: {
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    fontWeight: '300',
    marginBottom: Spacing.md,
  },
  hint: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
  },
  continueButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  continueText: {
    color: Colors.gold,
    fontSize: FontSize.bodyLg,
    letterSpacing: 1,
  },
});
