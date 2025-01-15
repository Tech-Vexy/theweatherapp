import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { Clock, Thermometer, Droplet, Wind } from 'lucide-react'
import { CityForecast } from './WorldCitiesForecast'

interface WeatherModalProps {
  isOpen: boolean
  onClose: () => void
  cityData: CityForecast | null
}

export function WeatherModal({ isOpen, onClose, cityData }: WeatherModalProps) {
  if (!cityData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{cityData.location}, {cityData.country}</DialogTitle>
        </DialogHeader>
        <Card className="overflow-hidden">
          <div className="relative h-40">
            <Image
              src={cityData.imageUrl}
              alt={cityData.location}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <CardContent className="grid gap-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                <span>{cityData.localTime}</span>
              </div>
              <div className="flex items-center">
                <Image
                  src={`http://openweathermap.org/img/wn/${cityData.icon}@2x.png`}
                  alt={cityData.description}
                  width={50}
                  height={50}
                />
                <span className="text-2xl font-bold">{cityData.temperature}{cityData.unit}</span>
              </div>
            </div>
            <p className="text-lg capitalize">{cityData.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-gray-500" />
                <span>Feels like: {cityData.feelsLike}{cityData.unit}</span>
              </div>
              <div className="flex items-center">
                <Droplet className="w-5 h-5 mr-2 text-gray-500" />
                <span>Humidity: {cityData.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="w-5 h-5 mr-2 text-gray-500" />
                <span>Wind: {cityData.windSpeed} {cityData.windSpeedUnit}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

