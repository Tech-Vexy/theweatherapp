'use client'

import { useEffect, useState } from 'react'
import { getCachedForecast } from '@/lib/weatherCache'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CloudRain } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface HourlyForecastProps {
  location: string
}

export default function HourlyForecast({ location }: HourlyForecastProps) {
  const [forecast, setForecast] = useState<any>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const fetchForecast = async () => {
      const data = await getCachedForecast(location)
      setForecast(data)
      setIsOffline(!navigator.onLine)
    }
    fetchForecast()
  }, [location])

  if (!forecast || !forecast.hourly) {
    return <div className="text-foreground">Loading hourly forecast data...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6">
          <CardTitle className="text-xl font-bold">Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max p-2">
              {forecast.hourly.map((hour: any, index: number) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-2 w-24 p-2 rounded-lg transition-colors hover:bg-white/20 dark:hover:bg-gray-700/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium">{hour.time}</span>
                  <div className="relative w-12 h-12">
                    <Image
                      src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                      alt={hour.description}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span className="text-lg font-semibold">
                    {Math.round(hour.temperature)}°F
                  </span>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CloudRain className="w-4 h-4 mr-1 text-blue-500" />
                    <span>{hour.precipitation} {forecast.precipitationUnit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
      {isOffline && (
        <div className="mt-2 text-yellow-500 text-sm">
          You are offline. Displaying cached data.
        </div>
      )}
    </motion.div>
  )
}

