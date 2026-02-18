// ── Cities & Neighborhoods ───────────────────────────────────
// Adapt this list to match your friend's market
// Currently set up for northern Morocco

export interface CityData {
  name: string;
  neighborhoods: string[];
}

export const CITIES: CityData[] = [
  {
    name: "Tanger",
    neighborhoods: [
      "Malabata",
      "Centre-Ville",
      "Mesnana",
      "Iberia",
      "Marshan",
      "Bir Chifa",
      "Val Fleuri",
      "Ghandouri",
      "Tanja Balia",
      "Moujahidine",
      "Achakar",
      "Cap Spartel",
      "Ain Hayani",
      "Marchane",
      "Souani",
    ],
  },
  {
    name: "Tétouan",
    neighborhoods: [
      "Centre-Ville",
      "Martil",
      "M'diq",
      "Cabo Negro",
      "Restinga",
      "Tamuda Bay",
    ],
  },
  {
    name: "M'diq",
    neighborhoods: [
      "Front de Mer",
      "Centre",
      "Cabo Negro",
    ],
  },
  {
    name: "Martil",
    neighborhoods: [
      "Front de Mer",
      "Centre",
    ],
  },
  {
    name: "Fnideq",
    neighborhoods: [
      "Centre",
      "Bord de Mer",
    ],
  },
  {
    name: "Al Hoceima",
    neighborhoods: [
      "Centre-Ville",
      "Bord de Mer",
      "Ajdir",
    ],
  },
];


// ── Flat list of city names ───────────────────────────────────
// Used in filter dropdowns

export const CITY_NAMES: string[] = CITIES.map((c) => c.name);


// ── Get neighborhoods for a specific city ────────────────────
// getNeighborhoods("Tanger") → ["Malabata", "Centre-Ville", ...]

export function getNeighborhoods(cityName: string): string[] {
  return CITIES.find((c) => c.name === cityName)?.neighborhoods ?? [];
}