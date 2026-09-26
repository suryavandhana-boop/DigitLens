export interface ProjectInfoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface FlowStep {
  step: number;
  title: string;
  subtitle: string;
  details: string;
  badge: string;
}

export interface LayerSpec {
  name: string;
  type: string;
  outputShape: string;
  description: string;
}

export interface DigitAccuracy {
  digit: number;
  total: number;
  correct: number;
  accuracy: number;
}

export interface EpochMetric {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
}

export interface RealTestSample {
  sampleIndex: number;
  trueLabel: number;
  predictedDigit: number;
  confidence: number;
  isCorrect: boolean;
  probabilities: number[];
  pixels: number[];
}

export interface ModelInsightsData {
  evaluatedSamples: number;
  testAccuracy: number;
  totalCorrect: number;
  perDigitStats: DigitAccuracy[];
  trainingHistory: EpochMetric[];
  testSamples: RealTestSample[];
}

