import { useState } from 'react'
import { config } from '../config.js'
import { artistOf, formatPrice, getArtwork, paymentMethods, shippingMethods } from '../data.js'
import { useCart } from '../cart.jsx'
import { useLang } from '../i18n.jsx'
import { navigate, useTitle } from '../router.js'
import { CartLines } from './Cart.jsx'

const orderNumber = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`
}

function Radio({ name, items, value, onChange, t }) {
  return (
    <div className="radios">
      {items.map((m) => (
        <label key={m.id} className={value === m.id ? 'radio active' : 'radio'}>
          <input type="radio" name={name} checked={value === m.id} onChange={() => onChange(m.id)} />
          <span className="radio-main">
            <span>{t(m.label)}</span>
            <span className="muted small">{t(m.note)}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

export default function Checkout() {
  const { lang, t } = useLang()
  useTitle(t('checkout'))
  const cart = useCart()
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', city: '', zip: '', street: '', comment: '' })
  const [shipping, setShipping] = useState('courier')
  const [payment, setPayment] = useState('transfer')
  const [status, setStatus] = useState('idle') // idle | sending | error | done

  if (status === 'done') return null
  if (cart.items.length === 0) {
    return (
      <main className="narrow center">
        <p>{t('cartEmpty')}</p>
        <a href="#/" className="u">{t('browse')}</a>
      </main>
    )
  }

  const ship = shippingMethods.find((s) => s.id === shipping)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const number = orderNumber()
    const items = cart.items.map((id) => {
      const a = getArtwork(id)
      return { id, artist: artistOf(a).name, title: a.title.en, year: a.year, size: a.size, price: a.price }
    })
    const address = ship.address ? [form.street, form.zip, form.city, form.country].filter(Boolean).join(', ') : ''
    const order = {
      number, lang, createdAt: new Date().toISOString(),
      customer: { name: form.name, email: form.email, phone: form.phone },
      shipping: t(ship.label), address,
      payment: t(paymentMethods.find((p) => p.id === payment).label),
      comment: form.comment, items, total: cart.subtotal, currency: config.currency,
    }
    const summary = [
      `Order ${number}`,
      ...items.map((i) => `• ${i.artist}, "${i.title}", ${i.year}, ${i.size} — ${formatPrice(i.price, 'en')}`),
      `Total: ${formatPrice(cart.subtotal, 'en')} (shipping quoted separately)`,
      `Shipping: ${order.shipping}${address ? ` — ${address}` : ''}`,
      `Payment: ${order.payment}`,
      `Customer: ${form.name}, ${form.email}, ${form.phone}`,
      form.comment && `Message: ${form.comment}`,
    ].filter(Boolean).join('\n')

    setStatus('sending')
    try {
      if (config.orderEndpoint) {
        const res = await fetch(config.orderEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ _subject: `New order ${number}`, email: form.email, message: summary, order }),
        })
        if (!res.ok) throw new Error('status ' + res.status)
      } else {
        window.location.href = `mailto:${config.contactEmail}?subject=${encodeURIComponent(`Order ${number}`)}&body=${encodeURIComponent(summary)}`
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
        <h1>{t('checkout')}</h1>

        <fieldset>
          <legend>{t('contact')}</legend>
          <input required value={form.name} onChange={set('name')} placeholder={t('name')} autoComplete="name" />
          <input required type="email" value={form.email} onChange={set('email')} placeholder={t('email')} autoComplete="email" />
          <input required type="tel" value={form.phone} onChange={set('phone')} placeholder={t('phone')} autoComplete="tel" pattern={"[0-9 +\\-\\(\\)]{6,}"} />
        </fieldset>

        <fieldset>
          <legend>{t('delivery')}</legend>
          <Radio name="shipping" items={shippingMethods} value={shipping} onChange={setShipping} t={t} />
          {ship.address && (
            <>
              <input required value={form.country} onChange={set('country')} placeholder={t('country')} autoComplete="country-name" />
              <div className="two">
                <input required value={form.city} onChange={set('city')} placeholder={t('city')} autoComplete="address-level2" />
                <input required value={form.zip} onChange={set('zip')} placeholder={t('zip')} autoComplete="postal-code" />
              </div>
              <input required value={form.street} onChange={set('street')} placeholder={t('street')} autoComplete="street-address" />
            </>
          )}
        </fieldset>

        <fieldset>
          <legend>{t('payment')}</legend>
          <Radio name="payment" items={paymentMethods} value={payment} onChange={setPayment} t={t} />
        </fieldset>

        <fieldset>
          <textarea rows="2" value={form.comment} onChange={set('comment')} placeholder={t('comment')} />
        </fieldset>

        <label className="consent">
          <input type="checkbox" required />
          <span>{t('consent')} <a href="#/privacy" className="u" target="_blank">{t('privacy')}</a>.</span>
        </label>

        {status === 'error' && <p className="error">{t('orderError')} {config.contactEmail}</p>}
        <button className="btn btn-wide" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? t('sending') : `${t('placeOrder')} · ${formatPrice(cart.subtotal, lang)}`}
        </button>
      </form>

      <aside className="summary">
        <p className="legend">{t('yourOrder')}</p>
        <CartLines editable={false} />
        <div className="sum-row"><span>{t('subtotal')}</span><span>{formatPrice(cart.subtotal, lang)}</span></div>
        <div className="sum-row"><span>{t('shipping')}</span><span>{ship.address ? t('quoted') : t('free')}</span></div>
        <div className="sum-row total"><span>{t('total')}</span><span>{formatPrice(cart.subtotal, lang)}</span></div>
      </aside>
    </main>
  )
}
