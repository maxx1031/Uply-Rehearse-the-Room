# Uply Product PRD

## 1. 产品定位

Uply 是面向大学生和早期职业人群的社交训练 App。产品把社交练习包装成剧场体验，让用户先在低压力场景中排练，再把更具体、更轻量的表达带回真实生活。

当前 MVP 聚焦一条完整主路径:

1. onboarding 剧场开场。
2. Final Presentation After Party 轻对话任务。
3. onboarding 分析与自我校准。
4. 用户选择一个小社交目标。
5. Home 固定展示 `Coffee chat practice`。
6. Mission 展示 partner、个人目标和策略，内部生成 practice prompt seed。
7. Voice Practice 使用 OpenAI Realtime 2 进行主流程语音练习。
8. 自然完成后进入 Mission Complete 和 Review。
9. Review Done 后回 Home，并生成 memory card state。

PRD 是本仓库最高产品源。Google Docs、handoff package 和本地 spec 都作为输入材料，不再单独作为执行口径。

当前本地实现快照（2026-05-26）:

- Home -> Mission -> Voice Practice -> Mission Complete -> Review -> Home 已有 v0 主链路。
- Voice Practice 已接 `useRealtime`，支持真实 Realtime WebRTC 和 `?mock=1` 脚本模式。
- Review 已有前端规则 evaluator，能基于 transcript 生成 highlight 与 rewrite。
- 主要未闭环项是 onboarding 选择接入真实 `OnboardingProfile`、memory card / transcript record state 保存、pts / streak 状态更新，以及 Home 视觉与文案按 golden path 收口。

## 2. 核心用户路径

### 2.1 Onboarding

目标: 让用户快速理解产品隐喻，并用一段低风险对话生成第一份社交画像。

目标路径:

1. 用户注册或登录。
2. 生成剧场票。
3. 幕布打开，进入 Final Presentation After Party。
4. 用户遇到 Maya，任务是 Connect on LinkedIn。
5. 用户完成或跳过任务。
6. 完成任务后直接进入 analyzing loading。
7. 系统展示 stage role 结果。
8. 用户用 5 点自我校准回答这个结果是否贴近真实的自己，点选后立即显示对应系统回复。
9. 用户选择一个小社交目标。
10. slogan 过场后进入 Home。

当前实现状态:

- 已实现 ticket、curtain、after party、task modal、dialogue、analyzing、result、reflection、goal、slogan、Home。
- 已接到 Home 之后的主流程入口，Home 可以进入 Mission。
- 剩余差异是 `selectedGoal` 和 `reflectionBucket` 目前只在 App state 中被捕获，尚未用于构建并传递稳定 `OnboardingProfile`。Mission 和 Practice 仍使用默认 profile。

### 2.2 Home

目标: 让用户看到今天要练的固定 starter lesson，并从 Home 进入 Mission。

目标状态:

- 顶部显示头像、`WELCOME BACK`、用户昵称、pts、streak。
- Today's Script 卡固定展示 `Coffee chat practice`。
- 副信息固定为 `Applied AI PM coffee chat · gentle pace · 10 min`。
- onboarding 选择不改变 Today's Script 标题。
- onboarding 选择只影响 Mission personal goal 和内部 practice prompt seed。
- Networking Modules 显示 2 个模块卡，MVP 为 `LinkedIn Opener` 和 `Small Ask`。
- 底部导航显示 4 个 icon tab: Home、Coach、Records、Me。

核心文案:

- 顶部欢迎: `WELCOME BACK`
- 默认用户: `Mia`
- pts: `320 pts`
- streak: `2-day streak`
- Today's Script eyebrow: `TODAY'S SCRIPT`
- Today's Script title: `Coffee chat practice`
- Today's Script subtitle: `Applied AI PM coffee chat · gentle pace · 10 min`
- CTA: `Start Practice`

当前实现状态:

- 已有顶部用户区、主练习卡、Networking Modules、4 icon tab。
- 主练习卡标题已固定为 `Coffee chat practice`，点击 play 能进入 Mission。
- module card 点击也能进入 Mission。
- 当前仍是旧 film reel / theater dashboard 结构，尚未完全按 Today's Script golden path 排布。
- 默认用户、pts、streak、CTA 文案和模块数量仍与目标状态不完全一致。当前 stats 为硬编码展示，没有接 App 状态。
- 当前 Review tab 是旧 `ReviewScreen`，不是 memory cards / transcript records 的 Records UI。

### 2.3 Mission

目标: 在正式练习前，把场景、对话伙伴、用户个人目标和可用策略对齐，并在内部准备 practice prompt seed。

目标状态:

- 从 Home Today's Script 或 module card 进入。
- 顶部 Back 返回 Home，无确认。
- hero 展示 `TODAY'S MISSION` 和 `Coffee chat practice`。
- partner 信息为 Jordan Lee，Applied AI PM at a small AI startup，coffee chat。
- personal goal 来自 `OnboardingProfile.selectedGoal.personalObjective`。
- Tips & strategy 默认折叠，展开后显示 chips、2 到 3 条策略和 1 条 success example。
- CTA 文案为 `Curtain up`，进入 Voice Practice。
- Mission 不允许调难度或更换 Scene Role。
- Prompt seed 是内部数据，不在 Mission 或任何用户可见前端界面展示。

核心文案:

- 页面 eyebrow: `TODAY'S MISSION`
- 页面标题: `Coffee chat practice`
- partner: `Jordan Lee`
- partner role: `Applied AI PM at a small AI startup`
- meta: `Coffee chat`, `Gentle`, `10 min`
- personal goal title: `YOUR GOAL`
- strategy title: `Tips & strategy`
- CTA: `Curtain up`

当前实现状态:

- 已实现 `MissionPage`，从 Home 进入。
- 页面展示 `TODAY'S MISSION`、`Coffee chat practice`、Jordan Lee、coffee chat / gentle / 10 min、personal goal、Tips & strategy 和 success example。
- CTA 已是 `Curtain up`，并能进入 Voice Practice。
- 剩余差异是 Mission 目前接收 App 传入的默认 `OnboardingProfile`，还没有使用用户实际 onboarding goal 与 reflection 生成的 profile。

### 2.4 Voice Practice

目标: 让用户在 Coffee chat practice 中和 Jordan 进行一段低压力、可暂停、可退出、可复盘的语音练习。

目标状态:

- 使用 OpenAI Realtime WebRTC，mission flow 使用 `gpt-realtime-2`。
- 浏览器只拿 short-lived client secret，标准 API key 只在服务端。
- 视觉复用 onboarding starter scene 的背景与人物 silhouette。
- 左上 Tasks 面板默认展开，可折叠，不自动打勾。
- 屏幕同一时刻最多显示 1 个 dialogue bubble。
- 用户气泡使用浅黄色语义，partner 气泡使用紫色语义。
- 底部同一水平线显示 Exit、mic、Pause。
- 单次练习最多 10 分钟。
- Pause 冻结对话，停止当前输出，禁用 mic track，显示 Resume。
- 自然完成或 10 分钟到时进入 Mission Complete。
- `✕ Exit` 需要二次确认，确认后回 Home。

Exit 规则:

- `✕ Exit` 不计完成。
- 不加 pts。
- 不递增 streak。
- 不进入 Mission Complete。
- 不进入 Review。
- transcript 写入 Records state，当前 MVP 只保留数据，不展示 Records UI。

核心文案:

- scene title: `Coffee chat practice`
- partner label: `Jordan Lee`
- task title: `Tasks`
- mic label: `Tap to speak`
- pause: `Pause`
- resume: `Resume`
- exit confirm title: `End practice?`
- exit confirm actions: `Continue`, `End`

当前实现状态:

- 已实现 `PracticePage`。
- 使用 `useRealtime` 请求 mission flow token，真实模式走 OpenAI Realtime WebRTC，mock 模式走本地脚本。
- 视觉复用 after-party silhouette 场景图。
- 已有 Tasks 面板、单 bubble 展示、Exit / mic / Pause 底部控制、Pause / Resume、Exit 二次确认、10 分钟上限。
- Realtime mission prompt 通过 `promptSeed` 注入，并支持 `finish_practice` tool 结束练习。
- Exit 时会构造 `TranscriptRecord`，但 App 目前没有保存到 Records state。

### 2.5 Mission Complete

目标: 自然完成后给用户即时正反馈。

目标状态:

- 只在自然完成或时间到后出现。
- 进入此屏前写入 pts +25 和 streak +1。
- 约 1.5 到 2 秒 autoplay。
- tap anywhere 跳过到 Review。
- 无语音 narration。

核心文案:

- `Mission Complete`
- `+25 pts`
- `2-day streak` 或当前 streak。
- `tap anywhere to skip`

当前实现状态:

- 已实现 `MissionCompletePage`。
- 页面支持 1.8 秒自动进入 Review，并支持 tap anywhere 跳过。
- 剩余差异是 App 目前传入硬编码 `scoreDelta={120}` 和 `streak={3}`，尚未使用 Practice result 的 `scoreDelta: 25`，也没有真正写入 pts +25 和 streak +1 state。

### 2.6 Review

目标: 让练习结束后形成一条可操作的表达改进，不让复盘变重。

目标状态:

- 顶部显示 `+25 · streak` 角落 pill。
- feeling check 必选，选项为 `Good`、`Okay`、`Hard`。
- 未选择 feeling 前不展示 highlight 和 rewrite。
- Hard 时显示 supportive opening。
- Highlight 展示 transcript 中 1 句用户原句和 1 句 coach note。
- Try rewriting 展示用户原句、1 句 context note 和 1 条 alternative。
- Done 为主 CTA，回 Home。
- Try again 为次 CTA，回 Mission 同场景。
- 主流程不显示保存好句、生成 draft、真实行动入口、next script candidate 或小伙伴头像。

核心文案:

- feeling title: `How did it feel?`
- options: `Good`, `Okay`, `Hard`
- highlight title: `Your highlight`
- rewrite title: `Try rewriting`
- original label: `You said`
- alternative label: `Try smaller`
- buttons: `Try again`, `Done`

当前实现状态:

- 已实现 `ReviewPage`。
- 已有 feeling check，选择前不展示 highlight 和 rewrite。
- 已有 `ReviewDraft` 数据结构，内容来自 `buildFallbackReviewDraft(transcript, profile)`。
- Done 会构造 `MemoryCard` 并通过 `onDone(card)` 返回。
- 剩余差异是 Hard 时的 supportive opening 尚未单独展示，App 目前没有保存 MemoryCard，Try again 当前直接回 Practice 而不是先回 Mission。

### 2.7 Memory Card 与 Records State

目标: 把每次完成复盘后的可保留内容沉淀为可回看的数据。

目标状态:

- Review Done 后生成一张 memory card。
- memory card 保存在前端 state。
- transcript record 在自然完成和 Exit 时都写入 state。
- Records tab UI 不在本包实现。

当前实现状态:

- `MemoryCard`、`TranscriptRecord`、`PracticeSessionResult` 类型已定义。
- Practice 自然完成时会生成 `PracticeSessionResult`，包含 transcript、reviewDraft 和 scoreDelta。
- Exit 时会生成 `TranscriptRecord`。
- Review Done 时会生成 `MemoryCard`。
- 剩余差异是 App 目前只保存 `sessionResult`，没有维护 memory cards 和 transcript records state，因此数据会在回 Home 后丢失。

MemoryCard v0 字段:

- `id`
- `sceneTitle`
- `partnerName`
- `createdAt`
- `feeling`
- `highlightQuote`
- `highlightComment`
- `originalAsk`
- `rewriteAlternative`
- `scoreDelta`

### 2.8 Transcript 分析

目标: 用完整 transcript 生成更准确的 highlight、rewrite 和后续练习 prompt。

本包 v0:

- Realtime mission prompt 只负责 roleplay 和通过 `finish_practice` function call 结束练习，不负责评价用户表现。
- Review draft v0 由前端规则 evaluator 使用本次 transcript 和 `OnboardingProfile` 生成。
- fallback 不能阻塞 Review。
- 分析结果不能覆盖用户已选择的 `selectedGoal`。

当前实现状态:

- 已实现 `buildFallbackReviewDraft`。
- evaluator 会从用户 transcript 中挑选 highlight 和 ask，并按 selected goal 生成更小的 alternative。
- 如果 transcript 不足，会 fallback 到 prompt seed 的 suggested opener 或默认 ask。
- 尚未做后端 LLM post-processing，也没有把分析结果写回长期画像。

后续:

- 后端持久化 transcript。
- 独立 LLM post-processing transcript。
- 把 practice focus update 写回长期画像。

## 3. OnboardingProfile

`OnboardingProfile` 是 onboarding 到主流程的产品契约。v0 由前端规则生成，后续可替换成 LLM transcript 分析。

输入:

- `selectedGoal`: 用户在 GoalScreen 选择的小社交目标。
- `archetypeId`: onboarding stage role，当前默认 `quiet-observer`。
- `reflectionBucket`: 用户 5 点自我校准结果映射出的内部反馈桶，`left`、`mid`、`right`。
- 固定 onboarding 剧情节点: after party、Maya、LinkedIn connection。

输出:

- `selectedGoal`
- `archetypeId`
- `reflectionBucket`
- `evidenceQuotes`
- `strengths`
- `practiceFocus`
- `firstLessonPromptSeed`

Prompt seed 必须包含:

- scene title: `Coffee chat practice`
- partner: Jordan Lee，Applied AI PM at a small AI startup。
- personal goal。
- coach focus。
- opening context。
- success criteria。
- Realtime system prompt text。

Prompt seed 中的 roleplay 场景信息用于 Mission 到 Realtime session；onboarding snapshot / practice focus 只用于 Review evaluator 和后续调试，不进入用户可见界面，也不进入主流程 roleplay 角色的 prompt。

当前实现状态:

- 已实现 `buildOnboardingProfile(input)` 和 `buildDefaultOnboardingProfile()`。
- 支持 `small-talk`、`follow-up`、`ask-help`、`pitch` 四个 goal。
- `firstLessonPromptSeed` 已包含 Jordan 的角色、任务、success criteria、suggested opener 和 mission system prompt。
- App 当前仍在 Mission 和 Practice 中调用 `buildDefaultOnboardingProfile()`，尚未把 GoalScreen / ReflectionScreen 的真实选择传入 `buildOnboardingProfile()`。

## 4. MVP 范围

本包必须完成:

- PRD 与 frontend roadmap。
- OnboardingProfile 规则生成。
- Home golden path。
- Mission briefing。
- Main Voice Practice。
- Mission Complete。
- Review。
- MemoryCard 和 transcript record state。
- Realtime token endpoint 支持 onboarding 和 mission flow。
- mission flow 使用 `gpt-realtime-2`。

当前已完成 v0:

- OnboardingProfile 类型与规则生成。
- Home 到 Mission 的入口。
- Mission briefing 和 `Curtain up` CTA。
- Main Voice Practice 页面，包含真实 Realtime 与 mock mode。
- Mission Complete 页面。
- Review 页面和前端规则版 review draft。
- Realtime token endpoint 支持 onboarding / mission flow，mission 使用 `gpt-realtime-2`。

当前仍需补齐:

- 用真实 onboarding goal / reflection 构建并传递 `OnboardingProfile`。
- App 级 memory cards 和 transcript records state。
- pts +25 与 streak +1 的真实状态更新。
- Home golden path 的文案、结构、模块数量和 tab 语义收口。

暂不做:

- Records tab UI。
- Coach tab UI。
- 账号后端持久化。
- 真实 Journey Map。
- 全量视觉债清理。

## 5. 验收标准

- Home 在不同 onboarding goal 下都固定展示 `Coffee chat practice`。
- Mission 能显示 onboarding goal 映射出的 personal goal。
- Mission CTA 能进入 Voice Practice。
- mock mode 下能走完整 Home -> Mission -> Voice Practice -> Mission Complete -> Review -> Home。
- Exit confirm 后回 Home，不加 pts，不进 Review。
- Review 必须先选择 feeling 才展示 highlight 和 rewrite。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- 新页面截图归档到 `docs/iterations/`。

当前本地验收状态（2026-05-26）:

- `pnpm run typecheck` 通过。
- `pnpm run build` 通过。
- mock 页面验证 Mission、Practice、Mission Complete 可渲染，Mission CTA 可进入 Practice。
- 尚未满足的验收项是不同 onboarding goal 映射到 Mission personal goal、memory card / transcript record state 保存、pts / streak 真实更新，以及完整 mock path 中 Review Done 后的数据沉淀。
