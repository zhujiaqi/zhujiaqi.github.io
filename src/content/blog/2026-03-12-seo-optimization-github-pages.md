---
title: "SEO Optimization for GitHub Pages: A Complete Guide for 2026"
description: "How I optimized my zjq.me GitHub Pages site for search engines using Astro, automated sitemaps, and GitHub-specific strategies."
pubDate: 2026-03-12
tags: ["seo", "github-pages", "astro", "web-development", "search-engine"]
draft: false
---

GitHub Pages sites are inherently fast—they're static, served from a CDN, and zero-config. But speed alone won't get you ranked. After deploying this site at [zjq.me](https://zjq.me), I implemented a comprehensive SEO strategy that combines standard web optimization with GitHub-specific authority signals.

Here's the complete roadmap I followed, with code you can copy.

---

## The Tech Stack

This site is built with **Astro 6.x**, not Jekyll. That matters because:

- Astro ships zero JavaScript by default (faster load times = better Core Web Vitals)
- Content Collections provide type-safe frontmatter
- Integrations like `@astrojs/sitemap` automate SEO tasks

If you're starting fresh, Astro is a better choice than Jekyll in 2026. Here's why and how I optimized it.

---

## 1. Automated On-Page SEO with Meta Tags

### The Problem

Every page needs:
- Unique `<title>` and `<description>` tags
- Open Graph tags (for LinkedIn/X/Facebook previews)
- Twitter Card tags
- Canonical URLs
- Proper `robots` directives

Manually adding these to every page is error-prone.

### The Solution: Enhanced BaseLayout

I created a reusable `BaseLayout.astro` component that accepts SEO props and generates all meta tags automatically:

```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
  description?: string;
  image?: string;
  canonicalURL?: string;
  noindex?: boolean;
}

const {
  title,
  description = "Default description",
  image = "/og-image.png",
  canonicalURL,
  noindex = false
} = Astro.props;

const siteUrl = 'https://zjq.me';
const fullUrl = canonicalURL || Astro.url?.href || siteUrl;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="author" content="Zhu Jiaqi" />
    <link rel="canonical" href={fullUrl} />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={fullUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, siteUrl).href} />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={new URL(image, siteUrl).href} />
  </head>
  <!-- ... -->
</html>
```

**Usage example:**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout 
  title="My Blog Post" 
  description="A compelling description for SEO"
  image="/blog-post-og.png"
>
  <article>...</article>
</BaseLayout>
```

**What this does:**
- Generates consistent meta tags across all pages
- Creates beautiful link previews on social media
- Sets canonical URLs to prevent duplicate content issues
- Supports `noindex` for draft/private pages

---

## 2. Automated Sitemap Generation

A sitemap tells search engines which pages exist and how often they change.

### For Astro Sites

Install the official sitemap integration:

```bash
npm install @astrojs/sitemap
```

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zjq.me',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
```

That's it. On every `npm run build`, Astro generates:
- `sitemap-index.xml` (index file)
- `sitemap-0.xml` (page URLs)

**No manual maintenance required.** New blog posts are automatically included.

### For Other Static Site Generators

- **Jekyll**: Use `jekyll-sitemap` plugin
- **Hugo**: Built-in sitemap generation
- **Plain HTML**: Use a GitHub Action like `cicirello/generate-sitemap`

---

## 3. Robots.txt Configuration

Create `public/robots.txt` (or `static/robots.txt` depending on your SSG):

```txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://zjq.me/sitemap.xml

# Optional: Polite crawl delay
Crawl-delay: 1
```

**Key points:**
- `User-agent: *` applies to all crawlers
- `Allow: /` permits crawling all pages
- `Sitemap:` directive points crawlers to your sitemap
- `Crawl-delay` is optional but polite for small sites

---

## 4. Google Search Console Verification

Google won't prioritize your site if it doesn't know you own it.

### Steps:

1. Go to [Google Search Console](https://search.google.com/search-console/about)
2. Choose **URL Prefix** method
3. Enter `https://zjq.me`
4. Download the HTML verification file (e.g., `google1234567890.html`)
5. Upload to your repository root
6. Push to `main` branch
7. Click **Verify** in Search Console

### Pro Tip: DNS Verification

If you own a custom domain (like `zjq.me`), use **DNS verification** instead:
- Add a TXT record to your domain's DNS
- Works for all subdomains automatically
- More permanent than HTML file

---

## 5. GitHub Repository SEO (The Secret Sauce)

Google treats your GitHub repo (`github.com/user/repo`) and live site (`user.github.io`) as linked entities. Optimizing the repo boosts the site's authority.

### Optimize the "About" Section

1. Go to your repo's main page
2. Click the gear icon next to "About" (right sidebar)
3. Fill in:
   - **Description**: Keyword-rich summary (e.g., "Personal site of a full-stack developer specializing in Python, Go, and AI-powered solutions")
   - **Website**: `https://zjq.me`
   - **Topics**: Add relevant tags like `portfolio`, `web-development`, `javascript`, `astro`

### Optimize README.md

Your README is indexed by Google. Include:
- Clear heading with your name/site purpose
- Brief description of what the site contains
- Links to key sections (About, Blog, Projects)
- Tech stack badges (optional but helpful)

**Example:**

```markdown
# Zhu Jiaqi - Personal Site

A modern, minimal personal website built with [Astro](https://astro.build).

## Features

- Full-stack developer portfolio
- Technical blog about web development and AI
- Open source projects and contributions

## Tech Stack

- **Framework**: Astro 6.x
- **Language**: TypeScript
- **Deployment**: GitHub Pages

🌐 Live site: https://zjq.me
```

---

## 6. Performance & Core Web Vitals

In 2026, Core Web Vitals are non-negotiable for ranking.

### Image Optimization

Never upload raw 5MB photos. I use:
- **WebP format** (smaller than JPEG/PNG)
- **Astro's Image component** (automatic optimization)
- **Lazy loading** for below-fold images

```astro
---
import { Image } from 'astro:assets';
import myImage from '../images/profile.webp';
---

<Image src={myImage} alt="Profile photo" loading="lazy" width={400} />
```

### Enforce HTTPS

In GitHub Repository Settings → Pages:
- ✅ Check "Enforce HTTPS"
- Secure sites get a slight ranking boost
- Required for HTTP/2 (faster loading)

### Semantic HTML

Use proper tags instead of `<div>` soup:
- `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- Proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
- `<time datetime="...">` for dates

This helps AI models (Google Gemini, ChatGPT) parse your content for "AI Overviews."

---

## 7. Content Strategy for AI Search

Google's Search Generative Experience (SGE) and AI Overviews are changing SEO.

### What Works in 2026:

1. **Clear headings**: AI extracts answers from well-structured content
2. **Direct answers**: Start sections with concise summaries
3. **Schema markup**: Use JSON-LD for articles, person, organization
4. **Internal linking**: Link related posts to establish topic clusters

### Example: Blog Post Structure

```markdown
# How to Optimize GitHub Pages for SEO

**TL;DR**: Use automated sitemaps, proper meta tags, and optimize your GitHub repo's About section.

## Why GitHub Pages SEO Matters

[Explanation...]

## Step 1: Set Up Meta Tags

[Detailed instructions...]

## Step 2: Generate a Sitemap

[Detailed instructions...]
```

---

## 8. Monitoring & Analytics

### Google Search Console

Once verified, monitor:
- **Coverage**: Which pages are indexed
- **Search queries**: What keywords bring traffic
- **Mobile usability**: Any rendering issues
- **Core Web Vitals**: Page speed metrics

### Google Analytics (Optional)

For traffic analysis:
- Add GA4 tracking to your layout
- Respect user privacy (GDPR/CCPA compliance)
- Consider privacy-focused alternatives like Plausible or Fathom

---

## The Complete Checklist

Before launching your GitHub Pages site:

- [ ] Meta tags on every page (title, description, OG, Twitter)
- [ ] Sitemap generated and submitted to Google
- [ ] `robots.txt` configured
- [ ] Google Search Console verified
- [ ] GitHub repo About section filled
- [ ] README.md optimized with keywords
- [ ] Images compressed (WebP format)
- [ ] HTTPS enforced
- [ ] Semantic HTML used throughout
- [ ] Mobile responsive (test on real devices)
- [ ] Core Web Vitals passing (check in Search Console)

---

## What's Next

SEO isn't a one-time task. It's ongoing:
- Monitor Search Console monthly
- Update old content with new information
- Build backlinks (guest posts, open source contributions)
- Track rankings for target keywords

For this site, I'll be writing more about:
- AI-assisted development workflows
- LLM architecture deep-dives
- Python/Go backend patterns

Stay tuned—and may your search rankings be ever in your favor.

---

**Resources:**
- [Google Search Central Documentation](https://developers.google.com/search/docs)
- [Astro SEO Guide](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Core Web Vitals Guide](https://web.dev/vitals/)
