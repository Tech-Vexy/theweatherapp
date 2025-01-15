import { WeatherMetric } from './WeatherMetric'
import { Eye, Droplet, Wind, Sunrise, Sunset } from 'lucide-react'
import { WeatherData } from '@/types/weather'

interface WeatherMetricsProps {
  weather: WeatherData;
  windSpeed: number;
  windUnit: string;
}

export function WeatherMetrics({ weather, windSpeed, windUnit }: WeatherMetricsProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <WeatherMetric
          icon={<Wind className="w-5 h-5" />}
          label="Wind"
          value={Math.round(windSpeed)}
          unit={windUnit}
        />
        <WeatherMetric
          icon={<Droplet className="w-5 h-5" />}
          label="Humidity"
          value={weather.humidity}
          unit="%"
        />
        <WeatherMetric
          icon={<Eye className="w-5 h-5" />}
          label="Visibility"
          value={weather.visibility}
          unit="km"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <WeatherMetric
          icon={<Sunrise className="w-5 h-5" />}
          label="Sunrise"
          value={weather.sunrise}
        />
        <WeatherMetric
          icon={<Sunset className="w-5 h-5" />}
          label="Sunset"
          value={weather.sunset}
        />
      </div>
    </>
  )
}

