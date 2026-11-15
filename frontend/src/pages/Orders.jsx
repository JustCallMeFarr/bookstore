import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import api, { errorMessage, rupiah } from '../api'
import { useAuth } from '../auth'
import { STATUS_LABEL, formatDate } from '../orderStatus'
import '../styles/orders.css'

// Riwayat pesanan milik user yang sedang login.
export default function Orders() {
  const { user } = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [user])

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  return (
    <div className="container order-page">
      <h1>Pesanan saya</h1>

      {error && <p className="notice error">{error}</p>}
      {!orders && !error && <p className="muted">Memuat…</p>}

      {orders && orders.length === 0 && (
        <div className="cart-empty">
          <p>Kamu belum punya pesanan.</p>
          <Link to="/#explore" className="btn">
            Mulai belanja
          </Link>
        </div>
      )}

      <div className="order-list">
        {orders?.map((o) => (
          <Link to={`/orders/${o.id}`} className="order-card" key={o.id}>
            <div className="order-card-head">
              <strong>Pesanan #{o.id}</strong>
              <span className={`status-badge st-${o.status}`}>{STATUS_LABEL[o.status]}</span>
            </div>
            <div className="order-thumbs">
              {o.items.slice(0, 5).map((i) => (
                <img key={i.id} src={i.book?.cover_url} alt={i.book?.title} />
              ))}
            </div>
            <div className="order-card-foot">
              <span className="muted">
                {formatDate(o.created_at)} · {o.items.reduce((n, i) => n + i.qty, 0)} buku
              </span>
              <strong className="price">{rupiah(o.total)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
