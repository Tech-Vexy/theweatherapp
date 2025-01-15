const OPENCAGE_API_KEY = 'cf1b51a2de7b4964a4e4effe4fd2646c'; // Replace with your actual API key

interface GeocodingResult {
  lat: number;
  lng: number;
  timezone: string;
}

export async function getLocationData(location: string): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPENCAGE_API_KEY}&language=en&pretty=1`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        timezone: result.annotations.timezone.name,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}

