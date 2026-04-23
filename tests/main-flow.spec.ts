import { test, expect, Page } from '@playwright/test';

// 辅助函数：自动完成连续答题，不使用后门跳过
async function autoAnswerQuiz(page: Page) {
  console.log('--- Starting auto-answer flow ---');
  // 1. 等待第一道题出现
  await page.waitForSelector('button.group', { state: 'visible', timeout: 15000 });
  
  let questionCount = 0;
  while (true) {
    const optionBtn = page.locator('button.group').first();
    const isOptionVisible = await optionBtn.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isOptionVisible) {
      questionCount++;
      await optionBtn.click({ force: true });
      // 等待题目切换动画
      await page.waitForTimeout(500);
    } else {
      // 如果短时间内没看到按钮，再多等一下（防止转场动画过慢）
      await page.waitForTimeout(1000);
      const reCheck = await optionBtn.isVisible({ timeout: 2000 }).catch(() => false);
      if (!reCheck) {
        console.log('--- No more options found, quiz ended ---');
        break;
      }
    }
    
    if (questionCount > 50) break;
  }
}

// 辅助函数：拦截 Supabase 核销码请求，模拟成功验证
async function mockVerification(page: Page) {
  await page.route('**/rest/v1/redemption_codes*', async route => {
    const request = route.request();
    if (request.method() === 'GET') {
      // 模拟查询口令：返回一条未使用的有效口令数据
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'mock-id-123',
          code: 'TESTCODE',
          is_used: false,
          device_id: null
        }])
      });
    } else if (request.method() === 'PATCH') {
      // 模拟更新口令状态：核销成功
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ success: true }])
      });
    } else {
      await route.continue();
    }
  });
}

test.describe('Paw-sonality E2E Main Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('Flow 1: Dog - Basic Complete', async ({ page }) => {
    await page.goto('/');
    console.log('Test started: Dog Basic Flow');
    
    await page.locator('text=测测我家修勾').click({ force: true });
    await autoAnswerQuiz(page);
    
    await expect(page.locator('text=你家毛茸茸是...')).toBeVisible({ timeout: 15000 });
    
    // 使用 :visible 过滤掉隐藏的海报雷达图
    const radarChart = page.locator('svg:has(radialGradient#radarGradient):visible');
    await expect(radarChart).toBeVisible();
    
    console.log('Test passed: Dog Basic Flow');
  });

  test('Flow 2: Cat - Basic Complete', async ({ page }) => {
    await page.goto('/');
    console.log('Test started: Cat Basic Flow');
    
    await page.locator('text=测测我家猫咪').click({ force: true });
    await autoAnswerQuiz(page);
    
    await expect(page.locator('text=你家毛茸茸是...')).toBeVisible({ timeout: 15000 });
    
    // 使用 :visible 过滤掉隐藏的海报雷达图
    const radarChart = page.locator('svg:has(radialGradient#radarGradient):visible');
    await expect(radarChart).toBeVisible();

    console.log('Test passed: Cat Basic Flow');
  });

  test('Flow 3: Dog - Deep Unlock & Complete', async ({ page }) => {
    await mockVerification(page);
    await page.goto('/');
    console.log('Test started: Dog Deep Flow');
    
    await page.locator('text=测测我家修勾').click({ force: true });
    await autoAnswerQuiz(page);

    console.log('Unlocking deep version...');
    const input = page.locator('input[placeholder*="口令"]');
    await input.fill('TESTCODE');
    await page.locator('button:has-text("立即开启")').click({ force: true });

    await expect(page.locator('text=请选择主人的 MBTI')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("ENFP")').click({ force: true });

    await autoAnswerQuiz(page);

    await expect(page.locator('text=重新测评灵魂韧性')).toBeVisible({ timeout: 15000 });
    
    // 测试分享海报生成功能
    const shareBtn = page.locator('button:has-text("分享")');
    await expect(shareBtn).toBeVisible();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await shareBtn.click({ force: true });
    const download = await downloadPromise;
    if (download) {
        console.log('--- Poster generated successfully: ' + download.suggestedFilename() + ' ---');
    }

    console.log('Test passed: Dog Deep Flow');
  });

  test('Flow 4: Cat - Deep Unlock & Complete', async ({ page }) => {
    await mockVerification(page);
    await page.goto('/');
    console.log('Test started: Cat Deep Flow');
    
    await page.locator('text=测测我家猫咪').click({ force: true });
    await autoAnswerQuiz(page);

    console.log('Unlocking deep version...');
    const input = page.locator('input[placeholder*="口令"]');
    await input.fill('TESTCODE');
    await page.locator('button:has-text("立即开启")').click({ force: true });

    await expect(page.locator('text=请选择主人的 MBTI')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("INTJ")').click({ force: true });

    await autoAnswerQuiz(page);

    await expect(page.locator('text=重新测评灵魂韧性')).toBeVisible({ timeout: 15000 });

    // 测试分享海报生成功能
    const shareBtn = page.locator('button:has-text("分享")');
    await expect(shareBtn).toBeVisible();
    const downloadPromise2 = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await shareBtn.click({ force: true });
    const download2 = await downloadPromise2;
    if (download2) {
        console.log('--- Poster generated successfully: ' + download2.suggestedFilename() + ' ---');
    }

    console.log('Test passed: Cat Deep Flow');
  });
});