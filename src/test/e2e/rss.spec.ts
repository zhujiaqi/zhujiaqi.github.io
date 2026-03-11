import { test, expect } from '@playwright/test';

test.describe('RSS Feed', () => {
  test('RSS feed is accessible', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.ok()).toBe(true);
  });

  test('RSS feed has valid XML structure', async ({ page }) => {
    await page.goto('/rss.xml');
    
    const body = await page.locator('body').textContent();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
  });

  test('RSS feed contains blog posts', async ({ page }) => {
    await page.goto('/rss.xml');
    
    const body = await page.locator('body').textContent();
    expect(body).toContain('<item>');
    expect(body).toContain('<title>');
    expect(body).toContain('My First Blog Post');
  });

  test('RSS feed has proper metadata', async ({ page }) => {
    await page.goto('/rss.xml');
    
    const body = await page.locator('body').textContent();
    expect(body).toContain('Zhu Jiaqi');
    expect(body).toContain('<description>');
    expect(body).toContain('<language>en-us</language>');
  });

  test('RSS auto-discovery link exists on homepage', async ({ page }) => {
    await page.goto('/');
    
    const rssLink = page.locator('link[rel="alternate"][type="application/rss+xml"]');
    await expect(rssLink).toHaveAttribute('href', expect.stringContaining('rss.xml'));
  });
});
