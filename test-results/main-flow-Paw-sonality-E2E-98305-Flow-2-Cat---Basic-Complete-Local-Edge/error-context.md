# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: main-flow.spec.ts >> Paw-sonality E2E Main Flow >> Flow 2: Cat - Basic Complete
- Location: tests\main-flow.spec.ts:86:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('svg:has(radialGradient#radarGradient):visible')
Expected: visible
Error: strict mode violation: locator('svg:has(radialGradient#radarGradient):visible') resolved to 2 elements:
    1) <svg width="600" height="600" viewBox="0 0 600 600" class="overflow-visible relative z-10">…</svg> aka locator('#share-poster').getByText('能量感知判断生活')
    2) <svg width="320" height="320" viewBox="0 0 320 320" class="overflow-visible relative z-10">…</svg> aka getByText('能量感知判断生活').nth(1)

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('svg:has(radialGradient#radarGradient):visible')

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - heading "PAW-SONALITY" [level=1] [ref=e8]
    - generic [ref=e10]:
      - heading "宠格深度解码报告" [level=2] [ref=e11]
      - generic [ref=e12]:
        - generic [ref=e13]: ESFJ
        - img [ref=e14]
      - paragraph [ref=e16]: 热心肠的护门大将 / 唠叨碎碎念王者
      - generic [ref=e19]:
        - img [ref=e20]:
          - generic [ref=e26]: 能量
          - generic [ref=e27]: 感知
          - generic [ref=e28]: 判断
          - generic [ref=e29]: 生活
        - generic [ref=e30]:
          - generic [ref=e32]:
            - generic [ref=e33]: 能量
            - generic [ref=e34]: 100%
          - generic [ref=e38]:
            - generic [ref=e39]: 感知
            - generic [ref=e40]: 100%
          - generic [ref=e44]:
            - generic [ref=e45]: 判断
            - generic [ref=e46]: 59%
          - generic [ref=e50]:
            - generic [ref=e51]: 生活
            - generic [ref=e52]: 100%
      - generic [ref=e56]:
        - img [ref=e57]
        - generic [ref=e60]: 它简直是个有着“老妈子”属性的猫咪。它极其在乎家里的规矩和每一个家庭成员的动向，只要你出门太久或者作息不规律，它就会跟在你屁股后面喵喵叫个不停，像是在严厉地训斥你。它非常需要你的回应，只要你跟它搭话，它就能跟你聊上大半天。这种带着点唠叨的深沉爱意，是它专属的温柔。
        - img [ref=e61]
    - generic [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - paragraph [ref=e67]: They speak.
          - paragraph [ref=e68]: But we listen.
        - generic [ref=e69]:
          - paragraph [ref=e70]: WWW.PAWSONALITY.PRO
          - paragraph [ref=e71]: 扫描即刻解锁它的宇宙
      - img [ref=e74]
  - generic [ref=e76]:
    - heading "你家毛茸茸是..." [level=2] [ref=e77]
    - generic [ref=e78]:
      - generic [ref=e80]: ESFJ
      - img [ref=e82]
    - paragraph [ref=e84]: 热心肠的护门大将 / 唠叨碎碎念王者
    - generic [ref=e85]:
      - img [ref=e86]
      - paragraph [ref=e89]: 它简直是个有着“老妈子”属性的猫咪。它极其在乎家里的规矩和每一个家庭成员的动向，只要你出门太久或者作息不规律，它就会跟在你屁股后面喵喵叫个不停，像是在严厉地训斥你。它非常需要你的回应，只要你跟它搭话，它就能跟你聊上大半天。这种带着点唠叨的深沉爱意，是它专属的温柔。
      - img [ref=e90]
    - generic [ref=e94]:
      - img [ref=e95]:
        - generic [ref=e101]: 能量
        - generic [ref=e102]: 感知
        - generic [ref=e103]: 判断
        - generic [ref=e104]: 生活
      - generic [ref=e105]:
        - generic [ref=e107]:
          - generic [ref=e108]: 能量
          - generic [ref=e109]: 100%
        - generic [ref=e113]:
          - generic [ref=e114]: 感知
          - generic [ref=e115]: 100%
        - generic [ref=e119]:
          - generic [ref=e120]: 判断
          - generic [ref=e121]: 59%
        - generic [ref=e125]:
          - generic [ref=e126]: 生活
          - generic [ref=e127]: 100%
    - generic [ref=e131]:
      - generic [ref=e132]:
        - heading "开启它的灵魂私语" [level=3] [ref=e133]
        - paragraph [ref=e134]: They speak. But we listen.
      - generic [ref=e135]:
        - generic [ref=e136]:
          - img [ref=e138]
          - generic [ref=e140]:
            - text: 第 5 维度
            - text: 深度解码
        - generic [ref=e141]:
          - img [ref=e143]
          - generic [ref=e145]:
            - text: 主宠契合
            - text: 灵魂报告
        - generic [ref=e146]:
          - img [ref=e148]
          - generic [ref=e151]:
            - text: 4道深度
            - text: 测评加题
      - generic [ref=e152]:
        - textbox "输入魔法口令" [ref=e153]
        - button "立即开启" [ref=e154] [cursor=pointer]
      - button "如何获取口令？" [ref=e155] [cursor=pointer]:
        - img [ref=e156]
        - text: 如何获取口令？
    - generic [ref=e159]:
      - button "正在生成..." [disabled] [ref=e160]:
        - img [ref=e161]
        - generic [ref=e167]: 正在生成...
      - button "换个崽重测" [ref=e169] [cursor=pointer]:
        - img [ref=e170]
        - generic [ref=e173]: 换个崽重测
      - button "清除设备指纹 (仅调试可见)" [ref=e174] [cursor=pointer]:
        - img [ref=e175]
        - text: 清除设备指纹 (仅调试可见)
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | // 辅助函数：自动完成连续答题，不使用后门跳过
  4   | async function autoAnswerQuiz(page: Page) {
  5   |   console.log('--- Starting auto-answer flow ---');
  6   |   // 1. 等待第一道题出现
  7   |   await page.waitForSelector('button.group', { state: 'visible', timeout: 15000 });
  8   |   
  9   |   let questionCount = 0;
  10  |   while (true) {
  11  |     const optionBtn = page.locator('button.group').first();
  12  |     const isOptionVisible = await optionBtn.isVisible({ timeout: 2000 }).catch(() => false);
  13  |     
  14  |     if (isOptionVisible) {
  15  |       questionCount++;
  16  |       await optionBtn.click({ force: true });
  17  |       // 等待题目切换动画
  18  |       await page.waitForTimeout(500);
  19  |     } else {
  20  |       // 如果短时间内没看到按钮，再多等一下（防止转场动画过慢）
  21  |       await page.waitForTimeout(1000);
  22  |       const reCheck = await optionBtn.isVisible({ timeout: 2000 }).catch(() => false);
  23  |       if (!reCheck) {
  24  |         console.log('--- No more options found, quiz ended ---');
  25  |         break;
  26  |       }
  27  |     }
  28  |     
  29  |     if (questionCount > 50) break;
  30  |   }
  31  | }
  32  | 
  33  | // 辅助函数：拦截 Supabase 核销码请求，模拟成功验证
  34  | async function mockVerification(page: Page) {
  35  |   await page.route('**/rest/v1/redemption_codes*', async route => {
  36  |     const request = route.request();
  37  |     if (request.method() === 'GET') {
  38  |       // 模拟查询口令：返回一条未使用的有效口令数据
  39  |       await route.fulfill({
  40  |         status: 200,
  41  |         contentType: 'application/json',
  42  |         body: JSON.stringify([{
  43  |           id: 'mock-id-123',
  44  |           code: 'TESTCODE',
  45  |           is_used: false,
  46  |           device_id: null
  47  |         }])
  48  |       });
  49  |     } else if (request.method() === 'PATCH') {
  50  |       // 模拟更新口令状态：核销成功
  51  |       await route.fulfill({
  52  |         status: 200,
  53  |         contentType: 'application/json',
  54  |         body: JSON.stringify([{ success: true }])
  55  |       });
  56  |     } else {
  57  |       await route.continue();
  58  |     }
  59  |   });
  60  | }
  61  | 
  62  | test.describe('Paw-sonality E2E Main Flow', () => {
  63  | 
  64  |   test.beforeEach(async ({ page }) => {
  65  |     await page.addInitScript(() => {
  66  |       window.localStorage.clear();
  67  |     });
  68  |   });
  69  | 
  70  |   test('Flow 1: Dog - Basic Complete', async ({ page }) => {
  71  |     await page.goto('/');
  72  |     console.log('Test started: Dog Basic Flow');
  73  |     
  74  |     await page.locator('text=测测我家修勾').click({ force: true });
  75  |     await autoAnswerQuiz(page);
  76  |     
  77  |     await expect(page.locator('text=你家毛茸茸是...')).toBeVisible({ timeout: 15000 });
  78  |     
  79  |     // 使用 :visible 过滤掉隐藏的海报雷达图
  80  |     const radarChart = page.locator('svg:has(radialGradient#radarGradient):visible');
  81  |     await expect(radarChart).toBeVisible();
  82  |     
  83  |     console.log('Test passed: Dog Basic Flow');
  84  |   });
  85  | 
  86  |   test('Flow 2: Cat - Basic Complete', async ({ page }) => {
  87  |     await page.goto('/');
  88  |     console.log('Test started: Cat Basic Flow');
  89  |     
  90  |     await page.locator('text=测测我家猫咪').click({ force: true });
  91  |     await autoAnswerQuiz(page);
  92  |     
  93  |     await expect(page.locator('text=你家毛茸茸是...')).toBeVisible({ timeout: 15000 });
  94  |     
  95  |     // 使用 :visible 过滤掉隐藏的海报雷达图
  96  |     const radarChart = page.locator('svg:has(radialGradient#radarGradient):visible');
> 97  |     await expect(radarChart).toBeVisible();
      |                              ^ Error: expect(locator).toBeVisible() failed
  98  | 
  99  |     console.log('Test passed: Cat Basic Flow');
  100 |   });
  101 | 
  102 |   test('Flow 3: Dog - Deep Unlock & Complete', async ({ page }) => {
  103 |     await mockVerification(page);
  104 |     await page.goto('/');
  105 |     console.log('Test started: Dog Deep Flow');
  106 |     
  107 |     await page.locator('text=测测我家修勾').click({ force: true });
  108 |     await autoAnswerQuiz(page);
  109 | 
  110 |     console.log('Unlocking deep version...');
  111 |     const input = page.locator('input[placeholder*="口令"]');
  112 |     await input.fill('TESTCODE');
  113 |     await page.locator('button:has-text("立即开启")').click({ force: true });
  114 | 
  115 |     await expect(page.locator('text=请选择主人的 MBTI')).toBeVisible({ timeout: 10000 });
  116 |     await page.locator('button:has-text("ENFP")').click({ force: true });
  117 | 
  118 |     await autoAnswerQuiz(page);
  119 | 
  120 |     await expect(page.locator('text=重新测评灵魂韧性')).toBeVisible({ timeout: 15000 });
  121 |     
  122 |     // 测试分享海报生成功能
  123 |     const shareBtn = page.locator('button:has-text("分享")');
  124 |     await expect(shareBtn).toBeVisible();
  125 |     const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
  126 |     await shareBtn.click({ force: true });
  127 |     const download = await downloadPromise;
  128 |     if (download) {
  129 |         console.log('--- Poster generated successfully: ' + download.suggestedFilename() + ' ---');
  130 |     }
  131 | 
  132 |     console.log('Test passed: Dog Deep Flow');
  133 |   });
  134 | 
  135 |   test('Flow 4: Cat - Deep Unlock & Complete', async ({ page }) => {
  136 |     await mockVerification(page);
  137 |     await page.goto('/');
  138 |     console.log('Test started: Cat Deep Flow');
  139 |     
  140 |     await page.locator('text=测测我家猫咪').click({ force: true });
  141 |     await autoAnswerQuiz(page);
  142 | 
  143 |     console.log('Unlocking deep version...');
  144 |     const input = page.locator('input[placeholder*="口令"]');
  145 |     await input.fill('TESTCODE');
  146 |     await page.locator('button:has-text("立即开启")').click({ force: true });
  147 | 
  148 |     await expect(page.locator('text=请选择主人的 MBTI')).toBeVisible({ timeout: 10000 });
  149 |     await page.locator('button:has-text("INTJ")').click({ force: true });
  150 | 
  151 |     await autoAnswerQuiz(page);
  152 | 
  153 |     await expect(page.locator('text=重新测评灵魂韧性')).toBeVisible({ timeout: 15000 });
  154 | 
  155 |     // 测试分享海报生成功能
  156 |     const shareBtn = page.locator('button:has-text("分享")');
  157 |     await expect(shareBtn).toBeVisible();
  158 |     const downloadPromise2 = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
  159 |     await shareBtn.click({ force: true });
  160 |     const download2 = await downloadPromise2;
  161 |     if (download2) {
  162 |         console.log('--- Poster generated successfully: ' + download2.suggestedFilename() + ' ---');
  163 |     }
  164 | 
  165 |     console.log('Test passed: Cat Deep Flow');
  166 |   });
  167 | });
```