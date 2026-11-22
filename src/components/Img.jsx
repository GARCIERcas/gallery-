import { useState } from 'react'
import { artistOf, imgSrc } from '../data.js'
import { useLang } from '../i18n.jsx'

export default function Img({ art, size = 's', eager = false }) {
  const { lang } = useLang()
  const [loaded, setLoaded] = useState(false)
  const W = size === 's' ? 640 : 1400
  return (
    <img
      src={imgSrc(art, size)}
      alt={`${artistOf(art).name}, ${art.title[lang]}`}
      width={W}
      height={Math.round(W * art.ratio)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={loaded ? 'img is-loaded' : 'img'}
      style={{ '--r': art.ratio }}
    />
  )
}
