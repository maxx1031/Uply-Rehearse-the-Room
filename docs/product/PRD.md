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
8. 自然完成后进入 Mission Complete 和 Post-Practice Review。
9. Post-Practice Review Done 后回 Home，并生成 memory card state。
10. 用户可从底部 Coach tab 进入 Coach Hub，继续和 AI 复盘、查看近期 Performance Review，并把结论带回下一次练习。

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
- Coach tab 承载常驻复盘与 AI 陪聊入口。
- Records tab 后续承载完整历史档案、筛选和长期管理；不承载本轮 Coach Hub 概念稿。

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
- partner 信息为 Jordan Lee，CS alum and incoming PM，coffee chat。
- personal goal 来自 `OnboardingProfile.selectedGoal.personalObjective`。
- Tips & strategy 默认折叠，展开后显示 chips、2 到 3 条策略和 1 条 success example。
- CTA 文案为 `Curtain up`，进入 Voice Practice。
- Mission 不允许调难度或更换 Scene Role。
- Prompt seed 是内部数据，不在 Mission 或任何用户可见前端界面展示。

核心文案:

- 页面 eyebrow: `TODAY'S MISSION`
- 页面标题: `Coffee chat practice`
- partner: `Jordan Lee`
- partner role: `CS alum and incoming PM`
- meta: `Coffee chat`, `Gentle`, `10 min`
- personal goal title: `YOUR GOAL`
- strategy title: `Tips & strategy`
- CTA: `Curtain up`

当前实现差异:

- Mission 基线已在 stash 中，但 CTA 还停在 prompt ready note。
- Mission 需要改为进入主流程 voice practice。

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
- 不进入 Post-Practice Review。
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

当前实现差异:

- 当前 Realtime 只服务 onboarding prompt。
- 当前没有主流程 Voice Practice 页面。

### 2.5 Mission Complete

目标: 自然完成后给用户即时正反馈。

目标状态:

- 只在自然完成或时间到后出现。
- 进入此屏前写入 pts +25 和 streak +1。
- 约 1.5 到 2 秒 autoplay。
- tap anywhere 跳过到 Post-Practice Review。
- 无语音 narration。

核心文案:

- `Mission Complete`
- `+25 pts`
- `2-day streak` 或当前 streak。
- `tap anywhere to skip`

当前实现差异:

- 当前没有 Mission Complete 页面。

### 2.6 Post-Practice Review

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
- Done 后生成 memory card，供 Coach Hub 的 Performance Review 模块读取。
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

- 当前 Post-Practice Review 基线已存在。
- 当前还没有和 Coach Hub 的 Performance Review feed 打通。

### 2.7 Coach Hub

目标: 让用户描述任意社交场景或对话困惑，跟 AI 文字 chat 拿建议，并回看过去聊过的对话。

产品定位:

- Coach Hub 是底部导航 `Coach` tab 的目标页面。
- 它不替代 Post-Practice Review；练习结束后的轻量复盘仍先在 Post-Practice Review 完成。
- 它不是完整 Records archive；Records tab 后续负责 voice practice 的 memory card、transcript 长期归档。
- Coach Hub v0 只做两件事: composer 起一段新 chat，列表回看过去的 chat。

首屏结构:

- 顶部剧场视觉，延续练习场景的 theater metaphor。
- Composer: 顶部大输入框，承接用户描述的场景或对话。
- 输入控件: 文字输入为主；右下 mic 按住说话松手转文字填入 composer；中间黄色 ↑ 提交；v0 不做 `+` 按钮。
- Performance Review: 单列文字列表，展示过去 Coach chat 的归档。
- 底部导航保持 4 个 tab: Home、Coach、Records、Me，其中 Coach 为当前 active。

Composer 行为:

- placeholder 引导用户描述一个具体场景或对话: 刚发生的、即将面对的、或想琢磨的某句表达。
- 文字与 mic 两种输入合并到同一个 composer；mic 按住录音，松手后语音转文字直接填入输入框，用户可继续编辑再提交。
- 提交后进入 Coach AI chat 场景。
- AI 在 chat 中可在内部参考近期 practice transcript 摘要、review draft 等上下文，不暴露内部 prompt、评分字段、工具名或 evaluator 细节。
- AI 的第一优先级是接住用户情绪，再帮助用户整理表达改进或下一步行动。

Coach AI chat 行为:

- 用户气泡使用浅黄色语义，AI 气泡使用紫色语义，复用 Voice Practice 的气泡语义。
- 无 timer，无条数限制。
- 顶部 Back 回 Coach Hub 首页，当前 chat 自动归档到 Performance Review 列表头部。
- chat 内不展示 `Remember this?` 卡，v0 不做长期记忆确认。

Performance Review 行为:

- 单列文字列表，每行一次过去的 chat。
- 每行展示: 用户首条消息的截断摘要 (单行) + 相对时间，例如 `2 days ago`、`last week`。
- 没有 memory card 卡片，没有 `Ask AI` / `Practice again` 按钮。
- 列表为空时显示空态: 大喇叭插画 + 引导文案 (文案 v0 待定)。
- 点击一行 → 全屏进入该次 chat 的 read-only 回看页，底部无 composer，顶部 Back 回 Coach Hub 首页。
- v0 不提供删除 / 编辑入口。

核心文案:

- composer placeholder: `Describe your scenario or conversation.`
- section title: `Performance Review`
- empty state 引导: v0 待定。
- 历史列表行: `<用户首条消息截断>` + 相对时间。

当前实现差异:

- 当前底部 Coach tab 仅为导航占位。
- 当前没有 Coach Hub 页面、composer、Coach chat session 或归档列表。

### 2.8 Memory Card、Coach Chat Session 与 Records State

目标: 把 voice practice 和 Coach chat 完成后的可保留内容沉淀为可回看的数据。

目标状态:

- Post-Practice Review Done 后生成一张 memory card。
- memory card 保存在前端 state，后续供 Records tab 消费；Coach Hub v0 不消费 memory card。
- transcript record 在 voice practice 自然完成和 Exit 时都写入 state。
- Records tab UI 不在本包实现，后续承载完整 memory card 与 transcript 历史档案。
- CoachChatSession 记录 Coach Hub 中的文字 chat；Coach Hub 的 Performance Review 列表读取最近的 CoachChatSession 渲染。
- v0 不做 CoachMemoryItem 长期记忆，AI 不在 chat 中提议保存长期记忆。

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

CoachChatSession v0 字段:

- `id`
- `createdAt`
- `mode` (v0 固定 `text`)
- `messages`
- `referencedPracticeResultIds` (内部可选关联，不在 UI 暴露)
- `referencedMemoryCardIds` (内部可选关联，不在 UI 暴露)

### 2.9 Transcript 分析

目标: 用完整 transcript 生成更准确的 highlight、rewrite 和后续练习 prompt。

本包 v0:

- Realtime mission prompt 只负责 roleplay 和通过 `finish_practice` function call 结束练习，不负责评价用户表现。
- Review draft v0 由前端规则 evaluator 使用本次 transcript 和 `OnboardingProfile` 生成。
- fallback 不能阻塞 Post-Practice Review。
- 分析结果不能覆盖用户已选择的 `selectedGoal`。
- Coach Hub 的 AI chat 可在内部引用 review draft 和 memory card 摘要作为上下文，不在 UI 暴露这些字段。

后续:

- 后端持久化 transcript。
- 独立 LLM post-processing transcript。
- 把 practice focus update 写回长期画像。
- Coach Hub 长期记忆 (CoachMemoryItem) 和 `Remember this?` 确认流程。

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
- partner: Jordan Lee，CS alum and incoming PM。
- personal goal。
- coach focus。
- opening context。
- success criteria。
- Realtime system prompt text。

Prompt seed 中的 roleplay 场景信息用于 Mission 到 Realtime session；onboarding snapshot / practice focus 只用于 Review evaluator 和后续调试，不进入用户可见界面，也不进入主流程 roleplay 角色的 prompt。

## 4. MVP 范围

本包必须完成:

- PRD 与 frontend roadmap。
- OnboardingProfile 规则生成。
- Home golden path。
- Mission briefing。
- Main Voice Practice。
- Mission Complete。
- Post-Practice Review。
- MemoryCard 和 transcript record state。
- Realtime token endpoint 支持 onboarding 和 mission flow。
- mission flow 使用 `gpt-realtime-2`。
- Coach Hub v0: composer 提交进 AI chat，Back 自动归档到 Performance Review 列表，列表点击进 read-only 回看。

暂不做:

- Records tab UI。
- Coach Hub 长期记忆 (CoachMemoryItem) 与 `Remember this?` 确认流程。
- Coach chat 内的 AI 语音输出与 voice chat。
- Coach 历史列表的删除 / 编辑入口。
- 账号后端持久化。
- 真实 Journey Map。
- 全量视觉债清理。

## 5. 验收标准

- Home 在不同 onboarding goal 下都固定展示 `Coffee chat practice`。
- Mission 能显示 onboarding goal 映射出的 personal goal。
- Mission CTA 能进入 Voice Practice。
- mock mode 下能走完整 Home -> Mission -> Voice Practice -> Mission Complete -> Post-Practice Review -> Home。
- Exit confirm 后回 Home，不加 pts，不进 Post-Practice Review。
- Post-Practice Review 必须先选择 feeling 才展示 highlight 和 rewrite。
- Post-Practice Review Done 后生成 memory card 保存到前端 state。
- Coach Hub composer 提交后进入 chat，Back 后该 chat 自动归档到 Performance Review 列表头部。
- Coach Hub 列表点击一行能进入 read-only 回看，回看页底部无 composer。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- 新页面截图归档到 `docs/iterations/`。
