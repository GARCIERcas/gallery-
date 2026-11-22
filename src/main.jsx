import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './cart.jsx'
import { LangProvider } from './i18n.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LangProvider>
  </React.StrictMode>
)
