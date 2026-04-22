# Paw-sonality 商业化核销系统架构设计 (Serverless 方案)

> **版本**: v1.0
> **架构师**: Gemini CLI
> **核心选型**: Supabase (PostgreSQL) + React (单体工程) + FingerprintJS

---

## 1. 业务挑战与核心诉求
作为一款面向小红书/抖音引流的轻量级测试产品，其商业闭环的核心在于“口令（激活码）”的分发与核销。
*   **防白嫖**：一个口令只能被一个用户使用，防止在评论区公开分享。
*   **低阻力**：用户无需繁琐的手机号注册/登录，输入 4~6 位短口令即可解锁。
*   **复访体验**：用户在不清理浏览器缓存的情况下，刷新页面或次日重访，依然保持已解锁状态；即使缓存丢失，凭借原设备+原口令也能重新验证通过。
*   **低运维成本**：避免搭建沉重的 Node.js/Java 后端，采用 Serverless 架构，免费额度内支撑初期商业化探索。

## 2. 技术栈与架构决策

我们采用 **方案 B：Supabase Serverless 架构**，并在当前 React 单体工程中进行全栈开发（Monorepo 理念）。

*   **Database (BaaS)**: Supabase (提供 PostgreSQL 数据库及直接的 REST API 暴露)。
*   **Client SDK**: `@supabase/supabase-js`。
*   **设备唯一性识别**: `@fingerprintjs/fingerprintjs` (用于生成浏览器设备指纹，替代传统的账号体系)。
*   **管理后台 (Admin)**: 在当前 React 工程中通过路由隐藏（如 `/admin-secret`）配合简单的密码校验，实现发卡功能。

---

## 3. 数据库设计 (Supabase Schema)

需要在 Supabase 中创建核心表 `redemption_codes`。

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | uuid | Primary Key, Default: `uuid_generate_v4()` | 唯一标识 |
| `code` | varchar(10) | Unique, Not Null | 6位随机短口令（发给用户的激活码） |
| `is_used` | boolean | Default: `false` | 是否已被首次核销 |
| `device_id` | varchar(255) | Nullable | 首次核销绑定的设备指纹 |
| `used_at` | timestamptz | Nullable | 首次核销的时间戳 |
| `created_at` | timestamptz | Default: `now()` | 批次生成时间 |
| `batch_id` | varchar(50) | Nullable | 发卡批次号（方便后台管理） |

**索引建议**：为 `code` 字段建立 B-Tree 索引，加速前端校验查询。

---

## 4. 核心业务流程流转

### A. 运营发卡流程 (Admin 端)
1. 运营人员访问 `/admin` 路由，输入管理员密码。
2. 点击“生成 100 个激活码”。
3. 前端生成 100 个不重复的 6 位大写字母+数字组合。
4. 调用 Supabase 批量 `insert` 到 `redemption_codes` 表。
5. 前端展示列表，支持一键导出 CSV/Excel，用于发给小红书买家。

### B. 用户核销流程 (Client 端)
1. **输入阶段**：用户在结果页支付墙输入 6 位口令，点击“解锁”。
2. **指纹采集**：前端静默调用 FingerprintJS 生成当前浏览器的唯一 `visitorId` (如 `xyz123abc`)。
3. **查库校验** (Supabase SDK)：
   - 按 `code` 查询记录。若不存在 -> 提示“口令无效”。
   - 若 `is_used == false` (全新码) -> 更新该记录 `is_used = true, device_id = 访客ID, used_at = now()` -> **核销成功**。
   - 若 `is_used == true` (已被用过) -> 校验库中的 `device_id` 是否等于当前 `visitorId`。
     - 相等 -> 属于该用户重访补登，允许通过 -> **恢复解锁成功**。
     - 不等 -> 属于别人分享的码或跨设备 -> 提示“该口令已在其他设备使用”。
4. **状态持久化**：成功后，将 `code` 存入浏览器的 `localStorage`。

### C. 页面重载流程 (Refresh)
1. React 挂载 `useEffect`，检查 `localStorage` 是否有 `code`。
2. （可选/静默）使用本地 `code` 和当前 `device_id` 去 Supabase 做一次免感校验。
3. 校验通过，直接进入 `FINAL` 全量报告阶段。

---

## 5. 工程目录规划 (在现有体系下)

```text
src/
├── api/
│   ├── supabase.ts         # Supabase 客户端初始化实例
│   ├── verification.ts     # 封装核销、生成、指纹相关的独立业务函数
├── pages/
│   ├── AdminPage.tsx       # 隐藏的发卡管理后台
│   ├── ResultPage.tsx      # (改造) 接入 verification.ts 替换写死的 '8888'
├── utils/
│   ├── fingerprint.ts      # 浏览器指纹生成单例
```

## 6. 开发实施路径 (Roadmap)
- [x] **架构设计**：完成方案输出与技术栈敲定。
- [ ] **依赖安装**：安装 Supabase SDK 与 FingerprintJS。
- [ ] **指纹与 API 层封装**：编写 `fingerprint.ts` 和 `verification.ts` 基础骨架。
- [ ] **ResultPage 接入**：将 ResultPage 中的假逻辑替换为异步真实 API 校验流程。
- [ ] **Admin 后台开发**：实现批量生成与查验。
