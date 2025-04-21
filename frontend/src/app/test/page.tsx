"use client";

import Weather from './components/Weather';
import Lightning from './components/lightning';

export default function TestPage() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <Lightning
          hue={220}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
      </div>
      
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              Weather
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Forecast
              </span>
            </h1>
            <p className="text-xl text-gray-200 font-light tracking-wide">
              リアルタイムの天気情報をお届けします
            </p>
          </div>
          <div className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-xl p-6 shadow-2xl">
            <Weather />
          </div>
        </div>
      </div>
    </div>
  );
}