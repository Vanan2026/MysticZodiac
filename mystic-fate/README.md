# Mystic Fate - React Native App

## Prerequisites

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Expo Go (on your phone) for testing

## Setup

```bash
cd mystic-fate
npm install
```

## Run

```bash
npx expo start
```

Scan the QR code with Expo Go (Android/iOS), or press `a` for Android emulator / `i` for iOS simulator.

## Build for Production

```bash
# Android APK
npx eas build --platform android --profile preview

# Android Play Store
npx eas build --platform android --profile production

# iOS (requires Apple Developer account)
npx eas build --platform ios --profile production
```

## Architecture

```
mystic-fate/
├── app/                     # Expo Router pages
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Onboarding (Splash → Pain → Birth → Hour → Gender → Name)
│   ├── auth/login.tsx       # Supabase auth
│   ├── reading/[id].tsx     # AI reading detail
│   └── (tabs)/
│       ├── _layout.tsx      # Bottom tab navigation
│       ├── index.tsx        # Chart screen (ZiWei visualization)
│       ├── oracle.tsx       # Oracle reading cards
│       ├── history.tsx      # Reading history
│       └── profile.tsx      # Profile & credits
├── src/
│   ├── components/Chart/    # SVG ZiWei chart
│   ├── constants/           # Theme + config
│   ├── services/            # AI, Supabase, chart services
│   └── utils/ziwei/         # ZiWei calculation engine
├── app.json
├── tsconfig.json
└── package.json
```

## Supabase Configuration

Credentials are already set in `src/constants/config.ts`:

- **Project URL**: `https://tgggebljhvpxgaehsnvq.supabase.co`
- **Edge Function**: `deepseek-proxy` (for DeepSeek API calls)

### Required Tables

Create these tables in Supabase SQL Editor:

```sql
-- Users profile
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  birth_date DATE,
  birth_hour INTEGER,
  gender TEXT,
  pain_points TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credits
CREATE TABLE credits (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  balance INTEGER DEFAULT 8,
  total_earned INTEGER DEFAULT 8,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chart cache
CREATE TABLE chart_cache (
  user_id UUID REFERENCES auth.users NOT NULL,
  birth_date DATE NOT NULL,
  birth_hour INTEGER NOT NULL,
  chart_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

-- Reading history
CREATE TABLE readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  credits_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own credits" ON credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own chart" ON chart_cache FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
```

## DeepSeek API

API calls go through Supabase Edge Function proxy (`deepseek-proxy`), already deployed.
No API key exposure on client side.

## Credits Economy

| Action | Cost/Earn |
|--------|-----------|
| New user | +8 credits |
| Daily sign-in | +1 credit |
| Share app | +1 credit/day |
| Card of the Day | -1 credit |
| Past Life | -4 credits |
| Soulmate Portrait | -6 credits |
| Monthly Guide | -10 credits |
| Full Chart Reading | -12 credits |

## IAP Products (RevenueCat)

| Product | Price | Credits |
|---------|-------|---------|
| Credits 30 | $1.99 | 30 |
| Credits 80 | $4.99 | 80 |
| Credits 250 | $9.99 | 250 |
| Pro Monthly | $14.99 | Unlimited |
| Pro Yearly | $99.99 | Unlimited |
