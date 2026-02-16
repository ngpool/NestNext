"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
        <img
          src="/anraku.png"
          alt="安樂星輝のプロフィール画像"
          className="w-60 h-60 mx-auto object-contain"
        />
        <h1 className="text-2xl font-bold mt-4">安樂星輝</h1>
        <p className="text-gray-500">このサイトの作成者</p>

        <div className="mt-4">
          <p className="text-sm text-gray-600">現在時刻: {time}</p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showDetails ? "プロフィールを隠す" : "プロフィールを見る"}
        </button>

        {showDetails && (
          <div className="mt-6 text-left space-y-2">
            <p><span className="font-semibold">正体:</span> 動物保護に人生を注いでいるロボット</p>
            <p><span className="font-semibold">感情:</span> なし</p>
            <p><span className="font-semibold">製作者:</span> 安楽亭</p>
            <p><span className="font-semibold">体重:</span> 130kg</p>
            <p><span className="font-semibold">体脂肪率:</span> 30%</p>
            <p><span className="font-semibold">食事:</span> 丼ぶり2つに箸1つ</p>
            <p><span className="font-semibold">趣味:</span> キックボクシング</p>
          </div>
        )}
      </div>
    </div>
  );
}