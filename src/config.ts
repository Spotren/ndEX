import type { PostConfig, TagsConfig } from '~/types'

export const THEME_CONFIG = {
  base: '/',
  transition: false,
  themeAnimation: true,
}

export const SITE_CONFIG = {
  author: 'ndEX',
}

export const NAVIGATION_CONFIG = {
  headerLinks: [
    {
      name: 'Posts',
      url: '/posts',
    },
  ],
  footerLinks: [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Posts',
      url: '/posts',
    },
    {
      name: 'Tags',
      url: '/tags',
    },
  ],
}

export const HOME_LABELS = {
  contactUs: 'Contato',
  socialLinkAriaLabelPrefix: 'Link do',
  locationDescriptionTemplate: 'Onde estamos em {city}',
  openMapTitle: 'Abrir Mapa',
  uberCtaTitle: 'Chamar Uber',
  uberCtaDescription: 'para este destino 📍',
  postsTitle: 'Posts',
  pinnedLabel: 'Pinned',
  recentLabel: 'Recente',
  postsSummarySuffix: 'posts para explorar',
  startingAtLabel: 'A partir de',
  fixedPriceLabel: 'Somente',
  freePriceLabel: 'Grátis',
  noPriceLabel: 'Sob consulta',
}

export const HERO_METRIC_CONFIG = {
  icon: 'icon-[mdi--star]',
  primaryLabel: '/',
  secondaryLabel: 'avaliações',
}

export const SOCIAL_ICON_MAP: Record<string, string> = {
  instagram: 'icon-[ri--instagram-line]',
  facebook: 'icon-[ri--facebook-line]',
  linkedin: 'icon-[ri--linkedin-line]',
  tiktok: 'icon-[ri--tiktok-line]',
  youtube: 'icon-[ri--youtube-line]',
  x: 'icon-[ri--twitter-x-line]',
  threads: 'icon-[ri--threads-line]',
}

export const PRICE_TYPE_LABELS: Record<string, string> = {
  fixed: 'Somente',
  starting_at: 'A partir de',
  free: 'GRÁTIS',
  none: 'Sob consulta',
}

export const CONTACT_CONFIG = {
  wap: true,
}

export const FOOTER_CONFIG = {
  sourceUrl: 'https://github.com/Spotren',
}

//--- Posts Page Config ---
export const POSTS_CONFIG: PostConfig = {
  title: 'Posts',
  description: 'Posts by ndEX',
  introduce: 'Here, I will share the usage instructions for this theme to help you quickly use it.',
  author: 'ndEX',
  homePageConfig: {
    size: 2,
    type: 'image',
  },
  postPageConfig: {
    size: 10,
    type: 'image',
    coverLayout: 'right',
  },
  tagsPageConfig: {
    size: 10,
    type: 'time-line',
  },
  ogImageUseCover: false,
  postType: 'metaOnly',
  imageDarkenInDark: true,
  readMoreText: 'Read more',
  prevPageText: 'Previous',
  nextPageText: 'Next',
  tocText: 'On this page',
  backToPostsText: 'Back to Posts',
  nextPostText: 'Next Post',
  prevPostText: 'Previous Post',
  recommendText: 'REC',
  wordCountView: true,
}

export const TAGS_CONFIG: TagsConfig = {
  title: 'Tags',
  description: 'All tags of Posts',
  introduce: 'All the tags for posts are here, you can click to filter them.',
}
