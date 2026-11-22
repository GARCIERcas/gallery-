import { config } from '../config.js'
import { formatPrice } from '../data.js'
import { useLang } from '../i18n.jsx'
import { useTitle } from '../router.js'

export default function OrderDone({ number }) {
  const { lang, t } = useLang()
  useTitle(t('thanks'))
  let order = null
  try { order = JSON.parse(sessionStorage.getItem('gallery-last-order')) } catch {}
  if (order && order.number !== number) order = null

  return (
    <main className="narrow">
      <h1>{t('thanks')}</h1>
      <p>{t('orderReceived', { n: number })}. {t('orderText')}</p>
      {order && (
        <div className="order-box">
          {order.items.map((i) => (
            <div key={i.id} className="sum-row">
              <span>{i.artist}, <i>{i.title}</i>, {i.year}</span>
              <span className="nowrap">{formatPrice(i.price, lang)}</span>
            </div>
          ))}
          <div className="sum-row total"><span>{t('total')}</span><span>{formatPrice(order.total, lang)}</span></div>
        </div>
      )}
      <p className="muted small">{t('questions')}: <a className="u" href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></p>
      <a href="#/" className="u">{t('back')}</a>
    </main>
  )
}
