import { useState } from 'react'
import { config } from '../config.js'
import { deliveryMethods, deliveryPrice, formatPrice, getArtwork, optionLabel, paymentMethods, priceOf } from '../data.js'
import { useCart } from '../cart.jsx'
import { navigate, useTitle } from '../router.js'
import { CartLines } from './Cart.jsx'

const orderNumber = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`
}

function Radio({ name, items, value, onChange, extra }) {
  return (
    <div className="radios">
      {items.map((m) => (
        <label key={m.id} className={value === m.id ? 'radio active' : 'radio'}>
          <input type="radio" name={name} value={m.id} checked={value === m.id} onChange={() => onChange(m.id)} />
          <span className="radio-main">
            <span>{m.label}</span>
            <span className="muted small">{m.note}</span>
          </span>
          {extra && <span className="nowrap">{extra(m)}</span>}
        </label>
      ))}
    </div>
  )
}

export default function Checkout() {
  useTitle('Оформление заказа')
  const cart = useCart()
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', address: '', comment: '' })
  const [delivery, setDelivery] = useState('cdek-pvz')
  const [payment, setPayment] = useState('online')
  const [status, setStatus] = useState('idle') // idle | sending | error | done

  if (status === 'done') return null
  if (cart.items.length === 0) {
    return (
      <main className="narrow center">
        <h1>Корзина пуста</h1>
        <a href="#/" className="btn">В каталог</a>
      </main>
    )
  }

  const method = deliveryMethods.find((d) => d.id === delivery)
  const shipping = deliveryPrice(delivery, cart.subtotal)
  const total = cart.subtotal + shipping
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const number = orderNumber()
    const items = cart.items.map((i) => {
      const a = getArtwork(i.id)
      return { title: `${a.title} — ${a.artist}`, options: optionLabel(a, i), qty: i.qty, price: priceOf(i) * i.qty }
    })
    const order = {
      number,
      createdAt: new Date().toISOString(),
      customer: { name: form.name, phone: form.phone, email: form.email },
      delivery: { method: method.label, city: method.address ? form.city : '', address: method.address ? form.address : '', price: shipping },
      payment: paymentMethods.find((p) => p.id === payment).label,
      comment: form.comment,
      items,
      subtotal: cart.subtotal,
      total,
    }
    const summary = [
      `Заказ №${number}`,
      ...items.map((i) => `• ${i.title} (${i.options}) × ${i.qty} = ${formatPrice(i.price)}`),
      `Доставка: ${order.delivery.method}${order.delivery.city ? `, ${order.delivery.city}, ${order.delivery.address}` : ''} — ${formatPrice(shipping)}`,
      `Оплата: ${order.payment}`,
      `Итого: ${formatPrice(total)}`,
      `Покупатель: ${form.name}, ${form.phone}, ${form.email}`,
      form.comment && `Комментарий: ${form.comment}`,
    ].filter(Boolean).join('\n')

    setStatus('sending')
    try {
      if (config.orderEndpoint) {
        const res = await fetch(config.orderEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ _subject: `Новый заказ №${number}`, email: form.email, message: summary, order }),
        })
        if (!res.ok) throw new Error('bad status ' + res.status)
      } else {
        // Без настроенного приёма заказов открываем почтовый клиент с готовым письмом
        window.location.href = `mailto:${config.contactEmail}?subject=${encodeURIComponent(`Заказ №${number}`)}&body=${encodeURIComponent(summary)}`
      }
      try { sessionStorage.setItem('gallery-last-order', JSON.stringify(order)) } catch {}
      setStatus('done')
      navigate(`/order/${number}`)
      cart.clear()
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="checkout-page">
      <form className="checkout" onSubmit={submit}>
        <a href="#/cart" className="back">← Корзина</a>
        <h1>Оформление заказа</h1>

        <fieldset>
          <legend>Контакты</legend>
          <input required value={form.name} onChange={set('name')} placeholder="Имя и фамилия" autoComplete="name" />
          <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="Телефон" autoComplete="tel" pattern={"[0-9 +\\-\\(\\)]{10,}"} title="Например, +7 900 123-45-67" />
          <input required type="email" value={form.email} onChange={set('email')} placeholder="Email" autoComplete="email" />
        </fieldset>

        <fieldset>
          <legend>Доставка</legend>
          <Radio name="delivery" items={deliveryMethods} value={delivery} onChange={setDelivery}
            extra={(m) => (deliveryPrice(m.id, cart.subtotal) ? formatPrice(m.price) : 'Бесплатно')} />
          {method.address && (
            <>
              <input required value={form.city} onChange={set('city')} placeholder="Город" autoComplete="address-level2" />
              <input required value={form.address} onChange={set('address')}
                placeholder={delivery === 'cdek-pvz' ? 'Адрес пункта выдачи СДЭК' : 'Улица, дом, квартира'} autoComplete="street-address" />
            </>
          )}
        </fieldset>

        <fieldset>
          <legend>Оплата</legend>
          <Radio name="payment" items={paymentMethods} value={payment} onChange={setPayment} />
        </fieldset>

        <fieldset>
          <legend>Комментарий</legend>
          <textarea rows="3" value={form.comment} onChange={set('comment')} placeholder="Пожелания к заказу (необязательно)" />
        </fieldset>

        <label className="consent">
          <input type="checkbox" required />
          <span>Согласен на обработку персональных данных в соответствии с <a href="#/privacy" className="u" target="_blank">политикой конфиденциальности</a></span>
        </label>

        {status === 'error' && (
          <p className="error">Не удалось отправить заказ. Попробуйте ещё раз или напишите нам: {config.contactEmail}</p>
        )}
        <button className="btn btn-wide" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Отправляем…' : `Подтвердить заказ · ${formatPrice(total)}`}
        </button>
      </form>

      <aside className="summary">
        <h2>Ваш заказ</h2>
        <CartLines editable={false} />
        <div className="sum-row"><span>Товары</span><span>{formatPrice(cart.subtotal)}</span></div>
        <div className="sum-row"><span>Доставка</span><span>{shipping ? formatPrice(shipping) : 'Бесплатно'}</span></div>
        <div className="sum-row total"><span>Итого</span><span>{formatPrice(total)}</span></div>
      </aside>
    </main>
  )
}
