import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import expressiveCode from 'astro-expressive-code'
import { remarkPlugins, rehypePlugins } from './plugins'
import { THEME_CONFIG } from './src/config'
import siteContent from './src/content/site.json'

export default defineConfig({
  site: siteContent.default.site.website,
  base: THEME_CONFIG.base,
  prefetch: false,
  vite: {
    // Work around duplicated Vite type trees pulled by Astro and @tailwindcss/vite.
    plugins: [tailwindcss()] as any,
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins,
    rehypePlugins,
  },
  integrations: [expressiveCode(), mdx(), sitemap(), robotsTxt()],
})
