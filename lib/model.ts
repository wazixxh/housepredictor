import { BASE_COEFS, CITY_COEFS, INTERCEPT, MODEL_MAE, MODEL_R2 } from "./modelCoefficients";

export interface PredictionInput {
  bedrooms: number;
  bathrooms: number;
  sqftLiving: number;
  sqftLot: number;
  floors: number;
  waterfront: boolean;
  view: number; // 0-4
  condition: number; // 1-5
  yearBuilt: number;
  city: string;
}

export interface PredictionResult {
  estimate: number;
  low: number;
  high: number;
  r2: number;
  mae: number;
  breakdown: { label: string; impact: number }[];
}

/**
 * Runs the linear regression: price = intercept + sum(coef_i * feature_i) + cityCoef
 * Mirrors the scikit-learn model trained in the notebook 1:1 for this feature set.
 */
export function predictPrice(input: PredictionInput): PredictionResult {
  const cityCoef = CITY_COEFS[input.city] ?? 0;

  const contributions = {
    bedrooms: BASE_COEFS.bedrooms * input.bedrooms,
    bathrooms: BASE_COEFS.bathrooms * input.bathrooms,
    sqft_living: BASE_COEFS.sqft_living * input.sqftLiving,
    sqft_lot: BASE_COEFS.sqft_lot * input.sqftLot,
    floors: BASE_COEFS.floors * input.floors,
    waterfront: BASE_COEFS.waterfront * (input.waterfront ? 1 : 0),
    view: BASE_COEFS.view * input.view,
    condition: BASE_COEFS.condition * input.condition,
    yr_built: BASE_COEFS.yr_built * input.yearBuilt,
    city: cityCoef,
  };

  const raw =
    INTERCEPT +
    Object.values(contributions).reduce((sum, v) => sum + v, 0);

  const estimate = Math.max(0, Math.round(raw));
  const margin = Math.round(MODEL_MAE);

  const breakdown = [
    { label: "Base value", impact: Math.round(INTERCEPT) },
    { label: "Bedrooms", impact: Math.round(contributions.bedrooms) },
    { label: "Bathrooms", impact: Math.round(contributions.bathrooms) },
    { label: "Living area", impact: Math.round(contributions.sqft_living) },
    { label: "Lot size", impact: Math.round(contributions.sqft_lot) },
    { label: "Floors", impact: Math.round(contributions.floors) },
    { label: "Waterfront", impact: Math.round(contributions.waterfront) },
    { label: "View quality", impact: Math.round(contributions.view) },
    { label: "Condition", impact: Math.round(contributions.condition) },
    { label: "Year built", impact: Math.round(contributions.yr_built) },
    { label: `Location (${input.city})`, impact: Math.round(contributions.city) },
  ];

  return {
    estimate,
    low: Math.max(0, estimate - margin),
    high: estimate + margin,
    r2: MODEL_R2,
    mae: MODEL_MAE,
    breakdown,
  };
}
