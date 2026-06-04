# Mystic Zodiac — 产品设计文档 v2.1

> 📅 更新日志
> - v2.0 (2026-06-03): 紫微斗数版产品定义
> - v2.1 (2026-06-03): 补充技术选型、UI规范、logo方向、Google Play注册清单

---

## 一、产品概览

### 产品命名

| 元素 | 内容 | 说明 |
|------|------|------|
| **App英文名** | **Mystic Zodiac** | 简洁神秘，辨识度高 |
| **副标题** | *Eastern Wisdom for Self-Discovery* | 东方智慧·自我探索 |
| **中文名** | 玄秘星象 | 内部使用 |
| **Slogan** | "Unlock 5,000 years of Eastern wisdom" | 强调文化深度 |

### 一句话定位
> Unlock the secrets of Zi Wei Dou Shu — the Emperor's astrology used by Chinese royalty for 1,000 years.

### 目标用户
- 18-35岁英语用户，女性偏多（占星App典型用户70%+为女性）
- 对星座/性格测试/自我探索感兴趣
- 觉得Western Zodiac太普通，想要"更神秘更独特"的体验
- TikTok/Instagram重度用户，喜欢分享人格测试结果

### 核心差异化
- **紫微斗数**：比生肖/星座精密100倍的东方皇家占星术，12宫位+100+星曜
- **输入门槛低但产出极深**：只需出生年月日时+性别，输出完整命盘解读
- **极简高级感**：水墨+留白+金线，不是大红大绿
- **AI深度解读**：每次分析都是独特的，不是套模板
- **社交裂变**：精美分享卡片是增长引擎

---

## 二、首发功能设计

### 功能1：紫微命盘（首屏核心入口）

**用户流程**：
1. 进入App → 看到"Cast Your Celestial Chart"主入口
2. 输入出生信息：
   - 出生日期（年/月/日）
   - 出生时间（12时辰选择器，降低门槛）
   - 性别（男/女，紫微斗数阴阳不同排盘）
3. 系统自动排盘 → 生成12宫位+主星配置
4. 生成精美命盘图 + AI深度解读报告

**时辰选择器设计**（西方用户友好）：

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

**宫位英文化包装**：
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

**主星英文化包装**（14主星）：

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

---

### 功能2：每日运势（提升留存）

**运势结构**：
```
╔═══════════════════════════════╗
║  Your Daily Oracle            ║
║  June 3, 2026 — Fire Horse Day ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Overall: ████████░░ 82%      ║
║  Love:    ██████░░░░ 65%      ║
║  Career:  █████████░ 91%       ║
║  Health:  ███████░░░ 73%      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Lucky Element: Jade Wood 🌿   ║
║  Lucky Direction: Southeast   ║
║  Favorable: Negotiation        ║
║  Avoid: Impulsive decisions   ║
╚═══════════════════════════════╝
```

**关键：运势指数是纯算法计算，不消耗AI token**

---

### 功能3：关系配对（社交裂变核心）

- 双盘对比分析（不需要对方注册）
- 生成配对报告 + 分享卡片
- 契合度 + 关系动态分析

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
│  Love    ██░░ Palace      │
│                          │
│  mystic-zodiac.app       │
└─────────────────────────┘
```

---

## 三、技术选型

### 框架选型对比

| 维度 | React Native | Flutter |
|------|-------------|---------|
| **推荐指数** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **团队适配** | 主人有React开发经验 | 需新学Dart |
| **首板策略App** | ✅ 更熟悉，生态成熟 | ⚠️ 需适应 |
| **动画能力** | Reanimated 3 足够 | 原生高性能 |
| **AI集成** | ✅ 无差别 | ✅ 无差别 |
| **生态** | npm更丰富 | pub.dev |
| **学习成本** | 低（已有React基础） | 高（需学Dart） |
| **最终决定** | **✅ React Native** | — |

### 后端选型

| 服务 | 选择 | 理由 |
|------|------|------|
| **BaaS** | **Supabase** | 免费额度大、PostgreSQL、实时订阅、简单Auth |
| **AI** | **OpenAI GPT-4o-mini** | 成本极低($0.15/1M tokens)、效果够用 |
| **推送** | **Firebase Cloud Messaging** | 免费、跨平台 |
| **支付** | **Google Play Billing** | 必须用官方库 |
| **CDN** | **Firebase Storage** | 图片/资源存储 |

### 技术栈总结

```
┌─────────────────────────────────────────────────────────┐
│                    Mystic Zodiac                        │
├─────────────────────────────────────────────────────────┤
│  前端：React Native + TypeScript                         │
│  导航：React Navigation                                   │
│  动画：Reanimated 3 + Lottie                            │
│  状态：Zustand                                            │
│  样式：NativeWind (Tailwind for RN)                      │
├─────────────────────────────────────────────────────────┤
│  后端：BaaS                                               │
│  - 用户系统 + Auth → Supabase Auth                      │
│  - 数据库 → Supabase PostgreSQL                        │
│  - 存储 → Firebase Storage                              │
│  - AI解读 → OpenAI GPT-4o-mini                          │
│  - 推送 → Firebase Cloud Messaging                      │
├─────────────────────────────────────────────────────────┤
│  支付：Google Play Billing Library                      │
│  发布：Google Play Console                              │
└─────────────────────────────────────────────────────────┘
```

### 紫微斗数排盘算法（前端纯计算）

**核心算法模块**（约500行代码）：
1. 万年历数据：`lunar-javascript` npm包
2. 农历→公历互转
3. 五行局计算（水二局/木三局/金四局/土五局/火六局）
4. 14主星安星算法
5. 辅星安星算法
6. 四化飞星算法

**性能目标**：单次排盘 < 50ms（纯前端计算，0服务器成本）

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
  ai_reading(nullable),
  created_at

credit_transactions:
  id, user_id, amount, type,
  (purchase/daily_login/referral/ad_watch/consumption),
  related_entity_id, created_at
```

### AI调用成本控制

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

**单次AI成本**：~800 tokens × $0.15/1M = **$0.00012**
**按信用点定价**：5点 × $0.05/点 = $0.25 收入
**毛利率**：99.95% ✅

---

## 四、UI/UX设计规范

### 设计理念

**关键词**：Ink Wash Minimalism（水墨极简）
**对标参考**：Co-Star极简风 + 16Personalities测试感 + 东方水墨意境

### 配色方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 主背景 | `#0A0A0F` | 深邃夜空黑 |
| 卡片背景 | `#14141F` | 微亮深蓝 |
| 主文字 | `#E8E4DF` | 暖白（宣纸色） |
| 辅助文字 | `#7A7572` | 淡灰 |
| 金线/高亮 | `#C9A96E` | 古铜金 |
| 紫微星(帝王) | `#8B5CF6` | 紫色，呼应紫微 |
| 化禄 | `#5B8C5A` | 苍绿（吉利） |
| 化权 | `#C45B3E` | 朱砂红（力量） |
| 化科 | `#4A7B9D` | 靛蓝（贵人） |
| 化忌 | `#8B2252` | 暗红（警示） |

### 字体规范

| 用途 | 字体 | 说明 |
|------|------|------|
| 英文标题 | **Cinzel** | 古典衬线，有仪式感 |
| 英文正文 | **Inter** | 现代无衬线，易读 |
| 中文 | **Noto Serif SC** | 宋体衬线，古典感 |
| 数字/数据 | **JetBrains Mono** | 等宽，适合展示数据 |

### 交互动效

| 场景 | 动效设计 |
|------|---------|
| 开屏 | 墨滴扩散动画 + 星辰浮现 + "Mystic Zodiac"渐显 |
| 排盘动画 | 星曜逐一落入宫位，金色连线绘制（仪式感拉满） |
| 投币 | 3D铜钱旋转 + 金属碰撞音效 + haptic |
| 翻页 | 宣纸翻页效果 |
| 运势刷新 | 水墨晕染过渡 |
| 按钮按下 | 金线描边，墨迹扩散 |

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

---

## 五、Logo与视觉方向

### Logo设计方向

**核心元素**：
1. **紫微星**：北极星 + 帝王紫，App的核心图腾
2. **八卦/命盘轮廓**：东方符号的抽象化
3. **水墨笔触**：流动感，呼应Ink Wash风格

### Logo方向A：北极星图腾
```
        ✦
       /|\
      / | \
     /  |  \
    /   |   \
   /  ☆紫微 \
  /__________\
        |
    命盘轮廓
```
- 深紫渐变背景
- 北极星位于命盘中央
- 底部"Mystic Zodiac"字体

### Logo方向B：太极+星曜
```
     ☯️
   ╱    ╲
  ╱ ☆    ╲
 ╱    ☯️   ╲
  ╲      ╱
   ╲ ☆ ╱
     ☯️
```
- 太极与星曜融合
- 紫色+金色配色
- 现代极简风格

### Logo方向C：印章风格
```
┌──────────┐
│  ✦       │
│  Mystic  │
│  Zodiac  │
│       ✦  │
└──────────┘
```
- 中国印章风格
- 金色边框+紫微星
- 古典+现代融合

### App Icon尺寸要求

| 尺寸 | 用途 |
|------|------|
| 512x512 | Google Play Store |
| 1024x1024 | Google Play Feature Graphic |
| 180x180 | Android App Icon |
| 48/72/96/144 | 不同dpi适配 |

### 配色预览（Logo）

```
Primary:     #8B5CF6  (紫微紫)
Secondary:   #C9A96E  (古铜金)
Background:  #0A0A0F  (夜空黑)
Accent:      #E8E4DF  (宣纸白)
```

---

## 六、变现模型

### 信用点系统（成本控制核心）

| 操作 | 消耗信用点 | AI调用 |
|------|-----------|--------|
| 命盘基础报告（非AI） | 0 | ❌ 纯算法生成 |
| 命盘AI深度解读 | 5点 | ✅ GPT-4o-mini |
| 每日运势基础（非AI） | 0 | ❌ 纯算法 |
| 每日运势AI深度解读 | 3点 | ✅ GPT-4o-mini |
| 关系配对AI分析 | 5点 | ✅ GPT-4o-mini |

### 信用点购买

| 套餐 | 价格 | 信用点 | 单点成本 |
|------|------|--------|---------|
| Starter | $1.99 | 30点 | $0.066/点 |
| Popular | $4.99 | 100点 | $0.050/点 |
| Premium | $9.99 | 250点 | $0.040/点 |
| Monthly Pass | $4.99/月 | 60点/月 + 每日运势自动解锁 | $0.083/点 |
| Yearly Pass | $29.99/年 | 60点/月 + 每日运势自动解锁 + 专属命盘主题 | $0.042/点 |

### 1万MAU月度成本预估

- 月AI调用：15万次
- 月AI成本：~$15
- 月信用点收入：~$2,495
- **完全可控** ✅

---

## 七、Google Play上架清单

### 🔲 待办事项

#### 账号注册
- [ ] 注册Google Play开发者账号（$25一次性）
  - 地址：play.google.com/console
  - 需Gmail账号 + 信用卡/借记卡
  - 建议使用新Gmail专门管理开发者账号

#### 法律合规
- [ ] 隐私政策页面（部署到Firebase Hosting）
- [ ] 服务条款页面（Terms of Service）
- [ ] 内容分级问卷（选Entertainment类别）
- [ ] "For entertainment purposes only"免责声明

#### Store Listing素材
- [ ] App名称：**Mystic Zodiac**
- [ ] 简短描述（80字）："Unlock Zi Wei Dou Shu — the Emperor's astrology kept secret for 1,000 years"
- [ ] 完整描述（4000字）：SEO优化
- [ ] Icon：512x512，紫微星图腾
- [ ] Feature Graphic：1024x500
- [ ] 截图：至少4张（Phone）
- [ ] 预览视频：30秒内（可选）

#### ASO关键词
- Primary: Zi Wei Dou Shu, Chinese Astrology, Purple Star, Eastern Wisdom
- Secondary: Chinese Zodiac, I Ching, Destiny Chart, Fortune Telling, BaZi

---

## 八、开发排期（5天MVP）

| 天 | 任务 | 产出 |
|----|------|------|
| Day 1 | 项目搭建+紫微排盘算法+命盘UI | 可运行的排盘功能 |
| Day 2 | 每日运势算法+信用点系统+AI接入 | 核心功能闭环 |
| Day 3 | UI精修+分享卡片+关系配对 | 完整体验 |
| Day 4 | 支付集成+合规+Store素材 | 可提审 |
| Day 5 | 提审+修复+引流启动 | 上线 |

---

## 九、技术风险与应对

| 风险 | 等级 | 应对方案 |
|------|------|---------|
| 紫微斗数算法准确性 | 中 | 使用开源库+测试用例验证10+已知命盘 |
| Google Play审核拒绝 | 中 | 定位Entertainment+加免责声明 |
| AI幻觉/胡编解读 | 低 | Prompt工程+限制输出范围 |
| 西方用户不理解紫微斗数 | 高 | 加强教育引导+简化文案 |

---

*文档版本：v2.1*
*更新时间：2026-06-03*
*变更记录：v2.0→v2.1 — 补充技术选型、UI规范、logo方向、Google Play清单*
