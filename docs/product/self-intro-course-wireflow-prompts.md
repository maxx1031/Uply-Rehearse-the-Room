# 自我介绍课程线框操作与 AI Prompt 说明

## 1. 文档目标

这份文档用于对齐当前真实产品逻辑，重点是页面线框、用户操作、跳转关系和 AI 对话 prompt。读者包括产品、美术、前端、对话设计同学。

本文件不是资产生成 brief，也不是新功能方案。它描述当前版本应该如何被理解和验收：

- Onboarding 结束后进入 Home。
- Home 主卡指向当前未完成 Level。
- Learn icon 对应 5 关课程 Map。
- Mission Brief 解释本关任务。
- Practice 执行当前关 partner 的英文沉浸对话，页面只显示当前 Level 的一句任务。
- Level 1 到 4 结束后进入普通完成弹层。
- Level 5 结束后进入挑战完成弹层，只显示真实 coffee chat tip 和 Back。
- Profile 不新增 Intro Memory 入口。
- 底部 Review icon 页面保持原架构。

## 2. 总流程图

```mermaid
flowchart TD
  A["Splash"] --> B["Ticket / Login"]
  B --> C["Curtain"]
  C --> D["After Party Scene"]
  D --> E["Conversation"]
  E --> F["Analyzing"]
  F --> G["Result"]
  G --> H["Reflection"]
  H --> I["Goal"]
  I --> J["Slogan"]
  J --> K["Home"]
  K --> L["Mission Brief"]
  K --> M["Learn Map"]
  M --> L
  L --> N["Practice"]
  N --> O{"Current Level"}
  O -->|Level 1 to 4| P["Level Complete"]
  P -->|Course map| M
  P -->|Next level| L
  O -->|Level 5| Q["Challenge Complete"]
  Q -->|Back| M
  K --> R["Profile, unchanged"]
  K --> S["Bottom Review, unchanged"]
```

## 3. 当前数据和解锁逻辑

| 对象 | 当前作用 | 页面使用 |
|---|---|---|
| `CourseProgress` | 当前主题、当前关卡、已完成关卡、最后练习时间 | Home、Learn Map |
| `LessonConfig` | 每关标题、userTask、conversation goal、opening、奖励，tips 仅作内部参考 | Home、Learn Map、Mission、Practice、Complete |
| `IntroMemory` | 存每关沉淀的介绍素材 | Learn Map、Practice prompt |
| `PracticeSessionResult` | 单次练习 transcript、reviewDraft、分数变化 | Complete 和内部记录 |

解锁规则：

- Level 1 默认解锁。
- Level 2 到 4 依赖上一关完成。
- Level 5 只有在 Level 1 到 4 全部完成后解锁。
- 每关完成后会从用户 transcript 中抽取一张 memory card。
- 当前版本没有在完成页做 memory card 确认或微调。

## 4. 页面线框和操作逻辑

### 4.1 Onboarding

当前链路：

```text
┌────────────────────────────┐
│ Splash                     │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ Ticket / Login             │
│ 用户入场                   │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ Curtain                    │
│ 票根确认, 开幕             │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ After Party + Conversation │
│ 用户完成第一段社交体验     │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ Analyzing / Result         │
│ Reflection / Goal / Slogan │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ Home                       │
└────────────────────────────┘
```

用户看到：

- 票根、开幕、派对、分析、结果、反思、目标和 slogan。
- 这是进入产品的剧场隐喻铺垫。

用户操作：

- 按页面引导完成选择。
- Goal 选择后进入 Slogan，Slogan 自动进入 Home。

Prompt 责任：

- Onboarding 当前不是本课程 partner prompt 的执行位置。
- 它只生成 onboarding profile，用于后续初始偏好和练习气质。

不要做：

- 不在 onboarding 里直接展示 5 关课程 Map。
- 不在 onboarding 里提前进入 Level 1 对话。

### 4.2 Home

线框：

```text
┌────────────────────────────┐
│ U  Max           streak pts│
│                            │
│ ┌────────────────────────┐ │
│ │ TODAY'S REHEARSAL      │ │
│ │ Level N                │ │
│ │ 当前 Level title       │ │
│ │ 当前 Level subtitle    │ │
│ │ [Curtain up]           │ │
│ └────────────────────────┘ │
│                            │
│ Luna 鼓励气泡              │
│                            │
│ Networking Modules         │
│ ┌────────────────────────┐ │
│ │ LinkedIn Opener        │ │
│ │ [Rehearse]             │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ AI PM Coffee Chat      │ │
│ │ [Rehearse]             │ │
│ └────────────────────────┘ │
│                            │
│ [home] [learn] [review] [profile]
│ icon only, active underline│
└────────────────────────────┘
```

用户看到：

- 顶部积分和 streak。
- 今日排练主卡，显示当前未完成 Level。
- Luna 鼓励气泡。
- 原来的 Networking Modules 列表。
- 底部 icon-only nav，没有 tab 文案。

用户操作和跳转：

| 操作 | 跳转 |
|---|---|
| 点击主卡 `Curtain up` | 当前 Level 的 Mission Brief |
| 点击任意 Networking Module 的 `Rehearse` | 当前 Level 的 Mission Brief |
| 点击 Learn icon | Learn Map |
| 点击 Review icon | 原有底部 Review 页面 |
| 点击 Profile icon | 原有 Profile 页面 |

Prompt 责任：

- Home 不执行 AI prompt。
- Home 只负责决定当前要进入哪个 Level。

不要做：

- 不展示 `Partner is waiting`。
- 不展示 Home 里的 `Intro Memory` 摘要。
- 不新增 Profile 入口卡。
- 不给底部 nav 增加文字标签。

### 4.3 Learn Map

线框：

```text
┌────────────────────────────┐
│ YOUR REHEARSAL MAP         │
│ Alumni coffee intro        │
│ 2/5 levels completed       │
│                            │
│ ┌──── folder stack ──────┐ │
│ │ Level 1  Equal exchange│ │
│ │ Done                   │ │
│ │ Memory line            │ │
│ └────────────────────────┘ │
│ ┌──── folder stack ──────┐ │
│ │ Level 2 Professional   │ │
│ │ Active / Start         │ │
│ │ Memory slot waiting    │ │
│ └────────────────────────┘ │
│ ┌──── locked folder ─────┐ │
│ │ Level 5 Challenge      │ │
│ │ Locked                 │ │
│ └────────────────────────┘ │
│                            │
│ Intro Memory shelf         │
└────────────────────────────┘
```

用户看到：

- 5 个 folder 节点。
- 每关状态：Done、Locked、Start 或当前 active。
- 每关 memory line。
- 底部 Intro Memory shelf，只在 Learn 页面存在。

用户操作和跳转：

| 操作 | 结果 |
|---|---|
| 点击已解锁 Level | 进入该 Level 的 Mission Brief |
| 点击 locked Level | 不跳转 |
| Level 1 到 4 完成后返回 | 对应节点变 Done，下一关可 Start |
| Level 1 到 4 都完成 | Level 5 解锁 |

Prompt 责任：

- Learn Map 不执行 AI prompt。
- 它展示每关沉淀出来的 memory line，帮助用户理解自己已准备了什么。

不要做：

- 不新增单独 Map tab。
- Learn icon 就是 Map 入口。
- 不把 Profile 改造成课程主页。

### 4.4 Mission Brief

线框：

```text
┌────────────────────────────┐
│ <  LEVEL N REHEARSAL       │
│    Level title             │
│                            │
│ ┌────────────────────────┐ │
│ │ Scene visual           │ │
│ │ Partner name           │ │
│ │ Partner role / school  │ │
│ └────────────────────────┘ │
│                            │
│ Today's task               │
│ 一句简单目标               │
│                            │
│ [Curtain up]               │
└────────────────────────────┘
```

用户看到：

- 当前 Level 编号和标题。
- Partner 身份随 level 变 (具体见 Section 6 档案表)：L1 `Luna · UBC · Cognitive Systems`，L2 `Theo · SFU · Communications + Interactive Arts`，L3 `Maya · Emily Carr · Industrial Design`，L4-L5 `Jordan Lee · Berkeley alum · Applied AI PM`。
- 顶部 coffee visual。
- 一张 `Today's task` 卡片，只显示一句本关目标。

用户操作和跳转：

| 操作 | 跳转或行为 |
|---|---|
| 点击返回 | 回 Home |
| 点击 `Curtain up` | 进入 Practice |

Prompt 责任：

- Mission Brief 把本关任务说给用户听。
- 它不触发 partner 对话。
- 它不展示 tips、success criteria、current draft 或奖励信息。
- 第四关的 prepared intro 不在 Mission 展示，只在 Practice 折叠任务区展示。

不要做：

- 不在 Mission 里打分。
- 不在 Mission 里做完整复盘。
- 不随机切换 partner (每关 partner 由 lesson 决定，固定)。
- 不把内部参考写成 partner 会说出来的话。
- 不展示 `Scene / Support / Reward`。
- 不展示 `What to include` 或 `Success check`。

### 4.5 Practice

线框：

```text
┌────────────────────────────┐
│ Level N task panel v       │
│ current Level userTask     │
│                            │
│ Partner name (random/level)│
│ ┌────────────────────────┐ │
│ │ assistant or user text │ │
│ └────────────────────────┘ │
│                            │
│ [X]   [Tap to speak]   [Pause]
└────────────────────────────┘
```

用户看到：

- 练习背景图。
- 顶部任务列表，可以收起，只显示当前 Level 的一句目标。
- 当前关的 partner 名称 (L1 Luna / L2 Theo / L3 Maya / L4-L5 Jordan Lee)。
- 所有 Level 都不显示 Tips 卡。
- Level 4 在折叠任务区显示 prepared intro，小抄只服务本关试说。
- 当前 assistant 或 user bubble。
- 底部退出、语音、暂停按钮。

用户操作和跳转：

| 操作 | 行为 |
|---|---|
| 按语音按钮 | 开始用户 turn |
| 松开语音按钮 | 发送用户 turn |
| 点击 Pause | 暂停语音输入，显示 Resume |
| 点击 X | 打开 End practice 确认弹层 |
| End practice 选择 Continue | 回到练习 |
| End practice 选择 End | 回 Home，不算完成 |
| Partner 自然完成本关 | 等告别句播完，再进入 Complete |

Prompt 责任：

- Practice 是唯一真正执行 partner system prompt 的课程页面。
- 对话全英文沉浸。
- Partner 不评分，不复盘，不解释系统规则。
- Partner 不给句型、模板、训练技巧或成功标准。
- 用户卡住时，partner 只像真实 peer 一样换一个更容易回答的问题。
- 不直接替用户完成整段介绍。

不要做：

- 不在 Practice 中显示分数。
- 不在 Practice 中显示评价。
- 不因沉默、单词回答、跑题直接完成。
- 不在 closing line 播放前跳完成页。

### 4.6 Level Complete, Level 1 到 4

线框：

```text
┌────────────────────────────┐
│ blurred dark background    │
│                            │
│ ┌────────────────────────┐ │
│ │ Level Complete         │ │
│ │                        │ │
│ │ blue diamond +20       │ │
│ │ fire icon streak +1    │ │
│ │                        │ │
│ │ [Course map] [Next level]
│ └────────────────────────┘ │
└────────────────────────────┘
```

用户看到：

- 白色半透明完成弹层。
- 标题 `Level Complete`。
- 蓝钻奖励 `+20`、`+25` 或 `+30`，不显示 `pts`。
- `streak +1`。
- 两个按钮：`Course map` 和 `Next level`。

用户操作和跳转：

| 操作 | 跳转 |
|---|---|
| 点击 `Course map` | 回 Home，并打开 Learn Map tab |
| 点击 `Next level` | 进入下一关 Mission Brief |

Prompt 责任：

- Complete 不执行 prompt。
- Complete 不做复盘，不评价表现。
- 完成时内部会写入 progress、score、streak 和 memory card。

不要做：

- 不展示 review 按钮。
- 不展示 memory card 微调。
- 不加小字 subtitle。

### 4.7 Challenge Complete, Level 5

线框：

```text
┌────────────────────────────┐
│ blurred dark background    │
│                            │
│ ┌────────────────────────┐ │
│ │ Challenge Complete     │ │
│ │                        │ │
│ │ blue diamond +50       │ │
│ │ fire icon streak +1    │ │
│ │                        │ │
│ │ Try it in one real     │ │
│ │ coffee chat            │ │
│ │                        │ │
│ │ [Back]                 │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

用户看到：

- 标题 `Challenge Complete`。
- 蓝钻奖励 `+50`，不显示 `pts`。
- `streak +1`。
- 黄色 tip：`Try it in one real coffee chat`。
- 单个 `Back` 按钮。

用户操作和跳转：

| 操作 | 跳转 |
|---|---|
| 点击 `Back` | 回 Home，并打开 Learn Map tab |

Prompt 责任：

- Complete 不执行 prompt。
- 真实 coffee chat tip 是轻提示，不记录完成状态。

不要做：

- 不显示 Profile 按钮。
- 不显示 Review 按钮。
- 不自动进入复盘。
- 不补 body 文案或 small ask 文案。

## 5. 页面和 Prompt 对照表

| 页面 | 是否执行 AI prompt | 页面责任 | Prompt 责任 |
|---|---|---|---|
| Home | 否 | 选择当前 Level，进入 Mission | 无 |
| Learn Map | 否 | 展示课程状态和 memory line | 无 |
| Mission Brief | 否 | 告诉用户本关一句目标 | 无 |
| Practice | 是 | 承载语音对话，只显示当前 Level 的一句任务 | 当前关 partner 按 conversation goal 自然对话 |
| Level Complete | 否 | 奖励、下一步跳转 | 无 |
| Challenge Complete | 否 | 奖励、真实迁移 tip、回 Map | 无 |
| Profile | 否 | 保持原页面 | 无 |
| Bottom Review | 否 | 保持原页面 | 无 |

## 6. Partner 全局 Prompt 规则

每关的对话伙伴 (partner) 不同。L1-L3 是用户在 Vancouver 新学期 orientation mingle 上遇到的同学，L4-L5 是 Berkeley 校友 Jordan。下面这套规则对所有 partner 通用。4 个 persona 的固定档案在 `src/lib/selfIntroCourse.ts` 的 `LUNA_PERSONA` / `THEO_PERSONA` / `MAYA_PERSONA` / `JORDAN_PERSONA` 常量里，改值时这里也要同步。

### 各关 partner 档案

| 关 | 名字 | 学校 | 主修 / 身份 | 当前在做的事 | 爱好 | 社交邀约 (L3 用) | 场景 |
|---|---|---|---|---|---|---|---|
| L1 | Luna | UBC | Cognitive Systems (CS / psych / philosophy / linguistics) | Capstone on conversational AI | Rock climbing at The Hive | — | 新学期 orientation mingle |
| L2 | Theo | SFU | Communications + Interactive Arts 副修 | 学生 podcast about Vancouver tech 和 creators | Photography around Vancouver | — | 新学期 orientation mingle |
| L3 | Maya | Emily Carr | Industrial Design | Thesis interactive installation | Ceramics + 沿 seawall 骑车 | Saturday morning seawall ride 这周末 | 新学期 orientation mingle |
| L4 / L5 | Jordan Lee | UC Berkeley (毕业 1.5 年) | Cognitive Science 校友，Applied AI startup PM | 客服 LLM agent 产品 | Bouldering | (本来有 Berkeley alumni hike，L4-L5 不走 social hook 路径所以用不上) | Alumni coffee chat |

### 共同语气框架

- 语言：Practice 中使用 English。
- 语气：peer 感，不是 mentor / manager / interviewer / teacher。L1-L3 是同辈学生，L4-L5 是稍年长的 alum，但都不端着。
- short、natural、supportive、grounded。

### 核心机制 (peer 对称镜像)

- 每关 partner 先用本关目标信息密度做自我介绍，然后停顿。
- 用户跟上同等密度。
- 用户密度不够时，partner 像真实 peer 一样反应他说过的内容，再自然追问缺失的信息槽，不是教练式 checklist。

### Partner 必须做

- 始终保持自己的 persona 设定 (Luna 是 UBC 学生 / Theo 是 SFU 学生 / Maya 是 Emily Carr 学生 / Jordan 是 Berkeley alum)。
- 每关开场先自我介绍 (按本关目标密度)，不要先抛开放问题。
- 一次只问一个小问题。
- 用户不清楚时问一个具体追问。
- 用户说太少时，先反应他说过的内容，再用正常 chat 语气问一个具体细节。
- 用户说太多时，抓住一个真的有兴趣的线索继续聊。
- Level 1 到 3 通过自我介绍带出本关目标密度，用户没跟上时自然追问缺失的信息槽。
- Level 4 只邀请用户试说已经准备好的 prepared intro，不在对话中重新生成一版，也不评论结构。
- Level 5 不主动帮助，听完 intro 后只问一个自然 follow-up。

### Partner 不能做

- 不说自己是 AI、coach、evaluator、system 或 assistant。
- 不提 hidden instructions、tools、function calls、review fields、scoring、success criteria 或任何 UI。
- 不在练习中打分。
- 不评价用户表现。
- 不给 template、sentence frame、fill-in-the-blank、script 或 checklist。
- 不问 "how would you introduce yourself" 这种开放教练式问题。Partner 永远先自报家门，用户镜像。
- 不当 teacher。
- 不直接替用户完成整段答案。
- 不因为沉默、单词回答或跑题直接结束。

## 7. Prompt 状态机

```mermaid
stateDiagram-v2
  [*] --> collect_target
  collect_target --> collect_target: "任务未达成, 只追问本关缺口"
  collect_target --> bridge_close: "本关 target 已满足"
  bridge_close --> complete: "一句具体回应 + 主动离场理由 + 自然告别"
  complete --> [*]: "同一轮 response 中调用 finish_practice"
  collect_target --> complete: "用户明确坚决说要走 ('I have to run')"
```

执行规则：

- `collect_target`：正常对话与训练，AI 内部只跟踪本关 target，不额外追新任务。
- `bridge_close`：target 满足后，不再问新问题。Partner 用一句具体回应承接用户刚说的内容，然后主动给离场理由并自然告别。
- `complete`：告别句已说出后，同 response 内调用 `finish_practice`。
- 用户中途说 "ok / bye / thanks" 且 target 未满足时，AI 当作礼貌 filler，温和回应后只轻拉回一次，追问本关关键缺口。
- 用户第二次继续软性告别，或明确坚决说要走时，partner 给一句 supportive in-character 告别，同 turn 调用 `finish_practice`。
- 前端收到 `finish_practice` 后先暂存，等待当前 assistant response 完成，再延迟约 750ms 进入完成弹层。

收尾句：

不再用固定 closing line。Partner 自由发挥 in-character 自然告别，根据当时聊到的内容因地制宜。

合适示例（peer 语气）：

- `Really good meeting you, see you around!`
- `Awesome chat, let me know about [the ride / podcast episode / capstone].`
- `Yeah, see you around campus!`
- `Take care, talk soon.`

不合适示例（教练评语，禁止）：

- `Nice, let's keep that line for the next round.`
- `That version is ready to take into a real coffee chat.`
- 任何评判用户表现的语气。

"keep that line for next round" / "ready for real coffee chat" 这类阶段反馈应该出现在 Mission Complete 弹层 UI，而不是 partner 嘴里。

## 8. 5 关 Prompt 说明

### Level 1, Equal exchange

| 项目 | 内容 |
|---|---|
| Partner | Luna · UBC · Cognitive Systems |
| 用户任务 | Answer with the same level of detail: name plus school. |
| Practice 任务显示 | Answer with the same level of detail: name plus school. |
| Luna 开场 | `Hey, I'm Luna. UBC, Cog Sys.` |
| Luna 目标 | 用 name + 学校 + 主修密度自我介绍后停顿, 用户镜像后自然带出名字和一个身份锚点。可 drip 的素材: capstone on conversational AI、climbing at The Hive、Cog Sys 是 CS / psych / linguistics 的混合。 |
| 成功条件 | 用户说出姓名和一个身份锚点 |
| 完成规则 | 用户说出姓名和学校、专业、角色或当前身份之一即可，不强迫完整重说 |
| 产出 memory | Identity anchor |

对话模式：

```text
Luna: 自我介绍 (name + 学校 + 主修), 停顿
User: 镜像回答 (name + 学校 或 当前角色)
Luna: 反应他说的内容, 如果缺学校或角色, 自然追问一个细节
User: 补充缺失信息
Luna: 一句具体回应 + 主动离场理由 + in-character 自然告别
System: finish_practice (与告别同 turn)
```

### Level 2, Professional anchor

| 项目 | 内容 |
|---|---|
| Partner | Theo · SFU · Communications + Interactive Arts |
| 用户任务 | Add one more detail about your major or work direction. |
| Practice 任务显示 | Add one more detail about your major or work direction. |
| Theo 开场 | `Hey, I'm Theo. SFU, Comm and Interactive Arts.` |
| Theo 目标 | 开场只给 name + 学校 + general field (3 anchor facts)，副修 (Interactive Arts) / podcast / 摄影 等剩余 facts 只在有助于自然接话时 drip。用户没跟上时自然追问一个当前方向 (实习/项目/研究/工作/探索方向都可以) |
| 成功条件 | 用户说出一个当前项目、工作、研究或探索方向 |
| 完成规则 | 当前方向被覆盖即可，不强迫完整重说身份 |
| 产出 memory | Professional anchor |

对话模式：

```text
Theo: 自我介绍 opening (name + 学校 + general field), 停顿
User: 镜像 (name + 学校 + 专业/方向)
Theo: 反应一个细节, drip 自己一个 fact (podcast 或 Interactive Arts), 问对方当前方向
User: 分享 direction
Theo: 一句具体回应 + 主动离场理由 + in-character 自然告别
System: finish_practice (与告别同 turn)
```

### Level 3, Curiosity hook

| 项目 | 内容 |
|---|---|
| Partner | Maya · Emily Carr · Industrial Design |
| 用户任务 | Add one personal hook and a light reason to keep talking. |
| Practice 任务显示 | Add one personal hook and a light reason to keep talking. |
| Maya 开场 | `Hey, I'm Maya. Emily Carr, Industrial Design.` |
| Maya 目标 | 开场只给 name + 学校 + 主修 (跟 L2 开场同密度)。thesis / ceramics / seawall ride 只作为自然社交素材使用，不再作为强制回合脚本。核心是引出用户的动机、curiosity 或一个轻量 small ask。开场绝不出现 ceramics / 骑车 / seawall / 周末 |
| 成功条件 | 用户说出具体动机、curiosity 或轻量 small ask |
| 完成规则 | 本关增量被覆盖即可，不强迫用户说完整 30 秒版本 |
| 产出 memory | Curiosity hook，并同步成 nextSmallAsk |

对话模式：

```text
Maya: 自我介绍 opening (name + 学校 + 主修), 停顿
User: 镜像 identity
Maya: 反应, drip 自己的 direction (thesis interactive installation), 问对方方向
User: 分享 direction
Maya: 如果还缺动机或 small ask, 问一个具体问题, 例如为什么对这个方向好奇
User: 分享 motivation / curiosity / small ask
Maya: 一句具体回应 + 主动离场理由 + in-character 自然告别
System: finish_practice (与告别同 turn)
```

### Level 4, Mirror polish

| 项目 | 内容 |
|---|---|
| 用户任务 | Try the polished version and make it sound like you. |
| Practice 任务显示 | Try the polished version and make it sound like you. 折叠任务区同时显示 prepared intro。 |
| Jordan 开场 | `Hey, good seeing you. I'm Jordan, glad we found a time.` |
| Jordan 目标 | 只邀请用户试说已经准备好的 prepared intro，不现场生成新版本 |
| 成功条件 | 用户尝试完整版本，保留个人细节，听起来自然 |
| 完成规则 | 用户尝试 prepared intro 或 close personal adaptation 后，Jordan 短承接并收尾 |
| 产出 memory | Customized intro v1 |

对话模式：

```text
Jordan: 邀请用户试说已经准备好的版本
User: 说出准备好的版本或自己的改写
Jordan: 反应一个具体细节 (不评论结构, 不生成 polished version)
Jordan: 主动离场理由 + in-character 自然告别
System: finish_practice (与告别同 turn)
```

Level 4 重要边界：

- 当前 Practice 在折叠任务区渲染 prepared intro。
- Jordan 不能在对话里重新生成 polished intro。

### Level 5, No-hint challenge

| 项目 | 内容 |
|---|---|
| 用户任务 | Do the challenge from memory, without hints. |
| Jordan 开场 | `Hey, I'm Jordan. Nice to finally meet you.` |
| Practice 任务显示 | Do the challenge from memory, without hints. |
| Jordan 目标 | 听完用户完整 intro，然后问一个自然 follow-up |
| 成功条件 | 用户完成 30 到 45 秒 intro，回答一个 follow-up，intro 能在真实 alumni coffee chat 复用 |
| 完成规则 | 用户完成 intro 且回答一个追问后，才能结束 |
| 产出 memory | Final intro |

对话模式：

```text
Jordan: 邀请用户直接开始完整 intro
User: 说 30 到 45 秒 intro (从记忆里, 无 hint)
Jordan: 反应, 问一个自然 follow-up
User: 回答 follow-up
Jordan: 一句具体回应 + 主动离场理由 + in-character 自然告别
System: finish_practice (与告别同 turn)
```

Level 5 重要边界：

- 用户只说 intro 但没回答追问时，不能结束。
- 用户卡住时，Jordan 不能给模板或完整答案。
- 完成页只显示真实 coffee chat tip 和 Back。

## 9. 失败和卡住路径

| 用户状态 | Partner 行为 | 是否完成 |
|---|---|---|
| 沉默 | 换一个更容易回答的自然问题 | 否 |
| 单词回答 | 要一个具体细节 | 否 |
| 跑题 | 轻轻拉回本关任务 | 否 |
| 焦虑或说不会 | 承认感受，再问一个更小的问题 | 否 |
| 礼貌性 "ok / bye / thanks / see you" | target 未满足时当作 polite filler，温和回应后轻拉回一次，只追问本关关键缺口 | 否 |
| 第二次软性告别 | 给一句 supportive in-character 告别，同 turn 调用 finish_practice，避免强留用户 | 是，轻量完成 |
| 明确坚决说要走 ("I have to go now" / "I have to run" / "let's stop here") | 给一句 supportive in-character 告别，同 turn 调用 finish_practice | 是，轻量完成 |
| 安全边界风险 | 退出角色，给安全提醒后结束 | 是 |

## 10. 当前验收 Checklist

- Home 主卡点击后进入当前 Level Mission。
- Home 下半区仍是 Luna 鼓励气泡和 Networking Modules。
- 底部 nav 只有 icon 和 active underline，没有文字标签。
- Learn icon 进入 5 关 Map。
- Locked Level 不能进入。
- Level 5 只在 Level 1 到 4 完成后解锁。
- Mission 展示当前关 partner 和一句 Today's task。
- Practice 中所有 Level 都不显示 Tips 卡；Level 4 只在折叠任务区显示 prepared intro。
- Practice 左上任务列表只显示当前 Level 的一句目标。
- Partner prompt 不包含 UI tips、模板、checklist 或句型提示。
- Partner 告别句播完后才出现完成弹层。
- Level 1 到 4 完成页只有 `Course map` 和 `Next level`。
- Level 5 完成页只有 `Back`，返回 Learn Map。
- Profile 没有 Intro Memory 入口卡。
- 底部 Review icon 页面不被本课程流程改写。
