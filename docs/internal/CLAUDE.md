# Uply Design System Rules

## 项目定位
社交训练 App, 视觉风格: 蓝紫 + 浅黄, 剧场隐喻, 柔和治愈.

## 技术栈
- **React 18 + Vite 6**, TypeScript
- **Tailwind 4** (用 CSS 变量, 不写自定义 hex)
- 移动端优先, viewport ≤ 414px
- 动画: 允许 `motion/react` (前段 intro 屏从 Vercel 来源迁入, 大量依赖 AnimatePresence + variants). 简单 transition 仍优先走 CSS, 不必为了用 motion 而用 motion
- 路由: react-router 7
- 中文 UI 文案直接写在 JSX 中, 不抽离 i18n (hackathon 阶段)

## 强制规则 (违反即重写)
1. 所有颜色必须用 `.design/tokens.css` 中的 CSS 变量, 禁止 hex 直写
2. 所有字体只能用 Fredoka (标题) 和 Nunito (正文), 通过 `var(--font-heading)` `var(--font-body)` 调用
3. 按钮必须使用"立体按压"样式 (见 components.md 第 1 节), 禁止扁平按钮或纯描边按钮
4. 卡片/分区使用半透明堆叠, 禁止 1px solid 硬边框
5. 人物形象一律用"模糊发光剪影", 禁止生成具象人脸 (除非引用 `/assets/illustrations/avatar-*.svg`)

## 引用顺序
写任何组件前, 按需读取:
- 颜色/字号 → `.design/tokens.css`
- 按钮/输入框/卡片 → `.design/components.md`
- 页面结构/动效隐喻 → `.design/patterns.md`
- 插画/图标资源清单 → `.design/assets/README.md`

## 输出约定
- 组件文件命名: PascalCase, 一个组件一个文件
- 路径: `src/components/<Name>.tsx`, 页面在 `src/pages/<Name>.tsx`
- 局部样式优先用 Tailwind 工具类调 CSS 变量; 必须用 CSS Module 时命名 `<Name>.module.css`

## Git + Vercel 工作流 (硬规范, 每次改动都遵守)
- **分支命名**: `page/<page-name>-<intent>` (例 `page/welcome-copy-tweak`)
- **一个分支只改一个页面的一个主题**, 不混改多页面
- **跨页面全局样式 (改 tokens.css) 必须单独分支单独 commit**
- **commit message 模板**:
  ```
  <page>: <动词> <对象>

  - 改动 1
  - 改动 2

  Reason: <为什么这么改>
  Preview: <vercel preview URL>
  ```
- **单人项目也走 PR**, squash merge, 合完删分支
- **里程碑打 tag**: `git tag -a onboarding-v0.x -m "..."`
- **截图归档**: `docs/iterations/<page>-v<n>-<date>.png`
- **回滚优先级**: `git revert` > Vercel Promote 历史 deployment > 切回上一个 tag

## Claude + Codex 双助手协作

本项目同时由两个 AI 助手协助开发, 角色分工:

| 角色 | 职责 |
|---|---|
| 用户 | 提需求, 拍板, 在两端之间转述结果 (commit hash / diff 等) |
| Claude | 出方案, 把任务写成明确的可执行指令, review Codex 的 diff |
| Codex | 执行代码改动, 跑 typecheck / build, 待 review pass 才 commit / push |

### 任务流

1. 用户和 Claude 讨论需求 / 设计 / 方案
2. Claude 输出「给 Codex 的指令」: 明确到文件 / 函数 / 动作, 列出风险点和验收标准
3. 用户把指令转给 Codex (或者用户直接跟 Codex 说目标也可以, Codex 自己拆)
4. Codex 复述计划等确认 → 执行 → 跑 `pnpm typecheck` 或 `pnpm build` → 把 diff (或 `git diff --stat` + 关键文件全 diff) 贴出来
5. Claude review diff, 不通过给返工指令, 通过让 Codex commit
6. Codex commit 后 `git push`, 把 commit hash 报回用户
7. Claude 可以 `git fetch && git show <hash>` 独立验证 (尤其当 Codex 改的范围比 review 时贴的 diff 多)

### Codex 执行硬规范

- **先读再改**: 动代码前把 `docs/internal/CLAUDE.md` 整篇读完, 按需读 `.design/tokens.css` / `components.md` / `patterns.md` / `assets/README.md`
- **先复述再动手**: 拿到指令先回 "我打算改 X 文件做 Y, 风险是 Z" 等确认, 不要 cowboy 直接改
- **typecheck / build 必跑**: 改完跑 `pnpm typecheck` (有则) 或 `pnpm build`, 把输出贴回来; 任何报错先停, 不要自己猜着改下去
- **不私自 commit**: 默认 `git add` staged 但不 commit; Claude review pass 才 commit
- **commit message 走模板**: 按本文件 "Git + Vercel 工作流" 的格式, 必须写 Reason
- **遇到本文件 / `docs/internal/TODO.md` 之外的判断主动问**: 比如 "这个动效要不要", "这个文案怎么改" 这种, 不要自己拍

### 给 Codex 的入会 briefing

每次新开 Codex 会话, 用户会贴一段固定的入会指令 (包含上述分工和规范的简版). Codex 看到后应该:
1. 确认读完 `docs/internal/CLAUDE.md` 和 `docs/internal/TODO.md`
2. 报告当前 `git status` / 当前分支
3. 等任务, 不要自己找事做

## 文风约束
- **禁用破折号** (`—` `——`), 用逗号 / 句号 / 括号 / 分句替代
- 同样适用于 commit message 和 PR body
