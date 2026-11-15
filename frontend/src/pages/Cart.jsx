import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import api, { errorMessage, rupiah } from '../api'
import { useAuth } from '../auth'
import { useCart } from '../cart'

// Halaman keranjang: lihat isi, ubah jumlah, hapus, dan total.
export default function Cart() {
  const { user } = useAuth()
  const { setCount } = useCart()
  const location = useLocation()

  const [cart, setCart] = useState(null) // { items, count, total }
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    api
      .get('/cart')
      .then((res) => setCart(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [user])

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  // Simpan respons terbaru dari API dan perbarui angka di navbar
  function apply(data) {
    setCart(data)
    setCount(data.count)
  }

  async function changeQty(item, qty) {
    setError('')
    try {
      const { data } = await api.put(`/cart/${item.id}`, { qty })
      apply(data)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function remove(item) {
    setError('')
    try {
      const { data } = await api.delete(`/cart/${item.id}`)
      apply(data)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="container cart-page">
      <h1>Keranjang</h1>

      {error && <p className="notice error">{error}</p>}
      {!cart && !error && <p className="muted">Memuat…</p>}

      {cart && cart.items.length === 0 && (
        <div className="cart-empty">
          <p>Keranjangmu masih kosong.</p>
          <Link to="/#explore" className="btn">
            Cari buku
          </Link>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <div className="cart-grid">
          <div className="cart-list">
            {cart.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <Link to={`/book/${item.book.id}`}>
                  <img src={item.book.cover_url} alt={item.book.title} />
                </Link>

                <div className="cart-info">
                  <Link to={`/book/${item.book.id}`} className="cart-title">
                    {item.book.title}
                  </Link>
                  <span className="muted">{item.book.author}</span>
                  <span className="muted">{rupiah(item.book.price)} / buku</span>
                  <button className="cart-remove" onClick={() => remove(item)}>
                    Hapus
                  </button>
                </div>

                <div className="cart-qty">
                  <button onClick={() => changeQty(item, item.qty - 1)} disabled={item.qty <= 1} aria-label="Kurangi">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => changeQty(item, item.qty + 1)}
                    disabled={item.qty >= item.book.stock}
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>

                <div className="cart-subtotal">{rupiah(item.subtotal)}</div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Ringkasan</h3>
            <div className="cart-row">
              <span>Jumlah buku</span>
              <strong>{cart.count}</strong>
            </div>
            <div className="cart-row total">
              <span>Total</span>
              <strong>{rupiah(cart.total)}</strong>
            </div>
            <Link to="/checkout" className="btn" style={{ textAlign: 'center' }}>
              Lanjut ke checkout
            </Link>
            <p className="muted small">Pembayaran: bayar di tempat (COD).</p>
          </aside>
        </div>
      )}
    </div>
  )
}
