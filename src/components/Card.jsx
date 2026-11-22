import Img from './Img.jsx'
import { MIN_PRICE, formatPrice } from '../data.js'

export default function Card({ art }) {
  return (
    <a href={`#/art/${art.id}`} className="card">
      <div className="frame"><Img art={art} /></div>
      <div className="meta">
        <div>
          <div>{art.title}</div>
          <div className="muted">{art.artist}</div>
        </div>
        <span className="nowrap">от {formatPrice(MIN_PRICE)}</span>
      </div>
    </a>
  )
}
