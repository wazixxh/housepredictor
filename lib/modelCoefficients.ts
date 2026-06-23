// Auto-generated from the trained scikit-learn Multiple Linear Regression model.
// Source notebook: Multiple_Linear_Regression_Model_House_predictor.ipynb
// Re-fit on the exact feature set EstatePredict's UI collects:
// bedrooms, bathrooms, sqft_living, sqft_lot, floors, waterfront, view, condition, yr_built, city
// Do not hand-edit -- regenerate from the notebook if the model changes.

export const INTERCEPT = 1351537.943913;

export const BASE_COEFS: Record<string, number> = {
  bedrooms: -18437.189234,
  bathrooms: 24729.751570,
  sqft_living: 148.535966,
  sqft_lot: 0.128940,
  floors: 42514.495307,
  waterfront: 140195.525723,
  view: 29612.091326,
  condition: 19244.861221,
  yr_built: -753.206095,
};

// Reference city (encoded as the all-zero dummy row): Algona
export const CITY_COEFS: Record<string, number> = {
  "Algona": 0,
  "Auburn": 14152.918273,
  "Beaux Arts Village": 529912.688369,
  "Bellevue": 340640.453853,
  "Black Diamond": 193276.552848,
  "Bothell": 153822.568571,
  "Burien": 82224.292209,
  "Carnation": 138587.690878,
  "Clyde Hill": 600235.074715,
  "Covington": 16389.846555,
  "Des Moines": 34090.606992,
  "Duvall": 104039.814517,
  "Enumclaw": 12517.541693,
  "Fall City": 192536.633003,
  "Federal Way": 12368.352857,
  "Inglewood-Finn Hill": 213764.904649,
  "Issaquah": 226959.980422,
  "Kenmore": 151984.282964,
  "Kent": 22975.342730,
  "Kirkland": 282292.557175,
  "Lake Forest Park": 168804.027906,
  "Maple Valley": 46172.857265,
  "Medina": 0.000011,
  "Mercer Island": 412744.527249,
  "Milton": 131888.930843,
  "Newcastle": 256300.101405,
  "Normandy Park": 154192.405414,
  "North Bend": 101231.248220,
  "Pacific": 43406.924694,
  "Preston": 152009.153008,
  "Ravensdale": 121599.356902,
  "Redmond": 304772.497407,
  "Renton": 85795.159836,
  "Sammamish": 283405.382881,
  "SeaTac": 31623.559208,
  "Seattle": 247724.992193,
  "Shoreline": 146876.996875,
  "Skykomish": 27038.210837,
  "Snoqualmie": 152365.371673,
  "Snoqualmie Pass": 209647.410491,
  "Tukwila": 15563.638174,
  "Vashon": 106034.960695,
  "Woodinville": 229539.059909,
  "Yarrow Point": 168315.827276,
};

export const MODEL_R2 = 0.6859;
export const MODEL_MAE = 87045.92;
