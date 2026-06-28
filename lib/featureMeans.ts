// Mean value of each numeric feature in the (outlier-filtered) training data.
// Used by the breakdown chart to show "impact vs. a typical home" rather than
// raw coefficient × value, which makes yr_built look like a giant red bar
// because the intercept absorbs its scale.
//
// baseline_price ≈ intercept + sum(coef_i * mean_i) + mean_city_coef
// bar_i = coef_i * (value_i - mean_i)
export const FEATURE_MEANS: Record<string, number> = {
  bedrooms:   3.35,
  bathrooms:  2.09,
  sqft_living: 2030.70,
  sqft_lot:   14598.60,
  floors:     1.50,
  waterfront: 0.0037,
  view:       0.17,
  condition:  3.44,
  yr_built:   1970.88,
};
