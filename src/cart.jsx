import { createContext, useContext, useEffect, useState } from 'react'
import { getArtwork } from './data.js'

const CartContext = createContext(null)
const KEY = 'gallery-cart-v3'

const valid = (id) => { const a = getArtwork(id); return a && !a.sold }

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(v) ? v.filter(valid) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [toast, setToast] = useState(null)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {} }, [items])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const value = {
    items,
    count: items.length,
    subtotal: items.reduce((n, id) => n + getArtwork(id).price, 0),
    has: (id) => items.includes(id),
    add: (id) => { if (!valid(id)) return; setItems((s) => (s.includes(id) ? s : [...s, id])); setToast(id) },
    remove: (id) => setItems((s) => s.filter((x) => x !== id)),
    clear: () => setItems([]),
    toast,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
