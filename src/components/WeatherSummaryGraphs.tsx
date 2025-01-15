'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCachedForecast } from '@/lib/weatherCache'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Thermometer, Droplets, Wind } from 'lucide-react'

interface WeatherSummaryGraphsProps {
  location: string
}

interface ForecastData {
  date: string
  temperature: number
  precipitation: number
  windSpeed: number
}

export function WeatherSummaryGraphs({ location }: WeatherSummaryGraphsProps) {
  const [forecastData, setForecastData] = useState<ForecastData[]>([])

  useEffect(() => {
    const fetchForecastData = async () => {
      const forecast = await getCachedForecast(location)
      if (forecast && forecast.daily) {
        const data = forecast.daily.map((day: any) => ({
          date: day.date,
          temperature: day.temperature,
          precipitation: day.precipitation,
          windSpeed: day.windSpeed
        }))
        setForecastData(data)
      }
    }
    fetchForecastData()
  }, [location])

  return (
      <Card className="overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
          <CardTitle className="text-xl font-bold text-white">5-Day Weather Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChartContainer
              config={{
                temperature: {
                  label: "Temperature",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
          >
            <CardHeader className="p-2">
              <CardTitle className="text-sm flex items-center">
                <Thermometer className="w-4 h-4 mr-2" />
                Temperature (°F)
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="temperature" stroke="var(--color-temperature)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
              config={{
                precipitation: {
                  label: "Precipitation",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
          >
            <CardHeader className="p-2">
              <CardTitle className="text-sm flex items-center">
                <Droplets className="w-4 h-4 mr-2" />
                Precipitation (in)
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="precipitation" fill="var(--color-precipitation)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
              config={{
                windSpeed: {
                  label: "Wind Speed",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[200px]"
          >
            <CardHeader className="p-2">
              <CardTitle className="text-sm flex items-center">
                <Wind className="w-4 h-4 mr-2" />
                Wind Speed (mph)
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="windSpeed" stroke="var(--color-windSpeed)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}

