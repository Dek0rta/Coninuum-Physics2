'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: (e?: React.MouseEvent) => void
}>({ theme: 'light', toggleTheme: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const initial = stored === 'dark' ? 'dark' : 'light'
    setTheme(initial)
    if (initial === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  function toggleTheme(event?: React.MouseEvent) {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    const btn = event?.currentTarget as HTMLElement | undefined
    const rect = btn?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : (event?.clientX ?? window.innerWidth / 2)
    const y = rect ? rect.top + rect.height / 2 : (event?.clientY ?? window.innerHeight / 2)

    const maxR = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    document.documentElement.style.setProperty('--vt-x', `${x}px`)
    document.documentElement.style.setProperty('--vt-y', `${y}px`)

    const applyTheme = () => {
      flushSync(() => setTheme(next))
      try { localStorage.setItem('theme', next) } catch {}
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    }

    if (!document.startViewTransition) {
      applyTheme()
      return
    }

    const transition = (document as Document & { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(applyTheme)

    void transition.ready.then(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxR}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pseudoElement: '::view-transition-new(root)',
        }
      )
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
