import { useStore } from '@nanostores/react'
import { themeStore, type Theme } from '~/stores/theme'

declare global {
  interface Window {
    __theme?: {
      applyTheme: (theme: Theme | null, options?: { disableTransition?: boolean }) => void
      getStoredTheme: () => Theme | null
      setTheme: (theme: Theme, options?: { disableTransition?: boolean }) => void
    }
  }
}

const ThemeToggle = () => {
  const theme = useStore(themeStore)
  const isDark = theme === 'dark'

  const handleClick = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'

    themeStore.set(nextTheme)
    window.__theme?.setTheme(nextTheme)
  }

  return (
    <button
      onClick={handleClick}
      className="relative size-5 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
      aria-label="Switch theme"
      title="Switch theme"
      type="button"
    >
      <span className={isDark ? 'icon-[tabler--moon-filled] size-5' : 'icon-[tabler--sun-filled] size-5'}></span>
    </button>
  )
}

export default ThemeToggle
