# 分支表

谁在改什么,在哪条分支。改之前看一眼,改完更新自己那行。

## 状态
- 🟡 改中(别人别动)
- ✅ 可以合 main

## 表

| 模块 | 谁 | 分支 | 状态 |
|---|---|---|---|
| review 输入页 + 笔记入口 (Clock 按钮 + Previous Sessions 列表 + Conversation 详情) | max | `feat/review-input-page` | ✅(已合 main) |
| goal 屏按钮三态(草稿) | max | `page/goal-style-unify` | 🟡 |

## 规则
1. 改之前在表里写自己那行,标 🟡
2. 自测通过,改 ✅
3. 所有 ✅ 凑齐了一起合 main
4. 合完删自己那行

---

## 当前在跑的端口 (并排看用)

| 端口 | 目录 | 分支 | 启动方式 | 备注 |
|---|---|---|---|---|
| 5182 | `uply-review` | `feat/review-input-page` (= main) | `npm run dev -- --port 5182 --strictPort` | **最新版本**,vite 内置 `/api/realtime-token` 中间件 |
| 5179 | `uply-ab` | `try/voice-merge` | `npm run dev -- --port 5179` | 同 main, 早一些 |
| 5173 | `uply` | `feat/review-v5-update` | `npm run dev` | 旧基线 |
| 5174 | `uply-main` | `save/voice-wip-2026-05-24` (备份) | `npm run dev -- --port 5174` | 旧 voice 备份 |
| 3000 | `uply-main` | 同上 | `vercel dev --listen 3000` | 演示真 vercel dev 流程 |
| 5180 | Downloads `Onboarding界面设计 (4)` | n/a | `npm run dev -- --port 5180` | 设计稿参考 (4) |
| 5181 | Downloads `Onboarding界面设计 (5)` | n/a | `npm run dev -- --port 5181` | 设计稿参考 (5) |

## 跑 main 最干净的方式

```bash
cd /Users/max/Max1031/Max_lab/uply-review   # 主 worktree, 当前 = main
npm run dev -- --port 5182 --strictPort
```

vite 内置的 `localRealtimeTokenApi()` 插件会自动处理 `/api/realtime-token`,需要 `.env.local` 里有 `OPENAI_API_KEY` (`vercel env pull .env.local` 可拉取)。
