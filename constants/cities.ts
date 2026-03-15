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
     "Achakar",
"Achennad",
"Administratif",
"Ahlane",
"Aida Village",
"Ain Dalia",
"Ain El Hayani",
"Al Amal",
"Al Irfane",
"Aouama",
"Aviation",
"Azib Haj Kaddour",
"Bassatine",
"Bel Air",
"Bella Vista",
"Ben Dibane",
"Beni Makada",
"Benkirane",
"Bir Chifa/ Bir Chairi",
"Boubana",
"Bouhout",
"Boukhalef",
"Branes",
"Briyech",
"California",
"Cap Spartel",
"Casabarata",
"Castilla",
"Centre ville",
"Charf",
"Dar Baroud",
"Dayedaate",
"Dradeb",
"Drissia",
"Golf",
"Gzenaya",
"El Baraka",
"El Haj El Mokhtar",
"El hajriyine",
"El Majd",
"El Mers",
"Haddad",
"Hanaa",
"Hay El Boughaz",
"Hay Hassani",
"Houara",
"Iberia",
"Jbel Kbir",
"Jirari",
"Kasbah",
"Lala Chafia",
"Nouvelle ville Ibn Batouta",
"Makhoukha",
"Malabata",
"Mandar jamil",

"Marchane",
"Marina",
"Marjane",
"Medina",
"Mediouna",
"Mesnana",
"Mghogha",
"Mister Khouch",
"Mnar",
"Moujahidine",
"Moulay Youssef",
"Moulay Ismail",
"Mozart",
"Msallah",
"Nouinouich",
"Nzaha",
"Petit Socco",
"Playa",
"Port Tanger Ville",
"Port Med",
"Rmilat",
"Route de Rabat",
"Route de Tétouan",
"Route de Ksar Seghir",
"Sania",
"Sidi Amar",
"Souani",
"Souk Lebkar",
"Star Hill",
"Tanger City Center",
"Tanjah Balia",
"Tanger Free Zone",
"Tanger Zone Off Shore",
"Val Fleuri",
"Vielle Montagne",
"Zemmouri",
"Ziatène",
"Zone Industrielle Moghogha",
"Zone Industrielle Gzenaya",
"Zone Industrielle TAC",


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
  {
    name: "Ksar Seghir",
    neighborhoods: [
      
    ],
  },
  {
    name: "Castillejo",
    neighborhoods: [
      
    ],
  },
  {
    name: "Oujda",
    neighborhoods: [
      
    ],
  },
  {
    name: "Saidia",
    neighborhoods: [
      
    ],
  },
  {
    name: "Nador",
    neighborhoods: [
      
    ],
  },
  {
    name: "Kenitra",
    neighborhoods: [
      
    ],
  },
  {
    name: "Casablanca",
    neighborhoods: [
      
    ],
  },
  {
    name: "Rabat",
    neighborhoods: [
      
    ],
  },
  {
    name: "Marrakech",
    neighborhoods: [
      
    ],
  },
  {
    name: "Agadir",
    neighborhoods: [
      
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