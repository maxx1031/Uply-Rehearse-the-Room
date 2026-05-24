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
| F05 | This packet | PRD §2.5, §2.6 | 没有 Complete 和 Review | 新增 +25、streak、feeling、highlight、rewrite |
| F06 | This packet | PRD §2.7 | 没有 transcript record 和 memory card state | 前端 state 保存 v0 数据 |
| F07 | Later | PRD §2.8 | transcript 分析未持久化 | 后端 LLM post-processing 和 profile update |
| F08 | Later | PRD §4 | Records/Coach tab 未实现 | 独立页面 work packet |

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
- Mission 展示 Maya、personal goal、tips、success example。
- Mission CTA 进入 Voice Practice。
- Voice Practice 支持 Realtime 和 `?mock=1`。
- Voice Practice 有 10 分钟上限、Pause、Resume、Exit 二次确认。
- 自然完成进入 Mission Complete，再进入 Review。
- Exit 回 Home，不加 pts，不进 Review。
- Review feeling 必选，Done 写 memory card state，Try again 回 Mission。
- `pnpm typecheck` 和 `pnpm build` 通过。
- 截图保存到 `docs/iterations/`。

## 后续 Work Packet

- Records tab 展示 transcript records 和 memory cards。
- Coach tab 展示轻量 intervention 和 Journey Map。
- 真实后端持久化 pts、streak、transcript、memory cards。
- 独立 LLM transcript post-processing 服务。
- 视觉债清理，特别是旧 inline hex、emoji brand icon、旧字体引用。
