# Paw-sonality 付费墙功能开发设计文档

> **版本**：v1.0  
> **核心理念**：低摩擦、高价值感、宿命感闭环。

---

## 1. 核心业务流程 (User Flow)

1.  **阶段 A (免费)**：用户完成 12 题 -> 看到 4 位 MBTI 结果（如 ENFP）+ 预览版雷达图（4轴）+ 预览版简评。
2.  **触发付费**：用户点击“解锁全量报告” -> 弹出支付码/口令输入框。
3.  **验证与持久化**：
    *   校验口令（目前模拟校验，预留 API 接口）。
    *   **关键点**：校验成功后，立即将 `unlock_token` 存入 `localStorage`，确保刷新不丢失。
4.  **阶段 B (深化)**：
    *   **交互 1**：弹出“主人性格选择器”，用户选择自己的 MBTI 类型。
    *   **交互 2**：进入 4 道深层情绪题测试（猫/狗独立题库）。
5.  **最终解码 (全量报告)**：
    *   展示 5 位完整结果（如 ENFP-T）。
    *   展示 **5 轴雷达图**（新增“情绪张力”维度）。
    *   展示 **【天作之合】** 契合度文案（永远正向、宿命感）。
    *   展示 **【给主人的信】**（治愈系金句）。

---

## 2. 技术架构设计

### A. 数据结构扩展 (`src/types/index.ts`)
```typescript
interface Scores {
  // 基础维度
  E: number; I: number; 
  S: number; N: number;
  T: number; F: number;
  J: number; P: number;
  // 第5维度 (付费解锁)
  Turbulent: number; // 动荡/敏感
  Assertive: number;  // 坚决/稳健
}

interface DeepAnalysis {
  mbti5: string; // 如 ENFP-T
  soulKeywords: string[]; // 能量关键词
  emotionalLogic: string; // 第5维度解析
  soulmateLogic: string;  // 契合度解析 (基于主宠类型计算)
  letterToOwner: string;  // 治愈系金句
}
```

### B. 组件结构变更
- **`ResultPage.tsx`**：变为状态机模式，管理 `IDLE` -> `UNLOCKING` -> `DEEP_QUIZ` -> `FINAL_REPORT`。
- **`RadarChart.tsx`**：重构为动态轴模式，支持从 4 轴平滑过渡（动画）到 5 轴。
- **`MBTISelector.tsx`** (New)：Q 弹风格的主人类型选择器。

### C. 持久化策略
- **Key**: `paws_unlocked_data`
- **Value**: `{ type: 'cat' | 'dog', baseMBTI: 'ENFP', unlockCode: '8888', ownerMBTI: 'INFP', ... }`
- **逻辑**：页面初始化时检查 `localStorage`，若存在有效数据且口令匹配，直接跳过支付墙。

---

## 3. “天作之合”契合度算法逻辑

为了保证“永远不出现不合适”，我们将逻辑抽象为：
- **同频共振型 (相同/相似类型)**：“你们拥有共用的灵魂频率，无需言语即可感知对方的喜悲。”
- **跨界互补型 (相反类型)**：“它是你在这个喧嚣世界的锚点，带你领略你未曾察觉的温柔风景。”
- **守护引领型 (部分重合)**：“在它的陪伴下，你变得更加完整，它用纯粹治愈了你的焦虑。”

---

## 4. 视觉爆点设计 (Visual Highlights)

1.  **解锁动效**：输入口令成功时，使用 Canvas Confetti 或华丽的 SVG 粒子散开效果。
2.  **雷达图生长**：雷达图从 4 轴增加到 5 轴时，原有的图形进行丝滑的形变（Framer Motion layout transition）。
3.  **付费海报样式**：底色增加精细的 Mesh Gradient 纹理，增加“宠格认证”印章。

---

## 5. 后续开发计划
1.  **Phase 1**: 实现 LocalStorage 持久化与口令校验骨架。
2.  **Phase 2**: 开发 5 轴动态雷达图与解锁动画。
3.  **Phase 3**: 注入“天作之合”模板数据与 4 道深层题。
4.  **Phase 4**: 最终视觉调优与海报导出适配。

---
*文档已就绪。如无异议，请下达编码指令。*
