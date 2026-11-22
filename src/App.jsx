import { useEffect, useState } from 'react'
import { artworks, formatPrice, getArtwork } from './data.js'
import { useCart } from './cart.jsx'
import Painting from './components/Painting.jsx'

function useHashRoute() {
  const get = () => window.location.hash.replace(/^#/, '') || '/'
  const [route, setRoute] = useState(get)
  useEffect(() => {
    const on = () => { setRoute(get()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

function Header() {
  const { items } = useCart()
  return (
    <header className="header">
      <a href="#/" className="logo">Галерея</a>
      <nav>
        <a href="#/">Работы</a>
        <a href="#/about">О галерее</a>
        <a href="#/cart">Корзина{items.length > 0 && <sup>{items.length}</sup>}</a>
      </nav>
    </header>
  )
}

function Gallery() {
  return (
    <main>
      <section className="intro">
        <h1>Оригинальные работы современных художников</h1>
        <p>Каждая картина существует в единственном экземпляре.</p>
      </section>
      <section className="grid">
        {artworks.map((a) => (
          <a key={a.id} href={`#/art/${a.id}`} className="card">
            <div className="frame"><Painting art={a} className="art" /></div>
            <div className="meta">
              <span>{a.title}</span>
              <span className={a.sold ? 'muted' : ''}>{a.sold ? 'Продано' : formatPrice(a.price)}</span>
            </div>
          </a>
        ))}
      </section>
    </main>
  )
}

function Detail({ id }) {
  const art = getArtwork(id)
  const cart = useCart()
  if (!art) return <NotFound />
  const inCart = cart.has(art.id)
  return (
    <main className="detail">
      <div className="detail-art"><Painting art={art} className="art" /></div>
      <div className="detail-info">
        <a href="#/" className="back">← Все работы</a>
        <h1>{art.title}</h1>
        <dl>
          <dt>Год</dt><dd>{art.year}</dd>
          <dt>Техника</dt><dd>{art.medium}</dd>
          <dt>Размер</dt><dd>{art.size}</dd>
        </dl>
        <p className="price">{art.sold ? 'Продано' : formatPrice(art.price)}</p>
        {!art.sold && (
          inCart ? (
            <a href="#/cart" className="btn btn-ghost">В корзине — оформить</a>
          ) : (
            <button className="btn" onClick={() => cart.add(art.id)}>Добавить в корзину</button>
          )
        )}
        <p className="note">Доставка по России бесплатно. Работа поставляется с сертификатом подлинности.</p>
      </div>
    </main>
  )
}

function Cart() {
  const cart = useCart()
  const list = cart.items.map(getArtwork).filter(Boolean)
  const total = list.reduce((s, a) => s + a.price, 0)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <main className="narrow center">
        <h1>Спасибо за заказ</h1>
        <p className="muted">Мы свяжемся с вами в течение дня, чтобы подтвердить детали доставки.</p>
        <a href="#/" className="btn">Вернуться в галерею</a>
      </main>
    )
  }

  if (list.length === 0) {
    return (
      <main className="narrow center">
        <h1>Корзина пуста</h1>
        <a href="#/" className="btn">Смотреть работы</a>
      </main>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    cart.clear()
    setDone(true)
  }

  return (
    <main className="narrow">
      <h1>Корзина</h1>
      <ul className="cart-list">
        {list.map((a) => (
          <li key={a.id}>
            <a href={`#/art/${a.id}`} className="thumb"><Painting art={a} className="art" /></a>
            <div className="cart-info">
              <a href={`#/art/${a.id}`}>{a.title}</a>
              <span className="muted">{a.medium}, {a.size}</span>
            </div>
            <span>{formatPrice(a.price)}</span>
            <button className="link" onClick={() => cart.remove(a.id)} aria-label="Удалить">×</button>
          </li>
        ))}
      </ul>
      <div className="total"><span>Итого</span><span>{formatPrice(total)}</span></div>

      <form className="checkout" onSubmit={submit}>
        <h2>Оформление</h2>
        <input required placeholder="Имя" autoComplete="name" />
        <input required type="email" placeholder="Email" autoComplete="email" />
        <input required type="tel" placeholder="Телефон" autoComplete="tel" />
        <input required placeholder="Адрес доставки" autoComplete="street-address" />
        <button className="btn" type="submit">Оформить заказ</button>
      </form>
    </main>
  )
}

function About() {
  return (
    <main className="narrow">
      <h1>О галерее</h1>
      <p>Мы собираем небольшую коллекцию живописи и графики — спокойной, честной и сделанной руками.</p>
      <p>Все работы оригинальные и продаются в единственном экземпляре. Мы упаковываем каждую картину вручную и доставляем бесплатно по всей России.</p>
      <p className="muted">hello@gallery.art</p>
    </main>
  )
}

function NotFound() {
  return (
    <main className="narrow center">
      <h1>Страница не найдена</h1>
      <a href="#/" className="btn">В галерею</a>
    </main>
  )
}

export default function App() {
  const route = useHashRoute()
  let page
  if (route === '/') page = <Gallery />
  else if (route.startsWith('/art/')) page = <Detail id={route.slice(5)} />
  else if (route === '/cart') page = <Cart />
  else if (route === '/about') page = <About />
  else page = <NotFound />

  return (
    <>
      <Header />
      {page}
      <footer className="footer">© {new Date().getFullYear()} Галерея</footer>
    </>
  )
}
