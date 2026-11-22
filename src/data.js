import { artists, artworks } from './artworks.js'
import { config } from './config.js'

export { artists, artworks }

export const getArtwork = (id) => artworks.find((a) => a.id === id)
export const artistOf = (art) => artists[art.artist]

export const formatPrice = (n, lang) =>
  new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { style: 'currency', currency: config.currency, maximumFractionDigits: 0 }).format(n)

const base = import.meta.env.BASE_URL
export const imgSrc = (art, size = 's') => `${base}art/${art.id}-${size}.webp`

export const shippingMethods = [
  { id: 'courier', label: 'shipCourier', note: 'shipCourierNote', address: true },
  { id: 'pickup', label: 'shipPickup', note: 'shipPickupNote', address: false },
]
export const paymentMethods = [
  { id: 'transfer', label: 'payTransfer', note: 'payTransferNote' },
  { id: 'card', label: 'payCard', note: 'payCardNote' },
]
