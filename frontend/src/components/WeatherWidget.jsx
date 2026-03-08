import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind, Droplets, Loader2, MapPin } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`http://localhost:8000/api/weather?lat=${latitude}&lon=${longitude}`);
            if (res.ok) {
              const data = await res.json();
              setWeather(data);
            } else {
              setError("Failed to fetch weather");
            }
          } catch (e) {
            setError("Network error fetching weather");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-slate-500 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm font-medium">Locating...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center space-x-2 text-slate-500 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200" title={error}>
        <MapPin size={16} />
        <span className="text-sm font-medium">Weather unavail.</span>
      </div>
    );
  }

  // Choose icon based string
  let WeatherIcon = Sun;
  if (weather.icon.includes('01')) WeatherIcon = Sun;
  else if (weather.icon.includes('09') || weather.icon.includes('10')) WeatherIcon = CloudRain;
  else if (weather.icon.includes('02') || weather.icon.includes('03') || weather.icon.includes('04')) WeatherIcon = Cloud;
  else WeatherIcon = Cloud;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm"
    >
      <div className="flex items-center text-amber-500">
        <WeatherIcon size={18} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-800 leading-tight">{weather.temperature.toFixed(1)}°C</span>
        <span className="text-xs text-slate-500 leading-tight capitalize">{weather.description}</span>
      </div>
      <div className="h-6 w-px bg-slate-200 mx-2"></div>
      <div className="flex space-x-3 text-slate-500">
        <div className="flex items-center space-x-1" title="Humidity">
          <Droplets size={12} className="text-blue-400" />
          <span className="text-xs font-medium">{weather.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1" title="Wind">
          <Wind size={12} className="text-slate-400" />
          <span className="text-xs font-medium">{weather.wind_speed} m/s</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
