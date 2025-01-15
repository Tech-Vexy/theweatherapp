'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Location = {
  name: string
  country: string
}

async function getLocationSuggestions(query: string): Promise<Location[]> {
  if (query.length < 2) return []
  const API_KEY = "53673e596e0aec82e3a6dbadce249c40"
  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data.map((item: any) => ({ name: item.name, country: item.country }))
  } catch (error) {
    console.error('Failed to fetch location suggestions:', error)
    return []
  }
}

interface LocationSearchProps {
  onLocationChange: (location: string) => void;
}

export default function LocationSearch({ onLocationChange }: LocationSearchProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      handleSelect(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (value.trim()) {
        handleSelect(value)
      }
    }
  }

  const handleSelect = async (currentValue: string) => {
    setValue(currentValue)
    setOpen(false)
    onLocationChange(currentValue)
    router.push(`/?location=${encodeURIComponent(currentValue)}`)
  }

  return (
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search for a location..."
                className="w-full p-3 pl-10 rounded-lg border bg-background text-foreground border-input"
                onKeyDown={handleKeyDown}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
  )
}

