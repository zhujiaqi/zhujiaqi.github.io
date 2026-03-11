import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });
  
  // Test blog post page
  await page.goto('http://localhost:4322/blog/2026-03-11-building-with-opencode/', {
    waitUntil: 'networkidle'
  });
  
  await page.screenshot({ 
    path: 'screenshots/blog-post-full.png',
    fullPage: true 
  });
  
  // Get HTML for inspection
  const html = await page.content();
  console.log('HTML length:', html.length);
  
  await browser.close();
  console.log('Screenshots captured!');
})();
