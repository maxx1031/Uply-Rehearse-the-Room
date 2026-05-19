# Backlog

记录暂时没做但已经决定要做的事. 完成一项就划掉而不是删, 保留追溯.

## High

### [ ] Token alignment 统一过一遍
**触发**: intro 段从 Vercel 原样导入会带进 inline hex (`#e8e4df` / `#f5f2ee` / `#1f1535` 等), 暂时违反 CLAUDE.md 第 1 条 "禁止 hex 直写".
**做什么**: 单独分支 `chore/align-tokens`, 把 intro 6 屏所有 hex 映射成 `.design/tokens.css` 里的变量. 必要时往 tokens.css 加新变量 (例如外壳灰 `--bg-shell`, 与 `--bg-paper` 不同语义).
**何时**: 等状态机串通能跑 (`chore/unify-state-machine` 合并后) 立刻做, 在第一次正式 `page/*` 调优之前.

### [ ] Voice / OpenAI Realtime API 集成
**触发**: Q4 决定先按 Handoff 的 tap-to-pick 走, voice chat 暂不接.
**做什么**: 把旧仓库的 `api/realtime-token.js` (Vercel serverless function) + `src/app/lib/useRealtime.ts` + `VoiceOnboardScreen` / `ChatRoundsScreen` 系列重新接进来, 作为 ConversationScreen 的可选 voice 分支.
**何时**: 主流程稳定后再考虑, 当前不阻塞.
**依赖**: `OPENAI_API_KEY` 通过 `vercel env add` 配置.

## Medium

### [ ] 真实 SVG 物料导入
**触发**: `.design/assets/{icons,illustrations}/` 目录占位中.
**做什么**: 整理品牌图标 (ticket / bell / coffee / bar) 和插画 (theater-stage / silhouette-blur / uply-mascot) 进对应目录, 更新 `assets/README.md`.

### [ ] Vercel 部署链路接入
**触发**: commit message 模板要求 Preview URL, 没接前 Preview 字段是空的.
**做什么**: `vercel link` 关联项目, 验证 push 后 preview 自动出 URL.

## Done
(空)
