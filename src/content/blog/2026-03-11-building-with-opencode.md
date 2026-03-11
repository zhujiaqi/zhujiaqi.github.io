---
title: "Building This Site with OpenCode and Astro: A Fully Automated Journey"
description: "How I used AI-powered development to create this personal site from scratch using OpenCode orchestrator and Astro framework."
pubDate: 2026-03-11
tags: ["astro", "ai", "opencode", "automation", "web-development"]
draft: false
---

This website you're looking at was built almost entirely through AI-assisted development. I worked with [OpenCode](https://github.com/zhujiaqi/opencode) (my own AI orchestrator project) and Astro to create a fully functional, production-ready personal site in a single session. The LLM model powering this was **Qwen3.5 Plus** from Alibaba's Bailian platform. Here's how it happened.

## The Setup

I started with a simple request: build me a personal site with Astro that has an about page and a blog. What followed was a fascinating collaboration between human intent and AI execution.

## My Initial Prompt

I gave OpenCode a comprehensive brief:

> "I'd like you to help me build my github.io personal page. I want to write it using Astro, mainly for blogging. The site should have two sections: info about myself and blog posts. Use dummy data initially, but include name, picture, email, GitHub URL, bio, and current status. Make it user-friendly and good-looking. Follow best practices, use automatic testing tools, adapt TDD approach, and research what the best practices would be for such a personal site—both technically and UX-wise. I want to present myself as a tech guru following the latest trends, but keep it clean—no flashy moving graphics."

## What OpenCode Delivered

### 1. Research Phase (Parallel Agents)

Before writing a single line of code, OpenCode launched multiple background research agents in parallel:

- **Astro Best Practices Agent**: Researched official Astro docs, analyzed top GitHub repos (AstroPaper, Fuwari), documented content collection patterns, RSS generation, and SEO strategies
- **UX Research Agent**: Studied 24+ developer portfolio sites, analyzed typography, color schemes, navigation patterns, and accessibility requirements
- **Testing Strategy Agent**: Investigated Vitest, Playwright, and CI/CD integration patterns for Astro projects

This research-first approach meant every decision was informed by real-world best practices, not guesses.

### 2. Architecture Decisions

OpenCode made several key architectural choices:

**Content Collections over file-based routing**: Instead of putting blog posts in `src/pages/blog/`, they used Astro's Content Collections API with Zod schema validation. This gives type-safe frontmatter and editor autocomplete.

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { rssSchema } from '@astrojs/rss';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: rssSchema.extend({
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**TDD from the Start**: Before implementing features, OpenCode set up Vitest for component testing and Playwright for E2E tests. Every feature was tested before being marked complete.

**Responsive Design with CSS Variables**: No Tailwind or heavy frameworks—just clean, scoped CSS with CSS variables for theming and dark mode support.

### 3. Implementation Flow

OpenCode followed a disciplined workflow:

1. **Todo Creation**: Broke the project into 14 atomic tasks before starting
2. **Parallel Delegation**: Launched research agents simultaneously
3. **Test-First Development**: Wrote tests, then implemented features
4. **Verification**: Ran `npm run build` after each change
5. **Self-Review**: Consulted Oracle agent for architecture validation

### 4. Challenges and Fixes

The development wasn't entirely smooth. We hit several bumps that required iteration:

**Trailing Slash Nightmare**: This was honestly a stupid issue that consumed multiple commits. Initially configured `trailingSlash: 'never'`, which caused 404s on all blog posts because Astro's file-based routing creates `/blog/post-name/index.html` (which naturally has a trailing slash). The fix journey:
1. First tried `trailingSlash: 'always'` - worked but felt verbose
2. Then tried `trailingSlash: 'ignore'` to accept both - didn't work for directory routes
3. Finally: updated ALL navigation links to use trailing slashes consistently (`/blog/` instead of `/blog`)
4. Had to fix: nav bar, blog post links, AND back links

**Config File Duplication**: During edits, the `astro.config.mjs` file got duplicated content (I suspect a copy-paste error during one of the OpenCode tool calls). This caused cryptic Vite errors: `Identifier '__vite_ssr_export_default__' has already been declared`. The fix was straightforward but annoying: delete and rewrite the entire file.

**CSS Styling Issues**: The blog post content wasn't inheriting styles from the base layout because Astro's scoped CSS doesn't cascade into markdown-rendered content. Had to explicitly style every element (h2, h3, p, blockquote, code, pre, ul, ol, etc.) in the blog post template. Not elegant, but necessary.

**Build Cache Problems**: Several build failures were resolved by clearing `node_modules/.vite` and rebuilding. Classic "have you tried turning it off and on again" but for build tools.

OpenCode handled these gracefully—each fix was tested, committed, and documented with honest messages about what went wrong.

### 5. Final Deliverables

Here's what OpenCode produced in one session:

**Files Created:**
- Complete Astro 6.x project structure
- Content Collections configuration
- 3 blog posts (I later consolidated to 1)
- Responsive layout with dark mode
- About page with profile section
- Blog index with auto-generated post list
- Dynamic blog post routes
- RSS feed generation
- GitHub Pages deployment workflow
- Test suite (5 test files)

**Tests Written:**
- Vitest: BaseLayout component tests
- Playwright: Homepage, Blog, Blog Post, RSS E2E tests

**Documentation:**
- README with setup instructions
- Comprehensive commit messages
- Architecture review from Oracle agent

## The Technology Stack

```json
{
  "framework": "Astro 6.x",
  "language": "TypeScript (strict)",
  "testing": ["Vitest", "Playwright"],
  "deployment": "GitHub Pages",
  "styling": "Scoped CSS with CSS variables"
}
```

## Why This Approach Matters

This wasn't just about building a website—it was a proof of concept for AI-assisted development done right. Key takeaways:

1. **AI as Orchestrator, Not Just Code Generator**: OpenCode didn't just write code; it planned, researched, delegated, tested, and verified.

2. **Best Practices by Default**: Because OpenCode researched before implementing, the result follows community best practices without me having to specify every detail.

3. **TDD is Feasible with AI**: Having AI write tests first actually speeds up development while maintaining quality.

4. **Iteration is Fast**: When we found bugs, fixes were immediate. No emotional attachment to code, just quick iterations.

5. **Documentation Happens Naturally**: Commit messages, README, code comments—all generated as part of the process.

## What I Learned

As a developer who's built many websites the traditional way, this experience changed my perspective:

- **AI doesn't replace judgment**—it amplifies it. I still made key decisions (tech stack, design direction, content).
- **The bottleneck shifts** from "how do I implement this?" to "what do I actually want?"
- **Quality can improve** when AI handles the tedious parts (tests, configs, boilerplate) and I focus on architecture and content.

## The Future

This site is now my playground for experimenting with AI coding tools. I'm actively studying LLM models, testing tools like OpenClaw, and exploring how AI agents can help with everything from PRD to production.

If you're skeptical about AI-assisted development, I get it. But experiencing it firsthand—seeing an AI orchestrator research, plan, implement, test, and deploy a complete website in one session—is genuinely transformative.

The code is on [GitHub](https://github.com/zhujiaqi/zhujiaqi.github.io). Feel free to explore, fork, or reach out if you want to discuss AI-powered development workflows.

---

*This post was written by me, but the site you're reading it on was built by my AI orchestrator. The future is collaborative.*
