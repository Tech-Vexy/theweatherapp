import { DateTime } from 'luxon'

export const MAJOR_CITIES = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'Toronto', timezone: 'America/Toronto' },
  { name: 'Berlin', timezone: 'Europe/Berlin' },
  { name: 'Madrid', timezone: 'Europe/Madrid' },
  { name: 'Seoul', timezone: 'Asia/Seoul' },
  { name: 'Mexico City', timezone: 'America/Mexico_City' },
  { name: 'Cape Town', timezone: 'Africa/Johannesburg' },
  { name: 'Istanbul', timezone: 'Europe/Istanbul' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok' },
  { name: 'Amsterdam', timezone: 'Europe/Amsterdam' }
]

export function getLocalTime(timezone: string): string {
  return DateTime.now().setZone(timezone).toFormat('HH:mm')
}

