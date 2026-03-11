import { test, expect } from '@playwright/test';

test.describe('Blog Post', () => {
  test('renders first blog post', async ({ page }) => {
    await page.goto('/blog/2026-03-01-first-post/');
    
    await expect(page).toHaveTitle(/My First Blog Post/);
    await expect(page.locator('h1')).toContainText('My First Blog Post');
    await expect(page.locator('.post-date')).toBeVisible();
    await expect(page.locator('.post-tags')).toBeVisible();
  });

  test('post has content', async ({ page }) => {
    await page.goto('/blog/2026-03-01-first-post/');
    
    const content = page.locator('.post-content');
    await expect(content).toBeVisible();
    await expect(content).toContainText('Welcome to my personal site');
  });

  test('post has back link', async ({ page }) => {
    await page.goto('/blog/2026-03-01-first-post/');
    
    const backLink = page.locator('.back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/blog');
  });

  test('back link works', async ({ page }) => {
    await page.goto('/blog/2026-03-01-first-post/');
    
    await page.locator('.back-link').click();
    await expect(page).toHaveURL('/blog');
  });

  test('post has tags', async ({ page }) => {
    await page.goto('/blog/2026-03-01-first-post/');
    
    const tags = page.locator('.post-tags .tag');
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });
});
