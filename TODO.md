# Backlog

记录暂时没做但已经决定要做的事. 完成一项就划掉而不是删, 保留追溯.

## High

### [ ] 合并版 "Final Presentation After Party" 页面 (替换 scene+stage+conversation)
**触发**: 用户 2026-05-19 发来一张截图 (`/Users/max/Library/Containers/com.tencent.xinWeChat/.../RWTemp/2026-05/ae6392.../c0d16cf....png`), 内容是一个把 SceneScreen + StageScreen + ConversationScreen 合并的页面: 顶部 banner "FINAL PRESENTATION AFTER PARTY" + 左上 "Add alumni on LinkedIn" checkbox + 派对场景 (科学楼前 / 桌子 / 彩旗) + 紫色长条 silhouette + 信息卡 "Female Senior · Same Major / Seen at the Library Before" + "Want to say hi first?" + mic 按钮 + 顶部对话气泡.
**做什么**: 需要用户补一份对应的 tsx 源码 (本地搜过, WeChat / Downloads / Desktop 都没有), 或者照图重建. 落地后替换当前 App.tsx 里的 scene/stage/conversation 三屏为这一屏.
**何时**: token-alignment 后, 在开始正式 `page/*` 调优之前.
**关联截图**: 见 system 消息附图 "Image #4" / "Image #5".
**已确认资产** (待重建时从这里搬到 `src/assets/`):
- 背景: `/Users/max/Library/Containers/com.tencent.xinWeChat/.../msg/file/2026-05/Onboarding界面设计 (1)/src/imports/background.jpg` (1.9 MB, 派对场景科学楼前)
- 学姐人物: 同上 `src/imports/ppl.png` (880 KB, 长条紫色 silhouette)
- 其他备选物料同目录, 见 `/tmp/imports-preview.html`

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

### [x] Token alignment 第一轮 (2026-05-19, commit `23d2158`)
16 个高频 hex 替换成 `.design/tokens.css` 变量, 10 个 handoff 专属色板变量入库, 11/13/18px 字号 → token. 视觉无差异. 详见 commit message.
