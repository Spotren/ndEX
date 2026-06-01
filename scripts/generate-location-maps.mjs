import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const siteContentPath = path.join(projectRoot, 'src/content/site.json')
const outputDirectory = path.join(projectRoot, 'public/generated')
const outputFiles = {
  light: path.join(outputDirectory, 'location-map-light.png'),
  dark: path.join(outputDirectory, 'location-map-dark.png'),
}

loadLocalEnv('.env')
loadLocalEnv('.env.local')

await generateLocationMaps()

async function generateLocationMaps() {
  const staticMapURL = readRequiredEnv('PUBLIC_SPOTREN_STATIC_MAP_URL')
  const buildOrigin = readRequiredEnv('PUBLIC_SPOTREN_BUILD_ORIGIN')
  const allowInsecureTLS = shouldAllowInsecureTLS(staticMapURL)
  if (allowInsecureTLS) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
  const siteContent = JSON.parse(await readFile(siteContentPath, 'utf8'))
  const locationSection = siteContent?.default?.homeSections?.find?.((section) => section?.key === 'location')

  if (!locationSection || typeof locationSection !== 'object') {
    throw new Error('Missing `homeSections.location` entry in src/content/site.json.')
  }

  const latitude = parseRequiredCoordinate(locationSection.latitude, 'latitude')
  const longitude = parseRequiredCoordinate(locationSection.longitude, 'longitude')

  await mkdir(outputDirectory, { recursive: true })

  for (const theme of ['light', 'dark']) {
    const mapURL = new URL(staticMapURL)
    mapURL.searchParams.set('latitude', String(latitude))
    mapURL.searchParams.set('longitude', String(longitude))
    mapURL.searchParams.set('theme', theme)
    mapURL.searchParams.set('width', '700')
    mapURL.searchParams.set('height', '350')

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
      throw new Error(`Static map request failed for theme=${theme} with status ${response.status}.${body ? ` Response: ${body}` : ''}`)
    }

    const contentType = response.headers.get('content-type')?.trim().toLowerCase() ?? ''
    if (!contentType.startsWith('image/')) {
      throw new Error(`Static map request for theme=${theme} returned unexpected content-type: ${contentType || 'unknown'}.`)
    }

    const bytes = Buffer.from(await response.arrayBuffer())
    await writeFile(outputFiles[theme], bytes)
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

function readRequiredEnv(key) {
  const value = process.env[key]?.trim()
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
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
