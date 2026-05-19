# Component Specs

只写强约束和正反例. 颜色/字号/间距/阴影 一律引 `tokens.css` 的变量.

---

## 1. Button

### 三态规范
```tsx
// 未点亮 (disabled / placeholder 态)
<button className="btn-idle">Claim My Ticket</button>

// 点亮态 (主操作)
<button className="btn-primary">按铃·开演</button>

// 按下瞬间: :active 触发 translateY(4px), 80ms
```

### CSS
```css
.btn-primary {
  background: var(--btn-gradient);
  color: var(--text-on-dark);
  font-family: var(--font-heading);
  font-size: var(--fs-body);
  padding: var(--sp-3) var(--sp-5);
  border: none;
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-btn-active);
  transition: transform 80ms, box-shadow 80ms;
}
.btn-primary:active {
  transform: translateY(4px);
  box-shadow: var(--shadow-btn-pressed);
}
.btn-idle {
  background: var(--btn-idle);
  color: var(--text-secondary);
  font-family: var(--font-heading);
  font-size: var(--fs-body);
  padding: var(--sp-3) var(--sp-5);
  border: none;
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-btn-idle);
}
```

### 禁止
- ❌ 1px solid 描边按钮
- ❌ 扁平无阴影按钮
- ❌ 圆角小于 12px 的按钮

---

## 2. Card / Section

无硬边框, 靠**背景色差**和**柔和阴影**分区.

```css
.card {
  background: rgba(255, 255, 255, 0.6);  /* 半透明堆叠 */
  backdrop-filter: blur(8px);
  border-radius: var(--r-lg);
  padding: var(--sp-4);
  box-shadow: var(--shadow-card);
}
.card-highlight {
  background: var(--accent-yellow-soft);
  /* 用于强调 "金句" 等内容卡 */
}
```

### 禁止
- ❌ `border: 1px solid #xxx` 任何颜色的硬边框
- ❌ 阴影直接写 hex / rgba, 必须用 `--shadow-*` 变量

---

## 3. Input

```css
.input {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  font-family: var(--font-body);
  color: var(--text-primary);
}
.input::placeholder { color: var(--text-secondary); }
.input:focus {
  outline: 2px solid var(--text-accent);
  outline-offset: 2px;
}
```

---

## 4. Avatar / Silhouette

人物一律用**模糊发光剪影**:

```tsx
<div className="avatar-silhouette">
  <img src="/assets/illustrations/silhouette-blur.svg" alt="" />
</div>
```

```css
.avatar-silhouette {
  filter: blur(2px) drop-shadow(0 0 12px rgba(107, 99, 212, 0.4));
}
```

具象 Avatar (Uply 吉祥物) 走 `/assets/illustrations/uply-mascot.svg`, 不加 blur.

### 禁止
- ❌ 生成具象人脸 / 五官清晰的肖像
- ❌ 用 emoji 占位人物

---

## 5. PageShell (页面外壳)

所有页面统一外壳, 控制安全区 / 背景 / 顶栏 / 底部操作区.

```tsx
<PageShell bg="paper">           {/* bg="paper" | "gradient" */}
  <TopBar title="第一幕·咖啡馆" timer="00:23" />
  <ContentArea>...</ContentArea>
  <BottomAction>
    <button className="btn-primary">开幕</button>
  </BottomAction>
</PageShell>
```

- `bg="paper"`: 背景 `var(--bg-paper)`
- `bg="gradient"`: 背景 `var(--gradient-primary)`
- 顶部留 `var(--sp-5)` 安全区
- 底部操作区固定贴底, 留 `var(--sp-5)` 内边距
