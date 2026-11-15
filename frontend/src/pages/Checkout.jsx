import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import api, { errorMessage, rupiah } from '../api'
import { useAuth } from '../auth'
import { useCart } from '../cart'
import '../styles/orders.css'

// Checkout: isi data pengiriman lalu konfirmasi pesanan.
// Pembayaran: bayar di tempat (COD), jadi cukup konfirmasi.
export default function Checkout() {
  const { user } = useAuth()
  const { setCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [cart, setCart] = useState(null)
  const [form, setForm] = useState({ recipient: user?.name ?? '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!user) return
    api
      .get('/cart')
      .then((res) => setCart(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [user])

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const { data } = await api.post('/orders', form)
      setCount(0) // keranjang sudah dikosongkan oleh backend
      navigate(`/orders/${data.id}`, { state: { justOrdered: true } })
    } catch (err) {
      setError(errorMessage(err))
      setSending(false)
    }
  }

  return (
    <div className="container order-page">
      <h1>Checkout</h1>

      {!cart && !error && <p className="muted">Memuat…</p>}

      {cart && cart.items.length === 0 && (
        <div className="cart-empty">
          <p>Keranjangmu kosong, belum ada yang bisa dipesan.</p>
          <Link to="/#explore" className="btn">
            Cari buku
          </Link>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <form className="checkout-grid" onSubmit={submit}>
          <div className="form panel">
            <h3>Data pengiriman</h3>
            <div className="form-2">
              <label>
                Nama penerima
                <input value={form.recipient} onChange={set('recipient')} required />
              </label>
              <label>
                No. telepon / WhatsApp
                <input value={form.phone} onChange={set('phone')} required />
              </label>
            </div>
            <label>
              Alamat lengkap
              <textarea
                rows="4"
                value={form.address}
                onChange={set('address')}
                placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos"
                required
                minLength={10}
              />
            </label>

            <h3>Pembayaran</h3>
            <label className="pay-option">
              <input type="radio" checked readOnly />
              <span>
                <strong>Bayar di tempat (COD)</strong>
                <small className="muted">Bayar tunai saat buku diterima. Tidak ada pembayaran online.</small>
              </span>
            </label>
          </div>

          <aside className="cart-summary">
            <h3>Pesananmu</h3>
            {cart.items.map((item) => (
              <div className="sum-item" key={item.id}>
                <span>
                  {item.book.title} <small className="muted">× {item.qty}</small>
                </span>
                <span>{rupiah(item.subtotal)}</span>
              </div>
            ))}
            <div className="cart-row total">
              <span>Total</span>
              <strong>{rupiah(cart.total)}</strong>
            </div>
            {error && <p className="notice error">{error}</p>}
            <button className="btn" disabled={sending}>
              {sending ? 'Memproses…' : 'Konfirmasi pesanan'}
            </button>
            <Link to="/cart" className="muted small">
              ← Kembali ke keranjang
            </Link>
          </aside>
        </form>
      )}
    </div>
  )
}
