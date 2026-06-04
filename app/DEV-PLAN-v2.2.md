# Mystic Zodiac — 开发计划 v2.2

> 更新时间：2026-06-04 20:45
> 本轮目标：去AI化 + UI首屏锁定 + 积分经济重做 + 充值入口显性化

---

## 一、P0 — 当前需求（今日完成）

### 1.1 全界面文案清理 — "去AI化"

**原则**：所有面向用户的文案不出现"AI"、"Artificial Intelligence"、"engine/引擎"等字眼。
底层 DeepSeek API 照常调用，对外包装为神秘学品牌名。

| 位置 | 当前文案 | 改为 |
|------|---------|------|
| Onboarding 后的解读按钮 | "AI Deep Reading (5 Credits)" | "Celestial Reading (5 Credits)" |
| Oracle 页面 Deep Reading 按钮 | "Deep AI Reading (3 Credits)" | "Full Oracle Reading (3 Credits)" |
| Oracle 页面的 AI 深度解读区域 | `#deep-reading-content` / `deep-reading-text` | 保持ID名（底层引用），展示文案改为"Oracle's Vision" |
| Pain Reading 页面 | "The Uncertainty Map" | 保留，但去掉AI标签 |
| 命盘解读区 `ai-badge` | `<span class="ai-badge">AI</span>` | 去掉该标签，不再展示 |
| 文案含"AI-powered" | 命盘解读区域 | 改为 "Guided by the stars" / "Revealed by the celestial map" |
| `ai-engine.js` | 文件名 | 内部保留（对外不可见），入口引用重命名为 `wisdom-engine.js` |

**改动范围**：index.html 中约5-8处文案 + ai-engine.js 映射名

### 1.2 全页面首屏按钮锁定

**原则**：每个 `.screen` 打开时，至少有一个可交互按钮在首屏可见（不滚动）。

**当前状态**：Onboarding 7页面已修（通过 bottom-fixed 容器 + 100dvh）。
**需复查页面**：

| 页面 | 风险 | 处理 |
|------|------|------|
| Chart 主页（命盘） | 页底 Share / Credit 按钮 | 粘到底部 bottom-fixed |
| Oracle 页 | 长文本 + Deep Reading 按钮 | 按钮粘底 |
| Chapter Detail 页 | 长解读文本 + 底部导航 | 按钮粘底 |
| Bond / Soulmate 页 | 特征标签 + 底部操作 | 按钮粘底 |
| Compatibility 页 | 输入+结果+分享 | 按钮粘底 |
| Pain Reading 页 | 长解读文本 | 按钮粘底 |

**测试目标**：iPhone SE（宽375pt）和 iPhone 14 Pro Max（宽430pt）

### 1.3 积分经济模型重构

#### 免费获取（大幅收紧）

| 方式 | 原 | 改为 | 理由 |
|------|-----|------|------|
| 注册赠送 | 15点 | **8点** | 够体验核心功能，不足以开完 |
| 每日签到 | 2点 | **1点** | 纯登录，不验证 |
| 分享奖励 | 无 | **+1点/次**（日限1次） | 意思意思，不依赖 |

**注册首日**：8 + 1 = 9点

#### 日常高频功能（让用户每天想打开）

| 功能 | 消耗 | 定位 |
|------|------|------|
| 🌅 Daily Whisper（每日星语） | **免费** | 每天早上推送一条个性化短签，0门槛打开App |
| 🎴 Card of the Day（今日星曜启示） | **1点** | 每天一张星曜卡（插画+吉凶指引），收藏欲+随机感 |
| 📜 Today's Guidance（今日宜忌） | **免费** | 纯算法，出门前查今天适合做什么/避开什么 |

**每天固定消耗**：1点（仅Card of the Day）

#### 深度功能

| 功能 | 消耗 | 说明 |
|------|------|------|
| Full Chart Reading（命盘全解） | **8点**（首次）→ **12点**（恢复） |
| Soulmate Deep Dive（关系深度） | **6点** |
| Monthly Guide（月运趋势） | **10点** |
| Past Life Insight（前世回响） | **4点** |
| Chapters 深度解读 | **1点/章**（共12章） |

#### 新用户经济测算

| 时间线 | 积分变化 | 状态 |
|--------|---------|------|
| Day 1 注册 | +8签到+1=9点 | 体验Card of the Day(1点)+Full Chart首次(8点)→0点 |
| Day 2-7 | 每天+1签到=1点 | 每天抽Card of the Day(1点)→收支平衡 |
| 想开Soulmate/Chapters | 缺6-12点 | → 引导充值 |
| Day 5-7习惯养成后 | 签到1点不够用了 | → 自然转化订阅($3.99/月) |

#### 充值定价（不变）

| 套餐 | 价格 | 点数 | 够用多久 |
|------|------|------|---------|
| Starter | $1.99 / 30点 | 30天日常+偶尔深度 |
| Popular | $4.99 / 100点 | ~3个月 |
| Premium | $9.99 / 250点 | ~大半年 |
| Monthly Pass | $3.99/月 | 每日功能不限次 |

### 1.4 充值入口显性化

| 位置 | 改动 |
|------|------|
| 顶部导航栏 Credit Badge | 点击弹出充值Modal（已有逻辑，保留）|
| Chart 主页 | 加 "Get Credits" 快捷入口，半透明金线按钮 |
| Oracle 页面 | 积分不足时 "Get Credits" 按钮紧跟在操作按钮旁 |
| 所有积分不足弹窗 | 友好引导 + 一键跳转充值 |

---

## 二、P1 — 本周完善

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P1 | 新增 Card of the Day 功能 | 每日星曜抽卡，插画风格+吉凶指引，1点/次 |
| P1 | 新增 Full Chart Reading 详细面板 | 8-12点，完整命盘全解（工作/财运/感情/健康）|
| P1 | 新增 Soulmate Deep Dive | 6点，关系配对详细报告 |
| P1 | Daily Whisper 推送文案完善 | 免费，每天早上不同 |
| P1 | Today's Guidance 算法完善 | 免费，五行生克算宜忌 |

---

## 三、P2 — 生产前

| 任务 | 说明 |
|------|------|
| API Key 隐藏 | 移到 Supabase Edge Function |
| 隐私政策 + Terms | 英文版 |
| Google Play 素材 | Icon、截图、描述 |

---

## 四、技术实现备注

### Card of the Day 数据结构

```javascript
const CARD_OF_DAY = {
  // 22张主星曜卡，每天随机1张（用日期seed保证一天不变）
  cards: [
    { id: 'purple_star', name: 'Purple Star', element: 'Fire', 
      fortune: 'great', meaning: 'Leadership beckons today...',
      advice: 'Take the lead in a situation you've been avoiding.',
      color: '#8B5CF6' },
    // ... 共22张
  ],
  getTodayCard() {
    const seed = dateToSeed(new Date());
    return this.cards[seed % this.cards.length];
  }
};
```

### 积分常量更新

```javascript
CREDIT_COST_CARD_OF_DAY: 1,    // 新增
CREDIT_COST_FULL_CHART: 12,     // 原CREDIT_COST_CHART_READING: 5 → 12
CREDIT_COST_SOULMATE: 6,       // 原CREDIT_COST_SOULMATE: 4 → 6
CREDIT_COST_MONTHLY_GUIDE: 10, // 新增
CREDIT_COST_PAST_LIFE: 4,      // 新增
CREDIT_DAILY_SIGNIN: 1,        // 原2→1
CREDIT_SHARE_BONUS: 1,         // 新增
CREDIT_NEW_USER: 8,            // 原15→8
```

### 文件改动清单

| 文件 | 改动内容 |
|------|---------|
| `app/index.html` | 文案清理、CSS底部固定、新增Card of the Day UI、充值入口 |
| `app/app-config.js` | 积分常量更新 |
| `app/payment-module.js` | 签到/分享积分逻辑更新 |
| `app/ai-engine.js` → `wisdom-engine.js` | 文件名映射（对外引用同步更新）|

*本计划对应GitHub仓库 `Vanan2026/MysticZodiac`*
