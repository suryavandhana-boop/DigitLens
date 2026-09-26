import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import * as tf from '@tensorflow/tfjs';

async function fetchAndUnzip(url) {
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return zlib.gunzipSync(buffer);
}

function parseIDXImages(buffer) {
  const numImages = buffer.readInt32BE(4);
  const numRows = buffer.readInt32BE(8);
  const numCols = buffer.readInt32BE(12);
  const imageSize = numRows * numCols;
  const pixelData = buffer.subarray(16);
  return { numImages, numRows, numCols, pixelData, imageSize };
}

function parseIDXLabels(buffer) {
  const numLabels = buffer.readInt32BE(4);
  const labelData = buffer.subarray(8);
  return { numLabels, labelData };
}

async function run() {
  console.log('Fetching official MNIST dataset...');
  const [imagesBuffer, labelsBuffer] = await Promise.all([
    fetchAndUnzip('https://storage.googleapis.com/cvdf-datasets/mnist/train-images-idx3-ubyte.gz'),
    fetchAndUnzip('https://storage.googleapis.com/cvdf-datasets/mnist/train-labels-idx1-ubyte.gz')
  ]);

  const { pixelData, imageSize } = parseIDXImages(imagesBuffer);
  const { labelData } = parseIDXLabels(labelsBuffer);

  // 6,000 samples converges quickly to 95-97% accuracy in ~15 seconds on CPU
  const sampleCount = 6000;
  console.log(`Preparing ${sampleCount} training tensors...`);

  const floatPixels = new Float32Array(sampleCount * imageSize);
  for (let i = 0; i < sampleCount * imageSize; i++) {
    floatPixels[i] = pixelData[i] / 255.0;
  }

  const oneHotLabels = new Float32Array(sampleCount * 10);
  for (let i = 0; i < sampleCount; i++) {
    const label = labelData[i];
    oneHotLabels[i * 10 + label] = 1.0;
  }

  const xs = tf.tensor4d(floatPixels, [sampleCount, 28, 28, 1]);
  const ys = tf.tensor2d(oneHotLabels, [sampleCount, 10]);

  // Model matching Keras sequential Dense specification
  const model = tf.sequential();
  model.add(tf.layers.flatten({ inputShape: [28, 28, 1] }));
  model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.003),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  console.log('Training neural network...');
  await model.fit(xs, ys, {
    epochs: 7,
    batchSize: 64,
    validationSplit: 0.1,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}/7: loss = ${logs.loss.toFixed(4)}, acc = ${(logs.acc * 100).toFixed(1)}%, val_acc = ${(logs.val_acc * 100).toFixed(1)}%`);
      }
    }
  });

  console.log('Saving model weights to public/model...');
  const outDir = path.resolve('public/model');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  await model.save(tf.io.withSaveHandler(async (artifacts) => {
    const modelJson = {
      modelTopology: artifacts.modelTopology,
      format: artifacts.format,
      generatedBy: artifacts.generatedBy,
      convertedBy: artifacts.convertedBy,
      weightsManifest: [
        {
          paths: ['./weights.bin'],
          weights: artifacts.weightSpecs
        }
      ]
    };

    fs.writeFileSync(path.join(outDir, 'model.json'), JSON.stringify(modelJson, null, 2));
    if (artifacts.weightData) {
      fs.writeFileSync(path.join(outDir, 'weights.bin'), Buffer.from(artifacts.weightData));
    }

    console.log('Saved model.json and weights.bin successfully!');
    return {
      modelArtifactsInfo: {
        dateSaved: new Date(),
        modelTopologyType: 'JSON',
        weightDataBytes: artifacts.weightData ? artifacts.weightData.byteLength : 0
      }
    };
  }));

  xs.dispose();
  ys.dispose();
  console.log('Done!');
}

run().catch(err => {
  console.error('Training failed:', err);
  process.exit(1);
});
