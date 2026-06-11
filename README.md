# ndEX

`ndEX` is the provisionable Astro template used by Spotren managed sites.

It is not the public checkout funnel. The public funnel lives in `spotren-sites/ndEX-builder`. This repository is the site template that gets cloned, hydrated, and deployed by `spotren-app`.

## What Spotren manages

Managed site provisioning and template sync treat these paths as generated or Spotren-owned:

- `src/content/site.json`
- `src/content/posts/**`
- `public/favicon.ico` or `public/favicon.png`
- generated assets under `public/generated/**` when the local scripts run

The backend writes `src/content/site.json`, syncs posts into `src/content/posts`, downloads the favicon into `public/`, and triggers a production deploy after template sync when needed.

## Content contract

The primary contract is `src/content/site.json`, validated by `src/lib/site-schema.ts`.

Top-level shape:

```json
{
  "head": {
    "title": "string",
    "description": "string",
    "website": "https://example.com",
    "lang": "pt-BR",
    "icon": {
      "url": "https://...",
      "contentType": "image/x-icon"
    },
    "ogImage": {
      "url": "https://...",
      "contentType": "image/webp"
    }
  },
  "socialLinks": [
    {
      "name": "instagram",
      "url": "https://..."
    }
  ],
  "body": {
    "logo": {
      "url": "https://...",
      "alt": "Brand logo"
    },
    "brand": "Spotren",
    "tagline": "Local-first positioning copy",
    "category": "Empresa de Software",
    "city": "São José do Rio Preto",
    "rating": 5,
    "reviewCount": 9,
    "phone": "(17) 99999-9999",
    "address": "Street, number, city",
    "openStatus": "Aberto agora",
    "sections": []
  },
  "schemaGraph": {
    "@context": "https://schema.org",
    "@graph": []
  }
}
```

### Supported section keys

`body.sections` supports these managed section types:

- `location`
- `reviews`
- `products`
- `services`
- `faqs`

Section payloads are validated in `src/lib/site-schema.ts`. `products` and `services` share the same catalog item shape. FAQ entries are filtered to items with both `question` and `answer`.

### Optional structured data

`schemaGraph` is optional, but Spotren-managed sites may inject it during provisioning so the homepage can emit JSON-LD without additional template edits.

## Posts contract

Posts live under `src/content/posts/<slug>/index.mdx`. Related local assets live under `src/content/posts/<slug>/assets/*`.

The Spotren app can generate and sync these posts during provisioning. The homepage and feeds read them through Astro content collections.

## Local development

### Prerequisites

- Node.js 18+
- pnpm

### Install and run

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:4321`.

## Scripts

| Script | Purpose |
| :--- | :--- |
| `pnpm dev` | Start the Astro dev server. |
| `pnpm build` | Run `astro check` and build the site. |
| `pnpm preview` | Preview the production build locally. |
| `pnpm check` | Run Astro diagnostics. |
| `pnpm format` | Check formatting with Prettier. |
| `pnpm format:write` | Rewrite formatting with Prettier. |
| `pnpm generate:location-maps` | Generate map assets from the `location` section in `src/content/site.json`. |
| `pnpm generate:post-thumbs` | Generate post thumbnails for `src/content/posts/**`. |
| `pnpm generate:product-thumbs` | Generate product thumbnails from catalog sections in `src/content/site.json`. |

`pnpm prebuild` and `pnpm precheck` already run the generation steps before build and checks.

## Update guidance

If you need the template to remain compatible with Spotren-managed provisioning:

- keep `src/content/site.json` backward compatible with `src/lib/site-schema.ts`
- avoid moving managed files without updating the backend allowlist and sync logic
- treat `src/content/posts/**` and `public/favicon.*` as provisioner-managed paths
- prefer additive schema changes over breaking reshapes

## Related repositories

- `spotren-app`
  - owns provisioning, template sync, and deploy orchestration
- `spotren-sites/ndEX-builder`
  - owns the public acquisition and checkout flow

## License

Distributed under the MIT License. See `LICENSE`.
