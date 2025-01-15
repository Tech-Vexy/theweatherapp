'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { NotificationPreferences } from './NotificationPreferences'
import { Sun, Menu, X } from 'lucide-react'
import { Button } from './ui/button'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Sun className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-primary">Weather App</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-foreground hover:text-primary transition-colors ${
                  pathname === item.path ? 'font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <NotificationPreferences />
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block text-foreground hover:text-primary transition-colors ${
                  pathname === item.path ? 'font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <NotificationPreferences />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

