# Mystic Zodiac - Eastern Wisdom App

A beautiful React Native-style application for Eastern astrology (紫微斗数), built with React and TypeScript.

## Features

- **Splash Screen**: Animated Yin-Yang logo with star background
- **Birth Input**: Date picker, hour selector with zodiac animals, gender toggle
- **Birth Chart (命盘)**: 4×4 grid displaying 12 palaces with main stars and transformations
- **Daily Oracle (每日运势)**: Fortune readings based on your birth chart
- **I Ching (易经)**: Hexagram casting and interpretation
- **Credit System**: Demo credit system for AI features

## Tech Stack

- React 19 + TypeScript
- Vite for fast development
- CSS-in-JS styling
- Ziwei Dou Shu algorithm (pure TypeScript)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
app/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── TabNavigation.tsx
│   ├── screens/          # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── InputScreen.tsx
│   │   ├── ChartScreen.tsx
│   │   ├── OracleScreen.tsx
│   │   └── IChingScreen.tsx
│   ├── store/            # State management
│   │   └── useStore.ts
│   ├── utils/            # Utilities and algorithms
│   │   ├── ziwei.ts      # Ziwei Dou Shu algorithm
│   │   └── theme.ts      # Theme constants
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── ziwei.js              # Standalone JS version for web
└── index.html            # Standalone web demo
```

## Design System

### Colors
- Primary Background: `#0A0A0F` (Deep night sky black)
- Card Background: `#14141F` (Subtle blue-black)
- Primary Text: `#E8E4DF` (Warm white)
- Gold Accent: `#C9A96E` (Antique gold)
- Purple: `#8B5CF6` (Ziwei purple)

### Si Hua Colors
- 化禄 (Lu): `#5B8C5A` (Green)
- 化权 (Quan): `#C45B3E` (Red)
- 化科 (Ke): `#4A7B9D` (Blue)
- 化忌 (Ji): `#8B2252` (Dark red)

## Standalone Demo

For quick testing, you can open `index.html` directly in a browser - it includes all functionality in a single file without any build step.

## Future Enhancements

- [ ] React Native version for iOS/Android
- [ ] Supabase integration for user data
- [ ] DeepSeek AI API integration
- [ ] Share card generation
- [ ] Relationship compatibility feature
- [ ] Push notifications for daily oracle
- [ ] In-app purchases for credits

## License

MIT
