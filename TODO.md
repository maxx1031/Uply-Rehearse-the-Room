# Backlog

记录暂时没做但已经决定要做的事. 完成一项就划掉而不是删, 保留追溯.

## High

### [ ] After Party 屏遗留小调 (优先级看用户)
**当前状态**: 主体已落地, commit `4acfc3d` (`src/pages/act-i/AfterPartyScene.tsx`). 替换原 SceneScreen + StageScreen 两屏 → 单屏两段 phase (空场 → 主角浮现 + UI overlay).
**还可做** (看用户后续要不要):
- 主角剪影独立动画 (呼吸 / 发光) — 当前是 `scene-with-silhouette.png` 整图淡入, 主角动不了. 想动需要再切双层: `scene-bg.jpg` 底 + 主角抠图的透明 PNG, 单独 motion 控制
- ConversationScreen 是否要继续保留 (handoff 那套倒数 3 + 对话分支树) 或者合并进 After Party 屏 (mic 一点直接对话, 不切屏)
- "Add alumni on LinkedIn" checkbox 当前纯装饰, 是否要绑定到 LinkedInScreen 的勾选状态

### [ ] Token alignment phase 2 (字号档 + 剩余小众色)
**触发**: 第一轮 `chore/align-tokens` (commit `23d2158`) 把 16 个高频 hex 和 11/13/18px 字号对齐了, 但还有约 60 处低频 hex (`#7a6ee0` / `#b0aed4` / `#f7f5f2` / `#d8d0f9` 等) 和约 55 处其他字号 (`14/15/20/22px` 等) 没对.
**做什么**: 先扩 tokens.css 加 `--fs-sm 12px / --fs-md 14px / --fs-lg 15px / --fs-h3 20px / --fs-h0 22px` 这种中间档, 再批量 sed 替换. 颜色那些低频 hex 按需做 snap 决定: 接近 token 就 snap, 太远的留 inline (个别 page 主色).
**何时**: 当前不阻塞, 等用户进入 page 调优阶段触到具体页面再做更现实.

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

### [x] After Party 派对场景屏 (2026-05-19, commit `4acfc3d`)
两段 phase 自动切换: scene-bg.jpg 空场 ~2.4s → scene-with-silhouette.png 主角浮现 + UI overlay (banner / LinkedIn checkbox / 对话气泡 / 信息卡 / mic). 替换旧 SceneScreen + StageScreen. 旧文件未删, 留 `chore/cleanup` 单独清.

### [x] Token alignment 第一轮 (2026-05-19, commit `23d2158`)
16 个高频 hex 替换成 `.design/tokens.css` 变量, 10 个 handoff 专属色板变量入库, 11/13/18px 字号 → token. 视觉无差异. 详见 commit message.
