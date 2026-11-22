import { useEffect, useMemo, useState } from 'react'
import { artworks, artists, themes } from '../data.js'
import { useTitle } from '../router.js'
import Card from '../components/Card.jsx'

const KEY = 'gallery-filters'
const initial = () => {
  try { return { theme: '', artist: '', ...JSON.parse(sessionStorage.getItem(KEY)) } } catch { return { theme: '', artist: '' } }
}

export default function Catalog() {
  useTitle('')
  const [f, setF] = useState(initial)
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(f)) } catch {} }, [f])

  const list = useMemo(
    () => artworks.filter((a) => (!f.theme || a.theme === f.theme) && (!f.artist || a.artist === f.artist)),
    [f]
  )

  return (
    <main>
      <section className="intro">
        <h1>Репродукции великих картин в музейном качестве</h1>
        <p>Печать гикле на хлопковой бумаге и холсте. Изготовим за 3–5 дней и доставим по всей России.</p>
      </section>

      <div className="filters">
        <div className="chips">
          <button className={!f.theme ? 'chip active' : 'chip'} onClick={() => setF({ ...f, theme: '' })}>Все</button>
          {Object.entries(themes).map(([id, label]) => (
            <button key={id} className={f.theme === id ? 'chip active' : 'chip'} onClick={() => setF({ ...f, theme: id })}>{label}</button>
          ))}
        </div>
        <select value={f.artist} onChange={(e) => setF({ ...f, artist: e.target.value })} aria-label="Художник">
          <option value="">Все художники</option>
          {artists.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {list.length ? (
        <section className="grid">
          {list.map((a) => <Card key={a.id} art={a} />)}
        </section>
      ) : (
        <p className="empty muted">
          Ничего не нашлось. <button className="link-inline" onClick={() => setF({ theme: '', artist: '' })}>Сбросить фильтры</button>
        </p>
      )}
    </main>
  )
}
