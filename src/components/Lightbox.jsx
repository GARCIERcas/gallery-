import { useEffect } from 'react'
import { imgSrc } from '../data.js'
import { useLang } from '../i18n.jsx'

export default function Lightbox({ art, onClose }) {
  const { lang, t } = useLang()
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
    <div className="lightbox" onClick={onClose} role="dialog" aria-label={art.title[lang]}>
      <img src={imgSrc(art, 'l')} alt={art.title[lang]} />
      <button className="lightbox-close" aria-label={t('close')}>×</button>
    </div>
  )
}
