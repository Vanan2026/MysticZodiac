/**
 * Chart Screen Component
 * Main birth chart display
 */

import React, { useState } from 'react';
import { colors } from '../utils/theme';
import { BirthChart, STAR_SYMBOLS, STAR_NAMES_EN, PALACE_NAMES_EN } from '../utils/ziwei';

interface ChartScreenProps {
  chart: BirthChart;
  credits: number;
  onBack: () => void;
}

const ChartScreen: React.FC<ChartScreenProps> = ({ chart, credits, onBack }) => {
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);

  const mainStarName = STAR_NAMES_EN[chart.mingGongMainStar] || chart.mingGongMainStar;
  const mainStarSymbol = STAR_SYMBOLS[chart.mingGongMainStar] || '✨';

  // Define the 4x4 grid layout
  const gridCells = [
    // Row 0: 巳午未申 (branch 5,6,7,8)
    { branchIndex: 5 },
    { branchIndex: 6 },
    { branchIndex: 7 },
    { branchIndex: 8 },
    // Row 1: 辰空空酉 (branch 4, empty, empty, 9)
    { branchIndex: 4 },
    { isCenter: true },
    { isCenter: true },
    { branchIndex: 9 },
    // Row 2: 卯寅丑子 (branch 3,2,1,0)
    { branchIndex: 3 },
    { branchIndex: 2 },
    { branchIndex: 1 },
    { branchIndex: 0 },
    // Row 3: 田宅福德父母空
    { extraPalace: '田宅宫', palaceIndex: 9 },
    { extraPalace: '福德宫', palaceIndex: 10 },
    { extraPalace: '父母宫', palaceIndex: 11 },
    { isCenter: true },
  ];

  const getPalaceForCell = (cell: typeof gridCells[0]) => {
    if (cell.branchIndex !== undefined) {
      return chart.palaces.find(p => p.palaceIndex === cell.branchIndex);
    }
    if (cell.palaceIndex !== undefined) {
      return chart.palaces.find(p => p.palaceIndex === cell.palaceIndex);
    }
    return null;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div style={styles.creditBadge}>
          <span style={styles.creditIcon}>◆</span>
          <span>{credits}</span>
        </div>
      </div>

      {/* Bureau Info */}
      <div style={styles.bureauInfo}>
        <h3 style={styles.bureauName}>{chart.fiveElementBureau}</h3>
        <p style={styles.mainStar}>
          {mainStarSymbol} {mainStarName}
        </p>
      </div>

      {/* Si Hua Legend */}
      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: colors.huaLu }}></span>
          Lu
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: colors.huaQuan }}></span>
          Quan
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: colors.huaKe }}></span>
          Ke
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: colors.huaJi }}></span>
          Ji
        </span>
      </div>

      {/* Palace Grid */}
      <div style={styles.palaceGrid}>
        {gridCells.map((cell, idx) => {
          const palace = getPalaceForCell(cell);
          
          return (
            <div
              key={idx}
              style={{
                ...styles.palaceCell,
                ...(cell.isCenter ? styles.palaceCellCenter : {}),
              }}
              onClick={() => palace && setSelectedPalace(palace.palaceIndex)}
            >
              {cell.isCenter ? (
                <span style={styles.centerSymbol}>✦</span>
              ) : palace ? (
                <>
                  <span style={styles.palaceAnimal}>{palace.branchAnimal}</span>
                  <span style={styles.palaceName}>{palace.palaceNameEn}</span>
                  <span style={styles.palaceStars}>
                    {palace.mainStars.slice(0, 2).map(s => STAR_SYMBOLS[s]).join(' ') || '-'}
                  </span>
                  {(palace.siHua.lu || palace.siHua.quan || palace.siHua.ke || palace.siHua.ji) && (
                    <div style={styles.sihuaMarks}>
                      {palace.siHua.lu && <span style={{ ...styles.sihuaMark, background: colors.huaLu }}>禄</span>}
                      {palace.siHua.quan && <span style={{ ...styles.sihuaMark, background: colors.huaQuan }}>权</span>}
                      {palace.siHua.ke && <span style={{ ...styles.sihuaMark, background: colors.huaKe }}>科</span>}
                      {palace.siHua.ji && <span style={{ ...styles.sihuaMark, background: colors.huaJi }}>忌</span>}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Palace Detail Modal */}
      {selectedPalace !== null && (
        <div style={styles.modalOverlay} onClick={() => setSelectedPalace(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {chart.palaces[selectedPalace]?.branchAnimal}{' '}
                {chart.palaces[selectedPalace]?.palaceName}
              </h3>
              <button style={styles.modalClose} onClick={() => setSelectedPalace(null)}>×</button>
            </div>
            
            <div style={styles.modalSection}>
              <span style={styles.modalLabel}>Stem / Branch</span>
              <span style={styles.modalValue}>
                {chart.palaces[selectedPalace]?.stem}
                {chart.palaces[selectedPalace]?.branch}
              </span>
            </div>
            
            <div style={styles.modalSection}>
              <span style={styles.modalLabel}>Main Stars</span>
              <div style={styles.starsList}>
                {chart.palaces[selectedPalace]?.mainStars.map(star => (
                  <span key={star} style={styles.starBadge}>
                    <span>{STAR_SYMBOLS[star]}</span>
                    {star}
                  </span>
                )) || <span style={styles.modalValue}>No main stars</span>}
              </div>
            </div>
            
            <div style={styles.modalSection}>
              <span style={styles.modalLabel}>Assistant Stars</span>
              <div style={styles.starsList}>
                {chart.palaces[selectedPalace]?.assistantStars.map(star => (
                  <span key={star} style={styles.starBadge}>
                    <span>{STAR_SYMBOLS[star]}</span>
                    {star}
                  </span>
                )) || <span style={styles.modalValue}>No assistant stars</span>}
              </div>
            </div>
            
            <div style={styles.modalSection}>
              <span style={styles.modalLabel}>Four Transformations</span>
              <div style={styles.sihuaList}>
                {chart.palaces[selectedPalace]?.siHua.lu && (
                  <span style={{ ...styles.sihuaBadge, background: colors.huaLu }}>
                    化禄: {chart.palaces[selectedPalace]?.siHua.lu}
                  </span>
                )}
                {chart.palaces[selectedPalace]?.siHua.quan && (
                  <span style={{ ...styles.sihuaBadge, background: colors.huaQuan }}>
                    化权: {chart.palaces[selectedPalace]?.siHua.quan}
                  </span>
                )}
                {chart.palaces[selectedPalace]?.siHua.ke && (
                  <span style={{ ...styles.sihuaBadge, background: colors.huaKe }}>
                    化科: {chart.palaces[selectedPalace]?.siHua.ke}
                  </span>
                )}
                {chart.palaces[selectedPalace]?.siHua.ji && (
                  <span style={{ ...styles.sihuaBadge, background: colors.huaJi }}>
                    化忌: {chart.palaces[selectedPalace]?.siHua.ji}
                  </span>
                )}
                {!chart.palaces[selectedPalace]?.siHua.lu && 
                 !chart.palaces[selectedPalace]?.siHua.quan && 
                 !chart.palaces[selectedPalace]?.siHua.ke && 
                 !chart.palaces[selectedPalace]?.siHua.ji && (
                  <span style={styles.modalValue}>None</span>
                )}
              </div>
            </div>
          </div>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottom: `1px solid rgba(201, 169, 110, 0.2)`,
    marginBottom: 20,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: colors.gold,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  creditBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    background: colors.bgCard,
    borderRadius: 20,
    fontSize: '0.9rem',
  },
  creditIcon: {
    color: colors.purple,
  },
  bureauInfo: {
    textAlign: 'center',
    padding: 16,
    background: colors.bgCard,
    borderRadius: 12,
    marginBottom: 20,
    border: `1px solid rgba(201, 169, 110, 0.2)`,
  },
  bureauName: {
    fontSize: '1.1rem',
    color: colors.gold,
    marginBottom: 6,
  },
  mainStar: {
    color: colors.purple,
    fontSize: '0.95rem',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  legendItem: {
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  palaceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 4,
    marginBottom: 20,
  },
  palaceCell: {
    aspectRatio: '1',
    background: colors.bgCard,
    border: `1px solid rgba(201, 169, 110, 0.15)`,
    borderRadius: 6,
    padding: 6,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: 70,
  },
  palaceCellCenter: {
    background: `linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(201, 169, 110, 0.1))`,
    borderColor: `rgba(201, 169, 110, 0.3)`,
  },
  centerSymbol: {
    fontSize: '1.5rem',
    color: colors.gold,
  },
  palaceAnimal: {
    fontSize: '1.5rem',
    marginBottom: 2,
  },
  palaceName: {
    fontSize: '0.65rem',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  palaceStars: {
    fontSize: '0.7rem',
    color: colors.gold,
    marginTop: 4,
  },
  sihuaMarks: {
    display: 'flex',
    gap: 3,
    marginTop: 3,
  },
  sihuaMark: {
    fontSize: '0.65rem',
    padding: '1px 4px',
    borderRadius: 3,
    fontWeight: 600,
    color: 'white',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    background: colors.bgCard,
    border: `1px solid ${colors.gold}`,
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: '1.2rem',
    color: colors.gold,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: colors.textSecondary,
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: '0.75rem',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    display: 'block',
  },
  modalValue: {
    color: colors.textPrimary,
    fontSize: '0.95rem',
  },
  starsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  starBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 12px',
    background: 'rgba(201, 169, 110, 0.15)',
    border: `1px solid ${colors.goldDim}`,
    borderRadius: 20,
    fontSize: '0.85rem',
  },
  sihuaList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  sihuaBadge: {
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: '0.8rem',
    color: 'white',
  },
};

export default ChartScreen;
