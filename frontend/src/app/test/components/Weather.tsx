"use client";

import React, { useState, useEffect } from 'react';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        console.log('API Key:', apiKey);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=35.6762&lon=139.6503&appid=${apiKey}&units=metric&lang=ja`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('Weather Data:', data);
        setWeather(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(`エラーが発生しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p className="font-bold mb-2">エラーが発生しました</p>
        <p>{error}</p>
        <p className="mt-4 text-sm">
          APIキー: {process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ? '設定済み' : '未設定'}
        </p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white/20 dark:bg-gray-800/20 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {weather.name}
            </h2>
            <p className="text-gray-200 font-light tracking-wide">
              {new Date().toLocaleDateString('ja-JP', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-20 h-20"
            />
            <p className="text-gray-200 font-light tracking-wide capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-6xl font-extrabold text-white mb-2">
                {Math.round(weather.main.temp)}°
                <span className="text-4xl font-light">C</span>
              </p>
              <p className="text-gray-200 font-light tracking-wide">
                体感温度: {Math.round(weather.main.feels_like)}°C
              </p>
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <p className="text-gray-200 font-light tracking-wide">
                  <span className="font-medium">湿度</span> {weather.main.humidity}%
                </p>
                <p className="text-gray-200 font-light tracking-wide">
                  <span className="font-medium">風速</span> {weather.wind.speed}m/s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 