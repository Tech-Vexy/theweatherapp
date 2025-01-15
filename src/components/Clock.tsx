'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ClockIcon } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ClockProps {
  location: string
  timezone: string
  className?: string
}

const formatTime = (date: Date, timezone: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    return date.toLocaleTimeString('en-US', options)
  } catch (error) {
    console.error(`Error formatting time for timezone ${timezone}:`, error)
    return '--:--:--'
  }
}

export const Clock = memo(function Clock({ 
  location, 
  timezone,
  className = '' 
}: ClockProps) {
  const [time, setTime] = useState<string>('')
  const [error, setError] = useState<string>('')

  const updateTime = useCallback(() => {
    try {
      const now = new Date()
      setTime(formatTime(now, timezone))
      setError('')
    } catch (error) {
      setError(`Unable to display time for ${location}`)
      console.error(`Clock error for ${location}:`, error)
    }
  }, [timezone, location])

  useEffect(() => {
    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [updateTime])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card 
      className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white transform transition-all duration-200 hover:scale-102 ${className}`}
    >
      <CardContent 
        className="p-4 flex items-center justify-between"
        role="timer"
        aria-label={`Current time in ${location}`}
      >
        <div className="flex items-center">
          <ClockIcon className="w-6 h-6 mr-2" aria-hidden="true" />
          <span className="text-lg font-semibold">{location}</span>
        </div>
        <span className="text-2xl font-bold tabular-nums">{time}</span>
      </CardContent>
    </Card>
  )
})

