import { createContext, useContext, useEffect, useState } from 'react'
import { getArtwork, priceOf } from './data.js'

const CartContext = createContext(null)
const KEY = 'gallery-cart-v2'

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(v) ? v.filter((i) => getArtwork(i.id)) : []
  } catch {
    return []
  }
}

export const itemKey = ({ id, material, size, frame }) => [id, material, size, material === 'paper' ? frame : 'none'].join(':')

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
  }, [items])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const add = (opt) => {
    const item = { ...opt, frame: opt.material === 'paper' ? opt.frame : 'none' }
    const key = itemKey(item)
    setItems((s) => {
      const found = s.find((i) => i.key === key)
      if (found) return s.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + 1, 10) } : i))
      return [...s, { ...item, key, qty: 1 }]
    })
    setToast(getArtwork(item.id).title)
  }
  const setQty = (key, qty) =>
    setItems((s) => (qty <= 0 ? s.filter((i) => i.key !== key) : s.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 10) } : i))))
  const remove = (key) => setItems((s) => s.filter((i) => i.key !== key))
  const clear = () => setItems([])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((n, i) => n + priceOf(i) * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, count, subtotal, add, setQty, remove, clear, toast }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
