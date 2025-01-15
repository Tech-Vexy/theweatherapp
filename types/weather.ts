export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  visibility: number;
  description: string;
  icon: string;
  unit: string;
  windSpeedUnit: string;
  precipitation: number;
  pressure: number;
  dewPoint: number; // New field
  sunrise: string;
  sunset: string;
  lastUpdated: string;
}

export interface ForecastData {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  unit: string;
  precipitationUnit: string;
  windSpeedUnit: string;
}

export interface DailyForecast {
  date: string;
  temperature: number;
  description: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  description: string;
  icon: string;
  precipitation: number;
}

export interface AirQualityData {
  aqi: number;
  components: {
    [key: string]: number;
  };
}

