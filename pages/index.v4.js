import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [time, setTime] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [quote, setQuote] = useState('');
  const [forecast, setForecast] = useState([]);

  const prompts = [
    "Solve: What's the next number in the sequence? 1, 1, 2, 3, 5, ?",
    'Quote: "Simplicity is the soul of efficiency." – Austin Freeman',
    'Quote: "Programs must be written for people to read." – Harold Abelson',
    'Solve: How many squares are on a chessboard (total)?',
    'Quote: "In order to be irreplaceable, one must always be different." – Coco Chanel',
  ];

  const getNewQuote = () => {
    setQuote(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    setUserAgent(navigator.userAgent);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getNewQuote();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
          );
          const weatherData = await weatherRes.json();

          if (weatherData?.current_weather) {
            setWeather({
              ...weatherData.current_weather,
              sunrise: weatherData.daily.sunrise[0],
              sunset: weatherData.daily.sunset[0],
            });
          }

          if (weatherData?.daily?.time) {
            const upcoming = weatherData.daily.time
              .map((date, i) => ({
                date,
                min: weatherData.daily.temperature_2m_min[i],
                max: weatherData.daily.temperature_2m_max[i],
              }))
              .slice(1, 4);
            setForecast(upcoming);
          }

          // Gracefully skip location if the API fails
          try {
            const locationRes = await fetch(
              `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
            );
            if (!locationRes.ok) throw new Error('Location fetch failed');
            const locationData = await locationRes.json();
            const { city, town, village, state, country } = locationData?.address || {};
            const locName = [city || town || village, state, country]
              .filter(Boolean)
              .join(', ');
            setLocation(locName || 'Clear Lake, Iowa');
          } catch {
            setLocation('Clear Lake, Iowa');
          }
        } catch (err) {
          console.error('Error fetching weather/location:', err);
        }
      });
    }
  }, []);

  const weatherIcons = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌦️',
    56: '🌧️',
    57: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    66: '🌨️',
    67: '🌨️',
    71: '🌨️',
    73: '🌨️',
    75: '🌨️',
    77: '❄️',
    80: '🌧️',
    81: '🌧️',
    82: '🌧️',
    85: '🌨️',
    86: '🌨️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️',
  };

  const projects = [
    { name: '8 Queens', path: '/queens', color: 'bg-purple-500', ready: true },
    { name: 'Test Page', path: '/test', color: 'bg-green-500', ready: true },
    { name: 'Sorting Visualizer', path: '#', color: 'bg-blue-500', ready: false },
    { name: 'Conway Game of Life', path: '#', color: 'bg-pink-500', ready: false },
    { name: '2048 AI', path: '#', color: 'bg-yellow-500', ready: false },
  ];

  return (
    <div className="p-6 space-y-10">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">🧑‍💻 Developer Dashboard</h1>
        <p className="text-gray-600">
          🕒 Current Time: <span className="font-mono">{time}</span>
        </p>
        <p className="text-gray-600">
          🧭 User Agent: <span className="text-sm break-all">{userAgent}</span>
        </p>
        {weather && (
          <div className="text-gray-600 space-y-1">
            <p>
              {weatherIcons[weather.weathercode] || '🌤️'} Weather in{' '}
              {location || 'your area'}: {weather.temperature}°F, Wind {weather.windspeed} mph
            </p>
            <p>🌅 Sunrise: {new Date(weather.sunrise).toLocaleTimeString()}</p>
            <p>🌇 Sunset: {new Date(weather.sunset).toLocaleTimeString()}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-indigo-600 font-medium">💡 {quote}</p>
          <button
            onClick={getNewQuote}
            className="ml-4 text-sm px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
          >
            ↻ New
          </button>
        </div>
        {forecast.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-800 font-semibold mb-1">📅 3-Day Forecast</h3>
            <ul className="text-gray-600 space-y-1">
              {forecast.map((day, i) => (
                <li key={i}>
                  🔹 {new Date(day.date).toLocaleDateString()}: {day.min}°F – {day.max}°F
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Project Launcher</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className={`rounded-xl shadow-md p-6 text-white transition transform hover:scale-105 cursor-pointer ${proj.color}`}
            >
              {proj.ready ? (
                <Link href={proj.path} className="block">
                  <h3 className="text-xl font-semibold">{proj.name}</h3>
                </Link>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold">{proj.name}</h3>
                  <p className="text-sm mt-1 italic text-gray-100">Coming Soon 🚧</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">🛠️ Coming Soon</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>🌐 Live multiplayer Conway Game of Life</li>
          <li>🧠 AI solving 2048 in real time</li>
          <li>📊 Sorting Visualizer with sound and color feedback</li>
          <li>🔍 Graph traversal demos (DFS, BFS)</li>
          <li>🕹️ Interactive Sudoku solver</li>
        </ul>
      </div>
    </div>
  );
}
