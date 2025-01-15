const UNSPLASH_ACCESS_KEY = 'A21A2GSE3b4vLtj6843yok9vVnKrdzFOOL6J0LuAO8k'

export async function getCityImage(cityName: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch image from Unsplash')
    }
    const data = await response.json()
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular
    }
    throw new Error('No images found')
  } catch (error) {
    console.error('Error fetching city image:', error)
    return '/placeholder.svg?height=400&width=600'
  }
}

