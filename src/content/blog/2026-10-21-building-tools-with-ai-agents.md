---
title: "Building Small Tools with AI Agents: From DSH Plugins to Beer Styles"
description: "How I use DeepSeek Harness, agent skills, and parallel AI workflows to ship local-first tools: a secret-paste plugin, a BJCP style database, and a craft-beer watch skill."
pubDate: 2026-10-21
tags: ["ai", "agents", "deepseek-harness", "dsh", "bjcp", "craft-beer", "local-first"]
draft: false
---

Most of the tools I ship now start as a conversation with an AI agent. Not "generate a project for me" — more like pairing with someone who can hold a large codebase, a messy data source, and a deployment checklist in mind at the same time.

Over the last few months that workflow produced three things I actually use: a security plugin for DeepSeek Harness, a local-first BJCP style database with a bilingual web UI, and a craft-beer watch skill. They look different, but the process was the same.

## Constraints first, code second

The useful part of working with an agent is not typing speed. It is being forced to state constraints early:

- Where does the data live? If it is local-only, the architecture changes completely.
- Who owns the content? If it is someone else's copyrighted text, "publish it" is a legal question before it is a coding question.
- What is the smallest artifact? A single HTML file? A skill folder? A browser plugin?
- How will we know it works? For a UI, that means a real browser, not just a successful build.

Once those answers exist, the agent can explore the repository, propose a plan, and work in parallel. Without them, it will happily build the wrong thing very quickly.

## Case 1: DSH Secret Paste

DeepSeek Harness is the agent environment I use daily. The problem was simple and slightly alarming: when you paste an API key into the composer, the plaintext goes to the model and into the session transcript. That is exactly where a secret should never be.

[DSH Secret Paste](https://github.com/zhujiaqi/dsh-secret-paste) is a small plugin that intercepts the paste:

- a secret scanner (rules derived from gitleaks and TruffleHog) classifies the text;
- high-confidence matches are stored through the official credentials API, not a new server route;
- the draft is replaced with a placeholder like [secret:PASTE_1];
- the model can call a minimal resolve tool only when it actually needs the value.

The interesting engineering was not the detection. It was resisting the temptation to add features: no reveal endpoint, no new storage format, no silent rewriting of ambiguous text. The plugin is small on purpose. It has tests for detection, resolution, and bundling, and it is published on npm.

This is a good example of a task where AI helped most with the boring edges: reading the host's plugin conventions, wiring the client and server halves, and checking that the placeholder survives the message pipeline.

## Case 2: BJCP Styles

The second project started with an app that no longer worked: a BJCP style lookup tool on my phone. The data behind it is the Beer Judge Certification Program style guidelines — a standard document with hundreds of styles, and a licensing boundary around republishing it.

The build has three layers (the code lives in the [BJCP Styles Toolkit](https://github.com/zhujiaqi/bjcp-styles-toolkit)):

1. A local SQLite database generated from the official Markdown source, with every style's description and vital statistics parsed into fields.
2. A translation layer that keeps a Simplified-Chinese edition separate from the English original, using content hashes so only changed paragraphs are re-translated.
3. A single-file web UI with a browser-language default, a manual language switch, and a Cloudflare Pages deployment.

A companion [agent skill](https://github.com/zhujiaqi/bjcp-styles-skill) lets the assistant query the same local database without shipping any of the guideline text.

The legal layer mattered as much as the code. The BJCP allows personal and educational reformatting but not public reposting without permission. So the first version was password-protected and used only for review; after the BJCP education director approved the project, it became public at bjcp.zjq.me. The page keeps the copyright notice and links back to the official site. A public GitHub repository contains only the toolkit and skill — no guideline text, no translations, no database.

Working with the agent here was mostly about verification. We parsed PDFs, compared official translations, ran browser regression tests, and checked the deployed page byte-for-byte against the local build. AI is fast at producing a plausible result; the value is in making it prove the result.

## Case 3: Craft Beer Watch

[Craft Beer Watch](https://github.com/zhujiaqi/craft-beer-watch) is not an app at all. It is a skill: a folder of instructions and a small CLI that an agent loads when I ask about beer.

The interesting design constraint is packaging. A hazy IPA and a double dry-hopped version of the same beer are different products with separate scores; a can and a bottle are not the same entry. If the data model merges them, every recommendation becomes slightly wrong.

So the skill starts with a profile (taste preferences, styles, breweries, region, package formats, score threshold) and then answers two questions well: what is new and highly rated in my scope, and what else in the same style is worth trying. The AI part is the interface; the discipline is in the data model.

## What I learned about working with agents

A few habits made the difference across all three projects:

- **Give the agent the real repository, not a summary.** Most of the useful work came from reading existing code, tests, and conventions.
- **Parallelize independent work.** Translation chunks, README audits, and regression checks can run as separate agents. The hard part is defining boundaries so their outputs merge cleanly.
- **Make verification cheap.** A headless browser test, a content-hash check, or a curl assertion catches more than another round of prompt tweaking.
- **Keep public artifacts minimal.** Code and docs can be open; copyrighted data and credentials cannot. Clean git history matters too.
- **Ask before publishing.** The BJCP conversation took a few emails. It was worth it, and the project is better for it.

## What's next

I am continuing to treat these small tools as a personal lab: a plugin that makes the agent safer, a data tool that makes a standard easier to read, and a skill that answers a question I actually have. The common thread is not "AI writes code". It is that the cost of exploring an idea is now low enough that the interesting work moves to choosing the right constraints — and then proving the result.

If you want to try any of them, the repositories are open, and the BJCP lookup is live at [bjcp.zjq.me](https://bjcp.zjq.me).
