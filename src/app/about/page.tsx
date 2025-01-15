import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudSun, Droplets, Wind, Thermometer } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Our Weather App</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Our mission is to provide accurate, real-time weather information to help you plan your day with confidence. 
            We strive to deliver a user-friendly experience with detailed forecasts and intuitive visualizations.
          </p>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CloudSun className="mr-2" />
              Real-time Weather Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Get up-to-the-minute weather information for locations worldwide.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="mr-2" />
              Precipitation Forecasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accurate predictions for rainfall and snowfall to help you prepare.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="mr-2" />
              Wind Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Detailed wind speed and direction information for outdoor activities.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="mr-2" />
              Temperature Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>View temperature patterns and forecasts to plan your wardrobe and activities.</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Our Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We use reliable data from multiple weather stations and satellites, processed through 
            advanced meteorological models to ensure the highest accuracy in our forecasts.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

