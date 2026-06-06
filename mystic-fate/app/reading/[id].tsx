/**
 * Reading Detail Screen
 * Full AI reading display with scrollable content
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Spacing, FontSize } from '../../src/constants/theme';
import { generateReading } from '../../src/services/ai';

const READING_TITLES: Record<string, string> = {
  destiny: 'Destiny Chart Reading',
  monthly: 'Monthly Cosmic Guide',
  soulmate: 'Soulmate Portrait',
  compatibility: 'Soul Tie Compatibility',
  pastlife: 'Past Life Insight',
  daily: "Today's Cosmic Whisper",
};

const READING_ICONS: Record<string, string> = {
  destiny: '⊙',
  monthly: '☽',
  soulmate: '✦',
  compatibility: '⌛',
  pastlife: '☉',
  daily: '☆',
};

export default function ReadingScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReading();
  }, [id, type]);

  const loadReading = async () => {
    setLoading(true);
    try {
      const result = await generateReading(type || 'daily', {
        readingType: type,
        chartData: null,
      });
      setContent(result || 'The stars are aligning... please try again.');
    } catch (err) {
      setContent('The cosmic connection faltered. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `✨ Mystic Fate Reading\n\n${content?.slice(0, 500)}...\n\nDiscover your destiny: https://vanan2026.github.io/MysticFate/`,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareButton}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.icon}>{READING_ICONS[type || 'daily']}</Text>
        <Text style={styles.title}>
          {READING_TITLES[type || 'daily']}
        </Text>
        <View style={styles.divider} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.loadingText}>
              Consulting the celestial archives...
            </Text>
          </View>
        ) : (
          <Text style={styles.content}>{content}</Text>
        )}

        {!loading && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadReading}
            activeOpacity={0.8}
          >
            <Text style={styles.refreshText}>Read Again →</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    color: Colors.gold,
    fontSize: FontSize.body,
    letterSpacing: 1,
  },
  shareButton: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl * 2,
  },
  icon: {
    fontSize: 36,
    color: Colors.gold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.heading,
    color: Colors.textPrimary,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.gold,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
    fontStyle: 'italic',
    marginTop: Spacing.lg,
  },
  content: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  refreshButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: Spacing.xxl,
  },
  refreshText: {
    color: Colors.gold,
    fontSize: FontSize.body,
    letterSpacing: 1,
  },
});
