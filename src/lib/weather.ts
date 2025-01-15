import { WeatherData, ForecastData, AirQualityData } from '@/types/weather';

const API_KEY = "53673e596e0aec82e3a6dbadce249c40"

const cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache[key] = { data, timestamp: Date.now() };
}

export async function getCurrentWeather(location: string): Promise<WeatherData> {
  const cacheKey = `weather_${location}_imperial`;
  const cachedData = getCachedData<WeatherData>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`Fetching current weather for ${location}`);
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`
    )
    if (!res.ok) {
      throw new Error(`Weather API responded with status: ${res.status}`);
    }
    const data = await res.json()

    if (data.cod !== 200) {
      throw new Error(`Weather API responded with code: ${data.cod}, message: ${data.message}`);
    }

    const weatherData: WeatherData = {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      icon: data.weather[0].icon,
      unit: '°F',
      windSpeedUnit: 'mph',
      precipitation: data.rain ? data.rain['1h'] || 0 : 0,
      pressure: data.main.pressure,
      dewPoint: Math.round(data.main.temp - ((100 - data.main.humidity) / 5)),
      visibility: Math.round(data.visibility / 1609.34), // Convert to miles
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      lastUpdated: new Date().toISOString(),
    }

    console.log('Weather data fetched successfully:', weatherData);
    setCachedData(cacheKey, weatherData);
    return weatherData
  } catch (error) {
    console.error('Error in getCurrentWeather:', error);
    throw error;
  }
}

function getAirQualityText(aqi: number): string {
  switch (aqi) {
    case 1: return 'Good'
    case 2: return 'Fair'
    case 3: return 'Moderate'
    case 4: return 'Poor'
    case 5: return 'Very Poor'
    default: return 'Unknown'
  }
}

function getForecastText(description: string, highTemp: number): string {
  return `Watch for ${description}. The high will be ${highTemp}°.`
}

export async function getForecast(location: string): Promise<ForecastData> {
  const cacheKey = `forecast_${location}_imperial`;
  const cachedData = getCachedData<ForecastData>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    console.log(`Fetching forecast for ${location}`);
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=imperial`
    )
    if (!res.ok) {
      throw new Error(`Forecast API responded with status: ${res.status}`);
    }
    const data = await res.json()

    if (data.cod !== '200') {
      throw new Error(`Forecast API responded with code: ${data.cod}, message: ${data.message}`);
    }

    const dailyData = data.list.filter((item: any) => item.dt_txt.includes('12:00:00'))
    const hourlyData = data.list.slice(0, 8) // Get next 24 hours (3-hour intervals)

    console.log('Forecast data fetched successfully');
    const forecastData = {
      daily: dailyData.map((day: any) => ({
        date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temperature: Math.round(day.main.temp),
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        precipitation: day.rain ? day.rain['3h'] || 0 : 0,
        windSpeed: Math.round(day.wind.speed),
      })),
      hourly: hourlyData.map((hour: any) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(hour.main.temp),
        description: hour.weather[0].description,
        icon: hour.weather[0].icon,
        precipitation: hour.rain ? hour.rain['3h'] || 0 : 0,
      })),
      unit: '°F',
      precipitationUnit: 'in',
      windSpeedUnit: 'mph',
    }
    setCachedData(cacheKey, forecastData);
    return forecastData
  } catch (error) {
    console.error('Error in getForecast:', error);
    throw error;
  }
}

export async function getAirQuality(location: string): Promise<AirQualityData> {
  const cacheKey = `airquality_${location}`;
  const cachedData = getCachedData<AirQualityData>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    console.log(`Fetching air quality for ${location}`);
    const coords = await getCoordinates(location)
    if (!coords) {
      throw new Error('Could not get coordinates for the location');
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`
    )
    if (!res.ok) {
      throw new Error(`Air Quality API responded with status: ${res.status}`);
    }
    const data = await res.json()

    if (!data || !data.list || data.list.length === 0) {
      throw new Error('No air quality data available');
    }

    console.log('Air quality data fetched successfully');
    const airQualityData = {
      aqi: data.list[0].main.aqi,
      components: data.list[0].components
    }
    setCachedData(cacheKey, airQualityData);
    return airQualityData
  } catch (error) {
    console.error('Error in getAirQuality:', error);
    throw error;
  }
}

async function getCoordinates(location: string) {
  console.log(`Fetching coordinates for ${location}`);
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
  )
  const data = await res.json()

  if (!data || data.length === 0) {
    console.log('No coordinates found for the location');
    return null
  }

  console.log('Coordinates fetched successfully');
  return {
    lat: data[0].lat,
    lon: data[0].lon
  }
}

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  unit: string;
  windSpeedUnit: string;
  precipitation: number;
  pressure: number;
  dewPoint: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  lastUpdated: string;
}

interface ForecastData {
  daily: {
    date: string;
    temperature: number;
    description: string;
    icon: string;
    precipitation: number;
    windSpeed: number;
  }[];
  hourly: {
    time: string;
    temperature: number;
    description: string;
    icon: string;
    precipitation: number;
  }[];
  unit: string;
  precipitationUnit: string;
  windSpeedUnit: string;
}

interface AirQualityData {
  aqi: number;
  components: { [key: string]: number };
}

export async function getWeatherAndNearbyPlaces(location: string) {
  try {
    const weatherData = await fetchWeatherData(location);
    if (!weatherData || !weatherData.location) {
      throw new Error('Invalid weather data received');
    }
    const coords = {
      lat: weatherData.location.lat,
      lon: weatherData.location.lon
    };
    const nearbyCities = await fetchNearbyCities(coords.lat, coords.lon);
    const nearbyWeather = await Promise.all(
      nearbyCities.slice(0, 5).map(async city => {
        try {
          const cityWeather = await fetchWeatherData(`${city.lat},${city.lon}`);
          return {
            ...city,
            weather: cityWeather
          };
        } catch (error) {
          console.error(`Error fetching weather for ${city.name}:`, error);
          return null;
        }
      })
    );

    return {
      mainWeather: weatherData,
      nearbyWeather: nearbyWeather.filter(city => city !== null)
    };
  } catch (error) {
    console.error('Error in getWeatherAndNearbyPlaces:', error);
    throw error;
  }
}

async function fetchWeatherData(query: string) {
  const response = await fetch(
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${encodeURIComponent(query)}&days=3`,
    {
      headers: {
        'X-RapidAPI-Key': '450d707a33mshf44e2991c0b385ep137638jsnd32e248eb31b',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Weather API request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data || !data.location) {
    throw new Error('Invalid data received from Weather API');
  }

  return data;
}

async function fetchNearbyCities(lat: number, lon: number) {
  const response = await fetch(
    `https://weatherapi-com.p.rapidapi.com/search.json?q=${lat},${lon}`,
    {
      headers: {
        'X-RapidAPI-Key': '450d707a33mshf44e2991c0b385ep137638jsnd32e248eb31b',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch nearby cities with status ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid data received for nearby cities');
  }

  return data;
}

