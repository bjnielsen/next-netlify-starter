import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [time, setTime] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [weather, setWeather] = useState(null);
  const [quote, setQuote] = useState('');

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
    // Random inspirational quote or puzzle
    const prompts = [
      "Solve: What's the next number in the sequence? 1, 1, 2, 3, 5, ?",
      'Quote: "Simplicity is the soul of efficiency." – Austin Freeman',
      'Quote: "Programs must be written for people to read." – Harold Abelson',
      'Solve: How many squares are on a chessboard (total)?',
      'Quote: "In order to be irreplaceable, one must always be different." – Coco Chanel'
    ];
    setQuote(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  useEffect(() => {
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(async (pos) => {
         const { latitude, longitude } = pos.coords;
         const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`);
         const data = await res.json();
         if (data?.current_weather) {
           setWeather(data.current_weather);
         }
       });
     }
   }, []);

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
        <p className="text-gray-600">🕒 Current Time: <span className="font-mono">{time}</span></p>
        <p className="text-gray-600">🧭 User Agent: <span className="text-sm break-all">{userAgent}</span></p>
        {weather && (
          <p className="text-gray-600">🌤 Current Temp: {weather.temperature}°F, Wind: {weather.windspeed} mph</p>
        )}
        <p className="text-indigo-600 font-medium">💡 {quote}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Project Launcher</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div key={idx} className={`rounded-xl shadow-md p-6 text-white transition transform hover:scale-105 cursor-pointer ${proj.color}`}> 
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
    </div>
  );
}
