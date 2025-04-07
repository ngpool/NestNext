// ランダムな数値配列を生成する関数
export const generateRandomArray = (size: number, max: number = 100): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
};

// アルゴリズムの実行時間を計測する関数
export const measureExecutionTime = (fn: () => void): number => {
  const start = performance.now();
  fn();
  return performance.now() - start;
};