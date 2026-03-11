# Zhu Jiaqi - Personal Site

A modern, minimal personal website built with [Astro](https://astro.build).

## Features

- **Fast & Lightweight**: Zero JavaScript by default, ships only HTML & CSS
- **Content Collections**: Type-safe markdown blog with Zod validation
- **RSS Feed**: Auto-generated RSS for blog posts
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Automatic dark mode based on system preference
- **SEO Optimized**: Proper meta tags, semantic HTML, clean URLs
- **GitHub Pages Ready**: Automated deployment workflow included

## Project Structure

```
src/
├── content/
│   └── blog/              # Markdown blog posts
├── layouts/
│   └── BaseLayout.astro   # Site-wide layout with styles
├── pages/
│   ├── index.astro        # About Me page
│   ├── blog/
│   │   ├── index.astro    # Blog list
│   │   └── [...slug].astro # Dynamic blog posts
│   └── rss.xml.js         # RSS feed endpoint
└── test/
    ├── components/        # Vitest component tests
    └── e2e/               # Playwright E2E tests
```

## Getting Started

### Prerequisites

- Node.js >= 22.12.0
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Site runs at http://localhost:4321

### Building

```bash
npm run build
```

Output in `dist/` directory.

### Testing

```bash
# Unit/component tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run test:e2e
```

## Adding Blog Posts

1. Create a new `.md` file in `src/content/blog/`
2. Name format: `YYYY-MM-DD-slug.md`
3. Required frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   description: "Brief description for SEO"
   pubDate: 2026-03-11
   tags: ["tag1", "tag2"]
   draft: false  # Set to true to hide from production
   ---
   ```
4. Write your content in Markdown

## Deployment

This site is configured for GitHub Pages deployment:

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site updates at https://zjq.me

## Tech Stack

- **Framework**: Astro 6.x
- **Language**: TypeScript (strict mode)
- **Styling**: Scoped CSS with CSS variables
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: GitHub Pages

## License

MIT
