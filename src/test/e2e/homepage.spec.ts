import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/About Me/);
  });

  test('displays personal information', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Zhu Jiaqi');
    await expect(page.locator('.tagline')).toContainText('Tech Enthusiast');
  });

  test('has contact information', async ({ page }) => {
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
  });

  test('has proper navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
  });

  test('displays current status section', async ({ page }) => {
    await expect(page.locator('.current-status')).toBeVisible();
    await expect(page.locator('.status-indicator')).toBeVisible();
  });

  test('has "What I Do" section', async ({ page }) => {
    await expect(page.locator('.what-i-do')).toBeVisible();
    await expect(page.locator('.activity-list')).toBeVisible();
  });

  test('footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Built with');
    await expect(page.locator('footer a[href="https://astro.build"]')).toBeVisible();
  });
});
