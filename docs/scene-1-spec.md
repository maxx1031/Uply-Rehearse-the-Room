# 场景一开发规格文档

> 适用对象: 前端开发
> 关联设计文档: [Art Style Guide](https://docs.google.com/document/d/1E-Zyd5xzAjN9X7NY-pN49psYGPkZarc3G0jfYR7MZFQ/edit)
> 版本: v1.0
> 落地状态: 见 §0.5 实现映射 (Claude 补充)

---

## 0. 阅读指南

本文档分为四部分:
1. **场景状态机**: 场景生命周期内的离散状态及转移条件
2. **UI 元素清单**: 可复用元素的稳定 ID 与归类
3. **状态 × UI 规格**: 每个状态下应渲染哪些元素、如何渲染
4. **修改清单 (Diff)**: 相对当前构建版本需要修改的具体项

实现顺序建议: 先搭状态机骨架 (第 1 + 3 节), 再补 UI 细节 (第 2 节), 最后处理 Diff (第 4 节)。

---

## 0.5 实现映射 (当前架构对照)

> 这一节是 Claude 补充, 因为 spec 把"场景一"当成一个统一状态机 (S0-S4), 但当前代码把它拆在 **3 个 App.tsx step** 里。这是用户说的"推的状态和 page 可能不对"的根源。

### 状态对照表

| Spec State | 当前实现 | 文件 | 落地差距 |
|---|---|---|---|
| `S0_CURTAIN_OPENING` | App.tsx step `curtain` | `src/pages/intro/CurtainScreen.tsx` | 拉幕动画已有; **缺**进场后场景左右摇晃 ±2° 一次 |
| `S1_CHARACTER_REVEAL` | App.tsx step `after-party` | `src/pages/act-i/AfterPartyScene.tsx` | 主角浮现已有; 名牌目前在 conversation 里 (Maya 胸前), spec 要求 reveal 阶段就在人影**上方**淡入 |
| `S2_TASK_BRIEFING` | step `conversation` 的 `mission` phase | `src/pages/act-i/ActI.tsx` | 任务卡已有; **缺** stage 背景模糊+变暗; 标题居中和渐变底要对齐 (Diff #6/#7/#8) |
| `S3_DIALOGUE_ACTIVE` | step `conversation` 的 countdown/npc/choosing/user phases | `src/pages/act-i/ActI.tsx` | 对话已有; **缺**对话框互斥规则 (§3.4.2); 气泡边框配色要改成 user=浅黄 / npc=紫 |
| `S4_TASK_COMPLETE` | step `conversation` 的 `complete` phase | `src/pages/act-i/ActI.tsx` | 完成卡已有; 需对齐居中/渐变底/删箭头 (Diff #1-#4) |

### 架构决策点 (需要用户拍板)

当前 Scene 1 横跨 `curtain` → `after-party` → `conversation` 三个 step。spec 把它们当一个场景。两种走法:

- **A. 保持 3-step 拆分** (改动小): spec 的 S0-S5 当成逻辑视图, 各 step 内部对齐 spec 的 UI 规格。优点: 不大改架构, 风险低。缺点: "一个场景的状态机"是分散的。
- **B. 合并成单个 `Scene1` 组件** (改动大): 把 curtain + after-party + conversation 揉成一个内部 S0-S4 状态机。优点: 完全贴 spec。缺点: 大重构, 要重接 App.tsx, 风险高。

**Claude 建议 A**: 当前 step 拆分本身能表达 spec 的状态流, 逐个 step 对齐 UI 规格即可拿到 spec 想要的体验, 不值得为"状态机集中"做大重构。除非用户明确要 B。

### 注意: voice / STT 还没接

spec §3.4.3 的 STT/TTS 判定 (用户说话检测、NPC TTS onended) 当前**没有实现**, conversation 现在是 tap-to-pick 选项树, 不是真语音。voice 集成在 `docs/internal/TODO.md` 里是单独一项 backlog。spec 里的 voice 行为先按"占位 / 用 tap 模拟"处理, 真 voice 后续单独做。

---

## 1. 场景状态机

### 1.1 状态枚举

| State | 含义 | 持续时长 |
|---|---|---|
| `S0_CURTAIN_OPENING` | 幕布拉开动画中 | ~800ms |
| `S1_CHARACTER_REVEAL` | 人影 + 姓名浮现 | ~1200ms |
| `S2_TASK_BRIEFING` | 任务框弹出, 等待用户选择 | 等待用户输入 |
| `S3_DIALOGUE_ACTIVE` | 对话进行中 | 直到任务条件满足 |
| `S4_TASK_COMPLETE` | 任务完成弹窗 | 等待用户点击继续 |

### 1.2 状态转移

```
S0 --[幕布动画 onAnimationEnd]--> S1
S1 --[人影动画 onAnimationEnd + delay 500ms]--> S2
S2 --[点击「开始」按钮]--> S3
S2 --[点击「跳过」按钮]--> EXIT_SCENE
S3 --[任务完成条件触发]--> S4
S4 --[点击「继续」按钮]--> NEXT_SCENE
```

### 1.3 设计原则

- **单向转移**: 所有状态转移不可回退 (用户没有「上一步」按钮)
- **状态独占**: 同一时刻只允许一个 State 处于 active
- **资源生命周期**: 进入新 State 时, 上一 State 的临时 UI 元素应销毁 (具体规则见第 3 节)

---

## 2. UI 元素清单

### 2.1 元素 ID 表

| ID | 元素 | 类型 | 样式归属 |
|---|---|---|---|
| `#stage` | 场景背景 | 持久 | Style Guide §3.1 |
| `#curtain` | 幕布层 | 临时 (S0) | 紫色渐变 §3.2 |
| `#character-silhouette` | 人影 | 持久 (S1 后) | 模糊处理 §1 |
| `#character-name-tag` | 姓名标签 | 持久 (S1 后) | 在人影上方 |
| `#task-briefing-modal` | 任务框 | 临时 (S2) | 类型 A |
| `#todo-checklist` | 左上角待完成清单 | 临时 (S3) | 类型 C |
| `#voice-prompt` | 语音对话按钮+提示 | 临时 (S3) | 类型 C |
| `#dialogue-bubble-user` | 用户对话框 | 动态创建/销毁 (S3) | 类型 B-用户 |
| `#dialogue-bubble-npc` | NPC 对话框 | 动态创建/销毁 (S3) | 类型 B-NPC |
| `#task-complete-modal` | 任务完成框 | 临时 (S4) | 类型 A |

### 2.2 对话框三种类型

参考 Style Guide §6, 本场景共有三类对话框, **视觉权重从高到低**:

| 类型 | 用途 | 样式 | 示例元素 |
|---|---|---|---|
| **类型 A: 任务框** | 强引导, 打断主流程 | 浅紫色渐变白色背景, 无边框 | `#task-briefing-modal`, `#task-complete-modal` |
| **类型 B: 人物对话框** | 叙事内容承载 | 白色底 + 角色色边框 | `#dialogue-bubble-user` (浅黄边框), `#dialogue-bubble-npc` (紫色边框) |
| **类型 C: 系统提示框** | 辅助引导, 不打断 | 半透明背景 | `#voice-prompt`, `#todo-checklist` |

**实现建议**: 将这三类抽象为三个基础组件 `<TaskModal>`, `<DialogueBubble role="user|npc">`, `<SystemHint>`, 统一管理样式。

---

## 3. 状态 × UI 规格

### 3.1 S0_CURTAIN_OPENING

| 元素 | 状态 | 动画 |
|---|---|---|
| `#curtain` | 可见 → 隐藏 | 上下分开, ease-out 800ms |
| `#stage` | 隐藏 → 可见 | 幕布拉开后入场, 左右轻摇 ±2° 一次 (600ms) |
| 其他所有元素 | 不渲染 | 无 |

**完成判据**: `#curtain` 动画 + `#stage` 左右摇晃动画全部结束 → 触发 S1

### 3.2 S1_CHARACTER_REVEAL

| 元素 | 状态 | 动画 |
|---|---|---|
| `#character-silhouette` | 淡入 | opacity 0 → 1, duration 400ms |
| `#character-name-tag` | 在人影**上方**淡入 | delay 300ms, opacity 0 → 1, duration 400ms |

**布局**: `#character-name-tag` 锚定在 `#character-silhouette` 顶部中心, 垂直偏移 -8px

**完成判据**: 姓名标签淡入结束 + 500ms 缓冲 → 触发 S2

### 3.3 S2_TASK_BRIEFING

| 元素 | 状态 | 备注 |
|---|---|---|
| `#stage` | 模糊 + 变暗 | `backdrop-filter: blur(8px); brightness(0.7);` |
| `#character-silhouette` / `#name-tag` | 保留, 但随背景一起模糊 | 不需单独处理 |
| `#task-briefing-modal` | 居中弹出 | 见下方规格 |

**`#task-briefing-modal` 规格**:

| 属性 | 值 |
|---|---|
| 位置 | viewport 水平 + 垂直双居中 |
| 标题 | `text-align: center` |
| 背景 | `linear-gradient(180deg, #6B63D4 0%, #FFFFFF 100%)` (浅紫到白) |
| 边框 | 无 |
| 内容 | 标题 + 任务描述 + 两个按钮 |
| 按钮组 | 【开始】(主按钮, 紫色渐变) +【跳过】(次按钮, 浅紫 `#dddbe9`) |
| 按钮样式 | 沿用 Style Guide §3.3 三态按钮 |

**转移**:
- 点击【开始】→ 销毁 modal → S3
- 点击【跳过】→ 销毁 modal + 整个场景 → EXIT

### 3.4 S3_DIALOGUE_ACTIVE

#### 3.4.1 进入时的初始化

| 元素 | 操作 |
|---|---|
| `#stage` | 解除模糊和变暗, 恢复原状 |
| `#task-briefing-modal` | 销毁 |
| `#todo-checklist` | 在左上角挂载, 显示当前任务文本, 半透明背景 |
| `#voice-prompt` | 在底部挂载, 半透明背景, 提示「点击说话」或类似引导 |

#### 3.4.2 对话框互斥规则 (核心交互)

⚠️ **本规则反直觉, 必须严格实现, 否则违背设计意图。**

```
规则: 屏幕上同时最多存在一个 dialogue bubble (user 或 npc)

触发逻辑:
  当 NPC 开始说话 → 销毁当前可见的 #dialogue-bubble-user (如果存在)
  当 User 开始说话 → 销毁当前可见的 #dialogue-bubble-npc (如果存在)
```

**目的**: 避免聊天记录堆叠遮挡场景, 强调"当前正在交流"的瞬时感。

#### 3.4.3 「开始说话」与「说完话」的判定

| 角色 | "开始说话"判定 | "说完话"判定 |
|---|---|---|
| User | STT 检测到首个非静音音频帧 | STT 检测到连续静音 ≥ 1.5s, 或用户主动点击停止按钮 |
| NPC | 后端推送 `npc_speak_start` 事件 | TTS 音频 `onended` 事件触发 |

> 落地注: 当前无 voice, 用 tap-to-pick 模拟。"开始/说完"判定先用选项点击 + 定时器模拟。

#### 3.4.4 对话框渲染规格

**`#dialogue-bubble-user`**:

| 属性 | 值 |
|---|---|
| 背景 | 白色 `#FFFFFF` |
| 边框 | 浅黄色 `#FCD34D` (`var(--accent-yellow-soft)`), 2px solid |
| 文本 | 实时流式更新 (STT 转写) |
| 位置 | 屏幕底部偏右 |
| 圆角 | 16px |

**`#dialogue-bubble-npc`**:

| 属性 | 值 |
|---|---|
| 背景 | 白色 `#FFFFFF` |
| 边框 | 紫色 `#6B63D4` (`var(--text-accent)`), 2px solid |
| 文本 | 后端推送, 可流式或一次性显示 |
| 位置 | 屏幕中部偏左 (贴近人物) |
| 圆角 | 16px |

#### 3.4.5 任务完成判定

由业务逻辑层 (对话引擎) 决定何时触发 `task_complete` 事件。前端收到事件后:
1. 销毁当前所有 dialogue bubble
2. 销毁 `#voice-prompt`
3. 保留 `#todo-checklist` 直到 S4 结束
4. 进入 S4

### 3.5 S4_TASK_COMPLETE

| 元素 | 状态 | 备注 |
|---|---|---|
| `#task-complete-modal` | 居中弹出 | 规格同 `#task-briefing-modal` |
| 内容 | 标题「任务完成!」+【继续】单按钮 | |

**【继续】按钮**: 纯文字, **无箭头图标** (见第 4 节 Diff 项 #5)

**转移**: 点击【继续】→ 销毁 modal → NEXT_SCENE

---

## 4. 修改清单 (Diff)

> 以下为相对当前构建版本需要修改的项。每项独立可验收。

| # | 截图位置 | 修改内容 | 修改原因 | 优先级 |
|---|---|---|---|---|
| 1 | 截图 3 (任务完成框) | 位置改为画面**正中** (horizontal + vertical 双居中) | 当前位置偏移 | P0 |
| 2 | 截图 3 (任务完成框) | 背景改为**浅紫色渐变白色**: `linear-gradient(180deg, #6B63D4 0%, #FFFFFF 100%)` | 当前为纯紫色块, 不符合 §6 规范 | P0 |
| 3 | 截图 3 (底部小字) | **删除**「任务完成后,点击继续」一行小字 | 冗余引导, 按钮自身已表达 | P1 |
| 4 | 截图 3 (继续按钮) | **删除**按钮上的箭头图标 | 视觉简化 | P1 |
| 5 | **全局所有按钮** | **删除**所有按钮上的箭头图标 | 视觉风格统一 | P1 |
| 6 | 截图 2 (任务框) | 标题改为**居中**对齐 | 当前左对齐 | P0 |
| 7 | 截图 2 (任务框) | 背景改为浅紫渐变白色 (同 #2) | 统一类型 A 样式 | P0 |
| 8 | 截图 2 (任务框) | 位置改为画面正中 | 与 #1 一致 | P0 |

---

## 5. 验收清单

开发自测时按以下顺序走一遍:

- [ ] 进入场景, 幕布动画播放, 场景左右摇晃一次
- [ ] 人影淡入, 姓名出现在人影上方
- [ ] 背景模糊变暗, 任务框居中弹出, 标题居中
- [ ] 任务框背景为浅紫到白渐变, 无箭头图标
- [ ] 点击「跳过」可退出场景
- [ ] 点击「开始」后, 背景恢复清晰, 左上角出现待完成清单
- [ ] 底部出现语音提示按钮, 半透明背景
- [ ] 用户说话时, 浅黄边框对话框实时显示转写文本
- [ ] NPC 说话时, 紫色边框对话框出现, **用户的上一个气泡消失**
- [ ] 用户接着说话时, **NPC 的上一个气泡消失**
- [ ] 任务完成后, 任务完成框居中弹出, 浅紫渐变背景
- [ ] 任务完成框无小字提示, 【继续】按钮无箭头
- [ ] 点击【继续】退出场景

---

## 6. 开放问题 (需求方需澄清)

以下问题暂未明确, 请确认后再实现:

1. **「跳过」按钮的退出行为**: 是退到上一层菜单, 还是直接结束本次任务? (当前实现: 跳到 Goal 设定屏)
2. **STT 静音阈值 1.5s 是否合理**: 还是要可配置? (当前: 无 voice, 不适用)
3. **NPC 文本是否需要打字机效果**: 还是一次性显示? (当前: 有 TypingDots 打字中指示)
4. **`#todo-checklist` 在 S4 期间是否依然显示**: 还是任务完成时一起淡出?
5. **场景退出后的过渡动画**: 是否需要幕布合上的反向动画?

---

*文档结束*
