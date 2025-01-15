'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getCachedCurrentWeather } from '@/lib/weatherCache'
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Droplet, Wind, Sun, Sunrise, Sunset, Thermometer, Gauge } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WeatherData } from '@/types/weather'
import { motion } from 'framer-motion'

interface WeatherDisplayProps {
  location: string
}

interface WeatherMetricProps {
  icon: React.ReactNode
  label: string
  value: string | number
  unit?: string
}

const WeatherMetric = ({ icon, label, value, unit }: WeatherMetricProps) => (
  <motion.div 
    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 transition-all hover:bg-white/20"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="flex flex-col items-center space-y-1">
      {icon}
      <p className="text-sm text-white/80">{label}</p>
      <p className="font-semibold">
        {value}{unit && <span className="ml-1">{unit}</span>}
      </p>
    </div>
  </motion.div>
)

export default function WeatherDisplay({ location }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getCachedCurrentWeather(location)
        setWeather(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch weather data')
        console.error('Weather fetch error:', err)
      }
    }

    const handleOnlineStatus = () => setIsOffline(!navigator.onLine)
    
    fetchWeather()
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [location])

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-500/10 border-red-500 text-red-500">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!weather) {
    return (
      <div className="flex items-center justify-center p-8 text-foreground animate-pulse">
        Loading weather data...
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="space-y-1 text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-3xl font-bold tracking-tight">{weather.location}, {weather.country}</h2>
              <time dateTime={new Date().toISOString()} className="text-lg text-white/80">
                {new Date().toLocaleString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end">
                <Image
                  src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  width={80}
                  height={80}
                  className="mr-2"
                  priority
                />
                <div>
                  <p className="text-6xl font-bold tracking-tighter">
                    {Math.round(weather.temperature)}
                    <span className="text-4xl">{weather.unit}</span>
                  </p>
                  <p className="text-xl capitalize mt-1">{weather.description}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg text-white/90 mb-6 text-center md:text-left">
            Feels like {Math.round(weather.feelsLike)}{weather.unit}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <WeatherMetric
              icon={<Wind className="w-6 h-6" />}
              label="Wind"
              value={Math.round(weather.windSpeed)}
              unit={weather.windSpeedUnit}
            />
            <WeatherMetric
              icon={<Droplet className="w-6 h-6" />}
              label="Humidity"
              value={weather.humidity}
              unit="%"
            />
            <WeatherMetric
              icon={<Eye className="w-6 h-6" />}
              label="Visibility"
              value={weather.visibility}
              unit="mi"
            />
            <WeatherMetric
              icon={<Thermometer className="w-6 h-6" />}
              label="Dew Point"
              value={Math.round(weather.dewPoint)}
              unit={weather.unit}
            />
            <WeatherMetric
              icon={<Gauge className="w-6 h-6" />}
              label="Pressure"
              value={weather.pressure}
              unit="hPa"
            />
            <WeatherMetric
              icon={<Sun className="w-6 h-6" />}
              label="UV Index"
              value={weather.uvi || 'N/A'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <WeatherMetric
              icon={<Sunrise className="w-6 h-6" />}
              label="Sunrise"
              value={weather.sunrise}
            />
            <WeatherMetric
              icon={<Sunset className="w-6 h-6" />}
              label="Sunset"
              value={weather.sunset}
            />
          </div>
        </CardContent>
      </Card>

      {isOffline && (
        <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-500">
          <AlertDescription className="text-sm">
            You are offline. Displaying cached data.
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  )
}

