import { artistOf, formatPrice, getArtwork } from '../data.js'
import { useCart } from '../cart.jsx'
import { useLang } from '../i18n.jsx'
import { useTitle } from '../router.js'
import Img from '../components/Img.jsx'

export function CartLines({ editable = true }) {
  const cart = useCart()
  const { lang, t } = useLang()
  return (
    <ul className="cart-list">
      {cart.items.map((id) => {
        const a = getArtwork(id)
        return (
          <li key={id}>
            <a href={`#/art/${id}`} className="thumb"><Img art={a} /></a>
            <div className="cart-info">
              <span>{artistOf(a).name}</span>
              <span className="muted"><i>{a.title[lang]}</i>, {a.year}</span>
              <span className="muted">{a.size}</span>
            </div>
            <div className="cart-right">
              <span className="nowrap">{formatPrice(a.price, lang)}</span>
              {editable && <button className="link-btn" onClick={() => cart.remove(id)}>{t('remove')}</button>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function Cart() {
  const { lang, t } = useLang()
  useTitle(t('cart'))
  const cart = useCart()

  if (cart.items.length === 0) {
    return (
      <main className="narrow center">
        <p>{t('cartEmpty')}</p>
        <a href="#/" className="u">{t('browse')}</a>
      </main>
    )
  }
  return (
    <main className="narrow">
      <h1>{t('cart')}</h1>
      <CartLines />
      <div className="sum-row total"><span>{t('total')}</span><span>{formatPrice(cart.subtotal, lang)}</span></div>
      <p className="muted small">{t('shipping')}: {t('shipCourierNote').toLowerCase()}</p>
      <div className="row-end">
        <a href="#/checkout" className="btn">{t('checkout')}</a>
      </div>
    </main>
  )
}
