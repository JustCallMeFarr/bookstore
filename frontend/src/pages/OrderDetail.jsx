import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import api, { errorMessage, rupiah } from '../api'
import { useAuth } from '../auth'
import { PAYMENT_LABEL, STATUS_LABEL, formatDate } from '../orderStatus'
import '../styles/orders.css'

// Detail satu pesanan. Pesanan yang masih "menunggu diproses" bisa dibatalkan.
export default function OrderDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const justOrdered = location.state?.justOrdered

  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!user) return
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [id, user])

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  async function cancel() {
    if (!confirm('Batalkan pesanan ini?')) return
    setCancelling(true)
    setError('')
    try {
      const { data } = await api.put(`/orders/${id}/cancel`)
      setOrder(data)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="container order-page">
      <Link to="/orders" className="back">
        ← Semua pesanan
      </Link>

      {justOrdered && (
        <p className="notice ok">Pesanan berhasil dibuat. Terima kasih! Bayar tunai saat buku sampai.</p>
      )}
      {error && <p className="notice error">{error}</p>}
      {!order && !error && <p className="muted">Memuat…</p>}

      {order && (
        <>
          <div className="order-title">
            <h1>Pesanan #{order.id}</h1>
            <span className={`status-badge st-${order.status}`}>{STATUS_LABEL[order.status]}</span>
          </div>
          <p className="muted">Dibuat {formatDate(order.created_at)}</p>

          <div className="order-detail-grid">
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Buku</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <div className="order-book">
                          <img src={i.book?.cover_url} alt="" />
                          <span>
                            <strong>{i.book?.title ?? '(buku dihapus)'}</strong>
                            <br />
                            <span className="muted">{i.book?.author}</span>
                          </span>
                        </div>
                      </td>
                      <td>{rupiah(i.price)}</td>
                      <td>{i.qty}</td>
                      <td>{rupiah(i.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="order-total">
                Total <strong>{rupiah(order.total)}</strong>
              </p>
            </div>

            <aside className="cart-summary">
              <h3>Pengiriman</h3>
              <p className="pre">{order.address}</p>
              <h3>Pembayaran</h3>
              <p>
                <strong>Bayar di tempat (COD)</strong>
                <br />
                <span className={order.payment_status === 'paid' ? 'paid' : 'muted'}>
                  {PAYMENT_LABEL[order.payment_status]}
                </span>
              </p>
              {order.status === 'pending' && (
                <button className="btn btn-danger" onClick={cancel} disabled={cancelling}>
                  {cancelling ? 'Membatalkan…' : 'Batalkan pesanan'}
                </button>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
