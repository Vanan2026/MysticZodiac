/**
 * Login / Signup Screen
 * Supabase Auth integration
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize } from '../../src/constants/theme';
import { signInWithEmail, signUpWithEmail } from '../../src/services/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        Alert.alert(
          'Welcome to Mystic Fate',
          'Check your email to confirm your account, then sign in.'
        );
        setIsSignUp(false);
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>☽⊙⌛✦</Text>
        <Text style={styles.title}>Mystic Fate</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Connecting to the stars...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : "New to Mystic Fate? Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.skipText}>Continue as Guest →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logo: {
    fontSize: 40,
    color: Colors.gold,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 6,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.bodyLg,
    color: Colors.gold,
    letterSpacing: 2,
    marginBottom: Spacing.xxl,
  },
  form: {
    width: '100%',
    maxWidth: 360,
  },
  label: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.gold,
    fontSize: FontSize.body,
    letterSpacing: 2,
  },
  switchButton: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
  },
  skipButton: {
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    letterSpacing: 1,
  },
});
