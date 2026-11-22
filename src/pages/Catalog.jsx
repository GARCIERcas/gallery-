import { artworks } from '../data.js'
import { useTitle } from '../router.js'
import Card from '../components/Card.jsx'

export default function Catalog() {
  useTitle('')
  return (
    <main>
      <section className="grid">
        {artworks.map((a) => <Card key={a.id} art={a} />)}
      </section>
    </main>
  )
}
