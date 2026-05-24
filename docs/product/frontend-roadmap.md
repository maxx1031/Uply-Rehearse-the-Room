# Uply Frontend Roadmap

## 当前对齐原则

- PRD 是最高产品源，路径为 `docs/product/PRD.md`。
- Handoff package 和 Google Docs 是输入材料，不再作为唯一执行口径。
- 每个前端小票必须回指 PRD 段落。
- 每个页面改动必须跑 `pnpm typecheck` 和 `pnpm build`。
- 涉及 UI 的页面需要截图归档到 `docs/iterations/`。

## 差异总表

| ID | 状态 | PRD 引用 | 差异 | 目标 |
|---|---|---|---|---|
| F01 | This packet | PRD §2.2 | Home 仍是旧 dashboard | Home golden path，Today's Script 固定 Coffee chat practice |
| F02 | This packet | PRD §2.3 | Mission CTA 未进入主流程 | Mission briefing 进入 Voice Practice |
| F03 | This packet | PRD §3 | onboarding 没有稳定画像契约 | 规则生成 OnboardingProfile 和 prompt seed |
| F04 | This packet | PRD §2.4 | 没有主流程 voice practice | 接 Realtime 2 和 mock path |
| F05 | This packet | PRD §2.5, §2.6 | 没有 Complete 和 Post-Practice Review | 新增 +25、streak、feeling、highlight、rewrite |
| F06 | This packet | PRD §2.8 | 没有 transcript record、memory card 和 coach chat session state | 前端 state 保存 v0 数据 |
| F07 | Later | PRD §2.9 | transcript 分析未持久化 | 后端 LLM post-processing 和 profile update |
| F08 | This packet | PRD §2.7 | Coach tab 仅为占位 | Coach Hub v0: composer → chat → 归档列表 → read-only 回看 |
| F09 | Later | PRD §2.8, §4 | Records archive 未实现 | 完整历史档案、筛选、搜索和长期归档 |

## Work Packet, Home Golden Path + Realtime 2

范围:

- `docs/product/PRD.md`
- `docs/product/frontend-roadmap.md`
- `api/realtime-token.js`
- `src/lib/onboardingProfile.ts`
- `src/lib/useRealtime.ts`
- `src/App.tsx`
- `src/pages/epilogue/Epilogue.tsx`
- `src/pages/mission/MissionPage.tsx`
- 新增主流程 practice、complete、review 页面

验收:

- Home 顶部用户区、Today's Script、2 个 module card、4 tab nav 都显示。
- Today's Script 标题固定为 `Coffee chat practice`。
- Home Today's Script 和 module card 都能进入 Mission。
- Mission 展示 Jordan、personal goal、tips、success example。
- Mission CTA 进入 Voice Practice。
- Voice Practice 支持 Realtime 和 `?mock=1`。
- Voice Practice 有 10 分钟上限、Pause、Resume、Exit 二次确认。
- 自然完成进入 Mission Complete，再进入 Post-Practice Review。
- Exit 回 Home，不加 pts，不进 Post-Practice Review。
- Post-Practice Review feeling 必选，Done 写 memory card state，Try again 回 Mission。
- `pnpm typecheck` 和 `pnpm build` 通过。
- 截图保存到 `docs/iterations/`。

## Work Packet, Coach Hub v0

范围:

- `docs/product/PRD.md`
- `docs/product/frontend-roadmap.md`
- 新增 `src/pages/coach/CoachHubPage.tsx` (composer + Performance Review 列表)
- 新增 `src/pages/coach/CoachChatPage.tsx` (chat 主屏)
- 新增 `src/pages/coach/CoachChatViewPage.tsx` (read-only 回看)
- 新增 `src/lib/coachChat.ts` (CoachChatSession state、归档逻辑、mock AI 回复)
- 改 `src/App.tsx` 加 Coach tab 路由

验收:

- Coach Hub 首屏: 顶部剧场视觉、composer、Performance Review 区域、底部 4 tab nav。
- Composer placeholder 为 `Describe your scenario or conversation.`；中间黄色 ↑ 提交；右下 mic 按住录音松手转文字填入；不渲染 `+` 按钮。
- Composer 提交后切到 chat 页，紫/黄气泡，无 timer，无条数限制；顶部 Back 回 Coach Hub 首页并把当前 chat 归档到列表头部。
- Performance Review 是单列文字列表，每行展示用户首条消息截断 + 相对时间；空态展示大喇叭插画 + 引导文案。
- 列表点一行进入 read-only 回看页，底部无 composer，顶部 Back 回首页。
- v0 无 `Remember this?`、无 `Ask AI` / `Practice again` 按钮、无删除 / 编辑入口。
- `pnpm typecheck` 和 `pnpm build` 通过。
- 截图保存到 `docs/iterations/`。

## 后续 Work Packet

- Coach memory later: 长期记忆 (CoachMemoryItem) 与 `Remember this?` 确认流程，AI 可在 chat 中提议保存。
- Coach voice chat later: chat 内 AI 语音输出、用户语音直接对话。
- Coach 历史管理 later: 列表项删除 / 编辑、搜索、按时间分组。
- Records Archive later: Records tab 展示完整 transcript records、memory cards、搜索、筛选和长期归档。
- 真实后端持久化 pts、streak、transcript、memory cards、coach chat sessions。
- 独立 LLM transcript post-processing 服务。
- 视觉债清理，特别是旧 inline hex、emoji brand icon、旧字体引用。
