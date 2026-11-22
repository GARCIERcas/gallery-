// Shop settings — edit here.
export const config = {
  shopName: 'Galerie',
  contactEmail: 'hello@gallery.example',
  contactPhone: '+33 1 00 00 00 00',
  address: 'Paris, France',
  instagram: '', // e.g. 'galerie' — without @
  currency: 'EUR',
  // Endpoint that receives orders as JSON POST (e.g. a Formspree form URL).
  // Set via VITE_ORDER_ENDPOINT at build time (GitHub: Settings → Variables → ORDER_ENDPOINT).
  orderEndpoint: import.meta.env.VITE_ORDER_ENDPOINT || '',
}
