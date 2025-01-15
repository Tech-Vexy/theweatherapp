import Image from 'next/image';

interface WeatherData {
  icon: string;
  description: string;
  // ... other weather properties
}

const WeatherDisplay: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  return (
    <div>
      <Image
        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.description}
        width={64}
        height={64}
        className="mr-2"
        priority
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      />
      <p>{weather.description}</p>
      {/* ... rest of the weather display component */}
    </div>
  );
};

export default WeatherDisplay;

