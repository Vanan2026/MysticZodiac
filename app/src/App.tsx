/**
 * Mystic Zodiac - Main App Component
 * React Native Web Version
 */

import React, { useState, useCallback } from 'react';
import { colors } from './utils/theme';
import { BirthChart } from './utils/ziwei';
import SplashScreen from './screens/SplashScreen';
import InputScreen from './screens/InputScreen';
import ChartScreen from './screens/ChartScreen';
import OracleScreen from './screens/OracleScreen';
import IChingScreen from './screens/IChingScreen';
import TabNavigation from './components/TabNavigation';

type Screen = 'splash' | 'input' | 'chart' | 'oracle' | 'iching';
type Tab = 'chart' | 'oracle' | 'iching';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('chart');
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [credits, setCredits] = useState(15);

  const handleSplashComplete = useCallback(() => {
    setCurrentScreen('input');
  }, []);

  const handleReveal = useCallback((newChart: BirthChart) => {
    setChart(newChart);
    setCurrentScreen('chart');
    setActiveTab('chart');
  }, []);

  const handleDeductCredit = useCallback((amount: number): boolean => {
    if (credits >= amount) {
      setCredits((prev) => prev - amount);
      return true;
    }
    return false;
  }, [credits]);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setCurrentScreen(tab);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('input');
  }, []);

  // Splash Screen
  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Input Screen
  if (currentScreen === 'input') {
    return (
      <div style={styles.appContainer}>
        <InputScreen onReveal={handleReveal} />
      </div>
    );
  }

  // Main screens with tab navigation
  return (
    <div style={styles.appContainer}>
      {currentScreen === 'chart' && chart && (
        <ChartScreen
          chart={chart}
          credits={credits}
          onBack={handleBack}
        />
      )}
      {currentScreen === 'oracle' && chart && (
        <OracleScreen
          chart={chart}
          credits={credits}
          onDeductCredit={handleDeductCredit}
          onBack={handleBack}
        />
      )}
      {currentScreen === 'iching' && (
        <IChingScreen
          credits={credits}
          onDeductCredit={handleDeductCredit}
          onBack={handleBack}
        />
      )}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    minHeight: '100vh',
    background: colors.bgPrimary,
    color: colors.textPrimary,
  },
};

export default App;
