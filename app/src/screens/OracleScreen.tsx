/**
 * Oracle Screen Component
 * Daily fortune display
 */

import React, { useEffect, useState } from 'react';
import { colors } from '../utils/theme';
import { BirthChart, DailyFortune, calculateDailyFortune } from '../utils/ziwei';

interface OracleScreenProps {
  chart: BirthChart;
  credits: number;
  onDeductCredit: (amount: number) => boolean;
  onBack: () => void;
}

const OracleScreen: React.FC<OracleScreenProps> = ({ chart, credits, onDeductCredit, onBack }) => {
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const today = new Date();
    const fortuneData = calculateDailyFortune(chart, {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    });
    setFortune(fortuneData);
  }, [chart]);

  const handleDeepReading = () => {
    if (credits < 3) {
      alert('Not enough credits! Please purchase more.');
      return;
    }
    
    setIsGenerating(true);
    setTimeout(() => {
      const success = onDeductCredit(3);
      if (success) {
        alert('✨ Deep Reading generated! (Demo mode - AI integration pending)');
      }
      setIsGenerating(false);
    }, 2000);
  };

  if (!fortune) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
      </div>

      {/* Oracle Header */}
      <div style={styles.oracleHeader}>
        <h2 style={styles.oracleTitle}>Your Daily Oracle</h2>
        <div style={styles.dateDisplay}>
          <span style={styles.oracleDate}>{dateStr}</span>
          <div style={styles.stemBranch}>
            <span>{fortune.dayStem}</span>
            <span>{fortune.dayBranch}</span>
          </div>
        </div>
      </div>

      {/* Fortune Cards */}
      <div style={styles.fortuneCards}>
        <FortuneCard title="Overall" score={fortune.overallScore} color={colors.gold} />
        <FortuneCard title="Love" score={fortune.loveScore} color="#E91E63" />
        <FortuneCard title="Career" score={fortune.careerScore} color="#2196F3" />
        <FortuneCard title="Health" score={fortune.healthScore} color="#4CAF50" />
      </div>

      {/* Lucky Section */}
      <div style={styles.luckySection}>
        <h3 style={styles.luckyTitle}>✨ Lucky Elements</h3>
        <div style={styles.luckyGrid}>
          <div style={styles.luckyItem}>
            <span style={styles.luckyLabel}>Element</span>
            <span style={styles.luckyValue}>{fortune.luckyElements[0]}</span>
          </div>
          <div style={styles.luckyItem}>
            <span style={styles.luckyLabel}>Direction</span>
            <span style={styles.luckyValue}>{fortune.luckyDirection}</span>
          </div>
          <div style={styles.luckyItem}>
            <span style={styles.luckyLabel}>Favorable</span>
            <span style={styles.luckyValue}>{fortune.favorable[0]}</span>
          </div>
          <div style={styles.luckyItem}>
            <span style={styles.luckyLabel}>Avoid</span>
            <span style={styles.luckyValue}>{fortune.avoid[0]}</span>
          </div>
        </div>
      </div>

      {/* Deep Reading Button */}
      <button style={styles.deepReadingBtn} onClick={handleDeepReading} disabled={isGenerating}>
        {isGenerating ? 'Processing...' : 'Deep Reading'}
        <span style={styles.cost}>◆ 3 Credits</span>
      </button>
    </div>
  );
};

interface FortuneCardProps {
  title: string;
  score: number;
  color: string;
}

const FortuneCard: React.FC<FortuneCardProps> = ({ title, score, color }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={styles.fortuneCard}>
      <h4 style={styles.fortuneCardTitle}>{title}</h4>
      <div style={styles.fortuneBar}>
        <div
          style={{
            ...styles.fortuneBarFill,
            width: `${displayScore}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />
      </div>
      <span style={styles.fortuneScore}>{displayScore}%</span>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px 20px 80px',
    minHeight: '100vh',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    color: colors.textSecondary,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: colors.gold,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  oracleHeader: {
    textAlign: 'center',
    padding: 20,
    background: colors.bgCard,
    borderRadius: 16,
    marginBottom: 20,
    border: `1px solid rgba(201, 169, 110, 0.2)`,
  },
  oracleTitle: {
    fontFamily: 'Cinzel, serif',
    fontSize: '1.4rem',
    color: colors.gold,
    marginBottom: 12,
  },
  dateDisplay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    color: colors.textSecondary,
  },
  oracleDate: {
    color: colors.textSecondary,
  },
  stemBranch: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '1.1rem',
    color: colors.gold,
  },
  fortuneCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  fortuneCard: {
    background: colors.bgCard,
    border: `1px solid rgba(201, 169, 110, 0.15)`,
    borderRadius: 12,
    padding: 16,
  },
  fortuneCardTitle: {
    fontSize: '0.8rem',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  fortuneBar: {
    height: 8,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  fortuneBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 1s ease',
  },
  fortuneScore: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: colors.textPrimary,
  },
  luckySection: {
    background: colors.bgCard,
    border: `1px solid rgba(201, 169, 110, 0.15)`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  luckyTitle: {
    fontFamily: 'Cinzel, serif',
    fontSize: '1rem',
    color: colors.gold,
    marginBottom: 16,
  },
  luckyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  luckyItem: {
    textAlign: 'center',
    padding: 12,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  luckyLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  luckyValue: {
    fontSize: '1rem',
    color: colors.textPrimary,
  },
  deepReadingBtn: {
    width: '100%',
    padding: 16,
    background: colors.purple,
    border: 'none',
    borderRadius: 12,
    color: 'white',
    fontFamily: 'Cinzel, serif',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  cost: {
    display: 'block',
    fontSize: '0.75rem',
    opacity: 0.8,
    marginTop: 4,
  },
};

export default OracleScreen;
