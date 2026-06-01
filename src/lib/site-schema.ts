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

const homeSectionSchema = (image: () => any) =>
  z.object({
    key: z.string().trim().min(1),
    title: z.string().trim().min(1),
    description: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    mapAlt: z.string().trim().min(1).optional(),
    gmn_url: z.string().trim().min(1).optional(),
    map_url: image().optional(),
    items: z
      .array(
        z.object({
          name: z.string().trim().min(1),
          role: z.string().trim().min(1).optional(),
          rating: z.number().int().min(1).max(5),
          quote: z.string().trim().min(1),
        })
      )
      .optional(),
    services: z
      .array(
        z.object({
          name: z.string().trim().min(1),
          type: z.string().trim().min(1),
          price: z.string().trim().min(1).optional(),
        })
      )
      .optional(),
    products: z
      .array(
        z.object({
          image: image(),
          name: z.string().trim().min(1),
          category: z.string().trim().min(1),
          price: z.string().trim().min(1).optional(),
          description: z.string().trim().min(1).optional(),
          url: z.string().trim().min(1).optional(),
        })
      )
      .optional(),
    faqs: z
      .array(
        z.object({
          category: z.string().trim().min(1),
          question: z.string().trim().min(1),
          answer: z.string().trim().min(1),
        })
      )
      .optional(),
  })

export const siteSchema = (image: () => any) =>
  z.object({
    site: z.object({
      title: z.string().trim().min(1).max(255),
      seo_title: z.string().trim().min(1).max(255),
      description: z.string().trim().min(1),
      website: z.string().trim().min(1),
      lang: z.string().trim().min(1),
      author: z.string().trim().min(1),
      city: z.string().trim().min(1),
      ogImage: z.string().trim().min(1),
      icon: image(),
      logo: image(),
    }),
    headerLinks: z.array(linkSchema),
    footerLinks: z.array(linkSchema),
    hero: z.object({
      brand: z.string().trim().min(1),
      tagline: z.string().trim().min(1),
      pitch: z.string().trim().min(1),
    }),
    heroMetric: heroMetricSchema,
    homeLabels: z.object({
      contactUs: z.string().trim().min(1),
      socialLinkAriaLabelPrefix: z.string().trim().min(1),
      locationDescriptionTemplate: z.string().trim().min(1),
      openMapTitle: z.string().trim().min(1),
      uberCtaTitle: z.string().trim().min(1),
      uberCtaDescription: z.string().trim().min(1),
      postsTitle: z.string().trim().min(1),
      pinnedLabel: z.string().trim().min(1),
      recentLabel: z.string().trim().min(1),
      postsSummarySuffix: z.string().trim().min(1),
    }),
    socialLinks: z.array(socialLinkSchema),
    nap: z.object({
      company: z.string().trim().min(1),
      status: z.string().trim().min(1),
      address: z.string().trim().min(1),
      phone: z.string().trim().min(1),
      wap: z.boolean(),
    }),
    homeSections: z.array(homeSectionSchema(image)),
    footer: z.object({
      sourceUrl: z.string().trim().min(1),
    }),
  })

export type SiteContent = z.infer<ReturnType<typeof siteSchema>>
