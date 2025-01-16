'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { getLocationData } from '@/utils/geocoding'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface MoonPhaseInfo {
    name: string
    icon: string
}

interface MoonPhaseData {
    date: string
    name: string
    icon: string
}

interface Coordinates {
    lat: number
    lon: number
}

interface MoonPhasesProps {
    apiKey: string
    location: string
}

const MoonPhases: React.FC<MoonPhasesProps> = ({ apiKey = "", location = "New York, NY" }) => {
    const [moonData, setMoonData] = useState<MoonPhaseData[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)

    // xweather uses different phase names and percentages
    const getMoonPhaseInfo = (phase: number): MoonPhaseInfo => {
        // Phase is given as a percentage (0-100) where:
        // 0/100 = New Moon
        // 25 = First Quarter
        // 50 = Full Moon
        // 75 = Last Quarter
        if (phase >= 0 && phase <= 6.25 || phase >= 93.75) {
            return { name: 'New Moon', icon: '🌑' }
        } else if (phase > 6.25 && phase < 43.75) {
            return { name: 'Waxing Crescent', icon: '🌒' }
        } else if (phase >= 43.75 && phase <= 56.25) {
            return { name: 'First Quarter', icon: '🌓' }
        } else if (phase > 56.25 && phase < 93.75) {
            return { name: 'Waxing Gibbous', icon: '🌔' }
        } else if (phase >= 43.75 && phase <= 56.25) {
            return { name: 'Full Moon', icon: '🌕' }
        } else if (phase > 56.25 && phase < 93.75) {
            return { name: 'Waning Gibbous', icon: '🌖' }
        } else if (phase >= 93.75 || phase <= 6.25) {
            return { name: 'Last Quarter', icon: '🌗' }
        } else {
            return { name: 'Waning Crescent', icon: '🌘' }
        }
    }

    useEffect(() => {
        const geocodeLocation = async () => {
            try {
                setLoading(true)
                setError(null)

                const locationData = await getLocationData(location)

                if (!locationData) {
                    throw new Error('Location not found')
                }

                setCoordinates({
                    lat: locationData.lat,
                    lon: locationData.lng
                })
            } catch (err) {
                setError(`Geocoding error: ${err instanceof Error ? err.message : 'Unknown error'}`)
                setLoading(false)
            }
        }

        geocodeLocation()
    }, [location])

    useEffect(() => {
        const fetchMoonData = async () => {
            if (!coordinates || !apiKey) return

            try {
                // xweather API endpoint - adjust based on actual endpoint structure
                const response = await fetch(
                    `https://api.xweather.com/v1/astronomy/moon?lat=${coordinates.lat}&lon=${coordinates.lon}&apikey=${apiKey}`
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch moon data')
                }

                const data = await response.json()

                // Adjust this based on actual xweather API response structure
                const processedData = data.moonPhases.map((phase: any) => ({
                    date: new Date(phase.timestamp).toLocaleDateString(),
                    ...getMoonPhaseInfo(phase.illumination)
                }))

                setMoonData(processedData)
                setLoading(false)
            } catch (err) {
                setError(`Moon data error: ${err instanceof Error ? err.message : 'Unknown error'}`)
                setLoading(false)
            }
        }

        fetchMoonData()
    }, [coordinates, apiKey])

    if (loading) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" aria-label="Loading moon phase data" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="p-4">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    Moon Phases for {location}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {moonData && (
                    <>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Current Phase</h3>
                            <div className="flex items-center space-x-4">
                                <span className="text-4xl" aria-hidden="true">{moonData[0].icon}</span>
                                <span className="text-lg">{moonData[0].name}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Next 7 Days</h3>
                            <div className="space-y-3">
                                {moonData.slice(1).map((phase, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl" aria-hidden="true">{phase.icon}</span>
                                            <span>{phase.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {phase.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default MoonPhases