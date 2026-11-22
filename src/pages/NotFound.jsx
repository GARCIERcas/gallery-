import { useLang } from '../i18n.jsx'
import { useTitle } from '../router.js'

export default function NotFound() {
  const { t } = useLang()
  useTitle(t('notFound'))
  return (
    <main className="narrow center">
      <h1>{t('notFound')}</h1>
      <a href="#/" className="u">{t('back')}</a>
    </main>
  )
}
