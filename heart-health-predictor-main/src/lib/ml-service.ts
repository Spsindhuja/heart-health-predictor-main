/**
 * Mock ML prediction service for Cardiac Clarity
 * In production, replace these with actual FastAPI backend calls.
 * API Base URL: http://localhost:8000/api
 *
 * REPRODUCIBILITY: All randomness uses a seeded PRNG (seed=42)
 * so predictions are deterministic and stable across runs.
 */

// Seeded PRNG (Mulberry32) for reproducible results
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PatientInput {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface PredictionResult {
  prediction: 0 | 1;
  probability: number;
  model_used: string;
  shap_values: { feature: string; value: number; contribution: number }[];
  top_features: { feature: string; importance: number }[];
}

export interface ModelMetrics {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export interface ROCPoint {
  fpr: number;
  tpr: number;
}

export interface ModelROCData {
  model: string;
  points: ROCPoint[];
}

// Simulated model metrics (representative of real Cleveland dataset results)
export const MODEL_METRICS: ModelMetrics[] = [
  { model: "Logistic Regression", accuracy: 0.853, precision: 0.841, recall: 0.867, f1_score: 0.854, roc_auc: 0.912 },
  { model: "Random Forest", accuracy: 0.869, precision: 0.862, recall: 0.878, f1_score: 0.870, roc_auc: 0.934 },
  { model: "SVM (RBF)", accuracy: 0.844, precision: 0.838, recall: 0.856, f1_score: 0.847, roc_auc: 0.905 },
  { model: "XGBoost", accuracy: 0.885, precision: 0.879, recall: 0.893, f1_score: 0.886, roc_auc: 0.941 },
  { model: "KNN (k=7)", accuracy: 0.831, precision: 0.822, recall: 0.844, f1_score: 0.833, roc_auc: 0.889 },
];

// Generate realistic ROC curve data (deterministic)
function generateROCCurve(auc: number): ROCPoint[] {
  const points: ROCPoint[] = [{ fpr: 0, tpr: 0 }];
  const steps = 20;
  for (let i = 1; i <= steps; i++) {
    const fpr = i / steps;
    const tpr = Math.min(1, Math.pow(fpr, 1 / (auc * 2.5)));
    points.push({ fpr, tpr });
  }
  points.push({ fpr: 1, tpr: 1 });
  return points;
}

export const ROC_CURVES: ModelROCData[] = MODEL_METRICS.map((m) => ({
  model: m.model,
  points: generateROCCurve(m.roc_auc),
}));

const FEATURE_NAMES: Record<string, string> = {
  age: "Age",
  sex: "Sex",
  cp: "Chest Pain Type",
  trestbps: "Resting BP",
  chol: "Cholesterol",
  fbs: "Fasting Blood Sugar",
  restecg: "Resting ECG",
  thalach: "Max Heart Rate",
  exang: "Exercise Angina",
  oldpeak: "ST Depression",
  slope: "ST Slope",
  ca: "Major Vessels",
  thal: "Thalassemia",
};

/**
 * Simulate a prediction from the ML backend.
 * Replace this function body with a fetch call to your FastAPI backend.
 */
export async function predictHeartDisease(input: PatientInput): Promise<PredictionResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1200));

  // Create a deterministic seed from patient input values (seed=42 base)
  const inputSeed = Object.values(input).reduce((acc: number, v) => acc * 31 + (v as number), 42);
  const rng = mulberry32(inputSeed);

  // Simple heuristic-based mock prediction (fully deterministic)
  let risk = 0;
  if (input.age > 55) risk += 0.15;
  if (input.sex === 1) risk += 0.05;
  if (input.cp >= 2) risk += 0.15;
  if (input.trestbps > 140) risk += 0.1;
  if (input.chol > 240) risk += 0.1;
  if (input.fbs === 1) risk += 0.05;
  if (input.thalach < 120) risk += 0.12;
  if (input.exang === 1) risk += 0.12;
  if (input.oldpeak > 2) risk += 0.1;
  if (input.ca > 0) risk += 0.1 * input.ca;
  if (input.thal >= 2) risk += 0.08;

  // Seeded noise instead of Math.random()
  const probability = Math.min(0.97, Math.max(0.05, risk + (rng() * 0.1 - 0.05)));
  const prediction = probability > 0.5 ? 1 : 0;

  // Generate deterministic SHAP-like values
  const features = Object.keys(input) as (keyof PatientInput)[];
  const shapValues = features.map((f) => {
    const contribution = (rng() - 0.4) * 0.3;
    return {
      feature: FEATURE_NAMES[f] || f,
      value: input[f] as number,
      contribution: parseFloat(contribution.toFixed(4)),
    };
  });

  shapValues.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const topFeatures = shapValues.slice(0, 5).map((s) => ({
    feature: s.feature,
    importance: parseFloat(Math.abs(s.contribution * 3).toFixed(4)),
  }));

  return {
    prediction: prediction as 0 | 1,
    probability: parseFloat(probability.toFixed(4)),
    model_used: "XGBoost",
    shap_values: shapValues,
    top_features: topFeatures,
  };
}

export function getFeatureLabel(key: string): string {
  return FEATURE_NAMES[key] || key;
}
