# Changelog

记录每一轮已合并到 `main` 的修改, 最新在最上面. 详细 diff 见对应 commit hash.

**维护方式**: 每次 squash merge 到 `main` 后, 在 `[未发布]` 区追加一条; 打 tag 时把这些条目归到对应版本号下.
更早的历史 (scene-1 搭建等) 见 `git log` 与 `docs/scene-1-spec.md`.

---

## [未发布] (已在 main, 还没打 tag)

- **result** (`130ece1`, 2026-05-21): 文字居中 (三条优点作为一组居中, 内部左对齐), 删除 YOUR GROWTH EDGES 整段, 所有 archetype 描述改成纯正向无批评尾巴.

### 待确认后合并的分支

- `page/reflection-discrete-selector` — reflection 页: 连续滑块改成 5 点离散选择器 (No → Yes!), 选中即显示对应回应卡 (无需提交), 滑块上移减少留白, 底部按钮改 `Next →`.
- `page/goal-style-unify` — goal 页: 场景标签从金棕 `#b9802c` 改主题紫; 主按钮换成定制三态 (禁用 `#dddbe9` / 点亮渐变 `#7c73e6→#5b52cc` / 按下 `translateY(4px)` 投影压缩为 `0 1px 0 #3d36a0`).

---

## v0.4 — 2026-05-21

tag: `onboarding-v0.4` @ `e0544ca`

- **conversation** (`7fdd66c`): 接入「按住说话」语音对话 (WebRTC + OpenAI Realtime). 按住录音、松手回复、按下打断; 用户语音逐字字幕; Maya / 用户双气泡共存; 毛玻璃居中气泡; 紫色圆柱麦克风按钮. 对话每句存入 sessionStorage (`conversationLog`) 供后续分析.
- **conversation** (`e0544ca`): MAYA 与 Connect on LinkedIn 标签改紫色 0.6 透明无边框; After Party 改粗体圆点文字; Maya 气泡移到头顶; 修复结束触发 (mark_milestone 不再依赖 `evt.name`, GA 事件常省略它); 收紧提示词让对话约 4-6 轮主动收尾并提出 LinkedIn.
