import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const siteContentPath = path.join(projectRoot, 'src/content/site.json')
const outputDirectory = path.join(projectRoot, 'public/generated/product-thumbs')

await generateProductThumbs()

async function generateProductThumbs() {
  await mkdir(outputDirectory, { recursive: true })

  const siteContent = JSON.parse(await readFile(siteContentPath, 'utf8'))
  const sections = Array.isArray(siteContent?.body?.sections) ? siteContent.body.sections : []

  for (const [sectionIndex, section] of sections.entries()) {
    if (section?.key !== 'products' || !Array.isArray(section.products)) {
      continue
    }

    for (const [productIndex, product] of section.products.entries()) {
      const imageSource = typeof product?.imageUrl === 'string' ? product.imageUrl.trim() : ''
      if (!imageSource) {
        continue
      }

      const targetPath = path.join(outputDirectory, `${sectionIndex}-${productIndex}.avif`)

      try {
        const sourceBuffer = await readImageSource(imageSource)
        if (!sourceBuffer) {
          continue
        }

        const thumbBuffer = await sharp(sourceBuffer)
          .resize(321, 181, {
            fit: 'cover',
            position: 'centre',
          })
          .avif({ quality: 58, effort: 6 })
          .toBuffer()

        await writeFile(targetPath, thumbBuffer)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.warn(`[generate-product-thumbs] Skipping "${product?.title || `${sectionIndex}-${productIndex}`}" because the image could not be processed: ${imageSource}`)
        console.warn(`[generate-product-thumbs] ${message}`)
      }
    }
  }
}

async function readImageSource(imageSource) {
  if (/^https?:\/\//i.test(imageSource)) {
    const response = await fetch(imageSource, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Image request failed with status ${response.status}.`)
    }
    return Buffer.from(await response.arrayBuffer())
  }

  const resolvedPath = path.resolve(projectRoot, imageSource.replace(/^\//, ''))
  if (!existsSync(resolvedPath)) {
    throw new Error(`Local image not found at ${resolvedPath}.`)
  }
  return readFile(resolvedPath)
}
