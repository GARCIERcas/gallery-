import { useState } from 'react'
import { imgSrc } from '../data.js'

export default function Img({ art, size = 's', className = '', eager = false }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={imgSrc(art, size)}
      alt={`${art.artist}, «${art.title}»`}
      width={size === 's' ? 640 : 1600}
      height={Math.round((size === 's' ? 640 : 1600) * art.ratio)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`img ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{ '--r': art.ratio, backgroundColor: art.color }}
    />
  )
}
