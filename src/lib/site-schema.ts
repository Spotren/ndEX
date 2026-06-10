import { z } from 'astro/zod'

const imageAssetSchema = z
  .object({
    url: z.string().trim().optional().default(''),
    contentType: z.string().trim().optional().default(''),
  })
  .optional()

const logoSchema = z
  .object({
    url: z.string().trim().min(1).optional(),
    alt: z.string().trim().min(1).optional(),
  })
  .optional()

const priceTypeSchema = z.enum(['starting_at', 'fixed', 'free', 'none'])

const reviewItemSchema = z.object({
  name: z.string().trim().min(1),
  rating: z.number().nullable().optional(),
  quote: z.string().trim().min(1),
})

const catalogItemSchema = z.object({
  imageUrl: z.string().trim().optional().default(''),
  title: z.string().trim().min(1),
  category: z.string().trim().optional().default(''),
  priceType: priceTypeSchema,
  currency: z.string().trim().optional().default(''),
  price: z.string().trim().optional().default(''),
  period: z.string().trim().optional().default(''),
  content: z.string().trim().optional().default(''),
  ctaText: z.string().trim().optional().default(''),
  url: z.string().trim().optional().default(''),
})

const faqItemSchema = z.object({
  category: z.string().trim().optional().default(''),
  question: z.string().trim().optional().default(''),
  answer: z.string().trim().optional().default(''),
})

const socialLinkSchema = z.object({
  name: z.string().trim().min(1),
  url: z.string().trim().min(1),
  icon: z.string().trim().optional().default(''),
  count: z.number().optional(),
  label: z.string().trim().optional().default(''),
})

const sectionSchema = z.object({
  key: z.string().trim().min(1),
  title: z.string().trim().optional().default(''),
  description: z.string().trim().optional().default(''),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  googleMapsUri: z.string().trim().optional().default(''),
  items: z.array(reviewItemSchema).optional(),
  products: z.array(catalogItemSchema).optional(),
  services: z.array(catalogItemSchema).optional(),
  faqs: z
    .array(faqItemSchema)
    .optional()
    .transform((items) => (items ?? []).filter((item) => item.question.trim() && item.answer.trim())),
})

export const siteSchema = (_image: () => unknown) =>
  z.object({
    head: z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().optional().default(''),
      website: z.string().trim().optional().default(''),
      lang: z.string().trim().optional().default('en'),
      icon: imageAssetSchema,
      ogImage: imageAssetSchema,
    }),
    socialLinks: z.array(socialLinkSchema).default([]),
    body: z.object({
      logo: logoSchema,
      category: z.string().trim().optional().default(''),
      city: z.string().trim().optional().default(''),
      brand: z.string().trim().optional().default(''),
      tagline: z.string().trim().optional().default(''),
      rating: z.number().optional(),
      reviewCount: z.number().optional(),
      phone: z.string().trim().optional().default(''),
      address: z.string().trim().optional().default(''),
      openStatus: z.string().trim().optional().default(''),
      sections: z.array(sectionSchema).default([]),
    }),
    schemaGraph: z
      .object({
        '@context': z.string().trim().min(1),
        '@graph': z.array(z.record(z.string(), z.unknown())),
      })
      .optional(),
  })

export type SiteContent = z.infer<ReturnType<typeof siteSchema>>
