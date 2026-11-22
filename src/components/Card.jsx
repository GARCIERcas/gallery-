import Img from './Img.jsx'
import { artistOf, formatPrice } from '../data.js'
import { useLang } from '../i18n.jsx'

export default function Card({ art }) {
  const { lang, t } = useLang()
  return (
    <a href={`#/art/${art.id}`} className="card">
      <div className="frame"><Img art={art} /></div>
      <div className="meta">
        <span>{artistOf(art).name}</span>
        <span className="muted"><i>{art.title[lang]}</i>, {art.year}</span>
        <span className="muted">{art.sold ? <><span className="dot" />{t('sold')}</> : formatPrice(art.price, lang)}</span>
      </div>
    </a>
  )
}
