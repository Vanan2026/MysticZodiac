/**
 * Input Screen Component
 * Birth information input form
 */

import React, { useState } from 'react';
import { colors } from '../utils/theme';
import { calculateBirthChart, BirthChart } from '../utils/ziwei';

interface InputScreenProps {
  onReveal: (chart: BirthChart) => void;
}

const hourOptions = [
  { hour: 23, name: 'Rat', time: '23:00-01:00', emoji: '🐀' },
  { hour: 1, name: 'Ox', time: '01:00-03:00', emoji: '🐂' },
  { hour: 3, name: 'Tiger', time: '03:00-05:00', emoji: '🐅' },
  { hour: 5, name: 'Rabbit', time: '05:00-07:00', emoji: '🐇' },
  { hour: 7, name: 'Dragon', time: '07:00-09:00', emoji: '🐉' },
  { hour: 9, name: 'Snake', time: '09:00-11:00', emoji: '🐍' },
  { hour: 11, name: 'Horse', time: '11:00-13:00', emoji: '🐎' },
  { hour: 13, name: 'Goat', time: '13:00-15:00', emoji: '🐐' },
  { hour: 15, name: 'Monkey', time: '15:00-17:00', emoji: '🐒' },
  { hour: 17, name: 'Rooster', time: '17:00-19:00', emoji: '🐓' },
  { hour: 19, name: 'Dog', time: '19:00-21:00', emoji: '🐕' },
  { hour: 21, name: 'Boar', time: '21:00-23:00', emoji: '🐗' },
];

const InputScreen: React.FC<InputScreenProps> = ({ onReveal }) => {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(15);
  const [selectedHour, setSelectedHour] = useState(11);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleReveal = () => {
    const chart = calculateBirthChart({
      year,
      month,
      day,
      hour: selectedHour,
      gender,
    });
    onReveal(chart);
  };

  const years = Array.from({ length: 76 }, (_, i) => 2025 - i);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Cast Your Chart</h1>
        <p style={styles.subtitle}>Enter your birth information</p>
      </div>

      {/* Date Picker */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Birth Date</label>
        <div style={styles.datePicker}>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={styles.select}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={styles.select}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            style={styles.select}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hour Selector */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Birth Hour</label>
        <div style={styles.hourGrid}>
          {hourOptions.map((opt) => (
            <div
              key={opt.hour}
              style={{
                ...styles.hourOption,
                ...(selectedHour === opt.hour ? styles.hourOptionSelected : {}),
              }}
              onClick={() => setSelectedHour(opt.hour)}
            >
              <span style={styles.hourEmoji}>{opt.emoji}</span>
              <span style={styles.hourName}>The Hour of the {opt.name}</span>
              <span style={styles.hourTime}>{opt.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Toggle */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Gender</label>
        <div style={styles.genderToggle}>
          <button
            style={{
              ...styles.genderBtn,
              ...(gender === 'male' ? styles.genderBtnSelected : {}),
            }}
            onClick={() => setGender('male')}
          >
            <span style={styles.genderIcon}>♂</span>
            <span>Male</span>
          </button>
          <button
            style={{
              ...styles.genderBtn,
              ...(gender === 'female' ? styles.genderBtnSelected : {}),
            }}
            onClick={() => setGender('female')}
          >
            <span style={styles.genderIcon}>♀</span>
            <span>Female</span>
          </button>
        </div>
      </div>

      {/* Reveal Button */}
      <button style={styles.revealBtn} onClick={handleReveal}>
        Reveal My Chart
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '40px 20px 20px',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Cinzel, serif',
    fontSize: '1.8rem',
    color: colors.gold,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: '0.95rem',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  datePicker: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 10,
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    background: colors.bgCard,
    border: `1px solid ${colors.goldDim}`,
    borderRadius: 8,
    color: colors.textPrimary,
    fontSize: '1rem',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='${encodeURIComponent(colors.gold)}' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  },
  hourGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  hourOption: {
    padding: '12px 14px',
    background: colors.bgCard,
    border: `1px solid ${colors.goldDim}`,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  hourOptionSelected: {
    borderColor: colors.gold,
    background: 'rgba(201, 169, 110, 0.15)',
  },
  hourEmoji: {
    fontSize: '1.4rem',
    display: 'block',
    marginBottom: 4,
  },
  hourName: {
    display: 'block',
    color: colors.textPrimary,
    fontWeight: 500,
    fontSize: '0.85rem',
  },
  hourTime: {
    display: 'block',
    color: colors.textSecondary,
    fontSize: '0.75rem',
    marginTop: 2,
  },
  genderToggle: {
    display: 'flex',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    padding: 14,
    background: colors.bgCard,
    border: `1px solid ${colors.goldDim}`,
    borderRadius: 8,
    color: colors.textPrimary,
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  genderBtnSelected: {
    borderColor: colors.gold,
    background: 'rgba(201, 169, 110, 0.15)',
  },
  genderIcon: {
    fontSize: '1.5rem',
  },
  revealBtn: {
    width: '100%',
    padding: 18,
    background: 'transparent',
    border: `2px solid ${colors.gold}`,
    borderRadius: 12,
    color: colors.gold,
    fontFamily: 'Cinzel, serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 30,
    transition: 'all 0.3s',
    letterSpacing: 2,
  },
};

export default InputScreen;
