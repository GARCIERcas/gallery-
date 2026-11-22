import { useTitle } from '../router.js'

export default function NotFound() {
  useTitle('Страница не найдена')
  return (
    <main className="narrow center">
      <h1>Страница не найдена</h1>
      <a href="#/" className="btn">В каталог</a>
    </main>
  )
}
