# Mystic Zodiac — 开发计划 v2.3

> 更新时间：2026-06-04 21:50
> 本轮目标：4大深度功能全量开发 + 首屏按钮全面复查

---

## 一、P0 — 深度功能矩阵（本次全部开发）

### 1.1 Full Chart Reading · 命盘全解（12点消耗）

**定位**：最高单价功能，12点解锁全部12宫详解。用户为"知道一切"买单。

**UI**：在 chart-screen 新增按钮，点击后显示独立 reading 页面

| 宫位 | 解读要点 |
|------|---------|
| 命宫 (Ming) | 核心性格、人生方向 |
| 兄弟宫 (Sibling) | 手足关系、职场人际 |
| 夫妻宫 (Partnership) | 感情观、伴侣特征 |
| 子女宫 (Children) | 创造力、投资运 |
| 财帛宫 (Wealth) | 财运走势、理财建议 |
| 疾厄宫 (Health) | 健康预警、体质特征 |
| 迁移宫 (Travel) | 出行运、外地发展 |
| 交友宫 (Social) | 朋友质量、贵人运 |
| 官禄宫 (Career) | 事业方向、升迁运 |
| 田宅宫 (Property) | 不动产运、家居风水 |
| 福德宫 (Fortune) | 精神世界、福气深浅 |
| 父母宫 (Parents) | 原生家庭、长辈缘 |

**技术实现**：调用DeepSeek生成12宫全解读，缓存24小时
**交互**：点击后消耗12点 → 显示加载动画 → 12宫卡片逐一显示（动画展开）

### 1.2 Soulmate Deep Dive · 关系深度解读（6点消耗）

**定位**：6点，已存在 soulmate-screen 但可加深度解读按钮
**已有**：SOULMATE_PROFILES 14种星曜配对基础数据
**增强**：
- 基础版：已有星曜配对 + 五行元素匹配（免费？或已有的soulmate屏幕保持不变）
- 深度版：消耗6点，调用DeepSeek生成个性化配对报告（含3-4段详细分析）
- 新增深度按钮在soulmate-screen底部

### 1.3 Monthly Guide · 月运趋势（10点消耗）

**定位**：10点，每月一次的高频大额消耗
**UI**：独立页面，含：
- 月份选择器（当前月-未来3个月）
- 月度关键词（1-2句）
- 4个周分解（Week 1-4，每週2-3件关键事）
- 本月幸运元素（方向/颜色/数字）
- 本月注意宫位

**技术**：调用DeepSeek基于命盘当月流运生成
**缓存**：同一月份不重复扣费

### 1.4 Past Life Insight · 前世回响（4点消耗）

**定位**：4点，娱乐传播型最强功能。社交分享欲望高
**UI**：独立页面，含：
- 前世身份卡片（朝代+身份+关键词）
- 前世故事段落（2-3段叙事）
- 与前世的连接点（现在的某个特质/偏好/恐惧的因果）
- "Share Past Life" 分享卡片按钮

**技术**：基于命盘主星+五行局，调用DeepSeek生成前世叙事
**亮点**：分享卡片视觉冲击力强，容易引发社交传播

---

## 二、积分经济匹配

| 功能 | 消耗 | 用户心理 |
|------|------|---------|
| Card of the Day | 1点 | 日常小确幸，签到刚好够 |
| Full Chart Reading | **12点** | "最值钱的功能"——全知道 |
| Monthly Guide | **10点** | "每月一次的指引"——刚需 |
| Soulmate Deep Dive | **6点** | "TA到底是什么样的人"——好奇 |
| Past Life Insight | **4点** | "我前世是谁"——好玩+传播 |

**用户Day1经济**：注册8 + 签到1 = 9点
- Card of the Day(1) + Full Chart(12) → 不够 → 差4点，触发充值
- 或 Card of the Day(1) + Past Life(4) + Soulmate(6) → 超2点，也差
- 或 Card of the Day(1) + Monthly Guide(10) → 超2点，差
- **结论**：Day1必差一点，引导首充$1.99（30点）

---

## 三、UI首屏按钮全面复查

**原则**：每个 `.screen` 打开时，至少一个可交互按钮在首屏可见（不滚动）。

| 页面 | 状态 | 修复方案 |
|------|------|---------|
| Splash | ✅ 点击/跳过 | 不动 |
| Pain 1-3 | ✅ Continue粘底 | 不动 |
| Birthdate | ✅ Continue粘底 | 不动 |
| Birthhour | ✅ Continue粘底 | 不动 |
| Gender | ✅ Continue粘底 | 不动 |
| Name Seal | ✅ Continue粘底 | 不动 |
| Chart(命盘) | ⚠️ 按钮多但散 | Pain Reading按钮粘底 + Share按钮粘底 |
| Pain Reading | ⚠️ 长文本+按钮 | Read Full Chapter粘底 |
| Oracle | ⚠️ 长内容 | Card of Day可点+Deep Reading按钮粘底 |
| Chapters | ⚠️ 列表+详情 | 列表可点，底部导航 |
| Bond | ⚠️ 特征卡片 | 卡片可点，底部有空间 |
| Soulmate | ✅ Seal粘底 | 不动 |
| Compatibility | ⚠️ 输入表单 | 底部有Calculate按钮 |
| 新增Full Chart | 新增 | 按钮粘底 |
| 新增Monthly Guide | 新增 | 月份选择+按钮粘底 |
| 新增Past Life | 新增 | Share按钮粘底 |

**通用修复**：
```css
.screen .bottom-fixed {
  margin-top: auto;
  padding-top: 20px;
}
```

---

## 四、文件改动清单

| 文件 | 改动 |
|------|------|
| `app/index.html` | 新增3个screen + 增强1个screen + UI复按钮修复 |
| `app/app-config.js` | 积分常量已就绪，无需修改 |
| `app/wisdom-engine.js` | 新增prompt模板（fullChart/monthly/pastLife） |
| `app/payment-module.js` | 积分逻辑已就绪 |

### 新增HTML屏幕ID
- `full-chart-screen` — 命盘全解（12宫展开）
- `monthly-guide-screen` — 月运趋势
- `past-life-screen` — 前世回响

### 新增JS函数
- `showFullChartReading()` — 消耗12点，调DeepSeek生成全解
- `showMonthlyGuide(month)` — 消耗10点，生成月运
- `showPastLife()` — 消耗4点，生成前世故事
- `requestFullChartReading()` — DeepSeek API调用
- `requestMonthlyGuide()` — DeepSeek API调用
- `requestPastLife()` — DeepSeek API调用

---

*本计划对应GitHub仓库 `Vanan2026/MysticZodiac`*
