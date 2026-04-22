# Paw-sonality 架构重构计划 (Refactoring Roadmap)

> **背景**：随着商业化闭环（特别是 Supabase 接入和 Admin Dashboard 建设）的完成，`ResultPage.tsx` 和 `AdminPage.tsx` 已成为过于庞大的“上帝组件”。为了长期维护和降低 AI 代码修改的冲突率，必须进行彻底的组件化拆分。

## 阶段一：Admin Dashboard 拆分 (Priority: High)
`AdminPage.tsx` 目前承载了登录、路由、图表、分页、API 请求等所有逻辑。

**目标结构**：
```text
src/pages/admin/
├── AdminLayout.tsx        # 负责侧边栏导航、Tab 切换和路由鉴权
├── components/
│   ├── LoginWall.tsx      # 登录表单
│   ├── DashboardTab.tsx   # 转化概览看板 (3个核心指标卡片)
│   ├── InsightsTab.tsx    # 引流素材大盘 (饼图和排行榜)
│   ├── ServiceTab.tsx     # 订单客服中心 (复杂的 Filter、分页 Table、重置操作)
│   └── GenerateTab.tsx    # 批量发卡中心 (输入框和历史批次卡片)
```
**实施要点**：
- 各个 Tab 组件自行在 `useEffect` 中调用对应的 `verification.ts` API，不再由顶层统一 `loadData` 并通过 props 传递（降低 Re-render 范围）。

---

## 阶段二：ResultPage (客户端核销链路) 拆分 (Priority: Medium)
`ResultPage.tsx` 目前是一个混合了海报生成、动画、支付逻辑和答题逻辑的巨型状态机。

**目标结构**：
```text
src/pages/result/
├── ResultPage.tsx         # 仅保留主状态机 (BASIC -> UNLOCK -> DEEP -> FINAL) 和海报隐藏层
├── components/
│   ├── PaywallCard.tsx    # “魔法解码”卡片（含口令输入和 supabase 验证调用）
│   ├── OwnerSelector.tsx  # 主人 16 型 MBTI 弹窗网格
│   ├── DeepQuizFlow.tsx   # 4 道深层题的进度条和答题交互
│   └── FinalReport.tsx    # 最终的治愈系文案卡片集群
```
**实施要点**：
- 将深层题的 `deepScores` 和 `deepAnswers` 状态下放到 `DeepQuizFlow.tsx` 中管理，完成后通过回调将最终结果传给顶层。
- 保持 `AnimatePresence` 在顶层 `ResultPage.tsx` 中包裹这些子组件，以确保无缝的切换动画不被破坏。

---
*提示给新上下文的 AI：阅读此文件后，请向用户确认是否立即在 `Refactoring` 分支启动“阶段一”的代码拆解。*