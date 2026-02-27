import type { ListingPurpose, PropertyType } from "@/types";

// ── Purpose options ───────────────────────────────────────────

export const PURPOSE_OPTIONS: { value: ListingPurpose; label: string }[] = [
  { value: "vente",    label: "Acheter"   },
  { value: "location", label: "Louer"     },
  { value: "vacances", label: "Vacances"  },
];


// ── Property type options ─────────────────────────────────────

export const TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "appartement", label: "Appartement" },
  { value: "villa",       label: "Villa"        },
  { value: "maison",      label: "Maison"       },
  { value: "studio",      label: "Studio"       },
  { value: "bureau",      label: "Bureau"       },
  { value: "terrain",     label: "Terrain"      },
  { value: "local industriel",     label: "local industriel"      },
  { value: "local commercial",     label: "local commercial"      },
  { value: "Ryad",     label: "Ryad"      },
  { value: "Ferme",     label: "Ferme"      },
];


// ── Price ranges (MAD) ───────────────────────────────────────

export const PRICE_RANGES_VENTE = [
  { label: "Moins de 500k",      min: 0,         max: 500000    },
  { label: "500k – 1M",          min: 500000,    max: 1000000   },
  { label: "1M – 2M",            min: 1000000,   max: 2000000   },
  { label: "2M – 5M",            min: 2000000,   max: 5000000   },
  { label: "Plus de 5M",         min: 5000000,   max: undefined },
];

export const PRICE_RANGES_LOCATION = [
  { label: "Moins de 3 000",     min: 0,     max: 3000   },
  { label: "3 000 – 6 000",      min: 3000,  max: 6000   },
  { label: "6 000 – 10 000",     min: 6000,  max: 10000  },
  { label: "Plus de 10 000",     min: 10000, max: undefined },
];

export const PRICE_RANGES_VACANCES = [
  { label: "Moins de 500 / nuit",    min: 0,   max: 500  },
  { label: "500 – 1 000 / nuit",     min: 500, max: 1000 },
  { label: "Plus de 1 000 / nuit",   min: 1000, max: undefined },
];


// ── Rooms options ────────────────────────────────────────────

export const ROOMS_OPTIONS = [
  { value: 1,  label: "1 pièce"   },
  { value: 2,  label: "2 pièces"  },
  { value: 3,  label: "3 pièces"  },
  { value: 4,  label: "4 pièces"  },
  { value: 5,  label: "5+ pièces" },
];

export const BEDROOMS_OPTIONS = [
  { value: 1, label: "1 chambre"   },
  { value: 2, label: "2 chambres"  },
  { value: 3, label: "3 chambres"  },
  { value: 4, label: "4 chambres"  },
  { value: 5, label: "5+ chambres" },
];


// ── Sort options ─────────────────────────────────────────────

export const SORT_OPTIONS = [
  { value: "date_desc",    label: "Plus récents"         },
  { value: "date_asc",     label: "Plus anciens"         },
  { value: "price_asc",    label: "Prix croissant"       },
  { value: "price_desc",   label: "Prix décroissant"     },
  { value: "surface_desc", label: "Plus grande surface"  },
];