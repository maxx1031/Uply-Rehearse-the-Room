# Branch Registry · 分支登记表

> 多人并行协作的「单一事实源」: 每个模块/页面**当前活跃的分支**、负责人、状态。
> 任何人开始/暂停/完成工作时, 都来这里更新自己那行.
> 最终合并到 main 的决策也以这张表为准.

## 当前模块状态总表

| 模块 | 负责人 | 当前活跃分支 | 状态 | 上次更新 | 备注 |
|---|---|---|---|---|---|
| intro · splash/ticket/login/curtain | max | `main` | ⚪ Merged | 2026-05-22 | 字体改 Fredoka 已合 |
| act-i · conversation (Maya 真语音) | max | `main` | ⚪ Merged | 2026-05-21 | scene 重皮 + push-to-talk |
| interlude · analyzing | — | `main` | ⚪ Merged | (旧) | 暂无修改计划 |
| interlude · result | max | `main` | ⚪ Merged | 2026-05-21 | 居中正向版,删 growth edges |
| interlude · reflection | max | `feat/review-v5-update` | 🔵 Self-tested | 2026-05-23 | 5 点离散版, 原 `page/reflection-discrete-selector` 已折入 |
| epilogue · goal | max | `main` + 待 `page/goal-style-unify` | 🟡 In progress | 2026-05-22 | 主按钮三态草稿在分支上, 暂未折入 |
| epilogue · slogan | — | `main` | ⚪ Merged | (旧) | 无修改计划 |
| epilogue · home (旧, 含底部 nav) | Yizhan520 | `main`(原版) / `feat/review-v5-update`(被 (4) 4-tab 替换) | 🔵 Self-tested | 2026-05-23 | 当前分支用 (4) 的 4-tab shell 替换原 home |
| home · 4-tab shell (home/learn/review/profile) | max | `feat/review-v5-update` | 🔵 Self-tested | 2026-05-23 | 来自 figma (4) 导出 |
| home · Learn 子屏 | max | `feat/review-v5-update` | 🔵 Self-tested | 2026-05-23 | 原样从 (4) 移入 |
| home · Review 子屏 | max | `feat/review-v5-update` | 🔵 Self-tested | 2026-05-24 | (5) 输入框结构 + 重新布局, 黄色喇叭模块 |
| profile (独立路由 + tab) | max | `feat/review-v5-update` | 🔵 Self-tested | 2026-05-22 | `?step=profile` 与 home/profile tab 双入口 |
| practice loop · Mission/Practice/MissionComplete/Review | Yizhan520 | `feat/review-v5-update`(已折入) | 🔵 Self-tested | 2026-05-22 | useRealtime 用降级 stub, 真语音待二期 |
| act-i · LinkedIn 结果屏 | Yizhan520 + max | `feat/review-v5-update` | 🔵 Self-tested | 2026-05-23 | 已删除, 对话完成直接进 analyzing |
| infra · realtime-token (Maya push-to-talk) | max | `main` | ⚪ Merged | 2026-05-21 | server VAD off |
| infra · vite 本地 token 中间件 | Yizhan520 | `feat/review-v5-update` | 🔵 Self-tested | 2026-05-22 | `pnpm dev` 也能跑真语音 |

### 状态图例
- 🟡 **In progress**: 负责人在改, 还不让别人看
- 🔵 **Self-tested**: 自测通过, 可以放到 integration 跨测
- 🟢 **Cross-tested**: 跨测通过, 等协调合并
- ⚪ **Merged**: 已进 main

---

## 待合并分支清单

> 这些分支已自测通过但暂未合 main, 等所有人都 ready 再统一合并.

| 分支 | 包含什么 | 状态 |
|---|---|---|
| `feat/review-v5-update`(当前) | 4-tab Home + Learn + Review (5) 版 + 5 点 reflection + 删 LinkedIn + practice loop + (4)/(5) 资源 | 🔵 |
| `page/goal-style-unify` | goal 屏按钮三态 (#dddbe9 → 渐变 → 按下下沉) | 🟡 (草稿) |
| `integrate/pr1` | 早期尝试的全量整合, 已被 `feat/review-v5-update` 取代 | ⚠️ 弃用候选 |
| `integrate/home-plus` | `feat/review-v5-update` 的中间态, 已折入 | ⚠️ 弃用候选 |
| `feat/home-tab-shell` | `feat/review-v5-update` 的直接父分支 | ⚠️ 弃用候选 |
| `page/reflection-discrete-selector` | 5 点 reflection 草稿, 已折入 `feat/review-v5-update` | ⚠️ 可删 |

---

## 工作流

### 1. 开始改一个模块前
1. 查这张表, 确认该模块**没人在改**, 或对方处于 🔵/🟢/⚪
2. 从 main 开新分支: `<type>/<owner>-<intent>`
   - type: `page` / `feat` / `chore` / `fix`
   - 例: `page/max-home-tab-icons`、`feat/yizhan-practice-voice`
3. 在表里**加上自己那行 + 标 🟡**

### 2. 自测通过
- 在自己分支上 `pnpm dev` 跑通
- 走完该屏的 deep-link 流程
- 把表里那行改成 🔵, 写一句备注

### 3. 跨测(可选, 多人变动相互影响时才做)
- 谁来攒 integration 谁就开 `integration/sprint-<日期>`
- 把所有 🔵 的分支 merge 进去(允许冲突, 手动解)
- 大家都在 integration 分支上验各自模块, 互不破坏
- 测好的模块在表里改 🟢

### 4. 协调合并 main
- 触发条件: 一组 🟢 分支都准备好了, 找个时间点统一推
- 顺序: 改动量小的先合, 大的后合(减少 squash 冲突)
- 每个分支 **squash merge** 到 main, commit message 含 `Reason:` 行
- 合完表里改 ⚪, 删分支
- 重要节点打 tag: `git tag -a onboarding-vX.X -m "..."`

### 5. 并行查看多个分支
**git worktree 多端口并排预览**(已在用):
```
# 给一个分支独立目录 + 独立端口
git worktree add ../uply-<name> <branch>
ln -s /Users/max/Max1031/Max_lab/uply/node_modules ../uply-<name>/node_modules
cd ../uply-<name> && pnpm dev --port 51XX
```
当前已起的:
- `5173` = 当前主仓库工作区(分支随你切)
- `5174` = `uply-main` worktree(干净 main 版)
- `5175` = `uply-pr1` worktree(合作者 PR)
- `5176` = `onboarding-new-ui-4`((4) 独立预览)

---

## 冲突预防 · 高风险文件清单

这几个文件多人同时改容易撞:
- `src/App.tsx` — 状态机/路由
- `src/lib/useRealtime.ts` — 语音核心
- `api/realtime-token.js` — token + prompt 配置
- `src/pages/act-i/ActI.tsx` — 主对话屏
- `src/pages/interlude/Interlude.tsx` — analyzing/result/reflection 都在这个文件
- `src/pages/epilogue/Epilogue.tsx` — goal/slogan/home 都在这个文件

**规则**: 改这些文件前在表里 🟡 自己那行, 提示别人你正在动它. 改完尽快 🔵 + 推送, 不要长期挂着.

---

## 维护

- 这份文档每个人都可改, 直接在自己分支上 commit, **打开 PR 时一起更新本表**
- 这文档**应该住在 main**, 让所有人看得到; 现在临时放在 `feat/review-v5-update`, 等合并时一起进 main
- 字段不够时随便加列(比如 PR 链接、预览 URL)
