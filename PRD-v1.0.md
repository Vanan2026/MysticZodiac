# Mystic Zodiac — 产品设计文档 v1.0

## 一、产品概览

### 产品名
**Mystic Zodiac: Eastern Wisdom**（暂定，备选：Aura of the East / Oracle Bamboo / Zenith Zodiac）

### 一句话定位
Discover your cosmic identity through 5,000 years of Eastern wisdom — not fortune-telling, but self-discovery.

### 目标用户
- 18-35岁英语用户，女性偏多（占星App典型用户70%+为女性）
- 对星座/性格测试/自我探索感兴趣
- 觉得Western Zodiac太普通，想要"更神秘更独特"的体验
- TikTok/Instagram重度用户，喜欢分享人格测试结果

### 核心差异化
- **东方神秘感**：Chinese Zodiac + Five Elements + Yin Yang，市面上几乎没有
- **极简高级感**：水墨+留白+金线，不是大红大绿
- **AI深度解读**：每次分析都是独特的，不是套模板
- **社交裂变**：精美分享卡片是增长引擎

---

## 二、核心功能设计

### 功能1：五行人格测试（首屏核心入口）

**用户流程**：
1. 进入App → 看到"Discover Your Element"主入口
2. 回答12道选择题（不是输入生辰八字，降低门槛）
3. 系统计算：主元素 + 副元素 + 阴阳属性
4. 生成精美人格报告卡片（可分享）

**12道题设计**（每题对应五行+阴阳维度）：

| # | 题目 | 选项A(木) | 选项B(火) | 选项C(土) | 选项D(金) | 选项E(水) |
|---|------|-----------|-----------|-----------|-----------|-----------|
| 1 | When facing a challenge, you tend to... | Grow around it | Burn through it | Stand firm | Cut precisely | Flow around it |
| 2 | Your ideal weekend... | Garden/nature | Party/social | Home/cooking | Museum/reading | Ocean/meditation |
| 3 | Friends describe you as... | Growth-oriented | Passionate | Dependable | Precise | Intuitive |
| 4 | Under stress, you... | Seek new paths | Act impulsively | Resist change | Become critical | Withdraw |
| 5 | Your communication style... | Persuasive | Expressive | Steady | Direct | Reflective |
| 6 | What drains your energy... | Being stuck | Being ignored | Chaos | Ambiguity | Pressure |
| 7 | Your creative process... | Evolves organically | Sparks suddenly | Builds gradually | Refines to perfection | Flows intuitively |
| 8 | In relationships, you value... | Freedom | Excitement | Stability | Loyalty | Depth |
| 9 | Your ideal workspace... | Open & green | Bold & vibrant | Cozy & warm | Minimal & clean | Calm & blue |
| 10 | Decision-making style... | Explore options | Trust your gut | Consult others | Analyze data | Feel it out |
| 11 | What you're most proud of... | Personal growth | Achievements | Relationships | Craftsmanship | Wisdom |
| 12 | Your hidden strength... | Resilience | Charisma | Patience | Discipline | Empathy |

**计分逻辑**：
- 每道题选对应元素+1分
- 12题后得出五行分数：Wood/ Fire/ Earth/ Metal/ Water
- 最高分=主元素，次高分=副元素
- 第1/4/7/10题同时计入阴阳维度（奇数倾向Yang，偶数倾向Yin）
- 最终输出：如"Yang Wood with Fire" → "The Growing Flame"

**5种人格命名**（英文好记+画面感）：

| 主元素 | 名称 | 英文Tagline | 核心特质 |
|--------|------|-------------|----------|
| 木 Wood | **The Pioneer** | "I grow beyond boundaries" | 成长、创造、突破 |
| 火 Fire | **The Catalyst** | "I ignite what's possible" | 热情、行动、感染力 |
| 土 Earth | **The Anchor** | "I am the ground beneath" | 稳定、包容、可靠 |
| 金 Metal | **The Artisan** | "I refine until it shines" | 精准、纪律、品质 |
| 水 Water | **The Sage** | "I see what lies beneath" | 直觉、智慧、深度 |

**10种复合人格**（主+副元素组合，各给独特名称和解读）：

| 组合 | 名称 | 一句话描述 |
|------|------|-----------|
| Wood+Fire | The Wildfire | 不可阻挡的创造力 |
| Wood+Water | The Deep Root | 安静但深远的生长力 |
| Fire+Earth | The Hearth | 温暖而稳定的中心 |
| Fire+Metal | The Forge | 用热情锻造卓越 |
| Earth+Metal | The Crystal | 坚实且通透的智慧 |
| Earth+Wood | The Garden | 孕育一切可能 |
| Metal+Water | The Ice | 极致的清晰与洞察 |
| Metal+Fire | The Blade | 精准的行动力 |
| Water+Wood | The River | 持续进化，永不停歇 |
| Water+Earth | The Lake | 平静表面下的深邃 |

---

### 功能2：生肖运势（每日内容，提升留存）

**入口**：首页第二个Tab "Daily Oracle"

**每日运势生成逻辑**：
1. 基于用户生肖 + 当天干支计算运势指数（0-100）
2. AI生成个性化解读文案（3-5段）
3. 幸运色/幸运数字/宜忌（英文表达）

**运势结构**：
```
╔══════════════════════════════╗
║  🐉 Dragon — June 3, 2026   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Energy: ████████░░ 82%      ║
║  Love:   ██████░░░░ 65%      ║
║  Career: █████████░ 91%      ║
║  Health: ███████░░░ 73%      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  "The Wooden Dragon awakens  ║
║   today. A chance encounter  ║
║   may shift your path..."    ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Lucky Color: Jade Green 🟢  ║
║  Lucky Number: 3, 8          ║
║  Favorable: Negotiation      ║
║  Avoid: Impulsive decisions  ║
╚══════════════════════════════╝
```

**生肖英文化包装**（不能只写animal，要有意象）：

| 生肖 | 英文名 | 意象关键词 |
|------|--------|-----------|
| 鼠 | The Rat | Clever, Resourceful |
| 牛 | The Ox | Steadfast, Enduring |
| 虎 | The Tiger | Bold, Unstoppable |
| 兔 | The Rabbit | Graceful, Intuitive |
| 龙 | The Dragon | Majestic, Transformative |
| 蛇 | The Serpent | Wise, Mysterious |
| 马 | The Horse | Free, Unbridled |
| 羊 | The Goat | Artistic, Gentle |
| 猴 | The Monkey | Ingenious, Playful |
| 鸡 | The Rooster | Precise, Confident |
| 狗 | The Dog | Loyal, Protective |
| 猪 | The Boar | Abundant, Sincere |

---

### 功能3：关系配对（社交裂变核心）

**用户流程**：
1. "Cosmic Bond"入口
2. 选择自己的生肖 → 输入对方生日（自动算生肖）或直接选生肖
3. 生成配对报告：契合度 + 关系动态 + 建议
4. 分享配对卡片到社交媒体

**配对逻辑**（简化三合六合六冲）：

| 关系 | 英文 | 含义 | 契合度范围 |
|------|------|------|-----------|
| 三合 | Trinity Bond | 最佳搭档 | 85-98% |
| 六合 | Secret Friend | 暗中互补 | 75-92% |
| 普通 | Neutral Flow | 平淡无冲 | 50-70% |
| 相冲 | Cosmic Clash | 动态张力 | 30-55% |
| 相害 | Hidden Friction | 潜在矛盾 | 25-45% |

**配对卡片设计**（重点：要让人想分享）：
- 左右两个生肖图腾 + 中间连线能量流
- 大字显示契合度百分比
- 1句话tagline（如 "The Dragon and the Phoenix — a legendary alliance"）
- 底部App Logo + 下载二维码

---

### 功能4：社交分享卡片（增长引擎）

**设计原则**：
- 像Instagram Story模板一样精美
- 信息量适中，引发好奇但不剧透
- 强烈的视觉识别度，让人一看就知道是Mystic Zodiac

**卡片类型**：

**类型A：人格结果卡**
```
┌─────────────────────────┐
│  ✦ MYSTIC ZODIAC ✦      │
│                          │
│  ┌──────┐               │
│  │ 🌿   │  YANG WOOD    │
│  │ 水墨  │  The Pioneer  │
│  │ 图腾  │               │
│  └──────┘  "I grow       │
│            beyond         │
│            boundaries"    │
│                          │
│  Wood ████████░░ 8        │
│  Fire ████░░░░░░ 3        │
│  Earth ██░░░░░░░ 1        │
│  Metal █░░░░░░░░ 0        │
│  Water ███░░░░░░ 2        │
│                          │
│  mystic-zodiac.app       │
└─────────────────────────┘
```

**类型B：每日运势卡**
- 生肖图腾 + 运势能量条 + 1句核心指引
- 极简，适合Story分享

**类型C：配对卡**
- 双生肖图腾 + 契合度 + 1句关系描述
- 最容易引发"@你的朋友来测"

---

### 功能5：I Ching Oracle（第二阶段，差异化利器）

**入口**：第三个Tab "I Ching"

**用户流程**：
1. 心中默想一个问题
2. 点击"Cast the Coins" → 6次投币动画（铜钱旋转+落地音效）
3. 生成卦象 → AI基于卦辞+用户问题生成现代解读
4. 保存到日记

**卦象视觉**：
- 6条爻线：阳爻（实线）阴爻（断线）
- 变爻高亮闪烁
- 配水墨背景+卦名书法

**AI Prompt模板**：
```
You are an I Ching oracle interpreter. The user asked: "{question}"
The hexagram drawn is: {hexagram_name} ({hexagram_number})
The changing lines are: {changing_lines}
The transformed hexagram is: {transformed_hexagram}

Provide a modern, practical interpretation that:
1. Explains the core message in simple English
2. Gives 2-3 specific action suggestions
3. Is empathetic but honest (don't sugarcoat)
4. References the imagery of the hexagram
5. Keeps it under 200 words

Tone: wise friend, not fortune teller
```

---

## 三、UI/UX设计规范

### 整体风格
**关键词**：Ink Wash Minimalism（水墨极简）

### 配色方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 主背景 | #0A0A0F | 深邃夜空黑 |
| 卡片背景 | #14141F | 微亮深蓝 |
| 主文字 | #E8E4DF | 暖白（宣纸色） |
| 辅助文字 | #7A7572 | 淡灰 |
| 金线/高亮 | #C9A96E | 古铜金 |
| 木元素 | #5B8C5A | 苍绿 |
| 火元素 | #C45B3E | 朱砂红 |
| 土元素 | #B8956A | 赭石 |
| 金元素 | #D4C5A9 | 月白金 |
| 水元素 | #4A7B9D | 靛蓝 |

### 字体
- 英文标题：**Cinzel**（古典衬线，有仪式感）
- 英文正文：**Inter**（现代无衬线，易读）
- 数字/数据：**JetBrains Mono**（等宽，适合展示数据）

### 交互设计
- **开屏**：墨滴扩散动画 + "Mystic Zodiac"浮现
- **投币**：3D铜钱旋转 + 金属碰撞音效 + haptic
- **翻页**：宣纸翻页效果
- **运势刷新**：水墨晕染过渡
- **按钮**：金线描边，按下时墨迹扩散

### 页面结构（3个Tab）

```
┌──────────────────────────────┐
│  ✦ Mystic Zodiac             │
├──────────────────────────────┤
│                              │
│  [主内容区]                   │
│                              │
│  Tab1: Element    (五行人格)  │
│  Tab2: Oracle     (每日运势)  │
│  Tab3: I Ching    (易经占卜)  │
│                              │
├──────┬──────────┬────────────┤
│ 🌿   │  🔮      │  ☯️        │
│Element│ Oracle  │  I Ching   │
└──────┴──────────┴────────────┘
```

---

## 四、变现模型

### 免费层
- 五行人格测试（完整12题+基础报告）
- 每日运势（当天一条）
- 1次I Ching占卜/天

### 付费层 — $9.99/月 或 $59.99/年

| 功能 | 免费 | 付费 |
|------|------|------|
| 五行人格完整报告 | 基础版 | 深度AI解读(2000字) |
| 每日运势 | 当天 | 7天预测+回看 |
| 关系配对 | 1次/天 | 无限次 |
| I Ching占卜 | 1次/天 | 无限次+AI深度解读 |
| 分享卡片 | 标准款 | 高级款(动画+个性化) |
| 运势通知 | - | 每日推送 |
| 专属图腾 | - | 解锁完整生肖图腾集 |

### 一次性内购
- 深度人格报告：$4.99
- 单次配对深度分析：$2.99
- 7天运势预测包：$3.99

---

## 五、技术架构

### 前端
- **框架**：React Native（你熟悉JS生态，跨平台）
- **导航**：React Navigation
- **动画**：Reanimated 3（水墨效果、铜钱3D旋转）
- **状态管理**：Zustand

### 后端
- **BaaS**：Supabase（PostgreSQL + Auth + Storage，免费额度大）
- **AI**：OpenAI GPT-4o-mini（运势解读+I Ching解卦，成本低）
- **推送**：Firebase Cloud Messaging
- **支付**：Google Play Billing Library

### 核心数据模型
```
users:
  id, element_main, element_sub, yin_yang,
  zodiac_sign, birth_date, created_at

daily_oracles:
  id, user_id, date, zodiac, heavenly_stem,
  earthly_branch, energy_score, love_score,
  career_score, health_score, ai_reading,
  lucky_color, lucky_numbers

iching_readings:
  id, user_id, question, hexagram_number,
  hexagram_name, changing_lines,
  transformed_hexagram, ai_interpretation,
  created_at

compatibility_reports:
  id, user_id, zodiac_1, zodiac_2,
  score, bond_type, ai_analysis
```

### AI调用成本预估
- 每次运势解读：~500 tokens × $0.15/1M = $0.000075
- 每次I Ching解卦：~800 tokens × $0.15/1M = $0.00012
- 1万DAU日均成本：~$1.5/天
- 极低成本，可以承受

---

## 六、Google Play上架清单

### 必须准备
- [ ] Google Play开发者账号（$25一次性）
- [ ] App签名密钥
- [ ] 隐私政策页面（必须，可用免费模板）
- [ ] 服务条款页面
- [ ] 内容分级问卷（占卜类选Entertainment）
- [ ] "For entertainment purposes only"免责声明

### Store Listing素材
- [ ] App名称：Mystic Zodiac: Eastern Wisdom
- [ ] 简短描述（80字）：Discover your cosmic identity through 5,000 years of Eastern wisdom
- [ ] 完整描述（4000字）：SEO优化
- [ ] Icon：512x512，水墨生肖图腾
- [ ] Feature Graphic：1024x500
- [ ] 截图：至少4张（Phone）+ 4张（Tablet）
- [ ] 预览视频：30秒内

### ASO关键词
Primary: Chinese Zodiac, Eastern Astrology, Five Elements, Yin Yang
Secondary: I Ching, Zodiac Compatibility, Daily Horoscope, Eastern Wisdom

---

## 七、开发排期（加速版）

| 天 | 任务 | 产出 |
|----|------|------|
| Day 1 | 项目搭建+五行测试引擎+生肖计算 | 可运行的测试功能 |
| Day 2 | 每日运势+AI接入+关系配对 | 核心功能闭环 |
| Day 3 | UI精修+分享卡片+音效动画 | 完整体验 |
| Day 4 | 支付集成+合规+Store素材 | 可提审 |
| Day 5 | 提审+修复+引流启动 | 上线 |

---

*文档版本：v1.0*
*创建时间：2026-06-02*
