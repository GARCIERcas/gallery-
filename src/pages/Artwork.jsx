import { useCallback, useState } from 'react'
import { artworks, frames, formatPrice, getArtwork, materials, priceOf, sizeLabel, sizes, themes } from '../data.js'
import { useCart } from '../cart.jsx'
import { useTitle } from '../router.js'
import Img from '../components/Img.jsx'
import Card from '../components/Card.jsx'
import Lightbox from '../components/Lightbox.jsx'
import NotFound from './NotFound.jsx'

function Options({ label, items, value, onChange, render }) {
  return (
    <div className="option">
      <div className="option-label">{label}</div>
      <div className="seg">
        {items.map((it) => (
          <button key={it.id} className={value === it.id ? 'seg-btn active' : 'seg-btn'} onClick={() => onChange(it.id)}>
            {render ? render(it) : it.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Artwork({ id }) {
  const art = getArtwork(id)
  useTitle(art ? `${art.title}, ${art.artist}` : 'Не найдено')
  const cart = useCart()
  const [material, setMaterial] = useState('paper')
  const [size, setSize] = useState('m')
  const [frame, setFrame] = useState('none')
  const [zoom, setZoom] = useState(false)
  const closeZoom = useCallback(() => setZoom(false), [])

  if (!art) return <NotFound />

  const opt = { id: art.id, material, size, frame }
  const price = priceOf(opt)
  const sameArtist = artworks.filter((a) => a.artist === art.artist && a.id !== art.id)
  const related = [...sameArtist, ...artworks.filter((a) => a.theme === art.theme && a.artist !== art.artist)].slice(0, 4)

  return (
    <main>
      <div className="detail">
        <button className="detail-art" onClick={() => setZoom(true)} aria-label="Увеличить">
          <Img art={art} size="l" eager />
          <span className="zoom-hint">Увеличить</span>
        </button>

        <div className="detail-info">
          <a href="#/" className="back">← Каталог</a>
          <div>
            <h1>{art.title}</h1>
            <p className="artist">{art.artist}, {art.year}</p>
          </div>
          <p className="desc">{art.description}</p>

          <Options label="Материал" items={materials} value={material} onChange={setMaterial} />
          <p className="hint">{materials.find((m) => m.id === material).note}</p>
          <Options label="Размер" items={sizes} value={size} onChange={setSize}
            render={(s) => <><b>{s.label}</b><small>{sizeLabel(art, s.id)}</small></>} />
          {material === 'paper' && <Options label="Рама" items={frames} value={frame} onChange={setFrame} />}

          <div className="buy">
            <span className="price">{formatPrice(price)}</span>
            <button className="btn" onClick={() => cart.add(opt)}>В корзину</button>
          </div>

          <dl className="specs">
            <dt>Оригинал</dt><dd>{art.original}, масло</dd>
            <dt>Жанр</dt><dd>{themes[art.theme]}</dd>
            <dt>Изготовление</dt><dd>3–5 рабочих дней</dd>
            <dt>Доставка</dt><dd>По России, бесплатно от 10 000 ₽. <a href="#/delivery" className="u">Подробнее</a></dd>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>{sameArtist.length ? 'Ещё работы' : 'Похожие работы'}</h2>
          <div className="grid grid-4">
            {related.map((a) => <Card key={a.id} art={a} />)}
          </div>
        </section>
      )}

      {zoom && <Lightbox art={art} onClose={closeZoom} />}
    </main>
  )
}
