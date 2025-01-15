'use client'

import { useState, useEffect } from 'react'
import WeatherDisplay from '@/components/WeatherDisplay'
import LocationSearch from '@/components/LocationSearch'
import WeatherForecast from '@/components/WeatherForecast'
import HourlyForecast from '@/components/HourlyForecast'
import { WorldCitiesForecast } from '@/components/WorldCitiesForecast'
import { ServiceWorkerManager } from '@/components/ServiceWorkerManager'
import { WeatherSummaryGraphs } from '@/components/WeatherSummaryGraphs'
import { Clock } from '@/components/Clock'
import { NewsCarousel } from '@/components/NewsCarousel'
import { getLocationData } from '@/utils/geocoding'
import { getCachedCurrentWeather } from '@/lib/weatherCache'
import Head from 'next/head'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function Home() {
  const [location, setLocation] = useState('London')
  const [timezone, setTimezone] = useState('Europe/London')
  const [isOnline, setIsOnline] = useState(true)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation)
    const locationData = await getLocationData(newLocation)
    if (locationData) {
      setTimezone(locationData.timezone)
    }
    fetchWeatherData(newLocation)
  }

  const fetchWeatherData = async (loc: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching weather data for ${loc}...`);
      const data = await getCachedCurrentWeather(loc);
      console.log('Received weather data:', data);
      if (!data) {
        throw new Error('No weather data received');
      }
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(location)
  }, [location])

  useEffect(() => {
    if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.periodicSync.register('update-weather', {
          minInterval: 30 * 60 * 1000 // 30 minutes
        }).then(() => {
          console.log('Periodic sync registered');
        }).catch((error) => {
          console.error('Periodic sync registration failed:', error);
        });
      });
    }

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'WEATHER_UPDATE') {
        fetchWeatherData(location);
        toast.info('Weather data has been updated');
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const structuredData = {
    "@context": "http://schema.org",
    "@type": "WebApplication",
    "name": "Weather App",
    "applicationCategory": "Weather",
    "operatingSystem": "Any",
    "description": "Get accurate, real-time weather information and forecasts for locations worldwide.",
    "url": "https://your-weather-app-url.com",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000"
    }
  };

  return (
      <>
        <Head>
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          {isLoading && (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
          )}
          {error && (
              <div className="text-red-500 text-center py-8 text-xl">{error}</div>
          )}
          {!isLoading && !error && (
              <>
                {!isOnline && (
                    <div className="bg-yellow-500 text-white p-2 text-center">
                      You are offline. Some features may be limited.
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                  <ServiceWorkerManager />
                  <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                  >
                    <LocationSearch onLocationChange={handleLocationChange} />
                  </motion.div>

                  <Clock location={location} timezone={timezone} />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <WeatherDisplay location={location} />
                      <HourlyForecast location={location} />
                      <WeatherForecast location={location} />
                    </div>
                    <div className="space-y-8">
                      <WorldCitiesForecast />
                      <NewsCarousel />
                    </div>
                  </div>

                  <WeatherSummaryGraphs location={location} />
                </div>
              </>
          )}
        </div>
      </>
  )
}

