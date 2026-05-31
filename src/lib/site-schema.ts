import { z } from 'astro/zod'

const linkSchema = z.object({
  name: z.string().trim().min(1),
  url: z.string().trim().min(1),
})

const socialLinkSchema = z.object({
  name: z.string().trim().min(1),
  url: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  count: z.number().optional(),
  label: z.string().trim().min(1).optional(),
})

const heroMetricSchema = z.object({
  icon: z.string().trim().min(1),
  primaryValue: z.union([z.string(), z.number()]),
  primaryLabel: z.string().trim().min(1).optional(),
  secondaryValue: z.union([z.string(), z.number()]).optional(),
  secondaryLabel: z.string().trim().min(1).optional(),
})

const homeSectionSchema = z.object({
  key: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
})

export const siteSchema = z.object({
  site: z.object({
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1),
    website: z.string().trim().min(1),
    lang: z.string().trim().min(1),
    author: z.string().trim().min(1),
    ogImage: z.string().trim().min(1),
  }),
  headerLinks: z.array(linkSchema),
  footerLinks: z.array(linkSchema),
  hero: z.object({
    title: z.string().trim().min(1),
    eyebrow: z.string().trim().min(1),
    description: z.string().trim().min(1),
  }),
  heroMetric: heroMetricSchema,
  socialLinks: z.array(socialLinkSchema),
  nap: z.object({
    company: z.string().trim().min(1),
    status: z.string().trim().min(1),
    address: z.string().trim().min(1),
    phone: z.string().trim().min(1),
  }),
  homeSections: z.array(homeSectionSchema),
  footer: z.object({
    sourceUrl: z.string().trim().min(1),
  }),
})

export type SiteContent = z.infer<typeof siteSchema>
