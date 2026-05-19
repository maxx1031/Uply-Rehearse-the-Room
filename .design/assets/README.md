# Asset Index

## Illustrations (`/illustrations/`)

| 文件名 | 用途 | 尺寸 |
|---|---|---|
| `theater-stage.svg` | 注册票根头图, 开幕场景 | 600×300 |
| `silhouette-blur.svg` | 陌生人剪影 | 200×280 |
| `uply-mascot.svg` | Uply 吉祥物 (大) | 200×200 |
| `uply-mascot-sm.svg` | Uply 吉祥物 (小, 导航/徽章用) | 48×48 |

> 当前状态: 占位条目, 实际 SVG 还未导入. 用到时先在 `/illustrations/` 下放文件, 再回来登记到表格.

## Icons (`/icons/`)

统一规范: **24×24, stroke 2px, 颜色用 `currentColor`**.

| 文件名 | 用途 |
|---|---|
| `coffee.svg` | 咖啡馆场景 |
| `bar.svg` | 酒馆场景 |
| `bell.svg` | 按铃·开演 |
| `ticket.svg` | 票根 |

## 使用规则

- 引用插画用 `<img src="/assets/illustrations/xxx.svg" alt="" />`
- 引用图标用内联 SVG 或 `<Icon name="xxx" />` 组件 (待实现)
- ❌ 禁止用 emoji 替代品牌图标
- ❌ 禁止用 `lucide-react` 默认图标当品牌图标 (功能性图标可以)

## 新增物料 checklist

1. 命名: `kebab-case.svg`
2. SVG 内不写死颜色 (用 `currentColor`) 或用 token 色值
3. 上面表格登记一行
4. 单独 commit, message 形如: `assets: 加 ticket.svg / coffee.svg`
