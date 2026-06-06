# Mystic Fate 紫微斗数排盘引擎评估报告

## 概述

项目路径: `/app/data/所有对话/主对话/MysticZodiac_latest/ziwei/`

引擎为纯 **TypeScript** 实现，编译目标 ES2020 / CommonJS，单依赖仅有 `lunar-javascript`（npm 包），无浏览器 DOM 操作依赖。

---

## 一、引擎功能覆盖评估

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 阴阳历转换 | ✅ 完整 | 依赖 `lunar-javascript` 进行公历→农历转换 |
| 四柱（年/月/日/时柱） | ✅ 完整 | 手动计算年柱公式，月柱由年干+月数推，日柱用儒略日，时柱用日干+时辰 |
| 五行局 | ✅ 完整 | 年干→五行局映射表 |
| 定十二宫（命宫/身宫） | ✅ 完整 | 命宫=(月+时辰) %12，身宫=(月+时辰+10)%12 |
| 紫微星系安星 | ✅ 完整 | 紫微→天机→太阳→武曲→天同→廉贞，逆时针隔宫 |
| 天府星系安星 | ✅ 完整 | 天府→太阴→贪狼→巨门→天相→天梁→七杀→破军，顺时针隔宫 |
| 紫微定位表 | ✅ 有实现 | 按五行局+生日查偏移量 |
| 辅星安星 | ⚠️ 部分完整 | 左辅/右弼/文昌/文曲/天魁/天钺/火星/铃星/地空/地劫/陀罗/擎羊 已实现 |
| 四化飞星 | ✅ 完整 | 年干→化禄/化权/化科/化忌 标准表 |
| 纳音 | ✅ 完整 | 60甲子纳音硬编码表 |

**发现的不足/已知限制：**

1. **阴阳历转换依赖外部包**：`lunar-javascript` 的 `require('lunar-javascript')` 使用 CommonJS 动态 require，在 React Native 中可能引发兼容问题
2. **`index.ts` 中的 `convertToLunar()` 降级回退非常粗糙**：仅做了 `approxLunarDay = diffDays + 1` 的近似，这个回退不可用于生产
3. **月柱计算采用农历月直接代入**：但公式 `(yearStemIndex*2 + month) % 10` 是按节气月（寅月为正月）来算的，直接用农历月在某些月份可能错位
4. **紫微定位偏移量表过于简化**：README 中展示的和 `stars.ts` 实现的均为"每10天一档"，而传统算法中水二局需逐日算的细致度还不够
5. **辅星中缺失`禄存`、`天马`、`天刑`、`天姚`、`解神`等常见乙级星**：目前仅实现了12颗辅星
6. **身宫公式与命宫公式**：当前实现 `shenGongIndex = (month + hour + 10) % 12`，但传统算法中身宫计算方式（命宫逆时针/或月+时+常数）存在流派差异
7. **type.ts 中 `MAIN_STARS` 将左辅右弼同时列在主星和辅星**：辅助星列表和主星列表存在名称重复

---

## 二、依赖与运行环境分析

### 依赖一览

```
dependencies:
  lunar-javascript: ^1.6.0    ← 唯一的运行时依赖

devDependencies:
  @types/node, ts-node, ts-node-dev, typescript
```

### React Native兼容性

| 检查项 | 结果 | 说明 |
|--------|------|------|
| DOM操作（window/document） | ✅ 无 | 完全无DOM依赖 |
| 文件系统（fs） | ✅ 无 | 未使用任何Node fs模块 |
| CommonJS require | ⚠️ 有 | `require('lunar-javascript')` 出现在 `lunar.ts` 中 |
| ES Module 语法 | ✅ 可用 | 源码为 TypeScript，可通过 bundler 转 ESM |
| Date 操作 | ✅ 安全 | 仅使用标准 Date 对象 |
| Math/纯计算 | ✅ 安全 | 全部为纯数值/枚举运算 |
| Node特有API | ✅ 无 | 无 `process`、`Buffer`、`stream` 等 |

**关键结论**：`lunar-javascript` 本身是纯 JS 无外部依赖的包，但它在 React Native 中通过 `require()` 引入可能需要通过 `metro.config.js` 配置或改用 ESM 方式引入。引擎本身的算法代码（`palace.ts`、`stars.ts`、`assist-stars.ts`、`sihua.ts`、`nayin.ts`、`types.ts`）**100%纯JS/TS计算**，无平台限制。

---

## 三、代码质量评估

| 维度 | 评分 | 说明 |
|------|------|------|
| 类型安全性 | ⭐⭐⭐⭐⭐ | 全文件 TypeScript，enum + interface + type 定义完整 |
| 模块化 | ⭐⭐⭐⭐⭐ | 7个文件职责清晰分离，接口定义良好 |
| 可测试性 | ⭐⭐⭐⭐ | 有完备的测试用例框架 |
| 错误处理 | ⭐⭐⭐ | `convertToLunar` 的 try-catch 降级较弱，部分函数无错误边界 |
| 可读性/注释 | ⭐⭐⭐⭐ | JSDoc + 中文/英文注释良好 |
| 配置管理 | ⭐⭐⭐⭐ | tsconfig 合理，package.json 规范 |

**可直接复用部分：**
- `types.ts` — 所有类型定义
- `nayin.ts` — 纳音表，纯硬编码查找表
- `sihua.ts` — 四化表，纯硬编码+查找逻辑
- `palace.ts` — 宫位计算，纯公式
- `stars.ts` — 主星安星，纯查找表+偏移计算
- `assist-stars.ts` — 辅星安星，纯查找表+公式

**需要改动部分：**
- `lunar.ts` — 需将 `require('lunar-javascript')` 替换为 RN 兼容的导入方式，或替换为内联农历算法
- `index.ts` — 同样存在 `require('lunar-javascript')` 调用

---

## 四、排盘准确性评估与建议

### 已发现的准确性风险

1. **日柱计算的双重路径（lunar.ts vs index.ts）**：
   - `lunar.ts` 的 `getLunarInfo()` 通过 `lunar-javascript` 提供的 `lunar.getDayGan()` / `lunar.getDayZhi()` 获取日柱
   - `index.ts` 的 `getYearPillarAndPillars()` 里的 `getDayPillar()` 使用 `getJulianDayNumber()` 手动计算
   - 两种路径可能在闰月场景下不一致

2. **月柱的节气问题**：传统紫微斗数用"节气月"而非"农历月"定月柱，当前直接用农历月，可能在跨节气时出现偏差

3. **紫微定位的精度**：当前实现是"每10天一个偏移量"，传统算法中水二局等是每日逐格定位的

4. **降级回退代码不可用于生产**：`index.ts` 的 `convertToLunar()` 的回退逻辑过于简单

### 改进建议

#### 必须修复（高优先级）
1. **将 `lunar-javascript` 的引入改为 ESM 兼容模式**，或使用支持 React Native 的农历计算替代方案
2. **去掉 `index.ts` 中的 `convertToLunar()` 粗糙回退**，确保同步版也能用 `lunar-javascript` 的同步API
3. **移除或重命名 `MAIN_STARS` 中重复的左辅右弼条目**，避免混淆

#### 建议优化（中优先级）
4. **紫微定位算法细化**：改为按日精确计算偏移，而非"十天一档"
5. **补全乙级星**：增加禄存、天马、天刑、天姚、解神、破碎等常见辅星
6. **月柱引入节气判断**：判断出生日在节气前后，决定使用上一月还是本月

#### 架构建议
7. **分离"农历转换"与"排盘算法"**：创建独立的 `lunar-adapter.ts` 层，封装对 `lunar-javascript` 的所有依赖，方便将来替换
8. **增加单元测试覆盖**：与已知在线紫微排盘工具（如元亨利贞、紫微科技网等）交叉验证至少20组不同八字

---

## 五、React Native 迁移方案总结

### 方案A：直接适配（推荐 ✅）

**工作量**：约 2-3 天
**步骤**：
1. 保留所有 `*.ts` 文件（types、palace、stars、sihua、nayin、assist-stars）不变
2. 修改 `lunar.ts` 和 `index.ts`，将 `require('lunar-javascript')` 替换为：
   ```ts
   import { Solar, Lunar } from 'lunar-javascript';
   ```
3. 在 RN 项目中通过 metro.config.js 确保 `lunar-javascript` 正确解析
4. 将 `ziwei/` 整体作为本地模块放入 RN 项目
5. 补齐乙级星和精度改进

### 方案B：自建农历算法（可选，如无法解决RN兼容问题）

**工作量**：约 5-7 天
**步骤**：
1. 在 `lunar.ts` 中用纯 JS 实现农历-公历转换（1900-2100年农历数据表嵌入代码）
2. 删除 `lunar-javascript` 依赖
3. 其余文件完全不变

### 方案C：保持现状用

下下策，不推荐。当前 `require()` 用法在 RN 中有兼容风险，且农历回退不可靠。

---

## 结论

**总体评价**：该引擎架构设计良好，类型安全，模块化清晰。**核心排盘算法（安星、定宫、纳音、四化）均可在 React Native 中直接复用**。主要改造点在 `lunar.ts` 和 `index.ts` 中的第三方包引入方式。

**可直接复用的文件（6个）**：`types.ts`、`palace.ts`、`stars.ts`、`assist-stars.ts`、`sihua.ts`、`nayin.ts`

**需要适配的文件（2个）**：`lunar.ts`、`index.ts`

**推荐方案**：方案A，约2-3天完成适配，达到生产就绪。
