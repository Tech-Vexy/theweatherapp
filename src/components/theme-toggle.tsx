'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // avoid hydration mismatch
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-20 h-10 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {/* Sliding background */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Slider track */}
      <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-700 transition-colors duration-300">
        {/* Sliding circle with icons */}
        <div
          className={`absolute top-0.5 h-7 w-7 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center
            ${theme === 'dark' ? 'translate-x-10' : 'translate-x-0.5'}`}
        >
          {theme === 'dark' ? (
            <Moon className="h-4 w-4 text-gray-800" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      </div>
    </button>
  )
}

export default ThemeToggle

