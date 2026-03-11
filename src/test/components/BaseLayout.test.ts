import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import BaseLayout from '../src/layouts/BaseLayout.astro';

describe('BaseLayout', () => {
  it('renders with default content', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      slots: {
        default: 'Test content',
      },
    });

    expect(result).toContain('Test content');
    expect(result).toContain('<header>');
    expect(result).toContain('<nav>');
    expect(result).toContain('<main>');
    expect(result).toContain('<footer>');
  });

  it('includes RSS auto-discovery link', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      slots: {
        default: 'Content',
      },
    });

    expect(result).toContain('rel="alternate"');
    expect(result).toContain('type="application/rss+xml"');
    expect(result).toContain('rss.xml');
  });

  it('includes proper meta tags', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      slots: {
        default: 'Content',
      },
    });

    expect(result).toContain('charset="UTF-8"');
    expect(result).toContain('viewport');
    expect(result).toContain('description');
  });

  it('has proper navigation links', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      slots: {
        default: 'Content',
      },
    });

    expect(result).toContain('href="/"');
    expect(result).toContain('href="/blog"');
    expect(result).toContain('zjq.me');
  });
});
