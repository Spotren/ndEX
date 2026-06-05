import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const siteContentPath = path.join(projectRoot, 'src/content/site.json')
const outputDirectory = path.join(projectRoot, 'public/generated')
const mapVariants = [
  { key: 'desktop', width: 700, height: 350, zoom: 14.5, suffix: '' },
  { key: 'mobile', width: 378, height: 378, zoom: 15.2, suffix: '-mobile' },
]
const outputFiles = Object.fromEntries(
  ['light', 'dark'].flatMap((theme) =>
    mapVariants.map((variant) => [
      `${theme}${variant.suffix}`,
      path.join(outputDirectory, `location-map-${theme}${variant.suffix}.avif`),
    ])
  )
)

loadLocalEnv('.env')
loadLocalEnv('.env.local')

await generateLocationMaps()

async function generateLocationMaps() {
  try {
    const staticMapURL = process.env.PUBLIC_SPOTREN_STATIC_MAP_URL?.trim()
    const buildOrigin = process.env.PUBLIC_SPOTREN_BUILD_ORIGIN?.trim()

    if (!staticMapURL || !buildOrigin) {
      console.log('Skipping static location map generation because PUBLIC_SPOTREN_STATIC_MAP_URL or PUBLIC_SPOTREN_BUILD_ORIGIN is not configured.')
      return
    }

    const allowInsecureTLS = shouldAllowInsecureTLS(staticMapURL)
    if (allowInsecureTLS) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    const siteContent = JSON.parse(await readFile(siteContentPath, 'utf8'))
    const locationSection = siteContent?.body?.sections?.find?.((section) => section?.key === 'location')

    if (!locationSection || typeof locationSection !== 'object') {
      throw new Error('Missing `body.sections.location` entry in src/content/site.json.')
    }

    const latitude = parseRequiredCoordinate(locationSection.latitude, 'latitude')
    const longitude = parseRequiredCoordinate(locationSection.longitude, 'longitude')

    await mkdir(outputDirectory, { recursive: true })

    for (const theme of ['light', 'dark']) {
      for (const variant of mapVariants) {
        const mapURL = new URL(staticMapURL)
        mapURL.searchParams.set('latitude', String(latitude))
        mapURL.searchParams.set('longitude', String(longitude))
        mapURL.searchParams.set('theme', theme)
        mapURL.searchParams.set('width', String(variant.width))
        mapURL.searchParams.set('height', String(variant.height))
        mapURL.searchParams.set('zoom', String(variant.zoom))

        const response = await fetch(mapURL, {
          method: 'GET',
          headers: {
            Origin: buildOrigin,
            Referer: `${buildOrigin.replace(/\/$/, '')}/`,
          },
          cache: 'no-store',
        })

        if (!response.ok) {
          const body = await response.text().catch(() => '')
          throw new Error(`Static map request failed for theme=${theme} variant=${variant.key} with status ${response.status}.${body ? ` Response: ${body}` : ''}`)
        }

        const contentType = response.headers.get('content-type')?.trim().toLowerCase() ?? ''
        if (!contentType.startsWith('image/')) {
          throw new Error(`Static map request for theme=${theme} variant=${variant.key} returned unexpected content-type: ${contentType || 'unknown'}.`)
        }

        const bytes = Buffer.from(await response.arrayBuffer())
        const optimized = await sharp(bytes)
          .avif({ quality: 58, effort: 6 })
          .toBuffer()
        await writeFile(outputFiles[`${theme}${variant.suffix}`], optimized)
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`Skipping static location map generation and falling back to local map asset. ${message}`)
  }
}

function loadLocalEnv(relativePath) {
  const loader = process.loadEnvFile
  if (typeof loader !== 'function') {
    return
  }
  try {
    loader(path.join(projectRoot, relativePath))
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : ''
    if (code !== 'ENOENT') {
      throw error
    }
  }
}

function parseRequiredCoordinate(value, key) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Location section is missing a valid numeric \`${key}\` value.`)
  }
  return value
}

function shouldAllowInsecureTLS(rawURL) {
  const configured = process.env.SPOTREN_BUILD_ALLOW_INSECURE_TLS?.trim().toLowerCase()
  if (configured === 'true') {
    return true
  }
  if (configured === 'false') {
    return false
  }

  const url = new URL(rawURL)
  if (url.protocol !== 'https:') {
    return false
  }

  return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.localhost')
}
