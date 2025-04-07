'use client';

import { useState, useCallback, useEffect } from 'react';
import { SortVisualizer } from './components/SortVisualizer';
import { generateRandomArray } from './utils/arrayUtils';
import * as algorithms from './algorithms/sortAlgorithms';

const INITIAL_ARRAY_SIZE = 50;
const MAX_VALUE = 100;
const SORT_SPEED = 50; // ミリ秒

export default function SortDemo() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<keyof typeof algorithms>('bubbleSort');
  const [isSorting, setIsSorting] = useState(false);
  const [sortingSpeed, setSortingSpeed] = useState(SORT_SPEED);

  // 配列の初期化
  const initializeArray = useCallback(() => {
    setNumbers(generateRandomArray(INITIAL_ARRAY_SIZE, MAX_VALUE));
  }, []);

  // コンポーネントのマウント時に配列を初期化
  useEffect(() => {
    initializeArray();
  }, [initializeArray]);

  // ソートの実行
  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);

    const sortFunction = algorithms[selectedAlgorithm];
    const generator = sortFunction(numbers);

    const step = async () => {
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">ソートアルゴリズム デモ</h1>
      
      <div className="mb-6">
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value as keyof typeof algorithms)}
          className="mr-4 p-2 border rounded"
          disabled={isSorting}
        >
          <option value="bubbleSort">バブルソート</option>
          <option value="quickSort">クイックソート</option>
          <option value="selectionSort">選択ソート</option>
          <option value="insertionSort">挿入ソート</option>
        </select>

        <button
          onClick={startSort}
          disabled={isSorting}
          className="mr-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          開始
        </button>

        <button
          onClick={initializeArray}
          disabled={isSorting}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-400"
        >
          リセット
        </button>
      </div>

      <div className="mb-6">
        <label className="mr-2">ソート速度:</label>
        <input
          type="range"
          min="1"
          max="200"
          value={sortingSpeed}
          onChange={(e) => setSortingSpeed(Number(e.target.value))}
          disabled={isSorting}
          className="w-48"
        />
        <span className="ml-2">{sortingSpeed}ms</span>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <SortVisualizer numbers={numbers} maxValue={MAX_VALUE} />
      </div>
    </div>
  );
}