# MysticZodiac MVP核心功能开发计划

## 项目背景
- 项目名：Mystic Zodiac（东方神秘学占星App海外版）
- 技术栈：React Native + Supabase + DeepSeek + Firebase
- 当前状态：Demo 2.0已完成Onboarding流程、命盘主页、基础功能

## 日程任务要求
需要完成6个核心功能：
1. 生肖+五行性格测试引擎（算法逻辑）
2. 每日运势生成（AI驱动）
3. 社交分享卡片生成器（爆款传播核心）
4. 关系配对功能（完善）
5. Google Play合规：加"For entertainment purposes only"免责声明
6. 订阅+内购支付集成

## 开发计划

### Phase 1: 核心算法引擎
**1.1 生肖+五行性格测试引擎**
- 开发独立的性格测试算法
- 12生肖性格映射表
- 五行性格特征库
- 生肖+五行交叉分析逻辑
- 输出：性格类型+详细描述

**1.2 关系配对算法完善**
- 优化Soulmate Portrait算法
- 完善Chart Compatibility评分系统
- 添加三合/六合/六冲/相刑判断逻辑

### Phase 2: AI驱动功能
**2.1 每日运势生成（AI驱动）**
- 设计DeepSeek API调用接口
- 构建每日运势Prompt模板
- 集成到Oracle Tab
- Fallback数据（无API时）

**2.2 AI性格解读生成**
- 基于生肖+五行性格测试结果
- 生成个性化性格描述

### Phase 3: 社交分享系统
**3.1 分享卡片生成器**
- 命盘身份卡（Destiny Card）
- 每日天机卡（Daily Whisper Card）
- 命定之缘卡（Soulmate Card）
- 使用Canvas/HTML2Canvas生成图片

**3.2 分享功能完善**
- 添加分享按钮到各页面
- 社交平台分享集成
- 分享数据统计

### Phase 4: 合规与支付
**4.1 Google Play合规**
- 添加"For entertainment purposes only"免责声明
- 更新App描述
- 添加隐私政策链接

**4.2 订阅+内购支付集成**
- Credit购买流程完善
- 订阅方案设计（Starter/Popular/Premium/Pro）
- 支付接口预留（React Native IAP）

## 技术实现路径

### 分享卡片生成
```javascript
// 使用html2canvas或Canvas API生成分享图片
// 1. 创建隐藏的分享卡片DOM
// 2. 使用html2canvas转换为canvas
// 3. canvas.toDataURL()生成图片
// 4. 触发下载或分享
```

### AI集成架构
```javascript
// DeepSeek API调用
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }]
  })
});
```

## 交付产物
1. `MysticZodiac/app/index.html` - 集成所有新功能
2. `MysticZodiac/app/share-cards.js` - 分享卡片生成模块
3. `MysticZodiac/app/ai-engine.js` - AI驱动功能模块
4. `MysticZodiac/app/personality-engine.js` - 性格测试引擎
5. `MysticZodiac/MVP-开发进度.md` - 开发进度文档

## 时间估算
- Phase 1: 2小时
- Phase 2: 2小时
- Phase 3: 2小时
- Phase 4: 1小时
- 集成测试: 1小时
- 总计: 8小时

*最后更新：2026-06-04*
