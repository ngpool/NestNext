import { useEffect, useRef } from 'react';

interface SortVisualizerProps {
  numbers: number[];
  maxValue: number;
}

export const SortVisualizer: React.FC<SortVisualizerProps> = ({ numbers, maxValue }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 各バーの幅を計算
    const barWidth = canvas.width / numbers.length;
    const heightScale = canvas.height / maxValue;

    // 各数値を描画
    numbers.forEach((num, index) => {
      const height = num * heightScale;
      ctx.fillStyle = `hsl(${(num / maxValue) * 240}, 70%, 50%)`;
      ctx.fillRect(
        index * barWidth,
        canvas.height - height,
        barWidth - 1,
        height
      );
    });
  }, [numbers, maxValue]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="border border-gray-300 rounded-lg"
    />
  );
};