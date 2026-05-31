import { getCollection, getEntry } from 'astro:content'

import type { SiteContent } from './site-schema'

export async function getSiteData(): Promise<SiteContent> {
  const entries = await getCollection('site')
  if (entries.length > 0) {
    return entries[0].data
  }

  const fallbackEntry = (await getEntry('site', 'default')) ?? (await getEntry('site', 'site'))
  if (fallbackEntry) {
    return fallbackEntry.data
  }

  throw new Error('Missing site content in src/content/site.json')
}
