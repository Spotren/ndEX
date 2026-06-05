import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const postsRoot = path.join(projectRoot, 'src/content/posts')
const outputDirectory = path.join(projectRoot, 'public/generated/post-thumbs')

await generatePostThumbs()

async function generatePostThumbs() {
  await mkdir(outputDirectory, { recursive: true })

  const entries = await readdir(postsRoot, { withFileTypes: true })
  const postDirectories = entries.filter((entry) => entry.isDirectory())

  for (const directory of postDirectories) {
    const slug = directory.name
    const mdxPath = path.join(postsRoot, slug, 'index.mdx')
    if (!existsSync(mdxPath)) {
      continue
    }

    const mdxContent = await readFile(mdxPath, 'utf8')
    const coverMatch = mdxContent.match(/^cover:\s+(.+)$/m)
    if (!coverMatch) {
      continue
    }

    const rawCoverPath = coverMatch[1].trim().replace(/^['"]|['"]$/g, '')
    const coverPath = path.resolve(postsRoot, slug, rawCoverPath)
    if (!existsSync(coverPath)) {
      continue
    }

    const targetPath = path.join(outputDirectory, `${slug}.avif`)
    try {
      const coverBuffer = await readFile(coverPath)
      const thumbBuffer = await sharp(coverBuffer)
        .resize(380, 200, {
          fit: 'cover',
          position: 'centre',
        })
        .avif({ quality: 58, effort: 6 })
        .toBuffer()

      await writeFile(targetPath, thumbBuffer)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`[generate-post-thumbs] Skipping "${slug}" because the cover could not be processed: ${coverPath}`)
      console.warn(`[generate-post-thumbs] ${message}`)
    }
  }
}
