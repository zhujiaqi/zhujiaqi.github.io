import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { rssSchema } from '@astrojs/rss';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: rssSchema.extend({
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    projectSchema: z.object({
      name: z.string(),
      description: z.string(),
      programmingLanguage: z.string(),
      codeRepository: z.string(),
      keywords: z.array(z.string()),
      runtimePlatform: z.string().optional()
    }).optional()
  }),
});

export const collections = { blog };
