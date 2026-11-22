import { config } from './config.js'
import { useCart } from './cart.jsx'
import { useRoute } from './router.js'
import Catalog from './pages/Catalog.jsx'
import Artwork from './pages/Artwork.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderDone from './pages/OrderDone.jsx'
import NotFound from './pages/NotFound.jsx'
import { About, Delivery, Privacy } from './pages/Info.jsx'

function Header() {
  const { count } = useCart()
  return (
    <header className="header">
      <a href="#/" className="logo">{config.shopName}</a>
      <nav>
        <a href="#/">Каталог</a>
        <a href="#/delivery" className="hide-sm">Доставка</a>
        <a href="#/about" className="hide-sm">О нас</a>
        <a href="#/cart">Корзина{count > 0 && <sup>{count}</sup>}</a>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#/delivery">Доставка и оплата</a>
        <a href="#/about">О галерее</a>
        <a href="#/privacy">Конфиденциальность</a>
        <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
      </div>
      <div>© {new Date().getFullYear()} {config.shopName}. Изображения: Art Institute of Chicago, CC0.</div>
    </footer>
  )
}

function Toast() {
  const { toast } = useCart()
  if (!toast) return null
  return (
    <div className="toast" role="status">
      «{toast}» в корзине <a href="#/cart" className="u">Перейти</a>
    </div>
  )
}

export default function App() {
  const route = useRoute()
  let page
  if (route === '/') page = <Catalog />
  else if (route.startsWith('/art/')) page = <Artwork key={route} id={route.slice(5)} />
  else if (route === '/cart') page = <Cart />
  else if (route === '/checkout') page = <Checkout />
  else if (route.startsWith('/order/')) page = <OrderDone number={route.slice(7)} />
  else if (route === '/delivery') page = <Delivery />
  else if (route === '/about') page = <About />
  else if (route === '/privacy') page = <Privacy />
  else page = <NotFound />

  return (
    <>
      <Header />
      {page}
      <Footer />
      <Toast />
    </>
  )
}
