export const REFERENCE_PREFIXES = [
  "L1","L2","L3","L4","L5","L6","L7","L8","L9",
  "V1","V2","V3","V4","V5","V6","V7",
  "P1","P2","P3","P4","P5","P6",
] as const;

export type ReferencePrefix = typeof REFERENCE_PREFIXES[number];

export const GEO_CODES: Record<string, string> = {
  A: "Achakar · Rmilat · Sidi Kacem · Jbilat · Mediouna · Hajrienne",
  B: "Bella Vista · Tanja Balia",
  C: "Beni Makada · Jirari · Casabarata · Tchar.B.Dibane · Aouama",
  D: "California · Moujahidine · Jbel Lekbir · Golf · Boubana · Rahrah",
  E: "Centre Ville",
  F: "Charf · Sourienne",
  G: "Iberia · Hop Esp · Marshan · Dradeb",
  H: "Medina · Kasba",
  I: "Off Shore · Malabata · Corniche",
  J: "Place Mozart · Nejma · Beethoven · Y.B.Tachfine",
  K: "Route de Rabat",
  L: "Route de Tétouan",
  M: "Route Ksar Sghir · Nouinouich · Feden Chapo · Zaitouna",
  N: "Val Fleuri · Mesnana · Ziaten · Branes",
  O: "Ksar Sghir",
  P: "Tétouan",
  Q: "Asilah",
  R: "Larache",
  S: "Kénitra",
  T: "Rabat",
  U: "Casablanca",
  V: "Marrakech",
  W: "Agadir",
  X: "Nador · Al-Hoceima",
  Y: "Oujda · Saïdia",
  Z: "Autres",
};

export const GEO_CODE_KEYS = Object.keys(GEO_CODES) as string[];