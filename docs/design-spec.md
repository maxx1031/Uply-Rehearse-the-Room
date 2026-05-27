# Uply Design System Spec

权威来源:
- `/Users/max/Downloads/Art style Guide.pdf` (官方视觉指南, 后文称 **AG**)
- `.design/tokens.css`, `.design/components.md`, `.design/patterns.md`
- 代码实测: `src/components/ui/UplyUI.tsx`, `src/pages/intro/`, `src/pages/act-i/`, `src/pages/interlude/`, `src/pages/epilogue/`

后续模块 (真实挑战部分) 生成新页面时, 全部从本文件取物料.

---

## 0. Visual Direction (来自 AG §1)

**核心**: 简洁现代 + 生动活泼插画.

**视觉语言**: 柔和紫调 + 温暖粉蜡 + 细腻渐变, 唤起 "安全感 + 好奇心".

**交互隐喻 ("人生如戏")**:
- 注册 → 票根 (Ticket)
- 社交开场 → 剧场开幕 (Curtain up)
- 对话前陌生感 → 半透明发光剪影
- 练习反馈 → 剧评 (Review)
- AI 教练 → 观众 / 提词人
- 用户 → 演员

**Key characteristics (AG §2.4 收束)**:
1. 蓝紫 + 浅黄色色调
2. 人影模糊处理
3. 渐变色微凸起按钮
4. 半透明层级堆叠
5. 背景页面用不同颜色突出功能区
6. 简洁的页面布局
7. 显眼可爱的图标强调内容
8. 不同功能的分区或按钮使用亮黄色

**摒弃**: 生硬线条轮廓、扁平按钮、具象人脸.

---

## 1. Color Palette

按 AG §3 官方分组. 所有 hex 优先用 `.design/tokens.css` 中的变量名调用.

### 1.1 Primary Background (AG §3.1)

| 名称 | Hex | Token | 用途 |
|---|---|---|---|
| 浅黄色纸质纹理 | `#f0ede8` | `--bg-paper` | 全局 body 底, paper 模式页面 |
| 亮紫色 | `#6B63D4` | `--bg-primary` / `--text-accent` | 主色, 链接, 强调数值, gradient 浅端 |

### 1.2 Background (AG §3.2)

| 名称 | Hex | Token | 用途 |
|---|---|---|---|
| 背景渐变 1 · 深紫 | `#281E6E` | `--bg-gradient-deep` / `--text-primary` | gradient 深端, 主文字 |
| 背景渐变 2 · 浅紫 | `#6B63D4` | `--bg-gradient-light` | gradient 浅端 |
| 分区颜色 1 · 浅黄 | `#FCD34D` | `--accent-yellow-soft` | 用户气泡边框、yellow 分区底、Skip 按钮底 (v3 mission style) |
| 分区颜色 2 · 亮黄 | `#F59E0B` | `--accent-yellow-bright` | 高亮强调标题、CTA emphasis |

**默认渐变**: `--gradient-primary: linear-gradient(135deg, #281E6E, #6B63D4)`

### 1.3 Button (AG §3.3) — 三态官方规范

| 状态 | 背景 | 立体阴影 | 位移 |
|---|---|---|---|
| 未点亮 (idle / disabled) | `#dddbe9` (`--btn-idle`) | `0 3px 0 #c2bfd6` | — |
| 点亮 (active / primary) | `linear-gradient(180deg, #7c73e6 → #5b52cc)` | `0 5px 0 #3d36a0` | — |
| 按下瞬间 (pressed) | 同上渐变 | `0 1px 0 #3d36a0` (压缩) | `translateY(4px)` |

底部 `#3d36a0` 是 **厚度层**, 不是按钮本身. transition `80ms`.

Token: `--btn-active-top: #7c73e6`, `--btn-active-bottom: #5b52cc`, `--btn-shadow: #3d36a0`, `--btn-gradient`.

### 1.4 Accent · 字体颜色 (AG §3.4)

| 名称 | Hex | Token | 用途 |
|---|---|---|---|
| 字体 1 · 浅灰紫 | `#9896b8` | `--text-secondary` | 次要文字、占位、禁用 |
| 字体 2 · 亮紫 | `#6B63D4` | `--text-accent` | 品牌强调、链接、数值高亮 |
| 字体 3 · 深紫 | `#1a1830` | (内联) | 主正文 (代码中也用 `--text-ink: #1d1452` 近似) |
| Ticket 内轻量标签 | `#b0aed4` | (内联) | 票根中的辅助文字 |
| 白底次要 | `rgba(255,255,255,0.7)` | — | 深色背景上的次要文字 |
| 白 | `#ffffff` | `--text-on-dark` | 深色背景上所有文字 |

### 1.5 扩展色 (代码中实测, AG 未列, 供补充)

剧场 / 票根 / archetype 场景专用. 这些是 **场景内联色**, 不要污染主面板.

```
紫色衍生:     --accent-purple-mid #5a4ad9 | --accent-purple-soft #9c8ff0 | --accent-lavender #b8acf6 | #7a6ee0
紫色背景层:   --bg-lavender-soft #ebe6fb | #d8d0f9 | #ece9ff (mission modal 起点)
浅黄/纸:      --bg-cream #fefcf6 | #f3eee3 | #f7f5f2 (input bg) | #faf7f0 | #f5f2ee (splash)
夜色:         --bg-deep-night #1a1830 | #0a0726 (slogan) | #0e0930 | #15103d | #1d1656
暖金/星光:    --accent-gold #f3d27e | #fff7d0 (footlight 内) | #f5c842 / #e8a820 (footlight 外)
幕布:         #2a1260 → #4a2f96 → #6b50c0 (天鹅绒渐变)
品牌外链:     --brand-linkedin #0a66c2
result 渐变:  linear-gradient(180deg, #f6f2e9 0%, #ebe5d7 100%)
mission 渐变: linear-gradient(160deg, #ece9ff 0%, #ffffff 55%)
```

---

## 2. Typography (来自 AG §4)

**基础设定**:
- 字体: **Fredoka** (展示) / **Nunito** (功能)
- 字重: 只有 **500** 和 **600** 两档
- 字号范围: **10px – 26px**
- 调用: `var(--font-heading)` / `var(--font-body)`

### 2.1 Fredoka — 展示字体 (标题 / 数值 / 品牌)

| 用途 | Size | Weight | 特殊属性 |
|---|---|---|---|
| 演出大标题 (Ticket) | 26px | 500 | letterSpacing: -0.3px |
| 演出标题 (Login / Confirm) | 22px | 500 | — |
| 用户名 | 24px | 600 | — |
| 目标弹窗标题 | 19px | 600 | — |
| Row / Seat 数值 | 20px | 600 | — |
| Section 标题 | 17px | 600 | — |
| After Party 品牌标记 | 17px | 600 | letterSpacing: 0.06em |
| 统计数值 | 16px | 600 | — |
| Maya 名字标签 | 13px | 600 | letterSpacing: 0.1em + uppercase |
| 进度条数字 / 日期数值 | 12–13px | 600 | — |

**规则**: display (22–26px) 用 weight **500**, 其余 Fredoka 一律 **600**.

### 2.2 Nunito — 功能字体 (正文 / 标签 / 按钮)

| 用途 | Size | Weight | 特殊属性 |
|---|---|---|---|
| 主按钮 | 15px | 600 | — |
| 对话气泡 / 输入框文字 | 14px | 500 | — |
| 任务名称 (Send Emails) | 13px | 600 | — |
| NOW SHOWING | 13px | 500 | letterSpacing: 0.18em + uppercase |
| 副标题 / Forgot password | 12px | 500 | — |
| 天数剩余 / Connect 按钮 | 12px | 600 | — |
| 辅助引导 (Already an actor?) | 12px | 500 | — |
| All 66 / See All / tap to start | 11px | 600 | — |
| UPLY THEATER | 11px | 600 | letterSpacing: 0.14em |
| 表单标签 / Ticket 字段标题 | 11px | 500 | letterSpacing: 0.08–0.1em + uppercase |
| Networking Goal | 11px | 500 | letterSpacing: 0.08em + uppercase |
| Cast 成员名 | 10px | 500 | — |

**规则**: 所有 overline (uppercase + letterSpacing) 用 weight **500**, 功能性强调用 **600**.

### 2.3 字体性格

- **Fredoka**: Rounder, slightly more playful, more character.
- **Nunito**: Clean, legible, rounded.

### 2.4 文字色 (汇总)

主正文 `#1a1830` · 次要/占位/禁用 `#9896b8` · 品牌强调/链接 `#6B63D4` · Ticket 轻量 `#b0aed4` · 深底白字 `white` · 深底次要 `rgba(255,255,255,0.7)`.

---

## 3. Spacing / Radius / Elevation / Motion

### 3.1 Spacing (4px 栅格)

`--sp-1 4` · `--sp-2 8` · `--sp-3 12` · `--sp-4 16` · `--sp-5 24` · `--sp-6 32` · `--sp-7 48`.

### 3.2 Radius

`--r-sm 8` · `--r-md 12` · `--r-lg 16` · `--r-xl 24` · `--r-pill 9999`.

实测高频圆角: input 10 · 对话气泡/选择按钮 14–16 · 卡片 18 · complete 弹窗 22 · mission 弹窗 24.

### 3.3 Elevation (阴影)

| Token | 值 | 用途 |
|---|---|---|
| `--shadow-soft` | `0 2px 8px rgba(40,30,110,0.08)` | 轻盈卡片 |
| `--shadow-card` | `0 4px 16px rgba(40,30,110,0.12)` | 标准卡片 |
| `--shadow-btn-idle` | `0 3px 0 #c2bfd6` | idle 按钮厚度 |
| `--shadow-btn-active` | `0 5px 0 #3d36a0` | active 按钮厚度 |
| `--shadow-btn-pressed` | `0 1px 0 #3d36a0` | 按下厚度 |

实测扩展:
- 主 CTA 完整: `0 5px 0 #3d36a0, 0 8px 24px rgba(107,99,212,0.38)`
- 主 CTA 按下: `0 1px 0 #3d36a0, 0 4px 12px rgba(107,99,212,0.2)`
- 主 CTA glow: `0 0 0 1px rgba(255,255,255,0.12) inset, 0 12px 40px rgba(122,110,224,0.45), 0 2px 0 rgba(255,255,255,0.25) inset`
- 对话气泡: `0 8px 24px rgba(8,4,40,0.18)`
- 任务弹窗: `0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(107,99,212,0.15)`
- 完成弹窗: `0 24px 60px rgba(8,4,40,0.32)`
- Mic active: `0 0 0 6px rgba(184,172,246,0.18), 0 8px 30px rgba(122,110,224,0.55), inset 0 -4px 12px rgba(29,20,82,0.3), inset 0 2px 0 rgba(255,255,255,0.4)`
- 票根 drop-shadow 三层: `drop-shadow(0 2px 0 rgba(80,60,180,0.10)) drop-shadow(0 12px 28px rgba(60,50,140,0.22)) drop-shadow(0 28px 48px rgba(0,0,0,0.10))`

### 3.4 Motion

**Durations / Easings**:

| 场景 | 时长 | Easing |
|---|---|---|
| 按钮按下 | 80ms | linear |
| 默认进场 (fade + 8–16px y) | 300–600ms | `cubic-bezier(.2,.7,.3,1)` |
| 切幕 | 200ms 黑场 + 300ms 淡入 | ease-out |
| Overshoot (logo / 票根) | 400–500ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Curtain slide | 2300ms | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| Curtain 总长 | 4400ms | (closed→opening 100ms→lit 2800ms→done 4000ms→exit 4400ms) |
| Analyzing staged tick | 900ms × 4 = 3600ms (total 4200ms) | ease |
| Result cascade | 200 / 500 / 900ms | ease |
| Slogan 自动跳 | 3600ms | — |
| Splash | 2200ms | — |

**Keyframes** (`src/styles/handoff.css`):
`uply-spotlight` · `uply-flicker` · `uply-float` (±8px y) · `uply-glow-pulse` · `uply-ripple` · `uply-typing` · `uply-fade-up` · `uply-fade` · `uply-spin` · `uply-stamp-in`.

**禁止**: overshoot > 4px, 旋转/闪烁/抖动 (旋转仅限 analyzing 双环), 单步动画 > 600ms.

### 3.5 z-index 约定

```
scene-bg 0 | character 1 | blur-edges 3 | content 4 | name-tag 5 |
scene-chip 6 | bubble 7 | task-list 8 | voice-controls 9 | modal-overlay 9 |
modal 10 | curtain 10 | scene-vignette 15 | curtain-valance 20 |
curtain-flood 30 | scene-cta 30 | debug 999
```

业务层不超 30.

### 3.6 Viewport

移动端优先, ≤ 414px. 内容卡片 max-width 280–340px.

---

## 4. UI Components

### 4.1 Button (AG §5.1, components.md §1)

**主按钮 (Primary)**:
- 渐变 `linear-gradient(180deg, #7c73e6, #5b52cc)`, 白字 15/600 Nunito
- 高 48–54, 圆角 14 (方形 CTA) 或 9999 (胶囊)
- 立体阴影 `0 5px 0 #3d36a0, 0 8px 24px rgba(107,99,212,0.38)`
- 按下: `translateY(4px)` + 阴影压缩为 `0 1px 0 #3d36a0, 0 4px 12px rgba(107,99,212,0.2)`, 80ms

**Idle / Disabled**:
- 浅紫 `#dddbe9`, 文字 `#9896b8` (或亮紫 18% 浅 `rgba(107,99,212,0.18)` + `#b0aed4` 文字)
- 阴影 `0 3px 0 #c2bfd6` 或无

**位置语义 (AG §5.11)**:
- 双按钮并排时, **右 = 积极信号** (下一步 / 同意 / 接受 / Start / Continue)
- **左 = 消极信号** (上一步 / 拒绝 / 跳过 / Skip / Back)
- Skip 按钮: `flex: 1`, 灰底 `#eeecf5` + 灰字; Start: `flex: 2`, 渐变紫底

**禁止**: 1px solid 描边按钮、扁平无阴影按钮、圆角小于 12px 的按钮.

### 4.2 三层对话框 (AG §5.12 + §6 细节修改) — 重点

代码中所有"弹窗 / 气泡"分成三个层级, 命名固定:

#### A. 任务框 (System Task Modal)

- **底**: 浅紫色渐变白色 `linear-gradient(160deg, #ece9ff 0%, #ffffff 55%)` 或 `linear-gradient(180deg, var(--bg-lavender-soft) 0%, #FFFFFF 60%)`
- **形状**: 弧形 (radius 22–24), 无边框
- **结构**: 小标题 (紫色大写 11/500 letterSpacing 0.14–0.22em) + 大标题 (深紫 19–22 Fredoka 600) + 内容 (紫灰 `#9896b8` 13/500)
- **阴影**: `0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(107,99,212,0.15)`
- **行为**: 整屏覆盖 `backdrop-filter: blur(8px) brightness(0.7)` + `rgba(20,14,50,0.25)` 暗化背景
- **用例**: Mission 任务简报、Mission Complete、Goal 选择确认
- 实现位置: `ActI.tsx:474` (Mission), `ActI.tsx:802` (Complete)

#### B. 人物对话框 (Character Speech Bubble)

- **底**: 白色或白色半透明 (`#FFFFFF` 或 `rgba(255,255,255,0.72)` + `backdrop-filter: blur(10px)`)
- **边框**: **不同颜色** 区分说话人, 2px solid
  - NPC (Maya) → `var(--text-accent)` `#6B63D4` 紫色边框
  - 用户 → `var(--accent-yellow-soft)` `#FCD34D` 黄色边框
- **形状**: 弧形 (radius 16); voice 模式带 tail 圆角变体 `16px 16px 16px 4px` (NPC) / `16px 16px 4px 16px` (用户)
- **字体**: 14/500 Nunito, `#1a1830` 文字, line-height 1.4
- **阴影**: `0 8px 24px rgba(8,4,40,0.18)`
- **互斥**: 任一时刻只显示一方 (`activeBubble: "maya" | "user" | null`)
- **typing 态**: 用 `<TypingDots />` 替换文字
- 实现位置: `ActI.tsx:704` (NPC), `ActI.tsx:750` (用户), `ActI.tsx:594–628` (voice 双向)

#### C. 系统提示框 (System Hint Banner)

- **底**: 白色半透明 `rgba(255,255,255,0.92)` + `backdrop-filter: blur(10px)`
- **形状**: 弧形 (radius 14), 无边框 (或极浅紫 1px)
- **结构**: 💡 emoji + `HINT · ` 紫色加粗前缀 + 黑色提示文字 (12.5/500)
- **阴影**: `0 6px 18px rgba(40,30,110,0.16)`
- **位置**: 浮于底部按钮区上方, 短时显隐
- 实现位置: `ActI.tsx:734`

> **三层视觉关系**: 任务框 (浅紫渐变白, 不透明, 强存在) > 人物对话框 (白底, 彩色边框, 中存在) > 系统提示框 (白半透明, 无边框, 弱存在).

### 4.3 Card / Section

无硬边框, 半透明堆叠 + 柔和阴影分区.

```css
.card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: var(--r-lg);
  padding: var(--sp-4);
  box-shadow: var(--shadow-card);
}
.card-highlight { background: var(--accent-yellow-soft); }
```

**禁止**: 任意颜色的 1px solid 硬边框、阴影直写 hex/rgba (必须用 token).

### 4.4 Input

- 底 `#f7f5f2`, 边框 `1.5px solid rgba(107,99,212,0.15)`, 圆角 10, padding 10/14
- 文字 14/500 Nunito, `#1a1830`, 占位 `#9896b8`
- focus: border-color → `#6B63D4`
- label: 11/500, `#9896b8`, letterSpacing 0.08em, uppercase

### 4.5 Avatar / 人物 (AG §1, §5.2)

**模糊发光剪影** (默认): blur(2–3px) + radial glow, 无脸 / 浅色眼嘴.
- `GlowFigure`: `src/components/ui/UplyUI.tsx:151`
- `SceneScreen.tsx:150` (SVG 内联剪影)

**实色无脸轮廓**: 紫色头 (圆) + 躯干 (上圆下方), 软投影.
- `SolidFigure`: `src/components/ui/UplyUI.tsx:191`

**Uply 吉祥物**: 紫色 orb + 笑眼弧嘴, 可 dark / light 两态.
- `UplyMark`: `src/components/ui/UplyUI.tsx:12`

**真实角色**: PNG 实拍 (如 `ppl.png`) + `mix-blend-mode: multiply` + `opacity: 0.88`.

**禁止**: 具象人脸 / 五官清晰肖像、emoji 占位人物.

### 4.6 Iconography (AG §5.2)

风格: **紫色填充圆润, 微笑表情, 无锐角, 配 radial glow aura**.
PDF 示例: 紫色发光人形 (剪影) · 紫色 Uply 笑脸头像 · Uply 文字 logo · 紫粉渐变剧场舞台.

实际项目使用: `lucide-react` (Coffee, Flame, Handshake, Home, MessageCircle, MessageSquare, NotebookTabs, Play, RotateCcw, Star, User, Mic, MicOff, Loader2).

**Emoji 功能符号** (允许):
- 🔗 LinkedIn 任务 · 🎉 完成 · 💡 hint · ✨ 强调
- ☕ ✉️ 🤝 🎙 目标分类 · 🌙 ⚡ 🌿 🪡 🌟 archetype · 🏫 👋 🧵

### 4.7 PageShell (标准页面骨架)

```tsx
<PageShell bg="paper">           {/* "paper" | "gradient" */}
  <TopBar title="第一幕·咖啡馆" timer="00:23" />
  <ContentArea>...</ContentArea>
  <BottomAction>
    <button className="btn-primary">开幕</button>
  </BottomAction>
</PageShell>
```

- `bg="paper"` → `var(--bg-paper)` `#f0ede8`
- `bg="gradient"` → `var(--gradient-primary)`
- 顶部安全区 `--sp-5` (24px)
- 底部操作区固定贴底, 内边距 `--sp-5`

---

## 5. Component Inventory

| Component | Path | Purpose | Used In |
|---|---|---|---|
| `UplyMark` | `components/ui/UplyUI.tsx:12` | SVG 笑脸 orb 品牌 logo, dark/light | AnalyzingScreen, SloganScreen |
| `PrimaryBtn` | `components/ui/UplyUI.tsx:28` | 渐变胶囊主按钮 h=54, disabled/glow | ResultScreen, ReflectionScreen, GoalScreen |
| `GhostBtn` | `components/ui/UplyUI.tsx:57` | 透明文字按钮 (lavender) | (未在主线使用) |
| `Chip` | `components/ui/UplyUI.tsx:72` | 椭圆胶囊标签, dark/light + blur | StageScreen scene chip |
| `ActLabel` | `components/ui/UplyUI.tsx:93` | 全大写 0.32em 眉签 | Analyzing / Result / Reflection / Goal |
| `StageBackdrop` | `components/ui/UplyUI.tsx:107` | 暗紫径向渐变 + lit 聚光 + 14 漂浮粒子 | AnalyzingScreen |
| `GlowFigure` | `components/ui/UplyUI.tsx:151` | 头+躯干模糊剪影 + uply-float | (未在主线使用) |
| `SolidFigure` | `components/ui/UplyUI.tsx:191` | 实色无脸紫色轮廓 | StageScreen Maya 占位 |
| `SpeechBubble` | `components/ui/UplyUI.tsx:221` | 白底 18 圆角 + 三角尾 | (未在主线使用; 实际气泡内联) |
| `MicButton` | `components/ui/UplyUI.tsx:247` | 球状渐变麦 + ripple | StageScreen voice / user-speaking |
| `TypingDots` | `components/ui/UplyUI.tsx:285` | 3 点呼吸 | ConversationScreen |
| `SplashScreen` | `pages/intro/SplashScreen.tsx` | 2.2s logo overshoot | Intro 起点 |
| `TicketScreen` | `pages/intro/TicketScreen.tsx` | 注册票根 (scallop mask + 撕裂虚线) | 注册 |
| `LoginScreen` | `pages/intro/LoginScreen.tsx` | 登录票根 "Until We Meet Again" | 登录 |
| `TicketConfirmScreen` | `pages/intro/TicketConfirmScreen.tsx` | 注册成功票 + QR + stamp-in | 注册→开幕 |
| `CurtainScreen` | `pages/intro/CurtainScreen.tsx` | 4.4s 幕布开启 + 灯光叠加 | 注册/登录 后 |
| `SceneScreen` | `pages/intro/SceneScreen.tsx` | 学校走廊 + 模糊剪影 + mic | 旧 onboarding |
| `StageScreen` | `pages/act-i/ActI.tsx:26` | After-Party 插画 + Maya + mic | Act I 第 1 屏 |
| `ConversationScreen` | `pages/act-i/ActI.tsx:213` | Mission → voice/分支 → complete | Act I 主对话 |
| `AfterPartyScene` | `pages/act-i/AfterPartyScene.tsx` | 独立 illustrated 场景 | Act I 备用 |
| `AnalyzingScreen` | `pages/interlude/Interlude.tsx:87` | 双圈旋转 + 4 staged tick | Interlude |
| `ResultScreen` | `pages/interlude/Interlude.tsx:170` | Archetype emoji + 标题 + cascade 卡片 | Interlude |
| `ReflectionScreen` | `pages/interlude/Interlude.tsx:240` | 5 点离散 slider + bucket 反馈 | Interlude |
| `GoalScreen` | `pages/epilogue/Epilogue.tsx:51` | 4 选 1 目标卡 | Epilogue |
| `SloganScreen` | `pages/epilogue/Epilogue.tsx:118` | 深夜星海谢幕 3.6s | Epilogue |
| `HomeScreen` | `pages/epilogue/Epilogue.tsx:170` | 落地首页 | Epilogue 终点 |
| `UplyOnboardingFlow` | `lib/UplyOnboardingFlow.tsx` | 8 步状态机 | App 装载 |

---

## 6. Interaction Patterns

### 6.1 三层对话框时序 (核心)

页面进入 → **任务框** (briefing, 浅紫渐变白) → 用户点 Start → 对话开始 → 
**人物对话框** (NPC 紫边 / 用户黄边, 互斥) ↔ **系统提示框** (💡 HINT, 浮现 2–3s) → 
对话结束 → **任务框** (Mission Complete, 紫色 emoji + 立体 Continue 按钮).

### 6.2 Loading / 等待

`AnalyzingScreen` (Interlude.tsx:87): 4 staged tick 每 900ms 推进, 总 4200ms.
- 当前步: 16x16 圆 + 内点 `uply-flicker`
- 已完成: 紫填充 + 白勾 SVG
- 中央: 200x200 双环 (外 8s spin, 内 12s reverse) + UplyMark + `uply-glow-pulse 2.4s`

`TypingDots`: 3 个 6px 点, `uply-typing 1.2s` 错相 0.18s, 用于任意"等待回复".

Voice 连接态: 14px 阴影白字 "Connecting…" / "Hold to talk" / "Listening… release to send".

### 6.3 用户输入

**文字输入** (Ticket / Login): 见 §4.4.

**Voice push-to-talk** (`ActI.tsx:653`):
- onPointerDown → `setHolding(true)` + 3 圈 `uply-ripple 1.6s`, 按钮 `scale(0.94)`
- onPointerUp / onPointerCancel → `setHolding(false)` + `setAwaitingUser(true)`
- 按钮 72x72, `linear-gradient(135deg, #9b93ef, #7c73e6)`, 阴影 `0 8px 24px rgba(107,99,212,0.4)`

**Choice 按钮** (`ActI.tsx:766`):
- 普通: `rgba(255,255,255,0.88)` + blur(8px), 左对齐, 圆角 14
- "ending"(收尾): 紫渐变 + 立体阴影 + 🔗 emoji 前缀

**离散 Slider** (`Interlude.tsx:268`): 5 个 tap-only 点, 轨道渐变 `gold → lavender → purple`, 白圆 marker 24x24 + 紫晕, 250ms ease.

**选择卡** (Goal, `Epilogue.tsx:71`):
- inactive: cream 底 + 极浅紫 1px 边
- active: lavender-soft 底 + 1.5px 紫边 + `0 0 0 4px rgba(107,99,212,.12), 0 12px 24px rgba(8,4,40,.12)` 双层阴影 + 紫圆勾

### 6.4 转场动画 (剧场隐喻)

**幕布开启** (`CurtainScreen.tsx`):
- 双幕 `x: 0 → ±88%`, 2300ms `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- 时序: closed → opening(100ms) → lit(2800ms, 暖光泛起) → done(4000ms, 暖色全屏覆盖) → onDone(4400ms)
- 灯光层: 顶暖光带 + 中心 spotlight `scale 0.5→0.9→1.4` + 两侧 wing wash + 4 footlight (`#fff7d0/#f5c842/#e8a820` radial) 错相 0.15s 亮起

**Camera sway** (`SceneScreen.tsx:122`): `x: [0,4,-4,3,-3,0], y: [0,1,-1,0]`, 8s 循环 easeInOut. 仅 SceneScreen.

**场景模糊边** (`ActI.tsx:436`): 上/下/左/右 四道 `backdrop-filter: blur(6–8px)` + `mask-image: linear-gradient(... transparent)`, 制造中心聚焦.

**Result cascade** (`Interlude.tsx:174`): 三段卡片在 200/500/900ms 依次 `uply-fade-up`.

**Slogan 三段** (`Epilogue.tsx:142`): logo .2s → 主句 .6s → 副句 1.4s → "END OF PROLOGUE" 2.2s, 3.6s 后 onDone.

---

## 7. Motifs (视觉符号库)

| Motif | 代码位置 | 实现要点 |
|---|---|---|
| 紫色天鹅绒幕布 | `CurtainScreen.tsx:127` | `linear-gradient(90deg, #2a1260, #4a2f96, #6b50c0)` + `inset -24px 0 48px rgba(0,0,0,0.5)` + 6 道暗色竖纹 + 顶部 valance |
| Footlight 排灯 | `CurtainScreen.tsx:178` | 4 颗 10x10 圆点 `radial-gradient(#fff7d0, #f5c842, #e8a820)` + `box-shadow: 0 0 18px 10px rgba(255,200,60,0.45)` |
| Spotlight 三道光 | `StageBackdrop` (lit) | 两侧 `width:160 height:520 rotate(±12deg)` + 中央 `radial-gradient(50% 50% at 50% 0%, rgba(255,247,214,.22))` + `mix-blend-mode: screen` |
| 漂浮粒子 | `StageBackdrop`, `SloganScreen` | 14–24 颗 2–3px 白色圆点 + `uply-float`/`uply-flicker` 错相 0.1–0.3s |
| 票根 scallop edge | `TicketScreen.tsx:13` | 上下半圆咬痕 `WebKitMaskImage: radial-gradient(circle, transparent 6px, black 6px)` 重复 20px |
| 票根撕裂虚线 | `TicketScreen.tsx:123` | `borderTop: 2px dashed rgba(107,99,212,0.2)` + 两侧 20x20 `#f0ede9` 半圆缺口 |
| 任务清单 chip | `ActI.tsx:533` | 圆角 10 + blur, 当前 `rgba(107,99,212,0.45)` 紫底白字, 已完成: 删除线 |
| Mission 任务框 | `ActI.tsx:474` | 浅紫→白渐变 + 圆角 24 + 紫色 eyebrow + Fredoka 标题 + Skip/Start 双按钮 |
| Complete 任务框 | `ActI.tsx:802` | 浅紫→白渐变 + 🎉 36px + 紫眉签 + Fredoka 22 + 立体 Continue |
| 立体按压按钮 | 全局 | `linear-gradient(180deg, #7c73e6, #5b52cc)` + `0 5px 0 #3d36a0` + 按下 `translateY(4px) + 0 1px 0 #3d36a0` |
| Archetype reveal 卡片 | `Interlude.tsx:185` | 48px emoji + 34 Fredoka 名 + italic 14 引语 + 三段 cream 卡片 cascade |
| Slogan 夜空 | `Epilogue.tsx:118` | `#0a0726` 底 + 中心 lavender radial + 24 颗 flicker 星 + 横线包夹 "END OF PROLOGUE" |
| 派对场地 | `ActI.tsx:840` | 渐变天空 + Science Building + 彩色三角旗 bunting + 植物 + 餐桌 + skewX(-12deg) 木地板 |
| 学校走廊 | `SceneScreen.tsx:60` | 天花板荧光灯条 + 7 lockers + 拼花地板 + 右侧饮料台 |
| 眉签 (ActLabel) | `UplyUI.tsx:93` | 12px / letterSpacing 0.32em / uppercase / 700 |
| Hint banner | `ActI.tsx:734` | 白半透明 + blur(10px) + 💡 + 紫色 `HINT · ` 前缀 |
| 紫色发光剪影 (AG icon set) | `SceneScreen.tsx:150`, `GlowFigure` | SVG `filter: blur(2-3px)` + radial aura, 头椭圆 + 身躯路径 |

---

## 8. Page Patterns (流程)

### 8.1 隐喻词典

| 业务概念 | 视觉/文案隐喻 |
|---|---|
| 注册 | 票根 (Ticket) |
| 登录 | 入场 (Enter the show) |
| 开始一次社交练习 | 开幕 (Curtain up) |
| 结束练习 | 灯灭·谢幕 |
| AI 教练 | 观众 / 提词人 |
| 用户角色 | 演员 |
| 练习反馈 | 剧评 (Review) |

### 8.2 Onboarding 三幕流程

```
[AUTH]      Register (Ticket) → Login (Enter) → CurtainScreen
ACT I       StageScreen → ConversationScreen → Mission Complete
INTERLUDE   AnalyzingScreen → ResultScreen → ReflectionScreen
EPILOGUE    GoalScreen → SloganScreen → HomeScreen
```

### 8.3 文案语气

- 中文为主, 偶尔混入英文场景化短语 ("Curtain up", "End of Act I")
- 短句, 中文一行不超过 14 字
- 避免说教 ("你应该", "请记得"), 用陈述 ("观众已就位")
- 隐喻一致: 永远剧场 / 演员 / 观众, 不混入 "学习" "课程" "练习题"
- 中文 UI 文案禁用破折号 `—` `——`, 用逗号/句号/括号. (英文文案中代码已多处使用 `—`, 仅约束中文.)

---

## 9. Constraints (硬性禁用项)

1. **颜色必须用 token** (`tokens.css` 变量), 局部场景插画 / 票根可内联 hex.
2. **不用 1px solid 硬边框** 分区. 例外: 对话气泡 2px 彩色描边、input 1.5px 极浅紫、Goal 选中态 1.5px 紫.
3. **不生成具象人脸**, 一律剪影 / 无脸轮廓 / blur PNG.
4. **不用 emoji 占位人物**, emoji 仅用作功能符号 (任务/反馈/分类).
5. **不写扁平 / 纯描边按钮**, 主操作必须立体按压.
6. **不混入教学语言** (lesson, quiz, exercise) — 用剧场词.
7. **不抽 i18n** (hackathon 阶段, 中文直接写 JSX).
8. **viewport ≤ 414px**, 移动优先.
9. **z-index 不超 30** (debug 工具除外).
10. **字重只用 500 和 600**, 字号 10–26px.
11. **优先复用 `UplyUI.tsx` primitives**, 不另起内联气泡 / 按钮样式.
12. **单步动画 ≤ 600ms**, 仅 curtain 等场景级动画例外.

---

## 10. 给后续模块的资源索引

生成"真实挑战"模块时, 按以下路径取物料:

- 颜色 / 字号 → 本文档 §1, §2
- 三层对话框 → 本文档 §4.2
- 按钮规范 → 本文档 §4.1
- 复用组件 → 本文档 §5 (优先用 `PrimaryBtn`, `Chip`, `ActLabel`, `TypingDots`, `SolidFigure`, `MicButton`)
- 动画 keyframes → `src/styles/handoff.css` 中 10 个 `uply-*`
- Page 骨架 → 本文档 §4.7
- 隐喻词 / 文案语气 → 本文档 §8
