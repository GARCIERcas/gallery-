export const artworks = [
  { id: 'tishina', title: 'Тишина', year: 2024, medium: 'Холст, масло', size: '80 × 100 см', price: 48000, style: 'fields', ratio: 1.25, palette: ['#e9e4da', '#c9b8a3', '#8c6f5a', '#3b2f2a'] },
  { id: 'poludennoe-solnce', title: 'Полуденное солнце', year: 2024, medium: 'Холст, акрил', size: '70 × 70 см', price: 36000, style: 'circle', ratio: 1, palette: ['#efe9dd', '#d9572b', '#1f1f1f'] },
  { id: 'liniya-gorizonta', title: 'Линия горизонта', year: 2023, medium: 'Холст, масло', size: '120 × 80 см', price: 64000, style: 'horizon', ratio: 0.667, palette: ['#d6dde0', '#9fb1b8', '#3d5560', '#f2e7cf'], sold: true },
  { id: 'ritm', title: 'Ритм', year: 2025, medium: 'Бумага, тушь', size: '50 × 70 см', price: 22000, style: 'lines', ratio: 1.4, palette: ['#f3f0e8', '#1c1c1c'] },
  { id: 'konstrukciya', title: 'Конструкция №3', year: 2025, medium: 'Холст, акрил', size: '90 × 90 см', price: 52000, style: 'arcs', ratio: 1, palette: ['#ece6d8', '#24408e', '#e3b23c', '#c4442f', '#1c1c1c'] },
  { id: 'osen', title: 'Осень', year: 2023, medium: 'Холст, масло', size: '60 × 80 см', price: 41000, style: 'fields', ratio: 1.333, palette: ['#e8d9c4', '#c46a3a', '#7a2e1f', '#2b1d18'] },
  { id: 'arhitektura', title: 'Архитектура', year: 2025, medium: 'Холст, акрил', size: '80 × 100 см', price: 55000, style: 'blocks', ratio: 1.25, palette: ['#efebe3', '#1c1c1c', '#b9b2a6', '#c4442f'] },
  { id: 'luna', title: 'Луна над морем', year: 2024, medium: 'Холст, масло', size: '100 × 70 см', price: 58000, style: 'circle', ratio: 0.7, palette: ['#1d2430', '#e8e1cf', '#3a4a5c'] },
  { id: 'dyhanie', title: 'Дыхание', year: 2025, medium: 'Бумага, акварель', size: '40 × 50 см', price: 18000, style: 'lines', ratio: 1.25, palette: ['#f1ede4', '#5f7f75'], sold: true },
  { id: 'polden', title: 'Полдень', year: 2025, medium: 'Холст, масло', size: '100 × 100 см', price: 72000, style: 'horizon', ratio: 1, palette: ['#f0e3c4', '#e5a85a', '#a65a2e', '#fbf3e0'] },
  { id: 'dialog', title: 'Диалог', year: 2024, medium: 'Холст, акрил', size: '60 × 80 см', price: 34000, style: 'arcs', ratio: 1.333, palette: ['#f0ece4', '#1c1c1c', '#b3412e', '#d7cdb9', '#1c1c1c'] },
  { id: 'glubina', title: 'Глубина', year: 2025, medium: 'Холст, масло', size: '90 × 120 см', price: 86000, style: 'fields', ratio: 1.333, palette: ['#20303a', '#2f4f5e', '#6b8b95', '#d8d3c7'] },
]

export const formatPrice = (n) => n.toLocaleString('ru-RU') + ' ₽'
export const getArtwork = (id) => artworks.find((a) => a.id === id)
