# Integration Points for Real Challenge Module

权威源: `src/App.tsx`, `src/pages/home/HomeScreen.tsx`, `src/pages/mission/MissionPage.tsx`, `src/pages/practice/PracticePage.tsx`, `src/pages/learn/LearnScreen.tsx`, `src/lib/onboardingProfile.ts`.

---

## 1. Onboarding Exit

### 1.1 完成回调位置

Onboarding 流程没有"显式完成事件", 是由 `App.tsx` 中的状态机串起来的线性 step 推进:

```
splash → ticket/login → curtain → after-party → conversation
       → analyzing → result → reflection
       → goal → slogan → home    ← onboarding 出口
```

关键收尾点 (都在 `src/App.tsx`):
- `ReflectionScreen.onContinue(b)` → `App.tsx:243` 保存 `bucket`, 转 goal
- `GoalScreen.onPick(g)` → `App.tsx:250` 保存 `goalId`, 转 slogan
- `SloganScreen.onDone` → `App.tsx:256` 跳 `home`
- `HomeScreen.onStartMission` → `App.tsx:264` 跳 `mission` (即"今日剧本"入口)

### 1.2 持久化数据

**没有真持久化**. 全部存在 `App.tsx` 顶层 `useState`:

```typescript
const [, setUserName] = useState<string | null>(null);   // App.tsx:84 — 写了但 getter 没用
const [, setGoalId]   = useState<GoalId | null>(null);   // App.tsx:85 — 同上
const [, setBucket]   = useState<ReflectionBucket | null>(null);  // App.tsx:88
const [sessionResult, setSessionResult] = useState<PracticeSessionResult | null>(null); // App.tsx:86
```

**注意**: `userName` / `goalId` / `bucket` 三个 setter 写入后, getter 被解构为空 (`const [, setX]`), **下游消费不到**. 等同于"采集后丢弃".

实际跨场景持久化只有两处:
1. `sessionStorage["uply.conversation"]` (来自 `conversationLog.ts`) — 仅 Maya 对话 transcript
2. `App.tsx:86` 的 `sessionResult` — practice 完成后存 React state, 喂给 `ReviewPage`

### 1.3 跳转逻辑

**无 router**. 整个 app 用单一 `step: Step` 状态 + `AnimatePresence` 切换屏幕. `App.tsx:93` 的 `go(next, direction)` 是唯一跳转函数.

URL 支持 `?step=<name>` 直接定位某一屏 (`App.tsx:69 readStepFromUrl` + `App.tsx:75 isStepLocked`), 但锁定后 `go()` 被禁用 (`lockedRef.current` 短路).

---

## 2. Homepage "今日剧本" Module

### 2.1 组件路径

- 主屏: `src/pages/home/HomeScreen.tsx`
- 4 个 tab 切换: home (默认) / learn / review / profile, 在 `HomeScreen` 内部用 `activeTab` state 切

### 2.2 "今日剧本"对应实现

代码里叫 **Film Reel Card** (`HomeScreen.tsx:111-181`), 视觉上是一张胶片帧卡片:
- 标题: "Ask for a coffee chat" (硬编码, 不来自 onboarding 数据)
- 场景图: `sceneImg` (静态 PNG)
- 中央 Play 按钮 → `onClick: () => onStartMission?.()`
- 底部进度点 "1 of 4" (硬编码, 非动态)

**实现状态**: ⚠️ **半实现 (UI 完成, 数据写死)**
- 视觉完整 (sprocket strip + 胶片帧 + 进度点)
- 标题、场景图、进度均为静态常量
- 不从 `OnboardingProfile.firstLessonPromptSeed.sceneTitle` 读取
- 用户名硬编码 `"Max"` (`HomeScreen.tsx:93`), 不接 `userName`

### 2.3 现有点击行为

| 元素 | onClick | 终点 |
|---|---|---|
| Film Reel 中央 Play 按钮 | `onStartMission?.()` | `App.tsx:264` → `go("mission")` → `MissionPage` |
| Networking Modules 4 张卡片 | `onStartMission?.()` (全都) | 同上, **4 张卡都指向同一 MissionPage**, 没有 level/课程分支 |
| Networking Module 内 Rehearse 按钮 | (无 onClick) | NOT_WIRED |
| 顶部黄色 speech bubble (Luna) | (无 onClick) | 装饰元素 |
| 顶部状态条 (128 days / 14,000) | (无 onClick) | 装饰元素 |
| Tab bar | `setActiveTab(key)` | 内部切换, 不出 HomeScreen |

### 2.4 现有 mission/practice 流

```
home → mission (MissionPage)
     → practice (PracticePage, voice realtime + Jordan Lee 角色)
     → mission-complete (MissionCompletePage, 静态分数)
     → review (ReviewPage, 复盘 transcript)
     → home
```

`MissionPage` / `PracticePage` 都从 `buildDefaultOnboardingProfile()` 取 profile, **不读 onboarding 真实状态** (`App.tsx:278, 288`). 即使 onboarding 收集到 goal/bucket, 这里仍走 default `("small-talk", "quiet-observer", "mid")`.

### 2.5 LearnScreen ("课程详情") 现状

`src/pages/learn/LearnScreen.tsx`: 7 个 FOLDERS 堆叠卡 (First Impression / Coffee Chat / LinkedIn Connect / The Ask / Cold Email / Alumni Network / Group Event) + 7 个 KEY_SCENES 横向选择. **完全静态**, **无任何 onClick 跳转**到具体 level 或 mission. 是占位浏览页, 不是真正的课程选择器.

**结论**: 不存在"Level 选择"页. 真实挑战模块要么 (a) 复用 MissionPage 作为 level 详情, (b) 在 `LearnScreen` 上挂跳转, (c) 新建 level 路由.

---

## 3. Data Contract

### 3.1 Onboarding 实际能采集到的字段

```typescript
// 来自 App.tsx state, 当前未真正消费
interface OnboardingCapturedState {
  userName: string | null;             // TicketScreen.onClaim(name)
  goalId: GoalId | null;               // GoalScreen.onPick(g)
                                       // GoalId = "small-talk" | "follow-up" | "ask-help" | "pitch"
  bucket: ReflectionBucket | null;     // ReflectionScreen.onContinue(b)
                                       // ReflectionBucket = "left" | "mid" | "right"
  archetypeId: ArchetypeId;            // 当前硬编码 DEFAULT_ARCHETYPE = "quiet-observer"
                                       // ResultScreen 直接收 prop, 不来自用户选择
                                       // ArchetypeId = "quiet-observer" | "active-connector" |
                                       //   "sincere-speaker" | "relationship-builder" | "confident-influencer"
  mayaTranscript: ConversationTurn[];  // sessionStorage["uply.conversation"]
}
```

> 注意: 真实社交角色 (archetype) **目前没有从对话动态推断**, ResultScreen 永远展示 `quiet-observer`. 这是 onboarding 未完成的部分.

### 3.2 OnboardingProfile (规范源)

`src/lib/onboardingProfile.ts` 已定义完整 Profile schema 但未真正使用:

```typescript
interface OnboardingProfile {
  selectedGoal: { id: ProfileGoalId; title: string; personalObjective: string };
  archetypeId: ProfileArchetypeId;
  reflectionBucket: ProfileReflectionBucket;
  evidenceQuotes: string[];
  strengths: string[];
  practiceFocus: string[];
  firstLessonPromptSeed: PracticePromptSeed;
}

interface PracticePromptSeed {
  sceneTitle: string;
  sceneSubtitle: string;
  partnerName: string;
  partnerRole: string;
  partnerStyle: string;
  userGoal: string;
  coachFocus: string[];
  strategyChips: string[];
  tasks: string[];
  openingContext: string;
  successCriteria: string[];
  suggestedOpener: string;
  systemPrompt: string;
}
```

### 3.3 真实挑战模块应消费的契约

```typescript
// 输入: 从 onboarding 拿
interface ChallengeModuleInput {
  profile: OnboardingProfile;           // 推荐复用 onboardingProfile.ts 现有类型
                                        // 可用 buildOnboardingProfile({goal, archetype, bucket}) 构造
  selectedPartnerId?: string;           // "选择的伙伴" — 当前代码无此字段, 需新增
                                        // 候选: HomeScreen.MODULES[i].type ("Friendly alumni" 等)
  realWorldGoal?: string;               // "现实世界小目标" — 当前用 GoalId 表达 4 选 1, 不是自由文本
                                        // 真实挑战如果需要自由文本目标, 需新增收集步
  levelIndex?: number;                  // 当前不存在 level 概念
}

// 输出: 喂回首页 / review
interface ChallengeModuleOutput {
  result: PracticeSessionResult;        // 已有, 见 onboardingProfile.ts
  unlockedLevel?: number;               // 当前不存在 level 系统
  badgeIds?: string[];                  // ProfileScreen 有 badge UI 但无解锁逻辑
}
```

### 3.4 字段缺口表

| 你要的字段 | 现有代码 | 缺口 |
|---|---|---|
| 用户社交角色分析 | `ArchetypeId` enum (5 种, 见 §3.1) | 没有从 Maya transcript 动态推断逻辑; 用 `DEFAULT_ARCHETYPE` 硬编码 |
| 社交目标 (大方向) | `GoalId` 4 选 1 (`GoalScreen`) | 已有, 但 `App.tsx` 收完丢弃 |
| 现实世界小目标 | `GOAL_COPY[id].personalObjective` 自动派生 | 模板化, 非用户自由文本输入 |
| 选择的伙伴 | `MODULES[]` 4 张写死卡片 | 没有"选择伙伴"步骤; partner 由 promptSeed 推断 (`Jordan Lee`) |

---

## 4. Mount Recommendation

### 4.1 推荐路径

```
src/pages/challenge/
├─ NetworkingChallengeHome.tsx     # level/伙伴选择入口
├─ LevelDetail.tsx                 # 单 level 详情 (复用 MissionPage 视觉)
├─ ChallengeSession.tsx            # 实战会话 (复用 PracticePage 逻辑)
└─ ChallengeReview.tsx             # 复盘 (复用 ReviewPage)
```

理由: 与现有 `src/pages/{home, mission, practice, learn, review, profile}/` 同级, 一目了然. 不嵌套到 `learn/` 下, 因为 `LearnScreen` 是浏览页, 不是路由父级.

### 4.2 推荐路由 (不要引入 react-router)

当前项目没有 router. 不建议为这个模块单独引入. 走 `App.tsx` 现有 `Step` 联合类型扩展:

```typescript
type Step =
  | ... // 现有
  | "challenge-home"      // 替代 "mission" 的新入口
  | "challenge-level"     // level/伙伴选择
  | "challenge-session"   // 替代 "practice"
  | "challenge-review";   // 替代 "review"
```

URL `?step=challenge-level` 直接定位 (已有的 `readStepFromUrl` 机制无需改动).

如果未来需要真路由 (deep linking, 浏览器返回), 再统一切到 `react-router` 7 — 这是项目级别决策, 不该让这个模块单独承担.

### 4.3 状态管理对接 (不需要 store)

**项目当前无 Redux / Zustand / Context**. 推荐沿用现有"App 顶层 useState + prop drilling"模式, 但**修复 onboarding 数据漏存**:

```typescript
// src/App.tsx 改造
const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(null);

// reflection 完成时 (App.tsx:243)
onContinue={(b) => {
  setBucket(b);
  setOnboardingProfile(buildOnboardingProfile({
    selectedGoal: goalId ?? "small-talk",
    archetypeId: DEFAULT_ARCHETYPE,
    reflectionBucket: b,
  }));
  go("goal");
}}

// goal 完成时, 用最终 goalId 重建 profile (因为 goal 在 reflection 之后)
onPick={(g) => {
  setGoalId(g);
  setOnboardingProfile(prev => prev
    ? buildOnboardingProfile({ selectedGoal: g, archetypeId: prev.archetypeId, reflectionBucket: prev.reflectionBucket })
    : null);
  go("slogan");
}}

// 喂给挑战模块
<ChallengeSession profile={onboardingProfile ?? buildDefaultOnboardingProfile()} ... />
```

如果挑战模块要跨多屏共享同一份 profile, 在 `App.tsx` 用一次 React Context 包裹整个 phone-frame 区域足矣, 不需要引入 store 库.

### 4.4 与 HomeScreen 的对接

**最小改动方案**:

1. 给 `HomeScreen` 加 `onOpenChallenge?: (moduleIndex: number) => void` prop
2. `MODULES[].onClick` 由 `onStartMission` 改为 `onOpenChallenge(i)`
3. Film Reel Card 的 Play 仍指 `onStartMission` (当作"快速进入今日推荐挑战")
4. `App.tsx` 把 `onOpenChallenge` 绑到新 step:
   ```typescript
   <HomeScreen
     onStartMission={() => go("challenge-home")}
     onOpenChallenge={(i) => { setSelectedModuleIdx(i); go("challenge-level"); }}
   />
   ```

**Film Reel Card 数据动态化** (建议独立小 PR, 不与挑战模块耦合):
- `sceneTitle` 从 `profile.firstLessonPromptSeed.sceneTitle` 读
- `userName` 从 `App.tsx` state 透传 (现已采集但被丢弃)
- 进度 "1 of 4" 从 future progress store 读

### 4.5 复用清单

直接搬:
- `useRealtime` (`src/lib/useRealtime.ts`) — voice 实时
- `logTurn` / `getConversation` (`src/lib/conversationLog.ts`) — transcript 持久化
- `buildOnboardingProfile` / `buildFallbackReviewDraft` (`src/lib/onboardingProfile.ts`)
- `PracticePage` 95% 逻辑可直接 fork (state machine + mock 脚本结构)
- `MissionPage` 视觉骨架 (CSS module)
- `ReviewPage` 复盘卡结构

需要新建:
- "伙伴 / level 选择"页 (HomeScreen 4 卡片当前都指同一 mission)
- prompt 动态注入到 `/api/realtime-token` (当前 SYSTEM_PROMPT 是模块常量, 见 `agent-spec.md §6.4`)
- 进度/解锁状态 (level lock, badge, streak 都没真后端)

---

## 5. 已知缺口 / 不要踩的坑

1. **Archetype 不动态**: ResultScreen 永远展示 quiet-observer, onboarding 的 "AI 分析" 是 UI 动画占位.
2. **GoalId 收完丢弃**: `App.tsx:85` 的 setter 没有 getter, 当前所有下游 (MissionPage/PracticePage) 都用 `buildDefaultOnboardingProfile()` 兜底.
3. **Practice 用第二个 system prompt** (`Jordan Lee`), 但**实际未注入实时会话** — `api/realtime-token.js` 永远返回 `Maya` 的 prompt. 详见 `agent-spec.md §2.2`.
4. **没有 router, 没有 store, 没有持久化后端**. hackathon 阶段所有数据都在 React state + sessionStorage. 真实挑战模块不要预先设计 ORM/API 层.
5. **HomeScreen 4 张 Networking Modules 卡片**目前都指同一个目标, 这是占位; 真实挑战要么扩展为 4 个不同入口, 要么砍掉做成"今日 + 历史挑战"两段式.
6. **LearnScreen 不是 level 选择器**, 是浏览展示, 无 onClick. 别误以为可以挂跳转.
