/**
 * I Ching Screen Component
 * Hexagram casting and interpretation
 */

import React, { useState } from 'react';
import { colors } from '../utils/theme';
import { Hexagram, generateHexagram } from '../utils/ziwei';

interface IChingScreenProps {
  credits: number;
  onDeductCredit: (amount: number) => boolean;
  onBack: () => void;
}

const IChingScreen: React.FC<IChingScreenProps> = ({ credits, onDeductCredit, onBack }) => {
  const [question, setQuestion] = useState('');
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleCast = () => {
    if (!question.trim()) {
      alert('Please enter a question first');
      return;
    }

    setIsCasting(true);
    setTimeout(() => {
      const result = generateHexagram(question);
      setHexagram(result);
      setIsCasting(false);
    }, 1500);
  };

  const handleAIInterpretation = () => {
    if (credits < 4) {
      alert('Not enough credits! Please purchase more.');
      return;
    }

    setIsGeneratingAI(true);
    setTimeout(() => {
      const success = onDeductCredit(4);
      if (success && hexagram) {
        setHexagram({
          ...hexagram,
          interpretation: hexagram.interpretation + 
            '\n\n✨ AI Insight: Based on your question and the hexagram revealed, focus on maintaining balance between ambition and patience. The wisdom lies in understanding that true progress comes from inner harmony and recognizing the cyclical nature of life.'
        });
      }
      setIsGeneratingAI(false);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
      </div>

      {/* I Ching Header */}
      <div style={styles.ichingHeader}>
        <h2 style={styles.ichingTitle}>I Ching Oracle</h2>
        <p style={styles.ichingSubtitle}>Ask a question and cast the coins</p>
      </div>

      {/* Question Input */}
      <textarea
        style={styles.questionInput}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What would you like to know?"
        rows={4}
      />

      {/* Cast Button */}
      <button
        style={{
          ...styles.castBtn,
          ...(isCasting ? styles.castBtnDisabled : {}),
        }}
        onClick={handleCast}
        disabled={isCasting}
      >
        {isCasting ? 'Casting...' : '🪙 Cast the Coins'}
      </button>

      {/* Hexagram Result */}
      {hexagram && (
        <div style={styles.hexagramResult}>
          {/* Hexagram Visual */}
          <div style={styles.hexagramVisual}>
            <div style={styles.hexagramLines}>
              {[...hexagram.lines].reverse().map((line, i) => (
                <div key={i} style={styles.hexagramLine}>
                  <div
                    style={{
                      ...styles.yaoLine,
                      ...(line === '0' ? styles.yaoLineBroken : {}),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hexagram Info */}
          <h3 style={styles.hexagramName}>{hexagram.name}</h3>
          <p style={styles.hexagramMeaning}>{hexagram.meaning}</p>

          {/* Interpretation */}
          <div style={styles.hexagramInterpretation}>
            {hexagram.interpretation}
          </div>

          {/* AI Button */}
          <button
            style={{
              ...styles.ichingAIBtn,
              ...(isGeneratingAI ? styles.ichingAIBtnDisabled : {}),
            }}
            onClick={handleAIInterpretation}
            disabled={isGeneratingAI}
          >
            {isGeneratingAI ? 'Processing...' : 'Get AI Interpretation'}
            <span style={styles.cost}>◆ 4 Credits</span>
          </button>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px 20px 80px',
    minHeight: '100vh',
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
  ichingHeader: {
    textAlign: 'center',
    padding: 20,
    background: colors.bgCard,
    borderRadius: 16,
    marginBottom: 20,
    border: `1px solid rgba(201, 169, 110, 0.2)`,
  },
  ichingTitle: {
    fontFamily: 'Cinzel, serif',
    fontSize: '1.4rem',
    color: colors.gold,
    marginBottom: 8,
  },
  ichingSubtitle: {
    color: colors.textSecondary,
    fontSize: '0.9rem',
  },
  questionInput: {
    width: '100%',
    padding: 16,
    background: colors.bgCard,
    border: `1px solid ${colors.goldDim}`,
    borderRadius: 12,
    color: colors.textPrimary,
    fontSize: '1rem',
    resize: 'none',
    minHeight: 100,
    marginBottom: 16,
    fontFamily: 'inherit',
  },
  castBtn: {
    width: '100%',
    padding: 18,
    background: 'transparent',
    border: `2px solid ${colors.gold}`,
    borderRadius: 12,
    color: colors.gold,
    fontFamily: 'Cinzel, serif',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginBottom: 30,
    transition: 'all 0.3s',
  },
  castBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  hexagramResult: {
    background: colors.bgCard,
    border: `1px solid rgba(201, 169, 110, 0.2)`,
    borderRadius: 16,
    padding: 24,
    textAlign: 'center',
  },
  hexagramVisual: {
    marginBottom: 20,
  },
  hexagramLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  hexagramLine: {
    display: 'flex',
    gap: 8,
  },
  yaoLine: {
    width: 40,
    height: 8,
    background: colors.gold,
    borderRadius: 4,
  },
  yaoLineBroken: {
    background: 'transparent',
    border: `2px solid ${colors.gold}`,
    height: 4,
  },
  hexagramName: {
    fontFamily: 'Cinzel, serif',
    fontSize: '1.4rem',
    color: colors.gold,
    marginBottom: 8,
  },
  hexagramMeaning: {
    color: colors.textSecondary,
    fontSize: '0.9rem',
    marginBottom: 20,
  },
  hexagramInterpretation: {
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 16,
    textAlign: 'left',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    marginBottom: 20,
    color: colors.textPrimary,
  },
  ichingAIBtn: {
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
  ichingAIBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  cost: {
    display: 'block',
    fontSize: '0.75rem',
    opacity: 0.8,
    marginTop: 4,
  },
};

export default IChingScreen;
