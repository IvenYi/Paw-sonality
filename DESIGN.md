# DESIGN.md

> 治愈、Q弹、充满沉浸感的宠物性格测试体验。

## 1. Visual Theme & Atmosphere

**Style**: Playful & Friendly Aesthetics (多邻国/Bubbly UI)
**Keywords**: Q弹, 治愈, 温暖, 有呼吸感, 有机形状
**Tone**: 幽默温馨 — NOT 严肃冷漠、硬朗生硬
**Feel**: 像是在一个洒满阳光的午后，和毛孩子的一次灵魂对话。

**Interaction Tier**: L2 流畅交互
**Dependencies**: Framer Motion + React

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #FFFCF9;
  --surface: #FFFFFF;
  --surface-alt: #FFF5D6;
  --surface-hover: #FAFAFA;

  /* Borders */
  --border: transparent;
  --border-hover: rgba(239, 90, 61, 0.3);

  /* Text */
  --text: #4A2C2A;
  --text-secondary: rgba(74, 44, 42, 0.6);
  --text-tertiary: rgba(74, 44, 42, 0.4);

  /* Accent */
  --accent: #EF5A3D;
  --accent-hover: #D9492E;
  
  /* Pet Accents */
  --accent-yellow: #FFF5D6;
  --accent-pink: #FFEBEE;
  --accent-blue: #E3F2FD;

  /* RGB variants for rgba() */
  --bg-rgb: 255, 252, 249;
  --accent-rgb: 239, 90, 61;
}
```

**Color Rules:**
- 所有页面使用 `--bg` 作为主背景，配合 Mesh Gradient 营造氛围。
- 文本颜色优先使用 `--text` (Chocolate色)，避免使用纯黑 `#000000`。
- 强调色仅用于主 CTA 或关键视觉点。

## 3. Typography Rules

**Font Stack:**
(使用本地化部署，不依赖 Google Fonts 外部链接)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Alimama | 4xl-8xl | Normal | Tight | Normal |
| Slogan | Muyao | 2xl-4xl | Normal | Normal | Wide |
| H3 (Card) | Alimama | 2xl-3xl | Normal | Tight | Normal |
| Body | GenJyuu | base-lg | Medium | Relaxed | Normal |
| English | Fredoka | xs-xl | 300-700 | Normal | Wide |

**Typography Rules:**
- **NEVER use**: SimSun, Times New Roman, 任何生硬的黑体或宋体。
- 中英文排版需要明确的视觉层级区分。

## 4. Component Stylings

### Buttons
```css
.btn-primary {
  background-color: var(--accent);
  color: white;
  border-radius: 2rem;
  padding: 1.5rem 2rem;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(var(--accent-rgb), 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(var(--accent-rgb), 0.4);
}
.btn-primary:active {
  transform: scale(0.95);
}
```

### Cards
```css
.bubbly-card {
  background: var(--surface);
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 2px solid var(--border);
  transition: all 0.3s ease;
}
.bubbly-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: var(--border-hover);
}
```

## 5. Layout Principles

**Container:**
- Max width: 4xl (896px)
- Padding: 1.5rem (6)
- Narrow variant (text-heavy): 2xl (672px)

**Spacing Scale:**
- Section padding: pt-16 pb-20
- Component gap: gap-6 / space-y-6

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | 无阴影 | 普通文本容器 |
| Subtle | shadow-sm / shadow-soft | 标签、次要卡片 |
| Elevated | shadow-xl / shadow-2xl | 悬停状态卡片、主 Logo、CTA 按钮 |
| Inner | shadow-inner | 图标背景框 |

## 7. Animation & Interaction

**Motion Philosophy**: Q弹生动，通过 Spring 动画和微弱的浮动呼吸感，打破静态网页的死板。
**Tier**: L2

### Base Setup
(React + Framer Motion)

### Entrance Animation
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ type: "spring", stiffness: 260, damping: 20 }}
```

### Hover & Focus States
```javascript
whileHover={{ y: -10 }}
whileTap={{ scale: 0.95 }}
```

### Special Effects (Continuous Floating)
```javascript
animate={{ y: [0, -8, 0] }}
transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 8. Do's and Don'ts

### Do
- 必须使用大圆角 (>= 1.5rem) 营造亲和力。
- 必须在背景中使用 Mesh Gradient (模糊光晕) 提升氛围感。
- 必须使用规定的三种中文字体区分标题、标语和正文。
- 必须为所有的点击区域添加 `active:scale` 或 `whileTap` 触压反馈。
- 必须保留足够的留白，避免元素拥挤。

### Don't
- ❌ 绝对不要使用纯黑 `#000000` 作为文字颜色。
- ❌ 绝对不要使用直角或小圆角 (< 16px) 的卡片。
- ❌ 绝对不要在移动端隐藏 Hover 对应的点击缩小状态（必须保留触感）。
- ❌ 绝对不要让卡片占满全屏宽度（必须有左右 padding 呼吸感）。
- ❌ 绝对不要使用默认的宋体或黑体。
- ❌ 绝对不要使用过多的线框，优先使用阴影区分层级。
- ❌ 绝对不要让页面完全静态，至少要有进场动画。
- ❌ 绝对不要忽略文字的行高，正文 `line-height` 必须大于 1.5 (`leading-relaxed`)。

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 768px | 标题字号加大，卡片宽度固定，留白增加 |
| Mobile | < 768px | 标题字号适中，卡片保持居中且有侧边距 |

**Touch Targets:** minimum 48x48px
**Collapsing Strategy:** 移动端堆叠，避免横向滚动。
