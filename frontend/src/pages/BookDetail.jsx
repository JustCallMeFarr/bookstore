import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { errorMessage, rupiah } from '../api'
import { useAuth } from '../auth'
import { useCart } from '../cart'
import '../styles/reader.css'

// Halaman satu buku.
//  - "Tambah ke keranjang": harus login, jumlah dibatasi stok
//  - "Baca online": aktif kalau buku punya ebook_file
export default function BookDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { add } = useCart()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState(null) // { type: 'ok' | 'error', text }
  const [adding, setAdding] = useState(false)

  async function addToCart() {
    // belum login -> ke halaman masuk, lalu kembali ke buku ini
    if (!user) {
      navigate('/login', { state: { from: `/book/${id}` } })
      return
    }
    setAdding(true)
    setInfo(null)
    try {
      const data = await add(book.id)
      setInfo({ type: 'ok', text: data.message, cart: true })
    } catch (err) {
      setInfo({ type: 'error', text: errorMessage(err) })
    } finally {
      setAdding(false)
    }
  }

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [id])

  if (error) return <p className="status-line error">{error}</p>
  if (!book) return <p className="status-line">Memuat…</p>

  return (
    <div className="container detail">
      <Link to="/#explore" className="back">
        ← Kembali
      </Link>

      <div className="detail-grid">
        <img className="detail-cover" src={book.cover_url} alt={book.title} />

        <div>
          {book.category && <span className="badge">{book.category.name}</span>}
          <h1>{book.title}</h1>
          <p className="muted">oleh {book.author}</p>
          <p className="detail-synopsis">{book.synopsis}</p>
          <p className="price big">{rupiah(book.price)}</p>
          <p className="muted">Stok: {book.stock}</p>

          <div className="detail-actions">
            <button className="btn" onClick={addToCart} disabled={adding || book.stock < 1}>
              {book.stock < 1 ? 'Stok habis' : adding ? 'Menambahkan…' : 'Tambah ke keranjang'}
            </button>

            {book.ebook_file ? (
              <Link to={`/read/${book.id}`} className="btn btn-ghost">
                Baca online
              </Link>
            ) : (
              <button className="btn btn-ghost btn-off" disabled title="Buku ini belum punya versi baca online">
                Baca online · belum tersedia
              </button>
            )}
          </div>
          {info && (
            <p className={`notice ${info.type}`}>
              {info.text}{' '}
              {info.cart && (
                <Link to="/cart" style={{ fontWeight: 600 }}>
                  Lihat keranjang →
                </Link>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
