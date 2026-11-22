import { useEffect } from 'react'
import { imgSrc } from '../data.js'

export default function Lightbox({ art, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-label={art.title}>
      <img src={imgSrc(art, 'l')} alt={art.title} />
      <button className="lightbox-close" aria-label="Закрыть">×</button>
    </div>
  )
}
