# Page Patterns

## 隐喻词典 (写文案 / 命名时遵循)

| 业务概念 | 视觉/文案隐喻 |
|---|---|
| 注册 | 票根 (Ticket) |
| 登录 | 入场 (Enter the show) |
| 开始一次社交练习 | 开幕 (Curtain up) |
| 结束练习 | 灯灭·谢幕 |
| AI 教练 | 观众 / 提词人 |
| 用户角色 | 演员 |
| 练习反馈 | 剧评 (Review) |

## 标准页面骨架

```tsx
<PageShell bg="paper">
  <TopBar title="第一幕·咖啡馆" timer="00:23" />
  <ContentArea>
    {/* 卡片堆叠区 */}
  </ContentArea>
  <BottomAction>
    <PrimaryButton>开幕</PrimaryButton>
  </BottomAction>
</PageShell>
```

## 三幕剧流程 (onboarding)

```
[AUTH]      Register (Ticket) → Login (Enter) → CurtainScreen
                                                    │
                                                    ▼
ACT I       StageScreen (按铃·开演)
            ConversationScreen (分支选择, 触发 LinkedIn 邀请收尾)
            LinkedInScreen (~2.8s 后浮现 "End of Act I")
                    │
                    ▼
INTERLUDE   AnalyzingScreen (~4.2s, 4 个 staged tick)
            ResultScreen (archetype 展示)
            ReflectionScreen (slider, 返回 left/mid/right bucket)
                    │
                    ▼
EPILOGUE    GoalScreen (4 选 1)
            SloganScreen (~3.6s 自动跳)
            HomeScreen (落地首页)
```

## 动效原则

| 场景 | 规范 |
|---|---|
| 进场 | `fade` + `translateY(8px → 0)`, 300ms ease-out |
| 按钮按下 | `translateY(4px)`, 80ms |
| 切幕 (场景转换) | 黑场 200ms → 新场景淡入 300ms |
| Analyzing 类等待 | staged tick, 每步 ~1s |

### 禁止
- ❌ 弹跳过度 (overshoot 超过 4px)
- ❌ 旋转 / 闪烁 / 抖动
- ❌ 一次动画时长超过 600ms (单步)

## 文案语气

- 中文为主, 偶尔混入英文场景化短语 ("Curtain up", "End of Act I")
- 短句, 一行不超过 14 个汉字
- 避免说教 ("你应该", "请记得"), 用陈述 ("观众已就位")
- 隐喻一致: 永远是剧场 / 演员 / 观众, 不混进 "学习" "课程" "练习题" 这类教学语言
