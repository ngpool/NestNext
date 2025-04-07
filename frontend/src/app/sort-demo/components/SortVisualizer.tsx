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

    // キャンバスのサイズを設定（Retinaディスプレイ対応）
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // キャンバスの背景色を設定
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // グリッド線を描画
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < rect.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, rect.height);
      ctx.stroke();
    }

    // バーの描画設定
    const barWidth = rect.width / numbers.length;
    const heightScale = (rect.height * 0.95) / maxValue; // 上部に少し余白を残す
    const margin = Math.max(1, Math.floor(barWidth * 0.1));

    // 各数値を描画
    numbers.forEach((num, index) => {
      const height = num * heightScale;
      const x = index * barWidth;
      const barActualWidth = barWidth - margin;

      // グラデーションを作成（より鮮やかな色使い）
      const gradient = ctx.createLinearGradient(x, rect.height - height, x, rect.height);
      const hue = (num / maxValue) * 240; // 青から赤のグラデーション
      gradient.addColorStop(0, `hsla(${hue}, 90%, 60%, 0.9)`);
      gradient.addColorStop(1, `hsla(${hue}, 90%, 40%, 0.9)`);

      // バーの影を設定
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // バーを描画
      ctx.beginPath();
      ctx.roundRect(
        x,
        rect.height - height,
        barActualWidth,
        height,
        [4]
      );
      ctx.fillStyle = gradient;
      ctx.fill();

      // 影をリセット
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 値を表示（バーが十分に大きい場合）
      if (height > 40 && barActualWidth > 25) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          num.toString(),
          x + barActualWidth / 2,
          rect.height - height + 20
        );

        // テキストの縁取り効果
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeText(
          num.toString(),
          x + barActualWidth / 2,
          rect.height - height + 20
        );
      }
    });
  }, [numbers, maxValue]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-[400px] rounded-lg bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transition-all duration-300 ease-in-out"
    />
  );
};