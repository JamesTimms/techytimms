import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1).max(70),
    summary: z.string().min(1).max(160), // Capped for meta description, RSS and social card.
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string().min(1).max(70),
    summary: z.string().min(1).max(160), // Capped for meta description, RSS and social card.
    role: z.string().min(1),
    period: z.string().min(1),
    stack: z.array(z.string()).default([]),
    outcome: z.string().min(1),
    url: z.url().optional(),
    repo: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, work };
