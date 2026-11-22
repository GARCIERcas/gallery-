import { config } from '../config.js'
import { useLang } from '../i18n.jsx'
import { useTitle } from '../router.js'

export function About() {
  const { t } = useLang()
  useTitle(t('aboutTitle'))
  return (
    <main className="narrow prose">
      {t('aboutText').map((p, i) => <p key={i}>{p}</p>)}
      <h2>{t('shippingTitle')}</h2>
      {t('shippingText').map((p, i) => <p key={i}>{p}</p>)}
      <h2>{t('contact')}</h2>
      <p>
        <a className="u" href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a><br />
        {config.contactPhone}<br />
        {config.address}
        {config.instagram && <><br /><a className="u" href={`https://instagram.com/${config.instagram}`}>Instagram</a></>}
      </p>
    </main>
  )
}

export function Privacy() {
  const { t } = useLang()
  useTitle(t('privacyTitle'))
  return (
    <main className="narrow prose">
      <h1>{t('privacyTitle')}</h1>
      {t('privacyText').map((p, i) => <p key={i}>{p}</p>)}
      <p><a className="u" href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></p>
    </main>
  )
}
