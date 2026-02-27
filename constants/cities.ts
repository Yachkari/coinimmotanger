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
"Ahammar",
"Aharanne",
"Ahlane",
"Aida Village",
"Ain El Hayani",
"Ain Zaitouna",
"Al Amal",
"Al Anbar",
"Alia",
"Al Irfane 2",
"Al Kasba",
"Al Mandar Jamil",
"Al Warda",
"Aouama",
"Aviation",
"Azib Haj Kaddour",
"Bel Air - Val Fleuri",
"Ben Dibane",
"Beni Makada",
"Ben Said",
"Bni Touzine",
"Benkirane",
"Bir Aharchoune",
"Bir Chairi",
"Bir Chifa",
"Bir El Ghazi",
"Bouchta - Abdelatif",
"Bouhout",
"Boukhalef",
"Branes ",
"Californie",
"Cap Spartel",
"Casabarata",
"Castilla",
"Centre",
"Centre ville",
"Charf",
"Dar Zhiro",
"Playa",
"Dher Ahjjam",
"Dher Lahmam",
"Draoua",
"Drissia",
"Golf",
"Gzenaya",
"El Baraka",
"El Haj El Mokhtar",
"El Khair",
"El Majd",
"El Mrabet",
"Em Oued",
"Ennasr",
"Girari",
"El Mers",
"Gourziana",
"Haddad",
"Hanaa 1",
"Hanaa 2",
"Hay Al Bassatine",
"Hay El Boughaz",
"Hay Hassani",
"Ibn Taymia",
"Jbel Kbir",
"Lala Chafia",
"Nouvelle ville Ibn Batouta",
"Makhoukha",
"Malabata",
"Mnar",
"Manipolio",
"Marchane",
"Marina ",
"Marjane ",
"Medina",
"Mediouna",
"Mesnana",
"Mghayer",
"Mghogha",
"Mister Khouch",
"Moujahidine",
"Moulay Youssef",
"Moulay Ismail",
"Mozart",
"Msallah",
"Nouinouich",
"Nzaha",
"Port Tanger Ville",
"Port Med",
"Rmilat",
"Route de Rabat",
"Route de Tétouan",
"Route de Ksar Seghir",
"Sania",
"Santa",
"Souani",
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

      "achakar-rmilat-sidi kacem-jbilat-mediouna-hajrienne",
"bella vista-tanja balia",
"beni makada-jirari-casabarata-tchar.b.dibane-aouama",
"california-moujahidine-jbel lekbir-golf-boubana-rahrah",
"centre ville",
"charf-sourienne",
"iberia-hop esp-marshan-dradeb",
"medina-kasba",
"of shore-malabata-corniche",
"place mozart-nejma-beethoven-y.b.tachfine",
"route de rabat",
"route de tetouan",
"route ksar sghir-nouinouich-feden chapo-zaitouna",
"val fleuri-mesnana-ziaten-branes",


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