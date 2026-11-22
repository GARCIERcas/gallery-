// Настройки магазина. Меняйте здесь.
export const config = {
  shopName: 'Галерея',
  contactEmail: 'hello@gallery.example',
  contactPhone: '+7 (900) 000-00-00',
  telegram: '', // например 'gallery_shop' — без @
  // URL для приёма заказов (POST JSON). Например, форма Formspree: https://formspree.io/f/xxxxxxx
  // Задаётся переменной VITE_ORDER_ENDPOINT при сборке (в GitHub: Settings → Variables → ORDER_ENDPOINT).
  orderEndpoint: import.meta.env.VITE_ORDER_ENDPOINT || '',
}
