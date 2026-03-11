import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog/);
  });

  test('displays blog header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Blog');
    await expect(page.locator('.blog-intro')).toBeVisible();
  });

  test('lists blog posts', async ({ page }) => {
    const postList = page.locator('.post-list');
    await expect(postList).toBeVisible();
    
    const posts = postList.locator('.post-item');
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('posts have required information', async ({ page }) => {
    const firstPost = page.locator('.post-item').first();
    
    await expect(firstPost.locator('time')).toBeVisible();
    await expect(firstPost.locator('.post-title')).toBeVisible();
    await expect(firstPost.locator('.post-description')).toBeVisible();
  });

  test('posts are clickable and link to post pages', async ({ page }) => {
    const firstPostLink = page.locator('.post-item a').first();
    await expect(firstPostLink).toHaveAttribute('href');
  });

  test('navigation back to home works', async ({ page }) => {
    const homeLink = page.locator('nav a[href="/"]');
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });
});
