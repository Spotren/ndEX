import { getEntry } from 'astro:content'

import type { SiteContent } from './site-schema'

export async function getSiteData(): Promise<SiteContent> {
  const entry = await getEntry('site', 'default')
  if (!entry) {
    throw new Error('Missing site content entry "default" in src/content/site.json')
  }

  return entry.data
}
