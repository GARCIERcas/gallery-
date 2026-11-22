import { useCallback, useState } from 'react'
import { artistOf, artworks, formatPrice, getArtwork } from '../data.js'
import { useCart } from '../cart.jsx'
import { useLang } from '../i18n.jsx'
import { useTitle } from '../router.js'
import Img from '../components/Img.jsx'
import Lightbox from '../components/Lightbox.jsx'
import NotFound from './NotFound.jsx'

export default function Artwork({ id }) {
  const art = getArtwork(id)
  const { lang, t } = useLang()
  const cart = useCart()
  const [zoom, setZoom] = useState(false)
  const closeZoom = useCallback(() => setZoom(false), [])
  useTitle(art ? `${art.title[lang]} — ${artistOf(art).name}` : t('notFound'))
  if (!art) return <NotFound />

  const artist = artistOf(art)
  const i = artworks.indexOf(art)
  const prev = artworks[(i - 1 + artworks.length) % artworks.length]
  const next = artworks[(i + 1) % artworks.length]

  return (
    <main className="detail">
      <button className="detail-art" onClick={() => setZoom(true)} aria-label={t('zoom')}>
        <Img art={art} size="l" eager />
      </button>

      <div className="detail-info">
        <div>
          <p>{artist.name} <span className="muted">({artist.country[lang]}, {artist.born})</span></p>
          <h1><i>{art.title[lang]}</i>, {art.year}</h1>
        </div>
        <p className="muted">
          {art.medium[lang]}<br />
          {art.size}<br />
          {t('unique')}
        </p>
        {art.sold ? (
          <p><span className="dot" />{t('sold')}</p>
        ) : (
          <div className="buy">
            <span>{formatPrice(art.price, lang)}</span>
            {cart.has(art.id)
              ? <a href="#/cart" className="btn btn-ghost">{t('inCart')}</a>
              : <button className="btn" onClick={() => cart.add(art.id)}>{t('addToCart')}</button>}
          </div>
        )}
        <p className="muted small note">{t('certificate')}</p>
        <nav className="pager">
          <a href={`#/art/${prev.id}`}>← {t('prev')}</a>
          <a href="#/">{t('allWorks')}</a>
          <a href={`#/art/${next.id}`}>{t('next')} →</a>
        </nav>
      </div>

      {zoom && <Lightbox art={art} onClose={closeZoom} />}
    </main>
  )
}
