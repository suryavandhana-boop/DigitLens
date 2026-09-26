import React, { useEffect, useRef } from 'react';

interface MNISTSampleCanvasProps {
  pixels: number[];
  className?: string;
  size?: number; // visual display size in px
}

export const MNISTSampleCanvas: React.FC<MNISTSampleCanvasProps> = ({
  pixels,
  className = '',
  size = 56,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pixels || pixels.length < 784) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create ImageData for 28x28
    const imgData = ctx.createImageData(28, 28);
    for (let i = 0; i < 784; i++) {
      const val = pixels[i]; // 0 (background) to 255 (ink)
      const pIdx = i * 4;
      imgData.data[pIdx] = val;     // R
      imgData.data[pIdx + 1] = val; // G
      imgData.data[pIdx + 2] = val; // B
      imgData.data[pIdx + 3] = 255; // Alpha
    }

    ctx.putImageData(imgData, 0, 0);
  }, [pixels]);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-xl overflow-hidden bg-black border-2 border-slate-900 shadow-xs flex items-center justify-center ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={28}
        height={28}
        style={{ width: size - 4, height: size - 4 }}
        className="[image-rendering:pixelated]"
      />
    </div>
  );
};
