import { config } from './config.js'
import { getArtwork } from './data.js'
import { useCart } from './cart.jsx'
import { LANGS, useLang } from './i18n.jsx'
import { useRoute } from './router.js'
import Catalog from './pages/Catalog.jsx'
import Artwork from './pages/Artwork.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderDone from './pages/OrderDone.jsx'
import NotFound from './pages/NotFound.jsx'
import { About, Privacy } from './pages/Info.jsx'

function Header() {
  const { count } = useCart()
  const { lang, setLang, t } = useLang()
  return (
    <header className="header">
      <a href="#/" className="logo">{config.shopName}</a>
      <nav>
        <a href="#/">{t('works')}</a>
        <a href="#/about">{t('about')}</a>
        <a href="#/cart">{t('cart')}{count > 0 && ` (${count})`}</a>
        <span className="langs">
          {LANGS.map((l) => (
            <button key={l} className={l === lang ? 'active' : ''} onClick={() => setLang(l)} aria-pressed={l === lang}>{l.toUpperCase()}</button>
          ))}
        </span>
      </nav>
    </header>
  )
}

function Toast() {
  const { toast } = useCart()
  const { lang, t } = useLang()
  if (!toast) return null
  const a = getArtwork(toast)
  return (
    <div className="toast" role="status">
      <span><i>{a.title[lang]}</i> {t('added')}</span>
      <a href="#/cart" className="u">{t('view')}</a>
    </div>
  )
}

export default function App() {
  const route = useRoute()
  const { t } = useLang()
  let page
  if (route === '/') page = <Catalog />
  else if (route.startsWith('/art/')) page = <Artwork key={route} id={route.slice(5)} />
  else if (route === '/cart') page = <Cart />
  else if (route === '/checkout') page = <Checkout />
  else if (route.startsWith('/order/')) page = <OrderDone number={route.slice(7)} />
  else if (route === '/about') page = <About />
  else if (route === '/privacy') page = <Privacy />
  else page = <NotFound />

  return (
    <>
      <Header />
      {page}
      <footer className="footer">
        <span>© {new Date().getFullYear()} {config.shopName}</span>
        <span className="footer-links">
          <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
          <a href="#/privacy">{t('privacy')}</a>
        </span>
      </footer>
      <Toast />
    </>
  )
}
