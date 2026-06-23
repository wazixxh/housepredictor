// The 44 King County, WA cities present in the training data.
// Keep in sync with lib/modelCoefficients.ts.
export const CITIES = [
  "Algona", "Auburn", "Beaux Arts Village", "Bellevue", "Black Diamond",
  "Bothell", "Burien", "Carnation", "Clyde Hill", "Covington", "Des Moines",
  "Duvall", "Enumclaw", "Fall City", "Federal Way", "Inglewood-Finn Hill",
  "Issaquah", "Kenmore", "Kent", "Kirkland", "Lake Forest Park",
  "Maple Valley", "Medina", "Mercer Island", "Milton", "Newcastle",
  "Normandy Park", "North Bend", "Pacific", "Preston", "Ravensdale",
  "Redmond", "Renton", "Sammamish", "SeaTac", "Seattle", "Shoreline",
  "Skykomish", "Snoqualmie", "Snoqualmie Pass", "Tukwila", "Vashon",
  "Woodinville", "Yarrow Point",
] as const;

export type City = (typeof CITIES)[number];
