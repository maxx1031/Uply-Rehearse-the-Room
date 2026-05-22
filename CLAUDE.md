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

## 执行规范

- **先读再改**: 动代码前把 CLAUDE.md 整篇读完, 按需读 `.design/tokens.css` / `components.md` / `patterns.md` / `assets/README.md`
- **typecheck / build 必跑**: 改完跑 `pnpm typecheck` (有则) 或 `pnpm build`, 把输出贴回来; 任何报错先停, 不要自己猜着改下去
- **commit message 走模板**: 按本文件 "Git + Vercel 工作流" 的格式, 必须写 Reason
- **截图归档**: 涉及页面 UI 的改动, 截图保存到 `docs/iterations/<page>-v<n>-<date>.png`
- **主动确认产品判断**: 遇到本文件 / TODO.md 之外、且无法从现有产品文档推导的判断, 先问用户再改

## 文风约束
- **禁用破折号** (`—` `——`), 用逗号 / 句号 / 括号 / 分句替代
- 同样适用于 commit message 和 PR body
