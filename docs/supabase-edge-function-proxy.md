# Supabase Edge Function 代理方案

## 背景

MysticFate 的 DeepSeek API Key (`sk-e6078716...`) 此前被硬编码在 `docs/app-config.js` 中并推送到了公开 GitHub 仓库。**该 Key 已废弃，已通知用户登录 DeepSeek 后台撤销。**

为了防止 API Key 再次暴露，生产环境必须通过 **Supabase Edge Function 代理** 调用 DeepSeek API，API Key 仅存在于服务器环境变量中。

---

## 架构

```
前端 (浏览器)
  │
  ├── 生产环境 ──→ Supabase Edge Function ──→ DeepSeek API
  │                    (Key 在服务器端)
  │
  └── 开发环境 ──→ 直接调用 DeepSeek API
                       (Key 来自 localStorage)
```

## 路由逻辑

前端代码 (`wisdom-engine.js`) 自动判断：

1. **优先**：若 `APP_CONFIG.SUPABASE_EDGE_FUNCTION_URL` 有值，先走 Edge Function 代理
2. **回退**：若代理失败或无代理 URL，回退到直接调用 DeepSeek API（本地开发/调试用）
3. **最终**：若两者都不可用，使用本地预设 fallback 响应

---

## 部署步骤

### 1. 创建 Edge Function

在 Supabase 项目根目录创建：

```bash
supabase functions new deepseek-proxy
```

将生成的 `supabase/functions/deepseek-proxy/index.ts` 替换为以下内容：

```typescript
// Follow this setup guide to integrate the Deno runtime:
// https://deno.land/manual/examples/deploy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY') || ''
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    const body = await req.json()

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### 2. 设置环境变量

在 Supabase Dashboard 中设置：

| Key | Value |
|-----|-------|
| `DEEPSEEK_API_KEY` | `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

或通过 CLI：

```bash
supabase secrets set DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 部署

```bash
supabase functions deploy deepseek-proxy --no-verify-jwt
```

部署完成后会返回一个 URL，类似：
```
https://<project-ref>.supabase.co/functions/v1/deepseek-proxy
```

### 4. 配置前端

在 `docs/app-config.js` 中设置（或通过 localStorage）：

```javascript
// 方式1：直接修改 app-config.js
SUPABASE_EDGE_FUNCTION_URL: 'https://<project-ref>.supabase.co/functions/v1/deepseek-proxy',

// 方式2：通过 localStorage（不提交到 Git）
localStorage.setItem('SUPABASE_EDGE_FUNCTION_URL', 'https://<project-ref>.supabase.co/functions/v1/deepseek-proxy')
```

---

## 安全说明

| 项目 | 说明 |
|------|------|
| API Key 位置 | 仅存于 Supabase 环境变量，绝不进入前端代码 |
| 前端暴露 | GitHub 仓库中的代码不含任何 API Key |
| 开发调试 | 可通过 `localStorage` 临时设置 Key，不提交到 Git |
| CORS | Edge Function 已配置跨域，可被任何来源调用（生产环境建议限制来源） |

## 生产环境强化建议

1. **限制 CORS 来源**：将 `Access-Control-Allow-Origin: '*'` 改为具体域名
2. **请求频率限制**：在 Edge Function 中加入简单的速率限制
3. **请求验证**：验证请求体格式，防止滥用
4. **日志监控**：Supabase 提供 Edge Function 日志，可监控异常调用

---

## 文件变更清单

| 文件 | 变更 |
|------|------|
| `docs/app-config.js` | 移除硬编码 API Key，添加 `SUPABASE_EDGE_FUNCTION_URL` 配置项 |
| `docs/wisdom-engine.js` | 添加 `callDeepSeekAPI_viaProxy` 函数，修改 `callDeepSeekAPI` 优先走代理 |
| `docs/supabase-edge-function-proxy.md` | 本方案文档（新文件） |
| `supabase/functions/deepseek-proxy/index.ts` | Edge Function 源码（需手动创建部署） |
