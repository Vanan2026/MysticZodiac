/**
 * App Store - Zustand-like state management
 * Simple implementation for React Native Demo
 */

import { BirthChart, DailyFortune, Hexagram } from '../utils/ziwei';

// State interface
export interface AppState {
  credits: number;
  currentChart: BirthChart | null;
  dailyFortune: DailyFortune | null;
  currentHexagram: Hexagram | null;
  selectedDate: { year: number; month: number; day: number };
  selectedHour: number;
  selectedGender: 'male' | 'female';
}

// Initial state
const initialState: AppState = {
  credits: 15,
  currentChart: null,
  dailyFortune: null,
  currentHexagram: null,
  selectedDate: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  },
  selectedHour: 11,
  selectedGender: 'male',
};

// Simple store implementation
class Store {
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();

  constructor() {
    this.state = { ...initialState };
  }

  getState(): AppState {
    return this.state;
  }

  setState(partial: Partial<AppState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Actions
  setCredits(credits: number) {
    this.setState({ credits });
  }

  deductCredits(amount: number): boolean {
    if (this.state.credits >= amount) {
      this.setState({ credits: this.state.credits - amount });
      return true;
    }
    return false;
  }

  setChart(chart: BirthChart) {
    this.setState({ currentChart: chart });
  }

  setDailyFortune(fortune: DailyFortune) {
    this.setState({ dailyFortune: fortune });
  }

  setHexagram(hexagram: Hexagram) {
    this.setState({ currentHexagram: hexagram });
  }

  setSelectedDate(date: { year: number; month: number; day: number }) {
    this.setState({ selectedDate: date });
  }

  setSelectedHour(hour: number) {
    this.setState({ selectedHour: hour });
  }

  setSelectedGender(gender: 'male' | 'female') {
    this.setState({ selectedGender: gender });
  }

  reset() {
    this.state = { ...initialState };
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const store = new Store();
export default store;
