/**
 * Splash Screen Component
 * Entry animation with Yin-Yang logo
 */

import React, { useEffect, useState } from 'react';
import { colors } from '../utils/theme';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 2000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      ...styles.container,
      animation: 'fadeIn 0.5s ease'
    }}>
      {/* Stars Background */}
      <div style={styles.starsContainer}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.star,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div style={styles.logoContainer}>
        <div style={styles.logo}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.gold} />
                <stop offset="100%" stopColor={colors.goldDim} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
            <path d="M50 5 A45 45 0 0 1 50 95 A22.5 22.5 0 0 1 50 50 A22.5 22.5 0 0 0 50 5" fill={colors.gold} />
            <circle cx="50" cy="27.5" r="5" fill={colors.bgPrimary} />
            <circle cx="50" cy="72.5" r="5" fill={colors.gold} />
          </svg>
        </div>
        <h1 style={styles.title}>Mystic Fate</h1>
        <p style={styles.subtitle}>紫微斗数 · 东方命理</p>
      </div>

      {/* Hint */}
      {showHint && (
        <p style={styles.hint}>Tap to continue</p>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes rotateIn {
          0% { transform: rotate(-180deg) scale(0.5); opacity: 0; }
          100% { transform: rotate(0deg) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${colors.bgPrimary} 0%, #0F0F1A 100%)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: 20,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    background: colors.gold,
    borderRadius: '50%',
    animation: 'twinkle 2s infinite',
  },
  logoContainer: {
    textAlign: 'center',
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    margin: '0 auto 30px',
    animation: 'rotateIn 2s ease-out',
  },
  title: {
    fontFamily: 'Cinzel, serif',
    fontSize: '2.5rem',
    fontWeight: 700,
    color: colors.gold,
    marginBottom: 10,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: '1rem',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  hint: {
    position: 'absolute',
    bottom: 60,
    color: colors.textSecondary,
    fontSize: '0.85rem',
    animation: 'fadeIn 1s ease',
    cursor: 'pointer',
  },
};

export default SplashScreen;
