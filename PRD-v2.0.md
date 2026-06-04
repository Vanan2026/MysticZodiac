# Mystic Zodiac — 产品设计文档 v2.0

## 一、产品概览

### 产品名
**Mystic Zodiac: Eastern Wisdom**（暂定，备选：Purple Oracle / Zenith Zodiac）

### Logo
阴阳（Yin-Yang）图腾，金色线条描边（#C9A96E）配深底（#0A0A0F），极简现代风格

### 一句话定位
Unlock the secrets of Zi Wei Dou Shu — the Emperor's astrology used by Chinese royalty for 1,000 years.

### 目标用户
- 18-35岁英语用户，女性偏多（占星App典型用户70%+为女性）
- 对星座/性格测试/自我探索感兴趣
- 觉得Western Zodiac太普通，想要"更神秘更独特"的体验
- TikTok/Instagram重度用户，喜欢分享人格测试结果

### 核心差异化
- **紫微斗数**：比生肖/星座精密100倍的东方皇家占星术，12宫位+100+星曜，海外几乎无人做
- **输入门槛低但产出极深**：只需出生年月日时+性别，输出完整命盘解读
- **极简高级感**：水墨+留白+金线，不是大红大绿
- **AI深度解读**：每次分析都是独特的，不是套模板
- **社交裂变**：精美分享卡片是增长引擎

---

## 二、核心功能设计

### 功能1：紫微命盘（首屏核心入口，替代原五行测试）

**用户流程**：
1. 进入App → 看到"Cast Your Celestial Chart"主入口
2. 输入出生信息：
   - 出生日期（年/月/日）
   - 出生时间（12时辰选择器，降低门槛）
   - 性别（男/女，紫微斗数阴阳不同排盘）
3. 系统自动排盘 → 生成12宫位+主星配置
4. 生成精美命盘图 + AI深度解读报告

**时辰选择器设计**（西方用户友好）：
用滑动选择器，展示时间范围+意象，而非直接写"子时"：

| 时辰 | 展示文案 | 时间范围 |
|------|---------|---------|
| 子 Zi | The Hour of the Rat 🐀 | 23:00 - 01:00 |
| 丑 Chou | The Hour of the Ox 🐂 | 01:00 - 03:00 |
| 寅 Yin | The Hour of the Tiger 🐅 | 03:00 - 05:00 |
| 卯 Mao | The Hour of the Rabbit 🐇 | 05:00 - 07:00 |
| 辰 Chen | The Hour of the Dragon 🐉 | 07:00 - 09:00 |
| 巳 Si | The Hour of the Serpent 🐍 | 09:00 - 11:00 |
| 午 Wu | The Hour of the Horse 🐎 | 11:00 - 13:00 |
| 未 Wei | The Hour of the Goat 🐐 | 13:00 - 15:00 |
| 申 Shen | The Hour of the Monkey 🐒 | 15:00 - 17:00 |
| 酉 You | The Hour of the Rooster 🐓 | 17:00 - 19:00 |
| 戌 Xu | The Hour of the Dog 🐕 | 19:00 - 21:00 |
| 亥 Hai | The Hour of the Boar 🐗 | 21:00 - 23:00 |
| 不确定 | I'm not sure | 使用默认午时(12:00)，提示影响精度 |

**紫微命盘计算逻辑**（纯前端算法，不依赖AI）：
1. 农历转换（内置万年历）
2. 五行局计算（水二局/木三局/金四局/土五局/火六局）
3. 紫微星定位 → 12宫位排列
4. 主星安星：紫微、天机、太阳、武曲、天同、廉贞等14主星
5. 辅星安星：左辅右弼、文昌文曲、天魁天钺等
6. 四化飞星：化禄/化权/化科/化忌

**命盘视觉设计**：
```
┌──────────┬──────────┬──────────┬──────────┐
│  巳 Snake │ 午 Horse │ 未 Goat  │ 申 Monkey│
│           │          │          │          │
│ [迁移宫]  │ [疾厄宫] │ [财帛宫] │ [子女宫] │
│ 太阳      │ 武曲     │ 紫微     │ 天机     │
│ 文昌      │ 天相     │          │          │
├──────────┼──────────┴──────────┼──────────┤
│ 辰 Dragon│                      │ 酉 Roost│
│          │                      │          │
│ [交友宫] │    ✦ 紫微命盘 ✦      │ [夫妻宫] │
│ 廉贞     │                      │ 太阴     │
│          │  [姓名/生辰]         │ 文曲     │
├──────────┼──────────┬──────────┼──────────┤
│ 卯 Rabbit│ 寅 Tiger │ 丑 Ox    │ 子 Rat   │
│          │          │          │          │
│ [官禄宫] │ [田宅宫] │ [福德宫] │ [父母宫] │
│ 天同     │ 七杀     │ 破军     │ 天梁     │
│          │          │ 右弼     │ 左辅     │
└──────────┴──────────┴──────────┴──────────┘
```

西方用户版（英文宫位名，更直观）：
- 命宫 → **Destiny Palace**
- 兄弟宫 → **Siblings Palace**
- 夫妻宫 → **Partnership Palace**
- 子女宫 → **Children Palace**
- 财帛宫 → **Wealth Palace**
- 疾厄宫 → **Vitality Palace**
- 迁移宫 → **Journey Palace**
- 交友宫 → **Alliance Palace**
- 官禄宫 → **Ambition Palace**
- 田宅宫 → **Sanctuary Palace**
- 福德宫 → **Harmony Palace**
- 父母宫 → **Heritage Palace**

**主星英文化包装**（14主星，保持神秘感但可理解）：

| 主星 | 英文名 | 主题关键词 | 视觉符号 |
|------|--------|-----------|---------|
| 紫微 | Purple Star (Emperor) | 领导、权威 | 👑 |
| 天机 | Celestial Mechanic | 智慧、策略 | 🧭 |
| 太阳 | Solar Radiance | 光明、热情 | ☀️ |
| 武曲 | Martial Virtue | 行动力、决断 | ⚔️ |
| 天同 | Celestial Harmony | 享受、人缘 | 🎵 |
| 廉贞 | Righteous Spirit | 原则、约束 | ⚖️ |
| 天府 | Celestial Treasury | 稳重、财富 | 🏛️ |
| 太阴 | Lunar Grace | 柔和、细腻 | 🌙 |
| 贪狼 | Greedy Wolf | 欲望、多才 | 🐺 |
| 巨门 | Great Gate | 口才、争议 | 🚪 |
| 天相 | Celestial Minister | 辅佐、服务 | 📜 |
| 天梁 | Celestial Beam | 贵人、庇荫 | 🛡️ |
| 七杀 | Seven Kills | 开创、冒险 | 🗡️ |
| 破军 | Po Jun (Breaker) | 变革、突破 | 💥 |

**命盘解读报告结构**（AI生成，但基于精确排盘数据）：

```
📖 Your Celestial Blueprint

━━━ THE EMPEROR'S SEAT ━━━
Your Destiny Palace houses the Purple Star (紫微) — 
the Emperor himself. This placement suggests...

━━━ WEALTH DESTINY ━━━
Your Wealth Palace holds the Celestial Treasury (天府),
indicating a natural ability to accumulate...

━━━ LOVE & PARTNERSHIP ━━━
With Lunar Grace (太阴) in your Partnership Palace...

━━━ CAREER & AMBITION ━━━
Martial Virtue (武曲) in your Ambition Palace means...

━━━ THE FOUR TRANSFORMATIONS ━━━
This year, Hua Lu (化禄) lands in your Wealth Palace —
a signal of financial opportunity...

━━━ KEY INSIGHT ━━━
One sentence that captures the essence of your chart.
```

---

### 功能2：每日运势（提升留存）

**入口**：第二个Tab "Daily Oracle"

**运势生成逻辑**：
1. 基于用户紫微命盘 + 当日干支 → 计算流日四化
2. 流日四化飞入哪几个宫位 → 决定当日运势主题
3. 运势指数由星曜组合量化计算（不用AI，纯算法）
4. AI只负责把量化结果"翻译"成个性化文案

**运势结构**：
```
╔═══════════════════════════════╗
║  Your Daily Oracle            ║
║  June 3, 2026 — Fire Horse Day║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Overall: ████████░░ 82%      ║
║  Love:    ██████░░░░ 65%      ║
║  Career:  █████████░ 91%      ║
║  Health:  ███████░░░ 73%      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Today's Activation:          ║
║  Hua Ji (化忌) enters your    ║
║  Journey Palace — watch for   ║
║  miscommunication in travel.  ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Lucky Element: Jade Wood 🌿  ║
║  Lucky Direction: Southeast   ║
║  Favorable: Negotiation       ║
║  Avoid: Impulsive decisions   ║
╚═══════════════════════════════╝
```

**关键：运势指数是纯算法计算，不消耗AI token**
- 预定义星曜组合→运势评分映射表
- AI仅在用户主动点击"Deep Reading"时才调用
- 大幅降低token消耗

---

### 功能3：关系配对（社交裂变核心）

**用户流程**：
1. "Cosmic Bond"入口
2. 输入对方出生日期+时辰+性别
3. 双盘对比分析（不需要对方注册）
4. 生成配对报告 + 分享卡片

**配对逻辑**（基于紫微斗数，非生肖）：
- 命宫主星互配（如紫微+天机 = Emperor+Strategist = "Power Couple"）
- 夫妻宫星曜交叉分析
- 四化飞星互影响
- 最终得出契合度+关系动态

**配对卡片设计**：
- 两个命盘缩小版左右排列
- 中间能量连线
- 大字契合度 + 1句话tagline
- 底部App Logo

---

### 功能4：社交分享卡片（增长引擎）

**类型A：命盘结果卡**
```
┌─────────────────────────┐
│  ✦ MYSTIC ZODIAC ✦      │
│                          │
│  ┌──────┐               │
│  │ 👑   │  PURPLE STAR   │
│  │ 命盘  │  The Emperor   │
│  │ 缩略  │               │
│  └──────┘  "Born to      │
│            lead, wired    │
│            for wisdom"    │
│                          │
│  Destiny ████ Palace     │
│  Wealth  ████ Palace     │
│  Love    ██░░ Palace     │
│                          │
│  mystic-zodiac.app       │
└─────────────────────────┘
```

**类型B：每日运势卡**
**类型C：配对卡**
（设计同v1.0，内容替换为紫微斗数元素）

---

### 功能5：I Ching Oracle（第二阶段）

同v1.0设计，不变。

---

## 三、信用点系统（成本控制核心）

### 设计原则
- **所有AI调用都消耗信用点**，没有"无限次"
- 免费用户有少量信用点体验核心功能
- 付费用户购买信用点包，按使用量计费
- 运势指数等非AI内容不消耗信用点

### 信用点消耗规则

| 操作 | 消耗信用点 | AI调用 |
|------|-----------|--------|
| 命盘基础报告（非AI） | 0 | ❌ 纯算法生成 |
| 命盘AI深度解读 | 5点 | ✅ DeepSeek |
| 每日运势（基础，非AI） | 0 | ❌ 纯算法计算 |
| 每日运势AI深度解读 | 3点 | ✅ DeepSeek |
| 关系配对基础（非AI） | 0 | ❌ 星曜匹配算法 |
| 关系配对AI深度分析 | 5点 | ✅ DeepSeek |
| I Ching占卜+AI解卦 | 4点 | ✅ DeepSeek |

### 信用点获取

| 来源 | 信用点 | 说明 |
|------|--------|------|
| 注册赠送 | 15点 | 足够体验3次AI功能 |
| 每日登录 | 2点 | 鼓励留存 |
| 邀请好友注册 | 5点 | 社交裂变激励 |
| 观看广告 | 2点/次 | 每天1次机会 |

### 信用点购买

| 套餐 | 价格 | 信用点 | 单点成本 |
|------|------|--------|---------|
| Starter | $1.99 | 30点 | $0.066/点 |
| Popular | $4.99 | 100点 | $0.050/点 |
| Premium | $9.99 | 250点 | $0.040/点 |
| Monthly Pass | $4.99/月 | 60点/月 + 每日运势自动解锁 | $0.083/点 |
| Yearly Pass | $29.99/年 | 60点/月 + 每日运势自动解锁 + 专属命盘主题 | $0.042/点 |

### 成本核算

**单次AI调用成本**：
- 命盘深度解读：~800 tokens × $0.15/1M = $0.00012
- 运势深度解读：~500 tokens × $0.15/1M = $0.000075
- 配对分析：~600 tokens × $0.15/1M = $0.00009
- I Ching解卦：~800 tokens × $0.15/1M = $0.00012

**按信用点收入 vs AI成本**：
- 命盘深度解读：5点 × $0.05/点 = $0.25收入，成本$0.00012，毛利率99.95%
- 即使极度使用，AI成本也可忽略
- **信用点收入覆盖AI成本1000倍以上**

**1万MAU月度成本预估**：
- 假设50%活跃用户每天用1次AI功能
- 月AI调用：5000人 × 30天 = 15万次
- 月AI成本：15万 × $0.0001 ≈ $15
- 月信用点收入（假设5%付费率）：500人 × $4.99 ≈ $2,495
- **完全可控**

---

## 四、UI/UX设计规范

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
| 紫微星(帝王) | #8B5CF6 | 紫色，呼应紫微 |
| 命宫高亮 | #C9A96E | 古铜金 |
| 化禄 | #5B8C5A | 苍绿（吉利） |
| 化权 | #C45B3E | 朱砂红（力量） |
| 化科 | #4A7B9D | 靛蓝（贵人） |
| 化忌 | #8B2252 | 暗红（警示） |

### 字体
- 英文标题：**Cinzel**（古典衬线，有仪式感）
- 英文正文：**Inter**（现代无衬线，易读）
- 数字/数据：**JetBrains Mono**（等宽，适合展示数据）

### 交互设计
- **开屏**：墨滴扩散动画 + 星辰浮现 + "Mystic Zodiac"渐显
- **排盘动画**：星曜逐一落入宫位，金色连线绘制（仪式感拉满）
- **投币**：3D铜钱旋转 + 金属碰撞音效 + haptic
- **翻页**：宣纸翻页效果
- **运势刷新**：水墨晕染过渡
- **按钮**：金线描边，按下时墨迹扩散

### 页面结构（3个Tab）

```
┌──────────────────────────────┐
│  ✦ Mystic Zodiac             │
│  Credits: ◆ 15               │
├──────────────────────────────┤
│                              │
│  [主内容区]                   │
│                              │
│  Tab1: Chart    (紫微命盘)    │
│  Tab2: Oracle   (每日运势)    │
│  Tab3: I Ching  (易经占卜)    │
│                              │
├──────┬──────────┬────────────┤
│ ✦    │  🔮      │  ☯️        │
│Chart │ Oracle  │  I Ching   │
└──────┴──────────┴────────────┘
```

顶部常驻信用点余额，点击可跳转购买页。

---

## 五、变现模型

### 免费层
- 完整命盘排盘（纯算法，不消耗信用点）
- 基础命盘报告（宫位+星曜说明，非AI）
- 每日运势指数（纯算法，不消耗信用点）
- 注册送15信用点，每日登录送2点

### 付费层
- **信用点包**（一次性购买）：$1.99 / $4.99 / $9.99
- **Monthly Pass $4.99/月**：60点/月 + 每日运势自动解锁
- **Yearly Pass $29.99/年**：60点/月 + 每日运势自动解锁 + 专属命盘主题

### 其他收入
- 激励视频广告（看1次广告得2信用点，每天1次）
- 信用点永远不会过期

---

## 六、技术架构

### 前端
- **框架**：React Native
- **导航**：React Navigation
- **动画**：Reanimated 3（排盘动画、铜钱3D旋转）
- **状态管理**：Zustand

### 紫微斗数排盘算法（前端纯计算）
- 内置万年历（公历→农历转换）
- 五行局计算
- 14主星安星算法
- 辅星安星算法
- 四化飞星算法
- **所有排盘计算在前端完成，0服务器成本**

### 后端
- **BaaS**：Supabase（用户系统+信用点余额+支付记录）
- **AI**：DeepSeek API（仅AI解读时调用，按信用点控制，$0.14/1M tokens）
- **推送**：Firebase Cloud Messaging
- **支付**：Google Play Billing Library

### 核心数据模型
```
users:
  id, birth_date, birth_hour, gender,
  lunar_birth_date, destiny_palace_star,
  credit_balance, created_at

ziwei_charts:
  id, user_id, chart_data(JSON),
  palace_stars, four_transformations,
  created_at

daily_oracles:
  id, user_id, date,
  stem_branch, flowing_four_hua,
  overall_score, love_score,
  career_score, health_score,
  ai_reading(nullable), -- 仅付费时填充
  created_at

iching_readings:
  id, user_id, question,
  hexagram_number, hexagram_name,
  changing_lines, transformed_hexagram,
  ai_interpretation, created_at

credit_transactions:
  id, user_id, amount, type,
  (purchase/daily_login/referral/ad_watch/consumption),
  related_entity_id, created_at

compatibility_reports:
  id, user_id, chart_1_data, chart_2_data,
  bond_type, score, ai_analysis(nullable),
  created_at
```

### AI调用链路（成本控制）
```
用户点击"Deep Reading"
    ↓
检查信用点余额 → 不足则弹购买弹窗
    ↓
扣减信用点（先扣后调，防止超支）
    ↓
调用AI API → 生成解读
    ↓
保存结果到数据库
    ↓
展示给用户
```

**防刷机制**：
- 每次AI调用前先扣信用点，调用失败则退回
- 单用户每日AI调用上限20次（即使信用点充足）
- 服务端限流：同一IP 100次/小时

---

## 七、Google Play上架清单

### 必须准备
- [ ] Google Play开发者账号（$25一次性）
- [ ] App签名密钥
- [ ] 隐私政策页面
- [ ] 服务条款页面
- [ ] 内容分级问卷（占卜类选Entertainment）
- [ ] "For entertainment purposes only"免责声明

### Store Listing素材
- [ ] App名称：Mystic Zodiac: Eastern Wisdom
- [ ] 简短描述（80字）：Unlock Zi Wei Dou Shu — the Emperor's astrology kept secret for 1,000 years
- [ ] 完整描述（4000字）：SEO优化
- [ ] Icon：512x512，紫微星图腾
- [ ] Feature Graphic：1024x500
- [ ] 截图：至少4张（Phone）+ 4张（Tablet）
- [ ] 预览视频：30秒内

### ASO关键词
Primary: Zi Wei Dou Shu, Chinese Astrology, Purple Star, Eastern Wisdom
Secondary: Chinese Zodiac, I Ching, Destiny Chart, Fortune Telling, BaZi

---

## 八、开发排期（加速版）

| 天 | 任务 | 产出 |
|----|------|------|
| Day 1 | 项目搭建+紫微排盘算法+命盘UI | 可运行的排盘功能 |
| Day 2 | 每日运势算法+信用点系统+AI接入 | 核心功能闭环 |
| Day 3 | UI精修+分享卡片+关系配对 | 完整体验 |
| Day 4 | 支付集成+合规+Store素材 | 可提审 |
| Day 5 | 提审+修复+引流启动 | 上线 |

### 紫微排盘算法开发要点
1. 万年历数据：可使用开源库 `lunar-javascript`（npm包，支持公历农历互转+干支计算）
2. 安星算法：核心约500行代码，可参考开源实现
3. 测试用例：准备10个已知命盘的生辰数据，验证排盘准确性
4. 性能：前端计算，单次排盘<50ms

---

*文档版本：v2.0*
*更新时间：2026-06-03*
*变更记录：v1.0→v2.0 — 生肖替换为紫微斗数，新增信用点系统替代无限订阅*
