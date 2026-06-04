import { getCollection, getEntry } from 'astro:content'

import type { SiteContent } from './site-schema'

export async function getSiteData(): Promise<SiteContent> {
  const siteEntry = (await getEntry('site', 'site')) ?? (await getCollection('site')).at(0)
  if (siteEntry) {
    return siteEntry.data
  }

  throw new Error('Missing site content in src/content/site.json')
}
