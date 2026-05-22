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
- 目标差异是 onboarding 输出尚未作为稳定 `OnboardingProfile` 进入主流程，Home 仍需要打通完整 daily practice golden path。

### 2.2 Home

目标: 让用户看到今天要练的固定 starter lesson，并从 Home 进入 Mission。

目标状态:

- 顶部显示头像、`WELCOME BACK`、用户昵称、pts、streak。
- Today's Script 卡固定展示 `Coffee chat practice`。
- 副信息固定为 `CS alum coffee chat · gentle pace · 10 min`。
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
- Today's Script subtitle: `CS alum coffee chat · gentle pace · 10 min`
- CTA: `Start Practice`

当前实现差异:

- 当前 Home 仍有旧的 theater dashboard 结构。
- 当前 Today's Script 未完全按 handoff golden path 排布。

### 2.3 Mission

目标: 在正式练习前，把场景、对话伙伴、用户个人目标和可用策略对齐，并在内部准备 practice prompt seed。

目标状态:

- 从 Home Today's Script 或 module card 进入。
- 顶部 Back 返回 Home，无确认。
- hero 展示 `TODAY'S MISSION` 和 `Coffee chat practice`。
- partner 信息为 Maya Chen，CS alum and incoming PM，coffee chat。
- personal goal 来自 `OnboardingProfile.selectedGoal.personalObjective`。
- Tips & strategy 默认折叠，展开后显示 chips、2 到 3 条策略和 1 条 success example。
- CTA 文案为 `Curtain up`，进入 Voice Practice。
- Mission 不允许调难度或更换 Scene Role。
- Prompt seed 是内部数据，不在 Mission 或任何用户可见前端界面展示。

核心文案:

- 页面 eyebrow: `TODAY'S MISSION`
- 页面标题: `Coffee chat practice`
- partner: `Maya Chen`
- partner role: `CS alum and incoming PM`
- meta: `Coffee chat`, `Gentle`, `10 min`
- personal goal title: `YOUR GOAL`
- strategy title: `Tips & strategy`
- CTA: `Curtain up`

当前实现差异:

- Mission 基线已在 stash 中，但 CTA 还停在 prompt ready note。
- Mission 需要改为进入主流程 voice practice。

### 2.4 Voice Practice

目标: 让用户在 Coffee chat practice 中和 Maya 进行一段低压力、可暂停、可退出、可复盘的语音练习。

目标状态:

- 使用 OpenAI Realtime WebRTC，mission flow 使用 `gpt-realtime-2`。
- 浏览器只拿 short-lived client secret，标准 API key 只在服务端。
- 视觉复用 onboarding starter scene 的背景与 Maya silhouette。
- 左上 Tasks 面板默认展开，可折叠，不自动打勾。
- 屏幕同一时刻最多显示 1 个 dialogue bubble。
- 用户气泡使用浅黄色语义，Maya 气泡使用紫色语义。
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
- partner label: `Maya Chen`
- task title: `Tasks`
- mic label: `Tap to speak`
- pause: `Pause`
- resume: `Resume`
- exit confirm title: `End practice?`
- exit confirm actions: `Continue`, `End`

当前实现差异:

- 当前 Realtime 只服务 onboarding prompt。
- 当前没有主流程 Voice Practice 页面。

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

当前实现差异:

- 当前没有 Mission Complete 页面。

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

当前实现差异:

- 当前没有 Review 页面。
- 当前没有 review draft 数据结构。

### 2.7 Memory Card 与 Records State

目标: 把每次完成复盘后的可保留内容沉淀为可回看的数据。

目标状态:

- Review Done 后生成一张 memory card。
- memory card 保存在前端 state。
- transcript record 在自然完成和 Exit 时都写入 state。
- Records tab UI 不在本包实现。

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

- 由 Realtime mission prompt 通过 `finish_practice` function call 产出 review draft。
- 如果 function call 不可用或超时，前端用规则 fallback。
- fallback 不能阻塞 Review。
- 分析结果不能覆盖用户已选择的 `selectedGoal`。

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
- partner: Maya Chen，CS alum and incoming PM。
- personal goal。
- coach focus。
- opening context。
- success criteria。
- Realtime system prompt text。

Prompt seed 只用于 Mission 到 Realtime session 的请求和后续调试日志，不进入用户可见界面。

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
