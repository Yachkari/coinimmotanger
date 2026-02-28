export type Lang = 'fr' | 'en'

export const t = {
  // ─── Navbar ────────────────────────────────────────────────────────────────
  nav: {
    home:       { fr: 'Accueil',     en: 'Home' },
    buy:        { fr: 'Acheter',     en: 'Buy' },
    rent:       { fr: 'Louer',       en: 'Rent' },
    vacation:   { fr: 'Vacances',    en: 'Vacation' },
    contact:    { fr: 'Contact',     en: 'Contact' },
    search:     { fr: 'Rechercher',  en: 'Search' },
  },

  // ─── Footer ────────────────────────────────────────────────────────────────
  footer: {
    rights:      { fr: 'Tous droits réservés.', en: 'All rights reserved.' },
    tagline:     { fr: 'L\'immobilier à Tanger, simplifié.', en: 'Real estate in Tangier, simplified.' },
    contactUs:   { fr: 'Nous contacter',         en: 'Contact us' },
    followUs:    { fr: 'Nous suivre',             en: 'Follow us' },
    builtBy:     { fr: 'Conçu par',               en: 'Built by' },
  },

  // ─── Homepage ──────────────────────────────────────────────────────────────
  home: {
    heroTitle:       { fr: 'Trouvez votre bien à Tanger',           en: 'Find your property in Tangier' },
    heroSubtitle:    { fr: 'Vente, location et vacances — tous les biens au même endroit.', en: 'Buy, rent or vacation — all properties in one place.' },
    heroCta:         { fr: 'Voir les annonces',                     en: 'Browse listings' },
    featuredTitle:   { fr: 'Annonces en vedette',                   en: 'Featured listings' },
    featuredSubtitle:{ fr: 'Une sélection de nos meilleurs biens.', en: 'A curated selection of our best properties.' },
    buyTitle:        { fr: 'Biens à vendre',                        en: 'Properties for sale' },
    rentTitle:       { fr: 'Biens à louer',                         en: 'Properties for rent' },
    vacationTitle:   { fr: 'Locations de vacances',                 en: 'Vacation rentals' },
    viewAll:         { fr: 'Voir tout',                             en: 'View all' },
    contactTitle:    { fr: 'Une question ? Contactez-nous',         en: 'Any questions? Get in touch' },
    contactCta:      { fr: 'Envoyer un message',                    en: 'Send a message' },
  },

  // ─── Listing list / search page ────────────────────────────────────────────
  listings: {
    pageTitle:    { fr: 'Annonces',           en: 'Listings' },
    forSale:      { fr: 'Biens à vendre',     en: 'Properties for sale' },
    forRent:      { fr: 'Biens à louer',      en: 'Properties for rent' },
    vacation:     { fr: 'Locations vacances', en: 'Vacation rentals' },
    noResults:    { fr: 'Aucun bien trouvé.', en: 'No properties found.' },
    noResultsSub: { fr: 'Essayez de modifier vos filtres.', en: 'Try adjusting your filters.' },
    resultCount:  { fr: (n: number) => `${n} bien${n > 1 ? 's' : ''} trouvé${n > 1 ? 's' : ''}`, en: (n: number) => `${n} propert${n > 1 ? 'ies' : 'y'} found` },
  },

  // ─── Listing card ──────────────────────────────────────────────────────────
  card: {
    bedrooms:  { fr: 'ch.', en: 'bd.' },
    bathrooms: { fr: 'sdb', en: 'ba.' },
    surface:   { fr: 'm²',  en: 'm²' },
    seeMore:   { fr: 'Voir le bien',    en: 'View property' },
    priceOnRequest: { fr: 'Prix sur demande', en: 'Price on request' },
  },

  // ─── Listing detail page ───────────────────────────────────────────────────
  detail: {
    description:  { fr: 'Description',   en: 'Description' },
    amenities:    { fr: 'Équipements',   en: 'Amenities' },
    surface:      { fr: 'Surface',       en: 'Surface area' },
    bedrooms:     { fr: 'Chambres',      en: 'Bedrooms' },
    bathrooms:    { fr: 'Salles de bain',en: 'Bathrooms' },
    floor:        { fr: 'Étage',         en: 'Floor' },
    reference:    { fr: 'Référence',     en: 'Reference' },
    city:         { fr: 'Ville',         en: 'City' },
    neighborhood: { fr: 'Quartier',      en: 'Neighborhood' },
    contactAgent: { fr: 'Contacter l\'agence', en: 'Contact the agency' },
    shareTitle:   { fr: 'Partager ce bien',    en: 'Share this property' },
    backToList:   { fr: '← Retour aux annonces', en: '← Back to listings' },
    images:       { fr: 'Photos',        en: 'Photos' },
  },

  // ─── Badges / status ───────────────────────────────────────────────────────
  badge: {
    disponible: { fr: 'Disponible', en: 'Available' },
    vendu:      { fr: 'Vendu',      en: 'Sold' },
    loue:       { fr: 'Loué',       en: 'Rented' },
    reserve:    { fr: 'Réservé',    en: 'Reserved' },
    aVendre:    { fr: 'À vendre',   en: 'For sale' },
    aLouer:     { fr: 'À louer',    en: 'For rent' },
    vacances:   { fr: 'Vacances',   en: 'Vacation' },
  },

  // ─── Filters / search ──────────────────────────────────────────────────────
  filters: {
    title:        { fr: 'Filtrer',          en: 'Filter' },
    purpose:      { fr: 'Type de transaction', en: 'Transaction type' },
    city:         { fr: 'Ville',            en: 'City' },
    type:         { fr: 'Type de bien',     en: 'Property type' },
    minPrice:     { fr: 'Prix min',         en: 'Min price' },
    maxPrice:     { fr: 'Prix max',         en: 'Max price' },
    minSurface:   { fr: 'Surface min (m²)', en: 'Min area (m²)' },
    maxSurface:   { fr: 'Surface max (m²)', en: 'Max area (m²)' },
    bedrooms:     { fr: 'Chambres',         en: 'Bedrooms' },
    allCities:    { fr: 'Toutes les villes',en: 'All cities' },
    allTypes:     { fr: 'Tous les types',   en: 'All types' },
    reset:        { fr: 'Réinitialiser',    en: 'Reset' },
    apply:        { fr: 'Appliquer',        en: 'Apply' },
    searchPlaceholder: { fr: 'Rechercher un bien…', en: 'Search a property…' },
  },

  // ─── Pagination ────────────────────────────────────────────────────────────
  pagination: {
    previous: { fr: 'Précédent', en: 'Previous' },
    next:     { fr: 'Suivant',   en: 'Next' },
    page:     { fr: 'Page',      en: 'Page' },
    of:       { fr: 'sur',       en: 'of' },
  },

  // ─── Contact form ──────────────────────────────────────────────────────────
  contact: {
    pageTitle:    { fr: 'Contactez-nous',       en: 'Contact us' },
    pageSubtitle: { fr: 'Notre équipe vous répond sous 24h.', en: 'Our team replies within 24 hours.' },
    name:         { fr: 'Nom complet',          en: 'Full name' },
    namePlaceholder:  { fr: 'Votre nom',        en: 'Your name' },
    email:        { fr: 'Adresse e-mail',       en: 'Email address' },
    emailPlaceholder: { fr: 'votre@email.com',  en: 'you@email.com' },
    phone:        { fr: 'Téléphone (optionnel)',en: 'Phone (optional)' },
    phonePlaceholder: { fr: '+212 …',           en: '+212 …' },
    subject:      { fr: 'Sujet',                en: 'Subject' },
    subjectPlaceholder: { fr: 'Objet de votre message', en: 'Message subject' },
    message:      { fr: 'Message',              en: 'Message' },
    messagePlaceholder: { fr: 'Écrivez votre message ici…', en: 'Write your message here…' },
    send:         { fr: 'Envoyer',              en: 'Send' },
    sending:      { fr: 'Envoi en cours…',      en: 'Sending…' },
    successTitle: { fr: 'Message envoyé !',     en: 'Message sent!' },
    successBody:  { fr: 'Nous vous répondrons très bientôt.', en: 'We\'ll get back to you very soon.' },
    errorBody:    { fr: 'Une erreur est survenue. Veuillez réessayer.', en: 'Something went wrong. Please try again.' },
  },

  // ─── WhatsApp button ───────────────────────────────────────────────────────
  whatsapp: {
    cta: { fr: 'Discuter sur WhatsApp', en: 'Chat on WhatsApp' },
  },

  // ─── 404 / not found ───────────────────────────────────────────────────────
  notFound: {
    title:    { fr: 'Page introuvable',     en: 'Page not found' },
    subtitle: { fr: 'Ce bien n\'existe pas ou a été retiré.', en: 'This property doesn\'t exist or has been removed.' },
    cta:      { fr: 'Retour à l\'accueil', en: 'Back to home' },
  },
} satisfies Record<string, Record<string, { fr: string | ((...args: any[]) => string); en: string | ((...args: any[]) => string) }>>

/** Tiny helper — use anywhere you have `lang` from `useLanguage()` */
export function tr<T extends string | ((...args: any[]) => string)>(
  entry: { fr: T; en: T },
  lang: Lang
): T {
  return entry[lang]
}