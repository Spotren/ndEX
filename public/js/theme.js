;(function () {
  const STORAGE_KEY = 'theme'
  const LIGHT_THEME_COLOR = '#FFFFFF'
  const DARK_THEME_COLOR = '#09090b'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  const root = document.documentElement

  function notifyThemeChange(theme, isDark) {
    document.dispatchEvent(new CustomEvent('theme:change', { detail: { theme, isDark } }))
  }

  function getStoredTheme() {
    const theme = localStorage.getItem(STORAGE_KEY)
    return theme === 'light' || theme === 'dark' ? theme : null
  }

  function resolveIsDark(theme) {
    return theme === 'dark' || (theme == null && prefersDark.matches)
  }

  function setThemeColor(targetDocument, isDark) {
    const metaThemeColor = targetDocument.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR)
    }
  }

  function applyTheme(theme) {
    const isDark = resolveIsDark(theme)

    root.classList.toggle('dark', isDark)
    setThemeColor(document, isDark)
    notifyThemeChange(theme, isDark)
  }

  function applyThemeWithoutTransition(theme, options) {
    root.classList.add('disable-transition')
    localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme, options)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('disable-transition')
      })
    })
  }

  function setTheme(theme, options) {
    applyThemeWithoutTransition(theme, options)
  }

  window.__theme = {
    applyTheme,
    getStoredTheme,
    setTheme,
  }

  applyTheme(getStoredTheme())

  prefersDark.addEventListener('change', () => {
    if (getStoredTheme() == null) {
      applyTheme(null)
    }
  })

  document.addEventListener('astro:before-swap', (event) => {
    const theme = getStoredTheme()
    const isDark = resolveIsDark(theme)

    event.newDocument.documentElement.classList.toggle('dark', isDark)
    setThemeColor(event.newDocument, isDark)
  })

  document.addEventListener('astro:after-swap', () => {
    applyTheme(getStoredTheme())
  })

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      applyTheme(getStoredTheme())
    }
  })
})()
