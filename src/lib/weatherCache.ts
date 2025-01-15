import { getCurrentWeather, getForecast, getAirQuality } from './weather';

const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

interface CachedData<T> {
  data: T;
  timestamp: number;
}

function isCacheValid<T>(cachedData: CachedData<T> | null): boolean {
  if (!cachedData) return false;
  return Date.now() - cachedData.timestamp < CACHE_TIME;
}

export async function getCachedCurrentWeather(location: string) {
  const cacheKey = `currentWeather_${location}`;
  let cachedData: CachedData<Awaited<ReturnType<typeof getCurrentWeather>>> | null = null;

  try {
    const storedData = localStorage.getItem(cacheKey);
    console.log('Stored data:', storedData);
    cachedData = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error parsing cached weather data:', error);
  }

  if (isCacheValid(cachedData)) {
    console.log('Returning cached weather data');
    return cachedData.data;
  }

  try {
    console.log(`Fetching fresh weather data for ${location}`);
    const data = await getCurrentWeather(location, false); // Default to false, can be adjusted as needed.
    if (!data) {
      throw new Error('No data returned from getCurrentWeather');
    }
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    if (cachedData?.data) {
      console.log('Returning cached data due to error');
      return cachedData.data;
    }
    throw error; // Re-throw the error if we don't have cached data
  }
}

export async function getCachedForecast(location: string) {
  const cacheKey = `forecast_${location}`;
  let cachedData: CachedData<Awaited<ReturnType<typeof getForecast>>> | null = null;

  try {
    const storedData = localStorage.getItem(cacheKey);
    console.log('Stored forecast data:', storedData);
    cachedData = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error parsing cached forecast data:', error);
  }

  if (isCacheValid(cachedData)) {
    console.log('Returning cached forecast data');
    return cachedData.data;
  }

  try {
    console.log(`Fetching fresh forecast data for ${location}`);
    const data = await getForecast(location, false); // Default to false, can be adjusted as needed.
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    if (cachedData?.data) {
      console.log('Returning cached forecast data due to error');
      return cachedData.data;
    }
    throw error;
  }
}

export async function getCachedAirQuality(location: string) {
  const cacheKey = `airQuality_${location}`;
  let cachedData: CachedData<Awaited<ReturnType<typeof getAirQuality>>> | null = null;

  try {
    const storedData = localStorage.getItem(cacheKey);
    console.log('Stored air quality data:', storedData);
    cachedData = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error parsing cached air quality data:', error);
  }

  if (isCacheValid(cachedData)) {
    console.log('Returning cached air quality data');
    return cachedData.data;
  }

  try {
    console.log(`Fetching fresh air quality data for ${location}`);
    const data = await getAirQuality(location);
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    if (cachedData?.data) {
      console.log('Returning cached air quality data due to error');
      return cachedData.data;
    }
    throw error;
  }
}

