'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SortVisualizer } from './components/SortVisualizer';
import { generateRandomArray } from './utils/arrayUtils';
import * as algorithms from './algorithms/sortAlgorithms';

const INITIAL_ARRAY_SIZE = 50;
const MAX_VALUE = 100;
const SORT_SPEED = 50;

export default function SortDemo() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<keyof typeof algorithms>('bubbleSort');
  const [isSorting, setIsSorting] = useState(false);
  const [sortingSpeed, setSortingSpeed] = useState(SORT_SPEED);
  const stopSortingRef = useRef(false);

  const initializeArray = useCallback(() => {
    setNumbers(generateRandomArray(INITIAL_ARRAY_SIZE, MAX_VALUE));
  }, []);

  useEffect(() => {
    initializeArray();
  }, [initializeArray]);

  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    stopSortingRef.current = false;

    const sortFunction = algorithms[selectedAlgorithm];
    const generator = sortFunction(numbers);

    const step = async () => {
      if (stopSortingRef.current) {
        setIsSorting(false);
        return;
      }

      const result = generator.next();
      if (!result.done) {
        setNumbers(result.value);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
        requestAnimationFrame(() => step());
      } else {
        setIsSorting(false);
      }
    };

    step();
  };

  const stopSort = () => {
    stopSortingRef.current = true;
  };

  const algorithmNames = {
    bubbleSort: 'バブルソート',
    quickSort: 'クイックソート',
    selectionSort: '選択ソート',
    insertionSort: '挿入ソート'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-gray-900 dark:to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            ソートアルゴリズム ビジュアライザー
          </h1>
          <p className="text-slate-300">
            様々なソートアルゴリズムの動作を視覚的に確認できます
          </p>
        </header>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cyan-300">
                アルゴリズムの選択
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value as keyof typeof algorithms)}
                className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white
                         focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
                disabled={isSorting}
              >
                {Object.entries(algorithmNames).map(([key, name]) => (
                  <option key={key} value={key} className="bg-slate-800">{name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-cyan-300">
                ソート速度: {sortingSpeed}ms
              </label>
              <input
                type="range"
                min="1"
                max="200"
                value={sortingSpeed}
                onChange={(e) => setSortingSpeed(Number(e.target.value))}
                disabled={isSorting}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed
                         accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={isSorting ? stopSort : startSort}
              className={`flex-1 px-6 py-3 rounded-lg font-medium
                       transition-all duration-200 ${
                         isSorting
                           ? 'bg-red-500/80 hover:bg-red-600/80 text-white'
                           : 'bg-cyan-500/80 hover:bg-cyan-600/80 text-white'
                       }`}
            >
              {isSorting ? '停止' : '開始'}
            </button>

            <button
              onClick={initializeArray}
              disabled={isSorting}
              className="flex-1 px-6 py-3 rounded-lg font-medium
                       bg-slate-600/80 hover:bg-slate-700/80 text-white
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              リセット
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent opacity-50 rounded-xl" />
            <SortVisualizer numbers={numbers} maxValue={MAX_VALUE} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            アルゴリズム情報
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {algorithmNames[selectedAlgorithm]}
              </h3>
              <p className="text-slate-300">
                {getAlgorithmDescription(selectedAlgorithm)}
              </p>
            </div>
            <div className="text-sm text-slate-400 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span>配列サイズ: {numbers.length} 要素</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAlgorithmDescription(algorithm: string): string {
  const descriptions: Record<string, string> = {
    bubbleSort: '隣接する要素を比較・交換しながら整列を行う最も基本的なアルゴリズムです。平均計算量はO(n²)です。',
    quickSort: '分割統治法を用いた高速なソートアルゴリズムです。平均計算量はO(n log n)です。',
    selectionSort: '配列から最小値を探して順に並べていくアルゴリズムです。平均計算量はO(n²)です。',
    insertionSort: '配列を順次走査し、要素を適切な位置に挿入していくアルゴリズムです。平均計算量はO(n²)です。'
  };
  return descriptions[algorithm] || '';
}