'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { getCachedForecast } from '@/lib/weatherCache'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Thermometer, Droplets, Wind, AlertCircle } from 'lucide-react'

interface WeatherSummaryGraphsProps {
  location: string
  onError?: (error: Error) => void
}

interface ForecastData {
  date: string
  temperature: number
  precipitation: number
  windSpeed: number
}

const ChartSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-[200px] w-full" />
    </div>
)

export function WeatherSummaryGraphs({ location, onError }: WeatherSummaryGraphsProps) {
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const forecast = await getCachedForecast(location)
        if (!forecast?.daily?.length) {
          throw new Error('No forecast data available')
        }

        const data = forecast.daily.map((day: any) => ({
          date: new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          temperature: Math.round(day.temperature),
          precipitation: Number(day.precipitation.toFixed(2)),
          windSpeed: Math.round(day.windSpeed)
        }))
        setForecastData(data)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch forecast')
        setError(error.message)
        onError?.(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (location) {
      fetchForecastData()
    }
  }, [location, onError])

  const CHART_COLORS = {
    temperature: '#ff6b6b',  // warm red
    precipitation: '#4dabf7', // bright blue
    windSpeed: '#69db7c'     // fresh green
  }

  const WeatherChart = ({
                          type,
                          dataKey,
                          title,
                          icon: Icon,
                          unit,
                          chartType = 'line'
                        }: {
    type: string
    dataKey: keyof ForecastData
    title: string
    icon: typeof Thermometer
    unit: string
    chartType?: 'line' | 'bar'
  }) => (
      <ChartContainer
          config={{
            [type]: {
              label: title,
              color: CHART_COLORS[type as keyof typeof CHART_COLORS],
            },
          }}
          className="h-[200px]"
      >
        <CardHeader className="p-2">
          <CardTitle className="text-sm flex items-center">
            <Icon className="w-4 h-4 mr-2" />
            {title} ({unit})
          </CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
              <LineChart data={forecastData}>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={CHART_COLORS[type as keyof typeof CHART_COLORS]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    animationDuration={500}
                />
              </LineChart>
          ) : (
              <BarChart data={forecastData}>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    domain={[0, 'auto']}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                    dataKey={dataKey}
                    fill={CHART_COLORS[type as keyof typeof CHART_COLORS]}
                    radius={[4, 4, 0, 0]}
                    animationDuration={500}
                />
              </BarChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>
  )

  if (error) {
    return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
    )
  }

  return (
      <Card className="overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
          <CardTitle className="text-xl font-bold text-white">
            5-Day Weather Summary for {location}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
              </>
          ) : (
              <>
                <WeatherChart
                    type="temperature"
                    dataKey="temperature"
                    title="Temperature"
                    icon={Thermometer}
                    unit="°F"
                />
                <WeatherChart
                    type="precipitation"
                    dataKey="precipitation"
                    title="Precipitation"
                    icon={Droplets}
                    unit="in"
                    chartType="bar"
                />
                <WeatherChart
                    type="windSpeed"
                    dataKey="windSpeed"
                    title="Wind Speed"
                    icon={Wind}
                    unit="mph"
                />
              </>
          )}
        </CardContent>
      </Card>
  )
}