import { FREE_DELIVERY_FROM, formatPrice, getArtwork, optionLabel, priceOf } from '../data.js'
import { useCart } from '../cart.jsx'
import { useTitle } from '../router.js'
import Img from '../components/Img.jsx'

export function CartLines({ editable = true }) {
  const cart = useCart()
  return (
    <ul className="cart-list">
      {cart.items.map((i) => {
        const a = getArtwork(i.id)
        return (
          <li key={i.key}>
            <a href={`#/art/${a.id}`} className="thumb"><Img art={a} /></a>
            <div className="cart-info">
              <a href={`#/art/${a.id}`}>{a.title}</a>
              <span className="muted">{a.artist}</span>
              <span className="muted">{optionLabel(a, i)}</span>
            </div>
            {editable ? (
              <div className="qty">
                <button onClick={() => cart.setQty(i.key, i.qty - 1)} aria-label="Меньше">−</button>
                <span>{i.qty}</span>
                <button onClick={() => cart.setQty(i.key, i.qty + 1)} aria-label="Больше">+</button>
              </div>
            ) : (
              <span className="muted">{i.qty} шт.</span>
            )}
            <span className="nowrap line-price">{formatPrice(priceOf(i) * i.qty)}</span>
            {editable && <button className="link" onClick={() => cart.remove(i.key)} aria-label="Удалить">×</button>}
          </li>
        )
      })}
    </ul>
  )
}

export default function Cart() {
  useTitle('Корзина')
  const cart = useCart()

  if (cart.items.length === 0) {
    return (
      <main className="narrow center">
        <h1>Корзина пуста</h1>
        <p className="muted">Выберите картину в каталоге.</p>
        <a href="#/" className="btn">В каталог</a>
      </main>
    )
  }

  const left = FREE_DELIVERY_FROM - cart.subtotal
  return (
    <main className="narrow wide">
      <h1>Корзина</h1>
      <CartLines />
      <div className="total"><span>Итого</span><span>{formatPrice(cart.subtotal)}</span></div>
      <p className="muted small">
        {left > 0 ? `До бесплатной доставки — ${formatPrice(left)}` : 'Доставка бесплатно'}
      </p>
      <div className="row-end">
        <a href="#/" className="btn btn-ghost">Продолжить покупки</a>
        <a href="#/checkout" className="btn">Оформить заказ</a>
      </div>
    </main>
  )
}
