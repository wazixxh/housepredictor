export interface PredictionFormValues {
  bedrooms: number;
  bathrooms: number;
  sqftLiving: number;
  sqftLot: number;
  floors: number;
  waterfront: boolean;
  view: number;
  condition: number;
  yearBuilt: number;
  city: string;
}

export interface PredictionApiResponse {
  estimate: number;
  low: number;
  high: number;
  r2: number;
  mae: number;
  breakdown: { label: string; impact: number }[];
}
