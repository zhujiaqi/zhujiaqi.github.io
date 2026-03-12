---
title: "Building a Windows 95 Retro Theme Easter Egg with AI: A Modern Web Development Experiment"
description: "How I transformed my modern Astro website into a Windows 95 / Netscape Navigator time capsule with AI assistance."
pubDate: 2026-03-12
tags: ["astro", "ai", "retro-design", "web-development", "css", "windows-95"]
draft: false
---

**TL;DR**: I added a hidden easter egg to my website that transforms it into a Windows 95 / Netscape Navigator-style time capsule with Comic Sans, marquees, visitor counters, guestbook, and beveled 3D borders. Here's the complete journey from concept to pixel-perfect retro reality.

---

## The Idea

I wanted to add something fun to my personal site - a hidden retro theme that pays homage to the early days of the web. Think FrontPage 2000, GeoCities, Windows 95, and Netscape Navigator. But with a twist: modern tech stack, zero bloat, and fully accessible.

**The requirements:**
- A subtle toggle button next to my site logo
- Full Windows 95 aesthetic: Comic Sans, beveled borders, Windows gray (#c0c0c0), Netscape teal background
- Classic elements: scrolling marquee, visitor counter, guestbook with 1999-dated entries
- **Modern implementation**: No deprecated HTML, no JavaScript frameworks, pure CSS and vanilla JS
- Uniform styling across all sections
- Fully tested with automated E2E tests

## The Tech Stack

- **Framework**: Astro 6.x
- **Styling**: CSS variables + global scoped CSS
- **JavaScript**: Vanilla JS with localStorage for theme persistence
- **Testing**: Playwright for E2E visual regression tests
- **AI Assistant**: Qwen3.5 Plus via OpenCode orchestrator

## Phase 1: Research & Discovery

Before writing code, I had my AI assistant research authentic 90s web design patterns. AI can parallelize research across multiple dimensions simultaneously.

**Parallel research agents launched:**

1. **Codebase Explorer**: Mapped my Astro project structure, found BaseLayout, identified where to add the theme toggle
2. **90s Design Historian**: Gathered Windows 95 color palettes, font stacks, CSS techniques for beveled borders

### Windows 95 Color Palette

```css
:root {
  --win95-gray: #c0c0c0;        /* Classic Windows dialog gray */
  --win95-dark: #808080;        /* Dark shadow color */
  --win95-light: #ffffff;        /* Highlight color */
  --win95-blue: #000080;         /* Navy blue title bars */
  --netscape-bg: #008080;        /* Netscape teal background */
}
```

### The Beveled Border Technique

Windows 95's signature look was the 3D beveled UI element:

```css
.retro-button {
  background: #c0c0c0;
  border: 2px outset #ffffff;   /* Light top/left, dark bottom/right */
}

.retro-button:active {
  border: 2px inset #ffffff;    /* Reversed for "pressed" state */
}
```

**The trick**: `outset` borders look "raised", `inset` borders look "sunken". This is pure CSS magic.

## Phase 2: Implementation

### Step 1: Theme Toggle Architecture

The toggle button starts hidden, then appears via JavaScript:

```html
<button id="theme-toggle" class="retro-button" 
        style="display: none;">Classic</button>
```

```javascript
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'retro') {
    body.classList.add('retro-theme');
    themeToggle.textContent = 'Modern';
  }
  
  themeToggle.style.display = 'inline-block';
  themeToggle.addEventListener('click', function(e) {
    if (body.classList.contains('retro-theme')) {
      body.classList.remove('retro-theme');
      localStorage.setItem('theme', 'modern');
      this.textContent = 'Classic';
    } else {
      body.classList.add('retro-theme');
      localStorage.setItem('theme', 'retro');
      this.textContent = 'Modern';
    }
  });
})();
```

**Key insight**: The theme is just a `.retro-theme` CSS class on `<body>`. All retro styles are scoped under this class.

### Step 2: Windows 95 Base Styles

```css
.retro-theme body {
  font-family: "Times New Roman", Times, serif;
  background: #008080;  /* Netscape teal */
  background-image: 
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;  /* Grid pattern */
}

.retro-theme main {
  background: #c0c0c0;
  border: 3px outset #ffffff;
  box-shadow: 4px 4px 0 #000000;
}
```

### Step 3: Blue Gradient Section Headers

Professional Journey and Expertise & Interests got special Windows 95-style gradient headers:

```css
.retro-theme .experience,
.retro-theme .what-i-do {
  background: linear-gradient(to right, #000080, #0000ff);
  border: 3px outset #ffffff;
  color: #ffffff;
  padding: 16px;
}

.retro-theme .experience h2,
.retro-theme .what-i-do h2 {
  background: transparent;
  color: #ffff00;
  border: 2px inset #ffffff;
  text-shadow: 2px 2px 0 #ff0000;
}
```

### Step 4: Uniform White Cards

After several iterations, I made all content cards uniform:

**Professional Journey items:**
- Corporate Leadership
- AI Innovation  
- Entrepreneurship

**Expertise & Interests items:**
- Backend Engineering
- Full-Stack Development
- AI & LLM Research
- Team Leadership
- Entrepreneurship

All use identical styling:

```css
.retro-theme .experience-item,
.retro-theme .activity-list li {
  background: #ffffff;
  border: 2px inset #808080;
  padding: 24px;
  margin-bottom: 16px;
}

.retro-theme .experience-item h3,
.retro-theme .activity-list strong {
  color: #000080;
  font-family: "Comic Sans MS", cursive;
  border-bottom: 2px ridge #c0c0c0;
  padding-bottom: 6px;
  margin-bottom: 12px;
}
```

**Debugging note**: Had to fix a bug where local styles in `index.astro` were overriding the global BaseLayout styles, causing inconsistent padding. Always check for CSS specificity conflicts!

### Step 5: The Marquee

The deprecated `<marquee>` tag recreated with modern CSS:

```css
.retro-marquee {
  background: #000080;
  color: #ffff00;
  font-family: "Comic Sans MS", cursive;
  overflow: hidden;
  white-space: nowrap;
}

.retro-marquee-content {
  display: inline-block;
  padding-left: 100%;
  animation: marquee-retro 15s linear infinite;
}

@keyframes marquee-retro {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
```

**Accessibility**: Added `prefers-reduced-motion` support to disable animation for users who prefer it.

### Step 6: Visitor Counter with localStorage

```javascript
(function() {
  const counterElement = document.getElementById('visitor-count');
  let count = parseInt(localStorage.getItem('visitorCount')) || 0;
  count++;
  localStorage.setItem('visitorCount', count.toString());
  counterElement.textContent = count.toString().padStart(6, '0');
})();
```

Styled like a mechanical odometer with black background and red digital numbers.

### Step 7: The Guestbook

The pièce de résistance: a guestbook with authentic 1999-dated entries from "WebMaster", "CoolSurfer99", and "NetNavigator".

```astro
---
const entries = [
  {
    author: "WebMaster",
    date: "March 1999",
    message: "Welcome to my homepage! Please sign my guestbook!"
  },
  {
    author: "CoolSurfer99",
    date: "March 12, 1999",
    message: "Awesome site dude! Love the design."
  }
];
---

<div class="guestbook">
  <div class="guestbook-header">✍️ Sign My Guestbook!</div>
  {entries.map((entry) => (
    <div class="bulletin-entry">
      <div class="bulletin-author">{entry.author}</div>
      <div class="bulletin-message">{entry.message}</div>
    </div>
  ))}
</div>
```

## Phase 3: Testing & Debugging

### E2E Tests with Playwright

```typescript
test('clicking theme toggle switches to retro mode', async ({ page }) => {
  const themeToggle = page.getByRole('button', { name: 'Classic' });
  await themeToggle.click();
  await page.waitForTimeout(200);
  
  const modernToggle = page.getByRole('button', { name: 'Modern' });
  await expect(modernToggle).toBeVisible();
  
  const hasRetroClass = await page.evaluate(() => 
    document.body.classList.contains('retro-theme')
  );
  expect(hasRetroClass).toBe(true);
});

test('retro elements are hidden in modern mode', async ({ page }) => {
  const marquee = page.locator('.retro-marquee');
  await expect(marquee).not.toBeVisible();
  const guestbook = page.locator('.guestbook');
  await expect(guestbook).not.toBeVisible();
});
```

### The Padding Bug

Found a sneaky bug where activity list items had inconsistent padding compared to experience items. Debug output showed:

```
Experience padding: 24px
Activity padding: 16px 0px  ← Zero left/right padding!
```

**Root cause**: Local styles in `index.astro` were overriding global BaseLayout styles:

```css
/* index.astro line 189 - THE BUG */
.activity-list li { 
  padding: var(--space-md) 0;  /* ← Zero left/right! */
}
```

**Fix**: Changed to `padding: 24px;` to match experience items exactly.

**Lesson**: Always check for conflicting CSS rules across files, especially when using both global and scoped styles!

## The Results

**Build size impact**: +4KB (mostly CSS)
**JavaScript**: 0 external dependencies
**Performance**: No impact on modern theme (retro CSS only applies when active)
**Accessibility**: Maintained (semantic HTML, reduced-motion support)

### What Works

✅ Theme toggle in navbar (subtle, next to logo)
✅ Windows 95 / Netscape aesthetic (teal background, gray dialogs)
✅ Comic Sans headings with 3D text shadows
✅ Scrolling marquee (CSS-only animation)
✅ Persistent visitor counter (localStorage)
✅ Guestbook with 1999-dated entries
✅ Blue gradient section headers (Professional Journey, Expertise & Interests)
✅ Uniform white cards with inset borders (all sections identical)
✅ localStorage theme persistence
✅ Fully responsive (works on mobile!)
✅ Automated E2E tests with Playwright

### Files Created

- **`src/layouts/BaseLayout.astro`**: Theme toggle + retro CSS (700+ lines of Windows 95 styling)
- **`src/components/RetroMarquee.astro`**: Scrolling text component
- **`src/components/RetroCounter.astro`**: Visitor counter with localStorage
- **`src/components/RetroGuestbook.astro`**: Guestbook component with sample entries
- **`src/test/e2e/retro-theme.spec.ts`**: Playwright E2E tests

## What I Learned

1. **Windows 95 UI was brilliantly simple**: The entire design system was built on two border styles (`outset` and `inset`) and one gray color (#c0c0c0).

2. **CSS has come a long way**: Animations that required JavaScript in the 90s are now 5 lines of CSS. We take `@keyframes` for granted.

3. **CSS specificity matters**: Local styles can silently override global styles. Always check computed styles in DevTools when debugging.

4. **AI accelerates iteration**: Instead of spending hours tweaking CSS values, I could describe the desired look and get working code in seconds. The iteration loop went from hours to minutes.

5. **Nostalgia is powerful**: The 90s web was objectively "ugly" by modern standards, but there's something charming about its raw, unpolished authenticity. It was the wild west of the internet.

## Try It Yourself

Visit [zjq.me](https://zjq.me) and click the tiny "Classic" button next to my logo. Watch your browser transform into a Windows 95 desktop!

The toggle persists in localStorage, so your preference is remembered across visits. Click "Modern" to return to the clean, modern design.

---

*This entire post - and the feature itself - was built with AI assistance. I provided the vision and made design decisions; the AI executed the implementation details. The future of development isn't human vs. AI, it's human + AI working together.*
