export function getWindSpeedUnit(): string {
  return 'mph';
}

export function getTemperatureUnit(): string {
  return '°F';
}

export function convertTemperature(celsius: number, isCelsius: boolean): number {
  if (isCelsius) {
    return celsius;
  } else {
    return (celsius * 9) / 5 + 32;
  }
}

