'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentWeather } from '@/lib/weather'
import { getCityImage } from '@/lib/unsplash'
import { MAJOR_CITIES, getLocalTime } from '@/lib/timezones'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { WeatherModal } from './WeatherModal'

export type CityForecast = {
  location: string
  country: string
  temperature: number
  feelsLike: number
  description: string
  icon: string
  unit: string
  imageUrl: string
  localTime: string
  timezone: string
  humidity: number
  windSpeed: number
  windSpeedUnit: string
}

interface WorldCitiesForecastProps {
  isCelsius: boolean
}

export function WorldCitiesForecast({ isCelsius }: WorldCitiesForecastProps) {
  const [forecasts, setForecasts] = useState<CityForecast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<CityForecast | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchForecasts = async () => {
      const fetchedForecasts = await Promise.all(
        MAJOR_CITIES.map(async (city) => {
          const weather = await getCurrentWeather(city.name, isCelsius)
          const imageUrl = await getCityImage(city.name)
          if (weather) {
            return {
              ...weather,
              imageUrl,
              localTime: getLocalTime(city.timezone),
              timezone: city.timezone,
            }
          }
          return null
        })
      )
      setForecasts(fetchedForecasts.filter(Boolean) as CityForecast[])
      setIsLoading(false)
    }
    fetchForecasts()
  }, [isCelsius])

  useEffect(() => {
    const timer = setInterval(() => {
      setForecasts(prevForecasts => 
        prevForecasts.map(forecast => ({
          ...forecast,
          localTime: getLocalTime(forecast.timezone)
        }))
      )
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextCity = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % forecasts.length)
  }

  const prevCity = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + forecasts.length) % forecasts.length)
  }

  useEffect(() => {
    const timer = setInterval(nextCity, 5000)
    return () => clearInterval(timer)
  }, [forecasts.length])

  const handleCityClick = (city: CityForecast) => {
    setSelectedCity(city)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return <div className="text-center py-8 text-sm font-medium text-gray-600 dark:text-gray-300">Loading world cities forecast...</div>
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6">
        <CardTitle className="text-lg font-semibold">World's Major Cities</CardTitle>
      </CardHeader>
      <CardContent className="p-4 relative">
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {forecasts.map((forecast, index) => (
            <div key={index} className="w-full flex-shrink-0 p-3">
              <Card 
                className="overflow-hidden relative h-48 md:h-64 shadow-md rounded-lg transform transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => handleCityClick(forecast)}
              >
                <Image
                  src={forecast.imageUrl}
                  alt={forecast.location}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <CardContent className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-1">{forecast.location}</h3>
                    <p className="text-sm md:text-base mb-2">{forecast.country}</p>
                    <p className="text-sm md:text-base flex items-center opacity-90">
                      <Clock className="w-4 h-4 mr-2" />
                      {forecast.localTime}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={`http://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                        alt={forecast.description}
                        width={40}
                        height={40}
                        className="mr-1"
                      />
                      <span className="text-2xl md:text-3xl font-bold">{forecast.temperature}{forecast.unit}</span>
                    </div>
                    <span className="text-sm md:text-base capitalize bg-black/30 px-3 py-1 rounded-full">
                      {forecast.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <button 
          onClick={prevCity} 
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={nextCity} 
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:scale-110"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </CardContent>
      <WeatherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cityData={selectedCity}
      />
    </Card>
  )
}

