import { config } from '../config.js'
import { formatPrice } from '../data.js'
import { useTitle } from '../router.js'

export default function OrderDone({ number }) {
  useTitle('Заказ оформлен')
  let order = null
  try { order = JSON.parse(sessionStorage.getItem('gallery-last-order')) } catch {}
  if (order && order.number !== number) order = null

  return (
    <main className="narrow">
      <h1>Спасибо! Заказ №{number} принят</h1>
      <p>Мы свяжемся с вами в течение рабочего дня, чтобы подтвердить детали{order?.payment === 'Картой онлайн' ? ' и прислать ссылку на оплату' : ''}.</p>
      {order && (
        <div className="order-box">
          {order.items.map((i, n) => (
            <div key={n} className="sum-row">
              <span>{i.title}<br /><span className="muted small">{i.options} × {i.qty}</span></span>
              <span className="nowrap">{formatPrice(i.price)}</span>
            </div>
          ))}
          <div className="sum-row"><span>Доставка — {order.delivery.method}</span><span>{order.delivery.price ? formatPrice(order.delivery.price) : 'Бесплатно'}</span></div>
          <div className="sum-row total"><span>Итого</span><span>{formatPrice(order.total)}</span></div>
        </div>
      )}
      <p className="muted small">Вопросы по заказу: {config.contactEmail}, {config.contactPhone}</p>
      <a href="#/" className="btn">Вернуться в каталог</a>
    </main>
  )
}
