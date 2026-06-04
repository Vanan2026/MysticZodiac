/**
 * Tab Navigation Component
 */

import React from 'react';
import { colors } from '../utils/theme';

interface TabNavigationProps {
  activeTab: 'chart' | 'oracle' | 'iching';
  onTabChange: (tab: 'chart' | 'oracle' | 'iching') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'chart' as const, icon: '✦', label: 'Chart' },
    { id: 'oracle' as const, icon: '🔮', label: 'Oracle' },
    { id: 'iching' as const, icon: '☯️', label: 'I Ching' },
  ];

  return (
    <nav style={styles.tabNav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={{
            ...styles.tabBtn,
            ...(activeTab === tab.id ? styles.tabBtnActive : {}),
          }}
          onClick={() => onTabChange(tab.id)}
        >
          <span style={styles.tabIcon}>{tab.icon}</span>
          <span style={styles.tabLabel}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  tabNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    background: colors.bgCard,
    borderTop: `1px solid rgba(201, 169, 110, 0.2)`,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    zIndex: 50,
  },
  tabBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    color: colors.textSecondary,
    fontSize: '0.75rem',
    cursor: 'pointer',
    padding: '8px 16px',
    transition: 'color 0.2s',
  },
  tabBtnActive: {
    color: colors.gold,
  },
  tabIcon: {
    fontSize: '1.4rem',
  },
  tabLabel: {},
};

export default TabNavigation;
