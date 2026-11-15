import { useEffect, useState } from 'react'
import api from '../../api'

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, books: 0, users: 0, messages: 0, unread: 0, orders: 0, newOrders: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/books'),
      api.get('/admin/users'),
      api.get('/admin/messages'),
      api.get('/admin/orders'),
    ])
      .then(([c, b, u, m, o]) =>
        setStats({
          categories: c.data.length,
          books: b.data.length,
          users: u.data.length,
          messages: m.data.length,
          unread: m.data.filter((x) => !x.is_read).length,
          orders: o.data.length,
          newOrders: o.data.filter((x) => x.status === 'pending').length,
        })
      )
      .catch(() => {})
  }, [])

  const cards = [
    ['Kategori', stats.categories],
    ['Buku', stats.books],
    ['Pengguna', stats.users],
    ['Total pesanan', stats.orders],
    ['Pesanan menunggu', stats.newOrders],
    ['Pesan belum dibaca', stats.unread],
  ]

  return (
    <>
      <h2>Ringkasan</h2>
      <div className="stat-grid">
        {cards.map(([label, value]) => (
          <div className="stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </>
  )
}
