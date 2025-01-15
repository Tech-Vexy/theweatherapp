'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from 'lucide-react'

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4 text-blue-500" />
    </div>
  )
}

