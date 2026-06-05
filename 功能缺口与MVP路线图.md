# MysticZodiac — 功能缺口与MVP路线图

> 最后更新：2026-06-05
> 当前状态：Demo v2.2（GitHub Pages可访问 ✅）

---

## 一、当前已完成状态

### ✅ Onboarding 全流程
- [x] Splash → Pain Question ×3 → Birth Date → Hour → Gender → Name Seal → Reveal Ceremony → Main Screen
- [x] 暗金极简UI，flex column粘底布局
- [x] 国内兼容（notranslate + fonts.googleapis.cn + SVG favicon）
- [x] 无emoji，无"AI/AI-powered"文案

### ✅ AIEngine（wisdom-engine.js）
- [x] DeepSeek V4 Pro API集成（thinking禁用）
- [x] 6大功能：命盘全解、月运、前世、灵魂深度、每日运势、性格解读
- [x] 24小时内存缓存
- [x] 所有扣费功能已加防重标记
- [x] 按钮绑定已修复（read-full-btn、share-download-btn、share-native-btn、confirm-unlock-btn）

---

## 二、🔴 紧急问题（优先级最高）

### 1. API Key明文暴露
- **问题**：`sk-e6078716aa6141dcaf753cda9d26272f` 在 `docs/app-config.js` 中hardcoded，已推送公开GitHub仓库
- **风险**：任何人可以克隆仓库使用你的DeepSeek额度
- **方案**：撤销旧Key + Supabase Edge Function代理
- **预估工时**：1-2小时

---

## 三、🟡 内容深度缺口

### 2. prompt模板仍需打磨
- Fallback内容（API不可用时）太单薄
- 月运内容对月份的区分度可以更强
- 解读的"个性化"程度依赖输入数据丰富度

### 3. 紫微斗数数据源
- 当前排盘使用 `ziwei/` 目录下的JS引擎
- 需要验证排盘结果的准确性
- 需要映射更丰富的星曜属性（庙旺利陷、四化飞星等）

### 4. 个性化增强
- 当前输入只用了 生辰+姓名+性别
- 可以增加更多维度：出生地点（经纬度影响时区校正）、职业等
- 解读中对"用户之前问了什么"的上下文感知

---

## 四、🔵 React Native生产版缺口（上架Google Play必需）

### Phase A — 核心工程（1-2周）

#### A1. API Key隐藏 + Supabase后端
- 搭建Supabase项目
- 创建Edge Function（deepseek-proxy）
- 前端只调自己的Edge Function URL
- 用户注册/登录（Supabase Auth）

#### A2. 用户系统
- Supabase Auth（邮箱/Google登录）
- 用户profile存储（姓名、生辰、排盘结果）
- 用户数据同步（多设备）
- Redis/PostgreSQL存缓存，替代内存缓存

#### A3. 积分系统真实化
- 当前积分模型：注册8+签到1+分享1，$1.99/30点等
- 需要后端验证积分（不能只靠前端localStorage）
- 日签到、分享奖励等防刷逻辑
- 用户手动输入生辰的额度控制

### Phase B — 支付与上架（1-2周）

#### B1. Google Play Billing
- React Native IAP（react-native-iap）
- Credit购买商品配置（$1.99/$4.99/$9.99）
- Pro订阅配置（$14.99/月，$99.99/年）
- 服务端验证收据（Supabase Edge Function）

#### B2. Firebase集成
- Firebase Cloud Messaging（推送通知）
- 每日运势推送
- 事件追踪（Analytics/Crashlytics）

#### B3. Google Play上架材料
- App图标（阴阳图logo）
- 截图（手机端各页面）
- 隐私政策（建议用Termly或Iubenda生成）
- 娱乐性免责声明（已完成compliance.js）
- 内容分级调查

### Phase C — 社交与增长（1-2周）

#### C1. 分享卡片生成
- 命盘身份卡（Destiny Card）
- 每日天机卡（Daily Whisper Card）
- 命定之缘卡（Soulmate Card）
- 用HTML2Canvas或Canvas API生成图片
- 分享到Instagram/TikTok/Twitter

#### C2. 病毒传播机制
- 分享后可免费解锁一次深度阅读
- "和朋友合盘"邀请机制
- 每日签到提醒（Firebase推送）

### Phase D — 内容深度（持续迭代）

#### D1. 紫微斗数高级功能
- 大限排盘（每10年大运）
- 流年排盘（每年运势）
- 星曜庙旺利陷图
- 四化飞星动态展示

#### D2. 更多AI解读类型
- 性格图谱（星曜组合→性格类型）
- 事业/财富专项解读
- 风水建议（基于命盘）

#### D3. 多语言
- 英语（首发）
- 西班牙语/法语/德语（v2）
- 日语/韩语（v3）

---

## 五、MVP建议优先级总表

| 优先级 | 模块 | 预估工时 | 依赖 | 备注 |
|--------|------|---------|------|------|
| 🔴 P0 | API Key隐藏+Edge Function | 1-2h | Supabase账号 | 不等了，立刻做 |
| 🔴 P0 | 撤销旧Key | 5min | DeepSeek后台 | 用户操作 |
| 🟡 P1 | 内容深度（prompt+fallback） | 2-4h | 无 | 提升Demo品质 |
| 🟡 P1 | 排盘准确性验证 | 2h | 无 | 可用真实案例对比 |
| 🔵 P2 | React Native迁移 | 1-2周 | 无 | 真正的生产工程 |
| 🔵 P2 | Supabase Auth+数据库 | 3-5天 | RN迁移完成 | 用户系统 |
| 🔵 P2 | Google Play Billing | 3-5天 | RN迁移+Supabase | 上架必需 |
| 🔵 P3 | Firebase推送 | 1天 | Supabase完成 | 
| 🔵 P3 | 分享卡片 | 2-3天 | RN迁移完成 | 
| 🟢 P4 | 内容深度（大限/流年等） | 持续 | 核心流程稳定 | 差异化竞争力 |
| 🟢 P4 | 多语言 | 1-2周 | 内容深度完成 | v2考虑 |

---

## 六、当前文件清单

```
MysticZodiac_latest/
├── docs/                          ← GitHub Pages目录
│   ├── index.html                 ← Demo主文件（~290KB，完整onboarding+所有页面）
│   ├── app-config.js              ← API Key配置（⚠️已暴露）
│   ├── wisdom-engine.js           ← AIEngine（prompt模板+DeepSeek API调用）
│   └── supabase-edge-function-proxy.md  ← Edge Function方案（待创建）
├── app/
│   ├── index.html                 ← 完整版（多script引用版）
│   ├── personality-engine.js      ← 性格测试引擎（已完成）
│   ├── share-cards.js             ← 分享卡片生成器（已完成）
│   ├── ai-engine.js               ← 旧版AI引擎
│   ├── compliance.js              ← 合规模块（已完成）
│   └── payment-module.js          ← 支付模块（已完成）
├── ziwei/                         ← 紫微斗数排盘引擎
├── assets/                        ← 资源文件
├── marketing/                     ← 营销素材
├── play_store/                    ← Google Play上架素材
└── PRD-v2.1.md                    ← 产品设计文档
```

> **一句话建议**：先搞定API Key（今天就能做），然后全力冲刺React Native版本，把Demo搬成真App，再准备上架材料。
