'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getCachedForecast } from '@/lib/weatherCache'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, Wind, Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

interface WeatherForecastProps {
  location: string
}

export default function WeatherForecast({ location }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<any>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<string>('')

  useEffect(() => {
    const fetchForecast = async () => {
      const data = await getCachedForecast(location)
      setForecast(data)
      setIsOffline(!navigator.onLine)
    }
    fetchForecast()

    // Set the current day of the week
    const today = new Date()
    setCurrentDayOfWeek(today.toLocaleDateString('en-US', { weekday: 'short' }))
  }, [location])

  if (!forecast) {
    return <div className="text-foreground">No forecast data available</div>;
  }

  if (!forecast.daily || forecast.daily.length === 0) {
    return <div className="text-foreground">No daily forecast data available</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6">
          <CardTitle className="text-xl font-bold">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.daily.map((day: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className={`overflow-hidden h-full ${day.date === currentDayOfWeek ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500' : ''}`}
                >
                  <CardHeader className="p-3 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 text-white">
                    <CardTitle className="text-lg font-bold text-center">{day.date}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col items-center space-y-2">
                    <div className="relative w-16 h-16">
                      <Image
                        src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.description}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <div className="flex justify-between w-full">
                      <span className="text-sm flex items-center">
                        <Sun className="w-4 h-4 mr-1 text-yellow-500" />
                        {Math.round(day.temperature)}°F
                      </span>
                      <span className="text-sm flex items-center">
                        <Moon className="w-4 h-4 mr-1 text-blue-500" />
                        {Math.round(day.temperature)}°F
                      </span>
                    </div>
                    <span className="text-sm text-center text-gray-600 dark:text-gray-300 capitalize">{day.description}</span>
                    <div className="w-full pt-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <CloudRain className="w-4 h-4 mr-1 text-blue-500" />
                        <span>{day.precipitation ?? 'N/A'} {forecast.precipitationUnit}</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="w-4 h-4 mr-1 text-green-500" />
                        <span>{Math.round(day.windSpeed)} {forecast.windSpeedUnit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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

