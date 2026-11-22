import { artworks } from './artworks.js'

export { artworks }

export const themes = {
  landscape: 'Пейзаж',
  sea: 'Море',
  city: 'Город',
  portrait: 'Портрет',
  still: 'Натюрморт',
  interior: 'Интерьер',
}

export const artists = [...new Set(artworks.map((a) => a.artist))].sort((a, b) => a.localeCompare(b, 'ru'))

// Длинная сторона отпечатка, см
export const sizes = [
  { id: 's', label: 'S', long: 40 },
  { id: 'm', label: 'M', long: 60 },
  { id: 'l', label: 'L', long: 80 },
  { id: 'xl', label: 'XL', long: 100 },
]

export const materials = [
  { id: 'paper', label: 'Бумага', note: 'Музейная печать гикле на хлопковой бумаге 310 г/м²' },
  { id: 'canvas', label: 'Холст', note: 'Печать на хлопковом холсте, натянут на деревянный подрамник 2 см' },
]

export const frames = [
  { id: 'none', label: 'Без рамы' },
  { id: 'black', label: 'Чёрная' },
  { id: 'white', label: 'Белая' },
  { id: 'oak', label: 'Дуб' },
]

const PRICES = {
  paper: { s: 2900, m: 4900, l: 7900, xl: 11900 },
  canvas: { s: 4900, m: 7900, l: 11900, xl: 16900 },
}
const FRAME_PRICES = { s: 2500, m: 3500, l: 4900, xl: 6900 }

export const MIN_PRICE = PRICES.paper.s

export function priceOf({ material, size, frame }) {
  let p = PRICES[material][size]
  if (material === 'paper' && frame && frame !== 'none') p += FRAME_PRICES[size]
  return p
}

export function sizeLabel(art, sizeId) {
  const s = sizes.find((x) => x.id === sizeId)
  const r = art.ratio // h / w
  const w = r > 1 ? Math.round(s.long / r) : s.long
  const h = r > 1 ? s.long : Math.round(s.long * r)
  return `${w} × ${h} см`
}

export function optionLabel(art, { material, size, frame }) {
  const parts = [materials.find((m) => m.id === material).label, sizeLabel(art, size)]
  if (material === 'paper' && frame !== 'none') parts.push('рама: ' + frames.find((f) => f.id === frame).label.toLowerCase())
  return parts.join(', ')
}

export const deliveryMethods = [
  { id: 'courier-msk', label: 'Курьер по Москве', note: '1–2 дня после изготовления', price: 390, address: true },
  { id: 'cdek-pvz', label: 'СДЭК — пункт выдачи', note: 'по России, 2–7 дней', price: 450, address: true },
  { id: 'cdek-door', label: 'СДЭК — курьер до двери', note: 'по России, 2–7 дней', price: 790, address: true },
  { id: 'pickup', label: 'Самовывоз', note: 'Москва, по договорённости', price: 0, address: false },
]
export const FREE_DELIVERY_FROM = 10000

export function deliveryPrice(methodId, subtotal) {
  const m = deliveryMethods.find((d) => d.id === methodId)
  if (!m) return 0
  return subtotal >= FREE_DELIVERY_FROM ? 0 : m.price
}

export const paymentMethods = [
  { id: 'online', label: 'Картой онлайн', note: 'Пришлём ссылку на оплату после подтверждения заказа' },
  { id: 'on-delivery', label: 'При получении', note: 'Картой или наличными курьеру / в пункте выдачи' },
]

export const formatPrice = (n) => n.toLocaleString('ru-RU') + ' ₽'
export const getArtwork = (id) => artworks.find((a) => a.id === id)

const base = import.meta.env.BASE_URL
export const imgSrc = (art, size = 's') => `${base}art/${art.id}-${size}.webp`
