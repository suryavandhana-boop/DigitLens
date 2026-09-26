import * as tf from '@tensorflow/tfjs';

export interface PredictionResult {
  predictedDigit: number;
  confidence: number;
  probabilities: number[];
  normalizedImageData?: ImageData;
}

let loadedModel: tf.LayersModel | null = null;
let isLoadingModel = false;

/**
 * Loads the trained TensorFlow/Keras MNIST model.
 */
export async function getOrLoadModel(): Promise<tf.LayersModel> {
  if (loadedModel) return loadedModel;

  if (isLoadingModel) {
    // Wait until loading finishes
    while (isLoadingModel) {
      await new Promise((r) => setTimeout(r, 50));
    }
    if (loadedModel) return loadedModel;
  }

  isLoadingModel = true;
  try {
    console.log('Loading real trained TensorFlow/Keras MNIST model from /model/model.json...');
    loadedModel = await tf.loadLayersModel('/model/model.json');
    console.log('MNIST Model loaded successfully!');
    return loadedModel;
  } catch (err) {
    console.error('Failed to load model from /model/model.json:', err);
    throw err;
  } finally {
    isLoadingModel = false;
  }
}

/**
 * Preprocess user canvas to 28x28 grayscale normalized tensor matching MNIST dataset standard.
 * Standard MNIST:
 * 1. Find bounding box of drawn stroke.
 * 2. Scale bounding box into a 20x20 area, preserving aspect ratio.
 * 3. Center the 20x20 area inside a 28x28 box using center of mass / center of gravity.
 * 4. Invert colors so background is 0.0 and stroke ink is 1.0 (MNIST format).
 */
export function preprocessCanvasForMNIST(canvas: HTMLCanvasElement): {
  tensor: tf.Tensor4D;
  preview28Canvas: HTMLCanvasElement;
  hasDrawnContent: boolean;
} {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Step 1: Find bounding box of drawn ink
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let hasInk = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Detect drawn ink (any color that deviates from white background)
      const colorDiff = 255 - Math.min(r, g, b);
      if (a > 50 && colorDiff > 30) {
        hasInk = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Create standard 28x28 target canvas
  const canvas28 = document.createElement('canvas');
  canvas28.width = 28;
  canvas28.height = 28;
  const ctx28 = canvas28.getContext('2d')!;

  // Fill black background (0 in MNIST)
  ctx28.fillStyle = '#000000';
  ctx28.fillRect(0, 0, 28, 28);

  if (!hasInk) {
    // Empty drawing
    const emptyTensor = tf.zeros([1, 28, 28, 1]) as tf.Tensor4D;
    return {
      tensor: emptyTensor,
      preview28Canvas: canvas28,
      hasDrawnContent: false,
    };
  }

  // Add small padding around bounding box
  const pad = 4;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width, maxX + pad);
  maxY = Math.min(height, maxY + pad);

  const boxW = Math.max(1, maxX - minX);
  const boxH = Math.max(1, maxY - minY);

  // Crop bounding box to temporary canvas
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = boxW;
  cropCanvas.height = boxH;
  const cropCtx = cropCanvas.getContext('2d')!;
  cropCtx.drawImage(canvas, minX, minY, boxW, boxH, 0, 0, boxW, boxH);

  // Invert cropped image into grayscale white-on-black for MNIST
  const cropImgData = cropCtx.getImageData(0, 0, boxW, boxH);
  const cropData = cropImgData.data;
  for (let i = 0; i < cropData.length; i += 4) {
    const r = cropData[i];
    const g = cropData[i + 1];
    const b = cropData[i + 2];
    const colorDiff = 255 - Math.min(r, g, b);
    const inkValue = Math.min(255, Math.round(colorDiff * 1.3));
    cropData[i] = inkValue;
    cropData[i + 1] = inkValue;
    cropData[i + 2] = inkValue;
  }
  cropCtx.putImageData(cropImgData, 0, 0);

  // Scale into 20x20 while preserving aspect ratio
  const maxDim = Math.max(boxW, boxH);
  const scale = 20 / maxDim;
  const scaledW = Math.round(boxW * scale);
  const scaledH = Math.round(boxH * scale);

  // Center in 28x28 canvas (leaving 4px border around 20x20 box)
  const dx = Math.round((28 - scaledW) / 2);
  const dy = Math.round((28 - scaledH) / 2);

  ctx28.imageSmoothingEnabled = true;
  ctx28.imageSmoothingQuality = 'high';
  ctx28.drawImage(cropCanvas, 0, 0, boxW, boxH, dx, dy, scaledW, scaledH);

  // Extract float32 array normalized to [0.0, 1.0]
  const final28Data = ctx28.getImageData(0, 0, 28, 28).data;
  const floatArr = new Float32Array(28 * 28);

  for (let i = 0; i < 28 * 28; i++) {
    // Red channel holds grayscale intensity
    floatArr[i] = final28Data[i * 4] / 255.0;
  }

  const tensor = tf.tensor4d(floatArr, [1, 28, 28, 1]);

  return {
    tensor,
    preview28Canvas: canvas28,
    hasDrawnContent: true,
  };
}

/**
 * Predict handwritten digit using the real trained TensorFlow/Keras MNIST model.
 */
export async function predictDigit(canvas: HTMLCanvasElement): Promise<PredictionResult | null> {
  const model = await getOrLoadModel();
  const { tensor, hasDrawnContent } = preprocessCanvasForMNIST(canvas);

  if (!hasDrawnContent) {
    tensor.dispose();
    return null;
  }

  try {
    const output = model.predict(tensor) as tf.Tensor;
    const probabilities = Array.from(await output.data());

    // Find max probability index (0-9)
    let maxIdx = 0;
    let maxProb = -1;

    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i];
        maxIdx = i;
      }
    }

    const confidence = Math.round(maxProb * 100);

    output.dispose();
    tensor.dispose();

    return {
      predictedDigit: maxIdx,
      confidence,
      probabilities,
    };
  } catch (err) {
    tensor.dispose();
    throw err;
  }
}
