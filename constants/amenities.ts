import type { AmenityDefinition } from "@/types";

// ── Full amenities list ──────────────────────────────────────
// key   = stored in the DB amenities[] array
// label = shown in the UI
// icon  = Lucide icon component name (import from "lucide-react")

export const AMENITIES: AmenityDefinition[] = [
  // Outdoor & building
  { key: "piscine",          label: "Piscine",              icon: "Waves"          },
  { key: "jardin",           label: "Jardin",               icon: "Trees"          },
  { key: "terrasse",         label: "Terrasse",             icon: "Sun"            },
  { key: "balcon",           label: "Balcon",               icon: "Building"       },
  { key: "parking",          label: "Parking",              icon: "Car"            },
  { key: "garage",           label: "Garage",               icon: "Warehouse"      },
  { key: "vue_mer",          label: "Vue mer",              icon: "Sailboat"       },
  { key: "vue_montagne",     label: "Vue montagne",         icon: "Mountain"       },

  // Security
  { key: "gardien",          label: "Gardien",              icon: "Shield"         },
  { key: "digicode",         label: "Digicode",             icon: "Lock"           },
  { key: "camera",           label: "Caméras",              icon: "Camera"         },
  { key: "residence_fermee", label: "Résidence fermée",     icon: "DoorClosed"     },

  // Building features
  { key: "ascenseur",        label: "Ascenseur",            icon: "ArrowUpDown"    },
  { key: "interphone",       label: "Interphone",           icon: "Phone"          },

  // Interior
  { key: "meuble",           label: "Meublé",               icon: "Sofa"           },
  { key: "climatisation",    label: "Climatisation",        icon: "Wind"           },
  { key: "chauffage",        label: "Chauffage central",    icon: "Flame"          },
  { key: "cheminee",         label: "Cheminée",             icon: "Flame"          },
  { key: "double_vitrage",   label: "Double vitrage",       icon: "Square"         },

  // Kitchen & appliances
  { key: "cuisine_equipee",  label: "Cuisine équipée",      icon: "ChefHat"        },
  { key: "lave_linge",       label: "Lave-linge",           icon: "WashingMachine" },
  { key: "lave_vaisselle",   label: "Lave-vaisselle",       icon: "Utensils"       },

  // Connectivity
  { key: "wifi",             label: "WiFi",                 icon: "Wifi"           },
  { key: "fibre",            label: "Fibre optique",        icon: "Zap"            },

  // Accessibility & other
  { key: "accessible",       label: "Accessible PMR",       icon: "Accessibility"  },
  { key: "cave",             label: "Cave / Débarras",      icon: "Package"        },
  { key: "buanderie",        label: "Buanderie",            icon: "Shirt"          },
];


// ── Quick lookup by key ──────────────────────────────────────
// getAmenity("piscine") → { key: "piscine", label: "Piscine", icon: "Waves" }

export function getAmenity(key: string): AmenityDefinition | undefined {
  return AMENITIES.find((a) => a.key === key);
}


// ── Filter to only the amenities a listing has ───────────────
// getListingAmenities(["piscine", "wifi", "unknown"])
// → [{ key: "piscine", ... }, { key: "wifi", ... }]

export function getListingAmenities(keys: string[]): AmenityDefinition[] {
  return keys
    .map((k) => getAmenity(k))
    .filter((a): a is AmenityDefinition => a !== undefined);
}